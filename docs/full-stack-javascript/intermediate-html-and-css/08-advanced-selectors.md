---
title: 進階選擇器
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-advanced-selectors
source_file: vendor/curriculum/intermediate_html_css/intermediate_css_concepts/advanced_selectors.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 8
status: draft
generated: 2026-07-03
---

# 進階選擇器

> 改寫自 The Odin Project：[Advanced Selectors](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-advanced-selectors)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Intermediate CSS Concepts

## 核心概念

到目前為止，你應該已經很熟悉基本的 CSS 選擇器（selector），能夠輕鬆用 type（元素型別）、class（類別）或 ID 抓到想要的元素。但如果要當一位真正的「CSS 外科醫生」，光有基本工具還不夠，有時候你需要更精密的手術刀。這一課要介紹的，就是一系列進階選擇器，讓你用更細緻的方式精準命中頁面上的元素。

這些選擇器特別實用的場景是：當你「不能」或「不想」去改動 HTML 標記（markup）時。例如網站內容是由 CMS（內容管理系統）自動產生的，你拿不到那些標籤去加 class；或者你只是想維持 HTML 的乾淨，不想為了樣式塞一堆額外的 class。這時候，能夠靠元素之間的「關係」與「特徵」來選取，就成了關鍵能力。

進階選擇器數量非常多，這一課不會地毯式地全部講過一遍，而是挑出最常用、最實用的幾類，並且建立起足夠的觀念與術語，讓你日後能自己延伸學習。

### 一、關係組合子（combinators）

第一組工具，是讓我們「不透過 class」也能依據元素在 DOM 樹中的相對位置來選取。以下用一段範例標記來說明：

```html
<main class="parent">
  <div class="child group1">
    <div class="grand-child group1"></div>
  </div>
  <div class="child group2">
    <div class="grand-child group2"></div>
  </div>
  <div class="child group3">
    <div class="grand-child group3"></div>
  </div>
</main>
```

**descendant combinator（後代組合子，空格）**：這是你在入門 CSS 就學過的。用一個空格連接兩個選擇器，表示「後者是前者的任意層後代」。例如 `main div` 會選到 `main` 底下所有的 `div`，不管中間隔了幾層——上例中三個 `child` 與三個 `grand-child` 全部都會被選到。

**child combinator（子組合子，`>`）**：只選「直接子元素」，也就是往下剛好一層的元素，跳過再更深的後代。這是它和後代組合子最關鍵的差異。

```css
/* class 為 "child" 的三個 div 會被選到（它們是 main 的直接子元素） */
main > div {
  /* 樣式 */
}

/* class 為 "grand-child" 的三個 div 會被選到 */
main > div > div {
  /* 樣式 */
}
```

換個說法：子組合子選的是「往內縮排剛好一層」的元素。而如果我們想選的是「和目標同一層、緊鄰在後」的元素呢？這就輪到相鄰兄弟組合子登場。

**adjacent sibling combinator（相鄰兄弟組合子，`+`）**：選取「緊接在前一個元素之後、且是同一個父層兄弟」的那一個元素。注意兩個條件缺一不可：必須是兄弟（同一父層），而且必須「緊鄰」。

```css
/* 只有 class 為 "child group2" 的那個 div 會被選到 */
.group1 + div {
  /* 樣式 */
}

/* 只有 class 為 "child group3" 的那個 div 會被選到 */
.group1 + div + div {
  /* 樣式 */
}
```

第一條規則的意思是：找到 `.group1`，然後選它「後面緊鄰的那一個 `div`」。因為 `.group1` 後面緊接著的是 `.group2`，所以命中 `.group2`。第二條再往後推一格，命中 `.group3`。

**general sibling combinator（一般兄弟組合子，`~`）**：如果我們要選的不只是「緊鄰的第一個」，而是「後面所有的兄弟」，就用波浪號。

```css
/* .group1 後面所有的 div 兄弟——本例中就是第 2、第 3 個 .child div */
.group1 ~ div {
  /* 樣式 */
}
```

`+` 只抓緊鄰那一個，`~` 則抓後面全部符合的兄弟。要特別記住：兄弟組合子只會往「後面」找，不會往前選；CSS 傳統的選擇器無法「回頭」選到前面的兄弟或父層。

關於 specificity（優先權/特異性）：這些組合子本身不帶任何特殊的優先權加分，一條規則的 specificity 只由它所連接的各個選擇器「零件」加總而成。也就是說 `main > div` 和 `main div` 的 specificity 是一樣的，差別只在「選到誰」。組合子彼此也可以任意串接，例如 `ul > li[class="a"]` 就是「`ul` 的直接子 `li`、且該 `li` 的 class 為 a」。

### 二、pseudo-class 與 pseudo-element 的差異

在深入之前，先釐清一組常被搞混的名詞——[pseudo-class（虛擬類別）與 pseudo-element（虛擬元素）](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)。兩者的核心區別可以濃縮成兩句話：

- **pseudo-class（虛擬類別）用「單冒號」`:`**，它是用另一種角度去鎖定「本來就存在於 HTML 裡的元素」——只是依據它的狀態（例如被滑鼠停在上面）或位置結構（例如它是第一個子元素）來選取。
- **pseudo-element（虛擬元素）用「雙冒號」`::`**，它用來鎖定「本來不存在於標記中的部分」——例如某段文字的第一個字母、清單項目前的符號，甚至是憑空由 CSS 生出來的內容。

一句話記憶：pseudo-class 對應真實存在的元素，pseudo-element 對應「不算是元素」的抽象部分。下面分別展開。

### 三、pseudo-class（虛擬類別）

pseudo-class 提供了各種不同的角度去命中 HTML 元素。它們數量很多，大致可分兩派：一派依「位置或結構」（在 DOM 中的位置），另一派依「狀態或使用者互動」（元素當下的狀態，或使用者正如何操作它）。pseudo-class 的 specificity 和一般 class 相同，都是 (0, 0, 1, 0)；而且跟一般 class 一樣，多數都可以互相串接。

> 補充：上面 (0, 0, 1, 0) 是計算 specificity 的四段式記法，四段由左到右分別代表 inline style、ID、class/attribute/pseudo-class、以及 type/pseudo-element。想深入了解計算方式，可參考 CSS-Tricks 的 [Specifics on CSS Specificity](https://css-tricks.com/specifics-on-css-specificity/)。

#### 動態與使用者操作類

這一類 pseudo-class 能讓頁面變得更有生氣、更有互動感：

- **`:focus`**：套用在「目前被使用者選中」的元素上，例如用滑鼠點選了它，或用鍵盤（Tab 鍵）移動到它。表單欄位與可聚焦的元件常用它來給出視覺回饋。
- **`:hover`**：影響「滑鼠指標當下停在上面」的任何元素。常用來替按鈕、連結加上額外的視覺提示，暗示它們是可以互動的，或用來觸發下拉選單。
- **`:active`**：套用在「正在被點擊」的元素上（按下去、還沒放開的瞬間）。它特別適合給使用者「這個動作真的有作用」的觸覺式回饋，讓按鈕之類的互動元素更有手感。
- **`:link` 與 `:visited`**：你有沒有想過，為什麼沒加樣式的 HTML 連結預設是藍色、點過之後變紫色？那是瀏覽器內建的預設樣式。要自訂連結樣式，就用這兩個 pseudo-class：`:link` 針對「還沒造訪過」的連結，`:visited` 針對「已造訪過」的連結。一個簡化版的預設樣式大概像這樣：

```css
/* 這條規則套用到所有連結 */
a {
  text-decoration: underline;
}

/* 這條套用到還沒造訪過的連結 */
a:link {
  color: blue;
}

/* 你猜對了，這條套用到使用者點過的連結 */
a:visited {
  color: purple;
}
```

#### 結構類（structural）

結構類 pseudo-class 讓我們依「元素在 DOM 中的位置」來選取，非常強大：

- **`:root`**：代表文件最頂層、那個「沒有任何父層」的元素。在網頁環境中，它通常就等於 `html` 元素（兩者有些細微差異，但實務上可視為同一個）。`:root` 通常是你放置「全域 CSS 規則」的地方，例如自訂屬性（CSS custom properties / 變數）或 `box-sizing: border-box;` 這類想讓整份文件都套用的規則。
- **`:first-child` 與 `:last-child`**：分別命中「身為第一個兄弟」或「身為最後一個兄弟」的元素。
- **`:empty`**：命中「完全沒有任何子節點」的元素。
- **`:only-child`**：命中「沒有任何兄弟」的元素（它是父層唯一的子元素）。
- **`:nth-child()`**：這是結構類裡最靈活的一個，括號裡可以放不同的引數（argument）來表達各種規律：

```css
.myList:nth-child(5) {
  /* 選中 class 為 myList、且是第 5 個的元素 */
}

.myList:nth-child(3n) {
  /* 每隔 3 個選一個（第 3、6、9……個） */
}

.myList:nth-child(3n + 3) {
  /* 每隔 3 個選一個，從第 3 個開始 */
}

.myList:nth-child(even) {
  /* 選中所有偶數位置的 myList 元素；奇數可用 odd */
}
```

`nth-child` 的公式 `an + b` 中，`n` 從 0 開始逐一代入（0、1、2……），算出來的位置就是要選的對象；`even` 等同 `2n`，`odd` 等同 `2n + 1`。

### 四、pseudo-element（虛擬元素）

如果說 pseudo-class 是「用另一種方式選現有元素」，那 pseudo-element 就更抽象了：它讓我們對「根本不是元素的那些部分」下手。pseudo-element 的 specificity 和一般 type 元素相同，都是 (0, 0, 0, 1)。以下是幾個常用的：

- **`::marker`**：自訂 `<li>` 清單項目前面的符號（項目符號或編號）的樣式。
- **`::first-letter` 與 `::first-line`**：分別對一段文字的「第一個字母」與「第一行」給予特別樣式（例如做出報紙式的首字放大效果）。
- **`::selection`**：改變使用者在頁面上「反白選取文字」時的醒目樣式。
- **`::before` 與 `::after`**：允許我們用 CSS（而非 HTML）在元素內容的「前面」或「後面」憑空插入額外內容。用它來裝飾文字是最常見的用法之一。使用時必須搭配 `content` 屬性：

```html
<style>
  .emojify::before {
    content: '😎 😄 🤓';
  }

  .emojify::after {
    content: '🤓 😄 😎';
  }
</style>

<body>
  <div>Let's <span class="emojify">emojify</span> this span!</div>
</body>
```

上面這樣用，畫面會呈現：`Let's 😎 😄 🤓 emojify 🤓 😄 😎 this span!`——也就是在 `.emojify` 這個 span 的文字前後，各自被插入了一串 emoji。

### 五、attribute selector（屬性選擇器）

最後放進工具箱的是屬性選擇器。回想一下，「屬性（attribute）」指的是 HTML 開頭標籤裡的任何東西，例如 `src='picture.jpg'` 或 `href="www.theodinproject.com"`。因為屬性的值是我們自己寫的，所以需要一套更有彈性的系統來鎖定特定的值。屬性選擇器的 specificity 和 class、pseudo-class 相同，都是 (0, 0, 1, 0)。

基本用法：

- **`[attribute]`**：只要元素「有這個屬性」就選中，不管它的值是什麼。
- **`selector[attribute]`**：可以把屬性選擇器和其他選擇器（class 或元素選擇器）組合起來。
- **`[attribute="value"]`**：用 `=` 精準比對「屬性等於某個特定值」。

```css
[src] {
  /* 選中任何有 src 屬性的元素 */
}

img[src] {
  /* 只選中有 src 屬性的 img 元素 */
}

img[src="puppy.jpg"] {
  /* 選中 src 剛好等於 "puppy.jpg" 的 img 元素 */
}
```

有時候我們需要更「模糊」地比對。例如只想抓 `src` 值「以 `.jpg` 結尾」的 `img`。這時可以用下面這組能比對「值的一部分」的屬性選擇器，它們的語法和正規表示式（regular expression）有點像：

- **`[attribute^="value"]`**（`^=`）：比對「以某字串開頭」的值。
- **`[attribute$="value"]`**（`$=`）：比對「以某字串結尾」的值。
- **`[attribute*="value"]`**（`*=`）：萬用比對，只要值「內部任何位置」出現該字串就命中。

```css
[class^='aus'] {
  /* class 也是屬性！這會選中任何 class 以 'aus' 開頭的元素：
     class='austria'
     class='australia'
  */
}

[src$='.jpg'] {
  /* 選中任何 src 以 '.jpg' 結尾的元素：
     src='puppy.jpg'
     src='kitten.jpg'
  */
}

[for*='ill'] {
  /* 選中任何 for 屬性內部含有 'ill' 的元素：
     for="bill"、for="jill"、for="silly"、for="ill"
  */
}
```

除了上面三種，還有幾個較少用但值得知道的：`[attr~="value"]` 比對「以空白分隔的值清單中，剛好包含某個完整字詞」；`[attr|="value"]` 比對「值剛好等於 value，或以 `value-`（後接連字號）開頭」，常用於語系比對如 `lang|="zh"`。另外還可以在值後面加旗標：`i` 讓比對「不分大小寫」（如 `[href*="example" i]`），`s` 則強制「區分大小寫」。想看完整清單可參考 MDN 的 [Attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)。

掌握了這五組工具——關係組合子、pseudo-class、pseudo-element、屬性選擇器，以及貫穿其中的 specificity 觀念——你就有能力在不動 HTML 的前提下，精準地對頁面動手術了。

## 程式碼範例

下面是一個可直接放進 `.html` 檔開啟的最小範例，一次示範子組合子、兄弟組合子、`:nth-child`、`:hover`、`::first-letter` 與屬性選擇器。

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<style>
  /* 子組合子：只選 list 的直接子 li，不會影響巢狀清單 */
  ul.list > li {
    padding: 4px;
  }

  /* :nth-child(even)：斑馬紋，替偶數列上底色 */
  ul.list > li:nth-child(even) {
    background: #eef;
  }

  /* :first-child 的第一個字母放大 */
  ul.list > li:first-child::first-letter {
    font-size: 1.6em;
    color: crimson;
  }

  /* 相鄰兄弟組合子：緊接在 h2 後的段落縮排 */
  h2 + p {
    margin-left: 1em;
    color: #555;
  }

  /* 屬性選擇器：href 以 https 開頭的連結加上鎖頭圖示 */
  a[href^="https://"]::before {
    content: "🔒 ";
  }

  /* :hover：滑鼠停在連結上時變色 */
  a:hover {
    color: green;
  }
</style>
</head>
<body>
  <h2>清單示範</h2>
  <p>這段緊接在 h2 之後，會被 h2 + p 選中而縮排。</p>

  <ul class="list">
    <li>第一項（首字放大）</li>
    <li>第二項（偶數列有底色）</li>
    <li>第三項</li>
    <li>第四項（偶數列有底色）</li>
  </ul>

  <a href="https://www.theodinproject.com">安全連結（前面會出現鎖頭）</a>
</body>
</html>
```

把它存成檔案用瀏覽器開啟，就能一次看到多種進階選擇器同時作用的效果。

## 常見陷阱

!!! warning "把後代組合子（空格）誤當成子組合子（`>`）"
    `main div` 會選到 `main` 底下「所有層」的 `div`，`main > div` 只選「直接子」的 `div`。當版面出現「連巢狀的子清單也一起被套到樣式」的靈異現象時，八成是你少寫了 `>`，用了空格。

!!! warning "pseudo-class 與 pseudo-element 的冒號數量寫錯"
    pseudo-class 用單冒號（`:hover`、`:first-child`），pseudo-element 用雙冒號（`::before`、`::first-letter`）。舊教材（例如 Shay Howe 的文章）有時對 pseudo-element 只寫單冒號，那是為了相容舊瀏覽器的過時寫法；現在的標準是雙冒號，請一律用 `::`。

!!! warning "用了 ::before / ::after 卻忘了寫 content"
    `::before` 與 `::after` 若沒有 `content` 屬性（哪怕是 `content: "";` 空字串），這個虛擬元素根本不會產生，樣式也就完全不會出現。這是新手最常見的「明明寫了卻沒反應」原因。

!!! warning "兄弟組合子只能往後、不能回頭選"
    `+` 與 `~` 都只會選「後面」的兄弟，傳統選擇器沒有「往前選兄弟」或「往上選父層」的能力。想選父層要另尋他法（例如較新的 `:has()`），別指望 `~` 能倒著抓。

## 練習

1. 完成 [CSS Diner](https://flukeout.github.io/)。前幾關的內容你應該都已熟悉，但複習與練習永遠不吃虧。別忘了閱讀右側的範例與說明。
2. 閱讀 [Shay Howe 的 Complex Selectors 一文](https://learn.shayhowe.com/advanced-html-css/complex-selectors/)。它把本課大部分內容講得更細一些。如文中所述，它有時對 pseudo-element 只用單冒號——請記得現在雙冒號才是標準。
3. 完成 MDN 的 [Selectors 評量測驗](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Basic_selectors/Selectors_Tasks)，把剛學到的選擇器知識實際演練一遍。

## 原文與延伸資源

- 原文：[Advanced Selectors](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-advanced-selectors)
- 本課引用：
    - [MDN — CSS combinators](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Combinators)
    - [MDN — Pseudo-classes and pseudo-elements](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements)
    - [MDN — Attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)
    - [CSS-Tricks — Specifics on CSS Specificity](https://css-tricks.com/specifics-on-css-specificity/)
    - [CSS Diner 互動練習](https://flukeout.github.io/)
    - [Shay Howe — Complex Selectors](https://learn.shayhowe.com/advanced-html-css/complex-selectors/)

---

> 本講義改寫自 The Odin Project《Advanced Selectors》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
