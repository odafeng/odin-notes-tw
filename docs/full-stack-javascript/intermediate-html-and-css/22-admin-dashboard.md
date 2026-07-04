---
title: 專案：管理後台
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-admin-dashboard
source_file: vendor/curriculum/intermediate_html_css/grid/project_admin_dashboard.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 22
generated: 2026-07-03
---

# 專案：管理後台

> 改寫自 The Odin Project：[Project: Admin Dashboard](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-admin-dashboard)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Grid

## 核心概念

這個專案是整個 Grid 章節的總複習。前面幾課你分開學了 grid template（格線樣板）、`fr` 單位、軌道（track）定位、以及 Grid 與 Flexbox 的分工；這一次要把它們全部組裝起來，對著一張設計稿做出一個完整的「管理後台（admin dashboard）」介面。專案說明特別提醒：工具可以隨你挑，但版面的主力請盡量交給 Grid。目標不是發明新技巧，而是練習把大版面拆解成一層層 grid，再逐格填內容。

### 先讀懂整體版面

設計稿是後台介面的經典骨架，可以拆成三大區塊：

- **Sidebar（側欄）**：貼在最左邊、**佔滿整個視窗高度**的深色欄，裡面放品牌 logo（頂端）與一組導覽選單（Dashboard、Home、Profile、Settings…）。
- **Header（頁首）**：位在右側上方，通常再分兩列——上列是搜尋框加使用者頭像與通知鈴鐺，下列是問候語、大頭貼，以及右邊幾顆操作按鈕（New、Upload、Share）。
- **Main content（主內容）**：右側下方最大的一塊，左邊是佔多數面積的「Projects（專案卡片牆）」，右邊窄欄由上而下疊「Announcements（公告）」與「Trending（趨勢）」兩張卡片。

關鍵的空間關係是：**sidebar 從頭到腳貫穿整個左側，而 header 與 main content 只佔右側**。這正是 Grid 二維佈局最擅長的情境——用一個外層 grid 就能一次把「左窄右寬、右側再上下切」描述清楚。

### 技巧重點一：用外層 grid 定大局

最外層容器 `display: grid`，切成兩欄：左邊一條固定寬度給 sidebar，右邊用 `1fr` 吃掉剩餘空間給 header 與 main content。垂直方向切兩列：上列 `auto`（高度由 header 內容決定）、下列 `1fr`（main content 撐滿剩下的高度）。

要讓 sidebar「跨越兩列」，有兩種等價寫法，挑一種順手的即可：

- **grid-template-areas（具名區域）**：直接用「文字畫圖」的方式描述版面，可讀性最高。把外層畫成
  ```
  "sidebar header"
  "sidebar main"
  ```
  同一個名字重複出現就代表那塊區域要跨格，`sidebar` 出現在兩列裡，就自動貫穿全高。子元素只要各自宣告對應的名字（`grid-area: sidebar`、`grid-area: header`、`grid-area: main`）對應過去即可。具名區域必須是**矩形**、每列的欄數要一致（缺的格子用 `.` 佔位）。
- **軌道線編號 / span**：不具名，改用 `grid-column` 與 `grid-row` 明確指定每塊落在第幾條線之間，例如讓 sidebar `grid-row: 1 / 3` 跨越第 1 到第 3 條列線。

### 技巧重點二：grid 裡面再放 grid（巢狀）

一個 grid item（格線項目）本身可以再成為一個 grid container（格線容器）。這個專案幾乎每一塊都要巢狀下去：

- **Sidebar 內部**：再開一個 grid，把 logo 列與各導覽項目由上到下排好；每個導覽項目本身又常是「圖示＋文字」的小排列（這種一維的小東西交給 Flexbox 或 grid 都行）。
- **Header 內部**：拆成上下兩列，上列左邊搜尋框、右邊使用者資訊；下列左邊問候區、右邊按鈕群。
- **Main content 內部**：先切成「左寬（Projects）＋右窄（側邊卡片）」兩欄；Projects 這一區再自己開一個 grid，用 `repeat(auto-fit, minmax(...))` 之類的寫法排出自動換行的卡片牆。

心法就是前一課的分工：**Grid 管外層大結構，內層細節能用 Flexbox 就用 Flexbox**，兩者並用最省事。

### 技巧重點三：`fr`、`px` 與 `auto` 怎麼選

專案明講「用 px、`fr` 或兩者混用都可以」。實務上的常見選擇：

- Sidebar 寬度、header 高度這種「希望穩定、不隨視窗亂變」的軌道，用固定 `px`。
- 主內容那些「要吃掉剩餘空間、按比例分配」的軌道，用 `fr`。
- 高度由內容決定的列（例如 header），用 `auto` 或 `min-content`，不必寫死。

### 技巧重點四：素材（icons 與字型）

- **Icons**：導覽選單、header 按鈕都需要圖示。設計稿的圖示可從 [Material Design Icons](https://pictogrammers.com/library/mdi/) 下載成 SVG。SVG 是向量圖，放大不失真，且能用 CSS 控制顏色與尺寸——這正好呼應本章前面的 SVG 課。
- **外部字型（external font）**：設計稿用的是 Google Fonts 的 `Roboto`。載入外部字型的做法（用 `<link>` 引入 Google Fonts，或用 `@font-face` 掛本地字型檔）在〈More Text Styles〉那一課教過，可回頭複習。字型可自由替換成你喜歡的。

### 開發時的實用小訣竅

切版初期，先給每個容器**加上背景色或邊框**，你就能一眼看見每塊 grid 落在哪、有沒有對齊，版面兜好後再拿掉。這個專案**不要求響應式（RWD）**，專心把桌機版對著設計稿做出來即可；行有餘力才試著讓卡片牆隨視窗縮放。也不必追求跟設計稿像素級一致，把它當成練 Grid、順便發揮自己設計品味的機會。

## 程式碼範例

以下是整個後台的最小骨架，示範「外層 grid 用 template-areas 定出 sidebar 貫穿全高、header 與 main 佔右側」，以及 main content 內部再巢狀出卡片牆。實際專案請對著設計稿補上內容與細節樣式。

```html
<!-- index.html：三大區塊骨架 -->
<div class="dashboard">
  <aside class="sidebar">側欄：logo + 導覽選單</aside>

  <header class="header">頁首：搜尋、使用者資訊、按鈕</header>

  <main class="main">
    <!-- 左寬 Projects + 右窄側邊卡片 -->
    <section class="projects">
      <h2>Projects</h2>
      <div class="cards">
        <article class="card">專案卡片</article>
        <article class="card">專案卡片</article>
        <article class="card">專案卡片</article>
      </div>
    </section>

    <aside class="side-panels">
      <section class="announcements">Announcements</section>
      <section class="trending">Trending</section>
    </aside>
  </main>
</div>
```

```css
/* style.css */

/* 外層：sidebar 貫穿全高，header 與 main 佔右側 */
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;   /* 左固定、右彈性 */
  grid-template-rows: auto 1fr;       /* 上列由內容決定、下列撐滿 */
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  min-height: 100vh;
}

.sidebar { grid-area: sidebar; background-color: #1992d4; color: white; }
.header  { grid-area: header;  background-color: white; }
.main    { grid-area: main;    background-color: #e2e8f0; }

/* main content 內部：左寬 Projects + 右窄側邊 */
.main {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 24px;
  padding: 24px;
}

/* Projects 內的卡片牆：自動換行的響應式格線 */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

/* 卡片內部用 Flexbox 排細節（Grid 管外、Flexbox 管內） */
.card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 2px 4px 6px rgb(0 0 0 / 15%);
}
```

重點觀察：外層只用一段 `grid-template-areas` 就把「sidebar 貫穿兩列、header/main 佔右側」講清楚；`.main` 本身是外層的一個 grid item，卻同時又是自己內部的 grid container（巢狀）；卡片牆用 `repeat(auto-fit, minmax())` 不寫 media query 也能自動換欄。

## 常見陷阱

!!! warning "sidebar 沒有跨列，被 header 擠成只佔一格"
    想讓 sidebar 從頁首一路貫穿到底，就得讓它跨越兩列。用 `grid-template-areas` 時，把 `sidebar` 這個名字在兩列都寫上去；用線編號時，給它 `grid-row: 1 / 3`。只寫一次名字或忘記跨列，sidebar 就只會佔左上一格，右下方會空出來。

!!! warning "grid-template-areas 每列欄數不一致或區域不是矩形"
    template-areas 的每一列字串必須有**相同數量**的欄位；缺格請用 `.`（句點）佔位，不能留空。而且同名區域必須拼成**矩形**，L 形或不連續的排列不合法，瀏覽器會直接讓整段 `grid-template-areas` 失效。

!!! warning "什麼都用 fr，固定尺寸的區塊也跟著亂縮"
    Sidebar 寬度、header 高度這類希望穩定的軌道用 `fr`，會隨視窗與內容一起伸縮，導致版面飄移。固定的用 `px`，要吃剩餘空間、按比例分配的才用 `fr`，高度隨內容的用 `auto`。混用是正常且推薦的。

!!! warning "一開始就追求像素級完美與精緻樣式"
    版面還沒對齊就先糾結圓角、陰影、字距，容易卡住。先用背景色或邊框把每塊 grid 的位置「看出來」、確認結構正確，再回頭做視覺細節。專案也明說不必和設計稿像素級一致。

## 練習

需求細節以原文專案說明為準，這裡把 Assignment 濃縮成中文步驟：

1. **設定與規劃。** 建立 git repository（可參考先前的專案）。建好 HTML 與 CSS 檔並放些暫時內容，確認彼此連結正確。下載 [設計稿全解析度圖檔](https://cdn.statically.io/gh/TheOdinProject/curriculum/43cc6ab69fdfbef40d431a65677d2144668930ac/intermediate_html_css/grid/project_admin_dashboard/imgs/dashboard-project.png)，先在腦中規劃 HTML 大致要怎麼排。
2. **搭大版面。** 先寫出 sidebar、header、main-content 三個容器的 HTML，再在 CSS 用 Grid 屬性把這個基本版面兜出來（sidebar 貫穿全高、header 與 main 佔右側）。
3. **逐段巢狀。** 一次處理一個區塊，把子元素往下巢狀進去，grid 裡可以繼續開 grid。sidebar 內用 grid 排 logo 與導覽；header 內用 grid 排搜尋框、使用者資訊與按鈕；main-content 內用 grid 排 Projects、Announcements、Trending。填入暫時內容與 placeholder 圖片，方便定位每個 grid item。
4. **蒐集素材。** 版面完成後，可復刻設計稿或做自己的風格。圖示從 [Material Design Icons](https://pictogrammers.com/library/mdi/) 下載成 SVG。字型可自選，設計稿用 Google Fonts 的 `Roboto`（載入外部字型的方法見〈[More Text Styles](https://www.theodinproject.com/lessons/intermediate-html-and-css-more-text-styles)〉）。
5. **實用提醒。** 切版時給容器加背景色或邊框以看清 grid；軌道用 `px`、`fr` 或混用皆可；不需 RWD（想做也可以讓卡片牆隨視窗縮放）；不必像素級一致；完成後推上 GitHub，並用 GitHub Pages 發佈。

完整需求與逐步說明請見原文專案頁面。

## 原文與延伸資源

- 原文：[Project: Admin Dashboard](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-admin-dashboard)
- 本課引用：
    - [MDN：`grid-template-areas`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas) — 用具名區域「畫圖」定版面、`.` 佔位、矩形規則
    - [MDN：Grid template areas 教學](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Grid_template_areas) — 具名區域搭配 `grid-area`、跨格與 holy-grail 版面範例
    - [Material Design Icons](https://pictogrammers.com/library/mdi/) — 可下載成 SVG 的圖示庫
    - [More Text Styles（同課程前面章節）](https://www.theodinproject.com/lessons/intermediate-html-and-css-more-text-styles) — 載入外部字型（Google Fonts / `@font-face`）

---

> 本講義改寫自 The Odin Project《Project: Admin Dashboard》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
