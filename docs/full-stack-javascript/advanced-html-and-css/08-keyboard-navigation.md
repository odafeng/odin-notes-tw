---
title: 鍵盤導覽
source_url: https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-keyboard-navigation
source_file: vendor/curriculum/advanced_html_css/accessibility/keyboard_navigation.md
path: full-stack-javascript
course: Advanced HTML and CSS
order: 8
status: draft
generated: 2026-07-03
---

# 鍵盤導覽

> 改寫自 The Odin Project：[Keyboard Navigation](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-keyboard-navigation)
> ｜Full Stack JavaScript › Advanced HTML and CSS › Accessibility

## 核心概念

不是每個人都用滑鼠操作電腦。有些人因為身體因素無法使用滑鼠，只能靠鍵盤，或靠能模擬鍵盤輸入的輔助科技（assistive technology，例如語音辨識軟體）來瀏覽網站；也有人單純偏好鍵盤、或滑鼠與鍵盤交替使用。這些使用者都需要「能用鍵盤好好操作」的網站，而這件事在開發時卻很容易被忽略。這一課要談的就是鍵盤導覽（keyboard navigation）：如何讓你的頁面對只用鍵盤的人也一樣好用。

鍵盤使用者操作頁面的核心動作，就是按 <kbd>Tab</kbd> 鍵在可互動元素之間跳來跳去，用 <kbd>Enter</kbd> 或 <kbd>Space</kbd> 觸發它們。整堂課的四個重點都圍繞這件事：互動元素要能被「聚焦」與「觸發」、聚焦樣式不能拿掉、Tab 順序要合理、隱藏內容要真的藏好。

### 聚焦（focus）與事件處理

要讓鍵盤使用者能操作一個互動元素，它必須同時具備兩件事：

1. **可被聚焦（focusable）**：能透過 <kbd>Tab</kbd> 鍵接收到 focus。
2. **有鍵盤的事件處理（event handling）**：當它有 focus 時，按下按鍵能觸發對應行為。

問題來自 `<div>` 和 `<span>` 這類語意中性的元素：它們預設**既不可聚焦、也沒有任何事件處理**。回想語意化 HTML 那一課裡「沒用語意元素」的剪刀石頭布例子，如果你用 `<div>` 當按鈕，滑鼠使用者點得到，但鍵盤使用者連 Tab 都跳不進去，更別說觸發。

要補救就得手動加兩樣東西。第一，用 `tabindex` 屬性讓 `<div>` 變得可聚焦：

```html
<!-- tabindex='0' 讓這些 <div> 能被 Tab 聚焦 -->
<div class="button-container">
  <div class="rock button" tabindex="0">石頭</div>
  <div class="paper button" tabindex="0">布</div>
  <div class="scissors button" tabindex="0">剪刀</div>
</div>
```

第二，還得手動掛上滑鼠與鍵盤兩種事件處理，因為 `<div>` 不會幫你把「按下 Enter/Space」轉成點擊：

```javascript
// 同時處理滑鼠 click 與鍵盤 keydown
const buttons = document.querySelectorAll(".button");

function nameAlerter(e) {
  if (e.type === "click" || e.key === " " || e.key === "Enter") {
    alert(e.target.textContent);
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", nameAlerter);
  button.addEventListener("keydown", nameAlerter);
});
```

但這麼做只解決了鍵盤問題，卻讓螢幕閱讀器使用者更難懂——這些「假按鈕」不會提供任何角色情境。相對地，直接用 `<button>` 元素就一次滿足所有需求：它**預設就可聚焦、也預設有鍵盤事件處理**，當 `<button>` 取得 focus 時，按 <kbd>Space</kbd> 或 <kbd>Enter</kbd> 就會觸發 click 事件，同時又能對螢幕閱讀器提供「按鈕」這個角色情境。

重點：任何互動元素都必須「可被鍵盤聚焦」且「有鍵盤事件處理」。用正確的語意化 HTML 能讓你幾乎不費力就達成；只有在不得不使用預設不可聚焦、或沒有事件處理的元素時，才需要自己手動補上這兩項功能。

### 聚焦樣式（focus styles）

可聚焦元素還有一個重要面向：聚焦樣式（focus styles）——通常是元素取得 focus 時，環繞在它周圍的外框（outline）或邊框（border）。很多人（也許包括過去的你）看它不順眼，會用類似下面的 CSS 一口氣把它清掉：

```css
/* 這些外框好醜！乾脆全部拿掉。 */
*:focus {
  outline: none;
  border: none;
}
```

**你絕對不該把聚焦樣式完全移除。** 你的選擇只有兩個：保留預設的聚焦樣式，或用你自己的樣式取代它。要換掉沒問題——例如給按鈕加上 `transform: scale()`、給連結加上一圈 outline、把輸入框的邊框加粗並提高不透明度——重點是換成另一套看得見的樣式，而不是讓它消失。

為什麼？因為完全移除聚焦樣式會讓鍵盤使用者幾乎無法操作頁面：他們失去了「目前 focus 在哪個元素」的視覺指示，只能靠自己默數按了幾次 Tab、還要猜哪些元素才真的可聚焦。想像你在用一個看不見游標的網站，也完全看不出游標何時停在連結或按鈕上——體驗糟透了。聚焦樣式對鍵盤使用者的意義，就等於游標對滑鼠使用者的意義。

### Tab 順序（tab order）

Tab 順序（tab order）是指按下 <kbd>Tab</kbd> 鍵時，頁面上各元素接收 focus 的先後次序。預設情況下，它跟元素在 HTML 檔中出現的順序一致：

```html
<!-- Tab 順序中的第一個 -->
<div tabindex="0">這是 HTML 裡列出的第一個元素。</div>

<!-- Tab 順序中的第二個 -->
<div tabindex="0">這是 HTML 裡列出的第二個元素。</div>
```

有時你會需要用 CSS（例如 `float` 或 `order` 屬性）改變元素的**視覺順序**，或用 `tabindex` 屬性改變元素本身的**Tab 順序**。不論用哪種方法，都要確保 Tab 順序與視覺順序一致。一旦兩者不同，使用者會依畫面排版預期某個元素接收 focus，實際上卻跳到別的元素，因而困惑或沮喪。

避免這個問題最簡單的方法，就是直接把元素在 HTML 檔裡按照你希望它們接收 focus 的順序排好。

### 隱藏內容（hidden content）

有時你會想先把某些內容藏起來，等特定事件才顯示——例如點按鈕才展開的選單，或彈出的 modal（互動視窗）。這種情況下，你不能只在「視覺上」把內容藏起來，還必須讓它對輔助科技同樣是隱藏的，直到該內容真的要顯示為止。

如果沒有正確地隱藏，鍵盤使用者會在內容還不該出現時就 Tab 進去，而且一進去，畫面上的 focus 指示就跟著不見了。使用者只是想正常地一路 Tab 過去，焦點指示卻突然消失在那塊「看不見的」內容裡，自然會困惑甚至挫折。

有一種做法是給隱藏內容裡的每個項目設 `tabindex="-1"`，這能阻止元素透過鍵盤取得 focus（但仍可用 JavaScript 的 `focus()` 方法主動聚焦）。不過這只解決了鍵盤使用者的問題，其他輔助科技依然讀得到、也可能唸出這些隱藏內容。

更好的做法，是給「隱藏內容的容器本身」加上 `display: none` 或 `visibility: hidden`，等到要顯示時再移除或覆寫這個屬性。這樣不只把選單項目移出 Tab 順序，也一併阻止輔助科技去宣讀它們——一次解決兩種使用者的問題。

## 程式碼範例

以下是一個「用 `<button>` 就自帶鍵盤支援」的完整最小範例，可直接存成 `.html` 開啟測試。用 <kbd>Tab</kbd> 聚焦到按鈕，按 <kbd>Enter</kbd> 或 <kbd>Space</kbd> 就會觸發，並看到自訂的聚焦樣式：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <style>
      /* 用自訂聚焦樣式「取代」預設外框，而不是移除它 */
      button:focus {
        outline: 3px solid #1a73e8; /* 清楚可見的聚焦外框 */
        outline-offset: 2px;
        transform: scale(1.05); /* 聚焦時稍微放大，強化提示 */
      }
    </style>
  </head>
  <body>
    <!-- <button> 預設就可聚焦、也有鍵盤事件處理 -->
    <button class="choice">石頭</button>
    <button class="choice">布</button>
    <button class="choice">剪刀</button>

    <script>
      // 只需處理 click；按 Enter/Space 時瀏覽器會自動觸發 click
      document.querySelectorAll(".choice").forEach((button) => {
        button.addEventListener("click", (e) => {
          alert(e.target.textContent);
        });
      });
    </script>
  </body>
</html>
```

對照前面的 `<div>` 版本，這裡少了一整段手動的 `keydown` 處理，也不必加 `tabindex`——這就是選對語意元素帶來的好處。

## 常見陷阱

!!! warning "不要用 `outline: none` 把聚焦樣式清光"
    看到 `*:focus { outline: none; }` 這種寫法要立刻警覺。它讓鍵盤使用者完全看不出目前 focus 在哪，等於奪走他們的「游標」。如果覺得預設外框醜，請「取代」而非「移除」：換成你自己的 outline、border 或 `transform` 都可以，但畫面上一定要有看得見的聚焦提示。

!!! warning "Tab 順序偏離視覺順序"
    用 CSS 的 `order`、`float`，或用正整數 `tabindex` 硬調順序時，很容易讓「畫面看到的順序」和「Tab 跳動的順序」對不上。最保險的做法是直接照期望的聚焦順序來排 HTML，別依賴 CSS 或 `tabindex` 事後補救。

!!! warning "隱藏內容只藏了一半"
    只用 `tabindex="-1"` 擋住鍵盤，或只在視覺上（例如把元素移出畫面）藏起來，都不夠——螢幕閱讀器等輔助科技仍會讀到並宣讀它。真正要隱藏時，請對容器使用 `display: none` 或 `visibility: hidden`，這樣才會同時移出 Tab 順序並停止被宣讀。

## 練習

1. 觀看 [What is Focus?](https://www.youtube.com/watch?v=EFv9ubbZLKw&list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g&index=3)，了解嘗試改變 Tab 順序時會出現哪些問題；接著觀看 [Controlling focus with tabindex](https://www.youtube.com/watch?v=Pe0Ce1WtnUM&list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g&index=4)，看看 `tabindex` 屬性如何影響 Tab 順序。
2. 閱讀 [Skip Links](https://webaim.org/techniques/skipnav/)（跳過連結）。這是另一種對鍵盤使用者友善的無障礙技巧，讓使用者能一鍵跳過重複的導覽區塊，對那些需要花較多力氣逐一 Tab 過整頁內容的人特別有幫助。

## 原文與延伸資源

- 原文：[Keyboard Navigation](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-keyboard-navigation)
- 本課引用：
  - [What is Focus?（影片）](https://www.youtube.com/watch?v=EFv9ubbZLKw&list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g&index=3)
  - [Controlling focus with tabindex（影片）](https://www.youtube.com/watch?v=Pe0Ce1WtnUM&list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g&index=4)
  - [WebAIM：Skip Navigation Links](https://webaim.org/techniques/skipnav/)

---

> 本講義改寫自 The Odin Project《Keyboard Navigation》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
