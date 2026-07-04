---
title: 專案：Etch-a-Sketch
source_url: https://www.theodinproject.com/lessons/foundations-etch-a-sketch
source_file: vendor/curriculum/foundations/javascript_basics/project_etch_a_sketch.md
path: foundations
course: Foundations
order: 43
generated: 2026-07-03
---

# 專案：Etch-a-Sketch

> 改寫自 The Odin Project：[Project: Etch-a-Sketch](https://www.theodinproject.com/lessons/foundations-etch-a-sketch)
> ｜Foundations › JavaScript Basics

## 核心概念

這個專案要你做一個瀏覽器版的塗鴉板，介於「畫布」和實體 Etch-a-Sketch 玩具之間：畫面上是一片方格，滑鼠劃過哪一格，那一格就留下顏色，像用筆拖出一條像素化的軌跡。它不難在單一功能，而難在把你前面學過的 DOM（Document Object Model，文件物件模型）操作、Flexbox 與 JavaScript 基礎組合起來，實際做出一個會動的東西。TOP 刻意不給你完整程式碼，只給步驟，這一段就把每個步驟背後「要用到的技巧」講清楚，讓你不必翻其他頁面也能動手。

### 為什麼格子要用 JavaScript 生成

一個 16×16 的方格總共有 256 個 div，你當然不會手動在 HTML 裡貼 256 次。正確做法是在 HTML 只留一個容器（container）div，其餘格子全部用 JavaScript 在迴圈裡建立。核心是三個 DOM 方法：`document.createElement('div')` 建立一個新的 element（元素）節點、設定它的 class 或樣式、再用 `container.appendChild(square)` 把它掛進容器。要做 n×n 的格子，就跑 `n * n` 次迴圈，每一圈建立一格。

用程式生成還有一個關鍵好處：當使用者想換成 64×64 時，你只要改變迴圈次數，不需要改 HTML。這正是後面「重建格子」功能的基礎。

### 用 Flexbox 排成方格

`div` 預設是 block（區塊）元素，會各自佔一整行，直接塞進容器只會排成一直條。要讓它們橫向排列並自動換行成方格，就把容器設成 flex container：

- `display: flex` 讓子元素沿主軸（main axis）水平排列。
- `flex-wrap: wrap` 允許放不下時換到下一行——這是排出「格狀」而非「一長條」的關鍵。

專案要求特別點名：**用 Flexbox，不要用 CSS Grid**。雖然 CSS Grid 做網格更直覺，但它是 Foundations 之後才教的內容，這個專案的用意就是逼你用 Flexbox 把二維格子排出來，練熟前面學的東西。

### 邊框與 box model 的陷阱

方格的尺寸是這個專案最容易出錯的地方。若容器寬 960px、要放 16 格，每格理應 60px。但 CSS 預設的 box model（盒模型）下，`width` 只算內容區，`border`（邊框）和 `padding`（內距）會額外加在外面。你設了 `width: 60px` 又加了 `1px` 邊框，實際佔用就變成 62px，16 格加起來超過 960px，Flexbox 一換行整個版面就亂掉。

兩個解法：一是給容器或格子加上 `box-sizing: border-box`，讓 `width` 把邊框和內距算進去；二是乾脆別靠固定寬度，用 Flexbox 的彈性尺寸（下面範例會用這招）。無論哪種，動手前先在腦中把「總寬 ÷ 格數」算清楚。

### hover：滑鼠劃過就上色

「劃過留色」的本質是：滑鼠進入某一格時觸發事件、把那一格改色。你需要對格子註冊 event listener（事件監聽器）。這裡有一個常被踩到的觀念——`mouseover` 與 `mouseenter` 的差別：

- `mouseover`／`mouseout` 會冒泡（bubble），滑鼠越過子元素邊界時會重複觸發。
- `mouseenter`／`mouseleave` 不冒泡，只在真正進入／離開該元素時各觸發一次，行為較乾淨。

我們的格子是純色小方塊、沒有子元素，兩者效果差不多，但養成用 `mouseenter` 的習慣能避免未來在有巢狀結構時被重複觸發搞混。改色的方式也有兩種：直接改 `square.style.backgroundColor`，或替格子加一個 CSS class（例如 `square.classList.add('inked')`，顏色寫在 CSS 裡）。

當你要對「256 個」格子都掛監聽器時，可以在建立每一格的迴圈裡順手 `addEventListener`；這對這種規模完全夠用，不必急著學事件委派（event delegation）。

### 用按鈕與 prompt 重建格子

第三個功能：畫面上方放一顆按鈕，點下去用 `prompt()` 問使用者「每邊要幾格」，然後**清掉舊格子、在同樣的總空間裡生出新格子**。重點拆成三步：

1. **取得輸入**：`prompt()` 會回傳字串，記得用 `Number()` 或 `parseInt()` 轉成數字。務必把上限限制在 100——格數越多、DOM 節點越多，數千上萬個 div 會讓瀏覽器變慢甚至當掉。使用者按取消時 `prompt` 回傳 `null`，也要處理。
2. **清掉舊格子**：最乾淨的做法是 `container.innerHTML = ''`，或用 `while (container.firstChild) container.removeChild(container.firstChild)` 逐一移除。若不清就直接生新的，新舊會疊在一起。
3. **維持總空間不變**：容器寬度固定（例如 960px），變的是「每格多大」。若讓 Flexbox 自動分配，每格寬度用百分比 `100 / n + '%'` 設定，n 越大格子越小，總寬永遠是容器那 960px。輸入 64 就會得到 64×64、格子更細，但整體大小不變。

### Extra credit：隨機色與漸暗

進階挑戰有兩個，可做其一或兩者都做：

- **隨機 RGB**：每次劃過就給格子一個隨機顏色。用 `Math.floor(Math.random() * 256)` 取 0–255 的整數，組成 `rgb(r, g, b)` 字串。
- **漸進變暗**：讓每格每被劃過一次就變暗 10%，剛好十次全黑。這裡 [MDN 的 opacity 文件](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity)派上用場。`opacity`（不透明度）值域 0（全透明）到 1（全不透明）。做法是在每格記一個「被劃過幾次」的計數，把 `opacity` 設成 `count * 0.1`；配一個深色背景，累加十次就到 1、變全黑。注意：CSS 的 `opacity` 不會「自己疊加」，你得自己維護計數並每次重算，超過 1 也會被自動夾到 1。

## 程式碼範例

以下是一份最小可執行的完整實作，含 HTML、CSS、JavaScript，達成基本需求（生成格子、hover 上色、按鈕重建）。存成三個檔案並用瀏覽器開 `index.html` 即可運作。

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="style.css" />
    <title>Etch-a-Sketch</title>
  </head>
  <body>
    <button id="newGrid">設定新的格數</button>
    <!-- 容器寫在 HTML，格子由 JS 生成 -->
    <div id="container"></div>
    <script src="script.js"></script>
  </body>
</html>
```

```css
/* style.css */
#container {
  display: flex;       /* 子元素水平排列 */
  flex-wrap: wrap;     /* 放不下就換行，排成方格 */
  width: 960px;        /* 固定總寬，重建時不變 */
  height: 960px;
  border: 1px solid #333;
}

.square {
  background-color: white;
}

/* 劃過後的顏色，也可改用 JS 直接設 style */
.square.inked {
  background-color: black;
}
```

```js
// script.js
const container = document.getElementById("container");

// 建立 size×size 的格子
function createGrid(size) {
  container.innerHTML = ""; // 先清掉舊格子

  // 每格寬高用百分比，總寬永遠等於容器的 960px
  const percent = 100 / size + "%";

  for (let i = 0; i < size * size; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    // flex-basis 用百分比控制每格大小
    square.style.flex = `0 0 ${percent}`;
    square.style.height = percent;

    // 滑鼠進入該格就上色（mouseenter 不冒泡，行為乾淨）
    square.addEventListener("mouseenter", () => {
      square.classList.add("inked");
    });

    container.appendChild(square);
  }
}

// 按鈕：問使用者格數並重建
const button = document.getElementById("newGrid");
button.addEventListener("click", () => {
  let size = prompt("每邊要幾格？（1 到 100）");
  if (size === null) return;        // 使用者按取消
  size = Number(size);
  if (!size || size < 1) return;    // 非數字或無效值
  if (size > 100) size = 100;       // 上限保護，避免當機
  createGrid(size);
});

// 初始畫面：16×16
createGrid(16);
```

若要加上 extra credit 的隨機色與漸暗，把 `mouseenter` 的處理改成類似這樣：

```js
// 進階版：隨機顏色 + 每次劃過變暗 10%
let darkness = 0; // 這個計數應存在每一格上，見下方說明
square.addEventListener("mouseenter", () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  square.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

  // 用 dataset 把「被劃過次數」記在格子本身
  const count = Number(square.dataset.count || 0) + 1;
  square.dataset.count = count;
  square.style.opacity = Math.min(count * 0.1, 1); // 十次到 1
});
```

## 常見陷阱

!!! warning "邊框與內距把格子撐大"
    設了 `width` 又加 `border`／`padding`，實際佔用寬度會超過你算的值，Flexbox 一換行版面就亂。用 `box-sizing: border-box`，或改用 Flexbox 的彈性百分比尺寸，別把固定寬度和邊框混用。

!!! warning "誤用 CSS Grid"
    這個專案明確要求用 Flexbox。CSS Grid 排網格雖然更順手，但它是 Foundations 之後才教的內容，現在用等於跳過該練的東西。老實用 `display: flex` + `flex-wrap: wrap`。

!!! warning "重建前忘了清掉舊格子"
    直接對容器 `appendChild` 新格子而沒先清空，新舊格子會疊在一起、越點越多。重建第一步一定是 `container.innerHTML = ""` 或逐一 `removeChild`。

!!! warning "prompt 回傳的是字串，且可能是 null"
    `prompt()` 永遠回傳字串，要 `Number()` 轉數字再用。使用者按「取消」時回傳 `null`，直接拿去運算或建格子會出錯，記得先擋掉。

!!! warning "格數沒設上限"
    不限制輸入時，使用者打 1000 就是一百萬個 div，瀏覽器會嚴重卡頓甚至當掉。務必把上限夾在 100 以內。

!!! warning "以為 opacity 會自動累加"
    CSS 的 `opacity` 不會因為你多設幾次就自己疊加，每次都是覆蓋。要做漸暗效果，得自己在格子上記「被劃過幾次」（例如用 `dataset`），每次重算 `count * 0.1`，並用 `Math.min(..., 1)` 夾住上限。

## 練習

完整且會更新的專案需求以原文為準：[Project: Etch-a-Sketch](https://www.theodinproject.com/lessons/foundations-etch-a-sketch)。步驟大致如下：

1. 依 TOP 的 GitHub 設定指引，替專案建立一個 repository（記得 commit early、commit often）。
2. 建一個 16×16 的方格網頁：格子全部用 JavaScript 生成，放進一個寫在 HTML 的「container」div；用 Flexbox（不要用 CSS Grid）排成格狀；小心邊框與內距影響格子尺寸。若格子沒出現，打開開發者工具檢查 console 有無錯誤、elements 面板格子是否存在、灑幾個 `console.log` 確認腳本有載入。
3. 加上 hover 效果：滑鼠劃過格子就變色，留下一條像素化的軌跡。可用「加 class」或「直接改 backgroundColor」兩種方式之一。
4. 在畫面上方加一顆按鈕，點下去用 `prompt` 問使用者每邊格數，然後清掉舊格子、在**相同的總空間**（例如 960px 寬）裡生成新格子。把輸入上限設為 100。輸入 64 應得到全新的 64×64 格子，而總像素大小不變。
5. 把成品推上 GitHub。

進階（Extra credit，可選其一或兩者）：

1. 每次劃過讓格子變成隨機 RGB 顏色。
2. 加上漸進變暗：每次劃過變暗 10%，十次後完全變黑（或完全著色）。可參考 MDN 的 `opacity` 文件。

## 原文與延伸資源

- 原文：[Project: Etch-a-Sketch](https://www.theodinproject.com/lessons/foundations-etch-a-sketch)
- 本課引用：
  - [MDN：opacity CSS 屬性](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity)——漸暗效果的關鍵，說明值域與行為。
  - [MDN：Element mouseover 事件](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseover_event)——釐清 `mouseover`／`mouseenter` 與冒泡的差別。
  - [MDN：Element.classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)——用 `add`／`toggle` 切換格子樣式。
  - [MDN：Window.prompt()](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt)——取得使用者輸入的格數。
  - [MDN：Document.createElement()](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)——用 JavaScript 生成格子。

---

> 本講義改寫自 The Odin Project《Project: Etch-a-Sketch》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
