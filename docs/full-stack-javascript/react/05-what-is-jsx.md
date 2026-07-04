---
title: 什麼是 JSX
source_url: https://www.theodinproject.com/lessons/node-path-react-new-what-is-jsx
source_file: vendor/curriculum/react/getting_started_with_react/what_is_jsx.md
path: full-stack-javascript
course: React
order: 5
generated: 2026-07-03
---

# 什麼是 JSX

> 改寫自 The Odin Project：[What Is JSX?](https://www.theodinproject.com/lessons/node-path-react-new-what-is-jsx)
> ｜Full Stack JavaScript › React › Getting Started With React

## 核心概念

在先前的 React 課程裡，你已經寫過類似 `<h1>Hello</h1>` 這種夾在 JavaScript 檔案中的「看起來像 HTML」的程式碼。那段語法就是 **JSX**。這一課要把它講清楚：JSX 是什麼、我們為什麼要用它、以及怎麼正確使用它。

### JSX 是什麼

JSX 是 JavaScript 的一種 **syntax extension（語法擴充）**，讓你可以在 JavaScript 檔案裡寫出「像 HTML 的標記（markup）」。它並不是 React 強制要求的東西，你完全可以不用 JSX 也寫得出 React component（元件），但用了 JSX 會讓 component 的寫法更簡潔、更好讀。

關鍵觀念是：**JSX 只是語法糖（syntactic sugar）**。瀏覽器看不懂 JSX，它必須先被工具（例如 Babel、Vite）編譯（compile）成純 JavaScript。JSX 背後真正被呼叫的是 React 的 `createElement` 函式，這個函式會回傳一個 **React element**，而 React element 其實只是一個普通的 JavaScript 物件（plain object）。

換句話說，下面這兩段程式碼是等價的。你寫 JSX：

```jsx
const element = <h1 className="greeting">Hello</h1>;
```

編譯後大致會變成：

```js
const element = React.createElement("h1", { className: "greeting" }, "Hello");
```

而 `React.createElement(...)` 執行後，得到的只是一個描述 UI 長相的物件，概念上像這樣：

```js
// React.createElement 回傳的物件（簡化示意）
const element = {
  type: "h1",
  props: { className: "greeting", children: "Hello" },
  // ...React 內部還會加上其他欄位
};
```

所以當你在 console 印出一個 JSX element（例如一個帶文字的 `<div>`），你看到的不會是一段 HTML 字串，而是一個 JavaScript 物件。這正好證明了：JSX 最終會被編譯成「純 JavaScript 物件」。理解這一點很重要，因為它解釋了後面很多 JSX 的規則——JSX 的屬性其實會變成物件的 key（鍵），這就是為什麼有些寫法在 HTML 合法、在 JSX 卻不合法。

### 為什麼要用 JSX

在傳統的網頁開發裡，我們習慣把「畫面標記（HTML）」和「邏輯（JavaScript）」放在不同的檔案，藉此「分離關注點（separation of concerns）」。但實際上，在應用程式中，**渲染邏輯與畫面內容天生就是綁在一起的**：某個按鈕要不要顯示、清單要 render（渲染）幾個項目、某段文字要顯示什麼，這些都同時牽涉到邏輯與標記。

React 的做法是換一個角度切分關注點：不再依「檔案類型（HTML 一份、JS 一份）」來分，而是依「功能單位」來分——把某一塊 UI 的渲染邏輯與它的內容，一起放進同一個 component 裡。JSX 就是讓這件事變得自然的語法：你可以在同一個地方，同時描述「這塊畫面長怎樣」與「它的邏輯怎麼跑」。

除此之外，用 JSX 還有兩個好處：一是它更直覺、更視覺化，你在程式碼裡就能「看見」UI 的結構；二是因為 JSX 會被編譯，React 得以在編譯與執行階段給出更有用的錯誤與警告訊息，幫你更快抓到問題。

### JSX 的三條規則

如果你把一段合法的 HTML 直接複製貼進 React component，它多半不會動。原因是 JSX 有幾條 HTML 沒有的規則。記住這三條，你就能避開絕大多數新手常見的錯誤。

**規則一：只能回傳單一根元素（single root element）。**

一個 component 最終只能回傳「一個」最外層的 element。如果你想回傳多個並排的 element，就必須用一個父層標籤把它們包起來。這個父層可以是 `<div>`，但若你不想在 DOM 裡多出一個沒有意義的容器，可以改用 **React fragment（片段）**，寫法是空標籤 `<>...</>`。

為什麼有這條規則？回想前面說的：JSX 會被編譯成 `createElement` 呼叫，而一個函式的 `return` 只能回傳一個值。兩個並排的 element，等於要求函式一次回傳兩個東西，這在 JavaScript 是做不到的。用一個父層或 fragment 包起來，就變成回傳「一個包含子元素的 element」。

**規則二：所有標籤都要閉合（close all tags）。**

在 HTML 裡，有些標籤可以自我閉合或不寫結尾，例如 `<input>` 或 `<li>` 常常不寫關閉標籤。但在 JSX 裡，每個標籤都必須明確閉合。像 `<input>` 這種沒有子元素的標籤，要寫成自閉合形式 `<input />`；像 `<li>` 這種，要補上結尾寫成 `<li></li>`。

**規則三：大部分屬性改用 camelCase（駝峰式命名）。**

因為 JSX 會變成 JavaScript，element 的屬性（attribute）會變成 JavaScript 物件的 key，所以你不能使用連字號（dash，例如 `stroke-width`），也不能使用 JavaScript 的保留字（reserved word，例如 `class`）。於是許多 HTML 屬性在 JSX 裡改用 camelCase：`stroke-width` 要寫成 `strokeWidth`，而 HTML 的 `class` 要寫成 `className`。

規則三的措辭是「**大部分**（Most）」而非「全部」，這是有意的。有些屬性刻意保留了原本的寫法，最常見的例外是 **`data-*` 與 `aria-*` 屬性**：它們仍然用連字號，例如 `data-index`、`aria-label`，不需要改成 camelCase。所以請把規則三理解成「大多數要 camelCase，但少數例外照舊」。

## 程式碼範例

下面示範把一段普通 HTML「逐步修正」成合法 JSX 的完整過程。這正是你日後把設計稿或現成 HTML 搬進 React 時會做的事。

原始 HTML（直接丟進 component 會噴一堆錯誤）：

```jsx
// 問題：多個並排根元素、input 沒閉合、stroke-width 用了連字號
<h1>Test title</h1>
<svg>
  <circle cx="25" cy="75" r="20" stroke="green" stroke-width="2" />
</svg>
<form>
  <input type="text">
</form>
```

第一步，套用規則一：用一個 `<div>` 把所有元素包成單一根元素。

```jsx
<div>
  <h1>Test title</h1>
  <svg>
    <circle cx="25" cy="75" r="20" stroke="green" stroke-width="2" />
  </svg>
  <form>
    <input type="text">
  </form>
</div>
```

第二步，套用規則二：把沒閉合的 `<input>` 改成自閉合的 `<input />`。

```jsx
<div>
  <h1>Test title</h1>
  <svg>
    <circle cx="25" cy="75" r="20" stroke="green" stroke-width="2" />
  </svg>
  <form>
    <input type="text" />
  </form>
</div>
```

第三步，套用規則三：把連字號屬性 `stroke-width` 改成 camelCase 的 `strokeWidth`。

```jsx
<div>
  <h1>Test title</h1>
  <svg>
    <circle cx="25" cy="75" r="20" stroke="green" strokeWidth="2" />
  </svg>
  <form>
    <input type="text" />
  </form>
</div>
```

到這裡，三條規則都套用完畢，這段就是可以直接放進 React component、不會報錯的合法 JSX 了。放進一個完整 component 看起來像這樣：

```jsx
function App() {
  return (
    <div>
      <h1>Test title</h1>
      <svg>
        <circle cx="25" cy="75" r="20" stroke="green" strokeWidth="2" />
      </svg>
      <form>
        <input type="text" />
      </form>
    </div>
  );
}
```

一個小提醒：如果你不想多包一層 `<div>`，把最外層的 `<div>` 換成 fragment `<>...</>` 也完全可以，兩者都滿足「單一根元素」的要求，差別只在 fragment 不會在最終的 DOM 產生額外節點。

## 常見陷阱

!!! warning "先修好一個錯誤，才會看到下一個"
    照上面的順序修正時，你會發現：修好「單一根元素」後，畫面上冒出了新的錯誤訊息；再修好「閉合標籤」後，錯誤又換到 console 去了。這**不代表**你的修改製造了新錯誤，只是 React 一次通常只把最前面那個問題攤開給你看，前面的擋住後面的。看到新錯誤別慌，那往往代表你上一步修對了。

!!! warning "class 要寫成 className，for 要寫成 htmlFor"
    這是從 HTML 搬程式碼過來時最容易踩的雷。`class` 是 JavaScript 的保留字，在 JSX 必須寫成 `className`；同理，`<label>` 的 `for` 要寫成 `htmlFor`。忘了改通常不會讓程式整個壞掉，但樣式會套不上、或 console 出現警告，很難一眼看出原因。

!!! warning "不是所有屬性都要 camelCase"
    規則三是「**大部分**」而非「全部」。`data-*` 與 `aria-*` 這類屬性仍然保留連字號寫法（例如 `data-id`、`aria-hidden`），不要自作聰明改成 `dataId` 或 `ariaHidden`，那樣反而會失效。

## 練習

以下作業出自 The Odin Project。之後的課程會大量請你閱讀 React 官方文件，文件多半在結尾附有小練習——課程不會每次都提醒你，但請務必動手做，熟能生巧。

1. 閱讀 React 官方文件的 [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)，複習本課涵蓋的內容（JSX 是什麼、為什麼用它、以及三條規則）。
2. 閱讀 React 官方文件的 [JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces)，認識如何在標記中用大括號 `{ }` 寫 JavaScript 邏輯、以及引用動態值（dynamic value）。

自我檢測（讀完若答不出來，回頭複習對應段落即可，不需要背起來）：

- JSX 是什麼？
- 我們為什麼要用 JSX？
- JSX 的三條規則各是什麼？
- 如何在 JSX 裡引用一個動態值？（提示：用大括號 `{ }`，細節見上面第 2 篇文件）

## 原文與延伸資源

- 原文：[What Is JSX?](https://www.theodinproject.com/lessons/node-path-react-new-what-is-jsx)
- 本課引用：
  - React 官方文件 - [createElement](https://react.dev/reference/react/createElement)
  - React 官方文件 - [Fragment](https://react.dev/reference/react/Fragment)
  - React 官方文件 - [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)
  - React 官方文件 - [JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces)
  - 線上即開即用的 React 環境：[react.new](https://react.new/)

---

> 本講義改寫自 The Odin Project《What Is JSX?》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
