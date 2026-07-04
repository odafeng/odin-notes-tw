---
title: 在元件間傳遞資料（Props）
source_url: https://www.theodinproject.com/lessons/node-path-react-new-passing-data-between-components
source_file: vendor/curriculum/react/getting_started_with_react/passing_data_between_components.md
path: full-stack-javascript
course: React
order: 6
generated: 2026-07-03
---

# 在元件間傳遞資料（Props）

> 改寫自 The Odin Project：[Passing Data Between Components](https://www.theodinproject.com/lessons/node-path-react-new-passing-data-between-components)
> ｜Full Stack JavaScript › React › Getting Started With React

## 核心概念

你已經知道 React 的威力來自「可重用的 component（元件）」。但很快就會遇到一個問題：如果每個 component 都是寫死的，那它其實只能長成同一個樣子。真正好用的 component，應該像一個函式——你每次呼叫它、傳進不同的參數，它就回傳不同的結果。在 React 裡，這個「傳進去的參數」就叫做 **props**（properties，屬性）。這一課要學的，就是如何用 props 在 component 之間傳遞資料，讓同一個 component 能依需求變出各種變化。

### 資料在 React 中的流向

在 React 中，資料是透過 props 從 **parent component（父元件）傳給 child component（子元件）**。這個傳遞是 **單向（unidirectional）** 的，意思是資料只會往一個方向流動——由上往下。

這個限制很重要，值得停下來理解：child 收到的資料，改動它時只會影響「有用到這份資料的 child」，而 **不會回頭去改變 parent，也不會影響到平行的 sibling（兄弟元件）**。這種「資料只能往下流」的設計，讓我們對資料的走向有明確的掌控——當畫面出問題時，你可以順著資料的來源一路往上追，而不必擔心某個角落的 component 偷偷改了別人的狀態。這種可預測性，正是 React 能穩定支撐大型應用的關鍵之一。

（先記住這個原則：**parent → child，單向**。至於「child 要怎麼把訊息傳回 parent」，答案是「parent 把一個 function 當成 prop 傳下去給 child 呼叫」，本課最後會談到。）

### 為什麼需要 props：從重複的程式碼說起

先看一個沒有 props 的 `Button` component，它在 `App` 裡被渲染（render）了三次：

```jsx
function Button() {
  return (
    <button>Click Me!</button>
  );
}

export default function App() {
  return (
    <div>
      <Button />
      <Button />
      <Button />
    </div>
  );
}
```

看起來不錯——一個可重用的按鈕，想用幾次就用幾次。但問題來了：如果我希望「第二顆按鈕」的文字是「Don't Click Me!」怎麼辦？

在沒有 props 的世界裡，你只能再寫一個 component：

```jsx
function Button() {
  return (
    <button>Click Me!</button>
  );
}

function Button2() {
  return (
    <button>Don't Click Me!</button>
  );
}

export default function App() {
  return (
    <div>
      <Button />
      <Button2 />
      <Button />
    </div>
  );
}
```

現在只是文字不同就要多開一個 component，看起來還能忍。但想像一下：如果有 10 顆按鈕，每顆的文字、字型、顏色、大小都不一樣呢？照這個做法，你會為每種變化各開一個 component，程式碼很快就會出現大量重複——這正是我們要避免的。

### 用 props 讓一個 component 應付所有變化

props 的作用，就是把「會變的部分」抽出來，交由使用者在渲染時傳入。這樣一來，一個 `Button` 就能應付任意數量的變化：

```jsx
function Button(props) {
  const buttonStyle = {
    color: props.color,
    fontSize: props.fontSize + 'px'
  };

  return (
    <button style={buttonStyle}>{props.text}</button>
  );
}

export default function App() {
  return (
    <div>
      <Button text="Click Me!" color="blue" fontSize={12} />
      <Button text="Don't Click Me!" color="red" fontSize={12} />
      <Button text="Click Me!" color="blue" fontSize={20} />
    </div>
  );
}
```

這裡有幾個重點：

- `Button` 這個 functional component 現在接收一個 `props` 參數。component 內部透過 `props.屬性名稱`（例如 `props.text`、`props.color`）來取用個別的值。
- 在 `App` 裡渲染 `Button` 時，這些 prop 的值以「類似 HTML 屬性」的寫法定義在每個 component 上（`text="..."`、`color="..."`）。
- component 依據傳入的值動態產生 inline style（行內樣式），再套用到 `button` 元素上。

值得注意寫法上的一個細節：`fontSize={12}` 用的是大括號 `{}`，因為 `12` 是一個 JavaScript 數字；而 `text="Click Me!"` 用的是引號，因為它是字串。**傳字串以外的值（數字、布林、物件、變數、function）時，都要用大括號包起來。**

### prop destructuring（解構）

在 React 程式碼裡，你會非常頻繁地看到一種寫法：直接在 component 的參數位置把 props「解構（destructuring）」出來。這麼做可以少寫很多 `props.`，讓程式碼更精簡、更好讀：

```jsx
function Button({ text, color, fontSize }) {
  const buttonStyle = {
    color: color,
    fontSize: fontSize + "px"
  };

  return <button style={buttonStyle}>{text}</button>;
}

export default function App() {
  return (
    <div>
      <Button text="Click Me!" color="blue" fontSize={12} />
      <Button text="Don't Click Me!" color="red" fontSize={12} />
      <Button text="Click Me!" color="blue" fontSize={20} />
    </div>
  );
}
```

注意 component 內部從此直接用 `text`、`color`、`fontSize`，不再需要加 `props.` 前綴。這只是 JavaScript 的物件解構語法用在函式參數上，功能與前一版完全相同，但可讀性更好。往後本課的範例都會採用這種解構寫法。

### default props（預設值）

回頭看上面的例子，你會發現在 `App` 裡定義 prop 時有不少重複——很多按鈕的 `color` 都是 `"blue"`、`fontSize` 都是 `12`。為了不再重複這些常見的值，同時也為了保護程式免於收到 `undefined`（呼叫端忘了傳某個 prop 時），我們可以用 **預設參數（default parameters）** 為 prop 設定預設值：

```jsx
function Button({ text = "Click Me!", color = "blue", fontSize = 12 }) {
  const buttonStyle = {
    color: color,
    fontSize: fontSize + "px"
  };

  return <button style={buttonStyle}>{text}</button>;
}

export default function App() {
  return (
    <div>
      <Button />
      <Button text="Don't Click Me!" color="red" />
      <Button fontSize={20} />
    </div>
  );
}
```

現在，只有當某個 prop 的值「和預設值不同」時，才需要在渲染時特別傳入。第一顆 `<Button />` 完全沒傳，就採用全部預設值；第二顆只覆寫 `text` 和 `color`；第三顆只覆寫 `fontSize`。這正是解構搭配預設值的寫法——它其實就是 JavaScript 原生的函式預設參數語法。

你可能還會在某些程式碼裡看到 `defaultProps` 這種寫法。它過去被用來設定 prop 的預設值，尤其常見於 class component（類別元件）：

```jsx
function Button({ text, color, fontSize }) {
  const buttonStyle = {
    color: color,
    fontSize: fontSize + "px"
  };

  return <button style={buttonStyle}>{text}</button>;
}

Button.defaultProps = {
  text: "Click Me!",
  color: "blue",
  fontSize: 12
};

export default function App() {
  return (
    <div>
      <Button />
      <Button text="Don't Click Me!" color="red" />
      <Button fontSize={20} />
    </div>
  );
}
```

不過要注意：React 現在對於 function component 已經 **不再支援** `defaultProps` 這種寫法（官方建議改用上面的預設參數）。但認識 `defaultProps` 仍然有用——當你維護 class component 或閱讀較舊的程式碼時，還是會遇到它。

### 把 function 當成 prop 傳遞

props 不只能傳變數，也能傳 **function**。這是一個非常重要的模式，因為它正是「child 能反過來觸發 parent 行為」的關鍵手法。看下面的例子：

```jsx
function Button({ text = "Click Me!", color = "blue", fontSize = 12, handleClick }) {
  const buttonStyle = {
    color: color,
    fontSize: fontSize + "px"
  };

  return (
    <button onClick={handleClick} style={buttonStyle}>
      {text}
    </button>
  );
}

export default function App() {
  const handleButtonClick = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <div>
      <Button handleClick={handleButtonClick} />
    </div>
  );
}
```

這裡發生的事：

- function `handleButtonClick` 定義在 parent（`App`）裡。
- 我們把這個 function 的「參照（reference）」當成 `handleClick` prop 的值傳給 `Button`。
- `Button` 收到後，把它接到 `button` 的 `onClick` 事件上，當使用者點擊時就會被呼叫。

有兩個容易踩到的細節：

**第一，傳遞時只傳「參照」，不要加括號。** 我們寫的是 `handleClick={handleButtonClick}`，而不是 `handleClick={handleButtonClick()}`。如果加了括號，這個 function 會在 `Button` 渲染的當下「立刻被呼叫」，而不是等到點擊時才執行——這幾乎一定不是你要的結果。

**第二，如果要在點擊時帶參數呼叫 function，需要用一個匿名函式包起來。** 假設我們想改造 function，讓每顆按鈕能導向不同網址：

```jsx
function Button({ text = "Click Me!", color = "blue", fontSize = 12, handleClick }) {
  const buttonStyle = {
    color: color,
    fontSize: fontSize + "px"
  };

  return (
    <button onClick={handleClick} style={buttonStyle}>
      {text}
    </button>
  );
}

export default function App() {
  const handleButtonClick = (url) => {
    window.location.href = url;
  };

  return (
    <div>
      <Button handleClick={() => handleButtonClick('https://www.theodinproject.com')} />
    </div>
  );
}
```

要帶參數時，不能直接寫 `onClick={handleClick('https://www.theodinproject.com')}`（同樣會在渲染時就被呼叫）。正確做法是傳入一個 **匿名函式** `() => handleButtonClick('...')`：這個匿名函式本身只是被「準備好」放著，直到點擊事件真正發生時，React 才會執行它，它內部才去呼叫 `handleButtonClick` 並帶入參數。

!!! note "延伸：curried function（柯里化函式）"
    要達成「帶參數的事件處理」還有其他寫法，其中一種是使用 curried function（柯里化函式）。這裡先知道有這個選項即可，等你更熟悉 function 之後再深入。

到這裡，你應該能體會 props 對於「撰寫可重用、可客製化的 React component」有多麼關鍵。不過這還只是 React 的冰山一角，繼續往下一課前進，會學到更多。

## 程式碼範例

下面是一個整合了本課多數概念的最小可執行範例：一個 `Greeting` component，同時示範「傳字串 prop」「解構」「預設值」，以及「把 function 當 prop 傳遞並帶參數呼叫」。

```jsx
// Greeting.jsx
// 用解構取出 props，並為 name 設定預設值
function Greeting({ name = "訪客", onGreet }) {
  return (
    <div>
      <p>你好，{name}！</p>
      {/* 用匿名函式包起來，才能在點擊時帶參數呼叫 parent 的 function */}
      <button onClick={() => onGreet(name)}>跟我打招呼</button>
    </div>
  );
}

export default function App() {
  // 這個 function 定義在 parent，透過 prop 傳給 child
  const handleGreet = (who) => {
    alert(`${who} 向你揮手了 👋`);
  };

  return (
    <div>
      {/* 傳入 name（字串）與 onGreet（function 的參照） */}
      <Greeting name="Odin" onGreet={handleGreet} />
      {/* 不傳 name，會自動採用預設值「訪客」 */}
      <Greeting onGreet={handleGreet} />
    </div>
  );
}
```

觀察重點：第一個 `Greeting` 顯示「你好，Odin！」，第二個沒傳 `name`，就落回預設值顯示「你好，訪客！」。兩者共用同一個 `handleGreet`，但因為在 `onClick` 用了 `() => onGreet(name)` 包裝，各自點擊時會帶入自己的 `name`。

## 常見陷阱

!!! warning "把 function 當 prop 傳遞時多加了括號"
    傳遞 function 時要傳「參照」，不要加括號：
    ```jsx
    // 錯：handleButtonClick 會在渲染當下立刻執行
    <Button handleClick={handleButtonClick()} />

    // 對：只傳參照，等事件觸發才執行
    <Button handleClick={handleButtonClick} />
    ```
    若需要帶參數，請用匿名函式包起來：`handleClick={() => handleButtonClick('...')}`。直接寫 `handleButtonClick('...')` 一樣會在渲染時就被呼叫。

!!! warning "以為改動 child 的 props 能影響 parent"
    資料是 **單向** 由 parent 流向 child。child 收到 props 後不應該試圖去「修改」它們，也無法藉此改變 parent 的資料。若要讓 child 影響 parent，正確做法是 parent 把一個 function 當 prop 傳下去，讓 child 在適當時機呼叫它。

!!! warning "傳非字串的值卻忘了用大括號"
    JSX 中，字串以外的值（數字、布林、物件、變數、function）都必須用大括號 `{}` 包起來：`fontSize={12}` 正確，`fontSize="12"` 會傳入字串 `"12"` 而非數字，可能導致後續運算出錯。

!!! warning "對 function component 使用 defaultProps"
    React 已不再支援在 function component 上使用 `Button.defaultProps` 設定預設值。請改用解構搭配預設參數：`function Button({ text = "Click Me!" }) { ... }`。`defaultProps` 只需在維護 class component 或舊程式碼時認得即可。

## 練習

1. 閱讀 React 官方文件的〈Passing Props to a Component〉（見下方延伸資源）。務必動手編輯文件中的程式碼範例，實際傳入不同的 prop 值來觀察畫面變化——例如改變文字、顏色、字型大小，或試著多傳／少傳幾個 prop，感受預設值何時生效。

## 原文與延伸資源

- 原文：[Passing Data Between Components](https://www.theodinproject.com/lessons/node-path-react-new-passing-data-between-components)
- 本課引用：
    - React 官方文件〈[Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)〉
    - MDN〈[Destructuring assignment（解構賦值）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)〉
    - 進階閱讀：[Currying / partials（柯里化）](https://javascript.info/currying-partials)

---

> 本講義改寫自 The Odin Project《Passing Data Between Components》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
