---
title: 可及的色彩對比
source_url: https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-accessible-colors
source_file: vendor/curriculum/advanced_html_css/accessibility/accessible_colors.md
path: full-stack-javascript
course: Advanced HTML and CSS
order: 7
status: draft
generated: 2026-07-03
---

# 可及的色彩對比

> 改寫自 The Odin Project：[Accessible Colors](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-accessible-colors)
> ｜Full Stack JavaScript › Advanced HTML and CSS › Accessibility

## 核心概念

替頁面加上色彩能讓畫面更吸引人，但如果用錯色彩組合，或是「只靠顏色」來傳達資訊，反而會讓某些使用者更難看清、更難理解內容。這不代表你在挑配色時得綁手綁腳，而是提醒你：真正「使用」這些顏色時，要多花一點心思。這一課要處理兩件事——色彩之間的**對比（contrast）**夠不夠，以及**別讓顏色成為唯一的訊息載體**。

### 什麼是對比比值（contrast ratio）

對比比值（contrast ratio）指的是「兩個顏色之間的亮度差異」，用比值來表示。白字配白底的差異最小，比值是 `1:1`；黑字配白底的差異最大，比值是 `21:1`。所以任何一組前景色（foreground，通常是文字）與背景色（background）的對比，一定落在 `1:1` 到 `21:1` 之間。這個規則不只適用於一般文字，也適用於「文字的圖片（images of text）」，也就是把文字直接畫進圖檔裡的那種情況。

之所以要在意這個數字，是因為視力正常的人也許看得很輕鬆，但對於**弱視（visually impaired）**、老花、或在強光下看螢幕的使用者來說，對比太低的文字幾乎無法辨認。對比比值把「看不看得清楚」變成一個可以量化、可以檢測的標準，而不是憑感覺。

### 兩種符合等級：AA 與 AAA

對比的標準來自 WCAG（Web Content Accessibility Guidelines，網頁內容可及性指南）。它定義了兩種**符合等級（conformance level）**，而且每一種都分別為「一般文字」和「大型文字」訂了門檻。

先釐清什麼是大、什麼是小：

- **一般文字（normal text）**：字級小於 18pt / 24px 的文字；若是**粗體（bold）**，則是小於 14pt / 18.66px。
- **大型文字（large text）**：字級至少 18pt / 24px；若是粗體，則至少 14pt / 18.66px。

直覺上，字愈大愈好讀，所以大型文字被允許用比較低的對比。兩種等級的門檻如下：

1. **Level AA（最低標準，minimum）**：一般文字至少 `4.5:1`，大型文字至少 `3:1`。
2. **Level AAA（加強標準，enhanced）**：一般文字至少 `7:1`，大型文字至少 `4.5:1`。

一般實務上，網站至少要達到 **AA**；AAA 是更高的追求，不見得每個元素都能滿足。你會注意到一個巧妙的對稱：AAA 的「大型文字」門檻（4.5:1）剛好等於 AA 的「一般文字」門檻。

### 哪些情況可以例外

不是頁面上每一段文字都必須符合對比規則。以下三類文字屬於例外，不需要遵守：

- **附帶性文字（incidental text）**：剛好出現在某張以其他視覺內容為主的圖片裡的文字，或是純裝飾用、不傳達資訊的文字。
- **停用元件裡的文字**：屬於**未啟用或停用（inactive / disabled）**的 UI 元件，例如一顆被 disable、透明度被降低的按鈕上的文字。
- **Logo 或品牌名稱**：屬於商標或品牌名稱一部分的文字。

這些例外的共通點是：它們要嘛不承載必要資訊，要嘛使用者本來就無法與之互動，因此放寬對比要求並不會傷害可及性。

### 怎麼檢查對比比值

看到「18.66 像素」「4.5:1」這些數字，你可能會想：這誰記得住？更別說怎麼算出比值了。好消息是——你完全不用手算。

- **WebAIM Contrast Checker**：一個超好用的線上工具。你只要輸入前景色和背景色的 **HEX 色碼**，它就會即時算出對比比值，並告訴你通過了哪些符合等級（AA、AAA、大型文字各自標示）。頁面上還有一個 link contrast checker，專門處理「文字連結沒有底線時，連結顏色的對比該是多少」這個細節。
- **瀏覽器開發者工具（browser dev tools）**：這是課程特別要記住的兩種方式。在 **Chrome** 裡：
  1. 打開 Elements 分頁，點「元素挑選器（element picker）」工具，然後把游標移到頁面上的元素，浮動提示（tooltip）會在 Accessibility 區塊顯示對比比值。
  2. 或者在 Elements 分頁選取一個帶有文字的元素，到 Styles 面板找到 `color` 屬性，點它前面的**取色器（color picker）**，展開的面板裡就會顯示這段文字的對比比值。

把檢查納入開發流程，就能在寫樣式的當下立刻發現問題，而不是等到上線後才被回報。

### 別只靠顏色傳達資訊

對比顧好了，還有第二個重點：**不要只用顏色來傳達資訊**。原因是有些使用者無法區分某些顏色，甚至完全看不到顏色。

其中最極端的是**全色盲（achromatopsia）**，又稱完全色盲——這類使用者眼中的世界近乎黑白灰階。想像一排按鈕，要你指出「哪一顆是紅色的」，如果你看到的全是灰階，光憑顏色根本無從判斷。除了全色盲，還有紅綠色盲等更常見的**色覺缺陷（color blindness）**，人數遠比想像中多。

舉個實際會踩雷的例子：假設你做一個表單，並在說明裡寫「必填欄位以紅色文字標示」。對色盲或難以分辨顏色的使用者而言，這句話等於沒說——他們無法從一片同色調中挑出「紅色」那幾個，於是難以、甚至無法正確填寫表單。

正確做法是**再加一個不依賴顏色的訊號**。例如必填欄位同時用紅色文字**加上星號（asterisk，`*`）**標示：看得到顏色的人靠顏色快速掃視，看不到顏色的人靠星號一樣能辨認。顏色變成「加分的輔助」，而不是「唯一的線索」。

同樣的原則可以推廣到各種情境：狀態不要只用紅/綠圓點區分，也加上文字或圖示；圖表的線條不要只靠顏色區隔，也加上不同的線型或標籤；連結不要只靠顏色和內文區別，也保留底線。一般而言都應遵守這條規則；雖然偶爾會有非用顏色不可的例外，但那應該是深思熟慮後的選擇，而非預設。

## 程式碼範例

以下用「必填欄位」示範「不要只靠顏色」的具體寫法。重點不在顏色本身，而在於除了顏色之外，還提供了文字符號（星號）與螢幕閱讀器可讀的資訊。

```html
<!-- 反例：只用紅色文字說明必填，色盲使用者無法分辨 -->
<form>
  <p style="color: red;">紅色欄位為必填</p>
  <label style="color: red;">電子郵件</label>
  <input type="email" />
</form>

<!-- 正例：紅色文字 + 星號，顏色只是輔助 -->
<form>
  <p>標示 <span class="required-mark">*</span> 的欄位為必填</p>

  <label for="email">
    電子郵件
    <span class="required-mark" aria-hidden="true">*</span>
  </label>
  <!-- required 屬性同時讓瀏覽器與輔助技術知道這是必填 -->
  <input id="email" type="email" required />
</form>
```

```css
/* 星號用紅色是「加分」，真正傳達必填的是符號本身與 required 屬性 */
.required-mark {
  color: #d32f2f; /* 深紅，與白底對比較高 */
}

/* 一般文字建議至少達到 AA（4.5:1）
   下面這組深灰字配白底約為 16:1，通過 AAA */
body {
  color: #212121;            /* 深灰文字 */
  background-color: #ffffff; /* 白底 */
}

/* 反例：淺灰配白，對比僅約 1.9:1，AA/AAA 全部不通過 */
.low-contrast {
  color: #bbbbbb;
  background-color: #ffffff;
}
```

你可以把上面的 HEX 色碼貼進 WebAIM Contrast Checker 驗證：`#212121` 對 `#ffffff` 會通過 AA 與 AAA，而 `#bbbbbb` 對 `#ffffff` 會全部標示 Fail。

## 常見陷阱

!!! warning "以為顏色好看就等於可及"
    設計稿在你的高階螢幕上很美，不代表所有人都看得清楚。淺灰配白、黃字配白這類「時髦」配色往往對比嚴重不足。挑好配色後，務必用 WebAIM Contrast Checker 或 dev tools 逐一驗證，尤其是正文與按鈕文字，至少要通過 **AA（一般文字 4.5:1、大型文字 3:1）**。

!!! warning "用顏色當唯一訊息載體"
    「紅色代表錯誤、綠色代表成功」「紅字代表必填」——這些對色盲使用者形同隱形。永遠再補一個不依賴顏色的訊號：文字、圖示、星號、底線或不同線型。顏色可以加分，但不能是唯一線索。

!!! warning "搞混大型文字與粗體的門檻"
    「大型文字」不是憑感覺，而是有明確數字：一般字要 **≥ 18pt / 24px**，粗體則放寬到 **≥ 14pt / 18.66px**。低於門檻就得套用更嚴格的一般文字比值（AA 需 4.5:1）。別把 20px 的細體誤當成可以只用 3:1 的大型文字。

## 練習

以下把課程的 Assignment 改寫成可操作的步驟；project 類延伸請回原文查看。

1. 打開 WebAIM Contrast Checker，輸入幾組前景／背景 HEX 色碼，觀察比值以及 AA、AAA 在一般文字與大型文字上分別是 Pass 還是 Fail。試著微調其中一個顏色的明暗，看比值如何變化。
2. 在自己的專案（或任一網站）上，用 Chrome dev tools 練習兩種查對比的方法：一是用 Elements 分頁的元素挑選器 hover 元素、看 Accessibility 區塊的對比比值；二是選取帶文字的元素、在 Styles 面板點 `color` 的取色器看比值。
3. 找一個「只靠顏色傳達資訊」的介面（例如只用紅字標必填、只用紅綠圓點標狀態），動手改成「顏色 + 額外訊號」的版本，例如加上星號、文字說明或圖示。
4. 想更深入了解色覺缺陷有哪些類型、各自看到的世界如何，可搜尋 color blindness / color vision deficiency 的模擬工具，用它預覽自己的頁面。

## 原文與延伸資源

- 原文：[Accessible Colors](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-accessible-colors)
- 本課引用：
  - WebAIM Contrast Checker（線上對比檢查工具，輸入 HEX 即可）
  - Chrome DevTools 的 Elements 分頁：元素挑選器與 `color` 取色器都能顯示對比比值
  - WCAG 對比與符合等級（AA / AAA）定義

---

> 本講義改寫自 The Odin Project《Accessible Colors》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
