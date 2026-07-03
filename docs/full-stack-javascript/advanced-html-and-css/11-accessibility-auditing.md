---
title: 可及性稽核
source_url: https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-accessibility-auditing
source_file: vendor/curriculum/advanced_html_css/accessibility/accessibility_auditing.md
path: full-stack-javascript
course: Advanced HTML and CSS
order: 11
status: draft
generated: 2026-07-03
---

# 可及性稽核

> 改寫自 The Odin Project：[Accessibility Auditing](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-accessibility-auditing)
> ｜Full Stack JavaScript › Advanced HTML and CSS › Accessibility

## 核心概念

前面幾課學會了怎麼寫出更 accessible（可及）的網頁：語意化標籤、鍵盤操作、ARIA 屬性、色彩對比等等。但寫完之後真正的問題才浮現：**我怎麼知道自己做對了？** 有沒有漏掉的問題？有沒有還能再改進的地方？這一課要處理的就是「驗證」這一步，也就是可及性稽核（accessibility auditing）。稽核不是額外的裝飾，而是把「我以為我做到了」變成「我確認我做到了」的關鍵動作。

稽核的工具大致分成兩類：一是瀏覽器內建的 DevTools（開發者工具），適合邊寫邊做即時的小型檢查；二是第三方稽核工具，能一次掃出整頁的問題清單並依嚴重程度排序。兩者互補，而不是二選一。

### 一、用 DevTools 做即時稽核

你早就用 DevTools 看樣式、除錯 JavaScript 了。你可能不知道的是，它同時內建了一整組可及性相關的功能，非常適合當作「快速稽核」的第一道關卡。以 Chrome 為例，重點功能有以下幾個。

**Accessibility tab（可及性分頁）**：在 Elements（元素）面板選取一個元素後，右側會有一個 Accessibility 分頁（有時藏在「More Tabs / 更多分頁」的溢出選單裡）。打開它，你可以看到：

- **Accessibility tree（可及性樹）**：這是整課最重要的觀念。瀏覽器會把 DOM（文件物件模型）轉譯成一棵給輔助技術（assistive technology，例如螢幕閱讀器）使用的樹狀結構。螢幕閱讀器「看到」的不是你的 HTML 原始碼，而是這棵樹。勾選 Accessibility tab 上方的「Show accessibility tree」，DevTools 會用這棵樹取代原本的 DOM 樹顯示。你會很直觀地發現：一個沒有文字內容、也沒有 `aria-label` 的按鈕，在樹上就是一個沒有 name（可及名稱）的節點——螢幕閱讀器唸出來只會是「按鈕」，使用者根本不知道它是做什麼的。
- **ARIA Attributes（ARIA 屬性）**：列出目前元素身上所有的 ARIA 屬性，方便你確認 `role`、`aria-expanded`、`aria-label` 這些值是不是如你預期。
- **Computed Properties（計算後屬性）**：顯示瀏覽器最終替這個元素算出來的可及性屬性，例如它實際的 `role`、`name`、`focusable`（可聚焦）、`invalid`（無效）等狀態。這裡的值是「經過瀏覽器計算後的真實結果」，往往比你在 HTML 裡寫的還要準——因為隱含語意（implicit role）也會反映在這裡。
- **Source Order Viewer（來源順序檢視）**：勾選「Show source order」後，DevTools 會在頁面上用帶編號的邊框標出各元素在 HTML 原始碼裡的先後順序。這一點很重要，因為 CSS（例如 Flexbox 的 `order`、Grid 的定位）可以讓「視覺順序」和「原始碼順序」不一致，而鍵盤 Tab 鍵與螢幕閱讀器是照原始碼順序走的。當兩者對不上，鍵盤使用者的操作動線就會變得混亂。

**Contrast ratio（對比度）檢查**：這一點在前面的色彩對比課提過。當你在 Styles（樣式）面板調整文字顏色時，DevTools 會在顏色旁自動顯示對比度數值，並用打勾或警告圖示告訴你是否通過 WCAG（Web Content Accessibility Guidelines，網頁內容可及性準則）的 AA / AAA 門檻。打開 color picker（色彩選擇器）還能看到一兩條對比參考線，把顏色拖到線的合格側，就能一眼挑到符合標準的顏色。

**Emulate vision deficiencies（模擬視覺缺陷）**：在 Rendering（算繪）分頁裡，可以把整個頁面模擬成不同色盲類型（例如 protanopia 紅色盲、deuteranopia 綠色盲、tritanopia 藍色盲、achromatopsia 全色盲）看起來的樣子，還能模擬 blurred vision（視力模糊）。這讓你親眼確認：如果你的介面「只用顏色」來傳達資訊（例如紅色代表錯誤、綠色代表成功），對色盲使用者是不是就失效了。除此之外，Rendering 分頁也能模擬 dark mode、`prefers-reduced-motion`（偏好減少動態）、forced-colors（強制色彩）等使用者偏好。

**Issues tab（問題分頁）**：DevTools 底部的 Issues 分頁會集中列出瀏覽器偵測到的各類問題，其中包含一部分可及性問題（例如表單控制項缺少關聯的 label）。它會附上問題說明與受影響的元素連結，點一下就能跳到對應的 DOM 節點。這一課只要求你「知道怎麼打開這個分頁」即可，不需要記住每一種問題。

值得補充的是，不同瀏覽器的可及性面板細節會不一樣。Firefox 的 Accessibility Inspector 同樣提供可及性樹、逐一顯示每個物件的 name / role / states（狀態），還內建幾個好用的稽核入口：一個下拉選單能直接掃描 Contrast、Keyboard、Text Labels 三類問題；「Show Tabbing Order」會在頁面上用帶編號的疊圖畫出鍵盤 Tab 的行進順序；也有色盲模擬器。雖然 `role` 的值或屬性呈現方式在各瀏覽器間略有差異，觀念與稽核流程是共通的。

### 二、用第三方工具做全頁稽核

DevTools 適合逐點檢查，但要一次掃出整頁問題並排序，第三方稽核工具更有效率。養成稽核習慣後，你就能揪出那些自己沒注意到的殘留問題。本課介紹三個常見工具，各有優缺點：

- **axe DevTools（給 Chrome 用的擴充套件）**：以瀏覽器擴充套件的形式運作。掃描後會回傳一份依 severity level（嚴重程度）排序的問題清單，並標出哪些項目需要你「手動確認」（因為有些問題自動化工具無法百分百判定，只能提醒你人工檢查）。axe 的規則引擎被業界廣泛採用，誤報率相對低。
- **Lighthouse（Chrome 內建）**：直接內建在 Chrome DevTools 裡（有時會列在 Auditing 分頁），也可以從命令列執行。Lighthouse 不只做可及性，還涵蓋 performance（效能）、best practices（最佳實務）、SEO（搜尋引擎最佳化），以及在適用時的 PWA（漸進式網頁應用程式）。它把問題依類別分開呈現，可及性類別同樣可能列出需要你手動確認的項目。**這一題常出現在 knowledge check：Chrome DevTools 內建、預設就有的第三方可及性稽核工具，就是 Lighthouse。**
- **WAVE（WebAIM 出品）**：以網站形式運作，你把要稽核的頁面 URL 貼進去即可（也有瀏覽器擴充套件與 API）。WAVE 會回傳頁面預覽，並在畫面上疊放一堆圖示，把問題分成 alerts（提示）、warnings（警告）、contrast errors（對比錯誤）等類別。缺點是這些疊上去的圖示可能撐破原本的版面配置；但如果你當下只在意找出可及性問題，這通常是可以接受的小代價。

要特別強調的心態：**自動化稽核工具只能覆蓋一部分問題**。研究普遍認為，自動化工具大約只能抓到全部可及性問題的三到四成。像「替代文字寫得對不對」「Tab 順序是否合理」「這個 ARIA 到底有沒有幫上忙」這類需要理解語意與情境的判斷，工具給不出答案。所以工具回報「零錯誤」不等於「完全可及」。

也因此，最可靠的稽核方式之一，其實是**直接向真正依賴這些可及性功能的使用者收集回饋**。這不見得容易安排，但來自實際使用螢幕閱讀器、鍵盤導航或其他輔助技術的使用者的意見，價值遠高於任何自動化分數。自己動手也可以：拔掉滑鼠、只用鍵盤把整個流程走一遍，或打開系統內建的螢幕閱讀器聽一次，往往能立刻發現工具沒抓到的破綻。

小結一下稽核的實務節奏：開發當下用 DevTools 做即時檢查（看可及性樹、確認對比、模擬色盲），完成一個頁面後用 axe 或 Lighthouse 跑一次全頁掃描修掉明顯問題，最後靠鍵盤實測與真實使用者回饋補上工具照不到的死角。現階段你只需聚焦修正本課程可及性單元教過的那些概念相關的問題即可，其他先不用鑽。

## 程式碼範例

稽核工具最常抓到的幾類問題，其實都對應到很好修的 HTML。下面用一段「會被稽核工具點名」的程式碼，示範問題出在哪、修正後長什麼樣。

```html
<!-- 稽核前：多個常見的可及性問題 -->
<!-- 問題 1：img 沒有 alt，可及性樹上是一張沒有 name 的圖 -->
<img src="logo.png">

<!-- 問題 2：只靠顏色與 div 假裝成按鈕，鍵盤無法聚焦、role 也不是按鈕 -->
<div class="btn" style="color:#bbb;background:#ccc" onclick="submit()">送出</div>

<!-- 問題 3：input 沒有關聯的 label，螢幕閱讀器唸不出這是什麼欄位 -->
<input type="email" placeholder="Email">
```

```html
<!-- 稽核後：修正同樣的三個問題 -->
<!-- 修正 1：補上有意義的 alt 文字 -->
<img src="logo.png" alt="Odin Notes 標誌">

<!-- 修正 2：改用語意化的 <button>，天生可聚焦、role 正確；顏色也拉高對比 -->
<button type="submit" class="btn" style="color:#fff;background:#0b5">送出</button>

<!-- 修正 3：用 label 的 for 綁定 input 的 id，建立可及名稱 -->
<label for="email">Email</label>
<input type="email" id="email">
```

Lighthouse 除了在 DevTools 面板點按執行，也能從命令列跑，方便納入自動化流程（例如 CI）：

```bash
# 全域安裝 Lighthouse CLI（需要 Node.js）
npm install -g lighthouse

# 只跑可及性類別，並輸出成 HTML 報告
# --only-categories=accessibility 讓它只做 a11y 稽核，跑得更快
lighthouse https://example.com \
  --only-categories=accessibility \
  --output=html \
  --output-path=./a11y-report.html
```

跑完打開 `a11y-report.html`，就會看到一份依類別分組、附帶修正建議的可及性報告。

## 常見陷阱

!!! warning "以為自動化工具零錯誤就等於完全可及"
    自動化稽核工具大約只能偵測到三到四成的可及性問題。像替代文字是否貼切、Tab 順序是否合理、ARIA 是否真的有幫助，這些都需要人工判斷。工具通過不代表過關，務必再用鍵盤實測並盡量取得真實使用者回饋。

!!! warning "把 DevTools 的 DOM 樹當成螢幕閱讀器看到的內容"
    螢幕閱讀器讀的是 accessibility tree，不是你的 HTML 原始碼。請養成打開 Accessibility tab、勾選「Show accessibility tree」的習慣，用瀏覽器計算後的 name / role / state 來判斷，而不是憑 HTML 想像。

!!! warning "只用顏色傳達資訊"
    只用紅／綠等顏色表示錯誤或成功，對色盲使用者會失效。用 DevTools 的 Rendering 分頁模擬各種 vision deficiencies 檢查看看；資訊除了顏色，最好再搭配文字、圖示或形狀。

!!! warning "忽略視覺順序與來源順序不一致"
    CSS 的 Flexbox `order`、Grid 定位會讓畫面排列和 HTML 原始碼順序脫鉤，但鍵盤 Tab 與螢幕閱讀器是照原始碼順序走的。用 Source Order Viewer（Chrome）或 Show Tabbing Order（Firefox）確認動線是否合理。

!!! warning "WAVE 的疊圖撐破版面就慌了"
    WAVE 會把圖示疊在頁面上，可能導致版面看起來破掉。這是工具呈現方式造成的，不是你的網站壞了；把注意力放在它回報的 alerts、warnings、contrast errors 上即可。

## 練習

閱讀以下資源，動手在自己的瀏覽器 DevTools 裡把每個功能都點過一遍：

1. **Chrome 可及性功能參考**：閱讀 [Accessibility features reference](https://developer.chrome.com/docs/devtools/accessibility/reference/#tab) 中「Accessibility tab」以後的段落，了解 Chrome DevTools 的可及性面板：可及性樹、ARIA 屬性、計算後屬性、來源順序檢視。實際選一個元素，打開 Accessibility tab 逐項看過。
2. **模擬視覺缺陷**：閱讀 Chrome 83 更新頁的 [Emulate vision deficiencies](https://developer.chrome.com/blog/new-in-devtools-83/#vision-deficiencies) 段落。打開 Rendering 分頁，把自己做過的專案切換成各種色盲模式，觀察介面是否還能正確傳達資訊。
3. **打開 Issues 分頁**：閱讀 [Open the Issues tab](https://developer.chrome.com/docs/devtools/issues/#open)。頁面中與可及性無關的內容可以略過，重點只在學會如何打開這個分頁；打開後，除了其他問題，你也能看到可及性相關的問題。
4. **Firefox 的可及性面板**：閱讀 [MDN 文件中「Features of the Accessibility panel」段落](https://firefox-source-docs.mozilla.org/devtools-user/accessibility_inspector/index.html#features-of-the-accessibility-panel)。雖然內容偏向 Firefox（`role` 的值或屬性呈現方式會與 Chrome 有出入），但可及性樹、問題掃描、Tab 順序視覺化等觀念對 Chrome 使用者同樣受用。

做完後回頭自我檢測（本課的 knowledge check）：你能說出瀏覽器 DevTools 提供了哪些可及性功能嗎？以及——哪一個第三方可及性稽核工具是 Chrome DevTools 預設就內建的？（答案：Lighthouse。）

## 原文與延伸資源

- 原文：[Accessibility Auditing](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-accessibility-auditing)
- 本課引用：
    - [Chrome DevTools：Accessibility features reference](https://developer.chrome.com/docs/devtools/accessibility/reference/)
    - [Chrome DevTools：Emulate vision deficiencies（Chrome 83 更新）](https://developer.chrome.com/blog/new-in-devtools-83/#vision-deficiencies)
    - [Chrome DevTools：Open the Issues tab](https://developer.chrome.com/docs/devtools/issues/#open)
    - [MDN / Firefox：Accessibility Inspector](https://firefox-source-docs.mozilla.org/devtools-user/accessibility_inspector/index.html)
    - [axe DevTools for Chrome](https://chromewebstore.google.com/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
    - [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
    - [WebAIM WAVE](https://wave.webaim.org/)

---

> 本講義改寫自 The Odin Project《Accessibility Auditing》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
