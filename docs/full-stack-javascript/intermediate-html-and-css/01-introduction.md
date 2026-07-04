---
title: 導論
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-introduction
source_file: vendor/curriculum/intermediate_html_css/intermediate_html_concepts/introduction.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 1
generated: 2026-07-03
---

# 導論

> 改寫自 The Odin Project：[Introduction](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-introduction)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Intermediate HTML Concepts

## 核心概念

### 這門課在整個課程地圖的位置

這是「Intermediate HTML and CSS（中階 HTML 與 CSS）」兩部分課程的第一課。在此之前，你在 Foundations（基礎）階段學過 HTML 與 CSS 的入門知識；在此之後，還有 Advanced HTML and CSS（進階 HTML 與 CSS）等著你。三個階段的分工大致是：

- **Foundations（基礎）**：只教「能動起來」所需的最少知識。目的是讓你盡快寫出東西、盡快有產出，所以刻意只講表層。
- **Intermediate（中階，本課程）**：放慢腳步，把基礎沒講的重要元素與屬性補齊。學完之後，你幾乎能重現網路上看到的任何網頁設計。
- **Advanced（進階）**：animation（動畫）、accessibility（無障礙）、responsive design（響應式設計）這些主題留到進階課程才深入。

一句話總結這門課的目的：**把 HTML 與 CSS 從「勉強能用」帶到「能刻出你想要的任何版面」。** 這是 knowledge check 唯一那道題（「Intermediate HTML and CSS 課程的目的是什麼？」）的答案。

### 為什麼「能把畫面做漂亮」很重要

你可能覺得「排版好不好看」是設計師的事，跟工程師無關。但實際上，就算你的目標不是 front-end（前端）專職工作，這項能力仍然很關鍵：

- **作品集（portfolio）會替你說話。** 面試官打開你的專案，第一眼看到的是畫面，不是程式碼。同樣的功能，一個排版精緻、一個歪七扭八，給人的專業印象天差地別。
- **重現任意設計是一種可遷移的核心技能。** 工作上拿到設計稿（mockup），要能忠實還原；這種「看著圖就能刻出來」的能力，會一路跟著你。
- **它讓你不再受制於別人。** 不必等設計師或別的工程師幫忙，你自己就能把介面調整到位。

所以就算你偏後端，這門課的投資報酬率依然很高。

### HTML 這一塊你還會學到什麼

到目前為止你大概已經發現：HTML 元素遠比基礎課程提到的那幾個多。這門課會補上其中最重要的部分，尤其是 **forms（表單）** 與 **tables（表格）**。

要對「還有多少元素沒學」有個整體感，最好的做法是掃一眼 MDN 的 HTML 元素總表。它把所有元素按用途分組，重點的幾組如下（你不需要背，只要知道它們存在、大概是做什麼的）：

- **Content sectioning（內容分區）**：`<header>`、`<footer>`、`<nav>`、`<main>`、`<section>`、`<article>`、`<aside>`、`<h1>`–`<h6>` 等。這些是「語意化標籤（semantic elements）」，用來標示頁面各區塊的角色，而不是只用一堆沒有意義的 `<div>`。
- **Text content（文字內容）**：`<p>`、`<ul>`、`<ol>`、`<li>`、`<blockquote>`、`<figure>`、`<figcaption>`、`<hr>`、`<pre>` 等，用來組織段落與清單這類區塊層級的文字。
- **Inline text semantics（行內文字語意）**：`<a>`、`<strong>`、`<em>`、`<code>`、`<abbr>`、`<time>`、`<mark>`、`<span>` 等，用來標示句子中「某一小段」文字的意義或樣式掛載點。
- **Table content（表格內容）**：`<table>`、`<thead>`、`<tbody>`、`<tr>`、`<th>`、`<td>`、`<caption>` 等，是後面「表格」章節的主角。
- **Forms（表單）**：`<form>`、`<input>`、`<label>`、`<button>`、`<select>`、`<option>`、`<textarea>`、`<fieldset>`、`<legend>` 等，是「表單」章節的主角，也是幾乎每個真實網站都會用到的一塊。
- **Image and multimedia（圖片與多媒體）**：`<img>`、`<audio>`、`<video>`、`<picture>`、`<source>` 等。
- **Interactive elements（互動元素）**：`<details>`、`<summary>`、`<dialog>` 等，不寫 JavaScript 也能有基本互動。

這裡有個很重要的觀念：**semantic HTML（語意化 HTML）**。同樣是畫一個橫幅，你可以用 `<div class="header">`，也可以用 `<header>`。畫面上看起來一樣，但 `<header>` 額外告訴瀏覽器、搜尋引擎、以及螢幕閱讀器（screen reader）「這是頁首」。選對元素，等於免費換來更好的無障礙性與 SEO。這是這門課會反覆強調的主線之一。

### CSS 這一塊你還會學到什麼

CSS 能做的事，遠比基礎課程展示的多很多。The Odin Project 特別點名了以下幾項，都會在這門課登場：

- **Variables（CSS 變數 / custom properties，自訂屬性）**：用 `--main-color: #333;` 定義一次，之後到處用 `var(--main-color)` 取用。改一個地方，整站顏色跟著變，維護超省力。
- **Functions（函式）**：CSS 內建許多函式，例如 `calc()` 讓你把不同單位混合計算（`calc(100% - 60px)`）、`min()`、`max()`、`clamp()` 讓數值在區間內自動取捨，是做彈性版面的利器。
- **Shadows（陰影）**：`box-shadow`（元素陰影）與 `text-shadow`（文字陰影），替扁平的畫面加上層次與立體感。
- **Grid layouts（Grid 版面）**：CSS Grid 是二維（同時控制列與欄）的版面系統，搭配你已經熟悉的 Flexbox（一維），幾乎能排出任何版面。這是整門課的重頭戲。

除了上面這幾項，CSS 的知識版圖還包括：**selectors（選擇器）** 的進階用法（pseudo-class 偽類、attribute selector 屬性選擇器等）、**box model（盒模型）** 的細節、**positioning（定位）**、**background（背景）**、**gradient（漸層）**、**transform（變形）**、**transition（過渡）** 等。像 htmlcheatsheet.com 這種 CSS 速查表，一次把幾百個屬性攤在你面前，看起來會有點嚇人——但它的用途不是拿來背，而是讓你「感受一下還有多少東西可學」，以及日後忘記某個屬性寫法時當作查詢手冊。

### 該用什麼心態面對這一課

這一課本身沒有要你動手實作或記憶任何東西。它的定位是「地圖」：先讓你俯瞰整片地形，知道接下來會走過哪些地方。作業要你去掃 MDN 的元素總表和 CSS 速查表，重點也一樣——**不是背下來，而是建立熟悉感**。當你之後正式學到 `<form>` 或 CSS Grid 時，因為「之前瞄過」，新知識會黏得更牢。這是一種很有效的學習前置動作：先讓大腦對即將到來的內容留下淺淺的印象，正式學習時就從「陌生」變成「似曾相識」。

## 程式碼範例

下面這段最小範例，把這門課即將深入的兩件事各露一手：**semantic HTML** 的頁面結構，以及 **CSS custom property（變數）**。你可以存成 `index.html` 用瀏覽器打開觀察。

```html
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <title>中階 HTML 與 CSS 導覽</title>
    <style>
      /* 用 :root 定義全站共用的變數（custom property） */
      :root {
        --brand: #2563eb; /* 品牌主色，改這一行全站跟著變 */
        --gap: 16px;
      }

      body {
        font-family: sans-serif;
        margin: var(--gap); /* 用 var() 取用上面定義的變數 */
      }

      /* 選到語意化的 header，套用品牌色背景 */
      header {
        background: var(--brand);
        color: white;
        padding: var(--gap);
      }
    </style>
  </head>
  <body>
    <!-- header／nav／main 都是語意化元素，比一堆 div 更清楚 -->
    <header>
      <h1>我的網站</h1>
      <nav>導覽列會放在這裡</nav>
    </header>
    <main>
      <p>主要內容區塊。這門課會教你把它排成任何版面。</p>
    </main>
  </body>
</html>
```

重點觀察兩件事：`<header>`、`<nav>`、`<main>` 讓結構一看就懂它們各自的角色；`--brand` 只定義一次，`header` 用 `var(--brand)` 取用，日後要換色只改 `:root` 那一行即可。

## 常見陷阱

!!! warning "別想把參考表背下來"
    作業給你的 MDN 元素總表和 CSS 速查表，內容多到嚇人——這是刻意的。它們是「地圖」與「查詢手冊」，不是「單字表」。硬背只會讓你挫折又浪費時間，而且很快就忘。正確用法是掃過一遍建立熟悉感，需要時再回來查。真正的元素與屬性，會在後續各課用到時自然學會、記住。

!!! warning "畫面一樣不代表 HTML 一樣好"
    用 `<div>` 加 class 幾乎能模擬任何語意化元素的外觀，於是有人乾脆全部用 `<div>`。但 `<header>`、`<nav>`、`<main>`、`<article>` 這類語意化標籤會額外告訴瀏覽器、搜尋引擎與螢幕閱讀器每個區塊的角色，換來更好的 accessibility（無障礙）與 SEO。能用語意化元素時就別用無意義的 `<div>`。

## 練習

這一課是概覽性質，作業只有「瀏覽、建立熟悉感」，不需要動手寫程式，也不需要記憶：

1. 掃一遍 MDN 的 [HTML elements reference（HTML 元素總表）](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)，看看還有哪些元素可用。不用背，現在瞄一眼，之後正式學到時會更容易吸收。
2. 快速翻一下這份看起來有點嚇人的 [CSS Cheat Sheet（CSS 速查表）](https://htmlcheatsheet.com/css/)。同樣不用學會或背下任何東西，純粹感受一下「還剩多少 CSS 可以學」。

## 原文與延伸資源

- 原文：[Introduction](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-introduction)
- 本課引用：
  - [MDN：HTML elements reference（HTML 元素總表）](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
  - [htmlcheatsheet.com：CSS Cheat Sheet（CSS 速查表）](https://htmlcheatsheet.com/css/)
  - [MDN：Using CSS custom properties（使用 CSS 變數）](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties)

---

> 本講義改寫自 The Odin Project《Introduction》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
