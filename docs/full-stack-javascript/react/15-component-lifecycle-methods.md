---
title: 元件生命週期方法
source_url: https://www.theodinproject.com/lessons/node-path-react-new-component-lifecycle-methods
source_file: vendor/curriculum/react/class_components/component_lifecycle_methods.md
path: full-stack-javascript
course: React
order: 15
status: draft
generated: 2026-07-04
---

# 元件生命週期方法

> 改寫自 The Odin Project：[Component Lifecycle Methods](https://www.theodinproject.com/lessons/node-path-react-new-component-lifecycle-methods)
> ｜Full Stack JavaScript › React › Class Components

## 核心概念

在前面的課程裡，你已經認識了 component（元件）的**生命週期（lifecycle）**：一個 component 從出現在畫面上、隨著資料變動而更新、到最後從畫面移除，會經歷三個階段。在 function component（函式元件）裡，我們幾乎都用 `useEffect` 這個 hook 來處理各階段要做的事；但在 **class component（類別元件）**裡，React 沒有 `useEffect`，而是提供一組**專屬的生命週期方法（lifecycle methods）**，讓你把程式碼掛在對的時機上。這一課就是要認識這幾個方法。

先把三個階段講清楚：

- **mount（掛載）**：component 第一次被建立，並插入到 DOM 樹裡。這是它「誕生」的時刻。
- **update（更新）**：component 因為 props（屬性）或 state（狀態）改變而重新 render（渲染）。同一個 component 在存活期間可以更新很多次。
- **unmount（卸載）**：component 從畫面上被移除、銷毀。這是它「消失」的時刻。

class component 為這幾個時機各安排了一個方法。下面逐一來看。

### `render()`

`render()` 是最常用、也是 class component 裡**唯一必須實作**的生命週期方法——你在前一課寫 class component 時已經用過它。它在 **mount 時**與**每一次 update 時**都會執行，負責回傳這個 component 要畫出來的 JSX。

`render()` 有一條鐵律：它必須是**純粹的（pure）**。所謂純粹，意思是：

- 給同樣的 props、state 與 context，它每次都回傳同樣的結果；
- 它**不修改 component 的 state**（不能在裡面呼叫 `setState`）；
- 它**不直接跟瀏覽器互動**，也不做任何 side effect（副作用）——不發 API 請求、不設定計時器、不操作 DOM。

換句話說，`render()` 只做一件事：根據目前的資料「算出畫面長怎樣」。所有會影響外部世界、或依賴外部世界的動作，都要移到別的生命週期方法裡。這條規則跟 function component 裡「渲染邏輯要純粹、副作用要放進 `useEffect`」的原則是同一回事。

### `componentDidMount()`

這個方法在 component **掛載完成之後**（也就是已經插入 DOM 樹之後）執行一次。名字裡的「Did」就是提示你：這是「已經 mount 好了」才跑的。

它是**初次抓取資料**的最佳位置：component 一出現在畫面上，就在這裡去 fetch 它需要的資料。同樣地，任何「必須等到 component 真的在 DOM 上才能做」的動作——例如設定訂閱、量測某個 DOM 節點的尺寸、啟動計時器——也都放這裡。

### `componentDidUpdate()`

這個方法在 component **重新 render 之後**執行（注意：**初次 mount 時不會跑**，只有後續的 update 才會）。它常見的完整簽名是 `componentDidUpdate(prevProps, prevState)`，React 會把**上一次的 props 與 state** 傳給你，讓你能拿「這次的」跟「上次的」做比較。

這個「比較」非常關鍵。因為 `componentDidUpdate` 是在更新後跑的，如果你在裡面**無條件地**呼叫 `setState`，就會觸發下一次 render，而那次 render 之後又會再跑一次 `componentDidUpdate`，於是「更新 → setState → 再更新 → 再 setState」形成**無限迴圈**。正確做法是先用條件式比較 `prevProps`／`prevState` 跟目前的值，只有在真的改變時才更新，例如：

```jsx
componentDidUpdate(prevProps) {
  // 只有當使用者 ID 真的變了，才重新抓資料
  if (this.props.userId !== prevProps.userId) {
    this.fetchUserData(this.props.userId);
  }
}
```

一句話總結它的用途：**當 DOM 或某個 state／prop 改變、而你需要對這個改變做出反應時，就用 `componentDidUpdate`**。像是使用者切換了，就重新抓那位使用者的資料。

### `componentWillUnmount()`

這是最後一個生命週期方法，在 component **即將被卸載、銷毀之前**呼叫。名字裡的「Will」提示你：這是「還沒 unmount、但馬上要了」的時機。

它專門用來做**清理（cleanup）**：取消還沒完成的網路請求、清除計時器（`clearInterval`）、移除事件監聽、關閉連線或訂閱。原則很好記——`componentDidMount` 裡建立了什麼，就在 `componentWillUnmount` 裡對應地收掉什麼，兩者要像鏡子一樣互相對應。少了這一步，被卸載的 component 留下的計時器或訂閱會繼續在背景執行，造成重複觸發與記憶體洩漏。

### `useEffect` 如何整合這些生命週期方法

學完 class 的生命週期方法後，回頭看 function component 的 `useEffect`，會發現它其實是把 `componentDidMount`、`componentDidUpdate` 與 `componentWillUnmount` **合而為一**。它到底對應到哪個（或哪幾個），取決於**它的相依陣列（dependency array）**，以及**它有沒有回傳一個函式**：

- **空的相依陣列 `[]`**：等同於 `componentDidMount`——只在掛載時執行一次。
- **有值的相依陣列 `[a, b]`**：等同於 `componentDidMount` 加上 `componentDidUpdate`，但只有在相依項（a 或 b）改變時才在更新後執行。
- **沒有相依陣列**：等同於 `componentDidMount` 加上 `componentDidUpdate`——每一次 render 後都執行。
- **effect 裡回傳一個函式**：那個回傳的函式等同於 `componentWillUnmount`（也會在下次重跑 effect 前執行）。

舉個例子：

```jsx
useEffect(() => {
  placeholderFunction();
  return () => cleanupFunction();
}, []);
```

這段 `useEffect` 因為傳了**空相依陣列**，所以包含了 `componentDidMount` 的功能（`placeholderFunction`），並透過**回傳函式**包含了 `componentWillUnmount` 的功能（`cleanupFunction`）；它**沒有** `componentDidUpdate` 的功能，正是因為相依陣列是空的、不會在更新時重跑。

### 關於過時（deprecated）的方法

閱讀舊資料時你可能會遇到 `componentWillMount`、`componentWillReceiveProps`、`componentWillUpdate` 這幾個方法。它們已經被標記為**不安全（unsafe）並淘汰**，現在的名字前面都加了 `UNSAFE_` 前綴。新程式碼不要使用它們；查文件時把它們當作「該避開的東西」即可。也要記得：React 官方現在推薦用 function component 搭配 hook 來寫新元件，class component 的生命週期方法主要用於理解與維護既有程式碼。

## 程式碼範例

下面是一個完整、可執行的 class component，把本課四個方法串在一起。它在掛載時啟動一個每秒累加的計時器（`componentDidMount`）、在使用者 ID 改變時重新抓資料（`componentDidUpdate`），並在卸載時清除計時器（`componentWillUnmount`）；而畫面由純粹的 `render()` 負責產出。

```jsx
import { Component } from "react";

class UserTimer extends Component {
  // 在 constructor 裡宣告初始 state
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
  }

  componentDidMount() {
    // 掛載完成後才啟動計時器，並記下 id 以便日後清除
    this.intervalId = setInterval(() => {
      this.setState((prev) => ({ seconds: prev.seconds + 1 }));
    }, 1000);
  }

  componentDidUpdate(prevProps) {
    // 一定要比較，避免無條件 setState 造成無限迴圈
    if (this.props.userId !== prevProps.userId) {
      console.log(`使用者從 ${prevProps.userId} 換成 ${this.props.userId}，重新抓資料`);
      // 這裡會放實際的 fetch 邏輯
    }
  }

  componentWillUnmount() {
    // 鏡像 componentDidMount：把建立的計時器收掉
    clearInterval(this.intervalId);
  }

  render() {
    // render 保持純粹：只根據 props / state 算出畫面
    return (
      <p>
        使用者 {this.props.userId} 已停留 {this.state.seconds} 秒。
      </p>
    );
  }
}

export default UserTimer;
```

對照之下，同樣的邏輯在 function component 裡會濃縮成一個（或幾個）`useEffect`：

```jsx
import { useEffect, useState } from "react";

function UserTimer({ userId }) {
  const [seconds, setSeconds] = useState(0);

  // 對應 componentDidMount + componentWillUnmount
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(intervalId); // 清理，等同 componentWillUnmount
  }, []); // 空相依陣列：只在掛載時執行

  // 對應「userId 改變時的 componentDidUpdate」
  useEffect(() => {
    console.log(`使用者變成 ${userId}，重新抓資料`);
  }, [userId]); // 相依 userId：只有它改變時才重跑

  return <p>使用者 {userId} 已停留 {seconds} 秒。</p>;
}

export default UserTimer;
```

## 常見陷阱

!!! warning "在 componentDidUpdate 裡無條件呼叫 setState，造成無限迴圈"
    `componentDidUpdate` 本身是在更新後才跑的。若你在裡面不加判斷就 `setState`，會觸發下一次 render，而那次 render 又會再呼叫 `componentDidUpdate`，如此「更新 → setState → 再更新」永不停止。務必先用 `prevProps`／`prevState` 跟目前的值比較，只有真的改變時才更新 state。

!!! warning "在 render() 裡做副作用或修改 state"
    `render()` 必須純粹：不 `setState`、不發 API 請求、不設定計時器、不直接操作 DOM。把這類副作用寫進 `render()`，會讓元件行為不可預測，甚至觸發重複渲染。初始資料抓取放 `componentDidMount`，對變動的反應放 `componentDidUpdate`。

!!! warning "忘了在 componentWillUnmount 裡清理"
    在 `componentDidMount` 建立的計時器、訂閱、事件監聽或連線，若沒有在 `componentWillUnmount` 裡對應地清除，元件卸載後這些東西會繼續在背景執行，導致重複觸發與記憶體洩漏。原則：mount 時建立了什麼，unmount 時就收掉什麼。

!!! warning "使用已淘汰的 componentWill... 方法"
    `componentWillMount`、`componentWillReceiveProps`、`componentWillUpdate` 都已被標記為不安全並淘汰（現在前綴為 `UNSAFE_`）。看舊教學或舊程式碼時要能認得它們，但新程式碼不要使用。

## 練習

跟著下面的步驟把本課概念整理清楚（原文的延伸閱讀都以繁中重述，讓你不點外部連結也能掌握重點）：

1. **在腦中走一遍生命週期**：拿本課的 `UserTimer` class 範例，依序想像它「掛載 → 更新 → 卸載」的過程。說出：`render()` 在哪些時機跑、`componentDidMount` 何時觸發、`componentDidUpdate` 收到的 `prevProps` 有什麼用、`componentWillUnmount` 又在何時被呼叫。這對應原文建議看的「component 生命週期圖」——把每個方法對到它所屬的階段。
2. **對照官方 Component 文件的重點**：原文請你閱讀 React 官方 `Component` 參考文件中，從 `constructor(props)` 到 `componentWillUnmount()` 這一段。本課已把核心逐一重述：`constructor` 用來宣告初始 state（且是唯一能直接指派 `this.state` 的地方，其他地方要用 `setState`）、`render()` 必須純粹、`componentDidMount` 做初始化與抓資料、`componentDidUpdate` 對變動做反應（記得先比較）、`componentWillUnmount` 做清理。閱讀時對「已淘汰的 API」保持警覺，其餘 API 當補充資料看即可。
3. **練習 class 與 hook 的對照**：拿本課「`useEffect` 如何整合這些生命週期方法」的四條規則，把上面的 class 範例與 function 範例並排，逐行指出「這段 class 程式碼對應哪個 `useEffect` 寫法」。能自由在兩種寫法間翻譯，代表你真的懂了生命週期。

> 進階練習（project）：原文的實作型 project 請參考下方「原文與延伸資源」連結，依原文步驟完成。

## 原文與延伸資源

- 原文：[Component Lifecycle Methods](https://www.theodinproject.com/lessons/node-path-react-new-component-lifecycle-methods)
- 本課引用：
    - React 官方文件〈Component〉：class component 各生命週期方法（`constructor`、`render`、`componentDidMount`、`componentDidUpdate`、`componentWillUnmount`）的完整參考與注意事項，包含已淘汰的 `UNSAFE_` 方法說明。
    - React 官方文件〈useEffect〉：說明 function component 如何用單一 hook 涵蓋 mount／update／unmount 三個階段，是理解 class 生命週期與 hook 對照的關鍵。
    - Wojciech Maj〈React lifecycle methods diagram〉：把各生命週期方法對應到 mount／update／unmount 階段的視覺化圖表。

---

> 本講義改寫自 The Odin Project《Component Lifecycle Methods》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
