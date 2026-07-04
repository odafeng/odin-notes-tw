---
title: async 與 await
source_url: https://www.theodinproject.com/lessons/node-path-javascript-async-and-await
source_file: vendor/curriculum/javascript/asynchronous_javascript_and_apis/async_and_await.md
path: full-stack-javascript
course: JavaScript
order: 21
generated: 2026-07-03
---

# async 與 await

> 改寫自 The Odin Project：[Async and Await](https://www.theodinproject.com/lessons/node-path-javascript-async-and-await)
> ｜Full Stack JavaScript › JavaScript › Asynchronous JavaScript and APIs

## 核心概念

當非同步（asynchronous）程式碼的邏輯一多，用 `.then()` 一層層串接就會愈來愈難讀。`async` 與 `await` 這兩個關鍵字，能讓非同步程式碼「讀起來像同步程式碼」：外觀乾淨、由上往下閱讀，卻仍保有非同步不阻塞（non-blocking）的好處。

最重要的一句心法：**`async`/`await` 只是 promise 的語法糖（syntactic sugar）。** 底層完全還是 promise，並沒有引入新的非同步機制。理解這一點，後面所有行為都推得出來。

先看同一件事的兩種寫法。以下兩段程式做的事完全一樣：向 server 拿資料、找出符合名字的人、回傳一個 promise。

```javascript
// 寫法一：用 .then() 串接
function getPersonsInfo(name) {
  return server.getPeople().then((people) => {
    return people.find((person) => person.name === name);
  });
}
```

```js
// 寫法二：用 async/await（做的事跟寫法一完全相同）
async function getPersonsInfo(name) {
  const people = await server.getPeople();
  const person = people.find((person) => person.name === name);
  return person;
}
```

第二種寫法看起來就像你平常寫的一般函式。差別只在函式宣告前多了 `async`，以及在 `server.getPeople()` 前面多了 `await`。

### async 關鍵字做什麼

`async` 放在函式宣告前，告訴 JavaScript 引擎「這是一個非同步函式」。它做兩件事：

1. **讓函式一定回傳一個 promise。** 不管你在函式裡 `return` 什麼值，外面拿到的都是 promise。在 `async` 函式裡 `return` 一個值，等同於「resolve（兌現）一個 promise 並帶著這個值」；在裡面 `throw` 一個錯誤，則等同於「reject（拒絕）這個 promise」。
2. **允許在函式內部使用 `await`。** `await` 只能寫在 `async` 函式裡（唯一例外是 module（模組）的頂層，稱為 top-level await）。

舉例來說，下面這個函式即使只回傳一個數字 `1`，呼叫端拿到的仍是一個 promise：

```javascript
async function foo() {
  return 1;
}
// 等同於：function foo() { return Promise.resolve(1); }
foo().then((value) => console.log(value)); // 印出 1
```

因為 `async` 只是語法糖，所以「任何能用一般函式的地方，都能用 `async` 函式」。它可以是箭頭函式（arrow function）、可以當作 `.forEach`／`.map` 的回呼（callback）、也可以放進 `.then()` 裡：

```javascript
const yourAsyncFunction = async () => {
  // 做一些非同步的事，並回傳一個 promise
  return result;
};
```

### await 關鍵字做什麼

`await` 的作用是：**告訴 JavaScript「暫停」這個函式的執行，等後面那個 promise 有結果（settle，敲定）之後，再繼續往下跑，並把 promise 兌現的值直接取出來。** 你可以把它想成一個「等到完成為止」的關鍵字。

平常你要從一個回傳 promise 的函式取值，會用 `.then()`：

```javascript
server.getPeople().then((people) => {
  // 在這裡才能用 people
});
```

有了 `await`，你就不必進到 `.then()` 的回呼，而是直接把結果指派給變數：

```javascript
const people = await server.getPeople();
// people 就是兌現的值，接下來像同步程式碼一樣用它
```

要特別澄清一個常見誤解：`await` 暫停的是「這個 async 函式本身」，**不會**卡住整個瀏覽器或整條主執行緒（main thread）。實際上，遇到 `await` 時函式會「讓出」控制權，其他程式碼照常執行；等 promise 敲定後，這個函式才被排回 microtask（微任務）佇列繼續跑。所以它非同步的本質完全沒變，只是寫法變得像同步。

### 執行的分段模型

理解 `await` 的一個好方式是：async 函式的函式體，被一個個 `await` 切成好幾段。第一段（直到第一個 `await` 為止）是同步執行的；每一個 `await` 之後的程式碼，相當於被塞進一個 `.then()` 回呼裡，等前一個 promise 敲定才會執行。

```javascript
async function foo() {
  console.log("start"); // 這行同步執行
  const a = await first(); // 執行到這裡暫停，等 first() 敲定
  console.log(a); // first() 敲定後才跑，相當於在 .then() 裡
  const b = await second(); // 再次暫停
  console.log(b);
}
```

### async 函式回傳什麼

再強調一次結論：**async 函式永遠回傳一個 promise。** 你 `return` 的值會成為那個 promise 兌現（resolve）的值；你 `throw` 的錯誤會讓那個 promise 被拒絕（reject）。因此呼叫端可以照舊用 `.then()` 拿值、用 `.catch()` 接錯誤，因為它拿到的本來就是 promise。

### 錯誤處理

因為 async 函式回傳的是 promise，處理錯誤有兩種方式：

**方式一：在外面接 `.catch()`。** 既然回傳 promise，就能在呼叫端串一個 `.catch()`：

```javascript
asyncFunctionCall().catch((err) => {
  console.error(err);
});
```

**方式二：在函式內部用 `try...catch`。** 如果想在 async 函式裡就地處理錯誤，可以把會出錯的程式包進 `try` 區塊；只要 `await` 的 promise 被拒絕，`await` 就會在該處「丟出」錯誤，於是流程跳進 `catch` 區塊。這也是 `try...catch` 之所以能搭配 `await` 的原因——被拒絕的 promise 在 `await` 處會變成一個可以被 `catch` 攔住的例外（exception）。

```javascript
async function getPersonsInfo(name) {
  try {
    const people = await server.getPeople();
    const person = people.find((person) => person.name === name);
    return person;
  } catch (error) {
    // 用你想要的方式處理錯誤
    console.error(error);
  }
}
```

`try...catch` 的好處是：同步錯誤和非同步錯誤都能用同一套結構攔下來，不必在每個函式呼叫後面追加 `.catch()`。到底該用哪一種，取決於你的程式怎麼寫，寫多了自然會有手感。

### 順序 vs 並行

`await` 會讓程式碼「一個等完再等下一個」，這在有先後相依關係時很自然，但若兩件事本可同時進行，逐一 `await` 就會白白拉長總時間：

```javascript
// 順序執行：總共約 3 秒（2 + 1）
await new Promise((r) => setTimeout(r, 2000));
await new Promise((r) => setTimeout(r, 1000));

// 並行執行：總共約 2 秒（取兩者的最大值）
await Promise.all([
  new Promise((r) => setTimeout(r, 2000)),
  new Promise((r) => setTimeout(r, 1000)),
]);
```

當多個非同步工作彼此獨立時，先一起發動、再用 `await Promise.all([...])` 一次等全部完成，才是有效率的做法。

## 程式碼範例

下面是一個可以直接在瀏覽器 console 或 Node.js 執行的完整範例。先用一個假的 `server` 物件模擬「延遲 2 秒的網路請求」，再用 async/await 取用它。這個 `server` 怎麼實作不重要，重點是看兩種寫法行為一致、都回傳 promise。

```javascript
// 模擬一個會延遲回應的 server
const server = {
  people: [
    { name: "Odin", age: 20 },
    { name: "Thor", age: 35 },
    { name: "Freyja", age: 29 },
  ],
  getPeople() {
    return new Promise((resolve) => {
      // 模擬 2 秒的網路延遲
      setTimeout(() => resolve(this.people), 2000);
    });
  },
};

// 用 async/await 取用
async function getPersonsInfo(name) {
  const people = await server.getPeople();
  return people.find((person) => person.name === name);
}

// 因為 getPersonsInfo 回傳 promise，呼叫端可以用 await 或 .then()
async function main() {
  const person = await getPersonsInfo("Thor");
  console.log(person); // { name: "Thor", age: 35 }
}

main();
```

搭配 `try...catch` 的完整錯誤處理版本：

```javascript
async function getPersonsInfo(name) {
  try {
    const people = await server.getPeople();
    const person = people.find((p) => p.name === name);
    if (!person) {
      // throw 出去的錯誤會讓這個 async 函式回傳的 promise 被 reject
      throw new Error(`找不到名為 ${name} 的人`);
    }
    return person;
  } catch (error) {
    console.error("取用資料時出錯：", error.message);
    return null; // 依需求回傳一個預設值
  }
}
```

## 常見陷阱

!!! warning "await 只能寫在 async 函式裡（或 module 頂層）"
    在一般 script 的最外層直接寫 `await` 會出現語法錯誤（SyntaxError）。若要在頂層使用，得把程式包進一個 async 函式再呼叫它，例如 `async function run() { ... } run();`；或是把檔案當成 module（`<script type="module">` 或 `.mjs`）以使用 top-level await。

!!! warning "別忘了 await，否則你拿到的是 promise 本身"
    如果漏掉 `await`，變數拿到的會是一個尚未敲定的 promise 物件，而不是你要的值。例如 `const people = server.getPeople();` 之後對 `people` 呼叫 `.find()` 會直接壞掉，因為 promise 上沒有 `.find()`。

!!! warning "該並行的工作別排成序列"
    對彼此獨立的多個非同步工作逐一 `await`，會讓它們變成一件做完才做下一件，總時間被不必要地拉長。彼此無相依時，改用 `await Promise.all([...])` 讓它們同時進行。

!!! warning "async 回呼不會讓 forEach 等它"
    像 `array.forEach(async (item) => { await ... })` 這種寫法，`forEach` 並不會等每個 async 回呼完成才進行下一個，也無法在外層 `await` 整批完成。若需要「全部等完」，請改用 `.map()` 產生一組 promise，再交給 `Promise.all()`。

## 練習

以下把原文的 Assignment 改寫成可操作的繁中步驟。核心練習是把先前 API 課程中「用 promise 寫的 Giphy 取圖程式」改寫成 `async/await` 版本。

1. 從 promise 版本出發（記得把 `YOUR_KEY_HERE` 換成你自己的 Giphy API key）：

    ```javascript
    const img = document.querySelector("img");
    fetch("https://api.giphy.com/v1/gifs/translate?api_key=YOUR_KEY_HERE&s=cats")
      .then((response) => response.json())
      .then((response) => {
        img.src = response.data.images.original.url;
      })
      .catch((error) => console.error(error));
    ```

2. 因為 `await` 不能寫在一般 script 的頂層，先建立一個 async 函式把 API 呼叫包起來，命名為 `getCats`。
3. 把 `fetch(...)` 前面的 `.then()` 改成 `await`，將回應指派給變數：`const response = await fetch(...)`。
4. `response.json()` 也回傳一個 promise，同樣用 `await` 取值：`const catData = await response.json()`，再設定 `img.src = catData.data.images.original.url`。
5. 把 `.catch()` 換成 `try...catch`：把上面的程式包進 `try`，在 `catch (error)` 裡 `console.error(error)`。
6. 最後在程式中呼叫 `getCats()` 讓它實際執行。完成後的版本：

    ```javascript
    const img = document.querySelector("img");

    async function getCats() {
      try {
        const response = await fetch(
          "https://api.giphy.com/v1/gifs/translate?api_key=YOUR_KEY_HERE&s=cats"
        );
        const catData = await response.json();
        img.src = catData.data.images.original.url;
      } catch (error) {
        console.error(error);
      }
    }

    getCats();
    ```

    這段程式的行為和上一課的 promise 版本完全相同，只是改寫後更好讀。原文另建議延伸閱讀 javascript.info 的 async/await 文章，並觀看 Wes Bos 的 async/await 影片（步驟指回原文）。

### Knowledge check 自我檢核

- **`async` 關鍵字做什麼？** 標記一個函式為非同步函式，讓它一定回傳 promise，並允許在其中使用 `await`。
- **`await` 關鍵字做什麼？** 暫停該 async 函式的執行，等後面的 promise 敲定後繼續，並取出兌現的值。
- **async 函式回傳什麼？** 永遠回傳一個 promise；`return` 的值成為兌現值，`throw` 的錯誤成為拒絕原因。
- **在 async 函式裡丟出錯誤會怎樣？** 該函式回傳的 promise 會被 reject（拒絕），帶著那個錯誤。
- **如何在 async 函式裡處理錯誤？** 在函式內用 `try...catch` 攔截，或在呼叫端對回傳的 promise 串 `.catch()`。

## 原文與延伸資源

- 原文：[Async and Await](https://www.theodinproject.com/lessons/node-path-javascript-async-and-await)
- 本課引用：
  - [javascript.info — Async/await](https://javascript.info/async-await)（觀念與 summary）
  - [MDN — async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)（回傳 promise、錯誤 reject、執行分段與順序 vs 並行）
  - [MDN — try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)（錯誤處理語法）

---

> 本講義改寫自 The Odin Project《Async and Await》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
