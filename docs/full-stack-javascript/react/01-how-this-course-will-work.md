---
title: 這門課怎麼進行
source_url: https://www.theodinproject.com/lessons/node-path-react-new-how-this-course-will-work
source_file: vendor/curriculum/react/introduction/how_this_course_will_work.md
path: full-stack-javascript
course: React
order: 1
status: draft
generated: 2026-07-03
---

# 這門課怎麼進行

> 改寫自 The Odin Project：[How This Course Will Work](https://www.theodinproject.com/lessons/node-path-react-new-how-this-course-will-work)
> ｜Full Stack JavaScript › React › Introduction

## 核心概念

歡迎來到 React 課程。這門課會從 React 的基礎概念開始，一步步走到比較進階的主題；過程中你會親手做出幾個專案，這些專案可以放進你的 portfolio（作品集），日後拿來向面試官證明你的 React 實力。這一課本身不教任何語法，它要先把「這門課會怎麼進行、你該用什麼心態上路、以及為什麼值得學 React」講清楚。把這些先弄懂，後面每一課你才知道自己站在整條路線的哪個位置。

### 開始之前：先把 JavaScript 練紮實

最重要、也最容易被忽略的一件事：**在開始 React 之前，請先完成 JavaScript 課程**。原文用了很強的語氣強調這一點，這不是客套話。原因很單純——**React 本質上就是 vanilla JavaScript（原生 JavaScript）**。它不是一門新的程式語言，而是一個用 JavaScript 寫成的 library（函式庫）。你在 React 裡寫的每一段邏輯，骨子裡都是 JavaScript：陣列的 `map`、`filter`、解構賦值（destructuring）、箭頭函式（arrow function）、`callback`、模組的 `import` / `export`、以及 `this` 與作用域的行為，全都會不斷出現。

換句話說，如果 JavaScript 的基礎不穩，你在 React 遇到的困難十有八九其實是 JavaScript 的困難，只是包了一層 React 的外衣，反而更難辨認問題出在哪。你會分不清「這是 React 的規則，還是 JavaScript 本來就這樣」。先把 JavaScript 練到能自在地讀寫，再進來學 React，你的注意力才能集中在 React 真正新增的東西上，而不是一邊查語言基礎一邊查框架語法，兩頭燒。

### React 到底解決了什麼問題

要理解為什麼要學 React，先回想你用 vanilla JavaScript 做互動式網頁時的流程：你用 `document.querySelector` 抓到某個 DOM（文件物件模型）節點，綁上事件監聽器，然後在資料改變時，**親手**把畫面上對應的文字、class、屬性一個一個改成新的樣子。頁面稍微複雜一點，你就得同時追蹤「現在的資料狀態」和「畫面現在長什麼樣」這兩件事，還要確保它們永遠同步。一旦漏改了某個地方，畫面就跟資料對不上，這正是前端最常見、最惱人的一類 bug。

React 換了一個思路，稱為 **declarative（宣告式）**。你不再一步步命令瀏覽器「去把這個節點的文字改成 5」，而是描述「當資料是這個值時，畫面應該長成這樣」。剩下的同步工作交給 React：當 state（狀態）改變，React 會自動重新 render（渲染），算出畫面該有的新樣子，並只更新真正需要變動的部分。你負責描述結果，React 負責把畫面帶到那個結果。

React 的第二個核心是 **component（元件）**。你把畫面拆成一個個可重複使用、各自封裝的小塊——一顆按鈕、一張卡片、一份表單都能是一個 component。每個 component 管好自己的外觀與行為，再像積木一樣組合成完整頁面。這讓大型介面變得可維護、可重用，也讓多人協作時更容易分工。

把這兩件事合起來看，React 的心智模型其實很單純：**你用一堆 component 描述畫面，每個 component 依據自己的 state 決定要長成什麼樣，state 一變、React 就自動重新 render**。這一課你還不必寫出這些程式碼，只要先把這個大方向記在心裡；後面每學到一個新概念——props（屬性）、hook、effect、事件處理——你都能把它掛回這個框架，知道它是在補上哪一塊。學 React 不是背零散的 API，而是把這些零件慢慢拼成一張完整的地圖，理解會隨著練習不斷累積、彼此扣連。

順帶一提，React 之所以值得投入，除了寫起來方便，也因為它是目前業界最主流的前端技術之一。學會它，你能接觸的工作機會與生態系（ecosystem）資源都會明顯變多——但這些好處的前提，仍然是你先把 JavaScript 與 React 的基本功練紮實。

### 課程如何進行

這門課的每一課都沿用你在先前課程已經熟悉的結構：**先是課文內容，接著是 assignment（作業）**。課文負責把概念講清楚，作業則推著你動手把概念用出來——光讀不練，React 是學不起來的，因為很多「理解」要到你親手踩過坑才會真正成形。

原文特別提到，課程中穿插了透過 **CodeSandbox** 提供的互動式範例。CodeSandbox 是一個線上的程式沙盒，可以直接在瀏覽器裡跑 React，不必先在自己電腦上把開發環境全部裝好。看到這類互動範例時，別只是讀過去——動手改一改裡面的數值、把某段程式碼刪掉看看會發生什麼、再改回來。這種「主動把玩」比被動閱讀有效得多。（在本繁中講義裡，這些互動範例會改寫成可直接閱讀、看得懂在做什麼的程式碼片段，你同樣可以貼進任何線上 React 沙盒動手試。）

隨著課程推進，你會一邊學一邊累積專案。這些專案不只是練習，更是拿得出手的 portfolio 作品——把學到的東西做成看得見、點得動的成果，遠比一句「我學過 React」更有說服力。

### 給你的心態準備

學一項新技術本來就會讓人挫折，這很正常，原文也老實承認了這點——但它同樣有信心你撐得過去。學習過程中，你很可能冒出一個念頭：「這個我用 vanilla JavaScript 也做得到，那我到底為什麼要學 React？」

這個疑問完全合理，而它本身就是答案的一部分。剛開始，React 幫你省下的力氣還不明顯，甚至會覺得多了一堆規矩要記；但隨著你做的東西越來越複雜，你會慢慢體會到 React 在前端開發上有多方便。原文舉了一個很具體的例子：還記得 JavaScript 課程裡那個讓人頭痛的 [Todo List 專案](https://www.theodinproject.com/lessons/node-path-javascript-todo-list) 嗎？在 React 裡，要做出它的核心功能，通常花的時間會更少。想到這一點，應該會讓你有點期待。

所以，如果某一課讓你覺得卡、覺得煩，那不代表你不適合寫程式，只代表你正踩在每個學 React 的人都踩過的那段路上。撐過去，走到課程尾聲，你就會是一位 React 高手（React Guru）。

現在，**讓我們開始 Reactin' 吧！**

## 程式碼範例

下面用同一個「計數器」示範 vanilla JavaScript 與 React 的差別，感受一下 declarative 帶來的方便。這一課還沒開始教語法，看不懂細節完全沒關係——重點只在體會「你要親手改畫面」和「你只描述畫面該長怎樣」這兩種思路的差異。

```js
// vanilla JavaScript：你必須「親手」把畫面改成新的樣子
let count = 0;
const button = document.querySelector("#btn");
const display = document.querySelector("#count");

button.addEventListener("click", () => {
  count += 1;                    // 1. 更新資料
  display.textContent = count;   // 2. 再手動把畫面同步成新資料（漏了這步畫面就對不上）
});
```

```jsx
// React：你只描述「資料是這個值時，畫面該長怎樣」，同步交給 React
import { useState } from "react";

function Counter() {
  // state（狀態）：count 一改變，React 會自動重新 render（渲染）畫面
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      點擊次數：{count}
    </button>
  );
}
```

在 React 版本裡，你從頭到尾沒有寫任何「去把畫面上的數字改掉」的指令——你只說了「畫面要顯示 `count`」，剩下的同步全由 React 處理。這就是 declarative 的價值，也是為什麼專案越大，React 越省事。

## 常見陷阱

!!! warning "跳過 JavaScript 基礎直接衝 React"
    這是最常見、代價也最高的一個坑。因為 React 就是 vanilla JavaScript，基礎不穩時，你會把「JavaScript 的問題」誤認成「React 的問題」，卡在原地卻找不到方向。務必先完成 JavaScript 課程，確認自己能自在地使用 `map`、解構、箭頭函式、模組 `import` / `export` 等常用語法，再進來學 React。

!!! warning "以為 React 會取代 JavaScript"
    React 不是新語言，也不會取代 JavaScript——它是一個用 JavaScript 寫成的 library。你在 React 裡寫的邏輯全都還是 JavaScript。抱著「學會 React 就不用管 JavaScript」的心態，反而會讓你越學越吃力。

!!! warning "只讀範例、不動手改"
    課程中的互動範例是拿來「玩」的，不是拿來「看」的。只用眼睛掃過去，概念不會真的長進腦子裡。看到範例就動手改數值、故意弄壞再修好，你對它的理解才會紮實。

## 練習

這一課沒有正式的程式作業，但在往下走之前，花幾分鐘替自己做好上路準備：

1. **確認先修完成**：回頭確認你已經完成 The Odin Project 的 JavaScript 課程。若對某些主題還心虛，先回去複習，別急著往前衝。
2. **快速自我檢查**：不查資料，試著在腦中（或隨手寫下）說明這些語法在做什麼——`array.map()`、解構賦值（destructuring）、箭頭函式（arrow function）、模組的 `import` / `export`。若任何一項答不上來，那就是你進 React 前該補的地方。
3. **調整心態**：先接受「學 React 會有挫折感」這件事。當你冒出「用 vanilla JavaScript 也做得到」的念頭時，把它記下來，等課程後段再回頭看，你會親眼見證 React 到底方便在哪。

> 這門課後續會有需要動手繳交的 project（專案）。當某一課出現正式專案時，請以 [原文課程頁面](https://www.theodinproject.com/lessons/node-path-react-new-how-this-course-will-work) 的最新要求為準。

## 原文與延伸資源

- 原文：[How This Course Will Work](https://www.theodinproject.com/lessons/node-path-react-new-how-this-course-will-work)
- 本課引用：
    - [The Odin Project — JavaScript 課程](https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript)（本課指定的先修課程）
    - [The Odin Project — Todo List 專案](https://www.theodinproject.com/lessons/node-path-javascript-todo-list)（原文用來對照 React 便利性的例子）
    - [React 官方文件（react.dev）](https://react.dev/)（React 為 declarative、component-based library 的官方說明來源）

---

> 本講義改寫自 The Odin Project《How This Course Will Work》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
