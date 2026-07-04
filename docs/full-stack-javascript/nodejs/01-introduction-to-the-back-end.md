---
title: 後端簡介
source_url: https://www.theodinproject.com/lessons/nodejs-introduction-to-the-back-end
source_file: vendor/curriculum/shared/the_back_end/introduction_to_the_backend_lesson.md
path: full-stack-javascript
course: NodeJS
order: 1
generated: 2026-07-04
---

# 後端簡介

> 改寫自 The Odin Project：[Introduction to the Back End](https://www.theodinproject.com/lessons/nodejs-introduction-to-the-back-end)
> ｜Full Stack JavaScript › NodeJS › Introduction to NodeJS

## 核心概念

### 前端與後端的分界

「前端（front end）」指的是使用者直接互動的介面，也就是他們在使用網頁時所看到（甚至聽到）的一切。前端有三種相當標準化的語言：HTML 負責標記（markup）、CSS 負責呈現（presentation）、JavaScript 負責腳本（scripting）。這三者最終都在使用者的瀏覽器（browser）裡執行。

「後端（back end）」則指的是所有在 web server（伺服器）上「幕後」發生、用來讓使用者體驗得以成立的事情。使用者看不到後端，但它是整個網站真正運作的引擎。用一句話劃分：凡是在畫面顯示到瀏覽器之前所發生的處理，幾乎都算是後端的工作。

一個關鍵差異在於「程式在哪裡執行」。前端程式受限於使用者的瀏覽器，你能用的語言基本上就是瀏覽器看得懂的那幾種。後端不同：程式是在你自己掌控的伺服器上執行，因此你幾乎可以用任何語言來寫。瀏覽器只在乎一件事——你有沒有回傳格式正確的 HTML、CSS、JavaScript 檔案（以及圖片之類的其他資源）。至於這些檔案是怎麼被產生出來的，瀏覽器並不關心。

正因如此，後端語言的選擇非常多。只要一個語言能「接收一個 HTTP request（請求）、吐出一段 HTML」，你大概就能把它架在伺服器上跑。常見的 server-side（伺服器端）語言包括 PHP、C#、Ruby、Python 和 Java（注意：Java 不等於 JavaScript）。這些語言就像瑞典語、法語、義大利語、英語一樣，能完成幾乎相同的功能，只是語法（syntax）不同而已。

### 後端的三個組成部分

一個典型的後端可以拆成三個主要部分：

- **Server（伺服器）**：接收 request（請求）的那台電腦。它在網路上等待外界送來的請求。
- **Application（應用程式）**：跑在伺服器上的軟體，負責處理進來的請求、執行商業邏輯、並向資料庫存取所需的資料。這是「後端邏輯」真正所在的地方。
- **Database（資料庫）**：以持久（persistent）的方式組織並儲存資料的系統。

其中，後端把資料存放在 database（資料庫）裡。資料庫提供一個介面，讓資料能被持久地保存下來，即使伺服器當機或斷電，資料也不會消失。把資料交給資料庫，也能減輕伺服器本身的負擔。

### 後端到底在做哪些事

「使用者看不到」聽起來很抽象，具體來說，後端負責的工作包括：處理進來的頁面請求、執行伺服器端腳本來動態產生 HTML、用查詢語言（例如 SQL）對資料庫做讀寫、把敏感資料加密與解密、管理檔案的上傳與下載，以及處理使用者送出的輸入。

這裡帶出一個重要觀念：現代大多數網站都是動態（dynamic）的。動態網站的頁面內容不是事先寫死的靜態檔案，而是在每次收到請求時，由後端「即時」組裝出來的。舉例來說，你登入後看到的個人首頁、購物車裡的商品、依你所在地區顯示的價格，這些都需要後端根據當下的資料與身分，臨場產生對應的畫面。相對地，靜態（static）網站則是把固定的檔案原封不動地回傳。前端的呈現層（presentation layer）負責「把資料好看地顯示出來」，後端的資料存取層（data access layer）負責「把正確的資料準備好」，兩者合作才構成完整的使用者體驗。

值得一提的是，後端不一定只服務單一前端。當後端以 Web API 的形式對外提供資料時，同一份資料可以同時餵給網頁、手機 App 等多個不同的前端應用程式，這也是為什麼後端與前端往往被拆開設計。

### 一次 request 的完整旅程

理解後端最好的方式，是跟著一個 request（請求）走一遍：

1. 客戶端（client，通常就是瀏覽器）送出一個 HTTP request，裡面包含一個動詞（verb，例如 GET、POST）和一個 URI（要存取的位址）。
2. 伺服器收到請求，並把它比對到事先定義好的 route（路由）上，決定該由哪段程式來處理。
3. 應用程式執行對應的邏輯，過程中可能會向資料庫發出 query（查詢），把需要的資料撈出來。
4. 資料庫回傳被要求的資料。
5. 伺服器據此組出一個 response（回應），內容通常是 HTML、JSON，或至少一個狀態碼（status code）。
6. 這個回應被送回客戶端的瀏覽器，由瀏覽器渲染（render）出畫面。

這裡有兩條重要原則：伺服器通常無法主動發起回應，它必須先收到請求才會動作；而且每一個請求都需要一個回應——即使那個回應只是一個 404（找不到頁面）狀態碼。

### 自架伺服器 vs. 雲端

如果你自己架設並管理伺服器，你擁有極大的彈性，但也要面對一大堆麻煩（維運、安全、更新等）。之後的課程我們會改用雲端（cloud）。使用雲端時，你可能會被限制在雲端供應商平台上已安裝的那幾種語言——畢竟，如果你「借用」的伺服器看不懂你的程式碼，那對你一點幫助也沒有。這也是為什麼實務上，某些語言比其他語言更受歡迎、也更實用。

在這門 Full Stack JavaScript 課程裡，我們選擇的後端執行環境是 NodeJS，它讓我們得以用 JavaScript 這一種語言，同時撰寫前端與後端。

## 程式碼範例

本課以觀念為主，還沒有正式進入寫程式。不過，既然後端的最小定義是「接收一個 HTTP request、吐出一段 HTML」，這裡用 NodeJS 內建的 `http` 模組示範一個最小可執行的後端伺服器，讓你先感受一下後端在做什麼。

```javascript
// server.js
// 用 Node.js 內建的 http 模組建立一個最小的後端伺服器
const http = require("http");

// 每當有 request（請求）進來，這個函式就會被呼叫
const server = http.createServer((request, response) => {
  // 設定回應的狀態碼（200 代表成功）與內容型別
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html; charset=utf-8");

  // 吐出一段 HTML 作為 response（回應）
  response.end("<h1>哈囉，這是來自後端的回應</h1>");
});

// 讓伺服器在 3000 埠（port）上等待請求
server.listen(3000, () => {
  console.log("伺服器已啟動：http://localhost:3000");
});
```

執行方式（需先安裝 Node.js）：

```bash
node server.js
```

啟動後，打開瀏覽器造訪 `http://localhost:3000`，瀏覽器送出的 GET 請求會被這段程式接收，伺服器再回傳那段 HTML。這就是最精簡的「request 進、HTML 出」的後端流程。

## 常見陷阱

!!! warning "Java 不是 JavaScript"
    後端常見的伺服器端語言包含 Java，但它和瀏覽器裡跑的 JavaScript 是兩種完全不同的語言，名字相近純屬歷史巧合。看到 Java 別自動聯想成 JavaScript。

!!! warning "JavaScript 可前可後，別用『語言』來區分前後端"
    前端與後端的分界不在於「用什麼語言」，而在於「程式在哪裡執行、負責什麼職責」。JavaScript 落在灰色地帶：跑在瀏覽器、影響使用者介面時它是前端；透過 NodeJS 跑在伺服器、處理請求與資料時它就是後端。判斷前後端要看執行位置與職責，而不是語言名稱。

!!! warning "每個請求都要有回應"
    伺服器通常不會主動發話，它必須先收到請求才會回應；而且每一個請求都需要恰好一個回應，即使那只是一個 404 狀態碼。忘了回傳回應，客戶端就會一直卡著等待。

## 練習

本課是觀念課，沒有需要動手寫的專案，重點在於把前端與後端的分界弄清楚。請完成以下閱讀與自我檢核：

1. 複習前端與後端程式設計的差異——回想一下：前端是使用者看得到、在瀏覽器裡執行的介面層；後端是使用者看不到、在伺服器上執行的資料與邏輯層。
2. 建立對後端的整體概念——記住後端的一句話定義：「使用者看不到的那一部分，凡是在畫面顯示之前於伺服器上發生的處理都算。」
3. 走一遍「瀏覽器向伺服器發出請求時，後端發生了什麼事」——照著本課〈一次 request 的完整旅程〉那六個步驟，自己複述一遍 request → route → application → database → response 的流程。

完成後，試著回答以下自我檢核問題（答不出來就回頭看對應段落，但不需要背下來）：

- 什麼是後端開發（back-end development）？
- 後端由幾個部分組成？
- 後端的每個部分各叫什麼名字？（提示：server、application、database）
- 後端把資料儲存在哪裡？

## 原文與延伸資源

- 原文：[Introduction to the Back End](https://www.theodinproject.com/lessons/nodejs-introduction-to-the-back-end)
- 本課引用：
    - [I Don't Speak Your Language: Frontend vs. Backend](http://blog.teamtreehouse.com/i-dont-speak-your-language-frontend-vs-backend)（Treehouse 部落格，前後端差異的快速複習）
    - [Backend 定義](https://techterms.com/definition/backend)（TechTerms，簡短的後端概念總覽）
    - [What Is the Back-End?](https://www.codecademy.com/article/back-end-architecture)（Codecademy，逐步拆解瀏覽器向伺服器發出請求時後端發生的事）

---

> 本講義改寫自 The Odin Project《Introduction to the Back End》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
