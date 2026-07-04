---
title: Keyframes 關鍵影格動畫
source_url: https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-keyframes
source_file: vendor/curriculum/advanced_html_css/animation/keyframes.md
path: full-stack-javascript
course: Advanced HTML and CSS
order: 3
generated: 2026-07-03
---

# Keyframes 關鍵影格動畫

> 改寫自 The Odin Project：[Keyframes](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-keyframes)
> ｜Full Stack JavaScript › Advanced HTML and CSS › Animation

## 核心概念

在前一課我們認識了 transition（過渡），它能讓元素從一組樣式平滑地變化到另一組樣式。這一課要介紹的 animation（動畫）搭配 `@keyframes`（關鍵影格）at-rule，能做到 transition 做不到的事情。兩者概念相近，容易混淆，因此我們先釐清它們的差異，再深入 animation 的各個子屬性與 `@keyframes` 的語法。

### animation 與 transition 的差異

你可能會想：「animation 看起來跟 transition 幾乎一樣，那為什麼還要學 animation？」關鍵在於 animation 大幅擴充了 transition 沒有的能力，主要有三點差異：

- **迴圈（loop）**：transition 的設計目的是讓元素從一個狀態變到另一個狀態，它「可以」被設定成重複，但那不是它被設計出來的用途。animation 則是「刻意」為了迴圈而生的，天生就支援無限重複。

- **觸發條件（trigger）**：transition 需要一個觸發點才會啟動，例如 `:hover`、`:focus` 這類 pseudo-class（偽類），或是用 JavaScript 動態新增、移除 class。animation 不需要任何觸發條件；只要 HTML 元素就位、CSS 定義完成，動畫就會立刻開始播放（如果你是這樣設定的話）。

- **靈活度（flexibility）**：transition 沒有 animation 靈活。當你定義一個 transition，可以想像成你把元素送上一段「從 A 點到 B 點的直線旅程」。雖然 `transition-timing-function` 可以為這段變化的時間節奏加入一些變化，但跟 animation 提供的彈性相比仍相去甚遠。

兩者各有用武之地，除了參考上述差異，也要靠你自己判斷。舉例來說，如果你只是想在元素被啟用（active）時改變它的 opacity（不透明度），用 animation 就太 overkill（殺雞用牛刀）了；但如果你要處理更複雜的、有多個中間狀態或需要無限重複的效果，animation 才是正確的工具。

### 定義一個 animation 的兩個階段

定義一個 CSS animation 分成兩個獨立又互相搭配的階段，缺一不可：

1. **設定階段（configuration）**：在你想要套用動畫的元素上，透過 `animation-*` 系列屬性設定動畫的行為，例如要跑多久、名字叫什麼、重複幾次、方向如何。
2. **關鍵影格階段（keyframes）**：透過 `@keyframes` at-rule 描述動畫在不同時間點上，元素的樣式應該長什麼樣子。

這兩個階段靠一個「名字」串起來：設定階段用 `animation-name` 取一個名字，關鍵影格階段用 `@keyframes 名字` 去對應同一個名字。

### animation 的各個子屬性

先看設定階段常用的 `animation-*` 屬性。假設我們有一顆 `#ball` 元素，想讓它的背景色不斷地在紅色與綠色之間來回變化：

- **`animation-duration`**：一個動畫「週期（cycle）」要花多少時間。設成 `2s` 代表 `#ball` 跑完一次週期需要兩秒。
- **`animation-name`**：對應到 `@keyframes` 的自訂名稱。這是你自己取的名字，不是特定的 CSS 值，取名為 `change-color`、`pineapples` 或任何名字都可以，只要 `@keyframes` 用同一個名字即可。
- **`animation-iteration-count`**：動畫要重複幾次。可以是具體數字（`1`、`2`、`3`…），也可以是 `infinite`（無限重複，永遠跑下去）。
- **`animation-direction`**：決定動畫在跑完一個週期後，是要「反向再跑回來」還是「跳回起點重來」。設成 `alternate` 代表交替方向，`#ball` 會平滑地變回原本的顏色，而不是突然「跳」回紅色。

### `@keyframes` 是動畫的靈魂

設定階段只講了「怎麼跑」，真正描述「跑成什麼樣子」的是 `@keyframes`。它用 `from` 與 `to` 兩個關鍵字，指定動畫開始與結束時的樣式：

```css
@keyframes change-color {
  from {
    background-color: red;
  }
  to {
    background-color: green;
  }
}
```

這段 `@keyframes` 對應到前面用 `animation-name` 定義的 `change-color`，把 `#ball` 的 `background-color` 從紅色變到綠色。

有幾個重要觀念要記住：

- **`from` 與 `to` 其實是別名（alias）**：keyframes 用百分比來標示動畫發生的時間點，`from` 是 `0%` 的別名，`to` 是 `100%` 的別名。以我們 `animation-duration: 2s` 的例子來說，`from/0%` 可以讀作「第 0 秒時」，`to/100%` 讀作「第 2 秒時」。用 `from/to` 還是 `0%/100%` 沒有硬性規定，選一種風格並保持一致即可。

- **`@keyframes` 定義的是「一個週期」**：如果把 `animation-iteration-count` 改成 `2`，`#ball` 會先從紅變綠、再從綠變紅，然後動畫停止。注意不要把一次 iteration（迭代）想成「一個完整來回」，它指的是「從頭到尾的單一週期」（在 `alternate` 反向時，則是從尾到頭的單一週期）。

### 加入中間關鍵影格與 shorthand

`@keyframes` 最強大的地方，在於你可以在 `0%` 與 `100%` 之間插入任意多個中間關鍵影格，精細地控制動畫過程。中間關鍵影格「一定要用百分比」表示，只有 `0%/100%` 這兩個位置可以用 `from/to` 別名。

同時，我們可以用 `animation` 這個 shorthand（簡寫）屬性，把多個 `animation-*` 屬性寫在同一行：

```css
#ball {
  background-color: red;
  animation: 2s change-color infinite alternate;
}
```

這行 shorthand 依序等同於 `animation-duration: 2s`、`animation-name: change-color`、`animation-iteration-count: infinite`、`animation-direction: alternate`。

透過在 `50%`（也就是第 1 秒）加入一個關鍵影格，我們可以讓球在變色的同時，額外用 `transform: scale(2)` 把體積放大成兩倍。這讓你窺見 `@keyframes` 的威力：你可以在任何你想要的時間點加入關鍵影格、控制任何可動畫（animatable）的 CSS 屬性，替網頁元素加入真正有創意的效果。

## 程式碼範例

以下是一個可以直接開在瀏覽器裡執行的最小範例，示範 shorthand 寫法搭配中間關鍵影格。把它存成 `.html` 檔用瀏覽器開啟，就會看到一顆球在紅、藍、綠之間不斷來回變色，並在中途放大。

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <style>
    #ball {
      width: 100px;
      height: 100px;
      border-radius: 50%;      /* 讓正方形變成圓形 */
      background-color: red;    /* 起始顏色，也是動畫的 0% 狀態 */

      /* shorthand：時長 名稱 重複次數 方向 */
      animation: 2s change-color infinite alternate;
    }

    /* @keyframes 描述一個動畫週期內各時間點的樣式 */
    @keyframes change-color {
      from {                    /* 等同 0%，第 0 秒 */
        background-color: red;
      }

      50% {                     /* 中間關鍵影格必須用百分比，這裡是第 1 秒 */
        transform: scale(2);    /* 放大成兩倍 */
        background-color: blue;
      }

      to {                      /* 等同 100%，第 2 秒 */
        background-color: green;
      }
    }
  </style>
</head>
<body>
  <div id="ball"></div>
</body>
</html>
```

若你偏好 longhand（完整）寫法，設定階段可以拆開寫，效果完全相同：

```css
#ball {
  animation-duration: 2s;            /* 一個週期兩秒 */
  animation-name: change-color;      /* 對應 @keyframes 的名字 */
  animation-iteration-count: infinite; /* 無限重複 */
  animation-direction: alternate;    /* 交替方向，平滑地變回原色 */
}
```

## 常見陷阱

!!! warning "中間關鍵影格不能用 from/to"
    只有 `0%` 與 `100%` 這兩個位置能用 `from` 與 `to` 別名。任何介於中間的關鍵影格（例如一半的位置）「一定」要寫成百分比，例如 `50% { ... }`。若你誤寫成 `half` 或其他別名，該關鍵影格會被忽略。

!!! warning "iteration 不是「一個完整來回」"
    `animation-iteration-count` 計算的是「週期（cycle）」，也就是從頭到尾跑一次。在 `animation-direction: alternate` 下，紅變綠是第一個 iteration、綠變回紅是第二個 iteration。想要看到完整的一來一回，需要至少 2 次 iteration，而不是 1 次。

!!! warning "少了 @keyframes 或名字拼錯，動畫不會動"
    animation 需要「設定階段」與「`@keyframes` 階段」兩者搭配才會運作。如果 `animation-name` 的名字和 `@keyframes` 後面的名字對不起來（拼錯字、大小寫不符），動畫就完全不會播放，而且瀏覽器通常不會報錯，很容易讓人卡住。

!!! warning "animation 不需要觸發器，會立刻自動播放"
    與 transition 不同，animation 一旦定義好就會在頁面載入時立刻開始跑。如果你只是想在 `:hover` 時才觸發效果，直接把 animation 掛在元素上會導致它一進頁面就無限迴圈，這通常不是你要的結果。

## 練習

!!! note "動手做"
    1. 跟著 MDN 的〈Using CSS animations〉文章實作一遍，一邊讀一邊把範例打出來執行。
    2. 閱讀 MDN 的 `@keyframes` 參考文件，加深對關鍵影格如何實作的理解。
    3. 閱讀 Josh W. Comeau 的〈interactive guide to keyframes〉互動教學。
    4. 完成 The Odin Project 的 css-exercises repository 中 `advanced-html-css/animation` 目錄下的練習（指示寫在各資料夾的 README），依照以下順序：
        - `01-button-hover`
        - `02-pop-up`
        - `03-dropdown-menu`

    練習專案請回到[原文](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-keyframes)取得最新的 repository 連結與指示。

**自我檢核**：讀完後試著回答以下問題，答不出來就回頭複習對應段落。

- CSS animation 的 longhand 與 shorthand 寫法各長什麼樣子？
- 要怎麼在一個 animation 裡加入關鍵影格？
- 什麼情況該用 animation、什麼情況該用 transition？

## 原文與延伸資源

- 原文：[Keyframes](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-keyframes)
- 本課引用：
    - MDN〈Using CSS animations〉：https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations
    - MDN `@keyframes` 參考：https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes
    - MDN `animation` 參考：https://developer.mozilla.org/en-US/docs/Web/CSS/animation
    - Josh W. Comeau〈An Interactive Guide to Keyframe Animations〉：https://www.joshwcomeau.com/animation/keyframe-animations/
    - The Odin Project css-exercises：https://github.com/TheOdinProject/css-exercises/tree/main/advanced-html-css/animation

---

> 本講義改寫自 The Odin Project《Keyframes》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
