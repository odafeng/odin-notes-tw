---
title: JavaScript 開發者工具
source_url: https://www.theodinproject.com/lessons/foundations-javascript-developer-tools
source_file: vendor/curriculum/foundations/javascript_basics/javascript_developer_tools.md
path: foundations
course: Foundations
order: 34
status: draft
generated: 2026-07-03
---

# JavaScript 開發者工具

> 改寫自 The Odin Project：[JavaScript Developer Tools](https://www.theodinproject.com/lessons/foundations-javascript-developer-tools)
> ｜Foundations › JavaScript Basics

## 核心概念

瀏覽器內建的**開發者工具（Developer Tools，簡稱 DevTools）**是每一位網頁開發者的隨身工具箱。你在寫 HTML 與 CSS 時應該已經用它檢視過元素、調過樣式；這一課要把焦點移到 JavaScript：如何用 DevTools 執行程式碼、觀察頁面的 DOM、以及最重要的——**除錯（debug）**。學會這些技巧，你排查問題的速度會有數量級的提升，不必再靠猜測或在程式裡塞滿一堆輸出語句。

本課以 Chrome DevTools 為例，其他瀏覽器（Firefox、Edge、Safari）的工具在概念上幾乎完全相同，只是名稱與快捷鍵略有差異。

### 如何開啟 DevTools

在 Chrome 中有三種開啟方式，任選其一：

1. 從 `Chrome 選單` › `更多工具` › `開發者工具`。
2. 在頁面任一處按右鍵，選擇 `檢查（Inspect）`。
3. 使用快捷鍵 <kbd>F12</kbd>，或 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd>（Mac 為 <kbd>Opt</kbd> + <kbd>Cmd</kbd> + <kbd>C</kbd>）。

用右鍵「檢查」開啟時，會直接定位到你剛剛點選的那個元素，這是最省事的入口。DevTools 開啟後是一排**面板（panel）**，用得最多的是 Elements、Console 與 Sources 這三個。

### 用 Device Mode 改變螢幕尺寸

DevTools 左上角有一個像手機／平板的圖示，稱為 **Device Mode（裝置模式）**。點開後頁面會被縮進一個可調整寬高的框裡，你可以：

- 直接拖曳邊緣改變視窗尺寸，即時看到 responsive（響應式）版面的變化。
- 從上方下拉選單挑選特定裝置（如 iPhone、iPad）來模擬解析度。
- 模擬不同的 **media query（媒體查詢）**斷點，驗證你的 CSS 在各種螢幕寬度下是否如預期切換。

這讓你不必真的拿手機測試，就能檢查版面在小螢幕上是否跑版。

### Elements 面板：檢視與修改 DOM

**Elements 面板**顯示的是頁面目前的 **DOM（文件物件模型）**，也就是瀏覽器實際渲染的 HTML 結構——注意這與原始 HTML 檔案可能不同，因為 JavaScript 隨時可以修改它。在這裡你可以：

- **即時編輯 HTML**：雙擊任一元素的標籤或文字內容直接改，不必重新整理頁面就能看到結果（但重整後就會還原，因為你只改了畫面上的副本）。
- **檢視與修改 CSS**：右側的 Styles 窗格列出套用在該元素上的所有規則，可勾選 / 取消勾選來**啟用或停用某條 CSS 類別（class）**，或直接改數值試效果。
- **Box Model（盒模型）**：在 Styles 下方有一張盒模型圖，把 margin、border、padding、content 的實際像素值一目了然地畫出來，還能直接點進去修改。
- **CSS Pseudostate（偽狀態）**：點 Styles 窗格的 `:hov` 按鈕，可以手動強制元素進入 `:hover`、`:focus`、`:active` 等狀態，方便你在滑鼠不必真的懸停時也能檢視對應樣式。
- **依字母排序檢視屬性**、以及在 `Rendering` 工具裡**模擬列印模式（print mode）**檢視 `@media print` 的樣式，都是這個面板延伸出來的實用功能。

### Console 面板：執行 JavaScript 的即時環境

**Console（主控台）**有兩大用途：**檢視程式輸出的訊息**與**直接執行 JavaScript**。

它本質上是一個 **REPL（讀取—求值—輸出迴圈）**：你在提示符後輸入任何一段 JS 運算式，按下 Enter，它立刻求值並印出結果。而且這段程式碼是在**當前頁面的環境**裡執行的——你能存取頁面的 `window` 物件、`document`、以及頁面腳本定義的全域變數，甚至能即時改動頁面內容（例如把標題換掉、把某個元素藏起來）。這使 Console 成為快速試驗語法、驗證想法的絕佳沙盒。

程式碼裡最常見的輸出工具就是 `console.log()`。你把它放進程式的關鍵位置，就能確認：

- 程式有沒有跑到這一行、執行順序對不對。
- 某個 variable（變數）在那個時刻的值到底是什麼。

除了 `console.log()`，Console 還提供多個實用方法：`console.table()` 會把 array（陣列）或 object（物件）以表格排版，資料一多時遠比一長串文字好讀；`console.error()`、`console.warn()` 會以紅色 / 黃色標示；`console.assert()` 只在條件為 false 時才輸出。

### Sources 面板：JavaScript 除錯的主場

當程式的行為不如預期，與其到處插 `console.log()`，更專業的做法是用 **Sources 面板**搭配 **breakpoint（中斷點）**逐步檢查。Sources 面板分成三塊：

- **File Navigator（檔案導覽）**：列出頁面載入的所有檔案（HTML、CSS、JS），也就是 Resources（資源）——你可以在這裡確認一個網站實際跑了哪些腳本。
- **Code Editor（程式碼編輯區）**：中間顯示原始碼。
- **JavaScript Debugging pane（除錯窗格）**：右側，包含 Watch、Call Stack、Scope、Breakpoints 等區塊。

#### 什麼是 breakpoint？

**breakpoint（中斷點）**就是你在程式裡設下的一個「暫停點」。當 JavaScript 執行到那一行時會**凍結**，讓你能在那一瞬間檢查所有變數的值、目前的呼叫關係。這是除錯的核心——因為 bug 往往是「某個值在某個時間點跟你以為的不一樣」，而中斷點讓你把時間暫停下來看個清楚。

#### 如何設定 breakpoint？

最常用的是 **line-of-code breakpoint（行中斷點）**：在 Sources 面板打開你的 JS 檔，**點一下該行左側的行號**，出現一個藍色標記就代表設定成功。之後重新觸發這段程式（例如重整頁面或點按鈕），執行到那一行就會停住。

Chrome DevTools 還提供多種中斷點，適用於不同情境：

- **Conditional breakpoint（條件中斷點）**：在行號上按右鍵選 `Add conditional breakpoint`，輸入一個運算式，只有當它為 truthy 時才會暫停。在迴圈裡尤其好用——例如只在 `i === 42` 時才停。
- **Logpoint（記錄點）**：右鍵選 `Add logpoint`，讓它在不暫停的情況下把訊息印到 Console，等於是「不用改原始碼」的 `console.log()`。
- **DOM change breakpoint**：在 Elements 面板對某元素按右鍵 › `Break on`，可在該節點的子樹被修改、屬性變更或被移除時暫停，用來揪出「是誰動了這個元素」。
- **Event listener breakpoint**：當特定事件（如 `click`）觸發時暫停，方便追查事件處理函式。
- **Exception breakpoint**：在拋出例外時自動暫停，可分別設定「已捕捉」與「未捕捉」的例外。

#### 逐步執行與檢視狀態

程式在中斷點暫停後，除錯窗格上方有一排控制按鈕，讓你一步一步往下走：

- **Resume / Continue（<kbd>F8</kbd>）**：繼續執行，直到下一個中斷點。
- **Step over（<kbd>F10</kbd>）**：執行下一行，但若那一行是函式呼叫，**不進入**函式內部，把它當成一步跨過去。
- **Step into（<kbd>F11</kbd>）**：執行下一行，若是函式呼叫就**跳進**函式裡逐行看。
- **Step out（<kbd>Shift</kbd> + <kbd>F11</kbd>）**：把當前函式**執行完**並跳回呼叫它的地方。

暫停期間，右側窗格讓你看清當下的一切：

- **Scope（作用域）**：列出當前的 local（區域）與 global（全域）變數及其值，原始碼中對應的變數值也會直接標示出來。
- **Call Stack（呼叫堆疊）**：顯示「函式呼叫函式」的層層關係，點任一層就能跳到那段程式，追溯是「誰、從哪裡」呼叫到目前這裡。
- **Watch（監看）**：點加號輸入你想持續盯著的運算式，它的值會隨執行更新。

此外，暫停時 Console 依然可用（按 <kbd>Esc</kbd> 可疊出 Console 抽屜），你能在當下的作用域裡輸入任意運算式來檢查，非常靈活。

## 程式碼範例

```js
// 範例一：用 console 的各種方法觀察程式狀態
const users = [
  { name: "Ada", age: 36 },
  { name: "Alan", age: 41 },
];

console.log("使用者數量：", users.length); // 一般輸出
console.table(users);                      // 以表格排版，資料一多更好讀

const total = users.reduce((sum, u) => sum + u.age, 0);
console.assert(total === 77, "年齡總和不符預期！"); // 只在條件為 false 時才印出
```

```js
// 範例二：用 debugger 語句在程式中設下暫停點
// debugger 只在 DevTools 開啟時生效，否則瀏覽器會直接略過它
function calcDiscount(price, rate) {
  const discount = price * rate;
  debugger; // 執行到這裡會暫停，此時可在 Scope 檢查 price、rate、discount
  return price - discount;
}

calcDiscount(1000, 0.2); // 呼叫後若 DevTools 開著就會停在 debugger 那行
```

```js
// 範例三：條件中斷點的典型用途
// 在下面 console.log 那一行的行號按右鍵設「條件中斷點」，
// 條件填 i === 5，程式就只會在第 6 圈時暫停，其餘照跑
for (let i = 0; i < 10; i++) {
  console.log("目前圈數：", i);
}
```

## 常見陷阱

!!! warning "在 Elements 面板改的東西重整就消失"
    在 Elements 面板直接編輯 HTML 或 CSS，改的只是瀏覽器記憶體裡當前這份 DOM 的副本，並**不會**寫回你的原始檔案。一旦重新整理頁面，所有手動修改都會還原。它適合快速試效果，真正的修改仍要回到你的程式碼檔裡。

!!! warning "debugger 語句忘了移除就上線"
    `debugger;` 只在 DevTools 開啟時才會暫停，平常使用者看不出異狀，因此很容易忘記刪掉就提交或部署。養成除錯完立刻移除的習慣，或改用 DevTools 裡點行號設的中斷點——那種中斷點不會寫進原始碼。

!!! warning "Step over 與 Step into 搞混"
    遇到函式呼叫時，Step over（<kbd>F10</kbd>）會把整個函式當一步跨過，Step into（<kbd>F11</kbd>）才會進入函式內部。想快速略過你信任的函式就用 Step over；懷疑 bug 藏在某個函式裡才用 Step into。用錯會讓你不是錯過關鍵細節，就是被拖進一堆無關的內部程式碼。

!!! warning "Google 教學畫面與你看到的不完全一樣"
    Chrome DevTools 與官方文件會持續更新，教學截圖裡的某個按鈕或元素在你的版本可能已改名或不存在。這是正常的——重點是理解各面板的**功能**，跟著操作對應的既有元素即可，不必逐字對照。

## 練習

先把「除錯」這件事親手做過一遍，比記住任何按鈕都重要。建議依序完成：

1. 完成 JavaScript.info 的 [Debugging in Chrome 教學](https://javascript.info/debugging-chrome)，實際設一個中斷點、逐行 step through、並在 Scope 與 Watch 裡觀察變數。
2. 瀏覽 Google 的 [Chrome DevTools 官方文件](https://developer.chrome.com/docs/devtools/)，重點掃過以下幾節，**不必背誦**，目的是建立「遇到問題知道去哪查」的意識：
   - CSS：[檢視與修改 CSS](https://developer.chrome.com/docs/devtools/css/)、[CSS 功能參考](https://developer.chrome.com/docs/devtools/css/reference/)。
   - DOM：[檢視與修改 DOM 入門](https://developer.chrome.com/docs/devtools/dom/)。
   - JavaScript：[各種中斷點類型](https://developer.chrome.com/docs/devtools/javascript/breakpoints/)。
3. 讀過 [Chrome DevTools Console 概覽](https://developer.chrome.com/docs/devtools/console/)，並打開任一網站的 Console，試著執行幾行 JavaScript、印出 `document.title`、或用 `console.table()` 印一個陣列，熟悉這個即時環境。

完成後，試著回答本課的 knowledge check：如何開啟開發者工具？如何用它改變螢幕尺寸？什麼是 breakpoint？如何設定一個 breakpoint？

## 原文與延伸資源

- 原文：[JavaScript Developer Tools](https://www.theodinproject.com/lessons/foundations-javascript-developer-tools)
- 本課引用：
  - [Debugging in Chrome — JavaScript.info](https://javascript.info/debugging-chrome)
  - [Chrome DevTools Documentation — Google](https://developer.chrome.com/docs/devtools/)
  - [Console overview — Chrome DevTools](https://developer.chrome.com/docs/devtools/console/)
  - [Breakpoints reference — Chrome DevTools](https://developer.chrome.com/docs/devtools/javascript/breakpoints/)
  - [Device Mode — Chrome DevTools](https://developer.chrome.com/docs/devtools/device-mode/)
  - [View and change CSS — Chrome DevTools](https://developer.chrome.com/docs/devtools/css/)
  - [View and change the DOM — Chrome DevTools](https://developer.chrome.com/docs/devtools/dom/)

---

> 本講義改寫自 The Odin Project《JavaScript Developer Tools》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
