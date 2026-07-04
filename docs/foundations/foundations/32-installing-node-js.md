---
title: 安裝 Node.js
source_url: https://www.theodinproject.com/lessons/foundations-installing-node-js
source_file: vendor/curriculum/foundations/javascript_basics/installing_nodejs.md
path: foundations
course: Foundations
order: 32
status: draft
generated: 2026-07-03
---

# 安裝 Node.js

> 改寫自 The Odin Project：[Installing Node.js](https://www.theodinproject.com/lessons/foundations-installing-node-js)
> ｜Foundations › JavaScript Basics

## 核心概念

### Node.js 是什麼

到目前為止，你寫的 JavaScript 都跑在瀏覽器裡：打開網頁、按下 F12 開啟開發者工具的 console（主控台），輸入程式碼就能執行。這是因為每個現代瀏覽器內部都內建了一個 JavaScript engine（引擎，例如 Chrome 的 V8），負責把你的 JS 程式碼變成電腦看得懂的指令並執行。

**Node.js**（常簡稱 Node）是一個 JavaScript runtime environment（執行環境），它把瀏覽器裡那顆 V8 引擎抽出來，讓 JavaScript 可以**脫離瀏覽器、直接在你的作業系統上執行**。換句話說，有了 Node，你不再需要開一個網頁才能跑 JS，而是能像使用 Python 或 Ruby 那樣，在終端機（terminal）裡直接執行 `.js` 檔案。

這件事之所以重要，是因為後續好幾課的練習都需要在瀏覽器之外執行 JavaScript：跑測試（test）、執行練習題的自動評分、使用各式命令列工具等等，全都仰賴 Node。所以這一課的目標很單純，就是把 Node 安裝好，為之後的課程鋪路。

好消息是：這一課幾乎沒有需要「理解」的艱深概念，重點在於**照著步驟把工具裝起來，並分清楚三個名字相近但職責不同的工具**。

### 三個容易搞混的名字：nvm、Node、npm

初學時最常見的混亂，就是把 nvm、Node、npm 這三個名字搞混。先把它們的分工記清楚：

- **Node（Node.js）**：真正的執行環境。你之後執行 JavaScript，靠的就是它。
- **nvm（Node Version Manager，Node 版本管理器）**：用來「安裝與切換不同版本 Node」的工具。它本身不是 Node，而是管理 Node 的管家。
- **npm（Node Package Manager，Node 套件管理器）**：用來安裝 JavaScript 生態系裡各種 library（函式庫）與工具的套件管理器。你不用另外安裝它 —— **安裝 Node 時，npm 會一起被裝上**。

用一個比喻來記：如果 Node 是一台特定型號的車，那麼 **nvm 是幫你挑車、換車的車行**，而 **npm 是車上內建、用來加購配件的採購系統**。這一課我們會用 nvm 來安裝 Node（車行幫你交車），npm 則會順帶一起安裝，等到之後的課程才真正用到。

### 為什麼要透過 nvm 安裝，而不是直接下載 Node

你其實可以到 Node 官網直接下載安裝檔。但這門課刻意選擇先裝 nvm、再用 nvm 裝 Node，原因是**版本管理的彈性**：

- 不同專案可能需要不同版本的 Node，nvm 讓你用一行指令就切換。
- Node 更新頻繁，用 nvm 升級遠比重新下載安裝檔輕鬆。
- 官方安裝檔通常需要系統管理員權限（sudo），而 nvm 是**per-user（單一使用者）** 安裝在你的家目錄底下，不會動到整台機器的系統設定，較為乾淨、也較不容易出權限問題。

nvm 本身是一個 POSIX 相容的 bash script（腳本）。安裝它時，官方提供的 script 會把 nvm 複製到你家目錄下的 `~/.nvm` 資料夾，並嘗試在你的 shell profile（設定檔，例如 `~/.zshrc` 或 `~/.bashrc`）裡加上幾行載入設定，讓你每次開新的終端機視窗時，`nvm` 指令都能立即可用。

### LTS 版本是什麼，為什麼一定要裝它

安裝 Node 時，你會看到 `--lts` 這個選項，這是這一課**唯一一個需要記住的觀念**。

**LTS** 是 **Long-Term Support（長期支援）** 的縮寫。Node 每隔一段時間就會推出新版本，其中被標記為 LTS 的版本，官方保證會提供**約三十個月的支援與維護**。相較於最新的非 LTS 版本（有時稱為 Current 版），LTS 版本：

- 更穩定，較少出現實驗性、可能隨時變動的功能。
- 與生態系中大量的 package 相容性更好。

因此本課程明確要求：**請安裝 LTS 版本，不要安裝絕對最新的版本**。如果你裝了最前沿的 Current 版，之後在安裝課程需要的 package 時，很可能踩到相容性問題，出現難以理解的錯誤。這也正是本課 knowledge check 的重點問題之一：「應該裝最新版還是最新的 LTS 版？」答案是 **最新的 LTS 版**。

### npm 的 min-release-age 安全設定

在裝好 Node 與 npm 之後，本課還會請你設定一個 npm 的選項：`min-release-age`（最小釋出天數）。這是 npm v11.10.0 引入的設定，作用是**延遲安裝「剛釋出不久」的相依套件**。

當你把它設成 `3`，npm 就不會安裝在三天內才發布的套件版本。這麼做的用意是防範 **supply chain attack（供應鏈攻擊）**：近年常有攻擊者入侵某個熱門套件的維護者帳號，偷偷發布一個含惡意程式碼的新版本。這類被動手腳的版本，通常會在釋出後很短時間內就被社群發現並下架。刻意「晚三天」再安裝，能讓你自動跳過那段最危險的空窗期，是一個成本極低、效益不錯的自保習慣。

### Node REPL：終端機裡的互動主控台

安裝完成後，Node 附贈一個好用的小工具：**REPL**。REPL 是 **Read–Eval–Print Loop（讀取–求值–輸出 迴圈）** 的縮寫，本質上就是一個**互動式主控台**，讓你在終端機裡即時輸入並執行 JavaScript，效果就跟你在瀏覽器 console 裡打字很像。

它非常適合用來快速測試小段程式碼或除錯 —— 想確認 `2 ** 10` 是多少、或某個字串方法回傳什麼，不必特地開一個網頁，直接在終端機打 `node` 進入 REPL 試一下即可。輸入 `.exit`（或按兩次 Ctrl + C）就能離開。

## 程式碼範例

以下指令都在**終端機**裡輸入。註解以繁體中文標示，`#` 之後為說明文字，不需要跟著打進去。

### 安裝 nvm（以官方 script 為例）

```bash
# 用 curl 下載並執行 nvm 官方安裝腳本（版本號請以官方最新為準）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash

# 安裝完成後，關閉再重新開啟終端機，或手動載入 nvm：
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 驗證 nvm 是否安裝成功，若成功會印出 nvm
command -v nvm
```

### 用 nvm 安裝並啟用 Node（LTS 版）

```bash
# 安裝最新的 LTS 版 Node，過程會有大量輸出屬正常現象
nvm install --lts

# 告訴 nvm 這個終端機要「使用」剛裝好的 LTS 版
nvm use --lts

# 確認 Node 版本，會看到類似 v24.xx.x 的字樣
node -v

# 確認 npm 版本（安裝 Node 時會一併裝好 npm）
npm -v
```

### 設定 npm 的安全延遲

```bash
# 拒絕安裝三天內才釋出的相依套件，降低供應鏈攻擊風險
npm config set min-release-age=3
```

### 執行第一段 Node 程式碼與進入 REPL

先用一個獨立的 `.js` 檔驗證 Node 真的能跑 JavaScript：

```javascript
// 檔名：hello.js
// 這一行會直接印在終端機，而不是瀏覽器 console
console.log("Hello from Node.js!");
```

```bash
# 在檔案所在資料夾執行，終端機會印出 Hello from Node.js!
node hello.js
```

也可以不寫檔案，直接進入 REPL 互動試玩：

```bash
# 只打 node（後面不接檔名）即可進入 REPL
node
```

```javascript
// 進入 REPL 後，逐行輸入，按 Enter 立刻看到結果
> 2 + 3
5
> "odin".toUpperCase()
'ODIN'
> .exit   // 輸入 .exit 離開 REPL，回到一般終端機
```

## 常見陷阱

!!! warning "把 nvm 和 npm 搞混"
    這兩個名字只差一個字母，職責卻完全不同：**nvm** 管理「Node 的版本」（裝哪一版、切換哪一版），**npm** 管理「JavaScript 的套件」（裝哪些 library）。安裝流程用的是 nvm；npm 是安裝 Node 時附帶送的，這一課還不會真正用到它。記錯了會在後面課程一直卡住。

!!! warning "安裝了最新版而不是 LTS 版"
    請務必使用 `nvm install --lts` 安裝 **LTS 版**，不要為了追新而裝最前沿的 Current 版。非 LTS 版與課程之後要安裝的套件相容性較差，容易冒出莫名其妙的錯誤。這也是本課 knowledge check 的標準答案：裝**最新的 LTS 版**。

!!! warning "command not found：nvm 或 node 找不到指令"
    這幾乎都是「shell 還沒重新載入設定」造成的。安裝完 nvm 後，設定檔裡新增的載入行還沒生效，所以終端機不認得 `nvm`。解法很簡單：**完全關閉終端機視窗，再重新開一個**，讓設定檔重新載入；或手動把 `export NVM_DIR=...` 那兩行貼進終端機執行一次。同理，若 `nvm install --lts` 失敗，先關掉終端機重開，再跑一次。

!!! warning "macOS 少了 .zshrc 檔"
    macOS 10.15 之後預設使用 zsh。若你的家目錄沒有 `~/.zshrc` 檔，nvm 的安裝腳本可能找不到地方寫入載入設定。安裝 nvm 前，先執行 `touch ~/.zshrc` 建立一個空的設定檔，可避免這個問題。

## 練習

跟著以下步驟把 Node 環境建好。過程中若卡住，先試「關閉終端機重開」這一招，通常就能解決。

1. **安裝 nvm。** 依你的作業系統選擇對應做法：
   - **macOS**：先執行 `touch ~/.zshrc` 確保設定檔存在，再用官方 script 安裝 nvm。安裝後關閉並重開終端機，執行 `command -v nvm` 應印出 `nvm`。
   - **Linux**：先確保系統有 `curl`（例如 `sudo apt update` 後 `sudo apt install curl`），再用官方 script 安裝 nvm。安裝後關閉並重開終端機，執行 `command -v nvm` 驗證。

2. **安裝 Node。** 在終端機執行 `nvm install --lts`，安裝最新的 LTS 版。你應該會在大量輸出中看到類似 `Downloading and installing Node vXX.xx.x...` 的訊息。若沒看到，關閉終端機重開後再跑一次。

3. **啟用 Node 版本。** 執行 `nvm use --lts` 告訴 nvm 使用 LTS 版。接著用 `node -v` 確認 Node 版本、`npm -v` 確認 npm 版本，兩者都印出版本號就代表 Node 與 npm 都安裝成功了。

4. **設定 npm 安全延遲。** 執行 `npm config set min-release-age=3`，讓 npm 不安裝三天內才釋出的相依套件，降低供應鏈攻擊風險。

5. **試玩 Node REPL。** 在終端機單獨輸入 `node` 進入 REPL，隨意打幾行 JavaScript（例如 `1 + 1`、`"hi".length`）看看即時結果，最後輸入 `.exit` 離開。

完成後，你就具備了在瀏覽器之外執行 JavaScript 的能力，可以繼續往後的課程了。

## 原文與延伸資源

- 原文：[Installing Node.js](https://www.theodinproject.com/lessons/foundations-installing-node-js)
- 本課引用：
  - [nvm（Node Version Manager）官方 GitHub](https://github.com/nvm-sh/nvm) — 安裝 script、shell 設定與常用指令
  - The Odin Project 安裝指南：[macOS](https://github.com/TheOdinProject/curriculum/tree/main/foundations/javascript_basics/installation_guides/macos.md)、[Linux](https://github.com/TheOdinProject/curriculum/tree/main/foundations/javascript_basics/installation_guides/linux.md)
  - [Node.js 官方網站](https://nodejs.org/) — 了解 LTS 版本排程與 Node 是什麼
  - [npm 官方文件：min-release-age 設定](https://docs.npmjs.com/) — 供應鏈攻擊防護設定

---

> 本講義改寫自 The Odin Project《Installing Node.js》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
