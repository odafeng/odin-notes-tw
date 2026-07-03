---
title: 預設樣式（Default Styles）
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-default-styles
source_file: vendor/curriculum/intermediate_html_css/intermediate_css_concepts/default_styles.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 4
status: draft
generated: 2026-07-03
---

# 預設樣式（Default Styles）

> 改寫自 The Odin Project：[Default Styles](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-default-styles)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Intermediate CSS Concepts

## 核心概念

### 為什麼一份沒有任何 CSS 的網頁，看起來還是有樣式？

你一定看過這個現象：新開一個 HTML 檔，一行 CSS 都沒寫，可是 `h1` 就是又大又粗、`a` 連結就是藍色帶底線、清單前面就是有小圓點、整個頁面貼著視窗邊緣還留了一圈空白。這些「你沒寫卻自己出現」的樣式，來自瀏覽器內建的 **user-agent stylesheet（使用者代理樣式表）**。

「user agent」是 HTTP 世界裡對「瀏覽器」的正式稱呼。每一款瀏覽器（Chrome、Firefox、Safari、Edge）內部都附帶一份預設樣式表，在你的 CSS 還沒載入、甚至完全沒有 CSS 時，就先幫每個 HTML 元素套上基本樣式。它的目的很單純：**保證一份純 HTML 文件在沒有任何作者樣式時，也具備可讀性與基本的視覺層次**——標題要看起來像標題、段落之間要有間距、連結要看得出可以點。

重點在於：**每一款瀏覽器的 user-agent stylesheet 並不完全相同**。它們對大方向有共識（`h1` 比 `h2` 大、連結是藍色），但在細節上各有各的數字——例如某個 `margin` 是 8px 還是 0.67em、表單元素 `<button>` `<input>` 的字體與內距、`<ul>` 的縮排量。這些細微差異，正是同一份網頁在不同瀏覽器上「長得不太一樣」的根源。

你可以在瀏覽器的開發者工具裡親眼看到它。打開 DevTools、選取一個元素、看 Styles 面板，凡是來源標成 `user agent stylesheet` 的規則，就是瀏覽器預設樣式，而不是你寫的。

### 不喜歡預設值，怎麼辦？

第一個、也是最直接的答案：**直接用你自己的 CSS 覆蓋它**。

這裡有一條規則在替你撐腰：**作者樣式（你寫的 CSS）的優先級高於 user-agent 樣式**。在 CSS 的「origin（來源）」層級中，作者樣式表的順位高於瀏覽器預設樣式表，所以只要你寫了同一個屬性，就會蓋掉預設值——而且通常不需要 `!important`，一條普通的規則就夠了。例如：

```css
/* 這一行就能蓋掉瀏覽器對 h1 預設的 margin */
h1 {
  margin: 0;
}
```

除了極少數例外，你想改什麼就寫什麼。這也是為什麼很多時候你會覺得「在跟瀏覽器的預設 margin/padding 打架」——你不是打不贏，你本來就贏，只是得一個一個元素去寫。

### 第二個答案：CSS reset

當「一個一個蓋」變成每個新專案都要重來一遍的苦工，而且還要對付跨瀏覽器的細微差異時，開發者想出了第二條路：**CSS reset（CSS 重置樣式表）**。

CSS reset 就是一份「專門用來改寫或清除 user-agent 預設樣式」的樣式表，你把它放在所有自訂 CSS 的最前面先載入。它的價值有兩個：

1. **消除跨瀏覽器不一致**——把各家瀏覽器不同的預設值統一成同一個起點，你在 Chrome 上調好的間距，到 Firefox 上不會突然跑掉。
2. **提供一塊乾淨的畫布**——把你不想要的預設值（尤其是 margin、padding、清單樣式）先清乾淨，之後你套自己的樣式時，不會被殘留的預設值干擾。

不過有一個非常重要的觀念：**reset 是主觀的、有個人偏好色彩的（opinionated）**。它反映的是「寫這份 reset 的那個人」認為的好起點，不是宇宙真理。因此 reset 不是必修、不是強制。有些開發者完全不用，有些人用現成的知名 reset，有些人維護自己的一份。你可以自己決定要不要用、用哪一份。

### reset 的光譜：從「全部清光」到「有主張的預設」

「CSS reset」其實是一個籠統的說法，底下藏著一整條光譜，從最激進到最溫和，理解它們的差異能幫你選對工具：

**1. 硬重置（Hard reset）— 以 Eric Meyer's Reset 為代表**

最激進的一端。它把幾十個 HTML 元素的 `margin`、`padding`、`border`、`font-size` 通通歸零，等於「焦土策略」。做完之後，`<p>` 不再看起來像段落、`<h1>` 不再看起來像標題、清單也沒有小圓點——所有元素在視覺上被拉平成同一種樣子。

- 好處：徹底擺脫「打地鼠」式地反覆對抗預設值，一切從零開始、完全由你掌控。
- 代價：你**連瀏覽器免費送你的可讀性與無障礙預設也一起清掉了**，每一個視覺層次都得自己重新建立。

**2. Normalize（正規化）— 以 Normalize.css 為代表**

一個典範轉移。它不「清除」樣式，而是**只修正瀏覽器之間真正不一致的地方，同時保留那些已經合理、且各家有共識的預設值**。用它的作者原話說，它的目標是「提供一個優雅、一致、簡潔、可以往上疊加的基準」。所以 `<h1>` 用完之後看起來還是像標題，只是它在每個瀏覽器裡都一樣大。它擁抱了瀏覽器預設樣式表原本的善意（易讀、無障礙、開箱即用），只是把跨瀏覽器的落差抹平。

**3. Reboot / 有主張的預設 — 以 Bootstrap Reboot 為代表**

建立在 Normalize 之上，再往前走一步：它用純元素選擇器，替許多 HTML 元素套上「有主張的」預設樣式。它不只是修不一致，還主動做設計決定——例如統一 `box-sizing`、調整行高、設定字體堆疊。這已經接近一套刻意設計的基礎樣式系統。

所謂「opinionated（有主張／有偏好）」，指的就是這份 reset **做了超出「單純修不一致」之外的主觀選擇**：挑了特定字體、特定行高、加了工具性的規則。以 sanitize.css 為例，它就明確地把自己所做的 19 個主觀決定一條一條寫進文件裡。整條光譜可以歸納成一句話：**從「全部移除」→「只做正規化」→「刻意的預設」**，在「一致性」和「實用性」之間找不同的平衡點。

### 2023 年之後的實務做法：混合式（hybrid）

現在多數人不再走「硬重置 vs. 純 normalize」的二選一，而是採**混合式**：拿一份輕量的正規化基底（例如 modern-normalize，它比原版 Normalize.css 更精簡，並加入像 `box-sizing: border-box` 這類實用的主觀預設），再補上少少幾條、只針對真正麻煩的元素的自訂 reset 規則。像 Tailwind CSS 的 Preflight 就是這種思路的代表：它把 normalize 與精選的 reset 規則揉在一起。

而要理解「一份好的現代 reset 到底在做什麼」，最好的教材是 Josh Comeau 的 custom CSS reset。它每一條規則都對應一個真實痛點，值得逐條看懂：

- **`box-sizing: border-box`（套用在所有元素含 `::before`/`::after`）**：把盒模型從預設的 `content-box` 改成 `border-box`。預設情況下，`padding` 和 `border` 會**額外撐大**元素、超出你宣告的 `width`，很容易造成溢出與難算的寬度；改成 `border-box` 後，`width` 就是元素最終的寬度，`padding` 與 `border` 都被算進去，版面直覺得多。
- **`margin: 0`**：清掉所有元素的預設外距，讓間距完全由你刻意控制，而不是被瀏覽器不同的預設 margin 牽著走。
- **`line-height: 1.5`（套在 `body`）**：預設行高約 1.2，偏擠、可讀性差（對閱讀障礙者尤其吃力）。拉大到 1.5 改善易讀性與無障礙。
- **`img, picture, video, canvas, svg { display: block; max-width: 100% }`**：圖片預設是 `inline`，會因為行高在下方莫名多出一小段空隙；改成 `block` 消掉空隙，`max-width: 100%` 則讓圖片在響應式版面中不會撐破容器。
- **`input, button, textarea, select { font: inherit }`**：表單元素預設**不繼承**頁面字體，會用瀏覽器自己的小字體，在手機上還可能觸發自動放大。強制它們繼承，排版才一致。
- **`overflow-wrap: break-word`**：很長的網址或單字沒有可斷行的空隙時會撐出水平捲軸；這條允許在必要時硬斷，避免溢出。

看懂這幾條，你就抓到了 reset 的精神：**它不是玄學，每一條都在解一個具體的、可被指出來的問題**。

### 這一課你真正該記住的

- 沒寫 CSS 也有樣式，是因為瀏覽器的 **user-agent stylesheet**；各瀏覽器的預設值大方向一致、細節有差。
- 想改預設值，**直接寫 CSS 覆蓋就好**，因為作者樣式的優先級高於瀏覽器預設。
- **CSS reset** 是為了「消除跨瀏覽器不一致」與「取得乾淨畫布」而存在的樣式表。
- reset 是**主觀的、非必修**的；從硬重置、normalize 到有主張的 reboot 是一條光譜，沒有唯一正解，你可以自己決定要不要用、用哪一種。

## 程式碼範例

下面是一個最小、可直接執行的例子，示範「同一段 HTML，套 reset 前 vs. 套 reset 後」的差別。把它存成 `index.html` 用瀏覽器打開即可。

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <title>預設樣式與 reset 示範</title>
  <style>
    /* ---------- 一份極簡的 CSS reset ---------- */
    /* 放在所有自訂樣式之前先載入 */

    /* 1) 統一盒模型：width 從此就是最終寬度 */
    *, *::before, *::after {
      box-sizing: border-box;
    }

    /* 2) 清掉所有元素的預設外距，間距改由自己掌控 */
    * {
      margin: 0;
    }

    /* 3) 改善預設行高，提升可讀性 */
    body {
      line-height: 1.5;
    }

    /* 4) 圖片改成 block 並限制最大寬度，避免溢出與底部空隙 */
    img, picture, svg, video {
      display: block;
      max-width: 100%;
    }

    /* 5) 表單元素繼承頁面字體，排版才一致 */
    input, button, textarea, select {
      font: inherit;
    }

    /* ---------- 以下才是這個頁面自己的樣式 ---------- */
    body {
      font-family: system-ui, sans-serif;
      padding: 24px;
    }
  </style>
</head>
<body>
  <h1>這是標題</h1>
  <p>這是一段文字。試著把上面整段 reset 註解掉，重新整理，觀察 margin、行高、字體的變化。</p>
  <button>一個按鈕</button>
</body>
</html>
```

實驗方法：先照原樣打開看一次，接著把 `<style>` 裡標示為 reset 的那幾段**整段刪掉或註解掉**再重新整理。你會看到標題與段落之間的間距、整體行高、按鈕的字體都變了——那些變化，全部來自瀏覽器的 user-agent stylesheet。

如果你想直接用一份成熟的 reset，也可以把上面那段自製 reset 換成 Josh Comeau 的版本（見延伸資源），概念完全一樣，只是規則更完整。

## 常見陷阱

!!! warning "reset 不是「越乾淨越好」——你會把無障礙也一起清掉"
    硬重置（如 Eric Meyer's Reset）把所有 `margin`、`font-size`、清單樣式歸零，看似「乾淨」，但也把瀏覽器免費提供的可讀性與語意層次一起丟掉了。歸零之後，`h1` 到 `h6` 看起來全都一樣大，你必須自己**重新**建立所有視覺層次。若你只是想抹平跨瀏覽器差異、又想保留合理預設，選 normalize 類的方案（或混合式）通常更省事。

!!! warning "reset 是有主張的（opinionated），不要當成標準答案照抄"
    每一份 reset 都反映作者的個人偏好——挑了特定行高、特定字體平滑化、特定的 `text-wrap` 策略。直接複製別人的 reset 沒問題，但要知道你也一併接收了對方的主觀選擇。理想上，你應該**看得懂每一條規則在解什麼問題**，才不會日後被某條你沒讀懂的規則影響版面卻找不到原因。

!!! warning "reset 的載入順序很重要"
    reset 必須放在你自己的 CSS **之前**。CSS 的層疊在同優先級時「後者覆蓋前者」，如果你把 reset 放到自訂樣式後面，reset 反而會蓋掉你辛苦寫的規則。用 `<link>` 引入時，reset 的 `<link>` 要排在自訂樣式的 `<link>` 上面。

## 練習

以下把原課的 Assignment 改寫成可操作的閱讀步驟。這三篇是理解「reset 為何存在、彼此差在哪、如何逐條推理」的最佳讀物，重點放在「建立判斷力」而非背程式碼：

1. 閱讀 CSS-Tricks 的〈Reboot, Resets, and Reasoning〉。重點抓住 reset 的歷史脈絡，以及「一份 reset 是有主張的（opinionated）」到底是什麼意思——為什麼同樣叫 reset，Eric Meyer 的硬重置、Normalize.css、Bootstrap Reboot 卻是三種不同哲學。
2. 閱讀 Matt Brictson 的〈Making the case for CSS normalize and reset stylesheets in 2023〉。重點理解 **reset 與 normalize 的差別**（清除 vs. 修正不一致），以及在現代你為什麼可能選擇「混合式」做法。
3. 閱讀 Josh Comeau 的〈A Modern CSS Reset〉。重點是他**逐條解釋每一條規則背後的思考**——把每一條規則對應到它要解決的具體問題，這正是你培養「reset 判斷力」的最佳範本。讀完後，試著把本課程式碼範例裡的自製 reset 換成他的完整版本，觀察差異。

讀完後，回頭確認你能回答本課的 Knowledge check：

- **為什麼會想用 CSS reset？** 為了消除各瀏覽器 user-agent stylesheet 之間的不一致，並取得一塊乾淨、可預測的起始畫布。
- **reset 是必需的嗎？** 不是。reset 是主觀且非強制的，你可以不用、用現成的、或自己寫一份。

## 原文與延伸資源

- 原文：[Default Styles](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-default-styles)
- 本課引用：
  - [Reboot, Resets, and Reasoning（CSS-Tricks）](https://css-tricks.com/reboot-resets-reasoning/)：reset 的歷史與「有主張」的意義。
  - [Making the case for CSS normalize and reset stylesheets in 2023（Matt Brictson）](https://mattbrictson.com/blog/css-normalize-and-reset)：reset 與 normalize 的差異、混合式做法。
  - [A Modern CSS Reset（Josh W. Comeau）](https://www.joshwcomeau.com/css/custom-css-reset/)：逐條拆解一份現代 reset 的每條規則。
  - [Normalize.css](https://necolas.github.io/normalize.css/)：最具影響力的 normalize 方案（延伸參考，非必讀）。

---

> 本講義改寫自 The Odin Project《Default Styles》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
