---
title: React 簡介
source_url: https://www.theodinproject.com/lessons/node-path-react-new-introduction-to-react
source_file: vendor/curriculum/react/introduction/introduction_to_react.md
path: full-stack-javascript
course: React
order: 2
status: draft
generated: 2026-07-03
---

# React 簡介

> 改寫自 The Odin Project：[Introduction To React](https://www.theodinproject.com/lessons/node-path-react-new-introduction-to-react)
> ｜Full Stack JavaScript › React › Introduction

## 核心概念

### React 到底是什麼

打開 [React 官方網站](https://react.dev/)，你會看到一句標語：「The library for web and native interfaces（用來打造 Web 與原生介面的函式庫）」。這句話資訊量很大，我們拆開來慢慢看。

首先，React 是一個 **JavaScript library（函式庫）**。所謂 library，就是一堆別人事先寫好、經過驗證的程式碼，目的是讓開發變得更輕鬆。你不需要每次都從零造輪子，而是把這些現成的功能引入自己的專案，用來完成原本很複雜的工作。React 提供的正是一組專門用來「建構使用者介面（UI，User Interface）」的強大工具。

第二個關鍵字是 **interfaces（介面）**。React 最初是為了瀏覽器上的網頁介面而生，但它的設計理念後來也延伸到手機 App（透過 React Native）等原生平台。本課程只聚焦在 Web，也就是你在瀏覽器裡看到、點擊、互動的那些畫面。

React 給了我們一些所謂的 **primitives（基本building block，內建的函式與模組）**，讓我們可以用它們像堆積木一樣，組合出從簡單到極度複雜的各種介面。整個 React 課程，本質上就是在學這些積木怎麼用、怎麼組。

### library 與 framework 的差別

官方標語裡明明白白寫著 library，但你可能會在很多地方看到有人把 React 稱作「framework（框架）」。這兩個詞常被混用，但其實有一個關鍵區別，值得現在就分清楚，因為它會影響你對 React 的整體理解。

差別的核心在於 **誰控制流程（control flow）**，也就是常被引用的「Inversion of Control（控制反轉）」原則：

- **library（函式庫）**：**你** 是主導者。你的程式碼在需要時「呼叫」library 的功能。就像你去工具箱裡拿一把螺絲起子來用，什麼時候用、怎麼用，由你決定。React 本身比較偏向這種角色——它主要負責「畫出畫面」，但路由（routing）、資料抓取（data fetching）、狀態管理（state management）等其他決策，很大程度留給你自己選。
- **framework（框架）**：**framework** 是主導者，它「呼叫」你的程式碼。你把自己的邏輯填進框架預留的空位裡，框架決定整體的執行流程與結構。用蓋房子來比喻，framework 提供了完整的鋼骨與樓層規劃，你只能在既定格局裡裝潢。

有一個常見的比喻：如果你在蓋房子，library 是你可以自由挑選、自由使用的家具與家電；framework 則是連地基、樑柱、隔間都幫你決定好的預售屋。React 官方把自己定位為 library，就是因為它刻意保持「只做好 UI 這一件事」，把其餘的選擇權交還給開發者。這種特性有個常見的形容詞：React 是 **unopinionated（沒有既定立場、不強加規範）** 的。

### 為什麼要學 React

前端框架這幾年變化非常快，新的工具層出不窮，會擔心「選錯」是很正常的心理。但 React 是目前最強大、使用最廣泛的 JavaScript 函式庫之一，投資在它身上的學習時間非常值得。幾個具體理由：

- **Component（元件）可以重複使用。** React 讓你把介面切成一個個獨立的 component，寫一次就能到處用。一個「按鈕」、一個「卡片」、一個「導覽列」都可以封裝成 component，需要時直接拿來組合，大幅減少重複程式碼。
- **社群龐大、支援完善。** 因為太多人在用，你遇到的幾乎任何問題，網路上都已經有人問過、答過。豐富的第三方套件生態系也讓你站在巨人肩膀上。
- **unopinionated（不強加規範）。** 它不會逼你採用特定的設計模式、專案結構或邏輯寫法，一切由你決定。這帶來很高的彈性（但也代表你要自己做更多決策，這是一體兩面）。
- **學習曲線相對平緩。** 如果你前面已經把 JavaScript、HTML、CSS 打好基礎，React 上手其實不算陡。React 的核心思想就是「用 JavaScript 描述 UI」，而你已經會 JavaScript 了。

### React 的核心心智模型

雖然這一課主要是觀念導覽，還沒有要你動手寫大型專案，但先建立正確的「心智模型（mental model）」會讓後面每一課都輕鬆很多。React 有幾個貫穿始終的核心概念：

**1. 宣告式（Declarative）而非命令式（Imperative）。**
傳統用純 JavaScript 操作網頁時，你得一步步下指令：「找到這個元素、改掉它的文字、再新增一個節點……」這叫 **imperative（命令式）**，你要告訴瀏覽器「怎麼做」每一步。React 則是 **declarative（宣告式）**：你只要描述「在某個狀態下，畫面應該長什麼樣子」，React 會自動幫你算出要怎麼把畫面更新成那個樣子。你專注於「結果」，而不是「過程」。

**2. Component（元件）化。**
React 把 UI 拆解成一個個 component。每個 component 是一個獨立、可重複使用的單元，它接收輸入、回傳一段描述畫面的內容。複雜的介面，就是由許多小 component 像樂高一樣組合而成。這種切分方式讓程式碼更容易閱讀、維護與測試。

**3. Props（屬性）與 State（狀態）。**
Component 之間需要傳遞資料，這就靠 **props（屬性）**——它像函式的參數，由父 component 傳給子 component，而且是唯讀的。而 component 自己內部會變動的資料，則存在 **state（狀態）** 裡。這兩個概念是 React 資料流的骨幹，後面的課程會反覆用到。

**4. 資料驅動畫面。**
在 React 的世界裡有一條黃金法則：**畫面是資料的函式（UI is a function of state）**。你不直接去改 DOM，而是去改資料（state）；資料一變，React 就會自動重新 **render（渲染）**，把畫面更新到與新資料一致的狀態。你永遠只需要煩惱「資料對不對」，畫面會自己跟上。

這幾個概念現在看可能還很抽象，沒關係。這一課的目標只是讓你在腦中先種下這些種子，知道「React 大概是這樣運作的」。接下來的課程會一個一個把它們展開、動手實作。

### React 的簡短歷史

React 由 Facebook（現在的 Meta）的工程師 Jordan Walke 在 2011 年前後開發，最初用來解決 Facebook 廣告系統與動態消息（News Feed）中日益複雜的 UI 更新問題。2013 年，Facebook 將 React 開源，一開始社群反應兩極——尤其是它把 HTML 寫進 JavaScript 的 JSX 語法，讓許多人不太習慣。但隨著大家理解到 component 化與宣告式寫法帶來的好處，React 的採用率快速攀升，如今已成為前端開發的主流選擇之一。了解這段歷史能幫你理解：React 的每一個設計，都是為了解決「大型、會頻繁變動的 UI 該如何有效管理」這個真實痛點。

## 程式碼範例

這一課還沒有正式帶你安裝 React，但為了讓抽象概念具體一點，我們先看一個最小的 component 長什麼樣子。你現在不需要完全看懂每個細節，只要感受一下「用 JavaScript 描述 UI」是什麼意思即可。

```jsx
// 這是一個最簡單的 React function component（函式元件）
// 它就是一個回傳「畫面長相」的 JavaScript 函式
function Welcome() {
  return <h1>你好，歡迎來到 React 世界</h1>;
}

// 這個 component 接收 props（屬性），像函式參數一樣把資料傳進來
function Greeting(props) {
  // 用大括號 {} 在畫面描述中嵌入 JavaScript 變數
  return <h1>你好，{props.name}</h1>;
}

// 使用時，就像在寫自訂的 HTML 標籤，把 component 組合起來
function App() {
  return (
    <div>
      <Welcome />
      <Greeting name="小明" />
      <Greeting name="小華" />
    </div>
  );
}
```

上面那段看起來像 HTML 又像 JavaScript 的語法，叫做 **JSX**，它讓我們可以在 JavaScript 裡直接描述畫面結構。注意 `Greeting` 這個 component 只寫了一次，卻能傳入不同的 `name` 重複使用——這就是前面說的「component 可重複使用」。

下面再看一個帶有 state（狀態）的迷你範例，體會「改資料、畫面自動更新」的宣告式精神：

```jsx
import { useState } from "react";

function Counter() {
  // useState 是一個 hook，宣告一個叫 count 的 state，初始值為 0
  // setCount 是用來更新它的函式
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      你按了 {count} 次
    </button>
  );
}
```

在這個例子裡，你從頭到尾都沒有寫「去找到按鈕、把文字改成新數字」這種指令。你只是說「按鈕上顯示 count 這個資料」，然後在點擊時更新 count。剩下的畫面同步工作，React 全部替你處理好了——這就是宣告式 UI 的威力。

## 常見陷阱

!!! warning "別把 library 和 framework 畫上等號"
    很多文章、影片會把 React 稱為「框架」，但 React 官方定位是 **library**。這不是咬文嚼字：正因為 React 是 unopinionated 的 library，它只負責 UI，路由、資料抓取、狀態管理等都要你自己選工具或搭配其他套件（例如 React Router）。理解這一點，你才不會期待 React 「什麼都幫你準備好」，也才能理解為何 React 生態系需要搭配這麼多額外的套件。

!!! warning "這一課重觀念，不要急著背語法"
    你會看到 JSX、component、props、state、hook 這些名詞，現在只需要「知道有這些東西、大概在做什麼」即可，完全不用背，也不用擔心還不會寫。後面每個概念都有專屬的課程慢慢教。硬要在第一課就搞懂所有細節，只會讓自己焦慮。抓住「React 是用來建 UI 的 library、用資料驅動畫面」這條主線就夠了。

!!! warning "先確認 JavaScript 基礎夠不夠扎實"
    React 幾乎所有東西都是 JavaScript：component 是函式、JSX 裡到處嵌 JavaScript 運算式、事件處理也是函式。如果你對箭頭函式（arrow function）、陣列的 `map`、解構賦值（destructuring）、模組的 `import`/`export` 還不熟，學 React 時很容易把「不懂 JavaScript」誤以為是「不懂 React」。感覺吃力時，回頭補 JavaScript 往往比硬啃 React 更有效。

## 練習

以下把原文的 Assignment 改寫成繁中步驟。這些都是「閱讀與建立概念」的任務，不需要寫程式，目的是讓你對 React 的定位與歷史有整體感受。

1. **逛一次 React 官方網站。** 打開 [react.dev](https://react.dev/)，閱讀首頁與介紹段落，感受一下 React 如何自我介紹、它主打哪些特點。這個階段不要鑽進技術文件細節，先建立整體印象就好。
2. **快速瀏覽 React 的發展歷史。** 找一篇介紹 React 歷史時間軸的文章讀一讀，了解它從 Facebook 內部工具走到今天主流地位的來龍去脈。重點是理解「React 是為了解決什麼問題而生」。
3. **釐清 library 與 framework 的差別。** 閱讀一篇專門討論「函式庫與框架差異」的文章（例如 freeCodeCamp 的相關文章），把本課「控制反轉」的觀念再鞏固一次，用自己的話講得出兩者差別。
4. **概覽使用 React 的主要優勢。** 略讀一篇整理 React 優點的文章（例如 GeeksforGeeks 的相關文章），對照本課列出的理由，看看有沒有補充到新的觀點。

完成後，試著不看講義，用自己的話回答兩個問題：**React 的用途是什麼？使用 React 有哪些好處？** 若答不出來，回到上面對應的段落複習即可，這一課的知識不需要背誦或精熟。

> 這一課沒有需要繳交的 project；動手實作會從後面安裝與建立第一個 React 專案的課程開始。

## 原文與延伸資源

- 原文：[Introduction To React](https://www.theodinproject.com/lessons/node-path-react-new-introduction-to-react)
- 本課引用：
    - [React 官方網站（react.dev）](https://react.dev/)——React 的官方文件與介紹首頁。
    - freeCodeCamp：函式庫（library）與框架（framework）的差別。
    - RisingStack：React.js 的歷史時間軸。
    - GeeksforGeeks：使用 React 的主要優勢。

---

> 本講義改寫自 The Odin Project《Introduction To React》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
