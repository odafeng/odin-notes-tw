---
title: 專案：Library 藏書
source_url: https://www.theodinproject.com/lessons/node-path-javascript-library
source_file: vendor/curriculum/javascript/organizing_your_javascript_code/project_library.md
path: full-stack-javascript
course: JavaScript
order: 4
status: draft
generated: 2026-07-03
---

# 專案：Library 藏書

> 改寫自 The Odin Project：[Project: Library](https://www.theodinproject.com/lessons/node-path-javascript-library)
> ｜Full Stack JavaScript › JavaScript › Organizing Your JavaScript Code

## 核心概念

這個專案要你把前一課的「Book」範例擴充成一個小型的藏書 app（Library）。使用者能夠新增書、把書從書櫃移除、切換每本書的「已讀 / 未讀」狀態，全部在瀏覽器裡用 JavaScript 完成，不需要後端伺服器。

它看起來只是一個小專案，但真正要練的是把「資料」和「畫面」分開思考，並實際運用幾個關鍵技巧。以下先把這些技巧的重點講清楚，你才能在動手時知道每一步為什麼這樣做。

### 一、用 constructor（建構式）與陣列儲存書本

每一本書都是一個 object（物件），有 title（書名）、author（作者）、pages（頁數）、read（是否已讀）等屬性。與其手動一個一個寫 object literal，我們用一個 constructor function（建構式函式）當作「樣板」，再用 `new` 產生實例（instance）。

所有書本 object 都存進一個陣列（例如 `myLibrary`）。這個陣列就是你的**單一資料來源（single source of truth）**：畫面上看到的一切，都是根據這個陣列渲染出來的。

重點是：**新增書的邏輯要獨立成一個函式，不要塞進 constructor 裡**。constructor 只負責「產生一本書」，「把書加進陣列」是另一件事，交給另一個函式（例如 `addBookToLibrary`）。這樣職責清楚，之後要改也好改。

### 二、用 `crypto.randomUUID()` 給每本書一個唯一 id

每本書都應該有一個獨一無二的 `id`。原文明確建議用瀏覽器內建的 `crypto.randomUUID()` 產生。它會回傳一組像 `"36b8f84d-df4e-4d49-b662-bbff17ff8e34"` 的 UUID 字串。

為什麼需要 id？因為當你把某本書從陣列刪掉、或重新排列時，如果只靠「陣列索引（index）」來對應畫面上的按鈕，索引會跟著跑掉、對錯本書。用穩定不變的 id 當識別碼，就能可靠地「這個刪除按鈕對應到哪一本書」。

### 三、資料與畫面分離（separation of concerns）

原文特別強調：**不要直接操作畫面上的元素來當作你的資料**。先把書存進陣列，再寫一個「渲染函式」讀取陣列、把每本書畫到頁面上（用 table 或一張張 card 都可以）。

這個分離很重要。當「顯示書本的邏輯」和「儲存書本資料的結構」是兩個獨立的東西時，你就能用同一份底層資料，以各種不同方式重新產生畫面。這會讓程式更好維護、更容易擴充。實務上常見的做法是：每次資料變動後，就「清空容器 → 依陣列重畫一次」。

### 四、用 `<dialog>` 與 `event.preventDefault()` 做新增表單

「New Book」按鈕會叫出一個表單，讓使用者填 author、title、pages、是否已讀等欄位。表單怎麼呈現由你決定——可以放在側欄，也可以用 HTML 的 `<dialog>` 標籤做成 modal（強調式對話框）。

`<dialog>` 的重點：
- `dialog.showModal()` 以 modal 方式開啟（會擋住背後其他操作，可用 `::backdrop` 樣式化背景遮罩）。
- `dialog.close()` 關閉；`<form method="dialog">` 送出時也會自動關閉對話框。
- modal 開著時按 Esc 會自動關閉。

而不管表單放哪，你幾乎一定會踩到一個坑：**按下送出後，頁面會整個重新載入，你寫的 JavaScript 好像沒作用**。原因是 `submit` 的**預設行為**是把表單資料送去伺服器並重整頁面。這時就要在 submit 事件裡呼叫 `event.preventDefault()`，取消這個預設行為，改由你的 JavaScript 接手處理資料。

### 五、用 data-attribute 把 DOM 元素連回書本 object

每本書的顯示上都要有「移除」按鈕。問題是：按鈕在 DOM 裡，書本 object 在陣列裡，怎麼對應？

最簡單的做法是給每個書本的 DOM 元素一個 [data-attribute](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Solve_HTML_problems/Use_data_attributes)（例如 `data-id`），值設成那本書的 `id`。點下按鈕時，讀出 `element.dataset.id`，就能回頭在陣列裡找到對應的書並刪除，然後重畫畫面。

### 六、用 prototype（原型）方法切換已讀狀態

每本書還要有一個按鈕，用來切換 `read` 狀態。原文建議：在 `Book` 的 prototype 上加一個方法（method），例如 `toggleRead`，讓每個 book 實例都能呼叫它來翻轉自己的 `read` 布林值。

把方法定義在 prototype 上（而不是每次在 constructor 裡重新建立一份），能讓所有實例共用同一個函式，更省記憶體，也是這一課想讓你練習的 prototype 觀念。

> 註：這個專案**不需要**做任何持久化儲存（persistent storage）。頁面重整後資料消失是沒關係的，之後的課程才會處理儲存。

## 程式碼範例

以下是一個最小、可執行的骨架，示範上面提到的技巧如何組合在一起。你可以直接貼進一個有 `<dialog>` 與容器的 HTML 頁面測試。

```javascript
// 單一資料來源：所有書都存在這個陣列
const myLibrary = [];

// constructor（建構式）：只負責產生一本書
function Book(title, author, pages, read) {
  this.id = crypto.randomUUID(); // 產生唯一 id，例如 "36b8f84d-..."
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

// 定義在 prototype 上的方法：切換已讀狀態，所有實例共用
Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

// 獨立的函式：接收參數、建立書、存進陣列（不要塞進 constructor）
function addBookToLibrary(title, author, pages, read) {
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
}

// 渲染函式：讀取陣列，把每本書畫到頁面上
const container = document.querySelector("#library");

function render() {
  container.textContent = ""; // 先清空，再依陣列重畫一次

  myLibrary.forEach((book) => {
    const card = document.createElement("div");
    card.dataset.id = book.id; // 用 data-attribute 連回書本 object

    card.innerHTML = `
      <h3>${book.title}</h3>
      <p>${book.author}／${book.pages} 頁</p>
      <p>${book.read ? "已讀" : "未讀"}</p>
    `;

    // 切換已讀
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "切換已讀";
    toggleBtn.addEventListener("click", () => {
      book.toggleRead();
      render(); // 資料變動後重畫
    });

    // 移除書本
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "移除";
    removeBtn.addEventListener("click", () => {
      const index = myLibrary.findIndex((b) => b.id === card.dataset.id);
      myLibrary.splice(index, 1);
      render();
    });

    card.append(toggleBtn, removeBtn);
    container.append(card);
  });
}

// 用 <dialog> 做新增表單，並用 preventDefault 阻止頁面重整
const dialog = document.querySelector("#book-dialog");
const form = document.querySelector("#book-form");

document.querySelector("#new-book").addEventListener("click", () => {
  dialog.showModal(); // 以 modal 方式開啟
});

form.addEventListener("submit", (event) => {
  event.preventDefault(); // 取消預設送出行為，避免頁面重新載入

  const data = new FormData(form);
  addBookToLibrary(
    data.get("title"),
    data.get("author"),
    Number(data.get("pages")),
    data.get("read") === "on" // checkbox 勾選時值為 "on"
  );

  form.reset();
  dialog.close();
  render();
});
```

對應的 HTML 骨架大致像這樣：

```html
<!-- 藏書容器 -->
<div id="library"></div>

<button id="new-book">New Book</button>

<!-- modal 表單 -->
<dialog id="book-dialog">
  <form id="book-form">
    <label>書名 <input name="title" required /></label>
    <label>作者 <input name="author" required /></label>
    <label>頁數 <input name="pages" type="number" /></label>
    <label>已讀 <input name="read" type="checkbox" /></label>
    <button type="submit">新增</button>
    <!-- type="button" 不會送出表單；用 onclick 找到最近的 <dialog> 並關閉它 -->
    <button type="button" onclick="this.closest('dialog').close()">取消</button>
  </form>
</dialog>
```

## 常見陷阱

!!! warning "表單一送出頁面就重整、JavaScript 好像沒作用"
    這是 `submit` 的預設行為：把資料送去伺服器並重整頁面。務必在 submit 事件的 callback 裡呼叫 `event.preventDefault()`，取消預設行為，改由你的 JavaScript 接手。

!!! warning "用陣列索引（index）當識別碼，刪除後對應錯本書"
    索引會在刪除、排序後跟著改變。請用 `crypto.randomUUID()` 產生穩定不變的 `id`，並透過 `data-id` 這類 data-attribute 把 DOM 元素連回正確的書本 object。

!!! warning "直接改畫面、不維護底層陣列"
    如果你直接操作 DOM 當資料、不更新 `myLibrary`，兩邊很快就會不同步。請把「資料」當成唯一真相，任何變動先改陣列，再重新渲染。

!!! warning "把新增書的邏輯寫進 constructor 裡"
    constructor 只該負責「產生一本書」。「把書 push 進陣列」是另一個獨立函式的責任，混在一起會讓職責不清、難以維護。

!!! warning "忘記 checkbox 沒勾選時不會出現在 FormData"
    用 `FormData` 讀 checkbox 時，勾選才會有值（通常是 `"on"`），沒勾則讀到 `null`。記得用 `data.get("read") === "on"` 之類的判斷轉成布林值。

## 練習

以下把原文的 Assignment 改寫成繁中步驟。**實際需求以原文專案說明為準**，這裡只是導引。

1. 若還沒做，先為專案建立 Git repository，放進基本的 HTML / CSS / JS 骨架檔案。之後都假設你已完成這步。
2. 所有 book object 都存在一個陣列裡。寫一個 book 的 constructor，並另外寫一個**獨立於 constructor 之外**的函式，接收參數、建立一本書、把它存進陣列。每本書都要有用 `crypto.randomUUID()` 產生的唯一 `id`。
3. 寫一個函式，走訪陣列並把每本書顯示在頁面上（table 或一張張 card 皆可）。可以先手動塞幾本書進陣列，方便觀察顯示效果。提醒：把「顯示邏輯」和「資料結構」當成兩件獨立的事來思考。
4. 加一顆「New Book」按鈕，叫出一個表單，讓使用者輸入書的資訊（作者、書名、頁數、是否已讀，以及任何你想加的欄位）並加入書櫃。表單怎麼呈現由你決定，可考慮用 `<dialog>` 做 modal。記得用 `event.preventDefault()` 處理送出後頁面重整的問題。
5. 在每本書的顯示上加一顆按鈕，可把該書從書櫃移除。用 data-attribute（對應書本的唯一 `id`）把 DOM 元素和書本 object 連起來。
6. 在每本書的顯示上加一顆按鈕，可切換其 `read` 狀態。建議在 `Book` 的 prototype 上定義一個切換 `read` 的方法。

> 這個專案不需要做任何持久化儲存，頁面重整後資料消失沒關係。完整需求與細節請見[原文專案說明](https://www.theodinproject.com/lessons/node-path-javascript-library)。

## 原文與延伸資源

- 原文：[Project: Library](https://www.theodinproject.com/lessons/node-path-javascript-library)
- 本課引用：
  - [MDN：`<dialog>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
  - [MDN：`Event.preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
  - [MDN：使用 data-attributes](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Solve_HTML_problems/Use_data_attributes)

---

> 本講義改寫自 The Odin Project《Project: Library》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
