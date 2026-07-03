---
title: 處理文字
source_url: https://www.theodinproject.com/lessons/foundations-working-with-text
source_file: vendor/curriculum/foundations/html_css/html_foundations/working_with_text.md
path: foundations
course: Foundations
order: 16
status: draft
generated: 2026-07-02
---

# 處理文字

> 改寫自 The Odin Project：[Working with Text](https://www.theodinproject.com/lessons/foundations-working-with-text)
> ｜Foundations › HTML Foundations

## 核心概念

網路上大多數內容都是文字，所以你會非常頻繁地和 HTML 的文字類 element 打交道。這一課把最常用的幾個文字 element 一次講清楚。

### 段落：瀏覽器會壓縮空白

先看一個直覺會出錯的例子。假設你直接把兩段文字放進 `<body>`，中間用一個空行隔開，你大概會期待畫面上出現「兩段」文字。但實際上不會。瀏覽器在解析 HTML 時，會把原始碼裡連續的空白、tab、換行「壓縮」成單一個空格。結果就是：不管你在編輯器裡怎麼排版換行，所有文字都會被擠成一長串連在一起。

換句話說，HTML 原始碼裡的排版換行只是給「寫程式的人」看的，瀏覽器並不會照著呈現。想要真正分段，就必須明確告訴瀏覽器「這是一個段落」，而這件事由 paragraph element 負責。段落的寫法是用一對 `<p>` tag 把文字內容包起來。瀏覽器遇到 `<p>` 時，會在段落前後產生換行與間距，於是每個 `<p>` 都會自成一段，畫面才會如你預期地分開來。

### 標題：六個層級與內容階層

heading element 和一般文字不同：瀏覽器預設會把它們顯示得更大、更粗，用來標示「這是標題」。HTML 提供了六個層級的標題，從 `<h1>` 到 `<h6>`。tag 裡的數字代表層級：`<h1>` 是最大、最重要的標題，`<h6>` 則是最小、層級最低的標題。標題的寫法和段落一樣——想做一個 h1，就把標題文字包在 `<h1>` tag 裡。

重點不在「哪個比較大」，而在「層級代表內容的階層」。`<h1>` 應該用在整個頁面的主標題，通常一頁只會有一個，作用類似頁面的 `<title>`；較低層級的標題則用在頁面中較小區塊的小標題。這種階層有兩個實際好處：

- **可讀性與結構**：讀者一眼就能看出頁面的大綱與從屬關係。
- **無障礙（accessibility）**：使用 screen reader（螢幕報讀器）的使用者常常靠「在標題之間跳轉」來快速瀏覽頁面，報讀器會依標題自動產生一份大綱。

因此有兩個常被提醒的原則：不要「跳級」使用（例如 `<h1>` 之後直接跳到 `<h3>`），這會讓結構出現斷層；也不要「只因為想把字變大」就拿標題來用——想控制大小是 CSS `font-size` 的工作，標題是用來表達語意的。

### strong 與 em：外觀之外還有語意

`<strong>` 會讓文字變成粗體，但它的意義不只是「粗」。它在語意上把文字標記為「重要」，例如警告或需要特別注意的內容。這個語意會影響輔助工具：某些 screen reader 讀到 strong 裡的文字時，語氣會改變，藉此傳達這段文字的重要性。寫法是用 `<strong>` tag 包住文字。你可以單獨使用它，但更常見的是把它和其他文字 element 搭配，例如在一個段落中只把關鍵詞包成 strong。

`<em>` 則會讓文字變成斜體，同樣不只是外觀——它在語意上為文字加上「強調（emphasis）」，就像我們說話時特別加重某個字的語氣，同樣可能影響 screen reader 的呈現。寫法是用 `<em>` tag 包住文字，一樣既可單獨使用，也可與其他 element 搭配。

這裡有個容易被忽略的觀念：`<strong>` 和 `<em>` 是「語意」element，不是單純的「樣式」element。如果你只是想讓字看起來粗一點、斜一點，而沒有「重要」或「強調」的意思，那其實應該用 CSS 來做，而不是套 `<strong>` 或 `<em>`。（HTML 另有純視覺用途的 `<b>` 與 `<i>`，但在這個階段，先記得「有意義就用 strong / em」即可，樣式的事之後的 CSS 課會教。）

### 巢狀與縮排：父、子、兄弟關係

你會發現，前面每個範例只要某個 element 位在另一個 element 裡面，我們都會把它縮排。這種「把 element 放進另一個 element 裡」的做法叫做 nesting（巢狀）。

巢狀會在 element 之間建立 parent（父）與 child（子）的關係：被包在裡面的是 child，外層包住它的是 parent。舉例來說，`<p>` 放在 `<body>` 裡時，`<body>` 是 parent，`<p>` 是 child。就像人的家庭關係，一個 parent element 可以有很多個 child。而處在「同一層巢狀」的多個 element 彼此則是 sibling（兄弟）——例如兩個都直接放在 `<body>` 裡、層級相同的 `<p>`，它們就是 sibling。

我們用縮排讓巢狀的層級一目了然，方便自己和未來的協作者閱讀。慣例是每往內一層就縮排兩個空格。這些父、子、兄弟關係目前看起來只是名詞，但等到之後用 CSS 設定樣式、用 JavaScript 加行為時會變得非常重要，因為那時你會頻繁地「依關係」去選取 element。現在只要先分清楚這些關係與術語就夠了。

### HTML 註解

有時你會想在原始碼裡留下說明，給協作者或未來的自己看，但又不希望它顯示在畫面上。這就是 comment（註解）的用途——瀏覽器會忽略註解，不會把它渲染出來。寫法是把內容包在 `<!--` 與 `-->` 之間。註解也常用來「暫時停用」某段程式碼來做測試。

## 程式碼範例

```html
<body>
  <!-- 這是註解，瀏覽器不會顯示出來 -->

  <!-- h1 用於整頁主標題，一頁通常只有一個 -->
  <h1>我的第一篇部落格文章</h1>

  <!-- h2 是次一層的小節標題，不要從 h1 直接跳到 h3 -->
  <h2>為什麼要學 HTML</h2>

  <!-- 每個 <p> 自成一段；原始碼裡的換行不影響輸出 -->
  <p>
    網頁上大部分的內容都是文字，所以熟悉文字 element 很重要。
    這一行和上一行在原始碼裡雖然分開了，但瀏覽器會把它們併成同一段。
  </p>

  <p>
    你可以把關鍵字標成
    <strong>重要（strong）</strong>，
    也可以為某個詞加上
    <em>強調（em）</em>，
    兩者都帶有語意，而不只是改變外觀。
  </p>
</body>
```

上面的 `<h1>` 與 `<h2>` 是 sibling，兩個 `<p>` 也是彼此的 sibling；它們全都是 `<body>` 的 child，而 `<strong>`、`<em>` 又是各自 `<p>` 的 child。留意縮排：每往內一層就多兩個空格，讓巢狀結構清楚可讀。

## 常見陷阱

!!! warning "用換行來分段是沒用的"
    在 HTML 原始碼裡多打幾個空行或空格，並不會讓文字在畫面上分段——瀏覽器會把連續的空白壓縮成一個空格。要真正分段，一定得用 `<p>` element 把每段包起來。

!!! warning "不要拿標題來調字級，也不要跳級"
    `<h1>`–`<h6>` 表達的是「內容階層」，不是「字的大小」。想讓某段文字變大請用 CSS `font-size`。同時避免從 `<h1>` 直接跳到 `<h3>`，跳級會破壞頁面大綱，並讓依標題導覽的 screen reader 使用者迷路。

!!! warning "strong / em 是語意，不是純樣式"
    只有當文字真的「重要」時才用 `<strong>`，真的要「加強語氣」時才用 `<em>`。如果只是想要粗體或斜體的視覺效果而沒有這層意義，應該交給 CSS 處理，以免對 screen reader 傳達錯誤的訊息。

## 練習

延續 The Odin Project 的作業，動手做一個純文字的部落格文章頁面來練習：

1. 先看 Kevin Powell 的兩支影片建立直覺：段落與標題（HTML Paragraph and Headings），以及粗體與斜體（HTML Bold and Italic Text）。連結列在下方延伸資源。
2. 新建一個 HTML 檔，用 `<h1>` 當整頁主標題，再用 `<h2>`（必要時 `<h3>`）分出幾個小節標題，注意不要跳級。
3. 在各小節下用 `<p>` 寫幾個段落，並在段落中挑幾個關鍵詞用 `<strong>` 標成重要、用 `<em>` 加上強調。
4. 需要填充文字時可用 Lorem Ipsum 假文。在 VS Code 裡有捷徑：在想插入假文的那一行輸入 `lorem`，再按 <kbd>Enter</kbd>，就會自動產生一段拉丁假文。
5. 順手在原始碼加幾個 `<!-- -->` 註解說明每個區塊。要快速切換註解，可用 <kbd>Cmd</kbd> + <kbd>/</kbd>（Mac）或 <kbd>Ctrl</kbd> + <kbd>/</kbd>（Windows / Linux）；非英文鍵盤配置可能對應到不同按鍵。

## 原文與延伸資源

- 原文：[Working with Text](https://www.theodinproject.com/lessons/foundations-working-with-text)
- 本課引用：
    - MDN：[`<strong>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong)（strong 與 b、em 與 i 的語意差異）
    - MDN：[標題 heading 元素 `<h1>`–`<h6>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements)（層級與無障礙最佳實務）
    - 影片（略過未抓取，建議自行觀看）：Kevin Powell《[HTML Paragraph and Headings](https://www.youtube.com/watch?v=yqcd-XkxZNM)》
    - 影片（略過未抓取，建議自行觀看）：Kevin Powell《[HTML Bold and Italic Text](https://www.youtube.com/watch?v=gW6cBZLUk6M)》
    - 參考：[Lorem Ipsum（維基百科）](https://en.wikipedia.org/wiki/Lorem_ipsum)

---

> 本講義改寫自 The Odin Project《Working with Text》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
