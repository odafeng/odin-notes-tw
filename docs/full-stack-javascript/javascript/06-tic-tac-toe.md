---
title: 專案：井字遊戲
source_url: https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe
source_file: vendor/curriculum/javascript/organizing_your_javascript_code/project_tic_tac_toe.md
path: full-stack-javascript
course: JavaScript
order: 6
generated: 2026-07-03
---

# 專案：井字遊戲

> 改寫自 The Odin Project：[Project: Tic Tac Toe](https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe)
> ｜Full Stack JavaScript › JavaScript › Organizing Your JavaScript Code

## 核心概念

這個專案要做一個能在瀏覽器裡玩的井字遊戲（Tic Tac Toe）。表面上它是個小遊戲，真正的訓練目標其實是**程式碼組織**：把前面學到的 factory function（工廠函式）與 module pattern（模組模式）實際用來切分責任，讓全域範圍（global scope）盡可能乾淨。

### 專案目標：盡量減少全域程式碼

這一課最重要的要求，就是**全域範圍裡的變數與函式越少越好**。做法是把邏輯塞進工廠或模組裡：

- 需要**多個實例**的東西（例如玩家 player），用 factory function 產生。
- 全遊戲只會有**單一實例**的東西（例如棋盤 gameboard、負責畫面的 displayController、控制流程的 game），把 factory 包進 IIFE，變成 module pattern，讓它「無法被再次呼叫來產生第二個實例」。

這樣一來，全域範圍大概只剩下幾個模組物件的名字，其餘狀態（棋盤陣列、目前輪到誰、分數等）都被封裝在各自的閉包（closure）裡，外部無法亂改。

### 三個核心角色：gameboard、player、game

規劃時的關鍵是**想清楚每段邏輯該住在哪裡**。井字遊戲的功能幾乎都能歸進這三類物件其中之一：

- **Gameboard（棋盤）**：用一個陣列（array）存放九個格子的狀態，並提供「取得目前棋盤」「在某格放子」「重設棋盤」等方法。棋盤陣列本身應該是私有的，外界只能透過方法操作它。
- **Player（玩家）**：存名字與棋子符號（`"X"` 或 `"O"`）。因為需要兩個玩家，用 factory function 各產生一個。
- **Game / gameController（遊戲控制）**：控制整場遊戲的流程——輪到誰、把棋子放到棋盤上、每步之後檢查是否有人贏或平手、宣布結果、重新開始。

決定「這段程式碼放哪裡」是這個專案最有價值的思考。花點時間規劃，後面會輕鬆很多。

### 「由內而外」的開發順序

建議像蓋房子一樣**由內而外（inside out）**：先蓋看不見的地基與骨架（遊戲核心邏輯），最後才裝潢（畫面與互動）。具體順序：

1. **先在 console 裡把遊戲跑起來**。完全不碰 DOM、HTML、CSS，也先不處理使用者輸入。你自己手動呼叫函式、傳入參數來「代替玩家下棋」，確認邏輯正確。
2. 這一步一定要寫好**勝負判斷**：檢查所有三種連線（橫、直、兩條斜線）與平手（棋盤填滿卻無人連線）。
3. 核心邏輯確定沒問題後，才寫**顯示模組**：把棋盤陣列畫到網頁上。
4. 接著綁定**點擊事件**，讓玩家點格子下棋，並擋掉已經有子的格子。
5. 最後**整理介面**：輸入玩家名字、開始／重新開始按鈕、顯示結果的區塊。

先把「看不見的邏輯」做對，再處理畫面，能大幅降低除錯難度——因為你永遠知道問題是出在遊戲邏輯還是 DOM。

### 用到的關鍵技巧

- **Factory function**：一個回傳物件的普通函式，每次呼叫產生一個新實例（用在 player）。
- **Module pattern（IIFE）**：把 factory 包在立即執行函式運算式（IIFE, Immediately Invoked Function Expression）裡並立刻執行，得到一個「單例」物件；閉包內的變數是私有的（用在 gameboard、displayController、game）。
- **關注點分離（separation of concerns）**：遊戲邏輯完全不知道 DOM 存在，DOM 邏輯集中在 displayController，兩者透過 game 溝通。

## 程式碼範例

以下是**只在 console 就能玩**的最小骨架，示範三個角色如何分工。這正是專案建議的第一步：先不碰 DOM。

```javascript
// gameboard：全遊戲只有一個，用 IIFE 包成 module pattern
const Gameboard = (function () {
  // 私有狀態：九格棋盤，外界無法直接存取
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  // 在指定格放子；該格已有子則回傳 false 表示放子失敗
  const placeMark = (index, mark) => {
    if (board[index] !== "") return false;
    board[index] = mark;
    return true;
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, placeMark, reset };
})();

// player：需要兩個，用 factory function 各產生一個
function createPlayer(name, mark) {
  return { name, mark };
}

// game：控制流程，也只有一個，同樣用 IIFE
const Game = (function () {
  const player1 = createPlayer("玩家一", "X");
  const player2 = createPlayer("玩家二", "O");
  let activePlayer = player1;

  // 所有可能的連線位置（橫、直、斜）
  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // 橫
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // 直
    [0, 4, 8], [2, 4, 6],            // 斜
  ];

  const switchTurn = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  // 檢查目前棋盤是否有人連成三子
  const checkWinner = () => {
    const board = Gameboard.getBoard();
    return winningLines.some(([a, b, c]) =>
      board[a] !== "" && board[a] === board[b] && board[b] === board[c]
    );
  };

  const isTie = () => Gameboard.getBoard().every((cell) => cell !== "");

  // 下一步棋：回傳這一步之後的狀態
  const playRound = (index) => {
    if (!Gameboard.placeMark(index, activePlayer.mark)) {
      return `位置 ${index} 已經有子，換個地方`;
    }
    if (checkWinner()) return `${activePlayer.name} 獲勝！`;
    if (isTie()) return "平手！";
    switchTurn();
    return `輪到 ${activePlayer.name}`;
  };

  return { playRound };
})();

// 在 console 裡手動「代替玩家下棋」來驗證邏輯
console.log(Game.playRound(0)); // 玩家一下 X → 輪到 玩家二
console.log(Game.playRound(3)); // 玩家二下 O → 輪到 玩家一
console.log(Game.playRound(1)); // X
console.log(Game.playRound(4)); // O
console.log(Game.playRound(2)); // X 連成 0,1,2 → 玩家一 獲勝！
```

等這段在 console 完全正確後，再新增一個 `displayController` 模組，把 `Gameboard.getBoard()` 的內容畫到網頁，並在格子上綁 `click` 事件呼叫 `Game.playRound()`。遊戲邏輯完全不需要為了加畫面而改動——這就是關注點分離的好處。

## 常見陷阱

!!! warning "把所有東西都塞進全域範圍"
    這個專案的評分重點就是全域程式碼要少。如果你的棋盤陣列、目前玩家、分數全都是散在最外層的變數，就等於沒達成目標。把狀態封裝進 gameboard／game 模組的閉包裡，外部只能透過方法操作。

!!! warning "gameboard 或 game 被寫成可產生多個實例的 factory"
    棋盤和遊戲控制全程只該有「一個」。若寫成普通 factory function 又到處呼叫，會不小心產生多個獨立棋盤，狀態彼此不同步。單例的東西請用 IIFE（module pattern）包起來。

!!! warning "太早開始寫 DOM"
    先做畫面、邊做邊試玩，會讓你分不清 bug 是邏輯錯還是 DOM 錯。務必先在 console 把遊戲（含勝負與平手判斷）跑對，再碰 HTML/CSS。

!!! warning "忘了擋「已經有子的格子」"
    只做「放子」卻沒檢查該格是否已被佔用，玩家就能覆蓋對方的棋子。放子前一定要先判斷該格是否為空（範例中 `placeMark` 回傳 `false` 即代表該格已滿）。

!!! warning "只檢查贏、忘了檢查平手"
    九格填滿又無人連線就是平手。若少了這個判斷，棋盤滿了遊戲卻不會結束，會卡住。

## 練習

以下把原文的 Assignment 改寫成中文步驟。**實際需求以原文為準**，完整專案說明請見文末原文連結。

1. 建立專案：分別放好 HTML、CSS、JavaScript 檔案，並初始化 Git repo。
2. 規劃物件結構：棋盤存成 Gameboard 物件裡的陣列；玩家存成物件；再加一個控制遊戲流程的物件。
   - 目標是**全域程式碼越少越好**，盡量塞進 factory。
   - 只需要單一實例的東西（gameboard、displayController 等），把 factory 包進 IIFE（module pattern），使其無法被重複建立。
   - 仔細想每段邏輯該住在 game、player 還是 gameboard，先花時間規劃結構。
3. **先讓 console 版遊戲能玩**：包含判斷遊戲結束的邏輯，檢查所有三連線與平手。這階段先別碰 DOM，也別處理使用者輸入，自己呼叫函式傳參數來試玩。
4. console 版可玩後，建立一個處理畫面／DOM 的物件，寫一個函式把棋盤陣列渲染到網頁（可先在陣列塞一些 `"X"`、`"O"` 觀察效果）。
5. 寫讓玩家透過點擊 DOM 元素在指定格放子的函式，別忘了擋掉「已被佔用的格子」。
6. 美化介面：讓玩家輸入名字、加上開始／重新開始按鈕，並加一個在遊戲結束時顯示結果的區塊。

> 進階挑戰（原文選作）：做一個無法被打敗的 AI 對手（可研究 minimax 演算法）。

## 原文與延伸資源

- 原文：[Project: Tic Tac Toe](https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe)
- 本課引用：
  - [MDN — IIFE（Immediately Invoked Function Expression）](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)
  - [ayweb.dev — Building a house from the inside out](https://www.ayweb.dev/blog/building-a-house-from-the-inside-out)（原文推薦的專案結構參考文章）

---

> 本講義改寫自 The Odin Project《Project: Tic Tac Toe》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
