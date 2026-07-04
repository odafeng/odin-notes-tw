---
title: 網頁開發簡介
source_url: https://www.theodinproject.com/lessons/foundations-introduction-to-web-development
source_file: vendor/curriculum/foundations/introduction/introduction_to_web_development.md
path: foundations
course: Foundations
order: 2
generated: 2026-07-03
---

# 網頁開發簡介

> 改寫自 The Odin Project：[Introduction to Web Development](https://www.theodinproject.com/lessons/foundations-introduction-to-web-development)
> ｜Foundations › Introduction

## 核心概念

網頁開發者（web developer）做的事，一句話講完：建立並維護網站。實際上，工作通常以專案為單位進行，你會和團隊協作，把客戶的需求轉化成最終產品。客戶可能是科技公司、某個組織，甚至是政府單位。如果你喜歡解決邏輯問題、喜歡動手做出有用的東西、喜歡把玩新技術，這一行很值得考慮。市場對開發者的需求長期偏高，work-life balance（工作與生活平衡）普遍不錯，薪資也相當可觀。想了解你所在地區的實際機會，直接用你的城市名稱去搜尋就會有概念。

### 三種開發者：front end、back end、full stack

網頁開發大致分成三個領域，這是整個課程反覆會用到的分類：

- **前端（front end）**：你在瀏覽器裡「看得到」的那一層，包含內容的呈現，以及導覽列、按鈕這類使用者介面（user interface）元素。前端開發者用 HTML、CSS、JavaScript 以及相關的 framework（框架），確保內容有效呈現、使用者有良好體驗。
- **後端（back end）**：應用程式的「內臟」，運行在伺服器（server）上。後端負責儲存資料、把資料送給前端，確保前端拿得到它需要的東西。當網站有數百萬使用者時，這件事會變得非常複雜。後端開發者使用 Java、Python、Ruby、JavaScript 等程式語言來處理資料。
- **全端（full stack）**：前後端都能上手的人。The Odin Project 教的正是 full-stack development，涵蓋網頁開發的各個面向——所以你不用先煩惱該選前端還後端，這條路兩邊都會碰到。

### 你會為誰工作：職涯類型

知道了開發者的分類，接著看你可能服務的對象與雇主類型，每一種各有取捨：

- **大型科技公司**（如 Google、Meta、Amazon）：招募門檻非常嚴格，但只要通過，薪酬、福利與發展機會都很優渥。
- **新創（startup）**：有點像蠻荒西部。開發節奏極快，對 junior（初階）開發者來說常像是「跳進火裡受洗」。薪水通常略低、工時偏長，但可能給你公司股權（equity）與獨特的環境。
- **自由接案（freelancer）**：時薪可以很高，能自己安排時間、設計自己的產品。但你得自己找案子（意味著寫程式的時間變少）、自己處理跟客戶收款（可能很麻煩），一切責任一肩扛。這條路很需要人際溝通能力。
- **顧問公司（consultancy）的顧問**：放棄一部分接案的收入上限，換來更能專注在程式碼、少一點拉客戶的辛勞，work-life balance 與薪資都不錯。
- **大型的老牌公司**：它們仍然需要網頁開發者，通常有良好的 work-life balance、薪資與福利，只是步調往往比純科技導向的公司慢。

### 你會用到的工具

以下是你會經常使用的基本工具。現在不認得沒關係，接下來的課程一定會讓你熟到不行：

- **電腦**——你的主要生財工具。
- **Google**——最重要的一項技能：把問題描述清楚、丟去搜尋、看懂結果。
- **文字編輯器（text editor）**——寫程式碼的地方，例如 VS Code。它跟 Word 不同，專為程式碼設計，有語法高亮、外掛等功能。
- **命令列介面（command line interface, CLI）**——用打字下指令的方式操作電腦，很多開發工具只透過 CLI 使用。
- **Stack Overflow**——工程師問答社群，你遇到的錯誤很可能別人早就問過、也有人答過。
- **Git**——版本控制（version control）系統，記錄程式碼的每一次變更，讓你能回溯、比對、協作。
- **GitHub**——把 Git 儲存庫（repository）放上雲端、和世界分享與協作的平台，之後也會是你的作品集門面。

### 心態與「為什麼選 Odin」

學寫程式收穫極大，但過程真的會辛苦、會讓人挫折。作為學習者，你最強的三項資產是：**想動手做的慾望、解決問題的頭腦、遇到卡關仍不放棄的韌性**。這一行歷史上有太多背景各異卻成功的開發者，所以大家更在意你「實際做出了什麼」，而不是你怎麼走到這裡的。

The Odin Project 不會騙你說這很輕鬆。網路上有很多給初學者的課程，但它們常常把你關在高度隔離、受控的環境裡，只教單一主題。Odin 的做法比較貼近真實：讓你在**自己的環境**裡動手做，就像未來上班時那樣；它承認你需要多樣的技能與語言，才能達到「可被雇用」的水準。這套課程也持續在演進，因為許多和你一樣的學習者走得更遠之後，會回頭一點一滴改善教材。等你對工具上手了，就開始參與 open source（開源）專案吧——貢獻愈多，你就愈清楚自己能做什麼，也離「被錄用」愈近，而這些貢獻在履歷上也會很亮眼。

在這門「Foundations」課程裡，你會快速走過未來需要掌握的各種主題：它會在許多你可能完全陌生的題目之間跳躍，讓你每個都嚐一小口，再繼續前進；之後的課程才會深入。是的，這會有挑戰性，但它也會很有趣，甚至可能改變你的人生。

## 程式碼範例

本課以觀念為主，沒有需要實作的程式碼。這裡列出後續課程會反覆出現、值得先眼熟的幾個命令列（CLI）指令，感受一下「用打字操作電腦」是什麼樣子：

```bash
pwd            # 顯示目前所在的資料夾路徑（print working directory）
ls             # 列出目前資料夾裡的檔案與子資料夾
cd my-project  # 切換到 my-project 資料夾（change directory）
git status     # 查看目前 Git 儲存庫的變更狀態
```

現在看不懂完全正常，這裡只是先讓你知道：開發者很多時候不是用滑鼠點來點去，而是打指令。

## 常見陷阱

!!! warning "以為要先選定前端或後端才能開始"
    很多新手卡在「我到底該學前端還是後端」這個問題上遲遲不動手。這門課教的是 full stack，前後端都會帶你走過，所以現階段不需要做這個決定。先開始學，等你實際碰過各個領域，偏好自然會浮現。過早選邊反而會拖慢你起步的時間。

!!! warning "期待學程式一路順風"
    這門課一開始就明白告訴你：這不會輕鬆。遇到看不懂的錯誤訊息、卡好幾個小時，是每一位開發者的日常，不代表你不適合。真正決定成敗的不是天份，而是持續除錯、持續 Google、持續不放棄的韌性。把「卡關」當成過程的一部分，而不是失敗的訊號。

## 練習

1. 閱讀 The Odin Project 創辦人寫的文章〈[Why Learning to Code is So Damn Hard](https://dev.to/theodinproject/why-learning-to-code-is-so-damn-hard-11nn)〉（為什麼學寫程式這麼難）。它很誠實地描繪了前方旅程的樣貌——尤其是那條會讓很多人半途放棄的「絕望之谷」，先有心理準備，你就更撐得住。
2. 閱讀 Udacity 的部落格文章〈[front-end、back-end 與 full stack 開發者的差異](https://www.udacity.com/blog/2020/12/front-end-vs-back-end-vs-full-stack-web-developers.html)〉，加深你對這三種角色分工的理解。

讀完後，試著用自己的話回答：Odin 會把你訓練成哪一種開發者？你可能會有哪些職涯選項？你會經常用到哪些工具？能講清楚，就代表這一課的重點你抓到了。

## 原文與延伸資源

- 原文：[Introduction to Web Development](https://www.theodinproject.com/lessons/foundations-introduction-to-web-development)
- 本課引用：
    - 〈[Why Learning to Code is So Damn Hard](https://dev.to/theodinproject/why-learning-to-code-is-so-damn-hard-11nn)〉——The Odin Project 創辦人談學習曲線
    - 〈[Front-End vs Back-End vs Full Stack Web Developers](https://www.udacity.com/blog/2020/12/front-end-vs-back-end-vs-full-stack-web-developers.html)〉——Udacity 對三種角色的說明
    - [如何貢獻 The Odin Project](https://www.theodinproject.com/contributing)——上手後回饋社群的起點

---

> 本講義改寫自 The Odin Project《Introduction to Web Development》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
