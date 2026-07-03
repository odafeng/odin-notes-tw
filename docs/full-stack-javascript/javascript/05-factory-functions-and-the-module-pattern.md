---
title: 工廠函式與模組模式
source_url: https://www.theodinproject.com/lessons/node-path-javascript-factory-functions-and-the-module-pattern
source_file: vendor/curriculum/javascript/organizing_your_javascript_code/factory_functions_and_module_pattern.md
path: full-stack-javascript
course: JavaScript
order: 5
status: draft
generated: 2026-07-03
---

# 工廠函式與模組模式

> 改寫自 The Odin Project：[Factory Functions and the Module Pattern](https://www.theodinproject.com/lessons/node-path-javascript-factory-functions-and-the-module-pattern)
> ｜Full Stack JavaScript › JavaScript › Organizing Your JavaScript Code

## 核心概念

上一課我們用 object constructor（物件建構函式）搭配 `new` 來產生物件。它是 JavaScript 很常見的基礎工具，但有一些設計上的缺陷。這一課要介紹另一種組織程式碼的方式：factory function（工廠函式）與 module pattern（模組模式）。要理解它們，得先把兩個底層觀念打穩：scope（作用域）與 closure（閉包）。

### 一、Scope：變數在哪裡才拿得到？

Scope 問的是「這個變數在什麼範圍內可以被存取」。規則分成三層：

- **Global scope（全域作用域）**：宣告在任何函式與任何 `{ }` 之外的變數，到處都拿得到。
- **Function scope（函式作用域）**：`var` 宣告的變數只在「它所在的那個函式」內部有效。這是 ES6 之前唯一的宣告方式。
- **Block scope（區塊作用域）**：ES6 新增的 `let` 與 `const`，作用域縮到「最靠近的那對大括號」之內。`for` 迴圈、`if-else`、或任何一對 `{ }` 都算一個 block（區塊）。

```javascript
let globalAge = 23; // 全域變數，到處可用

function printAge(age) {
  var varAge = 34; // function scope：只在 printAge 內有效

  if (age > 0) {
    const constAge = age * 2; // block scope：只在這個 if 的 { } 內有效
    console.log(constAge);
  }

  console.log(constAge); // 錯誤！constAge 已經離開它的區塊
}

printAge(globalAge);
console.log(varAge); // 錯誤！varAge 在 printAge 外面拿不到
```

記住這個分層，是理解閉包的前置條件。

### 二、Closure：函式記得它出生的環境

你可以用一個函式去「製造」另一個函式。看這個例子：

```javascript
function makeAddingFunction(firstNumber) {
  return function (secondNumber) {
    return firstNumber + secondNumber;
  };
}

const add5 = makeAddingFunction(5);
console.log(add5(2)); // 7

const add8 = makeAddingFunction(8);
console.log(add8(2)); // 10
```

`add5` 是 `makeAddingFunction(5)` 回傳的那個內層函式。神奇的是：`makeAddingFunction(5)` 早就執行完了，`firstNumber = 5` 照理該被清掉，但它沒有——因為回傳出去的函式還需要用到它。

這就是 **closure（閉包）**：一個函式，加上它被「宣告當下」所處的周遭狀態（surrounding state，又稱 lexical environment，語彙環境）綁在一起。這個周遭狀態，指的是宣告當時在作用域內的那些區域變數。`add5` 之所以永遠記得 5、`add8` 永遠記得 8，就是因為各自抓住了自己的 lexical environment。閉包讓我們能把「資料」黏在「函式」身上，並在外層函式結束後，仍然從別處操控這份資料。工廠函式與模組模式全都建立在這個行為上。

### 三、Constructor 有什麼問題？

Constructor 最大的問題是：它「長得像」普通函式，卻「不照普通函式的規則跑」，而且不會自動幫你擋錯。

- **忘記 `new`**：如果沒加安全防護，直接呼叫 constructor 而漏掉 `new`，程式不但壞掉，還會噴出難以追蹤的錯誤訊息。
- **`instanceof` 不可靠**：在別的語言裡，這個關鍵字能明確告訴你物件是用哪個型別做的；但在 JavaScript 裡，它只是檢查某個 constructor 的 prototype 有沒有出現在物件的整條 prototype chain（原型鏈）上——這無法證明物件真的是那個 constructor 造的，因為 prototype 甚至可以在物件建立後被改掉。

正因如此，有些人（不是全部）改用一種類似、但避開這些麻煩特性的做法：factory function。

### 四、Factory function：不靠 `new` 的物件工廠

Factory function 的運作很像 constructor，關鍵差別是：它**不用 `new`**，而是自己在函式內組好物件、再 `return` 出來。它不使用 prototype（因此有一點效能代價，但除非你一次要造成千上萬個物件，否則不必在意）。

把 constructor 改寫成 factory：

```javascript
// constructor 版
function User(name) {
  this.name = name;
  this.discordName = "@" + name;
}

// factory 版：就是一個普通函式
function createUser(name) {
  const discordName = "@" + name;
  return { name, discordName };
}
```

`return { name, discordName }` 用到了 ES6 的 **object shorthand（物件簡寫）**：當變數名稱和屬性名稱相同時，`{ name: name }` 可簡寫成 `{ name }`。這招在 `console.log` 也好用——`console.log({ name, age })` 會印出 `{ name: "Bob", age: 28 }`，比 `console.log(name, age)` 印出的 `Bob 28` 清楚得多，因為連標籤都幫你標好了。

反向的操作叫 **destructuring（解構）**：從物件或陣列「拆」出值，指派給同名（或你指定）的變數。

```javascript
const obj = { a: 1, b: 2 };
const { a, b } = obj; // 等同 const a = obj.a; const b = obj.b;

const array = [1, 2, 3];
const [first, second] = array; // first = 1, second = 2
```

### 五、Private 變數：閉包真正發威的地方

閉包在這裡登場。我們幫 `createUser` 加一個 reputation（聲望）：

```javascript
function createUser(name) {
  const discordName = "@" + name;

  let reputation = 0;
  const getReputation = () => reputation;
  const giveReputation = () => {
    reputation++;
  };

  return { name, discordName, getReputation, giveReputation };
}

const josh = createUser("josh");
josh.giveReputation();
josh.giveReputation();
console.log(josh.getReputation()); // 2
```

注意：回傳的物件裡**沒有** `reputation` 本身，只有兩個函式——一個讀它、一個把它加一。`reputation` 就是所謂的 **private variable（私有變數）**：你無法從物件實例上直接碰到它（`josh.reputation` 是 `undefined`），只能透過我們定義的閉包去存取。

這樣做的好處是防呆：外界不能亂寫 `josh.reputation = -18000`，我們只暴露「讀」與「加一」這兩個受控的入口。工廠內部那些「不需要對外公開」的小工具與變數，都可以靠閉包藏起來，讓回傳的物件保持乾淨。

### 六、Composition：用組合取代繼承

Factory function 也能模擬「繼承」的效果，但不是透過 prototype，而是透過**組合（composition）**。假設要做一個 `Player`，想借用 `User` 的部分能力：

```javascript
function createPlayer(name, level) {
  const { getReputation, giveReputation } = createUser(name);

  const getLevel = () => level;
  const increaseLevel = () => {
    level++;
  };
  return { name, getReputation, giveReputation, getLevel, increaseLevel };
}
```

若要一次借「整包」，可用 `Object.assign` 把多個來源合併：

```javascript
function createPlayer(name, level) {
  const user = createUser(name);
  const getLevel = () => level;
  const increaseLevel = () => {
    level++;
  };
  return Object.assign({}, user, { getLevel, increaseLevel });
}
```

這就是 composition：從多個來源「組」出一個新物件，想拿多少拿多少、其餘藏成私有。它比繼承更有彈性——繼承有時很脆弱，而 factory function 天生就跟 composition 很搭。

### 七、Module pattern：只造一次的工廠

很多時候你不需要「量產」物件，只想把一段程式碼包起來、把不該外露的變數藏成私有。這時用 **IIFE（Immediately Invoked Function Expression，立即呼叫的函式運算式）**：把函式用括號包住，寫完馬上呼叫它。

```javascript
// 一個函式運算式
() => console.log("foo");

// 變成 IIFE：後面多一組 () 立刻執行
(() => console.log("foo"))();
```

把工廠函式包進 IIFE，就得到 **module pattern**：

```javascript
const calculator = (() => {
  let lastResult; // 私有：外界改不到

  const add = (a, b) => {
    lastResult = a + b;
    return lastResult;
  };
  const subtract = (a, b) => {
    lastResult = a - b;
    return lastResult;
  };
  const getLastResult = () => lastResult;

  return { add, subtract, getLastResult };
})();

console.log(calculator.add(3, 5)); // 8
console.log(calculator.getLastResult()); // 8
```

為什麼不直接寫一個物件字面值就好？因為物件字面值的所有屬性都是公開的——`lastResult` 會變成可被外界任意覆寫的 `calculator.lastResult`。我們希望 `lastResult` 對外只能「讀」，寫入只發生在內部、照我們的規則。唯一能真正藏住它的辦法，就是把它關進一個函式的作用域裡，再在同一個作用域內組好物件回傳。

**為什麼一定要用 IIFE，不能寫個具名函式再呼叫一次？** 因為具名函式會在該作用域佔一個名字，而且之後還能被重複呼叫——但我們只想執行一次。用 IIFE 就不必命名、也無法被再次引用，達到「執行一次、包成模組」的效果。

這裡出現一個關鍵詞：**encapsulation（封裝）**——把資料與程式碼包成一個單位，只對外開放必要的存取。module pattern 正是封裝的體現：只暴露 `calculator` 這個物件，其餘全部藏在模組內部。

## 程式碼範例

下面是一個可直接在 Node.js 或瀏覽器 Console 執行的完整範例，串起 factory function、private 變數、composition 與 module pattern。

```javascript
// --- factory function + private 變數 ---
function createUser(name) {
  let reputation = 0; // private：只能透過下面的閉包存取
  const getReputation = () => reputation;
  const giveReputation = () => {
    reputation++;
  };
  return { name, getReputation, giveReputation };
}

// --- composition：Player 借用 User 的能力 ---
function createPlayer(name, level) {
  const { getReputation, giveReputation } = createUser(name);
  const getLevel = () => level;
  const increaseLevel = () => {
    level++;
  };
  return { name, getReputation, giveReputation, getLevel, increaseLevel };
}

const mia = createPlayer("Mia", 1);
mia.giveReputation();
mia.increaseLevel();
console.log(mia.name); // "Mia"
console.log(mia.getReputation()); // 1
console.log(mia.getLevel()); // 2
console.log(mia.reputation); // undefined（碰不到私有變數）

// --- module pattern：只造一次的計數器 ---
const scoreBoard = (() => {
  let score = 0; // 私有狀態
  const add = (n) => {
    score += n;
  };
  const reset = () => {
    score = 0;
  };
  const get = () => score;
  return { add, reset, get };
})();

scoreBoard.add(10);
scoreBoard.add(5);
console.log(scoreBoard.get()); // 15
scoreBoard.reset();
console.log(scoreBoard.get()); // 0
```

## 常見陷阱

!!! warning "把變數放進回傳物件 ≠ 讓外界能改到它"
    以為 `return { name, discordName, reputation }` 就等於「回傳 reputation 變數」是錯的。它的完整寫法是 `return { reputation: reputation }`——只是新建一個剛好也叫 `reputation` 的屬性，把當下的值「複製」進去而已，兩者從此不再連動：

    ```javascript
    let a = 1;
    let b = a; // 複製值，不是連動
    a = 5;
    console.log(a, b); // 5 1（b 沒跟著變）
    ```

    想讓外界只能受控地存取私有變數，唯一的辦法是透過閉包（例如 `getReputation` / `giveReputation`），而不是把變數塞進回傳物件。

!!! warning "用 var 在迴圈裡建立閉包會共用同一個變數"
    `var` 是 function scope，整個迴圈只有一個 `i`，所有 callback 都指向它，最後全印出結束值：

    ```javascript
    for (var i = 0; i < 3; i++) {
      setTimeout(() => console.log(i), 100); // 3, 3, 3
    }
    ```

    改用 `let`（block scope，每輪迴圈都是新的 `i`）即可修正：

    ```javascript
    for (let i = 0; i < 3; i++) {
      setTimeout(() => console.log(i), 100); // 0, 1, 2
    }
    ```

!!! warning "factory function 不要加 new"
    Factory function 是普通函式，靠 `return` 交出物件。若誤加 `new`（例如 `new createUser("josh")`），`new` 會另外建立一個綁定 `this` 的空物件；只要你的函式有明確 `return` 一個物件，`new` 建立的那個就會被丟棄，雖然結果常常「看起來正常」，卻是多餘且容易誤導的寫法。factory 就直接呼叫，不要 `new`。

## 練習

依原文 Assignment，完成以下閱讀以鞏固 scope 與 closure：

1. 閱讀 Wes Bos 談 scope 的文章（scope 三層規則與 `var`/`let`/`const` 差異）。
2. 閱讀 Wes Bos 談 closure 的文章（函式如何記住它出生的環境）。
3. 閱讀 MDN 的 closures 指南（lexical environment、私有變數、迴圈陷阱）。

讀完後，試著不看講義回答本課的 Knowledge check：scope 怎麼運作、什麼是 closure、constructor 有哪些常見問題、factory function 的 private 變數是什麼又有何用、如何用 factory 做 composition、module pattern 如何運作、IIFE 是什麼、factory function 如何幫助封裝。

（本課沒有獨立的 project；若後續課程有對應專案，請依原文步驟操作。）

## 原文與延伸資源

- 原文：[Factory Functions and the Module Pattern](https://www.theodinproject.com/lessons/node-path-javascript-factory-functions-and-the-module-pattern)
- 本課引用：
  - [MDN：Closures 指南](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
  - [MDN：Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
  - [MDN：Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  - Wes Bos：JavaScript 的 scope 與 closures 文章（見上方練習）

---

> 本講義改寫自 The Odin Project《Factory Functions and the Module Pattern》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
