---
title: 看懂錯誤訊息（Errors）
source_url: https://www.theodinproject.com/lessons/foundations-understanding-errors
source_file: vendor/curriculum/foundations/javascript_basics/understanding_errors.md
path: foundations
course: Foundations
order: 37
generated: 2026-07-03
---

# 看懂錯誤訊息（Errors）

> 改寫自 The Odin Project：[Understanding Errors](https://www.theodinproject.com/lessons/foundations-understanding-errors)
> ｜Foundations › JavaScript Basics

## 核心概念

很多初學者第一次看到紅色的錯誤訊息（error message）就心生恐懼，覺得那是一堆看不懂的英文與陌生術語。但事實剛好相反：錯誤訊息是開發者最好的朋友。它會明確告訴你「哪裡出錯」、「為什麼出錯」、「該去哪一行修」。學會冷靜地讀懂錯誤，你才能有效地除錯（debug）、向他人清楚求助，並在卡關時自己推進下去。

### 錯誤（error）到底是什麼

在 JavaScript 裡，error 其實是語言內建的一種 object（物件）。每個 error 至少包含兩個關鍵資訊：

- **name（名稱／類型）**：例如 `ReferenceError`、`SyntaxError`、`TypeError`，這是判斷問題屬於哪一類的第一個線索。
- **message（訊息）**：一句話說明這次錯誤具體發生了什麼事，例如 `c is not defined`。

當程式跑到有問題的地方時，JS 會「拋出（throw）」一個 error。在術語上，我們就說程式「throw 了一個錯誤」。

### 拆解一則錯誤訊息

假設我們在一個連結到 HTML 頁面的 `script.js` 檔裡寫了這段程式：

```javascript
const a = "Hello";
const b = "World";

console.log(c); // c 從來沒有被宣告過
```

這段程式會執行，但會在瀏覽器的 console（主控台）丟出類似這樣的錯誤：

```text
Uncaught ReferenceError: c is not defined
    at script.js:4:13
```

我們可以把它逐段拆開來看：

1. **錯誤類型**：開頭的 `ReferenceError` 告訴你這是「參照錯誤」。當你去參照一個在目前 scope（作用域）中沒有被宣告或初始化的 variable（變數）時，就會拋出這種錯誤。
2. **錯誤訊息**：`c is not defined` 說明原因——`c` 這個名稱根本不存在。相同類型底下，不同原因會有不同訊息。例如你也可能遇到 `ReferenceError: can't access lexical declaration 'X' before initialization`，那指向的是「在初始化之前就使用變數」這個完全不同的原因。所以**類型和訊息要一起看**，才能真正理解問題。
3. **檔名與行號**：`at script.js:4` 告訴你出錯的檔案是 `script.js`、位置在第 4 行。多數瀏覽器還會多顯示欄位（字元）位置，例如 `at script.js:4:13` 代表第 4 行第 13 個字元。點這個連結，瀏覽器通常會直接跳到 Developer Tools 的 Sources 分頁對應的那一行。

### 堆疊追蹤（stack trace）

錯誤訊息還有一個重要部分叫 **stack trace（堆疊追蹤）**。它記錄了錯誤被拋出前，程式呼叫了哪些 function（函式）、呼叫順序是什麼，讓你能「回溯」錯誤的來龍去脈。

看這段程式：

```javascript
const a = 5;
const b = 10;

function add() {
  return c; // c 尚未宣告
}

function print() {
  add();
}

print();
```

`print()` 呼叫 `add()`，而 `add()` 回傳了一個還沒宣告的 `c`。stack trace 會由內而外告訴你：

1. `c is not defined`，發生在 `add()` 的作用域內（宣告於第 5 行）。
2. `add()` 是被 `print()` 呼叫的（`print()` 宣告於第 9 行）。
3. `print()` 本身是在第 12 行被呼叫的。

因此 stack trace 讓你能把錯誤一路追回它真正的源頭——這裡就是 `add()` 裡的 `return c`。閱讀 stack trace 時，最上面那一筆通常最接近錯誤發生的位置。

### 三種最常見的錯誤類型

#### SyntaxError（語法錯誤）

當你寫的程式不符合 JavaScript 的語法規則時，就會發生 SyntaxError。它發生在「解析（parse）」階段，也就是引擎還沒真正開始執行、只是在讀你的程式碼時就發現寫法不合文法。例如：

```javascript
function helloWorld() {
  console.log "Hello World!" // 少了括號
}
```

因為忘了幫 `console.log()` 加上括號，這會丟出 SyntaxError。常見原因還包括：括號或引號沒有成對、多或少了逗號、關鍵字拼錯等。

#### ReferenceError（參照錯誤）

當你參照的 variable 在目前 scope 中不存在時就會發生，這也是本課第一個範例的狀況。最常見的三個原因是：變數根本沒宣告、變數名稱拼錯、或在宣告之前就使用它。

#### TypeError（型別錯誤）

根據 MDN，TypeError 會在下列情況被拋出：

- 傳給運算子（operator）或函式的運算元／參數，型別（type）和它預期的不相容；
- 或試圖修改一個不能被改變的值；
- 或以不恰當的方式使用某個值。

舉例來說，我們想把兩個字串（string）合併成一句訊息：

```javascript
const str1 = "Hello";
const str2 = "World!";
const message = str1.push(str2);
```

這會得到 `TypeError: str1.push is not a function`。很多學習者會困惑：「`.push()` 明明是函式啊，我加東西到 array（陣列）時用過！」關鍵就在這裡——`.push()` 是 Array 的方法（method），不是 String 的方法。所以對字串而言，它「不是一個函式」。只要把 `.push()` 換成字串真正有的方法 `.concat()`，程式就能正常運作。

遇到 TypeError 時的好習慣是：回頭確認你正在操作的資料，它的 type 是不是你以為的那個？那個方法或運算對這個型別到底適不適用？

### 解決錯誤的思路

當你看懂錯誤之後，可以照這幾步著手：

1. **把錯誤訊息當朋友**。它會準確告訴你哪裡不對、要看哪幾行。沒有錯誤訊息，除錯才真的是惡夢——程式一樣不會動，你卻不知道為什麼。
2. **Google 這則錯誤**。把錯誤訊息貼上去搜尋，多半能在 Stack Overflow 或官方文件找到修法或解釋，至少會讓你更清楚原因。
3. **善用 debugger（除錯器）**。它能設定中斷點（breakpoint）、逐行執行、隨時查看任一變數的值，是深入排查時的關鍵工具。
4. **善用 console**。`console.log()` 是最快取得即時回饋的除錯方式；此外還有 `console.table()`、`console.trace()` 等實用方法。

### error 與 warning 的差別

最後要分清楚 **error（錯誤）** 和 **warning（警告）**：

- **error** 會**中止**程式或當前流程的執行，讓後續動作無法進行。
- **warning** 只是提醒你「有潛在問題」，通常**不會**讓程式在執行時當掉，比較偏向資訊性提示。

warning 該處理就儘早處理，但它的嚴重性不如 error。在視覺上，warning 常以黃色顯示、error 常以紅色顯示；顏色雖非硬性規定，但大多數平台都會用某種視覺差異把兩者區分開來。

## 程式碼範例

下面用 `try...catch` 把三種常見錯誤各觸發一次並抓下來。`try` 區塊裡的程式若拋出錯誤，會被 `catch` 區塊接住，程式就不會整個中斷——這讓我們能觀察每個 error object 的 `name` 與 `message`：

```javascript
// 1) ReferenceError：參照不存在的變數
try {
  console.log(notDeclared);
} catch (e) {
  console.log(e.name);    // "ReferenceError"
  console.log(e.message); // "notDeclared is not defined"
}

// 2) TypeError：對字串呼叫陣列才有的方法
try {
  const greeting = "Hello";
  greeting.push("!"); // 字串沒有 push
} catch (e) {
  console.log(e.name);    // "TypeError"
  console.log(e.message); // "greeting.push is not a function"
}

// 3) SyntaxError：用 eval 解析不合法的程式碼字串
try {
  eval("const x =;"); // 等號後面缺少值
} catch (e) {
  console.log(e.name);    // "SyntaxError"
}
```

> 補充：純粹寫錯語法的 SyntaxError（例如少一個括號）通常在程式「還沒開始執行」時就被擋下，連 `try...catch` 都攔不到；這裡改用 `eval()` 在執行期解析字串，才示範得出被 catch 接住的情況。這也呼應了 SyntaxError 發生在解析階段的特性。

## 常見陷阱

!!! warning "TypeError 常被誤以為「方法不存在」"
    看到 `X is not a function` 時，別急著懷疑那個方法拼錯了。更常見的原因是：`X` 的資料型別不對。例如 `.push()` 是 Array 的方法，對 String 呼叫就會失敗。先確認你手上的值到底是什麼 type，再確認那個方法屬不屬於這個型別。

!!! warning "只看錯誤類型、不看訊息"
    同一個 `ReferenceError` 底下，`c is not defined` 和 `can't access lexical declaration 'X' before initialization` 指的是完全不同的問題。務必把「類型」和「訊息」一起讀，才不會朝錯誤方向修。

!!! warning "把 warning 當成 error"
    warning 通常不會讓程式當掉，它只是提醒潛在問題。若你的程式「明明有黃色訊息卻還是能跑」，那多半是 warning 而非 error。別被它嚇到而誤刪正常的程式；但也別長期忽視，能修就儘早修。

## 練習

1. 讀 MDN 上三份錯誤類型的官方文件，建立初步印象即可，不必馬上全懂：[ReferenceError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError)、[SyntaxError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError)、[TypeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError)。文件裡的範例會用到 `try...catch`：`try` 區塊內的程式若出錯，會被 `catch` 區塊自動接住，讓你有機會處理錯誤而不讓整個程式中止。現在只要記得「有 `try...catch` 這種寫法」即可，之後的課程會再深入。
2. 完成 MDN 的 [「What went wrong? Troubleshooting JavaScript」](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_went_wrong)。記得下載它「故意埋了錯誤」的起始程式碼，實際動手把每個錯誤讀懂、修好，練習把本課的方法用在真實情境上。

完成後，試著回答本課的 knowledge check：

- 為什麼你可能會看到 TypeError？（至少說出三個原因）
- error 和 warning 之間最關鍵的差別是什麼？
- 你可以用哪一種方法來解決錯誤？

## 原文與延伸資源

- 原文：[Understanding Errors](https://www.theodinproject.com/lessons/foundations-understanding-errors)
- 本課引用：
  - MDN：[ReferenceError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError)
  - MDN：[SyntaxError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError)
  - MDN：[TypeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
  - MDN：[What went wrong? Troubleshooting JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_went_wrong)

---

> 本講義改寫自 The Odin Project《Understanding Errors》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
