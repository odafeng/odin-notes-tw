---
title: 開始使用 Node.js
source_url: https://www.theodinproject.com/lessons/nodejs-getting-started
source_file: vendor/curriculum/nodeJS/introduction_to_nodeJS/getting_started.md
path: full-stack-javascript
course: NodeJS
order: 3
status: draft
generated: 2026-07-04
---

# 開始使用 Node.js

> 改寫自 The Odin Project：[Getting Started](https://www.theodinproject.com/lessons/nodejs-getting-started)
> ｜Full Stack JavaScript › NodeJS › Introduction to NodeJS

## 核心概念

如同前一課所學，Node.js 其實就是 JavaScript：它讓你能把原本只跑在瀏覽器裡的 JavaScript，拿到伺服器端（server-side）或你自己的電腦上執行。這一課的目標，是把你「寫得出、跑得動」一支 Node.js 程式所需的核心 module（模組）與函式串起來。本課結束後的專案，會要你用 Node 做一個包含 `Index`、`About`、`Contact Me` 三個頁面的基本網站，所以下面每個主題都值得你邊學邊想：這能怎麼幫我完成專案？

### 從終端機執行 Node.js 腳本

在瀏覽器裡，JavaScript 由網頁載入後自動執行；在 Node 裡，你要主動用終端機（terminal）去跑一個檔案。做法很單純：建立一個 `.js` 檔，然後執行 `node 檔名.js`。

```bash
node app.js
```

Node 會從檔案第一行開始，由上而下同步執行程式。這就是所有 Node 程式的進入點（entry point）。你也可以直接輸入 `node`（不帶檔名）進入 REPL（Read-Eval-Print-Loop，互動式解譯環境），一行一行試語法，很適合驗證小片段。

### Module（模組）：Node 程式的組成單位

在 Node 裡，每一個 `.js` 檔案就是一個 module。module 有三種來源：

1. **內建 module（built-in / core module）**：Node 隨附的官方模組，例如 `http`、`fs`、`url`、`events`、`path`，不需安裝即可使用。
2. **自己寫的 module（user-created）**：你把功能拆到另一個檔案，再匯入使用。
3. **第三方 module**：透過 NPM 從網路上安裝別人寫好的套件（package）。

Node 傳統上使用 **CommonJS** 模組系統：用 `require()` 匯入，用 `module.exports` 匯出。範例如下——先在 `math.js` 匯出功能：

```javascript
// math.js
function add(a, b) {
  return a + b;
}

// 把 add 掛到 module.exports 上，別的檔案才拿得到
module.exports = { add };
```

再在 `app.js` 匯入使用：

```javascript
// app.js
const math = require('./math'); // 自己的 module 要加相對路徑 ./
console.log(math.add(2, 3));     // 輸出 5
```

匯入內建 module 時則不加路徑，直接寫名稱，例如 `const http = require('http')`。近年 Node 也支援 ECMAScript Modules（ESM）的 `import` / `export` 語法，但本課先以 CommonJS 為主，兩者觀念相同，差別只在語法。

### HTTP module：架一台最基本的網頁伺服器

`http` 是把 Node 用來做後端的關鍵 module。它的核心是 `http.createServer()`：這個方法建立一台 HTTP 伺服器，並接受一個 handler（處理函式）。每當有請求（request）進來，這個 handler 就會被執行一次，它收到兩個物件：

- `request`（常簡寫 `req`）：代表這次進來的請求，含有網址、方法、標頭等資訊。
- `response`（常簡寫 `res`）：代表你要送回去的回應，你用它設定狀態碼、標頭與內容。

```javascript
// server.js
const http = require('http');

// 每次收到請求都會執行這個 handler
const server = http.createServer((req, res) => {
  res.statusCode = 200;                          // HTTP 狀態碼 200 表示成功
  res.setHeader('Content-Type', 'text/plain');   // 告訴瀏覽器回應的內容型別
  res.end('Hello Node.js!');                     // 送出內容並結束回應
});

// 讓伺服器在 3000 埠上「監聽」請求
server.listen(3000, () => {
  console.log('伺服器啟動中：http://localhost:3000');
});
```

執行 `node server.js` 後，打開瀏覽器連 `http://localhost:3000`，就會看到 `Hello Node.js!`。要做出多頁網站，你可以在 handler 裡讀取 `req.url`，判斷使用者要的是哪個路徑，再回傳對應的內容——這正是後面專案要做的事。

除了「當伺服器」，Node 也能「當客戶端」對外送 HTTP 請求。現代 Node 內建了瀏覽器熟悉的 `fetch()`，不需額外安裝即可抓取遠端資料：

```javascript
// 對外發出 GET 請求並讀取 JSON 回應
const res = await fetch('https://api.example.com/data');
const data = await res.json();
console.log(data);
```

### File System（fs）module：讀、寫、更新、刪除檔案

`fs` module 讓 Node 能操作檔案系統，這是後端常見的需求（例如把網頁的 HTML 檔讀進來回傳給使用者）。`fs` 的大多數方法都有兩種版本：

- **非同步（asynchronous）版**：用 callback（回呼函式）或 Promise，不會卡住程式。這是 Node 的預設偏好，因為它讓程式在等待磁碟時還能處理其他工作。
- **同步（synchronous）版**：函式名結尾帶 `Sync`（例如 `readFileSync`），會擋住程式直到完成。簡單腳本可用，但正式伺服器裡要小心，因為它會阻塞整個程序。

以下用 callback 風格示範讀與寫：

```javascript
const fs = require('fs');

// 寫入檔案（若檔案不存在會建立，存在則覆蓋）
fs.writeFile('message.txt', 'Hello!', (err) => {
  if (err) throw err;
  console.log('寫入完成');
});

// 讀取檔案，第二個參數指定編碼，才會拿到字串而非 Buffer
fs.readFile('message.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data); // 輸出 Hello!
});
```

對應到「CRUD」四種操作：`writeFile` 用來建立與更新（append 用 `appendFile` 可只追加不覆蓋）、`readFile` 用來讀取、`unlink` 用來刪除。若你偏好 Promise / `async` / `await` 的寫法，可改用 `require('fs/promises')` 版本，程式碼會更平順好讀。

### URL 類別：把網址拆成可讀的部件

當請求進來時，你拿到的 `req.url` 只是一串字串。`url` module 提供的 **WHATWG URL** 類別能把它解析成結構化的物件，讓你輕鬆取出各部分：

```javascript
const myURL = new URL('https://example.com:8080/about?name=odin#top');

console.log(myURL.hostname);      // example.com
console.log(myURL.port);          // 8080
console.log(myURL.pathname);      // /about
console.log(myURL.search);        // ?name=odin
console.log(myURL.searchParams.get('name')); // odin（讀取 query string 參數）
console.log(myURL.hash);          // #top
```

其中 `pathname`（路徑）能幫你判斷使用者想去哪個頁面，`searchParams`（查詢參數）則能讀取網址上 `?key=value` 形式的 query（查詢字串）。這在做路由（依網址決定回傳內容）時非常實用。

### NPM：Node 的套件管理器

**NPM（Node Package Manager）** 隨 Node 一起安裝，用來安裝、管理專案所依賴的第三方 package。核心觀念：

- `npm init`（或 `npm init -y` 一鍵用預設值）會建立 `package.json`，這個檔案記錄你的專案資訊與依賴清單。
- `npm install 套件名` 會下載套件到 `node_modules/` 資料夾，並把它寫進 `package.json` 的 dependencies。
- `node_modules/` 通常很大，一般不會加入版本控制（放進 `.gitignore`），因為別人只要有 `package.json`，跑一次 `npm install` 就能還原所有依賴。

```bash
npm init -y            # 建立 package.json
npm install express    # 安裝 express 套件並記錄成依賴
```

裝好後，在程式裡就能像內建 module 一樣 `require('express')` 來使用。

### Events module：自訂事件的發送與監聽

Node 有很大一部分是圍繞著「事件」運作的（例如「有請求進來」本身就是一種事件）。`events` module 提供 `EventEmitter` 類別，讓你能自己定義事件、發送事件、以及監聽事件——這是所謂的**觀察者模式（observer pattern）**：

```javascript
const EventEmitter = require('events');

const myEmitter = new EventEmitter();

// 監聽（listen）名為 'greet' 的事件，註冊一個處理函式
myEmitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

// 發送（fire / emit）'greet' 事件，並帶入參數
myEmitter.emit('greet', 'Odin'); // 輸出 Hello, Odin!
```

`on()` 用來註冊監聽器，`emit()` 用來觸發事件並把資料傳給所有監聽該事件的函式。你會發現許多 Node 內建物件（包括前面的 HTTP server）其實都是 `EventEmitter` 的延伸，理解這個模式能幫你看懂 Node 底層的運作方式。

把上面這些拼起來——用 `http` 收請求、用 `url` 解析網址決定路由、用 `fs` 讀出對應的頁面內容回傳、必要時用 NPM 引入工具、用 events 串接非同步流程——你就具備了做出一個基本多頁網站所需的全部零件。

## 程式碼範例

以下是一個把 HTTP、URL 與 fs 觀念結合起來的最小可執行範例：依網址路徑回傳不同頁面內容。

```javascript
// app.js — 用 node app.js 執行後連 http://localhost:3000
const http = require('http');

const server = http.createServer((req, res) => {
  // 用 URL 類別解析請求網址；第二個參數提供 base，才能解析相對路徑
  const url = new URL(req.url, `http://${req.headers.host}`);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  // 依 pathname（路徑）決定回傳哪個頁面
  if (url.pathname === '/') {
    res.statusCode = 200;
    res.end('<h1>首頁 Index</h1>');
  } else if (url.pathname === '/about') {
    res.statusCode = 200;
    res.end('<h1>關於 About</h1>');
  } else {
    res.statusCode = 404; // 找不到頁面
    res.end('<h1>404 找不到頁面</h1>');
  }
});

server.listen(3000, () => {
  console.log('伺服器啟動：http://localhost:3000');
});
```

## 常見陷阱

!!! warning "忘記呼叫 res.end()，瀏覽器會一直轉圈"
    HTTP 回應必須明確結束。若你在 handler 裡設定了狀態碼與內容，卻忘了呼叫 `res.end()`（或 `res.write()` 後不 `end()`），瀏覽器會一直等待回應而卡住。每一條處理分支都要確保最終有結束回應。

!!! warning "readFile 不給編碼會拿到 Buffer 而非字串"
    `fs.readFile('file.txt', callback)` 沒指定編碼時，`data` 會是二進位的 Buffer 物件，直接印出來是一堆位元組。要拿到可讀字串，記得傳入 `'utf8'`：`fs.readFile('file.txt', 'utf8', callback)`。

!!! warning "同步方法會阻塞整台伺服器"
    帶 `Sync` 的方法（如 `readFileSync`）會擋住整個 Node 程序直到完成。在只跑一次的小腳本裡無妨，但在要同時服務多個使用者的伺服器裡，一個同步的磁碟或網路操作會讓所有人一起等。伺服器程式優先用非同步（callback 或 `async` / `await`）版本。

## 練習

本課的教材以「跟著 Node.js 官方文件動手做」為主。建議依序完成以下閱讀與實作，每一步都打開終端機親手跑一次：

1. 練習**從終端機執行 Node.js 腳本**：建立一個 `hello.js`，寫一行 `console.log('Hello')`，用 `node hello.js` 跑起來。
2. **HTTP module**：讀 Node 官方 `http` 文件，重點看 `http.createServer`；再練習用內建 `fetch()` 對外送 HTTP 請求。
3. **File System**：了解 `fs` module 的用途，接著練習用 Node 寫檔（`writeFile`）與讀檔（`readFile`）。
4. **URL 類別**：閱讀 WHATWG URL API 文件，把範例網址丟進 `new URL()` 玩玩看各個屬性。
5. **Events**：跟著 EventEmitter 章節，練習用 `on()` 監聽、用 `emit()` 發送自訂事件。

知識檢核：你能說明「File System module 是什麼、為什麼要用、怎麼用」嗎？若答不出來，回到上面 fs 段落複習即可，不需要死背。

本課之後的專案（Basic Informational Site）會要求你把以上零件組成一個含 `Index`、`About`、`Contact Me` 三頁的網站；專案的作業系統專屬步驟與細節，請回到原文對照操作。

## 原文與延伸資源

- 原文：[Getting Started](https://www.theodinproject.com/lessons/nodejs-getting-started)
- 本課引用：
    - [Run Node.js scripts from the command line](https://nodejs.org/en/learn/command-line/run-nodejs-scripts-from-the-command-line)
    - [Making HTTP requests with Node (fetch)](https://nodejs.org/en/learn/getting-started/fetch)
    - [Node http module 文件](https://nodejs.org/api/http.html)
    - [Writing files with Node.js](https://nodejs.org/en/learn/manipulating-files/writing-files-with-nodejs)
    - [Reading files with Node.js](https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs)
    - [The WHATWG URL API 文件](https://nodejs.org/api/url.html#url_the_whatwg_url_api)
    - [The Node.js Event Emitter](https://nodejs.org/en/learn/asynchronous-work/the-nodejs-event-emitter)
    - [Net Ninja - Node.js Crash Course（12 集播放清單）](https://www.youtube.com/watch?v=zb3Qk8SG5Ms&list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU)

---

> 本講義改寫自 The Odin Project《Getting Started》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
