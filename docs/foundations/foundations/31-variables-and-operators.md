---
title: 變數與運算子
source_url: https://www.theodinproject.com/lessons/foundations-variables-and-operators
source_file: vendor/curriculum/foundations/javascript_basics/variables_and_operators.md
path: foundations
course: Foundations
order: 31
status: draft
generated: 2026-07-03
---

# 變數與運算子

> 改寫自 The Odin Project：[Variables and Operators](https://www.theodinproject.com/lessons/foundations-variables-and-operators)
> ｜Foundations › JavaScript Basics

## 核心概念

前面你已經學會用 HTML 建構網頁結構、用 CSS 美化外觀。下一步是讓網頁「動起來」，能回應使用者的操作，這正是 JavaScript 的工作。這一課我們先打好最基本的地基：如何執行 JavaScript、如何用變數（variable）儲存資料，以及如何用運算子（operator）處理數字與字串。

### 如何執行 JavaScript

在 Foundations 這個階段，我們的 JavaScript 幾乎都跑在瀏覽器（browser）裡，也就是讓瀏覽器來執行我們寫的程式碼。最簡單的方式是建立一個 HTML 檔，把程式碼放進 `<script>` 標籤內：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <title>我的第一支 JS</title>
</head>
<body>
  <script>
    // 你的 JavaScript 寫在這裡
    console.log("Hello, World!");
  </script>
</body>
</html>
```

把檔案存檔後用瀏覽器打開，接著打開開發者工具（DevTools）的 console（主控台）就能看到輸出。開啟方式：在網頁空白處按右鍵 → 點「檢查」或「Inspect」→ 切到「Console」分頁，就會看到 `console.log` 印出的結果。

`console.log()` 是把東西印到 console 的指令，是我們初學階段最常用的除錯（debug）與觀察工具。除了把程式直接寫在 HTML 裡，也可以像連結外部 CSS 一樣，用外部檔案：

```html
<script src="javascript.js"></script>
```

JavaScript 檔案的副檔名是 `.js`。較複雜的程式通常會拆成外部檔管理。

### 變數：資料的儲存容器

變數是任何程式的基本磚塊，你可以把它想成「裝資料的容器」。JavaScript 有三個關鍵字可以宣告（declare）變數：`let`、`const`、`var`。

**`let`** 宣告的變數可以重新賦值（re-assign）：

```javascript
let age = 11;
console.log(age); // 印出 11

age = 54;         // 第二次不用寫 let，因為變數已經宣告過了
console.log(age); // 印出 54
```

注意重新賦值時「不要」再寫 `let`，因為變數只需要宣告一次，之後只是把新值放進同一個容器。

**`const`**（constant，常數）宣告的變數「不能」重新賦值，一旦你嘗試改它，程式會直接丟出錯誤（error）：

```javascript
const pi = 3.14;
pi = 10;          // TypeError：Assignment to constant variable
console.log(pi);  // 這行根本執行不到
```

錯誤看起來很惱人，但其實非常有用：它明確告訴你哪裡出錯、錯在第幾行，幫你快速定位問題。

**`var`** 是 JavaScript 最早期宣告變數的方式，行為類似 `let`（也可重新賦值），但有一些容易造成 bug 的「怪癖」（例如作用域與提升的問題），這些問題在語言引入 `let` 與 `const` 後就被解決了。現在幾乎不再使用 `var`，但你在舊程式碼裡可能會遇到它，所以知道它存在即可。

實務上的建議：**優先用 `const`，需要重新賦值時才改用 `let`，避免使用 `var`**。

### 變數命名規則

- 名稱只能包含「字母、數字、`$`、`_`」這四類字元。
- 不能以「數字」開頭（`test123` 可以，`123test` 不行）。
- 名稱區分大小寫（case sensitive）：`apple` 和 `APPLE` 是兩個不同的變數。
- 不能使用保留字（reserved word），例如 `let`、`class`、`return`、`function` 都不能拿來當變數名。
- 慣例上多字組合用 camelCase（駝峰式）：`firstName`、`myVeryLongName`。
- 命名要有意義：`currentUser` 比 `u` 或 `usr` 好維護。
- 全大寫名稱（如 `const COLOR_RED = "#F00";`）通常用來代表「寫死、不會變的常數值」，讓程式更好讀。

### 數字與運算子

在 JavaScript 裡，數字的運算方式跟你熟悉的數學幾乎一樣，而且遵守標準的「運算優先順序」（operator precedence，也就是 PEMDAS／BODMAS）：

1. **括號（Parentheses）** 最先算。
2. **次方（Exponentiation）** 其次，由右往左。
3. **乘、除** 再來，由左往右。
4. **加、減** 最後，由左往右。

所以 `(3 + 2) - 76 * (1 + 1)` 這個式子會照你預期的順序求值。除了四則運算，還有幾個重要運算子：

- 次方 `**`：`2 ** 3` 得 `8`，`4 ** (1/2)` 得 `2`（等於開根號）。
- 餘數（Modulo / Remainder）`%`：回傳整數除法的餘數。`5 % 2` 得 `1`，`8 % 4` 得 `0`。常用來判斷奇偶數（`n % 2 === 0` 表示偶數）。
- 遞增 `++` 與遞減 `--`：讓變數加 1 或減 1。

### 加號的兩張臉：字串串接

`+` 運算子有個特別行為：只要「有一個運算元是字串」，另一個就會被轉成字串，然後做「串接」（concatenation）而非相加。這常是初學者的困惑來源：

```javascript
console.log(1 + 2);       // 3（兩者都是數字，做加法）
console.log("1" + 2);     // "12"（有字串，做串接）
console.log(2 + 2 + "1"); // "41"（由左往右：先 2+2=4，再 4+"1"="41"）
console.log("1" + 2 + 2); // "122"（第一個就是字串，後面全部串接）
```

要注意 `-`、`*`、`/` 沒有這個特性，它們永遠把運算元轉成數字。

### 一元加號：把字串轉成數字

放在單一值前面的 `+`（unary plus，一元加號）會把該值轉成數字，效果等同 `Number(...)`：

```javascript
console.log(+"10");  // 10（數字，不是字串）
console.log(+"");    // 0
console.log(+true);  // 1
```

這在處理表單輸入時很實用，因為表單拿到的值通常是字串，運算前要先轉成數字。一元加號的優先順序（14）比二元加號（11）高，所以 `+"3" + +"4"` 會先各自轉成數字再相加，得到 `7`。

## 程式碼範例

```javascript
// 1. 宣告與重新賦值
let score = 10;
score = score + 5;          // 也可寫成 score += 5
console.log(score);         // 15

// 2. 常數不可重新賦值
const MAX = 57;
const actual = MAX - 13;    // 44
const percentage = actual / MAX;
console.log(percentage);    // 約 0.7719

// 3. 餘數：判斷奇偶
console.log(9 % 2);         // 1（奇數）
console.log(8 % 2);         // 0（偶數）

// 4. 遞增／遞減
let count = 0;
count++;                    // count 變成 1
console.log(count);         // 1

// 5. 加號的兩種行為
console.log(23 + 97);       // 120（數字相加）
console.log("價格：" + 100); // "價格：100"（字串串接）
```

## 常見陷阱

!!! warning "前綴 vs 後綴：`++x` 與 `x++` 回傳值不同"
    遞增／遞減放在變數「前面」（前綴 prefix）或「後面」（後綴 postfix），改變的都是同一件事（變數加 1），但整個運算式「回傳的值」不一樣：前綴回傳「改變後」的新值，後綴回傳「改變前」的舊值。

    ```javascript
    let a = 1;
    let b = ++a;   // 前綴：a 先變 2，b 拿到 2 → a=2, b=2
    let c = 1;
    let d = c++;   // 後綴：d 先拿到舊值 1，c 才變 2 → c=2, d=1
    ```

    如果你沒有把回傳值拿去用（例如單獨一行 `a++;`），兩者效果相同，不必糾結。

!!! warning "`+` 有時是加法、有時是串接"
    只要有一邊是字串，`+` 就變成串接。`"3" + 5` 得到 `"35"` 而不是 `8`。從表單、`prompt()` 或 API 拿到的數字往往其實是字串，運算前記得用 `Number(x)` 或一元加號 `+x` 轉型，否則會得到意料之外的結果。

!!! warning "重新賦值不要再寫 `let`"
    變數只需宣告一次。第二次還寫 `let x = ...` 會被視為「重複宣告」而報錯。之後要改值時，直接寫 `x = 新值` 即可。

## 練習

在 HTML 檔的 `<script>` 標籤裡加入程式碼，逐題嘗試並用 `console.log` 觀察結果：

1. 把兩個數字相加：輸入 `console.log(23 + 97)`，應印出 `120`。
2. 同樣做法，改成把 6 個不同數字加在一起。
3. 印出 `(4 + 6 + 9) / 77` 的值，console 應顯示約 `0.24675`。
4. 練習使用變數：
   1. 加入 `let a = 10`。
   2. 下一行加 `console.log(a)`，執行後應印出 `10`。
   3. 接著把 `a` 重新賦值成別的數字，再 `console.log(a)` 一次，會顯示新值（前一次的 log 仍是舊值 `10`，因為那是在重新賦值之前）。
   4. 在最下面加 `let b = 7 * a`。
   5. 印出 `b`，應是 7 乘上你剛重新賦值的 `a`。
5. 試這串常數：
   1. 宣告 `const max = 57`。
   2. 宣告 `const actual = max - 13`。
   3. 宣告 `const percentage = actual / max`。
   4. 印出 `percentage`，應看到約 `0.7719`。
6. 多花幾分鐘在 `<script>` 裡自由嘗試各種運算，確認自己對變數與運算子都上手了再往下走。

## 原文與延伸資源

- 原文：[Variables and Operators](https://www.theodinproject.com/lessons/foundations-variables-and-operators)
- 本課引用：
  - [MDN：What is JavaScript?](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_is_JavaScript) — 理解 JavaScript 在網頁上扮演的角色。
  - [JavaScript.info：Variables](https://javascript.info/variables) — 變數宣告與命名規則的完整說明。
  - [MDN：JavaScript math](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Math) — 從另一角度介紹數字運算。
  - [JavaScript.info：Operators](https://javascript.info/operators) — 運算子細節，頁尾的 Tasks 建議動手做。

---

> 本講義改寫自 The Odin Project《Variables and Operators》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
