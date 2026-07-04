---
title: 專案：剪刀石頭布
source_url: https://www.theodinproject.com/lessons/foundations-rock-paper-scissors
source_file: vendor/curriculum/foundations/javascript_basics/project_rock_paper_scissors.md
path: foundations
course: Foundations
order: 38
generated: 2026-07-03
---

# 專案：剪刀石頭布

> 改寫自 The Odin Project：[Project: Rock Paper Scissors](https://www.theodinproject.com/lessons/foundations-rock-paper-scissors)
> ｜Foundations › JavaScript Basics

## 核心概念

這是你第一個從零開始、完全用 JavaScript 打造的專案：在 console（主控台）裡玩「剪刀石頭布」。玩家對戰電腦，先寫出每一局的判定邏輯，再擴充成一場五局定勝負的完整遊戲。這一課沒有畫面按鈕，全部在 console 進行；GUI（圖形使用者介面）會留到後面的課才做，現在請專注把遊戲邏輯寫對。

雖然題目很小，它其實把前面學過的東西全串起來了：function（函式）、parameter（參數）與 return（回傳）、variable（變數）、conditional（條件判斷）、string（字串）比較，還有一點點瀏覽器 API。與其一次寫完再測，建議沿用「問題解決」那一課的節奏：先用 pseudocode（虛擬碼）把想法寫成中文步驟，再翻成程式碼，最後用 `console.log` 驗證，確認一段能動了才寫下一段。

**取得電腦的選擇。** 電腦要隨機從 "rock"、"paper"、"scissors" 三者挑一個。關鍵工具是 `Math.random()`：它回傳一個「大於等於 0、小於 1」的浮點數（floating-point number）。把它乘上 3 再用 `Math.floor()`（向下取整）取整數，就能穩定得到 0、1、2 這三個值之一。公式記起來：`Math.floor(Math.random() * n)` 會給你 0 到 n-1 的整數。有了這個整數，用 `if / else if` 把 0、1、2 各對應到一個選擇字串回傳即可。這裡不需要 array（陣列）——array 之後才教，現在用條件判斷就夠了。

**取得玩家的選擇。** 用瀏覽器的 `prompt()` 跳出輸入框問玩家。`prompt()` 會回傳玩家打的字串；若按取消則回傳 `null`。這一課先假設玩家一定輸入合法值（rock、paper 或 scissors 其中之一），不必處理錯誤輸入或重新詢問——那需要之後才學的技巧。

**判定單局勝負。** 寫一個 `playRound` 函式，用 `humanChoice`、`computerChoice` 兩個參數接住雙方的選擇，比出這一局誰贏，`console.log` 印出結果（例如「You lose! Paper beats Rock」），並把贏家的分數加一。有個小細節：要讓玩家輸入不分大小寫，"rock"、"ROCK"、"RocK" 都算數。做法是先用字串的 `.toLowerCase()` 把玩家輸入統一轉成小寫再比較。

**跑完整場遊戲。** 最後用 `playGame` 函式把上面組裝起來：連玩五局、記錄 `humanScore` 與 `computerScore` 兩個分數，五局結束後宣布總冠軍。這裡有個常被踩的觀念：函式呼叫的回傳值一旦指派給變數，之後讀那個變數只會拿到「當時存下的值」，不會重新執行函式。所以每一局都要「重新呼叫」`getComputerChoice()` 和 `getHumanChoice()` 才能拿到新選擇，不能只呼叫一次就重複使用同一個變數。如果你已經學過迴圈（loop）可以用，但下一課才會正式教，用不用都行。

## 程式碼範例

```javascript
// 隨機回傳電腦的選擇，不需要用到 array
function getComputerChoice() {
  const randomNumber = Math.floor(Math.random() * 3); // 得到 0、1 或 2
  if (randomNumber === 0) return "rock";
  if (randomNumber === 1) return "paper";
  return "scissors";
}

// 用 prompt 取得玩家輸入，假設輸入一定合法
function getHumanChoice() {
  return prompt("請出拳：rock、paper 或 scissors");
}

function playGame() {
  let humanScore = 0;
  let computerScore = 0;

  // 判定單局：先把玩家輸入轉小寫，達成不分大小寫
  function playRound(humanChoice, computerChoice) {
    const human = humanChoice.toLowerCase();

    if (human === computerChoice) {
      console.log(`平手！雙方都出 ${human}`);
      return;
    }

    // 列出所有「玩家獲勝」的組合
    const humanWins =
      (human === "rock" && computerChoice === "scissors") ||
      (human === "paper" && computerChoice === "rock") ||
      (human === "scissors" && computerChoice === "paper");

    if (humanWins) {
      humanScore++;
      console.log(`你贏了！${human} 打敗 ${computerChoice}`);
    } else {
      computerScore++;
      console.log(`你輸了！${computerChoice} 打敗 ${human}`);
    }
  }

  // 每一局都重新呼叫，才能拿到新的選擇
  for (let round = 0; round < 5; round++) {
    const humanSelection = getHumanChoice();
    const computerSelection = getComputerChoice();
    playRound(humanSelection, computerSelection);
  }

  console.log(`最終比分：你 ${humanScore} － 電腦 ${computerScore}`);
  if (humanScore > computerScore) console.log("恭喜，你是總冠軍！");
  else if (humanScore < computerScore) console.log("電腦獲勝，再接再厲！");
  else console.log("五局打平！");
}

playGame();
```

## 常見陷阱

!!! warning "把函式呼叫存進變數後就以為它會自己更新"
    `const choice = getComputerChoice();` 只會執行「一次」並把當下的結果存進 `choice`。之後每次讀 `choice` 都是同一個值，不會重新亂數。五局要有五個新選擇，就得在每一局迴圈裡「重新呼叫」`getComputerChoice()` 與 `getHumanChoice()`，而不是重複使用同一個變數。

!!! warning "忘記處理大小寫，導致比較失敗"
    玩家打 "Rock" 而你的判斷寫的是 `=== "rock"`，字串比較會因大小寫不同而不相等，判定就會出錯。先用 `humanChoice.toLowerCase()` 把輸入統一轉小寫再比較。

!!! warning "用 Math.round 取整導致機率不均"
    取三選一要用 `Math.floor(Math.random() * 3)`，穩定得到 0、1、2。若改用 `Math.round`，邊界的 0 與 3 出現機率會和中間不同，讓某些選擇偏多或偏少。

## 練習

實際需求以原文專案說明為準，這裡是繁中步驟導引：

1. **建立專案結構。** 開一個新的 Git repository，寫一份空的 HTML，裡面放一個 `<script>` 標籤並連到外部的 `.js` 檔。先寫 `console.log("Hello World")`，打開網頁確認 console 有印出來，代表 JavaScript 正確連上。遊戲全部在 console 玩，HTML 不需要多寫東西。
2. **`getComputerChoice`。** 寫一個函式，用 `Math.random()` 隨機回傳 "rock"、"paper" 或 "scissors" 其中之一。先用 `console.log` 測它會不會如預期回傳。
3. **`getHumanChoice`。** 寫一個函式，用 `prompt()` 取得玩家輸入並回傳。假設玩家一定輸入合法值，先不處理錯誤輸入。
4. **宣告分數變數。** 在全域範圍建立 `humanScore` 與 `computerScore`，都初始化為 `0`。
5. **`playRound`。** 定義 `humanChoice`、`computerChoice` 兩個參數，做到玩家輸入不分大小寫，`console.log` 印出這一局的勝負字串，並替贏家分數加一。
6. **`playGame`。** 把 `playRound` 與兩個分數變數搬進 `playGame` 裡面，呼叫 `playRound` 玩五局，記得每局重新取得雙方選擇，最後宣布總冠軍。

記得「commit early, commit often」——每完成一小步就提交一次。這個專案容易讓人想加特效、加樣式，請先忍住，把心力留給之後的作品集專案，現在專注把遊戲邏輯做對就好。

## 原文與延伸資源

- 原文：[Project: Rock Paper Scissors](https://www.theodinproject.com/lessons/foundations-rock-paper-scissors)
- 本課引用：
    - MDN：[Math.random()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)（隨機數與取整公式）
    - MDN：[Window.prompt()](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt)（取得玩家輸入）
    - TOP：[Problem Solving](https://www.theodinproject.com/lessons/foundations-problem-solving)（先 pseudocode 再寫程式的解題節奏）
    - 遊戲規則：[How to Play Rock, Paper, Scissors（wikiHow）](https://www.wikihow.com/Play-Rock,-Paper,-Scissors)

---

> 本講義改寫自 The Odin Project《Project: Rock Paper Scissors》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
