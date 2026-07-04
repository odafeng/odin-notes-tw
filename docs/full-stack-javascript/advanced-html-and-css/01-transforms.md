---
title: CSS Transform 變形
source_url: https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-transforms
source_file: vendor/curriculum/advanced_html_css/animation/transforms.md
path: full-stack-javascript
course: Advanced HTML and CSS
order: 1
status: draft
generated: 2026-07-03
---

# CSS Transform 變形

> 改寫自 The Odin Project：[Transforms](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-transforms)
> ｜Full Stack JavaScript › Advanced HTML and CSS › Animation

## 核心概念

`transform` 是一個能改變元素外觀的 CSS 屬性：你可以讓元素旋轉、縮放、傾斜或位移，卻**不會影響到文件的自然排版流（document flow）**。這一點是理解 `transform` 的關鍵——被變形的元素在版面上「佔的位置」不會改變，周圍的元素也不會跟著挪動，變形只是在「繪製階段」把它畫到別的地方、畫成別的樣子。正因如此，`transform` 是製作各種動畫效果最常用的工具之一。

### transform 怎麼運作

`transform` 的值是一個或多個 **transform function（變形函式）**，每個函式再各自吃一個值，通常是角度（如 `45deg`）、數字（如 `2`）或百分比（如 `50%`）。例如：

```css
.element {
  transform: rotate(45deg);
}
```

幾乎所有元素都能套用 `transform`，只有三個例外：`<col>`、`<colgroup>`，以及**非替換型的行內元素（non-replaced inline element）**。所謂「替換型（replaced）」元素，是指內容來自 HTML 文件外部、由外部內容「取代」了元素本身的元素，例如 `<img>`、`<video>`、`<iframe>`；而「非替換型」則是內容就寫在 HTML 裡的元素，例如 `<span>`、`<b>`、`<em>`。你不需要背下所有非替換型元素，只要記得：**如果你對某個行內元素套 `transform` 卻沒反應**，很可能就是踩到這個限制，把它改成 `inline-block` 或 `block` 通常就能生效。

### 二維（2D）變形

2D 變形有四個核心函式：`rotate`、`scale`、`skew`、`translate`。

- **`rotate()`（旋轉）**：讓元素在 2D 平面上以中心點為軸旋轉，值是角度。`rotate(45deg)` 順時針轉 45 度，負值則逆時針。
- **`scale()`（縮放）**：以倍率放大或縮小。`scale(2)` 放大為兩倍，`scale(0.5)` 縮成一半。可分軸控制：`scaleX()` 只縮放水平方向、`scaleY()` 只縮放垂直方向，`scale(2, 0.5)` 則同時指定 X 與 Y。
- **`skew()`（傾斜）**：讓元素沿軸傾斜，值是角度。`skewX()` 沿水平軸傾斜、`skewY()` 沿垂直軸傾斜，`skew(10deg, 20deg)` 同時指定兩軸。傾斜會讓方形變成平行四邊形。
- **`translate()`（位移）**：把元素從原位平移。`translateX()` 水平移動、`translateY()` 垂直移動，`translate(x, y)` 同時指定。值可用像素（`px`）或百分比；**百分比是相對於元素自身的尺寸**，這讓 `translate(-50%, -50%)` 成為置中元素的經典技巧。

### 串接多個變形（chaining）

你可以在一個 `transform` 裡放多個函式，中間用**空格**分隔，它們會由左到右依序套用：

```css
transform: rotate(45deg) translate(200%);
```

這裡有個常被忽略的重點：**函式的順序會影響結果**，因為每一次變形都會連同座標軸一起改變。先 `rotate` 再 `translate`，位移會沿著「已經轉過的軸」進行；先 `translate` 再 `rotate`，則是先移動、再原地旋轉。兩者的最終位置通常完全不同（後面的範例會實際示範）。

### 三維（3D）變形

`rotate`、`scale`、`translate` 不只能用在 2D 平面，它們也有 3D 版本。不過要讓 3D 效果「看起來有立體感」，通常需要搭配 `perspective`（透視）。

- **`perspective()`（透視）**：設定觀察者到 `z = 0` 平面的距離，簡單說就是「你站在多遠看這個物件」。距離越近（值越小），透視變形越誇張；越遠則越平。**與其他函式不同，`perspective` 在串接時必須寫在最前面（最左邊）**，這是串接順序唯一的硬性例外。
- **`rotateX()` / `rotateY()` / `rotateZ()` / `rotate3d()`**：分別繞 X、Y、Z 軸旋轉。`rotateX` 像是把卡片往前後翻，`rotateY` 像左右翻，`rotateZ` 等同 2D 的 `rotate`。
- **`scaleZ()` / `scale3d()`**：沿 Z 軸或同時沿三軸縮放。
- **`translateZ()` / `translate3d()`**：沿 Z 軸移動。`translateZ` 單獨使用幾乎看不出效果，要**搭配 `perspective`** 才會產生「物件靠近或遠離螢幕」的立體錯覺。

### matrix：把所有變形合而為一

`matrix()` 與 `matrix3d()` 能用一組矩陣數值表達上述所有變形的組合。它幾乎不會手寫，因為可讀性極差，通常由工具或函式庫產生。你只需要**知道它存在、大概知道它在做什麼**即可，不必熟練使用。

### 為什麼要用 transform？效能上的好處

理解 `transform` 的價值，要先認識瀏覽器的**像素管線（pixel pipeline）**。瀏覽器把畫面呈現到螢幕，大致經過幾個階段：計算樣式（style）、版面配置（layout，又稱 reflow）、繪製（paint）、合成（composite）。改動不同的 CSS 屬性，會觸發不同深度的階段——越前面的階段被觸發，代價越高，因為後面的階段都得跟著重來。

`transform` 的關鍵優勢是：它只在**合成（composite）**階段作用，**不會觸發 layout 或 paint**。這代表用 `transform` 移動元素，比改 `top`／`left`／`margin` 那類會引發 reflow 的屬性便宜得多、順暢得多。此外，`transform`（以及 `opacity`）通常能交由裝置的 **GPU（圖形處理器）** 做硬體加速。你不需要懂 GPU 的運作細節，只要記得：這個好處在**過場（transition）與動畫（animation）**上特別明顯——這也是接下來幾課的主題。

## 程式碼範例

下面用一個「串接順序影響結果」的例子，把 2D 變形和串接觀念一次講清楚。兩個方塊起點相同，套用相同的 `rotate` 與 `translate`，只差在順序：

```html
<div class="box red"></div>
<div class="box blue"></div>
```

```css
.box {
  position: absolute;
  width: 100px;
  height: 100px;
}

/* 先旋轉，再沿「已旋轉的 X 軸」位移 → 往右下方跑 */
.red {
  background: red;
  transform: rotate(45deg) translate(200%);
}

/* 先位移到右邊，再原地旋轉 45 度 → 停在正右方並轉個角度 */
.blue {
  background: blue;
  transform: translate(200%) rotate(45deg);
}
```

紅色方塊先轉 45 度，座標軸也跟著轉，所以之後的 `translate(200%)` 是沿斜向的軸移動，最終落在右下方；藍色方塊先往右平移 200%，再原地旋轉 45 度，最終停在正右方。相同的函式、不同的順序，結果完全不一樣。

下面再示範一個需要 `perspective` 的 3D 位移。注意 `perspective` 寫在最前面：

```css
.card {
  /* perspective 必須最左邊；translateZ 讓卡片「朝螢幕外靠近」 */
  transform: perspective(600px) translateZ(100px);
}
```

`perspective(600px)` 假設觀察距離為 600px，`translateZ(100px)` 把卡片沿 Z 軸往觀察者方向拉近 100px，於是卡片看起來被放大、有貼近螢幕的立體感。若拿掉 `perspective`，`translateZ` 幾乎不會有可見效果。

## 常見陷阱

!!! warning "行內元素套 transform 沒反應"
    非替換型的行內元素（如 `<span>`、`<em>`）無法套用 `transform`。若你的變形毫無效果，先檢查元素的 `display`，把它改成 `inline-block` 或 `block` 再試。

!!! warning "串接順序會改變結果"
    `transform` 的多個函式由左到右依序套用，且每次變形會連同座標軸一起改變。`rotate(45deg) translate(200%)` 與 `translate(200%) rotate(45deg)` 的最終位置通常不同。順序不是可隨意調換的。

!!! warning "perspective 必須寫在最前面"
    在串接中，`perspective` 是唯一有位置硬性要求的函式，必須放在最左邊，否則 3D 透視不會如預期生效。

!!! warning "translateZ 單獨用看不出效果"
    `translateZ` 需要搭配 `perspective` 才會產生遠近的立體錯覺。單獨寫 `translateZ` 而沒有 `perspective`，畫面上幾乎不會有變化。

!!! warning "translate 的百分比是相對自己，不是父層"
    `translate()` 的百分比以**元素自身尺寸**計算，這與 `width`／`left` 用百分比時相對父容器的行為不同。經典的 `translate(-50%, -50%)` 置中技巧正是利用這一點。

## 練習

1. 打開 MDN 的 [`rotate3d()` 示範](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d)，動手調整三個軸向量與角度，觀察立方體如何繞任意軸旋轉。
2. 閱讀 [CSS 的 perspective 專章](https://3dtransforms.desandro.com/perspective)，理解透視距離大小如何影響立體感的強弱。
3. 看 MDN 的 [`translate3d()` 示範](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate3d)，比較它與 2D `translate` 的差異。
4. 讀完 Josh Comeau 的長文 [The World of CSS Transforms](https://www.joshwcomeau.com/css/transforms/)，這是把 transform 的直覺建立起來最好的一篇資源。

完成後，試著不看講義回答：`transform` 的四個主要函式是哪些？哪個函式能沿 X／Y／Z 軸移動物件？哪個能放大縮小物件？3D 變形通常還需要哪個函式輔助？

## 原文與延伸資源

- 原文：[Transforms](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-transforms)
- 本課引用：
    - [MDN：`transform-function` 值總覽](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function)
    - [MDN：`rotate3d()`](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d)
    - [MDN：`translate3d()`](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate3d)
    - [Perspective（David DeSandro，3D Transforms）](https://3dtransforms.desandro.com/perspective)
    - [The World of CSS Transforms（Josh Comeau）](https://www.joshwcomeau.com/css/transforms/)
    - 效能背景：像素管線（The Pixel Pipeline）與 CSS triggers 概念

---

> 本講義改寫自 The Odin Project《Transforms》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
