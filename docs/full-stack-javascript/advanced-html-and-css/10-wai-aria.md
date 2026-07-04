---
title: WAI-ARIA
source_url: https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-wai-aria
source_file: vendor/curriculum/advanced_html_css/accessibility/wai_aria.md
path: full-stack-javascript
course: Advanced HTML and CSS
order: 10
status: draft
generated: 2026-07-03
---

# WAI-ARIA

> 改寫自 The Odin Project：[WAI-ARIA](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-wai-aria)
> ｜Full Stack JavaScript › Advanced HTML and CSS › Accessibility

## 核心概念

在前面的無障礙（accessibility，可及性）課程中，你已經學到好幾種讓網站更好用的做法，例如語意化 HTML、鍵盤導覽、色彩對比等等。但那些只是冰山一角。有些情境下，原生 HTML 本身就無法完整表達一個元素「是什麼」或「代表什麼意思」，這時候就輪到 WAI-ARIA 上場。

### WAI-ARIA 是什麼

WAI-ARIA 是 Web Accessibility Initiative's Accessible Rich Internet Applications（網頁無障礙倡議的可及性豐富網路應用程式規範）的縮寫，通常大家直接簡稱它為 ARIA。它的核心目的只有一句話：**當原生 HTML 無法把內容表達得夠無障礙時，ARIA 提供一套方法來補足這個缺口。**

你可以把 ARIA 想成「填補原生 HTML 留下的無障礙空隙」的工具。它透過一組 attribute（屬性），修改元素的 semantics（語意）與 context（脈絡），藉此改變 assistive technology（輔助科技，例如 screen reader 螢幕報讀器）對這些元素的解讀方式。

由於 ARIA 這個主題非常龐大且容易出錯，本課只聚焦在兩個你會「非常」常用的重點：ARIA labels（ARIA 標籤）與 `aria-hidden`。

### ARIA 做不到的四件事

這是初學者最容易誤解的地方。ARIA **只能**修改元素的 semantics 或 context，它「不能」做到以下四件事：

- 修改元素的外觀（appearance）
- 修改元素的行為（behavior）
- 增加可聚焦性（focusability）
- 增加鍵盤事件處理（keyboard event handling）

換句話說，ARIA 只是「改寫元素在無障礙層面的說明文字或角色」，它不會幫你的 `<div>` 變成真的按鈕。當你使用 ARIA 時，通常還得自己動手補上缺少的語意或功能。回想一下 Keyboard Navigation（鍵盤導覽）那一課：我們把 `<div>` 當成「按鈕」使用時，得自己補上 `tabindex`、鍵盤事件監聽等等，ARIA 不會替你做這些事。

正因為如此，最保險的建議永遠是：**能用原生 HTML 就用原生 HTML**。一個 `<button>` 天生就具備可聚焦、可用鍵盤按下、對輔助科技宣告為「按鈕」的能力，完全不需要任何 ARIA。

### ARIA 的五條規則

ARIA 用對了威力強大，用錯了同樣危險。因此請牢牢記住一句話：**沒有 ARIA 勝過壞的 ARIA（no ARIA is better than bad ARIA）**，就算你出於好意也一樣。WCAG（Web Content Accessibility Guidelines，網頁內容無障礙指南）整理出所謂「ARIA 的五條規則」：

1. **能用原生 HTML 元素與屬性時，優先用原生，而非 ARIA。**
2. **不要改變原生語意，除非你別無選擇。**（例如不要在 `<h2>` 上硬加 `role="button"`。）
3. **所有可互動的 ARIA 控制項，都必須能用鍵盤操作。**
4. **不要在可聚焦的元素上使用 `role="presentation"` 或 `aria-hidden="true"`。**（否則使用者用鍵盤 Tab 到它時會一片空白。）
5. **所有可互動的元素都必須有 accessible name（可及名稱）。**

即使這門課不會涵蓋規則裡提到的每一個名詞，理解這五條規則的精神仍然很重要，尤其當你之後想更深入研究 ARIA 時。

### Accessibility tree（無障礙樹）

要理解 ARIA 屬性到底在做什麼，得先認識 accessibility tree（無障礙樹）。

你應該已經很熟悉 DOM（Document Object Model，文件物件模型）了。DOM 代表構成網頁的所有節點與物件；而 accessibility tree 是「以 DOM 為基礎」再另外產生的一棵樹，它只保留輔助科技會用到的「無障礙相關資訊」。ARIA 的運作原理，就是去修改 accessibility tree 中這些物件的屬性。

本課只需要關注其中兩個屬性：

- **Name（名稱）**：也就是 accessible name（可及名稱）。這是輔助科技會「唸出來」給使用者聽的內容，也是用來區分同類型元素彼此的關鍵。一個元素的 name 可以由一個或多個原生標籤來源決定，例如元素本身的文字內容、`<label>` 元素、或圖片的 `alt` 屬性等等。
- **Description（描述）**：這是輔助科技在唸出 accessible name「之後」，額外補充唸出的說明。

接下來介紹的 ARIA 屬性，本質上就是在改寫這兩個屬性。

### ARIA labels：改寫「名稱」

ARIA labels 透過覆寫原生標籤、或提供額外描述文字，幫助輔助科技的使用者更理解網頁內容。跟只能用在少數幾種元素上的 `<label>` 元素不同，ARIA labels 適用範圍廣得多（雖然它們也各有自己的限制）。

這裡要先提醒一件事：課程前面曾警告過不要濫用 `id` 屬性——一般情況下你應該優先用 class，`id` 能不用就不用。但有幾個 ARIA 屬性「偏偏就需要」另一個元素帶有 `id`。使用這類屬性時，你會給某個元素一個 `id`，再把這個 `id` 值當作另一個元素的 ARIA 屬性值傳入，藉此在兩個元素之間建立連結——這跟 `<label>` 用 `for` 屬性連到 input 的 `id` 是同一個道理。以下三種 ARIA labels 中，`aria-labelledby` 與 `aria-describedby` 都需要另一個元素帶有 `id`。

#### `aria-label`

`aria-label` 會覆寫元素的任何原生標籤，直接修改它在 accessibility tree 中的 name 屬性。它最適合用在「本身沒有原生標籤」的元素上；一旦加上，`aria-label` 的字串值就成為該元素的 accessible name。

**但要注意**：`aria-label` 對某些 HTML 元素（例如 `<div>` 或 `<span>`）不會產生效果。它主要用在可互動元素或 landmark（地標）元素上。

最經典的用途就是選單或 modal（強制回應視窗）的「關閉」按鈕，以及替 landmark 元素命名，讓同類型的多個地標彼此區分。

#### `aria-labelledby`

`aria-labelledby` 的優先權更高：它會同時覆寫原生標籤「以及」`aria-label`。使用時，你傳入一個或多個其他元素的 `id`，目標元素的 accessible name 會由這些被參照元素的文字內容（或 `alt` 屬性）「串接」而成。

它有幾個很棒的特性：

- 可以傳入任意數量的 `id` 參照，而且元素還能參照「自己」。
- 但同一個參照不能重複傳入，第一次之後的重複參照都會被忽略。
- 即使「作為標籤來源」的元素被視覺上隱藏（用 HTML 的 `hidden` 屬性或 CSS 隱藏），它仍然能修改被標記元素的 accessible name。這在你想替輔助科技使用者加上標籤、卻不想讓明眼使用者看到該標籤時非常有用。

要特別提醒：雖然它用起來有點像原生 `<label>`，但 `aria-labelledby` 預設「沒有」相同的事件處理行為。原生 `<label>` 點下去會讓對應 input 聚焦，`aria-labelledby` 不會——這種互動得靠你自己用 JavaScript 補上。

#### `aria-describedby`

`aria-describedby` 修改的是 accessibility tree 中的 description 屬性（而非 name）。用法與 `aria-labelledby` 類似：傳入其他元素的 `id` 值，而這些被參照的元素同樣可以在視覺上被隱藏。它最適合用來補充「額外說明」，例如密碼欄位的輸入規則、表單欄位的提示等等。當元素獲得焦點時，輔助科技會先唸出 name，再接著唸出這段 description。

### 從 accessibility tree 隱藏內容：`aria-hidden`

就像你可以用 HTML 的 `hidden` 屬性、或 CSS 的 `display`／`visibility` 屬性把元素「視覺上」藏起來，`aria-hidden` 屬性可以把某些元素（例如純裝飾用的圖片、圖示）從 accessibility tree 中隱藏。

`aria-hidden` 的關鍵差別在於：被它隱藏的元素「對明眼使用者仍然可見」，只是不會被輔助科技唸出來。這在「按鈕裡包了一個裝飾用圖示」的情境特別實用——你希望圖示看得見，但不希望螢幕報讀器把圖示的文字內容也唸進按鈕的 accessible name 裡。

使用時要留意兩個陷阱：

- 給某個元素 `aria-hidden="true"` 後，它「所有子元素」也會一併從 accessibility tree 被隱藏。就算對某個子元素加上 `aria-hidden="false"`，只要它的某個祖先仍是 `aria-hidden="true"`，也不會有任何效果。
- 不要對「可聚焦」的元素使用 `aria-hidden="true"`。這樣一來，當使用者用鍵盤 Tab 聚焦到它時會「什麼都不會被唸出」，反而讓依賴螢幕報讀器＋鍵盤導覽的使用者一頭霧水（這正呼應五條規則中的第四條）。

## 程式碼範例

```html
<!-- aria-label：覆寫按鈕的 name。 -->
<!-- 螢幕報讀器原本會唸「X, button」，加了之後會唸「Close menu, button」。 -->
<button type="button" aria-label="Close menu">X</button>

<!-- aria-label 用在 landmark 元素上，替多個相同地標命名以便區分。 -->
<!-- 螢幕報讀器會唸「main navigation, navigation landmark」。 -->
<nav aria-label="main navigation">...</nav>


<!-- aria-labelledby：串接多個元素的文字內容當作 name。 -->
<!-- 注意元素也可以參照自己（shop-btn），且串接順序依你在屬性中傳入 id 的先後。 -->
<h2 id="label">Shirts</h2>
<button type="button" id="shop-btn" aria-labelledby="label shop-btn">
  Shop Now
</button>
<!-- 唸出結果：「Shirts, shop now, button」，讓多顆「Shop Now」按鈕彼此可區分。 -->


<!-- 原生 label 點一下會讓 input 聚焦。 -->
<label for="name">Name:</label>
<input id="name" type="text" />

<!-- aria-labelledby 只提供名稱，點 <div> 不會讓 input 聚焦（需自行用 JS 補）。 -->
<div id="label">Name:</div>
<input type="text" aria-labelledby="label" />


<!-- aria-describedby：修改 description，補充額外說明。 -->
<label>
  Password:
  <input type="password" aria-describedby="password-requirements" />
</label>
<!-- 這段有意義的文字＋ARIA，讓 input 聚焦時被唸出。 -->
<span id="password-requirements">Password must be at least 10 characters long.</span>
<!-- input 聚焦時唸出：「Password, edit protected, password must be at least ten characters long.」 -->


<!-- aria-hidden：把裝飾用圖示藏出 accessibility tree，但畫面上仍看得見。 -->
<!-- 範例 1（不好）：會被唸成「Add add book, button」，多唸了圖示的文字。 -->
<button type="button">
  <span class="material-icons">add</span>
  Add Book
</button>

<!-- 範例 2（正確）：圖示被藏起，正確唸成「Add book, button」。 -->
<button type="button">
  <span class="material-icons" aria-hidden="true">add</span>
  Add Book
</button>
```

## 常見陷阱

!!! warning "壞的 ARIA 比沒有 ARIA 更糟"
    ARIA 不會替你補上任何行為或功能——它只改寫語意與脈絡。把 `<div>` 加上 `role="button"` 卻忘了補 `tabindex` 與鍵盤事件，只會產生一個「聽起來像按鈕、但根本按不動」的殘缺控制項。能用 `<button>`、`<nav>`、`<label>` 等原生元素時，永遠優先用原生，這是五條規則的第一條。

!!! warning "不要用 aria-label 去「矯正發音」"
    某些字詞可能被螢幕報讀器唸得不太對，你會忍不住想用 `aria-label` 去「修正」發音。千萬別這麼做：你也許修好了某一款螢幕報讀器的唸法，但這個「修正」在其他輔助科技（例如點字 braille 觸摸顯示器）上可能變得完全不知所云。`aria-label` 是用來提供「名稱」，不是用來調發音。

!!! warning "aria-hidden 會連同所有子元素一起隱藏"
    對元素設 `aria-hidden="true"` 後，它底下「所有」子孫元素都會從 accessibility tree 消失；就算對某個子元素補上 `aria-hidden="false"` 也救不回來，只要祖先仍是 `true`。此外，絕對不要對「可聚焦」的元素設 `aria-hidden="true"`，否則使用者 Tab 到它時會一片死寂。

!!! warning "aria-labelledby 沒有原生 label 的點擊行為"
    `aria-labelledby` 看起來像 `<label>`，但預設「不會」在點擊時把焦點轉給對應的輸入欄位。這種互動需要你自己用 JavaScript 實作，別以為加了屬性就自動具備原生 `<label>` 的所有行為。

## 練習

1. 閱讀 W3C 的〈ARIA in HTML〉文件第 1 到第 5 節（原文網址：`https://www.w3.org/TR/html-aria/`）。這份文件相當完整，但一如往常，你不需要背下任何東西，理解大意即可。日後的課程——尤其是進入前端測試時——許多工具都會用 ARIA roles 來鼓勵你「從一開始就以無障礙為前提」寫程式，你很可能會反覆回頭查閱這份文件或類似資源。
2. 認識 ARIA live regions（ARIA 即時區域，原文網址：`https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions`）。這是另一類 ARIA 屬性，對於「讓頁面的動態更新被輔助科技即時宣告」非常有用（例如聊天訊息、表單送出後的狀態提示）。
3. 動手練習：找一顆你自己專案裡「只有圖示、沒有文字」的按鈕，替它補上 `aria-label`；再找一個裝飾用的圖示，對它加上 `aria-hidden="true"`，並用瀏覽器 DevTools 的 Accessibility 面板檢查 accessible name 是否如預期改變。

## 原文與延伸資源

- 原文：[WAI-ARIA](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-wai-aria)
- 本課引用：
    - W3C〈ARIA in HTML〉：`https://www.w3.org/TR/html-aria/`
    - MDN〈ARIA live regions〉：`https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions`
    - W3C〈aria-label 對某些元素無效〉issue：`https://github.com/w3c/aria/issues/756`

---

> 本講義改寫自 The Odin Project《WAI-ARIA》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
