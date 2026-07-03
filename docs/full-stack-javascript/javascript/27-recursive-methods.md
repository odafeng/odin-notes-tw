---
title: 遞迴方法（Recursion）
source_url: https://www.theodinproject.com/lessons/javascript-recursive-methods
source_file: vendor/curriculum/javascript/computer_science/recursive_methods.md
path: full-stack-javascript
course: JavaScript
order: 27
status: draft
generated: 2026-07-03
---

# 遞迴方法（Recursion）

> 改寫自 The Odin Project：[Recursive Methods](https://www.theodinproject.com/lessons/javascript-recursive-methods)
> ｜Full Stack JavaScript › JavaScript › A Bit of Computer Science

## 核心概念

### 什麼是 recursion（遞迴）

recursion（遞迴）的定義只有一句話：**一個 function（函式）呼叫它自己**。整個概念就這麼簡單。它的用途是把一個大問題不斷拆成愈來愈小的子問題（這種策略稱為「分而治之／Divide and Conquer」），把每個小問題的答案往回餵給原本的 function，直到問題小到可以直接回答，然後整條呼叫鏈再一路收合、把結果組合起來。

維基百科對「分而治之演算法」的定義是這樣的：在電腦科學中，divide and conquer（D&C）是一種重要的演算法設計典範，建立在「多分支遞迴」之上。它的做法是把一個問題遞迴地拆成兩個或更多個同類型（或相關類型）的子問題，直到子問題簡單到可以直接求解為止；接著再把這些子問題的解組合起來，就得到原問題的解。

要特別強調一個觀念：**任何能用遞迴解決的問題，都能改用你早就熟悉的 loop（迴圈／迭代）來解**。遞迴不是必要的工具，而是一種「換個角度」的思考方式。有些問題用遞迴寫出來會格外乾淨漂亮；但如果你寫到一半心裡冒出一句「我幹嘛不直接用 `while` 迴圈就好」，那你八成真的該用迴圈。實務上你不會太常寫遞迴解，但要培養出「什麼時候遞迴是個好主意」的直覺。

### 遞迴的兩個必要組成

每一個正確的遞迴 function 都必須包含兩個部分，缺一不可：

1. **base case（基本情況／終止條件）**：最單純、可以直接回傳答案而不再往下呼叫自己的情況。它是遞迴的「地板」，負責讓整條呼叫鏈停下來。
2. **recursive case（遞迴情況）**：把目前的問題轉化成「一個規模更小的同類問題」，並呼叫自己去處理那個更小的問題。關鍵在於每次呼叫都要讓問題**更靠近 base case**，否則永遠停不下來。

以計算次方 `pow(x, n)`（也就是 x 的 n 次方）為例：

- base case：當 `n === 1` 時，答案就是 `x`，直接回傳。
- recursive case：`x * pow(x, n - 1)`，把「x 的 n 次方」拆成「x 乘上 x 的 (n-1) 次方」。

每呼叫一次，`n` 就少 1，最終一定會降到 1，碰到 base case 而收手。這就是遞迴能安全終止的保證。

### execution context（執行環境）與 call stack（呼叫堆疊）

要真正理解遞迴，必須先理解 JavaScript 引擎在背後做了什麼。每當一個 function 開始執行時，引擎會為它建立一個 **execution context（執行環境）**，裡面記錄了：目前這個 function 的區域變數、參數，以及「執行到程式碼的哪一行」。

當一個 function 在執行到一半時去呼叫另一個 function（包括呼叫自己），會發生三件事：

1. 目前這個 function 的 execution context 被**保存**到一個叫 **call stack（呼叫堆疊）** 的地方。
2. 引擎為被呼叫的那個 function 建立一個**全新的** execution context，開始執行它。
3. 等這個子呼叫結束、回傳結果後，引擎再從 stack 上把先前保存的 context**取回**，從剛才中斷的地方繼續往下跑。

以 `pow(2, 3)` 為例，呼叫鏈會像這樣層層疊上去：`pow(2, 3)` 要等 `pow(2, 2)`，`pow(2, 2)` 要等 `pow(2, 1)`。當 `pow(2, 1)` 碰到 base case 回傳 `2` 之後，整條鏈開始「收合」（unwind）：`pow(2, 2)` 拿到 `2` 算出 `2 * 2 = 4`，再往上 `pow(2, 3)` 拿到 `4` 算出 `2 * 4 = 8`。stack 就像一疊盤子，先疊上去的最後才被取下來（後進先出，LIFO）。

### recursive depth（遞迴深度）與 stack overflow（堆疊溢位）

**recursive depth（遞迴深度）** 指的是 call stack 中同時堆疊的 context 最大數量。計算 n 次方需要同時保留 n 層 context，所以遞迴深度大約是 n。這件事很重要，因為 **stack 的空間是有限的**。

每多疊一層 context，就多佔用一塊記憶體。多數 JavaScript 引擎能支撐的遞迴深度大約在 10000 層上下（實際數字依引擎而定）。一旦遞迴太深、把 stack 撐爆，引擎就會丟出錯誤，這個現象就叫 **stack overflow（堆疊溢位）**——沒錯，就是那個知名問答網站名字的由來，但這裡指的是「概念」而不是網站。

這正是遞迴「不對的用法」會出事的地方：如果你少寫了 base case、或 recursive case 沒有真正逼近 base case，遞迴就會無限往下呼叫，stack 一路暴增直到溢位崩潰。相較之下，迴圈（迭代）版本不論輸入多大，通常只用固定的記憶體（一組變數重複使用），不會有 stack 深度的問題。

維基百科的「Implementation Issues」段落也點出同樣的限制：在遞迴實作分而治之演算法時，必須確保為遞迴堆疊配置了足夠的記憶體，否則執行會因 stack overflow 而失敗。編譯器通常把遞迴堆疊當成一塊固定大小的連續記憶體，而且每一層還會存下回傳位址、參數、區域變數等額外資訊，讓溢位風險更高。這也解釋了為什麼「有些問題會被拆成太多碎片，把記憶體整個壓垮」——凡事都有取捨（trade-off）。

### 什麼時候該用遞迴、什麼時候該用迴圈

遞迴的甜蜜點在於**本身就具有遞迴結構的資料或問題**：

- **巢狀／樹狀結構的走訪（traversal）**：例如一個「部門」物件底下還有子部門、子部門底下又有子部門。用遞迴走訪時，base case 是「這一層是最底層的資料（例如一個陣列）」，recursive case 是「這一層還有子部門，對每個子部門再呼叫自己」。
- **recursive data structure（遞迴資料結構）**：最典型的是 **linked list（鏈結串列）**。一個節點被「遞迴地」定義為「一個帶有 `value` 與 `next` 屬性的物件」，而 `next` 指向的又是同樣型態的節點（或 `null`）。HTML 文件、檔案系統目錄、組織階層都是這類「每一層都可以再包含同型態元素」的遞迴結構。

反過來說，**單純的線性重複**（例如把 1 加到 100）用迴圈更直接、更省記憶體，硬要用遞迴反而增加 stack 負擔又不好讀。判斷原則很簡單：問題本身是否「自然地由同型態的小問題組成」？是的話遞迴會很優雅；不是的話，迴圈通常才是對的選擇。

一句話總結取捨：遞迴常常換來**更乾淨、更好維護**的程式碼，代價是**記憶體與速度**；迭代通常更快、更省記憶體，但某些問題寫成迴圈會很扭曲。兩者沒有絕對優劣，重點是選對場合。

## 程式碼範例

下面的範例都可以直接貼到瀏覽器 console 或 Node.js 執行。

```js
// 範例 1：次方 pow(x, n) —— 遞迴版
function pow(x, n) {
  if (n === 1) {
    return x; // base case：n 為 1 時直接回傳 x
  }
  return x * pow(x, n - 1); // recursive case：問題縮小為 n-1
}

console.log(pow(2, 3)); // 8
// 展開過程：pow(2,3) = 2 * pow(2,2) = 2 * (2 * pow(2,1)) = 2 * (2 * 2) = 8
```

```js
// 範例 2：同一個問題的迴圈版 —— 對照用
function powLoop(x, n) {
  let result = 1;
  for (let i = 0; i < n; i++) {
    result *= x;
  }
  return result; // 不論 n 多大，只用固定幾個變數，沒有 stack 深度問題
}

console.log(powLoop(2, 10)); // 1024
```

```js
// 範例 3：階乘 factorial(n) = n × (n-1) × ... × 1
function factorial(n) {
  if (n === 0) {
    return 1; // base case：0 的階乘定義為 1
  }
  return n * factorial(n - 1);
}

console.log(factorial(5)); // 120
```

```js
// 範例 4：從 1 累加到 n
function sumTo(n) {
  if (n === 1) {
    return 1; // base case
  }
  return n + sumTo(n - 1); // recursive case
}

console.log(sumTo(100)); // 5050
```

```js
// 範例 5：走訪遞迴資料結構 —— linked list（鏈結串列）
// 每個節點是「帶有 value 與 next 的物件」，next 指向下一個節點或 null
const list = {
  value: 1,
  next: { value: 2, next: { value: 3, next: null } },
};

function sumList(node) {
  if (node === null) {
    return 0; // base case：走到串列盡頭
  }
  return node.value + sumList(node.next); // 加上目前值，再處理剩下的串列
}

console.log(sumList(list)); // 6
```

## 常見陷阱

!!! warning "忘了寫 base case，或 base case 永遠碰不到"
    這是遞迴最致命的錯誤。少了 base case、或 recursive case 沒有讓問題真正縮小逼近 base case，function 就會無限呼叫自己，call stack 一路暴增直到 **stack overflow（堆疊溢位）** 而崩潰（例如 `RangeError: Maximum call stack size exceeded`）。動手寫遞迴時，第一件事就是先問自己：「它在什麼情況下會停下來？每次呼叫有沒有更靠近那個停止點？」

!!! warning "遞迴太深也會爆 stack"
    就算 base case 正確，若遞迴深度動輒上萬層（例如對一個超長的線性資料硬用遞迴），也可能撞到引擎的 stack 上限。這種「本質是線性重複」的問題，改用迴圈通常又快又安全，不必為了遞迴而遞迴。

!!! warning "追蹤遞迴很燒腦，善用 debugger"
    要在腦中一層一層追蹤遞迴的執行流程非常吃力。不要硬撐——請善用瀏覽器或編輯器的 **debugger（除錯器）**，設中斷點、逐步進入（step into）每一層呼叫，觀察 call stack 面板如何疊上去又收下來。這會讓你對遞迴的運作一目了然，遠比純用大腦模擬輕鬆。

## 練習

依序完成下列步驟，把觀念轉成手感：

1. **重讀本講義的「核心概念」**，確認你能回答：遞迴 function 的定義、兩個必要組成、call stack 如何疊放與收合、什麼是遞迴深度與 stack overflow。
2. **動手實作四個小函式**：把上面的 `pow`、`factorial`、`sumTo`、`sumList` 自己重打一次（不要複製貼上），並各自想清楚它們的 base case 與 recursive case 分別是什麼。
3. **開 debugger 觀察**：在 `factorial(5)` 裡設中斷點，用 step into 逐層進入，觀察 call stack 面板從 5 層疊到底、再一路收合回來的過程。
4. **完成官方練習題（project）**：前往 The Odin Project 的 [`computer_science/recursion/` 練習目錄](https://github.com/TheOdinProject/javascript-exercises/tree/main/computer_science/recursion)，依序完成每一題。每題動手前先讀該題的 README；若忘記 fork、clone 與使用練習題的流程，回去看 repo 根目錄的 README。過程中請務必善用 debugger。

### Knowledge check（自我檢核）

- **如何簡短定義一個遞迴 function？** 一個會呼叫自己的 function，把大問題拆成更小的同型態子問題，直到碰到可直接求解的 base case 為止。
- **遞迴的重點是什麼？它比純迴圈更有效率嗎？** 重點是讓「本身具有遞迴／巢狀結構」的問題能被優雅、簡潔地表達。就效率而言，遞迴通常**不會**比迴圈更快，還額外消耗 call stack 記憶體；它換來的是可讀性與表達力，而非效能。
- **遞迴 function 的兩個必要組成是什麼？** base case（終止條件）與 recursive case（呼叫自己、且讓問題逼近 base case）。
- **為什麼 stack overflow 和遞迴問題有關？** 每一層遞迴呼叫都會在 call stack 上疊一個 execution context 佔用記憶體；遞迴太深或缺少正確 base case 時，stack 會被撐爆而發生 stack overflow，程式崩潰。

## 原文與延伸資源

- 原文：[Recursive Methods](https://www.theodinproject.com/lessons/javascript-recursive-methods)
- 本課引用：
  - [javascript.info — Recursion and stack](https://javascript.info/recursion)（base case／recursive case、execution context、call stack、遞迴深度、linked list）
  - [Wikipedia — Divide-and-conquer algorithm](https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm)（分而治之典範與 Implementation Issues：stack 大小、stack overflow、base case 取捨）
  - [The Odin Project javascript-exercises — recursion 練習題](https://github.com/TheOdinProject/javascript-exercises/tree/main/computer_science/recursion)

---

> 本講義改寫自 The Odin Project《Recursive Methods》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
