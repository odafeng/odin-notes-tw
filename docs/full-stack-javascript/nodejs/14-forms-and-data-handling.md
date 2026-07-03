---
title: 表單與資料處理
source_url: https://www.theodinproject.com/lessons/nodejs-forms-and-data-handling
source_file: vendor/curriculum/nodeJS/express/forms_and_data_handling.md
path: full-stack-javascript
course: NodeJS
order: 14
status: draft
generated: 2026-07-04
---

# 表單與資料處理

> 改寫自 The Odin Project：[Forms and Data Handling](https://www.theodinproject.com/lessons/nodejs-forms-and-data-handling)
> ｜Full Stack JavaScript › NodeJS › Express

## 核心概念

表單（form）是使用者把資料送進伺服器的主要管道：註冊、登入、發文、搜尋、更新個人資料，背後幾乎都是一個 form。這一課要學的是「一份表單從瀏覽器送出，到 Express 接住、驗證、清洗、存入、再回應」的完整流程，並用 `express-validator` 這個套件把 validation（驗證）與 sanitization（清洗）做得又快又安全。

### HTML 表單的三個關鍵屬性

先複習 HTML 本身。一份最單純的表單長這樣：

```html
<form action="/create" method="POST">
  <label for="fullName">Full Name:</label>
  <input placeholder="John Doe" type="text" name="fullName" id="fullName">
  <button type="submit">Submit</button>
</form>
```

有三個屬性決定表單如何跟伺服器溝通：

- **`action`**：資料要送到伺服器上的哪個 URL（也就是我們在 Express 定義的 endpoint（端點））。若留空或不設，表單會送回目前這一頁的網址。
- **`method`**：使用哪個 HTTP 動詞，通常是 `GET` 或 `POST`。
- **`input` 的 `name`**：這個屬性極其重要。它決定送到伺服器的表單資料裡，這個欄位「叫什麼名字」。後端就是靠 `name` 從 `req.body`（或 `req.query`）取值，例如 `req.body.fullName`。

`type="submit"` 的按鈕負責把使用者填的資料上傳到伺服器。

**`GET` 還是 `POST`？** `POST` 較安全，因為它把資料放在請求本體（body）而非網址裡，敏感資訊不會出現在網址列，也不會被記進伺服器日誌；凡是「新增或修改伺服器上的資料」都該用 `POST`。`GET` 則適合「不會改動資料」的情境，例如搜尋表單，或你希望這次送出可以被加入書籤、用網址分享——此時資料會以 query string（查詢字串）附在網址後面。

### PRG 設計模式

表單送出後，`action` 指到 Express 的某個 endpoint，controller（控制器）接手處理請求、跟 database（資料庫）互動，然後產生新的或更新過的 view（視圖），並「重導向（redirect）」瀏覽器到另一個網址。這個「POST 之後回一個 redirect，再由瀏覽器 GET 新頁面」的做法叫 **Post/Redirect/Get（PRG）** 模式，主要目的是避免使用者重新整理頁面時，把同一筆 `POST` 重複送出。

### validation 與 sanitization 的差別

在把資料收進系統之前，有兩個獨立但常一起做的步驟：

- **validation（驗證）**：確認輸入符合規則。例如必填欄位不能空、日期要合法格式、年齡要是 18 到 120 的數字。驗證只是「檢查」，不合格就退回並顯示錯誤。
- **sanitization（清洗）**：把輸入清理乾淨，去掉或編碼掉可能有害的字元，避免惡意資料進到系統。例如把前後空白 `trim()` 掉。

要注意的是，資料不一定要「一收到就清洗」；有時候在「即將使用它的當下」再清洗更合理，原因下面談 escape 時會解釋。這一課用 `express-validator` 同時處理這兩件事，但你仍該理解底層在做什麼。

### express-validator 的 body() 與驗證鏈

安裝並匯入：

```bash
npm install express-validator
```

```javascript
const { body, validationResult } = require("express-validator");
```

`body()` 用來指定「request body 裡哪個欄位要驗證與清洗，以及怎麼處理」。它回傳的其實是一段 middleware，可以串接（chain）多個檢查，每一步都能用 `.withMessage()` 附上專屬錯誤訊息：

```javascript
[
  body("name")
    .trim()                                          // 清洗：去除前後空白
    .notEmpty().withMessage("Name can not be empty.") // 驗證：不可為空
    .isAlpha().withMessage("Name must only contain alphabet letters."), // 驗證：只能是字母
];
```

也能用 `.optional()` 把欄位標成「選填」，但填了就仍要符合格式：

```javascript
[
  body("birthdate", "Must be a valid date.")
    .optional({ values: "falsy" })
    .isISO8601(), // 強制 YYYY-MM-DD 格式
];
```

`{ values: "falsy" }` 的意思是：只有 `undefined`、`null`、`false`、`0`、空字串 `""` 這些「假值」會被跳過驗證，其餘的值仍會被檢查格式。

### escape：只在「使用的當下」才危險

假設使用者的「關於我」欄位允許自由輸入，如果他填的是 `<script>alert("Hacked!");</script>`，而你的 EJS 用了「不跳脫輸出」`<%- description %>`，這段程式碼就會被瀏覽器當成真的 `<script>` 執行，這就是 **cross-site scripting（XSS，跨站腳本攻擊）**。

防禦方式是 **escape（跳脫，也叫 encoding／編碼）**：把 `<` 這類特殊字元換成對應的 HTML entity（實體），例如 `&lt;`，瀏覽器就只會把它當成純文字顯示，而不會執行。EJS 用 `<%= %>` 就會自動跳脫輸出，是安全的預設；`<%- %>` 則不跳脫，等同前端的 `.innerHTML`，要非常小心。

那為什麼不乾脆在收資料時，就在驗證鏈尾端加 `.escape()`？因為「危險字元」只在「特定使用情境的當下」才危險——對 HTML 危險的字元，對 SQL 未必危險，反之亦然。而且若你在存進去時就 escape 了，資料裡就變成 `&lt;`；之後用會自動跳脫的 `<%= %>` 輸出時，`&lt;` 不會還原成 `<`，而是原封不動印出 `&lt;` 這串字。與其反覆跳脫又還原，不如把資料原樣存好，在輸出的當下用 `<%= %>` 一次跳脫乾淨。

### 用 validationResult() 處理錯誤

驗證規則跑完後，在 controller 裡用 `validationResult(req)` 取出結果：

```javascript
const controller = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("index", {
      errors: errors.array(),
    });
  }
  // 驗證通過才做的事
  res.redirect("/success");
};
```

若有任一驗證失敗（`errors` 不為空），就回傳 [400 狀態碼](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400)並把錯誤陣列送回原本的 view 重新渲染；否則就重導向到成功頁面。這裡有個常被忽略的細節：驗證失敗時我們是「重新渲染同一個表單頁」而不是 redirect，因為要把使用者剛剛填的內容與錯誤訊息一起帶回去，讓他知道哪裡填錯；成功時才走 PRG 的 redirect。

### 表單、路由與 controller 如何串起來

把前面的概念接起來，一次完整的表單流程會經過四個角色：**view（表單本身）→ router（路由）→ controller（含驗證 middleware）→ storage／database**，最後再回到一個 view。

router 的責任是「把某個 HTTP 方法加某段路徑，對應到 controller 的某個函式」。一個常見寫法是把新增與更新拆成 `GET` 與 `POST` 兩條路由：`GET` 負責顯示空白或預填的表單，`POST` 負責真正接收並處理送出的資料。

```javascript
const { Router } = require("express");
const usersRouter = Router();
const usersController = require("../controllers/usersController");

usersRouter.get("/:id/update", usersController.userUpdateGet);   // 顯示更新表單
usersRouter.post("/:id/update", usersController.userUpdatePost); // 接收更新資料

module.exports = usersRouter;
```

而表單的 `action` 就要指向這條 `POST` 路由。路徑裡的 `:id` 是路由參數（route parameter），Express 會把網址上對應的值放進 `req.params.id`，controller 就能知道「要更新的是哪一位使用者」：

```html
<!-- 用 EJS 動態組出這位使用者的更新 endpoint -->
<form action="/users/<%= user.userId %>/update" method="POST"></form>
```

controller 這一端有個很方便的模式：**一個 controller 可以直接是「middleware 陣列」**，而不是單一函式。我們把 `express-validator` 產生的一串驗證 middleware 放在陣列前面，把真正處理請求的函式放在最後。Express 會依序執行陣列裡的每一段——先跑完所有驗證，把結果暫存起來，最後那段函式再用 `validationResult(req)` 讀取結果來決定「退回錯誤」或「存檔並 redirect」。這種把驗證與處理拆開、又能組在一起的設計，讓同一組驗證規則（例如 `validateUser`）可以同時被新增與更新兩個 controller 重複使用，不必複製貼上。

至於資料要存去哪裡，本課用一個簡單的 storage 類別在記憶體裡模擬資料庫，並匯出它的「單一實例（singleton 單例模式）」，確保整個 app 共用同一份資料；真實專案裡這一層會換成真正的 database 與 ORM（物件關聯對應）。整個「送出 → 驗證 → 清洗 → 存檔 → 重導向」的往返，正是後續每一堂資料庫課程都會反覆用到的骨架。

## 程式碼範例

以下是一個可執行的最小 Express 應用：能新增、列出使用者，並對表單做驗證與清洗。

先建立專案並裝好套件，然後建立 `routes`、`views`、`controllers`、`storages` 資料夾與 `app.js`：

```bash
npm init -y
npm install express ejs express-validator
```

```javascript
// app.js
const express = require("express");
const app = express();
const path = require("node:path");
const usersRouter = require("./routes/usersRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// 解析表單送來的 application/x-www-form-urlencoded 資料，放進 req.body
app.use(express.urlencoded({ extended: true }));
app.use("/", usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Express app listening on port ${PORT}!`);
});
```

大多數表單送資料時用的是 `Content-Type: application/x-www-form-urlencoded`，但 Express 本身無法直接解析。`express.urlencoded()` 這個 middleware 會幫我們解析並把結果放進 `req.body`。`extended: true` 讓它能接受更豐富的巢狀資料結構（設 `false` 只接受字串或陣列）。若請求的 `Content-Type` 不符，`req.body` 會是空物件 `{}`。

路由（router）：

```javascript
// routes/usersRouter.js
const { Router } = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = Router();

usersRouter.get("/", usersController.usersListGet);
usersRouter.get("/create", usersController.usersCreateGet);
usersRouter.post("/create", usersController.usersCreatePost);

module.exports = usersRouter;
```

兩個 view：`index.ejs` 列出使用者、`createUser.ejs` 顯示新增表單：

```html
<!-- views/index.ejs -->
<!DOCTYPE html>
<html>
<head><title><%= title %></title></head>
<body>
  <h1><%= title %></h1>
  <ul>
    <% if (locals.users) { %>
      <% users.forEach(user => { %>
        <li>ID: <%= user.id %>, Name: <%= user.firstName %> <%= user.lastName %></li>
      <% }); %>
    <% } %>
  </ul>
  <a href="/create">Create a user</a>
</body>
</html>
```

```html
<!-- views/createUser.ejs -->
<!DOCTYPE html>
<html>
<head><title><%= title %></title></head>
<body>
  <h1><%= title %></h1>
  <%- include("partials/errors.ejs") %>
  <form action="/create" method="POST">
    <label for="firstName">First Name: </label>
    <input type="text" name="firstName" id="firstName" required>
    <label for="lastName">Last Name: </label>
    <input type="text" name="lastName" id="lastName" required>
    <button type="submit">Submit</button>
  </form>
  <a href="/">Back to home</a>
</body>
</html>
```

用一個 storage 類別模擬資料庫（實際專案會換成真正的 database）：

```javascript
// storages/usersStorage.js
class UsersStorage {
  constructor() {
    this.storage = {};
    this.id = 0;
  }
  addUser({ firstName, lastName }) {
    const id = this.id;
    this.storage[id] = { id, firstName, lastName };
    this.id++;
  }
  getUsers() { return Object.values(this.storage); }
  getUser(id) { return this.storage[id]; }
  updateUser(id, { firstName, lastName }) {
    this.storage[id] = { id, firstName, lastName };
  }
  deleteUser(id) { delete this.storage[id]; }
}
// 匯出「實例」而非類別，確保整個 app 只有唯一一份資料（singleton 單例模式）
module.exports = new UsersStorage();
```

controller，含驗證陣列。把 `validateUser` 這串 middleware 放在真正處理函式前面，Express 會依序執行：

```javascript
// controllers/usersController.js
const usersStorage = require("../storages/usersStorage");
const { body, validationResult, matchedData } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstName").trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
  body("lastName").trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
];

exports.usersListGet = (req, res) => {
  res.render("index", { title: "User list", users: usersStorage.getUsers() });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", { title: "Create user" });
};

// controller 可以直接是一個「middleware 陣列」
exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    // matchedData() 只回傳「通過驗證且已清洗」的資料（例如已 trim）
    const { firstName, lastName } = matchedData(req);
    usersStorage.addUser({ firstName, lastName });
    res.redirect("/");
  },
];
```

用 `matchedData(req)` 而非直接讀 `req.body`，可確保拿到的是「驗證過並套用了清洗結果」的乾淨資料。

錯誤訊息用一個 partial（局部樣板）顯示：

```html
<!-- views/partials/errors.ejs -->
<% if (locals.errors) { %>
  <ul>
    <% errors.forEach(function(error) { %>
      <li><%= error.msg %></li>
    <% }); %>
  </ul>
<% } %>
```

啟動：`node --watch app.js`，到 `http://localhost:3000/create` 就能新增使用者，到 `http://localhost:3000/` 看清單。更新（`usersUpdateGet` / `usersUpdatePost`）與刪除（`usersDeletePost`）的做法幾乎相同——更新一樣套 `validateUser` 陣列，刪除用 `POST` 到 `/:id/delete` 後直接 `res.redirect("/")`，因此不需要 `GET` 路由。

## 常見陷阱

!!! warning "忘了掛 express.urlencoded()，req.body 一片空白"
    若沒有 `app.use(express.urlencoded({ extended: true }))`，Express 不會解析表單資料，`req.body` 會是空物件 `{}`，你會誤以為前端沒送資料。另外，只有 `Content-Type` 為 `application/x-www-form-urlencoded` 時這個 middleware 才會作用；`Content-Type` 不符時 `req.body` 同樣會是 `{}`。

!!! warning "GET 表單的資料在 req.query，不在 req.body"
    `express.urlencoded()` 只解析 `POST` 請求本體。用 `GET` 送出的表單（例如搜尋），資料是以 query string 附在網址後面，必須用 `req.query.name` 取得，讀 `req.body` 會拿到 undefined。

!!! warning "收資料時就 .escape()，之後輸出會印出亂碼實體"
    別急著在驗證鏈尾端加 `.escape()`。字元只在「使用的當下且特定情境」才危險，該做的是把資料原樣存好，在 EJS 用會自動跳脫的 `<%= %>` 輸出。若存進去前就 escape，之後用 `<%= %>` 輸出時 `&lt;` 不會還原成 `<`，而是原封不動印出 `&lt;` 這串字。

!!! warning "用 <%- %> 輸出使用者輸入，等於開門迎接 XSS"
    `<%- %>` 不跳脫，如同前端的 `.innerHTML`，會把使用者填入的 `<script>` 當成真程式碼執行。除非你百分之百確定內容安全，否則輸出使用者資料一律用 `<%= %>`。

## 練習

以下把原課的 Assignment 改寫成繁中步驟。

**一、擴充 User 的欄位與驗證**

在既有的 `User` 資料與 `validateUser` 陣列裡，加入下列欄位與規則，並記得更新 view 顯示這些新欄位：

- Email：必填，且須為合法 email 格式（可用 `body("email").trim().notEmpty().isEmail()`）。
- Age：選填，若填了須為 18 到 120 的數字（`.optional({ values: "falsy" }).isInt({ min: 18, max: 120 })`）。
- Bio：選填，最多 200 字（`.optional().isLength({ max: 200 })`）。

**二、實作搜尋功能**

當使用者上千筆時需要搜尋。重點：`GET` 表單的資料在 `req.query` 而非 `req.body`。

1. 新增一個 `method="GET"` 的表單（放在 `createUser.ejs` 或其他 view），接受 `name` 或 `email`（或兩者）。
2. 建立新路由 `/search`，接受 `GET` 請求。
3. 在 controller 加入搜尋邏輯：從使用者清單中找出符合者，用 `req.query` 取得查詢字。
4. 把結果渲染到新的 view `search.ejs`。

## 原文與延伸資源

- 原文：[Forms and Data Handling](https://www.theodinproject.com/lessons/nodejs-forms-and-data-handling)
- 本課引用：
  - [express-validator 官方文件](https://express-validator.github.io/docs/)——含 [Getting Started](https://express-validator.github.io/docs/guides/getting-started) 與 [Validation Chains](https://express-validator.github.io/docs/guides/validation-chain)
  - [matchedData() API](https://express-validator.github.io/docs/api/matched-data)
  - [Post/Redirect/Get 設計模式（Wikipedia）](https://en.wikipedia.org/wiki/Post/Redirect/Get)
  - [Cross-site scripting（XSS）（Wikipedia）](https://en.wikipedia.org/wiki/Cross-site_scripting)
  - [HTTP 400 狀態碼（MDN）](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400)
  - [Sanitizing vs Escaping 說明文章](https://blog.presidentbeef.com/blog/2020/01/14/injection-prevention-sanitizing-vs-escaping/)

---

> 本講義改寫自 The Odin Project《Forms and Data Handling》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
