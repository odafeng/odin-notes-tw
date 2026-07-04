---
title: 視圖（Views）
source_url: https://www.theodinproject.com/lessons/nodejs-views
source_file: vendor/curriculum/nodeJS/express/views.md
path: full-stack-javascript
course: NodeJS
order: 11
generated: 2026-07-04
---

# 視圖（Views）

> 改寫自 The Odin Project：[Views](https://www.theodinproject.com/lessons/nodejs-views)
> ｜Full Stack JavaScript › NodeJS › Express

## 核心概念

在你之前寫過的許多專案裡，畫面多半是 SPA（Single Page Application，單頁應用程式）：伺服器送回來的 HTML 檔案幾乎是空的，只夾帶一個 `<script>` 標籤，實際的頁面內容都是瀏覽器（也就是 client（客戶端））靠 JavaScript 動態產生的。現在我們要換一個思路：**在伺服器端把 HTML 組好再送出去**，讓伺服器產生的 HTML 檔案本身就已經帶著頁面的內容。

**view（視圖）** 指的就是應用程式中面向使用者的那一層，在這裡也就是 HTML 檔案。在更早的專案裡你其實已經接觸過 view：伺服器把 HTML 檔案送給使用者。但那些檔案是 **靜態（static）** 的，內容寫死了；而真實世界的需求常常要 view 能隨著 **資料（data）** 變化——例如使用者登入後要顯示他的 username（使用者名稱）、商品列表要隨資料庫內容而增減。

### 為什麼需要 template engine（樣板引擎）

為了讓 view 能動態呈現資料，我們會使用 **template engine（樣板引擎）**。顧名思義，我們在程式碼裡寫的是 **template（樣板）檔案**，這些檔案會在伺服器回應請求時被「轉換」成最終的 HTML。轉換的過程中，樣板裡定義的變數會被替換成真正的資料。除此之外，我們還能在樣板裡加入 **條件判斷（conditional）** 與 **迴圈（loop）** 邏輯——例如「使用者登入後才顯示他的名字」。這些是純 HTML 做不到的。當然，如果你還想要 client 端的互動，仍然可以照舊用 `<script>` 標籤加入客戶端 JavaScript（不過現階段我們不會在客戶端做太複雜的事）。

本課使用的 template engine 是 **EJS**（Embedded JavaScript templating）。EJS 的語法跟 HTML 非常接近，因此相較於其他樣板引擎，學習曲線相對平緩。

> **為什麼不用 React？**
> 用 React 做伺服器端渲染需要 React Server Components，那和你目前認識的 React 相當不同、獨立設定起來也不簡單；而如果改用一個已經幫你配置好、但高度抽象化的全端框架，又會模糊「前端」與「後端」的界線，讓我們難以專注在後端基礎的學習。所以這裡選擇單純的 template engine——EJS。

### 在 Express 中設定 EJS

先把 EJS 安裝進專案：

```bash
npm install ejs
```

接著在專案根目錄建立一個叫 `views` 的子資料夾，用來放樣板檔案。

然後要告訴我們的 app 兩件事：**我們打算用 EJS 當 view engine**，以及 **去哪裡找 view 檔案**。在 `app.js` 裡設定這兩個 application property（應用程式屬性）：

```javascript
// app.js
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
```

並在檔案上方 import Node 內建的 Path 模組：

```javascript
// app.js
const path = require("node:path");
```

`app.set("view engine", "ejs")` 啟用 EJS 作為 view engine；`app.set("views", ...)` 告訴 app 到 `/views` 子資料夾去找樣板。這裡用 `path.join(__dirname, "views")` 組出絕對路徑，`__dirname` 是目前這個檔案所在的資料夾，這樣不論你從哪裡啟動伺服器，路徑都會正確。

### EJS 語法：兩種標籤

EJS 最核心的就是兩組標籤：

- `<% ... %>`：讓你在樣板裡 **執行 JavaScript**，例如寫條件判斷、`for` 迴圈、宣告變數。**它只執行、不輸出**。
- `<%= ... %>`：把一個值 **輸出（output）** 到頁面上，也就是把變數的內容印出來。

看一個同時用到陣列與迴圈的小例子：

```ejs
<% const animals = ["Cat", "Dog", "Lemur", "Hawk"] %>

<ul>
  <% animals.map((animal) => { %>
    <li><%= animal %>s are cute</li>
  <% }) %>
</ul>
```

注意迴圈本體（`animals.map(...)` 那幾行控制結構）包在 `<% %>` 裡，只負責跑邏輯；真正要印出來的 `animal` 才用 `<%= %>`。

### 搭配 Express 使用 EJS

實際跑一次。先在 `views` 子資料夾建立一個叫 `index.ejs` 的樣板：

```ejs
<!-- index.ejs -->
<html>
  <body>
    <%= message %>
  </body>
</html>
```

然後在 `app.js` 的某個 route（路由）裡把這個樣板渲染出來：

```javascript
// app.js
app.get("/", (req, res) => {
  res.render("index", { message: "EJS rocks!" });
});
```

（理想上這個 route 應該定義在獨立的 router 檔案裡，但為了聚焦這一課，我們暫時寫在 `app.js`。）

啟動伺服器、在瀏覽器打開 `/` 路徑，你會看到：

```html
EJS rocks!
```

如果打開瀏覽器的開發者工具檢視 HTML，會發現結構跟你寫的 EJS 樣板一模一樣，只是 `message` 變數已經被換成它的值。

關鍵那一行是 `res.render("index", { message: "EJS rocks!" })`。因為我們先前已經設定好 `views` 與 `view engine` 這兩個屬性，`res.render` 的行為就被固定成：

- **第一個參數** `"index"`：到指定資料夾裡找一個叫 `index` 的樣板（副檔名 `.ejs` 可以省略）。
- **第二個參數** `{ message: ... }`：一個物件，裡面的屬性會變成 **那個樣板可以取用的變數**。

### EJS 裡的 locals 變數

上面那個例子，樣板到底是「怎麼知道」有 `message` 這個變數的？當我們渲染 view 時，EJS 能取用兩個來源的資料：

1. 你傳給 `res.render` 的物件裡的屬性；
2. Express 的 `res.locals` 物件上的屬性。（`res.locals` 在你想「先在某個 middleware 裡塞資料，但要到後面的 middleware 才呼叫 `res.render`」時很有用。）

EJS 會把這些屬性統一存進一個叫 **`locals`** 的物件，你在 view 裡就能存取。類似瀏覽器裡的全域 `window` 物件，這讓你可以用 `locals.message`，或直接寫 `message` 來取用這個變數。

### 可重複使用的樣板（include）

網站常常有多個頁面共用的元件，例如 sidebar（側邊欄）、header（頁首）、footer（頁尾）。要把這種元件插入頁面，我們用 EJS 的 `include` 指令。它需要「被插入檔案的名稱」，也可以選擇性地傳入一個資料物件。

先建立一個 navbar（導覽列）元件 `navbar.ejs`：

```ejs
<!-- navbar.ejs -->
<nav>
  <ul>
    <% for (let i = 0; i < links.length; i++) { %>
      <li>
        <a href="<%= links[i].href %>">
          <span> <%= links[i].text %> </span>
        </a>
      </li>
    <% } %>
  </ul>
</nav>
```

這個 navbar 需要一個 `links` 變數。要把資料傳進去，就在渲染主樣板時透過 `res.render()` 一起傳進 `locals`。修改 `app.js`，定義一個 `links` 陣列並傳給渲染 `index` 的 route handler：

```javascript
// app.js
const links = [
  { href: "/", text: "Home" },
  { href: "/about", text: "About" },
];

app.get("/", (req, res) => {
  res.render("index", { links: links });
});
```

接著修改 `index.ejs`，把原本的 `<%= message %>` 拿掉，改用 `include` 把 navbar 連同 `links` 一起插進來：

```ejs
<!-- index.ejs -->
<html>
  <head>
    <title>Homepage</title>
  </head>
  <body>
    <%- include('navbar', {links: links}) %>
  </body>
</html>
```

跑一次伺服器就會看到 navbar 出現。這樣的可重用樣板正是把 header、footer 放進每一頁的做法。

**注意這裡用的是 `<%-` 而不是 `<%=`**。`<%-` 是 **raw output（原始輸出）** 標籤，它會把內容原封不動地輸出、不做 HTML 跳脫（escape）。因為 `include` 產生的本身就是一段 HTML，如果用會跳脫的 `<%=`，那些 HTML 標籤會被「二次跳脫」變成純文字顯示出來，所以插入子樣板時要用 `<%-`。

我們再換一種方式，用 `include` 動態渲染一份清單。在 `app.js` 的 `links` 下方加一個 `users` 陣列，並一起傳給 `render`：

```javascript
// app.js
const links = [
  { href: "/", text: "Home" },
  { href: "/about", text: "About" },
];

const users = ["Rose", "Cake", "Biff"];

app.get("/", (req, res) => {
  res.render("index", { links: links, users: users });
});
```

在 `views` 裡建立一個新 view `user.ejs`：

```ejs
<!-- views/user.ejs -->
<li><%= user %></li>
```

然後在 `index.ejs` 加上這段：

```ejs
<!-- index.ejs -->
<ul>
  <% users.forEach((user) => { %>
    <%- include('user', {user: user}); %>
  <% }); %>
</ul>
```

成功的話，`Rose`、`Cake`、`Biff` 就會逐一顯示出來。這裡的重點是：用 `<% %>` 跑 `forEach` 迴圈，每一圈都用 `<%- include(...) %>` 把 `user.ejs` 插進來，並把當前的 `user` 傳給它。

> **views 資料夾裡的子目錄**
> view 檔案可以放進巢狀資料夾。例如把 `views/user.ejs` 移到 `views/users/user.ejs`，那麼 `include` 的路徑也要跟著改成 `users/user`：
> ```ejs
> <!-- index.ejs -->
> <ul>
>   <% users.forEach((user) => { %>
>     <%- include('users/user', {user: user}); %>
>   <% }); %>
> </ul>
> ```

### 提供靜態資源（Serving Static Assets）

在 EJS 裡提供 static asset（靜態資源，例如 CSS、圖片、client 端 JS），跟之前直接寫 HTML 時很像：用 `<link>` 標籤把外部檔案掛進樣板的 `<head>`。差別只在於——**app 需要知道去哪裡找這些資源**。在 `app.js` 設定：

```javascript
// app.js
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
```

`express.static()` 是一個 middleware（中介函式），啟用後 Express 會以 `public` 資料夾為根目錄去尋找並提供靜態檔案。

在 `public` 資料夾根目錄建立 `styles.css`：

```css
/* public/styles.css */
body {
  color: red;
}
```

要在 `index.ejs` 套用它，在 `<head>` 加上 `<link>`：

```ejs
<!-- index.ejs -->
<head>
  <link rel="stylesheet" href="/styles.css">
</head>
```

注意 `href` 是 `/styles.css` 而不是 `/public/styles.css`——因為 `public` 已經被設成靜態資源的「根」，所以路徑從它底下算起。這時 `index.ejs` 的文字就會變成紅色了。

## 程式碼範例

以下是一個把本課概念串起來的最小可執行範例。目錄結構如下：

```text
project/
├── app.js
├── views/
│   ├── index.ejs
│   └── navbar.ejs
└── public/
    └── styles.css
```

```javascript
// app.js
const path = require("node:path");
const express = require("express");
const app = express();

// 設定 view engine 與樣板資料夾
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 提供 public 資料夾裡的靜態資源
app.use(express.static(path.join(__dirname, "public")));

const links = [
  { href: "/", text: "Home" },
  { href: "/about", text: "About" },
];

// 渲染 index 樣板，並把 links 傳進 locals
app.get("/", (req, res) => {
  res.render("index", { links: links });
});

app.listen(3000, () => console.log("Server 執行於 http://localhost:3000"));
```

```ejs
<!-- views/index.ejs -->
<html>
  <head>
    <title>Homepage</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <%- include('navbar', {links: links}) %>
    <h1>Hello EJS!</h1>
  </body>
</html>
```

```ejs
<!-- views/navbar.ejs -->
<nav>
  <ul>
    <% links.forEach((link) => { %>
      <li><a href="<%= link.href %>"><%= link.text %></a></li>
    <% }); %>
  </ul>
</nav>
```

執行 `node app.js` 後開啟 `http://localhost:3000`，就會看到帶有導覽列與紅字標題的頁面。

## 常見陷阱

!!! warning "直接寫變數名 vs. 寫 locals.變數名"
    如果你在樣板裡取用一個 **沒有** 定義在 `res.render` 的 `locals` 引數、也不在 `res.locals` 裡的變數，兩種寫法的結果不同：
    直接寫 `<%= foo %>`（`foo` 未定義）會拋出 **ReferenceError（參考錯誤）**，整個頁面渲染失敗；
    而寫 `<%= locals.foo %>` 只會得到 `undefined`，不會報錯。
    因此當一個變數「可能存在、也可能不存在」時，用 `locals.foo` 搭配條件判斷會比較安全。你可以在 `index.ejs` 裡先輸出 `locals.foo`、再換成裸的 `foo`，親自驗證兩者差異。

!!! warning "include 子樣板要用 <%- 而不是 <%="
    `<%=` 會對輸出做 HTML escape（跳脫），把 `<`、`>` 等字元轉成 `&lt;`、`&gt;`。子樣板 `include` 進來的本身就是 HTML，若用 `<%=` 會被「二次跳脫」，導致標籤變成純文字顯示。插入子樣板一律用 raw output 標籤 `<%- include(...) %>`。反過來說，輸出「使用者提供的一般文字」時要用會跳脫的 `<%=`，才能避免 XSS（跨站腳本攻擊）。

!!! warning "靜態資源路徑不含 public"
    設定 `express.static(path.join(__dirname, "public"))` 後，`public` 就是資源的根目錄。在樣板裡引用時要寫 `/styles.css`，**不是** `/public/styles.css`，多寫一層 `public` 反而會 404。

## 練習

1. 重新讀一遍 [EJS 官方文件](https://ejs.co/#docs)，熟悉各種標籤與 `include` 用法。
2. 讀一讀 [Express 關於 template engine 的說明](https://expressjs.com/en/guide/using-template-engines.html)。該文件用 Pug 當範例（語法和 EJS 不同），但整體觀念仍然是很有用的補充。
3. 繼續擴充本課一路開發的 app：新增一個 about 頁面的 view，讓它在 `/about` 路徑渲染出來。
4. 建立一個可重用的 footer（頁尾）樣板，並在 app 的所有 route 都渲染它。

## 原文與延伸資源

- 原文：[Views](https://www.theodinproject.com/lessons/nodejs-views)
- 本課引用：
  - [EJS 官方網站與文件](https://ejs.co/#docs)
  - [Express：Using template engines](https://expressjs.com/en/guide/using-template-engines.html)
  - [Express API：res.locals](https://expressjs.com/en/5x/api/response/#reslocals)
  - [How to Use EJS to Template Your Node.js Application（LogRocket）](https://blog.logrocket.com/how-to-use-ejs-template-node-js-application/)

---

> 本講義改寫自 The Odin Project《Views》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
