---
title: React 的 key
source_url: https://www.theodinproject.com/lessons/node-path-react-new-keys-in-react
source_file: vendor/curriculum/react/getting_started_with_react/keys_in_react.md
path: full-stack-javascript
course: React
order: 8
status: draft
generated: 2026-07-03
---

# React 的 key

> 改寫自 The Odin Project：[Keys In React](https://www.theodinproject.com/lessons/node-path-react-new-keys-in-react)
> ｜Full Stack JavaScript › React › Getting Started With React

## 核心概念

`key` 是 React component（元件）一個很特別的 prop（屬性）。它看起來只是一個普通的屬性，寫法也和其他 prop 一模一樣，但它其實不會被傳進 component 內部，而是 React「內部專用」的一個標記。這一課要弄懂的是：React 為什麼需要 key、它在渲染（render）清單時扮演什麼角色，以及什麼是好的 key、什麼是會製造 bug 的壞 key。

### 為什麼 React 需要 key？

要理解 key，得先回想 React 的運作方式。React 在背後維護一份 **virtual DOM（虛擬 DOM）**，用它來決定真實 DOM 裡有哪些東西需要更新，藉此把不必要的操作降到最低。每當發生一次 re-render（重新渲染），React 會先重新建立一份新的 virtual DOM，接著把新的和上一份 virtual DOM 拿來做 **diff（比對差異）**，最後只針對「真正有變動」的部分去更新真實 DOM。

問題來了：畫面上可能同時存在很多個 component，每一個都有自己的 props 和 state（狀態）。React 必須有辦法分辨「這一個」和「那一個」component 的差別。因此在背後，**每個 component 都會被賦予一個身分證——也就是 key**。

有了 key，React 就能做出正確判斷。舉例來說，當你更新某個 component 的 state 時，它其實還是「同一個 instance（實例）」，因為它的 key 沒有變。React 認得這一點，就會保留它、只更新有變動的部分，避免多餘的動作。反過來說，如果 key 變了，React 就會認定「這是一個全新的 instance」，於是把舊的丟掉、重新建立一個帶著全新 state 的 component。

多數情況下，你 **不需要** 手動給 component 指定 key，React 會自動處理。但有兩個場景，我們需要親自出手：**渲染清單** 與 **用 key 控制 state 的重置**。

### 渲染清單時的 key

在前一課裡，我們用 `.map()` 方法走訪一個陣列、回傳 component，藉此渲染出一整串清單。現在想像一下：如果清單裡的某個項目變動了，React 在背後要怎麼知道該更新哪一個？

當清單改變時，理論上有兩種做法：

1. 把整份清單完全重新渲染一次。
2. 精準找出「有變動」的那幾個項目，只重新渲染它們。

我們當然希望是第二種——只更新有變的項目，而不是把整份清單重畫（那是白費力氣）。要做到這件事，清單裡的 **每一個項目都需要一個 key**。

那為什麼平常寫死（hard-code）在 JSX 裡的 component 就不用煩惱 key？因為那種寫法是明確且靜態的：每次 re-render，第一個 component 就是第一個、第二個就是第二個，前後對照毫無歧義，React 自動配對就行了。

但用 `.map()` 走訪陣列來產生清單就完全是另一回事了——它是 **動態** 的。你只寫了 `.map()` 的「單一個回傳值」，但最終結果可能是 2 個、3 個、甚至 100 個 component instance，而且這些 instance 的「數量」和「順序」都可能在不同次的 render 之間改變。在這種情況下，React 沒辦法可靠地自動配對「這一次的第 N 個」和「上一次的哪一個」。萬一數量或順序變了，它要如何確定哪些 component 該從頭重建（帶新 state）、哪些是原本就存在、應該保留或更新既有 state 的 instance？

這正是我們必須 **自己提供 key** 的原因。當清單因為某些理由被更新時（不論是來自伺服器的新資料，還是使用者的互動），React 會拿「更新後清單」的每個 key，去和「先前清單」的 key 做配對。只要 key 對得上，它就知道那是同一個項目；如果有任何差異，React 只會去更新真正改變的那幾個。

舉個具體例子感受一下：假設清單原本是 `[A, B, C]`，你在最前面插入一個 `Z`，變成 `[Z, A, B, C]`。如果每個項目都帶著穩定的 key（例如 A、B、C 各自資料的 id），React 一比對就發現「A、B、C 的 key 都還在，只是多了一個 key 為 Z 的新項目」，於是它只需要新增 Z，其餘三個原封不動。相反地，如果沒有妥當的 key（或用位置當 key），React 會誤以為「第一個位置的內容從 A 變成了 Z、第二個從 B 變成 A……」，結果幾乎每一項都被判定成「有變動」而被重畫。key 的價值，就在於幫 React 認出「誰還是原本那個」。

一句話總結：**只要 key 維持穩定（consistent）且唯一（unique），React 就能又快又準地處理 DOM。**

### 該拿什麼當 key？

key 的寫法你其實已經很熟悉了——它就是一個傳進 component 或 DOM 元素的 prop：

```jsx
<Component key={keyValue} />
<div key={keyValue}></div>
```

有一個重要差別要記住：`key` 這個 prop 是 **私有的**，只給 React 內部使用。它 **不會** 出現在 component 的 `props` 參數物件裡，所以你在 component 內部是拿不到 `props.key` 的。

知道語法後，下一個問題是：**該用什麼值當 key？** 理想上，這個值應該是清單中每個項目「獨一無二」的識別碼。大多數資料庫都會為每一筆資料指派一個唯一的 id，所以通常你不必自己煩惱這件事。如果資料是你自己定義的，好習慣是替每個項目指派一個唯一的 `id`——例如可以用 `crypto.randomUUID()` 這個函式來產生。

### 用 key 控制 state 的重置

渲染清單無疑是最常見需要手動給 key 的情境，但不是唯一的。既然 key 只是 React 用來分辨 component instance 的內部 ID，我們也可以刻意利用它，來 **主動控制**「一個 component 在 state 更新時，究竟該維持同一個 instance，還是變成一個帶著全新 state 的新 instance」。

想像你做了一個遊戲，遊戲結束後你想把它「重置回初始狀態」。重新整理整個頁面通常不是好主意——尤其當畫面上還有別的 component 各自帶著你想保留的 state。你也可以寫一個函式，把每一個相關的 state 手動設回初始值，但這樣你得確保沒漏掉任何一個 state、也沒設錯值，而且日後每次新增或移除 state，都得記得同步維護這個重置函式。

有沒有更簡單的方式，直接告訴 React「請把這個 component 從頭用全新 state 重建」？有——**只要換掉它的 key 就好**。回想前面說過的規則：key 沒變，就是同一個 instance、state 會被保留；key 一變，React 就把它當成全新的 instance、丟掉舊 state 重建。我們可以刻意把一個會遞增的數字當成 component 的 key，每當想重置時就讓這個數字加一，key 一改，整個 component 連同它內部所有 state 都會被 React 乾淨俐落地重建——不必逐一手動歸零，也不怕漏掉哪個 state。這個技巧在後面的程式碼範例會示範。

## 程式碼範例

### 用資料本身的 id 當 key（推薦）

```jsx
// 一份 todo 清單，每個 todo 物件都有 task 與 id
const todos = [
  { task: "mow the yard", id: crypto.randomUUID() },
  { task: "Work on Odin Projects", id: crypto.randomUUID() },
  { task: "feed the cat", id: crypto.randomUUID() },
];

function TodoList() {
  return (
    <ul>
      {todos.map((todo) => (
        // 這裡直接用資料裡「早就存在」的 id 當 key
        <li key={todo.id}>{todo.task}</li>
      ))}
    </ul>
  );
}
```

### 用陣列 index 當 key（只在清單永遠不變時）

如果你能確定這份清單在整個 app 的生命週期裡「永遠不會變動」，那麼用陣列的 index（索引）當 key 是可以的。但這通常 **不建議**——一旦清單有項目被刪除、插入或重新排序，用 index 當 key 會導致難以追查的 bug（原因見「常見陷阱」）。

```jsx
const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function MonthList() {
  return (
    <ul>
      {/* 這裡用 index 當 key，因為月份清單固定不變 */}
      {months.map((month, index) => (<li key={index}>{month}</li>))}
    </ul>
  );
}
```

### 用 key 重置 component 的 state

```jsx
import { useState } from "react";

function GamePage() {
  const [key, setKey] = useState(0);

  // Game 有自己的 state。當 key 沒變時，它就是同一個 instance，state 會被保留。
  // 當 Game 內部某個按鈕呼叫 resetGame() 時，key 會 +1，
  // GamePage 重新渲染後 Game 拿到「新的 key」，
  // React 就會把它視為全新的 instance，重建一個帶著初始 state 的 Game。
  return <Game key={key} resetGame={() => setKey(key + 1)} />;
}
```

## 常見陷阱

!!! warning "絕對不要在 render 當下即時產生 key"

    key 用起來很直觀，但有一個一定要避開的 anti-pattern（反面模式）：**永遠不要在渲染的當下即時（on the fly）產生 key**。

    在 `.map()` 裡寫 `key={Math.random()}` 或 `key={crypto.randomUUID()}` 會直接摧毀 key 存在的意義——因為清單每 render 一次，每個項目就會拿到一個「全新的 key」。這樣一來 React 永遠配對不上前後兩次的項目，只好把整份清單全部重建，不但失去效能優化，還可能弄丟每個項目原本的 state。

    ```jsx
    function TodoList() {
      return (
        <ul>
          {todos.map((todo) => (
            // 千萬別這樣做：在 render 當下即時產生 key
            <li key={crypto.randomUUID()}>{todo.task}</li>
          ))}
        </ul>
      );
    }
    ```

    正確做法如前面範例所示：key 應該從 **資料本身** 推導出來（例如 `todo.id`），而不是每次渲染臨時生成。注意：用 `crypto.randomUUID()` 在「定義資料時」產生 id 是沒問題的，問題只在於「render 時才產生」。

!!! warning "把陣列 index 當 key 可能造成錯亂"

    當清單會發生刪除、插入或重新排序時，用 index 當 key 很危險。因為 index 綁定的是「位置」而不是「項目本身」：假設你刪掉清單第一項，原本 index 為 1、2 的項目會遞補成 0、1，於是 React 會誤以為「index 0 的項目只是內容變了」，而不是「第一項被移除了」。這會讓 component 內部的 state 錯位、對不上正確的資料，產生令人困惑的 bug。只有在清單「固定不變」時，用 index 當 key 才安全。

## 練習

1. 閱讀 React 官方文件中關於 key 的段落：Rendering Lists 一章的〈Keeping list items in order with key〉（保持清單項目順序）。重點理解「為什麼 key 要在資料層級提供」以及「index 當 key 的風險」。
2. 觀看一支短片，示範「把 index 當 key」為什麼是 anti-pattern：搜尋 YouTube 影片 `xlPxnc5uUPQ`（React key using index as an anti-pattern）。看完後試著自己說出：當清單被重新排序時，用 index 當 key 會發生什麼事。

## 原文與延伸資源

- 原文：[Keys In React](https://www.theodinproject.com/lessons/node-path-react-new-keys-in-react)
- 本課引用：
    - React 官方文件〈Rendering Lists〉— Keeping list items in order with key：`https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key`
    - MDN `crypto.randomUUID()`：`https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID`

---

> 本講義改寫自 The Odin Project《Keys In React》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
