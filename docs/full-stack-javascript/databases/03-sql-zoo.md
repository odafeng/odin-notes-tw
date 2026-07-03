---
title: 專案：SQL Zoo
source_url: https://www.theodinproject.com/lessons/node-path-databases-sql-zoo
source_file: vendor/curriculum/databases/databases/project_sql_zoo.md
path: full-stack-javascript
course: Databases
order: 3
status: draft
generated: 2026-07-04
---

# 專案：SQL Zoo

> 改寫自 The Odin Project：[Project: SQL Zoo](https://www.theodinproject.com/lessons/node-path-databases-sql-zoo)
> ｜Full Stack JavaScript › Databases › Databases

## 核心概念

前一課你把 SQL 的觀念看過一遍，但「看得懂」和「寫得出來」是兩回事。SQL 是一門靠手感累積的技能，唯一的練法就是對著真實的資料表反覆下 query（查詢），錯了就修、修了再跑。

[SQL Zoo](https://sqlzoo.net/wiki/SQL_Tutorial) 是網路上少數能讓你**直接對現成資料表跑 query 並立即看到結果**的免費資源。它的每一個 tutorial（教學單元）都會先給你一張表，再問你一連串問題，你把答對的 query 寫進輸入框、按 Run（執行），網站馬上告訴你結果對不對。不需要自己安裝資料庫、不需要匯入資料，打開瀏覽器就能練。

這個專案的任務很單純：**完成 SQL Zoo 的 Tutorial 0 到 9，以及每個單元結尾的 quiz（測驗）**。前面幾題通常很短、很直覺；越到後面越燒腦，有些自我 join、子查詢的題目會讓你卡上好一陣子——那正是它的價值所在。

### 這 10 個單元在練什麼

SQL Zoo 的單元是刻意排序的，難度層層堆疊。理解每個單元對應的技巧，你在卡關時比較知道自己缺的是哪一塊：

| 單元 | 主題 | 核心技巧 |
| --- | --- | --- |
| 0 | SELECT basics | 最基本的 `SELECT ... FROM ... WHERE`，先熟悉輸入框與執行流程 |
| 1 | SELECT name | 字串比對：`LIKE`、萬用字元 `%` 與 `_`、`CONCAT`、`LENGTH`、`LEFT` |
| 2 | SELECT from World | 用世界各國資料練 `WHERE`、`AND`／`OR`、`IN`、`BETWEEN`、`ROUND`、`xor` |
| 3 | SELECT from Nobel | 諾貝爾獎資料，延伸條件過濾與排序 `ORDER BY`、`IN (...)` |
| 4 | SELECT within SELECT | subquery（子查詢）：把一個查詢的結果當成另一個查詢的條件 |
| 5 | SUM and COUNT | aggregate（聚合）函式 `SUM`、`COUNT`、`AVG`、`MAX`，搭配 `GROUP BY`、`HAVING` |
| 6 | JOIN | 跨表 `JOIN`（以足球賽事資料為例），理解 foreign key（外鍵）如何串起兩張表 |
| 7 | More JOIN | 進階多表 `JOIN`（電影／演員資料），練 `JOIN ... ON` 的層層串接 |
| 8 | Using NULL | `NULL` 的特殊性、`LEFT JOIN`／`RIGHT JOIN`、`COALESCE`、`IS NULL` |
| 9 | Self JOIN | self join（自我 join）：一張表跟自己 join，用來查同一份資料內部的關聯 |

### 幾個貫穿全部單元的重點技巧

- **`GROUP BY` 與 `HAVING` 的分工**：`WHERE` 在分組「之前」過濾個別 row（列），`HAVING` 在分組「之後」過濾聚合結果。想篩掉「總和小於 100 的組別」只能用 `HAVING`，不能用 `WHERE`。
- **subquery（子查詢）**：當「答案要先算另一個答案」時就用得上。例如「找出人口比德國多的國家」，就得先用子查詢查出德國的人口。
- **`JOIN` 的心智模型**：`JOIN` 不是魔法，它是把兩張表依 `ON` 條件配對成一張更寬的表。想清楚「哪兩個欄位相等時該把兩列接在一起」，`JOIN` 就寫得出來。
- **`NULL` 不等於任何東西**：`NULL = NULL` 的結果不是 true 而是 `NULL`。判斷空值要用 `IS NULL`／`IS NOT NULL`，不能用 `=`。

## 程式碼範例

以下用 SQL Zoo 各單元會出現的題型，示範對應的 query 寫法。這些語法在 SQL Zoo 的輸入框裡可直接執行。

```sql
-- 單元 2 World：查人口超過兩億的國家，只要國名與人口
SELECT name, population
FROM world
WHERE population > 200000000;
```

```sql
-- 單元 4 SELECT within SELECT：找出人口比俄羅斯（Russia）多的國家
-- 內層子查詢先算出俄羅斯的人口，外層再拿來比較
SELECT name
FROM world
WHERE population > (
    SELECT population FROM world WHERE name = 'Russia'
);
```

```sql
-- 單元 5 SUM and COUNT：依洲別統計總人口，只留下總人口超過一億的洲
-- WHERE 無法過濾 SUM，必須用 HAVING
SELECT continent, SUM(population) AS total
FROM world
GROUP BY continent
HAVING SUM(population) > 100000000;
```

```sql
-- 單元 6 JOIN：把進球紀錄 goal 與球隊 game 兩張表 join
-- ON 指定「goal 的比賽 id 等於 game 的 id」時才把兩列接起來
SELECT player, teamid, stadium, mdate
FROM goal
JOIN game ON goal.matchid = game.id;
```

```sql
-- 單元 8 Using NULL：用 LEFT JOIN 保留「沒有指派部門」的老師
-- COALESCE 在 dept 為 NULL 時改顯示 'None'
SELECT teacher.name, COALESCE(dept.name, 'None') AS department
FROM teacher
LEFT JOIN dept ON teacher.dept = dept.id;
```

> 提示：這些只是示範句型。實際題目的欄位名稱、篩選條件請以 SQL Zoo 頁面上給的表結構為準。

## 常見陷阱

!!! warning "Engine 下拉選單記得選 MySQL"
    主頁面右上角有一個「Engine」下拉選單，請確認它維持在預設的 **MySQL**。不同引擎的語法細節（例如字串函式、日期處理）會有差異，若切到別的引擎，你照著 MySQL 語法寫的答案可能會判錯。此外，資料量大的查詢結果會被網站截斷、不會顯示全部 row 與欄位，所以有時候你的答案其實正確，只是畫面上看起來「不完整」——別因此以為寫錯了。

!!! warning "用 = 判斷 NULL 永遠得不到結果"
    `NULL` 代表「未知」，任何和 `NULL` 的比較（包括 `NULL = NULL`）結果都是 `NULL` 而非 true。想篩出空值請用 `IS NULL`，想排除空值用 `IS NOT NULL`。這是單元 8 最容易踩的坑。

!!! warning "WHERE 和 HAVING 不要混用"
    `WHERE` 在 `GROUP BY` 分組之前作用，看的是單一 row 的欄位，因此不能在 `WHERE` 裡放 `SUM()`、`COUNT()` 這類聚合函式。要對聚合結果過濾（例如「總和大於某值」）一律改用 `HAVING`。搞錯這兩者是單元 5 卡關的主因。

## 練習

> 以下把原文 Assignment 改寫為繁中步驟。SQL Zoo 是外部互動平台，實際操作與判題都在其網站上完成。

1. 前往 [SQL Zoo](https://sqlzoo.net/wiki/SQL_Tutorial)，完成「Tutorial Section」底下列出的 **Tutorial 0 到 9**（含標記 `+/-` 的進階題），以及每個單元結尾附的 **quiz（測驗）**。第一個單元叫「SELECT basics」。
    - 動手前先確認主頁面右上角的「Engine」下拉選單維持在預設的 **MySQL**。
    - 提醒：資料量大的查詢結果會被截斷，畫面不一定顯示全部 row 與欄位，「答案」看起來可能不是 100% 完整，這是正常現象。
    - 建議照單元順序做，因為難度是層層堆疊的；卡關時回頭對照上方「這 10 個單元在練什麼」的表格，確認自己缺的是哪個技巧。
2. 做完之後，原課程希望你回填一份 [SQL 課程回饋表單](https://docs.google.com/forms/d/e/1FAIpQLSenvMG6WFbOOEap_biQOwqfbH-j-xsf5Eyv4ir2Rx5FsYSecQ/viewform?usp=sf_link)（連結見原文），你的回饋能幫助 The Odin Project 持續改進教材。此步驟為選填，不影響學習成效。

## 原文與延伸資源

- 原文：[Project: SQL Zoo](https://www.theodinproject.com/lessons/node-path-databases-sql-zoo)
- 本課引用：[SQL Zoo 官方教學（SQL Tutorial）](https://sqlzoo.net/wiki/SQL_Tutorial)
- 延伸：[SQL 課程回饋表單](https://docs.google.com/forms/d/e/1FAIpQLSenvMG6WFbOOEap_biQOwqfbH-j-xsf5Eyv4ir2Rx5FsYSecQ/viewform?usp=sf_link)

---

> 本講義改寫自 The Odin Project《Project: SQL Zoo》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
