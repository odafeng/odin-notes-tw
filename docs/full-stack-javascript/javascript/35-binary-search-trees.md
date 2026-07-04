---
title: 專案：二元搜尋樹
source_url: https://www.theodinproject.com/lessons/javascript-binary-search-trees
source_file: vendor/curriculum/javascript/computer_science/project_binary_search_trees.md
path: full-stack-javascript
course: JavaScript
order: 35
generated: 2026-07-03
---

# 專案：二元搜尋樹

> 改寫自 The Odin Project：[Project: Binary Search Trees](https://www.theodinproject.com/lessons/javascript-binary-search-trees)
> ｜Full Stack JavaScript › JavaScript › A Bit of Computer Science

## 核心概念

這個專案要你親手實作一棵**平衡二元搜尋樹（balanced binary search tree，平衡 BST）**，並把常見的操作（查找、插入、刪除、走訪、求高度與深度、檢查平衡、重新平衡）都補齊。以下先把要用到的觀念一次講清楚，讓你不必回頭翻理論就能開工。

### 什麼是二元搜尋樹

二元搜尋樹是一種樹狀資料結構，每個 node（節點）最多有兩個子節點：左子節點與右子節點。它的關鍵性質是 **BST property（搜尋樹性質）**：

> 對於任一節點，它左子樹裡的每個值都比它小，右子樹裡的每個值都比它大。

樹最上面的節點叫 **root node（根節點）**，沒有任何子節點的節點叫 **leaf node（葉節點）**。因為左小右大這條規則，查找一個值時你可以像二分搜尋一樣，每往下一層就排除掉一半的資料，這就是「搜尋樹」名字的由來。

本專案要求**不允許重複值（duplicate value）**。重複值會讓插入與刪除的規則變得曖昧，也讓平衡更難維持，所以在建樹前要先去除重複，插入時也要先檢查值是否已存在。

### 為什麼要「平衡」

BST 的查找、插入、刪除之所以快，前提是樹夠「矮」。理想情況下這些操作是 **O(log n)** 的 complexity（複雜度），因為每往下一層就砍掉一半節點。

但如果你把已排序的資料一個一個插入，樹會退化成一條斜線（每個節點只有右子節點），高度變成 n，操作就退化成 **O(n)**，跟用陣列線性掃描沒兩樣。

**平衡**的定義是：對樹中的**每一個節點**，它左子樹與右子樹的高度差不超過 1，而且左右子樹本身也都是平衡的。平衡的樹高度大約是 log₂(n)，才能保住 O(log n) 的效能。這也是為什麼下面所有操作都要求你**走訪節點、操作節點之間的連結**，而不是偷懶回頭去改原本那個輸入陣列——陣列的插入／刪除是 O(n)，會白白浪費掉樹的效能優勢。

### 從排序陣列建出平衡的樹

要一次建出平衡的樹，最乾淨的做法是：**先把陣列排序並去重，再用遞迴（recursion）不斷取「中間元素」當根**。

思路（改寫自 GeeksforGeeks「Sorted Array to Balanced BST」）：

1. 傳入一個排序好的子陣列範圍 `start`～`end`。
2. **base case（終止條件）**：如果 `start > end`，範圍已空，回傳 `null`。
3. 取中間索引 `mid = Math.floor((start + end) / 2)`，用 `array[mid]` 造一個節點當這一層的根。
4. 遞迴處理左半段 `start`～`mid - 1`，回傳值接到 `node.left`。
5. 遞迴處理右半段 `mid + 1`～`end`，回傳值接到 `node.right`。

取中間元素當根，可以保證左右兩邊的元素數量大致相等，樹自然就平衡了。整個建樹是 O(n)，因為每個元素只被處理一次。`buildTree()` 最後回傳的是第 0 層的 root node，`Tree` 的 `root` 屬性就設成這個回傳值。

### Node 與 Tree 的結構

- **`Node`**：最單純的資料容器，帶三個屬性——`data`（存的值）、`left`、`right`（兩個子節點，預設 `null`）。可以用 class（類別）或 factory function（工廠函式）實作。
- **`Tree`**：初始化時接收一個陣列，內部呼叫 `buildTree()` 產生 root，並把樹的各種操作方法掛在上面。`buildTree()` 建議設成**私有**（用 class 的私有方法，或工廠模式裡不 return 出去），因為它只是初始化用的內部工具。

### 查找、插入與刪除

- **`includes(value)`**：從 root 出發，比 root 小就往左、比 root 大就往右，一路走到找到（回傳 `true`）或走到 `null`（回傳 `false`）。
- **`insert(value)`**：跟查找一樣往下找空位。走到某個 `null` 的位置就把新節點掛上去；途中若遇到值已存在，直接什麼都不做（維持不重複）。插入要維持 BST property，不能破壞左小右大。
- **`deleteItem(value)`**：刪除最麻煩，要分三種情況處理被刪節點的子節點數：
  1. **葉節點（無子節點）**：直接把它從父節點斷開（設為 `null`）。
  2. **只有一個子節點**：把那個唯一的子節點提上來，接到父節點原本指向被刪節點的位置。
  3. **有兩個子節點**：找出它的 **in-order successor（中序後繼）**——也就是右子樹裡的最小值（一路往右子樹的最左邊走）。用這個後繼的值覆蓋被刪節點的值，然後再去右子樹把那個後繼節點刪掉（後繼節點最多只有一個右子節點，會落回前兩種簡單情況）。

若要刪的值根本不在樹裡，函式什麼都不做。

### 走訪：廣度優先與深度優先

專案要你實作四種走訪，全部設計成接收一個 **callback（回呼函式）**，走訪時把**每個值（不是節點本身）**傳給 callback，用法類似 `Array.prototype.forEach()`。四個函式若呼叫時**沒有提供 callback，都要 `throw` 一個 Error**，明確告知需要 callback。

- **`levelOrderForEach(callback)`**：**廣度優先（breadth-first）**，一層一層由上往下、由左到右走。實作重點是用一個**陣列當 queue（佇列）**：先把 root 推進去，然後不斷從佇列前端取出節點、對它的值呼叫 callback，再把它的左右子節點推進佇列尾端，直到佇列清空。這種先進先出的順序自然產生層序走訪。（也可以用遞迴實作，可以兩種都試試看。）
- **深度優先（depth-first）三種**，都是遞迴走訪，差別只在「什麼時候處理當前節點」：
  - **`inOrderForEach`（中序）**：左 → 根 → 右。對 BST 來說，中序走訪會**由小到大依序輸出所有值**（這也是 `rebalance()` 要用的性質）。
  - **`preOrderForEach`（前序）**：根 → 左 → 右。
  - **`postOrderForEach`（後序）**：左 → 右 → 根。

### 高度、深度與平衡

- **`height(value)`**：先找到含這個值的節點，回傳它的**高度**——從該節點到最深葉節點的**最長路徑上的邊數（edge，邊）**。葉節點高度為 0。值不存在時回傳 `undefined`。
- **`depth(value)`**：回傳含這個值的節點的**深度**——從 root 到該節點的**路徑邊數**。root 深度為 0。值不存在時回傳 `undefined`。

（記法：高度是「往下看到底有幾層邊」，深度是「往上回到 root 有幾層邊」。）

- **`isBalanced()`**：檢查整棵樹是否平衡。務必對**每一個節點**檢查「左右子樹高度差 ≤ 1」，且左右子樹本身也平衡——只比對 root 左右兩邊是不夠的。
- **`rebalance()`**：把一棵歪掉的樹重新變平衡。做法很直接：用一次**中序走訪**收集所有值成一個已排序陣列，再丟回 `buildTree()` 重建一棵平衡的樹。

### `throw` 的正確用法

依 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw)，`throw` 語句會拋出例外並中斷當前函式，控制權交給呼叫堆疊中第一個 `catch`。雖然語法上你能拋任何值，但**慣例是拋一個 `Error` 物件**（或其子類別如 `TypeError`），因為接手的程式碼通常會讀取 `error.message` 這類屬性。所以走訪函式缺少 callback 時，寫 `throw new Error('需要提供 callback')` 而不是 `throw '...'`。

## 程式碼範例

以下示範 `Node`、`buildTree()` 與 `levelOrderForEach()` 的最小可執行片段，讓你抓到骨架；其餘方法請自行補上。

```javascript
// Node：單純的資料容器
class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

// 由排序去重後的陣列，遞迴取中間元素建平衡樹
function buildTree(array) {
  // 先排序（數字用比較函式）再去重
  const sorted = [...new Set(array)].sort((a, b) => a - b);

  const build = (start, end) => {
    if (start > end) return null;          // base case：範圍為空
    const mid = Math.floor((start + end) / 2);
    const node = new Node(sorted[mid]);    // 中間元素當這一層的根
    node.left = build(start, mid - 1);     // 左半段 → 左子樹
    node.right = build(mid + 1, end);      // 右半段 → 右子樹
    return node;
  };

  return build(0, sorted.length - 1);      // 回傳第 0 層 root node
}

class Tree {
  constructor(array) {
    this.root = buildTree(array);          // root 用 buildTree 的回傳值
  }

  // 廣度優先：用陣列當 queue（佇列）
  levelOrderForEach(callback) {
    if (typeof callback !== 'function') {
      throw new Error('levelOrderForEach 需要一個 callback');
    }
    if (this.root === null) return;

    const queue = [this.root];             // 先把 root 放進佇列
    while (queue.length > 0) {
      const node = queue.shift();          // 取出佇列最前端
      callback(node.data);                 // 把「值」交給 callback
      if (node.left) queue.push(node.left);   // 子節點排進佇列尾端
      if (node.right) queue.push(node.right);
    }
  }
}

// prettyPrint：把樹以結構化格式印到 console，node 傳入 tree.root
const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null || node === undefined) return;
  prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
};

// 試跑
const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
prettyPrint(tree.root);

const values = [];
tree.levelOrderForEach((value) => values.push(value));
console.log(values.join(' ')); // 依層序輸出所有值
```

## 常見陷阱

!!! warning "只比對 root 的左右子樹，就宣稱平衡"
    `isBalanced()` 最常見的錯誤是只看 root 左右兩邊的高度差。這不夠——平衡的定義要求**樹裡每一個節點**都滿足高度差 ≤ 1。root 兩邊高度可能相同，但某個深處的子樹早就歪掉了。要對每個節點遞迴檢查。

!!! warning "忘了排序與去重就建樹"
    `buildTree()` 的平衡性建立在「輸入是排序好的」這個前提上。若沒先 `sort()`，取中間元素當根不會產生 BST；若沒去除重複值，會建出破壞不重複規定的樹。記得先 `[...new Set(array)].sort((a, b) => a - b)`，而且**排序數字一定要傳比較函式**，否則 `sort()` 會按字串字典序排（`23` 會排在 `100` 前面之類）。

!!! warning "刪除有兩個子節點時，用錯替補節點"
    刪除雙子節點的節點時，要用 **in-order successor（右子樹的最小值）** 或 in-order predecessor（左子樹的最大值）來替補，才能維持 BST property。隨便把某個子節點提上來會破壞左小右大。找到後繼後，別忘了還要回到右子樹把那個後繼節點本身刪掉。

!!! warning "混淆 height 與 depth，或多算／少算邊數"
    height 是「往下」到最深葉節點的邊數，depth 是「往上」到 root 的邊數，兩者方向相反。而且算的是**邊（edge）數不是節點數**：葉節點 height 為 0、root 的 depth 為 0。用節點數會整體多 1。

!!! warning "走訪缺 callback 時沒有 throw"
    四個走訪函式在沒收到 callback 時都必須 `throw new Error(...)`，而不是默默回傳或報 `undefined is not a function`。而且要拋 `Error` 物件而非字串，讓呼叫端能讀 `.message`。

## 練習

這是一個 project（專案）課，完整需求以原文為準（原文可能更新）。以下把 Assignment 整理成繁中步驟，方便你逐項打勾：

1. **`Node`**：建立一個帶 `data`、`left`、`right` 的 class 或 factory。
2. **`Tree`**：初始化時接收陣列，設一個 `root` 屬性，值來自 `buildTree()`。
3. **`buildTree(array)`**：接收數字陣列，**先排序、去重**，再遞迴取中間元素建平衡樹，回傳第 0 層 root node。可設為私有，只在初始化時呼叫。
4. **`includes(value)`**：值在樹中回傳 `true`，否則 `false`。
5. **`insert(value)`**：插入新值並維持 BST property；值已存在則什麼都不做。
6. **`deleteItem(value)`**：刪除指定值，處理葉節點／單子節點／雙子節點三種情況；值不存在則什麼都不做。
7. **`levelOrderForEach(callback)`**：廣度優先層序走訪，用陣列當 queue，把每個**值**傳給 callback；無 callback 就 `throw`。可試著同時用迭代與遞迴各寫一版。
8. **`inOrderForEach` / `preOrderForEach` / `postOrderForEach`**：三種深度優先走訪，同樣傳值給 callback、缺 callback 就 `throw`。
9. **`height(value)`**：回傳含該值節點的高度（到葉節點的最長路徑邊數）；找不到回傳 `undefined`。
10. **`depth(value)`**：回傳含該值節點的深度（到 root 的路徑邊數）；找不到回傳 `undefined`。
11. **`isBalanced()`**：對**每個節點**檢查左右子樹高度差 ≤ 1 且子樹皆平衡。
12. **`rebalance()`**：用中序走訪取得排序陣列，丟回 `buildTree()` 重建平衡樹。

**串起來的 driver script（駕駛程式）**：

1. 用一組小於 100 的隨機數建一棵 BST。
2. 呼叫 `isBalanced()` 確認平衡。
3. 依 level、pre、post、in 四種順序印出所有元素。
4. 加入幾個大於 100 的數把樹弄歪。
5. 再呼叫 `isBalanced()` 確認已不平衡。
6. 呼叫 `rebalance()` 重新平衡。
7. 再次 `isBalanced()` 確認平衡。
8. 再依四種順序印出所有元素。

完整專案規格請見原文：[Project: Binary Search Trees](https://www.theodinproject.com/lessons/javascript-binary-search-trees)。

## 原文與延伸資源

- 原文：[Project: Binary Search Trees](https://www.theodinproject.com/lessons/javascript-binary-search-trees)
- 本課引用：
  - [GeeksforGeeks：Sorted Array to Balanced BST](https://www.geeksforgeeks.org/sorted-array-to-balanced-bst/)（`buildTree()` 的遞迴取中間元素法）
  - [GeeksforGeeks：Insertion in Binary Search Tree](https://www.geeksforgeeks.org/insertion-in-binary-search-tree/)
  - [GeeksforGeeks：Binary Search Tree Delete](https://www.geeksforgeeks.org/binary-search-tree-set-2-delete/)
  - [MDN：throw statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw)
  - [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)（BST 與陣列各操作的複雜度對照）

---

> 本講義改寫自 The Odin Project《Project: Binary Search Trees》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
