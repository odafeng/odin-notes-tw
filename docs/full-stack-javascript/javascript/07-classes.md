---
title: 類別（Classes）
source_url: https://www.theodinproject.com/lessons/node-path-javascript-classes
source_file: vendor/curriculum/javascript/organizing_your_javascript_code/classes.md
path: full-stack-javascript
course: JavaScript
order: 7
generated: 2026-07-03
---

# 類別（Classes）

> 改寫自 The Odin Project：[Classes](https://www.theodinproject.com/lessons/node-path-javascript-classes)
> ｜Full Stack JavaScript › JavaScript › Organizing Your JavaScript Code

## 核心概念

### JavaScript 的 class 到底是什麼

先講一個容易被誤導的重點：JavaScript 並沒有 Java、Ruby、C++ 那種「真正的 class（類別）」。JavaScript 的物件系統底層是 **prototype（原型）**，物件透過 prototype chain（原型鏈）彼此連結、共享方法。ES6（2015 年）引進的 `class` 關鍵字，並沒有把 prototype 換掉，它只是把「用 constructor function（建構函式）＋ prototype 建立物件」這件事，包裝成一套比較好讀、比較集中的語法。

因此你常會聽到一句話：「class 是 syntactic sugar（語法糖）」。這句話有一半是對的——底層機制沒有改變，沒有所謂的 classical inheritance（古典繼承）在運作，本質仍是 prototype。但另一半要小心：class 並不是「完全等價」的語法糖，它有幾個 constructor function 做不到、或行為不同的地方（下面「常見陷阱」會詳列）。所以更準確的說法是：**class 是把 prototype 機制重新包裝、並補上一些額外規範的語法。**

對你來說好消息是：這一課幾乎沒有全新的觀念要學，主要是把你在 constructor 那一課學過的東西，換成 class 語法重寫一次，再加上 getter/setter、inheritance（繼承）、private（私有）成員、static（靜態）成員這幾個新語法。

### 基本語法：class、constructor 與方法

一個 class 通常包含一個 `constructor`（建構子）和若干方法。`constructor` 是用 `new` 建立實例（instance）時自動執行的函式，負責初始化每個物件自己的資料。

```javascript
class User {
  constructor(name) {
    this.name = name; // 每個實例各自擁有的屬性
  }

  sayHi() {           // 方法，實際上掛在 User.prototype 上
    console.log(`Hi, ${this.name}`);
  }
}

const user = new User("John");
user.sayHi(); // Hi, John
```

這段程式碼背後發生的事，跟你以前手寫的 constructor function 幾乎一模一樣：`User` 本身是一個函式，`sayHi` 這類方法被放到 `User.prototype` 上，所有實例共享同一份方法，不會每建立一個物件就複製一次。差別只是語法更集中、更好讀。

一個關鍵細節：`class` 主體裡的方法之間**不要加逗號**。它不是 object literal（物件字面值），寫成 `sayHi() {}, sayBye() {}` 反而是語法錯誤。

class 有兩種寫法，宣告式與表達式，兩者能力相同：

```javascript
// 宣告式（class declaration）
class User {}

// 表達式（class expression），可以有名字或匿名
const User2 = class {};
```

### class field（類別欄位）

除了在 constructor 裡寫 `this.xxx = ...`，你也可以直接在 class 主體最上層宣告欄位，這叫做 class field：

```javascript
class Counter {
  count = 0;          // class field，每個實例初始化為 0
  step = 1;

  increment() {
    this.count += this.step;
  }
}
```

注意 class field 是掛在**每個實例**上（不是 prototype），效果等同於在 constructor 裡寫 `this.count = 0`。它讓「這個 class 有哪些狀態」在檔案上方一眼就能看到，可讀性更好。

### getter 與 setter：把方法偽裝成屬性

有時候你希望「讀取或寫入一個屬性」時，其實偷偷執行一段程式碼——例如驗證輸入、或即時計算一個衍生值。這就是 **getter / setter（存取器，accessor property）** 的用途。

先看它解決什麼問題。物件上普通的屬性叫 data property（資料屬性），它就是單純存一個值。accessor property 則不存值，而是綁定一對函式：讀取時呼叫 getter、賦值時呼叫 setter，但從外部使用時**看起來就像普通屬性**，不用加括號。

在 object literal 裡的語法：

```javascript
const user = {
  firstName: "Alice",
  lastName: "Cooper",

  get fullName() {                 // 讀取 user.fullName 時執行
    return `${this.firstName} ${this.lastName}`;
  },

  set fullName(value) {            // 執行 user.fullName = "..." 時觸發
    [this.firstName, this.lastName] = value.split(" ");
  }
};

console.log(user.fullName);        // Alice Cooper（沒有括號！）
user.fullName = "Bob Dylan";       // 觸發 setter
console.log(user.firstName);       // Bob
```

`fullName` 這個「屬性」其實不存在於資料裡，它是即時算出來的。這就是 getter 的典型用途：**computed property（計算屬性）**，用來源資料衍生出一個值，避免資料重複、避免忘了同步。

setter 的典型用途則是 **validation（驗證）**。你可以攔截賦值，把不合法的值擋下來：

```javascript
const account = {
  set balance(value) {
    if (value < 0) {
      console.log("餘額不能為負");
      return;             // 拒絕寫入
    }
    this._balance = value;
  },
  get balance() {
    return this._balance;
  }
};
```

這裡出現一個常見慣例：底線開頭的 `_balance`。它是實際存值的「內部屬性」，而對外暴露的是 `balance` 這個 accessor。底線只是一個「約定俗成，請不要直接碰我」的提示，**它並沒有真的變成私有**，外部仍能存取 `account._balance`（真正的私有要用後面介紹的 `#`）。

class 裡的 getter/setter 語法完全一樣，而且不需要用 `Object.defineProperty`：

```javascript
class Temperature {
  constructor(celsius) {
    this._celsius = celsius;
  }

  get fahrenheit() {                       // 唯讀的衍生值
    return this._celsius * 9 / 5 + 32;
  }

  set fahrenheit(value) {                  // 反向換算後存回攝氏
    this._celsius = (value - 32) * 5 / 9;
  }
}

const t = new Temperature(25);
console.log(t.fahrenheit);                 // 77
t.fahrenheit = 212;
console.log(t._celsius);                   // 100
```

### inheritance：用 extends 繼承

繼承讓你在既有 class 的基礎上，建立一個更具體的子類別（subclass），沿用父類別的屬性與方法，再加上自己的東西。語法是 `extends`。

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    console.log(`我是 ${this.name}`);
  }
}

class Player extends Person {
  constructor(name, level) {
    super(name);          // 呼叫父類別的 constructor
    this.level = level;
  }
  greet() {
    super.greet();        // 呼叫父類別的同名方法
    console.log(`等級 ${this.level}`);
  }
}

const p = new Player("Odin", 99);
p.greet();
// 我是 Odin
// 等級 99
```

兩個必記的重點：

1. **`super(...)` 呼叫父類別的 constructor。** 只要子類別寫了自己的 `constructor`，你就**必須**在使用 `this` 之前先呼叫 `super()`，否則會直接報錯。原因是子類別的 `this` 要由父類別 constructor 先初始化好。如果子類別完全不寫 constructor，JavaScript 會自動幫你補一個會轉呼叫 `super(...args)` 的版本。
2. **`super.method()` 呼叫父類別的同名方法。** 當子類別覆寫（override）了某個方法，又想在裡面「先做父類別原本那套、再加料」時，用 `super.method()`。

背後其實就是把 `Person.prototype` 接到 `Player.prototype` 的原型鏈上，所以 `p` 找不到的屬性會沿著鏈往上找到 `Person`。這正呼應開頭那句話：換了語法，底層還是 prototype。

### private：真正的私有欄位與方法

前面提過 `_name` 這種底線慣例只是「請勿觸碰」的口頭約定。ES2022 之後，JavaScript 有了**語法層級**的私有成員：在名稱前加 `#`。加了 `#` 的欄位或方法，只能在 class 內部存取，外部一碰就是語法錯誤。

```javascript
class BankAccount {
  #balance = 0;                    // 私有欄位

  deposit(amount) {
    if (amount <= 0) return;
    this.#balance += amount;
  }

  #log(msg) {                      // 私有方法
    console.log(`[帳戶] ${msg}`);
  }

  get balance() {
    return this.#balance;          // 只透過 getter 對外唯讀
  }
}

const acc = new BankAccount();
acc.deposit(100);
console.log(acc.balance);          // 100
// console.log(acc.#balance);      // SyntaxError：私有欄位不能從外部存取
```

`#` 提供的封裝（encapsulation）比工廠函式（factory function）用 closure（閉包）藏變數更直接：外部完全無法讀寫、無法列舉、也沒有底線那種「其實碰得到」的漏洞。用它把物件的內部狀態保護起來，只透過你設計好的方法與 getter/setter 對外互動。

### static：屬於 class 本身的成員

一般的方法與屬性是掛在**實例**上——你要有一個 `new` 出來的物件才能用。**static（靜態）** 成員則是掛在 **class 本身**上，不需要、也不應該透過實例呼叫。

一個你早就用過的例子：字串的 `slice` 是掛在字串實例上（`someString.slice(0, 5)`），但 `String.fromCharCode(79, 100)` 是掛在 `String` 這個 constructor 本身上——後者就是 static 方法。

static 常用來放「跟這個類別有關、但不屬於任何單一實例」的工具函式或共用資料，例如工廠方法、計數器、常數：

```javascript
class Circle {
  static PI = 3.14159;             // 靜態屬性（常數）

  constructor(radius) {
    this.radius = radius;
  }

  static fromDiameter(d) {         // 靜態工廠方法，回傳一個實例
    return new Circle(d / 2);
  }

  area() {                         // 實例方法
    return Circle.PI * this.radius ** 2;
  }
}

const c = Circle.fromDiameter(10); // 在 class 上呼叫，不是在實例上
console.log(c.radius);             // 5
console.log(c.area());             // 78.53975
console.log(Circle.PI);            // 3.14159
```

static 成員也可以是私有的（`static #count`），組合起來就能做出「整個類別共用、且外部看不到」的狀態。

### 小結：這一課的地圖

class 是 prototype 機制的新語法：`constructor` 初始化每個實例、方法共享於 prototype、`extends`／`super` 做繼承、`get`／`set` 把方法偽裝成屬性、`#` 提供真正的私有、`static` 定義屬於類別本身的成員。觀念多半是舊的，換上更集中、更好讀的外衣而已。

## 程式碼範例

下面是一個把上述語法整合起來的最小可執行範例，可直接貼進 Node.js 或瀏覽器 console 執行。

```javascript
// 父類別
class Book {
  #read = false;              // 私有欄位：是否已讀，預設 false
  static count = 0;           // 靜態屬性：統計總共建立幾本書

  constructor(title, author, pages) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    Book.count += 1;          // 存取 class 本身的靜態屬性
  }

  // getter：把「已讀狀態」以易讀字串對外呈現（衍生值）
  get status() {
    return this.#read ? "已讀" : "未讀";
  }

  // setter：只接受布林值，做輸入驗證
  set read(value) {
    if (typeof value !== "boolean") {
      console.log("read 必須是 true 或 false");
      return;
    }
    this.#read = value;
  }

  info() {
    return `《${this.title}》 by ${this.author}，${this.pages} 頁（${this.status}）`;
  }
}

// 子類別：有聲書，繼承 Book 並加上時長
class AudioBook extends Book {
  constructor(title, author, pages, minutes) {
    super(title, author, pages); // 先初始化父類別部分
    this.minutes = minutes;
  }

  info() {
    // 先取用父類別的 info，再補上有聲書資訊
    return `${super.info()}，時長 ${this.minutes} 分鐘`;
  }
}

const b = new Book("霍比特人", "托爾金", 310);
b.read = true;                   // 觸發 setter
console.log(b.info());           // 《霍比特人》 by 托爾金，310 頁（已讀）

const ab = new AudioBook("沙丘", "赫伯特", 688, 1260);
console.log(ab.info());          // 《沙丘》 by 赫伯特，688 頁（未讀），時長 1260 分鐘

console.log(Book.count);         // 2（在 class 本身上讀取靜態屬性）
```

## 常見陷阱

!!! warning "class 不是「完全等價」的語法糖"
    雖然 class 底層還是 constructor function ＋ prototype，但它有幾個 constructor function 沒有的行為，別當成完全一樣：(1) class constructor **一定要用 `new` 呼叫**，直接當普通函式呼叫會拋 `TypeError`；(2) class 內的方法是 **non-enumerable（不可列舉）**，不會出現在 `for...in` 迴圈裡，手寫在 prototype 上的方法則會；(3) class 主體內的程式碼**自動進入 strict mode（嚴格模式）**。

!!! warning "class 宣告不會 hoisting（提升）"
    你可以在 function 宣告之前就呼叫它（function 會被提升），但 class **不行**。在 class 宣告之前就 `new` 它，會拋 `ReferenceError`（處於 temporal dead zone）。所以請先宣告 class，再使用它。

!!! warning "子類別 constructor 裡，super() 要在 this 之前"
    只要子類別寫了自己的 `constructor`，就必須在碰 `this` 之前先呼叫 `super()`。順序寫反（先 `this.x = ...` 再 `super()`）會直接報錯，因為 `this` 尚未被父類別初始化。

!!! warning "底線 _name 不是私有，# 才是"
    `_balance` 這種底線命名只是「請勿直接使用」的團隊約定，外部仍然讀寫得到。要真正封裝、讓外部完全無法存取，請用 `#balance` 這種 `#` 私有欄位／方法。

!!! warning "class 主體的方法之間不要加逗號"
    class 主體不是 object literal。方法之間直接換行即可，插入逗號（`sayHi() {}, sayBye() {}`）是語法錯誤。

## 練習

1. 閱讀 getter 與 setter：理解 accessor property 與一般 data property 的差異，以及 `get` / `set` 的語法。重點放在「讀寫屬性時偷偷執行程式碼」這個核心概念，先不用管進階的 accessor descriptor。class 使用 getter/setter 的語法和物件字面值完全相同，且不需要 `Object.defineProperty`。
2. 讀過一遍 class 語法總覽：`constructor`、方法、class field、getter/setter、computed method name，以及「為什麼 class 不只是語法糖」（`new` 限制、方法不可列舉、strict mode、不提升）。
3. 把 MDN 的 class 文件當作深入時的參考，不需要現在背下來。建議先看過三個重點語法：**extends（繼承）**（例如 `Player extends Person`，把 `Person.prototype` 接上原型鏈）、**private class fields（私有欄位）**（用 `#` 讓屬性／方法無法從外部存取，如同工廠函式的私有變數）、**static（靜態成員）**（掛在 class 本身、不掛在實例上，如 `String.fromCharCode(...)` 對比 `someString.slice(...)`）。

### Project：把 Library 專案改寫成 class

回到你先前做的 [Library 專案](https://www.theodinproject.com/lessons/node-path-javascript-library)，把原本用普通 constructor function 建立 `Book` 的做法，重構（refactor）成使用 `class`。重構步驟請參考原文，並記得沿用你在 [Revisiting Rock Paper Scissors](https://www.theodinproject.com/lessons/foundations-revisiting-rock-paper-scissors) 學到的 git branch 工作流程：先開一個新的 feature branch 來做這次改動，養成這樣的開發習慣。改寫時可以順手練習：用 getter/setter 呈現閱讀狀態、用 `#` 保護不該被外部亂改的欄位。

## 原文與延伸資源

- 原文：[Classes](https://www.theodinproject.com/lessons/node-path-javascript-classes)
- 本課引用：
  - [javascript.info — Class basic syntax](https://javascript.info/class)（class 語法與「不只是語法糖」的差異）
  - [javascript.info — Property getters and setters](https://javascript.info/property-accessors)（getter/setter 與 accessor property）
  - [MDN — Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)（總覽）
  - [MDN — extends](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends)（繼承）
  - [MDN — Private properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)（私有成員）
  - [MDN — static](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static)（靜態成員）

---

> 本講義改寫自 The Odin Project《Classes》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
