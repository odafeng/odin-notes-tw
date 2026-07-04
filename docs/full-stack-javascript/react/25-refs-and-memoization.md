---
title: Refs 與 Memoization
source_url: https://www.theodinproject.com/lessons/node-path-react-new-refs-and-memoization
source_file: vendor/curriculum/react/more_react_concepts/refs_and_memoization.md
path: full-stack-javascript
course: React
order: 25
status: draft
generated: 2026-07-03
---

# Refs 與 Memoization

> 改寫自 The Odin Project：[Refs And Memoization](https://www.theodinproject.com/lessons/node-path-react-new-refs-and-memoization)
> ｜Full Stack JavaScript › React › More React Concepts

## 核心概念

先建立一個心智模型：在 React 裡，component（元件）本質上就是一個函式。當 state（狀態）或 props（屬性）改變，React 會重新呼叫這個函式來 re-render（重新渲染）。而每一次 re-render，函式主體內所有「不被 React 管理」的東西——區域變數、函式定義、計算結果——都會被丟棄並重新從頭執行一次。理解這件事之後，兩個問題自然浮現：其一，既然 React 是宣告式（declarative）的，那我還能不能像 vanilla JavaScript 那樣直接操作 DOM 元素？其二，如果某段計算很昂貴，每次 re-render 都重算一遍，會不會拖慢整個 app？這一課的 `useRef`、`useMemo`、`useCallback` 三個 hook，以及 React Compiler，就是為了回答這兩個問題。

### useRef：不觸發 render 的記憶

`useRef` 這個 hook 讓你保存一個「不參與 render」的值。它是 state 的另一種選擇：當你想讓 component 記住某個資訊，但**又不希望這個資訊改變時觸發重新 render**，就用 `useRef`。

`useRef(initialValue)` 回傳一個物件，這個物件只有一個屬性 `current`，初始值就是你傳入的參數。跟 `useState` 一樣，這個初始參數只在第一次 render 有作用，後續 render 會被忽略。ref 有兩個關鍵特性：

- **可變（mutable）**：你可以隨時對 `ref.current` 重新賦值，而且這個修改**不會**觸發 re-render。
- **跨 render 持久存在（persist）**：ref 的值不會因為 component 重新 render 而被銷毀重建，它會活過整個 component 的生命週期。

這正是它跟 `useState` 最大的差別：`useState` 管理的是「不可變」的 state，一旦更新就觸發 re-render；`useRef` 建立的是一個「可變參照」，更新它悄無聲息，不驚動 React。

### 用 useRef 操作 DOM

`useRef` 最常見的用途，是取得並直接操作 render 出來的 DOM 元素。想像頁面載入後，你希望自動聚焦（focus）某個按鈕。做法是：宣告一個 ref，把它掛到 JSX 元素的 `ref` 屬性上，React 就會在把該元素 commit（提交）到 DOM 之後，自動把對應的 DOM 節點塞進 `ref.current`。

你可能會疑惑：初始值明明是 `null`，為什麼在 effect 裡呼叫 `focus()` 卻不會爆炸？關鍵在於執行順序——**畫面的 render 與繪製（painting）先發生，React 的 `useEffect` 才執行**。等到 effect 跑起來時，React 早已把 ref 與真實 DOM 節點連結好了，所以 `ref.current` 已經是那顆按鈕，而不再是 `null`。

`useRef` 能做的遠不只 focus：捲動到特定位置、量測元素尺寸、觸發動畫……任何你以前用 vanilla JavaScript 做過的 DOM 操作都行。但有個重要原則：**只用它做「非破壞性」的 DOM 操作**。像是直接改寫元素文字內容這種「破壞性」動作，會與 React 對 DOM 的掌控產生衝突，應該避免。

那為什麼不乾脆用 `querySelector`？因為自己動手抓 DOM 就違背了使用 React 的初衷。只要情況允許，就該讓 React 自己去 commit DOM，我們只在真的需要跳脫宣告式模型時，才透過 ref 這道官方後門介入。

### memoization：把昂貴計算的結果快取起來

在深入 hook 之前，先記住一句軟體開發的名言：

> 過早最佳化是萬惡之源（Premature optimization is the root of all evil）—— Donald Knuth

意思是：很多時候你根本不需要最佳化，因為現代瀏覽器已經夠快。動手之前，先用 React 內建的 `Profiler` component 或 React Developer Tools 裡的 Profiler 量測真實效能，別憑感覺優化。

`useMemo` 這個 hook 讓你在 component 內部做 **memoization（記憶化）**。所謂 memoization，就是把一次昂貴計算的結果快取（cache）起來，之後只要輸入沒變就直接回傳快取值，不必重算。`useMemo(calculateValue, dependencies)` 接收兩個參數：一個負責計算的 callback，以及一個 dependencies（依賴）陣列——沒錯，參數形狀跟你熟悉的 `useEffect` 一模一樣。它會在 mount 時執行 callback，之後每次 re-render 只在 **dependencies 改變時**才重新計算，否則直接回傳上次快取的結果。

想像一個購物車的 `Cart` component，裡面用 `reduce` 把所有商品的 `price × quantity` 加總算出總價。這段計算寫在 component 主體裡，代表**每次 render 都會從頭算一遍**。如果購物車裡有成千上萬件商品，而使用者又頻繁開開關關購物車抽屜，每次開啟都重算同一個總價，體驗就會變得卡頓。把這段 `reduce` 包進 `useMemo`、並以 `[products]` 當依賴，就能讓總價只在 `products` 真的變動時才重算；反覆開關購物車而商品沒變時，直接吃快取。

### 參照相等（referential equality）與 memo

memoization 還有另一個關鍵用途：維持**參照相等**。JavaScript 裡，`{} === {}` 與 `(() => {}) === (() => {})` 都是 `false`——每次建立的物件或函式都是全新的參照。這在 React 裡會惹麻煩。

考慮一個 `Counter`，它在函式主體內定義了 `handleClick`，再把它當 `onClick` 傳給子元件 `ButtonComponent`。每次 `Counter` re-render，`handleClick` 都會被重新建立成一個全新函式，於是 `onClick` 這個 prop 的參照每次都不同。就算你用 `useMemo`（或後面會講的 `useCallback`）把 `handleClick` 快取成固定參照，`ButtonComponent` 仍然會跟著重新 render。原因是：**當一個 component 的 state 改變，它的所有子元件預設都會跟著 re-render**——換句話說，父元件 re-render，子元件就 re-render，跟 props 有沒有變無關。

要打破這個「向下傳播的更新」，需要 React 的 [`memo`](https://react.dev/reference/react/memo) 包裝函式。用 `memo` 把 `ButtonComponent` 包起來後，它就會在 re-render 前先對 props 做參照比較：**props 沒變就跳過 re-render**，即使父元件重新 render 了也一樣。

這時 `useMemo` 與 `memo` 才形成完整搭配：`memo` 負責「props 沒變就跳過」，而 `useMemo`／`useCallback` 負責「讓那個當作 prop 傳下去的函式或物件參照維持不變」。兩者缺一不可——只包 `memo` 但每次都傳新函式，參照比對照樣失敗；只用 `useMemo` 快取函式但子元件沒包 `memo`，子元件照樣被父元件連坐 re-render。這也是為什麼你常看到 Context API 的 `value` 被 `useMemo` 包起來：避免 Provider 每次 render 都送出一個全新物件，害所有 consumer 白白重繪。

### useCallback：專為函式而生的 memoization

`useCallback` 是另一種 memoization，但它**只能記憶函式**。回想前面用 `useMemo` 快取函式參照的寫法，會出現「回傳一個函式的函式」這種雙層箭頭，讀起來有點繞：

```jsx
const handleClick = useMemo(() => () => setCount((c) => c + 1), []);
```

`useCallback` 就是為了這個情境而生，你直接把函式本身交給它即可，少一層箭頭、更好讀。所以 `useMemo` 與 `useCallback` 的差別只在於**回傳值的型別**：`useMemo` 回傳 callback「執行後的結果」（任何型別的值），`useCallback` 回傳「那個 callback 函式本身」。實務準則：任何值用 `useMemo`，函式用 `useCallback`；兩者能做的事幾乎一樣，挑你喜歡的即可。

### React Compiler：自動 memoization

React Compiler 是一個相對新的**建置期（build-time）工具**，它會分析你的程式碼，自動幫適當的 component 與 hook 加上 memoization，主要目標是改善「更新既有 component」時的 re-render 效能。有了它，**多數情況下你不必再手動 memoize**。

那既然有自動化，還需要懂 `memo`、`useMemo`、`useCallback` 嗎？答案是肯定的。理解手動 memoization 能幫你看懂 React Compiler 在底層做了什麼；你也幾乎一定會在既有專案裡遇到手動寫法；而且有些情況你需要比編譯器更精細的控制，例如刻意穩住某個 `useEffect` 的依賴，確保它不會無謂變動而重複觸發 effect。這個「`useMemo` 與 `useCallback` 有什麼差別」也是熱門面試題，值得記牢。

## 程式碼範例

```jsx
// useRef 操作 DOM：頁面載入後自動 focus 按鈕
import { useRef, useEffect } from "react";

function ButtonComponent() {
  // useRef(null) 回傳 { current: null }；current 初始為 null
  const buttonRef = useRef(null);

  useEffect(() => {
    // effect 執行時，React 已把真實 DOM 節點連結到 current
    buttonRef.current.focus();
  }, []); // 空依賴：只在 mount 時跑一次

  // 把 ref 掛到 ref 屬性，建立 ref 與 DOM 的連結
  return <button ref={buttonRef}>Click Me!</button>;
}
```

```jsx
// useMemo 快取昂貴計算：只在 products 改變時才重算總價
import { useMemo } from "react";

function Cart({ products }) {
  const totalPrice = useMemo(() => {
    // 商品很多時，這段 reduce 很耗時
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  }, [products]); // 依賴：products 沒變就吃快取

  return (
    <p>
      Total Price: <strong>${totalPrice}</strong>
    </p>
  );
}
```

```jsx
// memo + useCallback：跳過不必要的子元件 re-render
import { useState, useCallback, memo } from "react";

// memo 包起來：onClick 參照沒變就跳過 re-render
const ButtonComponent = memo(({ children, onClick }) => {
  // 模擬「很重」的 render
  let i = 0;
  let j = 0;
  const ITERATION_COUNT = 10_000;
  while (i < ITERATION_COUNT) {
    while (j < ITERATION_COUNT) {
      j += 1;
    }
    i += 1;
    j = 0;
  }
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
});

function Counter() {
  const [count, setCount] = useState(0);

  // useCallback 讓 handleClick 參照跨 render 保持不變
  const handleClick = useCallback(
    () => setCount((prevState) => prevState + 1),
    []
  );

  return (
    <div>
      <h1>{count}</h1>
      {/* 現在 count 改變雖然讓 Counter re-render，
          但 onClick 參照不變、ButtonComponent 有 memo，
          所以那段很重的迴圈不會重跑 */}
      <ButtonComponent onClick={handleClick}>Click me!</ButtonComponent>
    </div>
  );
}
```

```jsx
// 用 useMemo 穩住 Context 的 value 物件參照
const value = useMemo(
  () => ({ someState, someFunction }),
  [someState, someFunction]
);

return <Context value={value}>{children}</Context>;
```

## 常見陷阱

!!! warning "別用 ref 做破壞性 DOM 操作"
    `useRef` 只該用於 focus、捲動、量測尺寸這類「非破壞性」操作。如果你用 ref 直接改寫由 React 管理的元素內容（例如改 `textContent`、增刪子節點），會和 React 對 DOM 的掌控衝突，下一次 render 你的修改可能被覆蓋，或造成畫面與資料不一致。需要改變畫面內容時，請改用 state 走宣告式流程。

!!! warning "只包 memo 或只包 useCallback 都沒用"
    要跳過子元件的 re-render，`memo` 與 `useCallback`／`useMemo` 必須「成對」使用。只用 `memo` 包子元件、卻每次傳一個全新建立的函式或物件當 prop，參照比對照樣失敗、照樣重繪；反過來只用 `useCallback` 穩住函式參照、子元件卻沒包 `memo`，子元件仍會因父元件 re-render 而連坐重繪。兩者缺一不可。

!!! warning "不要過早最佳化"
    `useMemo` 與 `useCallback` 本身也有成本（記住依賴、做比較），並非包了就一定更快。多數計算其實快到不需要優化。動手前先用 Profiler 量測，確認真的有效能瓶頸再 memoize，否則只是徒增程式碼複雜度。導入 React Compiler 後，這類手動優化在多數情況下更可以省下。

## 練習

以下取自原文的 Assignment，改寫成可依序完成的步驟。部分為外部深入閱讀，請前往原連結：

1. 閱讀 Kent C. Dodds 的文章〈When to useMemo and useCallback〉，它用更多例子說明「什麼時候該用、什麼時候根本不必用」`useMemo` 與 `useCallback`。
2. 我們只示範了 `useRef` 最基礎的用法。到 React 官方文件的 [`useRef` 互動指南](https://react.dev/reference/react/useRef) 看更多範例，並了解使用這個 hook 時該注意的地方。
3. 想更安全地存取與修改 DOM 節點，讀 React 官方文件 [Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs)。
4. `useRef` 不只用於 DOM 操作。讀 Dan Abramov 的〈Making setInterval Declarative with React Hooks〉，認識它的其他用途。
5. 讀 [React Compiler 官方文件](https://react.dev/learn/react-compiler)，了解它的原理，以及如何在專案中安裝與設定。
6. 動手實作：把 The Odin Project 的 [react-examples repo](https://github.com/TheOdinProject/react-examples) fork 並 clone 下來，`cd` 進 `memoization/` 目錄，執行 `npm install` 再 `npm run dev`。實際玩玩看兩種情境：傳「每次新建的 `handleClick`」時，即使子元件有 `memo` 也照樣 re-render（參照比對失敗）；傳「memoized 的 handler」時，子元件就不再 re-render（參照比對通過）。動手改、動手弄壞它，觀察差異。

## 原文與延伸資源

- 原文：[Refs And Memoization](https://www.theodinproject.com/lessons/node-path-react-new-refs-and-memoization)
- 本課引用：
    - [useRef 官方參考](https://react.dev/reference/react/useRef)
    - [useMemo 官方參考](https://react.dev/reference/react/useMemo)
    - [useCallback 官方參考](https://react.dev/reference/react/useCallback)
    - [memo 官方參考](https://react.dev/reference/react/memo)
    - [Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs)
    - [React Compiler 官方文件](https://react.dev/learn/react-compiler)
    - [Profiler component](https://react.dev/reference/react/Profiler)

---

> 本講義改寫自 The Odin Project《Refs And Memoization》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
