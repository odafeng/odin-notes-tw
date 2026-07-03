---
title: 盒模型（Box Model）
source_url: https://www.theodinproject.com/lessons/foundations-the-box-model
source_file: vendor/curriculum/foundations/html_css/css_foundations/the_box_model.md
path: foundations
course: Foundations
order: 24
status: draft
generated: 2026-07-03
---

# 盒模型（Box Model）

> 改寫自 The Odin Project：[The Box Model](https://www.theodinproject.com/lessons/foundations-the-box-model)
> ｜Foundations › CSS Foundations

## 核心概念

### 一切都是盒子

學 CSS，最關鍵的能力不是換字型或改顏色，而是 **positioning（定位）與 layout（版面配置）**：把每個元素精準地放到你要的位置。要做到這件事，第一個必須內化的觀念就是盒模型。

觀念本身不難：**網頁上的每一個東西，都是一個矩形盒子。** 盒子裡可以裝別的盒子，盒子之間可以並排。你在瀏覽器主控台貼上下面這段 CSS，就能親眼看到滿版的盒子：

```css
* {
  outline: 2px solid red;
}
```

`*` 是 universal selector（通用選擇器），會選到頁面上每一個元素；`outline` 則會沿著每個盒子的外緣畫一條紅線。就算畫面上看起來是圓形、是文字、是圖片，排版時它們全都以矩形的方式互相堆疊與嵌套。所以，做版面配置說到底，就是在決定「這些盒子要怎麼巢狀、怎麼堆疊」。

> 小提醒：這裡刻意用 `outline` 而不是 `border`，因為 `outline` 不佔空間、不會把版面推開，是用來「臨時觀察」而不干擾排版的好工具；`border` 則會實際佔用盒子的尺寸（下面會講到）。

### 盒模型的四層：由內而外

一個盒子從內到外分成四個部分，這個順序請務必記牢（knowledge check 會問）：

1. **content（內容）**：真正放文字、圖片的區域，尺寸由 `width` 與 `height` 決定。
2. **padding（內距）**：content 與 border 之間的空白。想像成盒子內部的「襯墊」，會把邊框往外撐開。padding **不能是負值**。若元素有背景色，背景會延伸到 padding 區域。
3. **border（邊框）**：包在 padding 外面的框線，有 width、style、color 三個面向。就算只有 1、2 像素，也會實際佔用空間。
4. **margin（外距）**：盒子最外層的空白，用來把「這個盒子的邊框」與「相鄰盒子的邊框」推開。margin **可以是負值**，負值會讓盒子往該方向被拉近、甚至與其他元素重疊。

用一句話總結三者的差別：

- `padding` 增加「邊框」與「內容」之間的空間（往內撐）。
- `border` 在 margin 與 padding 之間加上一圈框線。
- `margin` 增加「這個盒子的邊框」與「相鄰盒子的邊框」之間的空間（往外推）。

### block 盒子與 inline 盒子

盒子依「外層排版方式」分兩種，這會決定它怎麼跟其他盒子相處：

- **block box（區塊盒子）**：會獨佔一整行、換行顯示；會遵守你設定的 `width` / `height`；padding、border、margin 都會把其他元素推開。若沒指定寬度，會撐滿容器可用寬度。`<h1>`、`<p>`、`<div>` 預設都是 block。
- **inline box（行內盒子）**：不會換行，會跟前後元素排在同一行；`width`、`height`、上下 margin **沒有作用**；左右的 padding／margin／border 會影響周圍內容。`<a>`、`<span>`、`<em>`、`<strong>` 預設都是 inline。

進階一點的說法是每個盒子都有 **outer display type（外層顯示型別）** 與 **inner display type（內層顯示型別）**：outer 決定盒子相對其他盒子怎麼排（block 或 inline），inner 決定盒子「內部的子元素」怎麼排（例如 `flex`、`grid`）。這一課先有印象即可，`flex` 與 `grid` 之後會專門講。

兩者之間還有一個折衷選項 `display: inline-block`。它像 inline 一樣不會獨佔整行、能跟其他元素排在同一行，卻又像 block 一樣完整遵守 `width`、`height`、上下 padding 與 margin。當你想讓幾個小方塊並排、又要能各自控制尺寸與間距時，`inline-block` 常是最直覺的選擇（雖然實務上更常用 flexbox 來做這件事）。

### 標準盒模型 vs 替代盒模型

這是這一課最容易踩雷、也最常被 knowledge check 問到的重點。關鍵問題是：**你設定的 `width` 到底是指哪一段的寬度？**

在 **standard box model（標準盒模型，也就是瀏覽器預設）** 中，`width` 與 `height` 只算 content box。padding 與 border 是額外加在外面的。所以元素在畫面上實際佔的寬度，要把 padding 與 border 一起加進去：

```css
.box {
  width: 350px;
  height: 150px;
  padding: 25px;
  border: 5px solid black;
  margin: 10px;
}
```

實際渲染寬度 = 350（content）+ 25 + 25（左右 padding）+ 5 + 5（左右 border）= **410px**。
實際渲染高度同理 = 150 + 25 + 25 + 5 + 5 = **210px**。
（margin 不算進盒子本身的尺寸，但會佔用盒子外面的頁面空間。）

這很反直覺：你明明寫 `width: 350px`，元素卻佔了 410px。一旦你要把多個盒子並排湊成固定總寬，這種「加 padding 就爆版」的行為會讓計算很痛苦。

於是有了 **alternative box model（替代盒模型）**，透過 `box-sizing: border-box` 開啟。開啟後，`width` 與 `height` 改為**包含 padding 與 border**，content 區域會自動縮小去容納它們：

```css
.box {
  box-sizing: border-box;
  width: 350px;
  height: 150px;
  padding: 25px;
  border: 5px solid black;
}
```

此時實際渲染寬度就是你寫的 **350px**，content 會自動縮成 350 − 25 − 25 − 5 − 5 = 290px。你設多少，盒子就是多少，所見即所得。這也是為什麼絕大多數開發者偏好 border-box。

注意：不論用哪種盒模型，**margin 永遠加在盒子的可見範圍之外**，不會被算進 `width`／`height`。box-sizing 只影響 padding 與 border 要不要算進去，跟 margin 無關。換句話說，切換盒模型改變的是「同一個 `width` 對應到的實際內容區大小」，而不是它與鄰居之間的距離。

### 一次替全站設定 border-box

與其在每個元素上重複寫 `box-sizing`，通常在專案最上面設定一次就好。最常見的寫法是搭配 universal selector：

```css
html {
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}
```

這段的意思是：先在 `html` 根元素設 `border-box`，再讓所有元素（含 `::before`／`::after` pseudo-element 偽元素）繼承（inherit）根元素的值。用 `inherit` 而不是直接寫死 `border-box`，好處是日後若某個第三方元件需要用標準盒模型，你只要覆寫它父層的值，底下就會一起跟著變，彈性較高。若不需要這種彈性，直接 `*, *::before, *::after { box-sizing: border-box; }` 也完全可行。

### margin 的兩個實用招式

**水平置中：`margin: 0 auto`**

把 `margin` 的左右值設成 `auto`，瀏覽器會把該側「剩下的可用空間」平均分配，於是元素就被推到中間。前提是元素要有明確寬度，且是 block 盒子：

```css
.container {
  width: 980px;
  margin: 0 auto; /* 上下 0，左右自動平分 → 水平置中 */
}
```

`auto` 只能做水平置中，垂直置中要靠別的方法（例如之後會學的 flexbox）。

**margin collapsing（外距合併）**

當兩個 block 元素上下相鄰、它們的垂直 margin 碰在一起時，這兩個 margin 不會相加，而是「合併」：

- 兩個都是正值 → 取**較大**的那個。例如上面 `margin-bottom: 50px`、下面 `margin-top: 30px`，中間的間距是 **50px**，不是 80px。
- 兩個都是負值 → 取**絕對值較大**（離 0 最遠）的那個。
- 一正一負 → 兩者**相加抵銷**。例如 50px 與 −10px → 實際間距 40px。

只有**垂直方向**的 margin 會合併，水平 margin 不會。多數情況這其實是貼心的行為，讓你不用一直去扣掉多出來的間距。

## 程式碼範例

以下是一個可以直接貼進 HTML 檔觀察的最小範例，示範同尺寸設定在兩種盒模型下的差異，以及 `margin: 0 auto` 置中：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <style>
    /* 全站先開啟 border-box（下面用 class 覆寫來對比） */
    *, *::before, *::after {
      box-sizing: border-box;
    }

    /* 共用外觀 */
    .box {
      width: 300px;
      padding: 20px;
      border: 5px solid #333;
      margin: 0 auto 16px; /* 左右 auto → 水平置中；下方留 16px */
      background: #d9edf7;
    }

    /* 用 content-box 還原成「標準盒模型」來對比 */
    .standard {
      box-sizing: content-box; /* width 只算 content → 實際佔 350px */
    }

    /* border-box：width 已含 padding 與 border → 實際就是 300px */
    .alternative {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div class="box standard">標準盒模型：實際寬度 = 300 + 20*2 + 5*2 = 350px</div>
  <div class="box alternative">替代盒模型：實際寬度就是 300px</div>
</body>
</html>
```

想「看見」盒子的四層結構時，最快的方法是打開瀏覽器 DevTools，選取元素後看 Styles 面板下方的盒模型示意圖，它會標出 content、padding、border、margin 各自的實際數值。

## 常見陷阱

!!! warning "設了 width 卻爆版：忘了 box-sizing"
    在標準盒模型下，`width` 不含 padding 與 border。你把三個 `width: 33.33%` 的欄位並排、又各加了 `padding`，總寬就會超過 100% 而擠到下一行。解法幾乎都是全站設 `box-sizing: border-box`，讓 `width` 把 padding 與 border 一起算進去。

!!! warning "上下間距忽大忽小：margin collapsing 在作怪"
    兩個相鄰區塊，一個 `margin-bottom: 40px`、一個 `margin-top: 30px`，中間卻只有 40px 而不是 70px，這不是 bug，是垂直 margin 合併的正常行為。若你需要「精準、不會被合併」的間距，可改用 padding，或在其中一側只設單邊 margin 來避免兩邊互相碰撞。

!!! warning "margin 和 padding 用途搞混"
    要在「兩個元素之間」拉開距離，用 `margin`（往外推）；要在「元素內容與它自己的邊框之間」留白，用 `padding`（往內撐）。想讓兩個元素**重疊**，只有 `margin` 能設負值，padding 不行。

## 練習

原課指定了一組閱讀與觀看素材，建議照下面順序完成：

1. 先看短片 [Learn CSS Box Model In 8 Minutes](https://www.youtube.com/watch?v=rIO5326FgPE)，快速建立 box model、padding、margin 的整體印象，它是後面所有內容的基礎。
2. 接著看 [box-sizing: border-box (EASY!)](https://www.youtube.com/watch?v=HdZHcFWcAd8)，補強對 `box-sizing` 的理解。
3. 讀 [MDN 的盒模型教學](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model)，它涵蓋上面影片的同一批內容，並會提到 inline 盒子與 inner/outer display type（這些下一課會深入，現在不必背熟）。**重點是動手玩它頁面上的即時編輯器**：改改 padding、border、切換 box-sizing，親眼看盒子怎麼變。
4. 讀 [CSS-Tricks 的 margin 說明](https://css-tricks.com/almanac/properties/m/margin/)，特別留意 `auto`（水平置中）與 margin collapsing 兩節。
5. 自我檢測：不看講義，試著由內而外背出盒模型四層順序、說出標準與替代盒模型的差異、寫出全站設定 border-box 的 CSS、並說明何時用 margin、何時用 padding。

## 原文與延伸資源

- 原文：[The Box Model](https://www.theodinproject.com/lessons/foundations-the-box-model)
- 本課引用：
  - [MDN — The box model](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model)（標準／替代盒模型、box-sizing、inline 盒子）
  - [CSS-Tricks — margin](https://css-tricks.com/almanac/properties/m/margin/)（margin shorthand、auto 置中、margin collapsing）
  - 影片：[Learn CSS Box Model In 8 Minutes](https://www.youtube.com/watch?v=rIO5326FgPE)（未抓取內文，僅列於延伸資源）
  - 影片：[box-sizing: border-box (EASY!)](https://www.youtube.com/watch?v=HdZHcFWcAd8)（未抓取內文，僅列於延伸資源）

---

> 本講義改寫自 The Odin Project《The Box Model》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
