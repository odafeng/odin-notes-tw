---
title: 部署（Deployment）
source_url: https://www.theodinproject.com/lessons/node-path-nodejs-deployment
source_file: vendor/curriculum/nodeJS/express/deployment.md
path: full-stack-javascript
course: NodeJS
order: 13
generated: 2026-07-04
---

# 部署（Deployment）

> 改寫自 The Odin Project：[Deployment](https://www.theodinproject.com/lessons/node-path-nodejs-deployment)
> ｜Full Stack JavaScript › NodeJS › Express

## 核心概念

寫到現在，你的 Express 應用程式都只跑在自己電腦的 `localhost` 上，只有你看得到。要把作品分享給朋友、放進給未來雇主看的 portfolio（作品集），甚至拿來做線上生意，就得把它放到別人也能透過網際網路公開存取的地方。這個「把應用程式放上網、讓它在雲端持續運行」的動作，就是 deployment（部署）。

### 什麼是 hosting provider（主機代管商）？

Hosting provider（主機代管商）就像「伺服器房東」。他們擁有一整批伺服器，把上面的空間出租給客戶，客戶再用這些空間存放自己的網站，讓網際網路上任何人都能連得到。

你其實已經用過 hosting provider 了：先前把專案部署到 **GitHub Pages** 就是一次。GitHub Pages 很適合「免費代管 static（靜態）網頁」，但它沒辦法拿來跑我們的 dynamic（動態）Node 應用程式，我們需要更強的工具。

### static（靜態）網站 vs dynamic（動態）網站

這是理解「為什麼 GitHub Pages 不夠用」的關鍵。

- **static site（靜態網站）**：由事先寫好的 HTML 頁面組成。之所以叫「靜態」，是因為每個訪客看到的內容都一模一樣。要做靜態網站，你只需要 HTML、CSS 和 JavaScript。
- **dynamic site（動態網站）**：內容會依「造訪者是誰」而改變。X（前身是 Twitter）就是好例子——每個使用者的首頁動態牆，都會依照自己追蹤了誰而顯示不同內容。要做動態網站，除了 HTML、CSS、JS 之外，你還需要一個 server-side application（伺服器端應用程式）和一個 database（資料庫）。

正是這個「多出來的 server 端與資料庫」讓我們無法用 GitHub Pages：它跑不動 Node.js，也沒有可用的資料庫服務。同理，你在 React 課程可能用過的 Netlify、Vercel，也一樣不是設計來跑 Node.js 伺服器與資料庫的——它們不是後端的正確工具。

好消息是，很多 hosting provider 提供了我們需要的一切。它們的光譜很廣：一端是龐大而複雜的 cloud provider（雲端供應商），像是 AWS、Google Cloud、Microsoft Azure；另一端則是對新手友善的 **PaaS（Platform as a Service，平台即服務）** 供應商，像是 Railway 和 Render。本課會聚焦在後者。

### 什麼是 PaaS？

PaaS 是 hosting provider 的一種特定型態。關於它，最重要的一件事是：**它比其他代管方式好用太多，對新手也親切得多**。PaaS 幫你打理好底層伺服器基礎設施那些繁瑣的細節，讓身為開發者的你可以把時間花在「打造應用程式」本身，而不是「設定與維運伺服器」。

延續前面的房東比喻：PaaS 就像一個「連水電、建築維護、保全全都幫你包辦」的房東；而你這個開發者，只要專心佈置、裝潢、住進去就好。這個模型很強大，也正好適合現階段的我們——用 PaaS 部署，就能專注在學好 Node，而不必為了「自己管伺服器」而繞去學一大堆專業維運知識。

### PaaS 是怎麼運作的？

PaaS 的做法，是把「任何 Node app 要在網路上活下來都不能沒有」的幾樣資源，用很簡單的方式交到你手上。

**Instances（實例）**：這是 PaaS 給你的第一樣、也是最關鍵的東西——一台跑你 app 的虛擬「電腦」。一個 instance 就代表你的應用程式同時運行的一份副本，就像你在 `localhost` 用一台電腦跑 app 一樣。多個 instance 就像同時跑好幾份副本，可以承接更多流量。對大多數的 app 來說，**一個 instance 就綽綽有餘**，單一 instance 也能撐住不少流量；本課推薦的許多 PaaS 都會免費送你第一個 instance。

> 補充：server instance（伺服器實例）和 database instance（資料庫實例）可以放在同一個 PaaS，也可以視需要拆到不同 PaaS。當你用到付費方案時，拆開放有時反而能降低代管成本。

**Databases（資料庫）**：PaaS 給你的第二重要的東西就是資料庫。它們讓「為每個 app 開一個新資料庫」變得很輕鬆——所有安裝與設定都幫你做好。許多供應商甚至幫你「管」資料庫：設定自動備份、持續套用最新的重要安全性修補、做日常維護，讓資料庫穩定運行。這份安心很難被高估——你絕不會想遇到那種凌晨 4 點被一堆警報吵醒、資料庫因為某個你忘了套用的安全修補而掛掉、又沒有備份可以救回來的處境。許多 PaaS 都內建 SQL 資料庫。

**Domain names（網域名稱）**：你第一次部署時，PaaS 會發給你一個隨機網域名稱（例如 Heroku 以前常給類似 `afternoon-falls-4209` 這種禪意十足的名字）。你可以直接連到 `http://afternoon-falls-4209.herokuapp.com` 看到 app 上線運行。只要 app 還住在它的平台上，這個網域就一直是你的。真實世界裡你會想接上自己的 custom domain（自訂網域），例如 `http://mycooldomain.com`；不過本課程的 portfolio 專案**不需要**自訂網域，PaaS 給的隨機網域就夠用了。如果你真的手癢想裝上自訂網域，得先去 registrar（網域註冊商，例如 Porkbun、NameSilo）買一個網域，再依供應商文件把它指向你的專案。

### 推薦的 PaaS 供應商

選 PaaS 這件事以前很單純：Heroku 有一個免費方案，足以代管你想要的所有小型 app，可惜它在 2022 年被收掉了。現在仍有不少好選擇，缺點是它們的 free tier（免費額度）都相當有限。因此，為了照顧更多學習者，這裡不只推一家，而是給一個範圍：

- **Railway.app**：可部署 server 和資料庫。綁定你的 GitHub repo 就能部署，採「用多少付多少」模式，一個月約 5 美元大概能代管四個 app。免費方案給一次性的 5 美元試用額度，且 app 閒置時不會被休眠；用完額度或滿 30 天後，會退回只能部署資料庫的受限試用。
- **Render**：可部署 server 和資料庫。用「Blueprints」綁定 GitHub repo 部署；免費 750 小時額度足夠代管幾個 app，但資料庫另計、最低規格每個 7 美元。免費方案下，app 閒置 15 分鐘後會自動休眠。
- **Koyeb**：可部署 server 和資料庫。用 Git push 即可部署，免費方案含一個 Web service 與一個 Postgres 資料庫（50 小時），不需信用卡即可開始。
- **Neon**：**只能部署資料庫**。主資料庫 24/7 運行、0.5 GiB 儲存、10 個專案，不需信用卡。
- **Aiven**：**只能部署資料庫**。5 GiB 儲存、所有資料庫服務 24/7、PostgreSQL／MySQL／Redis 各免費一個，不需信用卡。

> 保護好你的機密（secrets）！文件裡示範的資料庫連線設定，**絕對不要**把帳密直接寫死在程式碼裡。請回頭參考「Environment Variables（環境變數）」那一課的最佳實務。

### 部署的除錯與排除故障

錯誤是軟體開發無法避免的一部分，尤其在部署到 hosting provider 這種「新環境」時特別愛冒出來。遇到時的關鍵是：**別慌**，照著冷靜、按部就班的除錯流程走。多數情況下，你碰到的錯誤前人早就踩過，網路上通常查得到解法。

**Node 版本相容性**：不同供應商支援的 Node 版本、以及預設選用的版本可能不同。你可以查供應商文件，並依你用到的功能，在 `package.json` 的 `engines` 欄位裡指定專案相容的 Node 版本。

最容易出問題的兩個階段是「部署當下」和「部署之後」：

- **部署當下（on deployment）**：先看 **build logs（建置日誌）**——就是你按下部署後那一串輸出。往下捲、找到出錯的那一點，它通常會像你熟悉的 JavaScript／Node stack trace，直接告訴你哪裡出錯。看不懂就把錯誤訊息複製去搜尋引擎查，多半能找到 Stack Overflow 的解法。這階段的錯誤大多和「有沒有照供應商要求正確設定 app」有關，重看一次部署指南往往就能找到漏掉或打錯的地方。
- **部署之後（after deployment）**：部署成功了，結果一打開網站卻迎來令人聞風喪膽的 **500 頁面**。500 幾乎可以代表任何事——production（正式環境）的錯誤頁面刻意講得很模糊，一方面不用技術術語轟炸使用者，另一方面也避免讓攻擊者利用系統錯誤下手。此時你的第一個工具是 **application logs（應用程式日誌）**：它記錄 app 運行時的即時狀況，所有進來的 request 和 database query 都會被記下。遇到 500 時，就打開 logs 緊盯，同時在瀏覽器重新整理頁面來重現錯誤——日誌通常會直接告訴你問題所在，或至少給你可以往下追的線索。

**更進階的工具**：當 app 長大，你會想用更專業的 error-tracking（錯誤追蹤）工具，例如 Sentry，用漂亮好用的介面追蹤、監控錯誤並在發生時收到通知。不過這超出本課範圍，前幾個 app 靠 logs 就夠用了。

**最後一個小訣竅**：如果過去一直部署順利，卻在「最新這次」壞掉了，就退回上一個能正常運作的版本，找出你改了什麼，再慢慢把改動一項項加回去。這正是你一路學的 Git 技能開始大放異彩的地方——用 `git log` 看最近的變更歷史，用 `git checkout` 快速切回先前能運作的版本，能替你省下大量時間。

## 程式碼範例

本課以觀念為主，沒有需要執行的應用程式碼。真正的「部署」動作發生在 PaaS 平台的網頁介面與 Git 流程上。以下整理本課會用到的關鍵指令與設定片段。

在 `package.json` 指定相容的 Node 版本（供應商依此挑選正確的 Node）：

```json
{
  "name": "mini-message-board",
  "engines": {
    "node": ">=20.0.0"
  }
}
```

部署後若壞掉，用 Git 回溯到上一個可運作版本：

```bash
# 查看最近的變更歷史，找出可能出問題的 commit
git log --oneline -10

# 暫時切回某個能正常運作的舊版本（<commit> 換成該版本的雜湊）
git checkout <commit>
```

多數 PaaS 採「綁定 GitHub repo，push 即部署」的流程，因此把可運作的版本推上 remote（遠端）通常就會觸發一次新的部署：

```bash
git add .
git commit -m "chore: deploy mini message board"
git push origin main
```

## 常見陷阱

!!! warning "別把資料庫帳密寫死在程式碼裡"
    示範連線設定時，很容易順手把 database 的帳號密碼直接貼進原始碼，一旦推上公開的 GitHub repo 就等於外洩。正確做法是用 environment variables（環境變數）保存 secrets（機密），在 PaaS 的設定介面填入，程式碼裡只讀 `process.env`。詳見「環境變數」那一課。

!!! warning "別用 GitHub Pages／Netlify／Vercel 跑 Node 後端"
    這些平台是為 static site（靜態網站）設計的，跑不動 Node.js server，也沒有資料庫服務。部署 Express app 請改用 PaaS（Railway、Render、Koyeb 等）。

!!! warning "免費方案的休眠與額度限制"
    有些免費方案（如 Render）會在 app 閒置一段時間後自動休眠，導致下次造訪要等它「醒來」而變慢；有些（如 Railway）則有一次性額度用完就退回受限試用。這是正常現象，不是你的 app 壞了，做 portfolio 用途完全夠。

!!! warning "看到 500 別急著改程式"
    Production 的 500 頁面刻意做得很模糊，光看它猜不出原因。先去看 application logs（應用程式日誌），一邊重新整理頁面重現錯誤、一邊觀察日誌輸出，讓真正的錯誤訊息浮現，再對症下藥。

## 練習

1. 把你的 **Mini Message Board（迷你留言板）** 專案部署到本課提到的任一 hosting provider。課程用途上，任何免費方案都可以，選哪一家都行——這第一次部署最重要的收穫是「取得部署經驗」，不用擔心還沒完全搞懂每個環節，那會隨時間慢慢補上。
   - 依你選的 PaaS，跟著它的官方部署指南一步步做。各家平台專屬的操作步驟（建立帳號、綁定 repo、設定環境變數等）請直接參考[原文](https://www.theodinproject.com/lessons/node-path-nodejs-deployment)所列的官方指南連結。
   - 部署卡關時，回頭看本課「部署的除錯與排除故障」段落找靈感：先分清楚是「部署當下」還是「部署之後」出錯，再分別去看 build logs 或 application logs。

自我檢核（Knowledge check）——能用自己的話回答就代表讀懂了：

- static 網站和 dynamic 網站有什麼差別？
- 「PaaS」是哪三個字的縮寫？
- 用 PaaS 代管有哪些好處？
- 什麼是 instance（實例）？
- 部署「當下」出問題，你可以用哪些步驟診斷？
- 只在部署「之後」才出現的問題，你又該怎麼診斷？

## 原文與延伸資源

- 原文：[Deployment](https://www.theodinproject.com/lessons/node-path-nodejs-deployment)
- 本課引用：
    - PaaS 平台：[Railway](https://railway.app/)、[Render](https://render.com/)、[Koyeb](https://www.koyeb.com/)、[Neon](https://neon.tech/)、[Aiven](https://aiven.io/)
    - Render 官方 Node/Express 部署指南：<https://render.com/docs/deploy-node-express-app>
    - `package.json` 的 `engines` 欄位：<https://docs.npmjs.com/cli/v10/configuring-npm/package-json#engines>
    - 錯誤追蹤服務：[Sentry](https://sentry.io/)
    - 免費開發者資源清單：[free-for.dev](https://free-for.dev/)

---

> 本講義改寫自 The Odin Project《Deployment》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
