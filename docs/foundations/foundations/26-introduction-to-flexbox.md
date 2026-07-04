---
title: Flexbox 簡介
source_url: https://www.theodinproject.com/lessons/foundations-introduction-to-flexbox
source_file: vendor/curriculum/foundations/html_css/flexbox/flexbox_intro.md
path: foundations
course: Foundations
order: 26
generated: 2026-07-03
---

# Flexbox 簡介

> 改寫自 The Odin Project：[Introduction to Flexbox](https://www.theodinproject.com/lessons/foundations-introduction-to-flexbox)
> ｜Foundations › Flexbox

## 核心概念

在網頁上排版元素的方法有很多種，而且技術一直在演進：舊的做法逐漸退流行，新的技術陸續補上。Flexbox（彈性盒子）就是其中一個帶來革命性改變的工具。它出現的時間相對較晚，所以不少教材會把它放在課程後段。但如今 Flexbox 已經成為許多開發者排版時的預設選擇，會是你未來最常用到的工具之一，因此我們選擇一開始就學它。

### Flexbox 是什麼

Flexbox 是一種把元素排成「一列」或「一欄」的排版方式。這些被排列的元素會依照你設定的規則「flex」，也就是自動地伸長（grow）或縮短（shrink），以填滿或適應可用的空間。這正是它名字裡「flex（彈性）」的由來：你不用親手替每個元素算好精確寬度，而是描述它們該如何分配空間，交給瀏覽器動態計算。

要特別澄清一個常見誤解：Flexbox 並不是「單一個 CSS 屬性」，而是一整組互相搭配的屬性所組成的工具箱。有些屬性寫在容器上，有些屬性寫在被排列的子元素上。搞清楚「哪個屬性該寫在哪裡」，是學好 Flexbox 的關鍵第一步。

### flex container 與 flex item

Flexbox 的世界只有兩種角色：

- **flex container（flex 容器）**：任何被套上 `display: flex` 的元素。它是負責「排版」的那一方，決定子元素怎麼排、往哪個方向排、如何對齊、如何分配剩餘空間。
- **flex item（flex 項目）**：flex container 的**直接子元素**。只要它的父元素是 flex container，它自動就成為 flex item，會受到容器排版規則的支配。

換句話說，你不需要在子元素上加任何特別的標記，才能把它變成 flex item。**建立 flex item 的方法，就是在它的父元素上加 `display: flex`。** 這一步同時做了兩件事：把父元素變成 flex container，並把它所有的直接子元素變成 flex item。

要注意「直接子元素」這個限制：只有第一層的子元素會變成 flex item，孫元素（子元素的子元素）不受影響。

### 容器可以同時是項目

有個一開始容易困惑、但非常重要的觀念：**同一個元素可以同時是 flex container 又是 flex item。** 想像一個三層結構：最外層是 flex container，中間層是它的 flex item；只要你在這個中間層元素上也加 `display: flex`，它就同時扮演兩個角色——對外，它是外層容器的 flex item；對內，它自己又是一個 flex container，可以用 Flexbox 排列它自己的子元素。

這正是我們用 Flexbox 蓋出複雜版面的核心手法：**不斷地巢狀（nesting）多層 flex container 與 flex item。** 一個看似複雜、有各種大小與間距的頁面版面，往往就只是用 Flexbox 一層一層堆疊、切割空間拼出來的。

### 兩條軸線：main axis 與 cross axis

Flexbox 是一維（one-dimensional）的排版系統，一次只處理「一個方向」的排列，而這個方向由兩條互相垂直的軸線來描述：

- **main axis（主軸）**：flex item 主要沿著排列的方向。預設是水平、由左到右。
- **cross axis（交錯軸）**：與主軸垂直的另一條軸。當主軸是水平時，交錯軸就是垂直的。

主軸的方向由容器上的 `flex-direction` 屬性決定，它有四個值：`row`（預設，水平由左到右）、`row-reverse`（水平由右到左）、`column`（垂直由上到下）、`column-reverse`（垂直由下到上）。當你把 `flex-direction` 改成 `column`，主軸就變成垂直方向，交錯軸則變成水平方向。之後學到的對齊屬性（例如 `justify-content` 沿主軸、`align-items` 沿交錯軸）都是以這兩條軸為基準運作的，所以現在先把「主軸／交錯軸」的概念記牢，後面會省下很多混淆。

### item 如何「flex」：grow、shrink、basis

當我們說 flex item 會「flex」，背後其實是三個屬性在控制它如何分配空間：

- **flex-grow**：當容器還有多餘空間時，這個項目要不要伸長、伸長多少。它是一個沒有單位的比例值，預設為 `0`（不主動伸長）。如果所有項目都設成 `1`，多出來的空間就會被平均分配，每個項目等寬。
- **flex-shrink**：當容器空間不夠時，這個項目要不要縮小、縮小多少。預設為 `1`（允許縮小），所以項目預設會為了塞進容器而互相退讓。
- **flex-basis**：在開始分配剩餘空間之前，這個項目的「起始大小（基準尺寸）」。預設為 `auto`，代表以項目本身的內容或設定的寬／高為準。

這三者通常合寫成 `flex` 這個簡寫（shorthand）屬性，順序固定是 `flex: <grow> <shrink> <basis>`。它的預設值是 `flex: 0 1 auto`。實務上最常見的寫法是 `flex: 1`，等同於 `flex: 1 1 0`，意思是「每個項目都從 0 起算、平均分配所有空間」，這正是做出等寬欄位最快的方法。這些細節在接下來的課程會逐一深入，這裡先建立整體印象即可。

### 開始前的心理準備

Flexbox 本身的概念不會比之前學過的東西更難，只是它的「零件」比較多，各屬性之間會互相影響。在把整個工具箱學完、能拼在一起用之前，可能會有一陣子覺得學到的東西還派不上用場，這很正常。最有效的學習方式是**動手玩每一個範例**：改一改屬性值，看畫面怎麼變，概念才會真正內化。

還有一個關鍵習慣：善用瀏覽器的開發者工具（developer tools）。Flexbox 的版面有時會出乎意料，當畫面不如預期時，第一件事永遠是打開開發者工具去檢查（inspect）元素，看看它到底套用了哪些屬性、被哪條規則影響。這會是你在整個 Flexbox 系列裡最重要的除錯手段。

## 程式碼範例

以下是一個最小的 Flexbox 範例。三個 `div` 原本是區塊（block）元素、會由上往下堆疊；只要在它們的父元素加上 `display: flex`，它們就水平排成一列，並自動分配空間。

```html
<!-- HTML：一個容器包三個子元素 -->
<div class="flex-container">
  <div class="one">1</div>
  <div class="two">2</div>
  <div class="three">3</div>
</div>
```

```css
/* 父元素加上 display: flex，它就成為 flex container，
   三個直接子元素自動成為 flex item */
.flex-container {
  display: flex;
}

/* flex: 1 讓三個項目平均分配容器的可用空間，
   於是它們會等寬並排；縮放視窗時也會一起「flex」 */
.flex-container > div {
  flex: 1;
}
```

想觀察「flex」的效果，可以把上面的 `flex: 1` 拿掉再加回來，或縮放瀏覽器視窗，會看到三個項目一起伸縮以填滿寬度。若在 `.flex-container` 裡再加一個 `div`，它會自動排到同一列，四個項目重新平均分配空間，完全不必手動改任何寬度。

想體驗「容器同時是項目」的巢狀結構，可以把其中一個項目也變成容器：

```css
/* .two 對外是 flex item，對內又是 flex container，
   可以再用 Flexbox 排列它自己的子元素 */
.two {
  display: flex;
  flex-direction: column; /* 讓 .two 內部改成垂直排列 */
}
```

## 常見陷阱

!!! warning "只有「直接子元素」才是 flex item"
    `display: flex` 只會把容器的**第一層子元素**變成 flex item，孫元素不受影響。如果你想排列的元素其實包在另一層 `div` 裡，那真正被排版的是外面那層，裡面的元素排不動。想排列孫元素，就得在它們的直接父元素上再加一個 `display: flex`（也就是做一層巢狀）。

!!! warning "flex 屬性寫錯位置不會生效"
    Flexbox 的屬性分兩類：一類寫在容器上（如 `display: flex`、`flex-direction`、`justify-content`），一類寫在項目上（如 `flex`、`flex-grow`）。把容器的屬性寫到項目上、或反過來，都不會有效果卻也不報錯，很容易讓人卡住。畫面不如預期時，先用開發者工具檢查屬性是不是套在對的元素上。

## 練習

這一課是 Flexbox 系列的開場，**沒有指定作業**。接下來的每一課都會帶你一步步深入各個屬性，所以最好的練習就是：把本課的程式碼範例親手打一次，反覆修改 `display`、`flex`、`flex-direction` 的值，一邊改一邊觀察畫面變化，直到你對「容器 vs 項目」「主軸 vs 交錯軸」有直覺為止。準備好就繼續往下一課前進。

## 原文與延伸資源

- 原文：[Introduction to Flexbox](https://www.theodinproject.com/lessons/foundations-introduction-to-flexbox)
- 本課引用：
  - [MDN：Flexbox（CSS layout 教學）](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox)
  - [MDN：Basic concepts of flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox)
  - 互動練習（本課未抓取，僅推薦）：[Flexbox Froggy](https://flexboxfroggy.com/) — 用青蛙關卡熟悉 Flexbox 屬性的遊戲。

---

> 本講義改寫自 The Odin Project《Introduction to Flexbox》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
