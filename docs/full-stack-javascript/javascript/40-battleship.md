---
title: 專案：Battleship 海戰棋
source_url: https://www.theodinproject.com/lessons/node-path-javascript-battleship
source_file: vendor/curriculum/javascript/finishing_up_with_javascript/project_battleship.md
path: full-stack-javascript
course: JavaScript
order: 40
status: draft
generated: 2026-07-03
---

# 專案：Battleship 海戰棋

> 改寫自 The Odin Project：[Project: Battleship](https://www.theodinproject.com/lessons/node-path-javascript-battleship)
> ｜Full Stack JavaScript › JavaScript › Finishing Up with JavaScript

## 核心概念

這個專案要做出經典的雙人遊戲 **Battleship（海戰棋）**：玩家對電腦，各自有一個祕密佈署了艦艇的棋盤，輪流朝對方棋盤喊座標開火，先把對方所有艦艇擊沉的一方獲勝。

但這一課的真正訓練目標不是遊戲本身，而是**用 TDD（Test Driven Development，測試驅動開發）把一個「有多個模組互相合作」的程式寫出來**，並且把**遊戲邏輯**跟**DOM 操作**徹底分開。這是你到目前為止測試過的最複雜專案，因此節奏很重要：**寫一個測試 → 讓它通過 → 再寫下一個**，一次只前進一小步，不要想一次把整個遊戲寫完。

### 遊戲規則速記（不必連外部就能懂）

- 棋盤通常是 **10×10** 的方格，用座標（例如 row/column，或 `[x, y]`）定位每一格。
- 每位玩家佈署數艘長度不同的艦艇（原始桌遊為 5 艘，長度 5、4、3、3、2）。艦艇只能**水平或垂直**擺放，佔用連續的格子，**不可重疊、不可斜放**。
- 輪到你時，朝對方棋盤喊一個座標：命中艦艇算「hit（命中）」，沒中算「miss（未命中）」。一艘艦艇所有格子都被命中就算「sunk（擊沉）」。
- **一方所有艦艇全部被擊沉，對手獲勝。**

你不必實作到跟桌遊完全一樣的艦艇數量，重點是把「命中／未命中／擊沉／全滅」這套邏輯做對。

### 為什麼「不要測試 DOM」

測試網頁「畫面長怎樣」需要另一套工具（模擬瀏覽器環境），本單元還沒教到。所以這個專案的原則是：**把每一塊應用邏輯都從 DOM 操作裡隔離出來**，只對「純邏輯」寫單元測試。換句話說：

- `Ship`、`Gameboard`、`Player` 這些**不碰 DOM** 的物件 → 全部寫 unit test（單元測試）。
- 負責「把棋盤畫到網頁上」「綁定點擊事件」的模組 → **不寫測試**，只做 DOM 的事。

只要邏輯與畫面分家，你永遠能靠「跑測試」而不是靠 `console.log` 或肉眼看畫面，來確認核心程式正不正確。

### 四個核心角色

規劃時最關鍵的事，是**想清楚每段邏輯該住在哪個物件裡**。Battleship 的功能幾乎都能歸進以下四類（class 或 factory function 皆可，自己選）：

- **Ship（艦艇）**：記錄自己的 `length`（長度）、被命中的次數，以及是否已被擊沉。對外提供：
  - `hit()`：命中次數加一。
  - `isSunk()`：依「長度」與「命中次數」判斷是否已擊沉。
- **Gameboard（棋盤）**：管理一整面 10×10 的棋盤。負責：
  - 在指定座標**放置艦艇**（內部會建立或呼叫 Ship）。
  - `receiveAttack(座標)`：判斷這一擊有沒有打到艦艇，有就呼叫該艦艇的 `hit()`，沒有就把座標記錄進「未命中清單」。
  - 保存**未命中的座標**，之後好在畫面上標出來。
  - 回報**是否所有艦艇都已被擊沉**（用來判斷勝負）。
- **Player（玩家）**：分「真人玩家」與「電腦玩家」兩種，每個玩家**各自擁有一個自己的 Gameboard**。
- **畫面／流程控制模組**：把上面三種物件 import 進來，用 event listener（事件監聽器）一步步推進遊戲——渲染雙方棋盤、處理玩家點擊、輪流出手、判斷遊戲結束。**這一層才碰 DOM。**

> 提醒：只需要**測試物件的公開介面（public interface）**。也就是只有「會被物件外部使用到」的方法或屬性才需要單元測試；內部私有的細節不必逐一測。

### 電腦玩家要「隨機但合法」

遊戲是對電腦玩，所以電腦玩家要能**隨機出手**。它不需要多聰明，但至少要知道一步棋是否合法——**不能重複攻擊同一格**。實務上做法是：記住已經打過的座標，隨機挑一個沒打過的格子出手。

### 開發順序建議：由內而外

跟前面的專案一樣，建議**由內而外（inside out）**開發，先蓋看不見的地基，最後才裝潢：

1. 先做 `Ship`（`hit()`、`isSunk()`），寫測試讓它綠燈。
2. 再做 `Gameboard`（放艦艇、`receiveAttack`、記錄 miss、回報全滅），一樣測試先行。
3. 接著做 `Player`（真人／電腦，各持一個 Gameboard）。
4. 最後才做**畫面與流程模組**：渲染棋盤、綁點擊事件、輪流出手、判斷勝負、讓玩家佈署艦艇。這一層不寫測試。

### Jest 與 ESM：先設定好 Babel

你會用 ES6 的 `import` / `export` 拆分模組，但 **Jest 對 ESM 沒有內建穩定支援**，需要用 Babel 把 ESM 轉成 Jest 能執行的形式。安裝：

```bash
npm install --save-dev babel-jest @babel/core @babel/preset-env
```

在專案根目錄放一個 `babel.config.js`：

```javascript
// babel.config.js：讓 Jest 能理解 import/export
module.exports = {
  presets: [["@babel/preset-env", { targets: { node: "current" } }]],
};
```

有了這個設定，`babel-jest` 會自動把測試檔裡的 ESM 轉譯，你就能在測試裡自由使用 `import`。

## 程式碼範例

以下是**完全不碰 DOM** 的核心邏輯骨架，加上對應的 Jest 測試，示範 TDD 的節奏與三個物件如何分工。這正是專案建議的起手式。

```javascript
// ship.js
export class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0; // 被命中的次數
  }

  hit() {
    this.hits += 1;
  }

  // 命中次數達到長度就算擊沉
  isSunk() {
    return this.hits >= this.length;
  }
}
```

```javascript
// gameboard.js
import { Ship } from "./ship.js";

export class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.ships = []; // 已放置的艦艇：記下它佔的每一格
    this.missedShots = []; // 未命中的座標
  }

  // 從 [x, y] 起，沿 horizontal / vertical 方向放一艘長度為 length 的艦艇
  placeShip(x, y, length, direction = "horizontal") {
    const ship = new Ship(length);
    const cells = [];
    for (let i = 0; i < length; i += 1) {
      const cx = direction === "horizontal" ? x + i : x;
      const cy = direction === "vertical" ? y + i : y;
      cells.push([cx, cy]);
    }
    this.ships.push({ ship, cells });
    return ship;
  }

  // 收到一次攻擊：命中就呼叫該艦艇的 hit()，否則記錄為 miss
  receiveAttack(x, y) {
    for (const entry of this.ships) {
      const isHit = entry.cells.some(([cx, cy]) => cx === x && cy === y);
      if (isHit) {
        entry.ship.hit();
        return "hit";
      }
    }
    this.missedShots.push([x, y]);
    return "miss";
  }

  // 是否所有艦艇都被擊沉
  allSunk() {
    return this.ships.every((entry) => entry.ship.isSunk());
  }
}
```

```javascript
// ship.test.js：TDD 的重點是「先寫這些測試，再去實作上面的程式」
import { Ship } from "./ship.js";

test("剛建立的艦艇還沒被擊沉", () => {
  const ship = new Ship(3);
  expect(ship.isSunk()).toBe(false);
});

test("命中次數達到長度就算擊沉", () => {
  const ship = new Ship(2);
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
```

```javascript
// gameboard.test.js
import { Gameboard } from "./gameboard.js";

test("命中艦艇會回傳 hit", () => {
  const board = new Gameboard();
  board.placeShip(0, 0, 3, "horizontal"); // 佔用 (0,0)(1,0)(2,0)
  expect(board.receiveAttack(1, 0)).toBe("hit");
});

test("沒打中會記錄成 miss", () => {
  const board = new Gameboard();
  board.placeShip(0, 0, 3, "horizontal");
  expect(board.receiveAttack(5, 5)).toBe("miss");
  expect(board.missedShots).toContainEqual([5, 5]);
});

test("所有艦艇被擊沉時 allSunk 回傳 true", () => {
  const board = new Gameboard();
  board.placeShip(0, 0, 2, "horizontal");
  board.receiveAttack(0, 0);
  board.receiveAttack(1, 0);
  expect(board.allSunk()).toBe(true);
});
```

這些邏輯全部通過測試後，才另外寫一個 `displayController` 之類的模組，把 `Gameboard` 的資料畫到網頁、綁點擊事件呼叫 `receiveAttack()`，並在每一步之後重新渲染棋盤。核心邏輯完全不需要為了加畫面而改動——這就是邏輯與 DOM 分離的好處。

## 常見陷阱

!!! warning "在測試裡直接依賴 DOM"
    這個專案明確要求**不要測試 DOM**。如果你的 `Gameboard` 或 `Ship` 裡混進了 `document.querySelector`、`innerHTML` 等操作，就沒辦法在 Jest 裡乾淨地測。請把所有畫面相關的程式集中到獨立的顯示模組，讓核心物件保持「純邏輯」。

!!! warning "忘了設定 Babel，import/export 在 Jest 報錯"
    Jest 對 ESM 沒有內建穩定支援。若一開跑測試就看到 `SyntaxError: Cannot use import statement outside a module`，多半是還沒裝 `babel-jest`＋`@babel/preset-env` 或還沒建立 `babel.config.js`。先把這步做好再開始。

!!! warning "電腦玩家重複攻擊同一格"
    電腦不用聰明，但**必須合法**：一定要記住已經打過哪些座標，隨機出手時跳過它們。否則電腦可能一直打同一格，遊戲卡住或永遠結束不了。

!!! warning "receiveAttack 命中卻沒呼叫該艦艇的 hit()"
    `receiveAttack` 的職責是「判斷有沒有中，並把 `hit()` 送到正確的那艘艦艇」。若只回傳字串卻忘了實際呼叫 `ship.hit()`，`isSunk()` 與 `allSunk()` 永遠不會變 true，勝負判斷就會失效。

!!! warning "一次想把整個遊戲寫完"
    TDD 的精神是小步前進：寫一個測試、讓它過、再寫下一個。這個專案模組多、互相牽動，若一次寫一大坨再回頭除錯，會非常痛苦。若不知道該測什麼，回頭複習 More Testing 那一課的做法。

## 練習

以下把原文的 Assignment 改寫成中文步驟。**實際需求以原文為準**，完整專案說明請見文末原文連結。

1. **先設定測試環境**：安裝 Jest 與 Babel（`babel-jest`、`@babel/core`、`@babel/preset-env`），建立 `babel.config.js`，讓測試能用 `import` / `export`。
2. **建立 `Ship`**（class 或 factory 皆可）：
   - 屬性包含長度、被命中次數、是否已擊沉。
   - `hit()`：命中次數加一。
   - `isSunk()`：依長度與命中次數判斷是否擊沉。
   - 只測公開介面。
3. **建立 `Gameboard`**：
   - 能在指定座標放置艦艇（內部建立／呼叫 Ship）。
   - `receiveAttack(座標)`：判斷是否命中，命中就對正確的艦艇呼叫 `hit()`，未命中則記錄座標。
   - 保存未命中的座標清單，供之後渲染。
   - 能回報是否所有艦艇都已被擊沉。
   - 這階段先別碰 DOM，靠跑測試確認邏輯，不要靠 `console.log`。
4. **建立 `Player`**：分真人與電腦兩種，每個玩家各自擁有一個 Gameboard。
5. **把類別／工廠 import 進另一個檔案，用 event listener 驅動遊戲，並建立一個管理 DOM 動作的模組**：
   - 這時才開始做使用者介面。
   - 先用預先寫死的座標替兩位玩家佈署艦艇（之後再做手動佈署）。
   - 依 Gameboard 的資料渲染雙方棋盤（渲染函式放進適當的模組）。
   - 讓玩家點擊敵方棋盤的格子來攻擊，把輸入送進物件的方法，再重新渲染。
   - 讓雙方輪流出手；若需要記錄「目前輪到誰」，就放在這個流程模組裡管理。
   - 電腦玩家要能隨機且合法出手（不重複攻擊同一格）。
   - 當一方艦艇全滅時結束遊戲。
6. **最後實作艦艇佈署系統**：例如讓玩家逐艘輸入座標，或用一顆按鈕循環隨機佈署。

> 進階挑戰（原文選作）：用拖曳（drag and drop）佈署艦艇；做「兩人輪流傳裝置」模式並加上「換手遮蔽畫面」；讓電腦命中後嘗試攻擊相鄰格子，變得更聰明。

## 原文與延伸資源

- 原文：[Project: Battleship](https://www.theodinproject.com/lessons/node-path-javascript-battleship)
- 本課引用：
  - [Battleship 遊戲規則（Wikipedia）](https://en.wikipedia.org/wiki/Battleship_(game))
  - [Jest — 用 Babel 設定讓測試支援 ES6 import/export](https://jestjs.io/docs/getting-started#using-babel)
  - [MDN — Classes（類別）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

---

> 本講義改寫自 The Odin Project《Project: Battleship》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
