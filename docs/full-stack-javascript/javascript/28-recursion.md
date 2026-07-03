---
title: 專案：遞迴
source_url: https://www.theodinproject.com/lessons/javascript-recursion
source_file: vendor/curriculum/javascript/computer_science/project_recursion.md
path: full-stack-javascript
course: JavaScript
order: 28
status: draft
generated: 2026-07-03
---

# 專案：遞迴

> 改寫自 The Odin Project：[Project: Recursion](https://www.theodinproject.com/lessons/javascript-recursion)
> ｜Full Stack JavaScript › JavaScript › A Bit of Computer Science

## 核心概念

這是一堂 project（專案）課。你要用先前學到的 recursion（遞迴）觀念，親手實作兩個經典題目：**Fibonacci 數列**與 **Merge Sort（合併排序）**。兩題都能寫成 recursion，但也都能寫成 iteration（迭代）。刻意用 recursion 來解，目的不是追求效能，而是把「函式呼叫自己」這件事練到熟。

### recursion 的兩個要件

任何 recursion 函式都由兩塊組成，缺一不可：

- **base case（基底案例）**：小到不需要再拆解、可以直接回傳答案的情況。它是遞迴的「煞車」，沒有它就會無限呼叫自己而爆掉。
- **recursive step（遞迴步驟）**：把問題轉化成「一個更簡單的動作」加上「一次規模更小的自我呼叫」，一路縮小到撞上 base case 為止。

每一次自我呼叫都會在 **call stack（呼叫堆疊）** 上疊一層 execution context（執行環境）；當某層撞到 base case 回傳後，該層就從堆疊移除，答案再一層一層往上傳回去。這也是為什麼 recursion 太深會出現 stack overflow（堆疊溢位）。

### Fibonacci 數列

Fibonacci 數列是「每個數字都是前兩個數字之和」的數列，開頭固定是 `0` 和 `1`：

```
0, 1, 1, 2, 3, 5, 8, 13, 21, ...
```

用公式表達，`fib(n) = fib(n - 1) + fib(n - 2)`，其中 `fib(0) = 0`、`fib(1) = 1`——後兩者就是 base case。這條公式「函式用更小的自己來定義自己」，天生就適合拿來練 recursion。

本課要求你寫兩個版本：先用 iteration 寫 `fibs`，再用 recursion 寫 `fibsRec`，藉此比較兩種思路。iteration 版只需一個迴圈、一組變數；recursion 版程式碼更貼近數學定義，但會重複計算很多次（這也是為什麼實務上 Fibonacci 很少真的用純 recursion）。

### Merge Sort：divide and conquer

排序是電腦科學的大宗題目。Merge Sort 採用 **divide and conquer（分而治之）** 策略，把「排一個大陣列」拆成「排兩個小陣列」，再把小陣列合併起來。整個演算法分成兩個階段：

1. **divide（拆分）**：把陣列從中間切成左右兩半，對每一半再遞迴呼叫 `mergeSort`，一路切到只剩單一元素。**只有一個元素的陣列，本身就是排好序的**——這就是 base case。
2. **merge（合併）**：把兩個「已排好序」的小陣列合併成一個更大的排好序陣列。做法是同時比較兩邊最前面的元素，每次取較小的那個放進結果，直到兩邊都取完。因為兩邊都已排序，合併只需線性時間走一遍即可完成。

Merge Sort 的 time complexity（時間複雜度）在最好、平均、最壞情況都是 **O(n log n)**：`log n` 來自對半拆分的層數，`n` 來自每一層合併時要走過所有元素。它比 bubble sort（氣泡排序）的 O(n²) 快得多，而且效能穩定、不會因為特定輸入而退化，還是 stable（穩定）排序——相等的元素會保持原本的先後順序。

## 程式碼範例

以下範例都以 Node.js 在命令列執行（本專案沒有畫面，用 `node 檔名.js` 跑即可）。

### Fibonacci：iteration 版

```javascript
// 回傳長度為 count 的 Fibonacci 陣列，例如 fibs(8) → [0,1,1,2,3,5,8,13]
function fibs(count) {
  const result = [];
  let a = 0;
  let b = 1;
  for (let i = 0; i < count; i += 1) {
    result.push(a);
    // 同時更新兩個變數：新的 a 是舊 b，新的 b 是舊 a 加舊 b
    [a, b] = [b, a + b];
  }
  return result;
}

console.log(fibs(8)); // [0, 1, 1, 2, 3, 5, 8, 13]
```

### Fibonacci：recursion 版

```javascript
// 一樣回傳長度為 count 的 Fibonacci 陣列，但用遞迴組出來
function fibsRec(count) {
  // base case：長度 0 或 1 時直接給定開頭
  if (count === 0) return [];
  if (count === 1) return [0];
  if (count === 2) return [0, 1];

  // recursive step：先求「少一個」的陣列，再把最後兩項相加補上去
  const previous = fibsRec(count - 1);
  const next = previous[previous.length - 1] + previous[previous.length - 2];
  return [...previous, next];
}

console.log(fibsRec(8)); // [0, 1, 1, 2, 3, 5, 8, 13]
```

### Merge Sort

```javascript
// 合併兩個「已排序」的陣列成一個排序陣列
function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;

  // 同時比較兩邊最前面的元素，每次取較小的放進 result
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i += 1;
    } else {
      result.push(right[j]);
      j += 1;
    }
  }

  // 其中一邊先取完，把另一邊剩下的接上去（剩下的本來就已排序）
  return result.concat(left.slice(i)).concat(right.slice(j));
}

function mergeSort(array) {
  // base case：0 或 1 個元素的陣列，本身就已排序
  if (array.length <= 1) return array;

  // divide：從中間切成左右兩半
  const middle = Math.floor(array.length / 2);
  const left = array.slice(0, middle);
  const right = array.slice(middle);

  // conquer：對兩半分別遞迴排序，再合併
  return merge(mergeSort(left), mergeSort(right));
}

console.log(mergeSort([])); // []
console.log(mergeSort([73])); // [73]
console.log(mergeSort([3, 2, 1, 13, 8, 5, 0, 1])); // [0, 1, 1, 2, 3, 5, 8, 13]
console.log(mergeSort([105, 79, 100, 110])); // [79, 100, 105, 110]
```

## 常見陷阱

!!! warning "忘記寫 base case"
    只寫 recursive step、沒有 base case（或條件寫錯永遠碰不到），函式就會一直呼叫自己直到 `RangeError: Maximum call stack size exceeded`。動手寫 recursion 前，先問自己：「什麼情況小到可以直接回答？」把那個情況當成第一行的 `if`。

!!! warning "merge 只處理到一邊取完就結束"
    合併時，`while` 迴圈會在其中一個陣列先取完時停止，此時**另一個陣列往往還有剩**。務必把剩下的元素接回結果（範例中的 `.concat(left.slice(i)).concat(right.slice(j))`），否則排序結果會漏掉數字。

!!! warning "誤以為 recursion 一定比較快"
    純 recursion 版 Fibonacci 會重複計算大量相同的子問題，規模一大就非常慢；很多題目 iteration 反而更省記憶體、更快。選 recursion 通常是為了「程式碼貼近問題結構、比較好讀」，而不是為了效能。

## 練習

需求以[原文專案說明](https://www.theodinproject.com/lessons/javascript-recursion)為準，以下為繁中重點步驟。所有程式都用 `node 檔名.js` 在命令列執行。

**第一部分：Fibonacci**

1. 建立一個檔案。用 **iteration** 寫函式 `fibs`，接收一個數字，回傳包含該數量 Fibonacci 數字的陣列。例如 `fibs(8)` 回傳 `[0, 1, 1, 2, 3, 5, 8, 13]`。
2. 再寫一個 `fibsRec`，用 **recursion** 解同一題。
3. 傳入各種不同長度當引數，測試兩個版本結果是否一致。
4. （觀察 recursion）在函式開頭加一行 `console.log("This was printed recursively");`，再用 `8` 呼叫，觀察它印出約 8 次（依你的實作可能是 7 次，這不是 bug，只是實際遞迴次數的差異）。

**第二部分：Merge Sort**

1. 另建一個檔案，寫函式 `mergeSort`，接收一個陣列，用**遞迴的 merge sort** 方法回傳排好序的陣列。
2. 用原文的測試案例驗證：
   - `mergeSort([])` → `[]`
   - `mergeSort([73])` → `[73]`
   - `mergeSort([1, 2, 3, 4, 5])` → `[1, 2, 3, 4, 5]`
   - `mergeSort([3, 2, 1, 13, 8, 5, 0, 1])` → `[0, 1, 1, 2, 3, 5, 8, 13]`
   - `mergeSort([105, 79, 100, 110])` → `[79, 100, 105, 110]`

提示：先想清楚 base case 是什麼、哪個重複發生的動作可以「委派給同一個函式」去做。卡住時回頭重看合併排序的說明或視覺化工具。

## 原文與延伸資源

- 原文：[Project: Recursion](https://www.theodinproject.com/lessons/javascript-recursion)
- 本課引用：
  - [Recursion — javascript.info](https://javascript.info/recursion)（base case、recursive step 與 call stack）
  - [Merge sort — Wikipedia](https://en.wikipedia.org/wiki/Merge_sort)（divide and conquer 與 O(n log n) 複雜度）
  - [Fibonacci number — Wikipedia](https://en.wikipedia.org/wiki/Fibonacci_number)（數列定義）
  - [Node CLI 文件](https://github.com/nodejs/nodejs.dev)（如何用 `node` 執行 JavaScript 檔案）

---

> 本講義改寫自 The Odin Project《Project: Recursion》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
