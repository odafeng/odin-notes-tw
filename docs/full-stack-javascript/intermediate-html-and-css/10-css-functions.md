---
title: CSS 函式
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-css-functions
source_file: vendor/curriculum/intermediate_html_css/intermediate_css_concepts/css_functions.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 10
generated: 2026-07-03
---

# CSS 函式

> 改寫自 The Odin Project：[CSS Functions](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-css-functions)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Intermediate CSS Concepts

## 核心概念

### 什麼是 CSS 函式

你在寫 CSS 時，一定看過某些屬性值的語法長得跟一般值不太一樣：一個單字後面接著一對括號 `()`，括號裡放著一些資訊。像是 `background-color: rgb(0, 0, 0)`，這個 `rgb(0, 0, 0)` 就是一個 CSS function（CSS 函式）。

跟程式語言裡的函式概念相同，CSS 函式是一段「可以重複使用、負責完成特定任務」的預先寫好的邏輯。你把資料放進括號裡傳給它，這些資料叫做 argument（引數）；函式收到引數後，按照它自己既定的規則處理，最後回傳一個 CSS 可以理解的值。看兩個例子：

```css
color: rgb(0, 42, 255);
background: linear-gradient(90deg, blue, red);
```

第一行，`color` 的值是 `rgb()` 函式，它接受三個數字當引數，把這三個數字換算成對應的顏色。第二行，`background` 的值是 `linear-gradient(90deg, blue, red)`，這個函式會用你給的參數「生成」一張漸層圖片。它至少需要兩個顏色引數（要在哪些顏色之間做過渡），你還可以額外指定漸層線的方向角度（例子裡的 `90deg`）、加入更多顏色等等。

這裡有一個很重要、跟一般程式語言不同的地方：**CSS 不允許你自己定義函式**。你在 TOP 後面會學到的 JavaScript、Ruby 都能自己寫函式，但 CSS 不行。CSS 只提供一份「內建函式清單」，用來解決最常見的樣式問題。你能做的是「使用」它們，不是「創造」它們。

### CSS 函式的種類很多

只要看得懂「函式名 + 括號 + 引數」這個模式，你就會發現 CSS 裡到處都是函式。它們大致可以分成幾類：

- **顏色函式**：`rgb()`、`hsl()`、`hwb()`、`oklch()`、`color-mix()` 等，用來定義顏色。
- **漸層／圖片函式**：`linear-gradient()`、`radial-gradient()`、`conic-gradient()`、`url()` 等。
- **transform 函式**：`translate()`、`rotate()`、`scale()`、`skew()` 等，配合 `transform` 屬性使用。
- **filter 函式**：`blur()`、`brightness()`、`drop-shadow()` 等，配合 `filter` 屬性使用。
- **參照函式**：`var()`（讀取 CSS 變數）、`attr()`、`env()` 等。
- **grid 函式**：`minmax()`、`repeat()`、`fit-content()`。
- **數學函式**：`calc()`、`min()`、`max()`、`clamp()`，還有 `round()`、`sin()`、`sqrt()` 等進階數學運算。

這一課我們把重點放在跟版面配置（layout）與尺寸控制最相關、也最實用的四個**數學函式**：`calc()`、`min()`、`max()` 與 `clamp()`。它們在做 responsive design（響應式設計）時特別重要，因為它們能讓尺寸「隨情況自動變化」，而不必寫死一個固定數字或塞一堆 media query。

### calc()

`calc()` 讓你在 CSS 值裡直接做四則運算（`+`、`-`、`*`、`/`）。它最強大的兩個用途是：

1. **混用不同單位**：一般情況下你不能直接把 `100vh` 減掉 `3rem` 再減掉 `40px`，因為它們單位不同。但 `calc()` 可以在計算當下自動處理這些混合單位。
2. **可以巢狀（nest）**：你能寫 `calc( calc() - calc() )`，把運算拆成好幾層。

看一個典型例子（這裡也用到了 CSS 變數，下一課會學到）：

```css
:root {
  --header: 3rem;
  --footer: 40px;
  --main: calc(100vh - calc(var(--header) + var(--footer)));
}
```

這段的意思是：`--main` 等於 `100vh - (3rem + 40px)`，換句話說 `main = 100vh - (header + footer)`。就算 `vh`、`rem`、`px` 三種單位混在一起，`calc()` 也能幫你算出正確結果。搭配 CSS 變數，`calc()` 能省掉重複撰寫規則的麻煩——改一個變數，所有用到它的計算都會跟著更新。

一個容易忽略但重要的細節：`calc()` 裡的 `+` 和 `-` **兩側一定要有空格**，例如 `calc(100% - 40px)` 是對的，寫成 `calc(100%-40px)` 會失效。`*` 和 `/` 則沒有這個限制。

> 補充：上面的例子只是展示 `calc()` 如何影響版面，實務上要做「main 撐滿剩餘高度」通常有更好的做法（例如之後會學的 Flexbox / Grid）。`calc()` 在這裡是概念示範，不代表它是這個需求的最佳解。

### min()

`min()` 對做響應式網站非常有幫助。它的行為跟 JavaScript 的 `Math.min()`、Ruby 的 `Array#min` 一樣：**接受一串用逗號隔開的值，回傳其中最小的那個**。

```css
#iconHolder {
  width: min(150px, 100%);
  height: min(150px, 100%);
  box-sizing: border-box;
  border: 6px solid blue;
}
```

`min(150px, 100%)` 會比較「父元素寬度的 `100%`」跟 `150px` 哪個小，然後採用比較小的那個。所以：如果 `100%` 比 `150px` 還窄（例如容器很小），元素就取 `100%`，撐滿容器；否則就固定 `150px`。

這裡有個常讓人繞不過來的重點：**`min()` 名字叫「最小」，實際效果卻是設下一個「上限（maximum constraint）」。** 因為它永遠不會回傳比清單裡最小值更大的東西，等於幫元素設了天花板——「最多 150px，容器再小就跟著縮」。

你也可以在 `min()` 裡做基本運算，例如 `width: min(80ch, 100vw - 2rem);`，這種情況甚至不需要另外包一層 `calc()`。

### max()

`max()` 跟 `min()` 完全相反，對應 JavaScript 的 `Math.max()`、Ruby 的 `Array#max`：**回傳清單裡最大的那個值**。

```css
width: max(100px, 4em, 50%);
```

上面會比較這三個值，取最大的當作寬度。如果父容器的 `50%` 比 `100px` 和 `4em` 都大，寬度就是 `50%`；如果 `4em` 最大，就用 `4em`。

同樣地，**`max()` 名字叫「最大」，效果卻是設下一個「下限（minimum constraint）」**——保證元素不會小於某個尺寸。`max()` 在視窗特別小、或使用者用瀏覽器縮放（zoom）把內容放大時最有用。剛開始你可能覺得用不太到，但在重視 accessibility（無障礙）的專案裡，它是個值得知道的工具，可以避免元素在使用者放大內容時被壓到太小而難以閱讀或操作。

### clamp()

`clamp()` 是讓元素「流動（fluid）又受控」的好工具，也是這四個函式裡最實用的。它一次接受**三個值**：

```css
h1 {
  font-size: clamp(1.5rem, 5vw, 3rem);
}
```

三個引數依序是：

1. **最小值**：`1.5rem`
2. **偏好／縮放值**：`5vw`
3. **最大值**：`3rem`

`clamp()` 的邏輯是：優先使用中間的縮放值 `5vw`（`vw` 會隨視窗寬度變化，所以字會跟著視窗放大縮小），但把結果「夾（clamp）」在最小值與最大值之間。也就是說，字體再怎麼縮都不會小於 `1.5rem`，再怎麼放大也不會超過 `3rem`。這正是 **fluid typography（流動字級）** 的經典寫法——不用寫任何 media query，字體就能在一個合理區間內隨螢幕平滑變化。

一個實用的排版例子是控制段落寬度。理想的閱讀行寬大約落在 45 到 75 個字元之間，用 `clamp()` 可以這樣寫：

```css
p {
  width: clamp(45ch, 50%, 75ch);
}
```

其中 `ch` 是「0 這個字元的寬度」，很適合拿來衡量文字行長。這行的意思是：段落寬度最少 45 字元、最多 75 字元，中間隨父容器的 50% 浮動。

### 一個關鍵的心智模型

把這四個函式放在一起看，你會發現它們共同解決一件事：**讓尺寸不再是死的數字，而是能對「當前情境」做出反應**。過去要達到「小螢幕縮、大螢幕放、但都不超過某個範圍」的效果，往往得寫好幾組 media query；現在用一行 `min()`／`max()`／`clamp()` 就能在瀏覽器裡即時算出來。這就是它們對響應式設計如此重要的原因。

## 程式碼範例

下面是一個可以直接貼進 `.html` 檔、用瀏覽器打開就能看到效果的完整範例，把四個函式都示範一遍。試著拉動瀏覽器視窗寬度，觀察各個區塊如何變化。

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <title>CSS 函式示範</title>
  <style>
    /* 標題：字級在 1.5rem 與 3rem 之間隨視窗寬度流動 */
    h1 {
      font-size: clamp(1.5rem, 5vw, 3rem);
    }

    /* 卡片：寬度最多 400px，容器太窄時改用 100% 撐滿（上限） */
    .card {
      width: min(400px, 100%);
      box-sizing: border-box;
      padding: max(1rem, 3vw); /* 內距至少 1rem，大螢幕再放大（下限） */
      border: 2px solid steelblue;
      margin-bottom: 1rem;
    }

    /* 段落：閱讀行寬夾在 45ch 到 75ch 之間 */
    .card p {
      width: clamp(45ch, 100%, 75ch);
    }

    /* 用 calc() 混用單位：高度為視窗高度扣掉固定表頭 */
    .banner {
      height: calc(100vh - 80px);
      background: linear-gradient(90deg, steelblue, tomato);
      color: white;
    }
  </style>
</head>
<body>
  <div class="banner">
    <h1>調整視窗寬度看看我如何變化</h1>
  </div>
  <div class="card">
    <p>這個段落的寬度被 clamp() 限制在合理的閱讀範圍內，
       不會因為螢幕很寬就長到一整行難以閱讀。</p>
  </div>
</body>
</html>
```

## 常見陷阱

!!! warning "calc() 的加減號兩側必須留空格"
    `calc()` 裡的 `+` 與 `-` 兩側**一定要有空白字元**，否則整條規則會被忽略。`calc(100% - 40px)` 正確；`calc(100%-40px)` 失效。`*` 和 `/` 則沒有這個要求，但養成一律加空格的習慣最安全。

!!! warning "別把 min() / max() 的語意想反了"
    `min()` 回傳最小值，效果是設「上限」（不會超過某尺寸）；`max()` 回傳最大值，效果是設「下限」（不會小於某尺寸）。名字和實際約束方向剛好相反，寫的時候先想清楚「我要的是天花板還是地板」。

!!! warning "用 clamp() / max() 限制字級可能傷害無障礙"
    用 `max()` 或 `clamp()` 去限制文字的「最大」尺寸，可能讓使用者無法把字放大到 200%，這會違反 WCAG 1.4.4 的可縮放要求。所以字級盡量用 `rem` 這類會跟隨使用者設定的相對單位，並實際測試瀏覽器縮放功能是否仍正常運作。

## 練習

1. 打開 MDN 的[完整 CSS 函式清單](https://developer.mozilla.org/zh-TW/docs/Web/CSS/CSS_Functions)，快速瀏覽一遍，對「CSS 到底有哪些函式、大概能做什麼」建立整體印象。不需要背，只要知道有這些工具存在即可。
2. 到 web.dev 的[《min(), max(), clamp() 實戰》](https://web.dev/articles/min-max-clamp)，更深入看這三個函式的實際運用範例，特別留意它如何用在流動排版與行寬控制上。
3. 動手把上面「程式碼範例」貼進一個 `.html` 檔，用瀏覽器打開，拉動視窗寬度觀察變化。接著自己改改看：把 `clamp()` 的三個值換掉、把 `min()` 的 `400px` 改成別的數字、在 `calc()` 裡混用不同單位，看看結果如何。實際玩過一輪，這四個函式的手感會清楚很多。

## 原文與延伸資源

- 原文：[CSS Functions](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-css-functions)
- 本課引用：
  - MDN，[CSS 函式總覽（CSS Functions）](https://developer.mozilla.org/zh-TW/docs/Web/CSS/CSS_Functions)
  - web.dev，[CSS min(), max(), and clamp()](https://web.dev/articles/min-max-clamp)
  - MDN，[`calc()`](https://developer.mozilla.org/zh-TW/docs/Web/CSS/calc)、[`min()`](https://developer.mozilla.org/zh-TW/docs/Web/CSS/min)、[`max()`](https://developer.mozilla.org/zh-TW/docs/Web/CSS/max)、[`clamp()`](https://developer.mozilla.org/zh-TW/docs/Web/CSS/clamp)

---

> 本講義改寫自 The Odin Project《CSS Functions》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
