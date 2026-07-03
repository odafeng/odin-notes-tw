---
title: 建置 React 開發環境
source_url: https://www.theodinproject.com/lessons/node-path-react-new-setting-up-a-react-environment
source_file: vendor/curriculum/react/introduction/setting_up_a_react_environment.md
path: full-stack-javascript
course: React
order: 3
status: draft
generated: 2026-07-03
---

# 建置 React 開發環境

> 改寫自 The Odin Project：[Setting Up A React Environment](https://www.theodinproject.com/lessons/node-path-react-new-setting-up-a-react-environment)
> ｜Full Stack JavaScript › React › Introduction

## 核心概念

你已經知道 React 是「什麼」，也大概知道「在哪裡」會用到它。現在該來搞清楚「怎麼開始」了。這一課要處理的問題很實際：如何在自己的電腦上建立一個全新的 React 專案，並認識幾個能讓開發過程順暢許多的工具。

### 開始 React 專案有很多條路

把 React 放進專案裡的方法不只一種。最簡單的做法，是用幾個 `<script>` 標籤，從 CDN（Content Delivery Network，內容傳遞網路）直接載入 React 函式庫；最複雜的做法，則是採用高度可設定、能支撐大型專案的 toolchain（工具鏈）或 framework（框架）。常見的選項包括：

- **Vite** 的 React 範本（本課採用）
- **Next.js**（一套建立在 React 之上、功能完整的 framework）
- **Gatsby**（適合內容導向的靜態網站）
- **Create React App（CRA）**（已於 2023 年初被官方棄用）

為什麼需要這些 toolchain？我們不能自己動手兜一套嗎？可以，但是很難。React 底層有許多互相牽動的環節，在你能寫下第一行有實際功能的程式碼之前，至少得先自己設定好以下這些：

- **套件管理（Package Management）**：例如 npm 或 Yarn，負責安裝與管理相依套件。
- **模組打包（Module Bundling）**：例如 Webpack 或 Parcel，把分散的模組整合成瀏覽器能載入的檔案。
- **編譯（Compilation）**：例如 Babel，把 JSX 與新版 JavaScript 語法轉換成瀏覽器看得懂的舊語法。
- **React 本身**。

這些只是最基本的，實務上往往還需要更多設定。全部自己來，光是把環境架起來就足以耗掉大量時間，這也正是 toolchain 存在的價值：它們把這些繁瑣設定預先打包好，讓你能直接進入「寫功能」的階段。

!!! note "關於 Create React App"
    CRA 從 2016 年推出後，長年是官方建立 React 專案的標準方式，因此你會在很多舊教學裡看到它。但基於多項理由，CRA 已在 2023 年初被官方棄用，不再建議用於新專案。看到它時知道那是什麼即可，實作上請改用 Vite 這類現代工具。

### 為什麼選 Vite

理解了「從零開始」有多麻煩之後，你可以鬆一口氣了：現在只要**一行終端機指令**就能起步。本課使用 Vite 官方的 React 範本來 scaffold（鷹架式產生）專案，效果就像我們自己準備好一個範本倉庫再套用一樣。

Vite 是專為前端開發者打造的建置工具，底層採用較新的技術，帶來很好的開發體驗，同時對 React 生態系有完整支援。它需要的設定極少，開箱就附帶許多實用工具，讓你把注意力放在學 React 本身，而不是跟環境設定纏鬥。

實際開發時，Vite 最有感的兩項能力是：其一，它內建一個開發伺服器（dev server），你改動程式碼並存檔後，瀏覽器畫面幾乎是即時更新，這靠的是 HMR（Hot Module Replacement，模組熱替換）——它只替換有變動的模組，而不重新整理整個頁面，因此連元件當下的 state（狀態）都能盡量保留。其二，當你要把成品發佈上線時，Vite 會幫你把程式碼打包（build）成經過最佳化、體積更小的靜態檔案。換句話說，開發階段追求「快」，發佈階段追求「省」，兩種需求 Vite 都替你處理好了。

### 建立你的第一個 React app

動手前請先確認你安裝的是最新的 **LTS（Long Term Support，長期支援）版 Node**，否則過程中可能出現各種錯誤。接著打開終端機，切換到你平常放專案的資料夾，執行建立指令（下一節有完整範例）。指令跑完後，Vite 的開發伺服器會在本機的某個連接埠（預設是 5173）啟動，你在瀏覽器打開 `localhost:5173` 就能看到 Vite React 範本的預設首頁。看到它，代表你的第一個 React app 已經成功跑起來了。

之後你可以用 <kbd>Ctrl</kbd> + <kbd>C</kbd> 停掉開發伺服器，用 `cd` 進到專案資料夾；任何時候只要在專案目錄裡執行 `npm run dev`，就能重新啟動開發伺服器。

如果想把本機專案接到 GitHub，先在 GitHub 上開一個**空的**新倉庫，再照倉庫頁面上的指示把本機專案連上去即可。

### 深入看看專案結構

打開新專案，你會看到幾個資料夾，以及 `package.json`、`package-lock.json`、`.gitignore`、`README.md` 等檔案。`README.md` 裡有一些有用的說明，值得先花點時間快速讀過。

- **`public` 資料夾**：放所有跟 app 相關的靜態資源（static assets），例如圖片、圖示，或給瀏覽器讀的資訊檔。
- **`src` 資料夾**：放實際驅動 app 的程式碼。其中 `main.jsx` 是整個應用程式的進入點（entry point）。
- **`package.json`**：記錄專案名稱、相依套件清單，以及像 `npm run dev` 這類可執行的 script（指令腳本）；`package-lock.json` 則鎖定每個相依套件的確切版本，確保不同機器裝出來的環境一致。
- **`node_modules` 資料夾**：執行安裝指令後才會出現，裡面是所有相依套件的實際檔案。它體積龐大且可自動重建，所以已被 `.gitignore` 排除，不會（也不該）被提交進 git。

`main.jsx` 裡發生的事，簡單來說是這幾步：從 `react` 與 `react-dom` 分別匯入 `StrictMode` 與 `createRoot`；匯入 `App` component（元件），這樣才能把它 render（渲染）到 DOM 裡；匯入一些 CSS 樣式；用 `index.html` 裡的某個元素呼叫 `createRoot`，建立一個 `root` 物件；最後呼叫掛在 `root` 上的 `render` 方法，把 `App` 畫到畫面上。這裡有兩個名詞先有個印象就好：`StrictMode` 是 React 提供的一個開發輔助工具，它會在開發階段對可能的問題提出額外警告，不影響正式版行為；而 `render` 括號裡那段看起來像 HTML、卻寫在 JavaScript 檔裡的語法，叫做 JSX，是 React 描述畫面的方式，後面的課程會專門講解。這些現在看不懂完全沒關係，隨著課程推進，你會清楚知道每一行在做什麼。

### 開發者工具（Developer Tools）

隨著專案變大、component 變多、功能變複雜，你會需要一種方式來觀察（並即時修改）app 內部那些不斷變動的部分，以便理解與 debug（除錯）自己的程式。為此，我們可以安裝瀏覽器擴充套件 **React Developer Tools**。它讓你直接在瀏覽器裡檢視 component 樹、props（屬性）與 state（狀態），是有效率地開發 React 時不可或缺的工具。建議你盡早安裝並習慣使用它。

## 程式碼範例

用 Vite 建立專案的指令（可把 `my-first-react-app` 換成任何你想要的名稱）：

```bash
# 用 Vite 官方 React 範本建立新專案
npm create vite@latest my-first-react-app -- --template react
```

過程中若被詢問是否要安裝 `create-vite` 套件，輸入 `y` 再按 <kbd>Enter</kbd> 接受；若問到是否使用實驗性功能，一律回答 no；最後對 `Install with npm and start now?` 回答 yes 即可。指令執行完成後，終端機會輸出類似這樣的內容：

```bash
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

如果你已經先在 GitHub 建好倉庫並 clone 到本機，可以先 `cd` 進 clone 下來的資料夾，再用 `.`（當前目錄）作為專案名稱來執行，讓 Vite 直接在現有目錄建立專案，而不是另開新資料夾：

```bash
# 在「已 clone 的當前目錄」建立專案，沿用既有的 git 設定與遠端連線
npm create vite@latest . -- --template react
```

這是 Vite 產生的 `src/main.jsx` 進入點檔案，示範 React app 如何掛載到頁面：

```jsx
// src/main.jsx — 應用程式進入點
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// 取得 index.html 裡 id 為 root 的元素，建立 React 的根節點，
// 再把 App component 包在 StrictMode 裡 render 出來。
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## 常見陷阱

!!! warning "Node 版本過舊會導致安裝失敗"
    Vite 依賴較新的 Node 功能。若你的 Node 不是最新的 LTS 版本，執行 `npm create vite@latest` 時很可能出現難以理解的錯誤。動手前先用 `node -v` 確認版本，必要時透過 nvm 這類版本管理工具升級。

!!! warning "指令裡的 `--` 不能省略"
    指令 `npm create vite@latest my-first-react-app -- --template react` 中間那組獨立的 `--` 是用來把後面的參數（`--template react`）傳給 `create-vite`，而不是傳給 `npm` 本身。漏掉它，範本參數就不會生效，你可能拿到一個非 React 的空專案。

!!! warning "別再為新專案選用 Create React App"
    很多舊教學仍以 CRA 開頭，但它已被官方棄用，不再維護。跟著那些教學做，容易踩到相依套件過時或安全性警告等問題。看到 CRA 時知道它是什麼即可，新專案一律改用 Vite。

## 練習

1. 快速讀過 Vite 的官方 Getting Started 指南，把本課的內容再複習一遍，並留意 Vite 提供了哪些指令與設定選項。
2. 找一份 React Developer Tools 的使用指南，開始學習如何操作這個擴充套件（現在看不懂某些細節沒關係，先建立整體印象）。
3. 動手整理你的 `my-first-react-app` 專案，讓它不再顯示 Vite 的預設頁面。試著改成畫面上只顯示一句「Hello, World!」。做法提示：打開 `src/App.jsx`，把裡面回傳的 JSX 換成你自己的內容，同時清掉不需要的 import 與 CSS。
4. （對應原文 project）本課無獨立的 project 作業，完成上述整理即可。若想延伸，可把成果 commit 並推到你的 GitHub 倉庫。

## 原文與延伸資源

- 原文：[Setting Up A React Environment](https://www.theodinproject.com/lessons/node-path-react-new-setting-up-a-react-environment)
- 本課引用：
  - [Vite 官方網站與 Getting Started 指南](https://vitejs.dev/guide/)
  - [Next.js 官方網站](https://nextjs.org/)
  - [Gatsby 官方網站](https://www.gatsbyjs.com/)
  - [Create React App（已棄用）](https://create-react-app.dev/)
  - [React Developer Tools（Chrome 擴充套件）](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
  - [React Developer Tools 使用指南（DebugBear）](https://www.debugbear.com/blog/react-devtools)

---

> 本講義改寫自 The Odin Project《Setting Up A React Environment》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
