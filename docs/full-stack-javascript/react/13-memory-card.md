---
title: 專案：記憶翻牌
source_url: https://www.theodinproject.com/lessons/node-path-react-new-memory-card
source_file: vendor/curriculum/react/states_and_effects/project_memory_card.md
path: full-stack-javascript
course: React
order: 13
status: draft
generated: 2026-07-03
---

# 專案：記憶翻牌

> 改寫自 The Odin Project：[Project: Memory Card](https://www.theodinproject.com/lessons/node-path-react-new-memory-card)
> ｜Full Stack JavaScript › React › States And Effects

## 核心概念

這個專案要你做一個「記憶翻牌（Memory Card）」小遊戲，把 States And Effects 這一整章學到的東西一次用上。重點有兩個：一是用 **effect** 從外部 API 抓資料（例如卡片圖片），二是用 **state（狀態）** 追蹤分數與遊戲進行的狀況。做完你會很清楚 hook 在真實情境裡怎麼分工。

### 遊戲怎麼玩

畫面上排著一組卡片，每張卡片是一張圖（外加可有可無的文字）。規則是：

- 玩家每點一張**沒點過**的卡，目前分數（current score）就 +1。
- 只要點到**已經點過**的卡，這一局就結束，目前分數歸零。
- 每點一次，卡片就重新洗牌、換位置，逼玩家真的靠記憶而不是靠位置。
- 另外要顯示一個最高分（best score），記住你歷來拿過的最高目前分數。

所以玩家的目標是：把每一張卡都剛好點過一次、不重複，就能拿到滿分。

### 用 state 決定要追蹤哪些東西

動手前先想清楚「哪些資料會變、要放進 state」。這個遊戲至少需要：

- **cards**：從 API 抓回來的卡片清單（每張含 id、圖片網址等）。
- **currentScore**：目前這一局的分數。
- **bestScore**：歷來最高分。
- **clickedCards**：記住這一局已經點過哪些卡（可以存一組 id）。

判斷「這張點過沒有」，就是看它的 id 在不在 `clickedCards` 裡。沒點過 → 加進去、分數 +1；點過了 → 這局結束，比較並更新 `bestScore`，再把 `currentScore` 與 `clickedCards` 清空重來。

### 用 effect 從 API 抓卡片資料

卡片的圖片要從外部 API 取得（例如 [PokéAPI](https://pokeapi.co/) 或 [Giphy](https://giphy.com/)）。「元件一出現在畫面上就去抓一次資料」正是 effect 的典型用途：用 `useEffect`，並把依賴陣列（dependency array）設成空陣列 `[]`，代表這段程式只在元件第一次 mount（掛載）時跑一次。抓回來的資料用 `setCards` 寫進 state，畫面就會自動 render（渲染）出這些卡。

因為 `fetch` 是非同步的，資料還沒回來前 `cards` 會是空的，所以要先給它一個合理的初始值（例如 `[]`），畫面才不會在資料到齊前就出錯。

### 每次點擊都要洗牌

「點一下就重新排列」用一個洗牌函式做。要特別注意：**不要直接改動 state 裡的陣列**。React 的 state 要當成唯讀的，正確做法是先複製一份、在複製品上洗牌，再用 setter 把新陣列寫回去。這樣 React 才偵測得到「陣列變了」而重新 render。

還有一個和上一章呼應的細節：清單裡每張卡都要有穩定且唯一的 `key`（用資料的 id，不要用陣列 index）。洗牌後卡片順序會變，如果 key 用 index，React 會誤以為是同一張卡只是內容換了，動畫與狀態都可能錯亂。

## 程式碼範例

下面是把上述核心串起來的最小骨架：用 `useEffect` 抓一次資料、點擊時判斷輸贏、每次點擊都洗牌並更新分數。

```jsx
// src/App.jsx
import { useState, useEffect } from "react";

function App() {
  const [cards, setCards] = useState([]);        // API 抓回來的卡片
  const [clickedCards, setClickedCards] = useState([]); // 這局點過的 id
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // 只在第一次 mount 時抓一次資料（依賴陣列為空）
  useEffect(() => {
    async function fetchCards() {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=8");
      const data = await res.json();
      // 把每筆整理成 { id, name }，這裡用名字當作卡片內容
      setCards(data.results.map((p, i) => ({ id: i, name: p.name })));
    }
    fetchCards();
  }, []); // 空陣列 = 不重跑

  // 複製一份再洗牌，不直接改動 state 裡的陣列
  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]]; // 交換位置
    }
    return copy;
  }

  function handleClick(id) {
    if (clickedCards.includes(id)) {
      // 點到點過的卡 → 這局結束，更新最高分並重來
      setBestScore((best) => Math.max(best, currentScore));
      setCurrentScore(0);
      setClickedCards([]);
    } else {
      // 點到新卡 → 記下來、分數 +1
      setClickedCards([...clickedCards, id]);
      setCurrentScore((score) => score + 1);
    }
    setCards(shuffle(cards)); // 不論輸贏，每次點擊都洗牌
  }

  return (
    <div>
      <p>目前分數：{currentScore}　最高分：{bestScore}</p>
      <div className="board">
        {cards.map((card) => (
          <button key={card.id} onClick={() => handleClick(card.id)}>
            {card.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
```

真正動手時，你會把單張卡片拆成獨立的 `Card` 元件、把記分板拆成 `Scoreboard` 元件，透過 props（屬性）把資料與 `onClick` 傳下去，讓 `App` 只負責管 state。上面的骨架只是先把「抓資料、洗牌、算分」這三件核心邏輯放在一起讓你看懂流程。

## 常見陷阱

!!! warning "useEffect 沒給依賴陣列，抓資料變無限迴圈"
    如果 `useEffect(() => { fetch... })` 沒帶第二個參數，它會在每次 render 後都重跑；而抓回資料 `setCards` 又觸發 render，於是不停地抓、不停地重畫。只想抓一次，就一定要傳空陣列 `[]` 當依賴陣列。

!!! warning "直接改動 state 陣列，畫面不會更新"
    像 `cards.sort(...)` 或 `clickedCards.push(id)` 是就地改動原陣列，React 認為「參考沒變」而不重新 render。務必先用 `[...cards]` 複製，或用 `[...clickedCards, id]` 產生新陣列，再交給 setter。

!!! warning "用陣列 index 當 key，洗牌後畫面錯亂"
    卡片會不斷重新排序，若 `key={index}`，React 會把「換到這個位置的另一張卡」誤認成同一張，導致更新對不上。請用資料本身穩定的 id 當 `key`。

!!! warning "資料還沒到就先讀，畫面報錯"
    `fetch` 是非同步的，第一次 render 時 `cards` 還是初始值。把初始值設成 `[]`（而不是 `null` 後直接 `.map`），或在渲染前加個載入判斷，避免讀到 `undefined`。

## 練習

專案的完整需求與部署步驟以原文為準（專案說明更新較頻繁），這裡把主要步驟整理成繁中版：

1. 用 Vite 建立一個新的 React 專案。
2. 先規劃功能與元件：至少要有記分板（顯示目前分數與最高分）、一組卡片，以及一個「每次點擊就把卡片隨機重排」的函式，並在元件 mount 時就先呼叫它排一次。
3. 卡片的圖片與文字要從外部 API 抓（例如 Giphy 或 PokéAPI），用 `useEffect` 在 mount 時取得資料並寫進 state。
4. 實作遊戲規則：點到沒點過的卡就 +1 分並記錄；點到點過的卡就結束這局、更新最高分、分數歸零。
5. 排好資料夾結構、拆好元件，並加上樣式，把成品做得能拿出來炫耀。
6. 一如往常，把專案 push 到 GitHub，別忘了部署上線。

完整的原始要求、可玩的示範與部署細節，請見下方原文連結。

## 原文與延伸資源

- 原文：[Project: Memory Card](https://www.theodinproject.com/lessons/node-path-react-new-memory-card)
- 本課引用：[React 官方文件：`useEffect`](https://react.dev/reference/react/useEffect)、[React 官方文件：`useState`](https://react.dev/reference/react/useState)、API 資料來源 [PokéAPI](https://pokeapi.co/)／[Giphy](https://giphy.com/)

---

> 本講義改寫自 The Odin Project《Project: Memory Card》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
