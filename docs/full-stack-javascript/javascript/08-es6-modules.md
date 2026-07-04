---
title: ES6 模組
source_url: https://www.theodinproject.com/lessons/javascript-es6-modules
source_file: vendor/curriculum/javascript/organizing_your_javascript_code/es6_modules.md
path: full-stack-javascript
course: JavaScript
order: 8
generated: 2026-07-03
---

# ES6 模組

> 改寫自 The Odin Project：[ES6 Modules](https://www.theodinproject.com/lessons/javascript-es6-modules)
> ｜Full Stack JavaScript › JavaScript › Organizing Your JavaScript Code

## 核心概念

在先前的課程裡，我們學過 **module pattern（模組模式）**，用它來把變數與函式包起來、做出比較有條理的程式碼。但隨著專案變大，你大概會冒出一個念頭：「檔案愈來愈長，要是能把程式碼拆成好幾個檔案就好了。」把程式碼拆檔正是為了解決這個問題。在 ES6（有時稱為 ES2015）之前，我們只能靠 module pattern 這類技巧來勉強達成；ES6 之後，JavaScript 有了真正的 **module（模組）**，因此常被稱作「ES6 modules」或「ESM」。

### ES6 之前：全域範疇的問題

要理解為什麼需要 module，得先看看沒有 module 的世界長什麼樣。假設我們有兩個檔案 `one.js` 與 `two.js`，在 HTML 裡分別用 `<script>` 標籤載入：

```html
<script src="one.js" defer></script>
<script src="two.js" defer></script>
```

```javascript
// one.js
const greeting = "Hello, Odinite!";
```

```javascript
// two.js
console.log(greeting);
```

打開這個 HTML，你會看到 console 印出 `"Hello, Odinite!"`——即使 `greeting` 從來沒有在 `two.js` 裡宣告過！原因是這兩個 script 是「一個接一個」被載入到**同一個 global scope（全域範疇）**，效果就跟你把這兩行寫在同一個檔案裡一模一樣。反過來說，如果把 `two.js` 的標籤放在前面，就會得到 `greeting is not defined` 的錯誤，因為它會在變數宣告之前就嘗試 `console.log`。

這帶出一個重點：**即使你把程式拆成很多個 JavaScript 檔案，它們仍然共用同一個 global scope**。你在最外層宣告的變數並不安全，隨時可能被其他檔案覆蓋或污染。

在 ESM 出現之前，常見的補救辦法是用 **IIFE（Immediately Invoked Function Expression，立即呼叫函式運算式）** 把東西包起來。這樣程式一樣會執行，但裡面的變數會被限制在那個函式的範疇裡，而不是變成全域：

```javascript
// one.js
(() => {
  const greeting = "Hello, Odinite!";
})();
```

現在 `two.js` 會報 `greeting is not defined`，因為沒有任何全域變數叫 `greeting` 可以印。可是，如果我們希望「只把某些東西」對外公開呢？做法是把想公開的東西從 IIFE 裡 `return` 出來，指派給一個全域變數，其他的就留在函式裡當作私有：

```javascript
// one.js
const greeting = (() => {
  const greetingString = "Hello, Odinite!";
  const farewellString = "Bye bye, Odinite!";
  return greetingString;
})();
```

現在全域變數 `greeting` 會拿到 `"Hello, Odinite!"`，`two.js` 就能成功印出它。而 `greetingString` 與 `farewellString` 都是 IIFE 的區域變數；差別在於 `greetingString` 被明確 `return` 出來並指派給 `greeting`，所以在外面拿得到，而 `farewellString` 沒有被 return，因此在 `two.js` 裡完全存取不到。透過這種方式，我們可以自己決定要把哪些東西從一個檔案「曝露」給後面載入的檔案使用——這正是 IIFE 常被稱為「module pattern」的原因。有了 ESM 之後，這個特定用途就不再需要 IIFE 了。

### ES6 modules：每個檔案都有自己的私有範疇

ESM 給了我們更細緻的控制。**每個檔案預設都有自己的私有範疇（module scope，模組範疇）**，我們不只能選擇要從這個檔案 `export`（匯出）什麼，還能選擇要 `import`（匯入）什麼進來。換句話說，「有 export」不等於「別處就自動拿得到」；只有在另一個檔案裡明確 `import`，它才會在那個檔案生效。控制權完全在你手上。

!!! note "module scope 不是 global scope"
    使用 ESM 時，每個 module 都有自己的私有範疇，檔案之間靠 `import` / `export` 溝通。module 最外層的變數**不會**進到 global scope，別的檔案不能像以前那樣直接讀到它。

### import 與 export：named 與 default 兩種

那到底怎麼 import、怎麼 export？很有 JavaScript 風格地，我們不是只有一種，而是有兩種：**named（具名）** 與 **default（預設）**。它們做的事大致相同，只是語法與規則稍有不同，而且可以在同一個檔案裡混用。

> 提醒：接下來只是先展示語法，這些程式碼還無法直接跑，因為你還得把 script 以 module 的方式連結進 HTML。這部分會在後面的「Entry point」段落說明。

#### Named exports（具名匯出）

沿用剛剛的 `one.js` 與 `two.js`。要把東西做成 **named export**，有兩種寫法：把 `export` 關鍵字放在宣告前面，或是在檔案某處（通常是結尾）寫一個 `export { }`，大括號裡列出要匯出的名字。兩種寫法都可以，而且 named export 想匯出幾個都行。

寫在宣告前面：

```javascript
// one.js
export const greeting = "Hello, Odinite!";
export const farewell = "Bye bye, Odinite!";
```

或另外寫一行：

```javascript
// one.js
const greeting = "Hello, Odinite!";
const farewell = "Bye bye, Odinite!";
export { greeting, farewell };
```

接著在 `two.js` 匯入。因為 import 是可以挑的，如果只需要 `greeting`，就只匯入它；別的檔案要 `farewell`（或兩個都要）再自己匯入。**沒 import 就不能用**。named import 必須把要匯入的名字寫在 `{ }` 裡，並提供來源檔案的路徑（之後匯入第三方套件時，路徑可以換成套件名稱）：

```javascript
// two.js
import { greeting, farewell } from "./one.js";

console.log(greeting); // "Hello, Odinite!"
console.log(farewell); // "Bye bye, Odinite!"
```

注意：**模組路徑只能用單引號或雙引號的字串**，不能用 template string（樣板字串）。

!!! note "named 的 { } 不是物件字面值，也不是解構"
    named import / export 用的 `{ }` 是**專屬語法**，跟宣告 object literal（物件字面值）或 destructuring（解構）**毫無關係**。

    ```javascript
    export { greeting, farewell };
    import { greeting, farewell } from "./one.js";
    ```

    上面既不是在匯出一個含有 `greeting`、`farewell` 兩個 key 的物件，也不是在匯入時解構物件。它就只是 named import / export 的語法而已。

#### Default exports（預設匯出）

相對於 named export，**一個檔案只能有一個 default export**。用這種方式匯出的東西「沒有附帶名字」，所以你在別處匯入它時，可以自己決定要叫它什麼。

寫法一樣有兩種：在宣告前面加 `export default`，或在檔案結尾寫一行（這次**不用**大括號）。要注意的是，若採用行內（inline）寫法，`default` 關鍵字會**取代變數宣告**，也就是你直接匯出那個運算式（expression）：

```javascript
// one.js
export default "Hello, Odinite!";
```

或另外寫一行：

```javascript
// one.js
const greeting = "Hello, Odinite!";
export default greeting;
```

在 `two.js` 匯入這個 default export。因為它是 default，**名字由你自己取**——即使它在 `one.js` 裡叫 `greeting`，你在 `two.js` 也不必沿用。default import **不使用大括號**（大括號是給 named import 的）：

```javascript
// two.js
import helloOdinite from "./one.js";

console.log(helloOdinite); // "Hello, Odinite!"
```

#### 兩種混用

同一個檔案可以同時有 default 與 named export。至於「什麼時候該用哪一種」其實沒有公認的鐵則，唯一確定的是：一個檔案可以有多個 named export，但只能有一個 default export。當你只需要匯出「一樣東西」時，有人偏好 default，有人偏好單一 named，兩種都能用，看你或團隊的習慣。

把 greeting 做成 default、farewell 做成 named：

```javascript
// one.js
export default "Hello, Odinite!";
export const farewell = "Bye bye, Odinite!";
```

在 `two.js` 一次匯入兩者——default 的部分名字自取，named 的部分放進 `{ }`：

```javascript
// two.js
import greeting, { farewell } from "./one.js";

console.log(greeting); // "Hello, Odinite!"
console.log(farewell); // "Bye bye, Odinite!"
```

### Entry point（進入點）與 dependency graph（相依圖）

用 ESM 時，我們**不再需要**把每個 JavaScript 檔案照順序全部加進 HTML，只要連結一個檔案——也就是 **entry point（進入點）**：

```html
<script src="two.js" type="module"></script>
```

為什麼 entry point 是 `two.js`？因為在上面的例子裡，`two.js` 從 `one.js` 匯入變數，代表 `two.js` **相依於（depends on）** `one.js`，於是形成這樣的 **dependency graph（相依圖）**：

```text
importer  depends on  exporter
two.js <-------------- one.js
```

當瀏覽器以 module 載入 `two.js`，它會看到 `two.js` 相依 `one.js`，於是自動把 `one.js` 也載進來。反之，如果你把 `one.js` 當 entry point，瀏覽器發現它不相依任何檔案，就什麼都不做——`two.js` 的程式碼完全不會被用到，也不會印出任何東西。

如果再多一個 `three.js`，被 `two.js` 匯入，那 entry point 仍是 `two.js`，只是它現在同時相依 `one.js` 與 `three.js`：

```text
two.js <-------------- one.js
              └------- three.js
```

或者相依是「間接」的：`one.js` 匯入 `three.js`，此時 entry point 依舊是 `two.js`，它透過 `one.js` 間接相依 `three.js`：

```text
two.js <-------------- one.js <-------------- three.js
```

只需要一個 script 標籤，其餘相依檔案瀏覽器會自動幫我們處理。而且**不需要加 `defer`**，因為 `type="module"` 會自動把 script 的執行延後（defer）。

> 順帶一提：因為瀏覽器的安全限制，直接用 `file://` 開啟 HTML 檔是**無法載入 ES6 module** 的。請用本機伺服器，例如 VS Code 的 Live Preview 擴充套件。

### 進階語法：alias、namespace 與 side-effect import

原文的 Assignment 提到 MDN 上還有一些本課沒細講的「額外功能」，這裡補齊，答 knowledge check 之外也很實用。

**alias（別名）** — 用 `as` 幫匯出或匯入改名，避免命名衝突或取更清楚的名字：

```javascript
// 匯出時改名
export { greeting as hello };
// 匯入時改名
import { greeting as hello } from "./one.js";
```

**namespace import（命名空間匯入）** — 用 `import * as name` 把某檔案的**所有 named export** 收進一個物件，透過屬性存取：

```javascript
import * as strings from "./one.js";

console.log(strings.greeting); // "Hello, Odinite!"
console.log(strings.farewell); // "Bye bye, Odinite!"
```

**side-effect import（副作用匯入）** — `import "module"` 只執行該模組的程式碼、不匯入任何值，常用於 polyfill 或載入 CSS 之類只求「跑一次」的模組：

```javascript
import "./setup.js";
```

還有一個容易被忽略的重要特性：import 匯入的是**唯讀的 live binding（即時繫結）**。也就是說，匯出端之後若更新了那個值，匯入端會看到最新的值；但匯入端**不能重新指派**它（會拋 `TypeError`）。這跟「複製一份值過來」在直覺上不同，實務除錯時要記得。

### CommonJS：另一套 module 系統

一路上你可能撞見過 **CommonJS（CJS）**，它用的是 `require` 與 `module.exports`，而不是 `import` 與 `export`。CJS 是為 Node.js 設計的 module 系統，運作方式與 ESM 略有不同，而且**瀏覽器看不懂**。目前 Node.js 程式裡 CJS 仍很常見，不過近年 ESM 在 Node.js 也愈來愈受歡迎。由於現階段我們專注於在瀏覽器裡跑的程式，所以先深入 ESM；若你走 Full Stack JavaScript 路線，之後的 Node.js 課程會更詳細地談 CJS。

歸納 ESM 與 CJS 的主要差異：ESM 用 `import` / `export`、是靜態的（能在執行前就分析相依關係）、瀏覽器原生支援、匯入的是 live binding；CJS 用 `require` / `module.exports`、是動態的（`require` 可以寫在任何地方、可以是條件式）、瀏覽器不支援、匯入的是值的複本。

## 程式碼範例

以下是一個最小、可實際執行的 ESM 範例。用三個檔案示範 default、named 與 entry point 如何搭配。請放進同一個資料夾，並用本機伺服器（例如 VS Code 的 Live Preview）開啟 `index.html`。

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <!-- 只連結 entry point，type="module" 會自動 defer -->
    <script src="main.js" type="module"></script>
  </head>
  <body>
    <h1>ES6 模組示範</h1>
  </body>
</html>
```

```javascript
// math.js
// named export：可以有很多個
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

// default export：一個檔案只能有一個
export default function multiply(a, b) {
  return a * b;
}
```

```javascript
// main.js（entry point）
// default import 名字自取（這裡叫 multiply）；named import 要放進 { }
import multiply, { PI, add } from "./math.js";

console.log(PI);            // 3.14159
console.log(add(2, 3));     // 5
console.log(multiply(2, 3)); // 6
```

相依圖是 `main.js <── math.js`：瀏覽器載入 `main.js` 時，會看到它相依 `math.js`，於是自動把 `math.js` 也載進來。

## 常見陷阱

!!! warning "直接用 file:// 開啟 HTML 會載入失敗"
    因為瀏覽器的 CORS 安全限制，直接雙擊、以 `file://` 協定開啟 HTML 時，`type="module"` 的 script 會被擋下、無法載入，通常還會在 console 看到 CORS 相關錯誤。務必透過本機伺服器（VS Code Live Preview、`npx serve` 等）開啟頁面。

!!! warning "named import 的名字與路徑寫法都不能隨便"
    named import 的 `{ }` 內名字必須與匯出端的名字**完全一致**（要改名請用 `as` alias），它不是解構、寫錯名字不會幫你「就近配對」。此外，模組路徑（module specifier）只能是**單引號或雙引號字串**，不能用 template string；在瀏覽器裡相對路徑還必須寫出**副檔名** `.js`，不能像 Node.js 那樣省略。

!!! warning "default export 每個檔案只能有一個"
    一個檔案寫兩個 `export default` 會直接 `SyntaxError`。想匯出多樣東西時，用多個 named export；或一個 default 搭配多個 named。另外別忘了 default import **不加大括號**，named import **要加大括號**，兩者寫反是初學最常見的錯。

## 練習

原文的 Assignment 是閱讀 MDN 文件，把本課沒細講的「額外功能」補起來。改寫成以下步驟：

1. 讀 MDN 的 [export 文件](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)，重點看：`export { x as y }` 的 alias、`export * from "..."` 的 re-export（俗稱 barrel module，桶檔）。→ 驗收：能說出 barrel module 在名稱衝突時，那個名字會變成 `undefined`。
2. 讀 MDN 的 [import 文件](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)，重點看：namespace import（`import * as name`）、side-effect import（`import "module"`）、以及 live binding（唯讀、匯入端不能重新指派）。→ 驗收：能寫出 namespace import 並用屬性存取匯出的值。
3. 動手改寫本課開頭的 IIFE 範例：把它改成 `import` / `export`，HTML 只以 module 方式連結 entry point。→ 驗收：用本機伺服器開啟，console 正確印出預期字串，且原本私有的變數在其他檔案確實存取不到。

> 若你正在做 The Odin Project 對應的 project，實作步驟請回到[原文](https://www.theodinproject.com/lessons/javascript-es6-modules)照做。

自我檢核（對應 knowledge check）：

- ES6 module 之前，怎麼讓變數**不被**其他檔案存取？→ 用 IIFE 把變數包進函式範疇，不 return 出來。
- ES6 module 之前，怎麼把變數**曝露**給後面的檔案？→ 從 IIFE `return` 出來、指派給全域變數。
- 用 module 寫程式有哪些好處？→ 每個檔案有私有範疇、能明確控制 import / export、避免污染 global scope、方便拆檔管理。
- default 與 named export 差在哪？→ named 可多個、匯入名字須一致（或用 alias）、要加 `{ }`；default 每檔一個、匯入名字自取、不加 `{ }`。
- 什麼是 entry point？→ 相依圖的起點，唯一需要連結進 HTML 的檔案，瀏覽器會沿相依關係自動載入其餘檔案。
- 怎麼在 HTML 連結 module script？→ `<script src="..." type="module"></script>`（會自動 defer）。

## 原文與延伸資源

- 原文：[ES6 Modules](https://www.theodinproject.com/lessons/javascript-es6-modules)
- 本課引用：
  - MDN — [export statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
  - MDN — [import statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
  - MDN — [import 的模組名稱限制](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#module-name)
  - VS Code — [Live Preview 擴充套件](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server)

---

> 本講義改寫自 The Odin Project《ES6 Modules》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
