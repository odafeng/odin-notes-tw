---
title: 函式基礎（Functions）
source_url: https://www.theodinproject.com/lessons/foundations-function-basics
source_file: vendor/curriculum/foundations/javascript_basics/function_basics.md
path: foundations
course: Foundations
order: 35
status: draft
generated: 2026-07-03
---

# 函式基礎（Functions）

> 改寫自 The Odin Project：[Function Basics](https://www.theodinproject.com/lessons/foundations-function-basics)
> ｜Foundations › JavaScript Basics

## 核心概念

到目前為止，你寫的程式碼都是「一次性」的：解決一個問題後，如果同樣的邏輯要再用一次，就得整段複製貼上。function（函式）的價值就在這裡——把一段程式碼打包成一個可以重複呼叫的小工具，需要時用一個名字就能執行它，不必重寫。函式是 JavaScript 裡最常用的建構單元之一。

### 定義與呼叫

最基本的寫法是 function declaration（函式宣告）：用 `function` 關鍵字，接著函式名稱、一對小括號 `()`、再加上一對大括號 `{}` 包住函式主體（function body）。

```javascript
function greet() {
  console.log("你好！");
}
```

光是「宣告」函式並不會執行裡面的程式。你必須「呼叫」（invoke，也叫 call）它——寫出函式名稱再加上小括號 `greet()`——裡面的程式碼才會真正跑起來。同一個函式可以想呼叫幾次就呼叫幾次。

### parameter 與 argument

函式真正好用的地方，在於它能接收外部傳進來的資料。小括號裡列出的名稱叫做 parameter（參數），它只是一個「佔位符」，代表未來會傳進來的某個值；而你實際呼叫時放進小括號的值，叫做 argument（引數）。

```javascript
function favoriteAnimal(animal) {
  return animal + " 是我最喜歡的動物！";
}

favoriteAnimal("山羊"); // 這裡的 "山羊" 就是 argument
```

上面的 `animal` 是 parameter，呼叫時傳入的 `"山羊"` 是 argument。JavaScript 會把 `"山羊"` 填到函式主體裡每一個 `animal` 出現的位置。parameter 命名要有意義（用 `animal` 而不是 `x`），讀程式的人才知道這裡預期裝什麼。函式可以有多個 parameter，用逗號隔開。

### return：把值送回呼叫端

`return` 陳述句會「立刻結束函式」，並把一個值送回呼叫它的地方。這個送回來的值叫做 return value（回傳值）。上面的 `favoriteAnimal("山羊")` 呼叫，整個運算式的結果就是字串 `"山羊 是我最喜歡的動物！"`，你可以把它存進 variable（變數），或直接當成 argument 傳給另一個函式：

```javascript
const message = favoriteAnimal("山羊");
console.log(message);

// 也可以把函式呼叫直接當成 argument 傳給 console.log
console.log(favoriteAnimal("山羊"));
```

第二種寫法裡，`favoriteAnimal("山羊")` 會先被計算成回傳字串，這個字串才被拿去當 `console.log` 的 argument。你會很常看到這種「把函式呼叫當 argument」的寫法。要注意：沒有 `return` 的函式，回傳值是 `undefined`；而如果只是單獨呼叫 `favoriteAnimal("山羊")`、卻沒把它印出來或存起來，那個回傳值就會被送到「沒有人接手」的地方而消失。

### 預設參數（default parameters）

你可以在 parameter 後面用 `=` 給它一個預設值。當呼叫時省略該 argument（或明確傳入 `undefined`）時，就會採用預設值：

```javascript
function hello(name = "訪客") {
  console.log("你好，" + name + "！");
}

hello("小明"); // 你好，小明！
hello();       // 你好，訪客！
```

### scope（作用域）：變數住在哪裡

scope（作用域）決定一個 variable 能被「看見」的範圍。在函式內部宣告的變數是 local variable（區域變數），只活在該函式裡，函式外面完全存取不到。函式內部則可以讀取外層（例如全域）的變數。這種隔離很重要：不同函式可以各自使用同名變數而不會互相干擾，避免命名衝突與難以追蹤的錯誤。用 `let` 與 `const` 宣告的變數還具有 block scope（區塊作用域），只活在所屬的大括號區塊內。scope 是初學者與中階開發者都常踩坑的主題，值得多花時間熟悉。

### 匿名函式、函式運算式與箭頭函式

沒有名字的函式叫做 anonymous function（匿名函式），常被直接當成 argument 傳進其他函式（例如事件監聽器）。把一個函式指派給變數的寫法，稱為 function expression（函式運算式）：

```javascript
const square = function (x) {
  return x * x;
};
```

function declaration（宣告）與 function expression（運算式）最關鍵的差異是「何時可用」。宣告會在程式執行前就被建立（稱為 hoisting，提升），所以你甚至可以在宣告那一行「之前」就呼叫它；運算式則要等到程式執行到那一行、完成指派後才存在，提前呼叫會報錯。

arrow function（箭頭函式）是函式運算式的簡潔語法，用 `=>` 取代 `function` 關鍵字：

```javascript
const square = (x) => x * x;
```

單一 parameter 可省略小括號，函式主體只有一個回傳運算式時可省略大括號與 `return`。箭頭函式現階段不是必學重點，但你往後一定會遇到，先認得它長什麼樣子就好。

## 程式碼範例

```javascript
// 1. 沒有 return：回傳值是 undefined
function shout(text) {
  console.log(text.toUpperCase());
}
shout("hello"); // 印出 HELLO；本身回傳 undefined

// 2. 有 return：可以接住結果再運用
function add(a, b) {
  return a + b;
}
const total = add(3, 4) * 2; // add 回傳 7，total 為 14
console.log(total);

// 3. local variable 與 scope
function makeGreeting(name) {
  const prefix = "你好，"; // prefix 只活在這個函式裡
  return prefix + name;
}
console.log(makeGreeting("小美"));
// console.log(prefix); // 這行會報錯：prefix 在外面不存在

// 4. 三種寫法對照
function declared(n) {   // 函式宣告
  return n + 1;
}
const expressed = function (n) { // 函式運算式
  return n + 1;
};
const arrow = (n) => n + 1;      // 箭頭函式
console.log(declared(1), expressed(1), arrow(1)); // 2 2 2
```

## 常見陷阱

!!! warning "`return` 與值不要換行"
    JavaScript 會自動補分號（ASI）。如果你把 `return` 和要回傳的值分成兩行寫，`return` 後面會被視為結束，函式其實回傳了 `undefined`，而下一行的運算式永遠不會被送回。要回傳的東西請和 `return` 寫在同一行。

!!! warning "宣告了函式不等於執行了函式"
    只寫 `function greet() {...}` 不會跑裡面的程式，必須加上小括號 `greet()` 呼叫它。同樣地，把函式呼叫寫成 `greet`（少了 `()`）拿到的是函式本身，不是它的回傳值。

!!! warning "沒接住的回傳值會消失"
    函式 `return` 的值一定要被「用掉」——存進變數、當 argument 傳出去、或參與運算——否則它就無聲無息地不見了。單獨寫一行 `add(3, 4)` 不會印出任何東西。

!!! warning "區域變數在外面看不到"
    在函式內用 `let`/`const` 宣告的變數是 local，函式外存取會直接報 `ReferenceError`。想把函式內算出的結果帶到外面，正確做法是用 `return`。

## 練習

在一個 HTML 骨架檔的 `<script>` 標籤裡撰寫下列函式，並用 `console.log` 測試每個函式的輸出。

1. 寫一個名為 `add7` 的函式，接收一個數字，回傳「該數字 + 7」。
    - `add7(10)` 應回傳 `17`
2. 寫一個名為 `multiply` 的函式，接收兩個數字，回傳它們的乘積。
    - `multiply(3, 2)` 應回傳 `6`
3. 寫一個名為 `capitalize` 的函式，接收一個字串，回傳「只有首字母大寫」的版本。要能處理全小寫、全大寫、或大小寫混雜的輸入。
    - `capitalize("abcd")` 應回傳 `"Abcd"`
    - `capitalize("ABCD")` 應回傳 `"Abcd"`
    - `capitalize("aBcD")` 應回傳 `"Abcd"`
4. 寫一個名為 `lastLetter` 的函式，接收一個字串，回傳字串的最後一個字母。
    - `lastLetter("abcd")` 應回傳 `"d"`

小提示：`capitalize` 可用 `str[0].toUpperCase()` 取首字母大寫、`str.slice(1).toLowerCase()` 取其餘字母轉小寫再串接；`lastLetter` 可用 `str[str.length - 1]`。

（延伸練習來自 MDN 的文章各自附有習題，但那些習題牽涉到本課尚未教到的 loop 等主題，暫時不需要做。）

## 原文與延伸資源

- 原文：[Function Basics](https://www.theodinproject.com/lessons/foundations-function-basics)
- 本課引用：
    - [JavaScript.info — Function basics](https://javascript.info/function-basics)（宣告語法、區域/外層變數、預設參數、return）
    - [JavaScript.info — Function expressions](https://javascript.info/function-expressions)（宣告 vs 運算式、hoisting）
    - [JavaScript.info — Arrow functions, the basics](https://javascript.info/arrow-functions-basics)（箭頭函式入門）
    - [MDN — Functions — reusable blocks of code](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Functions)（呼叫、匿名函式、scope）
    - [MDN — Function return values](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Return_values)（回傳值）
    - [The JavaScript Call Stack](https://www.javascripttutorial.net/javascript-call-stack/)（呼叫堆疊與 return 的走向）

---

> 本講義改寫自 The Odin Project《Function Basics》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
