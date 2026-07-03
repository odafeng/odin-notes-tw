---
title: SVG 向量圖
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-svg
source_file: vendor/curriculum/intermediate_html_css/intermediate_html_concepts/svgs.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 2
status: draft
generated: 2026-07-03
---

# SVG 向量圖

> 改寫自 The Odin Project：[SVG](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-svg)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Intermediate HTML Concepts

## 核心概念

SVG（Scalable Vector Graphics，可縮放向量圖）是網頁上非常常見的圖片格式。它一開始可能會讓人有點困惑，但只要學會怎麼用，它就是一個非常強大的工具，能為你的網站製作高品質、可動態調整的圖片。這一課要弄清楚三件事：SVG 到底是什麼、適合用在哪裡，以及怎麼把它放進你的網頁。

### 向量圖 vs 點陣圖：本質差異

要理解 SVG，先要理解它名字裡的 vector graphics（向量圖）。網頁上的圖片大致分兩類：

- **Raster graphics（點陣圖 / 位元圖）**：像 JPEG、PNG 這類格式，圖片是由一格一格的 pixel（像素）組成的網格。畫面的細節被這個網格的大小限制住了。如果你想把圖放大（scale，縮放），就得增加網格的尺寸——但新增出來的那些像素該長什麼樣子？沒有簡單的答案，只能用演算法去猜測、插補，於是放大後就會糊掉、出現鋸齒。而且網格愈大，檔案就愈大。
- **Vector graphics（向量圖）**：SVG 屬於這一類。它沒有像素網格，取而代之的是用數學公式來描述各種形狀與線條。既然只是公式，那麼你想把它畫多大或多小都無所謂——它能縮放到任何尺寸，而畫質完全不受影響，檔案大小也不會因此改變。

這就是 SVG 名稱裡「Scalable（可縮放）」的由來：無限縮放、畫質不變、檔案不變。除了縮放，SVG 還有另一個強項——如果你需要用程式去產生或修改圖片，SVG 很好用，因為你可以透過 CSS 和 JavaScript 改變它的屬性。

SVG 常見的使用場景：

1. Icons（圖示）
2. Graphs / Charts（圖表）
3. 大型但構圖單純的圖片
4. Patterned backgrounds（重複花紋的背景）
5. 透過 SVG filters（SVG 濾鏡）對其他元素套用效果

### SVG 是用 XML 寫的

SVG 有一個有趣的特點：它是用 XML（Extensible Markup Language，可延伸標記語言）定義的。XML 是一種類似 HTML 的語法，被廣泛用在很多地方，從 API、RSS，到試算表與文書軟體的檔案格式都有它的身影。

SVG 的原始碼是 XML，帶來兩個關鍵好處。

**第一，它是 human-readable（人類可讀的）。** 如果你用文字編輯器打開一張 JPEG，看到的會是一堆亂碼（因為 JPEG 是 binary file format，二進位檔案格式）。但如果你打開一份 SVG，看到的會是這樣：

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="0" y="0" width="100" height="50" />
  <circle class="svg-circle" cx="50" cy="50" r="10" />
</svg>
```

也許還是有點看不懂，但至少那些是單字、是標籤（tags）、是屬性（attributes），跟你熟悉的 HTML 很像。

**第二，XML 天生就設計成能和 HTML 互通。** 這代表你可以把上面那段程式碼原封不動地貼進 HTML 檔案裡，不用任何轉換，圖片就會顯示出來。而且因為這些形狀會像 HTML 元素一樣變成 DOM 裡的元素，所以你可以用 CSS 去選取它們、套樣式，也可以用你早就在用的 Element WebAPI 去建立或操作它們。

### SVG 的弱點

看起來 SVG 這麼棒，那乾脆把所有圖片都換成 SVG 就好了？其實不行。SVG 對「相對單純」的圖片很棒，但因為圖片的每一個細節都得用 XML 一筆一筆寫出來，所以它在儲存「複雜圖片」時效率極差。如果你的圖片要達到照片般的擬真、或帶有細緻的紋理質感（像是有顆粒感的 grunge texture），那 SVG 就是選錯工具了——這種情況該用 JPEG 這類點陣格式。

一句話原則：構圖單純用 SVG，畫面複雜擬真用點陣圖。

### 解剖一份 SVG

通常你不會從零開始手寫 SVG。多數時候你會從網站或圖片編輯軟體下載檔案、或複製它的程式碼（Google 的 Material Icons 和 Feather Icons 就是很受歡迎的 SVG 圖示庫）。不過，下載一份 SVG 之後想稍微調整一下是很常見的，所以搞懂它各個部件的作用非常有用。以下逐一拆解上面那段範例：

1. **`xmlns`**：全名 XML NameSpace（XML 命名空間）。它指定你用的是哪一種 XML「方言」，在這裡就是 SVG 語言規格。少了它，某些瀏覽器不會渲染你的圖，或會渲染錯誤。
2. **`viewBox`**：定義 SVG 的座標範圍與邊界，這是最重要也最容易搞混的屬性。它有四個值 `viewBox="min-x min-y width height"`：前兩個值 `min-x`、`min-y` 決定「可視區域的左上角原點」落在無限畫布的哪個位置；後兩個值 `width`、`height` 決定「可視區域的寬高」，也就是縮放程度。你在 SVG 裡替各元素指定的座標，全都是相對於這個 `viewBox` 在計算的。它同時定義了 aspect ratio（長寬比）與原點，一次做了好幾件事。
3. **`class`、`id`**：功能跟在 HTML 裡完全一樣。在 SVG 裡用它們，可以方便地用 CSS 或 JavaScript 選取某個元素，或用 `<use>` 元素重複使用同一個圖形。
4. **形狀元素**：像 `<circle>`、`<rect>`、`<path>`、`<text>` 這些都由 SVG 命名空間定義，是我們的基本積木。雖然 SVG 可以做出極複雜的圖，但多半只用到十來種這類基本元素。
5. **可被 CSS 改寫的屬性**：許多 SVG 屬性（例如 `fill` 填色、`stroke` 描邊）都能在 CSS 裡改。

### viewBox 與座標系統

`viewBox` 是 SVG 最需要花時間玩熟的觀念。它建立了一個「內部座標系統」，這個系統跟 SVG 實際佔多少像素是脫鉤的。舉例：

```html
<svg width="300" height="300" viewBox="0 0 150 150"> ... </svg>
```

這代表：這個 SVG 在頁面上實際佔 300×300 像素，但它的內部座標卻只有 150×150 的範圍。結果就是內部所有東西都被放大成兩倍顯示。反過來說，同一份內部繪圖，你只要改 `width` / `height`，就能讓它在頁面上任意大小呈現，不必重算任何幾何座標——這正是「向量圖可縮放」在實務上的體現。

### 基本形狀與定位

SVG 的每種基本形狀，都用自己的一組屬性來定位。這些值都是在 `viewBox` 建立的座標系統裡計算的：

- **`<rect>`（矩形）**：用 `x`、`y` 指定左上角位置，`width`、`height` 指定寬高。可用 `rx`、`ry` 做出圓角。
- **`<circle>`（圓形）**：用 `cx`、`cy` 指定圓心，`r` 指定半徑。
- **`<ellipse>`（橢圓）**：跟圓類似，但用 `rx`（水平半徑）與 `ry`（垂直半徑）兩個值。
- **`<line>`（線段）**：用 `x1`、`y1`（起點）與 `x2`、`y2`（終點）定義。
- **`<path>`（路徑）**：最強大也最複雜的元素，用 `d` 屬性裡一串指令畫出任意曲線與線段。複雜圖示幾乎都是一堆 `<path>` 組成的。

關於 `fill` 與 `stroke` 有一個容易忽略的細節：`stroke`（描邊）是畫在路徑的「正中央」的，也就是說一半在形狀內、一半在形狀外，這個行為無法改。常用的描邊屬性有 `stroke-width`（線寬）、`stroke-dasharray`（虛線樣式，例如 `"20 14"` 代表 20 單位實線、14 單位空隙）、`stroke-linecap`（線端樣式：`butt`、`round`、`square`）。

### 嵌入 SVG：linked 與 inline

把 SVG 放進網頁主要有兩種方式：linked（連結）與 inline（內嵌）。

**Linked（連結）**：跟連結任何其他圖片一樣。你可以用 HTML 的 `<img>` 元素，或在 CSS 裡用 `background-image: url(./my-image.svg)`。這樣圖一樣能正確縮放，但 SVG 的內部內容無法從網頁存取——也就是說你不能用 CSS / JavaScript 去改它內部的形狀。

**Inline（內嵌）**：直接把 SVG 的原始碼貼進網頁裡，而不是當成一張外部圖片去連結。它一樣會正確渲染，但這下 SVG 的各種屬性都對你的程式碼可見了，於是你可以用 CSS 或 JavaScript 動態改變這張圖。

Inline 能釋放 SVG 的全部潛力，但也有明顯代價：它會讓你的程式碼變得更難閱讀、讓頁面更難被 cache（快取），而且如果 SVG 很大，還可能拖慢其餘 HTML 的載入。這些缺點有些可以在你學會像 React 這樣的前端 JavaScript 函式庫、或 webpack 這類 build tool 之後被緩解，但那是後面的事。

現階段的原則：哪個最適合你的需求就用哪個。連結通常比較乾淨、簡單，所以優先用連結，除非你確實需要跟 HTML 一起調整 SVG 的內部程式碼。

### 用 CSS 控制 SVG（Presentation Attributes）

寫在 SVG 標籤上的 `fill`、`stroke`、`stroke-width` 等，稱為 presentation attributes（表現屬性）。它們的特別之處是：這些屬性同時也能當成 CSS property 來寫。可用 CSS 控制的常見屬性包括 `fill`、`fill-opacity`、`stroke`、`stroke-width`、`stroke-dasharray`、`stroke-linecap`、`stroke-linejoin`、`opacity`，以及文字相關的 `font-family`、`font-size`、`text-anchor` 等。

這裡有一個關鍵且常被踩到的規則：**presentation attribute 的優先權（specificity）極低，低到比任何 CSS selector 都低。** 也就是說，即使你只是用最弱的類型選擇器（例如 `circle { fill: red; }`），它也會蓋掉直接寫在標籤上的 `fill="blue"`。這跟一般 HTML 的 inline `style=""`（會蓋掉外部 CSS）行為剛好相反，很容易讓人搞混——SVG 標籤上的 `fill="blue"` 不是 inline style，它只是預設值，任何一條 CSS 規則都能覆蓋它。

## 程式碼範例

以下是一份可直接貼進 HTML 檔案 `<body>` 的最小 inline SVG 範例，示範座標、形狀，以及「CSS 覆蓋 presentation attribute」的行為：

```html
<!-- inline SVG：內部座標系由 viewBox 建立為 0 0 100 100 -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">
  <!-- 矩形：左上角 (0,0)，寬 100、高 50，填成淺灰 -->
  <rect x="0" y="0" width="100" height="50" fill="lightgray" />

  <!-- 圓形：圓心 (50,50)、半徑 10。這裡雖然寫 fill="blue"，
       但下面的 CSS 會蓋過它，因為 presentation attribute 優先權極低 -->
  <circle class="svg-circle" cx="50" cy="50" r="10" fill="blue" />
</svg>

<style>
  /* 用最弱的類別選擇器就能覆蓋標籤上的 fill="blue" */
  .svg-circle {
    fill: tomato;          /* 圓最終會是番茄紅，而不是藍色 */
    stroke: black;         /* 加上黑色描邊 */
    stroke-width: 2;       /* 描邊寬 2（座標單位，非像素）*/
  }
</style>
```

把 `viewBox` 從 `0 0 100 100` 改成 `0 0 50 50` 試試看：整張圖會被放大兩倍，因為可視範圍縮小了、但顯示尺寸不變。這就是體會 `viewBox` 最快的方法。

## 常見陷阱

!!! warning "把 viewBox 當成像素尺寸"
    `viewBox` 定義的是「內部座標範圍」，不是頁面上的像素大小；後者由 `width` / `height`（或 CSS）決定。兩者脫鉤，正是縮放不失真的原因。改 `viewBox` 會改變「可看到多少內容、放大多少倍」，改 `width` / `height` 只改「在頁面上佔多大」。搞混這兩者是初學者最常見的困惑來源。

!!! warning "以為標籤上的 fill 蓋得過 CSS"
    SVG 標籤上的 `fill="blue"` 是 presentation attribute，優先權比任何 CSS selector 都低。就算是最弱的類型選擇器 `circle { fill: red }` 也會覆蓋它。這跟 HTML 的 inline `style=""` 行為相反，別把兩者混為一談。

!!! warning "用 SVG 存複雜或擬真的圖片"
    SVG 的每個細節都要寫成 XML，因此對照片級擬真、細緻紋理或顆粒質感的圖片，檔案會大到不合理。這類圖片請用 JPEG / PNG 等點陣格式。

!!! warning "無腦全部 inline"
    Inline 雖然能用 CSS / JS 動態操作 SVG，但會讓程式碼變難讀、頁面難以 cache，大型 SVG 還可能拖慢 HTML 載入。沒有動態需求時，優先用 `<img>` 或 CSS `background-image` 連結。

## 練習

1. 閱讀 Josh Comeau 的〈A Friendly Introduction to SVG〉（見下方延伸資源）。這篇有很棒的互動式示範，會帶你動手玩形狀與縮放。**讀到「animations（動畫）」那一節就停下來**——動畫是課程後面才會教的主題。閱讀時特別留意這幾點：
   - `viewBox` 的四個值分別代表什麼、改動時圖會怎麼變化。
   - 各種形狀（circle、rect、line、path）用哪些屬性定位。
   - `fill` 與 `stroke` 的差異，以及 `stroke` 畫在路徑正中央這件事。
2. 動手驗證：把本課「程式碼範例」貼進一個 HTML 檔，在瀏覽器打開。試著（a）改 `viewBox` 的值觀察縮放、（b）改 `<circle>` 的 `cx` / `cy` / `r` 移動與縮放圓、（c）把 CSS 裡的 `.svg-circle { fill }` 拿掉，看標籤上的 `fill="blue"` 是不是又生效了——藉此親眼確認 presentation attribute 的優先權規則。

## 原文與延伸資源

- 原文：[SVG](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-svg)
- 本課引用：
  - Josh Comeau，[A Friendly Introduction to SVG](https://www.joshwcomeau.com/svg/friendly-introduction-to-svg/)（互動式入門，Assignment 指定閱讀）
  - MDN，[SVG element reference（完整 SVG 元素清單）](https://developer.mozilla.org/en-US/docs/Web/SVG/Element)
  - MDN，[`<use>` element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use)
  - CSS-Tricks，[SVG Properties and CSS](https://css-tricks.com/svg-properties-and-css/)
  - SVG 圖示庫：[Material Icons](https://fonts.google.com/icons)、[Feather Icons](https://feathericons.com/)

---

> 本講義改寫自 The Odin Project《SVG》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
