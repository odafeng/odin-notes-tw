---
title: Block 與 Inline
source_url: https://www.theodinproject.com/lessons/foundations-block-and-inline
source_file: vendor/curriculum/foundations/html_css/css_foundations/block_and_inline.md
path: foundations
course: Foundations
order: 25
status: draft
generated: 2026-07-03
---

# Block 與 Inline

> 改寫自 The Odin Project：[Block and Inline](https://www.theodinproject.com/lessons/foundations-block-and-inline)
> ｜Foundations › CSS Foundations

## 核心概念

### Normal flow：一切排版的起點

在你還沒寫任何一行跟排版有關的 CSS 之前，瀏覽器其實早就替你把元素擺好了。這套「什麼都不做時的預設擺放方式」叫做 **normal flow（正常流）**，有時也譯為「文件流」。之後你會學到的 Flexbox、Grid、position 等進階排版技巧，全部都是建立在 normal flow 這個基礎上、對它進行調整。所以要先把 normal flow 搞懂，後面的排版才不會覺得元素「莫名其妙地跑到那裡」。

normal flow 的核心規則，取決於每個元素的 **display（顯示）** 屬性。CSS 的盒子（box）大致分成兩種基本類型：**block box（區塊盒）** 與 **inline box（行內盒）**。這兩種盒子決定了元素會怎麼佔空間、怎麼跟旁邊的元素互動。

### block 元素：各自獨佔一行

你到目前為止學過的多數元素都是 block 元素，也就是預設帶有 `display: block`。block 元素有兩個關鍵特徵：

- **各自從新的一行開始**：一個接一個由上往下堆疊，前後兩個 block 元素不會並排，而是像積木一樣層層往下疊。
- **預設佔滿父層的寬度**：在正常的橫書（由左到右、由上到下）情境下，block 元素的寬度會延展到填滿父容器可用的水平空間；高度則相反，會依內容多寡自動長高，剛好把內容裝下。

用 MDN 的語言來說，這牽涉到兩條軸：**block 軸（block axis）** 是元素堆疊的方向（橫書時是垂直方向），**inline 軸（inline axis）** 是文字流動的方向（橫書時是水平方向）。block 元素沿 inline 軸方向撐滿、沿 block 軸方向增長——這就是為什麼段落一個疊一個、而且每個都佔整行寬。

常見的 block 元素包括 `<h1>` 到 `<h6>`、`<p>`、`<div>`、`<section>`、`<article>`、`<header>`、`<footer>`、`<form>`、`<ul>`、`<li>`、`<table>` 等。

### inline 元素：跟著文字一起流動

inline 元素的行為和 block 相反，它**不會另起新行**，而是和它旁邊的元素排在同一行、跟著文字一起流動。最典型的例子就是連結 `<a>`：把一個 `<a>` 塞進一段文字中間，它會像那段文字的一部分一樣接續排下去，而不會把後面的內容擠到下一行。

inline 元素還有幾個重要特性：

- **只佔內容需要的寬度**：不會像 block 那樣撐滿整行，內容多寬就多寬。
- **width 與 height 無效**：對純 inline 元素設定 `width` 或 `height` 不會有作用。`<img>`、`<input>` 這類「替換元素（replaced element）」是例外——它們雖然預設也是 inline，但寬高仍然可以設定。
- **垂直方向的 margin 與 padding 不吃**：你可以對 inline 元素加左右（水平方向）的 margin 與 padding，但**上下（垂直方向）的 margin 與 padding 不會把行與行推開**。這常常讓初學者困惑——明明設了 `padding: 20px`，上下卻好像沒反應。所以一般來說，不要試圖在 inline 元素上加額外的 padding 或 margin 來做排版。

常見的 inline 元素包括 `<a>`、`<span>`、`<img>`、`<strong>`、`<em>`、`<b>`、`<i>`、`<code>`、`<label>`、`<br>` 等。

### inline-block：兩者的折衷

在 inline 與 block 之間，還有一個實用的中間地帶：**`display: inline-block`**。它同時保留了兩邊的優點：

- **排版上像 inline**：多個 inline-block 元素會並排在同一行，並且會依可用空間自動換行、包裹（wrap），不會像 block 那樣各自獨佔一行。
- **盒模型上像 block**：它**完整尊重 width、height，以及所有方向（含上下）的 margin 與 padding**。這正是它和純 inline 最大的差別——inline 忽略寬高與垂直間距，inline-block 全部照收。

歷史上，`inline-block` 就是為了「讓一排盒子並排、又能各自控制尺寸與間距」而出現的，用來取代早年用 `float` 排版還要清除浮動的麻煩做法，很適合做導覽列、按鈕群組這類需要水平並排又要有尺寸與間距的元件。不過在實務上，如果你要對付「排列一整排盒子」的需求，現在更常直接伸手拿 Flexbox——那是下一課的主角。所以你只要「知道 inline-block 存在、了解它的行為」即可，不必馬上把它當成主力工具。

### div 與 span：兩個沒有語意的通用容器

實際做網頁時，不是每一段內容都剛好有一個對應語意的標籤可用。有時候你只是需要一個「可以拿來套樣式或定位」的容器，這時候就輪到 `<div>` 和 `<span>` 上場。

**`<div>` 是一個通用的 block-level 容器。** 它預設就是一塊矩形區域，會佔滿父層寬度、並另起新行——行為和其他 block 元素一樣。你通常用 `<div>` 來**群組**一批相關的元素，例如把幾張卡片、一個側邊欄、或一組導覽項目包在一起。把內容包進 `<div>` 再給它一個 `class`（類別）或 `id`，就替 CSS 建立了一個方便鎖定、拿來排版與美化的「把手」。

**`<span>` 是一個通用的 inline 容器。** 它待在一行文字之中，只佔它內容需要的空間，且不會另起新行——行為就是個 inline 元素。當你只想針對「一句話裡的某一小段」動手時，就用 `<span>`。例如想把某個單字標成不同顏色、或替某個詞加上提示，就把它包進 `<span>`，再加上 `class` 或 `id` 讓 CSS 找得到、改得動。

要注意的是，`<div>` 和 `<span>` 本身**都不帶任何語意**，不像 `<article>`、`<nav>` 那樣描述內容的意義；它們純粹是有彈性的「積木」。兩者真正的差別就在排版行為：`div` 以 block 的身分參與 normal flow，`span` 以 inline 的身分參與。理解這一點，選擇就很簡單了——要群組並定位「較大塊」的內容時用 `div`，要在一行內針對「小片段」套樣式或加互動時用 `span`。

### 一個常見的模糊地帶：button 到底算什麼？

有些元素的分類會讓人猶豫，`<button>` 就是一例。在 W3Schools 的分類表裡，`<button>` 被歸類為 **inline** 元素；但實際上，大多數瀏覽器給 `<button>` 的預設值其實是 `display: inline-block`——所以你可以對它設定寬高、上下 padding 都會生效。若課程的 knowledge check 問「button 是 block 還是 inline」，依 W3Schools 的分類回答 **inline** 即可，同時知道它實際的預設接近 inline-block，就能兩邊都不出錯。

## 程式碼範例

下面這段最小範例，把 block、inline、inline-block 三種行為放在一起對照。你可以貼進一個 `.html` 檔直接開來看。

```html
<!-- block 元素：各自獨佔一行，由上往下堆疊 -->
<div class="box">我是第一個 div（block）</div>
<div class="box">我是第二個 div（block）</div>

<!-- inline 元素：跟著文字流動，不另起新行 -->
<p>
  這是一段文字，中間夾了一個
  <a href="#">連結（inline）</a>
  ，它會像文字的一部分一樣接續排下去。
</p>

<!-- span：inline 容器，只針對一小段文字套樣式 -->
<p>把某個字<span class="highlight">標色</span>就用 span。</p>

<!-- inline-block：並排、又能設定寬高與上下間距 -->
<nav>
  <a class="nav-item" href="#">首頁</a>
  <a class="nav-item" href="#">關於</a>
  <a class="nav-item" href="#">聯絡</a>
</nav>
```

```css
/* block 容器：預設就佔滿父層寬度 */
.box {
  background: lightblue;
  margin: 8px 0;      /* 上下 margin 對 block 有效 */
  padding: 12px;
}

/* span 只改一小段文字的樣式，不影響排版流動 */
.highlight {
  color: white;
  background: crimson;
}

/* 把純 inline 的 a 變成 inline-block，就能設寬高與上下 padding */
.nav-item {
  display: inline-block; /* 關鍵：讓連結可以並排又能有尺寸 */
  width: 80px;
  padding: 10px 0;       /* 上下 padding 現在會生效 */
  background: navy;
  color: white;
  text-align: center;
  text-decoration: none;
}
```

試著把 `.nav-item` 的 `display: inline-block` 改成純 inline（拿掉那行），你會發現 `width` 失效、上下 `padding` 也不再把版面撐開——這正好示範了 inline 與 inline-block 的差別。

## 常見陷阱

!!! warning "在 inline 元素上加上下 margin/padding 卻沒反應"
    純 inline 元素（例如 `<a>`、`<span>`）**只吃左右方向**的 margin 與 padding，上下方向的垂直間距會被忽略，也不會把上下兩行推開；同時它也不理會 `width` 和 `height`。如果你需要對這種元素設定尺寸或上下間距，先把它改成 `display: inline-block`（要並排時）或 `display: block`（要獨佔一行時），設定才會生效。

## 練習

1. **讀懂 normal flow**：閱讀 MDN 的〈Normal Flow〉，確認你理解「元素在沒有任何額外排版設定時，預設是怎麼自己排好的」——特別是 block 沿垂直方向堆疊、inline 沿水平方向跟著文字流動這兩件事。
2. **記住預設分類**：翻一遍 W3Schools 的〈HTML Block and Inline Elements〉，看它列出的預設 block 與 inline 元素清單，對常見標籤（`h1`、`p`、`div`、`span`、`a`、`img` 等）建立直覺。
3. **釐清 inline 與 inline-block**：讀 DigitalOcean 的〈Inline vs Inline-block Display in CSS〉，透過它的範例把「寬高能不能設、上下 margin/padding 吃不吃」這個關鍵差異看清楚。
4. **動手做練習**：到 The Odin Project 的 css-exercises 倉庫 `foundations/block-and-inline` 目錄，依序完成 `01-margin-and-padding-1` 與 `02-margin-and-padding-2`（每題的說明在該資料夾的 README，解答在 `solution` 資料夾）。
5. **美化你的食譜頁**：把 HTML Foundations 章節做過的食譜頁（Recipe page）拿出來，用**外部 CSS**（external stylesheet）的方式替它加上樣式。試著套用前一課學到的各種屬性——文字顏色、背景色、字體排印屬性等——目的不是要做得好看，而是熟悉寫 CSS 的手感。字體部分還沒教怎麼用自訂字型，先參考 W3Schools 的 CSS Fonts 與 CSS Web Safe Fonts，挑通用字型家族來用，並記得一定要加上一個通用字型家族當備援（fallback）。

## 原文與延伸資源

- 原文：[Block and Inline](https://www.theodinproject.com/lessons/foundations-block-and-inline)
- 本課引用：
  - [MDN：Normal Flow](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Normal_Flow)
  - [DigitalOcean：Inline vs Inline-block Display in CSS](https://www.digitalocean.com/community/tutorials/css-display-inline-vs-inline-block)
  - [W3Schools：HTML Block and Inline Elements](https://www.w3schools.com/html/html_blocks.asp)
  - [W3Schools：CSS Fonts](https://www.w3schools.com/Css/css_font.asp)、[CSS Web Safe Fonts](https://www.w3schools.com/cssref/css_websafe_fonts.asp)
  - 練習題：[TheOdinProject css-exercises：foundations/block-and-inline](https://github.com/TheOdinProject/css-exercises/tree/main/foundations/block-and-inline)

---

> 本講義改寫自 The Odin Project《Block and Inline》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
