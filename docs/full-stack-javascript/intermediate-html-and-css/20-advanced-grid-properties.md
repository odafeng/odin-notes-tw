---
title: 進階 Grid 屬性
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-advanced-grid-properties
source_file: vendor/curriculum/intermediate_html_css/grid/advanced_grid_properties.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 20
status: draft
generated: 2026-07-03
---

# 進階 Grid 屬性

> 改寫自 The Odin Project：[Advanced Grid Properties](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-advanced-grid-properties)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Grid

## 核心概念

到目前為止，你已經會建立 grid、調整 track（軌道）大小、把 grid item（格線項目）放到指定的行與列。這些工具足以做出任何**靜態**版面，但當你希望版面能隨容器大小自動伸縮、更有彈性、更能重複套用時，就需要本課介紹的進階屬性。以下所有觀念都圍繞一個主題：讓 grid 從「固定尺寸」走向「動態尺寸」。

先釐清兩個貫穿全文的詞：**static（靜態）** 指固定死的尺寸，例如 `150px`，不管容器怎麼變它都不變；**dynamic（動態）** 指會依可用空間伸縮的尺寸，例如 `1fr` 或百分比。本課的目的，就是把靜態的 grid 改寫成動態的、能自動回應（responsive）容器變化的 grid。

### repeat()：不用手打每一條軌道

要做出五欄兩列，最原始的寫法是把每一條軌道的尺寸都列出來：

```css
.grid-container {
  grid-template-rows: 150px 150px;
  grid-template-columns: 150px 150px 150px 150px 150px;
}
```

只有 2×5 還好，但想像一個要容納上百個項目的 grid，這樣打會很痛苦。`repeat()` 就是為此而生。它接受兩個東西：**重複次數**，以及**要重複的軌道尺寸**。上面的寫法可以濃縮成：

```css
.grid-container {
  grid-template-rows: repeat(2, 150px);
  grid-template-columns: repeat(5, 150px);
}
```

`repeat(5, 150px)` 讀作「重複五次 `150px`」，等同於 `150px 150px 150px 150px 150px`。你也可以只讓部分軌道用 `repeat()`，其餘照舊手寫，兩種寫法能自由混用。

### fr 單位：分配「剩餘空間」

`fr`（fractional unit，分數單位）是把 grid **剩下的空間**切成幾份來分配的單位。假設一個四欄 grid 總寬 `400px`，四欄都設 `1fr`，那麼每欄各拿「一份」，也就是 `100px`。關鍵在於：`fr` 分的是「剩餘空間」，不是固定像素——當容器變寬變窄，欄位會跟著等比例伸縮。

`fr` 也可以做**不均等**分配。例如把五欄的前兩欄設 `2fr`、後三欄設 `1fr`：

```css
grid-template-columns: repeat(2, 2fr) repeat(3, 1fr);
```

前兩欄每欄拿到的空間會是後三欄的兩倍。總份數是 `2 + 2 + 1 + 1 + 1 = 7` 份，前兩欄各拿 `2/7`，後三欄各拿 `1/7`。你也能把靜態單位（`px`）和動態單位（`fr`）混用，例如某欄固定 `150px`、其餘用 `1fr` 瓜分剩下的寬度。

當你把 grid 拉到最大時，`fr` 撐開的項目沒有上限；但拉到最小時會停在一個界線，那是項目在不溢出（overflow）前能縮到的最小尺寸，也就是內容的 `min-content` 值。這說明 `fr` 雖然動態，卻缺少「明確的最小與最大界線」——這正是接下來幾個函式要補上的。

### min() 與 max()：取最小值與最大值

`min()` 回傳所有引數中**最小**的那個，`max()` 回傳**最大**的那個。例如 `min(100px, 200px)` 永遠是 `100px`，`max(100px, 200px)` 永遠是 `200px`。引數要幾個都行。

只給靜態值其實沒意義（結果永遠固定），威力來自**混入動態值**：

```css
.grid-container {
  grid-template-rows: repeat(2, min(200px, 50%));
  grid-template-columns: repeat(5, max(120px, 15%));
}
```

`min(200px, 50%)` 會即時比較「容器高度的 50%」與「`200px`」，取較小者——效果等於替這條列軌道設了一個 **max-height（最大高度）`200px`**：平常隨容器縮放為 50%，但一旦超過 `200px` 就封頂。反過來 `max(120px, 15%)` 取容器寬度 15% 與 `120px` 的較大者——效果等於設了一個 **min-width（最小寬度）`120px`**：欄再怎麼縮也不會低於 `120px`。

一個直覺的記法：`min()` 拿來設「上限」，`max()` 拿來設「下限」，聽起來反直覺，但因為它取的是較小／較大者，效果剛好相反。

### minmax()：一次給最小與最大

`minmax()` 是 **Grid 專用**的函式，只能用在 `grid-template-columns`、`grid-template-rows`、`grid-auto-columns`、`grid-auto-rows` 這四個屬性上。它接受兩個引數：**最小尺寸**與**最大尺寸**。

```css
.grid-container {
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(5, minmax(150px, 200px));
}
```

每一欄會隨容器伸縮，但縮到 `150px` 就不再縮、長到 `200px` 就不再長，被牢牢夾在這個區間內。和 `min()`／`max()` 不同，`minmax()` 兩個引數都用靜態值是有意義的（一個當地板、一個當天花板）。

依 MDN 說明有兩個重點：`fr` 這種 flex 單位**只能放在 max 位置**，不能當 min；若 max 小於 min，max 會被忽略、整個 `minmax()` 退化成只有 min。稍後的響應式範例會用到 `minmax(150px, 1fr)`——最小 `150px`、最大則彈性瓜分剩餘空間。

### clamp()：最小、理想、最大三選一

`clamp()` 語法是 `clamp(最小值, 理想值, 最大值)`。它不是 Grid 專用，任何 CSS 屬性都能用。運作方式：讓元素依「理想值」伸縮，但碰到最小或最大門檻就停住。

慣例上「理想值」放動態值、最小與最大放靜態值（雖然也可以都放動態值）：

```css
.non-grid-example {
  width: clamp(500px, 80%, 1000px);
}
```

這個元素寬度平常是父層的 80%，但不會低於 `500px`、也不會高於 `1000px`。放進 grid 也一樣：

```css
.grid-container {
  grid-template-columns: repeat(5, clamp(150px, 20%, 200px));
}
```

每欄維持容器寬度的 20%，直到撞上 `150px` 下限或 `200px` 上限。`clamp()` 和 `minmax()` 都是讓 grid 更響應式、同時避免在極端尺寸下版面崩壞的利器——處理容易溢出的圖片時尤其重要。可以把 `clamp(a, b, c)` 想成 `max(a, min(b, c))` 的簡寫。

### auto-fit 與 auto-fill：欄數自動決定

前面的欄數都是我們寫死的。`auto-fit` 和 `auto-fill` 是 `repeat()` 的特殊值，能讓**欄數依容器大小自動決定**。依 W3C 規格，兩者都會回傳「在不溢出容器的前提下，能塞下的最大正整數」條軌道。

```css
.example {
  display: grid;
  width: 1000px;
  grid-template-columns: repeat(auto-fit, 200px);
}
```

容器寬 `1000px`、每欄 `200px`，只要項目夠多就會排成五欄。真正的魔法是搭配 `minmax()`：

```css
.grid-container {
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
```

拆解 `repeat(auto-fit, minmax(150px, 1fr))` 的運作：瀏覽器先量出 grid **內容區（content box，不含 margin、border、padding）** 的寬度，假設是 `500px`；接著用 `minmax()` 的**最小值 `150px`** 去算最多能塞幾欄（`500 ÷ 150` → 三欄）；決定欄數後，再把每欄放大到 `minmax()` 允許的**最大值 `1fr`**，於是三欄均分空間。容器一縮放，這串計算就即時重跑，欄數與欄寬同步變化。這是最經典的響應式 grid 寫法，不需要任何 media query（媒體查詢）。

### auto-fit 與 auto-fill 的差別

多數情況兩者表現一模一樣，差別只在**項目數量不足以填滿一整列**時。當 grid 被拉寬到「還能再多塞一欄、但已經沒有項目可放」的臨界點：

- **`auto-fit`**：把多出來的空軌道**收合（collapse）**，讓現有項目繼續撐大到 max 尺寸，佔滿整列。
- **`auto-fill`**：**保留**那些空軌道，現有項目會縮回 min 尺寸、把位置讓給那條看不見的空欄，即使根本沒有項目要渲染。容器再變寬時，項目又長到 max、然後再縮回 min，如此循環。

用一句話記：`auto-fit` 讓內容填滿、不留空欄；`auto-fill` 會保留空欄、維持格線結構。想做「卡片鋪滿一整排」的響應式版面，通常選 `auto-fit`。

## 程式碼範例

以下是一個可直接執行、不需 media query 的響應式卡片牆。把它存成 `.html` 開啟，縮放瀏覽器視窗即可看到欄數自動變化。

```html
<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <style>
    .grid-container {
      display: grid;
      /* 每欄最小 150px、最大彈性瓜分剩餘空間；欄數由容器寬度自動決定 */
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;             /* 建立格線之間的間隙 */
      padding: 12px;
    }
    .grid-item {
      background-color: #cfe8ff;
      border: 2px solid #4a90d9;
      padding: 24px;
      text-align: center;
      font-family: sans-serif;
    }
  </style>
</head>
<body>
  <div class="grid-container">
    <div class="grid-item">1</div>
    <div class="grid-item">2</div>
    <div class="grid-item">3</div>
    <div class="grid-item">4</div>
    <div class="grid-item">5</div>
    <div class="grid-item">6</div>
  </div>
</body>
</html>
```

想觀察本課各函式的差異，只要替換 `grid-template-columns` 一行：

```css
/* repeat 濃縮寫法：五欄各 150px */
grid-template-columns: repeat(5, 150px);

/* fr 不均等分配：前兩欄各拿後三欄的兩倍空間 */
grid-template-columns: repeat(2, 2fr) repeat(3, 1fr);

/* minmax 夾在區間內：每欄不小於 150px、不大於 200px */
grid-template-columns: repeat(5, minmax(150px, 200px));

/* clamp 三段式：理想 20%，被夾在 150px 與 200px 之間 */
grid-template-columns: repeat(5, clamp(150px, 20%, 200px));
```

## 常見陷阱

!!! warning "fr 只能放在 minmax() 的 max，不能當 min"
    `minmax(1fr, 200px)` 是無效的——`fr` 這類 flex 單位只允許出現在 `minmax()` 的**第二個（最大值）**引數。最小值請用 `px`、`%`、`min-content` 等具體尺寸。另外若你不小心寫成 max 比 min 還小（例如 `minmax(300px, 200px)`），瀏覽器會直接忽略 max，整個函式退化成只剩 min。

!!! warning "min() 設上限、max() 設下限，方向容易搞反"
    直覺會以為「要設最小寬度就用 `min()`」，其實相反。`min(120px, 15%)` 取較小者，等於封住**上限**；要替欄位設**下限（最小寬度）**，得用 `max(120px, 15%)` 取較大者。寫的時候先問自己「我要的是地板還是天花板」，再選函式。

!!! warning "auto-fit 與 auto-fill 在項目不足時才看得出差異"
    當項目多到填滿整列時，兩者結果完全一樣，很容易誤以為可以互換。它們的分歧只在「容器還能再塞一欄、但已無項目」時才出現：`auto-fit` 收合空欄讓現有項目撐大，`auto-fill` 保留空欄讓項目縮回最小值。做卡片牆通常要的是 `auto-fit`，用錯會看到卡片旁邊莫名留下大片空白。

!!! warning "auto-fit/auto-fill 算欄數看的是內容區寬度"
    瀏覽器計算能塞幾欄時，用的是 grid 的 **content box** 寬度，也就是**扣掉** `padding` 與 `border` 之後的區域。如果欄數跟你預期差一欄，先檢查容器的 `padding`，別只盯著 `width`。

## 練習

<div class="lesson-content__panel" markdown="1">

1. 閱讀 [CSS-Tricks Grid Layout Guide](https://css-tricks.com/css-grid-layout-guide) 中的「CSS Grid Properties」、「Special Units, Values, & Functions」與「Subgrid」三個段落，補齊本課的屬性全貌。
2. 玩 [CSS Grid Garden](https://cssgridgarden.com/) 的第 18 到 28 關，實地練習項目定位。
3. 完成 The Odin Project 的 [css-exercises 儲存庫 `intermediate-html-css/advanced-grid` 目錄](https://github.com/TheOdinProject/css-exercises/tree/main/intermediate-html-css/advanced-grid) 練習（指示寫在各資料夾的 README），依下列順序：
   - `01-responsive-holy-grail`
   - `02-holy-grail-mockup`

   提醒：做這些練習時，儘管查閱任何文件與資源。此階段**不需要**把這些屬性背起來，查 MDN、Google、做任何你需要做的事（除了偷看解答）都可以。

</div>

## 原文與延伸資源

- 原文：[Advanced Grid Properties](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-advanced-grid-properties)
- 本課引用：
  - [MDN：minmax()](https://developer.mozilla.org/en-US/docs/Web/CSS/minmax)
  - [MDN：grid-template-columns（含 repeat、auto-fit、auto-fill）](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns)
  - [MDN：min-content 關鍵字](https://developer.mozilla.org/en-US/docs/Web/CSS/min-content)
  - [CSS-Tricks：A Complete Guide to CSS Grid](https://css-tricks.com/css-grid-layout-guide)
  - [W3C：CSS Grid 規格 auto-fill / auto-fit 段落](https://www.w3.org/TR/css-grid-1/#auto-repeat)

---

> 本講義改寫自 The Odin Project《Advanced Grid Properties》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
