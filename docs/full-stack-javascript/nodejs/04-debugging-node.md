---
title: 為 Node 除錯
source_url: https://www.theodinproject.com/lessons/nodejs-debugging-node
source_file: vendor/curriculum/nodeJS/introduction_to_nodeJS/debugging_node.md
path: full-stack-javascript
course: NodeJS
order: 4
generated: 2026-07-04
---

# 為 Node 除錯

> 改寫自 The Odin Project：[Debugging Node](https://www.theodinproject.com/lessons/nodejs-debugging-node)
> ｜Full Stack JavaScript › NodeJS › Introduction to NodeJS

## 核心概念

在前端階段，你多半靠瀏覽器的 DevTools 來抓 bug。但當程式跑在伺服器端（server-side）、由 Node 執行時，並沒有一個瀏覽器視窗可以給你打開 DevTools。這一課要學的，就是用 VS Code 內建的 Node debugger（除錯器），直接在編輯器裡除錯——這會是你往後每天都會用到的核心工具。

### 為什麼要用 debugger，而不是一直 console.log

很多人除錯的第一反應是到處插 `console.log`，印出變數看看。這招在小地方很快，但一旦邏輯複雜就會力不從心：你得反覆修改程式、重跑、再刪掉那些 log，而且一次只能看到你「事先想到要印」的東西。

debugger 的做法完全不同。它能讓程式**在你指定的那一行暫停下來**，此刻整個程式的狀態都凍結在眼前：每個變數當下的值、函式是被誰呼叫進來的（呼叫堆疊）、程式接下來會往哪走。你可以一行一行往下走、隨時查看任何變數、甚至在暫停時輸入運算式試算。等於是把跑動中的程式按下暫停鍵，走進去現場勘查。學會它，你找 bug 的速度會有質變。

### 中斷點（breakpoint）：叫程式停在這裡

除錯的起點是**中斷點（breakpoint）**。在 VS Code 裡，打開你要除錯的 `.js` 檔案，把滑鼠移到某一行左邊的行號旁邊，會浮出一個淡紅色圓點，點一下就設下一個中斷點（快捷鍵是 `F9`）。當程式在 debug 模式下執行到這一行時，就會**在執行這行之前暫停**。

中斷點還有兩種進階版，右鍵點行號旁邊即可設定：

- **條件中斷點（conditional breakpoint）**：只有當你寫的運算式為 `true` 時才暫停。例如迴圈跑一千圈，你只想在 `i === 500` 時停下來看，就設條件 `i === 500`，不必手動按五百次繼續。
- **Logpoint**：不暫停程式，只在經過時印出一段訊息到主控台。用大括號插入變數，例如 `目前的值是 {user.name}`。它等於是「不改動原始碼、也不會卡住程式」的 `console.log`。

### 啟動除錯：JavaScript Debug Terminal 是最快的方式

VS Code 有好幾種啟動 Node 除錯的方式，其中**最簡單、最推薦入門用的是 JavaScript Debug Terminal（JavaScript 除錯終端機）**。

打開命令面板（macOS 按 `⌘⇧P`，Windows／Linux 按 `Ctrl+Shift+P`），輸入並選擇 **Debug: Create JavaScript Debug Terminal**，就會開啟一個特別的終端機。在這個終端機裡，**任何**你執行的 Node 程序都會自動接上 debugger——你只要照平常那樣輸入 `node app.js`，程式就會在你設的中斷點停下來，不需要任何額外設定。這是它最迷人的地方：零設定、直覺、跟你原本的指令習慣完全一致。

另外兩種方式做個認識即可：

- **Run and Debug 檢視**：側邊欄的除錯圖示（`⇧⌘D` ／ `Ctrl+Shift+D`）打開後，直接按 `F5`（或畫面上的綠色播放鍵）就能開始除錯目前的檔案。
- **Auto Attach（自動附加）**：從命令面板執行 **Toggle Auto Attach** 打開後，連 VS Code 內建的一般終端機裡跑的 Node 程序也會自動接上 debugger。

### 程式停下來以後：面板與逐步執行

當程式在中斷點暫停，Run and Debug 檢視會出現幾個關鍵面板，這些就是你的「勘查現場」：

- **Variables（變數）**：顯示目前作用域（scope）裡所有變數的即時值，包含區域與全域變數，可以展開物件看內部結構。
- **Watch（監看）**：把你關心的特定變數或運算式釘在這裡，隨著程式前進持續盯著它的變化。
- **Call Stack（呼叫堆疊）**：顯示「程式是怎麼一路呼叫到現在這一行的」。最上面是目前的函式，往下是呼叫它的函式，一層層回溯，讓你看清執行路徑。
- **Breakpoints（中斷點）**：列出所有中斷點，可以逐一開關或停用。

暫停時，畫面上方會浮出一排**除錯工具列（debug toolbar）**，用來控制程式接下來怎麼走。這幾個「逐步執行」按鈕是除錯的核心操作，一定要熟：

- **Continue（繼續，`F5`）**：放程式繼續跑，直到下一個中斷點或結束。
- **Step Over（單步跳過，`F10`）**：執行目前這一行；如果這行呼叫了函式，會把整個函式跑完但**不進去**，停在下一行。
- **Step Into（單步進入，`F11`）**：如果目前這行呼叫了函式，就**走進**那個函式的內部，停在它的第一行。用來深入追查某個函式到底做了什麼。
- **Step Out（單步跳出，`⇧F11` ／ `Shift+F11`）**：把目前這個函式剩下的部分跑完，回到呼叫它的地方。當你發現「進錯函式了」或「這函式沒問題」時用它快速退出。
- **Restart（重新啟動）** 與 **Stop（停止）**：重跑或結束整個除錯工作階段。

還有一個好用的面板是 **Debug Console（除錯主控台）**。程式暫停時，你可以在這裡輸入任何運算式，它會用「當下的變數狀態」即時求值。想知道 `user.orders.length` 現在是多少？直接打進去按 Enter 就有答案，不必改程式重跑。

### skipFiles：別走進你不關心的程式

用 Step Into 時，常會不小心走進第三方套件或 Node 內建模組的原始碼，那些通常不是你的 bug 所在。VS Code 的 `skipFiles` 設定能讓 debugger 略過這些檔案，例如把 `node_modules` 底下與 Node 內部模組都跳過，逐步執行時就會自動繞過它們，讓你專注在自己的程式上。

### 進階：用 launch.json 客製除錯設定

當你需要固定的、可重複使用的除錯設定（例如每次都要帶特定的命令列參數或環境變數），可以在專案裡建立 `.vscode/launch.json` 檔。它用一個個「設定物件」描述如何除錯，常見欄位有：

- `type`：除錯類型，Node 專案填 `"node"`。
- `request`：`"launch"`（由 debugger 直接啟動你的程式）或 `"attach"`（附加到一個已經在跑的程序）。
- `name`：這組設定顯示的名稱。
- `program`：要執行的進入點檔案路徑（`launch` 模式用）。
- `args`：傳給程式的命令列參數陣列。
- `cwd`：程式執行時的工作目錄。
- `env`：要注入的環境變數（key／value）。
- `skipFiles`：逐步執行時要略過的檔案（glob 樣式）。

**launch 與 attach 的差別**值得記住：`launch` 是「你要 debugger 幫你把程式開起來」；`attach` 是「程式已經在跑了（例如你用 `node --inspect app.js` 啟動），請 debugger 連上去」。`--inspect-brk` 則會讓程式一啟動就先暫停，等 debugger 接上後才開始跑，適合除錯啟動階段的問題。入門階段你大多用不到 `launch.json`——JavaScript Debug Terminal 已經夠用；等專案變複雜、需要固定設定時再回頭學它即可。

## 程式碼範例

假設有一支有 bug 的小程式，本來想加總陣列，結果算錯了。用 debugger 就能一步步看出問題出在哪。

```javascript
// buggy.js — 在 JavaScript Debug Terminal 裡執行：node buggy.js
function sumArray(numbers) {
  let total = 0;
  // 在下面這一行的行號旁點一下設中斷點，程式會逐圈停在這
  for (let i = 0; i <= numbers.length; i++) {
    total += numbers[i]; // i 走到 length 時 numbers[i] 會是 undefined
  }
  return total;
}

const result = sumArray([10, 20, 30]);
console.log('加總結果：', result); // 預期 60，實際是 NaN
```

除錯流程：

1. 打開命令面板，選 **Debug: Create JavaScript Debug Terminal**。
2. 在 `total += numbers[i];` 那一行設中斷點。
3. 在該終端機輸入 `node buggy.js`，程式會在中斷點暫停。
4. 用 **Step Over（`F10`）** 一圈一圈往下走，同時盯著 **Variables** 面板裡的 `i` 和 `total`。
5. 當 `i` 變成 `3` 時，你會看到 `numbers[i]` 是 `undefined`，`total` 從數字變成 `NaN`——bug 找到了：迴圈條件應該是 `i < numbers.length`，而不是 `i <= numbers.length`。

如果你想改用 `launch.json` 固定設定，最小的一份長這樣：

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug buggy.js",
      "program": "${workspaceFolder}/buggy.js",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

存檔後，到 Run and Debug 檢視選這組設定，按 `F5` 就會以除錯模式啟動 `buggy.js`。

## 常見陷阱

!!! warning "在普通終端機跑，中斷點不會生效"
    如果你在 VS Code 的一般整合終端機裡打 `node app.js`，除非有開 Auto Attach，否則 debugger 不會接上，中斷點就像不存在一樣。要嘛用 **JavaScript Debug Terminal**，要嘛用 Run and Debug 檢視按 `F5`，要嘛先打開 Auto Attach。

!!! warning "分不清 Step Over 與 Step Into"
    `Step Over（F10）` 會把目前這行的函式呼叫整個跑完但不進去；`Step Into（F11）` 會鑽進那個函式內部。想追某個函式裡到底發生什麼事卻按了 F10，就會直接跳過它、白忙一場。要進去查就用 F11。

!!! warning "逐步執行時一直掉進套件原始碼"
    用 Step Into 常會不小心走進 `node_modules` 或 Node 內建模組，那些幾乎都不是你的 bug。在 `launch.json` 設定 `skipFiles`（例如略過 `<node_internals>/**` 與 `node_modules`），debugger 就會自動跳過它們。

!!! warning "以為 Debug Console 的求值會改動程式"
    在 Debug Console 輸入運算式只是「用當下狀態即時求值」，方便你查看與試算；它不會真的改寫你的原始碼。想真正修正 bug，還是要回到檔案裡改程式並重跑。

## 練習

本課以「熟悉 VS Code 的 Node debugger」為目標，動手做過一次就會了：

1. 看一段官方影片教學，實際觀察除錯流程長什麼樣子：[Node.js debugging in VS Code（YouTube）](https://www.youtube.com/watch?v=2oFKNL7vYV8&ab_channel=VisualStudioCode)。
2. 讀 VS Code 官方的 [Node.js 除錯文件](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)，特別留意 **JavaScript Debug Terminal**——這是最省事的啟動方式。
3. 自己動手：把上面「程式碼範例」的 `buggy.js` 建出來，用 JavaScript Debug Terminal 執行，練習設中斷點、用 `F10` ／ `F11` 逐步執行、觀察 Variables 面板，親眼看著 `total` 變成 `NaN`，把 bug 抓出來並修好。
4. 加碼練習：把中斷點換成**條件中斷點**（條件設 `i === 3`），感受它如何直接停在你要的那一圈；再試試 **Logpoint**，不暫停程式就印出 `i` 的值。

知識檢核：你能回答「可以用什麼來為 Node 除錯」嗎？答案就是 VS Code 內建的 Node debugger（搭配 JavaScript Debug Terminal、中斷點與逐步執行）。若還說不清楚，回到上面「核心概念」複習即可，不需要死背。

## 原文與延伸資源

- 原文：[Debugging Node](https://www.theodinproject.com/lessons/nodejs-debugging-node)
- 本課引用：
    - [Node.js debugging in VS Code（官方影片教學）](https://www.youtube.com/watch?v=2oFKNL7vYV8&ab_channel=VisualStudioCode)
    - [VS Code 官方文件：Node.js debugging](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)

---

> 本講義改寫自 The Odin Project《Debugging Node》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
