---
title: Media Queries
source_url: https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-media-queries
source_file: vendor/curriculum/advanced_html_css/responsive_design/media_queries.md
path: full-stack-javascript
course: Advanced HTML and CSS
order: 15
generated: 2026-07-03
---

# Media Queries

> 改寫自 The Odin Project：[Media Queries](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-media-queries)
> ｜Full Stack JavaScript › Advanced HTML and CSS › Responsive Design

## 核心概念

前面幾課我們把重心放在「讓每個 element 盡量有彈性」：用相對單位、flexbox、grid，讓版面自己伸縮。但有時候光靠彈性還不夠——你會需要在特定的螢幕尺寸下，真正地「改變」某些 CSS 值。這些改變可能很細微，例如調整 margin、padding 或 font-size，把更多內容擠進小螢幕；也可能是明顯的版面重組，例如三欄變單欄。不論改動大小，背後的技術都一樣，那就是 media query（媒體查詢）。

### media query 是什麼

media query 讓你依據使用者裝置或視窗的特徵，「有條件地」套用一組 CSS。最常見的判斷依據是 viewport（可視區域）的寬度。它的基本語法長這樣：

```css
body {
  margin: 24px;
}

@media (max-width: 600px) {
  body {
    margin: 8px;
  }
}
```

上面這段的意思是：預設情況下 `body` 的 margin 是 `24px`；而在寬度「小於或等於」`600px` 的螢幕上，margin 會變成 `8px`。換句話說，超過 `600px` 的螢幕用 `24px`，`600px` 以下用 `8px`。真的就這麼簡單。

要理解 media query，先看它的組成。`@media` 是一個 at-rule（規則指示），後面接一個條件（放在括號內），再接一個 `{ ... }` 區塊。當條件成立時，區塊內的所有 CSS 才會生效；條件不成立時，就當它不存在。因為區塊裡放的是完整的 CSS 規則（selector 加宣告），所以你可以在一個 media query 裡塞進任意多條樣式，一次改動多個 element。

### max-width 與 min-width：兩個方向

上面的例子用的是 `max-width`，它會把樣式套用到「等於或小於」該值的所有螢幕。換個說法：`max-width: 600px` 代表「從 0 一直到 600px」都會套用。

反過來，`min-width` 套用在「等於或大於」指定值的所有螢幕。`min-width: 600px` 代表「600px 以上」都會套用。除了寬度，`max-height` 與 `min-height` 也都是合法的判斷依據，只是實務上依寬度判斷遠比依高度常見。

這兩個方向對應到兩種主流開發策略：

- **desktop-first（桌機優先）**：先寫大螢幕的樣式當基底，再用 `max-width` 逐步覆寫成小螢幕的版面。
- **mobile-first（行動優先）**：先寫小螢幕的樣式當基底，再用 `min-width` 逐步加上大螢幕的版面。

兩種都可行，選一種並保持一致即可。mobile-first 在現代前端較受推崇，因為它逼你先想清楚最精簡的內容，再往上疊。

### breakpoint（斷點）與常見尺寸

「breakpoint」指的是「觸發 media query 的那個螢幕尺寸」。到底該把斷點設在哪，網路上眾說紛紜。與其背誦別人的數字，不如想想你的使用者實際會用什麼裝置：

- 手機通常在 `500px` 以下。
- 平板常落在 `500px` 到 `1000px` 之間。
- `1000px` 以上大多是一般的桌機瀏覽器視窗。
- 超寬螢幕越來越普遍，你的網站甚至可能被放在寬度超過 `2000px` 的螢幕上檢視。

但這「不代表」你該一開始就替每種裝置各寫一個 media query。每個專案的需求都不同，取決於你想達成的設計。很多相對單純的版面，只需要一個大約落在 `500`–`600px` 的行動斷點就夠了。比較複雜的版面，可能會受益於：`1200px` 以上用完整桌機版、`600px` 到 `1200px` 用平板版、`600px` 以下用手機版。真正的重點是：斷點設在哪其實沒那麼要緊，順著你的專案需求做就對了。

### 少即是多：別濫用 media query

雖然理論上你可以替每一種可能的螢幕尺寸都寫一個 media query，但最佳做法是「盡量少用」，多依賴版面本身的天然彈性。一個設計良好的 flexbox 或 grid 版面，往往只要一兩個斷點就能涵蓋從手機到桌機的所有尺寸。如果你發現自己需要一大堆斷點才能讓版面看起來正常，通常代表基礎的彈性版面沒做好，該回頭修基底，而不是一直加 media query 補破洞。

### 縮放會改變「有效解析度」

在多數瀏覽器中，**對網頁放大（zoom in）會改變該頁的有效解析度**。如果你的視窗剛好是 `1000px` 寬，放大之後頁面會表現得「像螢幕變小了」，並依照這個模擬（縮放後）的解析度去觸發 media query。反過來，縮小（zoom out）在除錯時很好用，可以模擬比你自己螢幕更大的畫面。要小心的是：忘了自己已經縮放過，會讓斷點在「不該觸發的地方觸發、該觸發的地方不觸發」，造成莫名其妙的困惑。

### media type：screen 與 print

你常會看到 media query 搭配 `screen` 關鍵字這樣寫：

```css
@media screen and (max-width: 480px) {
}
```

其實這裡的 `screen` 是多餘的——我們目前談的所有東西本來就是給螢幕看的，寫不寫都一樣。但它點出了 media query 的另一項能力：依「media type（媒體類型）」切換樣式。常見的 media type 有三種：`all`（所有裝置，預設值）、`screen`（螢幕）、`print`（印表機與列印預覽）。

`print` 特別有用。你可以替「被送去印表機」或「在列印預覽模式檢視」時準備另一套樣式：

```css
@media print {
  /* 列印時專用的樣式寫這裡 */
}
```

實務上常見的列印調整包括：把顏色改成黑白、用 `display: none` 藏掉在紙上毫無意義的 element（按鈕、導覽連結等）。本課不深入這塊，但知道這個能力存在，某些情境下會派上用場。

### 邏輯運算子：組合多個條件

當你需要同時滿足多個條件時，用 `and` 把它們串起來；`and` 兩側全部成立才生效：

```css
@media screen and (min-width: 600px) and (orientation: landscape) {
  /* 螢幕、寬度 600px 以上、且橫向時才套用 */
}
```

用「逗號」分隔多個查詢時，代表「或」（OR）——任一個成立就生效：

```css
@media (max-width: 600px), (orientation: portrait) {
  /* 寬度 600px 以下「或」直向時就套用 */
}
```

`not` 會反轉整個查詢的結果，`only` 是給非常老舊瀏覽器用的舊語法，現代瀏覽器可忽略。除了尺寸，media feature（媒體特徵）還有很多實用的選項，例如 `orientation`（直向 portrait／橫向 landscape）、`prefers-color-scheme`（使用者偏好的深淺色模式）、`prefers-reduced-motion`（使用者是否偏好減少動畫）、`hover` 與 `pointer`（裝置是否支援懸停、指標是否精準）。這些讓你不只回應「螢幕多大」，還能回應「使用者是什麼樣的使用者」。

### 現代的 range 語法

新的 CSS 規範提供了更直覺的「範圍（range）」寫法，用比較運算子取代 `min-`／`max-` 前綴：

```css
/* 等同 max-width: 600px */
@media (width <= 600px) {
}

/* 等同 min-width: 600px */
@media (width >= 600px) {
}

/* 介於 600px 到 900px 之間（含端點）*/
@media (600px <= width <= 900px) {
}
```

現代瀏覽器都已支援這種寫法，讀起來比 `min-width` 加 `max-width` 兩段更清楚。新舊語法可以並存，選你團隊看得順的即可。

### container query：以「容器」為判斷依據

media query 依據的是 viewport 或裝置等「全域」特徵；而 **container query（容器查詢，`@container`）** 讓你改成依據某個「容器 element」的特徵來套用樣式。這個差別很關鍵：同一個卡片元件，放在寬闊的主內容區時想橫向排列、塞進窄窄的側邊欄時想改成直向堆疊——用 media query 很難優雅處理，因為 viewport 一樣寬，但卡片所在的容器寬度不同。container query 正是為了這種「元件層級的響應式」而生。

用法分兩步。第一步，在父元素上用 `container-type` 宣告它是一個「containment context（可查詢的容器）」：

```css
.card-wrapper {
  container-type: inline-size; /* 依容器的行內尺寸（水平書寫下即寬度）查詢 */
}
```

第二步，用 `@container` 依這個容器的尺寸套用樣式：

```css
@container (min-width: 400px) {
  .card {
    display: flex; /* 容器夠寬時，卡片內部改成橫向排列 */
  }
}
```

觀念上跟 media query 幾乎一樣，只是把判斷對象從「viewport」換成「最近的容器」。語法上有一些細節差異（例如可用 `container-name` 替容器命名，再用 `@container 名稱 (條件)` 精準指定；也有 `cqi`、`cqw` 等以容器尺寸為基準的長度單位），但核心概念是共通的。哪些樣式該用 media query、哪些該用 container query，取決於「你想根據什麼來變化」：跟整個頁面版面有關就用 media query，跟元件自身可用空間有關就用 container query。

## 程式碼範例

下面是一個最小可執行的完整頁面，示範最常見的「寬螢幕多欄、窄螢幕單欄」響應式版面。把它存成 `index.html`，用瀏覽器打開後，拖曳視窗邊緣改變寬度，就能看到版面在 `600px` 斷點前後切換。

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <!-- 這行不可省略：告訴行動瀏覽器用裝置實際寬度，media query 才會正確觸發 -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Media Query 示範</title>
  <style>
    body {
      margin: 24px;          /* 大螢幕預設：較寬的外距 */
      font-family: sans-serif;
    }

    .layout {
      display: flex;         /* 預設：主內容與側邊欄橫向並排 */
      gap: 16px;
    }

    .main    { flex: 3; background: #dbeafe; padding: 16px; }
    .sidebar { flex: 1; background: #fef3c7; padding: 16px; }

    /* 斷點：寬度 600px 以下改成單欄堆疊 */
    @media (max-width: 600px) {
      body {
        margin: 8px;         /* 小螢幕：縮小外距，多留內容空間 */
      }

      .layout {
        flex-direction: column; /* 從橫向並排改成直向堆疊 */
      }
    }
  </style>
</head>
<body>
  <div class="layout">
    <div class="main">主內容區：把視窗調寬會在右側看到側邊欄。</div>
    <div class="sidebar">側邊欄：視窗變窄（600px 以下）時會移到下方。</div>
  </div>
</body>
</html>
```

若要體驗 container query，把上面的 `.sidebar` 想成一個可重用元件：只要在它的父層加上 `container-type: inline-size`，並用 `@container (min-width: ...)` 取代 `@media`，這個元件就會依「自己所在容器的寬度」而非「整個視窗寬度」來變化。

## 常見陷阱

!!! warning "忘了加 viewport meta 標籤"
    行動瀏覽器預設會假裝自己是一個約 `980px` 寬的桌機螢幕，再把整頁縮小塞進手機畫面。結果就是你的 `max-width` media query 在手機上「完全不觸發」，版面看起來跟桌機一樣只是被縮小。務必在 `<head>` 加上 `<meta name="viewport" content="width=device-width, initial-scale=1.0">`，media query 才會依裝置實際寬度運作。

!!! warning "斷點開太多、變成補破洞"
    每加一個 media query，維護成本就上升一分。如果你需要五六個斷點才能讓版面正常，通常代表基礎的 flexbox／grid 彈性沒做好。先把彈性版面修好，讓它在大部分尺寸自動適應，再用「最少」的斷點處理真正需要重排的地方。

!!! warning "被瀏覽器縮放誤導"
    放大或縮小網頁會改變「有效解析度」，進而讓斷點在意料之外的地方觸發或不觸發。除錯時若發現斷點行為怪異，先把縮放重設回 100%（多數瀏覽器按 `Ctrl/Cmd + 0`）再看。

!!! warning "把 max-width 與 min-width 的邊界搞混"
    `max-width: 600px` 在「600px 及以下」成立，`min-width: 600px` 在「600px 及以上」成立——兩者在剛好 `600px` 時「都會」成立。若你同時寫了這兩段又給了衝突的值，`600px` 這個交界點的實際結果會由 CSS 層疊（後定義者覆蓋）決定，容易造成一像素的閃動。設計相鄰斷點時，讓它們的邊界明確錯開，或善用現代 range 語法的嚴格比較（`<`、`>`）避免重疊。

## 練習

1. 打開 MDN 的 [Using media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) 一頁通讀一遍。裡面還有一些本課沒細談、但值得知道的用法（各種 media feature、`not`／`only`、range 語法等），雖然日常使用頻率較低，但看過一輪能建立完整的心智地圖。
2. 動手改寫上面「程式碼範例」的頁面：新增第二個斷點（例如 `1200px`），讓版面在超寬螢幕時放大字級或加寬留白，驗證兩個斷點是否各自在正確的寬度觸發。
3. 進階（選做）：把 `.sidebar` 改造成 container query 版本——在其父層加上 `container-type: inline-size`，用 `@container` 讓側邊欄依「容器寬度」而非「視窗寬度」變化，親手體會兩者的差異。

## 原文與延伸資源

- 原文：[Media Queries](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-media-queries)
- 本課引用：[MDN — Using media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)
- 延伸閱讀：[MDN — Container queries（`@container`）](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)

---

> 本講義改寫自 The Odin Project《Media Queries》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
