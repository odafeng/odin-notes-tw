---
title: 測試資料庫操作
source_url: https://www.theodinproject.com/lessons/node-path-nodejs-testing-database-operations
source_file: vendor/curriculum/nodeJS/testing_express/testing_database_operations.md
path: full-stack-javascript
course: NodeJS
order: 26
status: draft
generated: 2026-07-04
---

# 測試資料庫操作

> 改寫自 The Odin Project：[Testing Database Operations](https://www.theodinproject.com/lessons/node-path-nodejs-testing-database-operations)
> ｜Full Stack JavaScript › NodeJS › Testing Express

## 核心概念

當你要測試的程式碼必須接觸資料庫時，需要準備的設定（setup）會瞬間變得複雜許多。最重要的原則是：**絕對不要在正式（production）資料庫上跑測試**。測試常常會新增、修改、刪除資料，如果直接動到正式資料庫，等於拿真實使用者的資料在冒險，一旦誤刪或污染就無法挽回。這一課要處理的核心問題，就是：如何在 unit test（單元測試）與 integration test（整合測試）中安全地面對資料庫。

### 先問一句：這段資料庫操作真的需要測嗎？

在動手寫測試之前，值得先停下來想一個問題：這些資料庫操作到底需不需要被你自己測？

如果你只是用 `pg`（PostgreSQL 的 Node 驅動）或其他資料庫模組，直接讀寫資料庫，其實你**不太需要**替這段程式碼寫測試。原因很簡單：`pg` 這類熱門套件本身就已經有大量而完整的測試覆蓋它自己的每個動作。假設你的工作只是「提供一個 JSON API」，而 API 內部單純呼叫別人模組的 function 去讀寫資料，那麼這些操作已經被套件作者測過了，你再測一次只是重複別人做過的事。

那什麼時候才值得自己測？以下兩種情況：

1. **query（查詢）本身很複雜**：如果你寫的 SQL 或 ORM 查詢有一定的邏輯難度，你可能會想加 unit test 來確認自己「用對了」，確認查詢真的回傳你想要的東西。
2. **你在資料庫之外，用自己的程式碼做了 filtering（過濾）、sorting（排序）或其他資料加工**：這部分是「你的邏輯」，別人的套件不會替你測，所以你必須自己測。

不過對於第 2 種情況，原文給了一個更好的建議：**把這些過濾、排序、加工的邏輯抽出成獨立的模組**，讓它們跟資料庫操作分離。這樣一來，你就能單獨測這些純邏輯，完全不必碰資料庫。這其實呼應了測試的一個重要心法——把「純函式邏輯」和「有副作用的 I/O」拆開，前者最好測，後者最麻煩。

### 什麼時候一定要碰資料庫：integration test

話說回來，還是有些情況你就是得測「會接觸資料庫的東西」。最典型的例子就是前面〈測試路由與控制器〉那一課，我們用 `supertest` 對整台 Express server 做的 integration test——它會真的發出 HTTP request、經過 route（路由）、進到 controller（控制器）、再打到資料庫。這種「多個元件串在一起一起測」的測試，就叫 integration test。它天生就會碰資料庫，逃不掉。

面對這種測試，正確的做法不是躲開資料庫，而是**另外準備一個專門給測試用的資料庫**。做法整理如下：

- 建立一個獨立的測試資料庫，習慣上會在名字前面加 `test_` 前綴（例如 `test_inventory_application`），這樣一眼就能分辨它是測試用、不會跟正式資料庫搞混。
- 如果你用 Prisma，可以把資料庫 URL 換成測試資料庫的 URL，再跑一次 `prisma migrate`，讓測試資料庫擁有跟正式資料庫一樣的 schema（結構）。
- 準備資料的方式有兩種：用 seed script（種子腳本）把初始資料灌進這個測試資料庫，或者在測試套件的 `beforeAll` 裡手動插入需要的資料。

### 用 environment variable 決定連哪個資料庫

要讓同一份程式碼在「正常執行」和「測試」時連到不同的資料庫，最乾淨的做法是靠 environment variable（環境變數）。

第一步，在 `.env` 裡同時寫上正式和測試兩條連線字串：

```properties
NODE_ENV=development
DATABASE_URL=postgresql://<user>:<password>@localhost:3306/inventory_application
TEST_DATABASE_URL=postgresql://<user>:<password>@localhost:3306/test_inventory_application
```

第二步，在 `package.json` 裡設定好 npm scripts：

```json
{
  "scripts": {
    "dev": "node app.js",
    "test": "jest"
  }
}
```

第三步，處理「如何把環境變數載入測試環境」這個關鍵細節。這裡有一個很容易踩的坑：**跑 Jest 的時候，你不是直接呼叫 `node`**，而是呼叫 `jest` 這個執行檔，所以你沒辦法像平常那樣用 `--env-file` 或 `--env-file-if-exists` 旗標來載入 `.env`。這時候要改用程式化的方式，例如 `process.loadEnvFile()` 把環境變數主動讀進來。你可以把這段放在 [Jest 的 global setup 檔](https://jestjs.io/docs/configuration#globalsetup-string)裡執行。

還有一個貼心的地方要知道：**Jest 預設會把 `NODE_ENV` 設成 `'test'`**。這個值會蓋過你 `.env` 裡寫的 `NODE_ENV=development`，所以你不需要為了「在測試時把 NODE_ENV 改成 test」做任何額外處理——Jest 已經幫你做好了。

第四步，根據 `NODE_ENV` 的值，程式化地切換要用哪一條連線字串：

```javascript
const connectionString = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
```

這樣一來，平常開發時連正式（或開發）資料庫，跑測試時自動連 `test_` 資料庫，程式碼一行都不用改。

### 測試之間要重置資料庫：讓每個測試互相獨立

測試資料庫操作時，有一條鐵律：**每個測試都必須彼此獨立，任何一個測試都不能依賴另一個測試的執行結果**。

想像一下反例：測試 A 新增了一筆資料，測試 B 假設「這筆資料存在」才能通過。這時如果測試 A 沒跑、或跑的順序變了，測試 B 就會莫名其妙失敗——即使測試 B 本身要驗證的功能其實是好的。這種「測試互相污染」的情況會讓你的測試變得很不可靠，一下綠一下紅，最後你根本不敢相信它。

解法是：**每次跟資料庫互動（讀、增、改、刪）之後，都應該在下一個測試開始前，把資料庫清乾淨、還原成初始狀態**。這件事最適合放在 `beforeEach` 裡做——它會在「每一個」測試跑之前先執行一次。舉例來說，如果資料庫裡有 users 和 projects 兩張表：

```javascript
beforeEach(async () => {
  await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.project.deleteMany(),
  ]);
});
```

這段程式碼會在每個測試開始前，把 users 和 projects 兩張表清空，確保每個測試都從一張乾淨的白紙開始。這裡用 `$transaction`（交易）把多個刪除動作包在一起執行，確保它們要嘛全部成功、要嘛全部不動，避免清到一半出錯留下半殘狀態。

### 多個測試檔要「循序」執行，不能並行

還有一個很重要、卻常被忽略的細節：如果你把測試拆成好幾個檔案，你必須設定 test runner（測試執行器）**一個檔案接一個檔案地跑（循序），而不是同時一起跑（並行）**。

原因是：這些測試檔全都在操作「同一個」測試資料庫。如果 Jest 同時開好幾個檔案並行跑，A 檔案正在清空資料表、B 檔案卻同時在插入資料，兩邊的資料庫操作就會互相干擾、攪成一團，產生無法預測的結果。

麻煩的是，**Jest 預設就是並行執行不同測試檔**的。要關掉這個行為，在 `package.json` 的 `test` script 加上 [`--runInBand` 旗標](https://jestjs.io/docs/cli#--runinband)即可，它會強制 Jest 把所有測試檔排成一列、循序執行。

到這裡，測試資料庫的整套設定就完成了。小結整條思路：先判斷「需不需要自己測」→ 要碰資料庫就「另建 test_ 資料庫」→ 用「環境變數＋NODE_ENV」切換連線 → 用「beforeEach 重置」保持測試獨立 → 用「--runInBand」讓多檔循序跑。

## 程式碼範例

以下把整套設定串成一個最小可執行的骨架，讓你看到各段程式碼如何組合在一起（以 Jest + Prisma 為例）。

```json
// package.json：加上 --runInBand 確保測試檔循序執行
{
  "scripts": {
    "dev": "node app.js",
    "test": "jest --runInBand"
  }
}
```

```javascript
// jest.globalSetup.js：Jest 不透過 node 啟動，需自行載入環境變數
// 在 jest.config 裡以 globalSetup 指向本檔
module.exports = async () => {
  // 程式化載入 .env（因為無法使用 --env-file）
  process.loadEnvFile();
  // 注意：Jest 已預設把 NODE_ENV 設為 'test'，此處不必再手動設定
};
```

```javascript
// db.js：依 NODE_ENV 切換連到哪一個資料庫
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

// 測試時連 test_ 資料庫，其餘情況連開發/正式資料庫
const connectionString = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
```

```javascript
// users.test.js：每個測試前重置資料庫，保持彼此獨立
const prisma = require('./db');

beforeEach(async () => {
  // 用交易一次清空多張表，還原到初始狀態
  await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.project.deleteMany(),
  ]);
});

test('可以建立一位使用者', async () => {
  await prisma.user.create({ data: { name: 'Alice' } });
  const count = await prisma.user.count();
  expect(count).toBe(1); // 因為 beforeEach 已清空，這裡一定只有 1 筆
});
```

實際執行前，別忘了先把測試資料庫的 schema 建好。用 Prisma 時，可以在載入測試資料庫 URL 的情況下跑 migrate：

```bash
# 讓 DATABASE_URL 指向測試資料庫後執行 migration，建立與正式庫相同的 schema
npx prisma migrate deploy
```

## 常見陷阱

!!! warning "在正式資料庫上跑測試"
    這是最嚴重、也最不可逆的錯誤。測試會新增、修改、刪除資料，`beforeEach` 裡的 `deleteMany()` 更是會把整張表清空。如果你的連線字串不小心指到正式資料庫，一次測試就可能抹掉所有真實使用者資料。務必用獨立的 `test_` 資料庫，並靠 `NODE_ENV` 這類環境變數自動切換，不要靠「記得手動改」。

!!! warning "以為 Jest 能用 --env-file 載入 .env"
    因為執行測試時你呼叫的是 `jest`，不是 `node`，所以 Node 的 `--env-file` / `--env-file-if-exists` 旗標對 Jest 無效。要改用程式化方式（例如在 global setup 檔裡呼叫 `process.loadEnvFile()`）把環境變數讀進來，否則 `process.env.TEST_DATABASE_URL` 會是 `undefined`。

!!! warning "忘記加 --runInBand，多個測試檔並行互相污染"
    Jest 預設「並行」執行不同測試檔。當多個測試檔同時操作同一個測試資料庫時，一邊在清表、另一邊在寫入，就會產生時好時壞、難以重現的失敗。拆成多檔時，記得在 test script 加上 `--runInBand` 強制循序執行。

!!! warning "測試之間互相依賴，沒有重置資料庫"
    如果某個測試預設「上一個測試留下的資料還在」，一旦執行順序改變或前一個測試被單獨跳過，它就會失敗。用 `beforeEach` 把資料庫還原到初始狀態，確保每個測試都從乾淨的起點開始、彼此完全獨立。

## 練習

1. 花幾分鐘瀏覽 `pg`（node-postgres）在 GitHub 上的測試資料夾：<https://github.com/brianc/node-postgres/tree/master/packages/pg/test>。不用深入研讀每一行，重點是**親眼感受一下這些熱門函式庫被測試得多完整**。看過之後你會更有底氣判斷：哪些資料庫操作根本不必自己重測（因為套件早就測過了），哪些才是你真正需要投注測試心力的地方（例如你自己寫的複雜 query 或資料加工邏輯）。

## 原文與延伸資源

- 原文：[Testing Database Operations](https://www.theodinproject.com/lessons/node-path-nodejs-testing-database-operations)
- 本課引用：
  - [pg（node-postgres）測試資料夾](https://github.com/brianc/node-postgres/tree/master/packages/pg/test)
  - [Jest globalSetup 設定](https://jestjs.io/docs/configuration#globalsetup-string)
  - [Jest 環境變數：NODE_ENV](https://jestjs.io/docs/environment-variables#node_env)
  - [Jest CLI：--runInBand 旗標](https://jestjs.io/docs/cli#--runinband)

---

> 本講義改寫自 The Odin Project《Testing Database Operations》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
