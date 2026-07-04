---
title: 響應式圖片
source_url: https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-responsive-images
source_file: vendor/curriculum/advanced_html_css/responsive_design/responsive_images.md
path: full-stack-javascript
course: Advanced HTML and CSS
order: 14
generated: 2026-07-03
---

# 響應式圖片

> 改寫自 The Odin Project：[Responsive Images](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-responsive-images)
> ｜Full Stack JavaScript › Advanced HTML and CSS › Responsive Design

## 核心概念

圖片（image）在響應式網站上需要特別照顧。純文字會自己換行、自己重排，但圖片是有固定「內在尺寸」（intrinsic size）與固定「長寬比」（aspect ratio，寬高之間的比例）的東西，你一旦開始用 CSS 縮放它、或把它塞進不同大小的螢幕，各種毛病就會冒出來。這一課要處理兩類問題：一是**如何讓圖片在被縮放時仍然正常顯示**（不變形、不亂裁），二是**如何依螢幕大小送出不同的圖片檔**（省流量、換構圖）。

### 問題一：長寬比失真 — 別同時寫死 width 和 height

你最先會撞到的問題就是長寬比。假設一張圖原始是 800×600，你為了讓它在小螢幕上縮小，寫了 `width: 400px`，卻沒動 `height`，或反過來把 `height` 也寫死成某個對不上比例的值 — 圖片就會被拉扯（distort），人臉變胖、圓形變橢圓。

解法出乎意料地簡單，前面的課程其實提過：**不要同時定義 width 和 height。** 只要給圖片一個有彈性的寬度，再把高度設成 `auto`，圖片就會自動保持原本的長寬比。

```css
img {
  max-width: 100%; /* 最寬不超過容器，容器變窄時跟著縮 */
  height: auto; /* 高度自動換算，長寬比不會跑掉 */
}
```

這裡的關鍵是 `height: auto`：它讓瀏覽器根據實際寬度反推出「對得上原始比例」的高度。這是所有響應式圖片的基本盤，先把這條記牢。

### 當你不想讓圖片縮小：background-size、background-position、object-fit

上面那招是「讓圖片跟著容器一起縮」。但有時候你的需求相反：**容器尺寸固定或會變動，你希望圖片去填滿它、必要時裁切一部分，而不是整張等比例縮小。** 這時就輪到 `background-size`、`background-position` 和 `object-fit` 這三個屬性上場，它們讓你對「長寬比怎麼被處理」有更多彈性（雙關語：flexibility）。

先分清楚它們的適用對象，這是最常搞混的地方：

- **`background-size` 與 `background-position`** 只作用在「有背景圖」的元素上（也就是用 CSS `background-image` 設定的圖），對一般的 `<img>` 標籤**無效**。
- **`object-fit`** 則是專門給 `<img>`（以及 `<video>` 等取代元素）用的。

#### background-position 與 background-size（給背景圖用）

只要元素有背景圖，你就能透過這兩個屬性大幅掌控圖片怎麼擺、怎麼縮：

- `background-position: center` 讓背景圖永遠置中於容器 — 即使容器小到裝不下整張圖，被裁掉的也會是「上下左右對稱」的邊緣，而不是隨機切掉某一角。
- `background-size: cover` 讓圖片縮放到「剛好完整蓋滿整個容器」，過程中盡量少裁切。也就是說圖片會等比例放大或縮小，直到容器的每一寸都被填滿，超出容器的部分才被切掉。
- 另一個常見值是 `background-size: contain`，它相反：確保「整張圖都看得到」，於是圖片會縮到完整塞進容器為止，代價是容器可能出現留白（因為長寬比通常對不上）。

#### object-fit（給 img 標籤用）

`object-fit` 的運作邏輯很像 `background-size`，但它是設計給 `<img>` 的。它的特別之處在於：**你可以放心地同時替圖片指定 width 和 height（是的，就是前面叫你別做的那件事），然後用 `object-fit` 告訴瀏覽器「圖片該怎麼去適應這個被你框死的尺寸」，避免變形。**

`object-fit` 的預設值是 `fill`，意思是「硬撐」— 把圖片拉伸到剛好填滿你指定的寬高，長寬比不管了，於是會變形。這通常不是你要的。你更常用的是這兩個：

- `object-fit: cover`：等比例縮放並填滿整個框，超出的部分裁掉（跟 `background-size: cover` 同理）。想做「固定尺寸的縮圖／卡片圖」時最常用。
- `object-fit: contain`：等比例縮放到整張圖都塞進框內，可能留白（跟 `background-size: contain` 同理）。

搭配 `object-fit` 時，還可以用 `object-position` 決定裁切時保留哪一塊（預設是 `center`），概念與 `background-position` 相同。

**一句話總結兩者差異：`object-fit` 作用在 `<img>` 這個真正的圖片元素上，`background-size` 作用在元素的背景圖上。** 需要語意上「這是內容的一部分」的圖片，用 `<img>` ＋ `object-fit`；純裝飾性的背景，用 `background-image` ＋ `background-size`。

### 問題二：不同螢幕給不同圖片

前面都在講「同一張圖怎麼縮、怎麼擺」。但更進階的做法是：**在不同螢幕尺寸下，直接載入不同的圖片檔。** 這給你最大的掌控權。

為什麼要這麼做？兩個主要理由：

1. **省流量、加快載入（resolution switching，解析度切換）**：手機螢幕小，根本用不到一張 2000px 寬的大圖，硬塞給它只是浪費使用者的頻寬與電量。理想狀況是「大螢幕拿大圖，小螢幕拿小圖」。
2. **換構圖（art direction，藝術指導）**：與其信任 `object-fit` 幫你把主體留在框內，不如乾脆在小螢幕上換一張「已經裁好、聚焦在主體」的版本。例如寬螢幕放一張人物站在寬闊背景中的全景照，手機上換成只有人物臉部的特寫照 — 構圖完全不同，這是 `object-fit` 做不到的。

達成這件事有兩條路：`<img>` 的 `srcset` 屬性，以及 `<picture>` 標籤。

#### srcset ＋ 寬度描述子（w）與 sizes

這是解決「解析度切換」最主流的做法。你在 `<img>` 上列出多個候選圖檔，並標註每張圖的「內在寬度」，再用 `sizes` 告訴瀏覽器「這張圖在版面上大概會佔多寬」，剩下的交給瀏覽器自己挑最合適的。

```html
<img
  srcset="fairy-480w.jpg 480w, fairy-800w.jpg 800w"
  sizes="(width <= 600px) 480px, 800px"
  src="fairy-800w.jpg"
  alt="打扮成仙子的小女孩" />
```

拆解一下：

- **`srcset`**：候選圖清單，格式是「檔名 寬度w」。注意單位是 `w`（代表圖片本身的實際像素寬度），不是 `px`。上面告訴瀏覽器：`fairy-480w.jpg` 本身是 480 像素寬，`fairy-800w.jpg` 是 800 像素寬。
- **`sizes`**：由「媒體條件 對應版位寬度」組成，逗號分隔。上例的意思是：「當可視區域寬度 ≤ 600px 時，這張圖大約會佔 480px 寬；其他情況下佔 800px 寬（最後一個值沒有條件，是預設值）。」
- **`src`**：後備方案，給不支援 `srcset` 的老瀏覽器用。

瀏覽器拿到這些資訊後，會綜合考量螢幕尺寸、裝置像素比（device pixel ratio）、縮放等因素，先從 `sizes` 找出目前成立的版位寬度，再去 `srcset` 挑一張「夠用又不浪費」的圖來載入。你只是提供選項與線索，最終決定權在瀏覽器。

#### srcset ＋ 像素密度描述子（x）

如果你的圖片在所有裝置上都顯示成「同樣的 CSS 尺寸」，只是想在高解析度（Retina）螢幕上給更清晰的版本，那用 `x` 描述子更簡單，而且**不需要 `sizes`**：

```html
<img
  srcset="fairy-320w.jpg, fairy-480w.jpg 1.5x, fairy-640w.jpg 2x"
  src="fairy-640w.jpg"
  alt="打扮成仙子的小女孩" />
```

`1x` 是預設不用寫。這代表：一般密度螢幕拿 320px 的版本，1.5 倍密度拿 480px，2 倍密度（如多數手機、Retina 螢幕）拿 640px。同樣是一張圖看起來一樣大，但高密度螢幕吃到更多像素、更銳利。

#### picture 標籤：換構圖（art direction）

當你要的不是「同張圖不同解析度」，而是「不同螢幕給完全不同構圖」時，就得用 `<picture>`。它裡面放多個 `<source>`，每個 `<source>` 綁一個 `media`（媒體條件），瀏覽器挑第一個成立的來用；最後一定要放一個 `<img>` 當後備。

```html
<picture>
  <!-- 視窗窄於 800px：換成已裁好的直式人物特寫 -->
  <source media="(width < 800px)" srcset="elva-close-portrait.jpg" />
  <!-- 800px 以上：用寬版全景照 -->
  <source media="(width >= 800px)" srcset="elva-800w.jpg" />
  <!-- 後備：不支援 picture 或條件都不成立時顯示 -->
  <img src="elva-800w.jpg" alt="Chris 抱著女兒 Elva 站著" />
</picture>
```

重點：那個 `<img>` **絕對不能省**。`<source>` 只是「候選來源」，真正被渲染、真正吃 `alt` 屬性的還是最後那個 `<img>`；少了它，整個 `<picture>` 什麼都不會顯示。

#### picture 標籤：切換圖片格式（type）

`<picture>` 還有一個很實用的用途：讓瀏覽器優先用它支援的「現代格式」，不支援才退回舊格式。這靠 `<source>` 的 `type` 屬性：

```html
<picture>
  <source type="image/avif" srcset="image.avif" />
  <source type="image/webp" srcset="image.webp" />
  <!-- 都不支援時退回 jpg -->
  <img src="image.jpg" alt="圖片說明" />
</picture>
```

AVIF、WebP 這類新格式檔案更小、畫質更好，但不是每個瀏覽器都支援。上面的寫法讓支援 AVIF 的瀏覽器拿 AVIF，其次 WebP，最後才是人人都懂的 JPG，兼顧效能與相容性。

### srcset 還是 picture？怎麼選

- 只是想「依螢幕／密度切換同一張圖的不同解析度」，讓瀏覽器自動挑 → 用 **`<img>` ＋ `srcset`／`sizes`**，寫法簡潔，把決定權交給瀏覽器。
- 想「在特定斷點強制換成不同構圖的圖」，或「依格式支援度切換檔案」，需要你自己精準指定 → 用 **`<picture>` ＋ `<source>`**。

一個實用的判斷法：如果每個尺寸下你要的「基本上是同一張圖，只是大小不同」，交給 `srcset` 就好；如果不同尺寸你要的是「不同的畫面」，那才需要 `picture` 這種明確的手動控制。

## 程式碼範例

以下是一份可直接放進 HTML 觀察的最小示例，涵蓋本課三種核心手法。

保持長寬比並限制最大寬度（響應式圖片的基本盤）：

```css
/* 讓所有圖片跟著容器縮，且永遠保持原始長寬比 */
img {
  max-width: 100%; /* 不會超出容器寬度 */
  height: auto; /* 高度自動換算，避免變形 */
}
```

固定尺寸的卡片縮圖，用 object-fit 避免變形：

```html
<img class="thumb" src="photo.jpg" alt="風景照縮圖" />
```

```css
/* 明確框死寬高，再靠 object-fit 決定圖片怎麼適應 */
.thumb {
  width: 300px;
  height: 200px;
  object-fit: cover; /* 等比例填滿、裁掉多餘部分，不拉伸 */
  object-position: center; /* 裁切時保留中央（預設值） */
}
```

背景圖填滿容器並置中（注意：這招只對背景圖有效）：

```css
.hero {
  height: 400px;
  background-image: url("hero.jpg");
  background-size: cover; /* 縮放到蓋滿容器，盡量少裁切 */
  background-position: center; /* 永遠置中，裁切邊緣對稱 */
}
```

依螢幕大小自動切換解析度（srcset ＋ sizes）：

```html
<img
  srcset="banner-480w.jpg 480w, banner-800w.jpg 800w, banner-1200w.jpg 1200w"
  sizes="(width <= 600px) 480px, (width <= 1000px) 800px, 1200px"
  src="banner-800w.jpg"
  alt="活動主視覺橫幅" />
```

小螢幕換構圖、大螢幕用全景（picture ＋ art direction）：

```html
<picture>
  <source media="(width < 800px)" srcset="portrait-crop.jpg" />
  <img src="landscape-wide.jpg" alt="海邊日出，一名衝浪者走向海面" />
</picture>
```

## 常見陷阱

!!! warning "同時寫死 width 和 height 導致變形"
    只給其中一個尺寸、另一個交給 `height: auto`（或 `width: auto`），圖片才會保持長寬比。若因版面需求非得同時指定寬高，改用 `<img>` ＋ `object-fit: cover`／`contain`，讓瀏覽器等比例適應而不是硬拉伸。

!!! warning "把 background-size 套在 img 標籤上"
    `background-size` 和 `background-position` 只作用於「背景圖」（CSS `background-image`），對一般 `<img>` 完全無效。要控制 `<img>` 的填滿與裁切，請用 `object-fit` 與 `object-position`。

!!! warning "picture 裡忘了放後備的 img"
    `<source>` 只是候選來源，真正被渲染、真正承載 `alt` 的是最後那個 `<img>`。少了它，整個 `<picture>` 不會顯示任何圖片，可及性（accessibility）也一併掛掉。

!!! warning "srcset 的寬度單位寫成 px"
    寬度描述子的單位是 `w`（例如 `banner-800w.jpg 800w`），代表圖片本身的實際像素寬度，不是 `800px`。寫成 `px` 會失效。`sizes` 裡的版位寬度才用 `px` 這類 CSS 長度。

!!! warning "誤用 object-fit 的預設值 fill"
    `object-fit` 不寫的話預設是 `fill`，會把圖片硬拉伸到填滿指定寬高、造成變形。想保持比例，記得明確指定 `cover` 或 `contain`。

## 練習

1. 先讀過三個 CSS 屬性的 MDN 文件，頁面上的互動 demo 會讓用法一目了然：
    - [background-size](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size)
    - [background-position](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position)
    - [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
2. 閱讀 MDN 的 [Responsive Images](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)，這是在 HTML 裡送出響應式圖片的入門，會完整解釋 `srcset`、`sizes` 與 `<picture>`。
3. 閱讀 CSS-Tricks 的 [A Guide to the Responsive Images Syntax in HTML](https://css-tricks.com/a-guide-to-the-responsive-images-syntax-in-html/)，這篇更深入地示範響應式圖片語法的實際實作。
4. 讀完後試著自我檢核：
    - `object-fit` 和 `background-size` 最主要的差別是什麼？（提示：作用對象一個是 `<img>`，一個是背景圖）
    - 要在 `<img>` 上同時指定 width 和 height 又不讓它變形，你會怎麼做？
    - 為什麼會想在不同螢幕解析度下提供不同的圖片？
    - 什麼情況該用 `srcset`、什麼情況該用 `<picture>`？

## 原文與延伸資源

- 原文：[Responsive Images](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-responsive-images)
- 本課引用：
    - [MDN：background-size](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size)
    - [MDN：background-position](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position)
    - [MDN：object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
    - [MDN：Responsive Images（在 HTML 中送出響應式圖片）](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)
    - [CSS-Tricks：A Guide to the Responsive Images Syntax in HTML](https://css-tricks.com/a-guide-to-the-responsive-images-syntax-in-html/)

---

> 本講義改寫自 The Odin Project《Responsive Images》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
