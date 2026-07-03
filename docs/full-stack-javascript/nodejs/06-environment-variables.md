---
title: 環境變數
source_url: https://www.theodinproject.com/lessons/nodejs-environment-variables
source_file: vendor/curriculum/nodeJS/introduction_to_nodeJS/environment_variables.md
path: full-stack-javascript
course: NodeJS
order: 6
status: draft
generated: 2026-07-04
---

# 環境變數

> 改寫自 The Odin Project：[Environment Variables](https://www.theodinproject.com/lessons/nodejs-environment-variables)
> ｜Full Stack JavaScript › NodeJS › Introduction to NodeJS

## 核心概念

當你執行程式碼時，它總是跑在某個特定的 environment（環境）裡。同一份程式，跑在你的筆電上是一個環境，跑在同事的電腦上是另一個環境，部署到 Netlify 或 Vercel 這類 host（主機服務）上又是另一個環境。每個環境都是一組獨特的工具與設定的組合，彼此不完全相同。

你一定寫過很多會被重複呼叫的 function（函式），每次傳入不同的 argument（引數），function 的行為或回傳值就會不一樣。**environment variables（環境變數）** 對「整個應用程式」扮演的角色，就像 argument 對 function 一樣：你在啟動程式時把值傳進去，不同的環境可以給同一個變數不同的值，而程式的原始碼完全不用改。

### 環境變數是什麼

environment variables 就是「值會因環境而異」的變數。正因為它們專屬於各自的環境，我們可以用它們來達成兩件很常見的事：

1. **為不同環境提供不同的值**：例如開發時用的是你自己的機器，部署後跑在主機服務上，兩邊需要的設定不同，但你不需要為了切換而修改原始碼。
2. **存放機密（secrets）**：像是資料庫的連線 URL 與帳密（credentials）、第三方服務的 API key 等等。這些東西絕對不能直接寫死（hardcode）在程式碼裡，更不能被推上公開的版本庫。

舉個典型的例子：production（正式環境）可能需要比 development（開發環境）更多的 logging（記錄）與分析功能。因此原始碼裡常常會有一個環境變數，用來標示目前是跑在「dev」還是「prod」模式，程式再依此決定要做什麼。這個做法非常普遍，依照慣例，這個變數會被命名為 `NODE_ENV`。要注意的是，`NODE_ENV` 只是一個約定俗成的名字，你就算取別的名字也一樣能運作，只是大家看到 `NODE_ENV` 就知道它的用途。

再舉一個例子：你在開發一個連接資料庫的 API，但開發時你不想動到正式資料庫，而是想用一個獨立的測試資料庫。這時你可以在本機開發時，把測試資料庫的 URL 與帳密傳給程式；而部署版本則拿到正式資料庫的值。更棒的是，你可以把這些變數的值放進一個檔案，再把該檔案加進 `.gitignore`，這樣推送變更時，檔案內容就不會外洩。

### 載入環境變數的幾種方式

要把環境變數載入程式，方法有好幾種，有些比較繁瑣，有些在較舊的 Node 版本裡還不一定有穩定支援。以下由繁到簡逐一介紹。

**方式一：直接寫在啟動指令裡。** 你不再只是打 `node index.js`，而是在指令前面先定義變數與值：

```bash
NODE_ENV=prod VIDEO_URL="https://www.youtube.com/watch?v=X2CYWg9-2N0" node index.js
```

這裡我們定義了 `NODE_ENV` 與 `VIDEO_URL` 兩個變數並各自賦值。程式中任何用到這兩個變數的地方，就會拿到這些值，就跟 function 的參數一樣。值若沒有空白或 `=` 這類特殊字元，引號可省略。命名慣例是採用 `UPPER_SNAKE_CASE`（全大寫加底線，也有人戲稱為 `SCREAMING_SNAKE_CASE`）。這個方式的缺點很明顯：變數一多就非常冗長，而且如果值是機密，你更不會想把它寫進 npm script 裡再推上 `package.json`。

**方式二：用 `export` 存進 shell session。** 你可以改用 shell 指令 `export`，把變數與值存進「目前這個 shell session（工作階段）」：

```bash
export NODE_ENV=prod VIDEO_URL="https://www.youtube.com/watch?v=X2CYWg9-2N0"
```

這道指令只會把兩個變數設定在「目前的 shell 環境」裡。如果你另外開一個新的 shell，它就拿不到這些變數，因為那是一個全新的環境。所以在第一個（有設定的）shell 裡跑 `node index.js`，用到 `NODE_ENV` 的地方會得到 `"prod"`；但在第二個 shell 裡跑同一支程式，因為那個環境什麼都沒設，就會得到 `undefined`。要覆寫變數，只要用新值重新 `export` 一次即可。想查看目前 shell 的所有環境變數，可以執行 `printenv`，你會發現裡面有一大堆你根本沒設過的東西，那是 shell 自己一開機就載入的既有變數。這個方式的痛點是：變數會在你關掉 shell 後就消失，而且變數一多，每開一個新 shell 都要重新 export 一遍，很折磨人。

**方式三（推薦）：使用 `.env` 檔。** Node 從 v20.6.0 開始內建對環境變數檔的支援（在較新版本中已是穩定功能）。你可以在專案根目錄建立一個依慣例命名為 `.env` 的檔案，用 `NAME=VALUE` 的格式把所有變數寫進去：

```properties
# .env

NODE_ENV=prod
VIDEO_URL="https://www.youtube.com/watch?v=X2CYWg9-2N0"
```

**這個檔案一定要加進 `.gitignore`**，才能避免機密被公開！

Node 提供多種方式來載入這個檔：可以用 [`--env-file` CLI 選項](https://nodejs.org/docs/latest-v24.x/api/cli.html#--env-filefile)（例如 `node --env-file=.env index.js`），也可以在 JavaScript 裡直接呼叫 [`process.loadEnvFile()`](https://nodejs.org/docs/latest-v24.x/api/process.html#processloadenvfilepath)。要注意：這兩種方式在找不到 `.env` 檔時都會拋出錯誤。

**關於 dotenv 套件。** Node 並非一直都內建這個功能，因此你在實務上很可能會看到 [dotenv](https://www.npmjs.com/package/dotenv) 這類函式庫。它的原理跟內建功能相同，只是改用套件自己的用法。這類套件有時會提供 Node 內建沒有的進階功能，對比較複雜的專案團隊會有幫助，但就 TOP 的學習範圍而言，用內建的就夠了。

### 在程式中存取環境變數

環境變數是透過 Node 內建的 `process` 物件來存取，更精確地說是它的 `env` 屬性。Node 會把每個環境變數載入 `process.env` 物件，變數名稱就是屬性名稱，你可以像存取任何一般物件屬性那樣使用它們：

```javascript
if (process.env.NODE_ENV === "prod") {
    // 做 production 專屬的事
}

// 不把網址寫死，才不會破壞驚喜（而且它可能每隔幾天就換一次！）
redirectUserToSuperSecretVideo(process.env.VIDEO_URL);
```

完全不需要把這些值寫死在原始碼裡。想改變某個環境變數的值，只要改 `.env` 檔再重跑程式就好。有一點務必記住：**環境變數的值永遠是字串（string）**。所以如果你想把某個變數當成數字或布林值來用，必須自己做型別轉換，例如用 `Number(process.env.PORT)` 或自行比對字串。

總結一下心智模型：環境變數讓「設定」與「程式碼」分離。程式碼描述「怎麼做」，環境變數提供「用哪些值來做」。開發時給一組值、部署時給另一組值，機密則靠 `.gitignore` 擋在版本庫之外。掌握了 `.env` 檔與 `process.env`，你就具備了寫出可安全部署、可跨環境切換的 Node 應用程式所需的基本功。

## 程式碼範例

以下是一個最小可執行範例。先在專案根目錄建立 `.env`：

```properties
# .env
NODE_ENV=dev
GREETING=你好
```

接著建立 `index.js`：

```javascript
// index.js
// 讀取兩個環境變數並印出
console.log(`目前模式：${process.env.NODE_ENV}`);
console.log(`問候語：${process.env.GREETING}`);

// 環境變數一律是字串，需要數字時要自行轉換
const port = Number(process.env.PORT) || 3000;
console.log(`使用的 port（連接埠）：${port}`);
```

用內建的 `--env-file` 選項執行：

```bash
node --env-file=.env index.js
```

預期輸出：

```text
目前模式：dev
問候語：你好
使用的 port（連接埠）：3000
```

若想在部署時避免「找不到 `.env` 就報錯」，可改用 `--env-file-if-exists=.env`，這樣缺檔時會安靜略過而不中斷程式。

## 常見陷阱

!!! warning "務必把 `.env` 加進 `.gitignore`"
    環境變數不只用來放機密，但你很常會拿它來放機密。只要專案裡有 `.env`，就必須在 `.gitignore` 裡加上 `.env`，確保它**不會被推上 GitHub**。一旦帶著帳密或 API key 的 `.env` 被推上公開版本庫，那些機密就等同外洩，必須立刻更換。

!!! warning "環境變數的值永遠是字串"
    `process.env.PORT` 就算你在 `.env` 裡寫的是 `3000`，讀出來也是字串 `"3000"`。要當數字用請先 `Number(...)`；要當布林值用不能直接判斷真假，因為連字串 `"false"` 都是 truthy（為真），必須明確比對，例如 `process.env.DEBUG === "true"`。

!!! warning "部署環境沒有 `.env` 檔"
    部署時你的版本庫不會包含 `.env`，所以正式環境的變數要透過部署服務的介面或設定去指定，做法因服務而異，請查閱該服務的文件。也因此，正式環境不該像開發時那樣強制載入 `.env`（否則會因找不到檔而報錯）。可用不帶 `--env-file` 的 production npm script、改用 `--env-file-if-exists`，或用 `process.loadEnvFile()` 搭配錯誤處理來避免。

## 練習

1. 在專案根目錄建立 `.env` 檔，用 `NAME=VALUE` 的格式寫入至少兩個變數（例如 `NODE_ENV` 與一個你自訂的變數）。
2. 立刻把 `.env` 加進 `.gitignore`，確認它不會被 git 追蹤。
3. 寫一支小程式，用 `process.env` 讀出這些變數並印出來，然後用 `node --env-file=.env index.js` 執行，確認拿到正確的值。
4. 試著在 `.env` 裡放一個數字型的變數（例如 `PORT=4000`），在程式中用 `Number(...)` 轉換後做一次加法，體會「值永遠是字串」這件事。
5. 建立一個 `README.md`，記錄你的專案需要哪些環境變數、各自代表什麼；並附上一份 `.env.sample`（不含真實機密的範例檔），方便他人複製後填入自己的值。
6. 進一步了解 `.env` 的檔案語法與 CLI 用法，請參閱 Node 官方的環境變數文件（見下方延伸資源）。

## 原文與延伸資源

- 原文：[Environment Variables](https://www.theodinproject.com/lessons/nodejs-environment-variables)
- 本課引用：
    - [Node 官方文件：Environment variables](https://nodejs.org/docs/latest-v24.x/api/environment_variables.html)（`.env` 檔語法與 CLI 用法）
    - [Node CLI 選項 `--env-file`](https://nodejs.org/docs/latest-v24.x/api/cli.html#--env-filefile)
    - [`process.loadEnvFile()` 方法](https://nodejs.org/docs/latest-v24.x/api/process.html#processloadenvfilepath)
    - [dotenv 套件](https://www.npmjs.com/package/dotenv)

---

> 本講義改寫自 The Odin Project《Environment Variables》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
