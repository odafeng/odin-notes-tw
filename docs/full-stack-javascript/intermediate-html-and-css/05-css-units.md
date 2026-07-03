---
title: CSS 單位
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-css-units
source_file: vendor/curriculum/intermediate_html_css/intermediate_css_concepts/css_units.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 5
status: draft
generated: 2026-07-03
---

# CSS 單位

> 改寫自 The Odin Project：[CSS Units](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-css-units)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Intermediate CSS Concepts

## 核心概念

在 CSS 裡，只要牽涉到「大小」的屬性 —— `width`、`height`、`margin`、`padding`、`font-size`、`border`、`top`／`left` 等等 —— 你都得替數值挑一個單位（unit）。單位決定了「這個 1 到底代表多長」。CSS 提供的單位多到數不完，但它們可以先分成兩大類：**absolute units（絕對單位）** 與 **relative units（相對單位）**。搞懂這兩類的差別，你就能判斷什麼情境該用哪一個。

### Absolute units（絕對單位）

絕對單位的特色是：**不管放在什麼上下文（context），它的實際長度都固定不變**。最典型的就是 `px`（pixel，像素）。`1px` 永遠是 `1px`，不會因為父元素、字級或視窗大小而改變。

CSS 規範裡其實還有一票絕對單位：`cm`（公分）、`mm`（公厘）、`in`（英吋）、`pt`（point，點）、`pc`（pica，派卡）。它們之間有固定換算關係，例如 `1in = 2.54cm = 96px`、`1pt = 1/72 英吋`。但這些單位是為了**印刷（print）**而生的 —— 在紙上，1 公分就是量得到的 1 公分。到了螢幕上，這些物理單位並沒有實際意義，因為螢幕的實際尺寸與解析度千變萬化。

所以請記住這條實務規則：**在網頁專案裡，唯一你該用的絕對單位是 `px`。** 其餘的絕對單位留給列印樣式表（print stylesheet）就好。

`px` 的優點是精確、可預測。缺點是它「寫死了」—— 如果使用者在瀏覽器設定裡把預設字級調大（很多視力不佳的人會這樣做），用 `px` 定死的文字並不會跟著放大。這正是我們接下來要談相對單位的原因。

### Relative units（相對單位）

相對單位的長度**會根據某個參照值而改變**。同樣寫 `2em`，在不同元素上算出來的實際像素可能完全不同，因為它參照的東西不一樣。這聽起來像缺點，但正是相對單位的威力所在：它讓版面能隨著字級、視窗、父容器一起縮放，做出真正有彈性的響應式（responsive）設計。

實務上最常遇到的相對單位有 `em`、`rem`，以及視窗單位 `vw`、`vh`。

#### em 與 rem

`em` 與 `rem` 本質上都參照某個 **font-size（字級）**，但它們不只能拿來設字級，也常被用來設 `width`、`margin`、`padding` 等其他尺寸。兩者你都會常常看到，所以都要懂；但先給你一條拇指法則（rule of thumb）：**優先用 `rem`。**

**`1em` 等於「該元素自身的 `font-size`」**（如果你正是用 `em` 來設 `font-size`，那就參照「父元素」的 `font-size`）。舉例：某元素的 `font-size` 是 `16px`，那麼把它的 `width` 設成 `4em`，寬度就會是 `16 × 4 = 64px`。

`em` 的麻煩在於**複合累加（compounding）**。因為 `em` 參照的是「一路繼承下來的字級」，當元素層層巢狀，效果會像滾雪球。假設 `html` 字級是 `16px`，而每一層 `<li>` 都設 `font-size: 1.3em`：

- 第一層：`16 × 1.3 = 20.8px`
- 第二層（巢狀在第一層裡）：`20.8 × 1.3 = 27.04px`
- 第三層：`27.04 × 1.3 = 35.15px`

每往下一層，字就被「乘」得更大一次。這通常不是你要的效果，而且很難追蹤除錯。

**`1rem` 則等於「根元素（`:root` 或 `html`）的 `font-size`」。** 計算方式跟 `em` 一樣（`rem` 值 × 根字級），但少了「要一路追著父元素字級跑」的複雜度。同樣是每層 `<li>` 設 `1.3rem`、根字級 `16px`：

- 第一層：`16 × 1.3 = 20.8px`
- 第二層：`16 × 1.3 = 20.8px`
- 第三層：`16 × 1.3 = 20.8px`

不管巢狀多深，全部都是 `20.8px`，乾淨、可預測、不會累加。這就是為什麼一般建議 `rem` 優先。

那 `em` 就完全沒用嗎？也不是。當你希望某個元件內部的尺寸「跟著這個元件自己的字級一起縮放」時，`em` 反而更方便。例如按鈕的 `padding` 用 `em` 來寫，日後只要改按鈕的 `font-size`，內距就會自動等比例調整，整顆按鈕維持協調的比例。換句話說：全站骨架的字級與間距用 `rem` 保持一致，元件內部「要跟著自身字級走」的細節才動用 `em`。

除了 `em`、`rem`，CSS 還有一些較少用但存在的相對單位，例如 `ch`（參照字元「0」的寬度，常用來對齊等寬字）與 `lh`（參照元素的行高）。你現在不必記它們，知道「還有很多相對單位、需要時再查」就夠了。

那為什麼設字級要用相對單位、而不是直接寫 `px`？關鍵在**無障礙（accessibility）**：許多瀏覽器允許使用者自行調整「預設字級」來提升可讀性。當你用 `rem` 定字級時，只要使用者把瀏覽器預設字級從 16px 改成 20px，你整站的文字就會等比例放大，尊重了使用者的意願。但若你把字級寫死成 `px`，使用者的設定就被你無視了。這是選 `rem` 而非 `px` 設 font-size 的核心理由。

#### Viewport units（視窗單位）

`vh` 與 `vw` 參照的是 **viewport（視窗，也就是瀏覽器可視區域）** 的大小：

- `1vh` = 視窗**高度**的 `1%`
- `1vw` = 視窗**寬度**的 `1%`

所以 `height: 100vh` 就是「剛好跟視窗一樣高」，`width: 100vw` 就是「剛好跟視窗一樣寬」。任何你希望「相對於視窗尺寸」的東西都適合用它們，常見情境包括：占滿整個螢幕高度的 hero 區塊（full-height hero）、像 App 一樣鋪滿全螢幕的介面。

還有兩個延伸單位值得認識：`vmin` 取「視窗寬與高之中較小的那個」的 1%，`vmax` 取較大的那個的 1%。當你希望某個元素在直式與橫式螢幕下都維持合理比例時，`vmin` 特別好用。

視窗單位也能做出流動式字級（fluid typography），常搭配 `calc()` 使用，例如 `font-size: calc(16px + 1vw)`：給一個 px 底線再加一點視窗比例，字級就會隨螢幕平緩放大，比純 `vw` 更容易維持可讀性。

**要注意一個常見陷阱**：在部分手機瀏覽器（尤其 iOS Safari）上，`100vh` 的計算不含網址列，當網址列縮起／展開時可視高度會變，導致內容被切掉。純 CSS 要完全解決並不容易，後面「常見陷阱」會再提。

### 百分比（%）

嚴格說 `%` 不算長度單位，但它常被拿來當尺寸用，觀念上也屬於相對值。`%` 參照的是**父元素對應的屬性值**：`width: 50%` 是「父元素寬度的一半」，`font-size: 80%` 是「父元素字級的八成」。它和 `vw` 的差別在於參照對象 —— `%` 看父元素，`vw` 看視窗。想讓某個 div 是父容器的一半寬，用 `50%`；想讓它是視窗的一半寬，就得用 `50vw`。

### 那要怎麼選？

面對 CSS 這麼多單位，別急著背「什麼情況用什麼」的死規則。**每個單位做的事不一樣**，就像寫其他程式碼一樣，先想清楚你希望這個東西「怎麼表現」、你想下達什麼指令，再回頭找哪個單位能幫你做到。

- 想讓某個 margin「跟著根字級一起縮放」→ 用 `rem`。
- 另一個 margin 你就是要它固定不動 → 用 `px`。
- 想讓 div 寬度是父元素的一半 → 用 `%`。
- 想讓另一個 div 是視窗寬的一半 → 用 `vw`。

你短期內不會、也不需要把這些全背起來。需要時再查就好 —— 這個心態適用於整段程式學習之路。

## 程式碼範例

以下是一套常見的實務配置：根元素設好基準字級，全站用 `rem` 維持一致，元件內部視情況用 `em`，大區塊用視窗單位。

```css
/* 根元素設定基準字級；不寫死也可以，瀏覽器預設就是 16px。
   之後所有 rem 都以這個值為基準 */
html {
  font-size: 16px;
}

body {
  font-size: 1rem;   /* 16px */
  margin: 0;
}

h1 {
  font-size: 2rem;   /* 32px：跟著根字級縮放 */
  margin: 1rem 0;    /* 上下各 16px */
}

/* 按鈕內距用 em，讓內距跟著按鈕「自己的字級」一起變。
   之後只要改按鈕 font-size，padding 會自動等比例調整 */
button {
  font-size: 1rem;
  padding: 0.5em 1em;     /* = 8px 16px（以按鈕自身 16px 計） */
  border: 1px solid;      /* 邊框用 px 寫死，維持細緻銳利 */
  border-radius: 0.25em;
}

/* 占滿整個視窗高度的 hero 區塊 */
.hero {
  height: 100vh;
  width: 100%;
}

/* 手機上把根字級調小，全站 rem 值會一起等比例縮小 */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}
```

搭配的 HTML 骨架：

```html
<body>
  <section class="hero">
    <h1>占滿整個螢幕高度的標題</h1>
    <button>看看我</button>
  </section>
</body>
```

重點觀察：改一次 `html { font-size }`，所有 `rem` 就整組跟著變；`button` 的 `padding` 用 `em`，會跟著按鈕自己的字級走；而 `border: 1px` 這種要維持銳利、不該縮放的細節，就用 `px` 寫死。

## 常見陷阱

!!! warning "em 巢狀時會複合累加"
    因為 `em` 參照的是一路繼承下來的字級，層層巢狀時尺寸會被反覆相乘（`1.3em` 疊三層就變成 `1.3 × 1.3 × 1.3` 倍），愈往深處愈大、難以預測。若你只是想要「相對根字級」的穩定縮放，用 `rem` 就能避開這個雪球效應。

!!! warning "用 px 設 font-size 會犧牲無障礙"
    把文字字級寫死成 `px`，會讓瀏覽器「調整預設字級」的設定失效，視力不佳的使用者無法把你的站放大。字級請優先用 `rem`；`px` 留給那些本來就該固定的東西（如 `border`、`box-shadow` 的細節）。

!!! warning "手機上的 100vh 不等於「看得到的高度」"
    在 iOS Safari 等行動瀏覽器上，`100vh` 常不含會伸縮的網址列，導致捲動時內容被裁切到看不見的地方。做全螢幕版面時要留意這點；純 CSS 難以完美解決，較新的做法會改用 `100dvh`（dynamic viewport height，動態視窗高度）等單位來因應。

!!! warning "分不清 % 與 vw 的參照對象"
    `%` 參照的是**父元素**的對應屬性，`vw` 參照的是**視窗**寬度。兩者在頂層元素上算出來可能一樣，一旦放進有寬度的父容器裡就完全不同。想「相對父容器」用 `%`，想「相對整個視窗」才用 `vw`。

## 練習

跟著官方 Assignment 讀完下列材料，把觀念補齊：

1. 閱讀 MDN 的 [CSS values and units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)，它涵蓋了所有可用單位；重點看它用巢狀清單示範 `em`、`rem`、`%` 各自如何計算。
2. 閱讀 Cody Loyd 的〈CSS units〉一文（原文連結見下方延伸資源），深入理解何時該用 `em`、`rem` 或 `px`，特別是「哪些場合 `px` 才是對的選擇」。
3. 閱讀 CSS-Tricks 的 [Fun with Viewport Units](https://css-tricks.com/fun-viewport-units/)，看看 `vh`／`vw` 能玩出哪些有趣效果（全螢幕區塊、流動字級、`vmin`／`vmax`）。

讀完後，試著回答本課的 knowledge check：

- 為什麼設 `font-size` 時會想用 `em` 或 `rem` 而不是 `px`？（提示：無障礙、尊重使用者的瀏覽器預設字級）
- 有哪些情境你會想用 `vh` 與 `vw`？（提示：full-height hero、鋪滿螢幕的 App 式介面）
- 有哪些情境你反而會想用 `px` 而不是相對單位？（提示：`border`、`box-shadow` 等本來就該固定、不需縮放的細節）

## 原文與延伸資源

- 原文：[CSS Units](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-css-units)
- 本課引用：
  - MDN｜[CSS values and units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units) —— 各單位完整說明與計算範例
  - MDN｜[CSS length 值參考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length) —— 所有長度單位一覽
  - CSS-Tricks｜[Fun with Viewport Units](https://css-tricks.com/fun-viewport-units/) —— 視窗單位的實用技巧
  - Cody Loyd｜[CSS units](https://codyloyd.com/2021/css-units/) —— `em`／`rem`／`px` 的取捨深入討論

---

> 本講義改寫自 The Odin Project《CSS Units》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
