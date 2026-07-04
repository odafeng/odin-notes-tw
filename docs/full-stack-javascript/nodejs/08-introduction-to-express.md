---
title: Express 簡介
source_url: https://www.theodinproject.com/lessons/node-path-nodejs-introduction-to-express
source_file: vendor/curriculum/nodeJS/express/introduction_to_express.md
path: full-stack-javascript
course: NodeJS
order: 8
status: draft
generated: 2026-07-04
---

# Express 簡介

> 改寫自 The Odin Project：[Introduction to Express](https://www.theodinproject.com/lessons/node-path-nodejs-introduction-to-express)
> ｜Full Stack JavaScript › NodeJS › Express

## 核心概念

### 為什麼需要 Express

在前面的章節裡，你已經能用原生 Node.js 讀寫伺服器上的檔案，甚至拼出一個多頁的網站。但你大概也體會到：光是判斷「使用者要的是哪一頁」、「該回什麼內容」、「該設哪些 HTTP header」，就得寫一大堆冗長又重複的樣板程式碼。每加一條路徑，`if / else` 就多一段；一旦要處理表單、JSON、檔案上傳、錯誤處理，複雜度會迅速失控。

**Express** 就是為了解決這個痛點而生的後端 framework（框架）。它把「接收 request（請求）、比對路徑、產生 response（回應）」這一整套流程包裝成好用的 API，讓你專注在「這條路徑要做什麼」，而不是「怎麼從 HTTP 底層把資料撈出來」。

Express 的設計哲學有兩個關鍵字：**barebones（極簡）** 與 **unopinionated（不預設立場）**。它刻意只提供最核心的功能，不強迫你用某種資料夾結構、某套樣板引擎或某個資料庫。你想怎麼組織專案、想加哪些功能，都由你決定。這種自由帶來彈性，但也有代價：當同一件事有好幾種可行做法時，新手常會卡在「到底該選哪一個」。這是學 Express 時很正常的困惑，別因此氣餒。

往後的課程會帶你用 Express 做兩類東西：一是採用 **MVC（Model View Controller，模型─視圖─控制器）** 模式的 full-stack（全端）應用，二是 **REST API**——也就是你在天氣 App 或 React 購物車專案裡呼叫過的那種後端介面。內容不少，慢慢來即可。

### 架設第一個 Express 伺服器

流程其實只有三步。先建一個新資料夾，在裡面跑 `npm init -y` 產生 `package.json`，接著安裝 Express：

```bash
npm install express
```

然後建立一個進入點檔案。慣例上會取名 `app.js`（跟 Express 官方文件一致），但你叫它 `index.js`、`main.js` 都行。這個檔案負責建立並啟動伺服器。程式的骨架分成三段：

1. **匯入並初始化**：`require("express")` 拿到 Express，呼叫它得到 `app`。這個 `app` 就代表你的伺服器。
2. **定義 route（路由）**：用 `app.get(...)` 告訴伺服器「當某種請求進來時要怎麼回應」。
3. **開始監聽**：`app.listen(PORT, ...)` 讓伺服器在指定的 port（連接埠）上等待請求進來。

`app.listen` 監聽的位置是 **localhost**（本機回環位址，指向你自己這台電腦的本地連線）。port 3000 是常見的預設值，但任何沒被佔用的 port 都可以（例如 Vite 的開發伺服器預設用 5173）。在終端機執行 `node app.js` 後，如果一切正常，你會看到啟動訊息被印出來；如果出錯（例如 port 已被佔用），程式會直接丟出錯誤。到這一步，你的第一個 Express 伺服器就跑起來了。

關於 port 有個實務重點：範例為了教學把 port 寫死成固定數字，但真實專案通常會從 **environment variable（環境變數）** 取得 port，並保留一個 fallback（後備值）：

```javascript
const PORT = process.env.PORT || 3000;
```

這樣做的好處是，換 port 時只要改環境變數、不必動原始碼；而且很多雲端部署平台會自己指定 port，未必是你寫死的那個數字。

### 一個請求的旅程

伺服器跑起來後，就來對它發一個請求。在瀏覽器網址列輸入 `http://localhost:3000/`（結尾的斜線 `/` 忘了打也沒關係，瀏覽器會自動補上）。這個動作等於告訴瀏覽器：「對 localhost 上監聽 3000 port 的伺服器，往 `/` 這條路徑送一個 `GET` 請求，然後把收到的回應顯示出來。」

其實你平常上網做的就是這件事。在網址列輸入 `https://theodinproject.com/paths`，本質上就是叫瀏覽器往 `https://theodinproject.com` 的 `/paths` 路徑發一個 `GET` 請求，再把回應畫到畫面上。

當 Express 伺服器收到這個 `GET /` 請求時，內部會發生一串明確的事：

1. Express 把這次請求包裝成一個 **request object（請求物件）**，裡面裝了這次請求的所有資訊（方法、路徑、header、參數等）。
2. 這個請求會被送進一連串的 **middleware function（中介函式）** 依序處理，直到其中某個函式告訴 Express「可以回應了」。
3. 你寫的 route callback（回呼）就是這條鏈上的一環。Express 會把 request object 傳進第一個參數（慣例叫 `req`），把 **response object（回應物件）** 傳進第二個參數（慣例叫 `res`）。
4. 你在 callback 裡呼叫 `res.send("Hello, world!")`，等於命令 response object 用這個字串回覆這次請求。
5. callback 沒有其他程式要跑就結束了。因為 Express 已被告知要回應，它便結束這整個 **request-response cycle（請求─回應循環）**。瀏覽器收到回應後把內容畫到畫面上。

這裡有個關鍵觀念要記住：**route 的順序有意義**。如果你定義了很多條路由，Express 會拿請求的 HTTP verb（動詞，例如 `GET`）和路徑（例如 `/`），去比對「第一條符合」的路由並交給它處理。一旦匹配到，後面就算還有能匹配的路由也不會再輪到。所以排列順序會直接影響行為。

另外，回應的內容幾乎不受限。上面回的是一個字串，但你也可以回 JSON、回 HTML，甚至叫 Express 直接送一個檔案回去（`res.sendFile`）。路由的細節會在後面的課程深入，這裡先建立整體圖像即可。

### 什麼是 middleware

**middleware function** 是 Express 心臟地帶的概念，值得先在腦中種下。你可以把它想成「請求在被回應之前，會經過的一道道關卡」。每個 middleware 都能拿到 `req` 和 `res`，可以讀取或修改它們、可以決定「放行給下一關」或「直接在這裡結束並回應」。

route handler（路由處理函式）其實就是 middleware 的一種特例——它是「只在符合某個路徑和動詞時才會執行」的關卡。而更廣義的 middleware 可以套用在所有請求上，用來做像是紀錄 log、解析 JSON body、驗證身分、處理錯誤這類跨路由的共通工作。這正是 Express 「極簡但可擴充」的具體體現：核心只給你路由與回應機制，其餘功能都以 middleware 的形式一片片組裝上去。這一課只要先理解「請求會流經一串 middleware，直到有人回應」這個心智模型就夠了，細節之後會慢慢補齊。

### 檔案變動時自動重啟伺服器

用 `node app.js` 啟動後，你改了任何 JavaScript 或 JSON 檔案，伺服器都不會自動反映——你得手動中斷再重跑，開發時很煩。

解法是 Node 內建的 **watch mode（監看模式）**，加上 `--watch` 旗標即可：

```bash
node --watch app.js
```

Node 會監看 `app.js` 以及它所依賴的所有檔案，一偵測到變動就自動重啟伺服器，體驗就跟 Webpack、Vite 的開發伺服器一樣。

你可能也會在網路上看到 **Nodemon** 這個套件，它同樣能監看變動並重啟，而且高度可設定。它會這麼流行，是因為 Node 早期沒有穩定的內建 watch 功能。不過現在既然 Node 已內建 `--watch`，本課建議直接用它——不必額外安裝套件，是目前最簡單的做法。

## 程式碼範例

以下是最小可執行的 Express 伺服器。建立資料夾後跑 `npm init -y` 與 `npm install express`，把內容存成 `app.js`，再用 `node --watch app.js` 啟動。

```javascript
// app.js
const express = require("express"); // 匯入 Express
const app = express();              // 初始化伺服器，app 就代表這台伺服器

// 定義一條 route：當 GET 請求打到 "/" 路徑時，回覆 "Hello, world!"
// req 是 request object（請求物件），res 是 response object（回應物件）
app.get("/", (req, res) => res.send("Hello, world!"));

// 實務上 port 通常來自 environment variable，並保留 fallback 後備值
const PORT = process.env.PORT || 3000;

// 開始在指定 port 上監聽請求
app.listen(PORT, (error) => {
  // 這一段很重要！
  // 少了它，啟動時的錯誤會無聲無息地失敗，
  // 而不是給你一個有用的錯誤訊息。
  if (error) {
    throw error;
  }
  console.log(`我的第一個 Express app － 正在監聽 port ${PORT}！`);
});
```

啟動後，在瀏覽器打開 `http://localhost:3000/`，畫面上就會出現 `Hello, world!`。試著把 `res.send(...)` 裡的字串改掉並存檔，因為用了 `--watch`，伺服器會自動重啟，重新整理瀏覽器即可看到新內容。

## 常見陷阱

!!! warning "`app.listen` 的錯誤沒處理，啟動失敗時會靜默"
    範例特地在 `app.listen` 的 callback 裡檢查 `error` 並 `throw`。如果省略這段，當 port 已被佔用等啟動錯誤發生時，程式可能不給任何提示就悄悄失敗，讓你對著沒反應的伺服器發呆。保留這段能讓錯誤浮上檯面。

!!! warning "route 的順序會影響匹配結果"
    Express 是「由上而下比對，第一條符合的路由勝出」。若你把範圍較廣的路由寫在前面，後面更精確的路由可能永遠輪不到。定義多條路由時，務必留意排列順序。

!!! warning "把 port 寫死會在部署時踩雷"
    教學範例為了清楚把 port 寫成固定 `3000`，但許多雲端平台會透過環境變數指定自己的 port。正式專案請用 `process.env.PORT || 3000`，讓環境決定 port，不必為了換 port 去改原始碼。

!!! warning "忘了 `res` 一定要回應，請求會一直卡住"
    每個進來的請求最終都需要有 middleware 呼叫 `res.send`（或其他回應方法）來結束 request-response cycle。如果某條路徑的 handler 什麼都沒回，瀏覽器會一直空轉等到逾時。確保每條路徑都有明確的回應。

!!! warning "改了檔案卻沒變化，多半是沒開 watch mode"
    用 `node app.js` 啟動時，改動不會自動生效。若你改了程式卻看不到效果，先確認是不是忘了用 `node --watch app.js`，或忘了重新整理瀏覽器。

## 練習

1. 花幾分鐘瀏覽 [Express 官方文件](https://expressjs.com/en/api.html)，對整體 API 建立初步印象。後續課程會大量引用文件內容，先混個眼熟很有幫助。
2. 回到你先前的「Basic Informational Site（基本資訊網站）」專案，安裝 Express，用它把整個專案重寫一遍。你會發現，原本用原生 Node 寫得很冗長的部分，現在幾乎只要幾個 `app.get()` 就能搞定。這個專案的完整說明以原文為準，請參考 [Basic Informational Site project](https://www.theodinproject.com/lessons/nodejs-basic-informational-site)。

完成後，用這份講義自我檢測你是否能回答以下問題：Express 是什麼？伺服器收到請求時發生了什麼事？可以用什麼方法叫 Express 回傳一個檔案（提示：`res.sendFile`）？可以用什麼方式在檔案變動時自動重啟伺服器（提示：`node --watch`）？

## 原文與延伸資源

- 原文：[Introduction to Express](https://www.theodinproject.com/lessons/node-path-nodejs-introduction-to-express)
- 本課引用：
    - [Express 官方網站與文件](https://expressjs.com/)、[Express API 文件](https://expressjs.com/en/api.html)
    - [Express request object 文件](https://expressjs.com/en/5x/api/request)、[response object 文件](https://expressjs.com/en/5x/api/response)、[`res.sendFile`](https://expressjs.com/en/5x/api/response/#ressendfilepath--options--fn)
    - [Node.js watch mode（`--watch`）文件](https://nodejs.org/docs/latest-v20.x/api/cli.html#--watch)
    - [Nodemon 套件](https://www.npmjs.com/package//nodemon)

---

> 本講義改寫自 The Odin Project《Introduction to Express》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
