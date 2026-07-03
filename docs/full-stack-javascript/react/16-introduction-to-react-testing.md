---
title: React 測試入門
source_url: https://www.theodinproject.com/lessons/node-path-react-new-introduction-to-react-testing
source_file: vendor/curriculum/react/react_testing/introduction_to_react_testing.md
path: full-stack-javascript
course: React
order: 16
status: draft
generated: 2026-07-04
---

# React 測試入門

> 改寫自 The Odin Project：[Introduction To React Testing](https://www.theodinproject.com/lessons/node-path-react-new-introduction-to-react-testing)
> ｜Full Stack JavaScript › React › React Testing

## 核心概念

在前面的課程裡，你已經寫過 vanilla JavaScript 的測試，也體驗過測試如何讓程式碼更好維護、更容易改動。那時候我們用的是 [Jest](https://jestjs.io/) 這套框架。到了 React，因為專案是用 [Vite](https://vitejs.dev/) 建立的，我們會改用 [Vitest](https://vitest.dev/) 當**測試執行器（test runner）**——它跟 Vite 共用設定、整合得非常順。除此之外，我們還要加上 [React Testing Library（簡稱 RTL）](https://testing-library.com/docs/react-testing-library/intro/)，讓我們能對 component（元件）畫出來的畫面做測試。

### 為什麼要測試 UI

在 Battleship 那個 project 裡，你寫的測試多半只針對底層的遊戲邏輯，完全沒有碰到 DOM。這種測試很有價值，但它有個盲點：**邏輯正確不代表畫面正確**。你的 Battleship 遊戲底層可能運作得完美無缺，但畫面上不一定真的顯示出你想要的內容，也不一定讓使用者能照你設計的方式互動。

更現實的問題是：每次你改動程式碼（不管改的是不是 UI），你不可能每次都手動把所有相關的畫面重新點一遍、確認它們都還正常。**UI 測試**就是來補這個洞的——它讓我們更有信心：網站顯示的是我們想要的內容、行為符合我們的預期；而一旦某個東西不再符合要求，測試會立刻告訴我們。舉例來說，你把某個 state（狀態）的結構從物件改成陣列，結果某個清單不再顯示應有的文字；或者你在某個 component 裡多加了一個條件判斷，結果拖放卡片的最後三個放置區突然失效了。網站越複雜，好測試（不論 UI 或非 UI）的價值就越高。

### 需要哪些套件

跟著 [Robin Wieruch 的 Vitest + RTL 設定教學](https://www.robinwieruch.de/vitest-react-testing-library/)完成環境設定後，我們再加裝一個小套件：

```bash
npm install @testing-library/user-event --save-dev
```

現在把幾個關鍵套件的用途講清楚，重點放在 `@testing-library` 這一系列：

- **`@testing-library/react`**：提供像 `render` 這樣的核心函式，讓我們能在測試裡「畫出」一個 component。
- **`@testing-library/jest-dom`**：提供一組好用的**自訂 matcher（斷言函式）**，例如 `toBeInTheDocument`。Jest／Vitest 本身已內建很多 matcher，所以這套並非強制，但它讓測試讀起來更貼近人話。
- **`@testing-library/user-event`**：提供 `userEvent` API，用來**模擬使用者與網頁的互動**（點擊、輸入、鍵盤操作等）。

一個 lesson-note 提醒：即使你照設定教學在 `vite.config.js` 裡設了 `globals: true`，ESLint 仍然不認得 `describe`、`it`、`expect` 這些全域變數，會對你報錯。最直接的解法是**在每個測試檔明確 import 你要用的東西**（就像下面範例那樣從 `vitest` import），這樣也就不需要 `globals: true` 了。

### 第一個查詢：render 與 screen

測試 component 的第一步，是用 `render` 把它畫出來。這裡的「畫出來」你不會看到任何畫面——RTL 設定時裝的 `jsdom` 會在記憶體裡模擬出一份 DOM（含事件），但不會像真正的瀏覽器那樣把畫面排版出來。這已經足夠讓我們去查詢、斷言 component 的內容了。這跟真正跑一個瀏覽器環境的 end-to-end 測試不同，也單純得多。

畫出 component 之後，我們透過 `screen` 這個物件去**查詢（query）**畫面上的元素。`screen` 帶著所有查詢方法，用它的好處是：你不必去維護 `render` 回傳值的解構、也不必擔心解構有沒有跟上。所以**優先用 `screen` 來查詢**，而不是去解構 `render`。

查詢方法有一打之多，但它們大致分成三大類，差別在於「找不到」或「非同步」時的行為：

- **`getBy...`**：立刻查詢，**找不到就丟出錯誤**。用在「這個元素應該存在」的情況。
- **`queryBy...`**：立刻查詢，**找不到回傳 `null`**（不報錯）。這是唯一適合用來斷言「某元素**不存在**」的一類。
- **`findBy...`**：回傳一個 **Promise**，會等到元素出現（預設等一段時間）才 resolve。用在「元素會非同步出現」的情況，搭配 `await`。

而在「用哪個屬性去找」上，RTL 有明確的**優先順序（priority）**：最推薦用 **`ByRole`**，尤其搭配 `name` 選項。這是因為 `ByRole` 是依照元素的**無障礙角色（accessibility role）**來查詢，等於順便確認了你的 UI 對所有使用者（不論用滑鼠還是輔助技術）都是可存取的。例如查一個標題，與其只寫 `getByRole("heading")`，更精準的寫法是 `getByRole("heading", { name: "Our First Test" })`。

### 模擬使用者互動

使用者跟網頁互動的方式很多。真實的使用者回饋當然無可取代，但我們仍能透過測試建立對 component 的信心。要模擬互動，就用前面裝的 `userEvent`：

1. 先用 `userEvent.setup()` 建立一個 `user` 實例（要在 `render` 之前呼叫）。
2. 用 `screen` 查到目標元素（例如按鈕）。
3. 用 `await user.click(button)` 模擬點擊。

注意每個互動方法（`click`、`type`…）都回傳 Promise，所以要 `await`，測試的 callback 也必須宣告成 `async`。這是因為互動可能觸發 state 更新與重新 render，我們要等這些都跑完，再做斷言。

還有一個關鍵行為：**每個測試跑完後，RTL 會自動把畫出來的 component 卸載（unmount）**。這就是為什麼每個測試都要各自 `render` 一次——上一個測試的畫面不會殘留到下一個測試。如果一個 component 有很多測試，寫一個共用的 `setup` 函式會很方便。

### 什麼是 snapshot 測試

**snapshot（快照）測試**做的事很單純：把 component 目前畫出來的結果，跟一份「快照檔」做比對。第一次跑 `toMatchSnapshot()` 時，Vitest 會自動產生一個快照檔（component 的 HTML 表示）；之後每次跑，都拿當下的畫面跟這份快照比。只要 component 的輸出有任何一點不同，測試就失敗。

**snapshot 的優點**：又快又好寫，一個斷言就抵好幾行程式碼。例如用一個 `toMatchSnapshot`，你就不必分別斷言按鈕存在、標題存在……。它也能防止「沒預期到的改動」偷偷溜進程式碼。

**snapshot 的缺點**：
- **假陽性（false positive）**：快照通過，不代表 component 是「對的」。快照只確認「輸出跟上次一樣」，不確認「輸出是正確的」，所以 bug 可能藏在裡面卻沒被抓到。過度依賴快照，會讓人對程式碼過度自信。
- **假陰性（false negative）**：任何微不足道的改動都會讓快照失敗。修個標點？失敗。把某個 HTML 標籤換成更語意化的？失敗。改多了，你可能會對整個測試套件失去信任。

snapshot 本身不是壞東西，它有它的用途。重點是**分辨什麼時候該用、什麼時候不該用**。

## 程式碼範例

先看一個最小的 component 與它的第一個測試：

```jsx
// App.jsx
const App = () => <h1>Our First Test</h1>;

export default App;
```

```jsx
// App.test.jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App component", () => {
  it("renders correct heading", () => {
    render(<App />); // 把 component 畫進 jsdom
    // 用 regex 加 i flag，做不分大小寫的比對
    expect(screen.getByRole("heading").textContent).toMatch(/our first test/i);
  });
});
```

在終端機執行 `npm test App.test.jsx`，就能看到測試通過。

接著是一個帶按鈕、會改變標題的 component，示範如何模擬點擊與使用 snapshot：

```jsx
// App.jsx
import { useState } from "react";

const App = () => {
  const [heading, setHeading] = useState("Magnificent Monkeys");

  const clickHandler = () => {
    setHeading("Radical Rhinos");
  };

  return (
    <>
      <button type="button" onClick={clickHandler}>
        Click Me
      </button>
      <h1>{heading}</h1>
    </>
  );
};

export default App;
```

```jsx
// App.test.jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App component", () => {
  it("renders magnificent monkeys", () => {
    // screen 沒有 container 屬性，所以這裡解構 render 取得 container
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });

  it("renders radical rhinos after button click", async () => {
    const user = userEvent.setup(); // 建立 user 實例

    render(<App />);
    const button = screen.getByRole("button", { name: "Click Me" });

    await user.click(button); // 模擬點擊，記得 await

    expect(screen.getByRole("heading").textContent).toMatch(/radical rhinos/i);
  });
});
```

第一個測試用 snapshot 確認所有節點都照預期畫出來；第二個測試模擬一次點擊，再確認標題真的改變了。上面第一個測試自動產生的快照檔會長這樣：

```jsx
// Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html

exports[`App component > renders magnificent monkeys 1`] = `
<div>
  <button
    type="button"
  >
    Click Me
  </button>
  <h1>
    Magnificent Monkeys
  </h1>
</div>
`;
```

它就是 `App` 的 HTML 表示，之後的 snapshot 斷言都會拿新的畫面跟它比對；只要 `App` 有一點點改變，測試就失敗。

## 常見陷阱

!!! warning "忘了 await 使用者互動"
    `userEvent` 的 `click`、`type` 等方法都回傳 Promise。若忘了 `await`（或忘了把測試 callback 宣告成 `async`），斷言可能在 state 更新與重新 render 完成之前就先跑了，導致測試不穩定或莫名失敗。凡是 `user.xxx()`，前面都要加 `await`。

!!! warning "查不存在的元素用錯查詢類型"
    要斷言「某元素**不存在**」時，不能用 `getBy...`——它一找不到就直接丟錯，測試在斷言之前就崩了。這種情況要用 `queryBy...`，它找不到會回傳 `null`，才能寫出 `expect(screen.queryByText(...)).not.toBeInTheDocument()`。

!!! warning "把 snapshot 當成正確性的保證"
    snapshot 只確認「這次輸出跟上次一樣」，不確認「輸出是對的」。第一次產生的快照如果本身就有 bug，之後每次比對都會愉快地通過（假陽性）。反過來，改個標點、換個更語意化的標籤，也會讓它失敗（假陰性）。別讓一堆 snapshot 取代真正在驗證行為的斷言。

## 練習

跟著下面的步驟把本課概念整理清楚（原文的延伸閱讀都以繁中重述，讓你不點外部連結也能掌握重點）：

1. **別測實作細節**：原文請你讀 Kent C. Dodds 的〈Testing Implementation Details〉。核心觀念是——測試應該像「使用者」一樣去驗證行為（畫面上看到什麼、點了會怎樣），而不是去驗證 component「內部怎麼實作」（用了哪個 state 變數、呼叫了哪個內部函式）。測實作細節會造成兩種壞測試：明明功能正常卻失敗（false negative，因為你重構了內部），以及明明壞了卻通過（false positive）。這也正是「優先用 `ByRole` 查詢」的理由——它貼近使用者實際感知網頁的方式。
2. **熟悉查詢方法與 test id**：原文請你瀏覽 RTL 的查詢速查表。重點不是背下每一個，而是**為特定查詢選對方法**。優先順序大致是：`ByRole` ＞ `ByLabelText`／`ByPlaceholderText` ＞ `ByText` ＞ `ByDisplayValue`。當真的沒有語意化的方式可查時，最後才退而用 `data-testid` 屬性搭配 `getByTestId` ——把它當成逃生門，不是首選。
3. **讀 userEvent API**：原文請你看 `userEvent` 的介紹文件。除了 `click`，你還會用到 `type`（輸入文字）、`keyboard`（按鍵）、`selectOptions`（選下拉選單）等。記住核心用法：先 `const user = userEvent.setup()`，再 `await user.xxx()`。
4. **深入 snapshot 的取捨**：原文請你讀兩篇關於 snapshot 優缺點的文章。把本課「優點：快、少寫程式碼、防止意外改動」與「缺點：假陽性讓 bug 溜過、假陰性讓瑣碎改動也失敗」記牢，並形成自己的判斷：對「結構穩定、少變動」的小型展示型 component，snapshot 划算；對「常改動或邏輯關鍵」的 component，改用針對行為的明確斷言更可靠。

> 進階練習（project）：原文的實作型 project 請參考下方「原文與延伸資源」連結，依原文步驟完成。

## 原文與延伸資源

- 原文：[Introduction To React Testing](https://www.theodinproject.com/lessons/node-path-react-new-introduction-to-react-testing)
- 本課引用：
    - [Vitest 官方文件](https://vitest.dev/)：與 Vite 整合的測試執行器，本課用它取代 Jest。
    - [React Testing Library 官方文件](https://testing-library.com/docs/react-testing-library/intro/)：`render`、`screen` 與各種查詢方法的完整參考。
    - [RTL 查詢文件](https://testing-library.com/docs/queries/about/)：說明 `getBy`／`queryBy`／`findBy` 三類查詢與查詢優先順序。
    - [`userEvent` API 文件](https://testing-library.com/docs/user-event/intro)：模擬使用者互動的完整 API。
    - [Vitest snapshot 文件](https://vitest.dev/guide/snapshot.html)：snapshot 測試的用法與原理。
    - Kent C. Dodds〈Testing Implementation Details〉：說明為何應測「行為」而非「實作細節」。
    - [Robin Wieruch：Vitest + RTL 設定教學](https://www.robinwieruch.de/vitest-react-testing-library/)：環境設定的逐步指南。

---

> 本講義改寫自 The Odin Project《Introduction To React Testing》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
