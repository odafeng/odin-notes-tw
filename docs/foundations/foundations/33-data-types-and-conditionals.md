---
title: 資料型別與條件判斷
source_url: https://www.theodinproject.com/lessons/foundations-data-types-and-conditionals
source_file: vendor/curriculum/foundations/javascript_basics/data_types_and_conditionals.md
path: foundations
course: Foundations
order: 33
status: draft
generated: 2026-07-03
---

# 資料型別與條件判斷

> 改寫自 The Odin Project：[Data Types and Conditionals](https://www.theodinproject.com/lessons/foundations-data-types-and-conditionals)
> ｜Foundations › JavaScript Basics

## 核心概念

到目前為止，你寫的程式其實跟一台計算機差不多：算得比人快，但本質上只是照著算式跑。真正讓程式「聰明」起來的，是讓電腦懂得**判斷**——依當下的資料決定接下來要做什麼。這一課有兩大主題：先認識 JavaScript 裡各種**資料型別（data type）**，再學會用**條件判斷（conditional）**讓程式依資料分岔。

### JavaScript 的八種資料型別

JavaScript 的值一共分成八種型別。其中七種叫做**primitive（原始型別）**，代表最基本、不可再拆的單一值：

- **Number（數字）**：整數與浮點數共用這一種，例如 `42`、`3.14`。還包含兩個特殊值 `Infinity`（無限大）與 `NaN`（Not a Number，非數值，代表一次失敗的數學運算）。
- **BigInt**：用來表示超出 Number 安全範圍的超大整數，寫法是在整數後面加 `n`，例如 `9007199254740993n`。
- **String（字串）**：一段文字，例如 `"hello"`。
- **Boolean（布林）**：只有 `true`（真）與 `false`（假）兩個值，是條件判斷的核心。
- **null**：一個特殊值，表示「空的」「刻意留白」「目前沒有東西」。
- **undefined**：表示「尚未指定值」，變數宣告後還沒賦值時就是它。
- **Symbol**：用來建立獨一無二的識別碼，屬於進階主題，現在知道有這個東西即可。

第八種、也是唯一的**非 primitive** 型別是 **Object（物件）**，用來裝一整組資料或較複雜的結構（array 陣列也屬於物件的一種）。這是 knowledge check 常考的重點：八種型別中，只有 object 不是 primitive。

**null 與 undefined 的關係**：兩者都表示「沒有值」，但語意不同。`undefined` 是系統的預設狀態——變數還沒被賦值時就是 `undefined`；`null` 則是**你自己主動**放進去的空值，用來明確表達「這裡我故意留空」。慣例上：讓 `undefined` 維持它的預設角色，需要表示「刻意的空」時才用 `null`。

想知道某個值是什麼型別，可以用 `typeof` 運算子，例如 `typeof "hi"` 會得到 `"string"`。

### 字串：三種引號的差別

JavaScript 有三種方式框住字串，前兩種完全等價，第三種特別重要：

- **單引號** `'...'` 與**雙引號** `"..."`：功能相同，就是純文字。挑一種、整個專案保持一致即可。
- **反引號（backtick）** `` `...` ``：稱為 **template literal（樣板字面值）**，多了一項超能力——可以直接把變數或運算式塞進字串裡，語法是 `${ ... }`。

把字串接在一起這件事叫做 **concatenation（字串串接）**。老方法是用 `+`；但用 template literal 更好讀：

```js
const name = "Odin";
console.log("Hi " + name + "!");   // 老方法：用 + 串接
console.log(`Hi ${name}!`);        // template literal：把變數嵌進去
```

只有反引號能做 `${}` 嵌入，單、雙引號不行——這也是常考題。

**escape character（跳脫字元）**：如果字串裡要放跟外層相同的引號，或是換行等特殊符號，用反斜線 `\` 跳脫。例如 `'It\'s ok'` 裡的 `\'` 代表一個真正的單引號，`\n` 代表換行。

### method（方法）與字串的常用操作

**method（方法）**指的是「內建在某種型別上的功能」，用「值 + 點 + 方法名 + 括號」呼叫，例如 `"hello".toUpperCase()`。字串內建很多方法，常見的有：`length`（其實是屬性，回傳長度）、`toUpperCase()`／`toLowerCase()`（大小寫轉換）、`indexOf()`（找位置）、`replace()`（取代）、`slice()` 與 `substring()`（切出子字串）。

`slice` 與 `substring` 很像，但有個差別要記住：`slice(start, end)` 接受負數索引（從尾端往回數），而 `substring` 會把負數當成 `0`。

### 比較運算子與邏輯運算子

**comparison operator（比較運算子）**用來比較兩個值，結果一定是布林值 `true` 或 `false`：`>`（大於）、`<`（小於）、`>=`、`<=`、`==`（相等）、`!=`（不相等），以及更嚴格的 `===`（嚴格相等）、`!==`（嚴格不相等）。

`==` 與 `===` 的差別是本課最重要的觀念之一：`==` 會先做型別轉換再比，`0 == "0"` 竟然是 `true`；`===` 則要求**型別與值都相同**，`0 === "0"` 是 `false`。**實務上永遠優先用 `===`**，避開型別轉換帶來的意外。

**logical operator（邏輯運算子）**共三個，用來把多個條件組合起來：

- `&&`（AND，且）：兩邊都為真才為真。
- `||`（OR，或）：任一邊為真就為真。
- `!`（NOT，非）：把真假顛倒過來。

### 條件判斷：if / else if / else

有了布林值，就能用 `if` 讓程式分岔：條件為真跑這塊、為假跑那塊，中間還能用 `else if` 串接更多情況。

```js
if (條件A) {
  // 條件A 為真時執行
} else if (條件B) {
  // 條件A 為假、條件B 為真時執行
} else {
  // 以上都為假時執行
}
```

### truthy 與 falsy：條件裡的隱形轉型

`if` 括號裡不一定要放布林值。任何值進到條件裡，JavaScript 都會先幫它做一次**布林轉換**：轉成 `true` 的叫 **truthy（真值）**，轉成 `false` 的叫 **falsy（假值）**。

JavaScript 的 **falsy 值只有這幾個**，其餘全是 truthy：

- `false`
- `0`（數字零）
- `""`（空字串）
- `null`
- `undefined`
- `NaN`

要特別注意：字串 `"0"` 和 `"false"` 都是**非空字串**，所以是 **truthy**；空陣列 `[]`、空物件 `{}` 也都是 truthy。

### 三元運算子與 switch

當 if/else 只是要「依條件擇一取值」，可以用 **ternary operator（三元運算子）** `?:` 寫得更精簡：

```js
const 訊息 = age >= 18 ? "成年" : "未成年";
// 條件 ? 為真的值 : 為假的值
```

當你要拿**同一個變數**比對很多個固定值時，`switch` 比一長串 else if 更清爽。它用 `===` 逐一比對每個 `case`；務必記得每個 case 結尾加 `break`，否則會「貫穿」繼續執行下一個 case。`default` 則是全部沒中時的預設分支。

### nesting（巢狀）

**nesting（巢狀）**指的是把一個條件判斷放進另一個條件判斷的內部，用來表達「先滿足外層、再細分內層」的多層邏輯。巢狀太深會很難讀，之後會學到更好的寫法，但先理解「條件可以層層包起來」這個概念。

## 程式碼範例

```js
// 1. 型別與 typeof
console.log(typeof 42);          // "number"
console.log(typeof "hi");        // "string"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object"（這是 JS 有名的歷史 bug，記住即可）

// 2. template literal 嵌入變數
const 使用者 = "小明";
const 分數 = 87;
console.log(`${使用者} 這次考了 ${分數} 分，加十分後是 ${分數 + 10} 分`);

// 3. == 與 === 的差別
console.log(0 == "0");   // true：== 會先轉型
console.log(0 === "0");  // false：=== 型別不同直接判 false

// 4. if / else if / else + 邏輯運算子
function 評分等級(分數) {
  if (分數 >= 90) {
    return "優";
  } else if (分數 >= 60 && 分數 < 90) {
    return "及格";
  } else {
    return "不及格";
  }
}
console.log(評分等級(95));  // "優"
console.log(評分等級(72));  // "及格"

// 5. truthy / falsy
const 輸入 = "";
if (輸入) {
  console.log("有輸入內容");
} else {
  console.log("輸入是空字串，屬於 falsy");  // 會印這行
}

// 6. 三元運算子
const 年齡 = 20;
console.log(年齡 >= 18 ? "可以投票" : "還不能投票");  // "可以投票"

// 7. switch（記得 break）
const 星期 = 3;
switch (星期) {
  case 6:
  case 0:
    console.log("週末");
    break;
  default:
    console.log("平日");  // 星期為 3，會印這行
}
```

## 常見陷阱

!!! warning "用 `==` 比較會踩到型別轉換的坑"
    `==` 會在比較前偷偷幫你轉型，導致 `0 == "0"`、`false == ""`、`null == undefined` 這些看似不相等的東西都變成 `true`。除非你很清楚自己在做什麼，否則**一律用 `===` 與 `!==`**，讓型別和值都必須相符，行為才可預測。

!!! warning "falsy 值不只有 `false`"
    很多人以為只有 `false` 才是假。其實 `0`、`""`、`null`、`undefined`、`NaN` 全都是 falsy，會讓 `if` 走進 else。反過來，字串 `"0"`、`"false"`、空陣列 `[]`、空物件 `{}` 都是 **truthy**。判斷「有沒有填東西」時，空字串會被當成 false，這點常讓人意外。

!!! warning "`NaN` 不等於任何值，連自己都不等於"
    `NaN === NaN` 竟然是 `false`。所以不能用 `===` 檢查一個值是不是 `NaN`，要改用 `Number.isNaN(值)`。

!!! warning "switch 少寫 `break` 會貫穿"
    `switch` 一旦某個 `case` 命中，會從那裡一路往下執行，直到遇到 `break` 或整個結束。忘了加 `break`，就會連下面不相干的 case 一起跑掉。除非你是**刻意**要多個 case 共用一段程式（像範例中週末的寫法），否則每個 case 都要收尾 `break`。

!!! warning "字串與數字混著比大小會出乎意料"
    `"10" < "9"` 會得到 `true`，因為兩邊都是字串，是逐字元比字典序（先比 `"1"` 和 `"9"`）。比大小前，先確認兩邊都是 Number 型別。

## 練習

The Odin Project 準備了一個 `javascript-exercises` 練習庫，每題都附帶用 Jest 寫好的測試，你只要讓測試通過即可。題目裡看到的 `return`，意思是「函式跑完後把後面的值吐回去」，之後的課程會詳談，現在照著寫就好。

1. 依 `javascript-exercises` 倉庫 README 的「How to use these exercises」把本機環境架好：fork 該倉庫、clone 到本機、安裝 Jest。
2. 進入 `foundations/` 目錄，**依序**完成下列五題（每題請先讀該題自己的 README）：
    - `01_helloWorld`：刻意做得極簡單，用來確認整個環境與測試都跑得起來。
    - `02_addNumbers`：練習數字運算。
    - `03_numberChecker`：練習比較運算子與條件判斷。
    - `04_mathEquations`：綜合數學與邏輯。
    - `05_joinStrings`：練習字串串接。
3. 過程中**盯著終端機**：讀完所有指示、看懂每一則錯誤訊息再往下。每題的 `solution` 資料夾裡有參考解答，卡住時再看。

寫完後，試著不看資料回答自己：JavaScript 有哪八種型別？哪一種不是 primitive？falsy 值有哪幾個？`==` 與 `===` 差在哪？switch 為什麼要加 `break`？

## 原文與延伸資源

- 原文：[Data Types and Conditionals](https://www.theodinproject.com/lessons/foundations-data-types-and-conditionals)
- 本課引用：
    - [javascript.info：Data types](https://javascript.info/types)（八種型別、null 與 undefined）
    - [javascript.info：Conditional branching: if, '?'](https://javascript.info/ifelse)（if/else、布林轉換、falsy 值、三元運算子）
    - [javascript.info：Comparisons](https://javascript.info/comparison)（比較運算子、`==` 與 `===`）
    - [javascript.info：Logical operators](https://javascript.info/logical-operators)（`&&`、`||`、`!`）
    - [javascript.info：The "switch" statement](https://javascript.info/switch)（switch 語法）
    - [MDN：Handling text — strings in JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Strings)（引號、嵌入、跳脫字元）
    - [MDN：String reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)（字串方法完整參考）
    - [MDN：Making decisions in your code — conditionals](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/conditionals)（if/else、switch、三元、巢狀）
    - [W3Schools：JavaScript String Methods](https://www.w3schools.com/js/js_string_methods.asp)（slice 與 substring 的差別）

---

> 本講義改寫自 The Odin Project《Data Types and Conditionals》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
