---
title: React Router
source_url: https://www.theodinproject.com/lessons/node-path-react-new-react-router
source_file: vendor/curriculum/react/the_react_ecosystem/react_router.md
path: full-stack-javascript
course: React
order: 19
status: draft
generated: 2026-07-03
---

# React Router

> 改寫自 The Odin Project：[React Router](https://www.theodinproject.com/lessons/node-path-react-new-react-router)
> ｜Full Stack JavaScript › React › The React Ecosystem

## 核心概念

### 從單頁到多頁：什麼是 client-side routing

到目前為止，我們寫的 React app 都只有「一頁」。但只要規模一大，應用程式就會有多個畫面：首頁、個人檔案頁、設定頁……使用者需要在它們之間切換。傳統的多頁式網站（MPA，multi-page application）用的是 server-side routing：每次你點一個連結，瀏覽器就向伺服器要一份全新的 HTML，整個頁面重新載入一次。

client-side routing（客戶端路由）換了一個作法：由瀏覽器裡的 JavaScript 接手處理「切換畫面」這件事。當使用者點擊導覽列的某個項目時，URL 改變、畫面內容跟著更新，但**瀏覽器不會重新載入整頁**。這正是 single-page application（SPA，單頁式應用程式）流暢體驗的來源——你始終待在同一個頁面上，只是被顯示的 component（元件）換掉了。

原文用了一個生動的比喻：多頁式網站像是每次想調整食物，都得「起身離開座位」把菜端回烤箱重烤；client-side routing 則像是直接把微波爐搬到餐桌旁，缺了什麼調味料當場補、當場加熱，人不用離開座位。技術上，這是靠瀏覽器的 [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) 做到的：JavaScript 攔截連結點擊，自己更新網址列與畫面，而不讓請求直接送到伺服器。

client-side routing 帶來 app 般的互動（例如換頁時做 CSS 動畫），但也有代價：瀏覽器原本重新載入時會通知 screen reader（螢幕報讀器）「有新內容了」，改成 client-side routing 後，這類無障礙通知得由你手動處理。好在成熟的函式庫已經幫我們處理掉大部分細節——**React Router** 就是 React 生態系裡最標準的路由函式庫。

### 建立第一個 router

React Router 有好幾種定義路由的方式，本課採用**物件式（object-based）**寫法。先安裝套件（注意 v7 之後套件名是 `react-router`，不再是 `react-router-dom`）：

```bash
npm install react-router
```

核心流程分三步：

1. 用 `createBrowserRouter` 傳入一個「路由設定陣列」，產生 router 物件。
2. 陣列裡每個物件描述一條路由，最基本要有兩個 key：`path`（網址路徑）與 `element`（該路徑要 render（渲染）的 component）。
3. 把產生的 router 交給 `RouterProvider` 這個 component 去 render。

```jsx
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "profile", element: <Profile /> },
]);

// 用 RouterProvider 把整個路由設定掛上去
<RouterProvider router={router} />;
```

這樣一來，造訪 `/` 會顯示 `App`，造訪 `/profile` 會顯示 `Profile`。

### Link：取代 a 標籤

有個陷阱：如果導覽列還在用原生的 `<a href="profile">`，點下去時瀏覽器仍然會**整頁重新載入**——這正是我們想避免的。React Router 提供了 `Link` component 來取代 `<a>`。它接收一個 `to` 屬性（prop）指定目標路徑，點擊時由 React Router 攔截、只更新畫面，不再觸發整頁重載。

```jsx
import { Link } from "react-router";
// <a href="profile"> 換成：
<Link to="profile">Profile page</Link>;
```

### Nested routes、Outlet 與 index route

如果你想根據不同 URL，只**替換頁面的某一區塊**，而共用的外框（標題、側欄）保持不動，就要用 nested routes（巢狀路由）。作法是在某條路由裡加上 `children` 陣列，把子路由放進去：

```jsx
{
  path: "profile",
  element: <Profile />,
  children: [
    { path: "spinach", element: <Spinach /> },
    { path: "popeye", element: <Popeye /> },
  ],
}
```

此時造訪 `/profile/popeye`，`Profile` 會照常 render，而 `Popeye` 會被塞進 `Profile` 裡的一個「插槽」。這個插槽就是 `Outlet` component：你在父 component 裡放一個 `<Outlet />`，React Router 會依照目前的 URL，把對應的子 component 填進去。

```jsx
import { Outlet } from "react-router";

const Profile = () => (
  <div>
    <h1>Hello from profile page!</h1>
    <hr />
    {/* 子路由的 component 會在這裡被 render */}
    <Outlet />
  </div>
);
```

當使用者只造訪 `/profile`、沒有指定任何子路徑時，`Outlet` 會是空的。若想給一個「預設內容」，可以在 `children` 裡加一條 **index route**——用 `index: true` 取代 `path`：

```jsx
children: [
  { index: true, element: <DefaultProfile /> }, // 造訪 /profile 時顯示
  { path: "spinach", element: <Spinach /> },
  { path: "popeye", element: <Popeye /> },
];
```

index route 就代表「這一層的預設子路由」。

### Dynamic segments 與 useParams

上面的寫法把每個名字都寫死成一條路由。但實務上名字是會變的（想想個人檔案頁，使用者成千上萬）。這時要用 **dynamic segment（動態片段）**：在 `path` 裡用冒號 `:` 開頭標記一段會變動的位置。

```jsx
{ path: "profile/:name", element: <Profile /> }
```

`:name` 會去比對 URL 裡那個位置的任意值——造訪 `/profile/popeye` 時 `name` 就是 `"popeye"`，造訪 `/profile/spinach` 時就是 `"spinach"`。這種可變值叫做 **URL params（參數）**，在 component 裡用 `useParams` hook 取得：

```jsx
import { useParams } from "react-router";

const Profile = () => {
  const { name } = useParams(); // 取出網址裡的 :name

  return (
    <div>
      <h1>Hello from profile page!</h1>
      {name === "popeye" ? <Popeye /> : name === "spinach" ? <Spinach /> : <DefaultProfile />}
    </div>
  );
};
```

### 處理錯誤網址：errorElement

改用 dynamic segment 後會冒出新問題：`/profile`（沒帶名字）不再匹配任何路由，React Router 會丟出錯誤。使用者亂打一個不存在的網址時也一樣。與其讓程式崩掉，不如給一個友善的「找不到頁面」。在路由設定裡加上 `errorElement`，當該路由（或其子樹）發生路由錯誤時，就會 render 這個備援 component：

```jsx
{
  path: "/",
  element: <App />,
  errorElement: <ErrorPage />, // 遇到壞網址時顯示
}
```

`ErrorPage` 通常放一段訊息加一個回首頁的 `Link`。

### 把路由抽成獨立檔案

當路由變多，把設定陣列留在 `main.jsx` 會愈來愈亂。慣例是把它抽成一個 `routes.jsx`，`export` 出去，`main.jsx` 再 `import` 進來丟給 `createBrowserRouter`。這麼做還有一個實務好處：**測試檔也能 import 同一份路由設定**，用測試專用的 router 去跑，確保測試環境和正式環境走的是同一套路由。

### Outlet 傳資料：context

`Outlet` 不只是被動的插槽——它有一個內建的 `context` prop。你可以把父 component 的任何值（包含 state（狀態）、陣列、物件）透過它往下傳：

```jsx
<Outlet context={someState} />
```

任何被這個 outlet render 的 component（甚至更深層的「孫」component）都能用 `useOutletContext()` hook 取回那個值；若傳的是陣列或物件，還能直接解構。這是「outlet 專用」的資料傳遞方式；更通用的 context 機制會在後面的課學到。

### Protected routes 與程式化導向

很多時候你得判斷「某條路由該不該顯示」。最典型的是認證（authentication）：使用者登入了就顯示 dashboard，沒登入就導向登入頁。實作 protected routes（受保護路由）方式很多，最簡單的一種就是**依條件產生不同的路由設定**——例如根據登入狀態，決定 `children` 裡放的是真正的頁面還是導向元件。

有時你需要在程式碼裡「主動」把使用者送到別的網址（例如登入成功後跳轉），這用 `useNavigate` hook：它回傳一個 `navigate` 函式，呼叫 `navigate("/dashboard")` 就能導向，也能用 `navigate(-1)` 回到上一頁。

### 測試用到 React Router 的元件

正式 app 從不「直接」render 這些 component，而是透過 router（例如 `RouterProvider`）去 render。所以測試也必須把 component 放進**路由 context** 裡跑，否則 `useNavigate`、`useParams` 或 `<Link>` 會因為找不到 router 而報錯。

兩種選擇：

- 若你只是要 render 一個「剛好含 `<Link>`」的 component，不測導覽、也不依賴其他路由功能，用輕量的 `MemoryRouter` 包起來就夠了。
- 若 component 真的依賴**路由行為**（outlet context、params 比對、error element、redirect），就該像正式 app 一樣用 `RouterProvider`。因為測試不在真瀏覽器裡跑，這時用 `createMemoryRouter`（把記憶體當網址列）搭配你 `routes.jsx` 裡那份相同的路由設定即可。

以上就是 React 課程需要的路由基礎。React Router 還有 loader、action、history 物件等進階功能，等你熟悉基礎後值得再深入。

## 程式碼範例

以下是一份最小可執行、把上述概念串起來的完整範例。

`routes.jsx`（把路由設定獨立出來）：

```jsx
import App from "./App";
import Profile from "./Profile";
import ErrorPage from "./ErrorPage";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />, // 壞網址的備援頁
  },
  {
    path: "profile/:name", // :name 是 dynamic segment
    element: <Profile />,
  },
];

export default routes;
```

`main.jsx`（建立 browser router 並掛上）：

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import routes from "./routes";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
```

`App.jsx`（用 Link 而非 a 標籤）：

```jsx
import { Link } from "react-router";

const App = () => (
  <div>
    <h1>Hello from the main page of the app!</h1>
    <nav>
      <ul>
        {/* 點擊不會整頁重載 */}
        <li><Link to="profile/popeye">Popeye 的檔案</Link></li>
        <li><Link to="profile/spinach">Spinach 的檔案</Link></li>
      </ul>
    </nav>
  </div>
);

export default App;
```

`Profile.jsx`（用 useParams 依網址動態顯示）：

```jsx
import { useParams } from "react-router";

const Profile = () => {
  const { name } = useParams(); // 取出 URL 裡的 :name

  return (
    <div>
      <h1>個人檔案頁</h1>
      <p>目前造訪的是：{name}</p>
    </div>
  );
};

export default Profile;
```

## 常見陷阱

!!! warning "還在用 <a> 標籤導覽"
    在 SPA 內部導覽請一律用 `Link`（或 `NavLink`）。原生 `<a href>` 會讓瀏覽器整頁重新載入，狀態全部歸零，client-side routing 的好處也就消失了。只有連到**外部網站**時才用 `<a>`。

!!! warning "在 RouterProvider 之外呼叫路由 hook"
    `useParams`、`useNavigate`、`useOutletContext` 這些 hook，以及 `Link`，都必須在 router 的 context 內才能運作。單獨 render 一個含這些東西的 component（尤其在測試裡）會直接報錯——測試時記得用 `MemoryRouter` 或 `createMemoryRouter` 包起來。

!!! warning "忘了在父元件放 Outlet"
    定義了 `children` 卻在父 component 裡沒放 `<Outlet />`，子路由的 component 就沒有位置可顯示，畫面上什麼都不會出現，也不會報錯，很難察覺。父路由若要顯示子路由，`<Outlet />` 不能少。

!!! warning "把 index route 寫成 path 空字串"
    「這一層的預設子路由」要用 `{ index: true, element: ... }`，而不是 `{ path: "", element: ... }` 之類的寫法。`index: true` 才是官方語意，也不能同時再給它 `path`。

!!! warning "dynamic segment 讓原本的 index 失效"
    把路由從 `profile` 改成 `profile/:name` 後，`/profile`（不帶名字）就不再匹配了，會觸發錯誤。若這條裸路徑仍需要有畫面，得另外處理（例如再補一條 `profile` 路由或設好 `errorElement`）。

## 練習

1. 先讀 Ben Holmes 的文章〈[SPAs and client-side routing](https://bholmes.dev/blog/spas-clientside-routing/)〉，它用很精簡的篇幅把本課的路由概念再走一遍，補強你對「為什麼要 client-side routing」的直覺。
2. 動手把本課的範例 app 建出來，然後**自己多加幾條路由**練習。這一課資訊量很大，最好的鞏固方式就是把它整個刪掉、只憑記憶重寫一次，看看卡在哪裡。
3. 瀏覽 [React Router 官方文件](https://reactrouter.com/home)。不用全部讀懂，重點是把本課提到的概念（`Link`、`Outlet`、`useParams`、`errorElement`、`useOutletContext`、`useNavigate`、`createMemoryRouter`）在文件裡各找到對應段落再讀一遍，並順手看看還有哪些功能。這份文件之後會是你常回來查的參考資料。

## 原文與延伸資源

- 原文：[React Router](https://www.theodinproject.com/lessons/node-path-react-new-react-router)
- 本課引用：
  - [MDN：History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
  - [React Router 官方文件](https://reactrouter.com/home)（`Link`、`Outlet`、`useOutletContext`、`useNavigate`、`MemoryRouter`、`createMemoryRouter` 等 API）
  - [SPAs and client-side routing（Ben Holmes）](https://bholmes.dev/blog/spas-clientside-routing/)

---

> 本講義改寫自 The Odin Project《React Router》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
