---
title: 專案：計算機
source_url: https://www.theodinproject.com/lessons/foundations-calculator
source_file: vendor/curriculum/foundations/javascript_basics/project_calculator.md
path: foundations
course: Foundations
order: 45
status: draft
generated: 2026-07-03
---

# 專案：計算機

> 改寫自 The Odin Project：[Project: Calculator](https://www.theodinproject.com/lessons/foundations-calculator)
> ｜Foundations › JavaScript Basics

## 核心概念

這是 Foundations 的最終專案：用 HTML、CSS 與 JavaScript 做一台可以在畫面上按的計算機。它把你前面學過的東西整合起來——用 function（函式）封裝運算、用 variable（變數）保存狀態、用 conditional（條件判斷）處理各種情況、用 DOM（Document Object Model，文件物件模型）操作把按鈕和顯示區串起來。難的不是任何單一功能，而是把它們組成一個「有狀態」的機器：計算機得記住你按了什麼、現在該做什麼。這一段會把每個步驟背後要用到的技巧講清楚，讓你不必翻其他頁面也能動手。

### 先講一個警告：不要用 eval() 或 new Function()

當你上網查「JavaScript 怎麼計算一串數學式」，很快會遇到 `eval()` 這個函式。它能把一個字串（例如 `"3 + 5"`）直接當成程式碼執行、算出結果，看起來一行就解決了整個專案。**千萬別用。** 原因有兩層：

- **安全性**：`eval()` 會用呼叫端的權限執行任意程式碼。若把使用者輸入丟進去，等於開了一道門讓惡意程式碼在你的頁面上跑（典型的 XSS 攻擊面），而且 direct eval（直接呼叫 `eval(...)`）還能讀寫周圍 scope（作用域）的區域變數。
- **效能**：`eval()` 逼引擎在執行期重新啟動解譯，繞過了現代 JS 引擎的最佳化，還會讓程式碼無法被壓縮（minify）。

同理，有些解法叫你回傳一個 `new Function()` 來評估字串——它和 `eval()` 有一樣的隱患，也不要用。更何況，這個專案的重點就是要你**自己寫運算邏輯**，把工作全交給 `eval()` 就失去練習的意義了。

### 四個運算函式與一個 operate 派發器

第一步很單純：替四則運算各寫一個 function，先在瀏覽器 console 裡測到對為止。

```js
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return a / b; }
```

接著寫一個 `operate(operator, a, b)`：它拿到一個 operator（運算子，例如 `"+"`）和兩個數字，用 conditional 判斷該呼叫上面哪個函式。這個「派發器」是整台計算機的運算核心——之後不管使用者按什麼，最後都會走到 `operate()` 這一步。把運算邏輯集中在這裡，其他程式碼只要負責「收集兩個數字和一個運算子」再交給它。

### 一次運算 = 一個數字、一個運算子、一個數字

TOP 提示你建立三個變數來表示一次運算的三個部分：第一個數字、運算子、第二個數字（例如 `3`、`+`、`5`）。這三個變數就是計算機的「記憶」。真正動手時你會發現，光靠這三個還不夠，通常還要一個變數記錄「使用者目前正在輸入的字串」（也就是顯示區上那串還沒定案的數字）。這些散落的變數合起來，就是計算機的 **state（狀態）**。想清楚要記哪些狀態，是這個專案最關鍵的一步。

### 蓋出 HTML／CSS 的計算機外觀

先把畫面做出來，暫時不用管功能：

- 一個**顯示區（display）**：放在最上方，先填一些假數字讓它看起來像計算機。
- 每個**數字鍵**（0–9）、每個**運算子鍵**（`+`、`-`、`*`、`/`）、以及**等號 `=`**，各一顆按鈕。
- 一顆 **clear（清除）** 鍵。

排版上，計算機的按鍵是規則的方格，用 CSS Grid 很順手（這裡不像 Etch-a-Sketch 那樣被限制只能用 Flexbox）。這一步只求「長得對」，按下去還不會有反應沒關係。

### 讓數字鍵更新顯示區

再來把數字鍵接上事件。替每顆數字鍵註冊 event listener（事件監聽器），按下時把該數字**接在**目前輸入字串的後面（字串串接，不是相加），再把結果寫回顯示區的文字。例如目前顯示 `12`，按下 `3`，就變成 `123`。這一步的成果，是「使用者按數字，畫面就跟著長」。

### 讓它真的會算：狀態機邏輯

這是整個專案最難的部分，也是 TOP 明講「花很久才想通也別氣餒」的地方。核心問題是：計算機要在什麼時機、用哪些值去呼叫 `operate()`？

想像使用者的動作是一連串按鍵，計算機依當下狀態決定反應：

1. 使用者先打數字 → 存進「第一個數字」，顯示在螢幕上。
2. 使用者按運算子 → 把剛剛那串數字定案成第一個數字、記下運算子，並標記「接下來輸入的是第二個數字」（下次按數字要清空顯示、重新開始打，而不是接在第一個數字後面）。
3. 使用者打第二串數字 → 存進「第二個數字」。
4. 使用者按 `=`（或按下一個運算子）→ 此時湊齊了「數字、運算子、數字」，呼叫 `operate()` 算出結果、顯示出來，並把結果存回「第一個數字」，好讓下一次運算能接著算。

把它想成一台有幾個狀態的小機器：目前是在「輸入第一個數字」、「等待第二個數字」、還是「已顯示結果」？每次按鍵都依狀態轉移。這正是前面那些狀態變數的用武之地。

### 那些一定會咬你的邊界情況

專案特別列出一串 gotchas，幾乎每個人都會踩到，值得先想好：

- **一次只算一對數字**：計算機不做「先乘除後加減」這種完整運算式解析。當使用者已經有一對數字又按下新的運算子時，要先把「前一對」算出來、把結果當成新的第一個數字，再繼續。例如 `12 + 7 - 1 =` 的過程是：按 `-` 時先算出 `12 + 7 = 19`，顯示 `19`；接著 `19 - 1 = 18`。
- **連按運算子**：使用者按了 `2`、`+`，又再按一次 `+`，不該被當成 `2 + 2 = 4`。連續按運算子時不做任何計算，只把「目前選定的運算子」更新成最後那一個。
- **結果出來後再按數字**：顯示結果後，按下一個數字應該**開始一次全新計算**（清掉結果重來），而不是把數字接在結果後面。
- **除以 0**：不要讓它算出 `Infinity` 或讓計算機崩潰。偵測到除數為 0 時，顯示一句俏皮的錯誤訊息就好。
- **小數過長要四捨五入**：`0.1 + 0.2` 這種浮點運算會跑出一長串小數，塞爆顯示區。用 `Number.prototype.toFixed()` 之類的方法限制小數位數（注意 `toFixed()` 回傳的是字串，且遇到大量位數會有浮點誤差）。
- **太早按 `=`**：還沒輸入完整的「數字、運算子、數字」就按等號，別讓它出錯。務必檢查三者都齊了才呼叫 `operate()`。
- **clear 要清乾淨**：按下清除後，所有狀態變數都要歸零，讓使用者真的從頭開始，不能殘留上一輪的數字或運算子。

### 進階挑戰（extra credit）

- **小數點鍵**：加一顆 `.`，讓使用者能自己輸入小數。重點是**不能讓他打出 `12.3.56`**——當顯示字串裡已經有一個 `.` 時，就讓 `.` 鍵失效。
- **退格鍵（backspace）**：按錯數字時，能刪掉最後一個字元。
- **鍵盤支援**：讓使用者直接用實體鍵盤打，而不只是滑鼠點按。

## 程式碼範例

以下是一份最小但可運作的實作，涵蓋基本需求：四則運算、顯示區、clear、一次算一對、連按運算子只取最後一個、除以 0 的俏皮訊息、以及結果的四捨五入。存成三個檔案，用瀏覽器開 `index.html` 即可。這裡刻意保留空間讓你自己補上 extra credit（小數點、退格、鍵盤）。

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="style.css" />
    <title>計算機</title>
  </head>
  <body>
    <div id="calculator">
      <div id="display">0</div>
      <div id="keys">
        <button class="op" data-op="clear">C</button>
        <button class="op" data-op="/">÷</button>
        <button class="op" data-op="*">×</button>
        <button class="op" data-op="-">−</button>

        <button class="num">7</button>
        <button class="num">8</button>
        <button class="num">9</button>
        <button class="op" data-op="+">+</button>

        <button class="num">4</button>
        <button class="num">5</button>
        <button class="num">6</button>
        <button class="op" data-op="=">=</button>

        <button class="num">1</button>
        <button class="num">2</button>
        <button class="num">3</button>
        <button class="num">0</button>
      </div>
    </div>
    <script src="script.js"></script>
  </body>
</html>
```

```css
/* style.css：用 Grid 排出規則的按鍵方格 */
#calculator {
  width: 260px;
  margin: 40px auto;
  border: 1px solid #333;
}

#display {
  height: 60px;
  padding: 0 12px;
  font-size: 28px;
  text-align: right;
  line-height: 60px;
  background: #222;
  color: #fff;
  overflow: hidden; /* 數字太長時不撐破外框 */
}

#keys {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 四欄，工整方格 */
}

#keys button {
  height: 56px;
  font-size: 20px;
  cursor: pointer;
}
```

```js
// script.js
// ---- 運算核心 ----
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return a / b; }

function operate(operator, a, b) {
  switch (operator) {
    case "+": return add(a, b);
    case "-": return subtract(a, b);
    case "*": return multiply(a, b);
    case "/":
      // 除以 0：回傳一個哨兵字串，讓外層顯示俏皮訊息
      return b === 0 ? "別鬧了 🙃" : divide(a, b);
  }
}

// ---- 狀態（計算機的記憶）----
let firstNumber = null;   // 第一個數字
let operator = null;      // 選定的運算子
let current = "0";        // 目前正在輸入的字串
let justEvaluated = false; // 剛按過 =，下次按數字要重來

const display = document.getElementById("display");

function updateDisplay() {
  display.textContent = current;
}

// 把過長小數四捨五入，避免撐爆顯示區
function roundResult(n) {
  if (typeof n !== "number") return n; // 錯誤訊息字串直接放行
  return Math.round(n * 1000) / 1000;   // 最多三位小數
}

// ---- 按數字 ----
function inputDigit(digit) {
  if (justEvaluated) {
    // 結果出來後按數字：開始全新計算
    current = digit;
    firstNumber = null;
    operator = null;
    justEvaluated = false;
  } else {
    // 否則接在後面（避免出現 007 這種前導 0）
    current = current === "0" ? digit : current + digit;
  }
  updateDisplay();
}

// ---- 按運算子 ----
function chooseOperator(nextOp) {
  if (operator !== null && !justEvaluated) {
    // 已經有一對數字了，先把前一對算出來
    evaluate();
  }
  firstNumber = Number(current);
  operator = nextOp;          // 連按運算子時，這行只是換成最後一個
  justEvaluated = false;
  current = "0";              // 準備輸入第二個數字（下次按數字會蓋掉這個 0）
}

// ---- 按等號 ----
function evaluate() {
  // 太早按 =：缺運算子或缺第一個數字，什麼都不做
  if (operator === null || firstNumber === null) return;

  const result = operate(operator, firstNumber, Number(current));
  current = String(roundResult(result));
  firstNumber = null;
  operator = null;
  justEvaluated = true;
  updateDisplay();
}

// ---- clear：把所有狀態歸零 ----
function clearAll() {
  firstNumber = null;
  operator = null;
  current = "0";
  justEvaluated = false;
  updateDisplay();
}

// ---- 把按鈕接上邏輯 ----
document.querySelectorAll(".num").forEach((btn) => {
  btn.addEventListener("click", () => inputDigit(btn.textContent));
});

document.querySelectorAll(".op").forEach((btn) => {
  btn.addEventListener("click", () => {
    const op = btn.dataset.op;
    if (op === "clear") clearAll();
    else if (op === "=") evaluate();
    else chooseOperator(op);
  });
});
```

留意 `chooseOperator` 裡的幾個關鍵設計：只有在「已有運算子且不是剛算完」時才先 `evaluate()`，這同時處理了「一次算一對」（`12 + 7 - 1`）與「連按運算子只取最後一個」兩種情況——連按時 `current` 還是那個 `"0"`，不會湊成新的一對去計算，只會把 `operator` 換掉。

## 常見陷阱

!!! warning "用 eval() 或 new Function() 走捷徑"
    這兩者都能把字串當程式碼執行，看似一行解決問題，但都有嚴重的安全（可執行惡意輸入）與效能隱患，而且直接跳過了本專案要你練的運算邏輯。老實自己寫 `add`／`subtract`／`multiply`／`divide` 和 `operate`。

!!! warning "計算機想「一次算整串」"
    這台計算機**不做**先乘除後加減的完整運算式解析，一次只處理一對數字。使用者已有一對數字又按新運算子時，要先把前一對算出、把結果當成新的第一個數字。別想著一次解析 `12 + 7 - 1` 整串。

!!! warning "連按運算子被當成一次運算"
    按 `2`、`+`、`+`，不該算成 `2 + 2 = 4`。連續按運算子時不做任何計算，只把選定的運算子更新成最後按的那一個。範例程式靠「第二個數字尚未輸入（`current` 仍是預設值）」來避免誤算。

!!! warning "結果出來後按數字卻接在後面"
    顯示結果後再按數字，應該開始全新計算、清掉舊結果，而不是把數字接在結果字串後面。用一個像 `justEvaluated` 的旗標記住「剛按過 =」，下次按數字時重置狀態。

!!! warning "除以 0 讓計算機壞掉"
    JavaScript 裡 `n / 0` 會得到 `Infinity`，直接顯示很難看。偵測除數為 0，回傳一句俏皮訊息，別讓它崩潰或顯示 `Infinity`。

!!! warning "浮點小數塞爆顯示區"
    `0.1 + 0.2` 會算出 `0.30000000000000004`。結果要先四捨五入再顯示（例如 `Math.round(n * 1000) / 1000` 或 `toFixed()`）。注意 `toFixed()` 回傳的是**字串**不是數字，串接或再運算前要留意型別。

!!! warning "clear 沒清乾淨"
    按下清除要把**每一個**狀態變數（第一個數字、運算子、目前輸入、旗標）都歸零，否則上一輪的殘留值會在下一次運算冒出來。

## 練習

完整且會更新的專案需求以原文為準：[Project: Calculator](https://www.theodinproject.com/lessons/foundations-calculator)。步驟大致如下（記得 commit early、commit often，可回顧 [Commit Messages 一課](https://www.theodinproject.com/lessons/foundations-commit-messages)）：

1. 建立 `add`、`subtract`、`multiply`、`divide` 四個 function，先在瀏覽器 console 測到正確。
2. 用三個變數表示一次運算的「第一個數字、運算子、第二個數字」；動手後你會發現通常還需要一個變數記錄「目前正在輸入的字串」。
3. 寫 `operate(operator, a, b)`，依運算子呼叫上面四個函式之一。
4. 用 HTML／CSS 蓋出計算機外觀：數字鍵、運算子鍵、等號、clear 鍵，以及一個顯示區（先填假數字讓它看起來對）。此時不用管功能。
5. 讓數字鍵更新「目前輸入」變數，並同步更新顯示區。
6. 讓它真的會算：儲存使用者輸入的第一、第二個數字，按 `=` 時依選定的運算子呼叫 `operate()`，把結果寫回顯示區。這是最難的一步，慢慢想通狀態怎麼流轉。
7. 逐一處理 gotchas：一次只算一對、連按運算子只取最後一個、結果後按數字重新開始、除以 0 給俏皮訊息、長小數四捨五入、太早按 `=` 不出錯、clear 清乾淨。
8. 把成品推上 GitHub。

進階（extra credit，可選）：

1. 加一顆 `.` 小數點鍵，並在已有小數點時停用它，避免 `12.3.56`。
2. 加一顆退格鍵，刪掉最後一個輸入字元。
3. 加上鍵盤支援。

## 原文與延伸資源

- 原文：[Project: Calculator](https://www.theodinproject.com/lessons/foundations-calculator)
- 本課引用：
  - [MDN：eval()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)——說明為何絕不該用 `eval()`（安全與效能）。
  - [MDN：Number.prototype.toFixed()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed)——四捨五入小數、避免顯示溢位；注意回傳字串。
  - [MDN：Document.querySelectorAll()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)——一次選取所有數字鍵／運算子鍵來掛事件。
  - [MDN：EventTarget.addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)——替按鈕註冊 click 事件。
  - [Stack Overflow：eval() 與 new Function() 的隱患](https://stackoverflow.com/questions/4599857/are-eval-and-new-function-the-same-thing)——為何 `new Function()` 也不該用。
  - [線上計算機（calculatorsoup）](https://www.calculatorsoup.com/calculators/math/basic.php)——輸入 `12 + 7 - 1 =` 觀察「一次只算一對」的正確行為。

---

> 本講義改寫自 The Odin Project《Project: Calculator》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
