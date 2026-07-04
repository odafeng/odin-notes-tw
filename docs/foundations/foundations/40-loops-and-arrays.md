---
title: 迴圈與陣列
source_url: https://www.theodinproject.com/lessons/foundations-loops-and-arrays
source_file: vendor/curriculum/foundations/javascript_basics/loops_and_arrays.md
path: foundations
course: Foundations
order: 40
status: draft
generated: 2026-07-03
---

# 迴圈與陣列

> 改寫自 The Odin Project：[Loops and Arrays](https://www.theodinproject.com/lessons/foundations-loops-and-arrays)
> ｜Foundations › JavaScript Basics

## 核心概念

寫程式時常會碰到兩個難題：一是「重複」，二是「大量資料」。假設你想把班上每位同學的名字記下來，如果替每個名字都宣告一個 variable（變數），既繁瑣又難以維護；假設你想對這些名字逐一做同一件事，手動複製貼上更是不切實際。這一課要介紹的 loop（迴圈）與 array（陣列），正是為了解決這兩個難題而生。

### 迴圈：讓電腦替你重複

電腦不會累，而且非常快。對於「同一段動作要做很多次」的工作，迴圈就是最自然的工具。loop（迴圈）是一種控制結構（control structure），能讓一段程式碼重複執行。

最常見的是 **for 迴圈**，它把迴圈的三個要件寫在同一行：

```javascript
for (初始化; 條件; 每輪結束後的動作) {
  // 迴圈主體
}
```

- **初始化（initializer）**：設定一個計數器 variable，例如 `let i = 0`，只在迴圈開始時執行一次。
- **條件（condition）**：每輪執行前先檢查，為 `true` 才繼續，為 `false` 就停止，例如 `i < 10`。
- **每輪結束後的動作（final-expression）**：每跑完一輪主體後執行，通常用來更新計數器，例如 `i++`。

理解執行順序是關鍵：初始化 → 檢查條件 → 執行主體 → 執行結束動作 → 再檢查條件……如此反覆，直到條件為 `false`。

除了 for，還有兩種以條件為主的迴圈：

- **while 迴圈**：只要條件為 `true` 就一直執行。適合「不確定要跑幾次、只知道停止條件」的情況。
- **do...while 迴圈**：先執行一次主體，再檢查條件。特色是主體「至少會執行一次」，即使條件一開始就是 `false`。

### break 與 continue：控制迴圈的流向

在迴圈主體裡，有兩個關鍵字可以改變流向：

- **break**：立刻「跳出」整個迴圈，後面的輪次都不再執行。常用於「找到目標就結束」的情境。
- **continue**：立刻「跳過」本輪剩下的程式碼，直接進入下一輪。常用於「符合某條件的元素就略過」的情境。

### 陣列：把多個值裝進一個變數

array（陣列）是一種資料結構（data structure），是一組「有順序的值」的集合，這些值可以是字串（string）、數字（number）或其他任何東西。有了陣列，你就能用「一個」variable 裝下整份名單，而不必宣告一堆變數。

陣列以中括號 `[]` 建立，用 **index（索引）** 存取元素。重點是索引 **從 0 開始**：第一個元素是 `arr[0]`，第二個是 `arr[1]`，以此類推。`arr.length` 會告訴你陣列裡有幾個元素，所以最後一個元素永遠是 `arr[arr.length - 1]`。你也可以用同樣的方式指派新值來「修改」元素，例如 `arr[0] = "新值"`。

陣列與迴圈是天生一對：用 for 迴圈搭配 `i < arr.length`，就能逐一走訪每個元素做同樣的處理。

### 陣列方法：map、filter、reduce

陣列不只能裝資料，還內建一整套「操作資料」的 method（方法）。其中 `map`、`filter`、`reduce` 三者最為經典，它們都接受一個 **callback（回呼函式）** —— 也就是「把另一個函式當成引數傳進去」。它們會自動走訪整個陣列，你不必自己寫 for 迴圈。

- **map**：把每個元素「轉換」成新值，回傳一個「等長」的新陣列。例如把每個數字加一。
- **filter**：對每個元素執行 callback，只把 callback 回傳 `true` 的元素「留下」，回傳一個新陣列。例如只保留奇數。
- **reduce**：把整個陣列「濃縮」成單一結果。它的 callback 接收兩個引數：**accumulator（累加器）**，代表目前累積到的結果；以及 **current（當前元素）**。`reduce` 還可以在 callback 之後傳入第二個引數作為 **initialValue（初始值）**；若不提供，初始值就是陣列的第一個元素。例如把所有數字相乘。

這三個方法有一個共通的重要特性：**它們都不會改動原陣列，而是回傳一個新的結果**。這讓程式更好預測、也更不容易出錯。

比起手寫 for 迴圈，用這三個方法常常能寫出更精簡、更好讀的程式碼。更棒的是，它們可以「串接」：先 `filter` 篩選、再 `map` 轉換、最後 `reduce` 匯總，讀起來就像一句話。

### 測試驅動開發（TDD）

test-driven development（測試驅動開發，簡稱 TDD）指的是「先寫測試、再寫實作」的開發方式。做法是：先寫一段自動化測試，描述你的函式「應該」產生什麼結果；這時測試會失敗，因為程式還沒寫；接著你才動手實作，直到測試通過，就代表程式如預期運作。

好處在於：你不必反覆手動輸入不同數值來驗證。想像一個判斷井字遊戲勝負的函式，若沒有自動化測試，你可能得親自玩好幾局才敢確定它正確。有了測試，一切驗證都能自動完成，開發也更有效率。這門課稍後會正式教你怎麼寫測試，現在先建立這個觀念即可。

## 程式碼範例

```javascript
// for 迴圈：印出 1 到 5
for (let i = 1; i <= 5; i++) {
  console.log(i); // 依序印出 1、2、3、4、5
}

// while 迴圈：條件成立就一直跑
let count = 0;
while (count < 3) {
  console.log("count 是", count);
  count++; // 別忘了更新條件變數，否則會無限迴圈
}
```

```javascript
// break：找到 Sarah 就停止
const contacts = ["Chris:2232322", "Sarah:3453456", "Bill:7654322"];
for (const contact of contacts) {
  const [name, number] = contact.split(":");
  if (name === "Sarah") {
    console.log("找到號碼：" + number);
    break; // 立刻跳出整個迴圈
  }
}

// continue：只印出奇數
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) {
    continue; // 遇到偶數就跳過本輪
  }
  console.log(i); // 印出 1、3、5、7、9
}
```

```javascript
// 陣列的建立、存取與修改
const students = ["小明", "小華", "小美"];
console.log(students[0]); // 小明（索引從 0 開始）
console.log(students.length); // 3
console.log(students[students.length - 1]); // 小美（最後一個）
students[1] = "阿華"; // 修改索引 1 的元素
console.log(students); // ["小明", "阿華", "小美"]
```

```javascript
// map：把每個數字加一，回傳新陣列
const arr = [1, 2, 3, 4, 5];
const mapped = arr.map((num) => num + 1);
console.log(mapped); // [2, 3, 4, 5, 6]
console.log(arr); // [1, 2, 3, 4, 5]，原陣列不受影響

// filter：只保留奇數
const oddNums = arr.filter((num) => num % 2 !== 0);
console.log(oddNums); // [1, 3, 5]

// reduce：把所有數字相乘（初始值設為 1）
const product = arr.reduce((total, current) => total * current, 1);
console.log(product); // 120
```

```javascript
// 串接三個方法：把陣列中的偶數各乘以 3，再全部加總
function sumOfTripledEvens(array) {
  return array
    .filter((num) => num % 2 === 0) // 只留偶數
    .map((num) => num * 3)          // 每個乘以 3
    .reduce((acc, curr) => acc + curr); // 加總
}
console.log(sumOfTripledEvens([1, 2, 3, 4, 5])); // 18（(2+4)*3）
```

## 常見陷阱

!!! warning "索引從 0 開始，別越界"
    陣列第一個元素是 `arr[0]`，最後一個是 `arr[arr.length - 1]`，而不是 `arr[arr.length]`。存取超出範圍的索引會得到 `undefined`，這是初學者最常見的 off-by-one（差一）錯誤。for 迴圈條件請用 `i < arr.length`，不要寫成 `i <= arr.length`。

!!! warning "while 迴圈忘了更新條件變數會無限迴圈"
    while 與 do...while 迴圈必須確保條件「終究會變成 false」。如果忘了在主體裡更新條件用的 variable（例如漏寫 `count++`），迴圈就會永遠跑下去，讓瀏覽器或程式當掉。

!!! warning "map、filter、reduce 回傳新陣列，不會改動原陣列"
    這三個方法都回傳「新的」結果，原陣列保持不變。若你以為呼叫 `arr.map(...)` 就會改到 `arr` 本身，結果會不如預期。務必把回傳值「接住」存進變數。另外別把 `map` 和 `forEach` 搞混：需要「轉換後的新陣列」用 `map`，只是想「逐一執行副作用」而不需要回傳值時才用 `forEach`。

!!! warning "reduce 不給初始值時要小心空陣列"
    `reduce` 若不提供 initialValue，會拿第一個元素當初始值。對「空陣列」呼叫沒有初始值的 `reduce` 會直接拋出錯誤。若陣列可能為空，請務必傳入初始值（例如加總用 `0`、相乘用 `1`）。

## 練習

1. 前往 JavaScript.info 陣列方法文章末尾的 [array methods 練習題](https://javascript.info/array-methods#tasks)，只完成下列這幾題：
   - Translate border-left-width to borderLeftWidth（字串轉駝峰命名）
   - Filter range（過濾出範圍內的數字）
   - Filter range "in place"（就地過濾範圍）
   - Sort in decreasing order（由大到小排序）
   - Copy and sort array（複製後排序，不動原陣列）
   - Shuffle an array（洗牌打亂陣列）
   - Filter unique array members（濾出不重複的元素）
2. 回到 [JavaScript 練習題 repository 的 `foundations/` 目錄](https://github.com/TheOdinProject/javascript-exercises/tree/main/foundations)（就是先前在「資料型別與條件判斷」那一課介紹過的那個）。動手前先讀每題的 README，並依序完成下列練習：
   - `06_repeatString`
   - `07_reverseString`
   - `08_removeFromArray`
   - `09_sumAll`
   - `10_leapYears`
   - `11_tempConversion`

   提示：每一題的 `solution` 資料夾裡都附有參考解答，卡關時再參考。

## 原文與延伸資源

- 原文：[Loops and Arrays](https://www.theodinproject.com/lessons/foundations-loops-and-arrays)
- 本課引用：
  - [MDN：Looping code](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Loops)（迴圈、break、continue 的完整說明與練習）
  - [JavaScript.info：Loops: while and for](https://javascript.info/while-for)（迴圈的另一種說明與練習）
  - [JavaScript.info：Arrays](https://javascript.info/array)（陣列入門：建立、存取、修改）
  - [JavaScript.info：Array methods](https://javascript.info/array-methods)（陣列方法深入介紹，含本課練習題）
  - [MDN：Array 文件](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)（所有內建陣列屬性與方法的權威參考，建議加書籤）
  - 影片（本文未抓取，供延伸觀看）：[JavaScript Arrays crash course](https://www.youtube.com/watch?v=7W4pQQ20nJg)（約 6 分鐘的陣列速成）

---

> 本講義改寫自 The Odin Project《Loops and Arrays》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
