---
title: 建立個人網站
source_url: https://www.theodinproject.com/lessons/node-path-getting-hired-building-your-personal-website
source_file: vendor/curriculum/getting_hired/preparing_for_job_search/project_portfolio.md
path: full-stack-javascript
course: Getting Hired
order: 7
status: draft
generated: 2026-07-04
---

# 建立個人網站

> 改寫自 The Odin Project：[Building Your Personal Website](https://www.theodinproject.com/lessons/node-path-getting-hired-building-your-personal-website)
> ｜Full Stack JavaScript › Getting Hired › Preparing for Your Job Search

## 核心概念

### 為什麼要有個人網站

個人網站不是求職的必要條件，但它是一個很好的加分項，也是一個能拿來測試自己實力的有趣專案（project）。從最單純的角度看，它是任何搜尋你的人「直接聯繫到你」的管道，也是你「掌控自己敘事（narrative）」的另一種方式。

重點是：**你要讓自己看起來像一個真實存在的人（a real person）**。展示你的作品、聊聊你熱衷的事物、讓對方感受到你的個性。網站不必做得多華麗——如果你討厭寫作，那就不要硬逼自己寫部落格。真誠比排場重要。

### 保持簡單、乾淨、切中重點

The Odin Project 給的核心建議只有一句話：**簡單勝過臃腫**。

與其塞滿「你看我會這麼多花招！」的炫技功能（features），不如把網站做得乾淨、聚焦，讓你的作品集（portfolio）本身替你說話。招募方（employer）看你的網站是想快速了解「你是誰、你做過什麼」，而不是被一堆動畫和特效拖慢載入、模糊焦點。

一個實用的做法：先去找幾位你欣賞的開發者的個人網站，觀察他們「做對了什麼」。看看他們如何排版、放了哪些內容、如何呈現作品，再把這些觀察轉化成你自己的版本。本課末尾附了一份 TOP 精選的作品集清單可以參考。

### 內容應該包含什麼

一個能替你加分的個人網站，通常會涵蓋以下幾類內容：

- **關於我（About）**：簡短介紹你是誰、你的背景與興趣，讓對方把你當成一個「人」而不只是履歷上的一行字。
- **作品集（Portfolio）**：精選幾個你最自豪的專案，附上截圖與連結，讓瀏覽者一眼看到成果。
- **聯絡方式（Contact）**：Email、GitHub、LinkedIn 等，讓有興趣的人能直接找到你。
- **（選配）部落格或筆記**：如果你喜歡寫作，可以分享學習心得或技術文章，展現你的思考方式。

### 別低估文件（Documentation）的價值

這是本課最容易被忽略、卻最能讓你脫穎而出的環節。

身為專業開發者，**寫出高品質的文件是基本功**；而身為求職者，好文件更是一個「隱藏的發光機會」。你的每個專案都應該包含一份實用的 README，並且至少放一張截圖（screenshot）。README 裡建議至少涵蓋兩個段落：

1. **為什麼建這個專案（Why）**：說明你的動機、想解決什麼問題、學到了什麼。
2. **如何在本機執行（How to run locally）**：清楚列出安裝與啟動步驟，讓別人可以照著跑起來。

更重要的一點：**文件要同時照顧技術與非技術讀者（technical and non-technical audience）**。一位潛在招募方不管技術背景如何，都應該能讀懂你的文件。換句話說，不要假設讀者已經懂所有術語——用清楚的語言解釋清楚，這本身就是一種專業能力的展現。

## 程式碼範例

本課以觀念與專案實作為主，沒有特定的程式語言範例。這裡提供一份「專案 README 骨架」，你可以直接套用到每個作品的 `README.md`：

```markdown
# 專案名稱

一句話說明這個專案是做什麼的。

![專案截圖](./screenshot.png)

## 為什麼建這個專案
說明你的動機：想解決什麼問題、想練習什麼技術、學到了什麼。
（用非技術讀者也看得懂的語言。）

## 使用的技術
- 前端：HTML / CSS / JavaScript（或框架）
- 後端：Node.js / Express（若有）
- 資料庫：（若有）

## 如何在本機執行
```bash
# 1. 複製專案
git clone https://github.com/你的帳號/專案名稱.git

# 2. 進入資料夾並安裝相依套件
cd 專案名稱
npm install

# 3. 啟動
npm start
```

## Live Demo
（部署後的網址，若有）
```

!!! note "小提醒"
    截圖檔（screenshot）記得一起提交（commit）到 repository，並在 README 用相對路徑引用，這樣別人在 GitHub 上就能直接看到成果，不必自己跑起來。

## 常見陷阱

!!! warning "為了炫技而過度設計"
    最容易犯的錯就是把網站當成「特效展示場」，塞滿動畫、視差捲動、載入慢的互動元件。招募方時間有限，網站的目的是「快速讓對方認識你」。臃腫的設計反而稀釋了你作品的重點。簡單、乾淨、切中重點永遠是安全牌。

!!! warning "文件寫給自己看，而不是寫給別人看"
    很多人 README 只寫「npm install && npm start」就交差。問題是：讀者不知道這個專案是什麼、為什麼值得看、跑起來會看到什麼。務必補上「為什麼建」與「如何執行」兩段，並且假設讀者可能沒有技術背景，用他們也懂的語言說明。

!!! warning "沒有截圖或 Live Demo"
    純文字的 README 要求對方「自己 clone 下來跑才看得到成果」，門檻太高。一張截圖或一個線上 Demo 連結，能在三秒內讓對方看到你的作品，轉換率遠高於一長串安裝指令。

## 練習

這是一個 project（專案）課，沒有標準答案，重點在於動手做出屬於你自己的網站與作品文件。建議依下列步驟進行：

1. **研究參考範例**：從下方「原文與延伸資源」的作品集清單挑 3 到 5 個，分析他們放了哪些內容、如何排版、哪些地方做得好，記下你想借鏡的點。
2. **規劃你的網站**：決定要放哪些區塊（About、Portfolio、Contact 等），草擬結構。原則是簡單、乾淨、切中重點。
3. **動手建置並部署**：用你已學會的 HTML/CSS/JavaScript（或框架）做出網站，並部署到可公開存取的網址（例如 GitHub Pages、Netlify、Vercel 等）。
4. **完善每個專案的文件**：回頭替你的重點專案補上高品質 README——包含至少一張截圖、「為什麼建這個專案」以及「如何在本機執行」兩個段落，並確認技術與非技術讀者都讀得懂。
5. **延伸閱讀**：閱讀原文 Assignment 指定的兩篇文章，理解個人網站對求職的幫助，以及撰寫優良文件的實務原則（連結見下方資源）。

> 因為每個人的網站主題與技術棧不同，具體的部署與實作細節請依你選用的工具與平台，回到原文與各服務的官方文件操作。

## 原文與延伸資源

- 原文：[Building Your Personal Website](https://www.theodinproject.com/lessons/node-path-getting-hired-building-your-personal-website)
- 本課引用：
  - [Why Every Job Seeker Should Have a Personal Website（Forbes）](http://www.forbes.com/sites/jacquelynsmith/2013/04/26/why-every-job-seeker-should-have-a-personal-website-and-what-it-should-include/)
  - [Beginner's Guide to Writing Documentation（Write the Docs）](http://www.writethedocs.org/guide/writing/beginners-guide-to-docs/)
- 作品集參考清單（TOP 精選，用來分析別人怎麼呈現）：
  - [Stratis Bakas](https://stratisbakas.com/)、[Matt Farley](https://mattfarley.ca/)、[Dejan Markovic](https://www.dejan.works/)、[Ian Lunn](https://ianlunn.co.uk/)、[Ben Adam](https://benadam.me/)
  - [Seb Kay](https://sebkay.com/)、[Andriy Chemerynskiy](https://andrewchmr.com/)、[Chris Ota](https://www.otadesigns.com/)、[Pierre Nel](https://pierre.io/)、[Adrien Laurent](https://adrienlaurent.fr/)
  - [Thomas Bosc](https://www.thomasbosc.com)、[Timmy O'Mahony](https://timmyomahony.com/)、[Elliot Condon](https://elliotcondon.com/)、[James Warner](https://jmswrnr.com/)、[Tiago Sá](https://i-am-tiago.com/)、[Patrick David](https://bepatrickdavid.com/)、[Luis Krötz](https://luiskr.com/)

---

> 本講義改寫自 The Odin Project《Building Your Personal Website》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
