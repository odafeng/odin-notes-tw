---
title: flex 的放大與縮小（Growing and Shrinking）
source_url: https://www.theodinproject.com/lessons/foundations-growing-and-shrinking
source_file: vendor/curriculum/foundations/html_css/flexbox/flexbox_growing_and_shrinking.md
path: foundations
course: Foundations
order: 27
generated: 2026-07-03
---

# flex 的放大與縮小（Growing and Shrinking）

> 改寫自 The Odin Project：[Growing and Shrinking](https://www.theodinproject.com/lessons/foundations-growing-and-shrinking)
> ｜Foundations › Flexbox

## 核心概念

### 從 `flex: 1` 說起

上一課你在 flex item（flex 項目）上寫了 `flex: 1`，於是容器裡的每個 div 都平均長大、最後變成一樣寬。這一課要拆解的，正是這行短短的 `flex: 1` 背後到底發生了什麼事。

答案是：`flex` 其實是一個 **shorthand property（簡寫屬性）**。所謂 shorthand，就是「一次設定多個相關屬性」的 CSS 語法糖——你之前用過的 `margin`、`padding`、`font` 都是這類屬性，它們讓樣式表更精簡也更好讀。而 `flex` 這個簡寫，一口氣設定了三個作用在 flex item 上的屬性：

- **flex-grow**：放大係數（growth factor）
- **flex-shrink**：縮小係數（shrink factor）
- **flex-basis**：項目的初始大小（initial size）

三者的順序固定是 `flex: <flex-grow> <flex-shrink> <flex-basis>`。以這個順序去讀，`flex: 1` 展開後就等同於 `flex-grow: 1; flex-shrink: 1; flex-basis: 0;`。換句話說，你其實同時告訴了每個 div 三件事：可以長大、可以縮小、而且「起始大小」都當作 0 來計算。三者一起作用，才讓所有 div 收斂成相同尺寸。

這三個屬性全部都是在調整 flex item 沿著 **main axis（主軸）** 的尺寸：預設橫向排列時，就是在調整寬度；若容器改成縱向排列（`flex-direction: column`），調整的就是高度。

### flex-grow：怎麼分配「多出來的空間」

`flex-grow` 接受一個數字，這個數字是該項目的「放大係數」。它的意義是：當 flex container（flex 容器）裡還有剩餘的空白空間時，這些空白要按什麼比例分給各個項目。

當我們對容器裡每個 div 都設 `flex: 1`（也就是 `flex-grow: 1`），等於叫它們「每個人分到的成長份額都一樣」，於是剩餘空間被均分，最後每個 div 都一樣大。但如果只把其中一個 div 改成 `flex: 2`，那它拿到的成長份額就是別人的兩倍，最終這個 div 會比其他人明顯更寬。

要特別記住：`flex-grow` 分配的是「剩餘空間」的比例，不是「最終寬度」的比例。項目最後的寬度，等於它的 flex-basis 起始寬度，再加上按 flex-grow 比例分到的那一份剩餘空間。只是當所有項目的 flex-basis 都是 0 時，起始寬度都一樣（都是 0），最終寬度才會剛好呈現放大係數的比例。`flex-grow` 的預設值是 `0`，代表「預設情況下項目不會主動長大去填滿多餘空間」。

### flex-shrink：空間不夠時，怎麼一起縮

`flex-shrink` 和 `flex-grow` 是一體兩面：它設定的是項目的「縮小係數」。關鍵差別在於它的觸發時機——**只有當所有 flex item 的總大小超過父容器時，`flex-shrink` 才會生效**。空間夠用時，它完全不作用。

舉個例子：假設三個 div 各自寫了 `width: 100px`，但 `.flex-container` 的寬度小於 300px，這時三個 div 加起來裝不下，就得縮小來塞進容器。`flex-shrink` 的預設值是 `1`，代表所有項目會「平均地一起縮」。如果你不希望某個項目被縮小，就設 `flex-shrink: 0;`，它便會固守自己的尺寸不退讓；你也可以給更大的數字，讓某個項目縮得比別人更快。

### flex item 不一定尊重你的 width

這裡有個很重要、也很容易讓人困惑的觀念：**一旦你設定了 `flex-grow` 或 `flex-shrink`，flex item 就不一定會乖乖遵守你給的 `width`。**

想像三個 div 都設了 `width: 250px`：當父容器夠大時，因為有 `flex-grow`，它們會超過 250px 一起長大去填滿容器；當父容器太小時，因為有 `flex-shrink`，它們又會縮到比 250px 更小以求塞下。也就是說，在 flexbox 裡，`width` 比較像是一個「參考起始值」，而不是「不可違背的固定寬度」。這不是瀏覽器的 bug，而是 flexbox 的設計行為——只是如果你沒預期到，很容易被嚇一跳。

### flex-basis：一切放大縮小的起跑點

`flex-basis` 設定的是 flex item 的「初始大小」，也就是在開始 grow 或 shrink 之前，項目沿主軸的起跑寬度。所有的放大、縮小，都是從這個基準值開始計算的。

`flex-basis` 本身的真正預設值是 `auto`，意思是「去看看這個項目有沒有設 `width`（或縱向時的 `height`），有的話就用那個值當基準；沒有的話才依內容大小決定」。

但這裡藏著一個經典陷阱：**`flex-basis` 自己的預設值，和 `flex` 簡寫在你「沒寫 flex-basis」時幫你補的值，是不一樣的。** 當你寫 `flex: 1`，瀏覽器把它解讀成 `flex: 1 1 0`——注意，flex-basis 被補成了 `0`，而不是 `auto`。

這個差別在前面的 `flex-shrink` 例子裡很關鍵。如果 flex-basis 是 `0`，項目會直接無視自己的 `width: 250px`（因為起跑點被設成 0），三個項目就會完全平均地縮放，`width` 形同虛設。要讓 `width: 250px` 真的被當成基準、讓某個項目不會縮到比 250px 更小，就必須把 flex-basis 改成 `auto`——`auto` 會叫項目回頭去查自己的 `width` 宣告。

### `flex: auto` 是什麼？

正因為上面這個差別，flexbox 另外提供了一個好記的簡寫關鍵字：`flex: auto`。它等同於 `flex-grow: 1; flex-shrink: 1; flex-basis: auto;`，用三值簡寫寫就是 `flex: 1 1 auto`。

請特別留意：`flex: auto` 和 `flex: 1` **不一樣**。兩者的 grow 與 shrink 都是 1，差別只在 flex-basis——`flex: 1` 的 basis 是 `0`（起跑點歸零，尺寸純看放大比例），`flex: auto` 的 basis 是 `auto`（起跑點先參考各自的內容或 width，再把剩餘空間分掉）。名字裡雖然有「auto」，但它並不是 `flex` 簡寫的預設值，這點初次接觸時很容易搞混。

### 幾個常用的 flex 關鍵字

除了直接給數字，`flex` 簡寫還有幾個 W3C 與 MDN 都推薦優先使用的關鍵字，記住它們展開後的值，能幫你快速判斷版面行為：

| 寫法 | 展開為 | 行為 |
| --- | --- | --- |
| `flex: initial` | `0 1 auto` | 不主動長大、可以被縮小，尺寸以 width/height 為準（這也是 flex item 的預設值） |
| `flex: auto` | `1 1 auto` | 可長大也可縮小，先以內容／width 為基準再彈性伸縮 |
| `flex: none` | `0 0 auto` | 完全不伸縮，尺寸固定，適合不想被動尺寸的項目 |
| `flex: 1`（`flex: <數字>`） | `1 1 0` | 完全彈性，忽略內容原始寬度，項目間依數字比例平均放大 |

### 實務上怎麼用

理論看起來很多，但實際寫版面時，你其實很少會用到複雜的 grow/shrink/basis 數值組合。最常見的兩種需求是：

- 想讓幾個 div 平均長大、填滿容器 → 直接 `flex: 1;`
- 想讓某個 div 保持固定、絕不被壓縮 → `flex-shrink: 0;`

當然，flexbox 也允許你玩得更花俏，例如讓幾個欄位維持特定的比例關係（像 2:1）。知道「可以這樣做」是有價值的，但這類進階用法在日常開發中相對少見，不必急著背。先把 `flex: 1`、`flex-shrink: 0`、以及 `flex: auto` / `flex: none` 這幾個常用組合用熟，就足以應付大部分版面了。

## 程式碼範例

下面兩個最小範例，分別示範 `flex-grow` 與 `flex-shrink` 的效果。可以貼進任一 HTML 檔案直接開來看。

**範例一：flex-grow 讓其中一欄長得比較大**

```html
<!-- 三欄共用一個 flex 容器 -->
<div class="flex-container">
  <div class="one">one</div>
  <div class="two">two</div>
  <div class="three">three</div>
</div>

<style>
  .flex-container {
    display: flex;
  }

  /* 每個項目基礎放大係數都是 1（等同 flex: 1 1 0） */
  .flex-container > div {
    flex: 1;
    border: 2px solid #555;
    padding: 20px;
  }

  /* 只把 .two 的放大係數改成 2，它會拿到兩倍的剩餘空間 */
  .two {
    flex: 2;
  }
</style>
```

`.two` 的放大係數是別人的兩倍，所以剩餘空間它分到最多，最終寬度約為其他兩欄的兩倍。

**範例二：flex-shrink 搭配 flex-basis: auto 守住最小寬度**

```html
<div class="flex-container">
  <div class="one">one</div>
  <div class="two">two</div>
  <div class="three">three</div>
</div>

<style>
  .flex-container {
    display: flex;
  }

  /* 關鍵：flex-basis 設為 auto，項目才會參考自己的 width */
  .flex-container > div {
    flex: 1 1 auto;
    width: 250px;
    border: 2px solid #555;
    padding: 20px;
  }

  /* 讓 .two 不會被壓縮，其他兩欄照樣可縮 */
  .two {
    flex-shrink: 0;
  }
</style>
```

把瀏覽器視窗慢慢縮小，你會看到 `.one` 和 `.three` 一起變窄，但 `.two` 始終維持在 250px——因為它的 `flex-shrink: 0` 讓它拒絕縮小。這裡若把 flex-basis 換回 `0`，`width: 250px` 就會被忽略，效果完全不同，正好凸顯 basis 的角色。

## 常見陷阱

!!! warning "flex-basis 的預設值 auto 與簡寫補的 0 不一樣"
    `flex-basis` 自己的真正預設值是 `auto`，但當你寫 `flex: 1`，瀏覽器會把它解讀成 `flex: 1 1 0`，flex-basis 被補成 `0`。basis 為 `0` 時項目會無視自己的 `width`、純依放大比例伸縮；basis 為 `auto` 時項目才會回頭參考 `width`。若你希望 `width` 真的被當基準，請用 `flex: 1 1 auto`（即 `flex: auto`），而不是 `flex: 1`。

!!! warning "設了 width 卻好像沒用"
    一旦項目有 `flex-grow` 或 `flex-shrink`，`width` 就只是「起始參考值」而非固定寬度：容器夠大時項目會超過 width 長大，容器太小時又會縮到比 width 更小。這是 flexbox 的正常行為。想真正固定某欄尺寸、不被壓縮，記得加上 `flex-shrink: 0;`。

!!! warning "把 flex: 1 和 flex: auto 當成同一個"
    兩者的 grow、shrink 都是 1，唯一差別是 flex-basis：`flex: 1` 是 `1 1 0`，`flex: auto` 是 `1 1 auto`。名字有「auto」不代表它是簡寫的預設值；`flex` item 真正的預設其實是 `flex: initial`（即 `0 1 auto`）。

## 練習

原課的 Assignment 是兩份延伸閱讀，建議照下面順序完成，讀完就能回答本課的 knowledge check：

1. 讀 [W3C「7.1.1 Basic Values of flex」](https://www.w3.org/TR/css-flexbox-1/#flex-common)，把 `flex: initial`、`flex: auto`、`flex: none`、`flex: <正數>` 這四個常用值分別展開成 flex-grow / flex-shrink / flex-basis，並理解它們各自的適用情境。
2. 讀 [MDN 的 flex 文件](https://developer.mozilla.org/en-US/docs/Web/CSS/flex)，它完整整理了 `flex` 簡寫的一值、二值、三值語法，以及各關鍵字的展開結果，補足前一篇沒提到的語法細節。
3. 自我檢測（對照 knowledge check）：不看講義，說出 `flex: 1 1 auto` 這個簡寫代表的三個屬性各是什麼；再說出 `flex: auto` 展開後的三個值（`1 1 auto`）。

## 原文與延伸資源

- 原文：[Growing and Shrinking](https://www.theodinproject.com/lessons/foundations-growing-and-shrinking)
- 本課引用：
  - [MDN — flex](https://developer.mozilla.org/en-US/docs/Web/CSS/flex)（flex 簡寫的一值／二值／三值語法、各關鍵字展開值）
  - [W3C — 7.1.1 Basic Values of flex](https://www.w3.org/TR/css-flexbox-1/#flex-common)（initial / auto / none / 數字 四個常用值的定義）
  - [MDN — Shorthand properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties)（簡寫屬性的觀念）

---

> 本講義改寫自 The Odin Project《Growing and Shrinking》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
