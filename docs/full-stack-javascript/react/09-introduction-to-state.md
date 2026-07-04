---
title: State 入門
source_url: https://www.theodinproject.com/lessons/node-path-react-new-introduction-to-state
source_file: vendor/curriculum/react/states_and_effects/introduction_to_state.md
path: full-stack-javascript
course: React
order: 9
generated: 2026-07-03
---

# State 入門

> 改寫自 The Odin Project：[Introduction To State](https://www.theodinproject.com/lessons/node-path-react-new-introduction-to-state)
> ｜Full Stack JavaScript › React › States And Effects

## 核心概念

到目前為止，你寫的 component（元件）都比較「靜態」——給定同樣的 props（屬性），它就渲染（render）出同樣的畫面。但真正的應用程式是會「動」的：使用者點一下按鈕，下拉選單就展開；輸入框裡打字，畫面上的字就跟著變；點一下「加入購物車」，數字就從 0 變成 1。這些「隨著互動而改變」的能力，靠的就是這一課的主角——**state（狀態）**。

### State 是 component 的記憶

先記住一句話：**state 就是 component 的記憶。**

component 本質上是一個函式，每次 React 呼叫它，它就從頭跑一遍、回傳一段 JSX。問題是：函式跑完就結束了，區域變數也跟著消失。那 component 要怎麼「記住」使用者上一次點了什麼、輸入框裡現在是什麼內容？它需要一塊「跨越多次渲染都還在」的記憶體。這塊記憶體，就是 state。

舉個例子：一個會依「被點的按鈕」而改變背景顏色的 App。當你點下「紅色」按鈕，App 必須記住「現在的背景是紅色」，這樣即使 React 把整個 component 重新跑一遍，畫面也還是紅的。這個「現在的背景是紅色」，就是存在 state 裡的資訊。

那 state 跟一般的區域變數差在哪裡？關鍵有兩點：

1. **state 會在多次渲染之間被保留**——它不會像區域變數那樣，函式一跑完就歸零。
2. **改變 state 會觸發 component 重新渲染**——這是它跟 props 之外最大的不同。你不能直接用 `=` 去改一個變數就期待畫面更新；你得透過 React 提供的專用函式來改 state，React 才知道「資料變了，該重畫了」。

### useState hook：在 component 裡宣告 state

在 function component 裡，我們用 **`useState` hook** 來定義 state。它是 React 內建的一個 hook（之後會專門講 hook 是什麼，現在先把它當成「一個以 `use` 開頭、能讓你使用 React 功能的特殊函式」）。

`useState` 的用法是這樣：你傳一個「初始值」進去，它回傳一個「有兩個元素的陣列」，我們用陣列解構（destructuring）把這兩個元素接出來：

```jsx
const [stateValue, setStateValue] = useState(initialValue);
```

- 第一個元素 `stateValue`：**目前這一次渲染的 state 值**。
- 第二個元素 `setStateValue`：一個**用來更新 state 的函式**（習慣上命名為 `set` 加上 state 的名字）。

套用到背景顏色的例子上，就長這樣：

```jsx
const [backgroundColor, setBackgroundColor] = useState(COLORS[0]);
```

意思是：宣告一個叫 `backgroundColor` 的 state，初始值是顏色清單裡的第一個。之後只要在按鈕的 click 事件裡呼叫 `setBackgroundColor(某個顏色)`，React 就會把 state 更新成那個顏色，並重新渲染 component，畫面上的背景色也就跟著換掉了。

想要多個 state？很簡單，多寫幾行 `useState` 就好。例如你可以同時有一個 `backgroundColor`、一個 `count`，各自獨立。

這裡有個常被忽略但很重要的細節：**你絕對不要直接去改 `backgroundColor` 這個變數本身**（例如寫 `backgroundColor = 'red'`）。一來它是用 `const` 宣告的，二來就算能改，React 也不會知道、不會重畫。**改 state 一定要透過 `setBackgroundColor` 這個更新函式**——這是 React 感知變化的唯一管道。

### state 改變時，React 到底做了什麼？

這是這一課最需要建立正確心智模型的地方。

在 React 裡，**當一個 component 的 state 或 props 改變時，React 會把你的 component 函式「從頭再跑一遍」**，用最新的 state 與 props 重新算出「這次畫面應該長什麼樣子」。算完之後，React 再把需要更動的部分套用（commit）到真正的 DOM 上。

也就是說，整個 component 在某種意義上被「重新建立」了一次——`onButtonClick` 這個 event handler、那些 `div` 跟 `button`，全都重新被建立。這個「因為資料變了而重跑 component、重新產生畫面」的過程，就叫做**重新渲染（rerender）**。rerender 是 React 的核心機制，讓它能在底層資料改變時，有效率地更新畫面。

這時你可能會冒出一個疑問：**既然整個 component 都重跑了，那 `backgroundColor` 這個 state 不也應該被重新建立、變回初始值嗎？**

答案是：不會。**React 會負責幫你保管最新的 state，並在每次重跑 component 時，把最新的值交還給 `useState`。** 那個你寫在 `useState(...)` 裡的初始值，**只有在 component「第一次渲染」時才會被採用**；之後的每一次 rerender，React 都會忽略初始值，直接把它保管的最新值回傳給你。這就是為什麼「component 重跑了，但顏色不會被重設」的原因——記憶在 React 手上，不在函式的區域變數裡。

用背景顏色的例子把整條流程串起來：

1. 使用者點下某個顏色按鈕。
2. 該按鈕的 click handler 呼叫 `setBackgroundColor('新顏色')`。
3. React 記下新的 state 值，並安排一次 rerender。
4. React 從頭再跑一次 `App`，這次 `useState` 回傳的是「新顏色」。
5. `App` 依新顏色算出新的 JSX，React 比對前後差異、只把真正變動的部分更新到 DOM。
6. 畫面上的背景色換成新顏色。

### 補充：reconciliation（協調）演算法

上面說「React 只更新真正變動的部分」，這背後有一套機制值得認識。

每次 rerender，React 會產生一棵新的 **virtual DOM（虛擬 DOM）** 樹。virtual DOM 是「真實 DOM 的輕量版描述」，React 用它來追蹤目前 UI 的樣貌。產生新樹之後，React 會拿它跟上一棵舊樹做比對，算出「要讓真實 DOM 變成新樣子，最少需要動哪些地方」，然後只更新那些地方。這套「比對新舊、算出最小更動」的流程，就叫做 **reconciliation（協調）演算法**。

正是因為有 reconciliation，React 才不需要每次都把整個頁面砍掉重畫——它只碰真正需要改的節點，效能因此得以維持。這裡只是點到為止；深入下去是一個很深的兔子洞，但目前這個程度的理解，已足夠支撐你走完整個 React 課程。

### hook 的規則

`useState` 是我們碰到的第一個 hook。**hook 是一種「讓你使用 React 功能」的函式，全都以 `use` 開頭**（`useState`、之後會學的 `useEffect` 等等，一眼就認得出來）。

hook 好用，但有兩條規則一定要遵守，否則 React 會出錯：

1. **hook 只能在 function component（或自訂 hook）的「最頂層」呼叫。**
2. **hook 不能寫在迴圈、條件判斷（if）裡面。**

為什麼？因為 React 是靠「hook 每次渲染被呼叫的順序」來對應到正確的 state。如果你把 `useState` 藏在 `if` 裡，某次渲染跑了、某次沒跑，呼叫順序就亂掉，React 就會把 state 對錯位。把所有 hook 老老實實排在 component 最上面、無條件地呼叫，就能避開這類問題。

## 程式碼範例

下面是一個最小可執行的背景顏色切換器，把上面講的觀念都串起來：

```jsx
import { useState } from "react";

// 可選的顏色清單
const COLORS = ["#f87171", "#60a5fa", "#4ade80"];

export default function App() {
  // 宣告 backgroundColor state，初始值為清單第一個顏色
  const [backgroundColor, setBackgroundColor] = useState(COLORS[0]);

  return (
    <div style={{ backgroundColor, height: "200px", padding: "16px" }}>
      {COLORS.map((color) => (
        <button
          key={color}
          // 點擊時透過更新函式改 state，觸發 rerender
          onClick={() => setBackgroundColor(color)}
        >
          {color}
        </button>
      ))}
    </div>
  );
}
```

再看一個「計數器」，示範同一個 component 可以擁有多個獨立的 state，以及「用舊值算新值」時的正確寫法：

```jsx
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0); // 第一個 state：目前計數

  return (
    <div>
      <p>目前計數：{count}</p>
      {/* 用「更新函式」的形式，從前一個值 prev 算出新值，較安全 */}
      <button onClick={() => setCount((prev) => prev + 1)}>加 1</button>
      <button onClick={() => setCount(0)}>歸零</button>
    </div>
  );
}
```

## 常見陷阱

!!! warning "不要直接修改 state 變數，一定要用更新函式"
    像 `backgroundColor = "red"` 或 `count++` 這種「直接改變數」的寫法，在 React 裡是無效的：畫面不會更新，因為 React 根本不知道資料變了。改 state 的唯一正確方式，是呼叫 `useState` 給你的更新函式（如 `setBackgroundColor("red")`、`setCount(count + 1)`）。只有透過它，React 才會保管新值並安排 rerender。

!!! warning "初始值只在「第一次渲染」生效，別誤以為它每次都會重設"
    `useState(初始值)` 裡的初始值，只有 component 首次渲染時會被採用；之後每次 rerender，React 都直接回傳它保管的「最新值」，忽略你寫的初始值。所以「component 重跑」不等於「state 被重置」——記憶在 React 手上。

!!! warning "hook 不能寫在 if 或迴圈裡"
    務必把 `useState` 等所有 hook 放在 component 的最頂層、無條件地呼叫。若把 hook 藏進條件判斷或迴圈，會打亂 React 依「呼叫順序」追蹤 state 的機制，導致 state 對應錯亂。

!!! warning "用舊值算新值時，優先用函式形式的更新"
    當新值是根據舊值算出來的（例如計數 +1），建議寫成 `setCount((prev) => prev + 1)`，而不是 `setCount(count + 1)`。前者保證你拿到的是最新的值，能避免在多次連續更新時取到過期的舊值。

## 練習

1. 閱讀 React 官方文件的兩篇文章，把觀念補紮實：
    - **State: A Component's Memory**（State：component 的記憶）——理解 state 與一般變數的差異。
    - **Render and Commit**（渲染與提交）——理解 React 從「觸發渲染」到「更新 DOM」的完整流程。
2. 閱讀一篇關於 **React Reconciliation Algorithm（協調演算法）** 的文章，加深對 virtual DOM 比對機制的理解。
3. 動手改造這一課的背景顏色範例 App：
    - 新增一個 state，用來記錄「背景顏色總共被改過幾次」。
    - 每次切換背景色時，把這個次數加 1。
    - 把這個次數顯示在畫面上。
    - 提示：這正好練習「多個 state 並存」與「用舊值算新值（次數 +1）」。
4. （project）完整的專案實作請回到原文的 Assignment 區塊，依指引操作 `react-examples` repo 裡的 `state/` 範例。

## 原文與延伸資源

- 原文：[Introduction To State](https://www.theodinproject.com/lessons/node-path-react-new-introduction-to-state)
- 本課引用：
    - React 官方文件：State: A Component's Memory（`react.dev/learn/state-a-components-memory`）
    - React 官方文件：Render and Commit（`react.dev/learn/render-and-commit`）
    - The Odin Project `react-examples` repo 的 `state/` 範例

---

> 本講義改寫自 The Odin Project《Introduction To State》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
