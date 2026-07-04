---
title: 路由（Routes）
source_url: https://www.theodinproject.com/lessons/nodejs-routes
source_file: vendor/curriculum/nodeJS/express/routing.md
path: full-stack-javascript
course: NodeJS
order: 9
generated: 2026-07-04
---

# 路由（Routes）

> 改寫自 The Odin Project：[Routes](https://www.theodinproject.com/lessons/nodejs-routes)
> ｜Full Stack JavaScript › NodeJS › Express

## 核心概念

在上一課，我們拆解了一個最基本的 Express app，並追蹤一個 request（請求）在其中的旅程。但真實的應用程式要處理各式各樣、針對不同資源的請求：使用者可能要看首頁、看訊息列表、送出一則新訊息、瀏覽某本書的資料等等。要讓伺服器知道「這個請求該交給哪一段程式碼處理」，靠的就是 route（路由）。

route（路由）做的事情其實很單純：把一個請求的 **HTTP verb（HTTP 動詞，例如 GET 或 POST）** 加上 **URL path（路徑）**，對應到一組適當的 middleware（中介函式），也就是我們稱為 controller（控制器）的東西。controller 與 middleware 的細節會在下一課深入，這一課先專注在路由本身如何運作。

### 一個 route 的組成

回顧上一課那個唯一的 route：

```javascript
app.get("/", (req, res) => res.send("Hello, world!"));
```

`app.get("/", ...)` 告訴我們：這個 route 會匹配所有經過 `app` 這個 router（路由器，也就是我們整個伺服器）、且發送到 `/` 路徑的 GET 請求。如果改成：

```javascript
app.post("/messages", (req, res) => res.send("This is where you can see any messages."));
```

那就代表這個 route 匹配所有送到 `/messages` 路徑的 **POST** 請求。如果你對 `/messages` 送出的是 GET 請求，它就不會匹配到這個 route。每個 HTTP verb 都有自己對應的 Express route method（`app.get`、`app.post`、`app.put`、`app.delete` 等等），此外還有 `app.all()`，可以讓一個 route 匹配所有 verb。

現階段我們主要用到兩個 verb：**GET**（只從伺服器取得資料）與 **POST**（把資料送到伺服器，例如表單）。之後講到 REST API 時，你會更常遇到 PUT 與 DELETE。

### Path（路徑）：字串與模式

route 的第一個參數是要匹配的 path，可以是字串，也可以是正規表達式。字串路徑是精確比對：`/messages` 只匹配 `/messages`；`/messages/all` 只匹配 `/messages/all`，不會匹配 `/messages`，也不會匹配 `/messages/new`。

Express 5 提供幾個好用的字串模式語法：

- **`{}` 讓字元變成可選**：用大括號把某些字元包起來，代表它們可有可無。

```javascript
// 同時匹配 /message 與 /messages
"/message{s}"

// 同時匹配 / 與 /messages
"/{messages}"

// 同時匹配 /foo/baz 與 /foo/bar/baz
"/foo{/bar}/baz"
```

- **`*`（splat，又稱萬用字元 wildcard）匹配任意數量的任意字元**。在 Express 5 的路徑中，splat 後面一定要接一個名稱。最常見的用途是當成「其他都沒匹配到」的 catch-all，例如自訂的 404 錯誤處理：

```javascript
// 匹配 /、/odin，甚至 /sdds8fjsdifhj98sdfh
"/{*splat}"
```

### 順序很重要

route 會依照你「定義的先後順序」被安裝到伺服器上，比對時也是由上往下。這代表：一旦某個請求匹配到前面的 route，就不會再往下比對。看這個例子：

```javascript
app.get("/{*splat}", (req, res) => {
  res.send("/{*splat} 會攔截所有沒被匹配到的路徑，適合做自訂 404。");
});
app.get("/messages", (req, res) => {
  res.send("這個 route 永遠不會被觸發，因為上面那條先匹配成功了。");
});
```

因為 `/{*splat}` 什麼都吃，`GET /messages` 一進來就被它攔走了，永遠到不了下面那條 `/messages`。要讓 `/messages` 能被匹配，必須把它排在 catch-all 之前。記住這個原則：**具體、明確的 route 放前面，涵蓋範圍大的 catch-all 放最後。**

### Route parameter（路由參數）

假設我們想為「任意使用者名稱的所有訊息」設一個 route，例如 `/odin/messages`、`/thor/messages`，甚至 `/theodinproject79687378/messages`。這時就用 route parameter（路由參數），概念和 React Router 一樣，而且一條 path 裡可以放任意多個參數。

要標記一個 route parameter，就在某個路徑段落的開頭放一個 `:`，後面接參數名稱（名稱只能由大小寫英數字或 `_` 組成）。當請求匹配時，Express 會自動把對應的值填進 `req.params` 物件，用參數名稱當 key：

```javascript
/**
 * GET /odin/messages 會 log 出
 * { username: "odin" }
 *
 * GET /theodinproject79687378/messages 會 log 出
 * { username: "theodinproject79687378" }
 */
app.get("/:username/messages", (req, res) => {
  console.log(req.params);
  res.end();
});

/**
 * GET /odin/messages/79687378 會 log 出
 * { username: "odin", messageId: "79687378" }
 */
app.get("/:username/messages/:messageId", (req, res) => {
  console.log(req.params);
  res.end();
});
```

如此一來，我們就能輕鬆從請求路徑中取出動態的值，供後續 middleware 使用。

### Query parameter（查詢參數）

query parameter（查詢參數）是 URL 尾端一段獨特又可選的部分。它以 `?` 開頭，之後每個查詢都是一組 `key=value` 的鍵值對，多組之間用 `&` 分隔。它的特別之處在於：query 並不算是 path 本身的一部分，比較像是「傳給某個 path 的參數（argument）」。

舉例來說，`/odin/messages?sort=date&direction=ascending` 一樣會匹配 path 為 `/:username/messages` 的 route，因為 `?` 之後的東西不參與路徑比對；但我們可以在 middleware 裡讀到 `sort=date` 與 `direction=ascending` 這兩組鍵值對。

Express 會自動解析請求中的 query parameter，把找到的鍵值對填進 `req.query` 物件。如果同一個 key 重複出現，Express 會把該 key 的所有值收集成一個陣列：

```javascript
/**
 * GET /odin/messages?sort=date&direction=ascending 會 log
 * Params: { username: "odin" }
 * Query: { sort: "date", direction: "ascending" }
 *
 * GET /odin/messages?sort=date&sort=likes&direction=ascending 會 log
 * Params: { username: "odin" }
 * Query: { sort: ["date", "likes"], direction: "ascending" }
 */
app.get("/:username/messages", (req, res) => {
  console.log("Params:", req.params);
  console.log("Query:", req.query);
  res.end();
});
```

你其實早就見過這個機制。YouTube 每支影片都有一段代碼，要看那支影片，你會前往 `https://www.youtube.com/watch`，並用 `v` 這個 key 把影片代碼當 query parameter 傳進去；甚至可以用 `t` 這個 key 指定從第幾秒開始播放。所以在網址後面接上 `?v=xm3YgoEiEDc&t=424s`，就等於向 YouTube 請求 `/watch`，播放 `xm3YgoEiEDc` 這支影片、從第 424 秒開始。

### Router（路由器）：把 route 分組拆檔

到目前為止，我們的 route 都掛在 `app`（也就是伺服器本身）上。但在有大量 route 的真實應用中，我們會想把 route 依功能分組，並把每一組抽到自己的檔案裡。這樣不只更好維護，也方便針對「只屬於這一組的 route」套用共用邏輯，而不影響其他 route。

假設我們在做一個圖書館 app，需要處理與「書」有關的頁面、與「作者」有關的頁面，再加上首頁與 about、contact 之類的雜項頁面。伺服器可能要處理這些 route：

```text
GET /
GET /about
GET /contact
POST /contact

GET /books
GET /books/:bookId
GET /books/:bookId/reserve
POST /books/:bookId/reserve

GET /authors
GET /authors/:authorId
```

我們可以用 Router（路由器）把這些分組抽到各自的檔案。先建立一個 `routes` 資料夾，放入例如 `routes/authorRouter.js`：

```javascript
// routes/authorRouter.js
const { Router } = require("express");

const authorRouter = Router();

authorRouter.get("/", (req, res) => res.send("All authors"));
authorRouter.get("/:authorId", (req, res) => {
  const { authorId } = req.params;
  res.send(`Author ID: ${authorId}`);
});

module.exports = authorRouter;
```

我們從 express 物件解構出 `Router` 函式，用它建立 `authorRouter`。在這個 router 上，一樣可以用 `.get`、`.post` 等 method 定義 route 與 middleware，只是它們的作用範圍縮小到這個 router。要特別注意的是：稍後我們會讓這個 router 只負責 `/authors` 開頭的路徑，所以 router 內部的 route path **不需要**再寫 `/authors`，它們是在父路徑後面「延伸」。`authorRouter.get("/")` 對應的其實是 `/authors`；`authorRouter.get("/:authorId")` 對應的是 `/authors/:authorId`。如果內部又寫 `/authors`，最後會變成 `/authors/authors/:authorId`，那就錯了。

接著照同樣方式建立另外兩個 router：`routes/bookRouter.js` 與 `routes/indexRouter.js`。它們的 middleware 不用做太複雜的事，只要對每個 route 回傳一段獨特的訊息，讓你知道是哪個 route 被匹配即可。

三個 router 都做好後，在 `app.js` 把它們掛上伺服器：

```javascript
// app.js
const express = require("express");
const app = express();
const authorRouter = require("./routes/authorRouter");
const bookRouter = require("./routes/bookRouter");
const indexRouter = require("./routes/indexRouter");

app.use("/authors", authorRouter);
app.use("/books", bookRouter);
app.use("/", indexRouter);

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`My first Express app - listening on port ${PORT}!`);
});
```

`app.use("/authors", authorRouter)` 的意思是：任何路徑以 `/authors` 開頭的請求，都交給 `authorRouter` 去做 route 比對。如果請求以 `/books` 開頭，就跳過作者的那些 route，改去 `bookRouter` 裡比對。其他都不符合的請求，最後交給 `indexRouter`。

要測試這些 route，可以用 [Postman](https://www.postman.com/downloads/) 這類工具，它讓你不必透過瀏覽器就能送出 GET 與 POST 請求，這很重要，因為我們沒辦法從瀏覽器的網址列送出 POST 請求。

把這幾件事串起來，你就掌握了 Express 路由的全貌：用 HTTP verb 加 path 定義 route、用字串模式與 route parameter 讓路徑更有彈性、用 query parameter 傳遞額外選項、再用 Router 把 route 分組成可維護的檔案結構。

## 程式碼範例

以下是一個最小可執行的範例，把本課概念濃縮成一個伺服器加一個 router。

`app.js`：

```javascript
// app.js
const express = require("express");
const app = express();

// 把 /users 開頭的請求交給 userRouter
const userRouter = require("./routes/userRouter");
app.use("/users", userRouter);

// catch-all 放最後，處理所有沒被匹配到的路徑（自訂 404）
app.get("/{*splat}", (req, res) => {
  res.status(404).send("找不到這個頁面");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器已啟動，監聽 port ${PORT}`);
});
```

`routes/userRouter.js`：

```javascript
// routes/userRouter.js
const { Router } = require("express");
const userRouter = Router();

// 對應 GET /users
userRouter.get("/", (req, res) => res.send("所有使用者"));

// 對應 GET /users/:userId，並讀取 route parameter 與 query parameter
// 例如 GET /users/42?sort=name
userRouter.get("/:userId", (req, res) => {
  const { userId } = req.params; // "42"
  const { sort } = req.query;    // "name"
  res.send(`使用者 ID：${userId}，排序方式：${sort}`);
});

module.exports = userRouter;
```

執行步驟：

```bash
npm init -y
npm install express
node app.js
# 另開終端機或用 Postman 測試：
# GET  http://localhost:3000/users
# GET  http://localhost:3000/users/42?sort=name
# GET  http://localhost:3000/anything-else  -> 觸發 404
```

## 常見陷阱

!!! warning "route 的順序會決定誰被匹配"
    Express 由上而下逐一比對 route，一旦匹配成功就停止。如果把 catch-all（例如 `/{*splat}`）放在具體 route 前面，具體 route 就永遠到不了。務必把明確的 route 放前面、涵蓋範圍最廣的放最後。

!!! warning "掛在 router 上的 path 不要重複前綴"
    當你用 `app.use("/authors", authorRouter)` 掛載時，router 內部的 route path 是「接在 `/authors` 後面」延伸的。router 裡要寫 `authorRouter.get("/:authorId")`（對應 `/authors/:authorId`），而不是 `authorRouter.get("/authors/:authorId")`，否則實際路徑會變成 `/authors/authors/:authorId`。

!!! warning "query parameter 不是 path 的一部分"
    `?` 之後的內容不參與路徑比對，所以 `/odin/messages?sort=date` 仍會匹配 path 為 `/:username/messages` 的 route。query 從 `req.query` 讀取、route parameter 從 `req.params` 讀取，兩者來源不同，別搞混。此外，同一個 key 重複出現時 Express 會回傳陣列，讀值時要考慮到這點。

!!! warning "瀏覽器網址列只能送 GET"
    你無法從瀏覽器網址列送出 POST 請求，所以測試 POST route 時要用 Postman 之類的工具，否則會誤以為 route 沒寫對。

## 練習

1. 閱讀 Express 官方的[路由入門（Routing primer）](https://expressjs.com/en/guide/routing.html)，對本課主題建立整體概念。需要查特定 method 的細節時，隨時參考 [Express API 文件](https://expressjs.com/en/api.html)。
2. 動手驗證所學：建立一個含 `app.js` 與 `routes/` 資料夾的小專案，至少寫出兩個 router（例如 `bookRouter` 與 `authorRouter`），各自定義幾個帶 route parameter 的 route，並用 `app.use` 掛到不同前綴上。用 Postman 或瀏覽器實際送請求，確認 `req.params` 與 `req.query` 的內容符合預期，並刻意把 catch-all 放到前面、觀察後面的 route 是否真的無法被匹配。

## 原文與延伸資源

- 原文：[Routes](https://www.theodinproject.com/lessons/nodejs-routes)
- 本課引用：
  - [Express 路由入門（Routing guide）](https://expressjs.com/en/guide/routing.html)
  - [Express API 文件](https://expressjs.com/en/api.html)
  - [Express 5 wildcards 說明](https://expressjs.com/en/5x/guide/routing/#wildcards)
  - [app.all() API 文件](https://expressjs.com/en/5x/api/application/#appallpath-callback--callback-)
  - [MDN：HTTP 方法（HTTP Methods）](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
  - [Postman 下載](https://www.postman.com/downloads/)
  - 影片：[Express Routes 綜覽](https://youtu.be/0Hu27PoloYw?si=LZ8wQkOTP-e50Zvi)

---

> 本講義改寫自 The Odin Project《Routes》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
