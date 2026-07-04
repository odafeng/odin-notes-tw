---
title: 物件基礎（Objects）
source_url: https://www.theodinproject.com/lessons/foundations-object-basics
source_file: vendor/curriculum/foundations/javascript_basics/object_basics.md
path: foundations
course: Foundations
order: 44
generated: 2026-07-03
---

# 物件基礎（Objects）

> 改寫自 The Odin Project：[Object Basics](https://www.theodinproject.com/lessons/foundations-object-basics)
> ｜Foundations › JavaScript Basics

## 核心概念

到目前為止，你學過的 variable（變數）大多只裝一個值：一個 number（數字）、一個 string（字串）、一個 boolean（布林值）。但真實世界的資料通常是「一整組互相關聯」的東西。例如描述一個人，你不會只想記住名字，還想同時記住年齡、信箱、興趣。把這些散落的變數綁在同一個容器裡，就是 object（物件）要解決的事。

### 物件是「鍵值對」的集合

object 是一組 key-value pair（鍵值對）的集合。每一筆資料都由一個 key（鍵，也叫 property name，屬性名）和一個 value（值）組成。key 是字串，value 可以是任何型別，包含 number、string、array（陣列）、甚至另一個 object 或 function（函式）。

建立 object 最常見的方式是 object literal（物件字面值），也就是用一對大括號 `{}` 直接把資料寫出來：

```javascript
const person = {
  name: "Bob",
  age: 32,
  isStudent: false,
};
```

另一種寫法是用 constructor（建構式）`new Object()`，但幾乎沒人這樣寫，object literal 更簡潔直觀，是社群的預設選擇。

### 存取屬性：點記法與方括號記法

要讀取或修改 object 裡的值，有兩種語法。

第一種是 dot notation（點記法），也是最常用、最好讀的：

```javascript
console.log(person.name); // "Bob"
person.age = 33; // 修改既有屬性
person.email = "bob@example.com"; // 新增一個原本不存在的屬性
```

第二種是 bracket notation（方括號記法），把 key 當成字串放進中括號裡：

```javascript
console.log(person["name"]); // "Bob"
person["age"] = 33;
```

兩者大多時候可以互換，但在兩種情況下你「必須」用方括號記法：

1. 當 key 含有空白或特殊字元、不是合法的變數名時，例如 `person["date of birth"]`，點記法 `person.date of birth` 會直接語法錯誤。
2. 當 key 存在一個變數裡、要動態決定要存取哪個屬性時。這是最關鍵的差異：點記法後面接的名稱會被當成「字面上的名字」，而方括號裡放的是一個「會被求值的 expression（運算式）」。

```javascript
const key = "age";

console.log(person[key]); // 33 —— 先把 key 求值成 "age"，再取 person.age
console.log(person.key); // undefined —— 找的是名為 "key" 的屬性，它不存在
```

當你的屬性名稱要靠迴圈或使用者輸入來決定時，方括號記法是唯一的辦法。

### 刪除屬性與檢查屬性是否存在

用 `delete` 可以移除一個屬性；用 `in` 運算子可以檢查某個 key 是否存在，就算它的值是 `undefined` 也判斷得出來：

```javascript
delete person.isStudent;

console.log("name" in person); // true
console.log("isStudent" in person); // false
```

### 方法與 this

value 如果是一個 function，這個屬性就叫 method（方法）。method 讓 object 不只能存資料，還能「做事」。在 method 內部，關鍵字 `this` 指向「呼叫這個 method 的那個 object」，讓方法能讀到自己身上的其他屬性：

```javascript
const person = {
  name: "Bob",
  greet() {
    // 這是 method 的簡寫語法
    console.log(`嗨，我是 ${this.name}`);
  },
};

person.greet(); // 嗨，我是 Bob
```

同一段 method 程式碼，掛在不同 object 上、由誰呼叫，`this` 就指向誰，因此輸出會不同。`this` 的完整行為之後的課程會深入，這裡先記住「`this` 指向呼叫方法的那個物件」即可。

### 巢狀結構

object 的 value 也可以是 array 或另一個 object，於是能組出巢狀（nested）的資料結構。存取時就一層一層往下鑽：

```javascript
const person = {
  name: { first: "Bob", last: "Smith" },
  hobbies: ["讀書", "寫程式"],
};

console.log(person.name.first); // "Bob"
console.log(person.hobbies[0]); // "讀書"
```

### 物件與 primitive 的關鍵差異：複製 vs 參考

這是本課最重要、也最容易踩雷的觀念。JavaScript 的資料型別分兩大類：primitive（原始型別，例如 number、string、boolean）與 object（物件型別，包含 `{}`、array、function）。兩者最大的差別在於「賦值和傳參時，複製的到底是什麼」。

當你把一個 primitive 變數指派給另一個變數，複製的是「值本身」。兩個變數各自獨立，改動其中一個不會影響另一個：

```javascript
let data = 42;
let dataCopy = data; // dataCopy 拿到的是 42 的一份複本
dataCopy = 43;

console.log(data); // 42
console.log(dataCopy); // 43
```

但當你把一個 object 變數指派給另一個變數，複製的是「reference（參考）」，也就是一個指向同一個物件的位址，而不是物件本身。兩個變數指向的是同一個 object，透過任何一個去改，另一個看到的也會變：

```javascript
const obj = { data: 42 };
const objCopy = obj; // objCopy 拿到的是「指向同一個物件」的參考

objCopy.data = 43;

console.log(obj.data); // 43 —— obj 也跟著變了
console.log(objCopy.data); // 43
```

其實你在前一個 Etch-A-Sketch 專案已經用過這個特性。當你寫 `element.style.backgroundColor = "red"`，你改的是一個變數，畫面上對應的 DOM 節點卻真的變色了——因為 `element` 是那個 DOM 節點的參考，不是它的複本。如果它只是複本，你怎麼改都不會影響到畫面上的原件。

### 傳進函式時也一樣

同樣的規則延伸到函式參數。傳 object 進函式，函式拿到的是參考，在函式裡改動它會影響外面的原物件；傳 primitive 進去，函式拿到的是複本，怎麼改都碰不到外面：

```javascript
function increaseObject(objCounter) {
  objCounter.counter += 1; // 改到的是外面的同一個物件
}

function increasePrimitive(primitiveCounter) {
  primitiveCounter += 1; // 只改到函式內部的複本
}

const object = { counter: 0 };
let primitive = 0;

increaseObject(object);
increasePrimitive(primitive);

console.log(object.counter); // 1 —— 被改到了
console.log(primitive); // 0 —— 沒被改到
```

### 「修改物件」與「重新賦值變數」是兩回事

最後一個容易混淆的細節：多個變數指向同一個 object 時，「修改（mutate）那個物件的內容」會反映到所有變數上；但「把某個變數重新指派（reassign）成一個全新的物件」只會換掉那一個變數的指向，其他變數還是指著原本的舊物件：

```javascript
let animal = { species: "dog" };
let dog = animal; // 兩個變數指向同一個物件

animal = { species: "cat" }; // 把 animal 重新指向一個全新的物件

console.log(animal); // { species: "cat" }
console.log(dog); // { species: "dog" } —— dog 還指著原本那個
```

### 物件和陣列的差別

array 其實是一種特殊的 object，兩者都是物件型別、都用參考傳遞。差別在於用途與存取方式：array 用「數字索引」有序地存放一串資料，適合「一堆同類、有順序」的東西（例如一份待辦清單）；object 用「具名的 key」存放資料，順序不是重點，適合「描述一個實體的各種屬性」（例如一個使用者的姓名、年齡、信箱）。實務上兩者常常搭配——例如一個「使用者物件組成的陣列」。

## 程式碼範例

```javascript
// 用 object literal 建立一個使用者物件，屬性型別各異
const user = {
  name: "Alice",
  age: 28,
  hobbies: ["攝影", "登山"], // value 也可以是 array
  address: {
    // value 也可以是另一個 object
    city: "台北",
    zip: "100",
  },
  // greet 是一個 method，this 指向 user 本身
  greet() {
    return `哈囉，我是 ${this.name}，今年 ${this.age} 歲`;
  },
};

// 點記法存取
console.log(user.name); // "Alice"
console.log(user.address.city); // "台北"（巢狀存取）
console.log(user.hobbies[1]); // "登山"

// 方括號記法：key 放在變數裡，動態決定要取哪個屬性
const field = "age";
console.log(user[field]); // 28

// 新增、修改、刪除屬性
user.email = "alice@example.com"; // 新增
user.age = 29; // 修改
delete user.zip; // 刪除（此屬性不存在，安全略過）

// 檢查屬性是否存在
console.log("email" in user); // true

// 呼叫 method
console.log(user.greet()); // "哈囉，我是 Alice，今年 29 歲"
```

## 常見陷阱

!!! warning "以為複製物件就得到獨立的一份"
    `const b = a` 這種寫法，如果 `a` 是 object，`b` 只是「指向同一個物件的另一個標籤」，不是獨立複本。透過 `b` 改屬性，`a` 也會跟著變。若你真的需要一份不互相影響的複本，要用其他技巧（例如展開語法 `{ ...a }`），這在後續課程會學到。

!!! warning "點記法後面接變數名，抓到的是字面名稱"
    `const key = "age"; obj.key` 找的是名叫 `"key"` 的屬性（通常是 `undefined`），不是 `obj.age`。要用變數當屬性名，必須寫 `obj[key]`，方括號裡的東西會先被求值。

!!! warning "把「重新賦值」誤當成「修改物件」"
    `animal = { species: "cat" }` 是讓 `animal` 改指向一個全新物件，不會動到其他指向舊物件的變數；而 `animal.species = "cat"` 才是修改原物件的內容，會反映到所有指向它的變數。兩者行為完全不同。

## 練習

1. 回到前幾課 JavaScript.info 的 array methods 練習，複習物件在陣列方法中的用法。只做下列這幾題：`Map to names`、`Map to objects`、`Sort users by age`、`Get average age`、`Create keyed object from array`。這些題目都會用到「陣列裡裝物件」的資料結構。
2. Fork 並 clone Wes Bos 的 JavaScript30 專案，打開各練習的 `index-START.html` 檔跟著做，重點是 `04 - Array Cardio Day 1` 與 `07 - Array Cardio Day 2` 這兩個影片練習（見下方延伸資源）。
3. 回到 The Odin Project 的 javascript-exercises 專案的 `foundations/` 目錄，先讀每題的 README，再依序完成：`12_calculator`、`13_palindromes`、`14_fibonacci`、`15_getTheTitles`、`16_findTheOldest`。每題的 `solution` 資料夾裡有參考解答，卡住時可對照。

若感到不知所措或卡關，別怕回頭複習，或到 TOP 的 Discord 社群求助。

## 原文與延伸資源

- 原文：[Object Basics](https://www.theodinproject.com/lessons/foundations-object-basics)
- 本課引用：
  - [JavaScript.info — Objects](https://javascript.info/object)（物件建立、存取、`in`、`for...in` 與 object vs primitive 總結）
  - [MDN — JavaScript object basics](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics)（點記法、方括號記法、設定成員、`this` 與 method）
  - [Wes Bos — JavaScript30](https://github.com/wesbos/JavaScript30)（Array Cardio 練習專案）
  - 影片（本講義未收錄內容，僅列出供延伸）：Array Cardio Day 1（`youtube.com/watch?v=HB1ZC7czKRs`）、Array Cardio Day 2（`youtube.com/watch?v=QNmRfyNg1lw`）

---

> 本講義改寫自 The Odin Project《Object Basics》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
