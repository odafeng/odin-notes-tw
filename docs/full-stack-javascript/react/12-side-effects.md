---
title: 處理副作用（Side Effects）
source_url: https://www.theodinproject.com/lessons/node-path-react-new-how-to-deal-with-side-effects
source_file: vendor/curriculum/react/states_and_effects/how_to_deal_with_side_effects.md
path: full-stack-javascript
course: React
order: 12
generated: 2026-07-04
---

# 處理副作用（Side Effects）

> 改寫自 The Odin Project：[How To Deal With Side Effects](https://www.theodinproject.com/lessons/node-path-react-new-how-to-deal-with-side-effects)
> ｜Full Stack JavaScript › React › States And Effects

## 核心概念

到目前為止，你的 component（元件）做的事情可以歸成兩類：一是根據 props（屬性）和 state（狀態）**算出畫面**（也就是回傳 JSX 的那段渲染邏輯），二是**回應使用者的動作**（也就是掛在 `onClick`、`onChange` 上的 event handler）。這兩類已經能做很多事，但還不夠。

想像你要寫一個聊天室 component，它一出現在畫面上就得去連伺服器、把訊息抓下來顯示；或是你想寫一個時鐘，畫面一載入就開始每秒跳動；又或者你需要直接操作瀏覽器的 DOM、訂閱某個外部資料來源。這些工作有個共通點：它們是 component 跟「自己以外的世界」互動——伺服器、瀏覽器 API、計時器、第三方函式庫。這種「跟外部系統同步」的行為，就叫做 **side effect（副作用）**。

副作用的關鍵特徵是：它不是為了算出畫面，也不是由某個特定按鈕觸發，而是**由「渲染這件事本身」引起的**。component 出現了，所以要連線；某個 state 變了，所以要重新抓資料。React 為此提供了一個專門的 hook：**`useEffect`**。它讓你把這類「跟外部同步」的程式碼，安排在**渲染完成之後**才執行，而不是塞在渲染過程中。

### 為什麼不能把副作用直接寫在 component 裡

先看一個反例。我們想做一個 `Clock`，顯示網頁載入後過了幾秒。很直覺地，用 `setInterval` 每秒把 `counter` 加一：

```jsx
import { useState } from "react";

export default function Clock() {
  const [counter, setCounter] = useState(0);

  // 錯誤示範：直接寫在 component 主體
  setInterval(() => {
    setCounter((count) => count + 1);
  }, 1000);

  return <p>已經過了 {counter} 秒。</p>;
}
```

執行後你會看到數字暴衝。原因是：**component 主體會在每次渲染時從頭跑一遍**。第一次渲染呼叫了一次 `setInterval`，這個 interval 每秒更新 state，觸發重新渲染；而每次重新渲染又會**再呼叫一次 `setInterval`**，於是計時器愈生愈多，更新愈來愈頻繁，整個失控。這正說明了：副作用不該寫在渲染過程裡，它需要一個專屬的安放位置。

### `useEffect`：把副作用移出渲染

`useEffect` 接受一個 callback 函式，你把副作用邏輯放進去。React 會等這次渲染畫到畫面上之後，才去執行這個 callback：

```jsx
import { useEffect, useState } from "react";

export default function Clock() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setCounter((count) => count + 1);
    }, 1000);
  });

  return <p>已經過了 {counter} 秒。</p>;
}
```

雖然搬進了 `useEffect`，但數字還是長太快。因為**預設情況下，`useEffect` 會在「每一次渲染」後都執行一遍**。state 每更新一次就重新渲染，effect 就又跑一次、又多一個計時器。我們需要一種方法告訴 React：「這個 effect 只在特定時機跑就好。」這就要靠第二個參數。

### dependency array（相依陣列）：控制 effect 的執行時機

`useEffect` 的第二個參數是一個**相依陣列（dependency array）**，用來指定「哪些值改變時才重新執行 effect」。它有三種寫法，差別很大：

```jsx
useEffect(() => {
  // 沒有第二個參數：每一次渲染後都執行
});

useEffect(() => {
  // 空陣列：只在 component 第一次掛載（mount）時執行一次
}, []);

useEffect(() => {
  // 有值的陣列：掛載時執行，之後只要 a 或 b 跟上次不同就再執行
}, [a, b]);
```

以時鐘為例，我們只想在 component 第一次出現時設定一次計時器，所以傳**空陣列** `[]`：

```jsx
import { useEffect, useState } from "react";

export default function Clock() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setCounter((count) => count + 1);
    }, 1000);
  }, []); // 空陣列：只在掛載時跑一次

  return <p>已經過了 {counter} 秒。</p>;
}
```

現在計時器只會被建立一次，數字終於一秒加一。一個實用的原則是：**相依陣列通常不需要你自己憑感覺去填**。專案的 linter（例如 ESLint 的 React Hooks 規則）會提示 effect 內用到、卻沒放進陣列的值。正確做法是照 linter 的建議把該加的加進去，而不是為了消警告硬把它壓下來——漏掉相依項往往是 bug 的來源。

### clean-up function（清理函式）：收拾 effect 留下的東西

還有一個問題。在開發環境下開啟 **StrictMode** 時，你可能發現計數器每秒跳「兩下」。這是 StrictMode 刻意製造的行為：它會把 component **掛載 → 卸載（unmount）→ 再掛載一次**，藉此幫你抓出沒收好尾巴的 effect。問題在於，第一次掛載時建立的 `setInterval` 在 component 被卸載時**並沒有被停掉**，它在背景繼續累加；第二次掛載又建立了新的 interval，於是兩個一起跑。

解法是 `useEffect` 的第三個組成部分：**清理函式（clean-up function）**。你可以從 effect 的 callback **回傳一個函式**，React 會在「下一次執行這個 effect 之前」以及「component 被卸載時」呼叫它，讓你有機會取消訂閱、清除計時器、關閉連線：

```jsx
import { useEffect, useState } from "react";

export default function Clock() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const key = setInterval(() => {
      setCounter((count) => count + 1);
    }, 1000);

    return () => {
      clearInterval(key); // 清理：卸載或重跑前先清掉舊的計時器
    };
  }, []);

  return <p>已經過了 {counter} 秒。</p>;
}
```

到這裡，`useEffect` 的完整結構就清楚了——它由三塊組成：**副作用本體、（選填的）清理函式、（選填的）相依陣列**：

```jsx
useEffect(
  () => {
    // 執行副作用
    return () => {
      // 清理函式：在卸載時、或重跑 effect 前執行
    };
  },
  [/* 0 到多個相依項 */] // 選填的相依陣列
);
```

### 但是，你真的需要 effect 嗎？

`useEffect` 其實是 React 一般運作方式之外的一道「逃生門（escape hatch）」，專門用來跟外部系統同步。動手用它之前，先問自己一個問題：**除了 props 和 state 之外，我這裡有沒有一個真正的外部系統（伺服器、瀏覽器 DOM、計時器等）需要同步？** 如果沒有，那多半就不該用 effect。不必要的 `useEffect` 是一種 code smell：容易出錯、拖慢效能，還讓資料流變難懂。幾個常見的「其實不需要 effect」的情況：

- **只是根據現有 state / props 算出另一個值**：直接在渲染時算就好，不要用 effect 搭配另一個 state。例如兩數之和 `const sum = number1 + number2;`，不需要 `useEffect` 去 `setSum`。
- **回應使用者操作**：那是 event handler 的工作。「component 一顯示就要跑」的邏輯才放 effect，「使用者做了某動作才跑」的邏輯放事件處理函式（例如 `onChange`），不要用 effect 去手動 `addEventListener`。
- **想根據某條件重設 state**：多數時候用 **key** 就好。就像 list（列表）項目要 key 一樣，給 component 一個會隨該 state 改變的 key，React 就會為每個不同的值建立一個全新的 component 實例，state 自然重置。
- **想用 effect 去更新父層或兄弟 component 的 state**：改用 **lifting the state（狀態上移）**。React 的資料是單向往下流的，若多個子 component 要共用同一份 state，就把它移到共同的父層，再往下傳，而不是靠 effect 這種逃生門硬同步。

## 程式碼範例

以下是一個能實際跑的完整計時器 component，涵蓋了本課三個重點：把副作用放進 `useEffect`、用空相依陣列只在掛載時執行一次、以及用清理函式在卸載時停掉計時器。

```jsx
import { useEffect, useState } from "react";

export default function Clock() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // 副作用本體：建立一個每秒觸發的計時器
    const intervalId = setInterval(() => {
      // 用「更新函式」形式，確保拿到的是最新的 count
      setCounter((count) => count + 1);
    }, 1000);

    // 清理函式：component 卸載（或此 effect 重跑）前先清掉計時器
    return () => {
      clearInterval(intervalId);
    };
  }, []); // 空相依陣列：只在第一次掛載時執行

  return <p>已經過了 {counter} 秒。</p>;
}
```

對照「不需要 effect」的例子——單純由 state 推導出的值，直接在渲染時計算即可：

```jsx
import { useState } from "react";

export default function AdditionDisplay() {
  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);

  // 不需要另一個 state，也不需要 useEffect
  // 直接在渲染時算出來
  const sum = number1 + number2;

  return (
    <p>
      {number1} + {number2} = {sum}
    </p>
  );
}
```

## 常見陷阱

!!! warning "把副作用寫在 component 主體，導致無限迴圈"
    直接在 component 函式裡呼叫 `setInterval`、`fetch` 或任何會 `setState` 的東西，會在每次渲染時重跑。若這個副作用又觸發了 state 更新，就會「更新 → 重新渲染 → 再次執行副作用 → 再更新」無限迴圈。務必把副作用放進 `useEffect`，並用相依陣列限制它的執行時機。

!!! warning "忘了寫清理函式，計時器與訂閱不斷堆積"
    `setInterval`、`addEventListener`、WebSocket 連線這類副作用，如果沒有在 clean-up function 裡對應地 `clearInterval`、`removeEventListener`、關閉連線，舊的實例會在 component 卸載或 effect 重跑後繼續存在，造成重複執行、記憶體洩漏與難以追查的 bug。**建立了什麼，就在回傳的清理函式裡收掉什麼。**

!!! warning "為了消 linter 警告而亂填或清空相依陣列"
    看到 linter 提示「缺少相依項」時，不要用 `// eslint-disable` 硬壓，也不要隨手塞一個空陣列了事。相依陣列漏掉 effect 內實際用到的值，會讓 effect 讀到過期（stale）的資料。正確做法是照 linter 建議補齊，或重新思考這個 effect 是否根本不必要。

!!! warning "用 effect 做「其實不用 effect」的事"
    只是由 state/props 推導的值，直接在渲染時算；回應使用者動作的邏輯，放進 event handler；要重設 state 時多用 key；要跨 component 共用 state 時把狀態上移。這些都不需要 `useEffect`。動用 effect 前先問：「有沒有真正的外部系統要同步？」沒有就別用。

## 練習

跟著下面的步驟，把本課的概念串起來讀一遍（原文的延伸閱讀都以繁中重述，讓你不點外部連結也能掌握重點）：

1. **理解 reactive effect 的生命週期**：一個帶副作用的 component 會經歷「掛載 → 更新 → 卸載」三個階段。試著用自己的話說出：effect 的 callback 在哪個階段開始跑、相依項改變時發生什麼、清理函式又在何時被呼叫。把前面的 `Clock` 範例在腦中走一遍，對照這三個階段。
2. **練習判斷「不需要 effect」的情境**：拿本課「但是，你真的需要 effect 嗎？」列出的四種情況（推導值、事件、用 key 重設、狀態上移），各自想一個小例子，並寫出「不用 effect 的正確寫法」。這比背 API 更重要。
3. **辨認並拆除無限迴圈**：常見的初學者錯誤是在 effect 裡更新某個 state，卻又把那個 state 放進相依陣列，形成「effect 改 state → state 變 → effect 再跑」的無限迴圈。試著自己刻意寫出一個這樣的迴圈，觀察現象，再思考該怎麼修正（通常是移除多餘的相依項，或改用更新函式形式，或根本不該用 effect）。

> 進階練習（project）：原文的實作型 project 請參考下方「原文與延伸資源」連結，依原文步驟完成。

## 原文與延伸資源

- 原文：[How To Deal With Side Effects](https://www.theodinproject.com/lessons/node-path-react-new-how-to-deal-with-side-effects)
- 本課引用：
    - React 官方文件〈Lifecycle of Reactive Effects〉：說明帶副作用的 component 的生命週期與各渲染階段中 `useEffect` 的角色。
    - React 官方文件〈You Might Not Need an Effect〉：更多「其實不需要 effect」的實例與正確替代寫法。
    - Dmitri Pavlutin〈React useEffect() infinite loop〉：解說初學者最常踩的 `useEffect` 無限迴圈成因與修正方式。

---

> 本講義改寫自 The Odin Project《How To Deal With Side Effects》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
