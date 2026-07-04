---
title: 再訪 Webpack
source_url: https://www.theodinproject.com/lessons/node-path-javascript-revisiting-webpack
source_file: vendor/curriculum/javascript/organizing_your_javascript_code/revisiting_webpack.md
path: full-stack-javascript
course: JavaScript
order: 12
generated: 2026-07-03
---

# 再訪 Webpack

> 改寫自 The Odin Project：[Revisiting Webpack](https://www.theodinproject.com/lessons/node-path-javascript-revisiting-webpack)
> ｜Full Stack JavaScript › JavaScript › Organizing Your JavaScript Code

## 核心概念

上一次接觸 Webpack 時，你可能覺得那一堆 loader、plugin 與設定檔既繁瑣又看不出好處。這一課不再教你新的打包觀念，而是把重點放在「開發體驗（developer experience）」：怎麼把冗長的指令收進 npm scripts、怎麼讓 development 與 production 兩種模式自動切換、以及怎麼用 template repository 省去每次重新設定專案的痛苦。這些技巧不只適用於 Webpack，之後換用別的工具一樣受用。

### npm scripts：把指令記在專案裡

在終端機打 `npx webpack` 或 `npx webpack serve` 還不算太長，但只要指令變長就很折磨。例如把 `dist/` 部署到 GitHub Pages 的指令是 `git subtree push --prefix dist origin gh-pages`——每次部署都手打一次，遲早會打錯。

解法是在專案根目錄的 `package.json` 裡加一個 `"scripts"` 屬性。它的值是一個物件，每個項目寫成 `"名稱": "指令"`，之後就能在終端機用 `npm run <名稱>` 執行：

```json
{
  "scripts": {
    "build": "webpack",
    "dev": "webpack serve",
    "deploy": "git subtree push --prefix dist origin gh-pages"
  }
}
```

這樣一來，`npm run build` 等同於 `npx webpack`、`npm run dev` 等同於 `npx webpack serve`、`npm run deploy` 則會跑那串又臭又長的部署指令。好處有兩個：一是省去重打長指令的力氣，二是替指令取了有意義又相對標準化的名字。慣例上，`build` 常拿來放「建置／打包／編譯」的指令，`dev` 常拿來啟動開發伺服器（dev server）。名字不一定人人相同，但至少比 `npx webpack` 更能說明它在做什麼。

**為什麼在 script 裡可以省掉 `npx`？** 因為 `npx` 的作用是「在終端機直接執行一個安裝在 `node_modules/.bin` 裡（或尚未安裝）的套件執行檔」。而 npm 在跑 script 時，會自動把專案本地的 `node_modules/.bin` 加進 `PATH`，所以 script 內部本來就找得到 `webpack` 這個執行檔，不必再借助 `npx`。這也是為什麼上面範例把 `"build"` 寫成 `"webpack"` 而不是 `"npx webpack"`。

**script 名稱分兩類。** 少數名稱是 npm 預先保留的「生命週期（lifecycle）」腳本，例如 `start`、`test`、`install`。這些可以直接用 `npm start`、`npm test` 執行，不必加 `run`（雖然加了也能跑）。其餘自訂名稱一律要用 `npm run <名稱>`。所以你會看到 `npm start` 與 `npm run build` 這兩種寫法並存，前者是保留名稱、後者是自訂名稱。

**pre 與 post 前後鉤子。** npm 還有一個好用機制：任何一個名為 `foo` 的 script，如果同時存在 `prefoo` 與 `postfoo`，npm 會在跑 `foo` 之前自動先跑 `prefoo`、跑完之後自動接著跑 `postfoo`，你不必手動串接。例如：

```json
{
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "webpack --config webpack.prod.js",
    "postbuild": "echo 建置完成"
  }
}
```

只要執行 `npm run build`，npm 會依序跑 `prebuild` → `build` → `postbuild`。這對「打包前先清空舊輸出」這類前置工作很方便。這是進階用法，現階段知道有這回事即可，不必馬上套用。

### Webpack 的兩種 mode

到目前為止，我們都把 Webpack 開在 development mode（開發模式），這對「正在寫程式」的階段最合適。但當專案要正式上線、要建置給使用者用時，就該切到專門的 production mode（生產模式），它會替我們做一些不同的最佳化（optimization）。

你可以親手試一次：打開 Restaurant Page 專案，把 `webpack.config.js` 裡的 `mode` 改成 `"production"`，重新跑一次 build 指令，再去看 `dist/` 裡的 JavaScript bundle——會看到比之前更難辨識、擠成一團的字元。這是因為 production mode 會自動做 minification（最小化，把變數改短名、刪空白與註解）、tree shaking（搖樹，移除沒被用到的程式碼）等最佳化，讓輸出檔更小、載入更快。

我們**不需要**知道 production mode 到底做了哪些最佳化的細節，也不必背下它的內部行為。重要的是意識到「有這兩種模式、各自為不同目的而設計」這件事：

- **development mode**：不做壓縮，保留可讀性；搭配較完整的 source map，讓你在瀏覽器 DevTools 裡對照到原始碼、方便除錯；通常配合 dev server 使用，改檔即時重載。
- **production mode**：自動壓縮與最佳化，輸出體積最小的 bundle，適合部署。

### 用多份設定檔切換模式

問題來了：如果每次要打包就得手動把 `mode` 改成 `"production"`，要回去用 dev server 又得改回 `"development"`，很容易改到一半忘記、或忘了改回來。

比較好的做法是**準備兩份設定檔**，例如 `webpack.dev.js` 與 `webpack.prod.js`，然後讓 npm scripts 各自指定要用哪一份。Webpack 用 `--config` 這個選項來指定設定檔；如果不寫 `--config`，Webpack 預設會去找名為 `webpack.config.js` 的檔案：

```json
{
  "scripts": {
    "build": "webpack --config webpack.prod.js",
    "dev": "webpack serve --config webpack.dev.js"
  }
}
```

設定一次之後就能一勞永逸：`npm run build` 永遠用 production 設定、`npm run dev` 永遠用 development 設定，你再也不用手動改 `mode`。

### webpack-merge：消除設定檔的重複

拆成兩份設定檔會冒出新問題：`webpack.dev.js` 與 `webpack.prod.js` 之間，有一大堆內容是**共用**的——像 `entry`（進入點）、`output`（輸出設定）、那些處理 CSS 或圖片的 loader、`HtmlWebpackPlugin` 等 plugin。若把這些同樣的東西在兩份檔案各抄一次，一旦要改就得改兩處，容易漏改、不符合 DRY（Don't Repeat Yourself，不要重複自己）原則。

官方推薦的解法是 `webpack-merge` 這個小工具，搭配「三份設定檔」的架構：

- `webpack.common.js`：放兩種環境都共用的設定。
- `webpack.dev.js`：只放 development 專屬設定，再用 merge 合併 common。
- `webpack.prod.js`：只放 production 專屬設定，再用 merge 合併 common。

`webpack-merge` 的核心是它匯出的 `merge()` 函式：它接收多個設定物件，把它們深層合併（deep merge）成一個。共用的部分只需在 `webpack.common.js` 寫一次，各環境檔只補上自己不同的地方。要先安裝它：

```bash
npm install --save-dev webpack-merge
```

架構長這樣（實際檔案內容見下一節）：

```text
專案根目錄
├── webpack.common.js   ← 共用設定
├── webpack.dev.js      ← development 專屬 + merge(common)
├── webpack.prod.js     ← production 專屬 + merge(common)
├── package.json
└── src/
```

搭配前面的 npm scripts，`npm run build` 會讀 `webpack.prod.js`（它內部 merge 了 common、且 `mode: 'production'`），`npm run dev` 會讀 `webpack.dev.js`（merge 了 common、且 `mode: 'development'`）。設定一次，之後就能忘記模式切換這件事。

### Template repositories：省去每次重建設定

你大概已經發現，設定 Webpack 要牽涉好幾個檔案與目錄、還有不少設定內容。每開一個新專案，往往得翻出上一個專案、把設定複製貼上過來。這很繁瑣，也容易漏東漏西。

GitHub 的 **template repository（範本儲存庫）** 正是為此而生。你在 GitHub 新建 repository 時，頁面上方本來就有一個 `Repository template` 的下拉選單——那裡列出的就是可用的範本。

把任一個現有 repository 變成範本非常簡單：進入該 repository 的 **Settings**（設定）頁，在最上方（就在改名欄位底下）勾選 **Template repository** 這個核取方塊，這樣就完成了。之後新建 repository 時，就能在 `Repository template` 下拉選單選它。選了範本，你的新 repository 就會是那個範本的一份拷貝，而不是空的。

**從範本產生（generate） vs. fork（分叉）有什麼不同？** 兩者都會複製檔案，但關係不同：

- **fork** 會和原始 repository 保持關聯的 commit 歷史，因此可以在 fork 與上游之間發 pull request、互相合併——適合「參與貢獻」的協作情境。
- **從範本產生** 出來的新 repository 有**全新、互不相關的歷史（unrelated histories）**，因此無法在它和範本之間發 pull request 或合併——這正是我們要的：一個乾淨、獨立的起點，用來開新專案。

你不必一開始就想清楚範本要放什麼。當你發現自己一再重複同一套設定時，就把那套設定整理成一個新 repository、勾成範本，日後再視需要更新它。之後開新專案直接選這個範本，就能省下重建設定的時間，更快進入真正要做的功能開發。

## 程式碼範例

以下是官方 Production 指南示範的三份設定檔，示範如何用 `webpack-merge` 拆分。程式碼採用 ES module 語法（`import` / `export default`），對應 `package.json` 裡設定了 `"type": "module"` 的專案。

`webpack.common.js`（共用設定）：

```javascript
// webpack.common.js — 兩種環境都會用到的共用設定
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

// 在 ES module 中沒有 __dirname，需要自己算出來
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: {
    app: './src/index.js', // 進入點
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App', // 自動產生 index.html 並注入 bundle
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // 每次建置前自動清空 dist/
  },
};
```

`webpack.dev.js`（development 專屬，合併 common）：

```javascript
// webpack.dev.js — 開發用設定
import { merge } from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map', // 內嵌 source map，方便在 DevTools 對照原始碼
  devServer: {
    static: './dist', // dev server 從 dist 提供靜態檔
  },
});
```

`webpack.prod.js`（production 專屬，合併 common）：

```javascript
// webpack.prod.js — 上線用設定
import { merge } from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
  mode: 'production',
  devtool: 'source-map', // 產生獨立 source map 檔，體積較小
});
```

`package.json`（把三份設定檔接上 npm scripts）：

```json
{
  "scripts": {
    "start": "webpack serve --open --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
  }
}
```

執行方式：`npm start` 會用 development 設定啟動 dev server 並自動開瀏覽器；`npm run build` 會用 production 設定產出最佳化後的 bundle 到 `dist/`。注意 dev、prod 兩份檔各自只寫一次差異，共用部分完全不重複。

## 常見陷阱

!!! warning "自訂 script 忘了加 `run`"
    只有 `start`、`test`、`stop`、`restart` 這幾個 npm 保留的生命週期名稱能直接用 `npm start`、`npm test` 執行。你自己取的名字（例如 `build`、`dev`、`deploy`）一定要用 `npm run build`、`npm run dev`。打成 `npm build` 會得到錯誤，因為 npm 沒有內建 `build` 這個子命令。

!!! warning "在 script 裡多寫了 `npx`"
    npm 跑 script 時會自動把本地 `node_modules/.bin` 加入 `PATH`，所以 script 內直接寫 `webpack` 即可，不用寫成 `npx webpack`。多寫 `npx` 雖然多半仍能跑，但屬於多餘；記得只有「直接在終端機」執行本地執行檔時才需要 `npx`。

!!! warning "拆了設定檔卻兩邊各抄一份共用設定"
    拆成 dev/prod 兩份的目的是切換模式，但若把 `entry`、`output`、loader 等共用內容在兩份都貼一次，就違反 DRY，改一處要記得改兩處。正確做法是抽出 `webpack.common.js`，用 `webpack-merge` 的 `merge()` 合併，共用設定只寫一次。

!!! warning "把 template 當成 fork 來用"
    從 template 產生的 repository 有「互不相關的歷史」，無法和範本之間發 pull request 或合併。範本的用途是「開一個乾淨的新專案起點」，不是用來對上游貢獻程式碼。若你要的是能回饋原專案的關聯歷史，那要用 fork 而不是 template。

## 練習

1. 讀一篇關於 npm scripts 的補充文章（原文連結：[package.json scripts](https://web.archive.org/web/20260412172112/https://dyte.io/blog/package-json-scripts/)）。它談得比你近期會用到的更深入，例如 `pre`/`post` 前後鉤子、生命週期腳本、以及直接寫 shell 指令等，先讀過、對「這些工具能做到哪些事」有概念即可，不必全部背下來。
2. 讀完 Webpack 官方的 [Production 指南](https://webpack.js.org/guides/production/)，跟著它把設定檔用 `webpack-merge` 拆成 `webpack.common.js`、`webpack.dev.js`、`webpack.prod.js`。指南裡的範例是接續它更長教學的前段而來，但關於 `webpack-merge` 與拆分設定檔的主要段落，用一個新專案（或直接改造你的 Restaurant Page 專案）也能跟著做。
   - 可以略過指南裡「Specify the Mode」那一節與其範例。
3. 把你常用的一套 Webpack 設定整理成一個 repository，到它的 Settings 勾選 **Template repository**，再試著用這個範本 generate 一個新 repository，體會省下重建設定的感覺。

## 原文與延伸資源

- 原文：[Revisiting Webpack](https://www.theodinproject.com/lessons/node-path-javascript-revisiting-webpack)
- 本課引用：
    - [Webpack — Production 指南（webpack-merge 拆分設定檔）](https://webpack.js.org/guides/production/)
    - [GitHub Docs — Creating a template repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository)
    - [dyte — package.json scripts 補充文章](https://web.archive.org/web/20260412172112/https://dyte.io/blog/package-json-scripts/)

---

> 本講義改寫自 The Odin Project《Revisiting Webpack》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
