---
title: 用物件組織程式碼
source_url: https://www.theodinproject.com/lessons/node-path-javascript-organizing-code-with-objects
source_file: vendor/curriculum/javascript/organizing_your_javascript_code/organizing_code_with_objects.md
path: full-stack-javascript
course: JavaScript
order: 2
status: draft
generated: 2026-07-03
---

# 用物件組織程式碼

> 改寫自 The Odin Project：[Organizing Code with Objects](https://www.theodinproject.com/lessons/node-path-javascript-organizing-code-with-objects)
> ｜Full Stack JavaScript › JavaScript › Organizing Your JavaScript Code

## 核心概念

寫程式寫到一定規模，你會發現真正的難題不是「怎麼讓程式跑起來」，而是「怎麼讓程式不要亂成一團」。散落一地的變數、到處被傳來傳去的參數、命名不斷撞車，這些都是程式失控的前兆。object（物件）就是 JavaScript 給你的第一個、也是最重要的「整理工具」。這一課要談的，就是如何用物件把**資料**與**功能**收攏在一起，讓程式碼有結構、好維護。

### 先複習：物件是什麼

物件是一組 key/value（鍵/值）的集合。定義物件最常見的方式是 **object literal（物件字面值）** 語法，也就是用一對大括號把成對的屬性寫進去：

```javascript
const myObject = {
  property: "Value!",
  otherProperty: 77,
  "obnoxious property": function () {
    // 做些事情
  },
};
```

要把資料從物件裡取出來，有兩種寫法：**dot notation（點記法）** 與 **bracket notation（方括號記法）**。

```javascript
// 點記法
console.log(myObject.property); // "Value!"

// 方括號記法
console.log(myObject["obnoxious property"]); // [Function]
```

兩者何時用，取決於情境。點記法比較乾淨、通常是首選，但有些情況它做不到。例如 `myObject."obnoxious property"` 會出錯，因為這個 key 是「帶空格的字串」，不是合法的 identifier（識別字）。另一個點記法的死角是「用變數當 key」：

```javascript
const variable = "property";

// undefined，因為它真的去找一個叫 "variable" 的屬性
console.log(myObject.variable);

// 等同於 myObject["property"]，回傳 "Value!"
console.log(myObject[variable]);
```

記住這個分工：**key 固定、且是合法識別字時用點記法；key 帶特殊字元、或 key 要用變數動態決定時，用方括號記法。** 這個判斷之後會反覆用到。

### 用法一：用物件組織「資料」

物件最基本的用途，就是把彼此相關的資料綁在一起。拿一個「井字遊戲」當例子，先看沒有物件的寫法：

```javascript
// 沒有物件
const playerOneName = "tim";
const playerTwoName = "jenn";
const playerOneMarker = "X";
const playerTwoMarker = "O";
```

再看用物件的寫法：

```javascript
// 有物件
const playerOne = {
  name: "tim",
  marker: "X",
};

const playerTwo = {
  name: "jenn",
  marker: "O",
};
```

第一種乍看之下沒那麼糟，但第二種的好處其實很大。首先是**命名**：值被掛在物件的 key 底下，你不必再取一堆又長又孤立的變數名，只要用簡短的 `name`、`marker`，再靠物件名稱提供上下文即可。在同一個 scope（作用域）裡，`name` 和 `marker` 本來沒辦法重複使用，但透過「namespacing（命名空間化）」——也就是把它們變成 `playerOne.name`、`playerTwo.marker`——就能安全地共用同一組簡短名稱而不撞車。

命名還不是唯一的好處。把相關資料**打包**成物件，你就能一次把整包資料傳來傳去：

```javascript
function gameOver(winningPlayer) {
  console.log("恭喜！");
  console.log(`${winningPlayer.name}（${winningPlayer.marker}）獲勝！`);
}
```

不必替 name 和 marker 各開一個參數，只要一個參數收下整個物件，函式內就能存取物件裡所有屬性。日後就算替玩家物件加了更多屬性、而 `gameOver` 又需要用到，也不必改函式簽名——因為你當初傳進來的是「整個物件」，而不是一個個拆開的值。

想想更複雜的場景：不是雙人小遊戲，而是一個有龐大庫存的線上購物網站。要把每件商品的名稱、價格、描述等資訊綁在一起，用物件幾乎是唯一合理的選擇。這種「用物件當資料結構」的模式，你在後續課程會不斷看到、不斷使用。

### 用法二：用物件組織「功能」

物件的打包能力不只能整理資料，也能整理**功能**。這正是 **OOP（Object Oriented Programming，物件導向程式設計）** 的核心思想之一。OOP 是一種以「物件」為中心的程式設計 paradigm（典範），物件同時裝著：資料（以 field／attribute／property，也就是欄位／屬性的形式）與程式碼（以 procedure／method，也就是程序／方法的形式）。在 OOP 裡，整支程式是由一群互相溝通的物件組成的。

換句話說，物件不只能存資料，也能透過 **method（方法）** 存放邏輯。所謂 method，其實就是「掛在物件上的 function（函式）」，你可以用這些方法去操作物件內部的資料。

要把一個「東西」設計成物件，你只要問自己兩個問題：「這個東西有哪些屬性（不論實體或概念）？」以及「我可以怎麼跟它互動？」。屬性寫成 property，互動方式寫成 method。以一台車為例，它有廠牌、車型、出廠年份、顏色、價格，這些可以是屬性：

```javascript
const car = {
  make: "Volkswagen",
  model: "Golf",
  year: 2026,
  color: "blue",
  priceUSD: 40000,
};
```

### method 與 `this` 關鍵字

你可能想「幫車子打個折」，或「一次拿到所有細節的摘要」。這時就輪到 method 上場。要開始寫 method，最容易的做法是把 object literal 語法搭配 JavaScript 的 **`this` 關鍵字**一起用。`this` 用來指向「method 被呼叫時所在的那個物件」。

```javascript
const car = {
  make: "Volkswagen",
  model: "Golf",
  year: 2026,
  color: "blue",
  priceUSD: 40000,

  // method 就是掛在屬性上的 function
  applyDiscount: function (discountPercentage) {
    const multiplier = 1 - discountPercentage / 100;
    this.priceUSD *= multiplier;
  },

  // 在 object literal 裡新增 method 的簡寫語法
  getSummary() {
    return `${this.year} ${this.make} ${this.model}，顏色 ${this.color}，售價 $${this.priceUSD}（USD）。`;
  },

  // ...其他 method...
};
```

上面出現了兩種寫法：`applyDiscount` 用的是「屬性: function」的完整寫法，`getSummary` 用的是 ES6 之後的 **shorthand method syntax（method 簡寫語法）**，可以省略冒號和 `function` 這個字。兩者效果相同，簡寫比較常見。

這裡的關鍵是理解 `this` 到底指向誰。**`this` 的值不是由 method「定義在哪個物件裡」決定，而是由「呼叫時用哪個物件去叫它」決定。** 當你寫 `car.getSummary()`，點號前面是 `car`，所以方法內的 `this` 就等於 `car`；`this.year` 就是 `car.year`。你可以把 `this` 想成一個隱藏的參數，在呼叫的那一刻被自動填入「點號前面的那個物件」。

這個特性帶來一個威力：**同一個 method 可以被不同物件重用，`this` 會自動指向當下呼叫它的那一個。**

```javascript
function sayHi() {
  console.log(`哈囉，我是 ${this.name}`);
}

const manager = { name: "Karina" };
const intern = { name: "Tyrone" };

// 把同一個函式掛到兩個物件上
manager.sayHi = sayHi;
intern.sayHi = sayHi;

manager.sayHi(); // 哈囉，我是 Karina —— this 是 manager
intern.sayHi();  // 哈囉，我是 Tyrone —— this 是 intern
```

同一份 `sayHi`，被不同物件呼叫就印出不同名字，因為 `this` 認的是「點號前面是誰」。有了 `this`，你就能寫出「讀取並修改自身屬性」的可重用邏輯，取個直覺的名字，而不必每次都手動把邏輯重寫一遍。

!!! note "小提醒：arrow function 的 `this` 不一樣"
    上面的例子若改用 arrow function（箭頭函式）來寫 method，`this` 的行為會完全不同——箭頭函式不會綁定「呼叫它的物件」，而是沿用外層 scope 的 `this`。這一課先不深究原因，只要記住：**寫物件 method 時用一般 function 或簡寫語法，不要用 arrow function**，否則 `this` 不會如你預期。

### 用物件描述抽象概念

物件不只能描述車子這種實體，也能描述抽象的東西，例如一場遊戲。用「剪刀石頭布」為例，這遊戲牽涉到幾件基本事情：玩家們的分數、以及「玩一回合」的能力（而玩一回合應該會更新分數）。可能還有一些加分功能：判斷目前領先的玩家、以及重置遊戲。

假設對手是電腦，最基本的遊戲物件可能長這樣：

```javascript
const rps = {
  playerScore: 0,
  computerScore: 0,
  playRound(playerChoice) {
    // 玩一回合的程式碼，必要時更新分數，然後回傳結果
  },
};
```

把它補完，可能會變成這樣：

```javascript
const rps = {
  playerScore: 0,
  computerScore: 0,
  playRound(playerChoice) {
    // 玩一回合，必要時更新分數，回傳結果
  },
  getWinningPlayer() {
    // 回傳分數最高者（"player"、"computer" 或 "tie"）
  },
  reset() {
    // 把雙方分數都歸零
  },
};
```

玩幾回合看看誰領先：

```javascript
rps.playRound("rock");        // 回傳 "player"
console.log(rps.playerScore); // 1 —— 我們贏了，分數增加

rps.playRound("rock");        // 回傳 "computer"
console.log(rps.computerScore); // 1

rps.playRound("scissors");    // 回傳 "player"
console.log(rps.playerScore); // 2
console.log(rps.getWinningPlayer()); // "player"，因為 2 比 1 領先
```

玩夠了，替下一個人重置：

```javascript
rps.reset();
console.log(rps.playerScore);   // 0
console.log(rps.computerScore); // 0
```

!!! note "小提醒：底線開頭的屬性 `_`"
    在真實專案裡，你會看到有些物件屬性以 `_` 開頭，例如 `_someProperty`。這純粹是**開發者慣例**，用來標示這個屬性是「private（私有）」的——意思是它只供物件內部使用（例如輔助用的 helper method），不打算被外部讀取或呼叫。要強調的是：object literal 的屬性其實**沒有真正的私有**，加底線只是「約定俗成的提醒」，技術上外部還是存取得到（也就是仍然是 public 的）。JavaScript 確實有辦法做出真正的私有，但牽涉更進階的機制，之後的課程才會談。

### 把物件當成「機器」來想

我們已經看到，物件能代表實體（車子）也能代表概念（剪刀石頭布）。事實上物件幾乎能代表任何你想得到的東西。要列出完整清單並不可能，但常見的用途包括：

- 一個「管理其他物件」的物件，例如一個 `inventory`（庫存）物件，內部用陣列裝著多個 item 物件，並提供操作這個陣列的 method。
- 一個「監聽事件並適當回應」的物件（想想 DOM 元素上的 `.addEventListener`）。
- 一個「統籌所有 DOM 相關事務」的物件：它設定事件監聽器去呼叫其他物件的 method，並把其他物件的資料顯示到網頁上。

剛開始你可能不知道這類物件該裝些什麼，這需要經驗累積，尤其是後面課程學得更多之後。一個幫助想像的方式，是把這些物件當成用程式碼打造的小「機器」。機器上的 **property 像是顯示面板**，展示各種資訊：你收集到的物品清單與可攜帶上限、目前正在監聽某事件的函式清單、負責互動的按鈕與顯示資料的 DOM 元素。而機器上的 **method 像是按鈕**，讓機器「做某件事」：把某個物品從清單移除、或新增物品；觸發所有監聽 `"click"` 事件的函式、或新增一個監聽函式；從別處讀資料並設定某些 DOM 元素的 `.textContent`。

物件幾乎能代表任何你想得到的東西，限制只在於你的想像力。這一課先建立「為什麼要用物件」的直覺，後續課程會用更多實作技巧，帶你更實際地建立與使用物件。

## 程式碼範例

下面是一份可直接在 Node.js 或瀏覽器 console 執行的完整範例，把「資料 + method + `this`」三件事串起來：

```javascript
// 用物件同時組織「資料」與「功能」
const car = {
  make: "Volkswagen",
  model: "Golf",
  year: 2026,
  color: "blue",
  priceUSD: 40000,

  // method：套用折扣，直接修改自身的 priceUSD
  applyDiscount(discountPercentage) {
    const multiplier = 1 - discountPercentage / 100;
    this.priceUSD *= multiplier; // this 指向 car
  },

  // method：回傳一段摘要字串
  getSummary() {
    return `${this.year} ${this.make} ${this.model}，售價 $${this.priceUSD}`;
  },
};

console.log(car.getSummary());
// 2026 Volkswagen Golf，售價 $40000

car.applyDiscount(10); // 打九折：40000 * 0.9
console.log(car.priceUSD);      // 36000
console.log(car.getSummary());  // 2026 Volkswagen Golf，售價 $36000

// 示範 this 認的是「呼叫時點號前的物件」
const anotherCar = { make: "Toyota", model: "Corolla", year: 2025, priceUSD: 25000 };
anotherCar.getSummary = car.getSummary; // 借用同一個 method
console.log(anotherCar.getSummary());
// 2025 Toyota Corolla，售價 $25000 —— this 這次指向 anotherCar
```

## 常見陷阱

!!! warning "method 裡用 arrow function 會讓 `this` 失效"
    別在物件 method 裡用 arrow function 來取用 `this`。arrow function 不會把 `this` 綁定到「呼叫它的物件」，而是沿用定義它時外層 scope 的 `this`（在頂層通常是 `undefined` 或全域物件）。想在 method 裡用 `this` 指向物件本身，請用一般 `function` 或 ES6 的 method 簡寫語法。

!!! warning "點記法無法用變數或帶特殊字元的 key"
    `myObject.variable` 會去找名為 `"variable"` 的屬性，而不是「變數 `variable` 的值所指的那個 key」。要用變數當 key，或 key 帶有空格、連字號、開頭是數字時，一律改用方括號記法 `myObject[key]`。

!!! warning "`this` 認的是「怎麼被呼叫」，不是「定義在哪」"
    同一個函式掛到不同物件上，`this` 就指向不同物件。如果你把 method「單獨拆出來」呼叫（例如 `const f = car.getSummary; f();`），點號前面就沒有物件了，`this` 會不再指向 `car`，導致 `this.year` 之類的存取出錯。要讓 `this` 正確，記得用 `物件.method()` 的形式呼叫。

!!! warning "底線 `_` 不是真的私有"
    `_someProperty` 只是「請把我當私有」的慣例提醒，外部程式其實照樣讀寫得到。別誤以為加了底線就有真正的存取保護；真正的私有需要更進階的機制，後續課程才會介紹。

## 練習

本課在 The Odin Project 原文中**沒有指定 assignment（作業）**。原因是：JavaScript 雖然融合了多種程式設計典範，但很大一部分是圍繞 OOP 打造的，而這一課只先建立「為什麼要用物件」的觀念；真正的實作技巧會留到後續課程展開。

為了確保你真的吸收了這一課，建議自己動手做以下小練習（純觀念驗證，不需交付）：

1. **打包資料**：把「一本書」用 object literal 描述出來，至少包含 `title`、`author`、`pages`、`read`（是否已讀）四個屬性。
2. **加上 method**：替這本書物件加一個 `getInfo()` method，用 `this` 讀取上述屬性，回傳像「《書名》 by 作者，共 N 頁，已讀/未讀」的字串。
3. **驗證 `this`**：把同一個 `getInfo` method 借給第二本書物件，呼叫後確認它印出的是第二本書的資料，藉此親眼驗證「`this` 認的是呼叫時點號前的物件」。
4. **兩種記法**：分別用點記法與方括號記法讀出 `title`；再宣告一個變數 `key = "author"`，用 `book[key]` 取出作者，體會方括號記法「用變數當 key」的用途。

## 原文與延伸資源

- 原文：[Organizing Code with Objects](https://www.theodinproject.com/lessons/node-path-javascript-organizing-code-with-objects)
- 本課引用：
  - [MDN：`this` 關鍵字](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)（`this` 的 runtime binding、一般函式與 arrow function 的差異）
  - [MDN：Working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects)（object literal、點記法／方括號記法、method 定義與簡寫語法）

---

> 本講義改寫自 The Odin Project《Organizing Code with Objects》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
