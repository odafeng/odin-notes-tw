---
title: 專案：餐廳頁面
source_url: https://www.theodinproject.com/lessons/node-path-javascript-restaurant-page
source_file: vendor/curriculum/javascript/organizing_your_javascript_code/project_restaurant_page.md
path: full-stack-javascript
course: JavaScript
order: 11
generated: 2026-07-03
---

# 專案：餐廳頁面

> 改寫自 The Odin Project：[Project: Restaurant Page](https://www.theodinproject.com/lessons/node-path-javascript-restaurant-page)
> ｜Full Stack JavaScript › JavaScript › Organizing Your JavaScript Code

## 核心概念

這個專案要做一個餐廳的首頁，但重點不在餐廳長得多漂亮，而在於**整個網頁的內容完全用 JavaScript 動態產生**。也就是說，除了一個幾乎空白的 HTML 骨架之外，畫面上看得到的東西（標題、圖片、介紹文字、各個分頁）都是靠 JS 在頁面載入後用 DOM（Document Object Model，文件物件模型）建立出來的。

這一課把前面學到的三件事綁在一起實戰：

- **webpack** 打包工具：用 module（模組）拆分程式碼、用 template.html 產生輸出的 HTML。
- **ES6 modules**：把每個分頁的內容各自寫成一個模組，`export` 一個建立內容的函式。
- **DOM manipulation（DOM 操作）**：用 JavaScript 建立、設定、插入元素。

> 補充：DOM 元素必須用 JavaScript 建立，但**樣式（styling）可以寫在獨立的 CSS 檔**。你不需要用 JS 去設定每一條 CSS 規則，只要用 JS 建立元素、掛上 class，再讓 CSS 檔負責外觀即可。

### 專案目標：用 JS 生成整頁內容

一般寫網頁時，內容直接寫在 HTML 裡。這個專案反過來——HTML 只保留最外層的容器，其餘全部由 JS 產生。這樣做的訓練意義是：

- 逼你熟練 `document.createElement`、`textContent`、`classList`、`append` 這一整套建立畫面的流程。
- 為之後用框架（例如 React）做準備。框架的核心思想就是「用 JavaScript 描述畫面」，這個專案是在沒有框架的情況下手動體驗一次。

### HTML 骨架與 `div#content`

專案的 HTML 骨架（放在 `src/template.html`）只需要兩樣東西：

- 一個 `<header>`，裡面放一個 `<nav>`，nav 裡是幾個**按鈕（button，不是連結 link）**，代表不同分頁，例如「首頁」「菜單」「聯絡我們」。用 button 而不是 `<a>`，是因為我們要靠 JS 的 click 事件切換分頁，而不是真的跳到另一個網址。
- header 底下一個**空的** `<div id="content">`。這個 div 是所有動態內容的「舞台」，每次切換分頁就是清空它再重新填入。

### 每個分頁 = 一個模組

tabbed browsing（分頁瀏覽）的做法是把每個分頁的內容**各自封裝成一個模組**：

- `home.js` `export` 一個 `loadHome()`，菜單頁 `menu.js` `export` 一個 `loadMenu()`，以此類推。
- 每個函式負責建立自己那一頁的 DOM 元素、掛上樣式，然後 `append` 到 `div#content`（或回傳一個 div 讓 `index.js` 去掛）。
- `index.js` 只做兩件事：頁面首次載入時呼叫預設分頁（首頁）的函式；替 header 裡每個按鈕綁 click 事件，點下去就**清空 `div#content`**、再呼叫對應分頁的函式重新填入。

這是關注點分離（separation of concerns）的典型應用：每個分頁不知道別的分頁存在，`index.js` 當「總機」負責調度。

### 建立 DOM 元素的標準流程

用 JavaScript 生內容的核心就是 `document.createElement`。標準四步：建立元素 → 設定內容 → 加樣式 → 掛到頁面。

- `document.createElement("div")`：建立一個元素節點（node），此時它還沒出現在頁面上。
- `element.textContent = "文字"`：設定文字內容。
- `element.classList.add("hero")`：掛上 class，樣式交給 CSS 檔。
- `parent.append(child)`：把元素插入到父節點，這時才會顯示在畫面上。

關於「掛到頁面」有兩個常見方法，差別要記住：

- `append()`：可以一次傳**多個**參數，也接受**字串**（自動轉成文字節點），但**不回傳**任何東西。
- `appendChild()`：一次只能傳**一個節點**，不接受字串，會**回傳**被加入的節點。

現代寫法多用 `append()`，因為更彈性。

### `.gitignore`：別把 `node_modules` 推上去

用 npm 安裝套件時，`node_modules` 資料夾會非常肥，而且不需要進版控——因為 `package.json` 已經記錄了所有相依套件（dependency），別人只要 `npm install` 就能重建。同理，`dist`（webpack 打包產出的資料夾）通常也可由 build 指令重新產生，不需追蹤。

做法是在專案根目錄建立一個 `.gitignore` 檔，把不想追蹤的檔案或資料夾名稱逐行寫進去。GitHub 也提供各語言的 `.gitignore` 範本，JavaScript 專案可用 `node` 範本，它已包含 `node_modules` 與 `dist`。

## 程式碼範例

以下示範「用一個模組建立首頁內容」以及「index.js 綁定分頁切換」的最小骨架。

`src/template.html`（webpack 會以它為範本產生最終 HTML）：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <title>我的餐廳</title>
  </head>
  <body>
    <header>
      <nav>
        <!-- 用 button，不是 <a>；靠 JS 的 click 切換分頁 -->
        <button id="tab-home">首頁</button>
        <button id="tab-menu">菜單</button>
        <button id="tab-contact">聯絡我們</button>
      </nav>
    </header>
    <!-- 所有動態內容都會被塞進這個空 div -->
    <div id="content"></div>
  </body>
</html>
```

`src/home.js`（首頁模組，export 一個建立內容的函式）：

```javascript
// 首頁分頁：export 一個函式，負責建立並回傳這一頁的內容
export default function loadHome() {
  const container = document.createElement("div");
  container.classList.add("home"); // 樣式交給 CSS 檔

  const title = document.createElement("h1");
  title.textContent = "歡迎光臨小巷餐館";

  const desc = document.createElement("p");
  desc.textContent = "在地食材、手作料理，用一頓飯記住一座城市。";

  // append 可一次傳多個節點
  container.append(title, desc);
  return container;
}
```

`src/index.js`（總機：首次載入 + 綁定分頁切換）：

```javascript
import "./styles.css"; // 讓 webpack 一起打包 CSS
import loadHome from "./home.js";
import loadMenu from "./menu.js";
import loadContact from "./contact.js";

const content = document.querySelector("#content");

// 切換分頁：先清空 content，再放入對應分頁的內容
function switchTab(loadFn) {
  content.textContent = ""; // 清空舊內容
  content.append(loadFn()); // 填入新內容
}

// 替每個按鈕綁 click 事件
document.querySelector("#tab-home").addEventListener("click", () => switchTab(loadHome));
document.querySelector("#tab-menu").addEventListener("click", () => switchTab(loadMenu));
document.querySelector("#tab-contact").addEventListener("click", () => switchTab(loadContact));

// 頁面首次載入時，預設顯示首頁
switchTab(loadHome);
```

`src/menu.js`、`src/contact.js` 結構和 `home.js` 一樣，各自 `export` 一個回傳 div 的函式即可。這樣新增分頁只要多寫一個模組、在 `index.js` 多綁一個按鈕，彼此互不干擾。

## 常見陷阱

!!! warning "把內容寫死在 HTML 裡"
    這個專案的重點就是**用 JS 生成內容**。如果你把首頁文字、菜單都直接打在 `template.html`，就沒達成目標。正確流程是：先在 HTML 硬編排版看看效果，確認後把它們全部搬進 JS，改用 `createElement` 動態產生，`template.html` 只留 `<header>` 和空的 `<div id="content">`。

!!! warning "導覽用 `<a>` 而不是 `<button>`"
    分頁切換是在同一頁內用 JS 換內容，不是跳到別的網址。用 `<a href>` 可能觸發頁面跳轉或留下奇怪的 URL。原文明確要求用 **button**。

!!! warning "切換分頁時忘了先清空 `#content`"
    只 `append` 新內容卻沒清掉舊的，畫面會把好幾頁疊在一起。切換前先把 `content.textContent = ""`（或用迴圈移除子節點）清空。

!!! warning "把 `node_modules` 或 `dist` 推上 GitHub"
    忘了寫 `.gitignore` 會把肥大的 `node_modules` 一起 commit。專案根目錄要有 `.gitignore`，內含 `node_modules` 和 `dist` 兩行。

!!! warning "只安裝用不到的 loader"
    webpack 的 loader 是「用到才裝」。例如你若沒有在 HTML 範本裡連結本機圖片檔，就不需要安裝、設定 `html-loader`。照專案實際需求配置即可，別照抄整包。

## 練習

以下把原文的 Assignment 改寫成中文步驟。**實際需求以原文為準**，完整專案說明請見文末原文連結。

1. 用和 webpack 教學專案相同的方式起手：建立 `package.json`、設定 webpack。只安裝、設定你這個專案真正需要的東西（例如沒有本機圖片就不必裝 `html-loader`）。
2. 在專案根目錄建立 `.gitignore`，內容為 `node_modules` 和 `dist`（各一行）。
3. 在 `src/template.html` 建立 HTML 骨架：`<body>` 裡放一個 `<header>`，內含 `<nav>` 與數個分頁**按鈕（button，不是連結）**，例如「首頁」「菜單」「關於」。header 底下放一個空的 `<div id="content">`。
4. 在 `src/index.js` 寫一個 `console.log` 或 `alert`，執行 `npx webpack serve`，開 [http://localhost:8080](http://localhost:8080) 確認 JS 有正常執行。
5. 先在 `div#content` 裡**硬編**一個餐廳首頁（圖片、標題、幾段介紹文字），不用做得太精緻，目的是先看看排版效果。
6. 把 `div#content` 內硬編的東西全部拿掉（保留 `<header>`、`<nav>` 和空的 `<div id="content">`），改用**純 JavaScript** 建立這些元素，並在頁面首次載入時 `append` 到 `div#content`。把這段初始載入的函式寫進獨立模組，再於 `index.js` `import` 並呼叫它。
7. 設定 tabbed browsing 來切換「菜單」「聯絡」等分頁：
   - 每個分頁的內容各自寫成一個模組，`export` 一個函式：建立 div、加入內容與樣式，再 `append` 到 DOM。
   - 分頁切換邏輯寫在 `index.js`：替 header 每個按鈕綁 click 事件，先清空 `div#content`，再呼叫對應的分頁模組重新填入內容。
8. 部署到 GitHub Pages。因為你的 `index.html` 在 `dist` 裡、不在根目錄，需要把 `dist` 的**內容**推到專屬分支。原文提供了一套 `git subtree push --prefix dist origin gh-pages` 等指令，照著步驟做即可，並記得到 repo 設定把 GitHub Pages 的來源分支改成 `gh-pages`。**部署細節請完全依原文為準。**

## 原文與延伸資源

- 原文：[Project: Restaurant Page](https://www.theodinproject.com/lessons/node-path-javascript-restaurant-page)
- 本課引用：
  - [MDN — Document.createElement()](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
  - [MDN — Element.append()](https://developer.mozilla.org/en-US/docs/Web/API/Element/append)
  - [The Odin Project — npm 課程](https://www.theodinproject.com/lessons/node-path-javascript-npm)（`.gitignore` 與相依套件的觀念來源）

---

> 本講義改寫自 The Odin Project《Project: Restaurant Page》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
