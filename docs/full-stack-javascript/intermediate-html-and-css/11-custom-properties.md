---
title: 自訂屬性（CSS 變數）
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-custom-properties
source_file: vendor/curriculum/intermediate_html_css/intermediate_css_concepts/custom_properties.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 11
status: draft
generated: 2026-07-03
---

# 自訂屬性（CSS 變數）

> 改寫自 The Odin Project：[Custom Properties](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-custom-properties)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Intermediate CSS Concepts

## 核心概念

### 為什麼需要自訂屬性

自訂屬性（Custom Properties，也常被稱為 CSS variables，CSS 變數）讓我們可以把一個 CSS 值先「存起來」，然後在同一份樣式表裡想引用幾次就引用幾次。

想像一個情境：你的網站主色是某一種紅色，這個紅色出現在按鈕、連結、邊框、標題底線等七、八個 selector 裡。有一天設計師說「這個紅色太淺了，全部換深一點」。如果沒有變數，你得一個一個找出這七、八處手動改；只要漏改一處，畫面就會出現不一致的顏色。

自訂屬性把這件事變成「只改一個地方」：你把紅色存進一個變數，所有需要用到的地方都引用這個變數。要換色時，只更新變數的定義，所有引用它的地方會一起跟著變。除了省事，它還能幫你在整個專案裡維持顏色一致，專案越大，這個好處越明顯。

更進一步，自訂屬性可以在不同的情境（context）下被重新定義。這一點是實作深色/淺色主題（theme）的關鍵——同一個變數名稱，在深色情境下是一組值，在淺色情境下是另一組值，而使用變數的樣式規則完全不用改。

### 宣告與使用

宣告與存取一個自訂屬性的語法，跟平常寫規則宣告（rule declaration）沒有差太多：

```css
.error-modal {
  --color-error-text: red;
  --modal-border: 1px solid black;
  --modal-font-size: calc(2rem + 5vw);

  color: var(--color-error-text);
  border: var(--modal-border);
  font-size: var(--modal-font-size);
}
```

拆解一下這裡發生的事：

**宣告變數**：以兩個連字號（double hyphen，`--`）開頭，後面接一個自訂的名稱。名稱大小寫敏感（case-sensitive），`--color-error-text` 和 `--Color-Error-Text` 是兩個不同的變數。命名習慣上使用 kebab-case（用單一連字號分隔單字）非常重要，因為名稱中不允許空格——`--color error text` 是無效的。

**變數可以存什麼**：任何合法的 CSS 值都行。可以是顏色（`red`）、簡寫值（shorthand，例如 `1px solid black`），甚至是更複雜的函式（例如 `calc(2rem + 5vw)`）。

**存取變數**：要用到變數時，把 `var()` 函式當成某個 CSS property 的值，並把變數名稱（含開頭的 `--`）放進括號裡。例如 `color: var(--color-error-text);`。

一個容易忽略但很重要的觀念：`var()` 只能用在「property 的值」的位置。它不能拿來當 property 的名稱、不能當 selector、也不能放進 media query 的條件裡。這一點稍後在「常見陷阱」會再詳談。

### fallback 值（備援值）

`var()` 其實接受兩個參數。第一個就是前面說的、你要取用的自訂屬性；第二個是選填的 fallback 值（備援值）。當你提供了 fallback，只要那個自訂屬性無效（invalid）或還沒被宣告，就會改用 fallback。

你甚至可以把「另一個自訂屬性」當成 fallback，而那個屬性又能有自己的 fallback，一層一層往下接：

```css
.fallback {
  --color-text: white;

  background-color: var(--undeclared-property, black);
  color: var(--undeclared-again, var(--color-text, yellow));
}
```

上面的範例中：

- `background-color`：因為 `--undeclared-property` 從沒被宣告，所以採用 fallback `black`。
- `color`：`--undeclared-again` 也沒被宣告，於是進到第二個參數 `var(--color-text, yellow)`；`--color-text` 有被宣告且值為 `white`，所以最終是 `white`。如果 `--color-text` 剛好無效或不存在，才會再退到最內層的 `yellow`。

要注意 `var()` 就是「變數名 + 一個 fallback」的結構。像 `var(--a, --b, pink)` 這種寫法，並不會依序嘗試 `--a`、`--b`、`pink`：因為 fallback 值本身允許包含逗號，所以第一個逗號之後的 `--b, pink` 會整段被當成「單一個 fallback 值」（`--b` 不會被解析成第二個變數）。要做多層 fallback，必須用巢狀的 `var()`，像上面那樣把 `var(--color-text, yellow)` 整個塞進第二個參數。

還有一個常被誤會的點：fallback **不是**用來處理「舊瀏覽器不支援 CSS 變數」的相容性機制。它處理的是「這個變數在目前情境下沒被定義，或值無效」的情況。

### 作用域（scope）

在最前面的第一個範例裡，你或許注意到：我們在同一個宣告區塊（declaration block）裡，既宣告又存取了自訂屬性。這是因為自訂屬性的作用域（scope）由 selector 決定。這個作用域包含「宣告該變數的那個 selector 本身」，以及「該 selector 的所有後代（descendant）元素」。如果你熟悉 JavaScript 的 scope，這種行為會讓你有點眼熟。

看下面的例子，只有帶 `cool-paragraph` class 的元素會拿到紅色背景，因為它是宣告變數那個元素的後代：

```html
<div class="cool-div">
  <p class="cool-paragraph">看看我很酷的紅色背景！</p>
</div>

<p class="boring-paragraph">我不在作用域裡，所以我不酷。</p>
```

```css
.cool-div {
  --main-bg: red;
}

.cool-paragraph {
  background-color: var(--main-bg);
}

.boring-paragraph {
  background-color: var(--main-bg);
}
```

`--main-bg` 宣告在 `.cool-div` 上。`.cool-paragraph` 是 `.cool-div` 的後代，所以取得到這個變數，背景變紅。`.boring-paragraph` 在 `.cool-div` 之外，不在作用域裡，`var(--main-bg)` 取不到值——這個宣告會失效，背景維持預設。

這裡其實牽涉一個更底層的機制：自訂屬性會**繼承（inherit）**。變數的值會沿著 DOM 樹往下傳給後代，後代不用重新宣告就能用到祖先定義的變數；這正是「作用域包含所有後代」的成因。而 sibling（兄弟元素）或它的後代取不到，因為它們不在那條繼承鏈上。

### `:root` selector

有時候你會刻意限制變數的作用域，但更多時候，你會希望某些變數能在許多彼此不相關的 selector 上都用得到。一個笨方法是把同一個變數重複宣告在一堆 selector 上，但這等於放棄了「一處修改、多處生效」這個最主要的好處。

比較好的做法是把這些變數宣告在 `:root` selector 上。`:root` 基本上等同於 `html` selector，差別在於它的優先級（specificity）更高。

```html
<p class="cool-paragraph">Lorem ipsum dolor sit amet.</p>

<p class="exciting-paragraph">Lorem ipsum dolor sit amet.</p>
```

```css
:root {
  --main-color: red;
}

.cool-paragraph {
  color: var(--main-color);
}

.exciting-paragraph {
  background-color: var(--main-color);
}
```

因為變數宣告在 `:root` 上，而頁面上任何 selector 都算是 `:root` 的後代，所以你可以在整份 CSS 的任何合法 selector 裡存取到它。這就是我們定義「全域變數」的標準位置。

### 用自訂屬性做主題（theme）

`:root` 除了讓變數更全域可用，還給了我們一種做主題切換的方法。核心技巧是：對 `:root` 建立多個「情境版本」的變數，端看根元素目前掛的是哪個 class。

```css
:root.dark {
  --bg: #1a1a1a;
  --text: #f0f0f0;
}

:root.light {
  --bg: #ffffff;
  --text: #222222;
}

body {
  background-color: var(--bg);
  color: var(--text);
}
```

這裡我們為 `:root` 建立了兩組作用域：當 `html`（也就是根元素）帶有 `dark` class 時是一組值，帶有 `light` class 時是另一組值。其他 selector（例如 `body`）就照目前根元素掛的是哪個 class，取用對應的變數值。要切換主題，只要用 JavaScript 在根元素上切換 `dark` / `light` class 即可，`body` 那段樣式完全不用動。

> 補充：TOP 原文用 CodePen 展示這個範例，且因為在 CodePen 的 HTML 分頁沒有直接改根元素的權限，它是透過設定選單預先幫 `html` 加上 `dark` class。概念與上面這段等價。

### 用 `prefers-color-scheme` media query 跟隨系統偏好

讓使用者自己按鈕切換主題很好，但還有另一種設定主題的方式：直接讀取使用者在作業系統（OS）或使用者代理（user agent，例如瀏覽器）裡設定的主題偏好。這用 `prefers-color-scheme` media query 就能做到——它會依照使用者裝置或設定（例如螢幕尺寸、或淺色/深色偏好）套用不同樣式。

```css
:root {
  /* 預設用淺色主題，作為沒有偏好或瀏覽器不支援時的後備 */
  --bg: #ffffff;
  --text: #222222;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --text: #f0f0f0;
  }
}

body {
  background-color: var(--bg);
  color: var(--text);
}
```

做法是：先在 media query「之外」的 `:root` 上放一組預設變數。這組預設值會在「使用者沒有在 OS/瀏覽器設定偏好」或「瀏覽器不支援這個 media query」時派上用場——這個例子用淺色當預設。接著再用 `prefers-color-scheme: dark` 的 media query，覆蓋成一組深色的變數值，供偏好深色的使用者使用。

`prefers-color-scheme` 對使用者很貼心，因為不需要他們手動切換就能得到偏好的主題。但使用它時要留意三件事：

1. media query 只接受 `dark` 和 `light` 兩個值，所以你沒辦法用它實作這兩種之外的其他主題。
2. `light` 這個值，實際上涵蓋了「使用者指定淺色」**以及**「使用者根本沒設定偏好」兩種情況。
3. 它不讓使用者自己切換主題。有些使用者可能因為某些理由，想用跟 OS/瀏覽器偏好相反的主題，這種需求它就滿足不了。

因此實務上，成熟的做法往往是「`prefers-color-scheme` 提供合理預設」＋「額外提供一個手動切換按鈕（用前面的 class 切換法）覆蓋掉預設」，兩者結合。

## 程式碼範例

下面是一個可以直接存成 `.html` 檔用瀏覽器打開的最小範例，把「`:root` 全域變數 + 主題切換 + fallback」三件事一次示範：

```html
<!DOCTYPE html>
<html lang="zh-Hant" class="light">
  <head>
    <meta charset="UTF-8" />
    <style>
      /* 在 :root 上定義全域變數，任何 selector 都取得到 */
      :root.light {
        --bg: #ffffff;
        --text: #222222;
        --accent: #d33;
      }
      :root.dark {
        --bg: #1a1a1a;
        --text: #f0f0f0;
        --accent: #ff6b6b;
      }

      body {
        background-color: var(--bg);
        color: var(--text);
        font-family: sans-serif;
        padding: 2rem;
      }

      button {
        /* --accent 有定義，用它；若哪天沒定義就退回 gray */
        border: 2px solid var(--accent, gray);
        color: var(--accent, gray);
        background: transparent;
        padding: 0.5rem 1rem;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <h1>自訂屬性主題示範</h1>
    <button id="toggle">切換深色 / 淺色</button>

    <script>
      // 切換根元素上的 class，body 與 button 的樣式會一起跟著變
      const html = document.documentElement;
      document.getElementById("toggle").addEventListener("click", () => {
        html.classList.toggle("dark");
        html.classList.toggle("light");
      });
    </script>
  </body>
</html>
```

重點觀察：切換按鈕只做一件事——在 `<html>` 上互換 `dark` / `light` class。所有顏色都是透過 `var()` 讀變數，所以樣式規則本身一行都不用改，整個頁面的配色就換了。

## 常見陷阱

!!! warning "`var()` 只能用在 property 的值，不能用在其他位置"
    自訂屬性是「值層級」的東西，不是像 Sass 那種前處理器變數。以下這些寫法全都無效：media query 條件 `@media (max-width: var(--bp))`、container query 條件、拿變數當 property 名稱、拿變數當 selector（例如 `.var(--cls)`）。`var()` 只有放在「某個 CSS property 的值」的位置才有效，例如 `color: var(--main-color);`。

!!! warning "作用域只往下，不往旁邊"
    變數只在「宣告它的 selector 及其後代」內有效。宣告在 `.cool-div` 上的變數，`.cool-div` 的兄弟元素（sibling）或兄弟的後代都取不到。想讓變數全域可用，請宣告在 `:root` 上。

!!! warning "取不到變數時，整條宣告會失效"
    當 `var()` 取不到值、又沒給 fallback 時，那一整條 CSS 宣告會變成無效（invalid），該 property 會回退到它原本的繼承值或初始值，而不是「當作沒寫」保留你以為的樣子。想避免意外，對可能缺席的變數記得補上 fallback：`var(--maybe-missing, someDefault)`。

!!! warning "名稱大小寫敏感、不能有空格"
    `--main-color` 和 `--Main-Color` 是兩個不同的變數，拼錯大小寫會靜默失效。名稱中也不能有空格，請一律用 kebab-case。

## 練習

以下把原文 Assignment 改寫成可操作的繁中步驟：

1. 觀看這支 CSS 自訂屬性的入門影片（[YouTube](https://www.youtube.com/watch?v=PHO6TBq_auI)），建立整體印象。
2. 閱讀 MDN 的 [Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties)，特別從「Inheritance of custom properties（自訂屬性的繼承）」這一段開始讀。重點理解：自訂屬性預設會沿 DOM 樹向後代繼承，這正是本課「作用域」行為背後的機制。
3. 觀看 Kevin Powell 的 [Using CSS custom properties](https://www.youtube.com/watch?v=_2LwjfYc1x8)，看他示範一些活用變數的巧妙手法。
4. 打開任一網頁的開發者工具（inspector），檢視它的樣式，找找看頁面用了哪些自訂屬性、宣告在哪裡（很多網站會集中宣告在 `:root`）。
5. 動手做：把上面「程式碼範例」的 HTML 存成檔案打開，自己加一組新變數（例如 `--radius` 圓角），套到按鈕上，並在兩個主題各給不同值，確認切換 class 時圓角也跟著變。

## 原文與延伸資源

- 原文：[Custom Properties](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-custom-properties)
- 本課引用：
  - MDN — [Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties)（繼承、fallback、限制）
  - MDN — [`var()`](https://developer.mozilla.org/en-US/docs/Web/CSS/var)
  - MDN — [`prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
  - MDN — [`:root`](https://developer.mozilla.org/en-US/docs/Web/CSS/:root)

---

> 本講義改寫自 The Odin Project《Custom Properties》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
