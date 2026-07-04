---
title: Class 元件
source_url: https://www.theodinproject.com/lessons/node-path-react-new-class-based-components
source_file: vendor/curriculum/react/class_components/class_based_components.md
path: full-stack-javascript
course: React
order: 14
generated: 2026-07-04
---

# Class 元件

> 改寫自 The Odin Project：[Class Based Components](https://www.theodinproject.com/lessons/node-path-react-new-class-based-components)
> ｜Full Stack JavaScript › React › Class Components

## 核心概念

到目前為止，你寫的每一個 component（元件）都是 function（函式）形式的：宣告一個函式、回傳 JSX、用 `useState`、`useEffect` 這些 hook 管理 state（狀態）與 side effect（副作用）。這是現在的主流寫法，語法乾淨、邏輯集中。但只要你翻開任何一份稍有年紀的 React 專案，就會撞見另一種面貌完全不同的寫法：**class（類別）形式的 component**，也就是這一課的主角。

### 為什麼還要學一個「舊」寫法

React 剛問世時，根本沒有 hook。當時能夠擁有 state 的，只有 class component；function component 只能單純接收 props（屬性）、回傳畫面，因此還被稱作「stateless（無狀態）component」。想要記憶資料、想要在元件生命週期的某個時間點做事，你別無選擇，只能寫 class。

這個局面在 **2019 年 2 月** 隨著 hook 的推出而改變。有了 `useState`、`useEffect`，function component 也能管理 state 與副作用了，而且寫出來更簡潔、更好讀，於是社群逐漸把重心轉向 function component。今天你新開的專案幾乎不會再手寫 class component。

那為什麼還要學？答案很現實：**你遲早會接手別人的舊程式碼（legacy code）**。維護一個 2018、2019 年寫成的專案，或是讀一份年代久遠的教學、函式庫原始碼，滿滿都是 class。看不懂 class component，你就沒辦法讀懂、也沒辦法修改這些程式。所以這一課的目標不是要你「改用」class，而是讓你「讀得懂」class——理解它如何寫 props、如何管 state、以及那個到處出現的 `this` 到底在做什麼。

### 一個 class component 需要什麼

先建立一個心智模型：class component 和 function component 做的是**同一件事**——接收 props、根據 state 算出畫面、回應使用者操作。差別只在於「用什麼語法把這些拼起來」。function component 是「一個函式加上幾個 hook」；class component 則是「一個繼承自 `Component` 的類別，把各項職責拆成類別裡的不同成員」。對照表大致如下：

| 職責 | function component | class component |
| --- | --- | --- |
| 讀取 props | 函式參數 `props` | `this.props` |
| 宣告 state | `useState` | constructor 裡的 `this.state` |
| 更新 state | `setXxx(...)` | `this.setState(...)` |
| 產生畫面 | `return <JSX />` | `render()` 方法回傳 JSX |

接下來我們一步步把一個 function component 改寫成 class component，你就能看清這張表是怎麼對應起來的。

### 第一步：extends Component

一個 class component，本質上是一個 JavaScript class，但它不能只是普通的 class——它得具備一些「讓 React 認得它是 component」的特性。React 把這些特性都放在一個叫做 `Component` 的基底類別裡，我們只要**繼承（extends）**它就好：

```jsx
import { Component } from "react";

class ClassInput extends Component {
  // 元件的內容之後會放這裡
}

export default ClassInput;
```

`extends Component` 這一行是關鍵。它讓 `ClassInput` 繼承到 `this.setState`、`this.props` 這些由 React 提供的能力。少了它，這就只是一個跟 React 無關的普通類別。

### 第二步：constructor 與 props

class 通常需要一個 **constructor（建構子）**，它是這個類別被建立成物件（也就是被實體化）時最先執行的方法。React 會把傳進這個 component 的 props，交給 constructor 的參數：

```jsx
import { Component } from "react";

class ClassInput extends Component {
  constructor(props) {
    super(props);
  }
  // 更多程式碼會放這裡
}

export default ClassInput;
```

這裡有兩個必須理解的重點：

- **`super(props)`**：`super` 會呼叫父類別（也就是 `Component`）的 constructor。你必須先呼叫 `super`，才能在 constructor 裡使用 `this`；而把 `props` 傳進去，是為了讓 React 正確地把 props 掛到 `this` 上，之後你才能用 `this.props` 讀到它。
- **沒有 props 也沒關係**：如果你的 component 不接收任何 props，其實可以完全不寫 constructor；就算寫了，`constructor` 和 `super` 都不帶參數也行。

一旦這樣寫好，component 內部各處就能透過 `this.props` 拿到外部傳進來的資料了。

### 第三步：用 render() 產生畫面

props 能讀了，下一個問題是：JSX 要在哪裡回傳？function component 是直接 `return`，但 class 不能對整個類別 `return` 一段 JSX。答案是：把 JSX 從一個叫做 **`render`** 的方法回傳出去。React 規定每個 class component 都必須有 `render` 方法，它就是這個 component 的「畫面產生器」：

```jsx
import { Component } from "react";

class ClassInput extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section>
        <h3>{this.props.name}</h3>
        {/* 用來輸入待辦事項的表單 */}
        <form>
          <label htmlFor="task-entry">Enter a task: </label>
          <input type="text" id="task-entry" name="task-entry" />
          <button type="submit">Submit</button>
        </form>
        <h4>All the tasks!</h4>
        {/* 所有待辦事項會顯示在這個清單裡 */}
        <ul></ul>
      </section>
    );
  }
}

export default ClassInput;
```

注意 `{this.props.name}`：在 class component 裡，props 是透過 `this` 取用的，這和 function component 直接寫 `props.name` 明顯不同。這個「什麼都要透過 `this`」的特徵，會貫穿整個 class component。

### 第四步：在 constructor 裡初始化 state

再來是 state。function component 用 `useState` 宣告 state，class component 則是在 **constructor 裡**把初始 state 指定給 `this.state`。`this.state` 通常是一個物件，裡面放這個 component 需要記住的所有欄位：

```jsx
constructor(props) {
  super(props);

  this.state = {
    todos: [],
    inputVal: "",
  };
}
```

這裡我們宣告了兩個 state 欄位：`todos` 是一個待辦事項的陣列（初始為空），`inputVal` 是輸入框目前的文字（初始為空字串）。

要更新 state，**不能直接改 `this.state`**，而要呼叫繼承來的 **`this.setState`** 方法。這條規則和 function component 一模一樣：**state 不可被 mutate（直接修改）**，每次更新都必須提供一份新的 state。`setState` 收到新值後，React 才會安排重新渲染，把新畫面畫出來。

### 第五步：加上功能，並理解 this 與 bind

最後補上互動功能。這一步的邏輯和 function component 幾乎一樣，只有一個關鍵差異——**`this` 的綁定問題**，這也是 class component 最容易踩雷、最需要理解的地方。

問題的根源在 JavaScript 本身：**類別裡用一般語法宣告的方法，預設並不會綁定到類別實體**。也就是說，當你把 `this.handleSubmit` 當作 `onSubmit` 的回呼（callback）傳給 `<form>`，等到使用者真的送出、React 呼叫這個函式時，函式內部的 `this` 已經不再指向你的 component 了（往往會變成 `undefined`），於是 `this.setState` 就會爆錯。

解法有兩種：

1. **在 constructor 裡用 `bind` 綁定**：`this.handleSubmit = this.handleSubmit.bind(this)`。`bind` 會回傳一個「`this` 永遠鎖定為這個 component」的新函式，之後不管在哪裡被呼叫都不會跑掉。慣例是在 constructor 裡一次綁好，而不是在 `render` 裡即時綁（每次渲染都重新 `bind` 會產生新函式，浪費效能）。
2. **用 arrow function（箭頭函式）語法定義方法**：arrow function 沒有自己的 `this`，會自動沿用外層——也就是 component 實體——的 `this`。用這種寫法，你就可以跳過 constructor 裡的 `bind`。

完整的 class component 長這樣（採用 `bind` 的寫法）：

```jsx
import { Component } from "react";

class ClassInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [],
      inputVal: "",
    };

    // 把方法的 this 綁定到這個 component 實體
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(e) {
    // 用函式版的 setState，依前一個 state 算出新的 state
    this.setState((state) => ({
      ...state,
      inputVal: e.target.value,
    }));
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState((state) => ({
      todos: state.todos.concat(state.inputVal), // 把新事項加進陣列
      inputVal: "", // 清空輸入框
    }));
  }

  render() {
    return (
      <section>
        <h3>{this.props.name}</h3>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="task-entry">Enter a task: </label>
          <input
            type="text"
            id="task-entry"
            name="task-entry"
            value={this.state.inputVal}
            onChange={this.handleInputChange}
          />
          <button type="submit">Submit</button>
        </form>
        <h4>All the tasks!</h4>
        <ul>
          {this.state.todos.map((todo) => (
            <li key={todo}>{todo}</li>
          ))}
        </ul>
      </section>
    );
  }
}

export default ClassInput;
```

把這段和你熟悉的 function component 對照，你會發現「概念」完全相同：受控輸入框（controlled input）綁 `value` 與 `onChange`、送出時用不可變的方式更新陣列、用 `map` 加 `key` 把清單渲染出來。唯一變的只有「外殼」——所有 props 都變成 `this.props`、所有 state 都變成 `this.state`、更新都走 `this.setState`、方法都要處理 `this` 的綁定。理解了這層對應，你就能讀懂絕大多數的 class component 了。

## 程式碼範例

以下用一個更小的例子，把 class component 的四大要素（constructor、state、事件方法、render）濃縮在一起。這是一個計數器：

```jsx
import { Component } from "react";

class Counter extends Component {
  constructor(props) {
    super(props); // 讓 this.props 可用

    this.state = { count: 0 }; // 初始化 state

    // 用一般方法就得手動 bind
    this.increment = this.increment.bind(this);
  }

  increment() {
    // 依前一個 count 算新值，不要直接改 this.state
    this.setState((state) => ({ count: state.count + 1 }));
  }

  render() {
    return (
      <div>
        {/* props 用 this.props、state 用 this.state 取用 */}
        <h3>{this.props.title}</h3>
        <p>目前計數：{this.state.count}</p>
        <button onClick={this.increment}>加一</button>
      </div>
    );
  }
}

export default Counter;

// 使用方式：<Counter title="我的計數器" />
```

如果不想手動 `bind`，可以把 `increment` 改成 arrow function 的 class field 寫法，`this` 會自動綁定，constructor 裡那行 `bind` 就能刪掉：

```jsx
// 改用 arrow function，省去 constructor 裡的 bind
increment = () => {
  this.setState((state) => ({ count: state.count + 1 }));
};
```

## 常見陷阱

!!! warning "方法忘了 bind，this 會變成 undefined"
    在 class component 裡，用一般語法宣告的方法**預設不會綁定** `this`。如果你把 `this.handleClick` 直接當回呼（callback）傳給 `onClick`，被呼叫時它內部的 `this` 就不再指向 component，`this.setState` 會直接報錯。解法二選一：在 constructor 裡寫 `this.handleClick = this.handleClick.bind(this)`，或改用 arrow function 語法定義方法讓 `this` 自動綁定。

!!! warning "直接修改 this.state 不會觸發重新渲染"
    像 `this.state.count = 5` 或 `this.state.todos.push(x)` 這種直接 mutate 的寫法，既違反「state 不可變」的原則，也**不會**讓 React 重新渲染畫面。一律要透過 `this.setState` 提供一份新的 state，React 才會排程更新。

!!! warning "忘了呼叫 super(props)"
    constructor 裡若沒有先呼叫 `super(props)`，你不但無法在 constructor 中使用 `this`，還會導致 `this.props` 在後續讀不到值。只要你寫了 constructor，第一行幾乎永遠是 `super(props)`。

!!! warning "把 setState 當成同步更新"
    `this.setState` 是排程更新，不保證呼叫完 `this.state` 立刻就是新值；連續多次呼叫也可能被 React 合併。當新 state 依賴前一個 state 時（例如計數器加一），請使用函式版 `this.setState((state) => ({ ... }))`，用參數拿到最新的前一個 state，而不要直接讀 `this.state`。

## 練習

以下練習沿用 The Odin Project 的 [react-examples repo](https://github.com/TheOdinProject/react-examples)。請先 fork 並 clone 該 repo，`cd` 進 `class-components/` 目錄，執行 `npm install` 安裝相依套件，再用 `npm run dev` 啟動開發伺服器。裡面有同一個功能的兩個版本——`src/components/FunctionalInput.jsx`（function 版）與 `src/components/ClassInput.jsx`（class 版），對照著讀很有幫助。接著在既有的 class component 上加上以下功能：

1. **刪除按鈕**：為每一筆待辦事項加上一個刪除按鈕。按下後，要把那一筆從 state 陣列中移除（記得用不可變的方式產生新陣列，再 `this.setState`），該事項就會從畫面上消失。樣式此刻不是重點，用瀏覽器預設的 `button` 樣式即可。
2. **Count 元件**：另外實作一個 class component `Count`，用來顯示目前待辦事項的數量，並把它 render 在 `ClassInput` 內的某個位置。這是練習「把 props 從父層傳進 class component、用 `this.props` 取用」的好機會。
3. **編輯按鈕（進階）**：為每一筆事項加上編輯按鈕。按下後，把該筆事項替換成一個輸入框，並把按鈕文字改成「Resubmit」，讓使用者能修改後重新送出、儲存編輯。這一題相對困難，完成的話非常值得驕傲！

若你想挑戰完整的專案（project），請參考原文的 assignment 區塊指引。

## 原文與延伸資源

- 原文：[Class Based Components](https://www.theodinproject.com/lessons/node-path-react-new-class-based-components)
- 本課引用：
    - [react-examples repo（class-components 目錄）](https://github.com/TheOdinProject/react-examples)
    - [MDN：`super` 關鍵字](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super)

---

> 本講義改寫自 The Odin Project《Class Based Components》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
