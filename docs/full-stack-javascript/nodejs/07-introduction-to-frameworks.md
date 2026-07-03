---
title: 框架簡介
source_url: https://www.theodinproject.com/lessons/nodejs-introduction-to-frameworks
source_file: vendor/curriculum/shared/the_back_end/introduction_to_frameworks.md
path: full-stack-javascript
course: NodeJS
order: 7
status: draft
generated: 2026-07-04
---

# 框架簡介

> 改寫自 The Odin Project：[Introduction to Frameworks](https://www.theodinproject.com/lessons/nodejs-introduction-to-frameworks)
> ｜Full Stack JavaScript › NodeJS › Express

## 核心概念

### 框架到底是什麼

好的工程師（在某種意義上）其實都相當「懶」——這裡的懶是褒義的。他們厭倦了每寫一個新應用程式，就得把同樣一批基礎程式碼從頭再敲一遍：接收 HTTP request（請求）、解析網址、對應到要執行的程式、把資料庫的結果組成 response（回應）送回去……這些工作在每個 web 專案裡幾乎一模一樣。於是他們把這些「一再重複、可以回收再利用」的程式碼打包在一起，取了個名字，叫做 framework（框架）。

換句話說，framework 就是一組「已經幫你寫好基礎工程」的程式碼集合。它預先把常見任務的骨架搭好，你只要在這個骨架上填入屬於自己應用程式的商業邏輯（business logic）即可，不必再為了「如何接收一個請求並回傳一段 HTML」這種每個專案都需要的底層瑣事重新造輪子。

要特別分清楚：programming language（程式語言，例如 JavaScript、Ruby、Python）是你用來表達邏輯的「語言本身」，而 framework 則是「用某個語言寫成、疊在語言之上的一層工具」。語言決定你能寫出什麼樣的句子，框架則提供一整套現成的段落與章節模板。Express 是一個 framework，它用 JavaScript 寫成、跑在 Node.js 上；你學會 JavaScript 之後，才有辦法使用 Express。語言是地基，框架是蓋在地基上、已經隔好房間的毛胚屋。

### 框架幫你解決的兩大問題

**第一，避免重複（DRY，Don't Repeat Yourself）。** 沒有框架時，路由（routing）、request 解析、session（工作階段）管理、與資料庫溝通等機制，全都得自己手刻。框架把這些反覆出現的模式抽象成現成的功能，讓你把時間花在「這個應用程式獨有的部分」，而不是每個網站都會用到的共通管線。

**第二，強制良好的組織。** 當你用任何一個框架開新專案時，往往一開始就會拿到數十個已經按照層次結構安排好的資料夾。這種結構並非隨意，而是遵循業界公認的好實踐，例如 MVC（Model-View-Controller，模型—視圖—控制器）的分離原則：

- **Model（模型）**：負責資料與商業邏輯，通常對應到資料庫裡的資料。
- **View（視圖）**：負責呈現層（presentation layer），也就是最終要顯示給使用者看的畫面。
- **Controller（控制器）**：負責接收請求、協調 Model 與 View，決定「這個請求該做什麼、回傳什麼」。

這種分工讓程式碼保持高度模組化（modular）與整潔。它雖然不完全是「按號碼填色」那樣死板的照抄，但確實幫你把東西擺得井然有序——什麼程式該放哪個資料夾、彼此如何互動，框架都已經替你定了規矩。對新手來說，這種「約定」反而降低了選擇障礙，讓你不必在專案一開始就為架構傷腦筋。

### 為什麼要用框架，什麼時候不用

用框架的最大好處是**開發效率**與**可維護性**。你站在許多有經驗工程師的肩膀上：安全性、效能、常見錯誤的防範，框架作者大多已經處理過。此外，主流框架通常有活躍的社群、完整的文件、豐富的第三方套件（package）與教學資源，遇到問題比較容易找到解答；團隊協作時，大家共用同一套結構與慣例，交接與上手也更快。

當然，框架不是萬能的，它也有取捨。框架會帶來一定的**學習曲線**——你不只要會語言，還得學會這個框架的「玩法」與慣例。框架也常伴隨一些**額外負擔（overhead）**：你被套進它的設計哲學裡，若需求剛好落在框架沒預設的路上，反而要花力氣去「對抗」它。對於極其簡單的小工具，硬套一個大框架有時反而是殺雞用牛刀。因此「要不要用框架、用哪一個」本身就是一個需要權衡的決定。

### 框架百花齊放

同一個語言往往有好幾個熱門框架，名字也取得很有個性，例如 [Ember](http://emberjs.com/)、[Meteor](http://www.meteor.com/)、[Django](https://www.djangoproject.com/)、[Rails](http://rubyonrails.org/) 等等。光是 Ruby 這一個語言，最流行的固然是 Rails，但也還有 [Sinatra](http://www.sinatrarb.com/)、[Padrino](http://www.padrinorb.com/) 等選擇。維基百科甚至有一份[網頁應用框架的完整比較](http://en.wikipedia.org/wiki/Comparison_of_web_application_frameworks)，看過就能體會它們數量之龐大。

框架大致可分為**前端框架**與**後端框架**兩類。前端框架（例如 React、Vue、Angular）主要在瀏覽器裡協助你組織使用者介面；後端框架（例如 Express、Django、Rails、Laravel）則在伺服器端幫你處理路由、資料庫存取、authentication（認證）等工作。在這門 Node.js 的課程脈絡裡，我們接下來要學的 **Express** 就是 JavaScript 生態系裡最主流的後端框架之一。它走的是「minimal（極簡）」路線，只提供一層薄薄的核心功能，其餘留給你自由搭配——這與 Rails、Django 那種「什麼都幫你準備好」的全功能（full-featured）框架風格恰成對比。

### 如何挑選一個框架

面對琳瑯滿目的框架，選擇時可以從幾個面向思考：

- **語言與生態系**：你（或團隊）熟悉哪個程式語言？框架必然綁定某個語言，先從你會的語言下手最實際。
- **框架的定位**：它是極簡型（給你最大自由、但也要自己補齊很多東西），還是全功能型（開箱即用、但也較有約束）？
- **社群與資源**：文件是否完整、社群是否活躍、遇到問題好不好查、第三方套件是否豐富。
- **效能與規模**：這個框架適不適合你預期的流量與專案規模。
- **學習成本與專案需求**：小專案可能不需要大框架；大型長期專案則會更看重結構與可維護性。

沒有「最好的框架」，只有「最適合這個專案與這個團隊的框架」。挑選的過程，本身就是在這些取捨之間找平衡。理解了框架的本質——一套幫你消除重複、強制良好組織的現成程式碼——你就能帶著正確的期待，進入下一課去實際動手使用 Express。

## 程式碼範例

本課以觀念為主，這裡用一段對照示意「框架幫你省下什麼」。以下先是不靠框架、用 Node.js 內建 `http` 模組手動處理路由的樣子：

```javascript
// 純 Node.js：路由要自己用 if/else 判斷
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("首頁");
  } else if (req.method === "GET" && req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("關於我們");
  } else {
    res.writeHead(404); // 每一條路由、每一個狀態碼都得手動處理
    res.end("找不到頁面");
  }
});

server.listen(3000);
```

換成 Express（framework）之後，路由（routing）變成宣告式的、清爽許多：

```javascript
// 使用 Express：框架把路由抽象成好讀的 API
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("首頁"); // 框架幫你設好狀態碼與標頭（header）
});

app.get("/about", (req, res) => {
  res.send("關於我們");
});

app.listen(3000); // 之後的課會實際安裝並執行 Express
```

兩段程式做的事情相同，但下方版本把「解析網址、比對路由、設定回應標頭」這些重複工作交給了框架，你只需專注在每條路由要回傳什麼。這正是框架存在的意義。

## 常見陷阱

!!! warning "別把 framework 和 programming language 混為一談"
    框架是「用某個語言寫成、疊在語言之上」的工具，不是語言本身。Express 不是一種語言，它是用 JavaScript 寫成、跑在 Node.js 上的框架。你必須先掌握語言（JavaScript），才有辦法真正用好建立在它之上的框架。跳過語言基礎、直接死背框架用法，遇到框架沒替你處理的情況就會卡住。

!!! warning "框架不是免費的，也不是萬能的"
    框架帶來效率，但也帶來學習曲線與約束。它把你套進它的設計哲學裡，一旦需求偏離框架的預設路線，反而可能要花力氣去對抗它。對極簡單的小工具硬套大型框架，有時是殺雞用牛刀。要記得：「要不要用框架、用哪一個」永遠是一個需要依專案規模與團隊情況權衡的決定，沒有標準答案。

## 練習

1. 閱讀 Dev.to 上這篇簡短的框架入門文章 [What is a Web Framework, and Why Should I Use One?](https://dev.to/aspittel/what-is-a-web-framework-and-why-should-i-use-one-38c0)（作者 Ali Spittel），建立對「框架能替你做什麼」的基本印象。
2. 瀏覽 [MDN 的後端框架概覽](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Web_frameworks)，理解在「挑選一個框架」時背後所需要的思考過程。

讀完後，試著用自己的話回答以下幾個檢核問題，作為對本課重點的回顧（答不出來不必焦慮，回頭複習即可，本課不要求你背誦或精通）：

- 框架解決了哪些問題？
- 有哪些常見的前端與後端框架？
- 你會如何描述「挑選一個框架」的過程？

## 原文與延伸資源

- 原文：[Introduction to Frameworks](https://www.theodinproject.com/lessons/nodejs-introduction-to-frameworks)
- 本課引用：
    - [What is a Web Framework, and Why Should I Use One?（Dev.to，Ali Spittel）](https://dev.to/aspittel/what-is-a-web-framework-and-why-should-i-use-one-38c0)
    - [Server-side web frameworks（MDN）](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Web_frameworks)
    - [Comparison of web application frameworks（Wikipedia）](http://en.wikipedia.org/wiki/Comparison_of_web_application_frameworks)

---

> 本講義改寫自 The Odin Project《Introduction to Frameworks》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
