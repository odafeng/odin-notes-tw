---
title: 這門課怎麼進行
source_url: https://www.theodinproject.com/lessons/node-path-javascript-how-this-course-will-work
source_file: vendor/curriculum/javascript/introduction/how_this_course_will_work.md
path: full-stack-javascript
course: JavaScript
order: 1
generated: 2026-07-03
---

# 這門課怎麼進行

> 改寫自 The Odin Project：[How This Course Will Work](https://www.theodinproject.com/lessons/node-path-javascript-how-this-course-will-work)
> ｜Full Stack JavaScript › JavaScript › Introduction

## 核心概念

### 為什麼是 JavaScript

只要你在網頁領域工作，遲早都得面對 JavaScript。你可以愛它、也可以嫌它，但避不開它。原因很單純：JavaScript 是瀏覽器裡唯一原生能執行的程式語言，它是網頁三大技術的第三層。HTML 負責結構與內容的意義，CSS 負責外觀與版面，而 JavaScript 負責讓頁面「動起來」：即時更新內容、回應使用者的點擊與輸入、播放多媒體、畫 2D／3D 圖形、串接後端資料。一旦網頁不只是靜靜地擺著給你看，而是會反應、會變化，背後幾乎都有 JavaScript。

這門課不是從零教語法，而是**更深入語言本身**，並且探索 JavaScript 在前端的各種實際用途。接下來你會碰到幾個核心主題，先在這裡對它們建立一個模糊但正確的輪廓，之後每一課再展開：

- **prototypal inheritance（原型繼承）**：JavaScript 的物件不是靠 class（類別）藍圖來繼承，而是每個物件都連著一條 prototype（原型）鏈。當你存取一個物件上找不到的屬性或方法時，JavaScript 會沿著這條鏈往上找。這是 JavaScript 與許多「class-based」語言最不一樣的底層機制，理解它，你才會明白物件之間怎麼共用行為。
- **modularization（模組化）**：把一大坨程式拆成一個個獨立、各司其職的 module（模組），彼此用 `import` 與 `export` 串接。模組化讓程式碼好讀、好維護、好重複使用，也是所有現代前端專案的組織方式。
- **bundling（打包）**：瀏覽器要載入的檔案越少、越精簡越好。bundler（打包工具，例如 webpack）會把你拆開的許多模組、以及圖片、樣式等資源，合併、最佳化成瀏覽器能有效載入的少數幾個檔案。你會親手設定一次，理解「原始碼」與「上線的檔案」之間發生了什麼事。
- **asynchronous code（非同步程式）**：向伺服器要資料、讀取檔案這類操作需要「等待」。非同步機制讓程式在等待時不會整個卡住，而是先去做別的事，等結果回來再接手。你會學到 回呼（callback）、Promise 與 `async`／`await` 三種寫法的演進與取捨。
- **JavaScript testing（測試）**：用自動化測試來驗證你的程式在各種輸入下都做對事情。會寫測試，你才敢放心地修改與重構程式，而不是每次都提心吊膽手動點一遍。

### 先打好「原味」基礎，再碰框架

你可能已經聽過 React 這類前端工具，也很想直接跳進去。這門課刻意要你**先在比較 vanilla（原味、不加框架）的情境裡把上面這些基本功練扎實**，才進入用 React 打造複雜前端的階段。

理由很實際：像 React 這樣的工具，往往有它自己一套「特定的做事方式」。這些方式在你眼中可能像魔法，甚至反直覺。如果你沒有 JavaScript 與前端開發的良好底子，就會覺得一切都是黑箱，只能照抄、不懂原理；一旦出錯就束手無策。反過來，當你已經理解原型繼承、模組化、非同步這些底層觀念，再去看框架時，你會看穿它「在引擎蓋底下」到底幫你做了什麼，學起來又快又踏實。

### 給有 Ruby 背景的人

在 The Odin Project 裡，這門課在 Ruby 學習路徑中出現的時機，比在 JavaScript 路徑中晚一些。如果你是走 Ruby 路徑過來的，你會有「先前接觸過類似概念」的優勢——但要小心一個陷阱：**某個東西在 JavaScript 裡看起來很像 Ruby、甚至叫同一個名字，不代表它運作方式完全一樣。** 例如同樣叫「繼承」，Ruby 的 class 繼承和 JavaScript 的 prototypal inheritance 骨子裡就不同。只要你隨時保持這份警覺，不把舊經驗硬套上去，你一定能學得很好。

### 這趟學習旅程

這些課程的進行方式，和你之前經歷的很類似，所以保持你的節奏就好。有件事要先跟你講清楚，好讓你安心：**你會忘東西。** 你會忘掉前面課程學過的內容，會在這門課學了又忘，之後的課程還會再忘一輪。這完全正常。

原文特別連到一篇文章提醒你：[你不需要把學到的每件事都背下來](https://dev.to/theodinproject/memorization-and-learning-to-code-1b6h)。這篇文章的核心論點值得記住：把語法和細節背得滾瓜爛熟，並不等於會寫程式。人的工作記憶（working memory）容量有限，學新東西時舊細節自然會淡掉，這是認知的現實，不是你的失敗。作者分享過一段經歷：結對程式設計時，他一時想不起 `localStorage` 的用法，同伴 John 只是輕鬆地說「沒關係，我們一起 Google 查一下就好」——查文件是專業開發者的日常，不是作弊。

真正重要的不是「精熟記憶」，而是「**知道有這件事、知道去哪裡找**」。比方說，你只要記得「陣列可以移除最後一個元素」這個可能性存在，比死背 `pop()` 的拼法有用得多——名字忘了，查 MDN 一秒就回來了。所以請把力氣放在**理解觀念**與**培養查找能力**上，而不是反覆複習舊教材、試圖把所有東西塞進腦袋。

這門課會涵蓋很多內容，你的腦袋可能會「當機」個幾次。別擔心，那只是皮肉傷！學習的旅程本來就辛苦：累了就好好休息，包紮一下，然後繼續走。

**廢話說夠了——開始學吧！**

## 程式碼範例

下面是一段最小、可直接用 Node.js 執行的 JavaScript，用來預告你之後會碰到的**非同步**寫法。它不需要瀏覽器，存成 `demo.js` 後用 `node demo.js` 就能跑：

```js
// 用一個 Promise 模擬「需要等待」的操作（例如向伺服器要資料）
function fetchName() {
  return new Promise((resolve) => {
    // 1 秒後才把結果交出來，模擬網路延遲
    setTimeout(() => resolve("Odin"), 1000);
  });
}

// async／await 讓非同步程式讀起來像同步程式：一行一行照順序走
async function main() {
  console.log("開始，等待資料中……");
  const name = await fetchName(); // 在這裡「等」結果回來，但不會卡死整支程式
  console.log(`拿到名字：${name}`);
}

main();

// 輸出順序：
// 開始，等待資料中……
// （約 1 秒後）
// 拿到名字：Odin
```

你現在不需要完全看懂每一行——這正是本課的重點：對「原來可以這樣寫」有個模糊的印象就夠了，細節之後的課會一課一課補上。

## 常見陷阱

!!! warning "把 Ruby（或其他語言）的直覺硬套到 JavaScript"
    看到同名或長得很像的功能，很容易假設它「一定一樣」。但 JavaScript 的 prototypal inheritance、型別轉換、`this` 綁定等機制，和 Ruby、Python、Java 都有明顯差異。先前經驗是加分，但要當成「線索」而非「答案」，遇到不確定就實測或查文件確認。

!!! warning "想把每個語法都背起來"
    試圖記住所有 API 名稱與拼法，只會讓你焦慮又低效。專業開發者天天查 MDN。把目標放在「理解概念、知道某功能存在、知道去哪查」，而不是「不看文件默寫得出來」。

## 練習

原文的作業是一篇必讀短文，把它讀完、內化，勝過多學十個語法：

1. 打開原文引用的文章 [Memorization and Learning to Code](https://dev.to/theodinproject/memorization-and-learning-to-code-1b6h)（本課「核心概念」已摘要其重點）。
2. 邊讀邊問自己：我過去是不是常因為「記不住語法」而覺得自己不適合寫程式？這篇文章怎麼回應這種焦慮？
3. 用一兩句話寫下這篇文章的核心主張（提示：關鍵在「知道某件事可行、知道去哪查」，而非死背）。
4. 之後每次卡關、忍不住覺得「我怎麼又忘了」時，回想這個結論：忘記是正常的，查文件是專業日常。

本課沒有需要動手做的 project；把心態調整好，就直接進入下一課開始學 JavaScript。若日後遇到有 project 的課程，請依原文步驟操作。

## 原文與延伸資源

- 原文：[How This Course Will Work](https://www.theodinproject.com/lessons/node-path-javascript-how-this-course-will-work)
- 本課引用：[Memorization and Learning to Code（dev.to，The Odin Project）](https://dev.to/theodinproject/memorization-and-learning-to-code-1b6h)
- 延伸閱讀：[What is JavaScript?（MDN）](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_is_JavaScript)

---

> 本講義改寫自 The Odin Project《How This Course Will Work》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
