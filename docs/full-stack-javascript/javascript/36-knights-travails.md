---
title: 專案：Knights Travails
source_url: https://www.theodinproject.com/lessons/javascript-knights-travails
source_file: vendor/curriculum/javascript/computer_science/project_knights_travails.md
path: full-stack-javascript
course: JavaScript
order: 36
status: draft
generated: 2026-07-03
---

# 專案：Knights Travails

> 改寫自 The Odin Project：[Project: Knights Travails](https://www.theodinproject.com/lessons/javascript-knights-travails)
> ｜Full Stack JavaScript › JavaScript › A Bit of Computer Science

## 核心概念

### 專案目標

西洋棋裡的騎士（knight，也就是「馬」）走的是 L 形：往一個方向走兩格、再往垂直方向走一格。在標準 8×8 棋盤上，只要步數夠，騎士能從任一格走到任一格。

這個專案要你寫一個函式 `knightMoves(start, end)`，回傳騎士從 `start` 走到 `end` 的**最短路徑**，而且要把沿途停留的每一格都列出來。座標用 `[x, y]` 表示，`x` 與 `y` 都介於 `0` 到 `7`。例如：

```
knightMoves([0,0], [1,2]) // 回傳 [[0,0], [1,2]]
```

注意：這裡不需要畫任何 GUI（圖形介面），純粹是演算法問題。

### 把棋盤看成 graph（圖）

這一課的關鍵，是把問題**翻譯成 graph（圖）**這個資料結構：

- 棋盤上**每一格**都是一個 vertex（頂點，也叫 node 節點）。
- 騎士從某格能合法走到的格子，就是這個 vertex 連出去的 edge（邊）。

於是「找騎士的最短走法」就變成經典的 graph traversal（圖遍歷）問題：從起點 vertex 走到終點 vertex，找出最短的一條路徑。

graph 和你上一課碰過的 binary tree（二元樹）很像，但不完全一樣。最大的差別是：tree 是階層式、沒有環的；graph 卻可能**繞回原地**——同一格可以透過好幾條不同路徑抵達。這個差別待會會直接影響到寫法。

### 隱式圖（implicit graph）：不用真的建出來

你可能會想：那我是不是要先建一個包含 64 個 vertex、每個 vertex 記著它所有 edge 的物件？**不需要。**

這裡用的是 **implicit graph（隱式圖）**的概念：圖是「隱含存在」的，你不用事先把它存成一個資料結構。騎士站在某一格時，你只要當場「算出」它能走到哪些格子（也就是即時產生 edge），演算法邊走邊探索就好。

具體來說，騎士從 `[x, y]` 出發，有 8 種可能的走法（往八個 L 形方向）。把這 8 個位移量列成一張表，套在目前位置上，就能算出所有下一步：

```
[ 2, 1], [ 2,-1], [-2, 1], [-2,-1],
[ 1, 2], [ 1,-2], [-1, 2], [-1,-2]
```

算出來之後要**過濾掉出界的**（`x` 或 `y` 跑到 0–7 之外的）格子，剩下的就是這個 vertex 真正合法的 edge。

### 為什麼用 BFS，不用 DFS

上一課你學過兩種遍歷法：BFS（Breadth-First Search，廣度優先搜尋）和 DFS（Depth-First Search，深度優先搜尋）。這題該用哪個？

答案是 **BFS**。原因是我們要的是**最短路徑**：

- **BFS** 一層一層地往外擴。先看走 1 步能到的所有格子，再看走 2 步能到的，再走 3 步……因此**第一次碰到終點時，走的步數保證是最少的**。這正是我們要的。
- **DFS** 沿著一條路一路走到底才回頭。它不保證先找到的是最短路徑；更糟的是，在這種可以繞圈的 graph 上，DFS 可能一路 `[0,0] → [2,1] → [0,0] → [2,1] …` 無限繞下去，變成一個「可能無限的序列」，永遠停不下來。

所以這題選 BFS。原文的提示「其中一個可能是無限序列」講的就是 DFS 這個坑。

### BFS 需要的三樣東西

要在棋盤上跑 BFS，你需要：

1. **一個 queue（佇列）**：先進先出（FIFO）。它記住「接下來要探索哪些格子」。BFS 之所以能一層一層擴，靠的就是 queue 的 FIFO 特性——先放進去的（比較早、比較近的格子）會先被拿出來處理。
2. **記錄走過的格子（visited）**：因為 graph 會繞回原地，如果不記錄哪些格子已經拜訪過，同一格會被重複塞進 queue，輕則浪費效能，重則無限迴圈。tree 沒有這問題（往下走不會回頭），但 graph 一定要做這件事。
3. **記住每一格是「從哪裡來的」（前驅 / parent）**：BFS 找到終點時，你知道「幾步到」了，但還要能回頭把整條路徑印出來。做法是：每次把一個新格子放進 queue 時，記住它的上一格是誰。找到終點後，順著「上一格」的鏈條一路回溯到起點，再反轉，就是完整路徑。

### 整體流程

把上面拼起來，`knightMoves` 的邏輯是：

1. 把起點放進 queue，並標記為已拜訪。起點的路徑就是 `[[start]]`（只有它自己）。
2. 從 queue 前端取出一格 `current`。
3. 如果 `current` 就是終點，回傳它的路徑，結束。
4. 否則，算出 `current` 的所有合法下一步（8 種走法、過濾出界、跳過已拜訪過的）。
5. 把每個合法且沒走過的下一步標記為已拜訪、記下路徑（目前路徑再接上這一格），放進 queue 尾端。
6. 回到第 2 步，直到 queue 空了或找到終點。

因為 BFS 是逐層擴張，第一次取到終點時就是最短路徑。

一個小提醒：有時候**最短路徑不只一條**。例如 `knightMoves([0,0],[3,3])` 可能回傳 `[[0,0],[2,1],[3,3]]`，也可能回傳 `[[0,0],[1,2],[3,3]]`——兩條都是 2 步，都正確。只要符合規則、步數最少即可，不必和範例逐字相同。

## 程式碼範例

下面是一個最小可執行的 BFS 版本。這裡用「每個 queue 元素自己帶著完整路徑」的寫法，最直觀好懂：

```js
// 騎士的 8 種 L 形位移
const MOVES = [
  [2, 1], [2, -1], [-2, 1], [-2, -1],
  [1, 2], [1, -2], [-1, 2], [-1, -2],
];

// 判斷座標是否還在 8x8 棋盤內
function isOnBoard([x, y]) {
  return x >= 0 && x <= 7 && y >= 0 && y <= 7;
}

// 算出某一格所有「在盤內」的合法下一步
function nextMoves([x, y]) {
  return MOVES
    .map(([dx, dy]) => [x + dx, y + dy])
    .filter(isOnBoard);
}

function knightMoves(start, end) {
  // queue 裡放的是「從起點到目前這格的完整路徑」
  const queue = [[start]];
  // 用字串 "x,y" 當 key 記錄拜訪過的格子
  const visited = new Set([start.join(",")]);

  while (queue.length > 0) {
    const path = queue.shift();           // FIFO：取出最早放進來的路徑
    const current = path[path.length - 1]; // 這條路徑目前站在哪一格

    // 找到終點：這一定是最短路徑（BFS 逐層擴張的保證）
    if (current[0] === end[0] && current[1] === end[1]) {
      return path;
    }

    for (const move of nextMoves(current)) {
      const key = move.join(",");
      if (!visited.has(key)) {   // 沒走過才處理，避免繞圈
        visited.add(key);
        queue.push([...path, move]); // 延長路徑，放進 queue 尾端
      }
    }
  }

  return null; // 8x8 棋盤上其實不會發生，任兩格都連得到
}

// 依原文格式印出結果
function printKnightMoves(start, end) {
  const path = knightMoves(start, end);
  console.log(`You made it in ${path.length - 1} moves! Here's your path:`);
  path.forEach((square) => console.log(`  [${square}]`));
}

// 試跑
console.log(knightMoves([0, 0], [1, 2])); // [[0,0],[1,2]]
console.log(knightMoves([0, 0], [3, 3])); // 2 步的其中一條最短路徑
printKnightMoves([3, 3], [4, 3]);
```

`visited` 用 `Set` 存 `"x,y"` 這種字串是常見技巧：JavaScript 裡陣列 `[2,1]` 和 `[2,1]` 是兩個不同物件，用 `Set` 或 `includes` 直接比會失效，所以先轉成字串再比對。

## 常見陷阱

!!! warning "讓走法跑出棋盤外"
    8 種位移量套上去後，一定要用 `isOnBoard` 過濾掉 `x` 或 `y` 落在 0–7 之外的格子。忘了過濾，路徑就會出現不存在的座標（例如 `[-1, 8]`），甚至讓後續計算出錯。

!!! warning "沒有記錄 visited，導致無限繞圈或爆量"
    graph 和 tree 不同，可以繞回原地。若不用 `visited` 記下走過的格子，同一格會被反覆放進 queue，路徑數量爆炸性成長，程式卡死或非常慢。標記時機也要對——**放進 queue 的當下就標記**，而不是等取出來才標記，否則同一格可能在被處理前被重複加入好幾次。

!!! warning "改用 DFS 找最短路徑"
    DFS 不保證先找到的是最短路徑，而且在可繞圈的 graph 上可能無限深入下去。這題請用 BFS：它逐層擴張，第一次碰到終點就是最少步數。

!!! warning "只回傳步數，忘了重建整條路徑"
    專案要求輸出**沿途每一格**，不是只回報「幾步到」。務必在 BFS 過程中保留路徑資訊——像範例那樣讓 queue 元素帶著完整路徑，或另外用一個 `predecessor`（前驅）表記錄每格是從哪來的，最後回溯重建。

!!! warning "用 == 或 includes 直接比較座標陣列"
    `[2,1] === [2,1]` 在 JavaScript 是 `false`（比的是參考，不是內容）。比較座標、判斷是否到終點、查 visited 時，要嘛逐一比 `x`、`y`，要嘛先轉成 `"x,y"` 字串再比。

## 練習

這是一個 project（專案）課，最終需求以原文為準（原文可能更新），請以官方說明為主，本節僅把重點步驟整理成中文：

1. **確立規則**：想清楚棋盤範圍（0–7）與騎士的 L 形走法，確保產生的每一步都合法。
2. **選對資料結構表示走法**：從任一格都有多種下一步，選一個好操作的結構（例如位移量陣列）來產生它們，並記得**濾掉出界的走法**。
3. **選對搜尋演算法**：判斷這題該用 BFS 還是 DFS。提示——其中一種可能變成無限序列。這題要的是最短路徑，選能保證最短的那個。
4. **實作 `knightMoves(start, end)`**：用選定的演算法找出起點到終點的最短路徑，並**輸出完整路徑**。原文期望的輸出格式範例：

   ```
   > knightMoves([3,3],[4,3])
   => You made it in 3 moves! Here's your path:
     [3,3]
     [4,5]
     [2,4]
     [4,3]
   ```

完整專案說明、範例與注意事項（包含「多條最短路徑皆可」的細節），請見原文：[Project: Knights Travails](https://www.theodinproject.com/lessons/javascript-knights-travails)。

## 原文與延伸資源

- 原文：[Project: Knights Travails](https://www.theodinproject.com/lessons/javascript-knights-travails)
- 本課引用：
  - Khan Academy — [Describing Graphs](https://www.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/describing-graphs)（graph 基礎術語：vertex、edge）
  - Khan Academy — [Representing Graphs](https://www.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/representing-graphs)（在程式裡表示 graph 的方式）
  - MDN — [Array.prototype.shift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)（實作 queue 的取出操作）
  - MDN — [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)（記錄 visited 的常用結構）

---

> 本講義改寫自 The Odin Project《Project: Knights Travails》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
