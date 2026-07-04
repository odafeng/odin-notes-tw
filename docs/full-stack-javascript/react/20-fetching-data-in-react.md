---
title: 在 React 中抓資料
source_url: https://www.theodinproject.com/lessons/node-path-react-new-fetching-data-in-react
source_file: vendor/curriculum/react/the_react_ecosystem/fetching_data_in_react.md
path: full-stack-javascript
course: React
order: 20
generated: 2026-07-03
---

# 在 React 中抓資料

> 改寫自 The Odin Project：[Fetching Data In React](https://www.theodinproject.com/lessons/node-path-react-new-fetching-data-in-react)
> ｜Full Stack JavaScript › React › The React Ecosystem

## 核心概念

到目前為止，我們用 React 打造的都是「客戶端」的互動介面：資料寫死在程式裡，或者由使用者輸入。但真正的網頁應用幾乎都得跟外界要資料——天氣預報要打氣象 API、社群網站要抓貼文、電商要拿商品清單。要成為完整的 web 應用，我們需要一套方法從外部來源取得資料，並把它動態顯示到畫面上。這一課就把「在 React 中抓資料」這件事從頭走一遍：怎麼發出 API 請求、怎麼用 state（狀態）保存回來的資料、怎麼處理非同步流程與錯誤。你在之前的專案其實已經抓過資料，所以有些內容會很眼熟，複習一下不吃虧。

### 先複習：一個最基本的 fetch 請求

在鑽進 React 的細節之前，先回顧原生 JavaScript 怎麼用 `fetch` 向伺服器要資料。`fetch` 是瀏覽器內建的函式，回傳一個 Promise：

```javascript
const image = document.querySelector("img");
fetch("https://picsum.photos/v2/list")
  .then((response) => response.json())
  .then((response) => {
    image.src = response[0].download_url;
  })
  .catch((error) => console.error(error));
```

這段程式向 Picsum API 要一批圖片資料，第一個 `.then` 把回應解析成 JSON，第二個 `.then` 拿解析後的結果，把第一張圖的網址塞進 `<img>` 的 `src`。`.catch` 則負責接住過程中拋出的錯誤。整個流程是**非同步（asynchronous）**的：`fetch` 不會卡住程式，資料要等一段時間才會回來，回來後才依序執行那些 `.then`。

有些 API 會要求客戶端標示自己的流量來源。遇到這種情況，你可以在請求的第二個參數裡加上自訂的識別 header，例如 `User-Agent`（或 API 擁有者指定的其他名稱）。加法跟加任何其他 header 一樣：

```javascript
fetch("https://picsum.photos/v2/list", {
  headers: {
    "User-Agent": "the-odin-project"
  }
});
```

### 把 fetch 放進 React component：用 effect 包起來

最常見的需求，是 component（元件）一出現在畫面上（也就是 mount，掛載）時就去抓資料，抓回來後顯示。但你不能把 `fetch` 直接寫在 component 主體裡——因為 component 主體每次 render（渲染）都會從頭跑一遍，那樣每次渲染都會重新發請求，資料回來又觸發渲染，形成無窮迴圈。

正確做法是把 `fetch` 包在 **`useEffect`** 這個 hook 裡。effect 是「跟外部系統同步」的動作，抓資料正屬於此類。React 會在渲染畫到畫面上之後，才執行 effect 裡的程式：

```jsx
import { useEffect, useState } from "react";

const Image = () => {
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    fetch("https://picsum.photos/v2/list", {
      headers: {
        "User-Agent": "the-odin-project"
      }
    })
      .then((response) => response.json())
      .then((response) => setImageURL(response[0].download_url))
      .catch((error) => console.error(error));
  }, []);

  return (
    imageURL && (
      <>
        <h1>An image</h1>
        <img src={imageURL} alt={"placeholder text"} />
      </>
    )
  );
};

export default Image;
```

這裡有兩個關鍵角色：`useState` 建立了 `imageURL` 這個 state，讓抓回來的網址能被記住並觸發重新渲染；`useEffect` 則負責執行 side effect（副作用），也就是向外部 API 抓資料。因為我們只需要在 component 掛載時抓一次，所以給 `useEffect` 一個**空的 dependency（依賴）陣列 `[]`**——這代表「這個 effect 不依賴任何值，只在掛載時跑一次」。

回傳的部分用了 `imageURL && (...)` 這種短路寫法：`imageURL` 初始值是 `null`（falsy），所以第一次渲染什麼都不畫；等資料回來、`setImageURL` 更新 state 後才會重新渲染並顯示圖片。

### 處理錯誤：網路本來就不可靠

跨網路的操作天生不穩定：你打的 API 可能掛了、可能有連線問題、回來的資料也可能有錯。太多事情會出錯，如果不事先為錯誤做準備，你的網站可能整個崩掉、或對使用者顯示成一片沒有反應的空白。

想親眼看看有多糟，可以把上面那段 `fetch` 的網址故意改成一個亂打的字串。重新整理後，畫面會停在一片空白，使用者完全不知道是載入完了、還是出錯了。

要修正，我們得在 `Image` 回傳 JSX 之前先檢查一個東西，就叫它 `error`。先在 state 裡加上它：

```jsx
const [imageURL, setImageURL] = useState(null);
const [error, setError] = useState(null);
```

然後在請求失敗時給 `error` 一個值。這裡有個容易被忽略的重點：**`fetch` 只有在「連不上」時才會走進 `.catch`**；如果伺服器有回應，即使回的是 404 或 500，`fetch` 本身仍算「成功」。所以我們得自己在 `.then` 裡檢查 `response.status`，狀態碼不對就**手動 `throw` 一個錯誤**，讓它掉進 `.catch`：

```jsx
useEffect(() => {
  fetch("https://picsum.photos/v2/list", {
    headers: {
      "User-Agent": "the-odin-project"
    }
  })
    .then((response) => {
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json();
    })
    .then((response) => setImageURL(response[0].download_url))
    .catch((error) => setError(error));
}, []);
```

最後在渲染時，只要 `error` 有值就顯示錯誤訊息：

```jsx
if (error) return <p>A network error was encountered</p>;
```

現在無論是網址打錯、或 API 回了預期外的狀態，使用者都會收到明確的提示。

### 加上 loading state：一個請求至少要有三種狀態

跟 `error` 同理，我們可以再加一個 `loading` state，用來標示「請求還沒回來」。這樣就能在等待時顯示載入畫面，而不是留一片空白：

```jsx
const Image = () => {
  const [imageURL, setImageURL] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://picsum.photos/v2/list", {
      headers: {
        "User-Agent": "the-odin-project"
      }
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("server error");
        }
        return response.json();
      })
      .then((response) => setImageURL(response[0].download_url))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>A network error was encountered</p>;

  return (
    <>
      <h1>An image</h1>
      <img src={imageURL} alt={"placeholder text"} />
    </>
  );
};
```

注意 `.finally(() => setLoading(false))`：不管請求成功或失敗，`.finally` 都會執行，所以是關掉載入狀態的最佳位置。這裡浮現了一個重要觀念：**每個請求要有好的使用者體驗，至少得有三種狀態——`data`（資料）、`loading`（載入中）、`error`（錯誤）**。把這三者都處理好，畫面才不會有空白或卡死的窘境。

### 用 custom hook 把抓資料的邏輯抽出來

上面那一整坨抓資料的邏輯，如果別的 component 也要用，難道要整段複製貼上？不必。我們可以把它抽成一個 **custom hook（自訂 hook）**，讓邏輯可重複使用、也更好測試。

回想一下，React 的 hook 其實就是「一個能使用 React 功能（state、effect 等）的函式」，而且遵循命名規則：以 `use` 開頭、後接大寫字母（例如 `useState`、`useEffect`）。這個命名不只是慣例——如果你把 `useEffect` 塞進一個叫 `getImageURL` 的普通函式裡，React 會抗議，因為它只允許 hook 在 component 頂層、或另一個 hook 裡被呼叫。解法很簡單：把這個 helper 函式改名成符合 hook 規則的 `useImageURL`，它就正式成為一個 custom hook：

```jsx
import { useState, useEffect } from "react";

const useImageURL = () => {
  const [imageURL, setImageURL] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://picsum.photos/v2/list", {
      headers: {
        "User-Agent": "the-odin-project"
      }
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("server error");
        }
        return response.json();
      })
      .then((response) => setImageURL(response[0].download_url))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return { imageURL, error, loading };
};

const Image = () => {
  const { imageURL, error, loading } = useImageURL();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>A network error was encountered</p>;

  return (
    <>
      <h1>An image</h1>
      <img src={imageURL} alt={"placeholder text"} />
    </>
  );
};
```

`useImageURL` 把「抓資料 + 管理三種狀態」全部封裝起來，對外只回傳 `{ imageURL, error, loading }`。`Image` component 因此變得非常乾淨，只管怎麼呈現。以後任何 component 要抓圖，呼叫 `useImageURL()` 就好，不必重寫這一堆邏輯。

### 多個請求與「瀑布式請求」的陷阱

真實的應用往往同時發出好幾個請求，這時要小心它們的組織方式。新手常踩的坑叫做 **瀑布式請求（waterfall of requests）**：請求們一個接一個排隊，而不是同時發出，白白拖慢載入。

想像有 `Profile` 這個 component，它的子 component 是 `Bio`，兩者各自在自己內部發出一個 fetch，各需 1000ms 回來。照理說兩個加起來也該差不多同時完成，但你會發現 `Bio` 硬是慢了一秒才出現。原因在於：**在 React 裡，component 沒被實際「呼叫（render）」到，就不會執行**。如果 JSX 裡有條件判斷，false 那一支在條件變 true 之前根本不會渲染。`Profile` 通常會寫成「等自己的資料回來，才渲染 `<Bio />`」；於是 `Bio` 得先等 `Profile` 的請求完成、被渲染出來後，才輪到它發自己的請求——兩個請求變成前後接力，這就是瀑布。

怎麼解？如果直接拿掉 `Profile` 那個「等資料才渲染」的短路判斷，`Bio` 確實會立刻發請求，但那樣就得放棄載入畫面。與其在設計上妥協，更好的辦法是**把請求往上提（lift the request up）**：讓父層 `Profile` 一次把兩份資料都發出去，再把 `Bio` 需要的那份透過 **prop（屬性）** 傳下去。這樣兩個請求在 `Profile` 一渲染時就同時起跑；先回來的資料先渲染，晚回來的資料回來後透過 state 更新、觸發 `Bio` 重新渲染補上內容。載入畫面保住了，兩個請求也並行了。

### 要不要用抓資料的函式庫？

我們才剛觸及前端抓資料的皮毛。要讓前端資料跟伺服器保持同步，是件很有挑戰的事——每加一個功能，管理這些「非同步狀態」就更複雜一分。你在這一課已經嚐到一點苦頭了：光一個請求，就得手動照顧 `data`、`loading`、`error` 三種狀態。市面上有些函式庫（例如 TanStack Query、SWR）能幫你處理這些，甚至更多。不過在這門課裡，我們**強烈建議所有專案都用原生 React 手刻抓資料**。過程中學到的東西，會是無可取代的基本功；等你真正理解痛點在哪，再去用函式庫，才會知道它替你解決了什麼。

## 程式碼範例

以下是一個最小可執行的完整範例，把前面所有觀念濃縮在一起：用 custom hook 抓資料、同時管理 `data`／`loading`／`error` 三種狀態。

```jsx
import { useState, useEffect } from "react";

// custom hook：封裝抓資料與三種狀態
const useImageURL = () => {
  const [imageURL, setImageURL] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://picsum.photos/v2/list")
      .then((response) => {
        // fetch 不會因 4xx/5xx 而失敗，要自己檢查狀態碼並手動拋錯
        if (response.status >= 400) {
          throw new Error("server error");
        }
        return response.json();
      })
      .then((response) => setImageURL(response[0].download_url))
      .catch((error) => setError(error))
      .finally(() => setLoading(false)); // 不論成敗都關掉載入狀態
  }, []); // 空依賴陣列：只在 mount 時抓一次

  return { imageURL, error, loading };
};

const Image = () => {
  const { imageURL, error, loading } = useImageURL();

  // 三種狀態各自對應一種畫面
  if (loading) return <p>載入中...</p>;
  if (error) return <p>發生網路錯誤</p>;

  return (
    <>
      <h1>一張圖片</h1>
      <img src={imageURL} alt="來自 Picsum 的隨機圖片" />
    </>
  );
};

export default Image;
```

## 常見陷阱

!!! warning "fetch 不會因為 404 或 500 而走進 .catch"
    `fetch` 只有在「請求本身無法完成」（例如斷網、DNS 解析失敗）時才會 reject 而進入 `.catch`。只要伺服器有回應，即使狀態碼是 404 或 500，`fetch` 仍視為成功。所以你必須自己在 `.then` 裡檢查 `response.status`，不對就 `throw new Error(...)`，否則這些「伺服器層級的錯誤」會被你的錯誤處理漏掉。

!!! warning "不要把 fetch 直接寫在 component 主體"
    component 主體每次 render 都會重新執行。若把 `fetch` 直接放在裡面，會造成「抓資料 → 更新 state → 重新渲染 → 又抓資料」的無窮迴圈。抓資料一定要包在 `useEffect` 裡，並依需求給定 dependency 陣列（只在掛載時抓一次就給 `[]`）。

!!! warning "小心瀑布式請求（waterfall）"
    當子 component 的渲染被父 component「等資料才渲染」的條件卡住時，子層的請求要等父層請求完成後才會發出，兩個請求變成接力而非並行，載入變慢。解法是把請求往上提到父層一次發出，再用 prop 把資料傳給子 component。

## 練習

跟著以下步驟複習與延伸這一課的內容：

1. 閱讀 LogRocket 的〈Modern API data fetching methods〉一文，讀到 Axios 那一節之前即可。它是對本課討論內容的一份簡短總覽，幫你把「在 React 中抓資料」的各種做法再過一遍。
2. 閱讀 developerway 的〈How to fetch data in React with performance in mind〉，深入理解如何在效能考量下處理 React component 裡的 fetch 請求（特別是瀑布式請求的成因與解法）。
3. 動手實驗：把本課「多個請求」段落裡的人為 `setTimeout` 延遲移除，觀察請求並行後的差異；再試著把抓資料邏輯抽成自己的 custom hook。

完成後，用以下問題自我檢核：如何在 React 中向 API 抓資料？為什麼要在 fetch 請求裡手動拋出錯誤？如何避免瀑布式請求？

## 原文與延伸資源

- 原文：[Fetching Data In React](https://www.theodinproject.com/lessons/node-path-react-new-fetching-data-in-react)
- 本課引用：
    - Modern API data fetching methods（LogRocket 部落格）
    - How to fetch data in React with performance in mind（developerway）
    - The Odin Project react-examples repo 的 `fetching-data/` 目錄（示範瀑布式請求與 lifting up）

---

> 本講義改寫自 The Odin Project《Fetching Data In React》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
