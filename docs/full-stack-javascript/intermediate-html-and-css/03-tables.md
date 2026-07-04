---
title: 表格（Tables）
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-tables
source_file: vendor/curriculum/intermediate_html_css/intermediate_html_concepts/tables.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 3
generated: 2026-07-03
---

# 表格（Tables）

> 改寫自 The Odin Project：[Tables](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-tables)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Intermediate HTML Concepts

## 核心概念

### 什麼是表格

HTML 的 table（表格）用來呈現**二維的表格式資料**（tabular data），也就是那種「一格一格、有行有列、彼此互相對應」的資料。典型例子像是課表、財務報表、球員數據、產品規格比較表。判斷一份資料該不該用表格，有個簡單的檢驗法：如果你想描述某一格的意義，需要**同時參照它的列標題與欄標題**（例如「星期三的第二節課」「Chris 的年齡」），那它就是表格式資料，適合用 table。

要注意，表格在整個 HTML 世界裡其實不算高頻元素，你之前學的 button、link、list 用得更多。但遇到「就是表格式資料」的場合，table 是**無可取代**的正確工具。基本的表格很好上手，只有一些進階功能（跨欄跨列、複雜標題）設定起來比較需要小心。

### 表格的基本骨架：table / tr / td / th

表格由三層元素堆疊出來：

- `<table>`：整個表格的容器，所有內容都放在裡面。
- `<tr>`（table row，表格列）：一「橫排」。表格是一列一列（一個 `<tr>` 接一個 `<tr>`）由上往下疊出來的，**沒有專門代表「欄」的元素**，欄是由每一列裡儲存格的先後順序「對齊」而自然形成的。
- `<td>`（table data，資料儲存格）：一格普通的資料。
- `<th>`（table header，標題儲存格）：一格**標題**，用來標示某一欄或某一列的意義。

一個最小的例子：第一列放兩個標題儲存格，第二列放兩個資料儲存格，兩列各兩格，就構成一個 2×2 的表格。

`<th>` 和 `<td>` 的差別**不只是外觀**（瀏覽器預設會把 `<th>` 顯示成粗體、置中）。更關鍵的是**語意**：`<th>` 告訴瀏覽器與螢幕報讀器（screen reader）「這一格是標題」，讓輔助科技能把標題和對應的資料連起來報讀。所以標題一定要用 `<th>`，不要偷懶用加粗的 `<td>`。

### 為什麼不能用表格做版面排版

在 CSS 還不成熟的年代，開發者曾大量用 table 來「排版面」（把頁面切成一格一格擺放內容）。**現在絕對不要這樣做**，理由有三：

1. **無障礙（accessibility）**：螢幕報讀器會把 table 標籤當成表格式資料來解讀，用它排版面會讓視障使用者收到大量混亂、無意義的「表格」提示。
2. **標記難維護**：排版用的表格會產生層層巢狀的「標籤湯」（tag soup），比用語意化容器更難寫、更難讀、更難改。
3. **響應式（responsive）困難**：table 的寬度預設由內容撐開，而 `<div>`、`<section>` 這類版面容器預設佔滿 100% 寬度，配合現代 CSS（Flexbox、Grid）能輕鬆做出隨螢幕縮放的版面。

一句話：**table 只拿來裝表格式資料，版面交給 CSS。**

### 跨欄與跨列：colspan 與 rowspan

真實表格常有一格要橫跨好幾欄、或縱跨好幾列的情況（例如一個大標題蓋住底下三個小欄）。用這兩個屬性：

- `colspan="n"`：讓這一格向右**橫跨 n 欄**。
- `rowspan="n"`：讓這一格向下**縱跨 n 列**。

兩者的值都是**不帶單位的數字**，代表跨越幾格。跨列時要特別注意：被 `rowspan` 佔用的下方列，撰寫該列的 `<tr>` 時，那個位置**不用**再寫儲存格（上一格已經幫它「佔位」了），否則會多出一格導致表格錯位。

### 分組欄位以套用樣式：colgroup 與 col

前面說過表格沒有代表「欄」的元素，所以想一次替整欄設定樣式（例如某一欄底色不同）並不直觀。`<colgroup>` 與 `<col>` 就是為此而生：

- `<colgroup>`：放在 `<table>` 開始標籤的正下方，作為欄定義的容器。
- `<col>`：代表一或多欄；用 `span="n"` 屬性表示這個 `<col>` 涵蓋 n 欄（預設 1）。可以掛 `class` 或 `style` 來用 CSS 指定樣式。`<col>` 是**由左到右**依序對應表格的欄。

不過有個限制：能套在 `<col>` 上的 CSS 屬性其實**很有限**（常用的是 `background`、`width`、`border` 等少數幾個），像文字顏色這種就不吃。

### 進階結構：caption 與 thead / tbody / tfoot

要把表格寫得完整、好用、無障礙，還有幾個元素：

- `<caption>`：表格的**標題／說明文字**，放在 `<table>` 開始標籤的正下方。螢幕報讀器會**先讀 caption**，讓使用者一聽就知道這張表在講什麼、要不要細聽內容。
- `<thead>`（表頭）、`<tbody>`（表身）、`<tfoot>`（表尾）：把表格在語意上分成三段。書寫順序固定為 `<thead>` → `<tbody>` → `<tfoot>`。這樣分組不但方便用 CSS 分別設定樣式，列印長表格時瀏覽器還能在每頁重複表頭，`<tfoot>`（例如放總計列）也不會被夾在資料中間。

### scope 屬性：把標題和資料綁起來

對複雜一點的表格（同時有欄標題又有列標題），光靠 `<th>` 還不足以讓螢幕報讀器判斷「這個標題是管一整欄還是一整列」。`scope` 屬性就是明確告訴它方向：

- `scope="col"`：這個 `<th>` 是**某一欄**的標題。
- `scope="row"`：這個 `<th>` 是**某一列**的標題。
- `scope="colgroup"`：這個 `<th>` 是**跨多欄**（通常搭配 `colspan`）的群組標題。
- `scope="rowgroup"`：這個 `<th>` 是**跨多列**（通常搭配 `rowspan`）的群組標題。

加上 `scope` 後，視障使用者可以「一次讀完一整列或一整欄」而不必自己逐格拼湊對應關係，體驗好很多。

### id 與 headers 屬性：最精準的關聯

對於標題層層疊疊的超複雜表格，`scope` 有時仍不夠精準。這時可用 `id` 加 `headers` 建立**明確的一對一關聯**：

1. 替每個 `<th>` 加上獨一無二的 `id`。
2. 每個資料格 `<td>` 用 `headers` 屬性，列出所有管到它的標題 `id`，以**空白分隔**（順序不拘）。

這樣螢幕報讀器就能精準地把每一格資料連到它所有的標題。代價是標記變得冗長、難維護，所以**多數表格用 `scope` 就夠了**，只有真正複雜的表格才需要動用 `id`／`headers`。

## 程式碼範例

一個涵蓋 caption、thead/tbody/tfoot、scope、colspan/rowspan 的完整範例：

```html
<!-- 一份記帳表：跨欄標題 + 列標題 + 總計列 -->
<table>
  <!-- caption 會被螢幕報讀器最先讀出 -->
  <caption>三月開銷紀錄</caption>

  <thead>
    <tr>
      <!-- 空白角落格，用 <td> 佔位 -->
      <td></td>
      <!-- 這個標題橫跨底下三欄，用 colgroup 表示群組 -->
      <th colspan="3" scope="colgroup">項目明細</th>
    </tr>
    <tr>
      <td></td>
      <th scope="col">品項</th>
      <th scope="col">地點</th>
      <th scope="col">金額</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <!-- 這個列標題縱跨兩列 -->
      <th rowspan="2" scope="rowgroup">生活</th>
      <th scope="row">剪髮</th>
      <td>髮廊</td>
      <td>500</td>
    </tr>
    <tr>
      <!-- 上一列的「生活」已用 rowspan 佔位，這裡不再重寫該格 -->
      <th scope="row">午餐</th>
      <td>便當店</td>
      <td>90</td>
    </tr>
  </tbody>

  <tfoot>
    <tr>
      <!-- 總計列：前三格併成一格 -->
      <th colspan="3" scope="row">總計</th>
      <td>590</td>
    </tr>
  </tfoot>
</table>
```

搭配 `colgroup`／`col` 替整欄上底色：

```html
<table>
  <!-- colgroup 緊接在 table 之後 -->
  <colgroup>
    <col />                       <!-- 第 1 欄，維持預設 -->
    <col class="highlight" />      <!-- 第 2 欄，套用 highlight 樣式 -->
    <col span="2" />              <!-- 第 3、4 欄 -->
  </colgroup>
  <tr>
    <th>週次</th>
    <th>主題</th>
    <th>作業</th>
    <th>測驗</th>
  </tr>
  <!-- ...其餘列... -->
</table>
```

```css
/* col 只吃少數屬性，background 是其中之一 */
.highlight {
  background-color: #fff3cd;
}
```

## 常見陷阱

!!! warning "用表格排版面"
    table 只給表格式資料用。拿它切版面會傷害無障礙（螢幕報讀器會亂讀）、讓標記變成難維護的標籤湯，且難以做響應式。版面請交給 CSS 的 Flexbox 與 Grid。

!!! warning "rowspan 之後忘記少寫一格"
    當某格用了 `rowspan="2"` 縱跨到下一列，撰寫下一列的 `<tr>` 時，那個被佔用的位置**不要**再寫儲存格。多寫一格會讓整列往右推、表格錯位。`colspan` 同理，被併掉的欄位也不要重複寫。

!!! warning "用加粗的 td 假裝標題"
    把 `<td>` 用 CSS 加粗看起來像標題，語意上仍是普通資料格。螢幕報讀器不會把它當標題，也無法和資料建立關聯。標題一定要用 `<th>`，並視情況加上 `scope`。

!!! warning "以為 col 能套所有 CSS"
    `<col>` 只能吃很有限的幾個 CSS 屬性（如 `background`、`width`、`border`）。想替整欄改文字顏色之類的效果，`<col>` 是做不到的，得改用其他方式（例如替該欄每一格加 class）。

## 練習

以下把原文 Assignment 改寫成繁中步驟。重點是**邊讀邊動手打程式碼**，光看不練學不起來。

1. 閱讀 MDN 的 [Tables Basics](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics) 與 [Tables Advanced](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Advanced) 兩篇教學，把表格的所有語法看過一遍。內容不難，務必**跟著範例動手 code along**。
2. 完成 MDN 的實作評量 [Structuring planet data](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Structuring_planet_data)（行星資料表）。這個 project 的完整步驟與提供的素材請直接依 MDN 原文操作，把剛學到的 caption、thead/tbody、scope、colspan/rowspan 全部練一遍。

完成後，試著不看資料回答本課的 Knowledge check：什麼是表格？為什麼不該用表格排版面？`<caption>` 有什麼用？`scope` 屬性是什麼？

## 原文與延伸資源

- 原文：[Tables](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-tables)
- 本課引用：
  - MDN：[HTML table basics](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics)
  - MDN：[HTML table advanced features and accessibility](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Advanced)
  - MDN 實作：[Structuring planet data](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Structuring_planet_data)

---

> 本講義改寫自 The Odin Project《Tables》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
