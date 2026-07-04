---
title: 專案：待辦清單
source_url: https://www.theodinproject.com/lessons/node-path-javascript-todo-list
source_file: vendor/curriculum/javascript/organizing_your_javascript_code/project_todo_list.md
path: full-stack-javascript
course: JavaScript
order: 15
generated: 2026-07-03
---

# 專案：待辦清單

> 改寫自 The Odin Project：[Project: Todo List](https://www.theodinproject.com/lessons/node-path-javascript-todo-list)
> ｜Full Stack JavaScript › JavaScript › Organizing Your JavaScript Code

## 核心概念

待辦清單（todo list）是前端教學的經典題目，實作可以很陽春，但也留了大量可以精進與擴充的空間。這一課不是要教你新語法，而是要你把先前累積的技巧一次整合：用 factory function（工廠函式）或 class（類別）動態產生物件、用 ES6 module（模組）拆分職責、用 webpack 打包、從 npm 引入第三方套件，最後再用 Web Storage API 把資料存進瀏覽器。動手之前，先花點時間規劃專案要怎麼組織。

### 這個專案要練什麼

這是一堂 project（專案）課，重點在把散落的技巧串成一個能動的應用。你會用到的核心技巧有：

- **動態產生物件**：每一筆 todo 都是一個物件，需要能重複、動態地生出來。用 factory function 或 constructor / class 皆可。
- **關注點分離（separation of concerns）**：把「應用邏輯」（建立 todo、標記完成、改優先級）和「DOM 操作」（畫出畫面、綁定按鈕）拆到不同 module。這是這一課最想磨練的能力。
- **模組化打包**：用 ES6 module 匯出 / 匯入，再交給 webpack 打包成一支可在瀏覽器執行的 bundle。
- **善用套件生態系**：既然已經在用 webpack，從 npm 裝套件輕而易舉，例如處理日期的 date-fns。
- **資料持久化（persistence）**：用 localStorage 把資料留在使用者的瀏覽器，重新整理也不會消失。

### 資料模型：todo 與 project

先想清楚資料長什麼樣，UI 才有東西可畫。原文要求的最小資料模型是兩層：

- **todo（單筆待辦）**：至少要有 `title`（標題）、`description`（描述）、`dueDate`（到期日）、`priority`（優先級）。可以再加 `notes`（備註）甚至 `checklist`（子項清單）。
- **project（專案 / 清單）**：一個 project 是一組 todo 的集合。App 一開啟就要有一個「預設 project」，讓所有 todo 有地方可放；使用者也要能新增 project，並選擇 todo 要放進哪一個 project。

用 factory function 來生產這兩種物件，是把「怎麼建立資料」集中管理的直覺做法：呼叫函式、傳入參數、回傳一個乾淨的物件，不必到處手寫物件字面值。

### 關注點分離：邏輯 module 與 DOM module

把「資料怎麼變」和「畫面怎麼畫」分開，是這個專案的靈魂。實務上會分成幾個 module：

- **邏輯 module**：管理 project 與 todo 的陣列，提供 `addTodo`、`toggleComplete`、`changePriority`、`deleteTodo` 等函式。這一層完全不碰 DOM，純粹操作資料。
- **DOM module**：負責讀取邏輯層的資料，把它渲染成畫面，並監聽使用者的點擊、輸入等事件，再回頭呼叫邏輯層的函式。

這樣切開的好處是：日後要換 UI（例如從純 DOM 換成框架），邏輯層原封不動；要改資料結構，畫面層也不必大改。兩邊透過清楚的函式介面溝通，而不是彼此糾纏。

### 持久化：Web Storage API

到目前為止我們還沒學過把資料存起來的技術，所以使用者一重新整理，todo 全部消失。解法是 [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API) 裡的 `localStorage`，它能把資料存在使用者的電腦上，缺點是資料只綁在「這台電腦的這個瀏覽器」，換裝置就讀不到，但對這個專案已經很夠用。

`localStorage` 常用的方法有四個：`setItem(key, value)` 寫入、`getItem(key)` 讀取、`removeItem(key)` 刪除單筆、`clear()` 清空。你要做的是：每當建立新的 project 或 todo，就存一份到 localStorage；App 首次載入時，就去 localStorage 找看看有沒有存過的資料，有就還原。

這裡有三個一定要注意的坑：

1. **只能存字串**：`localStorage` 只接受字串。要存物件或陣列，必須先用 `JSON.stringify` 轉成 JSON 字串，讀回來再用 `JSON.parse` 轉回物件。
2. **資料可能不存在**：第一次開 App 時 localStorage 是空的，`getItem` 會回傳 `null`。程式碼要能優雅地處理「沒有資料」的情況，不能直接崩潰。
3. **JSON 存不了函式**：這是最容易被絆倒的地方。`JSON.stringify` 只會保留純資料（物件、陣列、數字、字串、布林、`null`），函式和方法會被丟掉；`JSON.parse` 回來的是一個「只有資料、沒有方法」的 plain object（普通物件），原本的 prototype（原型）也不見了。所以若你的 todo 物件身上掛了方法，讀回來之後得想辦法把方法「重新裝回去」——例如把讀回來的純資料再丟進 factory function 重建成完整物件。

你也可以用 DevTools 檢查存了什麼：打開 `Application` 分頁，在 `Storage` 底下點 `Local Storage`，每次程式增刪改 localStorage，這裡都會即時反映。

## 程式碼範例

以下用最小可執行的片段示範這個專案的三根支柱：factory function 生產物件、邏輯與 DOM 分離、以及 localStorage 的存讀（含「方法重建」的處理）。

**用 factory function 產生 todo 與 project（`todo.js`）：**

```javascript
// todo.js —— 純資料邏輯，完全不碰 DOM

// 產生一筆 todo；toggle 是掛在物件上的 method
export function createTodo(title, description, dueDate, priority) {
  return {
    title,
    description,
    dueDate,
    priority,
    completed: false,
    toggleComplete() {
      this.completed = !this.completed;
    },
  };
}

// 產生一個 project，內含一組 todo
export function createProject(name) {
  return {
    name,
    todos: [],
    addTodo(todo) {
      this.todos.push(todo);
    },
    removeTodo(index) {
      this.todos.splice(index, 1);
    },
  };
}
```

**DOM module 只負責畫面與事件（`dom.js`）：**

```javascript
// dom.js —— 讀邏輯層資料、畫成畫面、監聽事件

export function renderProject(project, container) {
  container.textContent = ""; // 先清空，避免重複渲染

  project.todos.forEach((todo, index) => {
    const item = document.createElement("li");
    item.textContent = `${todo.title}（到期：${todo.dueDate}）`;
    // 用 priority 決定顏色，讓高優先級一眼可辨
    item.style.color = todo.priority === "high" ? "crimson" : "black";
    if (todo.completed) item.style.textDecoration = "line-through";
    item.dataset.index = index;
    container.appendChild(item);
  });
}
```

**用 localStorage 持久化，並在讀回時「重建方法」（`storage.js`）：**

```javascript
// storage.js —— 只做存與讀，用 JSON 轉換字串
import { createProject, createTodo } from "./todo.js";

const KEY = "todo-app-projects";

// 存：物件陣列 → JSON 字串
export function saveProjects(projects) {
  localStorage.setItem(KEY, JSON.stringify(projects));
}

// 讀：JSON 字串 → 物件；資料不存在時回傳空陣列，避免崩潰
export function loadProjects() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return []; // 第一次開啟，localStorage 是空的

  const plain = JSON.parse(raw); // 這裡拿到的是「沒有 method」的純資料

  // 把純資料重新丟進 factory，把 toggleComplete / addTodo 等方法裝回去
  return plain.map((p) => {
    const project = createProject(p.name);
    p.todos.forEach((t) => {
      const todo = createTodo(t.title, t.description, t.dueDate, t.priority);
      todo.completed = t.completed;
      project.addTodo(todo);
    });
    return project;
  });
}
```

這三支檔案各司其職：`todo.js` 只管資料、`dom.js` 只管畫面、`storage.js` 只管存讀。再用一支 `index.js` 把它們 `import` 進來串起來，交給 webpack 打包即可。

## 常見陷阱

!!! warning "把物件直接丟進 localStorage"
    `localStorage.setItem("data", someObject)` 不會報錯，但它會把物件強制轉成字串 `"[object Object]"`，你的資料就這樣沒了。任何物件或陣列都要先 `JSON.stringify` 再存，讀回來要 `JSON.parse`。

!!! warning "讀回來的物件方法全部消失"
    `JSON.parse` 只還原資料，不還原方法與 prototype。如果 todo 身上有 `toggleComplete()` 之類的方法，讀回來直接呼叫會得到 `undefined is not a function`。解法是把讀回的純資料再送進 factory function（或 class constructor）重建成完整物件。

!!! warning "沒處理 localStorage 為空的情況"
    App 第一次載入時 `getItem` 回傳 `null`，若不檢查就直接 `JSON.parse(null)` 會得到 `null`，接著對它做 `.map` 或 `.forEach` 就會整個崩潰。務必先判斷資料是否存在，沒有就給一個合理的預設值（例如空陣列或一個預設 project）。

!!! warning "邏輯與 DOM 混在一起"
    把建立 todo、標記完成的邏輯直接寫在事件處理函式裡、和 `document.createElement` 攪在一塊，短期看似方便，長期會讓程式難以測試與維護。堅持把資料邏輯與 DOM 操作拆進不同 module，是這一課刻意要你練的功。

## 練習

跟著下面的步驟把待辦清單做出來。詳細需求以原文為準，這裡是繁中版的行動綱要：

1. **決定 todo 的產生方式**：todo 是要「動態建立」的物件，選擇用 factory function 或 constructor / class 來量產。
2. **腦力激盪 todo 的屬性**：至少要有 `title`、`description`、`dueDate`、`priority`；可以再加 `notes` 或 `checklist`。
3. **設計 project 結構**：待辦清單要支援多個 project（各自獨立的 todo 清單）。App 一開啟就要有一個預設 project 收納所有 todo；使用者要能新增 project，並選擇 todo 放進哪個 project。
4. **分離關注點**：把應用邏輯（建立 todo、標記完成、改優先級等）和 DOM 相關的程式拆到不同 module。
5. **打造 UI**：外觀自由發揮，但至少要能：檢視所有 project；檢視每個 project 裡的所有 todo（大概顯示標題與到期日，可用顏色區分優先級）；展開單一 todo 檢視或編輯細節；刪除 todo。
6. **找靈感**：可以參考 [Todoist](https://en.todoist.com/)、[Things](https://culturedcode.com/things/)、[any.do](https://www.any.do/) 這些成熟的 todo App（看截圖、看介紹影片）。
7. **引入 date-fns**：既然在用 webpack，從 npm 裝套件很輕鬆。可以考慮用 [date-fns](https://github.com/date-fns/date-fns) 來格式化與操作日期時間。
8. **加上持久化**：用 Web Storage API（`localStorage`）在每次建立 project 或 todo 時存檔，並在 App 載入時讀回。注意三件事：資料不存在時不能崩潰；可用 DevTools 的 `Application › Local Storage` 檢查；localStorage 用 JSON 傳輸與儲存，而 JSON 存不了函式，所以讀回資料後要想辦法把方法裝回物件上。

完整的專案需求、UI 細項與提示，請對照原文的 Assignment 章節。

## 原文與延伸資源

- 原文：[Project: Todo List](https://www.theodinproject.com/lessons/node-path-javascript-todo-list)
- 本課引用：
  - MDN：[Using the Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
  - MDN：[JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
  - npm 套件：[date-fns](https://github.com/date-fns/date-fns)

---

> 本講義改寫自 The Odin Project《Project: Todo List》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
