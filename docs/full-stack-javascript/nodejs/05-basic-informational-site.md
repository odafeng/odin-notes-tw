---
title: 專案：基礎資訊網站
source_url: https://www.theodinproject.com/lessons/nodejs-basic-informational-site
source_file: vendor/curriculum/nodeJS/introduction_to_nodeJS/project_basic_informational_site.md
path: full-stack-javascript
course: NodeJS
order: 5
status: draft
generated: 2026-07-04
---

# 專案：基礎資訊網站

> 改寫自 The Odin Project：[Project: Basic Informational Site](https://www.theodinproject.com/lessons/nodejs-basic-informational-site)
> ｜Full Stack JavaScript › NodeJS › Introduction to NodeJS

## 核心概念

到目前為止，你已經學會足夠的 Node.js 基礎，可以動手做出第一個真正能跑的東西了。這個專案的目標很單純：用 Node.js 內建的 `http` 模組，架一個只有 4 個頁面的靜態資訊網站。

這 4 個頁面是：

- `index.html`：首頁
- `about.html`：關於頁
- `contact-me.html`：聯絡頁
- `404.html`：找不到頁面時顯示的錯誤頁

頁面內容本身不重要，不需要花時間美化或填滿文字。這個專案真正要練的技巧是：**根據使用者請求的 URL（網址），決定要回傳哪一個 HTML 檔案**。這正是所有 web server（伺服器）最核心的職責——把「進來的請求」對應到「該給的回應」。

### 專案要練到的三個重點

1. **建立 HTTP server**：用 `http.createServer()` 建立一個伺服器物件，並用 `.listen()` 讓它在某個 port（連接埠，本專案用 `8080`）上待命。
2. **讀取請求的 URL 並做 routing（路由）**：每次有人連進來，callback（回呼函式）會拿到一個 request（請求）物件，裡面的 `req.url` 就是使用者輸入的路徑。你要依照這個路徑決定要讀哪個檔案。
3. **從硬碟讀檔並回傳**：用 `fs`（file system，檔案系統模組）把對應的 HTML 檔讀進來，透過 response（回應）物件送回瀏覽器。

### URL 與檔案的對應關係

這是這個專案的邏輯核心。你要建立的對應表如下：

| 使用者輸入的網址 | `req.url` 的值 | 要回傳的檔案 |
| --- | --- | --- |
| `localhost:8080` | `/` | `index.html` |
| `localhost:8080/about` | `/about` | `about.html` |
| `localhost:8080/contact-me` | `/contact-me` | `contact-me.html` |
| 以上都不符合的任何網址 | 其他 | `404.html` |

注意最後一列：只要使用者輸入的路徑不在清單裡，一律回傳 `404.html`。這就是所謂的 fallback（後備）處理，讓網站在遇到不存在的頁面時，仍然給出一個合理的回應，而不是整個當掉。

### 為什麼要親手寫這個？

日後你多半會用 Express 這類 framework（框架），它會把 routing、讀檔、設定 header（標頭）這些瑣事都包好。但先親手用原生 `http` 寫一次，你會清楚看見「一個請求進來、一個回應出去」中間到底發生了什麼事——這層理解在之後除錯時非常值錢。

## 程式碼範例

下面是一個可直接執行的最小範例。把它存成專案資料夾裡的 `index.js`，同一層再放好 4 個 HTML 檔，就能跑起來。

```javascript
// index.js
const http = require("http"); // 內建 HTTP 模組
const fs = require("fs");      // 內建檔案系統模組

const port = 8080;

const server = http.createServer((req, res) => {
  // 依照 req.url 決定要回傳哪個檔案
  let filePath;
  switch (req.url) {
    case "/":
      filePath = "index.html";
      break;
    case "/about":
      filePath = "about.html";
      break;
    case "/contact-me":
      filePath = "contact-me.html";
      break;
    default:
      filePath = "404.html"; // 找不到對應頁面時的後備
  }

  // 讀取對應的 HTML 檔並回傳
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // 讀檔失敗（例如檔案不存在），回傳伺服器錯誤
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("伺服器發生錯誤");
      return;
    }

    // 404 頁面要用 404 狀態碼，其餘用 200
    const statusCode = req.url === "/about" || req.url === "/contact-me" || req.url === "/" ? 200 : 404;
    res.writeHead(statusCode, { "Content-Type": "text/html" });
    res.end(data); // 把檔案內容送回瀏覽器
  });
});

server.listen(port, () => {
  console.log(`伺服器啟動，請開啟 http://localhost:${port}`);
});
```

一個最陽春的 HTML 頁面（例如 `index.html`）長這樣就夠了：

```html
<!DOCTYPE html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <title>首頁</title>
  </head>
  <body>
    <h1>首頁</h1>
    <p>這是 index 頁面。</p>
  </body>
</html>
```

執行方式（在專案資料夾內）：

```bash
node index.js
```

然後打開瀏覽器輸入 `http://localhost:8080`，並試著加上 `/about`、`/contact-me`，以及一個亂打的路徑來驗證 404 是否正常。要停止伺服器，在終端機按 `Ctrl + C`。

## 常見陷阱

!!! warning "忘記設定 Content-Type，瀏覽器把 HTML 當純文字顯示"
    如果回應的 header 沒有設 `"Content-Type": "text/html"`，瀏覽器可能會把整個 HTML 原始碼當成純文字印在畫面上，而不是渲染成網頁。送 HTML 時記得用 `res.writeHead(200, { "Content-Type": "text/html" })`。

!!! warning "改了程式碼卻沒反應——伺服器需要重啟"
    Node.js 的伺服器啟動後會一直用啟動當下載入的程式碼，不會自動偵測檔案變更。每次修改 `index.js` 後，都要回終端機按 `Ctrl + C` 停掉，再重新 `node index.js`。（注意：改的是 HTML 檔則不必重啟，因為每個請求都會重新 `readFile`。）

!!! warning "port 8080 已被占用"
    如果啟動時出現 `EADDRINUSE` 錯誤，代表 8080 這個 port 已被別的程式占用（很可能是上一個沒關乾淨的伺服器）。先確定舊的 process（程序）已關閉，或改用其他 port（例如 3000）。

!!! warning "404 頁面也要記得回傳正確狀態碼"
    當使用者連到不存在的頁面時，除了顯示 `404.html`，回應的 HTTP 狀態碼最好也設成 `404` 而不是 `200`。狀態碼是給瀏覽器和搜尋引擎看的訊號，內容對、狀態碼卻是 200，語意上就不正確。

## 練習

以下步驟改寫自原文的 Assignment，跟著做即可完成專案：

1. **建立專案資料夾**，並在裡面建立這 4 個 HTML 檔：
    - `index.html`
    - `about.html`
    - `contact-me.html`
    - `404.html`

    每個檔案隨意放一點內容，能分辨是哪一頁就好，不必美化。

2. **建立伺服器檔案 `index.js`**，寫入建立 HTTP server 的程式碼，並依 URL 回傳正確頁面：
    - `localhost:8080` 對應 `index.html`
    - `localhost:8080/about` 對應 `about.html`
    - `localhost:8080/contact-me` 對應 `contact-me.html`
    - 以上都不符合的網址，一律顯示 `404.html`

3. **啟動並驗證**：執行 `node index.js`，逐一開啟上面 4 種情境（含一個亂打的網址），確認每個路徑都回傳正確的頁面。

如果中途卡住，可以回頭複習前一課「Getting Started」（NodeJS 入門）的伺服器範例；作業系統或環境設定相關的細節步驟，請參照[原文](https://www.theodinproject.com/lessons/nodejs-basic-informational-site)。

## 原文與延伸資源

- 原文：[Project: Basic Informational Site](https://www.theodinproject.com/lessons/nodejs-basic-informational-site)
- 本課引用：Node.js 內建 `http` 模組、`fs` 模組；前一課 [Getting Started with NodeJS](https://www.theodinproject.com/lessons/nodejs-getting-started)

---

> 本講義改寫自 The Odin Project《Project: Basic Informational Site》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
