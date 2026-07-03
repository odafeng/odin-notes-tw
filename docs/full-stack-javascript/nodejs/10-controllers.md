---
title: 控制器（Controllers）
source_url: https://www.theodinproject.com/lessons/nodejs-controllers
source_file: vendor/curriculum/nodeJS/express/controllers.md
path: full-stack-javascript
course: NodeJS
order: 10
status: draft
generated: 2026-07-04
---

# 控制器（Controllers）

> 改寫自 The Odin Project：[Controllers](https://www.theodinproject.com/lessons/nodejs-controllers)
> ｜Full Stack JavaScript › NodeJS › Express

## 核心概念

上一課我們學了 route（路由）：把「HTTP verb + path」對應到某段負責處理的程式碼。這一課要把焦點放到「那段程式碼」本身，也就是 controller（控制器）。

### controller 是什麼：MVC 裡的中間人

controller 最好的比喻是「一個什麼都懂的中間人」。它知道要向 model（模型，也就是資料層）問哪些問題，但真正查資料、算資料的粗活交給 model 去做；它知道最後要用哪個 view（視圖）把畫面組出來回給瀏覽器，但實際拼 HTML 的工作交給 view 處理。controller 之所以叫「控制器」，是因為它夠聰明，知道每一步該做什麼，然後把苦工分派出去。

這正是 **MVC（Model-View-Controller）** 這個軟體組織模式的核心分工：

- **Model（模型）**：負責資料，例如查詢資料庫、儲存資料。
- **View（視圖）**：負責把資料呈現成使用者看得到的格式，通常是 HTML。
- **Controller（控制器）**：居中協調，確保每個角色各司其職，最後交出正確結果。

說到底，controller 就是一個「職責定義清楚的函式」。在 Express 的世界裡，它其實就是一個 middleware（中介函式），被 route 拿來使用。

### controller 與 middleware 的關係

這裡要先釐清一個容易混淆的觀念：controller 與 middleware 是兩個「不同層次」的概念，只是在 Express 裡剛好用同一種東西實作。

- **middleware** 是 Express 的核心機制：一個能在 request-response cycle（請求—回應週期）中「跑一段程式、修改 request/response、或結束整個週期」的函式。
- **controller** 是 MVC 這個設計模式裡的一個角色。

換句話說，我們是「用 Express 的 middleware 來實作 MVC 裡的 Controller 角色」。所以你會看到「controller 也算是一種 middleware」的說法，但別把兩者畫上等號。

當一個 request 打進伺服器、且有某個 route 匹配到它的 HTTP verb 與 path 時，controller 就登場了。它會接手完成這個請求所需的工作：可能去 model 拿資料、處理資料、依據商業邏輯（business logic）做判斷、或把新資料寫回 model。完成後，再把處理好的資料交給 view 去 render（渲染），或是（之後做 API 時）直接回傳 JSON。

controller 的命名慣例通常跟著它要掛的 route 走，例如 `GET` route 對應 `getSomething`、`POST` route 對應 `createSomething`、`DELETE` route 對應 `deleteSomething`。不過這只是慣例，Express 本身「不強加意見（unopinionated）」，怎麼命名最終取決於你或團隊的約定與函式的實際需求。

### 回應的方法：res 上常用的幾個 method

controller 最終要送回一個 response。Express 在 `res` 物件上提供了好幾種送出回應的方法：

- **`res.send`** — 通用型的送出方法，很有彈性。它會依你傳入的資料自動設定 `Content-Type` header。例如你傳一個物件進去，它會把物件轉成 JSON 字串，並把 `Content-Type` 設為 `application/json`。
- **`res.json`** — 更明確地以 JSON 回應。它一律把 `Content-Type` 設為 `application/json`，並把資料以 JSON 送出。
- **`res.redirect`** — 當你想把 client（客戶端）導向另一個 URL 時用它。
- **`res.render`** — 讓你 render 一個 view template（視圖模板），並把產出的 HTML 當成回應送出。這個之後的 views 課會細講。

另外還有一個很常搭配使用、用來手動設定 status code（狀態碼）的方法：

- **`res.status`** — 設定回應的 status code，但**它本身不會結束 request-response cycle**。你可以在它後面串接其他方法，例如 `res.status(404).send(...)`；但反過來寫 `res.send(...).status(404)` 是不行的。如果你想用預設的 `200`，可以整個省略不寫。

!!! note "res.send 和 res.json 差在哪？"
    既然 `res.send` 會依資料自動設定 `Content-Type`，那為什麼還要用 `res.json`？因為 `res.json` 會「強制」以 JSON 處理，並會自動把非物件的值（例如 `null`、數字）也轉成 JSON；而 `res.send` 不會這樣做——`res.send` 只有在遇到布林值與物件（含陣列）時才會當成 JSON。實際上 `res.json` 內部也是呼叫 `res.send`。所以當你要送 JSON 時，用一個名字就叫「json」的方法最貼切、也最不會出錯。

還有一個關鍵觀念：這些回應方法只會「結束 request-response cycle」，並**不會結束函式的執行**。看這個例子：

```javascript
app.use((req, res) => {
  // 這行有效，而且會結束 request-response cycle
  res.send("Hello");

  // 但它不會讓函式跳出，所以這行仍會執行
  console.log("will still run!!");

  // 接著這行會丟出錯誤：已經送出回應後不能再送一次
  res.send("Bye");
});
```

所以在 controller 裡送完回應後，若後面還有其他邏輯，記得用 `return` 提早跳出函式。

### middleware 深入：三個參數與執行順序

middleware 是 Express 的核心。它夾在「進來的 request」與「最終要處理它的 route handler」之間運作。一個 middleware 函式通常接收三個參數（稍後會看到一種特殊的、有四個參數的）：

- **`req`** — request 物件，代表進來的 HTTP 請求。
- **`res`** — response 物件，代表將要送回 client 的 HTTP 回應。
- **`next`** — 把控制權交給鏈上「下一個」middleware 的函式（可選）。

（這些名字只是慣例，你要叫 `request`、`response` 也完全可以。）

middleware 可以做的事包括：修改 request 或 response 物件（有些套件會這樣做，例如在 request 上加一個新屬性，或設定 `res.locals` 供 `res.render` 的模板使用）、執行額外程式（例如驗證輸入的 validation middleware、做 authentication（認證）的 middleware）、呼叫下一個 middleware，或直接結束整個 request-response cycle。

Express 生態很豐富，你遇到的問題多半有現成套件：authentication、CORS、rate limiting（限流）、session、logging、validation 等等，通常都能找到對應的 middleware。

**middleware 有兩個層級：**

- **Application-level middleware（應用層）**：用 `app.use` 或 `app.METHOD`（如 `app.get`、`app.post`）綁在「Express 實例」上。凡是匹配到指定 path 的每個請求，Express 都會執行它。若不指定 path，Express 預設為 `/`，等於匹配所有請求。這類 middleware 通常放在應用程式最上方，確保它們最先執行。常見的內建 application-level middleware 有：body parser（如 `express.json`、`express.urlencoded`，讓你能透過 `req.body` 取到請求主體）與靜態檔案服務（如 `app.use(express.static("public"))`，用來提供 HTML、CSS、JS、圖片等靜態檔案）。
- **Router-level middleware（路由器層）**：用法一樣，但綁在「Express router 實例」上（`router.use` 或 `router.METHOD`）。因此只有當請求匹配並經過那個 router 時才會執行。

一個最基本的 middleware 長這樣：

```javascript
function myMiddleware(req, res, next) {
  // 做點事
  console.log("Middleware function called");

  // 修改 request 物件
  req.customProperty = "Hello from myMiddleware";

  // 呼叫下一個 middleware / route handler
  next();
}

app.use(myMiddleware);
```

這裡有個**至關重要**的規則：**Express 會依你「註冊的順序」執行 middleware**。所以定義的先後順序會直接影響它們被呼叫的時機。例如某些套件的 middleware 會修改 `Request` 物件，那它就必須擺在最上方，後面所有 middleware 才看得到它的修改。

### 動手做：把 route 接上真正的 controller

上一課我們定義了 `/authors/:authorId` 這個 route。這次我們幫它寫一個真正的 controller，並接上一份範例資料。先做一個假的「資料庫」與查詢函式。在專案根目錄建立 `db.js`：

```javascript
// db.js

const authors = [
  { id: 1, name: "Bryan" },
  { id: 2, name: "Christian" },
  { id: 3, name: "Jason" },
];

async function getAuthorById(authorId) {
  return authors.find((author) => author.id === authorId);
}

module.exports = { getAuthorById };
```

檔名、內容、位置都不重要，這只是一個能讓 controller 呼叫的假查詢函式。接著在 `controllers` 資料夾建立 `authorController.js`：

```javascript
// controllers/authorController.js

const db = require("../db");

async function getAuthorById(req, res) {
  const { authorId } = req.params;

  const author = await db.getAuthorById(Number(authorId));

  if (!author) {
    res.status(404).send("Author not found");
    return;
  }

  res.send(`Author Name: ${author.name}`);
}

module.exports = { getAuthorById };
```

然後在定義 route 的檔案裡引入它並掛上去：

```javascript
// routes/authorRouter.js

const { Router } = require("express");
const { getAuthorById } = require("../controllers/authorController");

const authorRouter = Router();

// ... 其他 route handler
authorRouter.get("/:authorId", getAuthorById);
```

拆解一下這個 controller 做了什麼：

1. route path 帶了一個 route parameter（`/authors/:authorId`），controller 從 `req.params` 取出 `authorId`。
2. 呼叫資料庫查詢函式 `getAuthorById`，用 `authorId` 拿作者資料（注意用 `Number()` 把字串參數轉成數字）。
3. 若找不到作者，用 `res.status(404).send(...)` 回一個 404 與訊息，然後 `return` 跳出——因為送出回應不會自動停止函式執行。
4. 若找到作者，用 `res.send(...)` 回一個 200 與作者名稱。

### 錯誤處理：從 try/catch 到 error middleware

前面的 controller 有個隱憂：async 操作可能出錯，我們卻沒處理。最直接的做法是用 `try/catch` 包住邏輯：

```javascript
async function getAuthorById(req, res) {
  const { authorId } = req.params;

  try {
    const author = await db.getAuthorById(Number(authorId));

    if (!author) {
      res.status(404).send("Author not found");
      return;
    }

    res.send(`Author Name: ${author.name}`);
  } catch (error) {
    console.error("Error retrieving author:", error);
    res.status(500).send("Internal Server Error");
  }
}
```

但如果有很多個 async middleware，每個都要寫一模一樣的 `try/catch`、只是 status code 和訊息不同，就很累贅。好消息是：**Express 5 會自動捕捉 async middleware 丟出的錯誤，並自動呼叫 `next(error)`**，把控制權交給一個特殊的「error middleware」。這樣我們就不必在每個 controller 裡自己 catch。

**error handler middleware** 專門處理整個應用程式中、從其他 middleware「冒下來」的錯誤。它要放在所有 middleware 的**最後面**，確保它最後執行、只處理前面冒下來的錯誤。在 `app.js` 最尾端加上：

```javascript
// 應用程式中任何被丟出的錯誤、或前一個 middleware 呼叫 next(err) 傳下來的錯誤，最終都會走到這裡
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});
```

**這個 middleware 必須有「四個參數」**，就算沒用到也一定要寫出來。Express 就是靠「參數是不是剛好四個、且錯誤物件放在第一個」來辨認它是 error middleware。只要少一個參數，或參數少於四個，Express 都會把它當成一般的 request middleware——即使你把它放在最後也一樣。

```javascript
app.use((req, res, next) => {
  throw new Error("OH NO!");
  // 或 next(new Error("OH NO!"));
});

app.use((err, req, res, next) => {
  console.error(err);
  // 頁面上會看到 OH NO!，並在 dev tools 的 network 分頁看到 500 狀態碼
  res.status(500).send(err.message);
});
```

### 建立自訂錯誤：讓狀態碼更精準

上面的 error middleware 無論什麼錯都只能回 `500`。但如果我們想回 `404` 呢？常見做法是**繼承 `Error` 物件**做出自訂錯誤。在 `errors` 資料夾建立 `CustomNotFoundError.js`：

```javascript
// errors/CustomNotFoundError.js

class CustomNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    // 讓錯誤被字串化時更清楚：NotFoundError: message 而非 Error: message
    this.name = "NotFoundError";
  }
}

module.exports = CustomNotFoundError;
```

然後把 `getAuthorById` 改寫成直接「丟出」這個錯誤：

```javascript
const CustomNotFoundError = require("../errors/CustomNotFoundError");

const getAuthorById = async (req, res) => {
  const { authorId } = req.params;

  const author = await db.getAuthorById(Number(authorId));

  if (!author) {
    throw new CustomNotFoundError("Author not found");
  }

  res.send(`Author Name: ${author.name}`);
};
```

因為 Express 會自動捕捉 async middleware 丟出的錯誤，我們不必在函式裡自己送錯誤回應，只要 `throw` 就好。Express 會呼叫 `next()` 把這個錯誤傳給我們的 error handler。最後在 error middleware 裡就能依錯誤的 `statusCode` 回應：

```javascript
app.use((err, req, res, next) => {
  console.error(err);
  // 用自訂錯誤上的 err.statusCode，沒有的話就當成 500 內部伺服器錯誤
  res.status(err.statusCode || 500).send(err.message);
});
```

這是個很實用的模式，之後可以視需要為不同情境建立更多自訂錯誤類別。

### next 函式到底是什麼

我們用了 `next` 好幾次了。簡單說，它的作用是「把控制權交給 request-response cycle 中的下一個 middleware」。看例子：

```javascript
function middleware1(req, res, next) {
  console.log("Middleware 1");
  next(); // 把控制權交給下一個 middleware
}

function middleware2(req, res, next) {
  console.log("Middleware 2");
  res.send("Response from Middleware 2");
  // request-response cycle 在此結束
}

function middleware3(req, res, next) {
  console.log("Middleware 3");
  res.send("Response from Middleware 3");
}

app.use(middleware1);
app.use(middleware2);
app.use(middleware3);
// 會印出 Middleware 1 -> Middleware 2，並回傳文字 "Response from Middleware 2"
```

`middleware1` 呼叫 `next()`，控制權交給 `middleware2`；`middleware2` 送出回應、結束週期，所以 `middleware3` 永遠不會執行。反過來想：如果 `middleware1` 沒呼叫 `next()`、又沒送回應，會發生什麼事？——這個請求會一直卡住（hang），因為沒有人結束週期，也沒有人把控制權往下傳。

呼叫 `next` 時可傳的參數有四種：

1. **`next()`（無參數）** — 交給下一個 middleware，最單純的用法。
2. **`next(new Error(...))`（錯誤參數）** — 直接把控制權交給 error middleware。
3. **`next("route")`（字串 route）** — 交給同一路徑上的下一個 route handler（若有）。只在 `app.METHOD` / `router.METHOD` 有效。
4. **`next("router")`（字串 router）** — 跳過目前 router 上所有 middleware，直接跳出這個 router、回到上層（例如 `app`；沒錯，Express app 底層其實也是一個 router）。

實務上你幾乎只會用到前兩種，除非有很特殊的需求。

### 收攏一下：最終的資料夾結構

如果你一路跟著做，最後大致會長這樣：

```text
express-app/
├─ errors/
│  ├─ CustomNotFoundError.js
├─ controllers/
│  ├─ authorController.js
├─ routes/
│  ├─ authorRouter.js
│  ├─ ... 其他 router
├─ app.js
├─ db.js
```

## 程式碼範例

以下是一個把本課概念串起來的最小可執行 Express app。建立 `app.js`，安裝 `express`（`npm install express`）後用 `node app.js` 執行，再打開瀏覽器連到 `http://localhost:3000/authors/1`：

```javascript
// app.js
const express = require("express");
const app = express();

// 假資料庫
const authors = [
  { id: 1, name: "Bryan" },
  { id: 2, name: "Christian" },
];

// 自訂錯誤：帶有 statusCode
class CustomNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = "NotFoundError";
  }
}

// controller：async 函式，找不到就 throw
app.get("/authors/:authorId", async (req, res) => {
  const { authorId } = req.params;
  const author = authors.find((a) => a.id === Number(authorId));

  if (!author) {
    // Express 5 會自動捕捉 async 函式丟出的錯誤並轉給 error middleware
    throw new CustomNotFoundError("Author not found");
  }

  res.send(`Author Name: ${author.name}`);
});

// error handler middleware：必須是四個參數，且 err 放第一個
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```

試著把網址改成 `/authors/99`（不存在的 id），你會看到回應變成 404 與 `Author not found`，證明自訂錯誤與 error middleware 正常運作。

## 常見陷阱

!!! warning "送出回應不等於結束函式"
    `res.send`、`res.json` 等方法只結束 request-response cycle，**不會**讓函式跳出。送完回應後若還有後續程式碼，它們仍會執行；一旦其中又送了第二次回應，就會丟出「headers 已送出，無法再送」的錯誤。習慣在送出回應後加 `return`。

!!! warning "error middleware 一定要有四個參數"
    Express 靠「參數個數剛好是四個、且 `err` 在第一個」來辨認 error handler。少寫一個參數（例如只寫 `(req, res, next)`），它就會被當成普通 request middleware，即使放在最後也不會捕捉錯誤。四個參數即使用不到也要全部寫出來。

!!! warning "middleware 順序決定一切"
    Express 依「註冊順序」執行 middleware。會修改 `req`／`res` 的 middleware（如 body parser、authentication）必須放在需要用到它們的 controller「之前」；error handler 則必須放在「最後面」，才能接住前面冒下來的所有錯誤。

!!! warning "忘了呼叫 next 或送出回應，請求會卡住"
    如果一個 middleware 既沒送出回應、也沒呼叫 `next()`，控制權就停在原地，這個請求會一直 hang，瀏覽器會轉圈圈到逾時。每個 middleware 都要有明確結局：送出回應、或呼叫 `next()`。

## 練習

1. 閱讀 Viral Shah 的文章 [Express Middlewares, Demystified](https://medium.com/@viral_shah/express-middlewares-demystified-f0c2c37ea6a1)，它會幫你更深入理解 middleware 的運作，也鼓勵你去讀 Express 的原始碼。

    !!! note "關於 async handler 的過時說明"
        該文章提到「Express 不會 await handler 或處理回傳的 promise，因此 async handler 丟出錯誤時只能透過 `next(err)` 傳遞」。這在 **Express 5** 已經過時——Express 5 原生支援 async route handler，會自動捕捉丟出的錯誤。閱讀時請留意這一點。

2. 觀看這支約 10 分鐘的 [MVC pattern 影片教學](https://www.youtube.com/watch?v=Cgvopu9zg8Y)，用來收攏你已學到的觀念。

3. 動手練習：在 `db.js` 裡加入更多範例資料，並為你先前建立的其他 route 各寫一個對應的 controller。

## 原文與延伸資源

- 原文：[Controllers](https://www.theodinproject.com/lessons/nodejs-controllers)
- 本課引用：
    - [Express 5 Response API](https://expressjs.com/en/5x/api/response/)（`res.send`、`res.json`、`res.redirect`、`res.render`、`res.status`）
    - [Using Express Middleware](https://expressjs.com/en/guide/using-middleware.html)（更多 middleware 範例）
    - [Express Middlewares, Demystified](https://medium.com/@viral_shah/express-middlewares-demystified-f0c2c37ea6a1)
    - [MVC pattern 影片教學](https://www.youtube.com/watch?v=Cgvopu9zg8Y)

---

> 本講義改寫自 The Odin Project《Controllers》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
