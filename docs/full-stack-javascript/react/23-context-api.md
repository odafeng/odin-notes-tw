---
title: 用 Context API 管理狀態
source_url: https://www.theodinproject.com/lessons/node-path-react-new-managing-state-with-the-context-api
source_file: vendor/curriculum/react/more_react_concepts/managing_state_with_context_api.md
path: full-stack-javascript
course: React
order: 23
status: draft
generated: 2026-07-03
---

# 用 Context API 管理狀態

> 改寫自 The Odin Project：[Managing State With The Context API](https://www.theodinproject.com/lessons/node-path-react-new-managing-state-with-the-context-api)
> ｜Full Stack JavaScript › React › More React Concepts

## 核心概念

到目前為止，我們管理 state（狀態）的方法就是「把 state 提升到共同的父層，再用 props（屬性）一層一層往下傳」。這在小型應用裡運作良好，但只要應用一長大，你就會發現這套做法開始變得又囉嗦又難維護。這一課要介紹 React 的 **Context API**，它讓你可以把資料「直接」送到樹狀結構深處的任何 component（元件），不必再經手中間每一層。

### 先看看問題：prop drilling（屬性鑽透）

想像我們在做一個購物網站的商品詳情頁。頁面頂端的 header 有一個購物車圖示，上面顯示目前車內的商品數量；頁面中間有商品資訊，還有一顆「加入購物車」的按鈕。

購物車的內容需要被「header 的計數器」和「加入購物車按鈕」同時共享。我們早就學過，要讓 state 在多個 component 之間共享並持續存在，就得把 state [提升到共同的祖先](https://react.dev/learn/sharing-state-between-components)。所以我們的 `App` 大概長這樣：

```jsx
// App.jsx
import { useState } from "react";
// Header 與 ProductDetail 的 import 省略

export default function App() {
  const [cartItems, setCartItems] = useState([
    /* 購物車裡的商品清單 */
  ]);
  const products = /* 某個自訂 hook，抓取並回傳商品資料 */;

  const addToCart = (product) => {
    // 加入購物車的邏輯（會更新 cartItems）
  };

  return (
    <>
      <Header cartItemsCount={cartItems.length} />
      <ProductDetail addToCart={addToCart} products={products} />
    </>
  );
}
```

`Header` 收到 `cartItemsCount` 之後，自己其實不用，還得再往下傳給真正要用的 `Links`：

```jsx
// Header.jsx
function Links({ cartItemsCount }) {
  return (
    <ul>
      {/* 其他連結 */}
      <li>
        <Link to="購物車的連結">
          <span>Cart</span>
          <div className="cart-icon">{cartItemsCount}</div>
        </Link>
      </li>
    </ul>
  );
}

export default function Header({ cartItemsCount }) {
  return (
    <header>
      {/* 其他 header 元素 */}
      <nav>
        <Links cartItemsCount={cartItemsCount} />
      </nav>
    </header>
  );
}
```

看到重點了嗎？`cartItemsCount` 的旅程是 `App` → `Header` → `Links`。`Header` 根本沒用到這個值，卻被迫當「傳聲筒」，只是為了把它交給孫子層的 `Links`。這種「某個 prop 明明中間層用不到，卻得一層一層硬傳下去」的現象，就叫做 **prop drilling（屬性鑽透）**。

在這個迷你範例裡，prop drilling 還算能忍。但真實應用會不斷長大：商品詳情頁可能還會多出 `Cart` 元件、`ProductListing` 元件；功能也不會只有 `addToCart`，還會有「移除商品」「調整數量」「清空購物車」……。因為 component-based（元件化）的框架鼓勵我們把畫面切成一個個可重用的小元件，巢狀層級只會越來越深，要傳的 props 也越來越多。每加一個功能，就要多穿過好幾層元件，程式很快就變得又臃腫又難改。

### 解法：Context API 的三個關鍵角色

Context API 讓你把資料放進一個「context（情境）」裡，然後任何被包在這個 context 底下的元件——不論巢狀多深——都能「直接」拿到資料，中間層完全不用經手。要用它，你需要認識三個角色：

1. **`createContext`** —— 顧名思義，就是「建立 context」。它接受任意一個值（數字、字串、物件都行），這個值稱為 context 的 **default value（預設值）**，並回傳一個 context 物件，讓我們拿來往下傳資料。
2. **`useContext`** —— 這個 hook 用來「消費」context 裡的資料。在任何元件裡呼叫它、把 context 物件當參數傳進去，就能取出資料。
3. **context 物件本身** —— 這個由 `createContext` 回傳的物件，可以當成一個 component 來用。它接受一個叫 `value` 的 prop，這就是真正要往下送的值。你用它把子元件包起來，被包住的元件就能透過 `useContext` 拿到這個 `value`。

> **關於 React 19 的寫法變化**：在 React 19 之前，我們用 `<ShopContext.Provider value={...}>` 來提供 context 值；從 React 19 起，可以直接把 context 物件當元件用：`<ShopContext value={...}>`。本課採用 React 19 的新寫法，但如果你在別處看到 `.Provider`，兩者意思相同。我們下面仍會用「Provider（提供者）」這個詞來稱呼「提供 context 值的那一層」。

### 第一步：建立 context

`createContext` 從 `react` 模組匯入：

```javascript
import { createContext } from "react";
```

建立 context 時可以給它一個預設值。以我們的購物車為例，用一個物件當預設值會很方便：

```javascript
const ShopContext = createContext({
  products: [],
  cartItems: [],
  addToCart: () => {},
});
```

這個預設值是一個物件，有三個屬性：`products`、`cartItems` 是陣列，分別放商品與購物車內容；`addToCart` 是一個函式，用來把商品加進購物車。

其實這個物件不是必要的，你完全可以這樣寫，程式一樣能跑：

```javascript
const ShopContext = createContext(null);
```

那為什麼還要特地填一個物件當預設值？有兩個好處：

- **安全網**：萬一你在「沒有被 Provider 包住」的元件裡用了這個 context，因為有預設值，程式不會直接壞掉（這對寫測試也很方便，你不用每次都把元件包進 Provider 才能拿到值）。
- **編輯器提示**：當預設值是物件時，IDE 能根據物件的形狀給你自動補全（auto-completion），寫起來更順手。

要提醒的是：**這個預設值是靜態的、不會變**。只有在「元件外面沒有任何 Provider」時，`useContext` 才會退回讀這個預設值。只要元件被包在 Provider 底下，實際拿到的就是 Provider 上 `value` 傳的值——預設值會被覆蓋。所以要不要填物件，看你自己，反正正常情況下都會被 `value` 覆蓋掉。

### 第二步：用 context 物件當元件，提供 value

有了 context，接下來就是把它當成元件、把子元件包進去，並透過 `value` prop 把資料注入。注意這次我們把原本那些 props 全部拿掉了：

```jsx
// App.jsx
import { useState, createContext } from "react";
// Header 與 ProductDetail 的 import 省略

export const ShopContext = createContext({
  products: [],
  cartItems: [],
  addToCart: () => {},
});

export default function App() {
  const [cartItems, setCartItems] = useState([
    /* 購物車裡的商品清單 */
  ]);
  const products = /* 某個自訂 hook，抓取並回傳商品資料 */;

  const addToCart = (product) => {
    // 加入購物車的邏輯（會更新 cartItems）
  };

  return (
    // 把想注入子元件的東西，透過 value prop 傳下去
    // 這個 value 會覆蓋掉 createContext 的預設值
    <ShopContext value={{ cartItems, products, addToCart }}>
      <Header />
      <ProductDetail />
    </ShopContext>
  );
}
```

留意我們把 `ShopContext` 用 `export` 匯出，因為子元件要 import 它才能 `useContext`。而且注意到了嗎？`<Header />` 和 `<ProductDetail />` 上一個 prop 都沒有了——資料改由 context 傳遞。

### 第三步：用 useContext 消費資料

現在回頭改 `Header`。我們把先前那些 props 全刪掉，改用從 `react` 匯入的 `useContext` hook，直接在真正需要資料的 `Links` 元件裡取出 `cartItems`：

```jsx
// Header.jsx
import { useContext } from "react";
// import ShopContext
// import Link

function Links() {
  const { cartItems } = useContext(ShopContext); // 必須把 ShopContext 物件本身當參數傳進去

  return (
    <ul>
      {/* 其他連結 */}
      <li>
        <Link to="購物車的連結">
          <span>Cart</span>
          <div className="cart-icon">{cartItems.length}</div>
        </Link>
      </li>
    </ul>
  );
}

export default function Header() {
  return (
    <header>
      {/* 其他 header 元素 */}
      <nav>
        <Links />
      </nav>
    </header>
  );
}
```

prop drilling 就這樣被徹底消滅了。`Header` 不再需要當傳聲筒，`Links` 直接向 context 拿 `cartItems`——只要它被包在 Provider 底下，不管巢狀多深都拿得到。

`ProductDetail` 也如法炮製：

```jsx
// ProductDetail.jsx
import { useContext } from "react";
// import ShopContext

export default function ProductDetail() {
  const { products, addToCart } = useContext(ShopContext);
  const product = products.find(/* 找出特定商品的邏輯 */);

  return (
    <div>
      {/* 商品圖片 */}
      <div>
        {/* 其他符合設計的元素 */}
        <button type="button" onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
```

在 `Header` 裡我們用 `useContext` 拿到了 `cartItems`；在 `ProductDetail` 裡我們拿到了 `products` 和 `addToCart`。整套改完後，`App` 不必再把 props 一層層往下傳，各元件想要什麼就自己去 context 拿。這讓資料流更集中（所有共享資料都放在同一處）、程式更乾淨、也更好推理。

### Context API 的缺點

Context API 很強大，但不是免費午餐，用之前要知道它的兩個代價：

1. **可能造成效能問題**：當 context 裡的值更新時，**所有消費這個 context 的元件都會重新渲染**，就算某個元件用到的那部分資料根本沒變也一樣。如果有很多元件都消費同一個大 context，這種「連坐式重新渲染」可能拖慢效能。
2. **可能讓程式更難追蹤**：因為任何元件都能輕易地從 context 拿到 state，資料「從哪來、被誰改」變得不那麼一目瞭然。一旦有很多巢狀元件都在消費同一個 context，程式的可讀性反而會下降。保持結構清楚、組織良好很重要。

### 可能的解法

1. **拆成多個小 context，而不是一個大 context**：與其用一個巨型 context 管所有 state，不如依「相關性」把 state 拆進多個小 context。這能減少「消費同一個 context 的元件數量」，也就減少了不必要的重新渲染。
2. **有時 Context API 根本不是最佳解**：像元件組合（component composition）這種模式，往往能在不引入 context 的情況下解掉 prop drilling。
3. **改用外部狀態管理工具**：像 [Zustand](https://github.com/pmndrs/zustand) 或 [Redux](https://redux.js.org/) 這類函式庫，內建大量效能最佳化、功能也豐富，缺點是有學習曲線。在本課程接下來的專案裡，我們建議先繼續用 Context API 就好——對我們要做的大多數專案而言，它已經夠可靠了。

## 程式碼範例

前面的購物車片段刻意省略了很多細節。這裡給一個**最小、可完整跑起來**的範例，把 `createContext`、Provider、`useContext` 三步走完整走一遍，還示範了「context 值可以是會變動的 state」。

```jsx
// main.jsx / App.jsx（單檔示範）
import { createContext, useContext, useState } from "react";

// 1) 建立 context，預設值填一個和實際形狀相符的物件（好處：安全網 + IDE 提示）
const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

// 3) 深層子元件：直接用 useContext 取值，中間層完全不用經手
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      type="button"
      onClick={toggleTheme}
      style={{
        background: theme === "light" ? "#fff" : "#222",
        color: theme === "light" ? "#222" : "#fff",
      }}
    >
      目前主題：{theme}（點我切換）
    </button>
  );
}

// Toolbar 只是中間層，它完全不知道 theme 的存在，也不用傳任何 prop
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // 2) 用 context 當元件把子樹包起來，透過 value 把「會變的 state」注入
  return (
    <ThemeContext value={{ theme, toggleTheme }}>
      <h1>Context API 示範</h1>
      <Toolbar />
    </ThemeContext>
  );
}
```

執行後畫面上會有一顆按鈕，點下去主題就在 `light` / `dark` 之間切換。重點在於：`App` 沒有把 `theme` 或 `toggleTheme` 當 prop 傳給 `Toolbar`，`Toolbar` 也沒有再傳給 `ThemedButton`——真正需要資料的 `ThemedButton` 自己用 `useContext(ThemeContext)` 就拿到了。當 `theme` 這個 state 改變，Provider 的 `value` 跟著變，所有消費 `ThemeContext` 的元件就會重新渲染、顯示新主題。

> 若你用的是 React 19 之前的版本，把 `<ThemeContext value={...}>` 改成 `<ThemeContext.Provider value={...}>` 即可，其餘完全相同。

## 常見陷阱

!!! warning "把「靜態預設值」誤當成「會變的狀態來源」"
    `createContext(defaultValue)` 的預設值是**靜態的、永遠不變**，而且只有在元件「外面完全沒有 Provider」時才會被讀到。只要元件被包在 Provider 底下，`useContext` 拿到的一定是 Provider 上 `value` 傳的值。想讓 context 的內容隨著互動而改變，變動的來源必須是 Provider 那一層的 `useState`（或 `useReducer`），透過 `value` 注入——而不是去期待預設值會跟著變。

!!! warning "在 Provider 外面使用 context，卻拿到「意料之外」的值"
    如果某個呼叫 `useContext` 的元件不小心被渲染在 Provider 之外，它不會報錯，而是「安靜地」退回讀那個靜態預設值。要是你當初把預設值設成 `null`，接著又對它做 `null.cartItems`，就會踩到 runtime error。所以：預設值最好設成和真實資料「形狀相符」的物件當安全網，或在讀取時做防呆判斷。

!!! warning "所有消費者都會一起重新渲染"
    更新 context 的 `value` 會讓**每一個**消費該 context 的元件重新渲染，即使它用到的那部分資料沒變。把不相關的狀態塞進同一個大 context，容易造成大範圍的多餘渲染。解法是依關聯性拆成多個小 context，讓每個 context 的變動只影響真正相關的元件。

!!! warning "誤把「值」而不是「context 物件」傳給 useContext"
    `useContext` 要吃的是 `createContext` 回傳的那個 **context 物件本身**，也就是 `useContext(ShopContext)`，不是 `useContext(ShopContext.value)`、也不是任何從裡面取出來的欄位。傳錯東西進去會拿不到預期的資料。

## 練習

1. 打開 React 官方文件的 [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)。這篇提供了更完整、更有互動性的範例，也介紹了 context 的一些最佳化技巧。請**動手把每個範例都跑過一遍**，特別留意它示範的「什麼時候該用 context、什麼時候不該用」。
2. 讀 Kent C. Dodds 的短文 [Prop Drilling](https://kentcdodds.com/blog/prop-drilling)。這篇用很好消化的例子，帶你理解 prop drilling 會造成哪些問題、又有哪些方法（不只 context）可以避免它。
3. 讀完後試著回答這幾個問題，檢查自己是否吸收：prop drilling 會造成什麼問題？我們可以怎麼避免它？比起「一路用 props 往下傳」，用 Context API 有什麼好處？Context API 又有哪些缺點？

## 原文與延伸資源

- 原文：[Managing State With The Context API](https://www.theodinproject.com/lessons/node-path-react-new-managing-state-with-the-context-api)
- 本課引用：
  - [React 官方文件：Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
  - [React 官方文件：Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
  - [Kent C. Dodds：Prop Drilling](https://kentcdodds.com/blog/prop-drilling)
  - [Robin Wieruch：React Component Composition](https://www.robinwieruch.de/react-component-composition/)
  - 外部狀態管理：[Zustand](https://github.com/pmndrs/zustand)、[Redux](https://redux.js.org/)

---

> 本講義改寫自 The Odin Project《Managing State With The Context API》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
