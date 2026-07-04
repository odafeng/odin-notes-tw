---
title: 對齊（Alignment）
source_url: https://www.theodinproject.com/lessons/foundations-alignment
source_file: vendor/curriculum/foundations/html_css/flexbox/flexbox_alignment.md
path: foundations
course: Foundations
order: 29
generated: 2026-07-03
---

# 對齊（Alignment）

> 改寫自 The Odin Project：[Alignment](https://www.theodinproject.com/lessons/foundations-alignment)
> ｜Foundations › Flexbox

## 核心概念

到目前為止，我們對 flex item（flex 項目）用的都是 `flex: 1`，讓所有項目平均地成長或收縮，把 flex container（flex 容器）裡的空間填滿。但實際排版時，這往往不是我們要的效果。很多時候，項目有它自己該有的大小，我們真正想控制的是「這些固定大小的項目，要怎麼在容器裡分布與對齊」。舉例來說，一排導覽選單、一組卡片、一個要垂直置中的對話框，項目尺寸都是固定的，需要的只是把它們擺到正確的位置。這一課要學的，就是如何在容器裡把項目沿著水平與垂直方向對齊。

想像一個高度比項目還高的容器，裡面放了幾個固定寬高的方塊。如果你在方塊上加 `flex: 1`，它們會撐開、填滿整條主軸；但只要把 `flex: 1` 拿掉、改在容器上設定對齊屬性，方塊就會維持原本的大小，並依你的指定重新分布。掌握對齊屬性後，你不需要再靠一堆 margin 與 padding 手動微調位置，交給 flexbox 統一處理即可。

### 兩條軸，兩個屬性

要理解對齊，先要記住上一課的兩條軸：main axis（主軸）與 cross axis（交錯軸）。當 `flex-direction` 是預設的 `row` 時，主軸是水平的、交錯軸是垂直的。Flexbox 用兩個不同屬性分別控制這兩條軸：

- `justify-content` 控制項目沿著**主軸**的排列。
- `align-items` 控制項目沿著**交錯軸**的排列。

這是初學者最容易搞混的地方，稍後會特別提醒。

### justify-content：沿主軸分布

假設容器裡有三個固定寬度的方塊。把 `flex: 1` 拿掉、改在容器上加 `justify-content`，方塊會維持原本的寬度，但在主軸上換一種分布方式。常用的值有：

- `flex-start`（預設）：項目往主軸的起點靠攏。
- `flex-end`：項目往主軸的終點靠攏。
- `center`：項目在主軸上置中，擠成一團置於中央。
- `space-between`：項目之間平均分配空間；**第一個項目貼起點、最後一個項目貼終點**，兩端不留空隙。
- `space-around`：每個項目的**左右兩側**都分到等量空間。因為相鄰兩個項目各自帶著自己那一半空隙，中間的間隔看起來是邊緣間隔的兩倍。
- `space-evenly`：所有間隔都相等，包含項目與項目之間、以及項目與容器邊緣之間，全都一樣寬。

`space-between`、`space-around`、`space-evenly` 常被搞混，關鍵差別在「邊緣」：`space-between` 兩端完全貼邊；`space-around` 兩端各留半格、中間是兩倍；`space-evenly` 則是所有空隙一律等寬。

### align-items：沿交錯軸對齊

如果說 `justify-content` 管的是「一整排項目在主軸上怎麼分布」，那 `align-items` 管的就是「每個項目在交錯軸上停在哪個位置」。它決定項目在交錯軸（預設是垂直方向）上怎麼擺，常用的值：

- `stretch`（預設）：項目在交錯軸方向被拉伸、填滿容器高度（前提是項目沒有指定固定的 `height`）。這也是為什麼沒設對齊時，flex item 常常自動變得一樣高。
- `flex-start`：項目靠交錯軸起點（預設情況下就是頂端）。
- `flex-end`：項目靠交錯軸終點（底端）。
- `center`：項目在交錯軸上置中。
- `baseline`：項目依照內部文字的基線對齊，適合字級不同時讓文字排在同一條線上。

### 完美置中一個 div

Flexbox 讓「置中」變得非常簡單。只要在容器上同時設 `justify-content: center`（主軸置中）與 `align-items: center`（交錯軸置中），子元素就會落在容器正中央——不論它多大。在 flexbox 出現之前，垂直置中是 CSS 有名的難題，得靠 `position`、負 margin 或 `line-height` 等各種取巧手法；現在兩行就能解決。這是 flexbox 最實用、也最常被用到的一招，值得牢牢記住。

### 換了 flex-direction，行為就對調

`justify-content` 與 `align-items` 是綁在「主軸／交錯軸」上的，不是綁在「水平／垂直」上。所以當你把 `flex-direction` 改成 `column`，主軸變成垂直、交錯軸變成水平，兩個屬性的效果就跟著對調：`justify-content` 改為垂直對齊、`align-items` 改為水平對齊。這是初學者最大的卡點之一——同一段 CSS，只因方向改變，對齊結果就整個轉了 90 度。遇到「怎麼設都不對」時，先回頭確認目前的主軸方向。

### align-self：單獨覆寫某個項目

`align-items` 是套用在容器上、影響所有項目的。若只想讓「某一個」項目對齊方式不同，可以在那個項目上用 `align-self`，它接受和 `align-items` 相同的值，並覆寫容器的設定（`auto` 代表跟隨容器）。例如整排項目靠上、但其中一個要置中。

### 進階一：多行時用 align-content

`align-items` 處理的是「單一行」內項目的交錯軸對齊。當容器加了 `flex-wrap: wrap`、項目換成多行時，就會多出另一個問題：這些「行」彼此之間要怎麼分布？這由 `align-content` 負責，它的值和 `justify-content` 很像（`flex-start`、`flex-end`、`center`、`space-between`、`space-around`、`space-evenly`、預設的 `stretch`），只是作用對象從「項目」變成「整行」。要看到它的效果，容器必須有多餘的交錯軸空間、而且確實有換行；只有一行時，`align-content` 不會有任何作用。

### 進階二：用 auto margin 把項目推開

除了 `justify-content`，還有一個沿主軸分配空間的小技巧：在某個項目上設 `margin-left: auto`（或對應方向的 auto margin），這個 auto margin 會吃掉主軸上所有剩餘空間，把該項目連同它後面的項目整批推到另一端。導覽列常見「Logo 靠左、選單靠右」的排法，就可以在要靠右的第一個項目上加 `margin-left: auto` 一行搞定，不必動用 `justify-content`。

### gap：項目之間的間隔

`gap` 是很實用的屬性。在容器上設 `gap`，會在 flex item 之間加入指定的間距，效果類似替項目加 margin，但只作用在項目**之間**，不會在容器最外緣多留空白。它比手動加 margin 乾淨得多，而且在所有現代瀏覽器都能穩定使用。搭配前面學到的對齊屬性，光是這些就足以拼出相當專業的版面。

## 程式碼範例

```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>
```

```css
.container {
  display: flex;
  height: 200px;                  /* 給容器高度，交錯軸才有空間可對齊 */
  justify-content: space-between; /* 主軸（水平）：兩端貼邊、中間平均 */
  align-items: center;            /* 交錯軸（垂直）：垂直置中 */
  gap: 8px;                       /* 項目之間至少留 8px 間隔 */
}

.item {
  width: 60px;
  height: 60px;
  background: steelblue;
}
```

想把某個項目單獨往下對齊，只要在它身上加 `align-self`：

```css
/* 只有第二個項目靠交錯軸終點（底端），其餘維持置中 */
.item:nth-child(2) {
  align-self: flex-end;
}
```

想把單一元素完美置中，最小寫法如下：

```css
.container {
  display: flex;
  justify-content: center; /* 主軸置中 */
  align-items: center;     /* 交錯軸置中 */
  height: 300px;
}
```

## 常見陷阱

!!! warning "改了 flex-direction，justify-content 和 align-items 會對調"
    這兩個屬性綁的是主軸與交錯軸，不是固定的水平與垂直。`flex-direction: row` 時 `justify-content` 管水平、`align-items` 管垂直；一旦改成 `column`，兩者的方向立刻互換。當你發現「明明寫了 `align-items: center` 卻沒有垂直置中」，先確認目前的 `flex-direction`。

!!! warning "align-items: stretch 需要項目沒有固定高度才看得出來"
    交錯軸的預設值是 `stretch`，會把項目拉滿容器。但如果你已經替項目指定了固定 `height`，就無法再被拉伸，`stretch` 看起來就像沒作用。想觀察對齊效果，記得先給容器一個高度、並注意項目本身有沒有鎖死尺寸。

!!! warning "分清楚 space-between、space-around、space-evenly 的邊緣"
    三者中間看起來都很平均，差別在容器邊緣：`space-between` 兩端貼邊、完全不留白；`space-around` 兩端各留半格（所以項目之間的間隔是邊緣的兩倍）；`space-evenly` 則是所有空隙一律等寬。選錯值，版面邊緣的留白就會不如預期。

## 練習

1. 先讀 Josh Comeau 的[互動式 Flexbox 指南](https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/)。裡面用生動的互動範例把本課概念再走一遍，有些會是複習，但這些基礎很重要，值得花時間。
2. 讀 CSS-Tricks 的經典文章 [A Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)。圖片與範例都很清楚，建議看第 1–3 部分與第 5 部分（media query 的段落之後課程會教，先跳過），並把它加入書籤當作日後的速查表。
3. 玩一輪 [Flexbox Froggy](https://flexboxfroggy.com/)：用趣味小遊戲練習用 flexbox 移動物件的位置。
4. 到 The Odin Project 的 [css-exercises 儲存庫 `foundations/flex` 目錄](https://github.com/TheOdinProject/css-exercises/tree/main/foundations/flex)，依序完成下列練習（每題的說明都在該資料夾的 README，解答放在各自的 `solution` 資料夾）：
    - `01-flex-center`
    - `02-flex-header`
    - `03-flex-header-2`
    - `04-flex-information`
    - `05-flex-modal`
    - `06-flex-layout`
    - `07-flex-layout-2`

## 原文與延伸資源

- 原文：[Alignment](https://www.theodinproject.com/lessons/foundations-alignment)
- 本課引用：
    - [MDN：Aligning items in a flex container](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Aligning_Items_in_a_Flex_Container)（`justify-content`、`align-items`、`align-self`、`gap` 的完整值與行為）
    - [CSS-Tricks：A Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)（`space-between`／`space-around`／`space-evenly` 的差異與速查表）
    - [Josh Comeau：An Interactive Guide to Flexbox](https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/)（互動教學，建議親手操作）
    - [Flexbox Froggy](https://flexboxfroggy.com/)（互動小遊戲，練習對齊；本文未抓取內容，僅列為延伸練習）

---

> 本講義改寫自 The Odin Project《Alignment》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
