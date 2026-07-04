---
title: 框架與預處理器
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-frameworks-and-preprocessors
source_file: vendor/curriculum/intermediate_html_css/intermediate_css_concepts/frameworks_and_preprocessors.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 13
generated: 2026-07-03
---

# 框架與預處理器

> 改寫自 The Odin Project：[Frameworks and Preprocessors](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-frameworks-and-preprocessors)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Intermediate CSS Concepts

## 核心概念

到目前為止，你已經寫了不少純手工的 HTML 與 CSS（在英文語境常稱為 vanilla CSS，意思是「原生、未經任何工具加工的 CSS」），也學會許多版面設計技巧。在瀏覽資料時，你大概會反覆遇到兩個名詞：CSS framework（框架）與 CSS preprocessor（預處理器，又稱 precompiler 預編譯器）。這兩類工具的共同目的，都是讓寫 CSS 更有效率、更少重複勞動。

要先講清楚一個重要立場：**這個階段的你，專案應該繼續用 vanilla CSS。** 所有的 framework 與 preprocessor 都是「建立在 CSS 之上」的東西，基礎打得夠穩，將來要學任何一種、或在不同工具之間切換，都會輕鬆很多；反過來，太早依賴工具而跳過基本功，長期反而吃虧。這一課的目標不是教你上手某個工具，而是讓你「知道它們是什麼、能解決什麼問題、將來需要時去哪裡找」，這樣面試被問到、或進職場看到既有專案在用，你都不會一頭霧水。

### 什麼是 CSS framework（框架）

framework 本質上就是**一包別人已經寫好、你可以直接取用的 CSS**。你不必自己刻樣式，只要在 HTML 元素上掛對框架定義好的 class，樣式就會套上去。例如許多框架都提供一個 `.btn` class，你把它加到 `<button>` 上，按鈕該有的內距、圓角、顏色、hover 效果就一次到位，你完全不用寫任何一行 CSS。

不同框架有不同的取向，大致可分兩派：

- **元件式（component-based）框架**，代表是 [Bootstrap](https://getbootstrap.com/)。它把常用的 UI 元件（按鈕、導覽列、卡片、下拉選單，甚至圖示與互動行為）整包打包好，替你扛掉「刻出直覺、可重複使用、又響應式的元件」這件苦差事。你依照它規定的 HTML 結構和 class 名稱組裝頁面即可。同類還有 [Bulma](https://bulma.io/) 與 [Foundation](https://get.foundation)。
- **工具類（utility-first）框架**，代表是 [Tailwind](https://tailwindcss.com/)。它想改變的是「你套用 CSS 的方式」：提供大量預先命名好的 class，而每個 class 通常只對應一行 CSS（例如 `p-4` 就是 padding、`text-center` 就是文字置中）。你透過在 HTML 裡組合這些小 class 來拼出樣式。

不論哪一派，使用框架的前提都一樣：你得先搞懂它期待你怎麼組織 HTML、以及它用哪些 class 來套樣式。

框架能讓你**快速做出可用、互動良好的介面**，這是它最大的賣點。但它也有代價：

- **同質化**：看多了熱門框架的成品，你會發現網路上一大票網站長得很像，因為大家都用同一套框架。
- **太早學會拖累基本功**：不必練習寫 vanilla CSS 很誘人，於是很多新手太早跳進框架，結果 CSS 基礎不夠扎實。
- **除錯與覆寫很痛**：一旦要覆寫框架的樣式、或排查版面問題，基礎不夠的人會非常吃力。你必須理解框架「底層在做什麼」，將來才有能力處理這些狀況（而你一定會遇到）。
- **難以抽身**：專案一旦用了某框架就很難拔掉。將來你（或你的老闆）得決定要不要用框架、用哪一個，這是需要權衡的決策。

### 什麼是 CSS preprocessor（預處理器）

preprocessor 是一種「幫你更輕鬆寫 CSS」的語言，可視為 vanilla CSS 的擴充版：它多了一些原生 CSS 早期沒有的功能，例如變數、巢狀（nesting）、mixin、函式、迴圈與條件判斷、把多個樣式表併在一起等等，目的是**減少重複、節省時間**。

關鍵在於：瀏覽器其實看不懂 preprocessor 的語法。你用它寫完後，要先**執行 preprocessor 把它「編譯」成 vanilla CSS**，再把產出的 CSS 匯入專案。也就是說，中間多了一道「build step（建置步驟）」。

常見的三大 preprocessor 是 [SASS](https://sass-lang.com/)、[LESS](https://lesscss.org/) 與 [Stylus](https://stylus-lang.com/)。它們的功能高度重疊，差別主要在語法習慣：

- **SASS/SCSS**：變數用 `$` 開頭（如 `$bg-color: #00f;`）。有兩種寫法，`.scss` 貼近 CSS（有大括號與分號），`.sass` 則是縮排式、省略大括號與分號。在三者中人氣最高、社群最大。
- **LESS**：變數用 `@` 開頭（如 `@bg-color: #00f;`），整體語法很接近 SCSS。
- **Stylus**：最自由，變數不需符號、用賦值即可（如 `bg-color = #00f`），大括號、冒號、分號都可省。

不過要特別提醒：**preprocessor 許多最實用的功能，如今 vanilla CSS 本身已經內建了。** 例如你先前學過的 custom properties（自訂屬性，也就是 CSS 變數），以前只有 preprocessor 做得到；[CSS nesting（巢狀）](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting) 過去也是 preprocessor 的招牌優勢，現在同樣進了原生 CSS，瀏覽器支援度也越來越好。所以除非你確定真的需要那些額外功能（例如複雜的迴圈、mixin），否則不見得值得為它多背一道 build step 的負擔。

## 程式碼範例

**框架（Bootstrap）—— 不寫 CSS，只掛 class：**

```html
<!-- 只要引入 Bootstrap 並掛上它定義好的 class，按鈕樣式就完成了 -->
<button type="button" class="btn btn-primary">送出</button>
<!-- .btn 提供基本按鈕樣式，.btn-primary 給主色；你一行 CSS 都沒寫 -->
```

**工具類框架（Tailwind）—— 用一堆小 class 組合出樣式：**

```html
<!-- 每個 class 通常只對應一行 CSS：內距、背景色、圓角、文字白色 -->
<button class="px-4 py-2 bg-blue-500 rounded text-white">送出</button>
```

**預處理器（SCSS）—— 變數、巢狀、mixin：**

```scss
// 變數：集中管理設計 token，改一處全站生效
$primary: #3b82f6;
$radius: 4px;

// mixin：可重複套用的樣式片段
@mixin button-base {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: $radius;
}

.card {
  padding: 1rem;

  // 巢狀：.card .btn，不必重寫父層選擇器
  .btn {
    @include button-base;   // 套用上面的 mixin
    background-color: $primary;
    color: white;

    // & 代表父選擇器，這裡編譯成 .card .btn:hover
    &:hover {
      background-color: darken($primary, 10%);
    }
  }
}
```

上面這段 SCSS 經過編譯後，會產出等價的 vanilla CSS。而如今用**原生 CSS** 就能表達其中大部分：

```css
/* custom properties 取代 preprocessor 變數 */
:root {
  --primary: #3b82f6;
  --radius: 4px;
}

.card {
  padding: 1rem;

  /* 原生 CSS nesting：& 代表父選擇器 .card */
  & .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--radius);
    background-color: var(--primary);
    color: white;

    &:hover {
      /* 這裡直接寫死調暗後的顏色；原生 CSS 也可用 color-mix() 動態調暗 */
      background-color: #2f6fd6;
    }
  }
}
```

差別在於：原生 CSS 版本**不需要 build step**，瀏覽器直接看得懂；但 preprocessor 仍保有 `@mixin`、迴圈等原生 CSS 至今沒有的功能（至於 `darken()` 這類色彩運算，原生 CSS 現在可用 `color-mix()` 達成）。

## 常見陷阱

!!! warning "太早跳進框架，基本功練不夠"
    「不用再手寫 CSS」的誘惑很大，導致許多新手過早學框架。結果是 vanilla CSS 練習量不足、基礎不牢。基礎越弱，將來要覆寫框架樣式或除錯就越痛苦——因為你根本不知道框架「底層」做了什麼。這階段請繼續用 vanilla CSS。

!!! warning "框架不是零成本，而是難以移除的長期綁定"
    框架讓你起步很快，卻可能長期綁住你。專案一旦導入某框架就很難抽離；而且濫用框架會讓一堆網站長得雷同，失去辨識度。要不要用、用哪個，是需要權衡的決策，不是預設選項。

!!! warning "預處理器多了一道 build step，除錯與維護都變複雜"
    preprocessor 要先編譯成 CSS 才能用。這會帶來：瀏覽器顯示的行號對不上原始檔（需要設定 source map 才能對照）、大型專案編譯可能變慢、產出的 CSS 檔案可能比想像中肥大、還多了工具鏈要維護。功能沒用到那麼多的話，這些負擔不見得划算。

!!! warning "巢狀（nesting）別套太深"
    不論在 preprocessor 或原生 CSS，巢狀都很好用，但一層層往下包容易寫出過深、過度綁死 HTML 結構的選擇器，specificity（優先權）也會不知不覺變高、日後難以覆寫。巢狀請適可而止，通常一兩層就夠。

## 練習

把原文 Assignment 收斂成以下閱讀任務（都是概念補充，無需動手寫程式）：

1. 閱讀一篇 [CSS 框架簡介](https://medium.com/html-all-the-things/what-is-a-css-framework-f758ef0b1a11)，建立對「框架是什麼」的整體印象。
2. 略讀一篇 [SASS、LESS、Stylus 的比較概觀](https://www.lambdatest.com/blog/css-preprocessors-sass-vs-less-vs-stylus-with-examples/)，了解三種預處理器在變數、巢狀、mixin 等語法上的差異。
3. 閱讀 [CSS 預處理器的一些缺點](https://adamsilver.io/blog/the-disadvantages-of-css-preprocessors/)。請注意：這篇文章寫成後，CSS 已原生支援 nesting 與透過 custom properties 實現的變數，文中部分論點需以此更新理解。

讀完後，用自己的話回答本課的 knowledge check：

- **What are CSS frameworks？** 框架是一包預先寫好、可直接透過 class 取用的 CSS（有時還含 JavaScript 互動）。你依框架規定的 HTML 結構與 class 名稱套用樣式，就能快速做出響應式介面，而不必自己刻。
- **What are CSS preprocessors？** 預處理器是建立在 CSS 之上的語言，提供變數、巢狀、mixin、函式、迴圈等功能來減少重複。它需要經過編譯（build step）轉成 vanilla CSS，瀏覽器才看得懂。

## 原文與延伸資源

- 原文：[Frameworks and Preprocessors](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-frameworks-and-preprocessors)
- 本課引用：
  - MDN：[Using CSS nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting)（原生 CSS 巢狀與 `&` 選擇器）
  - [CSS 框架簡介（Medium）](https://medium.com/html-all-the-things/what-is-a-css-framework-f758ef0b1a11)
  - [SASS vs LESS vs Stylus 比較（LambdaTest）](https://www.lambdatest.com/blog/css-preprocessors-sass-vs-less-vs-stylus-with-examples/)
  - [CSS 預處理器的缺點（Adam Silver）](https://adamsilver.io/blog/the-disadvantages-of-css-preprocessors/)
  - 框架官網：[Bootstrap](https://getbootstrap.com/)、[Tailwind](https://tailwindcss.com/)、[Bulma](https://bulma.io/)、[Foundation](https://get.foundation)
  - 預處理器官網：[SASS](https://sass-lang.com/)、[LESS](https://lesscss.org/)、[Stylus](https://stylus-lang.com/)

---

> 本講義改寫自 The Odin Project《Frameworks and Preprocessors》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
