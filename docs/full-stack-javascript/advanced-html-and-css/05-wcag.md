---
title: WCAG 無障礙準則
source_url: https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-the-web-content-accessibility-guidelines-wcag
source_file: vendor/curriculum/advanced_html_css/accessibility/the_web_content_accessibility_guidelines_wcag.md
path: full-stack-javascript
course: Advanced HTML and CSS
order: 5
status: draft
generated: 2026-07-03
---

# WCAG 無障礙準則

> 改寫自 The Odin Project：[The Web Content Accessibility Guidelines (WCAG)](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-the-web-content-accessibility-guidelines-wcag)
> ｜Full Stack JavaScript › Advanced HTML and CSS › Accessibility

## 核心概念

在前一課我們理解了 web accessibility（網頁無障礙，常簡寫為 a11y）對某些使用者有多重要，而且對*所有*使用者往往都有好處。但問題來了：我們怎麼知道「哪些東西應該做到無障礙」，又怎麼知道「該用什麼方法讓它們變得無障礙」？答案有很多來源，其中最寶貴的一種，就是那些真正依賴無障礙功能的使用者本身。

另一個涵蓋面很廣的來源，是 **WCAG（Web Content Accessibility Guidelines，網頁內容無障礙準則）**。它整理了大量讓網站變得更無障礙的做法。這一課我們只會淺淺地掠過 WCAG 的表面，目的是讓你在比較基礎的層次上先熟悉它，而不是逐條把它讀完。

### WCAG 存在的目的

WCAG 之所以存在，是為了替網頁無障礙建立一套**共享的標準（shared standard）**。你可以把「網頁無障礙」想成我們要抵達的目的地，而 WCAG 是幫助我們更靠近那個目的地的其中一項工具。

這裡有一個很重要、卻常被誤解的觀念：WCAG 雖然對打好無障礙的基礎極有幫助，但它**不是無障礙的終點線**。就像它名字所說的，這些是「準則（guidelines）」，它們只能幫我們把網站做得*更*無障礙一點，而不是保證做到就等於「完全無障礙」。換句話說，WCAG 是一份很好的地圖與檢查清單，但真正的目標是使用者能不能順利使用你的網站，這兩者不能畫上等號。

### 四大原則（POUR）

WCAG 是圍繞著四個核心原則來組織的，這四個原則的英文字首合起來剛好是 **POUR**。每當你要實作任何一種無障礙功能時，都應該把這四點放在心裡：

1. **Perceivable（可感知）**：使用者必須能夠「感知」到你所呈現的資訊或介面。舉例來說，淺色文字配上淺色背景，對某些有視覺障礙的使用者來說可能很難辨識，這就違反了可感知原則。資訊不能只以單一感官管道傳達，必須確保使用者有辦法接收到它。

2. **Operable（可操作）**：使用者必須能夠「操作」任何介面或導覽功能，介面不能要求使用者做出他們根本做不到的互動動作。例如，一個下拉選單如果只在滑鼠游標「懸停（hover）」時才展開，那麼只用鍵盤、透過 focus（焦點）在選單項目間移動的使用者就無法操作它，這就違反了可操作原則。

3. **Understandable（可理解）**：使用者必須能夠「理解」呈現在他們眼前的資訊或介面。舉例來說，如果使用者送出表單後收到一個像「Error 113: Bad data」這樣的錯誤訊息，他們根本無從得知這個錯誤到底是什麼意思，也不知道該怎麼修正造成錯誤的原因，這就違反了可理解原則。

4. **Robust（穩健）**：內容必須能被「當前」的輔助科技（assistive technology）與其他 user agent（使用者代理，例如瀏覽器）存取，而且當這些科技持續演進時，內容也必須維持可被存取的狀態。這通常意味著要使用正確、符合標準的 HTML 語意，讓各種工具都能正確解讀。

只要記住 POUR 這個字，就能隨時提醒自己：你正在做的東西，是不是同時滿足了可感知、可操作、可理解、穩健這四個面向。

### 三個符合等級（Conformance Levels）

符合等級（conformance level）在後續的幾課也會被提到，我們在這裡先簡單解釋一下它們是什麼，讓你有個心理準備。WCAG 有三種不同的符合等級，每一個等級都由若干「成功準則（success criteria）」——也就是必須遵守的規則——所組成，只有滿足對應的規則，才算成功達到那個等級。

在這一系列課程裡，你**不需要**去完整達成任何一個符合等級，你只要知道它們存在就好（好消息是它們的命名很好記）：

- **Level A（基本支援）**：這是 WCAG 的最低符合等級，屬於最基本、必要的支援。
- **Level AA（理想支援）**：這是許多組織會努力達成的等級。要達到 Level AA，必須同時也滿足 Level A。
- **Level AAA（特殊支援）**：不建議整個網站都完整達到這個等級，因為某些內容的性質本身就可能讓 AAA 無法被滿足。要達到 Level AAA，必須同時也滿足 Level A 與 Level AA。

可以看出這三個等級是「層層累加」的：AA 包含 A，AAA 又包含 A 與 AA。實務上，Level AA 是最常被當作目標的平衡點。

### 開始實作無障礙之前

接下來的幾課會深入好幾個能幫你提升網站無障礙度的概念，但它們並不會涵蓋無障礙的*每一個*面向。這些課程的目標，只是把一些「你日後應該養成習慣去檢查」的常見概念介紹給你。

即使我們只介紹了一部分 a11y 概念，你可能還是會擔心自己的網站不夠無障礙。這裡有兩件事要放在心上：

第一，要記住**沒有任何網站能做到 100% 無障礙**，所以不要把「完全無障礙」當成目標去追求，那是不可能達成的。有時候一個網站的目的或概念本身，甚至就要求某些東西在特定方式上不做到無障礙。

第二，踏出創造無障礙網站的頭幾步，其重要性一點也不亞於你未來會走的更多步。就算你現在只為網站加上一項 a11y 功能，這個你以為「微不足道」的小改動，實際上可能對比你想像中更多的使用者帶來巨大的改善。所以在實作無障礙時，尤其是剛起步的階段，不要覺得自己非得一次把所有東西都做到完美、全部一次補齊不可。持續、漸進地改善，才是務實的做法。

## 程式碼範例

WCAG 的四大原則裡，最容易用程式碼直接體會的是 **Perceivable（可感知）**。下面用一個對照範例，示範「淺色文字配淺色背景」為什麼是無障礙問題，以及修正後的樣子。

```html
<!-- HTML：兩張卡片，內容一模一樣，只有顏色不同 -->
<div class="card bad">
  <p>對比度不足：淺灰文字配白底，弱視使用者可能完全看不清。</p>
</div>

<div class="card good">
  <p>對比度充足：深色文字配白底，大多數人都能輕鬆閱讀。</p>
</div>
```

```css
/* CSS：對照兩種對比度 */
.card {
  padding: 1rem;
  background-color: #ffffff; /* 白色背景 */
}

.bad p {
  color: #cccccc; /* 淺灰文字，與白底對比度僅約 1.6:1，遠低於標準 */
}

.good p {
  color: #333333; /* 深灰文字，與白底對比度約 12.6:1，遠超過標準 */
}
```

WCAG 的 Level AA 要求一般內文文字與背景的對比度至少達到 **4.5:1**（大型文字則為 3:1）。上面 `.bad` 的 1.6:1 完全不合格，`.good` 的 12.6:1 則綽綽有餘。你可以用瀏覽器開發者工具的 color picker（取色器），或線上的 contrast checker（對比度檢查工具）快速驗證任意兩個顏色的對比值。

## 常見陷阱

!!! warning "把「符合 WCAG」誤當成「已經無障礙」"
    WCAG 是準則，不是終點線。通過某個符合等級的自動化檢測，不代表真實使用者就能順利操作你的網站。自動化工具只能抓到部分問題（例如對比度、缺少 alt 文字），像「鍵盤操作順序是否合理」「錯誤訊息是否讓人看得懂」這類問題，仍需要你實際用鍵盤、用螢幕閱讀器親自走一遍才驗證得出來。目標永遠是「使用者能不能用」，而不是「有沒有勾滿檢查表」。

!!! warning "追求 100% 無障礙或非 AAA 不可"
    沒有網站能做到 100% 無障礙，把它當目標只會讓你卡住不敢動手。同樣地，Level AAA 並不適合整站完整達成，強行硬套反而可能犧牲設計或內容。實務上以 Level AA 為目標、先加上一兩項改善，遠比追求完美卻遲遲不做要有價值。

## 練習

1. 讀一遍 W3C 的 [WCAG Overview](https://www.w3.org/WAI/standards-guidelines/wcag/) 頁面。現在先不用管上面其他所有連結。讀這頁的目的，是理解其中的整體概覽，並熟悉這個網站本身，好讓你日後*真的*需要查閱其他頁面時，知道去哪裡找。
2. 快速瀏覽 [WebAIM 的 WCAG 2 Checklist](https://webaim.org/standards/wcag/checklist)，記得閱讀頁面上那段重要的免責聲明。現在的目標只是對常見的無障礙問題有個概念——其中一部分等你上完這系列課程後就有能力修正——而不是把頁面上每一條問題都讀完。不過建議把這個資源加入書籤：等你之後真正動手實作無障礙時，把它當成你的檢查清單會非常方便。

## 原文與延伸資源

- 原文：[The Web Content Accessibility Guidelines (WCAG)](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-the-web-content-accessibility-guidelines-wcag)
- 本課引用：
  - [WCAG Overview（W3C WAI）](https://www.w3.org/WAI/standards-guidelines/wcag/)
  - [WebAIM's WCAG 2 Checklist](https://webaim.org/standards/wcag/checklist)

---

> 本講義改寫自 The Odin Project《The Web Content Accessibility Guidelines (WCAG)》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
