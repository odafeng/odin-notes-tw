---
title: 檢視 HTML 與 CSS（開發者工具）
source_url: https://www.theodinproject.com/lessons/foundations-inspecting-html-and-css
source_file: vendor/curriculum/foundations/html_css/css_foundations/inspecting_html_and_css.md
path: foundations
course: Foundations
order: 23
status: draft
generated: 2026-07-03
---

# 檢視 HTML 與 CSS（開發者工具）

> 改寫自 The Odin Project：[Inspecting HTML and CSS](https://www.theodinproject.com/lessons/foundations-inspecting-html-and-css)
> ｜Foundations › CSS Foundations

## 學習目標

讀完這課你應該能：

- 打開瀏覽器的 developer tools（開發者工具），並找到 Elements 與 Styles 兩個面板。
- 用兩種方式在頁面上選取（select）並檢視（inspect）特定元素。
- 看懂 Styles 面板：分辨哪些樣式正在生效、哪些被覆蓋（overwritten）而出現刪除線。
- 在瀏覽器裡即時修改 HTML 與 CSS，快速測試想法，並理解這些改動不會寫回原始碼。

## 核心概念

寫 CSS 時，你腦中想的樣子和瀏覽器實際畫出來的樣子，常常對不上。文字顏色沒變、間距怪怪的、某條規則好像「沒作用」——這些時候，與其反覆猜測、改一行存檔重整一次，不如直接打開 developer tools（開發者工具）問瀏覽器：這個元素到底套用了哪些樣式？哪一條贏了？這正是本課要練的核心技能——**檢視（inspect）與除錯（debug）**。

以下以 Chrome DevTools 為例說明，但 Firefox、Edge、Safari 都有幾乎一樣的工具，操作邏輯相通。

### 打開開發者工具

最直覺的方式是：在頁面上任何元素上按右鍵，選「檢查」（Inspect）。這會直接打開工具，並幫你把剛剛按右鍵的那個元素選起來。

也可以用鍵盤快捷鍵。在 Windows / Linux 上按 `F12`，或 `Ctrl + Shift + I` 打開上次用的面板；Mac 上是 `Cmd + Option + I`。還有兩個好記的口訣：`Ctrl + Shift + C`（Mac：`Cmd + Option + C`）直接進 Elements 面板並啟動「元素選取」模式，這裡的 **C 代表 CSS**；`Ctrl + Shift + J`（Mac：`Cmd + Option + J`）直接打開 Console，**J 代表 JavaScript**。此外也能從 Chrome 右上角三點選單 →「更多工具」→「開發者工具」進入。

第一次打開時你會看到一整排陌生的分頁，別被嚇到。這一課只需要專注兩個面板：**Elements**（元素）和 **Styles**（樣式）。其他像 Console、Network、Performance 之後的課程會慢慢碰到。

### Elements 面板：檢視與選取元素

Elements 面板顯示的是整個頁面的 HTML 結構，也就是所謂的 **DOM tree**（DOM 樹）。它長得像你寫的 HTML，但有個關鍵差別：它是瀏覽器實際渲染後的即時結構，而不是硬碟上那份靜態原始碼。

在這裡選取一個元素有兩種常用方法：

1. **直接在 DOM 樹裡點**：在面板中展開、點擊任何一個節點（node），它就被選起來了。用鍵盤方向鍵還能在父、子、兄弟節點之間移動。
2. **用「元素選取」工具**：點面板左上角那個「箭頭指向方框」的圖示（或按 `Ctrl + Shift + C`），游標移到頁面上任何地方，對應的元素就會高亮，點一下即選取。這個方法在頁面很複雜、你只知道「畫面上這一塊」卻不知道它在 HTML 哪裡時特別好用。

一旦選取了某個元素，右側的 **Styles** 面板就會同步顯示它身上所有的 CSS。

### Styles 面板：看懂哪條規則贏了

Styles 面板會把套用到目前元素的所有樣式列出來，並依來源分組——外部樣式表（external stylesheet）、內嵌樣式（inline style）、各個 class 的規則等等，由上而下大致按優先權排列。

這裡最重要的一個視覺訊號是**刪除線（strikethrough）**。當某條 declaration（宣告）被文字劃掉時，代表它**被其他更優先的規則覆蓋（overwritten）掉了**，也就是它沒有真正生效。舉例：假設一個標題同時被兩條規則設定顏色，一條來自標籤選擇器、一條來自更具體的 class，那麼優先權（specificity）較低的那條 `color` 就會被劃線。這正是你除錯「為什麼顏色沒變」時最該盯著看的地方——你以為在改的那條，很可能正躺在刪除線底下。

除此之外，Styles 面板還有幾個實用區塊：

- **Box Model（盒模型）圖**：以圖示標出這個元素的 margin、border、padding 與內容尺寸，讓你一眼看懂間距是誰造成的。
- **`:hov`（pseudo-state，偽狀態）**：可以強制讓元素進入 `:hover`、`:focus`、`:active` 等狀態，不必真的把滑鼠一直懸在上面就能檢視這些狀態的樣式。
- **`.cls`**：快速新增或勾選/取消某個 class，觀察加上或拿掉 class 對外觀的影響。

### 在瀏覽器裡即時測試

Styles 面板不只能看，還能**直接編輯**。你可以點某個既有的 property（屬性）或 value（值）把它改掉，或在 `element.style` 這個區塊裡新增一條規則：輸入屬性名（例如 `background-color`）按 Enter，再輸入值。頁面會**即時**反映改動，不需要重新整理。

同樣地，在 Elements 面板裡雙擊標籤中間的文字可以改內容、雙擊屬性名或值可以改屬性，右鍵「Edit as HTML」還能一次改一整段結構；按 `H` 隱藏節點、按 `Delete` 刪除、拖曳可調整順序。

有一件事一定要記住：**這些改動全都是暫時的，只存在於目前這個頁面工作階段（session），不會寫回你編輯器裡的原始碼。**一重新整理就全部消失。這聽起來像缺點，其實正是它的價值——你可以放心大膽地把某個 padding 調大、把顏色換掉、把某條規則關掉，快速驗證「這樣改對不對」，確認之後再回到編輯器把正確的值寫進真正的檔案。它是一個零風險的實驗場。

## 程式碼範例

developer tools 本身沒有「程式碼」可寫，但我們可以用一小段會觸發刪除線的例子，讓你動手驗證上面講的優先權概念。把下面存成 `index.html` 用瀏覽器打開，再按右鍵檢查那段文字。

```html
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <title>檢視練習</title>
    <style>
      /* 標籤選擇器：優先權較低 */
      p {
        color: blue;
      }

      /* class 選擇器：優先權較高，會贏過上面那條 */
      .highlight {
        color: red;
      }
    </style>
  </head>
  <body>
    <!-- 這個 p 同時符合上面兩條規則 -->
    <p class="highlight">選取我，看看 Styles 面板</p>
  </body>
</html>
```

用「元素選取」工具點這行文字後，在 Styles 面板你會看到：`.highlight` 裡的 `color: red` 正常顯示並生效（文字是紅色），而 `p` 裡的 `color: blue` 被劃上**刪除線**——它輸掉了。接著你可以當場把 `.highlight` 的 `red` 改成 `green`，文字立刻變綠；重新整理頁面後又會變回紅色，證明改動只是暫時的。

## 常見陷阱

!!! warning "在開發者工具裡改的東西，重整就不見"
    很多初學者在瀏覽器裡把樣式調到滿意，關掉分頁或按了重新整理，才發現什麼都沒保留下來，還以為「白做工」。請記得：developer tools 是**測試與除錯**用的暫存沙盒，不是編輯器。正確流程是先在這裡試出對的值，再手動把它寫回你專案裡真正的 `.css` 或 `.html` 檔案。

!!! warning "沒生效的規則，往往正躺在刪除線底下"
    當某條 CSS「明明寫了卻沒作用」時，第一件事不是懷疑語法拼錯，而是選取該元素、看 Styles 面板裡它是不是被劃了刪除線。有刪除線就代表被更高優先權（specificity）的規則覆蓋了，你該處理的是「誰把它蓋掉」，而不是一直重寫同一條。

## 練習

跟著官方 [Chrome DevTools 文件](https://developer.chrome.com/docs/devtools/overview/) 的以下幾個章節走一遍，親手操作最重要：

1. **DevTools overview（總覽）**：只需大致了解 DevTools 裡「有哪些工具」，先建立整體印象，不用急著學會每一個；別點進頁面裡其他延伸連結，以免迷路。
2. **Open Chrome DevTools（開啟）**：對照本課講的打開方式，補充一些好用的小技巧與快捷鍵。
3. **View and change the DOM（檢視與修改 DOM）**：練習選取節點、編輯文字與屬性；遇到用到 JavaScript console 的段落可以先跳過。
4. **View and change CSS（檢視與修改 CSS）**：務必跟著文件裡的互動步驟一步步操作，實際感受即時修改樣式、看刪除線、切換 `:hover` 的效果。

做完後，試著回答自己：怎麼選取特定元素？刪除線代表什麼？怎麼即時改某個元素的 CSS？答得出來，這課就過關了。

## 原文與延伸資源

- 原文：[Inspecting HTML and CSS](https://www.theodinproject.com/lessons/foundations-inspecting-html-and-css)
- 本課引用：
  - [Chrome DevTools overview](https://developer.chrome.com/docs/devtools/overview/)
  - [Open Chrome DevTools](https://developer.chrome.com/docs/devtools/open/)
  - [View and change the DOM](https://developer.chrome.com/docs/devtools/dom/)
  - [View and change CSS](https://developer.chrome.com/docs/devtools/css)

---

> 本講義改寫自 The Odin Project《Inspecting HTML and CSS》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
