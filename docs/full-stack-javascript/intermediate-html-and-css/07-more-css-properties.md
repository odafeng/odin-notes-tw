---
title: 更多 CSS 屬性
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-more-css-properties
source_file: vendor/curriculum/intermediate_html_css/intermediate_css_concepts/more_css_properties.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 7
status: draft
generated: 2026-07-03
---

# 更多 CSS 屬性

> 改寫自 The Odin Project：[More CSS Properties](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-more-css-properties)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Intermediate CSS Concepts

## 核心概念

到這裡為止，你對 CSS 的基礎觀念（selector、box model（盒模型）、Flexbox、Grid 等）應該已經相當熟悉了。但 CSS 能做的事遠不只如此，還有一批「小而實用」的屬性，能替你的網站加上一層打磨過的質感：陰影、圓角、透明度、可捲動的區塊、鋪滿的背景圖案等等。這一課就是把這些日常會反覆用到的屬性集中介紹一遍。

CSS 的屬性非常多，但你不需要把它們背下來。真正每天會用到的其實是很小的一組。本課的重點是「知道它們存在、大致知道它們在做什麼」，等真的要用時再查文件、微調數值即可。以下逐一介紹 `background`、`border`、`border-radius`、`box-shadow`、`overflow`、`opacity` 這幾個屬性。

### background（背景）

你大概已經用過 `background-color` 來設定背景顏色，但 `background` 能做的事多很多。`background` 其實是一個 shorthand（簡寫屬性），一次涵蓋 8 個與背景相關的子屬性：

| 子屬性 | 作用 | 預設值 |
| --- | --- | --- |
| `background-color` | 背景填色 | `transparent` |
| `background-image` | 背景圖片或 gradient（漸層） | `none` |
| `background-position` | 背景圖的位置 | `0% 0%` |
| `background-size` | 背景圖的尺寸 | `auto` |
| `background-repeat` | 圖片如何鋪排（tile，鋪磚） | `repeat` |
| `background-origin` | 定位的原點區域 | `padding-box` |
| `background-clip` | 背景延伸到哪個邊界為止 | `border-box` |
| `background-attachment` | 背景是否隨內容捲動 | `scroll` |

其中最常調整、也最該記住的是 `background-repeat`。當背景圖比容器小、無法填滿時，瀏覽器預設會把圖「鋪磚」重複排滿整個區域。它的常見值有：

- `repeat`：往水平與垂直兩個方向重複鋪滿（預設）。
- `no-repeat`：只顯示一次，不重複。
- `repeat-x`：只在水平方向重複。
- `repeat-y`：只在垂直方向重複。
- `space`：重複並在每塊之間平均留白，讓圖不被裁切。
- `round`：縮放圖片，使它剛好能塞進整數個。

所以 knowledge check 問「讓背景圖 tile（鋪排重複）要用哪個屬性？」答案就是 `background-repeat`（或用 `background` shorthand 一起寫）。

一個值得記住的重點是：`background` shorthand 並非非用不可。有時候「單獨使用個別子屬性」反而更清楚、更好維護。這一點和 `flex`、`margin`、`padding` 這類 shorthand 不太一樣——那幾個幾乎永遠建議直接用簡寫，但 `background` 因為子屬性又多又雜，分開寫常常更容易讀。

另外，`background` 支援「多層背景」。用逗號分隔多組值，就能疊出多層。要注意的是：**寫在最前面的是最上層**，而 `background-color`（背景色）只能出現在最後一層。當你在 MDN 看到它的 **Formal Syntax（正式語法）** 一段長得很嚇人時不用怕——那只是因為許多子屬性都是可選的、位置也可以變動，所以形式定義才顯得複雜。

### border（邊框）

`border` 你應該也碰過了。它同樣是 shorthand，但比 `background` 簡單非常多。基本上你只要定義三樣東西：**寬度、樣式、顏色**。例如 `border: 2px solid black;` 就是「2px 寬、實線、黑色」。樣式常見的有 `solid`（實線）、`dashed`（虛線）、`dotted`（點線）、`double`（雙線）等。

### border-radius（圓角）

`border-radius` 用來把方角變成圓角。最單純的用法是給一個值，例如 `border-radius: 10px;`，四個角都會有相同的圓弧。

knowledge check 特別問到：「如何用 `border-radius` 做出圓形？」訣竅是——先讓元素是正方形（`width` 與 `height` 相等），再把 `border-radius` 設為 `50%`。50% 會讓每個角的圓弧半徑都等於邊長的一半，四段圓弧合起來剛好是一個完整的圓。如果元素是長方形，`50%` 得到的則是橢圓（或膠囊、藥丸形）。

你也可以替四個角分別指定不同半徑（例如 `border-radius: 10px 20px 30px 40px;`），但這種需求很少見。把它歸類到「需要時再查」即可，不必記語法。

### box-shadow（陰影）

顧名思義，`box-shadow` 替元素加上陰影效果。它常用來營造「深度感」，或在元素之間製造細緻的分隔。語法由下列值組成（方括號代表可選）：

```
box-shadow: [inset] <offset-x> <offset-y> [<blur-radius>] [<spread-radius>] <color>;
```

- `offset-x`：水平位移（必填）。負值讓陰影往左。
- `offset-y`：垂直位移（必填）。負值讓陰影往上。
- `blur-radius`：模糊半徑（可選）。值越大陰影越大越淡，不能為負，預設 `0`。
- `spread-radius`：擴散半徑（可選）。正值讓陰影變大、負值變小，預設 `0`。
- `color`：陰影顏色（可選）。省略時會採用元素本身的 `color`。
- `inset`：加上這個關鍵字，陰影會變成「內陰影」（凹陷效果），而非預設的外陰影。

用逗號分隔可以疊加多層陰影，同樣是**寫在前面的在上層**。

實務上要記住一個原則：**陰影要用得節制、含蓄**。優先選擇淡到幾乎看不見的淺色陰影，而不是又黑又濃或過亮的顏色——過重的陰影會讓畫面顯得廉價。

### overflow（溢位）

當一個元素的內容太多、塞不進它的框時，`overflow` 決定「多出來的部分怎麼辦」。它是控制水平與垂直兩軸的 shorthand，常見值：

- `visible`（預設）：不裁切，多出來的內容直接溢出到框外。
- `hidden`：裁切並隱藏溢出的內容，不出現捲軸（但仍可用程式捲動）。
- `scroll`：裁切，並且**永遠**顯示捲軸，不管需不需要。
- `auto`：裁切，只有在內容真的溢出時才顯示捲軸。這是響應式版面最實用的選擇。
- `clip`：像 `hidden` 一樣裁切，但完全禁止任何捲動。

最典型的用途，是替頁面內某個區塊加上捲軸，例如一張內容可捲動的 `card`（卡片）。所以 knowledge check 問「替元素加捲軸要用哪個屬性？」答案就是 `overflow`（實務上多用 `auto` 或 `scroll`）。

你也可以分軸控制：`overflow-x` 管水平、`overflow-y` 管垂直；或在 shorthand 給兩個值（第一個是水平、第二個是垂直）。要讓 `overflow` 真正生效，元素通常需要有明確的尺寸限制——垂直溢位需要設 `height` 或 `max-height`，水平溢位需要設 `width` 或 `max-width`，否則框會直接被內容撐大，根本沒有「溢出」可言。

### opacity（不透明度）

`opacity` 讓元素變得或多或少透明。值介於 `0`（完全透明、看不見）到 `1`（完全不透明）之間，例如 `opacity: 0.5;` 是半透明。它常用來做 hover（滑鼠移入）效果，或在元素互相堆疊時營造層次。

要特別注意：`opacity` 會影響**整個元素以及它所有的子元素**，連同文字、邊框、子節點都會一起變透明。如果你只想讓「背景」變透明、而文字保持清晰，就不要用 `opacity`，改用帶 alpha 的顏色，例如 `rgb(0 0 0 / 50%)` 或 `rgba(0, 0, 0, 0.5)` 來設定 `background-color`。knowledge check 問「讓元素透明要用哪個屬性？」答案是 `opacity`。

以上這些屬性都不難，難的是「知道什麼時候該用、用多少剛好」。多數時候答案是：克制一點。淡淡的陰影、恰到好處的圓角、必要時才出現的捲軸，會讓成品看起來乾淨而專業。

## 程式碼範例

```css
/* background shorthand：置中、縮到 80%、不重複的背景圖 */
.hero {
  background: no-repeat center / 80% url("hero.png");
}

/* 只讓背景圖水平鋪排（tile） */
.pattern {
  background: url("stripe.png") repeat-x;
}

/* 多層背景：logo 在上層，灰底在最後一層（背景色只能放最後一層） */
.card {
  background:
    center / contain no-repeat url("logo.svg"),
    #eeeeee url("texture.png") 35%;
}

/* border shorthand：寬度、樣式、顏色 */
.box {
  border: 2px solid #333;
}

/* 用 border-radius 做出圓形：正方形 + 50% */
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

/* box-shadow：淡淡的外陰影，營造層次 */
.raised {
  box-shadow: 2px 2px 6px 1px rgb(0 0 0 / 20%);
}

/* 內陰影（inset）製造凹陷感 */
.pressed {
  box-shadow: inset 0 2px 4px rgb(0 0 0 / 25%);
}

/* overflow：內容太多時才出現捲軸 */
.scroll-panel {
  width: 300px;
  height: 200px;
  overflow: auto;
}

/* opacity：hover 時整個元素半透明 */
.thumb:hover {
  opacity: 0.7;
}
```

## 常見陷阱

!!! warning "opacity 會讓文字也一起變透明"
    `opacity` 作用於整個元素及其所有子元素——文字、邊框、子節點都會跟著變淡。如果你只想讓背景半透明、文字保持清晰，不要用 `opacity`，改用帶 alpha 的顏色設定 `background-color`，例如 `background-color: rgb(0 0 0 / 50%);`。

!!! warning "overflow 沒設尺寸就不會出現捲軸"
    如果元素沒有明確的 `height`／`max-height`（垂直方向）或 `width`／`max-width`（水平方向），框會直接被內容撐開，根本不會發生「溢出」，`overflow: auto` 或 `scroll` 也就看不到捲軸。要限制尺寸，捲軸才有意義。

!!! warning "background-color 只能放在最後一層"
    寫多層背景時，`background-color`（背景色）只能出現在逗號分隔的最後一組。而且多層背景的堆疊順序是「先寫的在上層」，別把疊放順序記反了。

## 練習

依 The Odin Project 的 Assignment，這一課的作業是把下列 MDN 文件都瀏覽一遍，熟悉每個屬性可用的選項（不必背，知道大概能做什麼即可）：

1. 打開並閱讀 [`background`](https://developer.mozilla.org/en-US/docs/Web/CSS/background) 的 MDN 文件，特別留意 8 個子屬性與 `background-repeat` 的各種值。
2. 閱讀 [`border`](https://developer.mozilla.org/en-US/docs/Web/CSS/border)，確認你會用「寬度／樣式／顏色」三段式寫法。
3. 閱讀 [`border-radius`](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius)，並親手試出「正方形 + `border-radius: 50%` = 圓形」。
4. 閱讀 [`box-shadow`](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)，試著疊兩層陰影、並試一次 `inset` 內陰影。
5. 閱讀 [`overflow`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)，做一個固定高度、內容可捲動的卡片。
6. 閱讀 [`opacity`](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity)，做一個 hover 時淡出的元素。

建議邊讀邊在自己的練習頁面上動手改數值，觀察畫面變化，比純讀文件更能記住這些屬性的效果。

## 原文與延伸資源

- 原文：[More CSS Properties](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-more-css-properties)
- 本課引用：
  - [MDN：`background`](https://developer.mozilla.org/en-US/docs/Web/CSS/background)
  - [MDN：`border`](https://developer.mozilla.org/en-US/docs/Web/CSS/border)
  - [MDN：`border-radius`](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius)
  - [MDN：`box-shadow`](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)
  - [MDN：`overflow`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)
  - [MDN：`opacity`](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity)

---

> 本講義改寫自 The Odin Project《More CSS Properties》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
