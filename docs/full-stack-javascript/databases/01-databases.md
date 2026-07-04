---
title: 資料庫（Databases）
source_url: https://www.theodinproject.com/lessons/node-path-databases
source_file: vendor/curriculum/databases/databases/databases.md
path: full-stack-javascript
course: Databases
order: 1
generated: 2026-07-04
---

# 資料庫（Databases）

> 改寫自 The Odin Project：[Databases](https://www.theodinproject.com/lessons/node-path-databases)
> ｜Full Stack JavaScript › Databases › Databases

## 核心概念

你可能想過：一個網站到底怎麼記住所有使用者的資料？誰幫你記得登入密碼是 `CatLover1985`，好讓你下次還能登入？答案就是**資料庫（database）**。它位在整個 web application（網站應用程式）的最底層，替你把所有需要「記住」的東西存起來。資料庫可以很簡單，簡單到像一份 Excel 試算表；也可以極度複雜、被切成許多巨大的區塊，像 Facebook 那種規模。

資料庫躲在應用程式後方，看不見摸不著，很多人因此對它又敬又畏。其實不必害怕。這一課只是先讓你認識「裡面到底發生什麼事」，之後整個課程會花很多時間在資料庫與 SQL 上，因為它們太基礎、太重要了。

### 什麼是資料庫

**資料庫就是一個有結構地儲存資料的地方。** 「有結構」是關鍵。把資料隨手記在便條紙上很快，但當資料有成千上萬筆、而且彼此之間有關係時，你需要一套規則來組織它，才有辦法快速地新增、查詢、更新、刪除。負責管理資料庫的軟體叫做 **DBMS（Database Management System，資料庫管理系統）**，例如 PostgreSQL、MySQL、SQLite 等。你的應用程式不直接去翻硬碟上的檔案，而是對 DBMS 下指令，由它幫你把資料存好、取回。

### 結構化資料與關聯式資料庫（relational database）

最常見的資料庫類型是**關聯式資料庫（relational database）**。它把資料組織成一張張的**表（table）**，每張表長得就像試算表：

- **欄（column，欄位）**：定義每筆資料「有哪些屬性」，例如 `id`、`name`、`email`。每一欄有固定的資料型別（如整數、文字、日期）。
- **列（row，記錄 / record）**：一列就是一筆完整的資料，例如「一位使用者」。

例如一張 `users` 表可能長這樣：

| id | name  | email             |
|----|-------|-------------------|
| 1  | Alice | alice@example.com |
| 2  | Bob   | bob@example.com   |

「關聯式」的意思是：不同的表之間可以**建立關聯（relationship）**。假設你另外有一張 `posts`（貼文）表，每篇貼文都是某位使用者寫的。你不需要把作者的名字、email 全部重複抄進 `posts` 表，只要在 `posts` 裡放一個欄位記下作者的 `id` 就好：

| id | title      | user_id |
|----|------------|---------|
| 1  | Hello      | 1       |
| 2  | My cat     | 1       |
| 3  | Good morning | 2     |

這裡的 `user_id` 就是一把**外鍵（foreign key，指向另一張表的鍵）**，它「指向」`users` 表的某一列。要知道第 2 篇貼文是誰寫的，就用 `user_id = 1` 回頭去 `users` 表找。這種「用鍵把表串起來」的設計，讓資料不必重複，而且改一個地方就到處都對，這正是關聯式資料庫的核心價值。

### 主鍵（Primary Key）

上面每張表都有一欄 `id`。這就是**主鍵（Primary Key，主鍵）**：一個能**唯一辨識**表中每一列的欄位。主鍵不能重複、也不能是空的。有了主鍵，你才能明確地說「我要的是那一筆，不是別筆」。外鍵之所以能精準指向另一張表，靠的就是對方那張表的主鍵。

### 關聯式資料庫與 XML 有什麼不同

有時候人們會用 XML（或 JSON）這類**階層式、樹狀**的格式來存資料。這類格式把資料一層包一層，適合表達「一個東西底下有哪些東西」，但它沒有內建的查詢引擎，也不擅長處理「多張表互相關聯」的大量資料。當你想問「幫我找出所有在 2025 年之後註冊、而且發過超過 10 篇貼文的使用者」，用 XML 就得自己寫程式一層層爬。關聯式資料庫則是為這種查詢而生：資料被攤平成表，彼此用鍵關聯，你只要用 **SQL** 描述「你想要什麼」，DBMS 就會幫你把結果算出來，且針對大量資料做了高度最佳化。

### 什麼是 SQL

**SQL（Structured Query Language，結構化查詢語言）** 是專門用來和關聯式資料庫溝通的語言。跟你學過的一般程式語言比起來，SQL 的語法非常短，動詞（關鍵字）就那麼幾個。真正讓人卡住的不是背語法，而是**你得在腦中想像它到底在對哪些表、哪些列做什麼事**。

SQL 是一種**宣告式（declarative）** 語言：你描述「想要的結果」，而不是「一步步怎麼做」。這一點和你熟悉的 JavaScript 那種一行接一行的**命令式（imperative）** 風格很不一樣。

### SQL 用來做什麼

SQL 幾乎能完成你對資料庫的所有操作，最常見的四類（合稱 **CRUD**）是：

- **查詢（Read）**：用 `SELECT` 把資料撈出來。
- **新增（Create）**：用 `INSERT` 塞入一筆新資料。
- **更新（Update）**：用 `UPDATE` 改掉現有資料。
- **刪除（Delete）**：用 `DELETE` 移除資料。

除此之外，SQL 也能建立與修改表的結構（`CREATE TABLE`、`ALTER TABLE`）。這一課先聚焦最基本的兩件事：把整張表的資料撈出來，以及塞入一筆新資料。

### 應用程式如何跟資料庫溝通

實際開發時，你的 Node.js 應用程式並不會自己去讀寫硬碟上的資料檔，而是透過一段流程和資料庫互動：應用程式產生一條 SQL 敘述（我們稱為一次 **query（查詢）**），把它送給 DBMS；DBMS 解析並執行這條 query，動用它內部的最佳化引擎去找資料；最後把結果（通常是一組列）回傳給應用程式。應用程式再把這些資料轉成程式裡的物件，交給頁面或 API 使用。

正因為多了 DBMS 這一層，你才不必煩惱「資料實際上怎麼存在磁碟上、怎麼建索引、怎麼加速搜尋」。你只需要用 SQL 清楚表達需求，其餘交給資料庫處理。這也是為什麼學好「怎麼問對問題（寫對 query）」，比理解底層儲存細節更重要。

### NoSQL：不是唯一的選項

關聯式資料庫（SQL）不是儲存資料的唯一方式。過去二十幾年間出現了**非關聯式（non-relational，又稱 NoSQL）** 資料庫，例如 MongoDB（文件式）、Redis（鍵值式）等。它們通常不用固定的表結構，schema（資料綱要）較有彈性，適合特定的擴充或資料型態需求。兩者沒有絕對的優劣，只是取捨不同：SQL 強在資料一致性與複雜關聯查詢，NoSQL 強在彈性與水平擴充。本課程之後會使用 SQL，但你只要先知道「還有 NoSQL 這條路」即可。

## 程式碼範例

以下用最基本的兩個 SQL 動詞示範。假設有一張 `users` 表，欄位是 `id`、`name`、`email`。

```sql
-- 取得 users 表裡的「所有欄位、所有列」
-- * 代表「全部欄位」，沒有 WHERE 條件就代表「全部的列」
SELECT * FROM users;

-- 只取某幾個欄位（只要 name 和 email）
SELECT name, email FROM users;

-- 塞入一筆新資料：指定要填哪些欄位，再依序給值
INSERT INTO users (name, email)
VALUES ('Alice', 'alice@example.com');
```

執行 `SELECT * FROM users;` 之後，DBMS 會回傳類似這樣的結果：

```text
 id | name  | email
----+-------+-------------------
  1 | Alice | alice@example.com
  2 | Bob   | bob@example.com
```

幾個要點：

- SQL 關鍵字（`SELECT`、`FROM`、`INSERT INTO`、`VALUES`）習慣大寫，但大小寫其實不影響執行，這只是慣例。
- 字串值要用**單引號** `'...'` 包起來，不是雙引號。
- 每一條 SQL 敘述以分號 `;` 結尾。
- `--` 開頭是註解。

## 常見陷阱

!!! warning "SELECT 不加條件會撈出整張表"
    `SELECT * FROM users;` 會回傳**每一列**。開發時表很小沒感覺，但正式環境的表可能有上百萬列，一次全撈會非常慢、甚至拖垮資料庫。之後你會學到用 `WHERE` 過濾、用 `LIMIT` 限制筆數，只拿你真正需要的資料。

!!! warning "把 SQL 想成「操作集合」，不是「跑迴圈」"
    很多人帶著寫 JavaScript `for` 迴圈的思維來學 SQL，結果一直卡住。SQL 是宣告式的：你描述「要什麼結果」，一次作用在「一整組列」上，而不是自己一列一列地跑。學 SQL 最重要的，是在腦中想像每個指令會作用在哪些表、哪些列。

## 練習

1. 閱讀一篇 SQL 入門說明，理解 SQL 如何用來組織與管理龐大的資料量。原文推薦 LaunchSchool 的 [Introduction to SQL](https://launchschool.com/books/sql/read/introduction)，讀第一頁的介紹即可，不必往後翻。
2. 看一段**關聯式資料庫**的簡短影片介紹（原文為 [YouTube: Relational Databases](https://www.youtube.com/watch?v=z2kbsG8zsLM)），感受一下它為何實用，並熟悉本課用到的術語（table、row、column、primary key）。
3. 動手做 [Khan Academy 的 SQL 教學](https://www.khanacademy.org/computing/hour-of-code/hour-of-sql/v/welcome-to-sql)，實際建立與操作資料庫，親手寫幾條 `SELECT` 與 `INSERT`。
4. 讀一篇比較 [SQL 與 NoSQL 差異](https://circleci.com/blog/SQL-vs-NoSQL-databases/)的文章，理解關聯式與非關聯式資料庫各自的取捨。

完成後，試著不看講義回答這幾個問題：什麼是資料庫？什麼是關聯式資料庫？什麼是主鍵（Primary Key）？什麼是 SQL？怎麼用 SQL 取得一張表的所有記錄？怎麼用 SQL 插入一筆記錄？答不出來就回頭複習對應段落即可，這階段不需要背起來。

## 原文與延伸資源

- 原文：[Databases](https://www.theodinproject.com/lessons/node-path-databases)
- 本課引用：
  - [LaunchSchool — Introduction to SQL](https://launchschool.com/books/sql/read/introduction)
  - [YouTube — Relational Databases 影片介紹](https://www.youtube.com/watch?v=z2kbsG8zsLM)
  - [Khan Academy — Intro to SQL](https://www.khanacademy.org/computing/hour-of-code/hour-of-sql/v/welcome-to-sql)
  - [CircleCI Blog — SQL vs NoSQL databases](https://circleci.com/blog/SQL-vs-NoSQL-databases/)

---

> 本講義改寫自 The Odin Project《Databases》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
