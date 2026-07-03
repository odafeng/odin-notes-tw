---
title: 解決問題的思路（Problem Solving）
source_url: https://www.theodinproject.com/lessons/foundations-problem-solving
source_file: vendor/curriculum/foundations/javascript_basics/problem_solving.md
path: foundations
course: Foundations
order: 36
status: draft
generated: 2026-07-03
---

# 解決問題的思路（Problem Solving）

> 改寫自 The Odin Project：[Problem Solving](https://www.theodinproject.com/lessons/foundations-problem-solving)
> ｜Foundations › JavaScript Basics

## 核心概念

寫程式時，真正困難的往往不是語法，而是「解決問題」（problem solving）這件事本身。很多初學者可以很快學會變數（variable）、迴圈（loop）、條件判斷（conditional）的寫法，但一打開編輯器要自己做點東西，卻常常盯著空白畫面不知道從何開始。這一課的重點就是：把「不知道怎麼下手」變成一套可以重複操作的流程。

在《Think Like a Programmer》裡，V. Anton Spraul 把程式設計中的問題解決定義為：**寫出一支原創程式，完成一組特定任務，並滿足所有既定限制。** 這裡的「限制」（constraint）很重要。一道小小的練習題，跟 Google 這種每天要處理數十億次查詢的系統，任務也許類似，但限制（例如效能、可擴充性）天差地別，解法自然不同。因此，理解問題與它的限制，是一切的起點。

解決問題的流程可以拆成三個階段，這三個階段也是本課最需要記住的骨架：

### 一、理解問題（Understand the problem）

第一步是「弄清楚問題到底是什麼」。這聽起來像廢話，但如果你不真正理解問題，你根本不會知道自己什麼時候算是「解完了」，很可能花大把時間往錯的方向走。

要確認自己真的懂了，有幾個實用做法：把問題寫在紙上、用你自己的白話重新敘述一遍、需要時畫圖輔助。有一個很好的檢驗標準——**當你能用平白的口語，把這個問題清楚地解釋給另一個人聽，你才算真的理解它。** 這其實就是有名的「小黃鴨除錯法」（rubber duck debugging）的精神：對著一隻玩具鴨（或任何人）把問題講一遍，講的過程往往就會發現自己邏輯裡的漏洞。物理學家 Feynman 也說過類似的話：「如果你沒辦法用簡單的話說明一件事，代表你其實還沒真的懂它。」

### 二、規劃（Plan）

知道要解什麼之後，**先別急著寫程式**，先想清楚「打算怎麼解」。在這個階段你應該問自己幾個問題：

- 程式有使用者介面（user interface）嗎？長什麼樣？有哪些功能？可以先在紙上畫草圖。
- 程式的輸入（input）是什麼？是使用者輸入，還是從別處取得資料？
- 想要的輸出（output）是什麼？
- 給定這些輸入，要經過哪些步驟才能得到想要的輸出？

最後一個問題，就是要你寫出一個「演算法」（algorithm）。你可以把演算法想成「解決某個問題的食譜」：它定義了電腦為了解決問題所必須執行的步驟。而我們通常會先用「虛擬碼」（pseudocode）把這份食譜寫下來。

### 虛擬碼（Pseudocode）

虛擬碼是用**自然語言**（而不是真正的程式碼）把程式邏輯寫出來。它強迫你放慢腳步，一步一步想清楚程式為了解決問題需要經過哪些步驟。因為不用管任何語法細節，你可以把注意力全部放在「邏輯對不對」上，也更容易在真正動手寫程式前就抓出邏輯錯誤。

寫虛擬碼常見的慣例：每一行開頭字母大寫、一行只寫一個動作、用縮排表示巢狀（nested）結構、盡量用貼近問題本身的詞彙而非特定語言的語法。常用的關鍵字有 `IF`／`ELSE`、`WHILE`、`FOR`、`PRINT` 等。

下面是一段虛擬碼範例，描述「印出從 1 到使用者輸入數字之間所有數字」的邏輯：

```text
當使用者輸入一個數字
初始化一個計數器變數，值設為 0
當計數器小於使用者輸入的數字，就把計數器加 1
印出計數器變數的值
```

### 三、分而治之（Divide and conquer）

在規劃階段，你其實已經把大問題拆出了一些「子問題」（subproblem）——演算法裡的每一個步驟，就是一個子問題。這一步要做的，就是**挑最小、最簡單的那個子問題開始寫程式**。

很多初學者會想「一口氣把整個大問題解掉」，**千萬不要這樣做**。問題只要稍微複雜，一次全部解就會讓你把自己纏成一團。把問題「拆解」（decomposition）成更小、更好解的子問題，是應付複雜度最主要的手段，它讓問題變得更好理解、也更容易著手。

值得注意的是：你不需要一開始就想到所有步驟，演算法可以是不完整的，這完全沒關係。通常解掉一個子問題後，下一個子問題自然就浮現出來了；就算你早就知道下一步是什麼，把前一個子問題解掉後，下一步往往也會變得更簡單。簡單說就是：把大問題拆小、逐一解掉每個小問題，直到大問題被解決為止。

如果卡住了，有三個方向可以試：**除錯（debug）**——一步一步追蹤你的解法哪裡出錯；**換角度重來**——從不同角度重新看問題，或乾脆重新開始；**做研究**——但只查你卡住的那個子問題的解法，因為「卡住並掙扎」本身正是學習發生的地方。

## 程式碼範例

我們用經典的 Fizz Buzz 來完整走一遍這套流程。題目是：讓使用者輸入一個數字，印出 1 到該數字之間的每個數；但能被 3 整除的印 `Fizz`、能被 5 整除的印 `Buzz`、同時能被 3 和 5 整除的印 `FizzBuzz`。

先寫虛擬碼（規劃階段的產物）：

```text
當使用者輸入一個數字
從 1 迴圈到輸入的數字
如果目前的數字同時能被 3 和 5 整除，印出 "FizzBuzz"
否則如果能被 3 整除，印出 "Fizz"
否則如果能被 5 整除，印出 "Buzz"
否則印出目前的數字
```

接著分而治之，一個子問題一個子問題地實作。

**子問題 1：取得使用者輸入。** 用 `prompt` 跳出輸入框，並用 `parseInt` 把字串轉成數字（number）：

```javascript
// prompt 回傳的是字串，用 parseInt 轉成整數存進 answer
let answer = parseInt(prompt("請輸入你想 FizzBuzz 到多少："));
```

**子問題 2：從 1 迴圈到輸入的數字。** 用 for 迴圈（for loop）。它的三個子句分別是：初始化 `let i = 1`（只執行一次）、條件 `i <= answer`（每輪開始前檢查，為真才繼續）、以及每輪結束後執行的 `i++`（把 `i` 加 1）：

```javascript
let answer = parseInt(prompt("請輸入你想 FizzBuzz 到多少："));

for (let i = 1; i <= answer; i++) {
  console.log(i); // 先確認能正確印出 1 到 answer
}
```

**子問題 3～5：加入條件判斷。** 這裡用到取餘數運算子（modulus operator）`%`，它會回傳除法的餘數；餘數為 0 就代表整除。逐步把三個條件補齊，就得到完整版：

```javascript
let answer = parseInt(prompt("請輸入你想 FizzBuzz 到多少："));

for (let i = 1; i <= answer; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    console.log("FizzBuzz");
  } else if (i % 3 === 0) {
    console.log("Fizz");
  } else if (i % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}
```

注意條件的**順序**：一定要先檢查「同時能被 3 和 5 整除」，再檢查個別的 3 或 5。因為 `if / else if` 只會執行第一個成立的分支，如果把 `i % 3 === 0` 放在最前面，那些同時是 3 與 5 倍數的數字（例如 15）會先命中 `Fizz` 就結束，永遠印不出 `FizzBuzz`。

## 常見陷阱

!!! warning "還沒真的懂問題就開始寫程式"
    最常見也最昂貴的錯誤，就是跳過「理解問題」直接敲鍵盤。如果你沒辦法用白話把問題講清楚，就代表你還沒準備好寫程式碼。先寫下來、重新用自己的話敘述、講給別人（或小黃鴨）聽，確認理解無誤再動手。

!!! warning "想一次解決整個大問題"
    直接挑戰完整的大問題，只會讓你越纏越亂。務必先拆成子問題，從最小、最簡單的那個開始，解一個、驗證一個，再往下走。

!!! warning "條件判斷的順序會影響結果"
    `if / else if` 只會執行第一個為真的分支。像 FizzBuzz 這種有「重疊條件」的情況，必須把最嚴格（同時被 3 和 5 整除）的條件放在最前面，否則較寬鬆的條件會搶先命中，導致結果錯誤。

!!! warning "prompt 回傳的是字串"
    `prompt` 拿到的一律是字串，直接拿來做數字比較或運算可能出錯。記得用 `parseInt`（或 `Number`）轉成數字再用。

## 練習

1. 閱讀 Richard Reis 的〈How to Think Like a Programmer — Lessons in Problem Solving〉，體會「理解 → 規劃 → 拆解 → 卡住時怎麼辦」這套框架。
2. 觀看 Coding Tech 的〈How to Begin Thinking Like a Programmer〉影片（約一小時，內容紮實，值得完整看完）。
3. 閱讀 Built In 的〈Pseudocode: What It Is and How to Write It〉，熟悉虛擬碼的寫法與慣例。
4. 動手實作：用本課的三步驟流程，自己從頭寫一次 Fizz Buzz。先寫虛擬碼、再一個子問題一個子問題地實作，最後在瀏覽器 console 驗證輸入 20 時的輸出是否正確。

## 原文與延伸資源

- 原文：[Problem Solving](https://www.theodinproject.com/lessons/foundations-problem-solving)
- 本課引用：
  - [How to Think Like a Programmer — Lessons in Problem Solving](https://www.freecodecamp.org/news/how-to-think-like-a-programmer-lessons-in-problem-solving-d1d8bf1de7d2/)（Richard Reis, freeCodeCamp）
  - [Pseudocode: What It Is and How to Write It](https://builtin.com/data-science/pseudocode)（Built In）
  - [MDN：`for` 陳述式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for)
  - [How to Begin Thinking Like a Programmer](https://www.youtube.com/watch?v=azcrPFhaY9k)（Coding Tech，影片，本文未抓取內容）

---

> 本講義改寫自 The Odin Project《Problem Solving》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
