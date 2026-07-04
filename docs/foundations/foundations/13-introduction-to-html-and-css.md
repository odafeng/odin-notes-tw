---
title: HTML 與 CSS 簡介
source_url: https://www.theodinproject.com/lessons/foundations-introduction-to-html-and-css
source_file: vendor/curriculum/foundations/html_css/html_foundations/intro_to_html_css.md
path: foundations
course: Foundations
order: 13
generated: 2026-07-02
---

# HTML 與 CSS 簡介

> 改寫自 The Odin Project：[Introduction to HTML and CSS](https://www.theodinproject.com/lessons/foundations-introduction-to-html-and-css)
> ｜Foundations › HTML Foundations

## 核心概念

### 網頁其實是三種語言疊出來的

當你打開任何一個網頁，眼睛看到的所有東西，背後幾乎都是三種技術合作的成果：HTML、CSS、JavaScript。這課先把「地圖」攤開，讓你在深入每一項之前，先看懂它們各自扮演什麼角色、又怎麼互相搭配。

一個常用的比喻是蓋房子。HTML 是結構（structure）：牆、地板、房間的隔間，決定哪裡是客廳、哪裡是廚房。CSS 是裝潢（presentation）：油漆顏色、地板材質、家具擺設，決定房子好不好看。JavaScript 則是讓房子「會動」的部分：按下開關燈會亮、拉開窗簾會有反應，也就是行為（behavior）與邏輯（logic）。三者分工明確，但缺一不可。

這課本身很短，重點是建立正確的心智模型。接下來的每一課會逐一把這三塊講深，而這裡要先確定你不會搞混它們的職責。

### HTML：網頁的原始資料與結構

HTML 全名是 **HyperText Markup Language**（超文字標記語言）。它是網頁的「原始資料」——你在畫面上看到的文字、連結、清單、按鈕、卡片、圖片，全都是先用 HTML 定義出來的。

「Markup（標記）」這個詞是關鍵。HTML 不是拿來寫運算邏輯的，它做的事情是「把內容包起來，並賦予意義」。舉個例子，一段沒有標記的純文字：

```text
一天的行程：
起床
寫程式
睡覺
```

瀏覽器看到這串文字，只會把它當成一整段沒有結構的字。但只要用 HTML 標記，它就變成「有意義的結構」：

```html
<p>一天的行程：</p>
<ul>
  <li>起床</li>
  <li>寫程式</li>
  <li>睡覺</li>
</ul>
```

這裡的 `<p>`（paragraph，段落）告訴瀏覽器「這是一段文字」，`<ul>`（unordered list，無序清單）搭配 `<li>`（list item，清單項目）則說「這是一份項目清單」。同樣的文字，因為標記不同，瀏覽器就知道該把它們畫成段落還是清單。這就是 HTML 的工作：決定內容「是什麼」與「怎麼組織」。

要看懂 HTML，你需要認得三個基本詞彙，它們首次出現時都會附上中文：

- **element（元素）**：把一段內容包起來、賦予意義的完整單位，例如上面的一個 `<li>...</li>`。
- **tag（標籤）**：組成 element 的語法符號。大多數 element 有一個開頭標籤（如 `<p>`）與一個結尾標籤（如 `</p>`），差別在結尾標籤多了一條斜線。
- **attribute（屬性）**：寫在開頭標籤裡、用來提供額外設定的資訊，格式是「名稱="值"」。

一個帶 attribute 的完整範例：

```html
<img src="images/logo.png" alt="網站標誌" />
```

這裡 `img` 是 element 名稱，`src` 與 `alt` 是兩個 attribute：`src` 指定圖片檔案的位置，`alt` 提供圖片無法顯示時的替代文字。像 `<img>` 這種沒有文字內容可以包覆的 element，會寫成自我結束的形式。

### CSS：替內容加上樣式

CSS 全名是 **Cascading Style Sheets**（層疊樣式表）。如果說 HTML 負責「放上什麼內容」，那 CSS 就負責「這些內容長什麼樣子」——它決定位置、顏色、字型、間距、背景，把 HTML 那些樸素的元素變得好看。

CSS 的寫法圍繞著一個叫 **ruleset（規則集）** 的結構。一條 ruleset 長這樣：

```css
p {
  color: red;
  font-size: 16px;
}
```

拆開來看它的組成：

- **selector（選擇器）**：範例裡的 `p`，用來挑出「要套用樣式的 HTML element」，這裡代表「所有的段落」。
- **declaration block（宣告區塊）**：一對大括號 `{ }` 包住的整段，裡面放一條或多條樣式指令。
- **declaration（宣告）**：每一條 `property: value;`，例如 `color: red;`。
- **property（屬性）**：要調整的樣式項目，例如 `color`（文字顏色）、`font-size`（字型大小）。
- **value（值）**：指定給該 property 的具體設定，例如 `red`、`16px`。每條宣告用分號 `;` 結尾。

上面這條 ruleset 的意思就是：「把所有段落的文字顏色設成紅色、字型大小設成 16 像素」。

那麼這些 CSS 要寫在哪裡？主要有三種方式，你之後都會遇到：

- **external stylesheet（外部樣式表）**：把 CSS 寫在獨立的 `.css` 檔，再用 HTML 的 `<link>` element 引入。這是最推薦的做法，因為內容與樣式分開、好維護，也能被多個頁面共用。
- **internal（內部樣式）**：把 CSS 直接寫在 HTML `<head>` 裡的 `<style>` element 內，只影響這一個頁面。
- **inline（行內樣式）**：用 element 的 `style` attribute 直接寫在單一標籤上，例如 `<p style="color: red;">`，只影響那一個 element。

三種方式對應到 external、internal、inline，差別在於「這份樣式的影響範圍多大、多容易重複使用」。實務上會盡量使用外部樣式表，把樣式集中管理。

### HTML、CSS、JavaScript 的分工，與「它們算不算程式語言」

回到那個房子比喻，現在可以把三者對齊得更清楚：

| 技術 | 全名 | 角色 | 負責什麼 |
| --- | --- | --- | --- |
| HTML | HyperText Markup Language | 結構 structure | 放上內容、定義內容是什麼 |
| CSS | Cascading Style Sheets | 樣式 presentation | 顏色、字型、版面、外觀 |
| JavaScript | — | 行為 behavior | 互動、邏輯、載入後改變頁面 |

這裡有個常見迷思要澄清。許多資源會把 HTML 和 CSS 稱作 programming language（程式語言），但嚴格說並不精確。programming language 的核心特徵是能表達「邏輯」——條件判斷、迴圈、運算。HTML 和 CSS 都做不到這些，它們只負責「呈現資訊」：HTML 描述內容結構，CSS 描述外觀。真正能讓網頁「做事情」的是 JavaScript，它可以在頁面載入之後動態改變 HTML 與 CSS，因此它才是不折不扣的 programming language。

不過別小看 HTML 與 CSS。就算完全不碰 JavaScript，光靠這兩者你已經能做出結構完整、外觀漂亮的網頁。更重要的是，等你之後進到 JavaScript 的課程，會發現操作網頁的前提就是先熟悉 HTML 與 CSS——它們是後面所有內容的地基。

### 為什麼要把三者分開

你可能會問：既然最後都是同一個網頁，為什麼不把結構、樣式、行為混在一起寫就好？答案是「關注點分離（separation of concerns）」這個原則。把「內容是什麼」交給 HTML、「外觀怎樣」交給 CSS、「互動邏輯」交給 JavaScript，好處是每一塊都能單獨修改而不牽動其他部分：想換配色時只動 CSS，內容一字不改；想調整文案時只動 HTML，樣式不受影響。

這也解釋了為什麼實務上偏好用外部樣式表、把 CSS 從 HTML 抽出來。當結構與樣式分屬不同檔案，程式碼會更乾淨、更好維護，團隊協作時也更不容易互相踩到。這個「各司其職」的心態，會貫穿你接下來整個前端學習過程，越早建立越好。

## 程式碼範例

下面是一份最小但完整、可以直接存成 `.html` 檔用瀏覽器打開的頁面，同時示範 HTML 的骨架，以及用 `<style>` 內嵌 CSS 來套樣式。

```html
<!-- 宣告這是一份 HTML5 文件 -->
<!doctype html>
<!-- 根元素，lang 屬性標明頁面語言為繁體中文 -->
<html lang="zh-Hant">
  <head>
    <!-- head 放的是「給瀏覽器看」的中繼資料，不會直接顯示在畫面上 -->
    <meta charset="utf-8" />           <!-- 設定文字編碼，支援中文 -->
    <title>我的第一頁</title>          <!-- 顯示在瀏覽器分頁上的標題 -->
    <style>
      /* 這條 ruleset 把所有 h1 標題設成藍色 */
      h1 {
        color: blue;
      }
      /* 這條 ruleset 把段落字型放大並改成深灰色 */
      p {
        font-size: 18px;
        color: #333333;
      }
    </style>
  </head>
  <body>
    <!-- body 放的才是使用者實際看得到的內容 -->
    <h1>哈囉，網頁世界</h1>
    <p>這段文字是用 HTML 放上來、再用 CSS 上色的。</p>
    <ul>
      <li>HTML 負責結構</li>
      <li>CSS 負責外觀</li>
      <li>JavaScript 負責行為</li>
    </ul>
  </body>
</html>
```

觀察重點：`<head>` 裡的東西（編碼、標題、樣式）是給瀏覽器的設定，畫面上看不到；`<body>` 裡的 `<h1>`、`<p>`、`<ul>` 才是使用者看得到的內容。而 `<style>` 裡那兩條 ruleset，正是「用 CSS 替 HTML 內容上色與調整字型」的具體示範。

## 常見陷阱

!!! warning "別把 HTML／CSS 當成「程式語言」而期待它們處理邏輯"
    HTML 只描述「內容是什麼」，CSS 只描述「內容長怎樣」，兩者都無法做條件判斷、迴圈或運算。如果你想讓按鈕被點擊後計算數字、或載入資料後改變畫面，那是 JavaScript 的工作。搞清楚職責邊界，之後學習才不會把問題丟錯工具。

!!! warning "分清楚「放內容」與「調外觀」該用哪一個"
    knowledge check 常考這個判斷：把段落文字放上網頁 → 用 **HTML**；改變按鈕的字型與背景色 → 用 **CSS**。記住口訣：內容與結構歸 HTML，外觀與樣式歸 CSS。

## 練習

The Odin Project 這課的作業只有一項，是先建立整體概念，再進入後續各課的細節：

1. 觀看短片 [HTML, CSS, JavaScript Explained (in 4 minutes for beginners)](https://www.youtube.com/watch?v=gT0Lh1eYk78)。它用大約四分鐘，快速說明這三種技術如何合作，適合在深入每一項之前先建立全貌。
2. 看完後，試著用自己的話回答：HTML、CSS、JavaScript 各自負責網頁的哪一塊？如果你能分別對應到「結構、樣式、行為」，就代表這課的目標達成了。

## 原文與延伸資源

- 原文：[Introduction to HTML and CSS](https://www.theodinproject.com/lessons/foundations-introduction-to-html-and-css)
- 本課引用：
  - [HTML, CSS, JavaScript — What's the Difference?（Bryt Designs）](https://brytdesigns.com/html-css-javascript-whats-the-difference/)：HTML／CSS 的全名與三者分工。
  - [MDN：HTML basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics)：element／tag／attribute 與 HTML 文件骨架。
  - [MDN：CSS basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics)：ruleset 的組成與套用 CSS 的方式。
  - 影片（未於本文抓取，僅列出）：[HTML, CSS, JavaScript Explained (in 4 minutes for beginners)](https://www.youtube.com/watch?v=gT0Lh1eYk78)。

---

> 本講義改寫自 The Odin Project《Introduction to HTML and CSS》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
