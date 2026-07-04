---
title: Webpack
source_url: https://www.theodinproject.com/lessons/node-path-javascript-webpack
source_file: vendor/curriculum/javascript/organizing_your_javascript_code/webpack.md
path: full-stack-javascript
course: JavaScript
order: 10
generated: 2026-07-03
---

# Webpack

> 改寫自 The Odin Project：[Webpack](https://www.theodinproject.com/lessons/node-path-javascript-webpack)
> ｜Full Stack JavaScript › JavaScript › Organizing Your JavaScript Code

## 核心概念

### 為什麼需要 bundler（打包工具）

上一課我們認識了 ES6 modules（ESM，ES6 模組）與 npm。ESM 讓我們可以把程式碼拆成一個一個獨立的模組檔案，彼此用 `import` / `export` 串接，大幅改善了以往用一堆 `<script>` 標籤手動管理相依順序的痛苦。但它也帶來一個新的效能問題：如果一個網頁依賴幾十、甚至上百個模組檔案，瀏覽器就得一個一個把它們下載下來。每一次下載都是一次網路請求（HTTP request），檔案愈多、請求愈多，載入就愈慢。當你還引入了第三方套件（third party library）時，這個數字會膨脹得很快。

bundler（打包工具）就是為了解決這個問題而生的。它的核心工作很單純：把散落在許多檔案裡的模組，合併（bundle）成少數幾個檔案，讓瀏覽器只需要下載一兩個檔案就能跑起整個網站。

要理解 bundler 怎麼做到這件事，我們得先回顧兩個上一課出現過的名詞：

- **entry point（進入點）**：整個應用程式「開始執行」的那個檔案，通常是 `index.js`。
- **dependency graph（相依圖）**：從 entry point 出發，`index.js` import 了 `a.js`，`a.js` 又 import 了 `b.js`……把這些 import 關係全部畫出來，就形成一張「誰依賴誰」的圖。

bundler 的運作方式正是建立在這兩個概念上：你告訴它 entry point 在哪，它就從那個檔案開始，順著 `import` 一路追蹤，建立出完整的 dependency graph，把所有相關的檔案抓進來，最後**輸出一個（或少數幾個）包含所有必要程式碼的檔案**。

除了單純合併之外，bundler 在打包的過程中還能順便做很多優化，例如：

- **minification（壓縮）**：移除空白、註解、縮短變數名稱，讓檔案更小。
- **tree shaking（搖樹）**：分析 `import` / `export`，把「有匯出但從來沒被 import 使用」的死程式碼（dead code）從最終 bundle 裡剔除。這正是 ESM 的靜態 import / export 語法帶來的好處，因為打包工具能在打包前就靜態分析出哪些程式碼用得到、哪些用不到。
- 圖片優化、處理各種非 JavaScript 資源等。

這些進階優化多半超出本課範圍，我們這一課專注在最基礎、最實用的部分：打包 JavaScript，以及處理 HTML、CSS、圖片。

值得一提的是：近年出現了不少更「開箱即用」的新工具（例如 Vite），它們幫你把大部分設定自動處理好。但實務上你不一定總能用到這些新玩意，仍然很可能碰到需要手動設定的舊專案。而且就算你用的是自動化程度高的工具，理解「它背後到底幫你做了什麼」也非常有價值，這樣當某天真的需要手動微調時你才不會卡住。

### Webpack 是什麼

Webpack 是最熱門的 JavaScript bundler 之一（很可能就是最熱門的那個），而且已經稱霸很多年了。它的強大來自於它的可設定性（configurability）：透過一個設定檔，你可以精確控制它怎麼找進入點、輸出到哪、要不要壓縮、遇到 CSS 或圖片時怎麼處理……。這份彈性是它的優點，但也意味著使用它的小小成本：你得學會設定它。好消息是，我們現在的需求很簡單，可以一次看一個部分慢慢建立起來。

在開始前請確認你的 Node.js 是最新的 LTS 版本，必要時可用 NVM 安裝。

Webpack 設定檔的四大支柱如下，理解它們就等於理解了 Webpack：

- **entry（進入點）**：告訴 Webpack 從哪個檔案開始建立 dependency graph。預設是 `./src/index.js`。
- **output（輸出）**：告訴 Webpack 把打包好的檔案吐到哪裡、叫什麼名字。預設輸出到 `./dist/main.js`。
- **loaders（載入器）**：Webpack 天生只看得懂 JavaScript。loader 的任務是把「非 JavaScript」的檔案（CSS、圖片、HTML 等）轉換成 Webpack 能理解、能塞進 bundle 的模組。
- **plugins（外掛）**：處理 loader 涵蓋不到的、範圍更廣的任務，例如產生 HTML 檔、優化 bundle、注入環境變數等。

另外還有一個 **mode（模式）** 選項，可設為 `development`（開發）或 `production`（生產）。本課一律用 `development`，因為它產出的東西對我們除錯比較友善；`production` 模式會啟用壓縮等優化，留待之後的課程再談。

這四大支柱如何協作？用一句話串起來：Webpack 從 **entry** 開始建立 dependency graph → 沿途遇到非 JS 檔案時用對應的 **loader** 轉換 → 用 **plugin** 做額外的優化與資源管理 → 最後依 **output** 的設定把成品輸出，整個過程再由 **mode** 決定要套用哪一組內建優化。

### src 與 dist：兩個關鍵目錄

用 Webpack（或任何 bundler / build tool）時，有兩個依慣例命名的重要目錄：

- **`src`**（source，原始碼）：放你所有網站原始碼的地方，也就是你實際工作的地方。你幾乎所有時間都在 `src` 裡寫程式（例外是修改專案根目錄的設定檔）。
- **`dist`**（distribution，發佈）：Webpack 打包後把成品吐出來的地方。

這兩個名字可以自訂，但強烈建議遵循慣例。背後的觀念是：如果有人 fork 或 clone 你的專案，他們**不需要** `dist`，因為他們自己跑一次 Webpack 就能從 `src` 建出屬於他們的 `dist`。同樣地，要部署（deploy）網站時，你**只需要** `dist` 裡的程式碼，其他都不用。請牢記這個心法：**在 `src` 裡工作，建置（build）到 `dist`，再從 `dist` 部署。**

### 打包 JavaScript

安裝好 Webpack 後（安裝步驟見下方「程式碼範例」），我們在 `src` 裡放兩個檔案：`index.js`（進入點）與 `greeting.js`（被依賴的模組）。`index.js` 會 import `greeting.js`，這就構成了一張最小的 dependency graph。

接著在專案根目錄（不是在 `src` 裡）建立一個 `webpack.config.js` 設定檔，把 entry 與 output 寫進去。`output` 裡有三個常用欄位：

- **`filename`**：輸出 bundle 的檔名，可任意取。
- **`path`**：輸出目錄的絕對路徑。這裡用 `path.resolve(import.meta.dirname, "dist")` 產生一個指向 `dist` 的絕對路徑，這是 Webpack 官方推薦的寫法（`path.resolve` 的細節不用深究，照抄即可）。若 `dist` 不存在，Webpack 會自動幫你建立。
- **`clean: true`**：每次打包前先清空輸出目錄。這能讓 `dist` 保持乾淨，永遠只包含最近一次打包的產物。

設定就緒後，跑 `npx webpack` 就會在 `dist` 產生一個 `main.js`。裡面內容看起來一大堆、很嚇人，但大多是之後開發工具會用到的東西，不用擔心。用 `node dist/main.js` 執行它，終端機就會印出 `Hello, Odinite!`。

> **關於 import 的副檔名**：一般 ESM 要求 import 時寫出副檔名（例如 `"./greeting.js"`）。但 Webpack 預設會自動幫沒寫副檔名的路徑補上 `.js` 去尋找（例如 `"./greeting"` 也能找到 `greeting.js`）。請注意：這是 **Webpack 的功能，不是 ESM 的功能**。本課的範例會一律寫出副檔名以求清楚。

### 處理 HTML

我們的目標是做網站，所以得把 HTML 也納進來。但 HTML 不是 JavaScript，Webpack 沒辦法直接打包它。這時就用 `HtmlWebpackPlugin` 這個 plugin。

在 `src` 裡建立一個 `template.html`，填入一般的 HTML 骨架即可，但**不要放 `<script>` 標籤**——因為 `HtmlWebpackPlugin` 會自動把打包好的 bundle 以 `<script>` 標籤的形式注入進去，你自己再放一個就會重複了。設定好之後再跑 `npx webpack`，`dist` 裡除了 `main.js` 還會多出一個 `index.html`（它無法把兩者合成一個檔案），而且這個 `index.html` 裡已經被自動加上了一個 deferred 的 `<script>` 標籤。用瀏覽器打開它、看 console，就會看到 `Hello, Odinite!`。往後 HTML 有任何改動，重跑 Webpack 即可產生新的 `dist`。

### 載入 CSS

處理 CSS 需要**兩個** loader：

- **`css-loader`**：讀取你在 JavaScript 裡 import 的 CSS 檔，把內容轉成字串存起來。
- **`style-loader`**：拿到那個字串後，產生「把這些樣式套到頁面上」的 JavaScript 程式碼。

因為兩者分工不同，所以缺一不可。它們不是 plugin，所以設定寫在 `module.rules` 裡，用一個 rule 物件描述：`test: /\.css$/i` 表示「遇到副檔名為 `.css` 的 import」，`use: ["style-loader", "css-loader"]` 表示「就套用這兩個 loader」。

> **loader 的順序很重要！** `css-loader` 必須放在陣列**最後面**，順序不能反。因為 Webpack 執行 loader 是**從陣列尾端往前**跑：先用 `css-loader` 把 CSS 讀成字串，再用 `style-loader` 把它注入頁面。反過來就不會正常運作。

設定好後，在某個 JavaScript 檔（`src/index.js` 最合理）裡 import CSS 檔。由於我們不需要從 CSS 檔本身取得任何具名的東西（loader 會處理好一切），所以用 **side effect import（純副作用匯入）**：`import "./styles.css";`——只寫路徑、不解構任何東西。重新打包後打開 `dist/index.html`，就能看到套用樣式後的頁面。

注意這裡我們**不在 HTML 裡用 `<link>` 標籤連結 CSS**，而是把 CSS import 進 JavaScript。在真實專案裡，把 CSS 拆成多個小檔、在需要它的模組裡各自 import，往往更好維護，甚至能做到讓某段樣式只作用於某個模組、不污染全域。我們這裡只教最基本的用法，更進階的 bundler 設定能對 import 進來的 CSS 做遠比這更多的事。

### 載入圖片

如果網站要用到本機圖片檔，也需要額外設定，因為圖片同樣不是 JavaScript。依使用情境分成三種：

1. **CSS 的 `url()` 裡引用的圖片**：`css-loader` 已經幫你處理好了，不用做任何額外設定。
2. **HTML template 裡引用的圖片**（例如 `<img>` 的 `src`）：需安裝並設定 `html-loader`。它會偵測 HTML template 裡的圖片路徑並正確載入對應檔案。沒有它的話，像 `./odin.png` 這種 `src` 只會是一段純文字，打包進 `dist` 後就指不到正確的檔案了。設定方式是在 `module.rules` 加一條 `test: /\.html$/i, use: ["html-loader"]` 的 rule。
3. **JavaScript 裡使用的圖片**（例如操作 DOM 建立 `img` 元素並設定其 `src`）：需要在 `module.rules` 加一條 `type: "asset/resource"` 的 rule（這種內建的 asset 模組不用另外安裝套件）。然後在 JavaScript 裡用 default import 把圖片引入：`import odinImage from "./odin.png";`，再把 `odinImage` 拿去當 `image.src`。

第三種情境特別要理解**為什麼一定要 import**：如果你直接寫 `image.src = "./odin.png";`，那個「路徑」只是一串普通字串，Webpack 不會神奇地知道這串字對應到一個檔案，於是打包時不會把圖片納進 bundle，路徑最終也會失效。只有當你 `import` 它、並設好 `asset/resource` rule 時，Webpack 才會辨識出這個 import、在打包時把圖片檔一起帶進 `dist`，並讓 import 進來的變數在最後拿到正確的檔案路徑。

你可能會發現打包後 `dist` 裡的圖片檔名變了（通常是一串看似亂碼的英數字）。這是因為 Webpack 預設會用圖片內容做雜湊（hash）來重新命名，用意是避免瀏覽器快取（browser cache）的問題並確保檔名對得上。這是正常行為，不用去研究它怎麼運作，也不用去改它。

**你只需要設定你用得到的東西**：如果 HTML template 裡沒有本機圖片，就不用設 `html-loader`；如果 JavaScript 裡沒用到本機圖片，就不用設 `asset/resource` rule。將來若碰到需要特殊 loader 或 plugin 的東西（例如自訂字型或 CSS 預處理器），再查 Webpack 文件即可。

### Webpack dev server（開發伺服器）

每改一次程式碼就要手動跑 `npx webpack` 重新打包，是不是很煩？`webpack-dev-server` 就是為此而生。它類似 VSCode 的 Live Preview 擴充功能：每當你存檔，它就會自動幫你重新打包並刷新頁面。

它的運作方式是：在背後打包你的程式碼（就像跑 `npx webpack`，但**不會**把檔案存到 `dist`），並在每次你存了「有被納入 bundle 的檔案」時重跑一次。設定時我們在 config 物件裡加兩個屬性（順序無所謂）：

- **`devtool: "eval-source-map"`**：加上一個 **source map（原始碼對照表）**。如果不加，錯誤訊息裡的檔名與行號不會對應到你的原始碼，而是對應到那個打包後、糊成一團的單一 `.js` 檔，讓除錯變得很痛苦；在 devtools 的「Sources」分頁裡也找不到你未經加工的原始碼。加了 source map，這兩個問題都能解決——錯誤訊息與偵錯器都會指回你的開發原始碼。
- **`devServer: { watchFiles: ["./src/template.html"] }`**：`webpack-dev-server` 預設只會在「被 import 進 JS bundle 的檔案」有變動時自動重啟，所以 HTML template 會被忽略。把它加進 dev server 的監看清單即可解決。

設定好後用 `npx webpack serve` 啟動，網站預設會在 `http://localhost:8080/` 上線。

> **改了設定檔要重啟 dev server**：`webpack-dev-server` 只在啟動的當下讀取一次 Webpack 設定。若你在它執行中修改了設定檔，它不會反映那些變更。請在終端機按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 把它關掉，再重跑 `npx webpack serve` 讓新設定生效。

### 收尾：這一切值得嗎

從「幾個簡單的 HTML、CSS、JS 檔」一下子跳到「這個 loader、那個 plugin、還要一個設定檔」，確實會覺得繁瑣。但在真實世界裡，隨著應用程式變複雜，我們需要能改善開發體驗、又能在生產環境做優化的工具。即使現在還用不到全部功能，對「這類工具在背後幫我們做了什麼」有大致的理解，是很有價值的。之後的課程會用到把這些底層機制抽象掉的工具；若你用它們卻完全不知道它們在做什麼，某天真的碰到需要手動設定的情況時就會格外棘手。所以現在花點時間做手動練習是好事。

## 程式碼範例

以下是一個最小、可實際跑起來的 Webpack 專案，涵蓋 JavaScript、HTML、CSS。

**步驟一：建立專案並安裝套件**

```bash
# 建立資料夾並初始化 package.json（type=module 讓專案用 ESM 語法）
mkdir webpack-practice &&
cd webpack-practice &&
npm init -y --init-type=module

# 安裝 Webpack 本體、CLI 與開發伺服器（--save-dev 記錄為開發相依套件，簡寫 -D）
npm install --save-dev webpack webpack-cli webpack-dev-server

# 安裝處理 HTML 與 CSS 所需的 plugin 與 loader
npm install --save-dev html-webpack-plugin style-loader css-loader
```

`--save-dev` 表示這些是開發相依套件（development dependency）：我們只在開發時用 Webpack，瀏覽器實際跑的程式碼不會包含 Webpack 本身。安裝後 npm 會自動產生 `node_modules`（實際套件程式碼所在）與 `package-lock.json`（記錄更精確的套件版本資訊）。

**步驟二：建立原始碼檔案**

```javascript
// src/greeting.js
// 匯出一個具名常數
export const greeting = "Hello, Odinite!";
```

```javascript
// src/index.js（進入點）
import "./styles.css"; // side effect import：只為了套用樣式，不取用任何具名匯出
import { greeting } from "./greeting.js";

console.log(greeting);
```

```css
/* src/styles.css */
body {
  background-color: rebeccapurple;
}
```

`src/template.html` 放一般 HTML 骨架即可，**不要**自己加 `<script>` 標籤：

```html
<!-- src/template.html -->
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <title>Webpack Practice</title>
  </head>
  <body></body>
</html>
```

**步驟三：撰寫 Webpack 設定檔**

```javascript
// webpack.config.js（放在專案根目錄，不是 src 裡）
import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  mode: "development", // 開發模式，產出對除錯友善
  entry: "./src/index.js", // 進入點
  output: {
    filename: "main.js", // 輸出 bundle 的檔名
    path: path.resolve(import.meta.dirname, "dist"), // 輸出到 dist（絕對路徑）
    clean: true, // 每次打包前先清空 dist
  },
  devtool: "eval-source-map", // 加上 source map，錯誤訊息指回原始碼
  devServer: {
    watchFiles: ["./src/template.html"], // 讓 dev server 也監看 HTML template
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html", // 用這份 HTML 當樣板，自動注入 script 標籤
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i, // 遇到 .css 檔
        use: ["style-loader", "css-loader"], // 順序：css-loader 先跑（放最後）
      },
      // 若 HTML 裡有 <img>：加 { test: /\.html$/i, use: ["html-loader"] }
      // 若 JS 裡要 import 圖片：加 { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: "asset/resource" }
    ],
  },
};
```

**步驟四：打包或啟動 dev server**

```bash
npx webpack        # 打包一次，成品輸出到 dist
node dist/main.js  # 執行輸出的 bundle，會印出 Hello, Odinite!

npx webpack serve  # 啟動開發伺服器，開 http://localhost:8080/ 即時預覽
```

## 常見陷阱

!!! warning "CSS loader 順序寫反會失效"
    `use: ["style-loader", "css-loader"]` 的順序不能顛倒。Webpack 執行 loader 是**從陣列尾端往前**跑：必須先用 `css-loader` 把 CSS 讀成字串，再用 `style-loader` 注入頁面。寫成 `["css-loader", "style-loader"]` 會無法正常套用樣式。

!!! warning "在 HTML template 裡自己加 script 標籤會重複"
    `HtmlWebpackPlugin` 會自動把輸出的 bundle 以 `<script>` 標籤注入產生的 `index.html`。若你在 `src/template.html` 裡又手動放一個 `<script>`，就會載入兩次。template 裡不要放 `<script>`。

!!! warning "JS 裡的圖片路徑要用 import，不能直接寫字串"
    直接寫 `image.src = "./odin.png";` 時，那只是一串普通字串，Webpack 不會把圖片納入 bundle，打包後路徑會失效。必須 `import odinImage from "./odin.png";` 並設定 `type: "asset/resource"` rule，Webpack 才會辨識、打包該圖片，並讓變數拿到正確路徑。

!!! warning "改了 webpack.config.js 後 dev server 沒反應"
    `webpack-dev-server` 只在啟動當下讀一次設定檔。執行中修改設定不會生效。要按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 關掉再重跑 `npx webpack serve`。

!!! warning "搞混 src 與 dist，把成品也 commit 進版控"
    `dist` 是打包產物，任何人 clone 專案後重跑 Webpack 就能重建，通常不需要納入版控（常被寫進 `.gitignore`）。你只在 `src` 裡寫程式，部署時才用 `dist`。

## 練習

跟著本課的「程式碼範例」四個步驟，親手建一個 `webpack-practice` 專案，成功讓 `npx webpack` 打包出 `dist`、並用 `npx webpack serve` 看到 rebeccapurple 的頁面。接著完成以下閱讀（Assignment）：

1. 閱讀 Webpack 官方的 [Webpack concepts](https://webpack.js.org/concepts/) 頁面，建立對 entry、output、loaders、plugins、mode 這幾個核心名詞的整體理解。
2. 閱讀 [Webpack's Asset Management guide](https://webpack.js.org/guides/asset-management/)，它示範了如何處理 CSS、圖片、字型等各種資源。注意：文件範例裡用的是 `npm run build` 來打包，在那些範例的情境下，它等同於我們的 `npx webpack`（npm scripts 會在之後的課程介紹）。

> 提示：安裝套件後若看到 npm 提示有 vulnerabilities 或要跑 `npm audit fix`，在本課程情境下多半是很小眾、對你毫無實際危害的東西，可以忽略。這些提示在做高風險的生產應用時才需要認真檢視。

## 原文與延伸資源

- 原文：[Webpack](https://www.theodinproject.com/lessons/node-path-javascript-webpack)
- 本課引用：
  - [Webpack Concepts（官方文件）](https://webpack.js.org/concepts/)：entry / output / loaders / plugins / mode 的權威說明。
  - [Webpack Asset Management guide（官方文件）](https://webpack.js.org/guides/asset-management/)：處理 CSS、圖片、字型的實例。
  - [Webpack devtool 選項（官方文件）](https://webpack.js.org/configuration/devtool/)：source map 的各種設定。
  - [Tree shaking（MDN）](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)：bundler 如何靠 ESM 的 import / export 移除死程式碼。
  - [Minification（Wikipedia）](https://en.wikipedia.org/wiki/Minification_(programming))：程式碼壓縮的概念。
  - [side effect import（MDN）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_a_module_for_its_side_effects_only)：只為副作用而 import 的語法。

---

> 本講義改寫自 The Odin Project《Webpack》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
