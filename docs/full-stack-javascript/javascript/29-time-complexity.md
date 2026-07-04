---
title: 時間複雜度
source_url: https://www.theodinproject.com/lessons/javascript-time-complexity
source_file: vendor/curriculum/javascript/computer_science/time_complexity.md
path: full-stack-javascript
course: JavaScript
order: 29
generated: 2026-07-03
---

# 時間複雜度

> 改寫自 The Odin Project：[Time Complexity](https://www.theodinproject.com/lessons/javascript-time-complexity)
> ｜Full Stack JavaScript › JavaScript › A Bit of Computer Science

## 核心概念

寫程式寫到一個階段，你開始在乎的不只是「能不能跑」，還有可讀性與可維護性。但還有一個同樣重要的面向：**效率（efficiency）**。你寫的程式在資料變大時會怎麼表現？你選的資料結構與演算法（algorithm）撐得住成長嗎？在程式設計裡，我們用兩種方式衡量效率：**time complexity（時間複雜度）** 與 **space complexity（空間複雜度，記憶體用量）**。這一課專注在時間複雜度。

### 為什麼不用「花多少秒」來衡量

先看一段印出 1 到 10 之間所有奇數的程式。你在終端機跑它，可能花不到一秒；再跑一次，可能更快也可能更慢，看你電腦當下在忙什麼；換一台電腦跑，速度又不一樣。所以有個關鍵觀念：**永遠不要用「執行花了多少時間」來衡量一個演算法的效率**。時間會隨硬體、負載、當下狀態浮動，量到的是環境，不是演算法本身。

那要量什麼？答案是**步數（steps）**。我們計算一個演算法完成任務需要幾個「步驟」。如果演算法 A 要 5 步、演算法 B 要 20 步來做同一件事，那麼在同一台電腦上，A 永遠比 B 快。步數是演算法的內在性質，不受硬體影響，這才是可以拿來比較的東西。

### 步數會隨輸入而變

我們把上面的程式改成接受一個參數 `maxNumber`，而不是寫死 10。問題來了：這個版本要幾步？答案是「看情況」。`maxNumber` 給 10 是一個步數，給 1000 是另一個步數，給 100 萬又是另一個。**沒有一個固定的數字**能描述它，因為步數會隨外部輸入改變。

所以我們真正想量的，不是「幾步」，而是**「當資料變大時，步數怎麼跟著變」**。這個問題回答的是：我的程式能不能 scale（擴展）？資料從 10 筆變成 100 萬筆，它會優雅地應付，還是直接卡死？要回答這個問題，我們需要 **asymptotic notation（漸進符號）**，尤其是 **Big O**。

### Asymptotic notation：三種常見符號

Asymptotic notation 用來描述一個演算法的執行時間如何隨輸入成長。因為執行時間會依輸入不同而變化，於是有幾種不同角度的符號，最常見的三種是：

- **Big O notation**：描述**上界（upper bound）**，也就是**最壞情況（worst case）**——演算法最糟能糟到什麼程度。
- **Omega notation（Ω）**：描述**下界（lower bound）**，也就是**最好情況（best case）**。
- **Theta notation（Θ）**：同時描述上界與下界，用來分析**平均情況（average case）**，或在最好與最壞相同時給出確切表現。

其中 **Big O 是你最常看到、最常用的**。原因很直覺：你必須確保自己寫的程式在**最壞情況下**也還能 scale。使用者不會因為「平均很快」而原諒偶爾的卡死。值得一提的是，下面介紹的各種複雜度等級（O(1)、O(N) 等）對 Omega 與 Theta 一樣適用；差別只在於它們是從哪個角度（最好 / 最壞 / 平均）去衡量演算法。

### Big O 到底是什麼

Big O 給我們一個**一致的方式**來衡量演算法效率。它描述當輸入成長時，執行所需時間如何跟著成長，讓你能直接比較兩個演算法、挑出比較好的那個。

要澄清一個常見誤解：**Big O 不是一台你把程式丟進去、它就吐出效率的機器**。你得自己去觀察「步數如何隨資料成長」，然後對應到某個 Big O 符號，再拿它跟其他演算法比較。好消息是，很多時候你用的是眾所周知的資料結構（array、object 等），它們各種操作的複雜度是已知的，所以判斷起來並不難。

### 常見的 Big O 等級（由快到慢）

- `O(1)` — Constant（常數）複雜度
- `O(log N)` — Logarithmic（對數）複雜度
- `O(N)` — Linear（線性）複雜度
- `O(N log N)` — N × log N 複雜度
- `O(N²)` — Quadratic（平方 / 二次）複雜度
- `O(N³)` — Cubic（立方 / 三次）複雜度
- `O(2ᴺ)` — Exponential（指數）複雜度
- `O(N!)` — Factorial（階乘）複雜度

逐一來看。

**`O(1)` — Constant（常數）複雜度**：無論輸入多大，步數固定不變。經典例子是用索引（index）存取 array 元素。`arr = [1,2,3,4,5]`，取 `arr[2]` 是一步。就算 array 變成 1 萬個元素，取任何一個索引仍然是一步。電腦嚴格說要先找到 array 在記憶體的位置、再跳到指定索引，也許是兩三步，你寫成 `O(1 + 2)` 也不算錯——但這些是「附帶的固定步數」，不管 array 多大都一樣，不會隨資料成長，所以 Big O 直接**丟掉常數**。Big O 只在乎複雜度相對於輸入大小怎麼成長。查一次一步，這是時間複雜度裡最理想的境界。

**`O(log N)` — Logarithmic（對數）複雜度**：資料**加倍**時，步數只**增加 1**。這極有效率——資料從 5,000 筆變成 10,000 筆，只多一步。典型例子是**二元搜尋（binary search）**，但它只能用在**已排序**的 array 上。要在 `[1..10]` 裡找 7：先算中間索引 `Math.floor((start + end) / 2)`，中間是索引 4（值 5）。因為 7 大於 5，5 及它左邊全部可以一次砍掉。接著在剩下的右半再取中間、再比較、再砍半，重複到只剩一個元素，看它是不是要找的值。每一步砍掉一半，這就是對數的威力。下表看資料加倍與步數的關係：

| 資料量 | 步數 |
| ---- | ---- |
| 1    | 1    |
| 2    | 2    |
| 4    | 3    |
| 8    | 4    |
| 16   | 5    |
| 32   | 6    |

**`O(N)` — Linear（線性）複雜度**：資料量成長多少，步數就成長多少，**兩者同步**。每次你「走訪整個 array」就是線性。5 個元素走 5 步，10 個元素走 10 步。看到 `O(N)`，就知道步數與資料筆數等比例增加。

**`O(N log N)` — N × log N 複雜度**：這名字取得很傳神。它通常出現在一個 `O(log N)`（例如像二元搜尋那樣反覆把 array 砍半）之上，再對每一半用一個 `O(N)` 的處理。典型例子是上一課的 **merge sort（合併排序）**。不過並非所有 `O(N log N)` 都是這樣「內含 O(N) 與 O(log N)」拼出來的，也有像建構 Cartesian tree 這種天生就是 `O(N log N)` 的特例。重點是：巢狀複雜度雖常見，卻不是達到某個複雜度的唯一方式。

**`O(N²)` — Quadratic（平方）複雜度**：最常見於「**巢狀迴圈**」——你迴圈一個資料集，每次迭代裡又迴圈一次同一個資料集。3 個元素要 3² = 9 個子步驟；加到 4 個變 4² = 16；5 個變 25；資料加倍到 10 個變 100，是原本 25 的 4 倍工作量。你應該看得出趨勢了。

**`O(N³)` — Cubic（立方）複雜度**：三層巢狀迴圈。n 個元素需要 n³ 個子步驟。3 個元素 27 步，4 個 64 步，5 個 125 步，10 個就要 1,000 步（是原本的 8 倍）。100 個元素？100 萬步。

**`O(2ᴺ)` — Exponential（指數）複雜度**：每加一個元素，步數就**翻倍**。1→2 步、2→4、3→8……到 10 就 1,024 步。這種成長非常恐怖，能避則避。

| 資料量 | 步數 |
| ---- | ---- |
| 1    | 2    |
| 5    | 32   |
| 10   | 1024 |

**`O(N!)` — Factorial（階乘）複雜度**：一個數的階乘是 1 到它之間所有整數的乘積，4! = 4×3×2×1 = 24。當你需要計算所有**排列（permutation）或組合（combination）**時就會碰到它。3! = 6、4! = 24、10! = 3,628,800——增幅大到失控，只在資料極少時可行。

### Big O 以外：Omega 與 Theta

既然 Big O 是最壞情況，那別的角度呢？看這段程式：它走訪 array，一找到值 `1` 就回傳。

- **最壞情況（Big O）**：要找的值不在 array 裡、或剛好在最後一個，程式得走完每個元素，是 `O(N)`。輸入加倍，迭代次數也加倍。
- **最好情況（Omega Ω）**：要找的值剛好是第一個，一步就回傳，是 `O(1)`——這就是它的 **Omega 複雜度**。Omega 通常「不太有用」，因為要找的值很少剛好在第一個，它無法告訴你演算法在真實情況下 scale 得如何。
- **Theta（Θ）**：介於最好與最壞之間，給出確切值或一個窄的上下界範圍。如果一段程式無論如何都走完整個 array，那它最好與最壞都是 `O(N)`，於是它的 Theta 也是 `O(N)`——所有情況下的確切表現都一致。

### 為什麼選 Big O（最壞情況）

用最壞情況衡量，才能確保演算法在**所有結果下**都撐得住。如果一段程式可能跑常數時間、但最壞會退化成線性，那它能不能 scale 就取決於「最壞情況發生時還能不能用」。你得有把握：突然來了 100 萬筆而不是 10 筆時，程式不會鎖死、不會讓使用者抓狂。這就是實務上偏好最壞情況的理由。

### 相同複雜度的兩個演算法，就一樣好嗎？

不一定。看 `oddNumbers`：`currentNumber += 1` 的版本是 `O(N)`。改成 `currentNumber += 2`，步數大約砍半，理論上是 `O(N/2)`——但 Big O **不在乎常數**，因為常數與「隨輸入怎麼成長」無關，`O(N/2)` 一律簡化成 `O(N)`。兩個版本 Big O 相同，隨輸入成長的速率一樣。

為什麼可以丟常數？因為常數最終會變得無關緊要。比較 `O(10N)` 與 `O(N²)`：

| N     | O(10N)   | O(N²)         |
| ----- | -------- | ------------- |
| 1     | 10       | 1             |
| 5     | 50       | 25            |
| 100   | 1,000    | 10,000（10 倍） |
| 1,000 | 10,000   | 1,000,000（100 倍） |
| 10,000| 100,000  | 100,000,000（1000 倍） |

N 到了 100，帶著係數 10 的 `O(10N)` 已經遠比 `O(N²)` 快。有趣的是，在極小的輸入（N=1、N=5）下，`O(N²)` 反而比 `O(10N)` 快——這提醒我們：Big O 描述的是**成長趨勢**，小資料時的實際快慢可能相反。所以除了選對複雜度等級，也要記得：**在同一個複雜度內，把程式寫得盡可能有效率**。

### 兩條化簡 Big O 的實用規則

從上面延伸出計算 Big O 時最常用的兩條規則，記住它們就能快速判斷大多數程式：

1. **丟掉常數（drop constants）**：`O(2N)` → `O(N)`、`O(N/2)` → `O(N)`、`O(1 + 2)` → `O(1)`。係數與加減的固定數字都拿掉。
2. **丟掉非主導項（drop non-dominant terms）**：把各段操作的複雜度加起來後，只留下成長最快的那一項。`O(N) + O(1) + O(N²)` → `O(N²)`，因為 N² 遠比 N 與常數成長得快。

另外，遇到**多個不同輸入**時，用不同變數表示：兩個各自獨立的迴圈走訪不同 array 是 `O(a + b)`（相加），巢狀走訪不同 array 則是 `O(a × b)`（相乘）。分析步驟就是：拆解每個操作 → 算各自的 Big O → 加總並套用上面兩條規則化簡。

## 程式碼範例

```javascript
// O(N) 線性：走訪整個 array，步數與長度同步成長
function findValue(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 1) {
      return arr[i]; // 最好情況 O(1)（第一個就是），最壞情況 O(N)
    }
  }
}

// O(log N) 對數：在已排序 array 上做 binary search，每步砍半
function binarySearch(sortedArr, target) {
  let start = 0;
  let end = sortedArr.length - 1;

  while (start <= end) {
    const mid = Math.floor((start + end) / 2); // 取中間索引
    if (sortedArr[mid] === target) return mid;  // 找到，回傳索引
    if (target > sortedArr[mid]) {
      start = mid + 1; // 目標比中間大，砍掉左半
    } else {
      end = mid - 1;   // 目標比中間小，砍掉右半
    }
  }
  return -1; // 找不到
}

// O(N²) 平方：巢狀迴圈，每個外層都跑一次完整內層
function hasDuplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

console.log(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 7)); // 6（索引）
console.log(hasDuplicate([1, 2, 3, 2]));                       // true
```

```javascript
// 化簡示範：拆解 → 加總 → 丟常數與非主導項
function analyzeMe(arr) {
  let first = arr[0];        // O(1)
  let last = arr[arr.length - 1]; // O(1)

  for (const item of arr) {  // O(N)
    console.log(item);
  }

  for (let i = 0; i < arr.length; i++) {     // O(N²)
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
}
// 加總：O(1) + O(1) + O(N) + O(N²)
// 丟掉常數與非主導項後 → O(N²)
```

## 常見陷阱

!!! warning "用「跑幾秒」判斷效率"
    同一段程式在不同電腦、不同負載下秒數都不同，你量到的是環境不是演算法。永遠用「步數如何隨輸入成長」來衡量，這才是演算法的內在性質。

!!! warning "以為 Big O 是一台自動評分機"
    Big O 不會替你分析程式。你得自己觀察步數如何隨資料成長，再對應到符號。捷徑是熟記常見資料結構（array、object）各操作的已知複雜度。

!!! warning "忘記丟掉常數與非主導項"
    `O(2N)`、`O(N/2)`、`O(N + 5)` 全都是 `O(N)`；`O(N) + O(N²)` 是 `O(N²)`。Big O 描述成長趨勢，不是精確步數，保留常數只會讓比較變得混亂。

!!! warning "把相同複雜度當成一樣快"
    兩個都是 `O(N)` 不代表實際速度相同，常數係數在真實資料下仍有差別。而且在極小輸入時，`O(N²)` 有可能比帶大係數的 `O(N)` 更快——Big O 談的是資料變大後的趨勢。

## 練習

先做以下閱讀，把觀念鞏固到能回答 knowledge check（原文提供的外部連結供你延伸，但本講義正文已足夠自足）：

1. 讀《Big O Notation in JavaScript》（Doable Danny）：用圖表與範例走過每個常見複雜度，特別留意 `O(1)`、`O(N)`、`O(N²)` 的 JS 程式對照。
2. 瀏覽 **Big-O cheat sheet**（bigocheatsheet.com）：一張複雜度成長圖，外加常見資料結構操作與排序演算法的時間複雜度表，適合當日後速查。
3. 讀《Step-by-step Big O Complexity Analysis Guide, using JavaScript》（Sahin Arslan）：一步步示範如何拆解函式、算各操作的 Big O、再加總化簡。文末的 space complexity 段落現在可先跳過。

動手自測：拿本課的 `binarySearch`、`hasDuplicate`、`findValue` 三個函式，各自寫下最好、最壞情況的複雜度，並說明為什麼。接著回頭嘗試回答下列 knowledge check——Big O 是什麼、最常見的幾個 Big O 符號、為什麼用 Big O、Big Omega 是什麼又為何較不實用、為什麼常數在 Big O 裡不重要。

## 原文與延伸資源

- 原文：[Time Complexity](https://www.theodinproject.com/lessons/javascript-time-complexity)
- 本課引用：
  - [Big O Notation in JavaScript — Doable Danny](https://www.doabledanny.com/big-o-notation-in-javascript)
  - [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)
  - [Step-by-step Big O Complexity Analysis Guide, using JavaScript — Sahin Arslan](https://www.sahinarslan.tech/posts/step-by-step-big-o-complexity-analysis-guide-using-javascript)

---

> 本講義改寫自 The Odin Project《Time Complexity》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
