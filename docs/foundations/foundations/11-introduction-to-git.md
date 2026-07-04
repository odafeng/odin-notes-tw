---
title: Git 簡介
source_url: https://www.theodinproject.com/lessons/foundations-introduction-to-git
source_file: vendor/curriculum/git/foundations_git/introduction_to_git.md
path: foundations
course: Foundations
order: 11
generated: 2026-07-03
---

# Git 簡介

> 改寫自 The Odin Project：[Introduction to Git](https://www.theodinproject.com/lessons/foundations-introduction-to-git)
> ｜Foundations › Git Basics

## 核心概念

### Git 是什麼？一顆「史詩級的存檔按鈕」

你可以把 Git 想像成一顆為檔案與資料夾準備的、超級強大的**存檔（save）按鈕**。用比較正式的說法：Git 是一套 version control system（版本控制系統），它負責追蹤你的專案在時間軸上發生過哪些變化，並保留每一次變化的紀錄。

要理解 Git 的價值，先看看一般文字編輯器的「存檔」有什麼侷限。當你在文書軟體裡按下存檔，它只是把目前文件裡的所有文字，覆蓋寫入成**單一一份檔案**，例如 `essay.doc`。你手上永遠只有這一份最新的紀錄。如果你想保留舊版本，只能自己手動複製成好幾份：

```
essay-draft1.doc
essay-draft2.doc
essay-final.doc
essay-final-真的最終版.doc
```

這種做法很快就會失控：檔名愈取愈亂、容易忘記複製、也很難說清楚每一份到底改了什麼、彼此差在哪裡。

Git 的「存檔」則完全不同。它記錄的是檔案與資料夾之間的**差異（differences）**，而且會保留**每一次存檔的歷史紀錄**。這個特性是真正的遊戲規則改變者。

### commit：Git 版本的「存檔點」

在 Git 裡，每一次存檔叫做一個 commit（提交）。每個 commit 就像遊戲裡的一個存檔點：它記下「從上一個存檔點到現在，我改了哪些地方」，並附上時間、作者，以及一段你自己寫的說明訊息（commit message），用來解釋這次改了什麼、為什麼要改。

因為這些 commit 串成一條完整的歷史，身為一個獨立開發者，Git 讓你可以：

- **回顧專案是怎麼一步步長成現在這樣的**：整條歷史攤開來，一目瞭然。
- **隨時查看過去某個時間點的檔案狀態**：不必自己手動複製一堆備份。
- **把檔案還原到過去的任何一個版本**：改壞了、想反悔，都能安全地回到之前的存檔點。

換句話說，你不再需要那些 `-final`、`-final2` 的檔名，因為所有歷史都被完整、可靠地保存在同一個地方。

### Git 與 GitHub：本機 vs 遠端

初學者最常混淆的，就是 Git 和 GitHub 到底是不是同一個東西。它們**不是**，這是本課最重要的觀念之一：

- **Git** 是一套**軟體（工具）**，運作在你自己的**本機（local）**電腦上。它負責版本控制的核心工作：追蹤變化、建立 commit、保存歷史。就算完全沒有網路，Git 也能正常運作。
- **GitHub** 是一個**線上服務（網站）**，是架設在網路上的**遠端（remote）**儲存空間，用來存放你的程式專案。它讓你可以把本機的專案「上傳」到雲端，藉此備份、分享，以及和其他開發者協作。

一個簡單的類比：Git 是你電腦裡的相機，負責一張一張拍下專案的每個版本；GitHub 則像雲端相簿，把你拍好的照片放到網路上，讓你備份、也讓別人看得到。

一旦連上網路，Git 就能把你的專案**推送（push）**到 GitHub。除了 GitHub，市面上還有 Bitbucket、Beanstalk、GitLab 等類似的平台。不過在 The Odin Project 的課程裡，我們**只支援 GitHub**，遇到其他平台的問題不會協助排除。

### 為什麼開發者都在用 Git？

**對個人開發者而言**：Git 給你一張隨時可用的安全網。你可以大膽嘗試新想法，因為知道萬一搞砸了，隨時能回到之前正常運作的版本；你也能清楚看見專案的演進過程。再加上 GitHub，你等於擁有一份公開的作品集（portfolio）。

**對團隊而言**：Git 讓多個開發者能夠在**同一個專案上同時工作**，各自修改後再把成果整合起來，而不會互相覆蓋、搞丟彼此的心血。GitHub 則在此之上，提供了討論、審查程式碼、追蹤問題等協作機制，並且會清楚記錄「每一行改動是誰、在什麼時候、為了什麼而做的」。

正因如此，幾乎所有軟體開發公司都把「會用 Git」視為現代網頁開發者的**必備技能**。一份有內容的 GitHub 作品集，能直接向未來的雇主證明你的實力。

### 三種版本控制系統：本機、集中式、分散式

在正式的 version control 世界裡，系統大致分成三代，理解它們有助於你明白 Git 為何這樣設計：

- **本機式版本控制（Local VCS）**：最早期的做法，所有版本紀錄都只存在你自己這一台電腦上（例如把版本差異存進本機的簡單資料庫）。優點是簡單，缺點是難以和別人協作，而且硬碟一壞，整個歷史就沒了。
- **集中式版本控制（Centralized VCS）**：像 Subversion（SVN）這類系統，把所有版本紀錄放在**單一一台中央伺服器**上，大家都連上去存取。這解決了協作問題，但也帶來單點故障（single point of failure）的風險：中央伺服器一旦掛掉或資料損毀，所有人都無法工作，歷史也可能一起消失。
- **分散式版本控制（Distributed VCS）**：Git 屬於這一類。每個開發者的電腦上，都持有一份**完整的專案歷史（完整副本）**，而不只是最新版本。這代表任何一份副本都可以拿來還原整個專案，即使中央的 GitHub 伺服器暫時故障，大家手上都還有完整的資料，可以繼續工作、之後再同步。

Git 就是分散式版本控制的代表，也是它強大又可靠的關鍵原因。

### 這一課與接下來的路

這一課先建立觀念：Git 是什麼、它為什麼強大，以及它和 GitHub 的分工。**下一課**會帶你走過使用 Git 的基本工作流程，透過實際操作加深理解。**再往後**，你會用 Git 建立一個專案，並把它當成你未來所有專案的起始範本。現在，先把觀念打穩即可。

## 程式碼範例

本課以觀念為主，尚未進入實際操作。不過先認識幾個關鍵詞彙，會對下一課很有幫助：

- **repository（儲存庫，常簡稱 repo）**：一個被 Git 追蹤版本的專案資料夾。
- **commit（提交）**：一次存檔，記錄這次改動並附上說明訊息。
- **push（推送）**：把本機的 commit 上傳到遠端（例如 GitHub）。
- **local（本機）／remote（遠端）**：Git 在你自己的電腦上運作；GitHub 是網路上的遠端儲存空間。

真正的指令（例如 `git init`、`git add`、`git commit`、`git push`）會在後續的課程逐一登場，這裡先有印象即可。

## 常見陷阱

!!! warning "Git 不等於 GitHub"
    這是初學者最常見的誤解。**Git** 是跑在你電腦上的版本控制**軟體**，沒有網路也能用；**GitHub** 是網路上的一個**服務網站**，用來存放與分享 Git 專案。你可以只用 Git 而完全不碰 GitHub，但不能反過來。把兩者的角色分清楚，後面的觀念才不會打結。

!!! warning "存檔（commit）不會自動上傳到 GitHub"
    在本機做了 commit，改動只保存在你自己的電腦裡。要讓 GitHub（或其他協作者）看到，必須額外執行 push（推送）這個動作。commit 和 push 是兩個獨立步驟，別把它們混為一談。

## 練習

1. 閱讀 Pro Git 的《Getting Started》第 1.1 到 1.4 節，理解本機式、集中式、分散式三種版本控制系統的差異：<https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control>
2. 觀看兩分鐘短片〈What is Git?〉，快速掌握 Git 是什麼、以及它如何改善個人與團隊的工作流程：<https://www.youtube.com/watch?v=2ReR1YJrNOM>
3. 閱讀 GitHub 官方文件〈About GitHub and Git〉，了解 GitHub 是什麼、以及 Git 與 GitHub 如何搭配運作（結尾的「Where do I start?」一節可略過）：<https://docs.github.com/en/get-started/start-your-journey/about-github-and-git>
4. 如果你還沒安裝 Git，請先完成〈Setting Up Git〉這一課：<https://www.theodinproject.com/lessons/foundations-setting-up-git>
5. 逛一逛 The Odin Project 的 GitHub repository（<https://github.com/TheOdinProject/curriculum>），這裡存放著所有課程。順便看看它的 [contributors 貢獻者名單](https://github.com/TheOdinProject/curriculum/graphs/contributors)，體會 Git 如何記錄眾人的協作成果，以及 GitHub 如何把這些協作視覺化呈現。

完成後，試著回答下列問題來檢查自己的理解：

- Git 是哪一種類型的程式？
- 就「儲存什麼」與「如何保存紀錄」而言，Git 和文字編輯器有什麼不同？
- Git 是在本機還是遠端運作？
- GitHub 是在本機還是遠端運作？
- 為什麼 Git 對開發者很有用？
- 為什麼 Git 與 GitHub 對開發團隊很有用？

## 原文與延伸資源

- 原文：[Introduction to Git](https://www.theodinproject.com/lessons/foundations-introduction-to-git)
- 本課引用：
    - [Pro Git：Getting Started – About Version Control（1.1–1.4）](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)
    - [What is Git?（2 分鐘影片）](https://www.youtube.com/watch?v=2ReR1YJrNOM)
    - [GitHub Docs：About GitHub and Git](https://docs.github.com/en/get-started/start-your-journey/about-github-and-git)
    - [The Odin Project 的 GitHub 儲存庫](https://github.com/TheOdinProject/curriculum)

---

> 本講義改寫自 The Odin Project《Introduction to Git》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
