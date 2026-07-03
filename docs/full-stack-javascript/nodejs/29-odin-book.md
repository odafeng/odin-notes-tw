---
title: 專案：Odin-Book
source_url: https://www.theodinproject.com/lessons/node-path-nodejs-odin-book
source_file: vendor/curriculum/nodeJS/final_project/project_odin_book.md
path: full-stack-javascript
course: NodeJS
order: 29
status: draft
generated: 2026-07-04
---

# 專案：Odin-Book

> 改寫自 The Odin Project：[Project: Odin-Book](https://www.theodinproject.com/lessons/node-path-nodejs-odin-book)
> ｜Full Stack JavaScript › NodeJS › Final Project

## 核心概念

恭喜你走到這裡。到這個階段，你應該已經能自在地用 Express 搭建應用、用 PostgreSQL 對資料進行建模與儲存。這個專案就是要把你學過的一切拿出來實戰：從零打造一個 **social media（社群媒體）網站的 clone（複製品）**，例如 Facebook、X、Myspace 或 Threads。它不會輕鬆，但完全在你的能力範圍內，而且會是一份很棒的 portfolio（作品集）代表作。

樣式與前端要投入多少，由你自己決定；這個專案真正的重點是**資料與後端**。你要把平台的核心功能拼起來：users（使用者）、profiles（個人檔案）、posts（貼文）、following（追蹤）、以及 liking（按讚）。

### 這個專案在考什麼

前面每一課，題目都幫你界定好了範圍。這個 final project（最終專案）不一樣：它給你的是一份**相對高階、開放式**的需求清單，要你自己把它變成一個可運作的網站。你會需要自己做一些研究、去讀幾個模組的官方文件。這正是實務工作的樣子——沒有人會把每個欄位、每個 route（路由）都幫你列好。

真正的難點不在單一功能，而在**資料架構**。這個專案的 model（模型）比你之前做過的都多，彼此的 relationship（關聯）也更複雜：一個使用者有很多貼文、一則貼文有很多讚與留言、使用者之間還有「誰追蹤誰」這種自我參照的多對多關係。先想清楚資料怎麼長，再開始寫，會省下你好幾天的痛苦。

### 先規劃，再動手：scope（範圍）決定成敗

動手前，把計畫寫在紙上或白板上。現在花幾個小時思考，能省下之後好幾天的 coding。試著把功能**全部**攤開來，然後做一件最關鍵的事：**界定 scope（範圍）**。你顯然無法重現整個網站（那是一整組工程師花好幾年做出來的），所以你必須分辨哪些是**核心功能**、哪些只是「有更好」的加分項。

**務必先把核心功能完成，再去碰其他東西。** 如果你一次想做完所有事，只會迷失、崩潰。相信我們——每件事都比你預期的更花時間。

### authentication（認證）怎麼處理

你也要實作某種形式的 authentication。理想上會用 [passport.js](https://www.passportjs.org/) 去支援「透過你正在複製的那個社群網站」登入；但有些網站（例如 Facebook）近期已把這個流程封死了。若你選的網站正是這種情況，你可以改用 passport.js 搭配以下策略：

- **`passport-local`**：用 username（帳號）與 password（密碼）登入，這是你在 Members Only 專案已經練過的。
- **`passport-github2`**：透過 GitHub 帳號登入（OAuth）。好處是可以直接沿用使用者 GitHub 上現成的 profile picture（大頭貼）。

若你的認證方式拿不到現成大頭貼，可以用 [Gravatar](https://www.gravatar.com/) 依 email 產生一張預設頭像。

### 你不必負責的部分

有些功能你大概還沒學過，例如 chat（聊天）、real-time updates（即時更新）與 notifications（通知）。**這些不在要求範圍內**——除非你此刻對自己的技術特別有信心。舉例來說，[socket.io](https://socket.io/) 能讓你用 WebSocket 做即時通訊。想挑戰就挑戰，不想就先跳過，把核心做穩比較重要。

### 用 seeds 塞假資料

一個空盪盪的社群網站很難測試——沒有使用者、沒有貼文，你根本看不出動態牆長怎樣。用 [Faker](https://github.com/faker-js/faker) 這個 npm 模組產生大量假資料：建立一支叫 `seeds.js` 的 JavaScript 檔，匯入你的 Prisma models，用 faker 生成一批使用者、貼文與關聯，再存進資料庫。這樣你一開發就有真實感的內容可以操作。

## 程式碼範例

這是一堂 project（專案）課，沒有標準解答。但整個專案最核心、也最容易卡住的地方是**資料模型的關聯設計**，尤其是「使用者追蹤使用者」這種自我參照關係。以下用 Prisma schema 示範一個可行的起點。

```prisma
// schema.prisma —— 社群網站核心模型的最小示意

model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String?  // 用 passport-local 時存 hash；用 OAuth 可為空
  avatarUrl String?  // 大頭貼網址（GitHub / Gravatar / 上傳後的 URL）
  posts     Post[]
  likes     Like[]
  comments  Comment[]

  // 自我參照的多對多：追蹤與被追蹤
  following Follow[] @relation("Follower")  // 我追蹤的人（我是 follower）
  followers Follow[] @relation("Following") // 追蹤我的人（我是 followee）
}

// 用一張「中間表」明確表示追蹤關係，方便加上 pending（待審核）等狀態
model Follow {
  id          Int      @id @default(autoincrement())
  follower    User     @relation("Follower", fields: [followerId], references: [id])
  followerId  Int
  following   User     @relation("Following", fields: [followingId], references: [id])
  followingId Int
  status      String   @default("pending") // pending / accepted，用來實作「追蹤請求」
  createdAt   DateTime @default(now())

  @@unique([followerId, followingId]) // 同一組追蹤關係只能有一筆
}

model Post {
  id        Int      @id @default(autoincrement())
  content   String
  imageUrl  String?  // 加分項：貼文附圖時，這裡存圖片 URL 而非 binary
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  likes     Like[]
  comments  Comment[]
  createdAt DateTime @default(now())
}

model Like {
  user   User @relation(fields: [userId], references: [id])
  userId Int
  post   Post @relation(fields: [postId], references: [id])
  postId Int

  @@id([userId, postId]) // 用複合主鍵，天然保證「一人對一則貼文只能按一個讚」
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  post      Post     @relation(fields: [postId], references: [id])
  postId    Int
  createdAt DateTime @default(now())
}
```

幾個設計重點：

- **追蹤用中間表 `Follow`，不要直接用隱式多對多。** 因為需求要「送出追蹤請求」，你需要一個 `status` 欄位來區分「已送出待審核」與「已接受」，隱式關聯放不下這個欄位。
- **`Like` 用複合主鍵 `@@id([userId, postId])`**，讓資料庫層自動阻止重複按讚，比你在程式裡手動檢查更可靠。
- **貼文附圖存 URL，不存原始 binary。** 圖片交給 [Cloudinary](https://cloudinary.com/documentation/node_integration) 或 [Supabase storage](https://supabase.com/docs/guides/storage) 這類服務託管，資料庫只留它回傳給你的網址。

## 常見陷阱

!!! warning "先做完核心功能，再碰花俏的東西"
    這個專案最常見的失敗不是技術太難，而是**貪多**。看到 chat、即時通知、漂亮動畫就想全做，結果核心的「登入、發文、追蹤、按讚」還沒完成就卡死。請嚴格遵守：core functionality 全部可用之後，才允許自己去做 extra credit。作品集要的是「一個能跑的完整流程」，不是「十個做一半的功能」。

!!! warning "追蹤關係是自我參照的多對多，別硬塞成一對多"
    「使用者追蹤使用者」是同一張 `User` 表對自己的多對多關聯。很多人第一次遇到會想用一個 `followedById` 欄位硬湊，結果一個人只能被一個人追蹤，整個爛掉。正解是用一張中間表（本課的 `Follow`）記錄 (follower, following) 兩個外鍵，並用複合唯一鍵防止重複。

!!! warning "驗證與授權一律放後端"
    「這則貼文是不是我發的、我能不能刪」這種判斷，永遠不能只靠前端隱藏按鈕。前端隱藏只是視覺，真正的 controller（控制器）必須在每個修改性操作前，比對「目前登入者」與「資源擁有者」是否一致。需求第一條就是「未登入者除了登入頁什麼都看不到」——這要靠後端 middleware（中介層）攔截，不是靠前端不畫出來。

## 練習

打造一個社群媒體網站！你會實作所選網站大部分的核心使用者功能。以下把 Assignment 整理成繁中步驟；因為專案高度開放，實作細節與部署步驟請回到[原文](https://www.theodinproject.com/lessons/node-path-nodejs-odin-book)對照。

**開始之前**

1. 先把計畫寫在紙上或白板：攤開所有功能，界定 scope，分辨「核心」與「有更好」。
2. 想清楚資料架構：模型多、關聯複雜，先規劃再動手。
3. 一步一步照下面的需求清單推進，每一步都是一個獨立可完成的挑戰。
4. 用 Faker 建 `seeds.js`，匯入 Prisma models 生成假使用者與貼文，讓你一開發就有資料可測。

**核心需求（必做，做完才碰加分項）**

1. 未登入者除了登入頁之外，什麼都看不到。
2. 使用者能用你選定的認證方式登入。
3. 使用者能向其他人送出 follow request（追蹤請求）。
4. 使用者能建立貼文（先做純文字即可）。
5. 使用者能對貼文按讚。
6. 使用者能對貼文留言。
7. 貼文一律顯示：內容、作者、留言、讚。
8. 有一個貼文的 index page（列表頁），顯示「自己與所追蹤對象」的近期貼文。
9. 使用者能建立含大頭貼的 profile；視認證方式，可沿用 GitHub 頭像，或用 Gravatar 產生。
10. 個人檔案頁要顯示：個人資訊、大頭貼、以及該使用者的貼文。
11. 有一個使用者的 index page，列出所有使用者，並對「尚未追蹤或尚無待審請求」的對象顯示追蹤按鈕。
12. 把 app 部署到你選的 hosting provider（託管平台）。

**加分項（extra credit）**

1. 讓貼文支援圖片（用 URL 或直接上傳），圖片交給 Cloudinary 或 Supabase storage 託管，資料庫只存回傳的 URL。
2. 讓使用者能更新自己的大頭貼。
3. 做一個 guest sign-in（訪客登入）：讓訪客不必註冊、不必填帳密就能進站看你的成果——放在履歷上時，招募方多半不會花時間註冊，這個功能特別加分。
4. 把它做漂亮！

## 原文與延伸資源

- 原文：[Project: Odin-Book](https://www.theodinproject.com/lessons/node-path-nodejs-odin-book)
- 本課引用：[passport.js](https://www.passportjs.org/)、`passport-local`、`passport-github2`、[Faker](https://github.com/faker-js/faker)、[Gravatar](https://www.gravatar.com/)、[Cloudinary](https://cloudinary.com/documentation/node_integration)、[Supabase storage](https://supabase.com/docs/guides/storage)、[socket.io](https://socket.io/)

---

> 本講義改寫自 The Odin Project《Project: Odin-Book》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
