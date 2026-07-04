---
title: CSS 入門
source_url: https://www.theodinproject.com/lessons/foundations-intro-to-css
source_file: vendor/curriculum/foundations/html_css/css_foundations/intro_to_css.md
path: foundations
course: Foundations
order: 21
generated: 2026-07-03
---

# CSS 入門

> 改寫自 The Odin Project：[Intro to CSS](https://www.theodinproject.com/lessons/foundations-intro-to-css)
> ｜Foundations › CSS Foundations

## 核心概念

### CSS 是什麼

上一階段你學會用 HTML 決定網頁的「結構」，也就是頁面上有哪些內容、彼此的層級關係如何。CSS（Cascading Style Sheets，層疊樣式表）則負責另一半工作：決定這些內容「長什麼樣子」，例如文字顏色、背景、字體大小、對齊方式、間距等等。HTML 搭骨架，CSS 上妝，兩者分工合作才能做出一個像樣的網頁。

### 基本語法：rule、selector、declaration

CSS 是由一條又一條的 **rule（規則）** 堆疊而成的。每一條 rule 都長這個樣子：

```css
selector {
  property: value;
  property: value;
}
```

拆開來看：

- **selector（選擇器）**：寫在最前面，用來指定「這條 rule 要套用在哪些 HTML element 上」。它就是被「選中」的目標。
- **declaration block（宣告區塊）**：一對大括號 `{ }`，裡面放所有的宣告。
- **declaration（宣告）**：一個 `property: value` 的配對，最後以分號 `;` 結尾。你可以在一個 block 裡放很多條宣告。
- **property（屬性）** 與 **value（值）**：property 是你想調整的樣式名稱（例如 `color`），value 是要設成的內容（例如 `red`）。

舉個完整例子：`p { color: red; }` 意思是「把所有 `<p>` element 的文字顏色設成紅色」。這裡 `p` 是 selector，`color` 是 property，`red` 是 value，而 `color: red;` 合起來是一條 declaration。分號用來分隔多條 declaration，養成每條都加分號的習慣可以避免很多莫名其妙的錯誤。

> 補充：課文與練習裡常出現 `<div>` 這個 element。`<div>` 是一個沒有語意的「空容器」，本身不代表段落或標題，只是用來裝其他 element。實務上應盡量用有語意的 tag（像 `<h1>`、`<p>`），但在學 CSS 的階段，用 `<div>` 當範例最單純，所以你會看到它頻繁出現。

### Selector：選出你要的 element

selector 的種類很多，這裡先介紹最常用、也是你該最先熟練的幾種。

**Universal selector（萬用選擇器）** 用一個星號 `*` 表示，會選中文件裡「每一個」element。下面這段會把整份文件的文字都變成紫色：

```css
* {
  color: purple;
}
```

**Type selector（型別選擇器，也叫 element selector）** 直接寫 element 的名稱，會選中「所有」該型別的 element。例如 `div { color: white; }` 會選中頁面上每一個 `<div>`，但不會碰到 `<p>`。

**Class selector（類別選擇器）** 選中所有帶有指定 class 的 element。class 是你放在 HTML tag 上的一個 attribute（屬性）。語法是「一個句點，緊接著 class 的值」，而且大小寫敏感：

```html
<div class="alert-text">請先同意我們的服務條款。</div>
```

```css
.alert-text {
  color: red;
}
```

class 不綁定特定 element，你可以在任意多個 element 上重複使用同一個 class。同一個 element 也能一次掛多個 class，用空白隔開，例如 `class="alert-text severe-alert"`。也正因為空白是用來分隔 class 名稱的，多字詞的 class 名稱不能用空白，要用連字號，寫成 `alert-text` 而不是 `alert text`。

**ID selector（ID 選擇器）** 跟 class 很像，但選的是帶有指定 `id` 的 element。語法改用井字號 `#`，一樣大小寫敏感：

```html
<div id="title">我很酷的 90 年代網頁</div>
```

```css
#title {
  background-color: red;
}
```

class 與 ID 最大的差別是：一個 element 只能有「一個」ID，而且同一個 ID 在整頁裡不能重複，值裡也不能有空白。實務上有個常見壞習慣是濫用 ID，其實大多數情況 class 就夠了。ID 建議「非常節制地」使用，只有在需要利用它的 specificity（優先權），或要用頁內錨點連結跳到某個區塊時才用它。

> 小陷阱：class 與 ID 的名稱都不能以數字開頭。如果你把 class 命名成 `4lert-text`，用 `.4lert-text` 是選不到的；同理 `#7itle` 也不是合法的 selector。

### 組合 selector：grouping、chaining、descendant combinator

**Grouping（分組）**：當多組 element 共用一些相同的宣告時，可以把 selector 用逗號串成一串，避免重複。例如 `.read` 與 `.unread` 都要 `color: white;` 和 `background-color: black;`：

```css
.read,
.unread {
  color: white;
  background-color: black;
}
```

之後再各自寫它們獨有的宣告即可。這樣改共同顏色時只要動一個地方。要注意：如果分組清單裡有「任何一個」selector 語法錯誤，整條 rule 都會被瀏覽器忽略，所以打逗號時要小心別打錯。

**Chaining（串接）**：把多個 selector「不加空白」直接連在一起，表示「同時符合這些條件」的 element。假設有這段 HTML：

```html
<div class="subsection header">最新文章</div>
<p class="subsection preview">這裡放文章預覽。</p>
```

若只想選中「同時有 `subsection` 和 `header` 兩個 class」的那個 element，就把兩個 class selector 串起來：

```css
.subsection.header {
  color: red;
}
```

`.subsection.header` 之間沒有空白，代表「同一個 element 要同時具備這兩個 class」。你也能串接 class 與 ID，例如 `.subsection#preview`。唯一不能串的是「兩個 type selector」，因為一個 element 不可能同時是兩種型別——`divp` 會被當成要找一個叫 `<divp>` 的 element，而它根本不存在。

**Descendant combinator（後代組合子）**：combinator（組合子）用來表達 selector 之間的「關係」。後代組合子以「一個空白」表示：`.ancestor .child` 只會選中「有一個祖先（父、祖父……不限層數）符合 `.ancestor`」的 `.child` element。換句話說，`child` 必須被「巢狀包在」`ancestor` 裡面才會被選到。看這個例子：

```html
<div class="ancestor">
  <div class="contents">
    <div class="contents"></div>
  </div>
</div>

<div class="contents"></div>
```

```css
.ancestor .contents {
  /* 一些宣告 */
}
```

前兩個 `.contents`（在 `.ancestor` 裡面）會被選中，最後那個獨立在外的 `.contents` 不會。combinator 可以連很多層，`.one .two .three .four` 也合法，但巢狀太深會讓選擇器又長又難懂，也容易在 specificity 上出問題，實務上要盡量避免。

### 幾個入門必用的 property

**`color` 與 `background-color`**：`color` 設文字顏色，`background-color` 設背景顏色。值可以是關鍵字（如 `red`、`transparent`），也可以是 HEX、RGB、HSL 三種格式。這三種格式還能透過 alpha 值調整不透明度：

```css
p { color: #1100ff; }               /* HEX */
p { color: rgb(100, 0, 127); }      /* RGB */
p { color: hsl(15, 82%, 56%); }     /* HSL */
```

**字體排版與 `text-align`**：`font-family` 決定字體，可以給單一值，也可以給用逗號分隔的清單。字體名稱分兩類：像 `"Times New Roman"` 這種「特定字體名」（含空白時要加引號），以及像 `serif`、`sans-serif` 這種「泛用字體家族名」（不加引號）。瀏覽器會從清單第一個開始找，找不到或不支援就換下一個，所以最佳做法是把最想要的字體放最前面、最後放一個泛用家族當保底，例如 `font-family: "Times New Roman", serif;`。`font-size` 設字級（值裡不能有空白，寫 `22px` 不是 `22 px`）；`font-weight` 設粗細，可用關鍵字 `bold` 或 1 到 1000 的數字（`700` 等同 `bold`）；`text-align` 設文字的水平對齊，例如 `text-align: center`。

**圖片的 `height` 與 `width`**：`<img>` 預設會用圖檔本身的尺寸。若想等比例縮放，就設定其中一個（`height` 或 `width`）為特定值、另一個設 `auto`：

```css
img {
  height: auto;
  width: 500px;
}
```

原圖若是高 500px、寬 1000px，套用上面規則後高會變成 250px（維持比例）。建議即使不打算改變尺寸，也要同時在 CSS 和 HTML attribute 上明確寫出 `height` 與 `width`。原因是：若不寫，當圖片載入比其他內容慢時，它一開始不佔空間，載入完才突然把周圍內容擠開，造成畫面「跳動」；先寫好尺寸就能預先「保留」那塊空間，避免版面亂跳。

### 把 CSS 加進 HTML 的三種方法

**External CSS（外部樣式表）** 是最常見、也最推薦的做法：把 CSS 寫在獨立的 `.css` 檔，再用 `<head>` 裡的 `<link>` element 連進來：

```html
<head>
  <link rel="stylesheet" href="styles.css">
</head>
```

`<link>` 是 void element（無內容標籤）。`href` 指向 CSS 檔的位置（絕對 URL 或相對於 HTML 檔的相對路徑，範例假設兩檔在同一目錄）；`rel` 是必填的，說明兩份檔案的關係（stylesheet，樣式表）。檔名不一定要叫 `styles.css`，只要副檔名是 `.css` 即可，但慣例上常用 `style` 或 `styles`。它的好處是 HTML 與 CSS 分離、HTML 檔更精簡，而且多頁共用樣式時只要改一個地方。

**Internal CSS（內部／內嵌樣式）** 是把 CSS 直接寫在 HTML 檔內、放進 `<head>` 裡的一對 `<style>` tag 中，不需要 `<link>`。語法跟外部法完全相同：

```html
<head>
  <style>
    div {
      color: white;
      background-color: black;
    }
    p { color: red; }
  </style>
</head>
```

它適合替「單一頁面」加獨特樣式，但沒有把 HTML 和 CSS 分開，規則一多 HTML 檔就會變大。

**Inline CSS（行內樣式）** 是把樣式直接寫在 element 的 `style` attribute 上，不用 selector：

```html
<div style="color: white; background-color: black;">...</div>
```

它適合替「單一 element」加獨特樣式，但很不推薦當主要做法：宣告一多 HTML 就變亂又臃腫；多個 element 要相同樣式時得整段複製貼上；而且 inline CSS 會蓋過另外兩種方法，容易造成意料之外的結果。

## 程式碼範例

下面是一個把三種概念（外部連結、多種 selector、常用 property）湊在一起的最小可執行範例。先建立 `index.html`：

```html
<!-- index.html -->
<head>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1 id="title">我的第一個 CSS 頁面</h1>

  <div class="card">
    <p class="card-text">這是一段普通說明文字。</p>
    <p class="card-text warning">這是一段警告文字。</p>
  </div>
</body>
```

再建立同目錄的 `styles.css`：

```css
/* styles.css */

/* type selector：所有 h1 置中 */
h1 {
  text-align: center;
  font-family: "Helvetica", sans-serif;
}

/* ID selector：只選 id 為 title 的 element */
#title {
  color: hsl(210, 70%, 40%);
}

/* class selector：所有 card-text 設基礎樣式 */
.card-text {
  color: rgb(60, 60, 60);
  font-size: 16px;
}

/* chaining：同時有 card-text 與 warning 兩個 class 才變紅 */
.card-text.warning {
  color: red;
  font-weight: 700;
}

/* descendant combinator：card 裡面的 p 才有背景 */
.card p {
  background-color: #f2f2f2;
}
```

用瀏覽器打開 `index.html`，標題會置中並變藍、卡片裡的文字有淺灰背景，而帶有 `warning` class 的那一段會變成紅色粗體。

## 常見陷阱

!!! warning "class 用句點、ID 用井字號，別記反"
    在 CSS 裡選 class 要用 `.classname`，選 ID 要用 `#idname`。但在 HTML 裡寫的是 `class="..."` 與 `id="..."`，「不含」句點或井字號。兩者搞混是初學者最常見的錯誤之一。另外別忘了 selector 大小寫敏感，`.Card` 和 `.card` 不是同一個。

!!! warning "串接（chaining）與後代（descendant）差一個空白，意思天差地遠"
    `.subsection.header`（沒有空白）選的是「同一個 element 同時具備兩個 class」；`.subsection .header`（有一個空白）選的卻是「祖先有 `subsection`、後代有 `header`」的那個後代 element。只差一個空白，結果完全不同，寫的時候要格外留意。

!!! warning "分組清單裡有一個錯，整條 rule 全失效"
    用逗號分組多個 selector 時，只要其中「任何一個」語法無效（例如手滑打成 `..special`），瀏覽器會直接忽略「整條」rule，害你以為樣式沒生效卻找不到原因。逗號與每個 selector 都要仔細檢查。

## 練習

1. 打開 The Odin Project 的 [CSS exercises repository](https://github.com/TheOdinProject/css-exercises)，先讀最外層的 README，了解這些練習的使用方式（怎麼開啟、怎麼看預期結果、solution 資料夾在哪）。
2. 接著進到 `foundations/intro-to-css` 目錄，「按順序」完成下面五個練習。每個練習開始前，先讀該資料夾裡的 README：
    - `01-css-methods`：練習三種把 CSS 加進 HTML 的方法。
    - `02-class-id-selectors`：練習 class 與 ID selector。
    - `03-grouping-selectors`：練習用逗號分組 selector。
    - `04-chaining-selectors`：練習把 class／ID 串接起來。
    - `05-descendant-combinator`：練習用空白表達後代關係。
3. 每題都先自己動手寫，寫完卡住或想對答案時，再打開該練習的 `solution` 資料夾比對。重點不是背答案，而是理解「為什麼這個 selector 選得到／選不到這個 element」。

## 原文與延伸資源

- 原文：[Intro to CSS](https://www.theodinproject.com/lessons/foundations-intro-to-css)
- 本課引用：
    - MDN：[CSS selectors — Type, class, and ID selectors](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Basic_selectors)（selector 語法與規則的權威說明）
    - MDN：[What is CSS?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/What_is_CSS)（CSS 如何套用到 HTML、rule 的結構）
    - W3Schools：[CSS Legal Color Values](https://www.w3schools.com/cssref/css_colors_legal.asp)（HEX／RGB／HSL 與 alpha 不透明度的完整對照）
    - TOP：[CSS exercises repository](https://github.com/TheOdinProject/css-exercises)（本課的練習題）

---

> 本講義改寫自 The Odin Project《Intro to CSS》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
