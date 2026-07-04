---
title: 專案：Members Only
source_url: https://www.theodinproject.com/lessons/node-path-nodejs-members-only
source_file: vendor/curriculum/nodeJS/authentication/project_members_only.md
path: full-stack-javascript
course: NodeJS
order: 19
generated: 2026-07-04
---

# 專案：Members Only

> 改寫自 The Odin Project：[Project: Members Only](https://www.theodinproject.com/lessons/node-path-nodejs-members-only)
> ｜Full Stack JavaScript › NodeJS › Authentication

## 核心概念

這個專案要你做一間「祕密俱樂部（clubhouse）」：任何人都能寫下匿名貼文，但只有**入會的成員**才看得到某篇貼文究竟是誰寫的、什麼時候寫的。對外人而言，他們只讀得到故事本身，看不到作者——留下懸念。這正是把上一課「Authentication Basics」學到的技巧真正用起來的機會，同時你也會再練一次資料庫模型設計與關聯。

這個題目看似小，卻剛好把 web app 三個核心能力串在一起：**authentication（認證，你是誰）**、**authorization（授權，你能做什麼）**，以及**依身分決定要顯示什麼資料**。動手前，先把下面幾個重點在腦中建立清楚的地圖。

### 1. 先設計資料模型

跟每個資料庫專案一樣，第一步是想清楚要存哪些東西。這個 app 需要兩種 entity（實體）：

- **User（使用者）**：需要 first name 與 last name（全名分兩欄）、username（可以直接用 email）、password，以及 **membership status（會員狀態）**——用來標記這個人是不是已入會的成員。
- **Message（貼文）**：需要 title（標題）、timestamp（建立時間）、text（內文），而且**每則貼文都要記錄是誰寫的**。

User 與 Message 是典型的**一對多（one-to-many）**關聯：一個使用者可以寫很多則貼文，每則貼文屬於一個作者。實作上你會在 `messages` 表放一個指向 `users` 表的 **foreign key（外鍵）**，例如 `user_id`。

### 2. 註冊：清洗、驗證、雜湊，還有「確認密碼」

有了模型才有使用者可放。先做 sign-up（註冊）表單，把人灌進資料庫。這一步有三件事一定要做對：

- **sanitize（清洗）與 validate（驗證）** 每個欄位，用 `express-validator` 檢查必填、長度、email 格式等。
- 用 **bcrypt** 把密碼**雜湊（hash）**後再存進資料庫——**絕對不要**存明碼。
- 表單要多一個 **confirmPassword（確認密碼）** 欄位，並用 [custom validator（自訂驗證器）](https://express-validator.github.io/docs/guides/customizing) 檢查它和 password 是否一致。

### 3. 入會：用暗號升級為成員

註冊完成時，**不要**自動把人設成成員——不然這間「私人俱樂部」就人人可進、毫無樂趣了。做法是另外開一個頁面，讓已登入的使用者輸入一組**祕密暗號（secret passcode）**；輸入正確就把他的 membership status 更新為「已入會」。這一步是整個 app 「私密感」的來源。

### 4. 登入與「依身分顯示」

用 Passport.js 的 `LocalStrategy` 做 login（登入）表單，跟上一課一模一樣。登入之後，Passport 會把目前使用者掛在 `req.user` 上；你也可以透過 middleware 把它塞進 `res.locals`，讓每個 template（樣板）都能直接判斷「現在是誰在看」。接著整個 app 的畫面就依身分決定要露出什麼：

- 只有**登入**的使用者才看得到「建立新貼文」的連結，也才進得了新貼文表單。
- 首頁列出**所有**貼文，但**作者與日期只對成員顯示**；非成員（包含還沒登入的訪客）只看得到標題與內文。

### 5. Admin：刪除貼文的權力

替 User 模型加一個選填的 **admin** 欄位。只有 `admin === true` 的使用者才看得到每則貼文旁的「刪除」按鈕，也才有權真的刪掉貼文。你需要一個把人標記成 admin 的方式——可以再開一個祕密暗號頁面，或乾脆在註冊表單放一個「我是管理員」的勾選框（passcode 的變形）。

做到這裡，這個 app 就有了三種身分階層，這正是本課要你練的重點：

| 身分 | 看得到標題與內文 | 看得到作者與日期 | 能刪貼文 |
| --- | --- | --- | --- |
| 訪客／一般使用者 | 是 | 否 | 否 |
| 成員（member） | 是 | 是 | 否 |
| 管理員（admin） | 是 | 是 | 是 |

這雖然是個小玩具 app，但你在其中練到的——建立與認證使用者、依權限給予不同能力——是日後每個正式專案都會反覆用到的核心技能。

## 程式碼範例

以下幾段點出這個專案最關鍵的手感，其餘骨架沿用你在前幾課建立的 Express + PostgreSQL + Passport 結構。

用 `express-validator` 的 custom validator 檢查「兩次密碼一致」：

```javascript
// 註冊表單的驗證鏈（validation chain）
const { body } = require("express-validator");

const validateSignUp = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("密碼至少 6 個字元"),
  body("confirmPassword").custom((value, { req }) => {
    // 回傳布林或丟出錯誤都可以；不一致就讓驗證失敗
    if (value !== req.body.password) {
      throw new Error("兩次輸入的密碼不一致");
    }
    return true;
  }),
];
```

註冊時用 bcrypt 雜湊密碼再寫入資料庫：

```javascript
const bcrypt = require("bcryptjs");

async function signUpPost(req, res, next) {
  try {
    // 10 是 salt rounds（加鹽次數），數字越大越慢也越安全
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.createUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: hashedPassword, // 存的是雜湊，不是明碼
    });
    res.redirect("/");
  } catch (err) {
    next(err);
  }
}
```

用一個 middleware 把目前使用者放進 `res.locals`，之後每個 template 都能取用：

```javascript
// 放在所有 route 之前
app.use((req, res, next) => {
  res.locals.currentUser = req.user; // 未登入時為 undefined
  next();
});
```

在 template 裡依身分決定要不要露出作者與刪除按鈕（以 EJS 為例）：

```html
<% messages.forEach((msg) => { %>
  <article>
    <h3><%= msg.title %></h3>
    <p><%= msg.text %></p>

    <% if (currentUser && currentUser.membershipStatus) { %>
      <!-- 只有成員看得到作者與日期 -->
      <small><%= msg.authorName %> · <%= msg.createdAt %></small>
    <% } %>

    <% if (currentUser && currentUser.admin) { %>
      <!-- 只有 admin 看得到刪除按鈕 -->
      <form action="/message/<%= msg.id %>/delete" method="POST">
        <button type="submit">刪除</button>
      </form>
    <% } %>
  </article>
<% }) %>
```

## 常見陷阱

!!! warning "把顯示／隱藏當成真正的安全防線"
    在 template 裡「不顯示刪除按鈕」只是視覺上的遮蔽，並非安全。任何人都能直接對 `/message/:id/delete` 發出 POST 請求。真正的防護要放在**伺服器端**：處理刪除、進入新貼文表單、升級為成員等 route，都要用 middleware 檢查 `req.user` 的身分（是否登入、是否成員、是否 admin），不符就擋下並導回。這就是 authentication（你是誰）與 authorization（你能不能做）的差別。

!!! warning "把密碼存成明碼"
    絕對不要把使用者輸入的密碼直接寫進資料庫。一定要先用 bcrypt 雜湊，登入時再用 `bcrypt.compare()` 比對。資料庫一旦外洩，明碼密碼會直接連累使用者在其他網站的帳號。

!!! warning "註冊時就自動給予會員身分"
    membership status 的預設值應該是「非成員」，入會只能透過那個祕密暗號頁面取得。如果註冊就自動設成成員，整個「私人俱樂部」的設計就失去意義了。

!!! warning "忘了驗證 confirmPassword，或把它一起存進資料庫"
    confirmPassword 只是用來比對，不該被寫進資料庫。務必用 custom validator 確認它和 password 相同；真正入庫的只有雜湊後的 password 那一欄。

!!! warning "非成員也看得到作者"
    這是本專案的核心規格：非成員（含未登入訪客）只能看到標題與內文，**看不到作者與日期**。在 template 判斷 `currentUser` 是否為成員時要格外小心，別不小心把作者資訊漏給不該看到的人。

## 練習

這是一個需要自行架設 Express 專案、PostgreSQL 資料庫與部署環境的完整 project（專案）。與作業系統、平台相關的細節請以[原文](https://www.theodinproject.com/lessons/node-path-nodejs-members-only)為準。整體流程如下：

1. **先設計資料模型**：規劃出 User（first/last name、username、password、membership status）與 Message（title、timestamp、text，並記錄作者）兩張表，以及兩者之間的一對多關聯。
2. 在 PostgreSQL 建好資料庫，並產生或建立專案骨架（含上一步設計的 models）。
3. 做 sign-up 表單，把使用者灌進資料庫：清洗與驗證欄位、用 `bcrypt` 雜湊密碼，並加上 confirmPassword 欄位與 custom validator。
4. 註冊**不要**自動給會員身分。另開一個「加入俱樂部」頁面，讓使用者輸入祕密暗號，正確才更新 membership status。
5. 用 Passport.js 做 login 表單（同上一課）。
6. 使用者登入後，給他一個「建立新貼文」連結（**只在登入時顯示**），並做出新貼文表單。
7. 首頁列出所有貼文，但**只對成員顯示作者與日期**。
8. 替 User 模型加一個選填的 admin 欄位，並加入刪除貼文的功能——**只有 `admin === true` 的使用者**看得到刪除按鈕、也才能刪除。你需要一個把人標記為 admin 的方式（另開暗號頁，或在註冊表單放勾選框）。
9. 檢查最終行為：訪客能看到隱藏作者的貼文列表、能註冊與發文；只有成員看得到作者與日期；admin 能看到一切並能刪貼文。
10. 對成果滿意後，部署到你選擇的 PaaS 平台（見 Deployment 一課的清單）並分享。

## 原文與延伸資源

- 原文：[Project: Members Only](https://www.theodinproject.com/lessons/node-path-nodejs-members-only)
- 本課引用：上一課「Authentication Basics」（Passport.js 的 `LocalStrategy`、session）、`bcrypt`（密碼雜湊）、`express-validator` 的 [custom validator 官方指南](https://express-validator.github.io/docs/guides/customizing)、PostgreSQL 與 Deployment 各課。

---

> 本講義改寫自 The Odin Project《Project: Members Only》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
