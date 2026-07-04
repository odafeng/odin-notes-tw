---
title: 乾淨的程式碼（Clean Code）
source_url: https://www.theodinproject.com/lessons/foundations-clean-code
source_file: vendor/curriculum/foundations/javascript_basics/clean_code.md
path: foundations
course: Foundations
order: 39
generated: 2026-07-03
---

# 乾淨的程式碼（Clean Code）

> 改寫自 The Odin Project：[Clean Code](https://www.theodinproject.com/lessons/foundations-clean-code)
> ｜Foundations › JavaScript Basics

## 核心概念

很多人以為工程師的工作大部分是「寫」程式碼，但實際上，我們花在「讀」程式碼的時間往往更多：讀隊友寫的、讀已經離職的人留下來的、甚至讀你自己兩週前寫、現在卻幾乎想不起來的程式碼。既然讀的時間這麼多，讓程式碼「好讀」就成了一種投資報酬率極高的習慣。

這就是乾淨的程式碼（Clean Code）要解決的問題。它不是一套非遵守不可的鐵律，而是一組能持續提升可讀性（readability）與可維護性（maintainability）的指引。重點先說清楚：沒有人能一直寫出完美的程式碼，連資深工程師都會寫出混亂的東西。目標是「逐步改善」，不是「一次到位的完美」。

### 一眼看懂好讀與難讀的差別

先看兩段功能完全一樣的程式碼。難讀的版本：

```javascript
const x= function (z){
   const w = "Hello ";
return w +  z

 }
```

再看好讀的版本：

```javascript
const generateUserGreeting = function (name) {
  const greeting = "Hello ";
  return greeting + name;
};
```

兩者做的事一模一樣，但第二段明顯好懂太多。差別在哪？第一段用了單字母的 variable（變數）名稱 `x`、`z`、`w`，縮排（indentation）與空白也雜亂不一致，看起來像謎題。第二段的 function（函式）叫 `generateUserGreeting`、參數叫 `name`、變數叫 `greeting`，就算你還沒細看內容，也能「用猜的」大致知道它在做什麼，而且縮排整齊、風格一致。

單字母命名不是絕對禁止：在 loop（迴圈）的計數器或簡短的 callback function（回呼函式）裡，用 `i`、`x` 這種名字是常見且可接受的。但在其他地方，請避免。

### camelCase 命名慣例

JavaScript 最常見的命名慣例是 camelCase（駝峰式命名）。它讓多個單字連在一起而不用空格或標點：第一個單字全小寫，之後每個單字的字首大寫，例如 `generateUserGreeting`、`setTimeout`。本課的變數與函式幾乎都用 camelCase。不同語言可能有不同慣例，但在 JavaScript 圈子裡，跟著 camelCase 走準沒錯。

要記住：**慣例只是慣例**。每個團隊、每個組織的具體做法可能略有不同，沒有哪一套是絕對正確的。真正重要的是它們的共同目的——提升可讀性與可維護性。在你需要遵守某套特定規範之前，先挑一種合理的做法，然後「保持一致」。

### 命名要有意義

命名是乾淨程式碼裡最關鍵的一環，可以拆成幾個重點：

**名稱要有描述性。** `generateUserGreeting` 這個名字清楚說明了函式的職責；`x`、`z`、`w` 則什麼都沒說。想像你要跟同事口頭討論那段爛程式碼：「那個 x 函式裡的 z 加上 w……」光是講出來就很痛苦。

**詞彙要一致。** 同類型的東西，命名系統最好統一。看看這組來自遊戲的函式：

```javascript
// 一致的命名：全部都是「get 某個東西」
function getPlayerScore() {}
function getPlayerName() {}
function getPlayerTag() {}
```

再看不一致的版本：

```javascript
// 不一致的命名
function getUserScore() {}
function fetchPlayerName() {}
function retrievePlayer1Tag() {}
```

後者用了 `get`、`fetch`、`retrieve` 三個動詞。它們意思相近，但讀的人會忍不住猜：「是不是刻意用不同動詞、代表不同行為？」而 `User`、`Player`、`Player1` 又有什麼差別？如果沒有差別，就該統一用同一個名字（例如 `Player`）。一致性帶來可預測性，而可預測讓程式碼好懂。

**變數用名詞、函式用動詞。** 變數通常代表「東西」（字串、數字、布林值……），所以最好以名詞或形容詞開頭；函式代表「動作」，所以最好以動詞開頭。

```javascript
// 建議：變數以名詞／形容詞開頭
const numberOfThings = 10;
const myName = "Thor";
const selected = true;

// 不建議：以動詞開頭，容易被誤認為函式
const getCount = 10;

// 建議：函式以動詞開頭
function getCount() {
  return numberOfThings;
}

// 不建議：myName 不代表任何動作，卻寫成函式
function myName() {
  return "Thor";
}
```

### 讓名稱可搜尋、可立即理解

有時我們會偷懶直接寫死一個「魔術數字（magic number）」或魔術字串——也就是沒有名字、看不出意義的裸值。例如：

```javascript
setTimeout(stopTimer, 3600000);
```

`3600000` 到底代表多久？就算你知道 JavaScript 的時間單位是毫秒（millisecond），你大概還是得拿計算機算一下才知道那是幾分鐘。把它抽成一個有描述性的常數，就清楚多了：

```javascript
const ONE_HOUR = 3600000; // 也可以寫成 60 * 60 * 1000，更能看出怎麼算出來的

setTimeout(stopTimer, ONE_HOUR);
```

你可能會問：不是說好用 camelCase 嗎，怎麼這裡全大寫？當程式設計師「確定」某個值是真正不會改變的常數，特別是它代表某種固定概念（像「一小時的毫秒數」）時，慣例是用全大寫加底線（`ONE_HOUR`）。一小時的毫秒數永遠不變，所以這裡很適合。再次強調，這只是慣例，不是每個人都會這樣做。

### 縮排與行長度

縮排要用空格還是 tab，是工程師之間著名的「聖戰」。真相是：**沒有哪一種比較高級，一致才是重點。** 選一種，然後從頭到尾都用同一種。

行長度（line length）也一樣：幾乎所有風格指南（style guide）都建議限制每行長度，通常以約 80 個字元為界。許多編輯器會在畫面上畫一條參考線提示你越界了。當你需要手動斷行時，最好在運算子（operator）或逗號「之後」斷開。以下都是可接受的續行格式：

```javascript
// 這一行有點太長
let total = something + somethingElse + anotherThing + howManyTacos + oneMore;

// 可以這樣排
let total =
  something +
  somethingElse +
  anotherThing +
  howManyTacos +
  oneMore;

// 或這樣排
let total = something + somethingElse + anotherThing +
            howManyTacos + oneMore;
```

沒有哪種格式絕對正確，挑一個對你合理的，然後保持一致。

### 分號

在 JavaScript 裡分號（semicolon）大多是可省略的，因為直譯器（interpreter）會自動幫你補上（這叫 ASI，自動分號插入）。但這個機制在某些情況會出錯，導致難以察覺的 bug（程式錯誤）。所以建議養成加分號的習慣。加或不加，一樣——保持一致最重要。

### 關於註解

註解（comment）是好工具，但跟所有好工具一樣，用錯了反而礙事。初學者常犯的毛病是「什麼都想註解」，把每一行程式碼在做什麼都寫成一段中文。這通常不是好做法。以下是幾個常見誤區與原因。

**不要用註解記錄變更歷史——那是 git 的工作。** 有些人會在檔案裡寫一堆修改日誌：

```javascript
/**
 * 2023-01-10: 移除造成混淆的多餘程式碼 (RM)
 * 2023-03-05: 簡化程式碼 (JP)
 * 2023-06-22: 新增合併數值的函式 (JR)
 */
```

你已經有版本控制工具 git 了。維護這種註解會變成負擔，而且永遠記不完整、只會讓檔案變得臃腫。用 `git log` 就能整齊地看到所有變更。同理，不再使用的舊程式碼直接刪掉就好，需要時再從 git 歷史找回來，不要留一堆被註解掉的殭屍程式碼：

```javascript
theFunctionInUse();
// oldFunction();
// evenOlderUselessFunction();
```

（測試時暫時把某段程式碼註解掉當然沒問題，但一旦確定不需要，就刪掉。）

**說明「為什麼」，而不是「怎麼做」。** 好的註解解釋程式碼背後的「原因」，而不是把程式碼用白話重述一遍。假設我們要從字串中取出方括號 `[ ]` 裡的文字。第一種寫法，註解只是把程式碼翻譯了一遍：

```javascript
// 取出文字的函式
function extractText(s) {
  // 回傳從 "[" 之後、到 "]" 之間的字串
  return s.substring(s.indexOf("[") + 1, s.indexOf("]"));
}
```

這些註解只是重複程式碼已經說過的話，是多餘的。稍微好一點的是把「目的」講清楚：

```javascript
// 取出方括號內的文字（不含括號本身）
function extractText(s) {
  return s.substring(s.indexOf("[") + 1, s.indexOf("]"));
}
```

但更好的做法是讓程式碼自己說話，連註解都不需要：

```javascript
function extractTextWithinBrackets(text) {
  const bracketTextStart = text.indexOf("[") + 1;
  const bracketTextEnd = text.indexOf("]");
  return text.substring(bracketTextStart, bracketTextEnd);
}
```

用有描述性的函式名與變數名，就消除了對註解的需求。

**但這不代表好程式碼就該完全沒有註解。** 有時一句恰到好處的註解價值連城：

```javascript
function calculateBMI(height, weight) {
  // BMI 公式：體重（公斤）除以身高（公尺）的平方
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi;
}
```

這則註解用白話提醒讀者 BMI 是怎麼算的，讓人一看就懂為什麼身高要從公分換算成公尺、後面那串計算又在做什麼。命名已經不錯，但這句註解補上了額外的清晰度。正如一句被廣泛引用的話：「程式碼只能告訴你程式『怎麼』運作；註解才能告訴你它『為什麼』這樣運作。」註解最寶貴的時刻，往往是解釋某段不直觀的程式碼為何必要，或說明某個決策背後的權衡。

最後回到開頭的提醒：別追求「完美乾淨」，那只會帶來挫折。寫出「義大利麵式（spaghetti）」的混亂程式碼是難免的，每個人都會。把這些原則放在心上，隨著練習累積，你的程式碼自然會愈來愈乾淨。學會寫乾淨程式碼是一段持續改善的旅程，會一直延續到你完成 The Odin Project 之後。

> 好的程式碼來自經驗，而經驗來自那些不太好的程式碼。

## 程式碼範例

下面用一個小範例，把「魔術數字、命名、註解說明為什麼」這幾個原則整合起來，示範從「難讀」重構（refactor）到「好讀」的過程。

```javascript
// 難讀版：magic number 到處都是，名稱看不出意義
function f(p) {
  return p * 0.9 + p * 0.9 * 0.05;
}

console.log(f(1000)); // 945，但為什麼？讀的人只能用猜的
```

重構後：

```javascript
// 好讀版：常數有名字，函式與變數說明了意圖
const MEMBER_DISCOUNT = 0.9; // 會員打九折
const SALES_TAX_RATE = 0.05; // 營業稅 5%

function calculateMemberTotal(price) {
  // 先套會員折扣，再對折扣後的金額加上營業稅
  const discountedPrice = price * MEMBER_DISCOUNT;
  const tax = discountedPrice * SALES_TAX_RATE;
  return discountedPrice + tax;
}

console.log(calculateMemberTotal(1000)); // 945，意圖一目了然
```

重構做了三件事：把 `0.9` 與 `0.05` 抽成有名字的常數，讓「魔術數字」變得可搜尋、可理解；把函式與變數改成有描述性的名稱；並用一句註解解釋「為什麼是先折扣再課稅」這個順序上的決策——這正是程式碼本身難以表達的「為什麼」。

## 常見陷阱

!!! warning "把註解當成 git 用"
    在程式碼裡手寫修改日誌、或把舊程式碼註解掉「以防萬一」，都是常見誤區。變更歷史交給 `git log`，不需要的程式碼直接刪除。留著這些只會讓檔案臃腫、資訊還永遠不完整。

!!! warning "註解只是把程式碼翻譯一遍"
    如果一則註解只是用白話重述下一行在做什麼（例如 `// 回傳 x 加 1` 配 `return x + 1`），它就是多餘的。優先改善命名讓程式碼自己說話；真的要寫註解，就寫「為什麼」，別寫「怎麼做」。

!!! warning "誤把慣例當鐵律"
    camelCase、全大寫常數、80 字元行長、加分號——這些都是「慣例」，不是語法規定。不同團隊做法可能不同。重點不是選了哪一種，而是選定後在整個專案裡保持一致。

!!! warning "在非迴圈／非 callback 的地方用單字母命名"
    `i` 當迴圈計數器沒問題，但用 `x`、`z`、`w` 當一般變數會讓程式碼變成謎題。一般情況請用有描述性的名稱。

## 練習

完成本課後，閱讀以下延伸文章，幫助你更深入理解乾淨程式碼與註解的原則：

1. 閱讀 [10 Principles for Keeping Your Programming Code Clean](https://onextrapixel.com/10-principles-for-keeping-your-programming-code-clean/)，吸收關於乾淨程式碼的實用建議（例如：動手前先想清楚邏輯、正確縮排、把過長的函式拆小、命名要有描述性、修改既有程式碼時要謹慎並沿用原本風格）。
2. 為了更理解良好的註解習慣，閱讀 [Code Tells You How, Comments Tell You Why](https://blog.codinghorror.com/code-tells-you-how-comments-tell-you-why/)（程式碼告訴你「怎麼做」，註解告訴你「為什麼」）以及 [Coding Without Comments](https://blog.codinghorror.com/coding-without-comments/)（如何用清楚的程式碼減少對註解的依賴）。

讀完後，試著用本課學到的原則回答以下 knowledge check（自我檢核）問題：

- 為什麼寫乾淨的程式碼很重要？
- 有哪些保持程式碼乾淨的好原則？
- 好註解與壞註解的差別是什麼？

## 原文與延伸資源

- 原文：[Clean Code](https://www.theodinproject.com/lessons/foundations-clean-code)
- 本課引用：
  - [10 Principles for Keeping Your Programming Code Clean（onextrapixel）](https://onextrapixel.com/10-principles-for-keeping-your-programming-code-clean/)
  - [Code Tells You How, Comments Tell You Why（Coding Horror）](https://blog.codinghorror.com/code-tells-you-how-comments-tell-you-why/)
  - [Coding Without Comments（Coding Horror）](https://blog.codinghorror.com/coding-without-comments/)
  - [Tabs vs Spaces 之爭（Reddit 討論串，原文所提的「聖戰」哏）](https://www.reddit.com/r/programming/comments/p1j1c/tabs_vs_spaces_vs_both/)

---

> 本講義改寫自 The Odin Project《Clean Code》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
