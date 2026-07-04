---
title: 非同步程式碼
source_url: https://www.theodinproject.com/lessons/node-path-javascript-asynchronous-code
source_file: vendor/curriculum/javascript/asynchronous_javascript_and_apis/asynchronous_code.md
path: full-stack-javascript
course: JavaScript
order: 19
generated: 2026-07-03
---

# 非同步程式碼

> 改寫自 The Odin Project：[Asynchronous Code](https://www.theodinproject.com/lessons/node-path-javascript-asynchronous-code)
> ｜Full Stack JavaScript › JavaScript › Asynchronous JavaScript and APIs

## 核心概念

### 為什麼需要非同步（asynchronous）？

JavaScript 是網頁的語言，而網頁上有許多工作「天生就慢」：向伺服器抓取資料、讀取一個大檔案、等待使用者點擊、等一個計時器倒數結束。這些工作花掉的時間，不是幾奈秒（nanosecond）的 CPU 運算，而是幾百毫秒甚至好幾秒的「等待」。

問題在於：JavaScript 是**單執行緒（single-threaded）**的語言，同一時間只有一條主線在跑程式碼。如果我們用「同步（synchronous）」的方式去等一個網路請求——也就是「站在原地一直等到資料回來才做下一件事」——那麼在等待的這幾秒內，整個頁面會被卡住：按鈕沒反應、動畫停格、使用者以為當機了。這種「卡住整條主線」的行為稱為 **blocking（阻塞）**。

**非同步程式碼**就是解法。它讓那些慢的工作「在背景進行」，主線不必站在原地空等，而是先去處理其他程式碼；等背景工作完成後，再回頭執行我們預先安排好的後續動作。用一句話說：非同步就是「先登記好『完成後要做什麼』，然後讓主線繼續跑，別被慢工作卡住」。

本課要建立三個核心觀念：**callback（回呼）**、**promise**，以及它們背後的執行機制。這一課先把觀念講清楚，細節語法會在後續課程繼續深入。

### Callback（回呼函式）

**callback 是一個「被當成引數傳進另一個函式」的函式，之後在那個外層函式內部被呼叫（invoke），用來完成某段流程或動作。**

這句定義聽起來抽象，但你其實天天都在用。看這個最典型的例子：

```javascript
myDiv.addEventListener("click", function () {
  // 做點什麼！
});
```

這裡 `addEventListener()` 接收了一個 callback（那個「做點什麼」的匿名函式），然後在 `myDiv` 被點擊時才去呼叫它。重點是：**我們沒有自己呼叫這個函式，而是把它交給 `addEventListener`，由它決定「什麼時候」呼叫**。這正是 callback 的精神——「這件事你先收著，時機到了你幫我執行」。

#### 同步 callback vs. 非同步 callback

不是所有 callback 都跟「非同步」有關，這是初學者最容易混淆的一點。關鍵差別在於**這個 callback 是「立刻」被呼叫，還是「稍後」被呼叫**：

- **同步 callback**：在外層函式執行的當下**立刻**被呼叫，執行完才輪到下一行程式碼。例如陣列的 `map()`、`forEach()`——它們拿到你的 callback 後，馬上一個一個元素去跑，跑完才返回。
- **非同步 callback**：在某個非同步工作完成之後才被呼叫，這中間主線早就跑去做別的事了。例如 `setTimeout()`、`addEventListener()` 的點擊處理、以及 `Promise.prototype.then()`。

用下面這段經典程式碼感受差別：

```javascript
let value = 1;

doSomething(() => {
  value = 2;
});

console.log(value); // 會印出 1 還是 2？
```

如果 `doSomething` 是**同步**呼叫 callback（例如它內部直接 `callback()`），那麼 `value` 在 `console.log` 之前就被改成 `2`，印出 `2`。如果 `doSomething` 是**非同步**呼叫 callback（例如它內部用 `setTimeout(callback, 0)`），那麼 `console.log` 會先執行，此時 callback 還沒跑，印出 `1`。搞清楚一個 callback 是同步還是非同步，是預測程式行為的基本功。

#### Callback hell（回呼地獄）

Callback 在上面的例子中很好用，但當你需要「**按特定順序串接好幾個非同步步驟**」時，它會迅速失控。想像：先抓使用者資料 → 再用結果抓他的訂單 → 再用訂單抓每筆商品明細，每一步都要等上一步完成。用 callback 寫出來會變成一層包一層：

```javascript
getUser(function (user) {
  getOrders(user, function (orders) {
    getDetails(orders, function (details) {
      // ... 還要再包下去
    });
  });
});
```

這種不斷向右縮排、愈疊愈深、難以閱讀也難以做錯誤處理的結構，社群戲稱為 **callback hell（回呼地獄）**，又叫「毀滅金字塔（pyramid of doom）」。本課接下來介紹的 promise，主要就是為了讓你脫離這種地獄。

### Promise（承諾）

先看一個問題。假設 `getData()` 會從伺服器抓資料，整理好後以物件回傳：

```javascript
const getData = function () {
  // 去某個 API 抓資料...
  // 整理一下，以物件形式回傳：
  return data;
};
```

抓資料要花時間，但如果我們不「告訴」程式碼這件事，它會**假設函式裡的每一行都是瞬間完成的**。於是我們這樣寫就會出事：

```javascript
const myData = getData();
const pieceOfData = myData["whatever"]; // 出錯！
```

當程式跑到第二行要從資料裡取出 `pieceOfData` 時，`getData()` 很可能還在抓資料，`myData` 根本還不是我們要的資料，而是 `undefined`。取 `undefined` 的屬性當然會出問題。

我們需要一種機制，能告訴程式碼「**等資料抓完再繼續**」。**promise 就是解法。**

#### promise 是什麼？

**promise 是一個「可能在未來某個時間點產出一個值」的物件。** 它就像一張「取餐號碼牌」：你點了餐（發起了一個非同步工作），店家給你一張號碼牌（promise 物件），你現在手上還沒有食物，但這張牌**承諾**：食物好了會叫你（成功），或者告訴你這道菜賣完了（失敗）。你拿著牌可以先去做別的事，不必站在櫃台前乾等。

有了 promise，前面那段問題程式碼可以改寫成：

```javascript
const myData = getData(); // 假設 getData 被改寫成回傳一個 Promise...

myData.then(function (data) {
  // .then() 會等到 promise 被 resolve（實現）後才執行
  const pieceOfData = data["whatever"]; // 然後才跑裡面的程式
});
```

`.then()` 登記了一個 callback，並保證「**等資料真的到手了**」才會執行它。這樣就不會再拿到 `undefined`。

#### promise 的三種狀態（state）

一個 promise 內部有兩個關鍵屬性：**state（狀態）**與 **result（結果）**。狀態一定是以下三者之一：

- **pending（等待中）**：初始狀態，工作還在進行，尚未有結果。
- **fulfilled（已實現）**：工作成功完成，`result` 是成功的值。也常被說成 promise 被「resolved（解決）」。
- **rejected（已拒絕）**：工作失敗，`result` 是失敗的原因（通常是一個 error 物件）。

一個非常重要的規則：**promise 的狀態一旦從 pending 變成 fulfilled 或 rejected，就永久固定、不能再改**。這種「一旦落定就不可變」的特性稱為 **settled（已定案）**。

要建立自己的 promise，用 `new Promise(...)`，並傳入一個稱為 **executor（執行器）**的函式。這個 executor 會在 promise 建立時**立即被呼叫**，它收到兩個由 JavaScript 提供的函式當引數：`resolve` 與 `reject`。

```javascript
const promise = new Promise(function (resolve, reject) {
  // executor：這裡放「產出結果」的程式碼
  // 成功時呼叫 resolve(value)，把狀態變成 fulfilled
  // 失敗時呼叫 reject(error)，把狀態變成 rejected
  setTimeout(() => resolve("完成！"), 1000);
});
```

另一條規則呼應前面：**只有第一次呼叫 `resolve` 或 `reject` 才算數，之後的呼叫都會被忽略。** 因為狀態一旦 settled 就不可變，你再怎麼呼叫也改不動它了。

#### 消費 promise：`.then()`、`.catch()`、`.finally()`

拿到一個 promise 後，我們用下面三個方法來「消費」它的結果：

- **`.then(onFulfilled, onRejected)`**：登記兩個處理函式。第一個在 promise 成功（fulfilled）時執行、收到成功的值；第二個在失敗（rejected）時執行、收到錯誤。兩個引數都可以省略。
- **`.catch(onRejected)`**：只處理錯誤，等同於 `.then(null, onRejected)` 的簡寫，讀起來更清楚。
- **`.finally(onFinally)`**：不論成功或失敗都會執行，且**不接收任何引數**。適合放「無論如何都要做」的收尾動作（例如關閉載入動畫）。它會把前面的結果或錯誤原封不動往後傳，並忽略自己的回傳值。

```javascript
promise
  .then((value) => {
    console.log("成功：", value);
  })
  .catch((error) => {
    console.log("失敗：", error);
  })
  .finally(() => {
    console.log("不論成敗，都會執行");
  });
```

#### promise 何時勝過 callback？

理解 promise 的價值，關鍵在對比它解決了 callback 的哪些痛點：

1. **可鏈接（chaining），告別回呼地獄。** `.then()` 會回傳一個新的 promise，所以你可以把好幾個 `.then()` 一個接一個串起來，寫成「由上往下、扁平好讀」的流程，而不是層層向右縮排的金字塔：

   ```javascript
   getUser()
     .then((user) => getOrders(user))
     .then((orders) => getDetails(orders))
     .then((details) => console.log(details))
     .catch((error) => console.log("任何一步出錯都會到這裡"));
   ```

2. **集中且不會遺漏的錯誤處理。** 用巢狀 callback 時，每一層都得自己處理錯誤，很容易漏掉。promise 鏈上只要一個 `.catch()`，就能接住鏈條中**任何一步**拋出的錯誤。

3. **可以掛多個處理器，時機到了自動觸發。** 你可以對同一個 promise 掛好幾個 `.then()`；而且就算 promise 「早就 settled 了」，之後才掛上的 `.then()` 依然會被執行——這比傳統 callback 的「錯過就沒了」更有彈性。

一句話總結：**當你有「多個非同步步驟需要按順序串接」，或需要「乾淨統一的錯誤處理」時，promise 通常優於 callback。**

### event loop（事件迴圈）：非同步為何不會卡住主線

最後補一塊拼圖：JavaScript 只有單一執行緒，那「背景執行」到底是誰在跑？答案是 **event loop（事件迴圈）**這套機制。

當你呼叫 `setTimeout`、發網路請求、或一個 promise 開始等待時，這些「慢工作」其實是交給瀏覽器（或 Node.js）底層去負責，**不佔用**你的主線。主線把該登記的 callback 登記好之後，就繼續往下跑完目前所有同步程式碼。等到主線的工作全部清空、而某個背景工作也完成了，event loop 才把對應的 callback 放回主線上執行。

這就是為什麼 `setTimeout(fn, 0)` 裡的 `fn` 不會「立刻」執行——即使延遲設為 0，它也得排隊等到目前所有同步程式碼跑完才輪得到。理解 event loop，你就能解釋前面那個「印出 1 還是 2」的謎題，也能明白為什麼非同步程式碼能讓頁面保持流暢而不被 blocking。

## 程式碼範例

下面用一個「模擬抓資料」的最小可執行範例，串起本課所有觀念。可貼進瀏覽器 console 或 Node.js 執行。

```javascript
// 模擬一個非同步抓資料的函式，回傳 Promise
function fetchUser(shouldSucceed) {
  return new Promise(function (resolve, reject) {
    // 用 setTimeout 模擬「需要花 1 秒的網路請求」
    setTimeout(function () {
      if (shouldSucceed) {
        resolve({ id: 1, name: "小明" }); // 成功：狀態變 fulfilled
      } else {
        reject(new Error("抓取使用者失敗")); // 失敗：狀態變 rejected
      }
    }, 1000);
  });
}

console.log("1. 發出請求，但主線不會卡住");

fetchUser(true)
  .then(function (user) {
    // promise 成功後才執行，user 就是 resolve 傳入的值
    console.log("3. 拿到使用者：", user.name);
    return user.id; // 回傳值會傳給下一個 .then()
  })
  .then(function (id) {
    console.log("4. 使用者 id 是：", id);
  })
  .catch(function (error) {
    // 上面任何一步出錯都會被這裡接住
    console.log("錯誤：", error.message);
  })
  .finally(function () {
    console.log("5. 不論成敗都會執行（例如關閉載入動畫）");
  });

console.log("2. 這行會在 .then() 之前印出，證明沒有被阻塞");

// 實際輸出順序：1 → 2 →（約 1 秒後）3 → 4 → 5
```

注意輸出順序：`1` 和 `2` 是同步程式碼，會先印出；`3`、`4`、`5` 要等背景的 `setTimeout` 完成、由 event loop 排回主線後才印出。這正是非同步「不阻塞、稍後才執行」的具體展現。

## 常見陷阱

!!! warning "以為非同步函式的回傳值「馬上就能用」"
    像 `const data = getData(); const x = data.something;` 這種寫法，如果 `getData` 是非同步的，`data` 在下一行往往還是 `undefined`，因為資料還沒抓回來。**必須把後續動作放進 `.then()`**（或之後會學的 `await`）裡，才能保證「資料到手後」再使用。

!!! warning "分不清同步 callback 與非同步 callback"
    `array.forEach(fn)` 的 `fn` 是**同步**、立刻執行；`setTimeout(fn, 0)` 的 `fn` 是**非同步**、要排隊等主線清空。看到 callback 就假設它「立刻跑」或「稍後跑」都是危險的，要看是哪個函式在呼叫它。

!!! warning "忘記處理 promise 的 rejected 狀態"
    只寫 `.then()` 卻不寫 `.catch()`，一旦 promise 被 reject，錯誤會「無聲無息地被吞掉」（unhandled rejection），很難除錯。**每一條 promise 鏈都應該在結尾補上 `.catch()`**。

!!! warning "以為 resolve/reject 可以反覆改變狀態"
    promise 一旦 settled（fulfilled 或 rejected）就永久固定。在 executor 裡呼叫第二次 `resolve` 或 `reject` **完全沒有作用**，只有第一次算數，別指望靠它來「更新」結果。

## 練習

以下把原課 Assignment 改寫成繁中步驟。前四項是本講義已涵蓋的閱讀（幫你對照加深理解），影片與 project 型的延伸練習則指回原文資源。

1. **理解 callback 如何處理非同步操作**：回顧本課「Callback」一節，確認你能說出「同步 callback」與「非同步 callback」的差別，並用 `let value = 1; doSomething(() => value = 2)` 那個例子解釋為何印出的可能是 1 也可能是 2。（對應原課的 Art of Node callbacks 章節）
2. **掌握 promise 基礎**：回顧本課「Promise」一節，確認你能說出 promise 的三種狀態、`resolve`/`reject` 的作用，以及 `.then()`／`.catch()`／`.finally()` 各自何時被呼叫。（對應原課的 David Walsh〈Promises〉與 javascript.info〈Promise basics〉兩篇文章）
3. **理解 event loop**：回顧本課「event loop」一節，試著解釋為何 `setTimeout(fn, 0)` 的 `fn` 不會立刻執行。若想看視覺化動畫加深印象，可觀看原文列出的「What is Event Loop?」與「visualizing the Event loop」兩支影片。
4. **動手做**：把上面「程式碼範例」貼進瀏覽器 console 執行，先預測輸出順序，再實際跑一次核對。接著把 `fetchUser(true)` 改成 `fetchUser(false)`，觀察 `.catch()` 如何接住錯誤。
5. **延伸（project）**：原文另附兩支關於 promise 實戰與 promise 執行視覺化的影片，若你想在真實情境中「感受」promise 怎麼用，可回原文連結觀看。

## 原文與延伸資源

- 原文：[Asynchronous Code](https://www.theodinproject.com/lessons/node-path-javascript-asynchronous-code)
- 本課引用：
  - [MDN：Callback function 詞條](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)（callback 定義、同步 vs 非同步）
  - [javascript.info：Promise basics](https://javascript.info/promise-basics)（promise 狀態、executor、then/catch/finally）
  - [David Walsh：Promises](https://davidwalsh.name/promises)（`.then()` 的行為，簡短入門）
  - [GeeksforGeeks：Callback 與 Callback Hell](https://www.geeksforgeeks.org/javascript/what-to-understand-callback-and-callback-hell-in-javascript/)（何時該用 promise 取代 callback）

---

> 本講義改寫自 The Odin Project《Asynchronous Code》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
