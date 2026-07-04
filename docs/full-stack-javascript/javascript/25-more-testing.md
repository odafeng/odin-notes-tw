---
title: 更多測試
source_url: https://www.theodinproject.com/lessons/node-path-javascript-more-testing
source_file: vendor/curriculum/javascript/testing_javascript/more_testing.md
path: full-stack-javascript
course: JavaScript
order: 25
generated: 2026-07-03
---

# 更多測試

> 改寫自 The Odin Project：[More Testing](https://www.theodinproject.com/lessons/node-path-javascript-more-testing)
> ｜Full Stack JavaScript › JavaScript › Testing JavaScript

## 核心概念

### 隔離（isolation）：一次只測一個東西

測試最基本、也最重要的一個觀念叫做「隔離（isolation）」。理想上，你一次只測試一個 method（方法）或一個 function（函式），而且針對某個 function 的測試，不應該依賴另一個 function 是否正確運作，尤其當那個 function 本身已經在別的地方被測試過。

為什麼要這麼堅持？因為當測試失敗時，你希望能「盡快縮小失敗原因的範圍」。如果一個測試同時牽涉好幾個 function，紅燈亮起時你根本分不清到底是哪一個環節壞了。相反地，若每個測試都只鎖定單一行為，一旦失敗，你幾乎能立刻指出問題出在哪一行程式。隔離就是把「除錯範圍」壓到最小的手段。

當然這是一個「理想」，實務上不一定總是做得到或值得做，但它是你評估測試品質時的北極星。

### 緊耦合程式碼（tightly coupled code）為什麼難測

**緊耦合程式碼（tightly coupled code）** 指的是：你所有的 function 裡都塞滿了對其他部分程式的呼叫，整段程式又混雜著大量 DOM（文件物件模型）操作或 `console.log()`。各個部分緊緊黏在一起、彼此依賴，牽一髮而動全身。

這種程式碼非常難測。看看這個猜數字遊戲：

```javascript
function guessingGame() {
  const magicNumber = 22;
  // prompt 會跳出瀏覽器對話框、等使用者輸入
  const guess = prompt('猜一個 1 到 100 之間的數字！');
  if (guess > magicNumber) {
    alert('你猜的太大了');
  } else if (guess < magicNumber) {
    alert('你猜的太小了');
  } else if (guess == magicNumber) {
    alert('你答對了！🎉');
  } else {
    return 'INVALID INPUT';
  }
}
```

要替這個 function 寫測試幾乎無從下手：它一啟動就跳出 `prompt` 對話框卡住等人輸入，判斷完又用 `alert` 把結果彈出去。這兩件事都無法用程式輕鬆自動驗證，而真正值得測試的「數字比大小的邏輯」就被埋在這堆瀏覽器 API 之中，拆不出來。

### 純函式（pure function）：讓程式天生好測

要解決緊耦合，最好的辦法是把「純邏輯」從外部依賴裡拆出來，寫成 **純函式（pure function）**。一個 function 要稱得上「純」，必須同時滿足兩個條件：

1. **相同輸入永遠得到相同輸出**：它的回傳值只由參數（arguments）決定，不依賴任何外部狀態（像全域變數、目前時間、隨機值、DOM 的內容）。
2. **沒有副作用（side effect）**：執行過程中不去改動函式外部的任何東西，也不做任何「可被外界觀察到」的動作。

**副作用（side effect）** 就是「函式對外部世界造成的影響」：修改全域變數、改動傳進來的物件或陣列、操作 DOM、`console.log`、發送網路請求、寫檔案、跳出 `alert` 等等，都算副作用。純函式像一台計算機：給它同樣的輸入，它永遠吐出同樣的輸出，過程中不碰外面任何東西。

在測試時「辨識副作用」之所以重要，是因為副作用正是讓測試變難、變不穩定的來源。一個沒有副作用、輸入輸出清楚的 function，測試時只要「餵輸入、比對輸出」就好；反之，帶副作用的 function 你得先費力搭好外部環境（開網頁、塞資料、攔截網路），測完還要收拾乾淨，稍有不慎測試就會時綠時紅。

現在把上面的遊戲改寫，把邏輯抽成純函式：

```javascript
// 純函式：只吃參數、只回傳字串，不碰瀏覽器
function evaluateGuess(magicNumber, guess) {
  if (guess > magicNumber) {
    return '你猜的太大了';
  } else if (guess < magicNumber) {
    return '你猜的太小了';
  } else if (guess == magicNumber) {
    return '你答對了！🎉';
  } else {
    return 'INVALID INPUT';
  }
}

// 不純的殼：負責跟瀏覽器互動（prompt / alert）
function guessingGame() {
  const magicNumber = 22;
  const guess = prompt('猜一個 1 到 100 之間的數字！');
  const message = evaluateGuess(magicNumber, guess);
  alert(message);
}
```

改寫後，真正需要測試的只剩 `evaluateGuess`：它有清楚的輸入、清楚的輸出，不呼叫任何外部 function，測起來輕而易舉。至於 `prompt` 和 `alert`，它們是瀏覽器內建的東西，寫它們的人早就測過了，我們不必（也無法）替它們寫測試——我們只需要相信它們能正常運作。

這個版本不只好測，還更好擴充：想把 `prompt`／`alert` 換成操作 DOM 的介面很容易；想讓玩家可以猜好幾次也很容易，因為核心邏輯已經獨立出來了。

這帶出 TDD（Test-Driven Development，測試驅動開發）一個不那麼明顯卻很珍貴的好處：**它會逼你寫出更好的程式架構**。如果你一開始就用 TDD 開發這個遊戲，因為你得先想「這要怎麼測」，你八成一開始就會寫成第二種（拆出純函式）的樣子。TDD 鼓勵你寫純函式，而純函式讓程式更模組化、更容易維護。

### 「先解耦，不行才 mock」：mocking 是什麼

拆出純函式是首選，但現實中不是每次都拆得乾淨。當程式碼「就是」得依賴某個外部東西（例如一定要從 DOM input 取值、或一定要打 API），第二個辦法就是 **mocking（模擬）**。

Mocking 指的是：寫一個「假的」版本來替換掉真正的 function 或依賴，這個假貨的行為完全由你掌控——你叫它回傳什麼它就回傳什麼。舉例來說，如果你要測一個「從 DOM input 讀值再做處理」的 function，你其實不想為了跑測試而真的架一個網頁、動態塞值進輸入框。這時你可以做一個「假的取值 function」，讓它固定回傳某個值，然後在測試裡用這個假貨。這樣你就能專心測「拿到值之後的處理邏輯」，而不被 DOM 拖累。

Mock 除了能「假造回傳值」，還有一個很有用的能力：**記錄自己被怎麼呼叫**——被叫了幾次、每次帶什麼參數。這讓你可以驗證「某個 function 有沒有被正確地呼叫」，這是純輸入輸出測不到的東西。不過「驗證呼叫」要用得節制：它適合用在**會產生副作用的對外呼叫**（例如儲存資料、發送通知這類 command，命令訊息），因為那個副作用正是你關心的結果。反過來說，一個**沒有副作用的對外訊息（outgoing message）**——單純向外查詢取個值、不改變任何東西——就不必驗證它有沒有被呼叫：它對外界沒有可觀察的影響，回傳值的正確性該由「被呼叫的那個 function」自己的測試負責；硬去斷言這種呼叫，只是把測試綁死在實作細節上，重構時徒增紅燈。

### 用 Jest 的 mock function

Jest 內建 `jest.fn()` 讓你快速造一個 mock function。它會偷偷記下所有呼叫紀錄，存在 `.mock` 屬性裡：

```javascript
const mockFn = jest.fn();
mockFn(10, 'test');

mockFn.mock.calls;       // [[10, 'test']] — 每次呼叫的參數陣列
mockFn.mock.calls[0][0]; // 10 — 第一次呼叫的第一個參數
mockFn.mock.results;     // [{ type: 'return', value: undefined }]
```

搭配 Jest 的 matcher（比對器），可以直接斷言呼叫行為：

```javascript
expect(mockFn).toHaveBeenCalled();               // 有被呼叫過嗎？
expect(mockFn).toHaveBeenCalledWith(10, 'test'); // 有用這些參數被呼叫過嗎？
```

你也能指定 mock 的回傳值，讓被測程式在受控的環境下執行：

```javascript
const getValue = jest.fn();
getValue.mockReturnValue(true);      // 之後每次呼叫都回傳 true
getValue.mockReturnValueOnce(10);    // 只有「下一次」呼叫回傳 10
```

### setup 與 teardown：beforeEach / afterEach

當一組測試都需要相同的前置準備（例如初始化資料庫、建立假資料），把它抄在每個測試裡既囉唆又易錯。Jest 提供四個 hook（掛鉤）讓你集中處理：

- `beforeEach`：每一個測試「之前」都跑一次。
- `afterEach`：每一個測試「之後」都跑一次（常用來清理／還原狀態，避免測試互相污染）。
- `beforeAll`：整個檔案的所有測試「開始前」只跑一次。
- `afterAll`：整個檔案的所有測試「結束後」只跑一次。

`beforeEach`／`afterEach` 適合「每個測試都要重新來一次」的乾淨初始化；`beforeAll`／`afterAll` 適合「昂貴、且各測試可共用」的一次性準備。這些 hook 也可以放進 `describe` 區塊裡，那樣它就只作用於該區塊內的測試——這讓你能替不同群組的測試設定不同的前置條件。

## 程式碼範例

一個可執行的 Jest 測試檔，示範 setup/teardown、純函式測試，以及 mock function：

```javascript
// game.js
function evaluateGuess(magicNumber, guess) {
  if (guess > magicNumber) return 'TOO_BIG';
  if (guess < magicNumber) return 'TOO_SMALL';
  if (guess == magicNumber) return 'CORRECT';
  return 'INVALID';
}

// playRound 依賴一個外部的「取值函式」getInput
function playRound(getInput, magicNumber) {
  const guess = getInput();          // 從外部拿輸入（可能是 DOM、可能是 prompt）
  return evaluateGuess(magicNumber, guess);
}

module.exports = { evaluateGuess, playRound };
```

```javascript
// game.test.js
const { evaluateGuess, playRound } = require('./game');

describe('evaluateGuess（純函式）', () => {
  let magicNumber;

  // 每個測試前重設 magicNumber，確保測試彼此隔離
  beforeEach(() => {
    magicNumber = 22;
  });

  test('猜太大回傳 TOO_BIG', () => {
    expect(evaluateGuess(magicNumber, 50)).toBe('TOO_BIG');
  });

  test('猜對回傳 CORRECT', () => {
    expect(evaluateGuess(magicNumber, 22)).toBe('CORRECT');
  });
});

describe('playRound（用 mock 隔離外部依賴）', () => {
  test('用 mock 取代取值函式，專心測邏輯', () => {
    // 造一個假的 getInput，固定回傳 22，不必真的架 DOM
    const fakeInput = jest.fn().mockReturnValue(22);

    const result = playRound(fakeInput, 22);

    expect(result).toBe('CORRECT');
    expect(fakeInput).toHaveBeenCalledTimes(1); // 也能驗證它被呼叫了
  });
});
```

執行 `npx jest game.test.js`，三個測試都會通過。注意 `playRound` 的測試完全沒碰瀏覽器——mock 把外部依賴換成了你完全掌控的假貨。

## 常見陷阱

!!! warning "把不屬於自己的東西也拿去測"
    `prompt`、`alert`、`axios`、`fetch` 這類第三方或瀏覽器內建的功能，不是你的責任——寫它們的人已經測過了。你要測的是「你自己寫的邏輯」。對這些外部依賴，正確做法是把它們隔離掉（拆成純函式）或 mock 掉，而不是為它們補測試。

!!! warning "測「怎麼做（實作）」而不是「做了什麼（結果）」"
    測試應該綁在「行為與結果」上，而不是內部實作細節。如果你的測試死盯著某個私有步驟或內部呼叫順序，那麼只要你重構（結果沒變、寫法變了），測試就會無謂地變紅。這種測試不但沒保護到你，還會拖慢重構。優先測「給定輸入得到什麼輸出」這種對外可見的契約。

!!! warning "測試之間互相污染狀態"
    如果前一個測試改動了共用狀態（全域變數、資料庫、mock 的呼叫紀錄）卻沒清乾淨，下一個測試可能會因此莫名其妙地紅或綠。用 `afterEach` 還原、或在 `beforeEach` 重新初始化，確保每個測試都在乾淨的起點執行。這正是「隔離」的實務落地。

## 練習

Assignment（動手做）：

1. 讀一篇關於「純函式價值」的短文（原文連結指向 James Jeffery 的 [What are Pure Functions?](https://medium.com/@jamesjefferyuk/javascript-what-are-pure-functions-4d4d5392d49c)）。重點抓住兩個判準：相同輸入相同輸出、沒有副作用。
2. 看一支關於「測試中的 mocks」的影片（原文提供的 YouTube 連結）。理解 mock 如何替換外部依賴、如何記錄呼叫。
3. 現在你已經有 TDD 的實作經驗了，去讀 Jest 官方文件的 [Setup and Teardown](https://jestjs.io/docs/setup-teardown) 一節，把 `beforeEach`／`afterEach`／`beforeAll`／`afterAll` 弄熟。
4. 讀 Jest 官方文件的 [Mock Functions](https://jestjs.io/docs/mock-functions)，動手玩過 `jest.fn()`、`mockReturnValue`、`toHaveBeenCalledWith`。
5. 看一支「該測什麼、不該測什麼」的影片（原文連結，講者以 Ruby 舉例，但觀念跨語言通用）：測「進來的查詢訊息（incoming query）」比對回傳值、不要測實作、通常不需直接測私有方法、對「沒有副作用的對外訊息」不必特別測。

建議動手驗證：把本課「程式碼範例」的 `game.js` 與 `game.test.js` 建起來，跑 `npx jest`，再故意把 `evaluateGuess` 的某個判斷改錯，觀察是哪一個測試變紅——體會「隔離」如何幫你一眼定位問題。

## 原文與延伸資源

- 原文：[More Testing](https://www.theodinproject.com/lessons/node-path-javascript-more-testing)
- 本課引用：
  - Jest 官方文件 — [Mock Functions](https://jestjs.io/docs/mock-functions)
  - Jest 官方文件 — [Setup and Teardown](https://jestjs.io/docs/setup-teardown)
  - James Jeffery — [JavaScript: What Are Pure Functions?](https://medium.com/@jamesjefferyuk/javascript-what-are-pure-functions-4d4d5392d49c)

---

> 本講義改寫自 The Odin Project《More Testing》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
