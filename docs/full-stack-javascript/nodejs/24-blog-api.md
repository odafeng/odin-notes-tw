---
title: 專案：Blog API
source_url: https://www.theodinproject.com/lessons/node-path-nodejs-blog-api
source_file: vendor/curriculum/nodeJS/apis/project_blog_api.md
path: full-stack-javascript
course: NodeJS
order: 24
generated: 2026-07-04
---

# 專案：Blog API

> 改寫自 The Odin Project：[Project: Blog API](https://www.theodinproject.com/lessons/node-path-nodejs-blog-api)
> ｜Full Stack JavaScript › NodeJS › APIs

## 核心概念

這個專案要你打造一個部落格系統，但重點不在部落格本身，而在於一種架構思維：**把後端做成一個純 API（application programming interface，應用程式介面），前端只是眾多消費者之一**。你會做出三個獨立的部分：

1. 一個 **API-only 後端**（Express + Prisma），只回傳 JSON，不渲染任何畫面。
2. 一個給**讀者**看的前端網站：讀文章、留言。
3. 一個只給**作者（你自己）**用的後台網站：撰寫、編輯、發佈與下架文章、管理留言。

### 為什麼要拆成兩個前端？

技術上，一個網站就能同時服務讀者與作者。之所以刻意拆開，是要親身體會「後端與前端解耦」的威力：後端不再知道、也不在乎誰來呼叫它。今天是你的讀者網站，明天可能是 React app、手機 app、甚至別人的服務——只要它們懂得打你的 API endpoint（端點），就能取得資料。這也帶來一點 security（安全）上的好處：對外的讀者網站根本不需要載入任何編輯、發佈的程式碼。

這種「後端只吐 JSON、前端各自用 `fetch` 取用」的模式，正是現代 full stack 開發的主流。你在先前的 REST（representational state transfer）課學到的每個觀念，這裡都會實際落地。

### 先設計資料模型（model / schema）

動手寫 code 前先想清楚資料長什麼樣。至少會有三種 model：

- **Post（文章）**：`title`（標題）、`content`（內文）、`published`（是否公開）、建立時間、作者關聯。
- **Comment（留言）**：`content`、留言者資訊、時間，並關聯到某一篇 Post。
- **User（使用者）**：至少要有帳號與密碼，用來保護 route（路由）。即使你只打算有一位作者，一個最小的 User model 仍然值得存在，因為 authentication（認證）需要它。

幾個要自己拿主意的設計問題：

- 留言要不要強制留下 username（使用者名稱）或 email？
- 文章與留言要顯示日期還是完整 timestamp（時間戳）？
- 留言需不需要標題？（通常不用，但文章需要。）
- **草稿機制**：部落格常需要「文章已存進資料庫，但尚未對外公開」。用一個 `published` 布林欄位就能區分已發佈與未發佈。讀者網站只查 `published: true` 的文章，後台則兩者都看得到。

### RESTful 的 route 與 controller

設計好 model 後，用 Express 搭出 route，並把邏輯放進 controller（控制器）。用 REST 的方式組織，資源大致是 posts 與 comments：

- `GET /posts`、`GET /posts/:id`：讀文章（讀者網站只回已發佈的）。
- `POST /posts`、`PUT /posts/:id`、`DELETE /posts/:id`：新增／修改／刪除（受保護）。
- `GET /posts/:id/comments`、`POST /posts/:id/comments`：巢狀的留言資源。

### 用 JWT 保護 route

你絕不希望路人甲能改你的文章，所以「寫入類」的 route 必須擋在 authentication 之後。本專案指定使用 **JWT（JSON Web Token）**：

- 使用者用帳密登入成功後，後端簽發一枚 JWT 給他。
- 之後每次呼叫受保護的 route，client（用戶端）都把這枚 token 附在 request 上；後端驗證 token 有效才放行。
- 登出時，client 把 token 從儲存空間移除即可。

JWT 有很多傳遞與儲存方式（cookie、localStorage、access／refresh token 等），部署到正式環境後跨站 cookie 會很棘手。**這個專案先保持簡單**：token 放在 `Authorization` header、用 `Bearer` schema 傳送，client 把它存在 `localStorage`。

實作上可用 [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken) 來簽發與驗證 token；若你已用 Passport 的 local strategy 處理登入，驗證 token 時搭配 [`passport-jwt`](https://github.com/mikenicholson/passport-jwt) 會很順手。

### 前端只是 API 的消費者

API 通了以後才輪到前端。技術選擇隨你：會 React 就用 React，喜歡純 HTML／CSS／vanilla JavaScript 也完全可以。要把文章顯示在畫面上，本質只是 `fetch` 對的 endpoint、拿到 JSON 再渲染。後台網站可以多做幾件貼心功能：列出所有文章並標示是否已發佈、一鍵發佈／下架、一個「新文章」表單（想炫可接 rich text editor，如 TinyMCE）、以及管理留言的介面。

這是一門後端導向的課，若你想把力氣集中在 REST API 上，前端從簡也無妨。

## 程式碼範例

以下是一個「用 middleware（中介軟體）驗證 JWT，藉此保護 route」的最小骨架，示範 token 從 `Authorization: Bearer <token>` 取出、驗證、再決定放行或擋下。

```js
// auth.js —— 驗證 JWT 的 middleware
const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  // 從 Authorization header 取出 "Bearer <token>"
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "未提供 token" });
  }

  const token = header.split(" ")[1]; // 拿到 Bearer 後面那段

  try {
    // 用簽發時的密鑰驗證；通過會回傳 payload（酬載）
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // 把使用者資訊掛到 req，供後續 controller 使用
    next();             // 驗證成功，放行
  } catch (err) {
    return res.status(403).json({ error: "token 無效或已過期" });
  }
}

module.exports = authenticate;
```

```js
// posts.js —— 把 middleware 套在需要保護的 route 上
const express = require("express");
const router = express.Router();
const authenticate = require("./auth");

// 讀取文章：公開，任何人都能呼叫
router.get("/", async (req, res) => {
  // 讀者網站只回已發佈的文章
  const posts = await prisma.post.findMany({ where: { published: true } });
  res.json(posts);
});

// 新增文章：受保護，先過 authenticate 才進 handler
router.post("/", authenticate, async (req, res) => {
  const post = await prisma.post.create({
    data: { ...req.body, authorId: req.user.id },
  });
  res.status(201).json(post);
});

module.exports = router;
```

登入成功時簽發 token 的做法大致如下：

```js
// 驗證完帳密後，簽一枚有效期一天的 token
const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
  expiresIn: "1d",
});
res.json({ token }); // 回傳給 client，client 存進 localStorage
```

## 常見陷阱

!!! warning "後端不要渲染畫面"
    API-only 後端的職責是回傳 JSON，不是 render HTML。如果你發現自己在後端寫 `res.render(...)` 或塞 view template，就代表架構走偏了。前端渲染的事交給前端。

!!! warning "別把密碼或密鑰放進 JWT payload"
    JWT 的 payload 只是 base64 編碼，**不是加密**，任何人都能解讀。裡面只放非敏感的識別資訊（如 user id），密碼、密鑰絕不能放。`JWT_SECRET` 要放在環境變數，不要 commit 進 repo。

!!! warning "protected route 一定要真的擋住"
    最容易犯的錯是「前端把編輯按鈕藏起來就以為安全了」。真正的防線在後端：每一條寫入類 route 都必須經過 authentication middleware。前端隱藏只是體驗，後端驗證才是 security。

!!! warning "跨來源與部署的坑先別急著跳"
    部署後前後端網域不同，會遇到 CORS（cross-origin resource sharing，跨來源資源共享）與跨站 cookie 的問題。本專案刻意用 `Authorization` header + localStorage 就是為了先避開 cookie 的複雜度。等基本功能都通了，再回頭研究更安全的 refresh token 等進階做法。

!!! warning "測試 route 不必先寫 HTML 表單"
    要送 `POST`／`PUT` 請求驗證 API，不用先刻一個表單。用終端機的 `curl`，或 [Postman](https://www.postman.com/downloads/) 這類工具直接組請求最快。單純的 `GET` 用瀏覽器打開網址就能看。

## 練習

這是一個 project（專案）課，完整且會持續更新的步驟以原文為準，這裡整理成可依循的中文流程：

1. **決定 repo 結構**：三個 app（後端、讀者前端、作者後台）可以各自一個 repo，也可以放進同一個 monorepo（各占一個目錄）。看你偏好保留獨立 commit 歷史，還是集中管理。
2. **設計 model 與 schema**：依上文的 Post／Comment／User 想清楚欄位，特別是 `published` 草稿機制。
3. **搭 Express app，用 Prisma 定義 model**。
4. **建 route 與 controller**：以 RESTful 方式組織 posts 與 comments。用 `curl`、瀏覽器或 Postman 測試。
5. **用 JWT 保護 route**：以 `jsonwebtoken`（可搭 `passport-jwt`）簽發／驗證 token，透過 `Authorization` header 的 `Bearer` schema 傳送，client 存 `localStorage`。
6. **做讀者前端**：React 或純 HTML／CSS／JS 皆可，用 `fetch` 打 endpoint 顯示文章與留言。前端取用 API 的細節可參考 [Working with APIs](https://www.theodinproject.com/lessons/javascript-working-with-apis) 一課。
7. **做作者後台**：文章列表（標示是否已發佈）、發佈／下架按鈕、新文章表單（可選接 TinyMCE 這類 rich text editor）、管理留言。
8. **部署**：API 依 [Deployment](https://www.theodinproject.com/lessons/node-path-nodejs-deployment) 課用 PaaS 部署；前端沿用之前部署前端的做法（React 可回顧 [CV Application](https://www.theodinproject.com/lessons/node-path-react-new-cv-application) 課的 hosting 選項）。

完整步驟請見原文：[Project: Blog API](https://www.theodinproject.com/lessons/node-path-nodejs-blog-api)。

## 原文與延伸資源

- 原文：[Project: Blog API](https://www.theodinproject.com/lessons/node-path-nodejs-blog-api)
- 本課引用：
  - [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)：簽發與驗證 JWT。
  - [passport-jwt](https://github.com/mikenicholson/passport-jwt)：Passport 的 JWT strategy。
  - [Postman](https://www.postman.com/downloads/)：測試 API 請求的工具。
  - [TinyMCE](https://www.tiny.cloud/docs/tinymce/6/cloud-quick-start/)：後台可選用的 rich text editor。
  - [Working with APIs](https://www.theodinproject.com/lessons/javascript-working-with-apis)：前端 `fetch` 取用 API。

---

> 本講義改寫自 The Odin Project《Project: Blog API》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
