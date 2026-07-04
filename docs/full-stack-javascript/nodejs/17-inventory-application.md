---
title: 專案：庫存管理
source_url: https://www.theodinproject.com/lessons/node-path-nodejs-inventory-application
source_file: vendor/curriculum/nodeJS/express/project_inventory_application.md
path: full-stack-javascript
course: NodeJS
order: 17
generated: 2026-07-04
---

# 專案：庫存管理

> 改寫自 The Odin Project：[Project: Inventory Application](https://www.theodinproject.com/lessons/node-path-nodejs-inventory-application)
> ｜Full Stack JavaScript › NodeJS › Express

## 核心概念

前面幾課你學了不少零散的技巧：Express 的 route（路由）與 controller（控制器）、EJS template（樣板）、HTML 表單與 POST 請求、`express.urlencoded()` middleware（中介函式）、部署，以及安裝與連線 PostgreSQL 資料庫。這一課沒有新的教材，而是要你把這些片段一次組裝起來，做出一個真正查得到、也改得動資料的網站——一個**庫存管理（inventory management）應用程式**。

想像你在幫一間店管理庫存。這間店賣什麼由你自己決定：生鮮雜貨、汽車零件、嬰兒玩具、樂器、甚至是小馬都行。重點不在題材，而在於你要建立兩種彼此相關的資料：**category（分類）**與 **item（品項）**。使用者一進首頁，先看到所有分類；點進某個分類，就看到這個分類底下的所有品項。而且對這兩種資料，你都要提供完整的 **CRUD** 能力——Create（新增）、Read（讀取）、Update（更新）、Delete（刪除），讓任何造訪網站的人都能新增、檢視、修改、刪除任何品項或分類。

這個專案之所以重要，是因為它逼你把「資料模型」與「使用者操作」對應起來。以下四個重點，值得在動手前先在腦中建立清楚的地圖。

### 1. 先設計資料庫，再寫任何一行程式

這是最容易被忽略、卻最關鍵的一步。動手之前，先把你需要的**資料表（table）**、每張表的**欄位（field）**，以及表與表之間的**關聯（relation）**寫在紙上。

原文給了兩個範例幫你想清楚「關聯」是什麼：

- **遊戲管理 app**：可以有 game（遊戲）、genre（類型）、developer（開發商）三種 entity（實體）。一款遊戲可以有一個或多個開發商與類型；反過來，一個開發商也能開發多款遊戲——這是**多對多（many-to-many）**關聯。
- **寶可夢管理 app**：可以有 pokemon、trainer（訓練家）、type（屬性）三種 entity。每隻寶可夢必須屬於某個 type；一個訓練家則可以擁有多隻寶可夢——這裡混合了**一對多（one-to-many）**與**多對多**。

回到你的庫存 app，最簡單的模型是：一個 category 底下有多個 item，每個 item 屬於一個 category，這是典型的一對多關聯。你會在 `item` 表放一個 `category_id` 欄位，作為指向 `category` 表的 **foreign key（外鍵）**。想更進階，也可以讓一個 item 同時屬於多個 category（多對多），那就需要一張額外的中介表（join table）。先決定清楚，後面的 route 與 SQL 才有依據。

### 2. 依 CRUD 規劃 route 與 controller

決定好資料模型後，把每一種操作對應到一條 route。以 item 為例，一組完整的 CRUD 通常長這樣（category 也是對稱的一組）：

| 動作 | HTTP 方法 | 路徑範例 | 說明 |
| --- | --- | --- | --- |
| 列表 | GET | `/items` | 顯示所有品項 |
| 單筆檢視 | GET | `/item/:id` | 顯示某個品項細節 |
| 新增表單 | GET | `/item/create` | 顯示空白表單 |
| 送出新增 | POST | `/item/create` | 寫入資料庫 |
| 更新表單 | GET | `/item/:id/update` | 顯示帶入舊值的表單 |
| 送出更新 | POST | `/item/:id/update` | 更新該筆資料 |
| 刪除確認 | GET | `/item/:id/delete` | 顯示確認頁 |
| 送出刪除 | POST | `/item/:id/delete` | 從資料庫移除 |

把這些 route 集中放進 router（例如 `routes/itemRouter.js`），實際的邏輯則交給 controller。這正是前面「Routes」與「Controllers」兩課教過的分工：router 只負責「哪個網址對到哪個 handler」，controller 負責「這個 handler 到底做什麼」。

### 3. 先做「讀」，再做「寫」

建議的開發順序是：先把所有 **READ 視圖**做出來（檢視分類、檢視品項），確定資料能從資料庫查出來並正確渲染到頁面，再回頭做 Create 與 Update 的表單與 controller。原因很單純：如果連「讀」都還不通，你很難判斷「寫」進去的資料到底對不對。等你能在畫面上看到資料，寫入功能的除錯就直觀多了。

Update 表單有一個小陷阱值得先記住：它跟 Create 表單長得幾乎一樣，差別在於它要**預先帶入該筆資料的現有值**，讓使用者在舊值上修改。所以更新表單的 GET route 需要先去資料庫把那一筆撈出來，再把值塞進 template 的 `value` 屬性。

### 4. 想清楚刪除時的關聯行為

刪除是這個專案最需要動腦的部分，因為它牽涉到關聯的完整性。當你要刪除一個「底下還有品項」的分類時，該怎麼辦？沒有標準答案，取決於你的 app 需求，常見有三種策略：

- **一起刪掉**：連同這個分類底下的所有品項一併刪除（cascade）。
- **不准刪**：如果分類底下還有品項，就擋下刪除動作，要求使用者先清空或搬移品項。
- **解除關聯**：只把品項的 `category_id` 設為空，品項留著、分類刪掉。

在資料庫層面，這對應到 foreign key 的 `ON DELETE` 行為（如 `CASCADE`、`RESTRICT`、`SET NULL`）。你也可以在 controller 裡先查詢「這個分類還有沒有品項」，有的話就渲染一個提示頁而不真的刪除。無論選哪種，重點是你要**主動決定**這個行為，而不是讓程式在有外鍵約束時直接噴錯。

### 收尾：填假資料與部署

功能都通了之後，寫一支**填充腳本（seed script）**把一批假資料（dummy data）灌進本機資料庫，這樣頁面才不會空空的、也方便你測試各種情境。部署到線上後，記得對線上資料庫再跑一次填充腳本。最後把成果部署出去展示——這一步會用到你在「Deployment」那一課學到的流程。

## 程式碼範例

這一課以整合實作為主，這裡只給幾段最能點出關鍵的骨架，讓你抓到把各片段接起來的手感。

用 `pg` 連線 PostgreSQL 並查詢所有分類（把資料庫存取集中在一個 `db/` 模組裡，controller 只呼叫函式，不直接寫 SQL）：

```javascript
// db/pool.js — 建立一個共用的連線池（connection pool）
const { Pool } = require("pg");

module.exports = new Pool({
  // 實務上用環境變數，別把連線字串寫死在程式碼
  connectionString: process.env.DATABASE_URL,
});
```

```javascript
// db/queries.js — 把 SQL 查詢包成函式
const pool = require("./pool");

async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM categories ORDER BY name");
  return rows; // 回傳分類陣列
}

async function getItemsByCategory(categoryId) {
  // 用參數化查詢（$1）避免 SQL injection（注入攻擊）
  const { rows } = await pool.query(
    "SELECT * FROM items WHERE category_id = $1",
    [categoryId],
  );
  return rows;
}

module.exports = { getAllCategories, getItemsByCategory };
```

controller 呼叫查詢函式，再把結果交給 template 渲染：

```javascript
// controllers/categoryController.js
const db = require("../db/queries");

async function categoryDetailGet(req, res) {
  const items = await db.getItemsByCategory(req.params.id);
  // 把資料透過 locals 物件傳給 EJS template
  res.render("categoryDetail", { items });
}

module.exports = { categoryDetailGet };
```

建立 `items` 表、並用外鍵指向 `categories`，順便決定刪除行為：

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10, 2),
  -- 分類被刪除時，這些品項也一起刪除（cascade）
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE
);
```

## 常見陷阱

!!! warning "沒先設計資料模型就開始寫 route"
    最常見的失敗是急著開檔案寫程式，結果做到一半才發現分類與品項的關聯沒想清楚，被迫大改資料表與 SQL。請務必先把資料表、欄位與關聯畫出來再動手——這十分鐘會替你省下好幾個小時。

!!! warning "刪除分類時直接讓資料庫噴錯"
    如果 `items.category_id` 設了外鍵，而你想刪除一個底下還有品項的分類，資料庫預設會因為約束（constraint）而拒絕，程式就丟出未處理的錯誤。你必須**主動選擇**行為：`ON DELETE CASCADE`（一起刪）、`RESTRICT`（擋下）或 `SET NULL`（解除關聯），或在 controller 裡先檢查再決定，而不是放任它報錯。

!!! warning "SQL 用字串拼接，招來 injection 攻擊"
    千萬別用樣板字串把使用者輸入直接拼進 SQL（例如 `` `... WHERE id = ${req.params.id}` ``）。一定要用參數化查詢（`$1`、`$2` 搭配值陣列），把資料交給驅動去安全帶入。這是每個碰資料庫的專案都必須守住的底線。

!!! warning "把資料庫連線字串寫死在程式碼裡"
    連線資訊（帳密、主機）屬於機密，應放在環境變數，別提交進版本庫。這也讓你在本機與線上部署之間切換不同資料庫時，不必改任何一行程式。

## 練習

這是一個需要自行架設專案、資料庫與部署環境的完整 project（專案），細節與作業系統相關的步驟請以[原文](https://www.theodinproject.com/lessons/node-path-nodejs-inventory-application)為準。整體流程如下：

1. 建立一個 Express 專案，並新增一個 PostgreSQL 資料庫。
2. **動手前先設計資料模型**：寫下你需要的所有資料表、欄位，以及表與表之間的關聯與約束。（例如：一個 category 對多個 item 的一對多關聯。）
3. 規劃並建立你需要的 route 與 controller。
4. 先做完所有 **READ 視圖**（檢視分類、檢視品項），確定資料能查出來並正確顯示。
5. 建立所有表單，並補上 Create 與 Update 動作所需的 controller。
6. 處理刪除功能：想清楚「刪除一個底下還有品項的分類」該怎麼辦——一起刪、擋下、還是解除關聯？依你的 app 需求決定。
7. 對專案有信心後，寫一支腳本把假資料灌進本機資料庫；部署後對線上資料庫再灌一次。
8. 部署上線，展示你的成果。

**額外加分**

1. 把介面做漂亮一點。
2. 我們會在後面的課程學到「用安全密碼建立使用者」，但現在你還不希望**任何人**都能刪改庫存。試著替破壞性操作（刪除、更新）加上保護——要求使用者輸入一組管理員密碼才能確認執行。

## 原文與延伸資源

- 原文：[Project: Inventory Application](https://www.theodinproject.com/lessons/node-path-nodejs-inventory-application)
- 本課引用：前面各課的 Routes、Controllers、Views、Forms and Data Handling、Installing PostgreSQL 與 Deployment；資料庫存取使用 Node 的 `pg`（node-postgres）套件。

---

> 本講義改寫自 The Odin Project《Project: Inventory Application》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
