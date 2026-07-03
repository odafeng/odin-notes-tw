---
title: 定位（Positioning）
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-positioning
source_file: vendor/curriculum/intermediate_html_css/intermediate_css_concepts/positioning.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 9
status: draft
generated: 2026-07-03
---

# 定位（Positioning）

> 改寫自 The Odin Project：[Positioning](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-positioning)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Intermediate CSS Concepts

## 核心概念

到目前為止，你已經用 `margin`、`padding`、Flexbox 練習過把元素在畫面上搬來搬去。這些技巧全都建立在 CSS 的預設「定位模式（positioning mode）」之上。這個預設模式直覺好用，日後絕大多數的版面配置你仍然會靠它。但除此之外，CSS 還提供了其他定位方法，在某些特定情境會非常好用。

控制定位模式的屬性就是 `position`。它有五個值：`static`、`relative`、`absolute`、`fixed`、`sticky`。搭配 `position` 一起使用的是四個「偏移屬性（offset property）」：`top`、`right`、`bottom`、`left`。理解定位的關鍵，其實就是搞懂兩件事：**這個元素還在不在正常文件流（normal document flow）裡**、以及**這四個偏移屬性是相對於「誰」在計算**。這個「誰」在 CSS 規範裡有個正式名稱，叫做**包含區塊（containing block）**。

### 正常文件流是什麼

正常文件流是瀏覽器排版元素的預設方式：區塊元素（block element）由上往下堆疊、行內元素（inline element）由左往右排。當一個元素還在文件流裡，它會**佔據空間**，其他元素會因此被推開；反之，一旦元素被「移出文件流」，它就不再佔位，其他元素會當它不存在、直接補上它原本的位置。這是理解 `absolute` 與 `fixed` 的前提。

### static 與 relative

`position: static` 是每一個元素的預設值，也就是你一直在用的模式。它的重點是：**`top`、`right`、`bottom`、`left` 對它完全沒有作用**，`z-index` 也一樣無效。元素乖乖待在文件流裡的自然位置。

`position: relative` 幾乎和 `static` 一樣——元素仍留在文件流裡、仍佔據原本的空間——差別在於：這時偏移屬性開始生效，會讓元素**相對於它自己原本的位置**位移。舉例來說，`top: 40px; left: 40px;` 會把元素往下推 40px、往右推 40px，但**它原本佔的位置會被保留**，其他元素不會來填補，也不會跟著移動。換句話說，`relative` 造成的位移純粹是視覺上的偏移，不影響版面裡其他人的排列。

`relative` 還有一個非常重要的隱藏用途：它可以當作 `absolute` 子元素的定位基準（下面會講）。很多時候你在某個容器上加 `position: relative` 卻不設任何偏移，就是為了這個目的。

### absolute

`position: absolute` 讓你把元素放到畫面上某個精確的點，而**不去干擾周圍的其他元素**。更精確地說，對元素套用 absolute 定位會做兩件事：

1. 把該元素**移出正常文件流**——它不再佔空間，其他元素當它不存在。
2. 讓它**相對於「最近的、有定位的祖先元素」**來擺放。所謂「有定位」，指的是 `position` 不是 `static`（也就是 `relative`、`absolute`、`fixed`、`sticky` 都算）。如果往上找不到任何有定位的祖先，它就會相對於**初始包含區塊**（大致就是整份文件的根，也就是 `<html>` 對應的區域）來定位。

找到基準之後，你就用 `top`、`right`、`bottom`、`left` 把它釘在該基準的任意位置。例如 `top: 0; right: 0;` 會把它貼到基準的右上角。這就是為什麼「先在容器上加 `position: relative`，再在子元素上加 `position: absolute`」是一組非常常見的固定搭配——`relative` 負責把容器變成「有定位的祖先」，讓 `absolute` 子元素以這個容器為座標原點，而不是飄到整個頁面的角落去。

absolute 的好用情境包括：

- **modal（互動對話框、彈窗）**
- **疊在圖片上的文字說明（caption）**
- **疊在其他元素上的小圖示（icon）**

不過要提醒：**absolute 定位有很專門的用途，能用 Flexbox 或 Grid 就優先用它們**。不要拿 absolute 去排整頁的版面——那會讓版面變得脆弱、難以隨螢幕大小自適應。

當 `width` 與 `height` 是預設的 `auto` 時，absolute 元素的尺寸會縮到剛好包住內容為止；但如果你同時指定了 `top` 和 `bottom`（或 `left` 和 `right`），它會被撐開到填滿這段距離。另外，若 `top` 和 `bottom` 同時給值，`top` 優先；`left` 和 `right` 同時給值時，在由左至右的語言（如英文、中文）中 `left` 優先。

### fixed

`position: fixed` 同樣會**把元素移出正常文件流**，但它的定位基準不是某個祖先，而是**viewport（視覺區、瀏覽器可視視窗）**。你一樣用 `top`、`right`、`bottom`、`left` 決定它的位置，而它會**牢牢釘在那裡、不隨頁面捲動而移動**。這對於「不管使用者捲到哪都要一直看得到」的元素特別有用，例如固定在頂端的導覽列（navigation bar）、右下角的浮動聊天按鈕（floating chat button）、回到頂端按鈕等。

一個容易忽略的陷阱：如果 fixed 元素的某個祖先設了 `transform`、`perspective` 或 `filter`（值不是 `none`），那麼這個 fixed 元素的定位基準會改成那個祖先，而不是 viewport，行為就會跑掉。

### sticky

`position: sticky` 是 `relative` 和 `fixed` 的混合體。sticky 元素**不會被移出文件流**：一開始它表現得像一個普通（`relative`）元素，跟著頁面一起捲動；直到你捲動到它碰觸你設定的門檻（threshold）為止，這時它就切換成類似 `fixed` 的行為，黏在那個位置不再往上跑。

要讓 sticky 生效，你**必須至少設定 `top`、`right`、`bottom`、`left` 其中一個非 `auto` 的值**，這個值就是門檻。例如 `position: sticky; top: 0;` 表示「捲到這個元素快要離開視窗頂端時，就把它黏在距頂端 0 的位置」。如果一個門檻都不設，sticky 會退化成跟 `relative` 一樣、什麼都不黏。

sticky 最經典的用途是**分區標題（section heading）**。想像你在逛購物網站，往下捲一長串商品時，目前分類的標題會一直停在畫面上方，讓你隨時知道自己在看哪一類——這正是 sticky 做出來的效果，過去這種效果得靠 JavaScript 才能實現。

### fixed 與 sticky 的關鍵差別

這兩者最容易混淆，抓住三個重點就能分清楚：

| 面向 | `fixed` | `sticky` |
| --- | --- | --- |
| 是否留在文件流 | 否，移出文件流、不佔空間 | 是，仍佔空間 |
| 定位基準 | viewport（整個視窗） | 最近的捲動祖先／其父容器 |
| 捲動行為 | 從頭到尾釘死在原地 | 先跟著捲，碰到門檻才黏住 |

最關鍵的一點是 sticky 受**父容器（包含區塊）**的範圍限制：sticky 元素只會在它的父容器仍在畫面上時黏著；**一旦父容器整個捲出畫面，sticky 元素也會跟著離開**。fixed 則完全無視這層關係，永遠釘在 viewport 上。因此，如果你發現 sticky「沒有作用」，最常見的原因就是它的父容器高度太矮、或父容器本身很快就捲走了，導致根本沒有可黏的空間。

順帶一提，`relative`、`absolute`、`fixed`、`sticky` 這四種定位在特定條件下會建立**堆疊環境（stacking context）**，並讓 `z-index` 生效，用來控制元素前後疊放的層次；而 `static` 不吃 `z-index`。當你用 absolute 把 icon 疊在圖片上、卻發現它被蓋住時，`z-index` 就是你的解法。

### 什麼時候該用定位

一句話總結：**日常版面優先用 Flexbox 和 Grid**，`position` 是用來處理那些「脫離常規排版」的特例——把某個東西精準疊到另一個東西上（absolute）、讓某個元素永遠釘在畫面上（fixed）、讓標題在捲動時暫時吸附（sticky）。分清楚「還在不在文件流」與「相對於誰定位」，這一課的所有行為就都能推導出來。

## 程式碼範例

以下範例把三種主要定位放在一起，程式碼可直接貼進 `.html` 檔用瀏覽器開啟觀察。

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <style>
    /* fixed：釘在 viewport 頂端，捲動也不動 */
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #333;
      color: white;
      padding: 12px;
    }

    body {
      margin: 0;
      padding-top: 48px; /* 補上 navbar 的高度，避免內容被蓋住 */
    }

    /* relative 容器：作為 absolute 子元素的定位基準 */
    .card {
      position: relative;   /* 關鍵：讓內部 absolute 以這裡為原點 */
      width: 300px;
      margin: 20px;
    }

    .card img {
      width: 100%;
      display: block;
    }

    /* absolute：疊在圖片左上角的說明文字，不佔文件流空間 */
    .card .caption {
      position: absolute;
      top: 8px;
      left: 8px;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 4px 8px;
    }

    /* sticky：捲到頂端門檻就黏住的分區標題 */
    .section-heading {
      position: sticky;
      top: 48px;            /* 門檻：黏在 navbar 下方 */
      background: #f0c040;
      padding: 8px;
    }
  </style>
</head>
<body>
  <nav class="navbar">固定導覽列（fixed）</nav>

  <h2 class="section-heading">分區標題（sticky）</h2>

  <div class="card">
    <img src="https://via.placeholder.com/300x180" alt="示意圖" />
    <span class="caption">疊在圖片上的說明（absolute）</span>
  </div>

  <!-- 放很多內容讓頁面可以捲動，才看得出 fixed 與 sticky 的差異 -->
  <p style="height: 1200px;">往下捲動，觀察導覽列與標題的行為差異。</p>
</body>
</html>
```

觀察重點：`.navbar` 從頭到尾釘在頂端；`.section-heading` 一開始跟著內容捲，碰到 `top: 48px` 才黏住；`.caption` 精準疊在圖片左上角，且不會把圖片往下推。

## 常見陷阱

!!! warning "absolute 找不到定位基準，飄到整頁角落"
    對子元素設 `position: absolute` 後，如果它的祖先「全部」都是 `static`（沒有任何一個是 relative/absolute/fixed/sticky），它就會相對於整份文件定位，於是跑到整個頁面的角落而不是你想要的容器裡。解法：在想當作基準的容器上加 `position: relative`（通常不用設偏移值）。

!!! warning "sticky 沒作用：忘了設門檻或父容器太矮"
    sticky 必須至少設定 `top`／`right`／`bottom`／`left` 其中一個門檻值，否則會退化成 `relative` 完全不黏。此外，sticky 只在「父容器（包含區塊）還在畫面上」時才黏著——父容器一旦整個捲出畫面，sticky 元素就跟著離開。若父容器高度不夠或很快捲走，看起來就像 sticky 壞了。另外，若祖先設了 `overflow: hidden`，也可能讓 sticky 失效。

!!! warning "fixed 導覽列蓋住內容"
    fixed 元素被移出文件流、不佔空間，因此頁面內容會直接排在它下方而被蓋住。慣用解法是在 `body` 或內容容器加上等於 fixed 元素高度的 `padding-top`（或 `margin-top`）把內容推開。

!!! warning "祖先的 transform 讓 fixed 定位跑掉"
    如果 fixed 元素的某個祖先設了 `transform`、`filter` 或 `perspective`（非 `none`），fixed 的定位基準會從 viewport 改成那個祖先，導致「釘不住 viewport」。排查 fixed 異常時記得往上檢查祖先有沒有這些屬性。

## 練習

1. 觀看 Web Dev Simplified 的 [Learn CSS Position](https://www.youtube.com/watch?v=jx5jmI0UlXU) 影片。節奏偏快，但把各種定位行為視覺化得很清楚。
2. 閱讀 [MDN 的 `position` 文件](https://developer.mozilla.org/en-US/docs/Web/CSS/position)，它涵蓋定位的所有概念細節。
3. 閱讀 CSS-Tricks 的 [Absolute, Relative, Fixed Positioning](https://css-tricks.com/absolute-relative-fixed-positioining-how-do-they-differ/)，從另一個角度理解這個主題。
4. 最後閱讀 Kevin Powell 討論 [fixed 與 sticky 差異](https://www.kevinpowell.co/article/positition-fixed-vs-sticky/) 的文章，加深對兩者分別的理解。

動手小任務（自我檢核）：

- 用上面的程式碼範例當起點，自己做出一個「固定頂端導覽列 + sticky 分區標題 + 圖片上疊字」的頁面，捲動並確認三種定位各自的行為。
- 試著把 sticky 標題的父容器高度改小，觀察 sticky 何時「失效」，體會它受父容器範圍限制的特性。

完成後，你應該能回答本課的 Knowledge check：static 與 relative 的差別、absolute 適合用來做什麼、以及 fixed 與 sticky 的差異。

## 原文與延伸資源

- 原文：[Positioning](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-positioning)
- 本課引用：
  - [MDN：`position`](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
  - [Kevin Powell：position fixed vs sticky](https://www.kevinpowell.co/article/positition-fixed-vs-sticky/)
  - [CSS-Tricks：Absolute, Relative, Fixed Positioning](https://css-tricks.com/absolute-relative-fixed-positioining-how-do-they-differ/)

---

> 本講義改寫自 The Odin Project《Positioning》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
