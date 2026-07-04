---
title: Prisma ORM
source_url: https://www.theodinproject.com/lessons/nodejs-prisma-orm
source_file: vendor/curriculum/nodeJS/orms/prisma_orm.md
path: full-stack-javascript
course: NodeJS
order: 20
generated: 2026-07-04
---

# Prisma ORM

> 改寫自 The Odin Project：[Prisma ORM](https://www.theodinproject.com/lessons/nodejs-prisma-orm)
> ｜Full Stack JavaScript › NodeJS › ORMs

## 核心概念

在前面的課程裡，你已經直接用 raw SQL（原生 SQL 查詢語句）操作過 PostgreSQL 資料庫。這種做法能讓你徹底理解資料庫底層發生了什麼事，但一旦專案規模變大，你會開始感受到它的疲乏。這一課要介紹的 ORM（Object Relational Mapper，物件關聯對映器）就是為了解決這些疲乏而生的工具，而我們會深入其中一個在 Node.js 生態圈裡很受歡迎的 ORM：Prisma ORM。

### 什麼是 ORM

ORM 是一層介於你的程式碼與資料庫之間的抽象。它讓你用程式語言裡熟悉的「物件」與「方法」來操作資料，而不必自己手寫 SQL 字串。你呼叫一個像 `prisma.message.findMany()` 的方法，ORM 會在背後幫你把它翻譯成對應的 `SELECT` 語句、送去資料庫、再把回傳的資料列（row）轉成 JavaScript 物件交還給你。「Object Relational」這個名字正是這個意思：把關聯式資料庫（relational database）裡的資料表與資料列，對映（map）成程式裡的物件。

換句話說，ORM 幫你做了三件事：提供一套統一的、可預期的資料操作 API；把資料庫結構的定義集中在一處讓人看得懂；以及把結構變更流程標準化。這些正好對應到下面三個 raw SQL 的痛點。ORM 在業界被廣泛使用，熟悉它幾乎是後端工作的必備技能。

### 手寫 raw SQL 的三個痛點

在理解 ORM 的價值之前，先把 raw SQL 帶來的困擾講清楚。

**第一，程式碼會爆量。** 你需要一個 `SELECT` 查詢？寫一段 query。換一張資料表也要 `SELECT`？再寫一段。你可能會想抽出一個共用的工具函式，但接著又需要只查特定欄位，於是得改函式；再加上過濾（filter）與排序（sort），函式又得再改。把這一切在 `INSERT`、`UPDATE`、`DELETE` 上重複一遍，再對專案裡每一個實體（entity，例如書、作者、分類）重複一遍，跨多個專案又重複一遍。以下這種「每個實體一個 class」的寫法就是常見的手工解法：

```javascript
class Book {
  async getBooks(filters) {}
  async getBookById(id) {}
  async createBook(data) {}
  async updateBook(id, data) {}
  async deleteBook(id) {}
  async getBookAuthors(id) {}
  async getBookGenres(id) {}
  // 以此類推……
}
```

寫這些程式碼在個人練習專案裡並不算壞事，反而能幫你打好基礎，TOP 甚至鼓勵你回頭去重構舊專案、親手做一個「迷你 ORM」，藉此體會正式 ORM 幫了你多少忙。但當你在團隊裡、面對大型軟體時，就必須有一套「標準化的資料庫操作方式」，這時 ORM 讓你能把精力放回真正攸關業務的程式碼上。

**第二，看不懂整個資料庫的樣貌。** 當所有資料庫互動都散落在各處的 raw SQL 裡時，程式碼裡沒有任何一個地方能讓你一眼看懂：資料庫有哪些資料表、它們之間有什麼關聯（relation）、每個欄位是什麼資料型別。你往往得登入資料庫才能拼湊出全貌。大多數 ORM 用一份 schema（綱要）解決這件事，把資料庫定義帶進程式碼，讓你光看 schema 就能掌握每張表的結構。

**第三，改動正式資料很危險。** 需求會變，資料庫也會跟著變，你可能得新增一個欄位、或把既有資料搬進一張新表。這種對資料庫結構或資料的變更，術語叫做 migration（遷移）。沒有 ORM 時你得手工撰寫這些 migration，既容易出錯又繁瑣。ORM 把 migration 標準化成一份份的變更紀錄（changelog），並提供處理衝突的流程。

### Prisma ORM 是什麼

ORM 幾乎解決了上述所有痛點，但也不是完美無缺：要完全掌握一個 ORM 有其學習曲線，而且有些 ORM 並不支援全部的 SQL 功能，遇到特別刁鑽或高度優化的查詢時，你有時仍得退回去寫 raw SQL。即便如此，對絕大多數日常需求而言，使用 ORM 通常仍非常值得。

Node.js 生態圈裡的 ORM 選擇很多，社群至今沒有公認的唯一首選。TOP 選擇教 Prisma ORM，是看中它的高人氣與社群支援。Prisma ORM 由數個函式庫組成，你可以用 npm 只安裝專案需要的那幾個。它主要分成三大塊：Prisma Schema、Prisma Client、Prisma Migrate。

### Prisma Schema

Prisma schema 是一個檔案，你在裡面用 Prisma Schema Language（Prisma 綱要語言）定義你的 model（資料模型）。以聊天室應用的訊息表為例：

```text
model Message {
   id        Int      @id @default(autoincrement())
   content   String   @db.VarChar(255)
   createdAt DateTime @default(now())
   author    User     @relation(fields: [authorId], references: [id])
   authorId  Int
}
```

這裡不只有欄位定義，還在 `Message` model 裡定義了它與另一張 `User` 表的 relation：作法是宣告一個型別為對方 model 的欄位（`author User`），再用 `@relation` 屬性指明本表的外鍵（foreign key）欄位（`fields: [authorId]`）對應到對方表的哪個欄位（`references: [id]`）；在關聯的另一側，`User` model 則用列表欄位（如 `messages Message[]`）表示「一個 User 有多筆 Message」的一對多關係。這份 schema 檔案住在你的程式碼裡、受版本控制（version control）追蹤，因此團隊任何人都能一眼看懂資料庫結構，這正好回應了前面第二個痛點。

### Prisma Client

Client（客戶端）是另一個獨立的函式庫，你用它來實際跟資料庫互動。它的特別之處在於：它是「依你的 schema 量身生成」的。看看下面這段：

```javascript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 建立一筆新訊息
await prisma.message.create({
   data: { content: 'Hello, world!', authorId: 1 }
});

// 取回全部訊息
const messages = await prisma.message.findMany();
```

注意到 `prisma.message` 了嗎？Prisma Client 怎麼會知道有一個 `message` model？答案是：每當你建立或修改 schema 檔後，執行 `npx prisma generate`，Prisma 就會依你的 schema 重新生成一份專屬的 client。這份 client 能處理各種查詢：join（連接）、filter、sort、pagination（分頁）等等。萬一遇到 client 難以表達的複雜查詢，或你就是想寫 raw query，Prisma Client 也支援直接執行 raw SQL。

### Prisma Migrate

Prisma Migrate 幫你執行資料庫 migration。當你變更 schema 後，執行一次 migration 就會把這些結構變更套用到資料庫，而每一次變更都會被記錄在程式碼裡的 `migrations` 資料夾中。這個資料夾就像資料庫結構的 git 歷史：任何團隊成員把專案 clone 下來，跑一次 migration 就能得到與你一模一樣的資料庫結構，不必口頭交代「記得先手動加這個欄位」。在 TOP 課程裡你不會頻繁用到它，但在正式工作中它可能是你每隔一兩天就會用到的工具。

把三者串起來看，它們的協作關係是：你在 **Prisma Schema** 裡描述資料長什麼樣子 → 用 **Prisma Migrate** 把這個描述變成真實的資料庫結構 → 再用 **Prisma Client** 在程式裡安全、有型別提示地讀寫資料。三者共用同一份 schema 作為單一事實來源（single source of truth），這正是 ORM 相較於散落各處的 raw SQL 最大的價值所在。

## 程式碼範例

以下是一個從零開始、以 JavaScript（非 TypeScript）搭配 PostgreSQL 的最小流程。指令依 TOP 對 Prisma 官方 Quickstart 的 JavaScript 調整而來：

```bash
# 1. 初始化 Prisma，指定資料庫與 JavaScript 版 client generator
npx prisma init --datasource-provider postgresql \
  --output ../generated/prisma \
  --generator-provider prisma-client-js
```

```text
// 2. 在 prisma/schema.prisma 定義 model
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String?
  posts Post[]                 // 一對多：一個 User 有多篇 Post
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
```

```bash
# 3. 建立並套用第一個 migration（會依 schema 建立資料表）
npx prisma migrate dev --name init

# 4. 依 schema 生成 Prisma Client
npx prisma generate
```

```javascript
// 5. lib/prisma.js —— 注意要加上 .js 副檔名
import { PrismaClient } from '../generated/prisma/client.js';
export const prisma = new PrismaClient();
```

```javascript
// 6. script.js —— 用 node script.js 執行
import { prisma } from './lib/prisma.js';

async function main() {
  // 建立一筆 User，順便建立關聯的 Post
  await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      posts: { create: { title: '我的第一篇貼文' } },
    },
  });

  // 讀取全部 User，並一併帶出其 posts
  const users = await prisma.user.findMany({ include: { posts: true } });
  console.log(JSON.stringify(users, null, 2));
}

main().finally(() => prisma.$disconnect());
```

想用瀏覽器介面檢視資料時，可執行 `npx prisma studio --config ./prisma.config.js`。

## 常見陷阱

!!! warning "Prisma 不支援 PostgreSQL 的 Identity 欄位"
    在「Using PostgreSQL」一課裡學過，PostgreSQL 推薦使用符合 SQL 標準的 Identity 欄位。但 Prisma ORM 目前不支援 Identity 欄位，遇到 `@default(autoincrement())` 時它會改用 PostgreSQL 專屬的 Serial 型別（如 `SERIAL`）。這對課程專案多半沒有影響，但值得記在心裡，之後看到資料庫欄位型別與預期不同時才不會困惑。

!!! warning "改了 schema 一定要重新 generate"
    Prisma Client 是「生成出來」的產物，不是即時反映 schema 的。只要你新增或修改了 model／欄位，就必須重新執行 `npx prisma generate`，否則 client 上不會出現新的 model 或欄位，型別提示與方法都會對不上。修改結構（而非只改 client）時，還要記得跑 `npx prisma migrate dev` 把變更套用到資料庫。

!!! warning "近期 Prisma 官方 Quickstart 以 TypeScript 為主"
    Prisma 官方已決定主力支援 TypeScript，官方 Quickstart 預設是 TS。用 JavaScript 時要照 TOP 的調整：init 指令加上 `--generator-provider prisma-client-js`，把 `prisma.config.ts` 改名為 `prisma.config.js`，並且在 import 生成的 client 時補上 `.js` 副檔名（例如 `from '../generated/prisma/client.js'`）。少了 `.js` 副檔名，ESM 環境下的 import 會直接失敗。

!!! warning "不要把 migration 檔或 generated 目錄手動亂改"
    `migrations` 資料夾是 Prisma 的變更紀錄，`generated`（或 `@prisma/client`）是自動生成的產物。手動編輯它們會讓 Prisma 的狀態追蹤與實際不一致，導致難以除錯的問題。結構要變，永遠透過改 schema 再跑 migrate 的流程。

## 練習

1. 完成 Prisma 官方的 [Quickstart with Prisma ORM and PostgreSQL](https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/postgresql)，它涵蓋 migration、schema 與 Prisma Client 的完整流程。由於官方教材以 TypeScript 為主，請依下列 TOP 的調整，把它改成 JavaScript 版本：
   - **Step 1**：略過 `npm init`、`npm install typescript tsx @types/node --save-dev`、`npx tsc --init` 這幾個指令。
   - **Step 2**：不需要安裝 `@types/pg`。
   - **Step 3**：整步跳過（因為不使用 TypeScript）。
   - **Step 4**：改用 `prisma-client-js` generator，init 指令改為：
     `npx prisma init --datasource-provider postgresql --output ../generated/prisma --generator-provider prisma-client-js`，並把 `prisma.config.ts` 改名為 `prisma.config.js`。
   - **Steps 5、6**：不需更動。
   - **Step 7**：建立 `lib/prisma.js`（非 `.ts`），import 時補上副檔名：`import { PrismaClient } from '../generated/prisma/client.js';`。
   - **Step 8**：檔案命名為 `script.js`，第一行改成 `import { prisma } from './lib/prisma.js';`，並用 `node script.js` 執行。
   - **Step 9**：因為 config 改了副檔名，Prisma Studio 指令改為 `npx prisma studio --config ./prisma.config.js`。
2. 閱讀 Prisma 官方文件裡下列幾篇，並盡量跟著範例動手寫。現在記不住也沒關係，接下來的專案會大量練習 Prisma：
   - What is Prisma ORM?（Prisma ORM 是什麼）
   - Prisma schema overview（schema 總覽）
   - Data models（資料模型）
   - Relations（關聯）
   - Prisma Client CRUD（增刪查改）
   - Raw SQL（TypedSQL）
   - Prisma Migrate getting started（migrate 入門）
   - Prisma Migrate mental model（migrate 心智模型）
   - Data migrations（資料遷移）

完成後用這份 knowledge check 自我檢驗：raw SQL 有哪些挑戰？Prisma schema 是什麼、有何用處？Prisma Client 是什麼、它如何得知你 schema 裡的 model？Prisma Migrate 是什麼？如何在 schema 裡定義 relation？如何用 Prisma Client 取回一張表的全部紀錄？

## 原文與延伸資源

- 原文：[Prisma ORM](https://www.theodinproject.com/lessons/nodejs-prisma-orm)
- 本課引用：
  - [Prisma ORM 官網](https://www.prisma.io/orm)
  - [Quickstart with Prisma ORM and PostgreSQL](https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/postgresql)
  - [Prisma Client CRUD 文件](https://www.prisma.io/docs/orm/prisma-client/queries/crud)
  - [Relations 文件](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations)
  - [官方 Prisma VS Code 擴充套件](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)（提供語法高亮、IntelliSense 自動補全、schema linting）
  - [Prisma Crash Course（Traversy Media 影片）](https://www.youtube.com/watch?v=CYH04BJzamo)

---

> 本講義改寫自 The Odin Project《Prisma ORM》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
