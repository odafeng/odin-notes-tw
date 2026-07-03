---
title: npm
source_url: https://www.theodinproject.com/lessons/node-path-javascript-npm
source_file: vendor/curriculum/javascript/organizing_your_javascript_code/npm.md
path: full-stack-javascript
course: JavaScript
order: 9
status: draft
generated: 2026-07-03
---

# npm

> 改寫自 The Odin Project：[npm](https://www.theodinproject.com/lessons/node-path-javascript-npm)
> ｜Full Stack JavaScript › JavaScript › Organizing Your JavaScript Code

## 核心概念

### 為什麼需要 package manager（套件管理器）

在前一課，我們學了 ES6 modules（模組）與 `import` / `export` 的語法，用來在自己寫的檔案之間互相引用東西。但當應用程式越來越大、越來越複雜，我們不會想要「所有東西都自己寫」。很多功能別人早就寫好、測試過、也維護得很好了，例如日期處理、資料驗證、UI 元件，甚至整個框架（framework）。與其重造輪子，不如直接把這些第三方（third party）程式碼引進來用。

問題是：這些別人寫的程式碼放在哪裡？怎麼找？怎麼下載到專案裡？版本更新了怎麼辦？如果一個套件又依賴另外十個套件，難道要手動一個一個抓嗎？這正是 **package manager（套件管理器）** 要解決的事，而 JavaScript 生態系裡最主流的就是 **npm**。

### npm 是什麼

**npm**（注意，全部小寫，不要大寫）同時是兩樣東西：

1. **一個巨大的線上倉庫（registry）**：上面存放了數以百萬計的 plugins、libraries（函式庫）與工具，這些可安裝、可重複使用的程式碼單元統稱為 **package（套件）**。
2. **一個命令列工具（command-line tool）**：也就是你在終端機打的 `npm` 指令，用它把 registry 上的 package 下載安裝到你的專案裡。

安裝之後，套件的程式碼會存在你本機的專案資料夾中，接著就能像引用自己的檔案一樣，用 `import` 把它們引進來使用。你甚至也可以反過來，把自己寫的程式碼**發佈（publish）**到 npm 上，讓全世界的人安裝使用。

你可能還記得在 Foundations 課程裡曾經安裝過 npm，用來安裝 Jest 測試框架來做 JavaScript 練習。有個有趣的冷知識：雖然大家常說 npm 是「Node Package Manager」的縮寫，但[官方其實表示 npm 並不是這個縮寫](https://www.npmjs.com/package/npm)。它就是 npm，不必糾結字面意思。

如果你走的是 Full Stack Ruby on Rails 路線，可能已經接觸過另一個 JavaScript 套件管理器 **Yarn**。兩者概念相同、目標一致，本課程統一使用 npm。

### package.json：專案的身分證

npm 的一切都圍繞著一個叫 `package.json` 的檔案運作。它是一個 JSON 檔，記錄了專案的各種資訊，例如專案名稱、版本號、描述，以及最重要的——這個專案**依賴（depend on）** 了哪些套件、各自需要哪個版本。

有了這個檔案，npm 就能做很多自動化的事：

- 讀取檔案裡列出的 **dependencies（依賴套件）**，一次把它們全部（連同它們各自的依賴）用正確的版本裝好。
- 執行你在裡面設定好的 **npm scripts（npm 腳本）**，例如啟動、建置、測試指令（scripts 會在後面的課程細講）。

關鍵在於：專案的原始碼倉庫（repository）本身**不需要**把套件的程式碼一起存進去。只要有 `package.json`，任何人把專案 clone 下來後，執行一句 `npm install`，npm 就會照著清單把所有依賴自動抓下來。這讓專案本身保持輕巧，也讓「換一台電腦、換一個人」都能重現一模一樣的環境。

### 兩個必填欄位：name 與 version

要產生一個 `package.json`，不必手動從零打字。在專案資料夾裡執行：

- `npm init`：進入互動式問答，一題一題填入專案資訊。
- `npm init -y`（`-y` 是 `--yes` 的簡寫）：跳過問答，直接用預設值產生一份 `package.json`，之後再手動編輯。

一份 `package.json` 至少要有兩個**必填欄位**：

- **`name`**：專案 / 套件名稱。必須全部小寫、不能有空白；允許使用連字號 `-`、底線 `_` 與點 `.`。
- **`version`**：版本號，格式為 `x.x.x`，並且遵守 **semantic versioning（語意化版本，簡稱 semver）** 規則——三段數字分別代表 major.minor.patch（主版本.次版本.修訂版本）。

其他常見欄位還有 `description`（描述）、`main`（程式進入點）、`scripts`（可執行的指令）、`author`（作者）、`license`（授權條款）等，多數並非必填。

### dependencies 與 devDependencies

安裝套件時，npm 會把它記錄到 `package.json` 的兩個不同區塊：

- **`dependencies`**：正式的執行期依賴。也就是應用程式**真正上線給使用者運作時**也需要用到的套件（例如一個日期格式化函式庫）。指令：`npm install <套件名>`。
- **`devDependencies`（開發依賴）**：只在**開發過程中**才用得到、最終交付給使用者的產品裡**不需要**的套件。典型例子就是 Jest 這類測試框架、或程式碼檢查工具（linter）——使用者執行 app 時根本用不到它們。指令：`npm install <套件名> --save-dev`（`--save-dev` 可簡寫成 `-D`）。

區分兩者的好處是：當別人只想在正式環境安裝、不需要開發工具時，可以只裝 `dependencies`，省下時間與空間。

### node_modules 與 package-lock.json

執行 `npm install <套件名>` 後，npm 會在專案資料夾裡建立一個 **`node_modules`** 資料夾（若還不存在），並把套件的程式碼下載到裡面。你可以打開這個資料夾，會看到每個安裝過的套件各佔一個子資料夾。

`node_modules` 通常**很巨大**（因為它把所有依賴、以及依賴的依賴都攤平放進去），所以慣例上**不會**把它上傳到 Git，而是加進 `.gitignore` 忽略掉。反正別人 clone 後再 `npm install` 就能重建。

此外，npm 還會自動產生一個 `package-lock.json`。`package.json` 記的是「可接受的版本範圍」（例如 `^0.12.1` 代表相容範圍內的更新都可以），而 `package-lock.json` 則精確鎖定「這次實際裝了哪個確切版本」，確保團隊每個人裝到的版本完全一致。這個檔案**應該**要提交到 Git。

### 隨著專案成長：從 npm 到 bundler（打包工具）

當應用程式越變越大，需要的檔案越來越多（不論是自己寫的，還是安裝進來的套件），管理這一堆依賴會變得棘手——尤其在套件更新時。更麻煩的是，我們最終可能要把**一大堆** JavaScript 檔案送到瀏覽器下載，效能會受影響。

下一課會介紹 **bundler（打包工具）**：它讓我們能用「多個好維護的小檔案」來寫程式，再由工具把它們**打包（bundle）** 成少數幾個較小的檔案，最後送給瀏覽器。屆時我們會實際用一個叫 **Webpack** 的套件，親眼看到 npm 在安裝、更新套件時如何自動維護 `package.json`。

## 程式碼範例

下面用一個最小流程，把本課的概念串起來。假設我們要做一個新專案，並安裝知名的日期函式庫 `dayjs`。

```bash
# 1. 建立並進入專案資料夾
mkdir my-app
cd my-app

# 2. 產生 package.json（-y 用預設值，之後可手動編輯）
npm init -y

# 3. 安裝一個正式依賴（會記進 dependencies）
npm install dayjs

# 4. 安裝一個開發依賴（會記進 devDependencies）
npm install jest --save-dev
```

執行完後產生的 `package.json` 大致如下：

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "jest"
  },
  "license": "ISC",
  "dependencies": {
    "dayjs": "^1.11.10"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

接著就能在自己的檔案裡 `import` 安裝好的套件（此範例假設專案使用 ES modules）：

```javascript
// index.js
// 從 node_modules 引入剛剛安裝的 dayjs 套件
import dayjs from "dayjs";

// 使用套件提供的功能，格式化目前時間
const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
console.log(`現在時間：${now}`);
```

若把這個專案交給別人，對方**不需要**拿到你的 `node_modules`。他只要有 `package.json`，執行一句指令就能還原所有依賴：

```bash
# 讀取 package.json，把 dependencies 與 devDependencies 全部裝回來
npm install
```

## 常見陷阱

!!! warning "把 node_modules 提交進 Git"
    `node_modules` 資料夾往往有數萬個檔案、體積龐大，且完全可以由 `npm install` 自動重建。請把它加進 `.gitignore`，**不要**提交到版本控制。真正要提交的是 `package.json` 與 `package-lock.json`——前者列出需要哪些套件，後者鎖定確切版本，兩者一起才能讓別人重現一模一樣的環境。

!!! warning "分不清 dependencies 與 devDependencies"
    只有「使用者實際執行 app 時也需要」的套件才該放進 `dependencies`；像 Jest、linter 這類**只在開發階段用**的工具，要用 `--save-dev` 裝成 `devDependencies`。放錯區塊雖然本機看起來還是能跑，但會讓正式環境安裝到不必要的套件，拖慢部署、也讓依賴關係失去意義。

!!! warning "以為 npm 就是 Node.js"
    npm 是**套件管理器**（一個 registry 加一個命令列工具），Node.js 是 **JavaScript 執行環境**。兩者常常一起安裝，但概念上是不同的東西。另外，`npm` 請一律小寫書寫。

## 練習

以下把原文 Assignment 改寫成繁中步驟：

1. 進一步閱讀 npm、package 與 dependency 的觀念：
   1. 讀 [Installing packages with npm（用 npm 安裝套件）](https://docs.npmjs.com/downloading-and-installing-packages-locally)，理解 `npm install <套件名>` 與 `node_modules` 的運作。
   2. 讀 [package.json 檔案說明](https://docs.npmjs.com/creating-a-package-json-file)，這個檔案儲存了應用程式的大部分資訊；留意 `npm init` / `npm init -y` 以及 `name`、`version` 兩個必填欄位。
   3. 我們安裝的套件都叫「dependencies（依賴）」，但若某些套件**只在開發過程中使用**、其程式碼不會出現在給使用者的正式 app 裡（例如 Jest 測試框架），就稱為 [development dependencies（開發依賴）](https://dev.to/mshertzberg/demystifying-devdependencies-and-dependencies-5ege)。
2. 讀這篇很棒的歷史回顧：[Modern JavaScript Explained for Dinosaurs（給恐龍看的現代 JavaScript）](https://peterxjang.com/blog/modern-javascript-explained-for-dinosaurs.html)，它講述了 JavaScript 如何一步步演進到跨多檔案管理套件。**只需要讀到「Using a JavaScript module bundler (webpack)」為止**，bundler 與 webpack 會在下一課處理。

## 原文與延伸資源

- 原文：[npm](https://www.theodinproject.com/lessons/node-path-javascript-npm)
- 本課引用：
  - [Downloading and installing packages locally（npm 官方文件）](https://docs.npmjs.com/downloading-and-installing-packages-locally)
  - [Creating a package.json file（npm 官方文件）](https://docs.npmjs.com/creating-a-package-json-file)
  - [Demystifying devDependencies and dependencies](https://dev.to/mshertzberg/demystifying-devdependencies-and-dependencies-5ege)
  - [Modern JavaScript Explained for Dinosaurs](https://peterxjang.com/blog/modern-javascript-explained-for-dinosaurs.html)

---

> 本講義改寫自 The Odin Project《npm》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
