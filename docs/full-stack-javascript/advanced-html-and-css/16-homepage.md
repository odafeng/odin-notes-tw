---
title: 專案：Homepage
source_url: https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-homepage
source_file: vendor/curriculum/advanced_html_css/responsive_design/project_homepage.md
path: full-stack-javascript
course: Advanced HTML and CSS
order: 16
status: draft
generated: 2026-07-03
---

# 專案：Homepage

> 改寫自 The Odin Project：[Project: Homepage](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-homepage)
> ｜Full Stack JavaScript › Advanced HTML and CSS › Responsive Design

## 核心概念

這是 Advanced HTML and CSS 課程的最後一個 HTML/CSS 專案。你要做的是一個 responsive（響應式）的個人首頁（homepage），類似 portfolio（作品集）網站上會看到的那種頁面。之後當你想分享作品或應徵工作時，一個設計良好的 portfolio 會很有用。這個專案的重點不是做出完整的作品集，而是「把先前學到的響應式技巧綜合練習一次」。

### 專案目標

跟之前的 landing page 與 admin dashboard 專案一樣，這次一樣是「照著設計稿（design brief）做出來」。原課程提供了**同一個設計的三種尺寸版本**：

- **desktop（桌機）**：最寬的版面
- **tablet（平板）**：中間尺寸
- **mobile（手機）**：最窄的版面

你的任務有兩個層次：

1. **在各自的 viewport（視窗）下，盡量貼近對應的設計稿**。桌機寬度看起來要像桌機稿、手機寬度看起來要像手機稿。
2. **在 320px 到 1920px 之間的任何寬度，版面都不能壞掉**。也就是說，除了三個「定點」對得上，中間過渡的每個寬度也要看起來合理、不破版。

字型、顏色、header 的圖片都可以換成你自己喜歡的（不一定要用 stock photo）。真正被評估的是**版面配置（layout）與響應式行為**，而不是內容本身是否是真實作品。

### 這個專案在練什麼

這一課沒有新知識點，它是一次「總複習」。你會用到前面幾課學過的所有工具：

- **Flexbox 與 Grid**：header、專案卡片區、聯絡資訊區各自適合不同的排版工具。專案區這種「多張等寬卡片、換行對齊」的格線，通常用 CSS Grid 最省事；header 這種「圖片一邊、文字一邊」的兩欄，用 Flexbox 很直覺。
- **相對單位（relative units）**：用 `rem`、`%`、`fr`、`vw` 等，而不是把每個尺寸都寫死成 `px`。相對單位讓版面能隨字級與視窗縮放。
- **`max-width` 與 `min()` / `clamp()`**：限制內容區塊不要在大螢幕上被拉得太寬，同時在小螢幕上能自然收窄。
- **Media queries（媒體查詢）**：在特定寬度切換版面，例如桌機的三欄到手機時變成一欄。
- **響應式圖片**：`max-width: 100%` 搭配 `height: auto`，避免圖片溢出容器或變形。
- **Web fonts（網頁字型）**：從 Google Fonts 載入字型並套用。

### 設計稿用到的資源

原設計用了這些素材，你可以照用，也可以換成自己的：

- **字型**：`Playfair Display`（標題用的襯線字）與 `Roboto`（內文用的無襯線字），兩者都在 Google Fonts 免費提供。
- **人像照片**：設計稿的人像是從 [pexels.com](https://www.pexels.com/) 下載的 stock photo。手邊沒有自己的照片，用 placeholder（佔位圖）先頂著即可。
- **社群 icon**：GitHub、LinkedIn、X（前身為 Twitter）的圖示來自 [devicon.dev](https://devicon.dev/)。
- **其他 icon**：電話、email、外部連結等圖示是從 [Material Design Icons](https://materialdesignicons.com/) 下載的 SVG。

### 建議的做法：由大到小、由上到下

原課程作者分享了他覺得最順的節奏，供你參考：

1. **先切大區塊**：先把 header、專案區、聯絡區這些大段落擺到「差不多對的位置」，先不管細節樣式與確切文字內容。
2. **再由上往下填內容、上樣式、收尾**。這樣能避免一開始就陷在某個按鈕的 padding 上，卻遲遲搭不出整體骨架。

至於**響應式什麼時候做、怎麼做都可以**，只要 320px 到 1920px 之間不破版就行。有人主張 **mobile-first（行動優先）**：先寫好手機版，再用 media query 讓版面「往外長」到平板、桌機。mobile-first 確實有它的好處（值得你去查一下為什麼），但最終「怎麼達成」不重要，重要的是「有沒有做到」。

## 程式碼範例

下面是一個最小可執行的響應式首頁骨架，示範 header 兩欄、專案區格線、以及一個 media query。你可以在這個基礎上長成完整的頁面。

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <!-- 響應式必備：告訴瀏覽器用裝置實際寬度當作 viewport 寬度 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="styles.css" />
    <title>我的首頁</title>
  </head>
  <body>
    <!-- Header：左文字、右圖片的兩欄 -->
    <header class="hero">
      <div class="hero__text">
        <h1>你好，我是某某某</h1>
        <p>前端開發者，喜歡把設計稿變成能用的網頁。</p>
      </div>
      <img class="hero__img" src="portrait.jpg" alt="我的照片" />
    </header>

    <!-- 專案區：多張等寬卡片 -->
    <main>
      <h2>我的作品</h2>
      <div class="projects">
        <article class="card">專案一</article>
        <article class="card">專案二</article>
        <article class="card">專案三</article>
      </div>
    </main>
  </body>
</html>
```

```css
/* styles.css */

/* 用相對單位當基準，方便整頁縮放 */
:root {
  --gap: 2rem;
}

body {
  margin: 0;
  font-family: "Roboto", sans-serif; /* 內文字型 */
  line-height: 1.5;
}

h1,
h2 {
  font-family: "Playfair Display", serif; /* 標題字型 */
}

/* Header：Flexbox 兩欄，內容置中並限制最大寬度 */
.hero {
  display: flex;
  align-items: center;
  gap: var(--gap);
  max-width: 1100px; /* 大螢幕上不讓內容被拉太寬 */
  margin: 0 auto; /* 水平置中 */
  padding: var(--gap);
}

.hero__text {
  flex: 1; /* 文字欄佔滿剩餘空間 */
}

/* 響應式圖片：不溢出、不變形 */
.hero__img {
  width: 40%;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

/* 專案區：用 Grid 自動排出等寬卡片並自動換行 */
.projects {
  display: grid;
  /* 每張卡片最小 250px，空間夠就塞更多欄，不夠就換行 */
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--gap);
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 var(--gap);
}

.card {
  aspect-ratio: 4 / 3;
  background: #eee;
  border-radius: 8px;
  padding: 1rem;
}

/* Media query：視窗窄於 600px 時，header 改為單欄（上下堆疊） */
@media (max-width: 600px) {
  .hero {
    flex-direction: column;
    text-align: center;
  }

  .hero__img {
    width: 100%;
  }
}
```

重點提示：`repeat(auto-fill, minmax(250px, 1fr))` 這一行讓專案區在不寫任何 media query 的情況下就能自動響應——空間變窄時欄數自動減少。很多版面其實不需要一堆 media query，善用 Grid 與相對單位就能自然過渡。

## 常見陷阱

!!! warning "忘了加 viewport meta 標籤"
    如果 `<head>` 裡沒有 `<meta name="viewport" content="width=device-width, initial-scale=1.0">`，手機瀏覽器會假裝自己是一個很寬的桌機螢幕再縮小顯示，你的 media query 幾乎都不會生效，畫面會變成「桌機版縮小」而不是真正的手機版。這是響應式最常見的第一個坑。

!!! warning "只顧三個定點，忽略中間寬度"
    設計稿只給你三個尺寸，但評分標準是 320px 到 1920px「之間任何寬度都不能破版」。很多人把三個斷點對得完美，卻在例如 700px 這種「不上不下」的寬度出現文字擠成一團、圖片溢出、卡片重疊。做完後請務必拖動瀏覽器邊緣，從最窄慢慢拉到最寬，全程檢查一次。

!!! warning "把尺寸全部寫死成 px"
    如果每個寬度、字級、間距都用固定 `px`，版面就失去彈性，稍微換個視窗就破。盡量用 `rem`、`%`、`fr`、`clamp()` 這類相對單位，讓版面能隨視窗與字級一起縮放。

!!! warning "圖片沒有設 max-width 導致溢出"
    圖片預設會以原始像素寬度顯示，在小螢幕上會撐破容器、逼出水平捲軸。記得對圖片加上 `max-width: 100%; height: auto;`，讓它最多只到容器寬度並維持比例。

## 練習

這是一個 project（專案）課，請動手把整個首頁做出來。以下把原課程的 Assignment 改寫成繁中步驟：

**第一步：初始設定與規劃**

1. 建好 HTML 與 CSS 檔案，先放一點 dummy content（假內容），確認兩者正確連結、樣式有套上。
2. 下載三份全解析度設計稿（desktop、tablet、mobile），大致想好每個區塊在 HTML 裡要怎麼安排。設計稿連結請見原文。

**第二步：蒐集素材**

1. 準備人像照片。沒有自己的照片就先用 placeholder。
2. 選字型。設計稿用的是 `Playfair Display` 與 `Roboto`，都可從 Google Fonts 取得。
3. 準備社群 icon（GitHub、LinkedIn、X），設計稿用的是 [devicon.dev](https://devicon.dev/) 的圖示。你也可以換成自己想放的連結。
4. 準備其他 icon（電話、email、外部連結），設計稿是從 [Material Design Icons](https://materialdesignicons.com/) 下載的 SVG。

**第三步：實作小提示**

1. 版面怎麼組織都可以，你已經有能力從一張白紙開始。
2. 若想要有明確步驟：先切大區塊（header、專案、聯絡等）擺到大致正確的位置，先忽略細節；再由上往下逐段填內容、上樣式、收尾。
3. 響應式什麼時候做都行，只要 320px 到 1920px 之間不破版。可以考慮 mobile-first 的做法（先寫手機版再往外擴），但不強制。
4. 完成後別忘了推上 GitHub，並用 GitHub Pages 發佈到線上。

完整的設計稿圖片、素材連結與回饋表單，請回到原文查看。

## 原文與延伸資源

- 原文：[Project: Homepage](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-homepage)
- 本課引用：
  - Google Fonts（字型 `Playfair Display`、`Roboto`）
  - [Pexels](https://www.pexels.com/)（免費 stock photo）
  - [Devicon](https://devicon.dev/)（社群平台 icon）
  - [Material Design Icons](https://materialdesignicons.com/)（電話、email、外部連結等 SVG icon）
  - GitHub Pages（免費靜態網站發佈）

---

> 本講義改寫自 The Odin Project《Project: Homepage》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
