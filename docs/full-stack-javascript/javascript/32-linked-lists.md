---
title: 專案：Linked List
source_url: https://www.theodinproject.com/lessons/javascript-linked-lists
source_file: vendor/curriculum/javascript/computer_science/project_linked_lists.md
path: full-stack-javascript
course: JavaScript
order: 32
generated: 2026-07-03
---

# 專案：Linked List

> 改寫自 The Odin Project：[Project: Linked Lists](https://www.theodinproject.com/lessons/javascript-linked-lists)
> ｜Full Stack JavaScript › JavaScript › A Bit of Computer Science

## 核心概念

Linked list（連結串列）是 computer science 裡最基礎的 data structure（資料結構）之一，用途跟 array（陣列）很像：把一串資料依序存起來。它是最單純的一種 dynamic data structure（動態資料結構），把它親手做過一遍，之後理解 graph（圖）、binary tree（二元樹）這些更複雜的結構會輕鬆很多。這一課的目標，就是自己從零實作一個 linked list。

### 為什麼要有 linked list

在某些程式語言裡，array 一旦建立就有固定大小，中間插入或刪除元素時，還得把後面的元素整批搬移、重新配置記憶體。Linked list 的核心優點，就是插入與刪除元素時，**不需要搬動其他元素**，只要改幾個指標就好。

不過在 JavaScript 裡，array 本來就沒有固定大小限制，插入、刪除都能用內建方法直接完成，所以你可能會問：那 linked list 還有必要嗎？答案是「看情況」。在 JavaScript 的日常開發中你確實很少手寫它，但它是打基礎用的——理解「靠指標把節點串起來」這件事，是進入更進階資料結構的敲門磚。

### 一條 linked list 長什麼樣子

Linked list 是由一連串稱為 **node（節點）** 的資料元素組成的線性集合。每個 node 只裝兩樣東西：

1. **一筆資料**（value）。
2. **一個指向下一個 node 的 pointer（指標）**，通常叫 `next` 或 `nextNode`。

把很多個 node 用 pointer 串起來，就成了一條串列。用文字畫出來像這樣：

```text
[ NODE(head) ] -> [ NODE ] -> [ NODE(tail) ] -> null
```

幾個關鍵名詞：

- **head（頭節點）**：串列的第一個 node，是你進入整條串列的唯一入口。
- **tail（尾節點）**：串列的最後一個 node，它的 `next` 指向 `null`，代表「到這裡結束了」。
- **null**：尾端的終止標記。走訪時看到 `null` 就知道走完了。

一個很直觀的想法：每個 node「只知道自己裝了什麼資料，以及誰是它的下一個鄰居」。它不知道整條串列有多長，也不知道自己排第幾個。正因為如此，node 在記憶體裡不需要連續擺放——它們可以散落各處，靠 pointer 把彼此連起來。

### 走訪（traversal）：唯一的存取方式

因為你手上只握著 head，想拿到第 `n` 個 node 的值，就只能從 head 出發，一個接一個沿著 `next` 往下走，直到走到第 `n` 個為止。這叫 **traversal（走訪）**。

這也點出 linked list 跟 array 最大的差別：

| 操作 | Array | Linked List |
| --- | --- | --- |
| 用索引直接讀取（access by index） | 快（O(1)） | 慢（O(n)，得從 head 走過去） |
| 在開頭插入／刪除 | 慢（要整批搬移） | 快（O(1)，改指標即可） |
| 在中間插入／刪除 | 慢 | 找到位置後改指標即可 |

一句話總結：**array 擅長「隨機存取」，linked list 擅長「頻繁增刪」**。兩者各有適用場景，沒有絕對的優劣。

### 這個專案會用到的技巧重點

要完成這個專案，你需要兩個 class（類別）或 factory function（工廠函式）：

- **`Node`**：一個節點。含 `value` 與 `nextNode` 兩個 property，預設都是 `null`。
- **`LinkedList`**：代表整條串列。它內部至少要記住 head（有些人也會額外記 tail 與長度來加速）。

實作各種方法時，反覆會用到的兩個核心動作是：

1. **走訪**：用一個「目前指標」變數（例如 `let current = this.head`），透過 `current = current.nextNode` 一步步往下移動，直到 `current` 變成 `null`。
2. **改接指標**：插入或刪除時，關鍵永遠是「哪幾個 node 的 `nextNode` 需要改指向」。例如刪除中間某個 node，其實就是讓它前一個 node 的 `nextNode` 直接跳過它、指向它的下一個 node。

只要掌握「走訪」跟「改接指標」這兩招，專案要求的每一個方法幾乎都是它們的組合。

## 程式碼範例

以下是一個最小可執行的骨架，示範 `Node`、`LinkedList`，以及 `append`、`prepend`、`size`、`toString` 四個方法，讓你看清楚「走訪」與「改接指標」怎麼落地。專案要求的其他方法可以照相同套路補上。

```javascript
// node.js —— 單一節點
class Node {
  constructor(value = null, nextNode = null) {
    this.value = value; // 這個 node 裝的資料
    this.nextNode = nextNode; // 指向下一個 node 的 pointer
  }
}

// linked-list.js —— 整條串列
class LinkedList {
  constructor() {
    this.headNode = null; // 一開始是空串列，沒有 head
  }

  // 在尾端加一個新 node
  append(value) {
    const newNode = new Node(value);
    if (this.headNode === null) {
      // 空串列：新 node 直接當 head
      this.headNode = newNode;
      return;
    }
    // 走訪到最後一個 node（nextNode 為 null 的那個）
    let current = this.headNode;
    while (current.nextNode !== null) {
      current = current.nextNode;
    }
    // 改接指標：讓原本的尾節點指向新 node
    current.nextNode = newNode;
  }

  // 在開頭加一個新 node
  prepend(value) {
    // 新 node 的 next 指向原本的 head，再把 head 換成新 node
    this.headNode = new Node(value, this.headNode);
  }

  // 走訪整條串列並計算 node 數量
  size() {
    let count = 0;
    let current = this.headNode;
    while (current !== null) {
      count += 1;
      current = current.nextNode;
    }
    return count;
  }

  // 回傳第一個 node 的值；空串列回傳 undefined
  head() {
    return this.headNode === null ? undefined : this.headNode.value;
  }

  // 印成字串：( value ) -> ( value ) -> null
  toString() {
    let result = "";
    let current = this.headNode;
    while (current !== null) {
      result += `( ${current.value} ) -> `;
      current = current.nextNode;
    }
    return result + "null";
  }
}

// main.js —— 測試
const list = new LinkedList();
list.append("dog");
list.append("cat");
list.prepend("bird"); // 加到最前面
console.log(list.toString());
// ( bird ) -> ( dog ) -> ( cat ) -> null
console.log(list.size()); // 3
console.log(list.head()); // bird
```

注意 `append` 與 `prepend` 的差別：`prepend` 是 O(1)（只改 head），而這個版本的 `append` 每次都得走訪到尾端，是 O(n)。如果你在 `LinkedList` 裡額外維護一個 `tailNode` 參照，`append` 也能做到 O(1)——這是常見的優化，可以自己試試。

## 常見陷阱

!!! warning "改接指標的順序不能反"
    在 `prepend` 或 `insertAt` 時，一定要**先讓新 node 指向原本該接的下一個 node，再更新 head 或前一個 node 的 `nextNode`**。如果先把前面的指標改掉，你就會弄丟後半段串列的參照，導致資料整段消失。

!!! warning "區分「回傳 node」與「回傳值」"
    專案要求 `head()`、`tail()`、`at(index)` 回傳的是 node 的**值（value）**，不是 node 物件本身。實作時很容易忘記多寫一層 `.value`。空串列的情況也要照規格回傳 `undefined`，別讓程式因為存取 `null.value` 而報錯。

!!! warning "邊界情況：空串列與尾節點"
    刪除或走訪時最容易出錯的就是兩個邊界：串列是空的（`head` 為 `null`），以及操作對象剛好是最後一個 node。動手前先問自己：這段程式在「空串列」「只有一個 node」「操作尾節點」這三種情況下會不會爆掉？

!!! warning "insertAt / removeAt 的越界處理"
    Extra credit 的 `insertAt(index, ...)` 與 `removeAt(index)` 遇到超出範圍的 index（小於 0，或大於／等於串列長度）時，規格要求**丟出 `RangeError`**，而不是靜靜回傳 `undefined`。別漏了這個邊界檢查。

## 練習

這是一個 **project（專案）** 課，請動手把 linked list 實作出來。以下是繁中步驟摘要；**完整需求以[原文](https://www.theodinproject.com/lessons/javascript-linked-lists)為準**。

**環境提示**：Node v22（2024 年 10 月起為 LTS）可自動辨識並執行 ES6 module，不需額外設定。若因語法不被辨識而報錯，請先把 Node 更新到最新的 LTS 版本。

**基本需求**：建立兩個 class 或 factory：

- `Node`：含 `value` 與 `nextNode` 兩個 property，預設皆為 `null`。
- `LinkedList`：代表整條串列，並實作以下方法：

1. `append(value)`：在串列尾端加入含 `value` 的新 node。
2. `prepend(value)`：在串列開頭加入含 `value` 的新 node。
3. `size()`：回傳串列的 node 總數。
4. `head()`：回傳第一個 node 的值；空串列回傳 `undefined`。
5. `tail()`：回傳最後一個 node 的值；空串列回傳 `undefined`。
6. `at(index)`：回傳指定 index 的 node 的值；該 index 沒有 node 就回傳 `undefined`。
7. `pop()`：移除 head node（第一個 node）並回傳其值；空串列回傳 `undefined`。（注意：`pop` 這個名稱容易讓人聯想到移除尾端節點，但原文明確要求移除 head node，請以原文為準。）
8. `contains(value)`：串列中含有該值回傳 `true`，否則 `false`。
9. `findIndex(value)`：回傳含該值的 node 的 index；找不到回傳 `-1`；有多個相符時回傳第一個的 index。
10. `toString()`：把串列轉成字串以便印出預覽。空串列回傳空字串，格式為 `( value ) -> ( value ) -> ( value ) -> null`。

**Extra credit（加分題）**：

1. `insertAt(index, ...values)`：在指定 index 插入含這些值的新 node；index 越界（小於 0 或大於串列長度）時丟出 `RangeError`。
2. `removeAt(index)`：移除指定 index 的 node；index 越界（小於 0 或大於等於串列長度）時丟出 `RangeError`。

> 提示：插入或移除 node 時，想清楚它會影響到哪些既有 node——有些 node 的 `nextNode` 連結需要更新。

**測試一下**：建立 `main.js` 匯入你的 `LinkedList`，用下列資料填充串列並印出，確認輸出正確：

```javascript
const list = new LinkedList();
list.append("dog");
list.append("cat");
list.append("parrot");
list.append("hamster");
list.append("snake");
list.append("turtle");
console.log(list.toString());
// ( dog ) -> ( cat ) -> ( parrot ) -> ( hamster ) -> ( snake ) -> ( turtle ) -> null
```

## 原文與延伸資源

- 原文：[Project: Linked Lists](https://www.theodinproject.com/lessons/javascript-linked-lists)
- 本課引用：
  - [What's a Linked List, Anyway?（dev.to，Vaidehi Joshi）](https://dev.to/vaidehijoshi/whats-a-linked-list-anyway)——node 結構、singly／doubly／circular 的差別。
  - [The Modern JavaScript Tutorial：Recursion and stack（javascript.info）](https://javascript.info/recursion)——以遞迴定義的 linked list，以及與 array 的插入／刪除／存取取捨。
  - [Are Linked Lists necessary?（dev.to）](https://dev.to/karimdevelops/are-linked-lists-necessary-2ckl)——為什麼在 JavaScript 裡仍值得學它。

---

> 本講義改寫自 The Odin Project《Project: Linked Lists》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
