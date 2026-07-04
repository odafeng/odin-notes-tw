---
title: Node.js 是什麼
source_url: https://www.theodinproject.com/lessons/nodejs-introduction-what-is-nodejs
source_file: vendor/curriculum/nodeJS/introduction_to_nodeJS/introduction_what_is_nodeJS.md
path: full-stack-javascript
course: NodeJS
order: 2
generated: 2026-07-04
---

# Node.js 是什麼

> 改寫自 The Odin Project：[Introduction: What is NodeJS?](https://www.theodinproject.com/lessons/nodejs-introduction-what-is-nodejs)
> ｜Full Stack JavaScript › NodeJS › Introduction to NodeJS

## 核心概念

Node.js（常簡稱 Node）從 2009 年問世以來人氣持續攀升。網路上關於它的課程與文章多到滿出來，幾乎任何 back-end（後端）開發工作都把「安裝 Node」當作前提，需要 Node 知識的職缺數量也一路上升。要理解它為什麼這麼重要，得先從幾個基礎觀念談起。

### server（伺服器）在做什麼

當你在瀏覽器輸入一個網址、按下 Enter，你的電腦（稱為 client（客戶端））會透過網路送出一個 request（請求）。這個請求會抵達某一台隨時在線、專門「等著回應請求」的電腦，那就是 server。server 收到請求後，準備好對應的內容（例如一個 HTML 頁面、一張圖片、或一段 JSON 資料），再把它當作 response（回應）送回給 client。整個過程就是所謂的 client-server（主從）模型：一方發問、一方作答。

server 的核心工作，就是「聽取請求、產生回應」。而回應要怎麼產生，正是 static site（靜態網站）與 dynamic site（動態網站）分道揚鑣的地方。

### static（靜態）與 dynamic（動態）網站的差別

- **static site（靜態網站）**：server 上放著一份現成、寫死的檔案。任何人來要同一個網址，拿到的都是位元組完全相同的那份檔案。server 只是把硬碟上的檔案原封不動地送出去，不做任何加工。純 HTML/CSS 做的個人作品集就是典型例子。
- **dynamic site（動態網站）**：server 收到請求後，會依當下情況「即時組出」回應內容。它可能先去 database（資料庫）查詢資料、根據登入者是誰、根據網址帶的參數，再把結果拼成一個為你量身打造的頁面。你在社群網站看到的動態牆、購物網站的個人推薦、後台的訂單列表，都是動態產生的。

換句話說，靜態是「拿現成的給你」，動態是「現場為你做一份」。而要「現場做」，就需要一段在 server 上執行的程式邏輯，這正是 back-end 的職責。

### 什麼時候需要 back-end，什麼時候不需要

不是每個專案都需要自己的 back-end。判斷的關鍵是：**你的內容是不是每次都一樣、有沒有需要在伺服器端保護或運算的東西**。

**需要 back-end 的情境**：需要儲存與讀取使用者資料（帳號、貼文、訂單）、需要 authentication（認證）與授權、需要保護不能外流的密鑰或商業邏輯、需要多人共享同一份即時資料、需要與資料庫互動。這些工作放在瀏覽器裡做既不安全也做不到，必須交給 server 上的程式。

**不需要 back-end 的情境**：純展示型的網站，例如個人作品集、活動介紹頁、部落格文章（內容不常變動）。這類網站可以做成一堆靜態檔案，直接丟到 GitHub Pages 之類的靜態託管服務，完全不必自己維護一台伺服器。硬要為它加上 back-end，只是徒增複雜度與維護成本。

先想清楚「這個功能是否真的非 server 不可」，能省下大量不必要的工程。

### Node.js 到底是什麼

Node.js 官網的定義是：

> Node.js 是一個 asynchronous event-driven（非同步、事件驅動）的 JavaScript runtime（執行環境），專為打造可擴充的網路應用而設計。

這句話得拆開來看。最關鍵、要一開始就抓住的一點是：**Node 是一個「JavaScript runtime」**。JavaScript 剛被發明時，是設計來「在瀏覽器裡執行」的。也就是說，早年你沒辦法用 JavaScript 寫出網站以外的任何程式。Node 把 JavaScript 帶出了「瀏覽器的世界」，讓開發者能用 JavaScript 做到其他伺服器端語言（如 Ruby、PHP、C#、Python）能做的幾乎所有事。所以最基本地說，**Node 讓你不必經過瀏覽器，就能在一台機器（你的電腦或一台 server）上直接執行 JavaScript 程式碼**。

為了做到這件事，Node 提供了一些瀏覽器版 JavaScript 沒有的額外能力，例如：讀寫本機檔案、建立 HTTP 連線、監聽網路請求。這些正是寫一個後端服務所必需的。

至於「runtime（執行環境）」怎麼來的：Node 底層用的是 Google Chrome 的 V8 JavaScript 引擎，也就是把瀏覽器裡負責跑 JavaScript 的那顆引擎抽出來，額外裝上一組能操作作業系統資源（檔案、網路）的能力，包成一個可以獨立在終端機執行的程式。這就是 Node 的由來。

### event-driven（事件驅動）與 asynchronous（非同步）

回到定義：Node 是**非同步、事件驅動**的。這裡的 **asynchronous（非同步）**意思是：你寫程式時，不去預先規定「每一行要照什麼順序跑完」。相反地，你把工作拆成一堆小 function（函式），讓它們在特定「事件」發生時才被呼叫，這就是 **event-driven（事件驅動）**。

舉個例子。假設你的程式要做四件事：從檔案讀出一段文字、把文字印到 console、去資料庫查一份使用者清單、再依年齡把使用者篩選一遍。

一般直覺會叫程式照順序做：

1. 讀檔
2. 印出檔案內容
3. 查資料庫
4. 篩選查詢結果

但 Node 鼓勵你把它拆成兩條「做完某事之後接著做」的鏈：

1. 讀檔 **接著** 印出檔案內容
2. 查資料庫 **接著** 篩選查詢結果

程式跑起來時，Node 從上往下，先開始讀檔。但讀檔要花時間，於是它不呆等，**立刻**開始執行第二步（查資料庫）。兩件事同時在等結果的期間，Node 就坐在那裡「等一個事件」，這裡等的是兩個動作各自完成的事件。哪一個先做完，Node 就先觸發對應的下一個 function：讀檔先好就先印內容、查詢先好就先開始篩選。身為開發者，你根本不需要知道也不在乎兩者誰先完成。

如果這段程式是 synchronous（同步）處理，你就得等每一步完全做完才能進行下一步。萬一那個檔案很大、讀好幾秒，資料庫查詢就得乾等這幾秒才能開始，整體效能會被拖垮。非同步的價值就在這裡：把等待的時間拿去做別的事。

這整套機制，其實跟你在前端用 `addEventListener` 等待使用者點滑鼠、按鍵盤非常像，只是這裡等的「事件」換成了網路請求完成、資料庫查詢完成之類的事。而串起這一切的工具，就是 callback（回呼函式）：你把「事件發生後要做什麼」寫成一個函式交給 Node，等事件來了它再回頭呼叫你。callback 對 Node 極為重要，務必先搞熟它。

> **在 Node.js 課程裡使用 React**：這個課程會先聚焦在 server-side（伺服器端）觀念，像 React 這類 client-side（客戶端）的東西會留到後面、當你開始把較複雜的前後端組合在一起時再學。建議照課程的順序走，自行跳過或提前，反而會讓學習變得更難。

## 程式碼範例

下面是一段最小的 Node 伺服器範例，之後的教學很快會帶你實際寫到它：

```javascript
// 引入 Node 內建的 http 模組
const http = require('http');

// createServer 接收一個 callback：每當有網路請求進來就會被呼叫
http.createServer(function (req, res) {
  // 回應標頭：狀態碼 200 (成功)，內容型別是 HTML
  res.writeHead(200, { 'Content-Type': 'text/html' });
  // 送出回應內容並結束這次回應
  res.end('Hello World!');
}).listen(8080); // 讓伺服器在 8080 埠上持續監聽請求
```

這段程式在做的事，用白話說就是：「建立一個 server，只要收到任何網路請求，就執行這個 callback function。」而這個函式的動作剛好是回應一段文字 `Hello World!`。當你打開瀏覽器、連到正確的位址與 port（這裡是 8080），畫面上就會看到這段文字。

留意這裡再次出現了「事件驅動」的樣貌：你並沒有寫「等第一個請求、再等第二個請求」，你只是把「收到請求時該做什麼」交給 Node，剩下的監聽與呼叫由它負責。

## 常見陷阱

!!! warning "Node.js 不是一種程式語言，也不是框架"
    Node 常被誤以為是「一種新語言」或「一個像 Express 那樣的框架」。都不是。你在 Node 裡寫的仍然是 JavaScript 這個語言；Node 只是提供了一個「執行環境（runtime）」，讓 JavaScript 能離開瀏覽器、在伺服器或你自己的電腦上跑起來，並額外給它讀寫檔案、處理網路等能力。分清楚「語言（JavaScript）／執行環境（Node）／框架（例如 Express）」三者，後面學習才不會混淆。

!!! warning "非同步不代表順序可控"
    非同步最容易踩的坑，是誤以為程式碼會「照你寫的先後順序」執行完。當你發起一個讀檔或資料庫查詢後，Node 不會停下來等，它會繼續往下跑。所以緊接在後面、想使用查詢結果的那行程式，此刻結果可能還沒回來。正確做法是把「拿到結果後要做的事」放進 callback（或之後會學到的 Promise / async-await）裡，而不是寫在發起請求的下一行。

## 練習

以下把原課程的 Assignment 改寫成繁中步驟。這些多為觀念補強的閱讀與影片，屬於外部資源，請依需要前往原文連結取得：

1. 先建立 server 端的背景知識：閱讀 MDN 的「The Server Side」入門模組，重點看 Tutorials 段落底下的前兩篇，分別介紹「伺服器端概論」與「主從架構總覽」。
2. 為了把上面那段官方定義的其餘部分吃透，閱讀一篇專門解釋「Node.js 究竟是什麼」的文章，並務必重看文末那支關於 event loop（事件迴圈）的影片（你在課程稍早可能已看過一次）。
3. 再看一支簡短的 Node.js 入門影片，作為整體概念的收尾。

**Knowledge check（自我檢核）**：讀完後，試著用自己的話回答「Node 是什麼？」如果答不出來，回到本講義的「核心概念」段重看即可，這個階段不要求你背誦或精通。

## 原文與延伸資源

- 原文：[Introduction: What is NodeJS?](https://www.theodinproject.com/lessons/nodejs-introduction-what-is-nodejs)
- 本課引用：
    - Node.js 官網「About」頁（Node 的官方定義）：<https://nodejs.org/en/about/>
    - MDN「The Server Side」入門模組（伺服器端概論、主從架構總覽）：<https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps>
    - 理解 callback 的文章：<https://dev.to/i3uckwheat/understanding-callbacks-2o9e>
    - freeCodeCamp「What exactly is Node.js?」文章（含 event loop 影片）：<https://medium.freecodecamp.org/what-exactly-is-node-js-ae36e97449f5>
    - Node.js 入門影片：<https://www.youtube.com/watch?v=uVwtVBpw7RQ>
    - 延伸閱讀「7 awesome things you can build with Node.js」：<https://blog.teamtreehouse.com/7-awesome-things-can-build-node-js>

---

> 本講義改寫自 The Odin Project《Introduction: What is NodeJS?》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
