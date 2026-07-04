---
title: 使用 PostgreSQL
source_url: https://www.theodinproject.com/lessons/nodejs-using-postgresql
source_file: vendor/curriculum/nodeJS/express/using_postgresql.md
path: full-stack-javascript
course: NodeJS
order: 16
status: draft
generated: 2026-07-04
---

# 使用 PostgreSQL

> 改寫自 The Odin Project：[Using PostgreSQL](https://www.theodinproject.com/lessons/nodejs-using-postgresql)
> ｜Full Stack JavaScript › NodeJS › Express

## 核心概念

到目前為止你的 Express 應用程式若要儲存資料，多半是放在記憶體裡的一個陣列。這種做法有個致命缺點：伺服器一重啟，資料就全部消失。這一課要把資料搬進 PostgreSQL 這個 relational database（關聯式資料庫），讓資料能真正持久化（persistence，永久保存）。所謂關聯式資料庫，就是把資料存成一張張有欄位（column）與列（row）的 table（資料表），彼此之間可以透過關聯串接；PostgreSQL 是目前最主流、功能最完整的開源選擇之一。以下把「使用 PostgreSQL」拆成四個環節：在 psql shell 裡建立 db 與 table、用 node-postgres 連線、執行 query（查詢）、以及用 script（腳本）自動化建表與塞資料。這四步走完，你就具備把任何 Express 專案接上真正資料庫的基本能力。

（本課假設你已完成 SQL 課程，看得懂 `CREATE TABLE`、`INSERT`、`SELECT` 這類語法。以下把 database 簡稱為 db。）

### 一、在 psql shell 裡建立 db 與 table

PostgreSQL 附帶一個互動式命令列工具 `psql`。在終端機輸入 `psql` 進入它的 shell 後，可以直接下 SQL：

- `\l`：列出目前所有 db（backslash 開頭的是 psql 的 meta-command，不是 SQL）。
- `CREATE DATABASE top_users;`：建立名為 `top_users` 的 db。
- `\c top_users`：連線（connect）到這個 db，成功後提示字元會變成 `top_users=#`。
- `\d`：列出目前 db 裡的 table 與其他物件。

建好 db 之後，在裡面建一張存放 username 的 table。注意 `id` 欄位的宣告方式，這是本課要你留意的重點：`GENERATED ALWAYS AS IDENTITY` 讓 PostgreSQL 自動幫這個欄位產生遞增的整數值（預設從 1 開始、每列加 1），你 insert 時完全不用管 id。這種欄位叫 identity column（識別欄位），常拿來當 primary key（主鍵），也就是每一列的唯一識別。同時 PostgreSQL 會偷偷幫你建一個名為 `usernames_id_seq` 的 sequence（序列）物件，用來記住下一個要發的號碼。所以 `\d` 之後會看到 table 與 sequence 兩個物件，這是正常的，不是你多建了什麼。table 建好後，用 `INSERT INTO ... VALUES ...` 塞幾筆資料、再用 `SELECT * FROM usernames;` 確認寫入成功，這樣手動流程就跑完一輪了。這些 SQL 都在 psql 裡直接輸入，是你熟悉語法、驗證想法最快的地方。

### 二、用 node-postgres（pg）在 Express 裡連線

要在 Node.js 裡跟 PostgreSQL 溝通，最常用的 library 是 [node-postgres](https://github.com/brianc/node-postgres)，套件名稱簡稱 `pg`，用 `npm install pg` 安裝。

`pg` 提供兩種連線方式，這是本課的核心觀念之一：

- **Client（客戶端）**：一條你手動管理的單一連線。你自己開啟連線、下 query、再關閉。適合一次性的操作；但如果查詢量很大，反覆開關連線的成本會很高。
- **Pool（連線池）**：顧名思義是一群 client 組成的池子。它會「握住」一批連線，當你下 query 時，pool 會自動找一條空閒連線來用，沒有的話才開新的。對於需要頻繁查詢的 web server 來說，pool 是正確選擇。

因此在 Express 應用裡，我們用 Pool。建立 `db/pool.js`，把連線資訊交給它，並用 `module.exports` 匯出這個 pool，讓整個應用共用同一個連線池。真正上線時這些帳密屬於敏感資訊，應該從 environment variable（環境變數）讀取、絕不能提交到版本控制，這裡為了教學才暫時寫死。除了逐項填 host、user、database、password、port（PostgreSQL 預設 port 是 5432），也可以改用一條 connection URI（連線字串），格式是 `postgresql://<角色名>:<密碼>@<主機>:<port>/<db名>`。連接雲端託管的 db 時，服務商通常直接給你一條這樣的字串，貼上就能用，兩種寫法擇一即可。

### 三、用 query 方法查詢，並用 parameterization 防注入

拿到 Pool 之後，用它的 `query` 方法送 SQL。慣例上會把所有 db 互動集中在一個檔案（例如 `db/queries.js`），對外匯出幾個 function，讓 controller（控制器）呼叫。`query` 回傳的物件裡有一個 `rows` 屬性，就是查詢結果的每一列。

這裡有一個安全上絕不能忽略的重點：**parameterized query（參數化查詢）**。假設你要把使用者輸入的 username 塞進 db，千萬不要用字串拼接的方式組 SQL，例如：

```javascript
// 危險示範，絕對不要這樣寫
await pool.query("INSERT INTO usernames (username) VALUES ('" + username + "')");
```

因為惡意使用者可以輸入 `sike'); DROP TABLE usernames; --` 這種內容，讓你的 SQL 語意整個被改寫、甚至刪掉整張 table。這種攻擊叫 SQL injection（SQL 注入）。正確做法是用 `$1`、`$2` 這種佔位符，把真正的值放進第二個參數（一個陣列），由 `pg` 將值與 SQL 分開傳送、交由資料庫安全處理：

```javascript
await pool.query("INSERT INTO usernames (username) VALUES ($1)", [username]);
```

controller 這一層則只負責呼叫這些 db function、處理 request 與 response，不直接碰 SQL。這種「route（路由）→ controller → db 查詢函式」的分層，把「怎麼查資料」與「怎麼回應請求」的責任切開：日後要改 SQL 只動 `queries.js`，要改回應格式只動 controller，兩邊互不干擾，程式碼因此保持乾淨、好維護，也更容易測試。另外別忘了這些查詢都是非同步（asynchronous）的，記得用 `async/await` 等待結果回來再往下走。

### 四、用 script 自動化建表與塞資料（seeding）

手動進 psql 一行行建 table、insert 資料很麻煩，也不好重複，換一台機器又要從頭來一次。更好的做法是寫一支 Node script（例如 `db/populatedb.js`），把建表與初始資料（這動作叫 seeding，播種）寫成一段 SQL 字串，透過 `pg` 的 **Client** 一次執行完。這裡用 Client 而非 Pool，因為這只是一次性的操作，跑完就結束，用 `client.connect()` 開連線、`client.query(SQL)` 執行、`client.end()` 收尾即可。建表時用 `CREATE TABLE IF NOT EXISTS`，避免重複執行時因 table 已存在而報錯。你可以用 `node db/populatedb.js` 執行，或把它登記成 `package.json` 裡的一個 script 方便呼叫。要注意這支 script 設計成只跑一次；若想重跑，記得先進 psql 把舊 table `DROP TABLE usernames;` 掉再跑。

**local db vs production db**：local（本機）db 適合開發，因為互動快、改動容易、離線也能用。等專案要公開時，就得換成 production（正式環境）db，通常託管在外部伺服器上，才有全球可存取、可擴充、更嚴謹的安全性。多數部署服務也同時提供 db 服務。

**如何同時餵 local 與 production db？** 重點是別把連線資訊寫死在 script 裡。若寫死，這支 script 就只能餵某一個 db。比較好的做法是把連線字串當作命令列參數傳進去（透過 `process.argv` 取得），這樣同一支 script 在你自己的機器上就能分別餵 local 與 production db：

```bash
node db/populatedb.js <local-db-url>
node db/populatedb.js <production-db-url>
```

這樣做的好處是讓 script 盡量獨立於你的程式碼與環境設定之外，不必為了餵 production db 而去登入正式伺服器、或偷改環境變數再改回來。

## 程式碼範例

以下是一個最小可執行的骨架，示範 pool、queries、controller 三層與 seed script 的寫法。

**1. 在 psql 裡建立 db 與 table**

```sql
-- 在終端機執行 psql 進入 shell 後：
CREATE DATABASE top_users;   -- 建立 db
\c top_users                 -- 連線到該 db（提示字元會變成 top_users=#）

-- 建立 table，id 為自動遞增的 identity column（識別欄位）
CREATE TABLE usernames (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 255 )
);

INSERT INTO usernames (username) VALUES ('Mao'), ('nevz'), ('Lofty');
SELECT * FROM usernames;     -- 驗證資料是否寫入
```

**2. `db/pool.js`：建立 connection pool（連線池）**

```javascript
const { Pool } = require("pg");

// 正式環境這些值應從 environment variable 讀取，這裡為教學寫死
module.exports = new Pool({
  host: "localhost",      // db 所在主機
  user: "<role_name>",    // 換成你的角色名
  database: "top_users",
  password: "<role_password>", // 換成你的密碼
  port: 5432,             // PostgreSQL 預設 port
});

// 另一種寫法：用 connection URI（連線字串），常見於雲端託管 db
// module.exports = new Pool({
//   connectionString: "postgresql://<role_name>:<role_password>@localhost:5432/top_users",
// });
```

**3. `db/queries.js`：集中所有 db 查詢函式**

```javascript
const pool = require("./pool");

async function getAllUsernames() {
  const { rows } = await pool.query("SELECT * FROM usernames");
  return rows; // rows 是結果的每一列組成的陣列
}

async function insertUsername(username) {
  // 用 $1 佔位符做 parameterized query（參數化查詢），防 SQL injection
  await pool.query("INSERT INTO usernames (username) VALUES ($1)", [username]);
}

module.exports = { getAllUsernames, insertUsername };
```

**4. controller（控制器）：呼叫 db 函式，不直接寫 SQL**

```javascript
const db = require("../db/queries");

async function getUsernames(req, res) {
  const usernames = await db.getAllUsernames();
  res.send("Usernames: " + usernames.map((user) => user.username).join(", "));
}

async function createUsernamePost(req, res) {
  const { username } = req.body;
  await db.insertUsername(username);
  res.redirect("/");
}

module.exports = { getUsernames, createUsernamePost };
```

**5. `db/populatedb.js`：一次性的 seed（播種）script，用 Client**

```javascript
#! /usr/bin/env node

const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS usernames (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 255 )
);

INSERT INTO usernames (username)
VALUES ('Bryan'), ('Odin'), ('Damon');
`;

async function main() {
  console.log("seeding...");
  // 連線字串從命令列參數取得（process.argv[2]），才能同時餵 local 與 production db
  const client = new Client({ connectionString: process.argv[2] });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
```

執行：`node db/populatedb.js postgresql://<role_name>:<role_password>@localhost:5432/top_users`。這支 script 設計成只跑一次即可。

## 常見陷阱

!!! warning "用字串拼接組 SQL 會導致 SQL injection"
    永遠不要把使用者輸入直接拼進 SQL 字串（例如 `"... VALUES ('" + username + "')"`）。惡意輸入如 `sike'); DROP TABLE usernames; --` 可能刪掉整張 table。一律使用 `$1`、`$2` 佔位符搭配陣列參數，讓 `pg` 幫你安全處理。

!!! warning "web server 該用 Pool，一次性 script 才用 Client"
    Client 是單一連線、要你手動開關，頻繁查詢時成本高；Pool 會重複利用連線，適合 Express 這種需要反覆查詢的 web server。反過來，只跑一次的 seed script 用 Client 就好，跑完 `client.end()` 收工。

!!! warning "把連線資訊寫死在 script 裡會綁死只能餵一個 db"
    若在 populate script 裡寫死 local 連線字串，就無法用同一支 script 餵 production db。改用 `process.argv` 從命令列參數接收連線字串，一支 script 就能同時服務 local 與 production。

!!! warning "看到 usernames_id_seq 別驚慌"
    `GENERATED ALWAYS AS IDENTITY` 會讓 PostgreSQL 自動建立一個名為 `<table>_id_seq` 的 sequence 物件來追蹤下一個 id。`\d` 時看到它是正常現象，不是你不小心多建了東西。

## 練習

先動手把主線專案做出來，再完成 Assignment。

1. **建立 Express app**：只做一個功能，把使用者輸入的 username 存進 db。實作三條 route（路由）：
    - `GET /`：把 db 裡目前所有 username 記錄到終端機（先用 `console.log("usernames will be logged here - wip")` 佔位）。
    - `GET /new`：顯示一個只有 username 文字輸入欄的 HTML 表單，送出到下一條 route。用 `ejs` 或純 HTML 皆可。
    - `POST /new`：把送進來的 username 存進 db（先用 `console.log("username to be saved: ", req.body.username)` 佔位）。
    把程式碼分層到 `routes` 與 `controllers` 資料夾。
2. **接上 db**：依上面範例建立 db、table，安裝 `pg`，建立 `db/pool.js`、`db/queries.js`，並在 controller 呼叫查詢函式，讓三條 route 真正讀寫 db。
3. **寫 seed script**：建立 `db/populatedb.js` 自動建表與塞初始資料，用命令列參數傳入連線字串。

**Assignment（正式作業）**

1. 快速瀏覽 [pg 的官方文件](https://node-postgres.com/)。這個 library 很輕量，文件也很短，當作參考手冊即可，不必全部讀完。
2. 更新上面這個專案：
    1. 用 environment variable（環境變數）管理 db 連線資訊，別再寫死。
    2. 在首頁 route 加上以 query parameter（查詢參數）進行的搜尋功能。例如 `GET /?search=sup` 應回傳所有包含 `sup` 的 username。**不要用 JavaScript 過濾，搜尋要在 SQL 裡做**（提示：`WHERE username LIKE ...` 搭配參數化查詢）。
    3. 新增一條 `GET /delete` route，刪除 db 裡所有 username。
3. 回到先前的 Mini Message Board 專案（原本用陣列存訊息、伺服器重啟就清空），改用 PostgreSQL 加 `pg` 實作資料持久化：
    - 在你選擇的託管服務上部署一個新 db，取得連線資訊。
    - 建立 `messages` table，可用 script 塞入初始資料。
    - 加上必要的環境變數、建立 pool、實作所需的 db 函式。
    - 順手為使用者輸入加上適當的 server-side validation（伺服器端驗證）。

（第 3 題涉及部署與託管服務的專屬步驟，請回原文與你選用平台的文件操作。）

## 原文與延伸資源

- 原文：[Using PostgreSQL](https://www.theodinproject.com/lessons/nodejs-using-postgresql)
- 本課引用：
    - [node-postgres（pg）官方文件](https://node-postgres.com/)
    - [node-postgres GitHub repo](https://github.com/brianc/node-postgres)
    - [pg parameterized query（參數化查詢）](https://node-postgres.com/features/queries#parameterized-query)
    - [pg connection URI（連線字串）](https://node-postgres.com/features/connecting#connection-uri)
    - [PostgreSQL identity column 說明](https://www.postgresql.org/docs/current/sql-createtable.html#SQL-CREATETABLE-PARMS-GENERATED-IDENTITY)
    - [SQL injection（維基百科）](https://en.wikipedia.org/wiki/SQL_injection)
    - [Node.js process.argv 文件](https://nodejs.org/docs/latest/api/process.html#processargv)

---

> 本講義改寫自 The Odin Project《Using PostgreSQL》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
