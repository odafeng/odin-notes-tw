---
title: 專案：購物車
source_url: https://www.theodinproject.com/lessons/node-path-react-new-shopping-cart
source_file: vendor/curriculum/react/the_react_ecosystem/project_shopping_cart.md
path: full-stack-javascript
course: React
order: 22
generated: 2026-07-03
---

# 專案：購物車

> 改寫自 The Odin Project：[Project: Shopping Cart](https://www.theodinproject.com/lessons/node-path-react-new-shopping-cart)
> ｜Full Stack JavaScript › React › The React Ecosystem

## 核心概念

這是 The React Ecosystem 這一整章的收尾專案：做一個「假的購物車（Shopping Cart）」網站。它會把你這一章學到的東西一次串起來——用 **react-router** 做多頁切換、用 **effect** 從外部 API 抓商品、用 **state（狀態）** 追蹤購物車內容、用 **PropTypes** 檢查 props（屬性）、再用 React Testing Library 寫測試，最後部署成單頁應用（SPA）。做完你會很清楚：一個資料要在多個頁面之間共用時，state 該放在哪、怎麼往下傳。

### 頁面與導覽結構

專案要有三個頁面，並靠一條在每頁都出現的**導覽列（navbar）**互相切換：

- **首頁（Home）**：放什麼都行，幾張圖或一段介紹就夠，用來練手感。
- **商店頁（Shop）**：列出所有商品卡片，可以加入購物車。
- **購物車頁（Cart）**：顯示已加入的商品與數量，可增減或移除。

「每頁都出現的導覽列」正是 react-router 巢狀路由（nested route）加 `<Outlet>` 的典型用法：用一個 layout（版面）元件擺放導覽列，三個頁面當它的子路由，切頁時只換 `<Outlet>` 的內容，導覽列保持不動。

### 最關鍵的一題：購物車 state 放哪裡

這個專案真正要你想清楚的是——**購物車的資料由誰保管**。商店頁要「加入商品」、導覽列要「顯示總件數」、購物車頁要「增減數量」，三個不同位置都在讀寫同一份購物車資料。React 的資料是單向往下流的，所以要把 `cart` 這個 state 提升（lift up）到它們共同的祖先（通常就是最上層的 layout 或 `App`），再把資料與操作函式（`addToCart`、`updateQuantity`…）透過 props 往下傳給各頁。

在 react-router 裡，往子路由傳資料最順手的方式是 `<Outlet context={...}>` 搭配子元件的 `useOutletContext()`，這樣就不必把 props 一層層手動穿過中間元件。若資料要共用的層級很深，也可以改用 Context API，但這個規模用 Outlet context 已經很夠。

### 商店頁的商品卡片

每張商品卡片上要有：商品標題、一個讓使用者**手動輸入數量**的 input（輸入框）、旁邊一組**加一／減一按鈕**做微調，還有一顆「Add To Cart（加入購物車）」按鈕。這裡的 input 要做成**受控元件（controlled component）**：value 綁在 state 上、`onChange` 更新它，加減按鈕就是去改同一個 state。按下「加入購物車」時，把「這個商品 + 目前數量」交給上層的 `addToCart`。

### 導覽列的即時件數

導覽列裡的購物車連結要顯示目前有幾件，而且**隨加入／移除即時更新**。因為 `cart` 就是一個 React state，只要它一變、畫面就重新 render（渲染），件數自然跟著更新——你要做的只是從 `cart` 算出總數，例如把每項的 `quantity` 加總。

### 抓商品、檢查 props、測試

- **抓資料**：商品清單從 [FakeStore API](https://fakestoreapi.com) 之類的服務取得，用 `useEffect` 在商店頁 mount（掛載）時抓一次，寫進 state 再 render。
- **PropTypes**：把每個元件收到的 props 都用 PropTypes 標好型別，清掉所有 `missing in props validation` 警告。
- **測試**：用 React Testing Library 測互動（例如「按加入購物車後件數有沒有變」）。注意**不要直接測 react-router**——它是別人維護、已經測過的外部函式庫；你要測的是自己寫的邏輯。

## 程式碼範例

下面用一個最小骨架示範幾個核心：把 `cart` 放在 layout、用 `Outlet context` 往下傳、導覽列即時算件數、以及商品卡片的受控數量。

```jsx
// src/Layout.jsx —— 共用版面：導覽列在每頁都在，state 也住在這
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

function Layout() {
  const [cart, setCart] = useState([]); // 每項：{ id, title, quantity }

  // 加入購物車：已存在就累加數量，否則新增（都用不可變更新）
  function addToCart(product, quantity) {
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }

  // 導覽列要顯示的總件數：把每項數量加總
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <nav>
        <Link to="/">首頁</Link>
        <Link to="/shop">商店</Link>
        <Link to="/cart">購物車（{totalItems}）</Link>
      </nav>
      {/* 把 cart 與操作函式傳給子路由 */}
      <Outlet context={{ cart, setCart, addToCart }} />
    </div>
  );
}

export default Layout;
```

```jsx
// src/ProductCard.jsx —— 受控的數量輸入 + 加減按鈕 + 加入購物車
import { useState } from "react";
import PropTypes from "prop-types";

function ProductCard({ product, onAdd }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="card">
      <h3>{product.title}</h3>
      <div>
        <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
        {/* 受控元件：value 綁 state，onChange 更新它 */}
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <button onClick={() => setQuantity((q) => q + 1)}>＋</button>
      </div>
      <button onClick={() => onAdd(product, quantity)}>Add To Cart</button>
    </div>
  );
}

// 清掉 missing in props validation 警告
ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default ProductCard;
```

```jsx
// src/Shop.jsx —— 抓商品、渲染卡片；用 useOutletContext 拿到 addToCart
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import ProductCard from "./ProductCard";

function Shop() {
  const { addToCart } = useOutletContext();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []); // 空依賴陣列 = 只在 mount 時抓一次

  return (
    <div className="shop">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAdd={addToCart} />
      ))}
    </div>
  );
}

export default Shop;
```

路由把 `Layout` 當外層、三個頁面當子路由；購物車頁一樣用 `useOutletContext()` 拿到 `cart` 與 `setCart`，就能顯示與增減內容：

```jsx
// src/App.jsx —— 路由設定（巢狀路由 + 共用 Layout）
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Shop from "./Shop";
import Cart from "./Cart";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="cart" element={<Cart />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## 常見陷阱

!!! warning "購物車 state 放太低，別的頁面讀不到"
    如果把 `cart` 放在商店頁裡面，導覽列和購物車頁就拿不到它。凡是多個位置要共用的資料，都要把 state 提升到它們**共同的祖先**（這裡是 `Layout`），再往下傳。放錯層級是這個專案最常見的卡關點。

!!! warning "直接改動 cart 陣列，畫面不更新"
    像 `cart.push(item)` 或直接改某項的 `item.quantity++` 是就地改動原陣列，React 認為「參考沒變」而不重新 render。務必用 `[...prev, newItem]`、`prev.map(...)` 這類方式產生**新陣列**再交給 setter。

!!! warning "數量 input 忘了做成受控元件"
    只寫 `value={quantity}` 卻沒有 `onChange`，input 會變成唯讀、打不了字並跳警告。受控元件一定要 `value` 與 `onChange` 成對出現，加減按鈕也是去改同一個 state。

!!! warning "跑去測 react-router 本身"
    react-router 是外部函式庫、作者已經測過。你的測試該聚焦自己的邏輯（例如按下 Add To Cart 後件數有沒有變），不要去驗證「點連結會不會換頁」這種 router 的行為。

!!! warning "部署後重新整理子頁面出現 404"
    SPA 的路由由前端接管，直接開 `/shop` 時伺服器找不到那個實體檔案就回 404。要在 host 設定「把所有路徑都導回 `index.html`」：Netlify 用 `public/_redirects`、Vercel 用 `vercel.json` 的 rewrites、Cloudflare Pages 預設就處理好了。

## 練習

專案的完整需求、部署設定與示範以原文為準（專案說明更新較頻繁），這裡把主要步驟整理成繁中版：

1. 用 Vite 建立一個新的 React 專案。
2. 動手前先規劃元件與資料夾結構：需要哪些頁面、哪些元件、購物車 state 放哪、要怎麼往下傳，記在一個容易回頭查的地方。
3. 做三個頁面：首頁、商店頁、購物車頁，並用一條在每頁都顯示的導覽列切換。
4. 商店頁替每個商品做一張卡片：顯示標題、一個可手動輸入數量的 input、旁邊加一／減一按鈕，以及「Add To Cart」按鈕。
5. 導覽列的購物車連結要顯示目前件數，並隨加入／移除**即時更新**。
6. 購物車頁顯示各商品與數量，可增減、可移除（不必做結帳或付款）。
7. 商品清單從 [FakeStore API](https://fakestoreapi.com) 之類的服務用 `useEffect` 抓取。
8. 用 PropTypes 清掉所有 `missing in props validation` 警告。
9. 用 React Testing Library 好好測過（但別直接測 react-router）。
10. 加上樣式，把成品做得能拿出來炫耀，最後部署上線；SPA 的路由記得依 host 做對應設定。

完整的原始要求與各家部署設定範例，請見下方原文連結。

## 原文與延伸資源

- 原文：[Project: Shopping Cart](https://www.theodinproject.com/lessons/node-path-react-new-shopping-cart)
- 本課引用：[React Router 官方文件](https://reactrouter.com/)、[FakeStore API](https://fakestoreapi.com)、[React 官方文件：`useEffect`](https://react.dev/reference/react/useEffect)、[React 官方文件：`useState`](https://react.dev/reference/react/useState)

---

> 本講義改寫自 The Odin Project《Project: Shopping Cart》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
