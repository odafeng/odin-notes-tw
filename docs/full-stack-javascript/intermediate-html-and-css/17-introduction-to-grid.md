---
title: Grid 簡介
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-introduction-to-grid
source_file: vendor/curriculum/intermediate_html_css/grid/introduction_to_grid.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 17
generated: 2026-07-03
---

# Grid 簡介

> 改寫自 The Odin Project：[Introduction to Grid](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-introduction-to-grid)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Grid

## 核心概念

接下來幾課會介紹 CSS Grid（格線佈局），讓你排版頁面時輕鬆許多。這一課是整個系列的開場，目標不是馬上寫出格線，而是先把兩件事講清楚：Flexbox 到底能做到什麼、又有哪些地方力不從心，以及 Grid 為什麼被發明出來、它與 Flexbox 的關係是什麼。把這層觀念建立好，後面學語法時你才會知道「什麼時候該用哪一個」。

### 先複習 Flexbox 能做的事

在 Foundations 課程裡你學過 Flexbox。它的核心是沿著 two flex axes（兩條 flex 軸，即 main axis 主軸與 cross axis 交叉軸）來排列 flex items（flex 項目），並透過 alignment（對齊）屬性控制它們在軸上的位置，也可以讓項目 grow（放大）、shrink（縮小）或改變尺寸。這正是 Flexbox 的精髓：項目會「flex」，能伸展填滿、也能縮小塞進去。

用 Flexbox 你可以很輕鬆地把一排項目排成整齊的一列（row），也可以排成一欄（column）。對於這種**一維（one-dimensional）**的佈局，也就是你只在乎「一整列」或「一整欄」這**單一方向**的排列時，Flexbox 提供了一個乾淨的工具，不需要再依賴古老的 `float` 或各種 CSS hack 來對齊。

那二維呢？Flexbox 其實也能沾一點邊。透過 `flex-wrap` 屬性，你可以讓項目在空間不夠時 wrap（換行）到下一行：一列滿了就折到下一列，或一欄滿了折到下一欄。Foundations 裡那個讓人又愛又恨的卡片佈局練習，靠的就是這個機制。

### Flexbox 的天花板：二維佈局很吃力

問題在於：Flexbox 的換行是「content-out（由內容往外推）」的。項目換到第二行後，它們的寬度是由各自的內容與 `flex-basis` 決定的，**第二行的項目不會自動對齊第一行的項目**。也就是說，你能排出「有很多行的卡片牆」，但很難保證每一欄都對得整整齊齊、每個卡片都一樣大小。當你為了逼它對齊，開始在 flex 項目上設固定寬度、關掉 flex 的彈性時，其實就是一個訊號——你需要的其實是 Grid。MDN 有一句話說得很精準：「如果你在用 Flexbox，卻發現自己一直在關掉它的彈性，那你大概該改用 CSS Grid 了。」

一句話總結差異：**Flexbox 一次只管一個方向（列或欄）；Grid 同時管兩個方向（列與欄）。** 這就是「一維 vs 二維」的真正含義。

### Grid 是什麼？為什麼被發明

CSS Grid 雖然是 CSS 裡較新的模組，但它醞釀已久。有趣的冷知識：CSS 共同創造者 Dr. Bert Bos 早在 1996 年就開始構思這套佈局模型，靈感來自報紙、雜誌這類傳統媒體常見的「格線式排版」。經過多年的示範與開發，CSS Grid 終於在 2017 年被所有主流瀏覽器正式支援。

Grid 最為人稱道的，就是能**輕鬆地把項目放進二維佈局**——你先定義好一個由列與欄構成的網格結構，再把項目擺進去。這是一種「layout-in（先有結構，再放內容）」的思路，和 Flexbox「content-out」剛好相反。不過 Grid 並不只能做二維，它做一維也完全沒問題；而且對開發者有個好處：就算你一開始只排了一列，之後要再加上好幾列也很容易。

Grid 和 Flexbox 有非常多相似處：兩者都是「父容器（container）＋子項目（items）」的模型，對齊與定位的屬性名稱也很像（例如 `justify-content`、`align-items`）。但兩者也有許多差異與使用習慣上的分歧。舉個實際例子：如果你曾經很痛苦地想讓一堆項目**大小完全一致**卻怎麼喬都喬不好，用 Grid 會讓這種佈局簡單非常多。

### 一個常見誤解：Grid 不是來取代 Flexbox 的

在查閱較舊的資料時要留意，Flex 與 Grid 的差異會隨著模組更新而改變。最典型的例子就是 `gap` 屬性（用來設定項目之間的間距，下一課會詳細講）：它一開始是 Grid 專屬的亮點功能，但現在 Flexbox 也支援了。所以拿舊文章比較兩者時，別把「當年的限制」當成「現在的事實」。

曾經有人以為 CSS Grid 是要來「取代」Flexbox 的，但學完這一系列你會明白：Grid 只是工具箱裡多出來的一把工具。兩者各有適合的場景，而且很多時候你會發現，把 Flex 和 Grid **搭配使用**才是最舒服的做法——例如用 Grid 搭出整頁的大骨架，再用 Flexbox 去排每個區塊內部的一排按鈕或導覽列。這部分會留到本系列的總結課再深入。這一課你只要先建立好「一維 vs 二維、content-out vs layout-in」這組心智模型就夠了；下一課我們就真的動手把一個 grid 做出來。

## 程式碼範例

這一課本身沒有作業，但為了讓你先對 Grid 的樣子有印象，這裡放一個最小可執行範例，對照 Flexbox 換行與 Grid 的差異。你可以把它存成 `index.html` 直接用瀏覽器打開。

```html
<!-- index.html：對照 Flexbox 換行 vs Grid 二維對齊 -->
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <style>
    /* 共用的卡片外觀 */
    .box {
      background: #6c9;
      padding: 1rem;
      text-align: center;
    }

    /* Flexbox 換行：第二列不保證跟第一列對齊 */
    .flex-demo {
      display: flex;
      flex-wrap: wrap;   /* 空間不夠就換行 */
      gap: 10px;
    }
    .flex-demo .box {
      flex: 1 1 150px;   /* 以 150px 為基準，能放大也能縮小 */
    }

    /* Grid：明確定義 3 欄，每欄各佔 1 份可用空間 */
    .grid-demo {
      display: grid;                        /* 讓容器變成 grid 容器 */
      grid-template-columns: repeat(3, 1fr); /* 3 欄，1fr = 一份剩餘空間 */
      gap: 10px;                            /* 列與欄之間的間距 */
    }
  </style>
</head>
<body>
  <h2>Flexbox（一維、換行）</h2>
  <div class="flex-demo">
    <div class="box">1</div>
    <div class="box">2</div>
    <div class="box">3</div>
    <div class="box">4</div>
    <div class="box">5</div>
  </div>

  <h2>Grid（二維、嚴格對齊）</h2>
  <div class="grid-demo">
    <div class="box">1</div>
    <div class="box">2</div>
    <div class="box">3</div>
    <div class="box">4</div>
    <div class="box">5</div>
  </div>
</body>
</html>
```

重點在 `.grid-demo`：只要在容器上寫 `display: grid`，它的直接子元素就自動變成 grid items（格線項目）；`grid-template-columns: repeat(3, 1fr)` 定義了三個等寬的欄（column track，欄軌道），`1fr` 代表「一份剩餘空間（fraction）」，所以第 4、5 個項目換到第二列時，仍會與上方欄位精準對齊——這正是 Flexbox 換行做不到的事。這些語法下一課會逐一拆解，這裡先看個感覺即可。

## 常見陷阱

!!! warning "以為 Grid 是來取代 Flexbox 的"
    Grid 不是 Flexbox 的升級版或替代品，兩者是互補的工具。判斷準則很簡單：只需要控制**單一方向**（一整列或一整欄）就用 Flexbox；需要同時控制**列與欄兩個方向**就用 Grid。實務上最強的做法往往是兩者搭配——Grid 搭大骨架、Flexbox 排區塊內部。

!!! warning "拿舊文章比較 Flex 與 Grid"
    兩個模組都在持續更新，舊資料裡「只有 Grid 才有」的功能，現在 Flexbox 可能也支援了。最典型的就是 `gap` 屬性：它原本是 Grid 專屬，如今 Flexbox 也能用。看比較文時，記得確認資訊是否仍然成立。

!!! warning "用 Flexbox 硬做二維佈局"
    Flexbox 加上 `flex-wrap` 雖然能換行，但那是 content-out（由內容往外推），第二列不會自動對齊第一列。如果你為了對齊而開始在 flex 項目上寫死固定寬度、把彈性關掉，這就是該換成 Grid 的訊號。

## 練習

本課原文明確寫著：**Surprise! No assignment!**（驚喜！這一課沒有作業！）Grid 系列真正的操作會從下一課開始，所以這裡沒有需要動手的專案。

不過建議你趁這個空檔做兩件事，替下一課暖身：

1. 回頭把 Foundations 的 Flexbox 觀念快速過一遍，特別是 main/cross 兩條軸、對齊、以及 grow/shrink，確認自己還記得 → 檢查點：能用一句話說出「Flexbox 是一維」是什麼意思。
2. 把上面「程式碼範例」的 HTML 存檔用瀏覽器打開，把視窗拉寬拉窄，觀察 Flexbox 換行後第二列「對不齊」、而 Grid 永遠「對得齊」的差別 → 檢查點：能親眼指出兩者換行後的排列差異。

## 原文與延伸資源

- 原文：[Introduction to Grid](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-introduction-to-grid)
- 本課引用：
    - MDN — [Basic concepts of grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout)（grid 容器、track、`fr` 單位與 `gap` 的入門）
    - MDN — [Relationship of grid layout with other layout methods](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Relationship_of_grid_layout_with_other_layout_methods)（一維 vs 二維、content-out vs layout-in 的取捨）
    - The Odin Project — [Introduction to Flexbox](https://www.theodinproject.com/lessons/foundations-introduction-to-flexbox)（複習 Flexbox 的起點）

---

> 本講義改寫自 The Odin Project《Introduction to Grid》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
