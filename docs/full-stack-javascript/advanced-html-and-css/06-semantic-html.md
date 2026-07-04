---
title: 語意化 HTML
source_url: https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-semantic-html
source_file: vendor/curriculum/advanced_html_css/accessibility/semantic_html.md
path: full-stack-javascript
course: Advanced HTML and CSS
order: 6
generated: 2026-07-03
---

# 語意化 HTML

> 改寫自 The Odin Project：[Semantic HTML](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-semantic-html)
> ｜Full Stack JavaScript › Advanced HTML and CSS › Accessibility

## 核心概念

`<div>` 和 `<span>` 是最常被使用的兩個 HTML 元素，當作通用容器（generic container）確實方便：包版面、包一段文字都行。但方便不等於正確。從無障礙（accessibility，簡稱 a11y）的角度看，把所有東西都塞進 `<div>` 或 `<span>`，往往會讓輔助科技（assistive technology，例如螢幕閱讀器）的使用者難以感知、操作與理解你的頁面。這一課要談的，就是為什麼「語意化 HTML」（semantic HTML）對無障礙這麼重要，以及有哪些元素能幫你把頁面結構表達清楚。

### 什麼是「語意」與「情境」

要理解語意化，先分清楚兩個概念：語意（semantic meaning）與情境（context）。

- 有些元素**有語意，但不太提供情境**。例如 `<p>`（段落），螢幕閱讀器知道這是一段文字，但不會額外告訴使用者「這裡可以做什麼」。
- 有些元素**既有語意、又能連帶提供情境**，幫助使用者感知或操作它。例如 `<button>`，螢幕閱讀器不只會唸出文字內容，還會唸出它的角色（role）「按鈕」，讓使用者知道這是可以互動的。

而 `<div>` 和 `<span>` 屬於**語意中性**（semantically neutral）：它們本身沒有任何語意，也不會對輔助科技提供情境。這不代表你以後完全不能用它們，它們作為版面容器、或包住一般文字時仍然很有用。重點是：**當有更合適的語意元素可用時，就別再用 `<div>` 硬湊。**

### 一個真實的例子：可點擊的元素

回想你在 Foundations 階段可能做過的專案：剪刀石頭布、計算機、圈圈叉叉。這些都需要使用者「點擊某個東西」。如果你當時用 `<div>` 或 `<span>` 來當可點擊區域，對「看得到畫面」的使用者來說通常沒問題，因為只要它看起來像可以互動的東西，滑鼠點下去就有反應。

但對螢幕閱讀器使用者來說，情況完全不同。螢幕閱讀器只會唸出這些元素的文字內容（「石頭」「布」「剪刀」），使用者可能以為那只是頁面上的普通文字，就這樣略過了。因為**沒有任何情境告訴他們：這些東西是可以、而且應該去互動的。**

解法很簡單：改用語意化的 `<button>`。因為 `<button>` 有語意也帶情境，螢幕閱讀器會唸成「石頭，按鈕」，使用者立刻知道這能點。這個小改動不需要重寫邏輯，卻能讓一整群使用者真正用得上你的介面。

### 正確地使用語意化 HTML

用語意化 HTML 的核心思考是：**你希望使用者做什麼？你需要提供什麼情境給他們？** 以下幾點是往後開發時應該養成的檢查習慣：

- **可點擊就用 `<button>`**：只要某個東西是設計來讓使用者點擊的（不管它視覺上像不像傳統按鈕），通常都該用 `<button>`，讓使用者知道這裡可以點。
- **表格資料就用 `<table>`**：要呈現表格式（tabular）資料時，用 `<table>` 以及相關的 `<thead>`、`<tbody>`、`<tr>`、`<th>`、`<td>` 等元素。這能讓螢幕閱讀器使用者更容易在資料中導覽、理解每個儲存格對應的欄與列。
- **輸入欄位一定要配 `<label>`**：使用 `<input>` 時，務必建立它與 `<label>` 的關聯。`<label>` 會告訴輔助科技這個輸入框的意義，每次唸出輸入框時都會連帶唸出標籤內容。此外，正確的 `<label>` 會**擴大可點擊範圍**，對手部操作不便、難以點中小目標的使用者很有幫助。
- **選對 `input` 的 `type`**：永遠用最符合用途的 `type`。姓名或地址用 `type="text"`，電子郵件用 `type="email"`，電話用 `type="tel"`。在行動裝置上，正確的 `type` 會叫出對應的鍵盤——例如 `type="tel"` 會顯示較大的純數字鍵盤，讓使用者更好填寫。
- **清單就用清單元素**：要呈現清單時，使用合適的清單元素（有序清單 `<ol>`、無序清單 `<ul>`、或描述清單 `<dl>`）搭配對應的清單項目元素。這不只讓使用者知道自己「正進入或離開一份清單」，還能知道清單裡總共有幾個項目。

### 標題與地標

除了上面這些元素，頁面的整體結構也需要語意。這裡有兩個關鍵概念：標題（heading）與地標（landmark）。

**標題**指的是 `<h1>` 到 `<h6>` 這六個元素。如名稱所示，它們用來標示頁面各段落的標題，並帶有層級關係（`<h1>` 最高，`<h6>` 最低）。

**地標**則是用來標示頁面「區域」（region）的 HTML 元素。原生 HTML 有**七個**元素會定義地標區域，請記住這份清單：

- `<aside>`（側欄，放與主內容相關但可獨立的補充內容）
- `<footer>`（頁尾）
- `<form>`（表單）
- `<header>`（頁首）
- `<main>`（主要內容，一個頁面通常只有一個）
- `<nav>`（導覽區）
- `<section>`（通用區段）

正確使用地標與標題，能讓輔助科技的使用者得到一個更「可操作、可理解」的頁面。螢幕閱讀器使用者可以用鍵盤導覽指令（或打開螢幕閱讀器的選單），直接在各個地標與標題之間跳轉，而這些元素也會唸出自己的角色，提供額外情境。

反過來說，如果你只用 `<div>` 來充當這些地標與標題，再靠 CSS 把它們「看起來」像頁首、側欄、標題，那麼螢幕閱讀器使用者就得從頭到尾把整個頁面聽過一遍，才能找到某個特定段落，而且他們根本無法分辨畫面上哪個是標題、哪個是地標。語意，正是那條讓使用者快速定位的捷徑。

## 程式碼範例

以下把「不友善」與「友善」兩種寫法對照呈現，並示範標題、地標與表單的正確用法。

可點擊區域：`<div>` 版 vs `<button>` 版。

```html
<!-- 不友善：螢幕閱讀器只會唸出「石頭」，使用者不知道這能點 -->
<div class="button-container">
  <div class="rock">石頭</div>
  <div class="paper">布</div>
  <div class="scissors">剪刀</div>
</div>

<!-- 友善：螢幕閱讀器會唸「石頭，按鈕」，情境明確 -->
<div class="button-container">
  <button class="rock">石頭</button>
  <button class="paper">布</button>
  <button class="scissors">剪刀</button>
</div>
```

輸入框與 `<label>` 的兩種關聯寫法。

```html
<!-- 寫法一：用 for 對應 id（當 input 本身需要一個 id 時很方便） -->
<label for="name">姓名</label>
<input type="text" id="name" />

<!-- 寫法二：把 input 直接包在 label 裡（不需要 id） -->
<label>
  姓名
  <input type="text" />
</label>

<!-- 依用途選對 type：行動裝置會叫出對應鍵盤 -->
<label for="email">電子郵件</label>
<input type="email" id="email" />

<label for="phone">電話</label>
<input type="tel" id="phone" />
```

用標題與七個地標搭出一個有語意的頁面骨架。

```html
<body>
  <header>
    <!-- 頁首：放網站標題、logo 等 -->
    <h1>我的部落格</h1>
    <nav>
      <!-- 導覽地標 -->
      <ul>
        <li><a href="/">首頁</a></li>
        <li><a href="/about">關於</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <!-- 主要內容，一頁通常只有一個 main -->
    <section>
      <h2>最新文章</h2>
      <article>
        <h3>語意化 HTML 入門</h3>
        <p>這是文章內容……</p>
      </article>
    </section>

    <aside>
      <!-- 側欄：與主內容相關的補充資訊 -->
      <h2>關於作者</h2>
      <p>補充說明……</p>
    </aside>
  </main>

  <footer>
    <!-- 頁尾 -->
    <p>© 2026 我的部落格</p>
  </footer>
</body>
```

表格資料用 `<table>`，讓螢幕閱讀器能唸出欄列關係。

```html
<table>
  <caption>本週銷售</caption>
  <thead>
    <tr>
      <th scope="col">星期</th>
      <th scope="col">銷售額</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">週一</th>
      <td>1200</td>
    </tr>
    <tr>
      <th scope="row">週二</th>
      <td>980</td>
    </tr>
  </tbody>
</table>
```

## 常見陷阱

!!! warning "用 `<div onclick>` 假裝按鈕"
    在 `<div>` 上綁 `onclick` 事件，看起來能點，但它沒有按鈕的角色、無法用 Tab 聚焦、也無法用 Enter 或空白鍵觸發，鍵盤與螢幕閱讀器使用者等於被排除在外。真的需要按鈕就用 `<button>`；若語意上是連結（跳到別的頁面）就用 `<a>`。

!!! warning "輸入框沒有關聯的 `<label>`"
    只放一個 `<input>`、旁邊擺段純文字當說明，螢幕閱讀器不會把兩者連在一起。務必用 `for`／`id` 對應，或把 `<input>` 包進 `<label>`。順帶一提，正確的 `<label>` 還會擴大可點擊範圍，對所有人都更好用。

!!! warning "用 `<div>` 加 CSS 假裝標題與地標"
    把 `<div class="heading">` 放大字體當標題，或用 `<div class="header">` 當頁首，畫面上看起來對，但螢幕閱讀器完全讀不到這是標題或地標，使用者無法用導覽指令快速跳轉。標題就用 `<h1>`–`<h6>`，區域就用那七個地標元素。

!!! warning "頁面出現多個 `<main>` 或標題層級亂跳"
    一個頁面原則上只該有一個 `<main>`。標題層級也應該有邏輯，不要為了視覺大小而從 `<h1>` 直接跳到 `<h4>`；層級是螢幕閱讀器使用者建立頁面大綱的依據。

## 練習

以下練習改寫自原課程 Assignment，動手體驗才最有感。

1. **實際打開一款螢幕閱讀器來用用看。** 理解螢幕閱讀器運作方式的最好方法，就是親自操作。花點時間找對應的指南、隨意玩玩看；往後學到更多無障礙概念時，親身體驗會非常有價值，甚至可能改變你寫網站的方式。可依你的作業系統選擇：
   - Windows（含 WSL2 使用者）：可免費安裝 NVDA。
   - macOS：內建 VoiceOver。
   - Linux：內建 Orca。
   - ChromeOS：內建 ChromeVox。
2. **閱讀螢幕閱讀器如何導覽資料表格的說明文章**，體會一個正確的 `<table>` 元素能提供多少情境。
3. **觀看「無障礙表格介紹與螢幕閱讀器示範」影片**，聽聽螢幕閱讀器實際上是怎麼唸出一個表格的。
4. **觀看「為什麼標題與地標這麼重要」影片**，看螢幕閱讀器如何與標題、地標元素互動。

延伸：TOP 本課沒有獨立 project，但你可以回頭檢視自己過去做過的專案（剪刀石頭布、計算機等），把裡面的 `<div>` 可點擊區改成 `<button>`，並補上 `<header>`／`<main>`／`<footer>` 等地標，親手做一次「語意化重構」。若要看原文完整資源，請參考下方連結。

## 原文與延伸資源

- 原文：[Semantic HTML](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-semantic-html)
- 本課引用：
  - 螢幕閱讀器：NVDA（Windows）、VoiceOver（macOS）、Orca（Linux）、ChromeVox（ChromeOS）
  - 文章：How screen readers navigate data tables（tink.uk）
  - 影片：Introduction to accessible tables and a screen reader demo
  - 影片：Why headings and landmarks are so important

---

> 本講義改寫自 The Odin Project《Semantic HTML》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
