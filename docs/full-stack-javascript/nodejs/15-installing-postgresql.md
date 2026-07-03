---
title: 安裝 PostgreSQL
source_url: https://www.theodinproject.com/lessons/nodejs-installing-postgresql
source_file: vendor/curriculum/nodeJS/express/installing_postgresql.md
path: full-stack-javascript
course: NodeJS
order: 15
status: draft
generated: 2026-07-04
---

# 安裝 PostgreSQL

> 改寫自 The Odin Project：[Installing PostgreSQL](https://www.theodinproject.com/lessons/nodejs-installing-postgresql)
> ｜Full Stack JavaScript › NodeJS › Express

## 核心概念

### 為什麼需要資料庫

幾乎所有的 web 應用都少不了「資料持久化」（data persistence）。所謂持久化，就是把資料保存下來，讓它在應用重新啟動、伺服器重開機之後仍然存在。想想 The Odin Project 本身：你的使用者名稱存在哪裡？你送出的專案作業紀錄存在哪裡？連你現在正在讀的這篇課程內容，又是從哪裡取出來的？答案都是同一個——資料庫（database）。

如果沒有資料庫，你的 Node.js 程式一旦結束，記憶體裡的所有變數就會消失。使用者註冊的帳號、發表的貼文、按下的收藏，全都會不見。資料庫的任務，就是把這些資料安全地寫進硬碟，並提供有效率的方式讓你之後再查詢（query）、修改與刪除。對一個 full-stack 開發者來說，能夠自己設計、建立、查詢資料庫，是不可或缺的核心能力。

### 為什麼選 PostgreSQL

The Odin Project 選用 [PostgreSQL](https://www.postgresql.org/) 作為整個課程的資料庫。PostgreSQL（常簡稱 Postgres）是一套開源、免費、且高度成熟的關聯式資料庫管理系統（RDBMS，Relational Database Management System）。它以「穩定、標準相容、功能齊全」著稱，被大量正式產品採用，從新創到大型企業都在用。

如果你先前已經上過課程裡的 SQL 課，那是個好消息：你學過的 SQL 知識幾乎可以原封不動地搬到 PostgreSQL 上使用。SQL（Structured Query Language，結構化查詢語言）是操作關聯式資料庫的標準語言，`SELECT`、`INSERT`、`UPDATE`、`DELETE`、`JOIN`、`WHERE` 這些語法在 PostgreSQL 裡都通用。除此之外，PostgreSQL 還有一些自己特有的功能與擴充（例如 JSONB、陣列型別、豐富的內建函式），這些之後遇到時再慢慢學。

這一課的目標很單純：**把 PostgreSQL 安裝到你的電腦上，並認識用來操作它的 psql shell。** 下一課才會把它接進 Express 應用裡真正拿來用。

### psql 是什麼

PostgreSQL 安裝完成後，你會得到兩個東西：一個是**資料庫伺服器**（server，實際負責儲存與處理資料的背景程式），另一個是用來跟它溝通的**用戶端工具**。其中最基本、最常用的用戶端就是 **psql**。

psql 全名是 PostgreSQL interactive terminal，是一個以終端機（terminal）為介面的前端工具，讓你可以互動式地執行 SQL query、管理資料庫。它通常會跟 PostgreSQL 一起被安裝進來，透過命令列（command line）就能啟動。它的能力範圍包括：

- 執行任意 SQL 查詢與指令
- 建立、修改資料庫的結構（例如建立資料表 table、修改欄位 column）
- 在命令列環境中直接與資料庫互動

除了執行標準 SQL，psql 還提供許多「meta-command（後設指令）」以及類似 shell 的功能，方便你撰寫腳本、把重複的工作自動化。這些 meta-command 通常以反斜線 `\` 開頭，例如：

- `\l`：列出所有資料庫（list databases）
- `\c 資料庫名`：切換到某個資料庫（connect）
- `\dt`：列出目前資料庫裡的所有資料表（display tables）
- `\d 資料表名`：查看某個資料表的結構
- `\du`：列出所有使用者角色（roles）
- `\q`：離開 psql（quit）

要特別分清楚：這些以 `\` 開頭的是 psql 自己的指令，不是 SQL；而真正的 SQL 語句（例如 `SELECT * FROM users;`）則需要以分號 `;` 結尾。忘記加分號是初學者最常見的困惑來源之一（後面「常見陷阱」會再提醒）。

### 資料庫檔案存在哪裡

當你透過 psql 操作資料庫時，實際的資料存放在哪？答案是：就在你本機的檔案系統（file system）裡。PostgreSQL 把每個資料庫都以一般檔案的形式，儲存在檔案系統中的一個「資料目錄」（data directory）裡。這個資料目錄的預設位置會因作業系統而異——macOS、Linux、Windows 各自不同，安裝方式（Homebrew、官方安裝包、apt 套件）也會影響它的路徑。

對現階段的你來說，並不需要記住或手動去動這個目錄。重點是建立正確的心智模型：**你在 psql 裡打的每一行指令，最終都會落地成硬碟上的實體檔案**，所以資料才能在你關掉終端機、甚至重開機之後依然存在——這就是「持久化」的實際意義。

### 這一課的定位

這一課本質上是一個「環境準備」的步驟：安裝軟體、確認它能跑起來、認識 psql 這個入口。它偏向操作與觀念，程式碼不多。真正把 PostgreSQL 拿來寫 CRUD、接進 Express route（路由）與 controller（控制器）的部分，是留給後面的課程。所以請把重點放在：**成功裝好、能進到 psql 提示字元、大致知道 psql 能做什麼。**

## 程式碼範例

以下是安裝完成後，最常用來確認一切正常、以及基本操作的關鍵指令。實際的安裝步驟因作業系統而異，請以「練習」段落與原文的安裝指南為準。

```bash
# 確認 PostgreSQL 版本，能印出版本代表安裝成功
psql --version

# 進入 psql 互動介面（依安裝方式，可能需要指定使用者，例如 -U postgres）
psql

# 若要以特定使用者連進特定資料庫：
# psql -U 使用者名稱 -d 資料庫名稱
```

進到 psql 之後，你會看到類似 `postgres=#` 的提示字元。此時可以試試以下 meta-command 與 SQL：

```sql
-- 以下這些是 psql meta-command，不需要分號
\l          -- 列出所有資料庫
\du         -- 列出所有使用者角色
\dt         -- 列出目前資料庫的所有資料表
\conninfo   -- 顯示目前的連線資訊

-- 以下這些是真正的 SQL，記得以分號結尾
SELECT version();              -- 查看 PostgreSQL 版本字串
CREATE DATABASE top_test;      -- 建立一個測試資料庫
\c top_test                    -- 切換進去（meta-command）

-- 建立一張表、塞一筆資料、再查出來（完整走一遍持久化流程）
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL
);
INSERT INTO users (username) VALUES ('odin');
SELECT * FROM users;

\q          -- 離開 psql
```

## 常見陷阱

!!! warning "先完成 SQL 課程再來"
    這一課以及後續所有課程，都預設你已經理解 SQL 的語法與觀念。請務必先完成課程路徑中的 [SQL 課程](https://www.theodinproject.com/paths/full-stack-javascript/courses/databases)。如果 `SELECT`、`JOIN`、`WHERE`、主鍵（primary key）、外鍵（foreign key）這些名詞對你還很陌生，強烈建議先回頭把 SQL 補起來，否則後面會非常吃力。

!!! warning "SQL 語句忘記加分號"
    在 psql 裡，一句 SQL（例如 `SELECT * FROM users`）必須以分號 `;` 結尾才會被送出執行。如果你打完按 Enter 卻只看到提示字元從 `=#` 變成 `-#`，代表 psql 認為你還沒打完，正在等你把這句補完。這時補上一個分號再按 Enter 即可。相對地，`\` 開頭的 meta-command（如 `\dt`）不需要分號，直接按 Enter 就會執行。

!!! warning "psql 指令與 SQL 是兩回事"
    以反斜線 `\` 開頭的是 psql 專屬的 meta-command，只能在 psql 裡用；它們不是標準 SQL，把 `\dt` 寫進你的 Node.js 程式或 SQL 檔案裡是行不通的。反過來，`SELECT`、`CREATE TABLE` 這些才是可以在任何 PostgreSQL 用戶端執行的標準 SQL。

!!! warning "找不到 psql 指令 / 連線被拒絕"
    安裝後如果終端機說 `psql: command not found`，通常是安裝路徑沒有加進系統的 PATH 環境變數；若出現連線相關錯誤（例如 role 不存在、認證失敗），多半是使用者角色或伺服器啟動狀態的問題。這些狀況與作業系統、安裝方式高度相關，請直接對照你所用平台的官方安裝指南處理，不要盲目複製網路上其他 OS 的指令。

## 練習

1. 依照你的作業系統，跟著對應的 PostgreSQL 安裝指南操作。安裝步驟牽涉到套件管理器、路徑與使用者權限設定，屬於作業系統專屬內容，請直接參照原文提供的官方指南：
   - Linux：`https://github.com/TheOdinProject/curriculum/tree/main/nodeJS/express/installation_guides/postgresql/linux.md`
   - macOS：`https://github.com/TheOdinProject/curriculum/tree/main/nodeJS/express/installation_guides/postgresql/macos.md`
2. 安裝完成後，在終端機執行 `psql --version`，確認能印出版本號，代表安裝成功。
3. 進入 psql，試著執行幾個 meta-command（例如 `\l`、`\du`、`\conninfo`），熟悉這個互動介面。
4. 建立一個測試資料庫、建一張表、塞一筆資料、再用 `SELECT` 查出來，最後用 `\q` 離開。完整走一遍，體會「資料被寫進硬碟並持久保存」的過程。

### 自我檢核

- 為什麼資料持久化（data persistence）對 web 應用如此重要？
- psql 是什麼？它能做哪些事？

## 原文與延伸資源

- 原文：[Installing PostgreSQL](https://www.theodinproject.com/lessons/nodejs-installing-postgresql)
- 本課引用：
  - [PostgreSQL 官方網站](https://www.postgresql.org/)
  - [SQL 課程（Databases）](https://www.theodinproject.com/paths/full-stack-javascript/courses/databases)
  - Fireship 的 PostgreSQL 簡介影片：`https://www.youtube.com/watch?v=n2Fluyr3lbc`
  - Linux 安裝指南：`https://github.com/TheOdinProject/curriculum/tree/main/nodeJS/express/installation_guides/postgresql/linux.md`
  - macOS 安裝指南：`https://github.com/TheOdinProject/curriculum/tree/main/nodeJS/express/installation_guides/postgresql/macos.md`

---

> 本講義改寫自 The Odin Project《Installing PostgreSQL》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
