---
title: 用 Reducer 管理狀態
source_url: https://www.theodinproject.com/lessons/node-path-react-new-reducing-state
source_file: vendor/curriculum/react/more_react_concepts/reducing_state.md
path: full-stack-javascript
course: React
order: 24
generated: 2026-07-03
---

# 用 Reducer 管理狀態

> 改寫自 The Odin Project：[Reducing State](https://www.theodinproject.com/lessons/node-path-react-new-reducing-state)
> ｜Full Stack JavaScript › React › More React Concepts

## 核心概念

到目前為止，我們都用 `useState` 這個 hook 來管理 component（元件）的 state（狀態）。當一個 component 只有一兩個彼此獨立、更新方式又很單純的 state 時，`useState` 用起來很順手。可是隨著功能變多，你會發現 event handler（事件處理函式）裡塞滿了各式各樣的 `setState` 呼叫：新增一筆、刪除一筆、切換完成、清空全部……state 更新的邏輯散落在整個 component 的各個角落，讀起來吃力，除錯更痛苦。這時候就輪到 reducer 上場了。

### 什麼是 reducer

reducer 是一個 **pure function（純函式）**，它接收「前一個 state」和一個「action（動作）」兩個參數，回傳「新的 state」。用型別的角度看，它的形狀就是：

```
(state, action) => newState
```

這裡的 action 是一個普通的 JavaScript 物件，慣例上一定有一個 `type` 屬性，用來描述「使用者做了什麼事」。除了 `type` 之外，action 也可以攜帶任何 reducer 計算新 state 時需要的額外資料（常見的名稱是 `payload`、`value`、`id` 等）。

「reducer」這個名字來自陣列的 `reduce` 方法。`reduce` 會拿一個累積值（accumulator）和目前的元素，一步步「摺疊」成最終結果。React 的 reducer 概念一模一樣：目前的 state 就是累積值，action 就是每次餵進來的元素，reducer 負責把它們摺疊成下一個 state。你甚至可以想像成「把一連串 action 逐一套用到初始 state 上，最後得到目前的 state」。

因為 reducer 是 pure function，它必須遵守兩條鐵律：**相同的輸入永遠得到相同的輸出**，而且**不能有副作用（side effect）**，例如不可以發送網路請求、不可以操作 DOM、也不可以直接修改（mutate）傳進來的 state。要更新 state，你得回傳一個「全新的物件」，而不是改動舊的那一個。

### 什麼時候該用 reducer

不是每個 component 都需要 reducer。判斷準則很簡單：

- 如果 state 只需要以少數幾種簡單方式更新，`useState` 就夠了，硬套 reducer 反而是過度設計。
- 如果 component 因為 state 邏輯而變得太大、難讀、難除錯，那就是換 reducer 的訊號。

改用 reducer 有幾個實際好處。第一，它把所有 state 更新邏輯**集中**到同一個函式裡，你可以把這個函式搬到獨立的檔案，讓 component 本身變得更精簡、更專注於畫面。第二，因為每次更新都對應到一個具名的 action，當出現 state 相關的 bug 時，你能很快地把問題回溯到「是哪一個 action 造成的」。第三，reducer 只是一個 pure function，跟 React 完全解耦，所以你可以把它單獨拿出來寫 unit test，不需要 render 任何 component。

### useReducer 這個 hook

React 讓我們透過 `useReducer` 這個 hook 在 component 裡使用 reducer。它接收兩個參數：**reducer 函式**與**初始 state**，回傳一個含有兩個元素的陣列，你通常用陣列解構（destructuring）把它們取出來：

```javascript
const [state, dispatch] = useReducer(reducer, { count: 0 });
```

- `state`：目前的 state，跟 `useState` 回傳的第一個值扮演相同角色。
- `dispatch`：一個函式，用來「派發（dispatch）」一個 action。

你不再直接呼叫 setter 去設定新值，而是呼叫 `dispatch`，把一個 action 物件交給它。React 會在內部把「目前的 state」與「你派發的 action」一起丟給你的 reducer，再拿 reducer 回傳的值當作下一個 state：

```javascript
function handleClick() {
  dispatch({ type: "incremented_count" });
}
```

這裡有一個和 `useState` 完全一致的重要行為：呼叫 `dispatch` 之後，**state 不會立刻改變**，React 只會在「下一次 render」才更新 state。此外，React 用 [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 來比較新舊 state，如果 reducer 回傳的值和目前的 state 相同（例如你不小心回傳了原本那個沒動過的物件），component 就不會重新 render。

`useState` 和 `useReducer` 在能力上是**等價**的，任何用其中一個能做到的事，另一個也做得到。選哪一個純粹看情境，甚至同一個 component 裡兩者並用也完全沒問題，例如用 `useReducer` 管理複雜的表單狀態，同時用 `useState` 管一個單純的「是否展開」開關。

### 從 useState 遷移到 useReducer

React 官方文件建議的重構步驟可以拆成三步：

1. **從「設定 state」改成「派發 action」**：把 event handler 裡原本呼叫 setter 的每一處，改成 `dispatch` 一個描述「發生了什麼事」的 action。這一步你先想清楚「使用者做了哪些動作」，還不用管 state 怎麼算。
2. **寫出 reducer 函式**：把原本散落在各處的 state 更新邏輯，全部搬進 reducer。慣例上會用 `switch` 針對 `action.type` 分流，每個 `case` 回傳對應的新 state，並在 `default` 分支丟出錯誤，好讓打錯字的 action type 立刻現形。
3. **在 component 裡用 useReducer**：把 `useState` 換成 `useReducer(reducer, initialState)`，其餘程式碼引用 `state` 與 `dispatch` 即可。

命名 action 時有個好習慣：讓 `type` 描述「使用者做了什麼」，而不是「你想怎麼改 state」。例如用 `"added_task"`（新增了一項任務）會比 `"set_tasks"`（設定 tasks）更能說明意圖，日後看 action 就像在看一份操作紀錄。

## 程式碼範例

先看最小的計數器，示範 `useReducer` 的完整輪廓：

```jsx
import { useReducer } from "react";

// reducer 是 pure function：接收舊 state 與 action，回傳新 state
function reducer(state, action) {
  switch (action.type) {
    case "incremented_count": {
      return { count: state.count + 1 };
    }
    case "decremented_count": {
      return { count: state.count - 1 };
    }
    case "set_count": {
      // action 除了 type 之外，也可攜帶額外資料
      return { count: action.value };
    }
    default: {
      // 打錯 type 時立刻噴錯，方便除錯
      throw new Error("未知的 action：" + action.type);
    }
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>目前計數：{state.count}</p>
      {/* 不直接改 state，而是派發一個描述動作的 action */}
      <button onClick={() => dispatch({ type: "decremented_count" })}>-1</button>
      <button onClick={() => dispatch({ type: "incremented_count" })}>+1</button>
      <button onClick={() => dispatch({ type: "set_count", value: 0 })}>
        歸零
      </button>
    </div>
  );
}

export default Counter;
```

再看一個較貼近真實情境的待辦清單。注意 reducer 如何用「回傳新陣列」的方式避免 mutate 原本的 state：

```jsx
import { useReducer, useState } from "react";

function tasksReducer(tasks, action) {
  switch (action.type) {
    case "added": {
      // 用展開運算子產生新陣列，不動到原本的 tasks
      return [...tasks, { id: action.id, text: action.text, done: false }];
    }
    case "toggled": {
      return tasks.map((task) =>
        task.id === action.id ? { ...task, done: !task.done } : task
      );
    }
    case "deleted": {
      return tasks.filter((task) => task.id !== action.id);
    }
    default: {
      throw new Error("未知的 action：" + action.type);
    }
  }
}

let nextId = 0;

function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, []);
  // 複雜狀態用 useReducer，單純的輸入框狀態仍用 useState，兩者可並存
  const [text, setText] = useState("");

  function handleAdd() {
    if (text.trim() === "") return;
    dispatch({ type: "added", id: nextId++, text });
    setText("");
  }

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleAdd}>新增</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => dispatch({ type: "toggled", id: task.id })}
              />
              <span style={{ textDecoration: task.done ? "line-through" : "none" }}>
                {task.text}
              </span>
            </label>
            <button onClick={() => dispatch({ type: "deleted", id: task.id })}>
              刪除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskApp;
```

因為 `tasksReducer` 只是一個 pure function，你可以在完全不牽涉 React 的情況下替它寫測試：

```javascript
// 直接呼叫 reducer，驗證輸出，不需要 render 任何 component
const before = [{ id: 0, text: "買牛奶", done: false }];
const after = tasksReducer(before, { type: "toggled", id: 0 });

console.log(after[0].done); // true
console.log(before[0].done); // false（原本的 state 沒被 mutate）
```

## 常見陷阱

!!! warning "在 reducer 裡直接修改（mutate）state"
    reducer 是 pure function，不能改動傳進來的 state。像 `state.count++`、`tasks.push(...)`、`task.done = true` 這類寫法都會直接改到原物件，導致 React 用 `Object.is()` 比較時看不出差異、畫面不更新，甚至引發難以追查的 bug。請永遠回傳新的物件或陣列（善用 `{ ...state }`、`[...tasks]`、`map`、`filter`）。

!!! warning "以為 dispatch 之後 state 立刻就變了"
    和 `useState` 一樣，`dispatch` 只是排程一次更新，state 要到「下一次 render」才生效。如果你在同一個函式裡 `dispatch` 後馬上讀 `state`，讀到的仍是舊值。需要連續計算時，把邏輯放進 reducer，或分次派發 action。

!!! warning "reducer 裡藏了副作用（side effect）"
    不要在 reducer 裡發送 API 請求、操作 DOM、寫入 `localStorage` 或呼叫 `setTimeout`。這些副作用該放在 event handler 或 `useEffect` 裡。reducer 的唯一職責是「根據舊 state 與 action 算出新 state」，保持純淨才能被安全地測試與推理。

!!! warning "忘了處理未知的 action type"
    務必在 `switch` 的 `default` 分支丟出錯誤。少了它，一旦 action 的 `type` 打錯字，reducer 會靜默回傳 `undefined`（或無視該動作），畫面沒反應卻又不報錯，是很常見的隱形 bug。

!!! warning "把 action 命名成「怎麼改 state」而非「發生了什麼」"
    盡量讓 `type` 描述使用者的動作，例如 `"added_task"`、`"toggled"`，而不是 `"set_tasks"`。前者讓 action 讀起來像一份操作紀錄，除錯時能一眼看出使用者做了什麼；後者則把 component 的實作細節洩漏進 action，日後重構會更綁手綁腳。

## 練習

1. 打開 React 官方文件 [Extracting state logic into a reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)，跟著它把一個用 `useState` 寫成的範例重構成 `useReducer`。重點在體會「先想清楚有哪些 action、再把更新邏輯搬進 reducer」的三步驟流程。別跳過文末的 challenges（挑戰題），親手做過才會記得。
2. 閱讀 [useReducer](https://react.dev/reference/react/useReducer) 這個 hook 的參考文件，特別留意 **Troubleshooting（疑難排解）** 段落，裡面整理了新手最常踩的坑，例如「dispatch 後 state 沒更新」「reducer 執行了兩次」等，讀過之後遇到問題才知道從哪裡查起。
3. 自我檢測：不看文件，試著說明「reducer 是什麼」「dispatch 函式做了什麼」「從 `useState` 遷移到 `useReducer` 有哪幾個步驟」。答不出來就回到上面的「核心概念」重讀對應段落。

## 原文與延伸資源

- 原文：[Reducing State](https://www.theodinproject.com/lessons/node-path-react-new-reducing-state)
- 本課引用：
  - React 官方文件 — [Extracting state logic into a reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)
  - React 官方文件 — [useReducer](https://react.dev/reference/react/useReducer)
  - MDN — [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

---

> 本講義改寫自 The Odin Project《Reducing State》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
