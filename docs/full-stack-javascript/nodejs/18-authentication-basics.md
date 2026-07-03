---
title: 認證基礎
source_url: https://www.theodinproject.com/lessons/node-path-nodejs-authentication-basics
source_file: vendor/curriculum/nodeJS/authentication/authentication_basics.md
path: full-stack-javascript
course: NodeJS
order: 18
status: draft
generated: 2026-07-04
---

# 認證基礎

> 改寫自 The Odin Project：[Authentication Basics](https://www.theodinproject.com/lessons/node-path-nodejs-authentication-basics)
> ｜Full Stack JavaScript › NodeJS › Authentication

## 核心概念

讓使用者能夠註冊、登入、登出，是幾乎每個 web app 都需要的核心功能。本課用 [Passport.js](https://www.passportjs.org) 這個 middleware 來處理 authentication（認證）與 session（工作階段），搭配 Express 打造一個最精簡的範例。

### authentication 到底在做什麼

「認證」要回答的問題是：**「你是誰？你真的是你宣稱的那個人嗎？」** 在密碼式登入中，流程是這樣：

1. 使用者送出 username（帳號）與 password（密碼）。
2. 伺服器到資料庫查有沒有這個帳號，並比對密碼是否正確。
3. 若正確，伺服器要有辦法「記住」這個人在接下來的每次 request（請求）都還是同一位已登入使用者——這就是 session 與 cookie 的工作。

HTTP 本身是無狀態（stateless）的，每個 request 彼此獨立，伺服器不會自動知道這次的 request 和上次是同一個人送的。所以我們需要一個機制在多次 request 之間維持登入狀態，這正是 session 存在的理由。

### Passport.js 的三個角色

Passport 把整件事拆成三塊，理解了這三塊就掌握了本課的骨架：

- **Strategy（策略）**：定義「怎麼驗證一個人」。Passport 有 500 多種 strategy（例如用 Google、Facebook 登入），本課用最基本也最常見的 `LocalStrategy`——也就是 username + password。
- **serializeUser / deserializeUser**：定義「session 裡要存什麼、以及怎麼把它還原成完整的使用者物件」。為了節省空間，我們通常只在 session 裡存使用者的 `id`，之後每次 request 再用這個 id 去資料庫撈出完整資料。
- **`passport.authenticate()`**：真正在 route（路由）上被呼叫的 middleware，它會去讀 request body 裡的 `username` 與 `password`，執行你定義的 Strategy，成功就建立 session，失敗就回傳錯誤。

### middleware 的擺放順序很重要

Express 的 middleware 是**由上而下依序執行**的，Passport 的相依套件對順序有要求。正確順序是：

```javascript
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
```

先建立 `express-session`，因為 `passport.session()` 在背後就是靠它來讀寫 session；`passport.session()` 之後才有辦法把已登入的使用者掛到 request 上。順序顛倒會導致 Passport 讀不到 session。

> 補充：`express-session` 我們不會直接使用它的 API，它是 Passport 在背後依賴的套件。此外，舊教學裡常見的 `app.use(passport.initialize())` 在新版 Passport 已不再需要。

### cookie 如何維持登入狀態

當使用者成功登入，Passport 內部會呼叫 `express-session` 的功能，用 session 資料建立一個名為 `connect.sid` 的 cookie，存進使用者的瀏覽器。之後每次 request，瀏覽器都會自動帶上這個 cookie，伺服器就能藉此辨認「這是哪位已登入的使用者」。

`serializeUser` 決定 cookie（session）裡要放什麼資料（本課放 `user.id`）；`deserializeUser` 則在收到帶有 session 的 request 時，把存起來的 id 取出、查資料庫、把完整的使用者物件掛到 `req.user`。因此在後續的 route 裡，只要檢查 `req.user` 是否存在，就能判斷「有沒有人登入」。

### 為什麼密碼絕對不能存明文——bcrypt 與 hash

範例一開始為了簡化，把密碼以**明文（plain text）**存進資料庫。這在真實專案裡是極度危險的：一旦資料庫外洩，所有使用者的密碼就直接暴露。正確做法是用 [bcrypt](https://www.npmjs.com/package/bcryptjs) 做 **password hashing（密碼雜湊）**。

**hash（雜湊）** 是把任意長度的輸入，透過一個**單向（one-way）**函式，映射成固定長度、看似隨機的輸出。「單向」的意思是：由密碼算出 hash 很容易，但由 hash 反推回原密碼在計算上不可行。所以資料庫裡存的是 hash，不是密碼本身；即使外洩，攻擊者也拿不到原密碼。

bcrypt 還會加上 **salt（鹽）**——在密碼裡摻入額外的隨機字元再一起做 hash。salt 的作用是：

- 讓即使兩個使用者用了相同密碼，算出來的 hash 也不一樣。
- 抵禦 [rainbow table（彩虹表）](https://en.wikipedia.org/wiki/Rainbow_table) 與 [dictionary attack（字典攻擊）](https://en.wikipedia.org/wiki/Dictionary_attack) 這類預先算好雜湊值的破解手法。

`bcryptjs` 會把 salt 自動嵌進 hash 字串裡，所以你不需要另外開欄位儲存 salt。

驗證登入時，因為 hash 是單向的、無法反解，所以我們**不能**把資料庫裡的 hash 解回明文來比對，而是用 `bcrypt.compare(明文密碼, 資料庫裡的hash)`——它會把使用者這次輸入的明文密碼，用同樣的參數重新雜湊後，再與資料庫裡的 hash 比較，回傳 `true` 或 `false`。

> 一個現實提醒：一旦你導入 bcrypt，**在導入之前用明文存的舊使用者就無法登入了**，因為 `compare` 會拿明文去和「未經雜湊」的舊資料比對而失敗。這也是為什麼下次開新專案時，最好一開始就把 bcrypt 放進去。

### 選用 bcryptjs 而非 bcrypt

有兩個套件都能做這件事：`bcrypt` 用 C++ 寫成、速度較快，但安裝時常因編譯問題出狀況；`bcryptjs` 是純 JavaScript 實作，安裝無痛、API 相同。本課用 `bcryptjs` 即可。

## 程式碼範例

以下把一個可運作的最小 Express 認證 app 完整串起來。資料表用 PostgreSQL。

**建立資料表（在 `psql` 裡執行）：**

```sql
CREATE TABLE users (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   username VARCHAR ( 255 ),
   password VARCHAR ( 255 )
);
```

**安裝相依套件：**

```bash
npm install express express-session pg passport passport-local ejs bcryptjs
```

**app.js（主檔）：**

```javascript
const path = require("node:path");
const { Pool } = require("pg");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs"); // 密碼雜湊工具

const pool = new Pool({
  // 在這裡填入你的資料庫連線設定
});

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middleware 順序很重要：session → passport.session → urlencoded
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// 自訂 middleware：讓所有 view 都能用 currentUser，不必每個 route 手動傳
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// ---- 定義 LocalStrategy：怎麼驗證一個使用者 ----
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "帳號不存在" });
      }
      // 用 bcrypt.compare 比對明文密碼與資料庫裡的 hash
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "密碼錯誤" });
      }
      return done(null, user); // 驗證成功，交出 user 物件
    } catch (err) {
      return done(err);
    }
  })
);

// ---- session 裡只存 user.id ----
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// ---- 每次 request 用 id 撈出完整 user，掛到 req.user ----
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// ---- 首頁：依 req.user 決定顯示歡迎訊息或登入表單 ----
app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

// ---- 註冊頁 ----
app.get("/sign-up", (req, res) => res.render("sign-up-form"));

app.post("/sign-up", async (req, res, next) => {
  try {
    // 存入前先用 bcrypt 做 hash，第二個參數 10 是 salt 的成本係數
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [req.body.username, hashedPassword]
    );
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
});

// ---- 登入：整段交給 passport.authenticate 處理 ----
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureMessage: true, // 錯誤訊息會放進 req.session.messages
  })
);

// ---- 登出：passport 幫 req 加了 logout 方法 ----
app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});
```

**views/index.ejs（依是否登入切換畫面）：**

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <title>Home</title>
</head>
<body>
  <% if (locals.user) { %>
    <h1>歡迎回來 <%= user.username %></h1>
    <a href="/log-out">登出</a>
  <% } else { %>
    <h1>請登入</h1>
    <form action="/log-in" method="POST">
      <label for="username">Username</label>
      <input id="username" name="username" placeholder="username" type="text" />
      <label for="password">Password</label>
      <input id="password" name="password" type="password" />
      <button type="submit">Log In</button>
    </form>
  <% } %>
</body>
</html>
```

**views/sign-up-form.ejs（註冊表單）：**

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <title>Sign Up</title>
</head>
<body>
  <h1>註冊</h1>
  <form action="/sign-up" method="POST">
    <label for="username">Username</label>
    <input id="username" name="username" placeholder="username" type="text" />
    <label for="password">Password</label>
    <input id="password" name="password" type="password" />
    <button type="submit">Sign Up</button>
  </form>
</body>
</html>
```

完成後，你應該能造訪 `/sign-up` 建立使用者、用該帳密登入、再按登出連結登出。

## 常見陷阱

!!! warning "絕對不要用明文儲存密碼"
    範例最初為了教學簡化才用明文，真實專案**永遠**要用 bcrypt 做 hash。密碼一旦以明文外洩，使用者在其他網站的同帳密也會連帶受害。請務必完成 bcrypt 那一段，不要跳過。

!!! warning "middleware 的擺放順序不能亂"
    `session(...)` 必須在 `passport.session()` 之前，`passport.session()` 又要在需要用到 `req.user` 的自訂 middleware 與 route 之前。順序錯了，Passport 會讀不到 session、`req.user` 永遠是 `undefined`。此外，若要用 `res.locals.currentUser` 這個自訂 middleware，它要放在 Passport middleware 之後、render view 之前。

!!! warning "導入 bcrypt 後舊使用者會失效"
    在改用 bcrypt 之前以明文存的使用者，之後將無法登入——因為 `bcrypt.compare` 會拿輸入的明文去和「未雜湊」的舊密碼比對而失敗。這是安全升級的必要代價，也提醒你下次一開始就導入 bcrypt。

!!! warning "本課省略了驗證與清理"
    為了聚焦在認證流程，範例的註冊表單省略了 sanitization（清理）與 validation（驗證）。真實專案務必補上，避免惡意或格式錯誤的輸入直接寫進資料庫。

## 練習

1. 觀看這份 [YouTube 播放清單（Express session 與 Passport.js local strategy 認證）](https://www.youtube.com/playlist?list=PLYQSCk-qyTW2ewJ05f_GKHtTIzjynDgjK) 的第 1、2、3、5、6 支影片。看的時候注意幾點：
   - 影片裡出現的 `app.use(passport.initialize())` 在新版 Passport 已不需要，可略過。
   - 影片用 MongoDB，你可以把它換成 PostgreSQL。
   - 影片第 3 支與第 5 支用 `connect-mongo` 把 session 存進資料庫（而非存在記憶體）。因為我們用 PostgreSQL，改用 [`connect-pg-simple`](https://www.npmjs.com/package/connect-pg-simple) 即可。注意：存 session 用的資料表預設不會自動建立，請查看該套件 npm 頁面的設定選項。
2. 閱讀 [Passport: The Hidden Manual](https://github.com/jwalton/passport-api-docs)，更深入理解 Passport 各個主要函式實際在做什麼。

## 原文與延伸資源

- 原文：[Authentication Basics](https://www.theodinproject.com/lessons/node-path-nodejs-authentication-basics)
- 本課引用：
  - [Passport.js 官方文件](https://www.passportjs.org)、[LocalStrategy 文件](http://www.passportjs.org/docs/username-password/)
  - [express-session（GitHub）](https://github.com/expressjs/session)
  - [bcryptjs（npm）](https://www.npmjs.com/package/bcryptjs)
  - [connect-pg-simple（npm）](https://www.npmjs.com/package/connect-pg-simple)
  - [Passport: The Hidden Manual](https://github.com/jwalton/passport-api-docs)
  - 密碼儲存方式與風險總覽影片：[different methods to store passwords](https://www.youtube.com/watch?v=8ZtInClXe1Q)
  - [Cryptographic hash function（Wikipedia）](https://en.wikipedia.org/wiki/Cryptographic_hash_function)

---

> 本講義改寫自 The Odin Project《Authentication Basics》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
