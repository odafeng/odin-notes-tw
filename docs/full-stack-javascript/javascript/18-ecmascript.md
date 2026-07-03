---
title: ECMAScript
source_url: https://www.theodinproject.com/lessons/node-path-javascript-ecmascript
source_file: vendor/curriculum/javascript/javascript_in_the_real_world/ecmascript.md
path: full-stack-javascript
course: JavaScript
order: 18
status: draft
generated: 2026-07-03
---

# ECMAScript

> 改寫自 The Odin Project：[ECMAScript](https://www.theodinproject.com/lessons/node-path-javascript-ecmascript)
> ｜Full Stack JavaScript › JavaScript › JavaScript in the Real World

## 核心概念

從課程一開始，我們就不斷提到 **ES6** 這個詞，卻一直沒有正式解釋它到底是什麼、又對你寫的程式碼有什麼影響。這一課就是要把這件事講清楚：ECMAScript 是什麼、版本怎麼命名、瀏覽器支援為什麼會是個問題，以及 Babel 這個工具如何解決它。

### JavaScript 與 ECMAScript 的關係

先釐清一個常見的混淆：**JavaScript 是一個「符合 ECMAScript 標準」的程式語言**。

- **ECMAScript** 是一份「規格（specification）」，也就是一份文件，規定了這個語言的語法（syntax）、型別（type）、內建物件與函式、錯誤處理機制、prototype-based 繼承、strict mode、module（模組）系統等核心規則。這份規格的正式編號叫 **ECMA-262**。
- **JavaScript** 則是這份規格的「實作（implementation）」。當你在 Chrome、Firefox 或 Node.js 裡執行 JS，其實是這些環境內建的 JavaScript 引擎（例如 Chrome/Node.js 的 V8）按照 ECMAScript 規格把你的程式碼跑出來。

制定與維護這份規格的組織叫 **Ecma International**，底下有一個負責 JavaScript 的技術委員會叫 **TC39**。在網頁開發的日常語境裡，「ECMAScript」和「JavaScript」幾乎可以互換使用——它們指的是同一件事的規格面與實作面。

所以，當有人說「ES6 是一個版本的 JavaScript」，意思其實是：ECMAScript 這份規格在 2015 年夏天發布了第 6 版，這一版加入了**非常多**新特性，讓寫 JavaScript 變得更輕鬆、更乾淨。而你在本課程一路學來的許多語法（`let`／`const`、arrow function（箭頭函式）、template literal（樣板字面值）、destructuring（解構）、class（類別）、Promise、module⋯⋯）**就是這些 ES6 新特性**。換句話說，你早就在用 ES6 了，因為 **ES6 就只是 JavaScript**。

### 版本命名與發布排程

你大概也讀過一些文章在談「ES7 的特性」「ES8 的特性」，或是「ES2015」「ES2017」這種寫法。這裡的混亂來源是：**ES6 之後，TC39 委員會把命名方式從「版本號」改成了「發布年份」。**

- 在 ES6（含）之前，版本用序號：ES3、ES5、ES6⋯⋯（沒有廣泛使用的 ES4，它被放棄了）。
- 從 ES6 之後，官方名稱改用年份：**ES6 也叫 ES2015**、有些文章講的「ES7」其實就是 **ES2016**、「ES8」就是 **ES2017**，以此類推。

之所以改，是因為發布策略也跟著變了。ES6 之前是「隔好幾年才出一版、一版塞進一大堆新功能」（ES6 本身就是典型，一次加入了幾十項特性）。ES6 之後改成 **每年固定發布一次**，每一版只加入「一小批」新功能。這種「小步快跑、每年一版」的節奏，讓語言演進更平穩、也更容易追蹤。

新特性要進入規格，並不是委員會拍板就好，而是要經過一套公開透明的 **4 個階段（Stage 0 到 Stage 4）** 流程：從最初的點子（Stage 0），一路討論、寫規格、實作、測試，到最後定案（Stage 4）才正式納入年度版本。整個過程都公開在 TC39 的 GitHub 上，任何人都能追蹤提案進度。實務上，一個特性通常在 Stage 3 或 Stage 4 時，各家 JavaScript 引擎就會開始實作了。

一個常見但不精確的詞是 **ESNext**：它不是某個固定版本，而是動態地指「下一版會有什麼」，泛指那些尚未正式定案、還在提案中的特性。

### 瀏覽器支援：新特性的隱藏成本

JavaScript 不斷更新、加入新特性，聽起來是好事，但這裡藏著一個**問題**：新特性發布後，各家瀏覽器要花時間才能跟上並實作它。一個新特性從規格定案，到變成「widely available（廣泛可用）」——意即在市面上大多數現代瀏覽器與版本中都受支援——往往要等上一兩年。

這代表：**如果你用了某個全新特性，而使用者的瀏覽器還不支援它，你的程式碼在那個瀏覽器上就會直接跑不起來。**

對我們大多數人而言，這通常不是問題，因為你我用的幾乎都是會自動更新的新版瀏覽器。但在**真實世界**裡，如果你是在賣產品給客戶，你無法控制使用者會用哪一種、哪一版的瀏覽器來連你的網站。有些人可能還在用舊到不會自動更新的瀏覽器，或是公司內部規定只能用某個特定舊版本。這時候，「我用了最新語法」就可能等於「一部分客戶完全打不開你的網站」。

### Babel 與 transpile

好消息是，這個問題有解，那就是 **[Babel](https://babeljs.io/)**。

Babel 是一個工具，它會把你寫的**現代 JavaScript** 程式碼，**transpile（轉譯）** 成舊瀏覽器也看得懂的等效程式碼。

這裡要區分兩個詞：

- **compile（編譯）** 一般指把一種語言轉成「較低階」的另一種語言（例如把原始碼編成機器碼）。
- **transpile（轉譯）** 是 compile 的一種特例，指「同一個抽象層級的語言之間」轉換——這裡是把新版 JavaScript 轉成舊版 JavaScript。輸入是 JS、輸出也是 JS，只是輸出的那份用的是舊瀏覽器能理解的寫法。

舉例來說，你寫的 arrow function、`const`、樣板字面值，Babel 可以把它們改寫成用 `function`、`var`、字串相接來達到相同效果的舊語法。

Babel 的關鍵在於它可以設定「**target（目標）**」：你告訴它要支援到多舊的瀏覽器（例如「支援到某某瀏覽器的某某版本」），它就轉譯到剛好能滿足那些目標的程度。需要支援多舊，取決於產品的用途與受眾——有些產品只要顧到較新的瀏覽器就好，有些則必須嚴格支援到相當舊的版本。

老實說，這**不是**你每個新專案都得操心的事。課程專案的重點是讓你實際練到各種東西，而不是交付給客戶的正式產品，所以你現在通常不需要真的去設定 Babel。但了解「真實世界裡會遇到這種狀況、以及可能需要哪些工具」本身就很有價值，這正是這一課要你帶走的觀念。

### 小結

- **ECMAScript（ECMA-262）** 是規格，**JavaScript** 是它的實作；兩者在日常語境幾乎可互換。規格由 **Ecma International** 下的 **TC39** 制定。
- **ES6 = ES2015**，發布於 2015 年，帶來大量新特性；它「就只是 JavaScript」。
- 從 ES6 之後，命名改用**年份**，發布改為**每年一版、每版小批新功能**。
- 用**全新特性**有風險：舊瀏覽器可能還不支援，導致程式碼跑不起來。
- **Babel** 透過 **transpile**，把現代 JS 轉成舊瀏覽器能懂的 JS，並可依 target 調整支援範圍。

## 程式碼範例

下面用一段「現代 JS」對照它 transpile 成「舊版 JS」後大致的樣子，直觀感受 Babel 在做什麼。這兩段在行為上等價，但下面那段能在更舊的環境執行。

```js
// 現代寫法（ES6 之後）：const、arrow function、樣板字面值、預設參數
const greet = (name = "世界") => `你好，${name}！`;

console.log(greet());        // 你好，世界！
console.log(greet("Odin"));  // 你好，Odin！
```

```js
// Babel transpile 後、舊瀏覽器也能懂的等效寫法（示意）
"use strict";

var greet = function greet(name) {
  // 用 undefined 判斷來模擬「預設參數」
  if (name === undefined) {
    name = "世界";
  }
  // 用字串相接來模擬「樣板字面值」
  return "你好，" + name + "！";
};

console.log(greet());        // 你好，世界！
console.log(greet("Odin"));  // 你好，Odin！
```

下面再列幾個「你其實早就在用」的 ES6 特性，證明 ES6 就是你已經熟悉的 JavaScript：

```js
// 1. let / const：block scope（區塊作用域）的變數宣告
const PI = 3.14159;
let count = 0;

// 2. destructuring（解構）：從陣列或物件一次取多個值
const user = { name: "Ada", age: 36 };
const { name, age } = user;
const [first, second] = ["a", "b"];

// 3. rest / spread：收集與展開
const numbers = [1, 2, 3];
const more = [...numbers, 4, 5];          // spread：展開成 [1,2,3,4,5]
const sum = (...args) => args.reduce((a, b) => a + b, 0); // rest：收集成陣列

// 4. class（類別）：prototype 繼承的語法糖
class Animal {
  constructor(sound) {
    this.sound = sound;
  }
  speak() {
    return this.sound;
  }
}

console.log(name, age);          // Ada 36
console.log(more);               // [1, 2, 3, 4, 5]
console.log(sum(1, 2, 3, 4));    // 10
console.log(new Animal("汪").speak()); // 汪
```

## 常見陷阱

!!! warning "「ES6」不是「和 JavaScript 不同的東西」"
    ES6（ES2015）不是另一種語言，也不是需要另外安裝的框架——它就是 JavaScript 規格的一個版本。你在課程裡學的 `let`／`const`、arrow function、class、Promise 幾乎都是 ES6 引入的。看到「ES6」不要以為是新東西，你早就在寫了。

!!! warning "版本號與年份是同一件事的兩種叫法"
    ES6 就是 ES2015、ES7 就是 ES2016、ES8 就是 ES2017。文章混用這兩套命名很常見。看到「ESxxxx」（年份）通常較新且精確；看到「ESn」（序號）多半是在講 ES6 前後那幾版。別把同一版本的兩個名字當成兩個不同版本。

!!! warning "「新特性」不等於「到處都能跑」"
    規格定案 ≠ 你的使用者的瀏覽器支援。一個特性可能要一兩年才「widely available」。若你的產品面向不特定大眾（無法控制對方用什麼瀏覽器），直接使用最新語法而不做 transpile／不查支援度，可能讓一部分使用者完全無法使用你的網站。要查支援度可用 caniuse.com 或 MDN 上各特性的相容性表。

!!! warning "transpile 不是 compile 成機器碼"
    Babel 做的是 transpile：JS 進、JS 出，只是把新語法改寫成舊語法。它不會把你的程式編成機器碼，也不會讓「舊瀏覽器缺少的 API」憑空出現（那類缺漏通常要靠 polyfill 另外補上）。transpile 解決的是「語法看不懂」的問題。

## 練習

以下把原文 Assignment 改寫成繁中步驟。這一課沒有需要動手寫的 project，重點在「建立認知、能回答 knowledge check」，因此以閱讀與瀏覽為主：

1. **瀏覽 ES6 帶來的新特性**：打開 [ES6 features 總覽（lukehoban/es6features）](https://github.com/lukehoban/es6features)，快速看過 ES6（即 ES2015）引入的所有新功能。你會發現其中很多（`let`／`const`、arrow、class、template string、destructuring、Promise、module⋯⋯）你早就用過了；也有少數幾個（例如 Proxy、Reflect、Symbol、Generator、Tail Call）我們還沒特別講過——現在**不需要**深入研究它們，掃過留個印象即可。

2. **瀏覽 ECMAScript 各版本時間軸**：看一下 [ECMAScript 版本歷史時間軸（Wikipedia）](https://en.wikipedia.org/wiki/ECMAScript_version_history)，它列出自 ES6 起每個年度版本的簡短摘要。同樣地，有些你可能用過、有些你不認得也還不需要研究。目的是感受「每年一版、每版一小批」的節奏。

看完後，試著用自己的話回答本課的 knowledge check：

- **什麼是 ES6？** → ECMAScript 規格的第 6 版（2015 年發布，又稱 ES2015），帶來大量讓 JS 更好寫的新特性；它「就是 JavaScript」。
- **ES6 之後採用什麼發布排程？** → 改為每年發布一次，每版加入一小批新功能，並改用年份命名。
- **為什麼使用全新的 JavaScript 特性要小心？** → 舊瀏覽器可能還不支援，導致程式碼在那些瀏覽器上跑不起來；而你無法控制真實使用者用哪種瀏覽器。
- **可以用什麼工具把新版 JS 轉譯給舊瀏覽器？** → **Babel**（透過 transpile）。

## 原文與延伸資源

- 原文：[ECMAScript](https://www.theodinproject.com/lessons/node-path-javascript-ecmascript)
- 本課引用：
  - [ES6 features 總覽（lukehoban/es6features）](https://github.com/lukehoban/es6features) — ES6 新特性一覽
  - [ECMAScript version history（Wikipedia）](https://en.wikipedia.org/wiki/ECMAScript_version_history) — 各年度版本時間軸
  - [Babel 官網](https://babeljs.io/) — transpile 工具
  - [MDN：JavaScript technologies overview](https://developer.mozilla.org/en-US/docs/Web/JavaScript/JavaScript_technologies_overview) — JavaScript 與 ECMAScript 的關係、TC39 與發布流程

---

> 本講義改寫自 The Odin Project《ECMAScript》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
