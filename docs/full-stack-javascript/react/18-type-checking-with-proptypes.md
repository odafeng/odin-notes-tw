---
title: 用 PropTypes 做型別檢查
source_url: https://www.theodinproject.com/lessons/node-path-react-new-type-checking-with-proptypes
source_file: vendor/curriculum/react/the_react_ecosystem/type_checking_with_proptypes.md
path: full-stack-javascript
course: React
order: 18
generated: 2026-07-03
---

# 用 PropTypes 做型別檢查

> 改寫自 The Odin Project：[Type Checking With PropTypes](https://www.theodinproject.com/lessons/node-path-react-new-type-checking-with-proptypes)
> ｜Full Stack JavaScript › React › The React Ecosystem

## 核心概念

### 什麼是型別檢查（type checking）

型別檢查（type checking）是一種驗證程式碼是否使用了正確資料型別的過程，檢查的對象包含變數、函式參數與回傳值。JavaScript 本身是動態型別語言，你可以把一個字串塞進原本預期是數字的變數，程式在執行到出錯的那一刻之前都不會抱怨。這種彈性很方便，但也很容易埋下難以察覺的 bug。

在 React 的世界裡，component（元件）之間最主要的溝通方式就是 props（屬性）。當一個 component 期待收到某種型別的 prop，實際卻收到別的型別時，畫面可能悄悄壞掉，卻不會拋出明確的錯誤。**PropTypes** 就是 React 生態系中用來為 props 做型別檢查的工具：它讓你宣告「這個 component 期待哪些 prop、每個 prop 應該是什麼型別、哪些是必填」，一旦傳進來的值不符合宣告，React 就會在瀏覽器的開發者主控台（console）印出警告，幫你在開發階段就抓到潛在的型別錯誤。

如果你先前在 React 專案裡用過 linter，很可能被它念過「某個 prop 缺少 prop validation（屬性驗證）」，那正是在提醒你替 props 補上型別宣告。

### 為什麼要用它

PropTypes 帶來的價值主要有三點：

- **提早發現錯誤**：型別不符會在開發時就以警告形式出現，不必等到畫面出問題才回頭 debug。
- **當作文件**：一份 `propTypes` 宣告等於清楚寫明「這個 component 接受哪些 prop」，別人（或未來的你）閱讀時一目了然。
- **提高信心**：搭配 `isRequired`，你能確保關鍵資料一定會被傳入，減少「忘記傳 prop」造成的空白畫面。

要特別強調的是：PropTypes 的檢查**只發生在開發模式（development mode）**，正式打包（production build）後這些檢查會被移除，也不會拖慢執行速度。它是「開發時的護欄」，而不是執行時強制的型別系統。

### React 版本的重要提醒

!!! danger "PropTypes 與 defaultProps 在 React 19 已被移除"
    從 **React 19** 開始，官方已經把 `propTypes` 與 `defaultProps`（用於 function component）正式移除。若你想照本課練習使用 PropTypes，請把專案的 React 版本鎖在 **18 以下**。做法是在 `package.json` 中把以下四個套件的版本改成 `"^18"`，再重新 `npm install`：`react`、`react-dom`、`@types/react`、`@types/react-dom`。

換句話說，PropTypes 是理解「型別檢查」這個概念的絕佳教材，但在最新版 React 中，社群已改以 TypeScript 或函式的預設參數來達成同樣目的。本課的重點是讓你先掌握「在 React 裡對 props 做型別檢查」這個心智模型，工具本身則視版本而定。

### 安裝與匯入

PropTypes 不再內建於 React，需要另外安裝獨立套件 `prop-types`。在 React 專案目錄中執行：

```bash
npm install --save prop-types
```

接著在想要驗證 props 的那個 component 檔案頂端匯入它：

```javascript
import PropTypes from 'prop-types';
```

### 基本用法

使用方式很直觀：在 component 定義完之後，替它掛上一個 `propTypes` 物件，物件的每個 key 對應一個 prop 名稱，value 則是該 prop 應有的型別描述。

```jsx
import PropTypes from 'prop-types';

const RenderName = (props) => {
  return <div>{props.name}</div>;
};

RenderName.propTypes = {
  name: PropTypes.string,
};

export default RenderName;
```

在這個例子裡，`RenderName` 期待收到一個叫 `name`、型別為字串的 prop。如果實際傳進來的 `name` 不是字串（例如傳了數字），React 就會在 console 印出一則警告，但畫面仍會照常 render（渲染），因為 PropTypes 只是提醒，不會中斷程式。

### 用 isRequired 標記必填

型別正確還不夠，有時你想確保某個 prop「一定要被傳進來」。在型別後面接上 `.isRequired` 即可：

```javascript
RenderName.propTypes = {
  name: PropTypes.string.isRequired,
};
```

這樣一來，若呼叫 `RenderName` 時完全沒有傳 `name`，或傳了 `undefined`，就會觸發警告。`isRequired` 可以接在任何型別後面。

### 常用的驗證型別

PropTypes 提供豐富的驗證器（validator），以下是最常用的一批：

- `PropTypes.string`：字串
- `PropTypes.number`：數字
- `PropTypes.bool`：布林值
- `PropTypes.func`：函式
- `PropTypes.array`：陣列
- `PropTypes.object`：物件
- `PropTypes.symbol`：Symbol
- `PropTypes.node`：任何可被 render 的內容（數字、字串、element 或它們組成的陣列）
- `PropTypes.element`：一個 React element（元素）
- `PropTypes.any`：任意型別（等於不限制，通常搭配 `isRequired` 用來確保有值）

除了單一型別，還有幾個「組合型」驗證器，能描述更精細的結構：

- `PropTypes.oneOf(['News', 'Photos'])`：限制值只能是列舉中的其中一個（enum）
- `PropTypes.oneOfType([PropTypes.string, PropTypes.number])`：允許多種型別之一
- `PropTypes.arrayOf(PropTypes.number)`：某型別組成的陣列
- `PropTypes.objectOf(PropTypes.number)`：value 都是某型別的物件
- `PropTypes.shape({ name: PropTypes.string, age: PropTypes.number })`：指定物件應有的欄位與各自型別
- `PropTypes.instanceOf(Message)`：必須是某個 class 的實例

### 提供預設值：defaultProps 與預設參數

在 React 18 以前，可以搭配 `defaultProps` 為 prop 指定預設值：

```jsx
import PropTypes from 'prop-types';

const RenderName = (props) => {
  return <div>{props.name}</div>;
};

RenderName.propTypes = {
  name: PropTypes.string,
};

RenderName.defaultProps = {
  name: 'Zach',
};

export default RenderName;
```

上面替 `name` 定義了預設值 `'Zach'`。當呼叫 `RenderName` 卻沒傳 `name` 時，就會採用預設值 `"Zach"`；一旦有傳入，傳入的值會蓋過預設值（傳入的 props 優先）。

要注意：如同前面提醒的，`defaultProps` 對 function component 而言在 React 19 已被移除。現代寫法建議直接用 **JavaScript 的預設參數（default parameter）** 來達成同樣效果，這種寫法與 React 版本無關：

```jsx
const RenderName = ({ name = 'Zach' }) => {
  return <div>{name}</div>;
};
```

### 自訂驗證器（custom validator）

當內建型別無法滿足需求時，PropTypes 允許你傳入一個函式當作自訂驗證器。這個函式會收到整包 props、目前檢查的 prop 名稱與 component 名稱，若驗證失敗就回傳一個 `Error` 物件（不要用 `throw`）：

```jsx
Greeting.propTypes = {
  email: (props, propName, componentName) => {
    if (!/^[^@]+@[^@]+$/.test(props[propName])) {
      return new Error(
        `傳給 ${componentName} 的 ${propName} 不是合法的 email 格式。`
      );
    }
  },
};
```

### PropTypes 與 TypeScript 的關係

你可能聽過 **TypeScript**：一個建立在 JavaScript 之上的強型別語言。它與 PropTypes 都在解決「型別安全」的問題，但層次不同。PropTypes 是**執行時（runtime）**在開發模式下做檢查，只會印警告；TypeScript 則是在**編譯時（compile time）**就攔截型別錯誤，涵蓋範圍遠不只 props，而且有完整的編輯器提示。

現代 production 專案多半直接採用 TypeScript，React 官方也因此在 19 版移除了 PropTypes。不過對現階段的你來說，最好的準備是先把 JavaScript 基本功練扎實。TypeScript 文件本身也建議：先熟悉 JavaScript，再處理 TypeScript 的複雜度。等未來真的要學 TypeScript，一個好方法是拿舊專案，把 component 逐一重構成 TypeScript。本課的目標則單純聚焦在「型別檢查」這個概念上。

## 程式碼範例

以下是一個較完整、可執行的範例（需在 React 18 專案並安裝 `prop-types`），示範多種驗證器與必填、預設值的組合：

```jsx
// UserCard.jsx
import PropTypes from 'prop-types';

// 用預設參數提供 role 的預設值，取代已被移除的 defaultProps
const UserCard = ({ name, age, role = 'guest', hobbies }) => {
  return (
    <div className="user-card">
      <h2>{name}（{role}）</h2>
      <p>年齡：{age}</p>
      <ul>
        {hobbies.map((hobby) => (
          <li key={hobby}>{hobby}</li>
        ))}
      </ul>
    </div>
  );
};

UserCard.propTypes = {
  // name 必填、必須是字串
  name: PropTypes.string.isRequired,
  // age 必填、必須是數字
  age: PropTypes.number.isRequired,
  // role 只能是這三個字串之一
  role: PropTypes.oneOf(['admin', 'guest', 'member']),
  // hobbies 必須是「字串組成的陣列」，且必填
  hobbies: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default UserCard;
```

使用時：

```jsx
// App.jsx
import UserCard from './UserCard';

const App = () => {
  return (
    <UserCard
      name="小明"
      age={28}
      role="member"
      hobbies={['閱讀', '爬山']}
    />
  );
};

export default App;
```

如果你不小心寫成 `age="28"`（字串而非數字），或把 `role` 傳成 `"superuser"`（不在列舉內），瀏覽器的 console 就會出現對應的 PropTypes 警告，提醒你哪個 prop 型別不對，但畫面仍會照常 render。

## 常見陷阱

!!! warning "PropTypes 只在開發模式警告，不會阻止程式執行"
    型別不符時，PropTypes 只會在 console 印出一則警告，component 依然會照常 render。它不是像 TypeScript 那樣的強制型別系統，也不會在正式版（production build）中執行檢查。別把它當成執行時的資料驗證機制，例如處理使用者輸入或 API 回應時，仍需自己寫防呆邏輯。

!!! warning "React 19 已移除 propTypes 與 defaultProps"
    在 React 19 裡，掛在 component 上的 `propTypes` 會被直接忽略、不再生效，`defaultProps`（function component）也被移除。若要照本課練習，請把 React 鎖在 18 版；若在新版專案，改用預設參數提供預設值，並考慮以 TypeScript 取代型別檢查。

!!! warning "忘了裝 prop-types 或忘了加 isRequired"
    `prop-types` 是獨立套件，沒先 `npm install --save prop-types` 就 import 會報找不到模組。另外，只寫 `PropTypes.string` 而沒加 `.isRequired` 時，完全不傳該 prop 並不會觸發警告——因為 `undefined` 對「非必填」而言是允許的。要強制傳入，記得補上 `.isRequired`。

## 練習

1. 打開 React 官方（legacy）的 PropTypes 文件，瀏覽它列出的所有可用型別與進階用法。文件裡會建議在現代 React 用 TypeScript 取代 PropTypes——這對 production app 而言確實成立，但本課只在乎「型別檢查」這個概念，TypeScript 暫時不在範圍內。
2. PropTypes 也能設定自訂驗證器（custom validator）。找一篇深入介紹 PropTypes 好處與使用情境的完整指南（例如 LogRocket 的〈Validating React Props with PropTypes〉），了解自訂驗證器的寫法與實務用途。
3. 閱讀比較 PropTypes 與 TypeScript 的討論（例如 Stack Overflow 上關於兩者差異的問答），釐清它們在「型別安全」上各自扮演的角色與取捨。
4. （project）本課無獨立專案，請延續你先前的 React 練習，挑一個既有 component，替它的 props 補上完整的 `propTypes` 宣告與必要的 `isRequired`，並用預設參數為選填的 prop 加上預設值。詳細規劃請回到原文的 Assignment 區塊確認。

自我檢核：

- 如何為一個 component 建立最基本的 PropTypes 設定？
- 若某個 prop 已定義預設值（defaultProps 或預設參數），呼叫時又傳入該 prop，會發生什麼事？
- PropTypes 與 TypeScript 的差別是什麼？

## 原文與延伸資源

- 原文：[Type Checking With PropTypes](https://www.theodinproject.com/lessons/node-path-react-new-type-checking-with-proptypes)
- 本課引用：
  - `prop-types` 套件（npm 上的獨立套件，需自行安裝）
  - React（legacy）官方文件〈Typechecking With PropTypes〉，列出所有內建驗證器
  - LogRocket〈Validating React Props with PropTypes〉：PropTypes 完整指南與自訂驗證器
  - Stack Overflow：PropTypes 與 TypeScript 在 React 專案中的差異討論
  - React 19 升級說明（propTypes 與 defaultProps 的移除）

---

> 本講義改寫自 The Odin Project《Type Checking With PropTypes》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
