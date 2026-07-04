---
title: 專案：Where's Waldo 找找看
source_url: https://www.theodinproject.com/lessons/nodejs-where-s-waldo-a-photo-tagging-app
source_file: vendor/curriculum/react/react_and_the_backend/project_wheres_waldo_a_photo_tagging_app.md
path: full-stack-javascript
course: NodeJS
order: 27
status: draft
generated: 2026-07-04
---

# 專案：Where's Waldo 找找看

> 改寫自 The Odin Project：[Project: Where's Waldo (A Photo Tagging App)](https://www.theodinproject.com/lessons/nodejs-where-s-waldo-a-photo-tagging-app)
> ｜Full Stack JavaScript › NodeJS › Full Stack Projects

## 核心概念

《Where's Waldo》（威利在哪裡）是一種經典的找找看遊戲：畫面上有一張擠滿人物、物件的插畫，你要在密密麻麻的畫面裡把主角 Waldo 揪出來。這個專案要你把它做成一個 **photo tagging app（照片標記應用）**：使用者面對一張大圖，要陸續找出幾個指定角色（例如 Waldo、The Wizard、Wilma），每點一次系統就告訴他猜對或猜錯。

這是一個把前後端綁在一起的綜合專案。後端本身不難，難的是你要同時協調前端互動與後端驗證，讓兩邊順暢地對話。這正是實務上你可能被要求打造的那類功能。把它拆解成幾個獨立可驗證的小步驟，一次做一塊，就不會被複雜度壓垮。

### 遊戲流程長什麼樣子

1. 使用者看到一張大圖，開始找角色。
2. 使用者在圖上點擊，畫面在該處彈出一個 **targeting box（瞄準框）**，框裡附一個角色清單（下拉選單）。
3. 使用者從清單選一個角色，前端把「點擊座標 + 選的角色」送到後端。
4. 後端檢查該角色是否真的落在這個瞄準框範圍內，回傳「對」或「錯」。
5. 猜對就在該位置放一個 marker（標記）；猜錯就給錯誤訊息。無論對錯，關掉瞄準框，等下次點擊。
6. 全部角色都找到後，記錄使用者從載入到完成花了多久，讓他填名字進 high score（高分榜）。

### 三個技術重點

**一、座標與資料庫。** 開始前你得先自己「玩一次」：挑一張圖，量出每個角色所在的 pixel position（像素座標），把這個「正確答案」存進 database（資料庫）。之後驗證時，後端就拿使用者的點擊座標去跟這份答案比對。通常你不會存一個「點」，而是存一個矩形範圍（例如某角色的左上角到右下角），只要使用者點在範圍內就算對。

**二、座標正規化（normalization）。** 這是最容易踩到的坑。使用者點擊得到的座標，往往是相對於瀏覽器視窗或圖片顯示尺寸的。同一張圖在大螢幕與小螢幕上顯示尺寸不同，同一個 Waldo 的實際點擊座標就會不一樣。如果你用「絕對像素」直接比對，大螢幕上準、小螢幕上就全錯。解法是把座標換算成**相對於圖片的百分比**（例如「圖寬的 43.2%、圖高的 61.8%」），這樣不管圖片被縮放到多大，比例都一致。

**三、計時與匿名使用者要放在 server（伺服器）端。** 計時如果放在瀏覽器，使用者可以隨手改掉自己的分數。正確做法是後端在「圖片載入、遊戲開始」時記下開始時間，在「全部找到」時記下結束時間，兩者相減才是成績。麻煩的是這些使用者是**匿名**的，你得替每個進行中的遊戲建立一筆 session（工作階段）或 game 紀錄，用一個 id 追蹤它，才知道某次點擊屬於哪一局、該局是何時開始的。

### 前後端如何分工

後端提供幾個 API endpoint（端點）：開一局遊戲並回傳 game id 與開始時間；接收一次猜測（game id、角色、正規化座標）並回傳對錯；遊戲完成時結算時間並寫入高分榜。前端負責畫面互動：監聽點擊、算出正規化座標、彈出瞄準框與下拉選單、依後端回應放 marker 或顯示錯誤、最後跳出填名字的視窗。把「畫面」與「判定」清楚分開，是這個專案最重要的心法——判定一律交給後端，前端永遠不能自己決定對錯。

## 程式碼範例

這是一堂 project（專案）課，沒有標準解答程式碼，但以下兩段是最關鍵、最容易做錯的環節：座標正規化與後端命中判定。

**前端：把點擊座標換算成相對百分比（避免不同螢幕尺寸出錯）。**

```javascript
// 監聽圖片上的點擊，算出「相對於圖片」的百分比座標
function handleImageClick(event) {
  const image = event.currentTarget;
  const rect = image.getBoundingClientRect(); // 圖片目前在畫面上的位置與尺寸

  // event.clientX/Y 是相對於視窗；減去圖片左上角，得到相對於圖片的像素
  const xInImage = event.clientX - rect.left;
  const yInImage = event.clientY - rect.top;

  // 換成百分比：無論圖片被縮放到多大，比例都一致
  const xPercent = (xInImage / rect.width) * 100;
  const yPercent = (yInImage / rect.height) * 100;

  // 把百分比座標與 gameId 送到後端驗證
  return { x: xPercent, y: yPercent };
}
```

**後端：拿百分比座標判定是否命中某角色的範圍。**

```javascript
// 資料庫裡每個角色存的是「以百分比表示的矩形範圍」
// 例如 { name: 'Waldo', xMin: 40, xMax: 46, yMin: 58, yMax: 64 }

// POST /games/:gameId/guess  → body: { character, x, y }
async function checkGuess(req, res) {
  const { character, x, y } = req.body;

  // 取出這個角色的正確範圍（正確答案存在後端，前端拿不到）
  const target = await db.character.findUnique({ where: { name: character } });

  const hit =
    x >= target.xMin && x <= target.xMax &&
    y >= target.yMin && y <= target.yMax;

  // 只回傳「對或錯」，不洩漏正確座標
  res.json({ correct: hit });
}
```

計時同理：開局時 `startedAt = new Date()` 寫進該局紀錄，全部找到後用 `Date.now() - startedAt` 算出經過時間（毫秒），這個結果永遠由後端計算，前端只負責顯示。

## 常見陷阱

!!! warning "座標沒有正規化，換個螢幕就全錯"
    直接存絕對像素座標是最常見的失敗原因。你在自己的大螢幕上測一切正常，一到小螢幕或手機上就完全對不上。務必把座標換算成**相對於圖片的百分比**（見上方範例），前端送出百分比、後端也用百分比比對，才能跨尺寸一致。

!!! warning "計時放前端，分數可被竄改"
    千萬別在瀏覽器用 JavaScript 計時再把結果送給後端——使用者只要改一下數字就能刷榜。開始與結束時間都必須由 server 記錄與計算。匿名使用者也要在後端替每一局建立可追蹤的紀錄（game/session id），否則你分不清哪次點擊屬於哪一局。

!!! warning "讓前端自己判斷對錯"
    正確答案（每個角色的座標範圍）只能存在後端，且回應只回傳「對/錯」，不要把正確座標也一併回給前端。一旦答案出現在前端程式碼或 API 回應裡，任何人打開開發者工具就能作弊。

## 練習

以下把原文的 Assignment 改寫成中文步驟。逐步完成、每步先驗證再往下：

1. **先在紙上或白板上想清楚整體流程。** 花幾分鐘把資料流（誰在什麼時候呼叫誰、資料長什麼樣）畫出來，能省下後面好幾小時的瞎試。
2. **先做純前端互動，暫不接後端。** 實作「點擊圖片就在該處彈出瞄準框與下拉選單、點別處就關掉」的行為。→ 驗證：能開能關、位置正確。
3. **接上後端驗證。** 讓前端把使用者選的角色與點擊位置送到後端，由後端判定是否命中。→ 驗證：對的回「正確」、錯的回「錯誤」。**注意：** 依你取得點擊座標的方式，不同螢幕尺寸可能產生不同座標；務必在點擊邏輯裡加入座標正規化，讓不同尺寸都一致。
4. **把驗證結果接回畫面。** 選角色 → 送後端驗證 → 對就在圖上放 marker、錯就顯示訊息，整個流程要順暢無縫。
5. **加入計時與高分榜。** 從載入頁面開始計時，全部角色找到後顯示成績（時間），並跳出視窗請使用者輸入名字寫入高分榜。
6. **實際玩玩看，抓出互動上的小毛病。**
7. **推上 GitHub 並部署。** 選任一個 hosting（主機服務）平台上線，並依原文指示提交你的成果。

**額外挑戰（Extra credit）：** 在資料庫裡放進多張圖片，讓使用者在開始遊戲前先選一張想玩的。

專案的部署細節、提交方式與作業繳交，屬於平台專屬步驟，請以[原文](https://www.theodinproject.com/lessons/nodejs-where-s-waldo-a-photo-tagging-app)為準。

## 原文與延伸資源

- 原文：[Project: Where's Waldo (A Photo Tagging App)](https://www.theodinproject.com/lessons/nodejs-where-s-waldo-a-photo-tagging-app)
- 本課引用：[Where's Wally?（維基百科）](https://en.wikipedia.org/wiki/Where's_Wally%3F)、`getBoundingClientRect()`（用來取得圖片在畫面上的位置與尺寸，是座標正規化的關鍵）

---

> 本講義改寫自 The Odin Project《Project: Where's Waldo (A Photo Tagging App)》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
