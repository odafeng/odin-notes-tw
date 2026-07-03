---
title: 測試路由與控制器
source_url: https://www.theodinproject.com/lessons/nodejs-testing-routes-and-controllers
source_file: vendor/curriculum/nodeJS/testing_express/testing_routes_and_controllers.md
path: full-stack-javascript
course: NodeJS
order: 25
status: draft
generated: 2026-07-04
---

# 測試路由與控制器

> 改寫自 The Odin Project：[Testing Routes and Controllers](https://www.theodinproject.com/lessons/nodejs-testing-routes-and-controllers)
> ｜Full Stack JavaScript › NodeJS › Testing Express

## 核心概念

你在前面的 JavaScript 課程已經寫過 unit test（單元測試），知道怎麼用 Jest 之類的框架驗證一個 function 的輸出。這一課要解決的不是「測試的哲學」，而是一個更具體的問題：**當被測的對象不是純函式，而是一條 Express route（路由）或它背後的 controller（控制器）時，該怎麼測？**

route 的特別之處在於，它的行為要透過一個 HTTP 請求才觸發。你沒辦法像呼叫普通 function 那樣直接 `index("/")` 拿到回傳值，你得先「發一個 GET 請求到 `/`」，然後檢查回來的 HTTP response（回應）——狀態碼是不是 200、`Content-Type` 是不是 JSON、body 內容對不對。要做到這件事，我們需要一個能在測試裡「假裝發 HTTP 請求」的工具，這就是 **SuperTest** 登場的地方。

### 第一步：把要測的東西變成可匯出的模組

測試任何程式碼最基本的前提是：**它必須被 export（匯出）**。不管是自訂的 middleware 還是 route/controller，你都得先把它們拆成獨立、可被 `require` 的模組。對 route 來說，你其實早就會這招了——就是用 `express.Router`。

一個很典型的結構是把「啟動 server」和「定義路由」分成兩個檔案：

- `app.js`：建立 Express app、掛上 middleware、`app.listen(3000, ...)` 啟動伺服器。
- `index.js`：用 `express.Router()` 定義各條 route，最後 `module.exports = index`。

這樣拆有一個很重要的理由：`app.js` 裡幾乎只有「啟動與執行 app」的樣板程式碼，沒有任何屬於你自己的邏輯，所以**不需要測**。真正含有你想驗證邏輯的是 `index.js`,它才是測試的目標。把路由抽成 Router 匯出，測試檔就能單獨把它 `require` 進來組一個 app。

### SuperTest 是什麼、怎麼運作

[SuperTest](https://github.com/forwardemail/supertest) 是一個專門用來測試 HTTP 伺服器的函式庫。它的核心用法是：你把 Express 的 `app` 物件交給它，它就能對這個 app 發出模擬的 HTTP 請求，並提供一串鏈式（chainable）的斷言方法讓你檢查回應。

關鍵在於：**SuperTest 不需要你真的把 server 監聽在某個 port 上**。你不必呼叫 `app.listen()`,SuperTest 會在背後自動幫你把 app 綁到一個臨時的埠、發完請求後再關掉。這帶來兩個好處：測試之間不會互相搶 port、也不會有殘留的 server process；而且測試跑得很快。

SuperTest 其實是站在另一個專案 **SuperAgent** 的肩膀上。SuperAgent 是一個泛用的 HTTP client（客戶端）函式庫,負責「怎麼組裝並送出一個請求」——設定內容型別、帶上表單資料、處理 multipart 等等,全都是 SuperAgent 提供的能力。SuperTest 則在它之上加了「針對測試」的部分,最重要的就是 `.expect()` 斷言方法。換句話說：**凡是 SuperAgent 能呼叫的方法(如 `.type()`、`.send()`、`.query()`),你在 SuperTest 上也都能用。** 所以讀 SuperTest 文件時,別忘了同時翻 SuperAgent 文件。

### `.expect()`：SuperTest 的斷言心臟

`.expect()` 是你在測試裡用來「宣告我期待回應長什麼樣」的方法,而且它很聰明,會依照你傳的參數型別做不同的檢查：

- `.expect(200)`：傳入數字 → 檢查 **HTTP 狀態碼**是不是 200。
- `.expect("Content-Type", /json/)`：傳入「欄位名 + 值(可用正則)」→ 檢查 **response header**。
- `.expect({ name: "frodo" })`：傳入物件 → 檢查 **response body** 是否相符。

你可以把多個 `.expect()` 串在一起,SuperTest 會一個一個驗證,只要有任何一個不符就讓測試失敗。

### `done` 參數:處理非同步

HTTP 請求本質上是非同步的。Jest(以及大多數測試框架)有個約定:如果你在測試的 callback 裡宣告一個參數(慣例上叫 `done`),Jest 就知道「這是一個非同步測試,我要等你呼叫 `done()` 才算完成」;若在 timeout 內都沒被呼叫,測試就算失敗。這可以避免「請求還沒回來,測試就提早結束、誤判為通過」的問題。

SuperTest 為此提供了一個貼心的便利:**你可以把 `done` 直接當作最後一個 `.expect()` 的第二個參數傳進去**,SuperTest 會在斷言全部完成後自動幫你呼叫 `done`。你不用自己寫 `.end((err) => { if (err) ... ; done(); })`。

這裡順帶一提 `.end()`:如果你選擇用 `.end(callback)` 而不是把 `done` 交給 `.expect()`,那麼斷言若失敗,錯誤會被當成第一個參數傳進 callback(`err`),你必須自己判斷 `err` 並手動把它交給 `done`,否則失敗可能被吞掉。把 `done` 直接丟給最後的 `.expect()` 之所以方便,就是因為 SuperTest 幫你把這段錯誤處理接好了。

### 串接多個請求:用 Promise

SuperTest 的呼叫回傳一個 Promise,所以你可以用 `.then()`(或 `async/await`)串起「先送出一個請求、等它完成、再送下一個」的流程。這在測試「寫入後能不能讀到」這類情境時特別有用——例如先 POST 一筆資料,等 promise resolve 後再 GET 回來,確認資料真的被存進去。

### 別在正式資料庫上跑測試

上面的範例用一個記憶體裡的陣列當「資料庫」,所以很單純。但真實應用會接資料庫,這時務必記住一條鐵律:**絕對不要把測試程式碼跑在 production(正式)資料庫上**。測試常會塞入假資料、清空資料表,跑在正式庫上等於在破壞使用者的真實資料。正確做法是用一個獨立的 test database(測試資料庫)或 mock database(模擬資料庫),這部分會在後面的課程專門討論。

## 程式碼範例

先安裝相依套件(存成 devDependency):

```bash
npm install jest supertest --save-dev
```

被測的路由模組 `index.js`,用 `express.Router` 定義並匯出:

```javascript
//// index.js
const express = require("express");
const index = express.Router();

const array = []; // 用記憶體陣列充當「資料庫」

index.get("/", (req, res) => {
  res.json({ name: "frodo" });
});

index.get("/test", (req, res) => res.json({ array }));

index.post("/test", (req, res) => {
  array.push(req.body.item); // 把送來的 item 推進陣列
  res.send("success!");
});

module.exports = index; // 一定要匯出,測試才 require 得到
```

測試檔:在測試裡「重新組一個 app」,只掛上必要的 middleware 與路由,刻意不呼叫 `app.listen`:

```javascript
const index = require("../index"); // 匯入要測的路由模組

const request = require("supertest"); // 把 supertest 當成 request function
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false })); // 解析表單資料
app.use("/", index); // 掛上被測路由;注意這裡沒有 app.listen

test("index route works", (done) => {
  request(app)
    .get("/")
    .expect("Content-Type", /json/) // 檢查 header
    .expect({ name: "frodo" })       // 檢查 body
    .expect(200, done);              // 檢查狀態碼,並把 done 交給 SuperTest
});

test("testing route works", (done) => {
  request(app)
    .post("/test")
    .type("form")          // 設定為表單型別(SuperAgent 提供)
    .send({ item: "hey" }) // 帶上表單資料
    .then(() => {
      // POST 完成後,再 GET 回來確認資料真的被寫入
      request(app)
        .get("/test")
        .expect({ array: ["hey"] }, done);
    });
});
```

執行測試(可在 `package.json` 的 `scripts` 加上 `"test": "jest"` 後用 `npm test`):

```bash
npx jest
```

## 常見陷阱

!!! warning "忘記 export,測試根本 require 不到"
    測試的前提是被測對象「可被匯入」。如果 `index.js` 沒有 `module.exports = index`,測試檔 `require("../index")` 拿到的會是 `undefined`,`app.use("/", undefined)` 會直接報錯。custom middleware 也是同理,先確認它在自己的模組裡並且有被匯出。

!!! warning "在測試裡呼叫 app.listen 導致埠被佔用"
    測試檔要「重新組一個乾淨的 app」,而且**不要**呼叫 `app.listen()`。SuperTest 會自己處理綁埠與釋放。若你把整個含 `app.listen` 的 `app.js` 直接匯進來,多個測試檔可能同時搶同一個 port 而報 `EADDRINUSE`,或留下沒關掉的 server 讓 Jest 卡住不結束。

!!! warning "非同步測試沒處理 done,錯誤被吞掉"
    HTTP 請求是非同步的。若你宣告了 `done` 卻沒有在請求完成時呼叫它,測試會等到 timeout 才失敗;更糟的是若用 `.then()` 串接卻忘了把 `done` 交給最後的 `.expect()`,斷言失敗可能不會讓測試變紅。最穩妥的做法是把 `done` 直接傳給最後一個 `.expect()`,或全程改用 `async/await`。

!!! warning "把測試跑在正式資料庫上"
    測試會塞假資料、清資料表。跑在 production 資料庫上等於直接破壞真實資料。永遠使用獨立的 test/mock database。

## 練習

1. 完整讀過 [SuperTest 文件](https://github.com/forwardemail/supertest),特別留意 README 裡的 About(它的動機)與 Example 段落——注意 `.end()` 搭配 `.expect()` 時錯誤處理的差異。
2. SuperTest 的許多能力其實來自它依賴的 SuperAgent。凡是 SuperAgent 能呼叫的方法,SuperTest 都能用,所以也請翻一遍 [SuperAgent 文件](https://forwardemail.github.io/superagent/),尤其是處理 multipart requests(多段/檔案上傳)的方法與用法。
3. 動手把本課的 `index.js` 與測試檔實作出來,`npx jest` 跑通兩個測試;接著自己再加一條 route(例如 `DELETE /test` 清空陣列),並為它補一個測試。

## 原文與延伸資源

- 原文:[Testing Routes and Controllers](https://www.theodinproject.com/lessons/nodejs-testing-routes-and-controllers)
- 本課引用:
  - [SuperTest(GitHub)](https://github.com/forwardemail/supertest)——測試 HTTP 伺服器的函式庫,提供 `.expect()` 斷言。
  - [SuperAgent 文件](https://forwardemail.github.io/superagent/)——SuperTest 底層依賴的 HTTP client,`.type()`、`.send()`、multipart 等方法來源。
  - [Jest](https://jestjs.io/)——本課示範所用的測試框架,提供 `test`、`done` 的非同步約定。

---

> 本講義改寫自 The Odin Project《Testing Routes and Controllers》,原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權,本文以相同授權釋出。
