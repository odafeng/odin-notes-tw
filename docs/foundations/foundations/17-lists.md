---
title: 清單（Lists）
source_url: https://www.theodinproject.com/lessons/foundations-lists
source_file: vendor/curriculum/foundations/html_css/html_foundations/lists.md
path: foundations
course: Foundations
order: 17
generated: 2026-07-02
---

# 清單（Lists）

> 改寫自 The Odin Project：[Lists](https://www.theodinproject.com/lessons/foundations-lists)
> ｜Foundations › HTML Foundations

## 核心概念

清單在網頁上無所不在：從電商網站的商品規格、食譜的步驟，到搜尋結果、導覽選單，背後幾乎都是 HTML 清單撐起來的。當你有「一組相關的項目」想呈現時，正確的做法不是用一堆換行硬排，而是用清單 element 把它們包起來。這樣不只畫面整齊，還能讓瀏覽器與螢幕報讀器（screen reader）知道「這幾筆資料是同一組清單」，對可及性（accessibility）很重要。

HTML 提供兩種最常用的清單，差別只在一個問題：**項目的先後順序有沒有意義？**

### 無序清單（unordered list）：順序不重要

如果一組項目的排列順序無所謂，換順序也不會改變意思，就用無序清單。典型例子是購物清單——牛奶、雞蛋、麵包，先買哪一樣都行。

無序清單用 `<ul>`（unordered list）element 建立，裡面每一筆項目再用 `<li>`（list item）element 包起來。瀏覽器預設會在每個項目前面顯示一個實心圓點（bullet point，項目符號）：

```html
<ul>
  <li>牛奶</li>
  <li>雞蛋</li>
  <li>麵包</li>
</ul>
```

畫面上會看到三行，每行前面各有一個小圓點。

### 有序清單（ordered list）：順序有意義

反過來說，如果順序本身就是資訊的一部分——例如食譜的步驟、比賽名次、你的年度電影排行——就要用有序清單。這時你不希望讀者搞錯先後。

有序清單用 `<ol>`（ordered list）element 建立，裡面每一筆一樣是用 `<li>` 包起來。差別在於瀏覽器預設會自動幫每個項目加上遞增的數字，你完全不用自己手動打「1.」「2.」：

```html
<ol>
  <li>把水煮滾</li>
  <li>放入麵條</li>
  <li>加入調味包</li>
</ol>
```

畫面會依序顯示 1、2、3。日後若你在中間插入一筆新項目，後面的編號會自動重排，這正是用 `<ol>` 而不是自己打數字的好處。

### 三個 element 的關係

不管是哪一種清單，結構都一樣是「容器 + 項目」兩層：

- `<ul>` 或 `<ol>` 是**容器**，代表「這是一個清單」。
- `<li>` 是**項目**，代表「清單裡的其中一筆」，永遠放在 `<ul>` 或 `<ol>` 內部。

換句話說，`<li>` 是 `<ul>`／`<ol>` 的子元素（child），而清單容器裡直接放的內容，原則上就只能是 `<li>`（技術上還允許 `<script>`、`<template>` 這類特殊元素，但初學階段可以先當作「清單裡只放 `<li>`」）。反過來，`<li>` 也不能單獨存在於清單之外，一定要有 `<ul>` 或 `<ol>` 當它的家。

### 清單可以互相巢狀

清單項目裡不是只能放純文字，你也可以在一個 `<li>` 裡面再塞一個完整的清單，形成階層結構（例如「大分類 → 子項目」）。巢狀時要特別注意收尾的位置：子清單要放在父層 `<li>` 內部，父層那個 `<li>` 的結束標籤 `</li>` 要等子清單結束之後才收：

```html
<ul>
  <li>水果
    <ul>
      <li>蘋果</li>
      <li>香蕉</li>
    </ul>
  </li>
  <li>蔬菜</li>
</ul>
```

`<ul>` 和 `<ol>` 可以任意巢狀、任意交替，深度不限，每一層各自維持自己的項目符號或編號。

### 樣式交給 CSS，不要靠 HTML

你之後會想改變項目符號的樣式——把圓點換成方塊，或讓編號改用英文字母、羅馬數字。這裡先建立一個正確觀念：**外觀是 CSS 的工作**。無序清單的符號樣式用 CSS 的 `list-style-type` 屬性（property）控制（例如 `disc` 實心圓、`circle` 空心圓、`square` 方塊），而不是用早已被淘汰的 HTML `type` 屬性。

有序清單也有幾個實用的 HTML 屬性可以微調編號行為，稍微認識即可：`type` 可切換編號形式（`type="a"` 用小寫字母、`type="i"` 用小寫羅馬數字、`type="1"` 用數字），`start` 可指定起始號碼（`start="4"` 從 4 開始數），`reversed` 則讓編號由大到小倒著排。現階段你只要記得「`<ul>` 出圓點、`<ol>` 出數字」就夠了，這些屬性等有需要再回來查。

## 程式碼範例

下面是一份可以直接放進 HTML 文件 `<body>` 裡執行的完整範例，同時示範無序與有序清單：

```html
<!-- 無序清單：這週想吃的東西，順序無所謂 -->
<h2>本週想吃</h2>
<ul>
  <li>牛肉麵</li>
  <li>壽司</li>
  <li>咖哩飯</li>
</ul>

<!-- 有序清單：泡茶步驟，順序不能亂 -->
<h2>泡茶步驟</h2>
<ol>
  <li>把水煮到接近沸騰</li>
  <li>溫壺並放入茶葉</li>
  <li>注入熱水，靜置一分鐘</li>
  <li>倒出茶湯</li>
</ol>
```

執行後，「本週想吃」底下三筆會各自帶一個圓點；「泡茶步驟」底下四筆會自動編上 1 到 4。

## 常見陷阱

!!! warning "`<li>` 一定要放在 `<ul>` 或 `<ol>` 裡面"
    `<li>` 不能單獨使用。若你直接把 `<li>` 寫在清單容器外面，這是無效的 HTML，畫面呈現與可及性都可能出問題。清單容器裡也應該只放 `<li>`，不要塞一段裸露的文字或 `<p>` 進去 `<ul>`／`<ol>` 的直接子層。

!!! warning "不要自己手打編號"
    用 `<ol>` 時不必在文字裡打「1.」「2.」，瀏覽器會自動編號。若你既用 `<ol>` 又自己打數字，會變成「1. 1. 步驟」這種重複；而且手打的數字在你增刪項目後不會自動更新，維護起來很痛苦。

!!! warning "巢狀清單的結束標籤位置"
    把子清單放進某個項目時，子清單要寫在父層 `<li>` 內部，父層的 `</li>` 要等子清單整個結束後才收。若你太早收掉父層 `<li>`，巢狀結構就會錯位，縮排與符號都會跑掉。

!!! warning "外觀請交給 CSS"
    想換項目符號或編號樣式時，用 CSS 的 `list-style-type` 等屬性，不要依賴已被淘汰的 HTML `type` 屬性來做視覺樣式。把「結構（HTML）」和「外觀（CSS）」分開，是往後每一課都會反覆用到的原則。

## 練習

動手做才記得住。新建一個 HTML 文件，在 `<body>` 裡依序做出以下四份清單：

1. 一份**無序清單**，列出你最愛的幾樣食物。
2. 一份**有序清單**，列出你今天要完成的待辦事項。
3. 一份**無序清單**，列出你將來想去旅行的地方。
4. 一份**有序清單**，列出你心目中前 5 名的電玩或電影。

做的時候提醒自己：順序無所謂的用 `<ul>`，順序有意義的用 `<ol>`，每一筆項目都用 `<li>` 包起來，而且有序清單不要自己打數字。完成後用瀏覽器打開檔案，確認圓點與自動編號都正確顯示。

## 原文與延伸資源

- 原文：[Lists](https://www.theodinproject.com/lessons/foundations-lists)
- 本課引用：
    - MDN：[`<ul>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul)
    - MDN：[`<ol>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ol)
    - MDN：[`<li>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/li)

---

> 本講義改寫自 The Odin Project《Lists》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
