---
title: Flexbox 與 Grid 並用
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-using-flexbox-and-grid
source_file: vendor/curriculum/intermediate_html_css/grid/using_flexbox_and_grid.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 21
generated: 2026-07-03
---

# Flexbox 與 Grid 並用

> 改寫自 The Odin Project：[Using Flexbox and Grid](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-using-flexbox-and-grid)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Grid

## 核心概念

網路上常有人爭論 Grid 與 Flexbox 到底誰比較強、該不該用其中一個取代另一個。這個問題的前提本身就是錯的。Grid 與 Flexbox 不是互相取代的競爭對手，而是**互補（complementary）的工具**，各有各的舞台，甚至可以同時出現在同一個版面裡協同工作。學會判斷「什麼時候用哪一個」，比死背屬性更重要。

### 一維（one-dimensional）與二維（two-dimensional）

要區分這兩個工具，最根本、也最實用的一條線是「維度」。

- **Flexbox 是一維佈局工具**：一次只處理**一個方向**，不是一列（row）就是一欄（column）。就算你加上 `flex-wrap: wrap` 讓項目換行，它依然是一維的，因為每一行的空間分配是**各自獨立**計算的——第二行不會去對齊第一行的欄位。CSS Grid 專家 Rachel Andrew 有一句常被引用的話：「Flex 換行並不會讓它變成二維（Flex wrapping doesn't make it two-dimensional）。」
- **Grid 是二維佈局工具**：同時處理**列與欄**。你先定義好行軌道（row track）與欄軌道（column track），項目落進這些軌道裡，天生就會在兩個方向上互相對齊。就算內容換到下一列，欄位對齊依然嚴格維持。

一個很好記的判斷法：**如果你發現自己在 Flexbox 的項目上手動設定寬度，只為了讓它們跟上一行的項目對齊**，那多半代表你真正需要的是 Grid。這種「跟上下鄰居對齊」的需求，正是二維佈局的本質。

### 內容優先（content first）與佈局優先（layout first）

另一個更貼近設計思維的判斷角度，是問自己：這個設計是**從內容出發**，還是**從佈局出發**？

**內容優先設計（Content First Design）**：你先清楚知道內容應該長什麼樣子，佈局是內容的自然結果。這正是 Flexbox 的主場。Flexbox 的核心是「內容向外撐（content out）」——項目的尺寸由內容本身決定，剩餘空間再依規則分配出去。你透過邏輯規則來控制項目的**行為**：它們怎麼放大（`flex-grow`）、怎麼縮小（`flex-shrink`）、理想尺寸是多少（`flex-basis`）、彼此之間如何排列。最終的版面只是這些行為的「後果」，會隨著容器寬度而動態變化。換句話說，你控制的是行為，不是精確的格子。

**佈局優先設計（Layout First Design）**：你先決定各個區塊要怎麼擺，再把內容填進去。這時就輪到 Grid 發光。Grid 的核心是「佈局向內收（layout in）」——你先畫好列與欄的軌道，內容只能落在這些明確（explicit）或隱含（implicit）的軌道格子裡。當你腦中已經有整個容器的「大局圖」時，Grid 是最直接的選擇。

要注意的是，這兩種設計思路**並沒有強迫你只能用其中一個工具**。你完全可以用 Grid 排一維的東西（雖然多數人習慣把一維交給 Flexbox），也可以用 Flexbox 撐出看似格狀的排列。差別在於「哪個工具做起來更直覺、後續調整更省事」。舉例來說，如果你用 Grid 排一列方塊，之後想把第三個方塊改成換到第二列去伸展，這在 Grid 裡「做得到」，但要動軌道定義；若控制精確佈局本來就不是你的重點，Flexbox 的 `flex-wrap` 會更順手。

### 共用的對齊系統

有一個常被忽略但很實用的事實：Flexbox 與 Grid **共用同一套 CSS Box Alignment（盒子對齊）屬性**。`justify-content`、`align-items`、`align-self`、`gap` 這些屬性大多最早是為 Flexbox 定義的（`gap` 則源自 Grid），後來被抽出成獨立規範，Grid 也直接沿用。這代表你在 Flexbox 學到的對齊直覺，幾乎可以無痛搬到 Grid，只是主軸/交叉軸的概念換成了列軸/欄軸。這也是為什麼兩者搭配起來心智負擔不大。

此外，`fr` 單位的精神其實跟 `flex-grow` 很像——都是「按比例分配剩餘空間」，只是 `fr` 用在 Grid 軌道上時，會**同時維持嚴格的列/欄對齊**，這是 Flexbox 做不到的。

### 兩者並用：Grid 排大局、Flexbox 排元件

真正強大的地方在於**同時使用**。最經典、最推薦的模式是：

> **用 Grid 排整體頁面/區塊結構，用 Flexbox 排每個元件內部的細節。**

背後的原理是：一個 Grid 項目（grid item）本身也可以是一個 Flex 容器（flex container）。於是外層 Grid 用它精準的二維定位把大區塊擺好，內層每個區塊再用 Flexbox 讓內部的內容自由地伸縮、對齊、置中。反過來也成立——Flex 項目可以是 Grid 的父容器。這種巢狀（nesting）讓你在同一份版面裡，該精準的地方精準、該彈性的地方彈性。

想像一個常見的卡片牆：整面卡片牆用 Grid 排成整齊的多欄格線（欄與欄、列與列都對齊）；而每一張卡片內部——標題、內文、底部的按鈕列——則用 Flexbox 讓按鈕靠右、讓內文自然撐開高度。這就是「Grid 管外、Flexbox 管內」的典型分工。

### 結語：這是建議，不是對錯

這一課給的是**建議與傾向，不是「唯一正確」的標準答案**。到最後，選哪個工具往往取決於個人偏好、以及對「當下這個任務哪個做起來比較輕鬆」的判斷。現在你的工具箱裡兩把工具都有了，也看過它們如何搭配、如何互相替代。學好 Flexbox 與 Grid 最有效的方法，就是用它們做大量的專案，在實作中慢慢養成自己的判斷。

## 程式碼範例

以下是「Grid 排大局、Flexbox 排元件內部」的最小可執行範例。外層用 Grid 排出自動填滿的響應式欄位，每張卡片內部用 Flexbox 把按鈕推到底部並靠右。

```html
<!-- index.html -->
<div class="cards">
  <article class="card">
    <h2>方案 A</h2>
    <p>這段文字長度不一，卡片高度會自動撐開。</p>
    <button>選擇</button>
  </article>
  <article class="card">
    <h2>方案 B</h2>
    <p>不論內文多長，底部按鈕都會對齊到卡片最下方。</p>
    <button>選擇</button>
  </article>
  <article class="card">
    <h2>方案 C</h2>
    <p>短內文。</p>
    <button>選擇</button>
  </article>
</div>
```

```css
/* style.css */

/* 外層：用 Grid 排整體格線（二維、對齊） */
.cards {
  display: grid;
  /* 每欄最少 200px，空間夠就自動增加欄數並平均分配 */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

/* 內層：每個 grid item 本身又是 flex container（一維、彈性） */
.card {
  display: flex;
  flex-direction: column; /* 由上到下：標題、內文、按鈕 */
  gap: 8px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

/* 讓內文吃掉多餘的垂直空間，把按鈕擠到卡片底部 */
.card p {
  flex: 1; /* 等同 flex: 1 1 0，撐開剩餘空間 */
}

/* 按鈕在交叉軸（水平方向）靠右對齊 */
.card button {
  align-self: flex-end;
}
```

重點觀察：`.cards` 用 `repeat(auto-fit, minmax(200px, 1fr))` 做到不寫 media query 也能響應式換欄，且各欄嚴格對齊（Grid 的長處）；而每張 `.card` 內部用 `flex: 1` 撐開內文、`align-self: flex-end` 對齊按鈕（Flexbox 的長處）。兩者各司其職。

## 常見陷阱

!!! warning "以為 flex-wrap 就等於二維佈局"
    給 Flexbox 加上 `flex-wrap: wrap` 讓項目換行後，版面「看起來」像格子，但它本質仍是一維的。每一行的空間分配彼此獨立，第二行不會去對齊第一行的欄寬。只要你需要「跨行對齊欄位」，就該改用 Grid，不要硬用 Flexbox 逐一調寬度去湊。

!!! warning "在 Flex 項目上到處手動設寬度來對齊"
    如果你發現自己一直在 flex item 上寫死 `width` 或算 `flex-basis` 百分比，只為了讓上下兩行對齊，這是一個明確的訊號：你其實需要的是 Grid。這種「跟兄弟元素對齊」的需求天生屬於二維佈局，Grid 的軌道（track）會幫你自動處理。

!!! warning "把 Grid 與 Flexbox 當成二選一的對手"
    兩者不是競爭關係，不需要「選邊站」。最實務的做法往往是同時用：外層 Grid 定結構，內層 Flexbox 排元件。記得一個 grid item 可以同時是一個 flex container，反之亦然。

## 練習

以下把原文 Assignment 改寫成繁中步驟，帶你把「並用」的觀念讀通、看熟。

1. **讀懂「Grid 不會取代 Flexbox」的論點**：閱讀 CSS-Tricks 的〈[Does CSS Grid Replace Flexbox?](https://css-tricks.com/css-grid-replace-flexbox/)〉。重點抓住：一維 vs 二維的差異、為什麼 `flex-wrap` 不算二維、以及文章示範的「grid item 當 flex 父容器、flex item 當 grid 父容器」的巢狀寫法。

2. **看真實案例中如何取捨**：觀看 Kevin Powell 的影片〈[real-world use cases for Grid and Flexbox](https://www.youtube.com/watch?v=3elGSZSWTbM)〉，觀察他在實際版面中，什麼區塊交給 Grid、什麼區塊交給 Flexbox，以及判斷的理由。

3. **建立自己的判斷準則**：閱讀 tutsplus 的〈[when to use Grid or Flexbox and why](https://webdesign.tutsplus.com/flexbox-vs-css-grid-which-should-you-use--cms-30184a)〉，把「內容優先→Flexbox、佈局優先→Grid」這條線內化成自己下決定時的直覺。

4. **動手驗證**：拿本課「程式碼範例」的卡片牆貼進瀏覽器，試著調整視窗寬度觀察 Grid 如何自動換欄；再把某張卡片的內文加長，觀察 Flexbox 如何靠 `flex: 1` 把按鈕釘在底部。改改看 `minmax()` 的最小值與 `align-self` 的值，感受兩個工具各自負責的效果。

完成後，試著回答本課的 Knowledge check：什麼時候用 Flexbox 而非 Grid？什麼時候用 Grid 而非 Flexbox？什麼時候兩者並用？

## 原文與延伸資源

- 原文：[Using Flexbox and Grid](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-using-flexbox-and-grid)
- 本課引用：
    - MDN：[Relationship of grid layout with other layout methods](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Relationship_of_grid_layout_with_other_layout_methods)（一維/二維、內容向外撐 vs 佈局向內收、共用對齊系統）
    - CSS-Tricks：[Does CSS Grid Replace Flexbox?](https://css-tricks.com/css-grid-replace-flexbox/)（為何兩者互補、巢狀搭配）
    - Kevin Powell（影片）：[real-world use cases for Grid and Flexbox](https://www.youtube.com/watch?v=3elGSZSWTbM)
    - tutsplus：[Flexbox vs CSS Grid: Which Should You Use?](https://webdesign.tutsplus.com/flexbox-vs-css-grid-which-should-you-use--cms-30184a)

---

> 本講義改寫自 The Odin Project《Using Flexbox and Grid》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
