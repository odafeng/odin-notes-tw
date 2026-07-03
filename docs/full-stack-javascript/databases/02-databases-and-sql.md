---
title: 資料庫與 SQL
source_url: https://www.theodinproject.com/lessons/node-path-databases-databases-and-sql
source_file: vendor/curriculum/databases/databases/databases_and_sql.md
path: full-stack-javascript
course: Databases
order: 2
status: draft
generated: 2026-07-04
---

# 資料庫與 SQL

> 改寫自 The Odin Project：[Databases and SQL](https://www.theodinproject.com/lessons/node-path-databases-databases-and-sql)
> ｜Full Stack JavaScript › Databases › Databases

## 核心概念

資料（data）是任何一個好 web app 的核心。SQL（Structured Query Language，結構化查詢語言）就是拿來跟 relational database（關聯式資料庫）對話的語言。把 SQL 學好，好處是雙重的：一方面你可以直接向資料庫問出各種複雜的問題，另一方面當你之後改用 ORM（Object-Relational Mapper，物件關聯對映器，例如 Node.js 的 Prisma、Rails 的 Active Record）時，你會清楚知道它在背後幫你做了什麼，而不是把它當黑盒子。

SQL 的本質其實就是「向資料庫提問」，偶爾也順便新增或修改一些東西。舉幾個由淺入深的例子：你可能想列出所有在十二月用促銷碼「FREESTUFF」註冊的使用者；或列出目前使用者發表過的所有留言，並依主題與建立時間排序；更複雜一點，你可能想列出所有「使用者數超過 1000 的州」的訂單，並依數量與總金額排序。這些問題全都要透過資料庫才答得出來，而好消息是：SQL 常用的關鍵字其實只有十幾個，重點從來不在背指令，而在背後的觀念。

### 資料庫、資料表、記錄

先建立一個心智圖像會很有幫助。很多人（包括原教材作者）會把資料表想像成 Excel 試算表在腦中移動、彼此結合、重新洗牌。

- **table（資料表）**：像一張長長的試算表，用來存放某一類資料，例如 `users` 表、`posts` 表。
- **row（列 / 記錄，record）**：每一列代表一筆記錄，也就是一個物件，例如一位使用者。
- **column（欄 / 屬性，attribute）**：每一欄是該記錄的一個屬性，例如 name、email。

### Primary Key 與 Foreign Key

幾乎每張表都會有一個 `id` 欄位，給每一列一個獨一無二的編號，這個欄位稱為該記錄的 **primary key（主鍵）**。它是這筆記錄的身分證，保證每一列都能被唯一辨識。

你可以讓某張表的某個欄位「指向」另一張表的 `id`，藉此把兩張表「連結」起來。例如 `posts` 表裡有一欄叫 `user_id`，存的是作者在 `users` 表裡的 `id`。因為這一欄裝的是「別張表的主鍵」，所以稱為 **foreign key（外鍵）**。

一句話區分：primary key 是「這張表自己的唯一編號」，foreign key 是「指向另一張表主鍵的欄位」，它是關聯式資料庫能把資料表串起來的關鍵。

### Schema：資料庫的設定藍圖

SQL 幾乎什麼都能做。第一類指令是用來「搭建結構」的：`CREATE DATABASE` 建立資料庫、`CREATE TABLE` 建立單一資料表，也有對應的指令可以修改（`ALTER`）或刪除（`DROP`）它們。

你的資料庫「長什麼樣子」這些設定資訊，會被存在一個特別的檔案裡，叫做 **schema（綱要）**。每次你更動資料庫的「結構」，schema 就會跟著更新。你可以把 schema 想成一段描述：「這是我們的資料庫，裡面有幾張表。第一張叫 `users`，有 `id` 欄（整數）、`name` 欄（一串字元）、`email` 欄（一串字元）⋯⋯」。

除了建立資料表，你還可以要求資料庫「某一欄只能有唯一值」（例如 username 不可重複），或用 `CREATE INDEX` 為某欄建立 **index（索引）**。索引的作用是「事先幫你把表排序好」，這樣你日後拿這欄來搜尋（例如 username）時，資料庫會快非常多。原則是：凡是你之後常拿來當搜尋條件的欄位，就替它建索引。

### CRUD：操作資料的四種動作

資料表建好、拿到空表之後，就開始用 SQL 的 statement（陳述句）往裡面放資料、查資料。核心的四種動作合稱 **CRUD**：Create（新增）、Read（讀取）、Update（更新）、Destroy/Delete（刪除）。實務上你花最多時間下的是 Read，因為工作絕大部分是「問資料、把它顯示出來」。

每一個 CRUD 指令都由幾個部分組成：

1. **action / statement（動作，陳述句）**：例如 `SELECT`、`INSERT`、`UPDATE`、`DELETE`。
2. **table（要操作的表）**：例如 `FROM users`。
3. **conditions / clauses（條件，子句）**：例如 `WHERE users.id = 1`。

!!! danger "沒有 WHERE 的動作會套用到整張表"
    如果你只下動作卻不指定條件，它會作用在「整張表的每一列」上，通常會出大事。最經典的災難是打了 `DELETE FROM users` 卻忘了加 `WHERE`，結果所有使用者都被刪光。你多半只想刪某一位使用者，那就用（最好是唯一的）屬性當條件，例如 `DELETE FROM users WHERE users.id = 1`。

在條件裡你可以用 **comparison operator（比較運算子）** `>`、`<`、`<=` 等來框出一群列，也可以用 **logical operator（邏輯運算子）** `AND`、`OR`、`NOT` 把多個條件串起來，例如 `DELETE FROM users WHERE id > 12 AND name = 'foo'`。

補充兩個語法習慣：SQL 每句結尾習慣加 **分號 `;`**；字串請用**單引號 `'`**，不要用雙引號 `"`。

### 逐一認識四種動作

**Create（新增）** 用 `INSERT INTO`，要指定「往哪些欄位」放，接著給對應的值。這是少數不必擔心「選到哪些列」的指令，因為你只是往表裡加新的列：

```sql
INSERT INTO users (name, email) VALUES ('foobar', 'foo@bar.com');
```

**Update（更新）** 用 `UPDATE`，搭配 `SET` 指定要改成什麼（用 `欄位 = 值` 的形式），並用 `WHERE` 指定改哪些列。要小心：如果 `WHERE` 命中了多列（例如你用一個很常見的名字去搜），這些列會全部被改掉。實務上你會用 `id` 當條件，因為它一定唯一：

```sql
UPDATE users
SET name = 'barfoo', email = 'bar@foo.com'
WHERE email = 'foo@bar.com';
```

**Read（讀取）** 用 `SELECT`，是最常見的動作。`*` 代表「所有欄位」：

```sql
SELECT * FROM users WHERE created_at < '2013-12-11 15:35:59';
```

指定欄位時，習慣上「表名.欄位名」一起寫。單一張表的查詢你可以只寫欄位名，但只要牽涉到不只一張表，SQL 就會抱怨，所以乾脆養成永遠寫全名的習慣：`SELECT users.id, users.name FROM users`。

`SELECT` 有個近親叫 `SELECT DISTINCT`，用在你只想要某欄的「不重複」值。例如想列出所有使用者的名字但不要重複：`SELECT DISTINCT users.name FROM users`。

### JOIN：把資料表接在一起

如果你想拿到「某位使用者發表的所有文章」，你得告訴 SQL「用哪些欄位把兩張表對接起來」，這靠 `ON` 子句，而執行「對接」這個動作的指令是 `JOIN`。

問題來了：把兩張表接在一起時，如果資料對不齊（例如一位使用者寫了很多篇文章，或某位使用者根本沒寫文章），到底要保留哪些列？這有四種選擇。

!!! tip "先搞清楚 JOIN 裡的「左」是誰"
    「左表」指的是原本那張表，也就是 `FROM` 後面接的那張。以下面的例子來說，`users` 就是左表。

1. **`INNER JOIN`（也可直接寫 `JOIN`）**：你最好的朋友，95% 的情況都用它。**只保留兩張表都對得上的列。** 例如 `SELECT * FROM users JOIN posts ON users.id = posts.user_id`，只會回傳「真的有寫文章的使用者」以及「真的有標明作者的文章」。如果一位作者寫了多篇，就會有多列，而使用者那幾欄的資料會重複出現。
2. **`LEFT OUTER JOIN`**：保留左表的所有列，再把右表對得上的列補進來。補不上的格子填 `NULL`。例如回傳「所有使用者」，有寫文章的就把文章列出來，沒寫的就把 `posts` 那幾欄設為 `NULL`。
3. **`RIGHT OUTER JOIN`**：反過來，保留右表的所有列。
4. **`FULL OUTER JOIN`**：兩張表的所有列全保留，對不上的格子都填 `NULL`。

JOIN 一樣可以加條件，例如只要某位特定使用者的文章：

```sql
SELECT * FROM users JOIN posts ON users.id = posts.user_id WHERE users.id = 42;
```

### 聚合函式：把一整欄壓成一個值

一般查詢會回傳一堆列，但有時你只想要「一個總結性的數值」，例如某位使用者寫過的文章 `COUNT`（數量）。這時就用 SQL 內建的 **aggregate function（聚合函式）**，常見的有 `COUNT`、`SUM`、`AVG`、`MIN`、`MAX` 等。

用法是把函式放進 `SELECT` 裡，例如 `SELECT MAX(users.age) FROM users`。函式預設只作用在「單一欄」上；只有少數函式支援 `*`，例如 `COUNT(*)` 是數所有列，但 `MAX(*)` 就沒有意義（對「全部」取最大值是什麼意思？）。

常搭配 **alias（別名）** `AS` 來替欄位或函式結果重新命名，方便後面引用。例如下面會回傳一個叫 `highest_age` 的欄位：

```sql
SELECT MAX(users.age) AS highest_age FROM users;
```

聚合函式真正好玩的地方，是搭配 `GROUP BY` 把資料「先分組再各自聚合」。例如不是數「所有人的文章總數」，而是數「每一位使用者各自的文章數」：

```sql
SELECT users.id, users.name, COUNT(posts.id) AS posts_written
FROM users
JOIN posts ON users.id = posts.user_id
GROUP BY users.id, users.name;
```

（把 `users.name` 一起放進 `GROUP BY` 是好習慣：把所有「有被 SELECT 但沒被聚合」的欄位都列進 `GROUP BY`，語意更清楚，多數資料庫也更嚴謹。）

### WHERE 與 HAVING 的差別

最後一個常見需求：只顯示部分結果。一般情況你用 `WHERE` 過濾。但如果你已經用了聚合函式（例如上面的 `COUNT`），`WHERE` 就派不上用場了——因為 `WHERE` 是在「分組聚合之前」逐列過濾的，它看不到聚合後的結果。

要根據「聚合後的結果」來過濾，得用 **`HAVING`** 子句，它本質上就是「給聚合用的 WHERE」。例如只顯示寫過 10 篇以上文章的使用者：

```sql
SELECT users.id, users.name, COUNT(posts.id) AS posts_written
FROM users
JOIN posts ON users.id = posts.user_id
GROUP BY users.id, users.name
HAVING COUNT(posts.id) >= 10;
```

一句話記住差別：**`WHERE` 在分組前過濾單列，`HAVING` 在分組後過濾聚合結果。**

### 為什麼 SQL 比你的程式碼快

學好 SQL 特別值得，因為「讓 SQL 聰明地幫你算」通常遠比「把整堆資料撈出來，再用 JavaScript 之類的語言在記憶體裡處理」要快得多。

舉例來說，如果你想要所有使用者不重複的名字，你「可以」先 `SELECT users.name FROM users` 把整份清單撈出來，再用 JavaScript 去除重複——但這代表你要把所有資料從資料庫拉出、塞進記憶體、再逐一迭代。直接用 `SELECT DISTINCT users.name FROM users`，讓 SQL 一步到位就好。

SQL 天生為速度而設計。它有一個 **query optimizer（查詢優化器）**，會先看過你整段查詢，判斷該接哪些表、用什麼順序執行最快。`SELECT` 和 `SELECT DISTINCT` 的差距，跟你自己撈出來處理所花的時間相比，幾乎可以忽略。把 SQL 學好，你就能寫出功能更強、也更快的查詢。

觀念這麼多，第一次看一定會有些地方卡住，這很正常——這篇濃縮解說涵蓋的東西，本來就不是十分鐘能全部吸收的。接下來的練習會讓你在動手中把它們一一坐實；到專案階段，你更會有大量機會反覆應用。別怕，撐下去就對了。

## 程式碼範例

以下把一個「部落格」情境的常用查詢串成一組最小範例。假設有 `users` 與 `posts` 兩張表，`posts.user_id` 是指向 `users.id` 的 foreign key。

```sql
-- 建立資料表：users 的 id 是 primary key，會自動遞增
CREATE TABLE users (
  id    INTEGER PRIMARY KEY,
  name  VARCHAR(100),
  email VARCHAR(100)
);

-- posts 的 user_id 是 foreign key，指向 users.id
CREATE TABLE posts (
  id      INTEGER PRIMARY KEY,
  title   VARCHAR(200),
  user_id INTEGER REFERENCES users(id)
);

-- Create：新增一筆使用者（明確列出欄位是好習慣）
INSERT INTO users (name, email) VALUES ('Ada', 'ada@example.com');

-- Read：讀取符合條件的列
SELECT users.id, users.name FROM users WHERE users.name = 'Ada';

-- Read + JOIN：列出每位作者與其文章標題（只保留有寫文章的作者）
SELECT users.name, posts.title
FROM users
JOIN posts ON users.id = posts.user_id;

-- Read + 聚合 + 分組：算出每位使用者各寫了幾篇文章
SELECT users.id, users.name, COUNT(posts.id) AS posts_written
FROM users
JOIN posts ON users.id = posts.user_id
GROUP BY users.id, users.name
HAVING COUNT(posts.id) >= 10;   -- 只留下寫超過 10 篇的人

-- Update：一定要用唯一的 id 當條件，避免誤改多列
UPDATE users SET email = 'ada@new.com' WHERE users.id = 1;

-- Delete：務必加 WHERE，否則整張表會被清空
DELETE FROM users WHERE users.id = 1;
```

## 常見陷阱

!!! warning "沒加 WHERE 的 DELETE 或 UPDATE 會作用在整張表"
    `DELETE FROM users` 會刪掉所有使用者，`UPDATE users SET ...` 會改掉每一列。動手前先確認條件子句存在，且最好用唯一的 `id` 當條件。可以先用相同 `WHERE` 條件下 `SELECT` 確認命中的是不是你要的那幾列，再改成 `DELETE` 或 `UPDATE`。

!!! warning "對聚合結果過濾要用 HAVING，不是 WHERE"
    `WHERE` 在分組聚合「之前」逐列過濾，看不到 `COUNT`、`SUM` 這類聚合值。想根據聚合結果篩選（例如「文章數大於 10」），必須用 `HAVING`。

!!! warning "字串用單引號，句尾記得加分號"
    SQL 用單引號 `'` 包字串，雙引號 `"` 在許多資料庫是拿來指涉識別字（欄位/表名）的，用錯會報錯。每句結尾也習慣加分號 `;`。

!!! warning "多表查詢一定要寫「表名.欄位名」"
    單表查詢可以只寫欄位名，但一旦 JOIN 了多張表，若兩張表有同名欄位，SQL 會因為「不知道你指哪一個」而報錯。養成永遠寫全名的習慣最省事。

## 練習

依序完成以下兩個互動式教學，動手把上面的觀念練熟：

1. 先做 [SQL Teaching](https://www.sqlteaching.com/) 的互動式 SQL 教學，從最基礎的 `SELECT` 開始建立手感。
2. 再做更完整的 [SQL Bolt](http://sqlbolt.com/) 互動式教學，把 JOIN、聚合、分組等主題練到熟。

練習時的自我檢核目標：不看提示，你能不能寫出「用 JOIN 把兩張表接起來」「用 `GROUP BY` + `COUNT` 算出每組數量」「用 `HAVING` 過濾聚合結果」這三種查詢？能穩定寫出來，就代表核心觀念到位了。這一課的重點是「vanilla JOIN」與「vanilla 聚合函式」以前的內容，務必確實吸收；更進階的查詢就算暫時不熟也沒關係，未來真的用到時再查即可。

## 原文與延伸資源

- 原文：[Databases and SQL](https://www.theodinproject.com/lessons/node-path-databases-databases-and-sql)
- 本課引用：
    - [SQL Teaching](https://www.sqlteaching.com/)：互動式 SQL 入門教學
    - [SQL Bolt](http://sqlbolt.com/)：更深入的互動式 SQL 教學
    - [A Visual Explanation of SQL Joins](http://blog.codinghorror.com/a-visual-explanation-of-sql-joins)：Jeff Atwood 對各種 JOIN 的視覺化說明
    - [W3Schools SQL Join 教學](http://www.w3schools.com/sql/sql_join.asp)：JOIN 的另一種解釋
    - [W3Schools 線上 SQL 練習場](http://www.w3schools.com/sql/trysql.asp)：可在瀏覽器直接試跑查詢

---

> 本講義改寫自 The Odin Project《Databases and SQL》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
