---
title: 測試基礎
source_url: https://www.theodinproject.com/lessons/node-path-javascript-testing-basics
source_file: vendor/curriculum/javascript/testing_javascript/testing_basics.md
path: full-stack-javascript
course: JavaScript
order: 23
status: draft
generated: 2026-07-03
---

# 測試基礎

> 改寫自 The Odin Project：[Testing Basics](https://www.theodinproject.com/lessons/node-path-javascript-testing-basics)
> ｜Full Stack JavaScript › JavaScript › Testing JavaScript

## 核心概念

### 什麼是自動化測試

到目前為止，你驗證程式碼是否正確的方法，多半是打開瀏覽器 console、`console.log` 一些值、然後用眼睛看結果對不對。這種做法叫做**手動測試（manual testing）**。它的問題是：每次改動程式碼，你都得重新手動跑一遍所有情境，一旦專案變大，這件事會累到沒有人願意做，於是 bug 就悄悄溜進了正式環境。

**自動化測試（automated testing）**的核心想法是：把「我期望這段程式碼會產生什麼結果」寫成另一段程式碼。這段驗證用的程式碼就叫**測試（test）**。之後你只要跑一個指令，電腦就會在幾秒內幫你檢查數十、數百個情境，並明確告訴你哪一項通過、哪一項失敗。測試等於是你為程式碼寫下的、可以自動執行的規格說明書。

### TDD：測試驅動開發

**TDD（Test Driven Development，測試驅動開發）**是一種寫程式的流程，特別之處在於：你**先寫測試，再寫實作**。聽起來很反直覺，因為你要測試的東西還不存在，但這正是它的威力所在。

TDD 的節奏通常被稱為「紅—綠—重構（Red-Green-Refactor）」循環：

1. **紅（Red）**：先寫一個描述「我希望這個功能怎麼運作」的測試。此時功能還沒實作，所以測試一定會**失敗**（測試框架通常用紅色顯示）。這一步強迫你在動手前先想清楚：這個函式的輸入是什麼？輸出應該是什麼？
2. **綠（Green）**：寫出**剛好能讓測試通過**的最少程式碼（顯示綠色）。不求漂亮、不求完整，只求先讓它通過。
3. **重構（Refactor）**：在測試保護下，安心整理程式碼——改名、拆函式、去除重複。因為只要有任何改動弄壞了原本的行為，測試會立刻變紅提醒你。

接著再回到步驟 1，為下一個小功能寫測試，如此循環推進。

為什麼要這樣做？TDD 帶來幾個實際好處：

- **強迫你先設計介面**：先寫測試，等於先站在「使用者」的角度決定函式該怎麼被呼叫，設計往往更清晰。
- **給你重構的膽量**：有一整組測試守門，你可以大膽修改內部實作而不怕破壞既有功能。這種安全感是大型專案能持續演進的關鍵。
- **測試本身就是文件**：一份寫得好的測試，讀起來就是在描述「這段程式碼在各種情況下該有什麼行為」，比註解更不會過時。
- **逼你把問題拆小**：你沒辦法替一個模糊的大功能寫測試，這會逼你把它切成一個個「輸入 → 輸出」明確的小單位。

這一課要傳達的最重要觀念是：**寫測試的重點不在語法，而在思維**。真正關鍵的是知道**為什麼**要測、以及該**測什麼**，至於怎麼寫（用哪個框架、哪個函式）反而是最容易查到、最不重要的部分。

### 該測什麼：測行為，不測實作

初學者最常見的誤區，是去測試「程式碼內部怎麼做」。正確的做法是測試**行為（behaviour）**——也就是「給定某個輸入，這個函式對外表現出的結果是什麼」，而不去管它內部用了 `for` 迴圈還是 `map`。

舉例來說，如果你有一個 `capitalize` 函式，你該測的是「輸入 `"hello"` 會得到 `"Hello"`」，而不是它內部呼叫了哪些字串方法。這樣做的好處是：日後你改寫內部實作（例如換一種更快的演算法），只要對外行為不變，測試就仍然通過，測試不會變成你重構時的絆腳石。

這一課聚焦在最基礎的一種測試——**單元測試（unit test）**，也就是針對單一、獨立的函式或模組（module）進行的測試。它是測試金字塔最底層、數量最多、跑最快的一種。

### 認識 Jest

JavaScript 生態有許多測試框架：[Mocha](https://mochajs.org/)、[Jasmine](https://jasmine.github.io/)、[Tape](https://github.com/substack/tape)、[Jest](https://jestjs.io/) 等等。好消息是它們的基本語法幾乎一模一樣，學會一個，其他都能快速上手。本課選用 **Jest**，因為它文件清楚、設定簡單、且內建了斷言（assertion）與測試執行器，開箱即用不必東拼西湊。

一個 Jest 測試由三個部分組成，這也是所有測試框架共通的結構：

- **`test(description, callback)`**：定義一個測試案例。第一個參數是一段人類看得懂的描述（例如 `'adds 1 + 2 to equal 3'`），第二個參數是實際執行檢查的函式。（`it` 是 `test` 的別名，兩者完全等價。）
- **`expect(value)`**：包住「你實際得到的值」，回傳一個帶有各種比對方法的物件。
- **matcher（比對器）**：接在 `expect(...)` 後面的方法，例如 `.toBe(3)`，用來宣告「我期望的結果」。`expect(實際值).matcher(期望值)` 連起來讀，就是一句完整的斷言。

### 安裝與執行

在專案資料夾裡，把 Jest 安裝成開發相依套件（development dependency）：

```bash
# --save-dev 表示這是開發時才用到的工具，不會被打包進正式產品
npm install --save-dev jest
```

接著打開 `package.json`，在 `scripts` 裡加上 `test` 指令：

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

之後在終端機執行 `npm test`，Jest 就會自動找出專案裡所有檔名符合 `*.test.js`（或放在 `__tests__` 資料夾裡）的檔案並執行它們。

### 常用的 matcher

`expect` 後面能接的 matcher 非常多，以下是最常用的幾類，涵蓋了日常九成以上的需求：

- **精確相等**：`toBe(value)` 用 `Object.is` 做比較，適合數字、字串、布林這類基本型別（primitive）。
- **深度相等**：`toEqual(value)` 會**遞迴（recursion）**比較物件或陣列的每一個欄位，比較「內容是否相同」而非「是否為同一個參考」。
- **真假值**：`toBeNull()`、`toBeUndefined()`、`toBeDefined()`、`toBeTruthy()`（`if` 會當成真的值）、`toBeFalsy()`（`if` 會當成假的值）。
- **數字大小**：`toBeGreaterThan(n)`、`toBeGreaterThanOrEqual(n)`、`toBeLessThan(n)`、`toBeLessThanOrEqual(n)`；浮點數請用 `toBeCloseTo(n)`。
- **字串**：`toMatch(regexp)` 用正規表達式（regular expression）比對字串內容。
- **陣列與可迭代物件**：`toContain(item)` 檢查是否包含某個元素。
- **例外**：`toThrow()` 檢查某個函式呼叫是否會拋出錯誤。
- **反向修飾詞 `.not`**：接在任何 matcher 前面，測試「相反」的情況，例如 `expect(a + b).not.toBe(0)`。

## 程式碼範例

最小的一個完整範例。先寫一個被測試的函式 `sum.js`：

```javascript
// sum.js
function sum(a, b) {
  return a + b;
}

// 用 CommonJS 匯出，讓測試檔可以 require 進來
module.exports = sum;
```

再寫對應的測試檔 `sum.test.js`（檔名含 `.test.js`，Jest 才會認得）：

```javascript
// sum.test.js
const sum = require('./sum');

// test(描述, 檢查函式)
test('adds 1 + 2 to equal 3', () => {
  // 讀作：我期望 sum(1, 2) 的結果 toBe（等於）3
  expect(sum(1, 2)).toBe(3);
});
```

執行 `npm test`，通過時會看到類似輸出：

```text
PASS  ./sum.test.js
  ✓ adds 1 + 2 to equal 3 (5 ms)
```

各種 matcher 的實際用法：

```javascript
// toBe：基本型別用它就對了
test('二加二等於四', () => {
  expect(2 + 2).toBe(4);
});

// toEqual：比較物件內容，不看是不是同一個參考
test('物件內容相同', () => {
  const data = { one: 1 };
  data.two = 2;
  expect(data).toEqual({ one: 1, two: 2 });
});

// toBeCloseTo：浮點數運算有誤差，不能用 toBe
test('0.1 + 0.2 約等於 0.3', () => {
  expect(0.1 + 0.2).toBeCloseTo(0.3);
});

// toContain：陣列是否含有某元素
test('購物清單裡有牛奶', () => {
  const shoppingList = ['尿布', '衛生紙', '牛奶'];
  expect(shoppingList).toContain('牛奶');
});

// toThrow：注意要傳「一個函式」，而不是直接呼叫它
function compileAndroidCode() {
  throw new Error('你用錯 JDK 了！');
}

test('編譯 Android 會如預期地拋錯', () => {
  expect(() => compileAndroidCode()).toThrow();
  expect(() => compileAndroidCode()).toThrow(/JDK/);
});

// .not：測試相反情況
test('兩個正數相加不會是零', () => {
  expect(3 + 4).not.toBe(0);
});
```

## 常見陷阱

!!! warning "`toBe` 用在物件上一定失敗，物件請用 `toEqual`"
    `toBe` 底層是 `Object.is`，比較的是「是不是同一個參考（reference）」。兩個內容一模一樣、卻各自 `new` 出來的物件，並不是同一個參考，所以 `expect({a: 1}).toBe({a: 1})` 會**失敗**。要比較物件或陣列的**內容**，一律改用會遞迴逐欄位比對的 `toEqual`。

!!! warning "浮點數不要用 `toBe`"
    因為 IEEE 754 的表示誤差，`0.1 + 0.2` 實際上等於 `0.30000000000000004`，用 `expect(0.1 + 0.2).toBe(0.3)` 會失敗。只要牽涉小數運算，就改用 `toBeCloseTo`，它會忽略微小的尾差。

!!! warning "`toThrow` 要傳函式本身，不能傳呼叫結果"
    正確寫法是 `expect(() => risky()).toThrow()`，用箭頭函式把呼叫「包起來」交給 Jest 去執行。如果寫成 `expect(risky()).toThrow()`，`risky()` 會在 `expect` 收到它之前就先執行並拋錯，測試會直接崩潰而不是被 Jest 捕捉。

!!! warning "Jest 預設不吃 ES Modules（`import`/`export`）"
    Jest 官方教學使用的是 CommonJS 語法（`require`／`module.exports`），因為現行版本預設不認得 ESM。若你想在測試裡用 `import`／`export`，需要額外設定 Babel：先 `npm install --save-dev @babel/preset-env@^7`，再於專案根目錄建立 `babel.config.js`，內容為 `export default { presets: [["@babel/preset-env", { targets: { node: "current" } }]] };`。Babel 會在記憶體中把 ESM 轉成 CJS 後再交給 Jest，不會動到你的原始檔。

!!! warning "搭配 ESLint 時記得匯入全域變數"
    Jest 會提供 `test`、`expect` 這些全域變數，但 ESLint 不知道它們的存在，會報「未定義」的 lint 錯誤。若專案使用 ESLint，請在測試檔頂端明確 `import { test, expect } from '@jest/globals'`，或在 ESLint 設定裡開啟 Jest 環境。

## 練習

1. 閱讀 [TDD 的基本流程與好處](https://web.archive.org/web/20211123190134/http://godswillokwara.com/index.php/2016/09/09/the-importance-of-test-driven-development/)，把「先寫測試、再寫實作」的循環在腦中走過一遍。
2. 觀看 [Unit Testing in JavaScript 影片系列](https://www.youtube.com/playlist?list=PL0zVEGEvSaeF_zoW9o66wa_UCNE3a7BEr)至少前三集，建立對單元測試的直覺。
3. 跟著 [Jest 的 Getting Started 教學](https://jestjs.io/docs/getting-started)動手做，做到「Additional Configuration」那一節之前即可：新建一個資料夾、`npm install --save-dev jest`、在 `package.json` 加上 `test` script，然後親手把上面的 `sum.js` 與 `sum.test.js` 寫出來並 `npm test` 跑通。若你想用 `import`／`export`，依「常見陷阱」裡的步驟設定好 Babel。
4. 閱讀並跟著操作 Jest 官網的 [Using Matchers](https://jestjs.io/docs/using-matchers)，實際把 `toEqual`、`toContain`、`toThrow`、`.not` 等 matcher 各寫一個測試試試看。
5. 閱讀 [這篇談 TDD 的價值與實作](https://jrsinclair.com/articles/2016/one-weird-trick-that-will-change-the-way-you-code-forever-javascript-tdd/)的文章，它有很好的實例示範如何在真實情境套用 TDD。

完成後試著回答本課的 knowledge check：TDD 有哪些好處？有哪些常見的 Jest matcher？如果答不出來，回到上面對應的段落複習。

## 原文與延伸資源

- 原文：[Testing Basics](https://www.theodinproject.com/lessons/node-path-javascript-testing-basics)
- 本課引用：
    - [Jest — Getting Started](https://jestjs.io/docs/getting-started)（安裝、設定與第一個測試）
    - [Jest — Using Matchers](https://jestjs.io/docs/using-matchers)（常用 matcher 一覽）
    - [The Importance of Test Driven Development](https://web.archive.org/web/20211123190134/http://godswillokwara.com/index.php/2016/09/09/the-importance-of-test-driven-development/)（TDD 的流程與好處）
    - [One Weird Trick That Will Change the Way You Code Forever](https://jrsinclair.com/articles/2016/one-weird-trick-that-will-change-the-way-you-code-forever-javascript-tdd/)（TDD 的價值與實例）

---

> 本講義改寫自 The Odin Project《Testing Basics》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
