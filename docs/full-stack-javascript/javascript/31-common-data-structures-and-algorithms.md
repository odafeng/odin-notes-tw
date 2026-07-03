---
title: 常見資料結構與演算法
source_url: https://www.theodinproject.com/lessons/javascript-common-data-structures-and-algorithms
source_file: vendor/curriculum/javascript/computer_science/common_data_structures_algorithms.md
path: full-stack-javascript
course: JavaScript
order: 31
status: draft
generated: 2026-07-03
---

# 常見資料結構與演算法

> 改寫自 The Odin Project：[Common Data Structures and Algorithms](https://www.theodinproject.com/lessons/javascript-common-data-structures-and-algorithms)
> ｜Full Stack JavaScript › JavaScript › A Bit of Computer Science

## 核心概念

### 為什麼要學資料結構

**data structure（資料結構）** 的核心想法很單純：用「最適合你這個應用需求」的方式把資料存起來。你可能習慣把所有東西都塞進一個巨大的 Array（陣列），但當資料量一大、巢狀又深時，光是要「找到某個特定值」就會慢到令人受不了。

不同的資料結構之間，差別幾乎都圍繞著三個 **trade-off（取捨）**：

1. 第一次把資料「填進」結構要花多久。
2. 之後「新增」或「查找」一個元素要花多久。
3. 這個結構在記憶體裡佔多大。

沒有哪一種結構「永遠最好」。有的加快查找卻吃更多記憶體，有的插入很快但隨機存取很慢。學資料結構，就是為了讓你在「Array、Hash（雜湊）、Set 都不夠用」的時候，手上有更對的工具。事實上有一句常被引用的話：資料結構的選擇對效率的影響，往往比演算法的選擇還要大。

### 從 Array 說起，以及它的限制

Array 把元素排成一列，用整數 index（索引）存取。它在記憶體中是「連續配置」的一塊空間，所以只要知道 index，就能用簡單的位址計算「一步」拿到值，隨機存取非常快。代價是：當它需要擴充、或要在中間插入 / 刪除元素時，往往得搬動後面一大串資料。這正是其他結構想改善的地方。

### Linked list（連結串列）與 node（節點）

**linked list（連結串列）** 是一種線性結構，但它不像 Array 那樣連續擺放。它由一連串 **node（節點）** 串起來，每個 node 裝兩樣東西：

- 一個 **value（值）**，也就是你要存的資料。
- 一個 **reference（參照 / 指標）**，指向「下一個 node」。

從第一個 node（稱為 head，頭）沿著參照一路往下走，就能走遍整串資料；最後一個 node 的參照指向 `null`，代表結束。

linked list 的強項是**插入與刪除**：想在中間插一個 node，只要改幾個參照就好，不必像 Array 那樣搬動其他元素。它的弱點則是**隨機存取慢**：你沒辦法「直接跳到第 5 個」，必須從 head 一個一個數過去。所以「什麼是 linked list？什麼是 node？」的答案就是：linked list 是由 node 串成的線性結構，而 node 是「值 + 指向下一個節點的參照」的最小單位。

### Stack（堆疊）與 Queue（佇列）

這兩個是最常見、也最容易搞混的一對結構。它們的差別只在於「元素進出的順序規則」。

**Stack（堆疊）** 遵循 **LIFO（Last In, First Out，後進先出）**。想像一疊盤子：你只能往最上面放，也只能從最上面拿。它有兩個核心操作：

- **push**：把元素放到最上面（頂端）。
- **pop**：把最上面的元素拿走。

最新放進去的，會最先被拿出來。函式呼叫的「call stack（呼叫堆疊）」、編輯器的 undo（復原）功能，背後都是 stack。

**Queue（佇列）** 遵循 **FIFO（First In, First Out，先進先出）**。想像排隊買票：先來的先服務，新來的排到最後面。它的兩個核心操作，也就是 knowledge check 會問到的 **enqueue 與 dequeue 屬性**：

- **enqueue**：把元素加到「尾端（rear）」。
- **dequeue**：把「前端（front）」的元素移除。

所以「stack 和 queue 差在哪？」：stack 是 LIFO（從同一端進出），queue 是 FIFO（一端進、另一端出）。這個順序差異，稍後會直接決定樹的兩種走訪方式。

### Hash table（雜湊表）

**hash table（雜湊表）** 讓你用「key（鍵）」快速取「value」。它透過一個 **hash function（雜湊函式）** 把 key 換算成陣列位置，平均而言能達到接近常數時間的存取。JavaScript 裡的 `Object` 與 `Map` 本質上就是 hash table。它的隱憂是 **collision（碰撞）**：不同 key 算到同一個位置，需要用鏈結（chaining）或開放定址（open addressing）等方式化解。

### Tree（樹）與 Binary Search Tree（二元搜尋樹）

**tree（樹）** 是一種階層式結構：node 之間用 **edge（邊）** 相連，最上面那個叫 **root（根）**，往下分出子節點，像一棵倒過來的樹。

**binary search tree（BST，二元搜尋樹）** 是特別有用的一種樹：每個 node 最多有兩個子節點（左、右），而且遵守一條規則——**左子樹的值都比自己小，右子樹的值都比自己大**。這條規則讓「查找」變得很快：從 root 開始，比目標小就往右、比目標大就往左，每一步都能排除掉一整邊，如同在有序資料上做搜尋。

### 為什麼要學演算法

**algorithm（演算法）** 說穿了就是「有系統地解決問題的步驟」。你其實已經寫過（例如 Merge Sort），而排序與**搜尋**是最常見的兩大領域。當你要在龐大資料中找一個特定值時，毫秒必爭，搜尋演算法的品質就變得關鍵。好消息是：這些經典問題前人早就解過無數次，理解「它們是怎麼被解出來的」，能讓你把同樣的思路套用到自己遇到的類似問題上。

### Binary search（二分搜尋）與 divide and conquer（分治）

**binary search（二分搜尋）** 是搜尋演算法的代表。前提是資料**必須先排序好**。做法是：

1. 看**正中間**的元素，和目標比較。
2. 相等 → 找到了。
3. 目標比較小 → 只往「左半邊」繼續找。
4. 目標比較大 → 只往「右半邊」繼續找。
5. 在剩下的半邊重複以上，直到找到、或範圍縮到空。

每比一次就砍掉一半的搜尋範圍，所以時間複雜度是 **O(log n)**——在一百萬筆資料裡，大約 20 次比較就能定位。之所以「一定要排序」，正是因為只有有序時，你才能斷定「目標不可能在被排除的那一半」。

binary search 實作的正是 **divide and conquer（分治）** 這個演算法設計原則：把問題不斷對半切成更小的子問題，逐步逼近答案。這也是 knowledge check「binary search 用了哪種遞迴解題法 / 設計原則」的答案。

### BFS 與 DFS：樹的兩種走訪

要「走訪（traverse）」一棵樹、把每個 node 都看過一遍，有兩大策略。關鍵在於：你會累積一堆「還沒處理、先擱著」的 node，而**你用哪種資料結構來擱置它們，就決定了走訪順序**。

**BFS（Breadth-First Search，廣度優先搜尋）**：一層一層往外掃，先看完同一層的所有 node，再進到下一層。它用 **queue（佇列，FIFO）** 來擱置待處理的 node——先發現的先處理，於是自然形成「由近到遠、逐層擴散」的順序。所以「BFS 用什麼結構暫存 node？」答案是 **queue**。

**DFS（Depth-First Search，深度優先搜尋）**：一條路走到底，撞到底再回頭走另一條分支。它用 **stack（堆疊，LIFO）** 來擱置 node——最後發現的最先深入。實務上 DFS 常直接靠 **recursion（遞迴）** 寫成，而遞迴其實就是借用了程式語言底層的 call stack，本質仍是 stack。所以「DFS 用什麼結構暫存 node？」答案是 **stack**。

一句話記住這組對應：**BFS 配 queue（逐層），DFS 配 stack（走到底）**。

## 程式碼範例

以下範例都可直接貼進 Node.js 或瀏覽器 console 執行。

```javascript
// Stack（堆疊）：LIFO，用陣列的 push / pop 模擬
const stack = [];
stack.push("a");        // 放到頂端
stack.push("b");
stack.push("c");
console.log(stack.pop()); // "c" —— 最後進的最先出
console.log(stack.pop()); // "b"

// Queue（佇列）：FIFO，enqueue 用 push，dequeue 用 shift
const queue = [];
queue.push("a");         // enqueue：加到尾端
queue.push("b");
queue.push("c");
console.log(queue.shift()); // "a" —— dequeue：從前端移除，先進先出
console.log(queue.shift()); // "b"
```

```javascript
// Linked list（連結串列）：每個 node 是「值 + 指向下一個節點的參照」
class Node {
  constructor(value) {
    this.value = value; // 存的資料
    this.next = null;   // 指向下一個 node，沒有就是 null
  }
}

// 手動串起 1 -> 2 -> 3
const head = new Node(1);
head.next = new Node(2);
head.next.next = new Node(3);

// 從 head 沿著 next 走訪整串
let current = head;
while (current !== null) {
  console.log(current.value); // 依序印出 1, 2, 3
  current = current.next;
}
```

```javascript
// Binary search（二分搜尋）：前提是 arr 已排序，回傳 index，找不到回傳 -1
function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2); // 取正中間
    if (arr[mid] === target) {
      return mid;              // 找到
    } else if (arr[mid] < target) {
      low = mid + 1;           // 目標較大，丟掉左半邊
    } else {
      high = mid - 1;          // 目標較小，丟掉右半邊
    }
  }
  return -1;
}

const sorted = [1, 3, 5, 7, 9, 11];
console.log(binarySearch(sorted, 7));  // 3
console.log(binarySearch(sorted, 4));  // -1
```

```javascript
// 二元樹的 BFS 與 DFS：注意兩者只差「用 queue 還是 stack」
const tree = {
  value: 1,
  children: [
    { value: 2, children: [{ value: 4, children: [] }, { value: 5, children: [] }] },
    { value: 3, children: [{ value: 6, children: [] }] },
  ],
};

// BFS：用 queue（shift 從前端取，FIFO）—— 逐層走訪
function bfs(root) {
  const result = [];
  const queue = [root];           // 待處理的 node 暫存在 queue
  while (queue.length > 0) {
    const node = queue.shift();   // 取最早進來的
    result.push(node.value);
    queue.push(...node.children); // 子節點排到尾端
  }
  return result;
}

// DFS：用 stack（pop 從尾端取，LIFO）—— 一路走到底
function dfs(root) {
  const result = [];
  const stack = [root];           // 待處理的 node 暫存在 stack
  while (stack.length > 0) {
    const node = stack.pop();     // 取最後進來的
    result.push(node.value);
    stack.push(...node.children); // 子節點壓入頂端
  }
  return result;
}

console.log(bfs(tree)); // [1, 2, 3, 4, 5, 6] —— 一層一層
console.log(dfs(tree)); // [1, 3, 6, 2, 5, 4] —— 先深入一條分支
```

## 常見陷阱

!!! warning "把 stack 和 queue 記反"
    只要記住兩個英文縮寫就不會錯：stack 是 **LIFO**（後進先出，同一端進出），queue 是 **FIFO**（先進先出，一端進、另一端出）。連帶地：BFS 逐層要用 **queue**，DFS 走到底要用 **stack**。記反了，走訪順序就整個錯掉。

!!! warning "對沒排序的資料用 binary search"
    binary search 每一步都靠「目標不在被排除的那一半」這個保證來砍半，而這個保證**只有在資料已排序時才成立**。若對未排序的陣列硬套 binary search，會回傳錯誤結果卻不報錯，是很難察覺的 bug。

!!! warning "用陣列 shift 模擬 queue 的效能"
    範例用 `Array.prototype.shift()` 當 dequeue，教學上最直觀，但 `shift()` 會把後面所有元素往前搬，屬於 O(n) 操作。資料量大或講究效能時，應改用真正的 linked-list-based queue 或維護頭尾指標，避免每次 dequeue 都付出線性成本。

!!! warning "誤以為 linked list 可以隨機存取"
    linked list 沒有 index，不能「直接跳到第 n 個」。要拿第 n 個元素，得從 head 一個一個 `next` 走過去，是 O(n)。需要頻繁隨機存取時，Array 才是對的選擇；linked list 的優勢在頻繁的插入 / 刪除。

## 練習

以下把原課 Assignment 改寫成中文步驟。影片類資源請直接參考原文連結觀看。

1. 快速瀏覽 [Wikipedia 的 Data Structure 條目](https://en.wikipedia.org/wiki/Data_structure)，對各種資料結構建立高層次的整體印象。
2. 觀看 [Why Study Algorithms](https://www.youtube.com/watch?v=u2TwK3fED8A) 的前 10 分鐘，理解「為什麼值得學演算法」；後半偏數學，有興趣再看。
3. 透過哈佛 CS50 的影片 [how binary search works](https://www.youtube.com/watch?v=DSffdCT5Cx4) 弄懂二分搜尋的運作。
4. 觀看 [how a binary search tree is constructed from an unordered array](https://www.youtube.com/watch?v=FvdPo8PBQtc)，理解 BST 如何從一個無序陣列建立起來。
5. 觀看 [principles of queues and stacks](https://www.youtube.com/watch?v=6QS_Cup1YoI)，掌握 stack 與 queue 的原則——它們正是 DFS 與 BFS 背後的核心結構。
6. 最後，透過這一系列影片理解樹的 BFS 與 DFS 走訪：
   - [Binary tree traversal](https://www.youtube.com/watch?v=9RHO6jU--GU)
   - [Breadth-first traversal](https://www.youtube.com/watch?v=86g8jAQug04)
   - [Depth-first traversal](https://www.youtube.com/watch?v=gm8DUJJhmY4)

讀完後，試著不看講義回答：stack 與 queue 差在哪？enqueue / dequeue 各做什麼？什麼是 linked list 與 node？binary search 用了哪個設計原則？BFS 與 DFS 分別用哪種結構暫存 node？

## 原文與延伸資源

- 原文：[Common Data Structures and Algorithms](https://www.theodinproject.com/lessons/javascript-common-data-structures-and-algorithms)
- 本課引用：
  - [Wikipedia — Data structure](https://en.wikipedia.org/wiki/Data_structure)
  - [Wikipedia — Binary search algorithm](https://en.wikipedia.org/wiki/Binary_search_algorithm)

---

> 本講義改寫自 The Odin Project《Common Data Structures and Algorithms》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
