---
title: 專案：Landing Page
source_url: https://www.theodinproject.com/lessons/foundations-landing-page
source_file: vendor/curriculum/foundations/html_css/flexbox/project_landing_page.md
path: foundations
course: Foundations
order: 30
status: draft
generated: 2026-07-03
---

# 專案：Landing Page

> 改寫自 The Odin Project：[Project: Landing Page](https://www.theodinproject.com/lessons/foundations-landing-page)
> ｜Foundations › Flexbox

## 核心概念

這是 Flexbox 章節的綜合專案：從一份設計稿，親手刻出一整頁的 landing page（登陸頁／行銷首頁）。前面幾課學到的 flex container（flex 容器）與 flex item（flex 項目）、main axis（主軸）與 cross axis（交錯軸）、`justify-content`、`align-items`、`flex-grow`／`flex` 等技巧，在這一課會一次全部用上。目標不是背下語法，而是把它們組合起來，排出一個像樣的真實版面。

原文的設計稿由兩張圖組成：一張是完整網頁的樣子，一張標示用到的字型與顏色。這一課「不要求像素級精準」——邊距抓個大概、元素大致落在對的相對位置即可，不必拿尺量。你也可以自由替換成自己的內容、圖片與配色，把它做成一個假想品牌的首頁。

### 整頁分成五個區塊

原文的設計稿可以拆成由上而下的五塊。動手前先在腦中把它們分開，一塊一塊做，會比盯著一張空白 HTML 發呆好得多：

1. **Header 與 Hero（頁首與主視覺）**：深色背景。頁首一列，左邊是 logo、右邊是幾個導覽連結。下方的 hero 區左邊是一段大標題（hero text，網頁最上方那句醒目的宣傳語）加一段說明文字與一顆按鈕，右邊放一張圖片（設計稿裡是灰色佔位方塊）。
2. **資訊區（information／features）**：白色背景，正中央一個標題，下面一排四張卡片，每張卡片上面是一個方框圖片、下面是一小段說明文字。
3. **引言區（quote）**：淺灰背景，一段放大的斜體引言，下面右對齊署名。
4. **行動呼籲區（call to action，簡稱 CTA）**：一個藍色的區塊盒，左邊是一段文字、右邊是一顆「Sign up」按鈕。
5. **Footer（頁尾）**：深色背景，一行置中的版權文字。

### 每個區塊會用到的 Flexbox 技巧

- **Header：兩端對齊。** 把頁首設成 `display: flex`，logo 與導覽列就會並排。要讓「logo 靠最左、選單靠最右」，用 `justify-content: space-between`；或在其中一邊加 `margin-left: auto`（auto margin 會吃掉主軸剩餘空間，把後面的東西推到另一端）。導覽連結本身也是一個小 flex container，用 `gap` 撐開彼此的間距。
- **Hero：左右分欄。** 外層一個 `display: flex` 的容器，左欄放文字、右欄放圖片。想讓兩欄各佔一半、平均分配空間，就給兩欄都加 `flex: 1`。`align-items: center` 可讓左右兩欄在交錯軸（垂直方向）上對齊置中。
- **資訊區：一排卡片。** 卡片外層 `display: flex`，四張卡片並排。標題與整區內容置中，可用 `justify-content: center` 搭配固定寬度的卡片，或在外層容器加左右 padding。每張卡片內部（圖片在上、文字在下）則是 `flex-direction: column` 的小 flex container。
- **引言區與 CTA：主軸／交錯軸置中。** 引言用一個有左右留白的容器把文字置中。CTA 的藍色盒子內部用 `display: flex` + `justify-content: space-between` + `align-items: center`，讓左邊文字與右邊按鈕分置兩端、垂直置中。
- **Footer：完美置中。** 一行文字要水平置中，`display: flex` + `justify-content: center` 即可；若要連垂直也置中，再加 `align-items: center`。

### 設計稿的顏色與字型

原文用的是 Roboto 字型，配色如下（抓個大概即可，不必分毫不差）：

| 用途 | 顏色 |
| --- | --- |
| Hero／Footer 深色背景 | `#1F2937` |
| Hero 主標題（大字） | `#F9FAF8`，字重很粗（bold/900），約 48px |
| Hero 說明文字、頁首連結 | `#E5E7EB`，約 18px |
| 按鈕 | `#3882F6`（藍） |
| 資訊區標題 | `#1F2937`，約 36px，字重很粗 |
| 引言區背景 | `#E5E7EB` |
| 引言文字 | `#1F2937`，約 36px，斜體、字重很輕（light/300） |

### 建議的做法

先做 HTML、再做 CSS。也就是先把一個區塊的內容都放到頁面上，再開始調樣式；一邊寫結構一邊調樣式來回切換，反而更花時間、更容易煩躁。一次專心做好一個區塊，做得差不多了再往下一塊。這個專案**不需要做 responsive（響應式）**，先讓它在一般電腦螢幕上好看就好，不同螢幕尺寸的處理之後才學。整份專案用「一個」CSS 檔就夠了。

## 程式碼範例

以下是關鍵版面骨架的最小示範，只示範 header 的兩端對齊與 hero 的左右分欄，讓你看到 Flexbox 怎麼搭起主結構。其餘三個區塊請依同樣的思路自行擴充。

```html
<body>
  <!-- Header 與 Hero 共用深色背景，包在同一個外層裡 -->
  <header class="hero">
    <!-- 頁首：logo 靠左、導覽列靠右 -->
    <nav class="navbar">
      <div class="logo">Header Logo</div>
      <ul class="nav-links">
        <li><a href="#">連結一</a></li>
        <li><a href="#">連結二</a></li>
        <li><a href="#">連結三</a></li>
      </ul>
    </nav>

    <!-- Hero 主視覺：左文字、右圖片 -->
    <div class="hero-main">
      <div class="hero-text">
        <h1>這是一句醒目的大標題</h1>
        <p>下面接一段補充說明的次要文字。</p>
        <button>Sign up</button>
      </div>
      <div class="hero-image">此處放一張圖片</div>
    </div>
  </header>
</body>
```

```css
/* 頁首：整條設成 flex，兩端對齊、垂直置中 */
.navbar {
  display: flex;
  justify-content: space-between; /* logo 靠左、選單靠右 */
  align-items: center;            /* 交錯軸（垂直）置中 */
  padding: 16px 48px;
  background: #1f2937;
}

/* 導覽連結：本身也是一個小 flex container，用 gap 撐開間距 */
.nav-links {
  display: flex;
  gap: 24px;
  list-style: none; /* 拿掉清單的項目符號 */
}

/* Hero 主視覺：左右分欄，各佔一半 */
.hero-main {
  display: flex;
  align-items: center; /* 左右兩欄在垂直方向對齊置中 */
  gap: 48px;
  padding: 96px 48px;
  background: #1f2937;
}

.hero-text,
.hero-image {
  flex: 1; /* 兩欄平均分配空間，各佔一半 */
}

.hero-text h1 {
  color: #f9faf8;
  font-size: 48px;
  font-weight: 900;
}

.hero-text p {
  color: #e5e7eb;
  font-size: 18px;
}

/* 圖片佔位方塊：正式做時把它換成 <img> */
.hero-image {
  background: #6d747d;
  color: #f9faf8;
  padding: 96px 8px;
  text-align: center;
}

button {
  background: #3882f6;
  color: white;
  border: none;
  border-radius: 8px; /* 圓角，可用 Google 查 "css rounded corners" */
  padding: 8px 32px;
}
```

## 常見陷阱

!!! warning "justify-content 與 align-items 搞反"
    這兩個屬性綁的是主軸與交錯軸，不是固定的水平與垂直。預設 `flex-direction: row` 時，`justify-content` 管水平分布、`align-items` 管垂直對齊。想讓 header 的 logo 與選單分置兩端，靠的是主軸上的 `justify-content: space-between`；想讓它們在頁首高度內垂直置中，才是 `align-items: center`。發現「怎麼設都不對」時，先確認目前的 `flex-direction`。

!!! warning "想左右分欄卻忘了在項目上加 flex"
    Hero 的左右兩欄要各佔一半，關鍵是「在兩個子項目上」加 `flex: 1`，讓它們一起成長、平均分配剩餘空間。只在容器上設 `display: flex` 而不管項目，欄寬會由內容自己撐開，通常不會剛好對半。

!!! warning "掉進 responsive 與像素完美的陷阱"
    這個專案明確「不需要」做 responsive，也不追求像素級精準。不要花時間去數每一處的 margin 或調整不同螢幕尺寸；把五個區塊的相對位置排對、在一般電腦螢幕上看起來順眼就達標了。

!!! warning "用了沒有合法授權的網路圖片"
    你沒有權利隨便使用網路上找到的任何圖片。要用免費圖片，請到 [Pexels](https://www.pexels.com/)、[Pixabay](https://pixabay.com/) 或 [Unsplash](https://unsplash.com/) 這類網站找確實可自由使用的素材，並在 repository 的 README 裡註明作者與出處以示尊重。

## 練習

完整的專案需求與設計稿以原文為準：[Project: Landing Page](https://www.theodinproject.com/lessons/foundations-landing-page)。原文提供兩張設計圖（完整版面圖、顏色與字型圖），動手前務必先下載對照。以下是把原文 Assignment 改寫成的繁中步驟。

1. **先設定 GitHub repository。** 如同 Recipes 專案那樣，動工前先建立好 git 儲存庫（例如命名為 `odin-landing-page`），把它 clone 到本機再開始寫。Git 與 GitHub 之後會是你的作品集，養成一切都放進版本控制的習慣。過程中記得**早一點、頻繁地 commit**，有意義的變更就 commit 一次。

2. **下載設計稿、看清楚要做什麼。** 到原文下載兩張設計圖：完整版面圖與「顏色和字型」說明圖。先看懂整頁長什麼樣、用了哪些配色與字級，再動手。

3. **一次做一個區塊，先 HTML 再 CSS。** 整頁分成四個主要區塊加一個 footer。從最上面的 header／hero 開始，先把該區塊的內容都放到頁面上（HTML），再開始調樣式（CSS）；一個區塊做得差不多了，再往下一塊。這一頁的很多元素都和先前的 flexbox 練習很像，卡住時回去翻那些練習當作複習。

4. **不必做 responsive。** 只要在一般電腦螢幕上看起來不錯即可，不用處理手機、縮放或不同螢幕尺寸；也不必追求像素完美，相對位置對了就好。

5. **內容可自由替換。** 設計稿裡是無意義的假文，你可以自己編一個品牌、換上真實的文字、圖片、顏色與字型，把這頁個人化。用圖片時記得挑選有合法授權的素材，並在 README 註明出處。

6. **完成後推上 GitHub 並發佈。** 最後 `git push` 上傳，並依原文（參考 Recipes 專案的說明）用 **GitHub Pages** 把網站發佈到網路，就能把成品連結分享給別人。

小提醒：遇到不會的細節（例如圓角 `border-radius`），儘管 Google——真實工作中，資深工程師也是天天在查這些東西，這很正常。另外先別急著看別人的作品，自己先做完再回頭比較不同做法。

## 原文與延伸資源

- 原文：[Project: Landing Page](https://www.theodinproject.com/lessons/foundations-landing-page)
- 本課引用：
    - [MDN：Flexbox 基本概念](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox)（`display: flex`、主軸／交錯軸、`flex-grow` 的整體觀念）
    - [MDN：Aligning items in a flex container](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Aligning_Items_in_a_Flex_Container)（`justify-content`、`align-items`、`gap` 的完整值與行為）
    - [CSS-Tricks：A Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)（實作時可當速查表）
    - 免費圖片來源：[Pexels](https://www.pexels.com/)、[Pixabay](https://pixabay.com/)、[Unsplash](https://unsplash.com/)
    - [The Odin Project：Project: Recipes](https://www.theodinproject.com/lessons/foundations-recipes)（設定 git repository 與 GitHub Pages 發佈的做法）

---

> 本講義改寫自 The Odin Project《Project: Landing Page》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
