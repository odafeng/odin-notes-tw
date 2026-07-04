---
title: 空間複雜度
source_url: https://www.theodinproject.com/lessons/javascript-space-complexity
source_file: vendor/curriculum/javascript/computer_science/space_complexity.md
path: full-stack-javascript
course: JavaScript
order: 30
generated: 2026-07-03
---

# 空間複雜度

> 改寫自 The Odin Project：[Space Complexity](https://www.theodinproject.com/lessons/javascript-space-complexity)
> ｜Full Stack JavaScript › JavaScript › A Bit of Computer Science

## 核心概念

前一課我們從「時間」的角度衡量演算法的效率，學到用 Big O 來描述：當輸入規模改變時，執行「步驟數」會怎麼成長。這一課我們換一個角度，改看「空間」——當輸入規模改變時，演算法需要用掉多少**記憶體（memory）**。好消息是：衡量的工具完全一樣，還是那套 Big O notation（大 O 記號），你已經會的東西可以直接搬過來用。

### 這裡的「記憶體」指的是什麼

當我們談空間複雜度（space complexity）時，指的是**主記憶體（primary memory）**，也就是系統執行演算法時可用的工作記憶體。你可以把它想成 RAM——程式跑起來時，變數、陣列、暫存資料都放在這裡。它跟硬碟那種長期儲存不同，是「跑程式當下」才占用、跑完就釋放的空間。

### 什麼是空間複雜度

空間複雜度可以理解為：**演算法相對於輸入規模所使用的總空間**。和時間複雜度一樣，我們不在乎某一次特定執行「剛好」用了多少記憶體，而是在乎——當輸入變大時，記憶體用量**如何跟著成長**。

衡量空間複雜度時，要把兩部分算進來：

- **輸入空間（input space）**：傳進演算法的資料本身占用的空間。例如你傳一個有 N 個元素的陣列進來，這個陣列就占了 N 單位的空間。
- **輔助空間（auxiliary space）**：演算法執行過程中額外用掉的空間。像是過程中臨時建立的變數、複製出來的資料結構、迴圈的索引等等。這些東西不會對記憶體造成永久性的影響，但在演算法執行的當下必須被算進去。

把兩者加起來，就是演算法所需的**總工作記憶體**，也就是它的空間複雜度。

### 為什麼要在意空間複雜度

如果你去查演算法效率的資料，你會發現大多數文章幾乎只談時間複雜度，空間複雜度常常只是一句帶過的註腳。這有幾個合理的理由：

- 現在記憶體相對於處理效能來說很便宜，遇到空間不夠，往往加裝 RAM 就解決了。
- 大多數你會寫的演算法，處理的輸入規模其實不大，空間根本不會成為問題。通常你會先遇到「程式跑太慢」，才會遇到「記憶體不夠」。

但反過來看，**記憶體通常是固定的、無法臨時擴充的**。時間問題你還能靠「多等一下」來換結果——讓程式多跑一會兒，它終究會算完；但空間問題不行，記憶體用光就是用光了。所以雖然大多數情況你會更在意時間，但當你真的撞上記憶體受限的場景（例如嵌入式裝置、超大資料集）時，懂得衡量空間複雜度，就能讓你有辦法應對。

### 怎麼衡量：和時間複雜度一模一樣

衡量空間複雜度的方法，和時間複雜度**完全相同**：先算出所有步驟（包含常數），再套上 Big O 時**丟掉常數**。

舉例來說，假設某個演算法的記憶體用量隨輸入呈線性成長，過程中還額外建立了 3 個暫存變數。我們可以把它寫成 `O(N) + 3 個輔助變數`。但因為不管輸入多大，這 3 個變數的數量都不變（它們是常數），所以在談空間複雜度時我們不理它們，直接說這個演算法是 **O(N)**。這個「丟掉常數」的邏輯，你在時間複雜度那一課已經很熟悉了。

提醒一下，最常見的幾種 Big O notation（由好到壞）：

- **O(1)** — 常數複雜度（Constant）
- **O(log N)** — 對數複雜度（Logarithmic）
- **O(N)** — 線性複雜度（Linear）
- **O(N log N)** — N × log N 複雜度
- **O(N²)** — 平方複雜度（Quadratic）
- **O(N³)** — 立方複雜度（Cubic）
- **O(2ᴺ)** — 指數複雜度（Exponential）
- **O(N!)** — 階乘複雜度（Factorial）

### O(1)：常數空間

如果不管輸入多大，演算法用掉的額外空間都固定不變，那就是 O(1)。例如一個「把兩個數字相乘」的函式，無論傳進什麼數字，它只會產生一個結果值，占用的空間永遠一樣。

### O(N)：線性空間

**你會遇到的大多數資料結構，空間複雜度都是 O(N)**。這很合理——當你在資料結構裡放的元素變多，它占的空間就以線性方式跟著變大。同樣地，如果一個函式在過程中「複製」了一份大小為 N 的陣列或物件，那份複製品就占了 N 單位的輔助空間，於是函式的空間複雜度是 O(N)。

### 其他複雜度：多半來自 recursion 與排序

既然大多數資料結構都是 O(N)，你其實不太會寫出空間複雜度差很多的演算法。真正會出現不同空間複雜度的地方，主要是**遞迴函式（recursion）**和某些**排序演算法（sorting algorithm）**。

這裡有個容易被忽略的重點：**recursion 會偷偷吃掉記憶體**。當一個函式呼叫自己，每一層呼叫都會在**呼叫堆疊（call stack）**上壓入一個新的堆疊框（stack frame），裡面存著那一層的參數與區域變數。這個框會一直待在堆疊上，直到那層函式回傳為止。所以如果 `factorial(n)` 會遞迴 N 層，就會同時存在 N 個堆疊框——即使程式碼看起來只有一個變數，它的空間複雜度其實是 **O(N)**。相對地，用迴圈（iterative）寫的版本只重複使用同一個變數，空間複雜度是 **O(1)**。這是 recursion 常見的取捨：程式碼更簡潔漂亮，但空間成本更高。

順帶一提，很多排序演算法的輔助空間其實是 O(1)（例如原地排序），這是你之後接觸各種排序時可以留意的一個對照點。想快速查表，[Big-O Cheat Sheet](https://www.bigocheatsheet.com/) 把常見資料結構與排序演算法的時間與空間複雜度都整理好了，是很值得收藏的參考。

### 一個常讓人困惑的問題：要不要算「傳進來的參數」

前面的線性範例裡，我們刻意先「複製」一份傳進來的陣列或物件，是為了讓「額外用掉的空間」很明確。但如果我們不複製，直接用傳進來的那份呢？

這就牽涉到一個經典的爭議：當一個資料結構被當作參數傳進函式（尤其在 JavaScript 這種**陣列以參考（reference）而非值（value）傳遞**的語言裡），到底該不該把它的空間算進這個函式的空間複雜度？

- 如果**不算**：那幾乎每個函式在紙面上看起來都很省空間，因為把「配置空間」的責任推給了呼叫方。
- 如果**算**：但這份資料結構可能是給很多函式共用的，那所有這些函式就都變成 O(N)，即使它們根本沒有額外用空間。再說，就算你只是把陣列傳進來跑迴圈，迴圈本身也需要一個索引，那也是額外空間。

結論上，因為 Big O 衡量的是**最壞情況（worst-case）**，保守起見，**傾向把傳進參數的空間也算進去**會比較穩妥。

### 收尾：什麼時候該在意

衡量複雜度（不論時間或空間）都需要練習與思考。對你平常寫的大多數練習碼來說，這通常不會浮上心頭——尤其當你還在跟「讓程式跑起來」搏鬥的時候。但當程式能動了、你想重構時，就值得停下來想一想：有沒有建立不必要的變數？有沒有用了一個對這個用途來說效率較差的資料結構？

同時也別忘了**可讀性的平衡**。如果為了效率導入 [memoization（記憶化）](https://en.wikipedia.org/wiki/Memoization) 之類的技巧，反而讓程式難懂，那這個取捨值得嗎？建議是：**先顧可讀性，只有當效能有明顯影響時，才回頭為效率重構。**

## 程式碼範例

```javascript
// O(1) 常數空間：不論傳進什麼數字，只產生一個結果值，占用空間固定不變
function multiply(num1, num2) {
  return num1 * num2;
}
```

```javascript
// O(N) 線性空間：過程中複製了一份大小為 N 的陣列，輔助空間隨輸入成長
function sumArr(arr) {
  const copyArr = arr.slice(); // 複製一份，占 N 單位空間
  let sum = 0;                 // sum 是常數空間，Big O 下會被丟掉
  copyArr.forEach((number) => {
    sum += number;
  });
  return sum;
}
// 空間為 N + 1（copyArr 的 N，加上 sum 的 1），丟掉常數後 => O(N)
```

```javascript
// O(N) 線性空間：換成物件也一樣，複製品隨物件大小線性成長
function sumObjectValues(obj) {
  const copyObject = { ...obj }; // 展開複製，占 N 單位空間
  let sum = 0;
  Object.values(copyObject).forEach((value) => {
    sum += value;
  });
  return sum;
}
```

```javascript
// recursion vs iterative：同樣的計算，空間複雜度不同

// 遞迴版：factorial(n) 會壓入 n 層 stack frame => O(N) 空間
function factorialRecursive(n) {
  if (n <= 1) return 1;
  return n * factorialRecursive(n - 1);
}

// 迴圈版：只重複使用同一個 result 變數 => O(1) 空間
function factorialIterative(n) {
  let result = 1;
  for (let i = 2; i <= n; i += 1) {
    result *= i;
  }
  return result;
}

console.log(factorialRecursive(5)); // 120
console.log(factorialIterative(5)); // 120
```

## 常見陷阱

!!! warning "recursion 的空間藏在 call stack 裡"
    看程式碼常常只看到「一個變數」，就以為是 O(1)，卻忘了 recursion 每呼叫自己一層，就在 **call stack（呼叫堆疊）** 上多壓一個 **stack frame**。遞迴 N 層就同時存在 N 個框，空間其實是 O(N)。想省空間時，把 recursion 改寫成 iterative（迴圈）往往能把空間從 O(N) 降到 O(1)。

!!! warning "別忘了算「傳進來的參數」與迴圈索引"
    JavaScript 的陣列是以 reference（參考）傳遞，很容易讓人誤以為「反正沒複製，就不占空間」。但 Big O 衡量最壞情況，保守做法是**把參數占用的空間也算進去**。此外，用迴圈跑陣列時，索引本身也是額外空間。真正能省空間的，是避免「不必要的複製」（例如 `arr.slice()`、`{ ...obj }`），而不是假裝傳進來的資料不存在。

## 練習

1. 閱讀這篇 [Big O 與空間複雜度的文章](https://dev.to/mwong068/big-o-space-complexity-lcm)。它不深，但把觀念講得很清楚，也輕輕帶到遞迴函式。程式碼範例是 Ruby，但你應該能看懂脈絡。閱讀時，特別留意它怎麼區分「輸入空間」與「輔助空間」，以及為什麼三種排序（merge / insertion / heap）總空間都是 O(N)，但輔助空間卻不同。
2. 閱讀這篇 [遞迴與空間複雜度的文章](https://dev.to/elmarshall/recursion-and-space-complexity-13gc)，它對遞迴函式的空間複雜度提供了更多脈絡。重點放在 call stack：每一層遞迴呼叫都會建立新的變數並壓入堆疊，直到該層回傳才釋放，因此遞迴愈深、記憶體負擔愈重。
3. 對照練習：把上面範例中的 `factorialRecursive` 與 `factorialIterative` 拿來比較，親手推導各自的空間複雜度，確認你能說出「為什麼一個是 O(N)、一個是 O(1)」。

## 原文與延伸資源

- 原文：[Space Complexity](https://www.theodinproject.com/lessons/javascript-space-complexity)
- 本課引用：
  - [Big O Space Complexity（dev.to，mwong068）](https://dev.to/mwong068/big-o-space-complexity-lcm)
  - [Recursion and Space Complexity（dev.to，elmarshall）](https://dev.to/elmarshall/recursion-and-space-complexity-13gc)
  - [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)
  - [Analyzing space complexity of passing data by reference（CS StackExchange）](https://cs.stackexchange.com/questions/127933/analyzing-space-complexity-of-passing-data-to-function-by-reference)
  - [Memoization（Wikipedia）](https://en.wikipedia.org/wiki/Memoization)

---

> 本講義改寫自 The Odin Project《Space Complexity》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
