---
title: 專案：留言板
source_url: https://www.theodinproject.com/lessons/node-path-nodejs-mini-message-board
source_file: vendor/curriculum/nodeJS/express/project_mini_message_board.md
path: full-stack-javascript
course: NodeJS
order: 12
status: draft
generated: 2026-07-04
---

# 專案：留言板

> 改寫自 The Odin Project：[Project: Mini Message Board](https://www.theodinproject.com/lessons/node-path-nodejs-mini-message-board)
> ｜Full Stack JavaScript › NodeJS › Express

## 核心概念

到目前為止，你已經學過 Express 的基本結構、route（路由）與 template（樣板）引擎。這一課要把這些片段組裝成一個真正能互動的小網站：一個 mini message board（迷你留言板）。使用者可以在首頁看到所有留言、點進表單頁面填寫自己的名字與內容、送出後看到自己的留言出現在列表最上方。

這個專案不需要資料庫。所有留言先暫存在一個放在記憶體裡的 JavaScript 陣列（array）中，伺服器一重啟資料就會消失——這完全沒關係，本課的目標是把「顯示資料」與「接收表單資料」這兩件事串起來，資料庫會是後面課程的主題。

要完成這個專案，你會實際練到三個關鍵技巧，值得先在腦中建立清楚的地圖：

### 1. 用 template 迴圈顯示一份資料列表

首頁要把 `messages` 陣列裡的每一則留言渲染出來。這靠的是 template 引擎的迴圈語法。The Odin Project 這一課使用 EJS，它讓你直接在 HTML 裡嵌入 JavaScript：`<% %>` 用來寫「執行但不輸出」的邏輯（例如 `forEach`），`<%= %>` 用來「輸出並跳脫（escape）」一個值。要讓 template 拿得到資料，你必須在 `res.render()` 的第二個參數（稱為 locals 物件）把資料傳進去。

### 2. 用一個 HTML `<form>` 送出 POST 請求

顯示資料只需要 GET request（請求）。但「新增一則留言」是把資料**送到**伺服器，這要用 POST request。瀏覽器發出 POST 最自然的方式，就是一個帶有 `method="POST"` 與 `action="/new"` 的 `<form>`。當使用者按下 submit（送出）按鈕，瀏覽器就會把表單內容打包成一個 POST 請求，送往 `action` 指定的網址。

### 3. 用 middleware 解析表單資料，再重新導向

POST 請求送來的表單資料，預設不會自動變成好用的 JavaScript 物件。你需要掛上一個 app 層級的 Express middleware（中介函式）——`express.urlencoded()`——它會把表單編碼的內容解析好，放進 `req.body`。解析後，每個欄位的名稱就對應到 input 上的 `name` 屬性：`<input name="messageText">` 的值會出現在 `req.body.messageText`。

拿到資料、`push` 進 `messages` 陣列之後，處理 POST 的 route 不該直接回傳一段 HTML，而是用 `res.redirect("/")` 把使用者送回首頁。這個「POST 後重新導向 GET」的模式（常稱為 **Post/Redirect/Get**）能避免使用者按重新整理時重複送出同一筆資料。

### route 的整體規劃

整個 app 只需要三條 route：

| Method | Path   | 用途                                   |
| ------ | ------ | -------------------------------------- |
| GET    | `/`    | 顯示所有留言                           |
| GET    | `/new` | 顯示「新增留言」的表單頁面             |
| POST   | `/new` | 接收表單資料、存進陣列、重新導向回首頁 |

注意 `/new` 有兩條：GET 負責「給我看表單」，POST 負責「我填好了，收下」。同一個路徑、不同的 HTTP verb（動詞）對應到不同的處理邏輯，這是 web 開發最常見的配對。

## 程式碼範例

以下是一份可以跑起來的最小骨架，示範三個技巧如何協作。實際做專案時建議照前面課程的做法，把 route 拆進 `routes/` 資料夾、view 放進 `views/`；這裡為求聚焦，把邏輯集中在 `app.js`。

```javascript
// app.js
const express = require("express");
const app = express();

// 設定 EJS 為 view engine，樣板放在 views/ 資料夾
app.set("view engine", "ejs");
app.set("views", "views");

// 關鍵 middleware：把表單資料解析進 req.body
app.use(express.urlencoded({ extended: true }));

// 暫存留言的陣列（伺服器重啟就會清空）
const messages = [
  { text: "Hi there!", user: "Amando", added: new Date() },
  { text: "Hello World!", user: "Charles", added: new Date() },
];

// GET /：顯示所有留言，把 messages 傳進 template 的 locals
app.get("/", (req, res) => {
  res.render("index", { title: "Mini Messageboard", messages: messages });
});

// GET /new：顯示新增留言的表單
app.get("/new", (req, res) => {
  res.render("form", { title: "New Message" });
});

// POST /new：接收表單、存進陣列、導回首頁
app.post("/new", (req, res) => {
  // req.body 的欄位名稱來自 input 的 name 屬性
  messages.push({
    text: req.body.messageText,
    user: req.body.messageUser,
    added: new Date(),
  });
  res.redirect("/");
});

app.listen(3000, () => console.log("留言板執行於 http://localhost:3000"));
```

首頁 template（用 EJS 迴圈把每則留言印出來）：

```html
<!-- views/index.ejs -->
<h1><%= title %></h1>
<a href="/new">新增留言</a>
<ul>
  <!-- <% %> 執行 JavaScript 但不輸出；<%= %> 輸出並跳脫 -->
  <% messages.forEach((message) => { %>
    <li>
      <strong><%= message.user %></strong>：<%= message.text %>
      <em>（<%= message.added.toLocaleString() %>）</em>
    </li>
  <% }); %>
</ul>
```

表單 template（`name` 屬性決定 `req.body` 裡的欄位名）：

```html
<!-- views/form.ejs -->
<h1><%= title %></h1>
<form method="POST" action="/new">
  <label>名字：<input type="text" name="messageUser" /></label>
  <label>訊息：<input type="text" name="messageText" /></label>
  <button type="submit">送出</button>
</form>
```

啟動所需的指令：

```bash
npm install express ejs
node app.js
```

## 常見陷阱

!!! warning "忘了掛 express.urlencoded()，req.body 會是 undefined"
    表單資料不會自己變成 `req.body`。如果你沒有在 route 之前加上 `app.use(express.urlencoded({ extended: true }))`，那麼在 POST handler 裡讀 `req.body.messageText` 只會拿到 `undefined`（甚至因為 `req.body` 本身是 `undefined` 而報錯）。middleware 的擺放順序也重要：它必須在會用到 `req.body` 的 route **之前**掛上。

!!! warning "input 的 name 屬性和 req.body 的欄位必須一致"
    `req.body` 的 key 完全來自 HTML input 的 `name` 屬性，不是 `id`、也不是 label 文字。如果 template 寫的是 `name="author"`，那 handler 就得讀 `req.body.author`；若你在其中一邊打錯字，資料就會靜默地變成 `undefined`，而且不會有明顯錯誤訊息。務必兩邊對齊。

!!! warning "用 res.render 回傳而不是 res.redirect，會造成重複送出"
    處理完 POST 後如果直接 `res.render("index", ...)`，使用者停在 `/new` 這個網址上；一旦按下瀏覽器重新整理，就會再送一次 POST，留言被重複新增。正確做法是 `res.redirect("/")`，讓瀏覽器改用 GET 造訪首頁，重新整理時就只是重新載入列表而已。

## 練習

以下把原文的 Assignment 改寫成中文步驟，逐條照做即可。與作業系統或 GitHub 帳號相關的步驟，請對照原文操作。

1. 建立一個基本的 Express app：安裝 `express` 與 `ejs`，設定好一個基本的 index route 並啟動伺服器。依照前幾課的做法建立需要的資料夾與檔案（例如 `routes/`、`views/`）。
2. 規劃兩個路徑：index（`"/"`）與「新增留言」表單（`"/new"`）。
3. 在 index router 最上方建立一個名為 `messages` 的陣列，放進幾筆範例留言：

   ```javascript
   const messages = [
     { text: "Hi there!", user: "Amando", added: new Date() },
     { text: "Hello World!", user: "Charles", added: new Date() },
   ];
   ```

4. 在 `views` 資料夾的 index template 裡，用迴圈跑過 `messages` 陣列，逐一顯示每則留言的 user、text 與新增日期。別忘了透過 `res.render` 的 locals 物件把資料傳進 template，例如 `res.render("index", { title: "Mini Messageboard", messages: messages })`。
5. 設定新增留言的表單：在 router 加上一條 `router.get()` 對應 `"/new"`，指向名為 `"form"` 的 template。在 views 資料夾建立 `form` template，放一個標題、兩個 input（一個給作者名字、一個給留言內容）與一個 submit 按鈕。要讓表單能發出網路請求，必須同時指定 `method` 與 `action`：

   ```html
   <form method="POST" action="/new">
     <!-- 你的 input 與按鈕放這裡 -->
   </form>
   ```

6. 這樣設定後，按下 submit 會送出一個 POST 請求到 `action` 指定的網址。回到 index router，加上一條 `router.post()` 對應 `"/new"`。
7. 為了在 `router.post()` 裡讀取表單資料，需要透過 `req.body` 物件存取。`req.body` 裡各欄位的名稱由 input 的 `name` 屬性決定（`<input name="messageText">` 會對應到 `req.body.messageText`）。要讓這件事成立，必須掛上 app 層級的 `express.urlencoded()` middleware 來解析表單資料：

   ```javascript
   app.use(express.urlencoded({ extended: true }));
   ```

8. 在 `router.post()` 裡，把表單送來的內容 push 進 `messages` 陣列，格式類似：

   ```javascript
   messages.push({ text: messageText, user: messageUser, added: new Date() });
   ```

9. 在 `router.post()` 結尾用 `res.redirect("/")`，讓使用者送出後回到首頁。
10. 此時你應該能造訪 `/new`（不妨在首頁加一個連結指向它）、填寫表單、送出，然後在首頁看到新留言出現。
11. 進階：在每則留言旁加一個「open」按鈕或連結，點開後導向一個顯示該則留言細節的新頁面。
12. 把專案推上 GitHub。
13. 部署到網路上的方法會在下一課學到，完成後別忘了回到原文頁面提交你的作品。

## 原文與延伸資源

- 原文：[Project: Mini Message Board](https://www.theodinproject.com/lessons/node-path-nodejs-mini-message-board)
- 本課引用：Express `express.urlencoded()` middleware（解析表單資料）、EJS template 引擎的 `<% %>` 與 `<%= %>` 語法、`res.render()` 的 locals 物件、`res.redirect()` 與 Post/Redirect/Get 模式。

---

> 本講義改寫自 The Odin Project《Project: Mini Message Board》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
