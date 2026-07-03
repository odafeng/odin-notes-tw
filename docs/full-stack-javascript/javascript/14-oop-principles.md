---
title: 物件導向原則（OOP）
source_url: https://www.theodinproject.com/lessons/node-path-javascript-oop-principles
source_file: vendor/curriculum/javascript/organizing_your_javascript_code/oop_principles.md
path: full-stack-javascript
course: JavaScript
order: 14
status: draft
generated: 2026-07-03
---

# 物件導向原則（OOP）

> 改寫自 The Odin Project：[OOP Principles](https://www.theodinproject.com/lessons/node-path-javascript-oop-principles)
> ｜Full Stack JavaScript › JavaScript › Organizing Your JavaScript Code

## 核心概念

到目前為止，你已經學過並練習過 JavaScript 裡最常見的物件建立與組織方式：object literal、factory function（工廠函式）、constructor、class（類別）以及 module（模組）。這些是「怎麼寫」的語法問題。但真正困難、也真正決定程式好壞的，是「該怎麼用」的問題——一個物件裡該放什麼、什麼時候該拆出新的物件、什麼時候讓一個物件去繼承另一個物件。這一課不再教新語法，而是介紹一組能幫你做出好設計決策的**原則（principles）**。

請先建立一個心態：這些是**原則，不是規則**。軟體設計的問題通常沒有唯一正解，把某個函式放在 A 物件還是 B 物件，往往都伴隨取捨（trade-off）。有些寫法明顯比另一些好，但很少有「絕對正確」的答案。這些原則的價值在於：當你面對「這段程式該放哪」的猶豫時，它們給你一個判斷方向。

### 單一職責原則（Single Responsibility Principle, SRP）

這是最重要、也最該先內化的一條：**一個 class（或 object、module）應該只有一個職責（responsibility）**。

注意，「只有一個職責」不等於「只能做一件事」。一個物件當然可以有很多方法、做很多動作，但這些動作應該全部圍繞著**同一個職責**。換另一個角度更精準：**一個 class 應該只有一個「改變的理由」**。如果你發現一個物件因為兩種完全不同的原因而需要被修改，那它很可能承擔了兩個職責，該拆開。

最經典的例子，就是把「應用邏輯」和「操作 DOM」混在一起。看這段判斷遊戲是否結束的函式：

```javascript
function isGameOver() {
  // 這裡是判斷遊戲結束的邏輯……

  if (gameOver) {
    const gameOverDiv = document.createElement('div');
    gameOverDiv.classList.add('game-over');
    gameOverDiv.textContent = `${this.winner} won the game!`;
    document.body.appendChild(gameOverDiv);
  }
}
```

這段程式有兩個問題。**第一個問題**是：這個函式（以及它所在的 module）不應該親自去操作 DOM。畫面渲染這件事應該被抽出成獨立的 module，例如叫 `DOMStuff`，然後這樣用：

```javascript
function isGameOver() {
  // 這裡是判斷遊戲結束的邏輯……

  if (gameOver) {
    DOMStuff.gameOver(this.winner);
  }
}
```

**第二個問題**更細緻：`isGameOver` 這個名字說它只負責「判斷遊戲是否結束」，那它就不該連「結束後要做什麼」都管。理想上，`isGameOver` 應該只回傳一個布林值（true/false），而由外層的遊戲主迴圈（game loop）根據這個回傳值，去決定要不要呼叫 `DOMStuff.gameOver(this.winner)`。這樣一來，「判斷」和「反應」就各司其職。

SRP 的好處是**可維護性**：當畫面呈現要改版時，你只動 `DOMStuff`；當遊戲規則要改時，你只動邏輯 module。彼此不會互相波及。

### SOLID：五個設計原則

SRP 是一組合稱 **SOLID** 的五個物件導向設計原則裡的第一個（也是 S）。SOLID 是五個原則英文字首的縮寫，其餘四個你日後會愈來愈常遇到，這裡各給一句白話解釋：

- **S — Single Responsibility（單一職責）**：一個模組只有一個改變的理由。（如上）
- **O — Open/Closed（開放封閉）**：軟體實體應該「對擴充開放、對修改封閉」。意思是當需求增加時，你應該能透過**新增**程式碼來擴充功能，而不必**回頭改動**既有、已測試過的程式碼。例如用一個共用介面，讓你新增一種形狀（Shape）時只要多寫一個 class，而不用去改原本計算面積的那段。
- **L — Liskov Substitution（里氏替換）**：子型別（subtype）必須能夠替換掉它的父型別而不破壞程式的正確性。也就是說，凡是用到父類別的地方，換成子類別都應該還能正常運作，子類別不該偷偷違反父類別承諾的行為。
- **I — Interface Segregation（介面隔離）**：不要強迫一個物件去依賴它用不到的方法。與其設計一個龐大、什麼都包的介面，不如拆成多個小而專一的介面，讓使用者只依賴自己真正需要的部分。
- **D — Dependency Inversion（依賴反轉）**：高階模組不應該直接依賴低階模組，兩者都應該依賴「抽象」。白話說，就是讓你的邏輯依賴一個抽象的約定（例如「一個能儲存資料的東西」），而不是寫死依賴某個具體實作（例如「這一款特定的資料庫」），這樣抽換底層實作時上層才不用跟著改。

SOLID 常被拿來討論，但對 The Odin Project 現階段而言，**SRP 是五者中最實用、最該先掌握的**。其餘四個先有印象即可，不必背誦。

### 鬆散耦合的物件（Loosely coupled objects）

你的所有物件終究要協同運作，才能組成一個完整的應用程式。但你應該盡量讓每個物件都能**獨立存在**。

先定義反面詞：**緊密耦合（tightly coupled）**的物件，是指彼此依賴到「動一個就得跟著大改另一個」的程度——這在維護時是一場惡夢。**鬆散耦合（loosely coupled）**則相反：物件之間只透過清楚、最小的介面互動，替換其中一個時，另一個幾乎不受影響。

這條原則和 SRP 關係密切，但切入的角度不同。SRP 談的是「一個物件內部裝了什麼」，耦合談的是「物件與物件之間如何連接」。舉例來說，如果我們在寫一個遊戲，日後想把使用者介面（UI）整個換掉，理想狀態是：**我們能只改 UI，而完全不動遊戲邏輯**。實務上這意味著——你大可以先只用 `console.log()` 把整個遊戲玩通，之後再把一堆 DOM 函式加進去，而過程中完全不用碰核心的遊戲邏輯。如果你辦得到，代表你的 UI 和邏輯是鬆散耦合的；如果你被迫大改邏輯才能換 UI，那它們就耦合得太緊了。

判斷耦合的一個簡單自問：「如果我把物件 A 刪掉或整個換掉，物件 B 需要跟著改幾行？」需要改的愈少，耦合就愈鬆。

### 組合優於繼承（Composition over inheritance）

物件導向初學者常誤以為 inheritance（繼承）是重複利用程式碼的主要手段——一看到兩個 class 有共通點，就想抽一個父類別讓它們繼承。但業界一條被廣泛認可的準則是：**優先使用組合（composition），而非繼承（inheritance）**。

先分清兩者：

- **繼承是「is-a」關係**：`Dog` **是一種** `Animal`，所以 `Dog extends Animal`。子類別自動獲得父類別的全部行為。
- **組合是「has-a」關係**：一個物件**擁有**其他小物件（或函式）作為零件，把功能「拼裝」出來，而不是「繼承」出來。

繼承的問題在於它會把類別綁進一棵僵硬的階層樹（hierarchy）。經典的翻車例子是「機器人／殺人機器人」問題：假設你有一個 `Robot` 父類別，底下衍生出會走路、會說話的機器人。有天你要加一種 `MurderRobot`（會攻擊的機器人）。攻擊功能該放哪？如果你又想要一個「會清潔但不會攻擊」的 `CleaningRobot`，你會發現把 `attack()` 放進 `Robot` 父類別會讓清潔機器人也莫名其妙帶有攻擊力；但若放進子類別，又會在不同分支間重複實作。階層一深，這種「功能該塞在樹的哪一層」的兩難就層出不窮——這叫**脆弱基底類別（fragile base class）**問題：改動父類別，會以你難以預料的方式波及所有子孫。

組合的解法是：把每種能力（會走路、會說話、會攻擊）都寫成一個獨立的小函式或小物件，然後**按需要把它們拼進**某個物件。要一個會走路、會攻擊的機器人？就把「走路」和「攻擊」兩個能力組進去；要一個只會清潔的？就只組「清潔」。能力之間彼此獨立、可自由搭配，不必被階層樹綁死。這種做法更有彈性，也更符合鬆散耦合的精神。

順帶一提 JavaScript 的特殊之處：JS 的物件關聯其實是靠 **prototype chain（原型鏈）**運作，它的本質比較接近**委派（delegation）**而不是傳統的類別繼承——每一層都是獨立的物件，透過 `__proto__` 連結，而且可以在執行期（runtime）被替換。這種底層機制本身就比「一次性複製父類別」的古典繼承更靈活，某種程度上更貼近組合的思路。`class` 語法只是鋪在 prototype 之上的一層糖衣（syntactic sugar）。

這不代表繼承一無是處，而是說：當你猶豫要用繼承還是組合時，**預設先考慮組合**，只有在真的存在穩固、不太會變動的「is-a」關係時，才動用繼承。

## 程式碼範例

下面用一段最小、可直接在 Node.js 或瀏覽器 Console 執行的程式，示範「組合優於繼承」如何解決前面提到的機器人難題。

```javascript
// 每一種「能力」都是一個獨立的小工廠函式，
// 它接收一個 state（狀態物件），回傳一組相關的方法。
// 這就是「組合」的零件。

const canWalk = (state) => ({
  walk: () => console.log(`${state.name} 正在走路`),
});

const canAttack = (state) => ({
  attack: () => console.log(`${state.name} 發動攻擊，威力 ${state.power}`),
});

const canClean = (state) => ({
  clean: () => console.log(`${state.name} 正在清潔地板`),
});

// 用 Object.assign 把需要的能力「拼裝」進物件。
// 殺人機器人：會走路 + 會攻擊
const createMurderRobot = (name) => {
  const state = { name, power: 100 };
  return Object.assign({}, canWalk(state), canAttack(state));
};

// 清潔機器人：會走路 + 會清潔（沒有攻擊能力）
const createCleaningRobot = (name) => {
  const state = { name };
  return Object.assign({}, canWalk(state), canClean(state));
};

const murderBot = createMurderRobot('殺手 3000');
murderBot.walk();   // 殺手 3000 正在走路
murderBot.attack(); // 殺手 3000 發動攻擊，威力 100

const cleaner = createCleaningRobot('掃地 1 號');
cleaner.walk();  // 掃地 1 號 正在走路
cleaner.clean(); // 掃地 1 號 正在清潔地板
// cleaner.attack(); // 會出錯：清潔機器人本來就不該有攻擊能力
```

重點是：能力（`canWalk`、`canAttack`、`canClean`）彼此獨立，可以自由搭配。要新增一種機器人，只要重新組合零件，不必去改動任何既有的 class，也不會有「攻擊功能該放樹的哪一層」的兩難——這同時體現了組合的彈性與 SRP 的職責分離。

下面再示範一段體現「單一職責」與「鬆散耦合」的骨架：把遊戲邏輯與畫面渲染徹底切開。

```javascript
// gameLogic：只負責邏輯，完全不知道 DOM 的存在。
const gameLogic = {
  winner: null,
  checkGameOver(board) {
    // 假設這裡算出勝負……
    // 只回傳結果，不決定「接下來要顯示什麼」
    return this.winner !== null;
  },
};

// DOMStuff：只負責把東西畫到畫面上。
const DOMStuff = {
  showGameOver(winner) {
    const div = document.createElement('div');
    div.classList.add('game-over');
    div.textContent = `${winner} 贏得了這場遊戲！`;
    document.body.appendChild(div);
  },
};

// 主迴圈負責「協調」：拿邏輯的結果，去決定要不要呼叫畫面。
function gameLoop(board) {
  if (gameLogic.checkGameOver(board)) {
    DOMStuff.showGameOver(gameLogic.winner);
  }
}
```

因為 `gameLogic` 完全不碰 DOM，你可以把 `DOMStuff.showGameOver` 換成 `console.log(...)`，遊戲照樣跑得動——這就是鬆散耦合帶來的自由。

## 常見陷阱

!!! warning "把 DOM 操作和應用邏輯攪在一起"
    這是初學者最常犯、也最傷可維護性的錯。當計分、判勝負的邏輯裡混著 `document.createElement`、`appendChild` 時，你就無法在不碰 UI 的情況下測試邏輯，也無法在不碰邏輯的情況下換 UI。務必把「算出結果」和「把結果畫出來」拆成兩個獨立的 module。

!!! warning "誤把「一個職責」理解成「一個方法」"
    SRP 不是要你把每個 class 都縮到只剩一個函式。一個物件可以有很多方法，只要它們都服務於**同一個職責**。判斷標準是「改變的理由」：如果你發現一個 class 會因為兩種毫不相干的原因被改動，那才是該拆的訊號。

!!! warning "看到共通點就急著用繼承"
    「兩個 class 有幾個一樣的方法」不足以構成用繼承的理由。繼承會把類別鎖進僵硬的階層樹，日後新增功能時常出現「這功能該塞在哪一層」的兩難，並帶來脆弱基底類別問題（改父類別意外波及子類別）。預設先想組合，只有存在穩固的「is-a」關係時才用繼承。

!!! warning "把原則當成鐵律"
    SOLID、鬆散耦合、組合優於繼承都是**指引**，不是必須無條件遵守的法律。過度拆分同樣會讓程式難懂（一堆只有兩行的檔案彼此跳來跳去）。實務上永遠有取捨，目標是「好維護、好理解、好替換」，而不是「教條上完美」。

## 練習

The Odin Project 這一課沒有要交付的專案（project），而是一份閱讀與觀看的作業（assignment），用來加深你對這些原則的直覺。建議照以下步驟進行：

1. **讀 Single Responsibility 的專文**：閱讀 Duncan McArdle 的〈SOLID principle #1: Single responsibility (JavaScript)〉。文章用一個 `Car` class 混入了日誌（logging）功能的例子，示範如何把日誌抽成獨立的 class，讓「日誌邏輯改變時只需要改一個地方」。這是對本課 SRP 段落的實作級補充。如果行有餘力，也可以順著這個系列把其餘四個 SOLID 原則讀完。
2. **看 SOLID 的程式範例影片**：觀看 Web Dev Simplified（WDS）的《The SOLID Design Principles》影片清單，它為五個原則各給了具體的 code 範例，能把抽象定義變得更好懂。
3. **讀「耦合」專文**：閱讀〈How to Write Highly Scalable and Maintainable JavaScript: Coupling〉，它把「鬆散耦合」講得很清楚，補足本課關於物件間依賴關係的討論。
4. **看「組合優於繼承」影片**：觀看 FunFunFunction 的〈Favoring Composition Over Inheritance〉，它會用生動的例子（正是本課提到的機器人問題）說明為什麼組合通常比繼承更好。
5. **回頭檢視自己的舊專案**：這一步最有價值。挑一兩個你以前寫過的專案，對照本課的原則自問——DOM 操作有沒有和邏輯混在一起？哪些物件耦合得太緊，換掉一個就得大改另一個？哪裡用了繼承、其實用組合會不會更清爽？把觀察記下來，並在下一個新專案裡刻意實踐。

完成後，試著用自己的話回答下列 knowledge check 問題，確認你真的理解了：

- 什麼是「單一職責原則（Single Responsibility Principle）」？
- 其餘的 SOLID 原則分別是什麼？
- 什麼是「緊密耦合（tightly coupled）」的物件，我們為什麼要避免它？
- 為什麼建議「組合優於繼承（composition over inheritance）」？

## 原文與延伸資源

- 原文：[OOP Principles](https://www.theodinproject.com/lessons/node-path-javascript-oop-principles)
- 本課引用：
  - [SOLID principle #1: Single responsibility (JavaScript) — Duncan McArdle](https://duncan-mcardle.medium.com/solid-principle-1-single-responsibility-javascript-5d9ce2c6f4a5)
  - [Object-oriented programming — MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Advanced_JavaScript_objects/Object-oriented_programming)（封裝、繼承、多型與 prototype 委派的說明）
  - [How to Write Highly Scalable and Maintainable JavaScript: Coupling](https://web.archive.org/web/20170215102316/http://www.innoarchitech.com:80/scalable-maintainable-javascript-coupling)
  - [The SOLID Design Principles — Web Dev Simplified](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH9kocFX7R7BAe_CvvOCO_p9)
  - [Favoring Composition Over Inheritance — FunFunFunction](https://www.youtube.com/watch?v=wfMtDGfHWpA)

---

> 本講義改寫自 The Odin Project《OOP Principles》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
