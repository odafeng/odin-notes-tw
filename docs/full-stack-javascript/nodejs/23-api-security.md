---
title: API 安全
source_url: https://www.theodinproject.com/lessons/nodejs-api-security
source_file: vendor/curriculum/nodeJS/apis/api_security.md
path: full-stack-javascript
course: NodeJS
order: 23
status: draft
generated: 2026-07-04
---

# API 安全

> 改寫自 The Odin Project：[API Security](https://www.theodinproject.com/lessons/nodejs-api-security)
> ｜Full Stack JavaScript › NodeJS › APIs

## 核心概念

當我們用 Express 搭配樣板（view template）渲染網頁時，曾經用 PassportJS 加上帳號密碼來做 authentication（認證）。那套機制依賴 session（會話）與 cookie：使用者登入後，伺服器建立一筆 session 資料存在自己這邊，並把一個 session ID 寫進瀏覽器的 cookie；之後每次請求瀏覽器自動帶上 cookie，伺服器再拿 ID 去查對應的 session。這在傳統網站上運作良好，但當我們把 API（應用程式介面）做成獨立的後端、前端變成 SPA（單頁應用）或手機 App 時，這套模式就開始變得綁手綁腳。

### 為什麼 API 適合用 token 而不是 session

session 認證的核心特徵是「有狀態（stateful）」：伺服器必須記住每一個登入中的使用者。這帶來幾個在 API 情境下特別明顯的問題：

- **跨網域（cross-origin）麻煩**：cookie 綁在網域上。當前端與後端分屬不同網域（例如前端在 `app.example.com`、API 在 `api.example.com`），要讓 cookie 正確送出、又要防範 CSRF（跨站請求偽造），設定會變得繁瑣。
- **難以水平擴展**：session 存在伺服器記憶體或資料庫。一旦後端有多台機器，就得共用一個 session 儲存區（例如 Redis），否則使用者可能這次請求被 A 機器處理、下次換 B 機器就「登出」了。
- **不只服務瀏覽器**：手機 App、其他伺服器、第三方服務都可能呼叫你的 API，它們不見得有瀏覽器那套自動管理 cookie 的機制。

另一種策略是產生並在前後端之間傳遞一個安全的 **token（權杖）**。基本流程是：使用者登入時，後端建立一個 token 回傳給前端；之後前端每一次請求，都把這個 token 放進 request（請求）物件的 header（標頭）裡送出。後端收到後驗證 token 是否有效，藉此判斷「這是誰、他有沒有登入」。

這麼做有兩個關鍵好處：**確保使用者的帳號密碼不會在每次請求中被反覆傳遞而暴露**，同時**讓我們有能力讓使用者的 session 過期**，提升安全性。整個概念其實跟你熟悉的 Passport 認證非常像，差別只在於：以前是設定與檢查 cookie，現在改成在 header 中傳遞一個特殊的 token。

值得注意的是，token 策略並非 API 專屬——傳統樣板專案也能用。它的精神是把「伺服器記住你」換成「你自己帶著證明來」。

### JSON Web Token（JWT）是什麼

在 token 認證中，最主流的格式是 **JWT（JSON Web Token）**，唸作「jot」。它是一段緊湊、可放進 URL 的字串，由三個部分組成，中間用點（`.`）分隔：

```
xxxxx.yyyyy.zzzzz
   │      │      │
 Header Payload Signature
```

三個部分各自是一段經過 Base64URL 編碼的資料：

1. **Header（標頭）**：描述這個 token 的型別（`typ`，通常是 `JWT`）以及簽章用的演算法（`alg`，例如 `HS256`）。
2. **Payload（酬載）**：真正要攜帶的資料，稱為 **claims（宣告）**。常見的有 `sub`（subject，通常放使用者 ID）、`iat`（issued at，簽發時間）、`exp`（expiration，過期時間），你也可以放自訂欄位如 `username`、`role`。
3. **Signature（簽章）**：把前兩段用一個只有伺服器知道的 **secret（密鑰）**，配合 Header 指定的演算法計算出來的驗證碼。

這裡有一個**極度重要**的觀念：Header 與 Payload 只是「編碼（encode）」，不是「加密（encrypt）」。任何人拿到 JWT 都可以把它反編碼、看見裡面的內容。所以**絕對不要**把密碼、信用卡號這類敏感資料放進 payload。JWT 保護的不是「內容機密性」，而是「內容完整性」——它能證明「這段資料確實是伺服器簽發的、而且沒有被竄改」。

### 簽名（sign）與驗證（verify）的原理

JWT 的安全性建立在 signature 上。運作機制是這樣的：

- **簽名（sign）**：伺服器在登入成功後，把 Header 和 Payload 用 secret 跑一次雜湊演算法，算出 signature，接在後面組成完整的 token 交給前端。
- **驗證（verify）**：之後每次收到 token，伺服器用同一把 secret、對收到的 Header 與 Payload 重新算一次 signature，再跟 token 附帶的第三段比對。若兩者相同，代表 token 沒被動過手腳，可以信任。

關鍵在於：攻擊者就算看得懂 payload，也**無法偽造 signature**，因為他沒有 secret。只要他偷偷改了 payload（例如把 `role` 從 `user` 改成 `admin`），重新算出來的 signature 就對不上，驗證立刻失敗。

上述使用「同一把 secret 來簽名與驗證」的做法屬於**對稱式（symmetric）**演算法，代表就是 `HS256`（HMAC + SHA-256）。另一種是**非對稱式（asymmetric）**，例如 `RS256`：用私鑰（private key）簽名、用公鑰（public key）驗證。非對稱的好處是可以把公鑰散布給多個服務去驗證 token，但簽名的私鑰只留在發證的伺服器。初學階段用 `HS256` 加一把夠長、夠隨機的 secret 就足夠了。

### Authorization header 與 Bearer 慣例

token 究竟放在請求的哪裡？業界慣例是放進 HTTP 的 `Authorization` header，並加上 `Bearer` 前綴：

```
Authorization: Bearer xxxxx.yyyyy.zzzzz
```

`Bearer`（持有者）這個詞的意思是「持有這個 token 的人就是被授權的人」——就像持票入場，票在誰手上，誰就能進。這也再次提醒我們：token 必須妥善保管、且一律走 HTTPS 傳輸，避免在傳送途中被攔截。後端的驗證 middleware（中介軟體）會從這個 header 取出 `Bearer` 後面那段字串，再拿去 verify。

### token 過期（expiration）

session 認證可以由伺服器主動刪除 session 來「登出」使用者。但 JWT 是無狀態的——伺服器並沒有存一份 token 清單，那要怎麼讓它失效？答案是**過期時間**。簽發 token 時設定 `exp` 這個 claim（例如「1 小時後過期」），驗證時函式庫會自動檢查現在時間有沒有超過 `exp`，超過就拒絕。

這帶來一個實務上的取捨：token 效期太長，被偷走後危害的時間就長；太短，使用者又得頻繁重新登入。常見的解法是採用「短效的 access token ＋ 長效的 refresh token」雙 token 制——access token 幾分鐘就過期用於一般請求，過期後用 refresh token 去換一張新的，而不必重新輸入帳密。這是進階主題，初學先掌握單一 token ＋ 合理 `exp` 即可。

### 認證（authentication）與授權（authorization）

順帶釐清兩個常被混用的詞：

- **authentication（認證）**：確認「你是誰」。登入、驗證 token 屬於這一類。
- **authorization（授權）**：確認「你能做什麼」。例如檢查 payload 裡的 `role` 是不是 `admin`，決定要不要放行某個 route（路由）。

JWT 常同時參與這兩件事：驗證 signature 確認身分（authn），讀取 payload 裡的 claims 決定權限（authz）。

### 把它接回 Passport

在 Express 中，這一切通常透過 `jsonwebtoken` 函式庫負責簽發與驗證，再搭配 `passport-jwt` 這個 strategy（策略）把驗證流程整合進 Passport。你先前學過的 Passport local strategy 用來處理「帳密登入、換發 token」，而 JWT strategy 則負責「往後每個受保護 route 的 token 驗證」。兩者分工，就構成一套完整的 API 安全機制。

## 程式碼範例

以下是一組最小可執行的示範，展示簽發 JWT、以及用自訂 middleware 驗證 token。先安裝套件：

```bash
# 安裝簽發／驗證 JWT 的函式庫
npm install jsonwebtoken
```

```javascript
// app.js — 最小的 JWT 簽發與驗證範例
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// secret（密鑰）實務上必須放在環境變數，切勿寫死在程式碼
const SECRET = process.env.JWT_SECRET || "dev-only-secret";

// 登入：驗證帳密後簽發 token
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 這裡用寫死的假使用者示意；實務要查資料庫並比對雜湊後的密碼
  if (username !== "odin" || password !== "password123") {
    return res.status(401).json({ message: "帳號或密碼錯誤" });
  }

  // payload（酬載）只放非敏感的識別資訊
  const payload = { sub: "user-1", username };

  // 簽發 token，並設定 1 小時後過期
  const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

  res.json({ token });
});

// 自訂 middleware：從 Authorization header 取出並驗證 token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization; // 格式：Bearer xxx.yyy.zzz

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "缺少或格式錯誤的 token" });
  }

  const token = authHeader.split(" ")[1]; // 取出 Bearer 後面那段

  try {
    // verify 會同時檢查 signature 與 exp（過期）
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // 把解出的資料掛到 req 上供後續使用
    next();
  } catch (err) {
    // 簽章對不上或已過期都會進到這裡
    return res.status(403).json({ message: "token 無效或已過期" });
  }
}

// 受保護的 route：只有帶著有效 token 才能存取
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: `歡迎，${req.user.username}`, user: req.user });
});

app.listen(3000, () => console.log("伺服器啟動於 http://localhost:3000"));
```

用 `curl` 測試整段流程：

```bash
# 1. 登入取得 token
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"odin","password":"password123"}'
# 回傳 {"token":"xxxxx.yyyyy.zzzzz"}

# 2. 帶著 token 存取受保護 route
curl http://localhost:3000/protected \
  -H "Authorization: Bearer xxxxx.yyyyy.zzzzz"
# 回傳 {"message":"歡迎，odin", ...}
```

若你想把驗證整合進 Passport，可改用 `passport-jwt` strategy，讓它自動從 `Authorization` header 抽出 Bearer token 並 verify，你只需在回呼（callback）中依 payload 查出使用者即可：

```javascript
// passport 設定片段（示意）
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 從 Bearer 取 token
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, (payload, done) => {
    // payload.sub 就是簽發時放入的使用者 ID
    User.findById(payload.sub)
      .then((user) => done(null, user || false))
      .catch((err) => done(err, false));
  })
);

// 之後用 passport.authenticate("jwt", { session: false }) 保護 route
```

## 常見陷阱

!!! warning "把敏感資料放進 payload"
    JWT 的 Header 與 Payload 只是 Base64URL 編碼，不是加密。任何人都能反編碼看見內容。**絕對不要**把密碼、完整信用卡號等機密放進 payload。它保證的是「未被竄改」，不是「不被看見」。

!!! warning "secret 外洩或太弱"
    整套安全性都靠 secret。一旦洩漏，攻擊者就能偽造任意 token 冒充任何人。secret 必須夠長、夠隨機，放進環境變數（`.env` 且加入 `.gitignore`），**永遠不要**寫死在程式碼或提交進版本庫。

!!! warning "只驗簽章卻不驗過期"
    如果自己手刻驗證而忘了檢查 `exp`，token 會變成永久有效，等於失去了「讓 session 過期」這個 JWT 的核心優勢。使用 `jwt.verify()` 時它會自動檢查 `exp`；別自行 `jwt.decode()` 後就當作驗證通過——`decode` 不檢查 signature 也不檢查過期。

!!! warning "沒走 HTTPS 傳輸 token"
    Bearer token 是「持有即授權」。若透過未加密的 HTTP 傳送，被中間人攔截後就能直接冒用。正式環境一律使用 HTTPS。

## 練習

1. 觀看這支解說如何[建立與驗證 JSON Web Token](https://www.youtube.com/watch?v=7nafaH9SddU)的影片，把 sign 與 verify 的流程走過一遍。
2. 觀看這支介紹[JWT 有哪些不同用途](https://www.youtube.com/watch?v=7Q17ubqLfaM)的影片，理解 token 認證能解決的問題。
3. 動手實作：把上方「程式碼範例」建成一個小專案，跑起伺服器，用 `curl` 完成「登入取得 token → 帶 token 存取受保護 route」的完整流程。接著故意把 token 中間任一字元改掉再打一次，觀察驗證失敗的回應，體會 signature 的作用。
4. 進階思考：試著把 `expiresIn` 設成 `"10s"`，登入後等超過 10 秒再存取受保護 route，確認 token 過期會被拒絕。

## 原文與延伸資源

- 原文：[API Security](https://www.theodinproject.com/lessons/nodejs-api-security)
- 本課引用：
  - [建立與驗證 JSON Web Token（影片）](https://www.youtube.com/watch?v=7nafaH9SddU)
  - [JWT 的不同用途（影片）](https://www.youtube.com/watch?v=7Q17ubqLfaM)
  - [JWT Authentication Using Node.js and Express 指南](https://web.archive.org/web/20230207144457/https://laptrinhx.com/a-practical-guide-for-jwt-authentication-using-node-js-and-express-917791379/)
  - [在 Express 中使用 JWT 的精簡指南](https://medium.com/@paul.allies/stateless-auth-with-express-passport-jwt-7a55ffae0a5c)
  - [反方觀點：不是每個人都認同 JWT 是儲存認證資料的最佳方式（影片）](https://www.youtube.com/watch?v=JdGOb7AxUo0)

---

> 本講義改寫自 The Odin Project《API Security》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
