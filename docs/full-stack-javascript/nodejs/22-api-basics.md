---
title: API 基礎
source_url: https://www.theodinproject.com/lessons/nodejs-api-basics
source_file: vendor/curriculum/nodeJS/apis/api_basics.md
path: full-stack-javascript
course: NodeJS
order: 22
status: draft
generated: 2026-07-04
---

# API 基礎

> 改寫自 The Odin Project：[API Basics](https://www.theodinproject.com/lessons/nodejs-api-basics)
> ｜Full Stack JavaScript › NodeJS › APIs

## 核心概念

### 為什麼要把後端變成 API？

近幾年網站開發流行一種新的架構模式：不再把資料庫、後端邏輯與畫面樣板（view template）全部塞進同一個 app，而是把「前端」與「後端」拆成兩個獨立專案分開部署。後端與資料庫放在伺服器上（例如某個 VPS（虛擬私人伺服器）或雲端平台），前端則交給靜態網頁託管服務（像 GitHub Pages、Netlify）。這種把前後端分離、前端純靜態託管的做法，常被稱為 Jamstack。

這樣拆分有幾個好處：

- **模組化更清楚**：business logic（商業邏輯）與 view logic（畫面邏輯）不再混在一起，各自維護。
- **一個後端餵多個前端**：同一組後端 API 可以同時服務網站、桌面 app、手機 app，不必為每個平台重寫一份後端。
- **前端框架體驗更好**：喜歡用 React、Vue 這類框架寫 single-page application（單頁應用）的開發者，可以專心做純前端。

前端與後端之間通常用 **JSON** 溝通。如果你走過前端 JavaScript 課程，對 JSON 應該不陌生。所以到這個階段，你要學的其實只有一件事：**讓 Express 講 JSON 而不是講 HTML**。

在 Express 裡這件事簡單到出乎意料——把資料丟進 `res.json()`，取代原本的 `res.send()`（送純文字/HTML）或 `res.render()`（渲染樣板）就好：

```js
// 原本回傳 HTML 畫面
res.render("posts", { posts });

// 改成回傳 JSON 資料
res.json(posts);
```

`res.json()` 會自動把 JavaScript 物件序列化成 JSON 字串，並把回應的 `Content-Type` 標頭設為 `application/json`，前端拿到就能直接解析。

回想一下 Routes（路由）那一課，我們把相關的 route 分組、抽成各自的檔案（router）。這種組織方式讓你能修改某一組 route 而不影響其他組——寫 API 時同樣沿用這個習慣。

### REST：API 的組織慣例

一個 API 的網址結構可以有很多種寫法，例如你可以取名 `/api/getAllPostComments/:postid`，也可以取名 `/api/posts/:postid/comments`。**但是**，業界慣例是遵循 **REST**（Representational State Transfer 的縮寫，中文常譯作「表現層狀態轉換」）。REST 是一套流行且通用的 API 組織方法，它與 **CRUD** 動作（Create 建立、Read 讀取、Update 更新、Delete 刪除）相互對應。

遵循 REST 這類既有慣例，會讓你的 API 更好維護，也讓其他開發者更容易接上你的 API。軟體開發很多時候談的是「清楚的溝通」，而遵循大家共同的期待，正是溝通順暢的關鍵。

REST 的正式技術定義有點複雜（statelessness 無狀態、cacheability 可快取等），但對我們來說，這些特性大多在「用 Express 輸出 JSON」時就已經預設達成了。我們要特別動腦筋思考的，是**如何組織 endpoint（端點）的 URI**（Uniform Resource Identifier，統一資源識別碼）。

#### 資源導向：對著「東西」下動詞

REST API 是 **resource based（資源導向）** 的。意思是：與其取 `/getPostComments`、`/savePostInDatabase` 這種「動詞＋名詞」的名字，我們**直接指向資源本身**（這裡的資源就是「文章 post」），再用 HTTP 動詞（GET、POST、PUT、DELETE）來決定要對它做什麼動作。

換句話說，網址（URI）只描述「東西」，動作交給 HTTP 動詞。這樣一來，`/posts` 這個網址不需要為「拿文章」「存文章」「刪文章」各取一個名字，同一個網址搭配不同動詞就能表達不同意圖。

通常每個資源會有 **兩個 URI**：

- 一個代表**整個集合（collection）**，例如 `/posts`（所有文章）。
- 一個代表集合裡的**單一物件**，例如 `/posts/:postid`（某一篇文章，`:postid` 是路徑參數，代表那篇文章的 id）。

集合還可以**巢狀嵌套**。想拿某篇文章底下的留言清單，就用 `/posts/:postid/comments`；想拿其中一則特定留言，就用 `/posts/:postid/comments/:commentid`。

#### HTTP 動詞對照表

| 動詞（Verb） | 動作（CRUD） | 範例                                        |
| ------------ | ------------ | ------------------------------------------- |
| POST         | Create 建立  | `POST /posts` 建立一篇新文章                |
| GET          | Read 讀取    | `GET /posts/:postid` 取得單一篇文章         |
| PUT          | Update 更新  | `PUT /posts/:postid` 更新單一篇文章         |
| DELETE       | Delete 刪除  | `DELETE /posts/:postid` 刪除單一篇文章      |

URI 的每一段都在指定「哪個資源」。例如 `GET /posts` 回傳整份文章清單，`GET /posts/:postid` 指定我們想要的那一篇。再往下巢狀，`GET /posts/:postid/comments` 回傳那篇文章的留言清單，`GET /posts/:postid/comments/:commentid` 則精準指向某一篇文章的某一則留言。

理解這張表，你就抓到 REST 的核心：**URI 指定資源、HTTP 動詞指定動作，兩者組合就是一個 endpoint。**

### CORS：跨來源請求為什麼會被擋

當你把前端與後端**分開部署到不同網域（domain）** 時，會撞上一道瀏覽器的安全牆，這就是我們要認識 CORS 的原因。

#### Same-Origin Policy（同源政策）

**Same-Origin Policy（同源政策）** 是瀏覽器一項重要的安全機制：它限制一個網頁只能向「與載入它的頁面同源」的地方發出請求，跨到不同 origin（來源）的請求預設會被擋下。

所謂 **origin（來源）** 由三個部分共同決定：**協定（protocol，如 `http` / `https`）＋ 網域（host，如 `example.com`）＋ 連接埠（port，如 `:3000`）**。三者完全一致才算「同源」，任一項不同就算「不同源」。舉例來說：

- `https://example.com/a` 與 `https://example.com/b` → **同源**（只有路徑不同）。
- `https://example.com` 與 `http://example.com` → **不同源**（協定不同）。
- `https://example.com` 與 `https://api.example.com` → **不同源**（網域不同）。
- `https://example.com` 與 `https://example.com:3000` → **不同源**（連接埠不同）。

同源政策的用意，是避免惡意網站在你不知情的情況下，偷偷用你的身分向其他網站（例如你的銀行）發請求竊取資料。

#### CORS（跨來源資源共享）

問題來了：在下一個專案裡，我們會把 REST API 與前端**分開部署到不同網域**。這代表前端網頁想存取後端 API 時，會被同源政策擋下來。

解法就是在**伺服器端**開啟 **CORS（Cross-Origin Resource Sharing，跨來源資源共享）**。CORS 是一套機制，讓伺服器透過回應標頭（response header）明確告訴瀏覽器：「這些來源我允許存取」。當瀏覽器看到伺服器回應中帶有正確的 CORS 標頭，就會放行原本會被同源政策擋下的跨來源請求。

要點在於：**CORS 是由「被存取的伺服器」來設定的**，不是前端。伺服器透過像 `Access-Control-Allow-Origin` 這類 response header 宣告誰可以來存取。

Express 有官方推薦的 [`cors` middleware 套件](https://expressjs.com/en/resources/middleware/cors.html)，幫你把這些標頭都設好，你不必手動一個個寫。

#### 開發時可以先全部放行，上線務必收緊

開發階段，**先允許任何來源存取**是可以接受的，這讓開發輕鬆不少。但只要是**真正**的專案，一旦部署到 production（正式環境），你幾乎一定會想**只允許自己的前端網站**存取，擋掉其他所有來源。放任任何來源都能存取你的 API，等於敞開大門讓別人濫用你的後端資源。

## 程式碼範例

以下是一個最小可執行的 Express API，示範 `res.json()`、REST 風格 route，以及三種 CORS 設定方式。先安裝套件：

```bash
npm install express cors
```

```js
// app.js
const express = require("express");
const cors = require("cors");

const app = express();

// 讓 Express 能解析 request body 裡的 JSON（Express 4.16.0 起內建，不需另裝 body-parser）
app.use(express.json());

// --- CORS 設定：三選一 ---

// (1) 全域放行任何來源（開發時方便，正式環境不建議）
app.use(cors());

// (2) 全域只允許特定來源（正式環境常見做法）
// app.use(cors({ origin: "https://my-frontend.example.com" }));

// 假資料，模擬資料庫
const posts = [
  { id: 1, title: "第一篇文章", body: "哈囉世界" },
  { id: 2, title: "第二篇文章", body: "學 REST API" },
];

// GET /posts —— 讀取整個集合
app.get("/posts", (req, res) => {
  res.json(posts); // 回傳 JSON，而非 HTML
});

// GET /posts/:postid —— 讀取單一物件
app.get("/posts/:postid", (req, res) => {
  const post = posts.find((p) => p.id === Number(req.params.postid));
  if (!post) {
    return res.status(404).json({ error: "找不到這篇文章" });
  }
  res.json(post);
});

// POST /posts —— 建立新資源
app.post("/posts", (req, res) => {
  const newPost = { id: posts.length + 1, ...req.body };
  posts.push(newPost);
  res.status(201).json(newPost); // 201 = Created
});

// (3) 只在單一 route 上啟用 CORS（把 cors() 當成該 route 的 middleware）
app.get("/public", cors(), (req, res) => {
  res.json({ message: "這條路由對外開放" });
});

app.listen(3000, () => {
  console.log("API 運行於 http://localhost:3000");
});
```

啟動與測試：

```bash
node app.js

# 另開一個終端機測試
curl http://localhost:3000/posts
curl http://localhost:3000/posts/1
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"新文章","body":"用 curl 建立"}'
```

重點回顧：`cors()` 不帶參數＝放行所有來源；帶 `{ origin: "..." }` 就只放行指定來源；把 `cors()` 放進單一 route 的參數，則只讓那條 route 支援跨來源。

## 常見陷阱

!!! warning "CORS 是伺服器的責任，不是前端的錯"
    很多初學者遇到「CORS error」時，直覺跑去改前端的 `fetch`，但這通常沒用。跨來源請求要能成功，必須由**被存取的伺服器**回傳正確的 CORS 標頭（例如 `Access-Control-Allow-Origin`）。前端無法自行繞過同源政策。正確做法是在 Express 後端加上 `cors` middleware。另外，同源政策是**瀏覽器**在執行；用 `curl` 或 Postman 直接打 API 不會遇到 CORS 問題，因為它們不是瀏覽器、不套用同源政策。

!!! warning "上線別忘了把 origin 收緊"
    開發時用 `app.use(cors())` 放行所有來源很方便，但這個設定若原封不動帶到 production，等於允許任何網站都能呼叫你的 API。部署前務必改成 `cors({ origin: "你的前端網址" })`，只放行自己的前端。

!!! warning "URI 用名詞，不要塞動詞"
    REST 的精神是「URI 指資源、HTTP 動詞指動作」。像 `/getAllPosts`、`/deletePost/:id` 這種把動作寫進網址的命名違反慣例。正確寫法是 `GET /posts`、`DELETE /posts/:id`——網址永遠只描述資源，動作交給 GET / POST / PUT / DELETE。

!!! warning "body-parser 已內建，別再另外裝"
    有些較舊的教學會叫你安裝 `body-parser` 來解析 request body 的 JSON。自 Express 4.16.0 起，這個功能已內建進 Express，直接用 `app.use(express.json())` 即可，不需要額外安裝 `body-parser`。

## 練習

依照下列步驟加深理解，這一課以觀念為主，重點在讀懂 REST 與 CORS 的設計思路：

1. 閱讀一篇關於 **RESTful API 設計** 的文章（原文推薦 Stack Overflow Blog 的〈Best practices for REST API design〉）。若你想跟著文中第一篇教學實作，請注意：文章會提到用 `body-parser` middleware 解析 request body 的 JSON，但自 Express 4.16.0 起這個功能已內建，改用 `express.json()` 即可，不必另裝。
2. 跟著一份 **在 Express 建立 REST API** 的教學實際動手做（原文推薦 Robin Wieruch 的〈How to create a REST API with Express.js in Node.js〉）。這份教學除了教你建 API，還會談到模組化的程式碼組織、如何自己寫 middleware，並在結尾附上不少延伸好文。

完成後，試著自問以下問題檢驗自己：

- REST 是哪幾個字的縮寫？
- HTTP 動詞是什麼？為什麼它們對 API 很重要？
- 什麼是 Same-Origin Policy（同源政策）？
- 如何在 Express app 裡啟用 CORS？
- CRUD 的四個字母（Create、Read、Update、Delete）各自對應哪個 HTTP 動詞？

## 原文與延伸資源

- 原文：[API Basics](https://www.theodinproject.com/lessons/nodejs-api-basics)
- 本課引用：
  - Express 官方 [`res.json()` 文件](https://expressjs.com/en/5x/api/response/#resjsonbody)
  - Express 官方 [CORS middleware 套件](https://expressjs.com/en/resources/middleware/cors.html)
  - MDN：[Same-origin policy（同源政策）](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
  - Wikipedia：[Representational state transfer（REST）](https://en.wikipedia.org/wiki/Representational_state_transfer)
  - Stack Overflow Blog：[Best practices for REST API design](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design)
  - Robin Wieruch：[How to create a REST API with Express.js in Node.js](https://www.robinwieruch.de/node-express-server-rest-api/)

---

> 本講義改寫自 The Odin Project《API Basics》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
