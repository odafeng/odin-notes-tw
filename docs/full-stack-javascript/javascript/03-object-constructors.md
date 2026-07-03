---
title: 物件建構子（Object Constructors）
source_url: https://www.theodinproject.com/lessons/node-path-javascript-object-constructors
source_file: vendor/curriculum/javascript/organizing_your_javascript_code/object_constructors.md
path: full-stack-javascript
course: JavaScript
order: 3
status: draft
generated: 2026-07-03
---

# 物件建構子（Object Constructors）

> 改寫自 The Odin Project：[Object Constructors](https://www.theodinproject.com/lessons/node-path-javascript-object-constructors)
> ｜Full Stack JavaScript › JavaScript › Organizing Your JavaScript Code

## 核心概念

### 為什麼需要 object constructor（物件建構子）

當你只需要一兩個物件時，用 object literal（物件實字，`{ ... }`）手動打出來完全沒問題。但如果你要做的是「同一種類型、同樣結構」的物件很多份——例如遊戲裡的每一個玩家、書櫃裡的每一本書、購物車裡的每一項商品——一個一個手打就變得重複又容易出錯。

**object constructor（物件建構子）** 就是為了解決這個問題。它其實只是一個「用來製造物件的函式（function）」，讓你把「這種物件長什麼樣子」定義一次，之後就能量產：

```javascript
function Player(name, marker) {
  this.name = name;
  this.marker = marker;
}
```

依照慣例，constructor 的名字用「大寫開頭」（`Player` 而非 `player`），這是一種讓其他人一眼看出「這個函式是要拿來 `new` 的」的約定。用 constructor 做出來的每一份物件，我們稱為它的 **instance（實例）**；而「用既有的一種物件當基底、衍生出新的一種物件」的能力，就叫 **inheritance（繼承）**——這兩個詞是本課從頭到尾都會用到的核心術語。

### `new` 關鍵字到底做了什麼

使用 constructor 的方式，是在呼叫函式時加上 `new` 關鍵字：

```javascript
const player = new Player("steve", "X");
console.log(player.name); // "steve"
```

注意：`new Player("steve", "X")` 和不加 `new` 的 `Player("steve", "X")` **完全不是同一回事**。當你用 `new` 呼叫一個函式時，JavaScript 會在背後幫你做四件事：

1. **建立一個全新的空物件**。
2. 把函式內的 **`this` 指向這個新物件**（所以 `this.name = name` 是在替新物件加屬性）。
3. 讓這個新物件的 **`[[Prototype]]` 連到該函式的 `.prototype` 屬性**（這一點稍後在 prototype 段落詳談）。
4. **自動回傳這個新物件**——即使你在 constructor 裡沒有寫任何 `return`。

理解這四步很關鍵：正因為 `this` 被指到新物件、而且物件被自動回傳，你才不需要在 constructor 裡自己 `return this`。反過來說，如果忘了 `new`，`this` 就不會指向新物件（在嚴格模式下 `this` 會是 `undefined`，賦值時直接報錯；非嚴格模式下 `this` 會指向全域物件，悄悄污染全域變數），這是很難追查的 bug。

就像 object literal 做出來的物件一樣，你也可以在 constructor 裡放函式（方法）：

```javascript
function Player(name, marker) {
  this.name = name;
  this.marker = marker;
  this.sayName = function () {
    console.log(this.name);
  };
}

const player1 = new Player("steve", "X");
const player2 = new Player("also steve", "O");
player1.sayName(); // 印出 "steve"
player2.sayName(); // 印出 "also steve"
```

### 守護你的 constructor：`new.target`

因為 constructor 可能被人不小心「忘了加 `new`」直接呼叫，導致上述那種難追的錯誤，你可以用 `new.target` 這個 meta-property（元屬性）來自我防護。當函式是用 `new` 呼叫時，`new.target` 會是該函式本身；否則會是 `undefined`：

```javascript
function Player(name, marker) {
  if (!new.target) {
    throw Error("必須使用 'new' 運算子來呼叫這個 constructor");
  }
  this.name = name;
  this.marker = marker;
}
```

### prototype（原型）是什麼

在 JavaScript 裡，**每一個物件都會連結到另一個物件，這個被連結的物件就叫它的 prototype（原型），也寫作 `[[Prototype]]`**。它的用途很單純但很重要：**當你在一個物件上找某個屬性或方法，物件本身沒有時，JavaScript 就會沿著 `[[Prototype]]` 往上找。**

把它拆成三句話來理解：

1. **每個物件都有一個 `[[Prototype]]`**。用 `Player` 做出來的 `player1`、`player2` 也不例外。
2. **這個 `[[Prototype]]` 本身也是一個物件**，它一樣可以有自己的屬性和方法。
3. **原本的物件會「繼承（inherit）」它的 `[[Prototype]]`**，也就是能直接存取 `[[Prototype]]` 上定義的屬性與方法，就像那些是自己的一樣。

要「看見」一個物件的 `[[Prototype]]`，用 `Object.getPrototypeOf()`：

```javascript
Object.getPrototypeOf(player1) === Player.prototype; // true
Object.getPrototypeOf(player2) === Player.prototype; // true
```

這說明：用同一個 constructor 做出來的每個實例（instance），它們的 `[[Prototype]]` 都指向**同一個** `Player.prototype` 物件。所以只要把共用的方法「掛在 prototype 上」，所有實例都能用：

```javascript
Player.prototype.sayHello = function () {
  console.log("Hello, I'm a player!");
};

player1.sayHello(); // "Hello, I'm a player!"
player2.sayHello(); // "Hello, I'm a player!"
```

### 容易混淆：`Object.getPrototypeOf()` vs `.prototype`

這是初學最常卡住的地方，務必分清楚：

- **`.prototype`** 是「函式」上的屬性。它決定「當這個函式被 `new` 呼叫時，做出來的新物件的 `[[Prototype]]` 要設成什麼」。它**不是**用來讀取某個物件的 `[[Prototype]]` 的。
- **`Object.getPrototypeOf(obj)`** 才是用來「讀取某個物件的 `[[Prototype]]`」的正規方法。

另外你可能在舊程式碼看到用 `obj.__proto__` 來讀或設 `[[Prototype]]`。`.__proto__` 是歷史遺留、已被標記為非標準且不建議使用；請改用 `Object.getPrototypeOf()` / `Object.setPrototypeOf()`。

### prototype chain（原型鏈）與 prototypal inheritance（原型繼承）

把方法定義在 prototype 上有兩個好處：

1. **省記憶體**。若把方法寫在 constructor 裡（像前面的 `this.sayName = function...`），那麼每 `new` 一個物件，就會「複製一份」這個函式；一萬個玩家就有一萬份一模一樣的 `sayName`。改成掛在 `Player.prototype` 上，全部實例共用同一份，記憶體只佔一份。
2. **達成繼承**。物件的 `[[Prototype]]` 也是物件，它自己也有 `[[Prototype]]`，一層一層連下去，就形成 **prototype chain（原型鏈）**。

事實上 `Player.prototype` 自己也繼承自 `Object.prototype`：

```javascript
Object.getPrototypeOf(Player.prototype) === Object.prototype; // true

player1.valueOf(); // 可以用！但我們從沒定義過 valueOf
```

`valueOf` 是哪來的？它定義在 `Object.prototype` 上。查一個屬性是不是「物件自己的」，用 `hasOwnProperty`：

```javascript
player1.hasOwnProperty("valueOf");        // false（不是自己的）
Object.prototype.hasOwnProperty("valueOf"); // true（在這裡）
```

所以當你寫 `player1.valueOf()`，JavaScript 的查找順序是：

1. `valueOf` 在 `player1` 上嗎？沒有（`player1` 只有 `name`、`marker`）。
2. 在 `player1` 的 `[[Prototype]]`（即 `Player.prototype`）上嗎？沒有（那裡只有 `sayHello`）。
3. 在再上一層 `Object.prototype` 上嗎？有！於是使用它。

這條鏈不會無限延伸：`Object.getPrototypeOf(Object.prototype)` 是 `null`，代表鏈的終點。走到終點還找不到，就回傳 `undefined`。**重點記憶：讀取會沿鏈往上找；但寫入與刪除永遠只作用在物件本身，不會動到 prototype。**

### 建立繼承關係的正確方法：`Object.setPrototypeOf()`

要讓一種物件繼承另一種物件，用 `Object.setPrototypeOf(要繼承的, 被繼承的)`。下面讓 `Player` 繼承 `Person`：

```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.sayName = function () {
  console.log(`Hello, I'm ${this.name}!`);
};

function Player(name, marker) {
  this.name = name;
  this.marker = marker;
}
Player.prototype.getMarker = function () {
  console.log(`My marker is "${this.marker}"`);
};

// 讓 Player 的原型繼承 Person 的原型
Object.setPrototypeOf(Player.prototype, Person.prototype);

const player1 = new Player("steve", "X");
player1.sayName();   // Hello, I'm steve!（來自 Person.prototype）
player1.getMarker(); // My marker is "X"（來自 Player.prototype）
```

`player1` 同時用得到 `sayName` 和 `getMarker`，即使它們定義在兩個不同的 prototype 上，就是靠原型鏈串起來的。

**注意兩個重點**：第一，原型鏈要在「建立任何物件之前」就設好；物件都做出來後才 `setPrototypeOf` 會造成效能問題。第二，`this` 在方法裡永遠指向「呼叫時 `.` 前面那個物件」，所以 `sayName` 裡的 `this.name` 拿到的是 `player1` 自己的 `name`，而不是 `Person` 的——這正是繼承能共用方法卻各保有各自狀態的關鍵。

### `this` 在不同情境下的行為

`this` 的值不是在定義時決定，而是在「呼叫時」決定，主要看「怎麼呼叫」：

- **方法呼叫** `obj.method()`：`this` 是 `.` 前面那個物件（`obj`）。
- **一般函式呼叫** `fn()`：嚴格模式下 `this` 是 `undefined`；非嚴格模式下是全域物件。
- **用 `new` 呼叫**：`this` 是那個新建立的物件（前面四步驟講過）。
- **arrow function（箭頭函式）**：不綁自己的 `this`，而是沿用「定義它的外層」的 `this`。因此不要用 arrow function 當 constructor，也要小心把物件方法寫成 arrow function 會抓不到該物件。
- **明確綁定** `call` / `apply` / `bind`：可以手動指定 `this` 要指向哪個物件。`call` 與 `apply` 會立刻以指定的 `this` 呼叫函式；`bind` 則回傳一個「`this` 已被固定」的新函式，之後不論怎麼呼叫都不會改變。

最容易踩到的坑是：把一個方法從物件上「拆下來」單獨呼叫（例如存到變數 `const f = player1.sayName; f();`），此時 `.` 前面已經沒有物件了，`this` 就不再是 `player1`。要保留綁定，可用 `player1.sayName.bind(player1)`。

## 程式碼範例

以下是可直接在瀏覽器 console 或 Node.js 執行的完整範例，示範 constructor、掛在 prototype 上的共用方法，以及原型繼承：

```javascript
// 定義 Person constructor，共用方法掛在 prototype 上（省記憶體）
function Person(name) {
  this.name = name;
}
Person.prototype.sayName = function () {
  return `Hello, I'm ${this.name}!`;
};

// 定義 Player constructor
function Player(name, marker) {
  if (!new.target) {
    throw Error("必須使用 'new' 來呼叫 Player");
  }
  this.name = name;
  this.marker = marker;
}
Player.prototype.getMarker = function () {
  return `My marker is "${this.marker}"`;
};

// 在建立任何實例「之前」設好繼承鏈
Object.setPrototypeOf(Player.prototype, Person.prototype);

const player1 = new Player("steve", "X");
const player2 = new Player("also steve", "O");

console.log(player1.sayName());   // Hello, I'm steve!
console.log(player2.sayName());   // Hello, I'm also steve!
console.log(player1.getMarker()); // My marker is "X"

// 驗證原型鏈
console.log(Object.getPrototypeOf(player1) === Player.prototype);      // true
console.log(Object.getPrototypeOf(Player.prototype) === Person.prototype); // true
console.log(player1.hasOwnProperty("name"));      // true（自己的）
console.log(player1.hasOwnProperty("sayName"));   // false（繼承來的）
```

## 常見陷阱

!!! warning "忘記 `new` 會悄悄出錯"
    不加 `new` 直接呼叫 constructor，`this` 不會指向新物件。非嚴格模式下 `this` 是全域物件，會把 `name`、`marker` 寫成全域變數，程式看似「沒壞」卻行為錯亂；而且 `const p = Player("x")` 會拿到 `undefined`。用 `new.target` 守護 constructor，或改用 class（類別）語法（下一課會學）避免這類問題。

!!! warning "把方法寫在 constructor 裡會浪費記憶體"
    在 constructor 內用 `this.method = function(){...}`，每 `new` 一個實例就複製一份函式。若要做很多實例，請把共用方法掛在 `建構子.prototype` 上，讓所有實例共用同一份。

!!! warning "絕對不要用 `Player.prototype = Person.prototype` 來做繼承"
    這個寫法會讓兩個 `prototype` 變成「記憶體中同一個物件」，而不是繼承關係。之後你改 `Player.prototype` 上的任何方法，`Person.prototype` 也會跟著被改，甚至波及其他同樣這樣接上去的 constructor：

    ```javascript
    Player.prototype = Person.prototype; // 別這樣！
    Enemy.prototype = Person.prototype;  // 也別這樣！
    Enemy.prototype.sayName = function () {
      console.log("HAHAHAHAHAHA");
    };
    const carl = new Player("carl", "X");
    carl.sayName(); // 竟然印出 "HAHAHAHAHAHA"，因為三者是同一個物件！
    ```

    正確作法是用 `Object.setPrototypeOf(Player.prototype, Person.prototype)`，建立「繼承」而非「共用同一物件」。

!!! warning "`.prototype` 與 `[[Prototype]]` 不是同一個東西"
    `.prototype` 是「函式」上的屬性，決定 `new` 出來的物件的 `[[Prototype]]`；要「讀取某物件的 `[[Prototype]]`」請用 `Object.getPrototypeOf()`，不要用已被淘汰的 `.__proto__`。

## 練習

**Assignment（動手做）**：寫一個用來製造「Book」物件的 constructor。之後的 project 會再回來用到它。

1. 讓每個 book 物件具備這些屬性：書名 `title`、作者 `author`、頁數 `pages`、以及你是否讀過這本書 `read`（布林值）。
2. 在 constructor 中放一個 `info()` 方法，用來回報這本書的資訊，例如：

    ```javascript
    console.log(theHobbit.info());
    // "The Hobbit by J.R.R. Tolkien, 295 pages, not read yet"
    ```

3. 小提醒（`console.log` vs `return`）：範例為了示範用 `console.log()`，但實務上讓函式 `return` 值通常更好——這樣你可以把值傳到任何需要的地方，而不被綁死在「一定要印出來」。所以建議 `info()` 用 `return` 回傳字串，再由呼叫端決定要不要 `console.log`。

**延伸練習（回到原文做）**：TOP 建議搭配閱讀 Digital Ocean 的原型與繼承文章、以及 javascript.info 的 Prototypal Inheritance 一文並完成文末練習題，另外閱讀關於 `this` 關鍵字的文章，特別留意每種情境下的陷阱。這些連結整理在下方「原文與延伸資源」。

## 原文與延伸資源

- 原文：[Object Constructors](https://www.theodinproject.com/lessons/node-path-javascript-object-constructors)
- 本課引用：
  - MDN：[Object.getPrototypeOf()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)
  - MDN：[Object.prototype.hasOwnProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)
  - MDN：[Object.prototype.\_\_proto\_\_（非標準、已淘汰）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto)
  - javascript.info：[Prototypal inheritance](https://javascript.info/prototype-inheritance)
  - Digital Ocean：[Understanding Prototypes and Inheritance in JavaScript](https://www.digitalocean.com/community/tutorials/understanding-prototypes-and-inheritance-in-javascript)
  - JavaScript Tutorial：[the `this` keyword](https://www.javascripttutorial.net/javascript-this/)

---

> 本講義改寫自 The Odin Project《Object Constructors》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
