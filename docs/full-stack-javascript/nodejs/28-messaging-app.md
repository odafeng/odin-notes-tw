---
title: 專案：訊息 App
source_url: https://www.theodinproject.com/lessons/nodejs-messaging-app
source_file: vendor/curriculum/react/react_and_the_backend/project_messaging_app.md
path: full-stack-javascript
course: NodeJS
order: 28
status: draft
generated: 2026-07-04
---

# 專案：訊息 App

> 改寫自 The Odin Project：[Project: Messaging App](https://www.theodinproject.com/lessons/nodejs-messaging-app)
> ｜Full Stack JavaScript › NodeJS › Full Stack Projects

## 核心概念

想想你最愛的訊息 App（Discord、Telegram、WhatsApp、Facebook Messenger 等），這個專案讓你自己動手做一個：一個能讓使用者互相傳訊息的 web app。你不是要在一週內做出 Discord，那些產品背後是整個工程團隊；這個專案的重點是把你學過的 full stack 技巧串成一個完整、可部署、能給別人用的作品。

### 三個必做的核心功能

不管你把介面做得多花俏，這個 App 至少要有以下三件事：

1. **Authorization（授權）與 authentication（認證）**：使用者要能註冊、登入，而且只有登入後才能看到、送出訊息。這是前幾課 Passport.js、session、JWT 那套機制的實戰。沒有認證，「A 傳給 B」這件事根本無從談起——因為系統不知道誰是 A、誰是 B。
2. **傳訊息給另一位使用者**：這是 App 的心臟。你需要一個資料表存訊息，每一筆訊息至少要記錄「誰傳的（sender）」「傳給誰的（recipient 或所屬對話）」「內容」「時間」。
3. **自訂使用者 profile（個人檔案）**：讓使用者能設定顯示名稱、頭像、一句簡介（bio）之類的欄位。這強迫你處理「更新既有資料」的完整 CRUD 流程，而不只是新增。

### 動手前先規劃

這個專案的價值一半在規劃。開始寫 code 前，先想清楚三件事：

- **UI（使用者介面）長怎樣**：畫幾張草圖。通常需要註冊/登入頁、使用者列表或對話列表、對話視窗、profile 編輯頁。先想好頁面之間怎麼跳轉。
- **data model（資料模型）長怎樣**：這是最關鍵的一步。最小可行的模型大概是 `User`、`Message` 兩張表。`Message` 透過 sender 與 recipient 兩個 foreign key（外鍵）指回 `User`。如果要做群組聊天，通常會多一張 `Conversation`（對話）表，讓 `Message` 屬於某個 conversation，而 conversation 再關聯到多個 user。
- **要用哪些 library**：後端常見組合是 Express + Prisma（ORM，物件關聯對映）+ PostgreSQL，認證用 Passport.js 或 jsonwebtoken；前端用 React，搭配 React Router、以及你熟悉的資料抓取方式（fetch / axios / React Query）。

### 前後端分離與「即時」的取捨

這是本課最重要的觀念，務必讀懂：**REST API 無法主動推播（push）即時更新**。

REST 是「request–response（請求–回應）」模型：server 只能在收到 request 時回一個 response。如果 A 傳訊息給 B，REST API 沒辦法自己通知 B——因為 B 根本沒發出「給我新訊息」這個請求，server 也就無從回應。要做到真正的即時推播，需要 WebSocket、Server-Sent Events（SSE）之類的技術，而這些在課程裡還沒教，所以**這個專案不要求你實作即時更新**。

那訊息要怎麼「更新」？最單純的做法是：使用者重新整理頁面、或進入某個對話時，前端才向後端 request 一次最新訊息。若想讓體驗接近即時，可以用 polling（輪詢）——前端每隔幾秒自動再打一次 API 抓新訊息。這不是真正的推播，但在學習階段已經夠用，也讓你清楚感受到 REST 的邊界在哪裡。

### 部署

最後把 App 部署到網路上。後端可放在 Railway、Render 之類的平台，前端可放 Netlify、Vercel，資料庫用平台提供的 PostgreSQL。部署完記得把成品連結貼到原文的 submissions 區與社群 Discord。

## 程式碼範例

以下用 Prisma + Express 示範「訊息」這一塊最小骨架。這只是起點，實際專案請自行擴充。

```prisma
// schema.prisma — 最小資料模型（一對一私訊版本）
model User {
  id        Int       @id @default(autoincrement())
  username  String    @unique
  password  String    // 記得存 hash 後的密碼，不要存明碼
  bio       String?   // profile 欄位，? 代表可為空
  avatarUrl String?
  sent      Message[] @relation("SentMessages")     // 這位 user 送出的訊息
  received  Message[] @relation("ReceivedMessages") // 這位 user 收到的訊息
}

model Message {
  id          Int      @id @default(autoincrement())
  content     String
  createdAt   DateTime @default(now())
  senderId    Int
  recipientId Int
  // 兩個關聯都指回 User，需用 relation 名稱區分
  sender      User     @relation("SentMessages", fields: [senderId], references: [id])
  recipient   User     @relation("ReceivedMessages", fields: [recipientId], references: [id])
}
```

```javascript
// messagesRouter.js — 送出與讀取訊息的 route（路由）
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// 送出訊息：sender 從已登入的 session 取得，不信任前端傳來的 senderId
router.post("/messages", ensureAuth, async (req, res) => {
  const { recipientId, content } = req.body;
  const message = await prisma.message.create({
    data: {
      content,
      senderId: req.user.id,        // 認證後由後端決定「誰在傳」
      recipientId: Number(recipientId),
    },
  });
  res.status(201).json(message);
});

// 讀取「我」與某位對象之間的所有訊息，依時間排序
router.get("/messages/:otherId", ensureAuth, async (req, res) => {
  const me = req.user.id;
  const other = Number(req.params.otherId);
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: me, recipientId: other },
        { senderId: other, recipientId: me },
      ],
    },
    orderBy: { createdAt: "asc" },
  });
  res.json(messages);
});

// middleware：擋下未登入的請求
function ensureAuth(req, res, next) {
  if (!req.isAuthenticated?.()) return res.status(401).json({ error: "未登入" });
  next();
}

export default router;
```

```jsx
// ChatWindow.jsx — 前端以 polling 模擬「接近即時」
import { useEffect, useState } from "react";

function ChatWindow({ otherId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/messages/${otherId}`, {
        credentials: "include", // 帶上 session cookie
      });
      setMessages(await res.json());
    };
    load();
    // 每 3 秒重抓一次，靠輪詢逼近即時；REST 無法主動推播
    const timer = setInterval(load, 3000);
    return () => clearInterval(timer);
  }, [otherId]);

  return (
    <ul>
      {messages.map((m) => (
        <li key={m.id}>{m.content}</li>
      ))}
    </ul>
  );
}

export default ChatWindow;
```

## 常見陷阱

!!! warning "senderId 不要相信前端"
    「誰傳了這則訊息」必須由後端從已登入的 session／token 決定，不能直接採用前端 request body 送來的 `senderId`。否則任何人都能偽造成別人送訊息。

!!! warning "別想在這個專案硬做真正的即時推播"
    REST API 是 request–response，無法主動 push。課程還沒教 WebSocket／SSE，本專案也不要求。想要接近即時，用 polling（輪詢）就好，別為了炫技卡在這裡。

!!! warning "資料模型先想清楚再寫 code"
    一對一私訊、群組聊天的 schema 差很多（群組通常要多一張 `Conversation` 表）。一開始就決定要不要做群組，否則做到一半改 data model 會很痛苦。先做最小可行版本，之後再加。

!!! warning "密碼一定要 hash"
    `User` 的 password 欄位存的是 bcrypt 等演算法 hash 後的結果，絕不能存明碼。這在認證那幾課學過，實戰時很容易漏掉。

!!! warning "別想一次做完所有功能"
    那些商業 App 背後是整個團隊。先把三個核心功能（認證、傳訊息、profile）做穩、能部署，再考慮加分項。範圍失控是專案課最常見的翻車原因。

## 練習

這是一個 project（專案）課，主要交付物是你自己實作並部署的 App。以下是原文 Assignment 的繁中步驟；細節與繳交方式以原文為準：

1. 確認 App 至少包含三個核心功能：**Authorization/authentication（認證授權）**、**傳訊息給另一位使用者**、**自訂使用者 profile**。不要一開始就想塞滿功能。
2. 花時間規劃：畫 UI 草圖、設計 data model（至少 `User` 與 `Message`）、列出要用的 library。
3. 從核心功能開始，前後端一起實作。記住 REST API 無法處理即時更新，本專案不要求你實作任何即時推播機制。
4. 把 App 部署到網路上，並把成品連結貼到原文 submissions 區與社群 Discord。

加分項（行有餘力再做）：

- 允許在聊天中傳送圖片。
- 加入 friends list（好友列表），讓使用者能加好友並看到誰在線上；較簡單的替代做法是「顯示目前上線使用者列表」，省去加好友的流程。
- 允許使用者建立群組聊天並在其中發訊息。

## 原文與延伸資源

- 原文：[Project: Messaging App](https://www.theodinproject.com/lessons/nodejs-messaging-app)
- 本課引用：Prisma（ORM，[prisma.io](https://www.prisma.io/)）、Express、Passport.js／JWT 認證機制，以及前幾課的 React、React Router 與資料抓取內容。

---

> 本講義改寫自 The Odin Project《Project: Messaging App》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
