---
title: Mock 回呼與元件
source_url: https://www.theodinproject.com/lessons/node-path-react-new-mocking-callbacks-and-components
source_file: vendor/curriculum/react/react_testing/mocking_callbacks_and_components.md
path: full-stack-javascript
course: React
order: 17
status: draft
generated: 2026-07-03
---

# Mock 回呼與元件

> 改寫自 The Odin Project：[Mocking Callbacks And Components](https://www.theodinproject.com/lessons/node-path-react-new-mocking-callbacks-and-components)
> ｜Full Stack JavaScript › React › React Testing

## 核心概念

在前面幾課，我們學會了怎麼 render（渲染）一個 React 元件、怎麼用 query（查詢）方法把畫面上的元素抓出來、再用 `expect` 斷言（assertion）它們的狀態。這一課要往下深入一層，談的是「mock（模擬）」——這是撰寫真實世界 React 測試時幾乎躲不掉的技巧。

### 什麼是 mock（模擬）？

「mock」的字面意思是「假的替身」。在測試裡，mock 指的是我們刻意造出一個**假的實作**，去取代真正的函式、模組或元件。為什麼要造假？因為做單元測試（unit test）時，我們想把「被測試的那一小塊」和它周圍的世界隔離開來，只驗證這一塊自己的行為，而不被外部相依（dependency）干擾。

Mock 主要幫我們解決兩件事：

1. **觀察互動**：我把一個假函式傳進元件，這個假函式會偷偷記錄「自己有沒有被呼叫、被呼叫幾次、被傳了什麼參數」。測試結束後我就能檢查這些紀錄，反推元件的行為是否正確。
2. **切斷相依**：當一個元件會 render 出很多很複雜的子元件（child component），或者相依於外部套件時，我可以把那些子元件換成極簡的假替身，讓測試聚焦在「當前這個元件」的邏輯上，而不必連整棵元件樹（component tree）一起跑起來。

在 React 測試裡，最常見的兩種 mock 情境就是：**mock 回呼函式（callback）** 與 **mock 子元件**。以下分別說明。

### 一、mock 回呼函式（callback）

回呼在 React 裡無所不在。使用者的每一種互動——點擊、輸入、送出表單——背後幾乎都是一個回呼在運作。很多時候，這些回呼是透過 props（屬性）從父元件傳進來的，用途是去改變父元件的 state（狀態）。

考慮一個最單純的按鈕元件：它接收一個 `onClick` prop，然後把這個 prop 綁到 `<button>` 的 `onClick` 上。站在測試這個按鈕的角度，我們**根本不在乎** `onClick` 裡面到底做了什麼、會怎麼影響整個 app。我們唯一要驗證的是：**當使用者點了按鈕，這個函式必須被呼叫；沒點，就不該被呼叫。**

這正是 mock 函式登場的地方。Vitest 提供了 `vi.fn()`，它會回傳一個「間諜函式（spy）」——一個什麼都不做、但會默默記帳的假函式。我們把 `vi.fn()` 產生的假函式當作 `onClick` 傳進元件，模擬使用者點擊之後，再用 `expect(mockFn).toHaveBeenCalled()` 檢查它有沒有被叫到。

（如果你用的是 Jest 而不是 Vitest，對應的 API 是 `jest.fn()`，用法完全一樣。）

常用的斷言 matcher（比對器）有：

- `toHaveBeenCalled()`：被呼叫過至少一次。
- `not.toHaveBeenCalled()`：完全沒被呼叫。
- `toHaveBeenCalledTimes(n)`：剛好被呼叫 n 次。
- `toHaveBeenCalledWith(...args)`：被呼叫時帶了指定的參數。

### 二、mock 子元件（child component）

當元件樹越長越大，位在上層的元件在測試時會變得很難搞：render 一個上層元件，等於連它底下所有的子元件、孫元件都一起 render 出來，測試因此變得又慢又脆弱，而且失敗訊息也難以定位問題。

解法是：把「不是這次測試重點」的子元件，用 `vi.mock()`（Jest 則是 `jest.mock()`）換成一個極簡的假版本。這個假版本只 render 出我們驗證所需的最少內容——例如一個帶著 `data-testid` 的 `<div>`，把關鍵的 prop 值印出來就好。這樣一來，我們就能單獨確認「父元件有沒有把正確的資料傳給子元件」，而完全不必去跑真正子元件的內部邏輯。

這個技巧不會天天用到，但了解它的存在很重要：當你哪天遇到一個相依於外部套件、或子樹龐大到難以測試的元件時，mock 子元件就是你的救生圈。像 The Odin Project 網站上真實用過的 `SubmissionsList` 元件，它的子元件裡就有一個來自 `react-flip-move` 套件的東西——那是我們無法掌控的外部程式碼，測試時直接把它 mock 掉最省事。

### 三、真實世界的測試長什麼樣

The Odin Project 網站上，每個 project 底下的「作業繳交列表」曾經就是用 React 寫的，並用 React Testing Library 測試。以那個 `SubmissionsList` 元件為例，光讀它的 render 邏輯，就能推導出該測哪些情境：

1. 如果有 `userSubmission`，就要 render 出使用者自己的 `Submission`。
2. 如果 `hasSubmissions` 為真，把所有繳交排序後用 `Submission` 逐一 render；否則顯示一段「No Submissions yet, be the first!」的標題。
3. 如果 `allSubmissionsPath` 為真，就 render 一個 `<p>` 標籤。

這三個「關注點（point of interest）」剛好對應三組測試，通常會用 `describe` 分成三個測試套件（test suite）以增進可讀性。測試裡會用 mock 掉的 `Submission` 子元件，搭配假資料與 `vi.fn()` 假函式，逐一驗證上述行為。

### 四、Arrange-Act-Assert 模式

觀察這些真實測試，你會發現它們幾乎都遵循同一種寫法——**Arrange-Act-Assert（安排—執行—斷言）** 三段式：

- **Arrange（安排）**：準備假資料、建立 mock 函式、`render` 元件、`userEvent.setup()`。
- **Act（執行）**：觸發要測的行為，例如 `await user.click(button)`。
- **Assert（斷言）**：用 `expect` 檢查結果是否符合預期。

越早養成這個習慣，你的測試就越好讀、越好維護。

## 程式碼範例

先看被測元件本身。它單純把外部傳進來的 `onClick` 綁到按鈕上：

```jsx
// CustomButton.jsx
const CustomButton = ({ onClick }) => {
  return (
    <button onClick={onClick}>Click me</button>
  );
};

export default CustomButton;
```

接著是用 `vi.fn()` mock 回呼、驗證點擊行為的測試：

```jsx
// CustomButton.test.jsx
import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomButton from "./CustomButton";

describe("CustomButton", () => {
  it("按鈕上應顯示文字 'Click me'", () => {
    // Arrange：傳一個空函式當 onClick 就好，這個測試不關心點擊
    render(<CustomButton onClick={() => {}} />);
    // Act / Assert：抓出按鈕並確認它存在於畫面
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
  });

  it("被點擊時應呼叫 onClick 函式", async () => {
    // Arrange：用 vi.fn() 造一個會記帳的假函式
    const onClick = vi.fn();
    const user = userEvent.setup(); // render 前先 setup
    render(<CustomButton onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Click me" });

    // Act：模擬使用者點擊（注意 await）
    await user.click(button);

    // Assert：假函式應被呼叫過
    expect(onClick).toHaveBeenCalled();
  });

  it("沒被點擊時不應呼叫 onClick 函式", () => {
    const onClick = vi.fn();
    render(<CustomButton onClick={onClick} />);
    // 沒有任何點擊動作，所以假函式不該被呼叫
    expect(onClick).not.toHaveBeenCalled();
  });
});
```

再看怎麼 mock 一個子元件。以下把 `Submission` 換成極簡替身，只印出我們要驗證的 prop：

```jsx
// 用 vi.mock 把子元件換成假版本（放在測試檔最上層）
// 第二個參數是工廠函式，回傳假的元件實作
vi.mock("../submission", () => ({
  // default export 是一個只印出關鍵 prop 的極簡元件
  default: ({ submission, isDashboardView }) => (
    <>
      <div data-testid="submission">{submission.id}</div>
      <div data-testid="dashboard">{isDashboardView.toString()}</div>
    </>
  ),
}));
```

如此一來，測試父元件時就能透過 `screen.getByTestId("submission")` 確認「有沒有把正確的 `submission` 傳給子元件」，而完全不必跑真正 `Submission` 的內部邏輯。

## 常見陷阱

!!! warning "`data-testid` 才是預設，別打錯成 `data-test-id`"
    The Odin Project 原始碼裡的舊測試用的是 `data-test-id`（中間多一個連字號），但 **React Testing Library 預設認得的是 `data-testid`**（沒有中間那個連字號），對應的查詢方法是 `screen.getByTestId(...)`。若你在假子元件上寫成 `data-test-id`，`getByTestId` 就會抓不到。除非你特地改過設定，否則一律用 `data-testid`。

!!! warning "`jest.mock` 與 `vi.mock` 別混用"
    你在網路教材上常看到 `jest.fn()` 與 `jest.mock()`；如果你的專案是用 Vite + Vitest 建置，對應寫法是 `vi.fn()` 與 `vi.mock()`，API 幾乎一模一樣。重點是整個檔案要一致，別在 Vitest 專案裡寫 `jest.xxx`，否則會直接 `ReferenceError`。

!!! warning "`userEvent.setup()` 要在 render 之前呼叫，別藏進 beforeEach"
    建議在 `render` 元件**之前**先呼叫 `userEvent.setup()`，並且把 `render` 與 `userEvent` 都寫在**每個測試區塊自己內部**，而不是抽到 `beforeEach`。這樣讀測試時不必翻遍整個檔案找上下文，也能降低測試之間狀態互相「洩漏」造成的詭異失敗。若真的重複太多，正確作法是自己寫一個 setup 函式來共用，而不是塞進 `beforeEach`。

!!! warning "非同步的 userEvent 一定要 await"
    新版 `@testing-library/user-event` 的互動方法（如 `user.click()`）是**非同步**的，回傳 Promise。忘了加 `await`，斷言就可能在互動真正完成前就先跑，導致測試時而通過、時而失敗的「flaky（不穩定）」現象。記得把測試函式標成 `async`，並 `await user.click(...)`。

## 練習

1. 讀一篇關於 mock 子元件的文章：Taylor McLean 的《Jest Testing – Mocking Child Components to make your Unit Tests more concise》。它很完整地說明了 mock 子元件的「怎麼做」。（可能需要註冊才能閱讀）
2. 跟著 Academind 的《Testing React Apps》教學走一遍，它對這一課學到的東西做了很好的總覽。注意：該教學裡的 `userEvent` API 是**同步**寫法，和我們現在用的**非同步**版本不同；不過你可以用先前學到的知識自行對照，一樣繼續用 Vite 與 Vitest。
3. 動手練習：替本課的 `CustomButton` 補上一個新測試，驗證「連點兩次時，`onClick` 應剛好被呼叫兩次」——提示：用 `toHaveBeenCalledTimes(2)`。
4. （project）閱讀 The Odin Project 原文中連結的 `submissions-list.jsx` 與其測試檔 `submissions-list.test.jsx`，試著看懂 mock 子元件與 `ProjectSubmissionContext.Provider` 在測試裡扮演的角色。看不懂全部沒關係，目標是建立「熟悉感」。詳見原文。

## 原文與延伸資源

- 原文：[Mocking Callbacks And Components](https://www.theodinproject.com/lessons/node-path-react-new-mocking-callbacks-and-components)
- 本課引用：
    - Vitest `vi.fn()` 與 `vi.mock()` API 文件（vitest.dev）
    - React Testing Library 的 `getByTestId` 查詢與 `data-testid` 慣例（testing-library.com）
    - `@testing-library/user-event` 的 `setup()` 與非同步互動（testing-library.com）
    - Arrange-Act-Assert 模式（wiki.c2.com）

---

> 本講義改寫自 The Odin Project《Mocking Callbacks And Components》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
