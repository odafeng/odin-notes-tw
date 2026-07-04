---
title: React 元件（Components）
source_url: https://www.theodinproject.com/lessons/node-path-react-new-react-components
source_file: vendor/curriculum/react/getting_started_with_react/react_components.md
path: full-stack-javascript
course: React
order: 4
generated: 2026-07-03
---

# React 元件（Components）

> 改寫自 The Odin Project：[React Components](https://www.theodinproject.com/lessons/node-path-react-new-react-components)
> ｜Full Stack JavaScript › React › Getting Started With React

## 核心概念

### 什麼是 component（元件）？

React 最迷人的地方，在於它讓你把一個 UI（User Interface，使用者介面）拆解成一塊塊**獨立、可重複使用**的積木，這些積木就叫做 component（元件）。與其把整個頁面寫成一大坨難以維護的程式碼，你可以把畫面切分成一個個有明確職責的小單位，再像堆積木一樣把它們組合起來。

想像一個很基本的網頁應用程式，可以拆成這些 component：

- `App`：代表你的主應用程式，是其他所有 component 的父層（parent）。
- `Navbar`：頁面上方的導覽列。
- `MainArticle`：負責 render（渲染）主要內容的 component。
- `NewsletterForm`：一個表單，讓使用者輸入 email 以訂閱每週電子報。

這樣拆分帶來幾個好處。第一是**可重複使用**：一個按鈕 component 寫好之後，整個專案到處都能用，不必複製貼上。第二是**職責分離**：每個 component 只管好自己那一小塊畫面與邏輯，出問題時你很快就能定位是哪一塊壞了。第三是**易於協作**：不同的人可以各自負責不同 component，互不干擾。

最關鍵的心智模型是：**把 component 想成一個 JavaScript 函式（function）**。它可以接收某種輸入，然後回傳（return）一個 React element（元素）——也就是一段描述「畫面長什麼樣子」的資料。React 拿到這些 element 之後，才負責把它們真正畫到瀏覽器的畫面上。

### 什麼是 functional component（函式元件）？

現代 React 主要使用 functional component（函式元件），顧名思義，它**就是一個 JavaScript 函式**。來看一個最小的例子：

```jsx
function Greeting() {
  return <h1>我以我漂亮的花帽發誓，我一定會終結你。</h1>;
}
```

這段程式碼大部分你應該都認得：它是一個普通的 JavaScript 函式，只不過它 `return` 的不是字串或數字，而是一段看起來像 HTML 的東西。

補充一點背景：早期的 React 還有另一種寫法叫 class component（類別元件），用 ES6 的 `class` 語法來定義。但自從 React 推出 hook 之後，functional component 搭配 hook 已經成為官方推薦的主流寫法，幾乎能做到 class component 的所有事情，而且更簡潔好讀。因此本課程一律使用 functional component，你日後看到的新專案也絕大多數是這種寫法。

### 這段 HTML 為什麼會出現在 JavaScript 裡？

那不是 HTML，而是 **JSX**。JSX 是 React 提供的語法糖，讓你可以直接在 JavaScript 裡寫出類似 HTML 的標記，描述 component 要 render 的畫面。第一次看到會覺得很突兀，但很快你就會發現它有多方便——把「畫面結構」和「這塊畫面的邏輯」放在同一個地方，讀起來反而更直覺。JSX 的細節會在後面的課程深入介紹，這裡你只要知道：函式 `return` 出來的 JSX，就是這個 component 要呈現的內容；你在 JSX 裡寫下的每個標籤（例如 `<h1>...</h1>`）都會對應成一個 React element，所以 React element 在程式碼裡看起來就像一段 HTML 標記。

### 一條不能忘的規則：component 名稱必須大寫

寫好你自己的 component 之後，先檢查一件事：**函式的名字有沒有大寫開頭？**

這是初學者最容易踩的雷。**React component 的名稱一定要大寫開頭**，否則它不會如你預期地運作。上面的例子把函式命名為 `Greeting`（大寫 G）就是這個原因。

為什麼？因為當 JSX 被解析時，React 靠**開頭字母的大小寫**來分辨你寫的是「原生 HTML 標籤」還是「你自訂的 React component」：

- `<greeting />`（小寫）會被當成一個普通的、沒有特殊意義的 HTML 元素。
- `<Greeting />`（大寫）才會被 React 認出是你自訂的 component 實例（instance）。

所以只要名稱沒大寫，React 就會把它誤認成 HTML 標籤，畫面自然出不來。

### 把 component 組合起來：component tree（元件樹）

單一個 component 很少會孤零零地存在。React app 的真正威力，來自於**把 component 像積木一樣層層組合**。一個 component 可以在自己的 JSX 裡使用其他 component，被使用的那個就是它的子層（child），使用它的則是父層（parent）。

以前面拆解的網頁為例，`App` 會在自己的 JSX 裡放進 `<Navbar />`、`<MainArticle />` 和 `<NewsletterForm />`，像這樣：

```jsx
function App() {
  return (
    <div>
      <Navbar />
      <MainArticle />
      <NewsletterForm />
    </div>
  );
}
```

於是這些 component 彼此形成一棵由上而下的樹狀結構，稱為 component tree（元件樹）：最頂端是 `App`，往下分支出各個子 component，子 component 底下可能又有更小的 component。這種「大 component 由小 component 組成」的做法叫做 composition（組合），它是你用 React 建構任何介面的核心方式——先做出小而專注的積木，再把它們拼成完整的畫面。

### 「定義 component」和「使用 component」是兩件事

初學時很容易把兩件事混為一談，但把它們分清楚會讓後面的學習輕鬆很多：

- **定義 component**：你寫下 `function Greeting() { ... }` 這個函式，等於是在描述「這種 component 長什麼樣子、該 render 出什麼」。這只是藍圖，寫了不代表畫面上就會出現東西。
- **使用（render）component**：當你在 JSX 裡寫下 `<Greeting />`，才是真正建立一個這個 component 的實例（instance），並要求 React 把它畫到畫面上。

同一個定義好的 component 可以被使用很多次。例如 `<Greeting />` 寫三次，畫面上就會出現三份問候語——這正是「可重複使用」的具體展現。你只需維護一份定義，用幾次、用在哪裡則由使用它的地方決定。

### component 住在哪裡？

還記得我們的 component 靜靜地待在它專屬的檔案裡嗎？這種「一個 component 一個檔案」的做法，讓它和程式碼庫的其他部分保持獨立。獨立是好事，但我們同時也希望這個 component 能**用到別處寫好的功能**，並且**把自己分享出去**給其他 component 使用。

要怎麼做到？答案是 JavaScript 的模組系統：`import`（匯入）和 `export`（匯出）。

補充一個歷史小知識：很長一段時間裡，只要檔案用到 React component，你都必須在檔案最上面 `import React`。但自 **React v17.0** 起，這已經不再是必要的了，所以你會看到新的教材裡不再寫 `import React`。

要讓別的 component 能把我們的 `Greeting` 當成子層（child）來使用，就得先把它 `export` 出去：

```jsx
function Greeting() {
  return <h1>我以我漂亮的花帽發誓，我一定會終結你。</h1>;
}

export default Greeting;
```

這裡用的是 **default export（預設匯出）**：一個檔案只能有一個 default export，通常就用來匯出這個檔案的主角 component。

但光是宣告並匯出還不夠——負責啟動整個 app 的 `main.jsx` 還不知道 `Greeting` 的存在。我們得在 `main.jsx` 裡把它 `import` 進來，並實際用上它。這一課的重點就到這裡：理解 component 是什麼、怎麼寫一個 functional component、以及如何透過 `import` / `export` 讓 component 在專案裡流通。

## 程式碼範例

以下示範一個 component 從「建立」到「被 render 到畫面上」的完整流程。

**檔案 1：`Greeting.jsx`**——定義並 default export 一個 component。

```jsx
// 定義一個 functional component（就是一個函式）
// 注意：名稱 Greeting 一定要大寫開頭
function Greeting() {
  // return 一段 JSX，描述這個 component 的畫面
  return <h1>我以我漂亮的花帽發誓，我一定會終結你。</h1>;
}

// 用 default export 把 component 匯出，讓其他檔案能 import 它
export default Greeting;
```

**檔案 2：`main.jsx`**——匯入 component 並把它掛到頁面上。

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Greeting from "./Greeting.jsx"; // 匯入我們自訂的 component
import "./index.css";

// 找到 id 為 root 的 DOM 節點，建立 React 的 root，並 render 我們的 component
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Greeting />
  </StrictMode>,
);
```

存檔後打開瀏覽器，你就會看到那句花帽宣言被畫在畫面上。注意 `<Greeting />` 一樣是**大寫開頭**——這是 React 認得它是自訂 component 的關鍵。

如果你想用 **named export（具名匯出）** 而不是 default export，寫法是這樣：

```jsx
// FavoriteFood.jsx
// 直接在宣告前面加上 export，這就是 named export
export function FavoriteFood() {
  return <h2>我最愛的食物是滷肉飯。</h2>;
}
```

匯入 named export 時，名稱必須用大括號包起來、而且要和匯出的名字**完全一致**：

```jsx
// 具名匯入：名稱要一模一樣，並用大括號包起來
import { FavoriteFood } from "./FavoriteFood.jsx";
```

相對地，default export 匯入時可以自己取任意名字、不需要大括號：

```jsx
// 預設匯入：名稱可自訂，不用大括號
import 隨便取的名字 from "./Greeting.jsx";
```

## 常見陷阱

!!! warning "component 名稱沒大寫，畫面就出不來"
    這是最經典的錯誤。`<greeting />` 會被 React 當成一個普通 HTML 標籤（而且瀏覽器不認得這個標籤，等於什麼都沒 render），只有 `<Greeting />` 才會被當成你自訂的 component。請確保「函式名稱」「import 名稱」「JSX 標籤」三者都是大寫開頭。

!!! warning "default export 與 named export 的匯入語法不同"
    default export 匯入時**不用大括號**、名稱可自訂（`import X from "..."`）；named export 匯入時**要用大括號**、名稱必須和匯出時完全相同（`import { X } from "..."`）。搞混兩者是新手常見的 `undefined` 錯誤來源——一個檔案只能有一個 default export，但可以有多個 named export。

!!! warning "別忘了在入口檔案匯入並使用你的 component"
    寫好並 `export` 一個 component，不代表它就會出現在畫面上。你還必須在會被實際 render 的檔案（例如 `main.jsx`）裡 `import` 它，並把它放進 JSX（例如 `<Greeting />`）。只宣告、不使用，畫面上什麼都不會發生。

## 練習

沿用你在上一課建立好的專案（不要複製貼上程式碼，親手打過一遍才會記得住）：

1. **動手做幾個新的 component。** 例如做一個 component 來顯示你最愛的食物。先在專案裡新增一個檔案（例如 `FavoriteFood.jsx`），在裡面寫一個大寫開頭的 functional component，讓它 `return` 你想要的 JSX。
2. **試試 named export。** component 通常會用 default export 匯出，但這次刻意改用 **named export** 練習看看。改完之後，記得回到匯入它的檔案，把匯入語法也改成具名匯入（要加大括號、名稱要一致）。如果對 export 的各種寫法不熟，可以參考本課「程式碼範例」裡的 named / default 對照。
3. **在入口檔案掛上它。** 到 `main.jsx` 把你的新 component `import` 進來，放進 `render()` 的 JSX 裡，存檔後到瀏覽器確認畫面有正確顯示。
4. **故意犯錯來驗證規則。** 試著把 import 名稱、函式名稱、JSX 標籤全都改成小寫，重新整理瀏覽器，觀察畫面發生什麼變化——這能讓你親身體會「為什麼 component 必須大寫」。

> 進階練習與完整 project 請回原文對照最新要求。

## 原文與延伸資源

- 原文：[React Components](https://www.theodinproject.com/lessons/node-path-react-new-react-components)
- 本課引用：MDN《export》語法說明（default export 與 named export 的差異），可於 MDN Web Docs 搜尋「JavaScript export statement」查閱。

---

> 本講義改寫自 The Odin Project《React Components》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
