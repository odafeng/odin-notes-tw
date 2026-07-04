---
title: 專案：檔案上傳器
source_url: https://www.theodinproject.com/lessons/nodejs-file-uploader
source_file: vendor/curriculum/nodeJS/orms/project_file_uploader.md
path: full-stack-javascript
course: NodeJS
order: 21
generated: 2026-07-04
---

# 專案：檔案上傳器

> 改寫自 The Odin Project：[Project: File Uploader](https://www.theodinproject.com/lessons/nodejs-file-uploader)
> ｜Full Stack JavaScript › NodeJS › ORMs

## 核心概念

這個專案要你做一個精簡版的 [Google Drive](https://www.google.com/drive/)（或任何個人雲端儲存服務）：使用者登入後，可以建立資料夾、把檔案上傳到資料夾裡、檢視每個檔案的細節（名稱、大小、上傳時間），並隨時把檔案下載回來。它把 ORM 這一階段學到的 Prisma、以及前面學過的 Express、Passport、session（工作階段）等技巧一次串起來，是一個很完整的整合練習。

跟前面的專案不同，這一課的重頭戲是**處理檔案**——瀏覽器怎麼把檔案送上來、伺服器怎麼接、接到之後放哪裡。以下幾個重點，值得在動手前先在腦中建立清楚的地圖。

### 1. 用 Passport 做 session-based authentication（工作階段認證）

這是一個「私人」儲存服務，所以第一步就是認證：只有登入的使用者才能上傳與檢視自己的檔案。你會用 **Passport.js**（認證 middleware）搭配 `passport-local` 策略做帳號密碼登入，這部分你在前面的 Authentication Basics 已經練過。

新的地方在於：session 要**存進資料庫**，而不是留在伺服器的記憶體。預設的 `express-session` 把 session 存在記憶體裡，一旦伺服器重啟，所有人就被登出了；正式服務不能這樣。這一課要你改用 [prisma-session-store](https://github.com/kleydon/prisma-session-store#readme)，把 session 持久化到你的 Prisma 資料庫。做法是在 Prisma schema 裡多一張 `Session` 資料表，再把這個 store 掛給 `express-session`，session 就會被寫進資料庫、跨重啟存活。

### 2. 用 multer 接收上傳的檔案

HTML 一般的表單送出的是文字欄位（`application/x-www-form-urlencoded`），Express 的 `express.urlencoded()` 就能解析。但檔案上傳不一樣：表單必須設成 `enctype="multipart/form-data"`，送上來的內容是二進位的檔案串流，`express.urlencoded()` 讀不了。

這時就需要 [multer](https://github.com/expressjs/multer) 這個專門處理 `multipart/form-data` 的 middleware。你把 multer 掛在上傳的 route 上，它會幫你把檔案從請求裡解析出來、暫存到你指定的位置，並把檔案的資訊（原始檔名、大小、暫存路徑等）放進 `req.file`，controller 就能拿來用。

**建議的開發順序**：先讓 multer 把檔案存到本機檔案系統（filesystem），把「上傳表單 → 接收 → 存檔 → 記到資料庫」整條路走通、其他功能也都做完之後，最後一步再把儲存位置換成雲端。先在本機跑通，除錯最直觀。

### 3. 用 Prisma 做資料夾與檔案的 CRUD

使用者要能對 folder（資料夾）做完整的 **CRUD**——Create（新增）、Read（讀取）、Update（更新）、Delete（刪除）——並把檔案上傳到指定的資料夾裡。這對應到你的資料模型：一個 `User` 有多個 `Folder`，一個 `Folder` 有多個 `File`，都是典型的**一對多（one-to-many）**關聯。你會在 Prisma schema 用 relation（關聯）欄位把它們接起來，例如 `File` 上放一個指向 `Folder` 的 relation，`Folder` 上放一個指向 `User` 的 relation。

規劃 route 時，跟前一個庫存專案一樣，把每種操作對應到一條 route（列表、單筆檢視、新增表單、送出新增、更新、刪除），並用 controller 承接實際邏輯。資料庫的存取則交給 Prisma Client。

### 4. 檔案細節頁與下載

除了列表，還要有一個「檔案細節」route，顯示單一檔案的名稱、大小與上傳時間，並提供一個**下載按鈕**讓使用者把檔案取回。若檔案還存在本機，可用 Express 的 `res.download()` 觸發下載；若已改存雲端，則導向或串接雲端提供的下載 URL。

### 5. 最後一步：把檔案搬上雲端儲存

檔案存在單一台伺服器的檔案系統有幾個現實問題：伺服器重新部署時本機檔案可能消失、多台伺服器之間檔案不同步、儲存空間也有限。所以正式做法是改用**雲端儲存服務**，例如 [Cloudinary](https://cloudinary.com/) 或 [Supabase Storage](https://supabase.com/docs/guides/storage)。

流程是：multer 收到檔案後，你的 controller 把它上傳到雲端服務，服務會回傳一個檔案的 **URL**；你把這個 URL（而不是檔案本身）存進資料庫。之後要顯示或下載，就用這個 URL。資料庫只存「指向檔案的網址」，檔案本體交給專業的儲存服務保管。

### 6. 驗證上傳的檔案

別讓使用者上傳任何東西。至少要做兩種常見驗證：**限制檔案類型**（例如只允許圖片或特定副檔名）與**限制檔案大小**（擋掉過大的檔案）。multer 本身就提供 `limits`（大小上限）與 `fileFilter`（依 MIME type 或副檔名過濾）兩個選項，是最方便的第一道防線。這既是安全考量，也避免有人塞爆你的儲存空間。

## 程式碼範例

這一課以整合實作為主，這裡只給幾段最能點出關鍵的骨架，讓你抓到把各片段接起來的手感。

用 `prisma-session-store` 把 session 存進資料庫（掛給 `express-session`）：

```javascript
// app.js — 讓 session 持久化到 Prisma 資料庫，而不是記憶體
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

app.use(
  session({
    secret: process.env.SESSION_SECRET, // 用環境變數，別寫死
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // 每 2 分鐘清一次過期 session
      dbRecordIdIsSessionId: true,
    }),
  }),
);
```

用 multer 設定上傳，並在此加上大小與類型的驗證：

```javascript
// middleware/upload.js — multer 設定，含檔案驗證
const multer = require("multer");

const upload = multer({
  dest: "uploads/", // 先存本機，之後再改上傳雲端
  limits: { fileSize: 5 * 1024 * 1024 }, // 上限 5 MB
  fileFilter: (req, file, cb) => {
    // 只允許圖片；不符合就拒絕
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("只允許上傳圖片檔"));
  },
});

module.exports = upload;
```

把 multer 掛在上傳 route 上，controller 從 `req.file` 取得檔案並用 Prisma 寫入資料庫：

```javascript
// routes/fileRouter.js
const upload = require("../middleware/upload");

// upload.single("file") 對應表單中 name="file" 的欄位
router.post("/upload", upload.single("file"), fileController.uploadPost);
```

```javascript
// controllers/fileController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function uploadPost(req, res) {
  // req.file 由 multer 填入：原始檔名、大小、暫存路徑等
  await prisma.file.create({
    data: {
      name: req.file.originalname,
      size: req.file.size,
      path: req.file.path, // 之後可換成雲端回傳的 URL
      folderId: Number(req.body.folderId),
    },
  });
  res.redirect("/folders/" + req.body.folderId);
}

module.exports = { uploadPost };
```

Prisma schema 裡描述 User、Folder、File 的一對多關聯：

```prisma
// prisma/schema.prisma（節錄）
model User {
  id      Int      @id @default(autoincrement())
  folders Folder[]
}

model Folder {
  id     Int    @id @default(autoincrement())
  name   String
  user   User   @relation(fields: [userId], references: [id])
  userId Int
  files  File[]
}

model File {
  id         Int      @id @default(autoincrement())
  name       String
  size       Int
  path       String   // 本機路徑或雲端 URL
  uploadedAt DateTime @default(now())
  folder     Folder   @relation(fields: [folderId], references: [id])
  folderId   Int
}
```

## 常見陷阱

!!! warning "上傳表單忘了設 multipart/form-data"
    檔案上傳的 `<form>` 一定要加上 `enctype="multipart/form-data"`。少了它，瀏覽器不會用檔案串流的格式送出，multer 也就收不到任何檔案，`req.file` 會是 undefined。這是初次做上傳最常踩的雷。

!!! warning "把 session 留在記憶體裡"
    直接用預設的 `express-session`（記憶體 store），伺服器一重啟所有人就被登出，正式環境還會在 console 看到「MemoryStore is not designed for a production environment」的警告。這一課要求用 `prisma-session-store` 把 session 存進資料庫，正是為了避免這個問題。

!!! warning "只把檔案存在本機檔案系統就當完工"
    存在單一伺服器的本機檔案，在重新部署或多台伺服器時很容易遺失或不同步。作業明確要求最後把檔案改存到 Cloudinary 或 Supabase Storage 這類雲端服務，資料庫只保存回傳的檔案 URL，而不是檔案本身。

!!! warning "完全不驗證上傳的檔案"
    不限制類型與大小，等於開放任何人上傳任意內容、塞爆你的儲存空間，也帶來安全風險。至少用 multer 的 `limits`（大小）與 `fileFilter`（類型）擋一層。

## 練習

這是一個需要自行架設專案、資料庫與雲端儲存的完整 project（專案），細節與環境相關的步驟請以[原文](https://www.theodinproject.com/lessons/nodejs-file-uploader)為準。整體流程如下：

1. 用 Express 與 Prisma 建立新專案，安裝所有需要的相依套件（包含 Passport 等）。
2. 用 Passport.js 建立 session-based authentication；並用 [prisma-session-store](https://github.com/kleydon/prisma-session-store#readme) 把 session 持久化到資料庫。
3. 加一個上傳表單，讓已登入的使用者上傳檔案。**先把檔案存到本機檔案系統**，整合 [multer](https://github.com/expressjs/multer) middleware。等其他功能都通了，最後再改上傳雲端。
4. 加入資料夾功能：使用者能對 folder 做完整 CRUD，並把檔案上傳到資料夾裡。規劃好對應的 route 與資料庫操作。
5. 加一個「檔案細節」route，顯示名稱、大小、上傳時間，並提供下載按鈕讓使用者下載檔案。
6. 最後補上真正的檔案上傳邏輯：改用 [Cloudinary](https://cloudinary.com/) 或 [Supabase Storage](https://supabase.com/docs/guides/storage) 這類雲端儲存服務，上傳成功後把檔案 URL 存進資料庫。
7. 驗證你的檔案！方式自訂，例如限制可上傳的類型、擋掉過大的檔案。

**額外加分**

1. 加入「分享資料夾」功能：使用者選擇某個資料夾（含其所有內容）分享，並填入有效期限（例如 1 天、10 天），系統產生一條可分享的連結，未登入的人也能透過它存取。連結格式可以像 `https://yourapp.com/share/c758c495-0705-44c6-8bab-6635fd12cf81` 這樣。

## 原文與延伸資源

- 原文：[Project: File Uploader](https://www.theodinproject.com/lessons/nodejs-file-uploader)
- 本課引用：[prisma-session-store](https://github.com/kleydon/prisma-session-store#readme)（session 持久化）、[multer](https://github.com/expressjs/multer)（處理 multipart/form-data 上傳）、[Cloudinary](https://cloudinary.com/) 與 [Supabase Storage](https://supabase.com/docs/guides/storage)（雲端檔案儲存）；並整合前面各課的 Express、Passport 認證與 Prisma ORM。

---

> 本講義改寫自 The Odin Project《Project: File Uploader》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
