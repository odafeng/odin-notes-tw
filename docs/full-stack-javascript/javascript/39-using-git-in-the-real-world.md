---
title: 在真實世界用 Git
source_url: https://www.theodinproject.com/lessons/javascript-using-git-in-the-real-world
source_file: vendor/curriculum/git/intermediate_git/using_git_in_the_real_world.md
path: full-stack-javascript
course: JavaScript
order: 39
generated: 2026-07-03
---

# 在真實世界用 Git

> 改寫自 The Odin Project：[Using Git in the Real World](https://www.theodinproject.com/lessons/javascript-using-git-in-the-real-world)
> ｜Full Stack JavaScript › JavaScript › Intermediate Git

## 核心概念

Git 的基本操作其實很直觀：`add`、`commit`、`push`。但當你第一次撞上合併衝突（merge conflict）、或看到一串看不懂的錯誤訊息時，那種感覺就像掉進無底洞。這裡先給你一顆定心丸：**在 Git 裡「弄丟」資料其實非常困難**。你以為刪掉的 commit，多半只是藏在某個你想不到的角落（例如 reflog）。真正的關卡不是「怕弄壞」，而是「還不熟悉團隊協作時的資料流」。這一課要把在真實開源專案上貢獻程式碼的完整流程講清楚，讓你知道每一步在做什麼、為什麼要這樣做。

### 為什麼需要一套「工作流」

自己一個人寫程式時，你的電腦上有一份 repo，改完直接 `push` 上 GitHub，天下太平。但真實世界的協作不是這樣：一個開源專案（例如 The Odin Project 的 curriculum）有成千上萬的貢獻者，維護者不可能把「寫入權限」（write access）發給每個人。**沒有寫入權限，你就不能直接 push 到別人的 repo。** 那要怎麼貢獻？答案是 fork（分叉）＋ pull request（拉取請求，常縮寫為 PR）的工作流。

理解這套流程的關鍵，是先認清三個角色（原文比喻成一個「快樂的三角形」）：

- **`upstream`（上游）**：原始的官方 repo，例如 `TheOdinProject/curriculum`。你**沒有**寫入權限，只能讀（pull / fetch）。
- **`origin`（源頭）**：你在 GitHub 上 fork 出來的那份複本，帳號是你自己的。你**有**完整的讀寫權限。
- **`local`（本機）**：你 `clone` 到自己電腦上的那份，你在這裡實際寫程式。

三者的資料流是有方向性的：`local` 可以從 `upstream` **pull**（把別人的最新進度抓下來），但**不能 push 回 `upstream`**；`local` 可以自由地 push 到 `origin`；`origin` 最後透過 pull request 把變更「提議」合併回 `upstream`，由維護者（maintainer）審核後決定要不要合。

```text
upstream (官方 repo)  ──fetch──►  local (你的電腦)
      ▲                              │
      │ 由維護者審核並 merge          │ push
      │                              ▼
   Pull Request  ◄──────────────  origin (你的 fork)
```

### remote 是什麼

要讓上面的三角形運作，你必須讓本機的 Git 認得這兩個遠端（remote）。**remote 就是一個「指向某個遠端 repo 網址」的名字別名。** 當你 `git clone` 你的 fork 時，Git 會自動幫你建立一個叫 `origin` 的 remote，指向你的 fork——所以 `git push` 預設就是推到 `origin`。

但 Git 不會自動知道「上游官方 repo」在哪裡，你得手動加上去：

```bash
git remote add upstream git@github.com:TheOdinProject/curriculum.git
```

這行的意思是「新增一個叫 `upstream` 的 remote，指向官方 repo 的網址」。之後你就能用 `git fetch upstream` 從官方 repo 抓最新變更。用 `git remote -v` 可以檢查目前有哪些 remote、各自指向哪個網址。

### commit message：協作的第一印象

在深入工作流之前，先花一分鐘複習 commit message。當你自己寫 code 時，`fix stuff` 這種訊息或許還能忍；但在協作專案裡，你的 commit message 是**別人（以及未來的你）理解這段變更為何存在的唯一線索**。維護者在審 PR 時、有人在 `git blame` 追一行 bug 的來歷時，看到的就是你的訊息。

近年協作專案越來越流行一個叫 **Conventional Commits（約定式提交）** 的標準，它替 commit message 定義了一個固定結構：

```text
<type>[可選的 scope]: <description>

[可選的 body]

[可選的 footer]
```

第一行的 `type` 用一個關鍵字說明這次變更的性質，最常見的兩個是：

- **`feat`**：新增一個功能（對應語意化版號 Semantic Versioning 的 MINOR）。
- **`fix`**：修掉一個 bug（對應 PATCH）。

其他常見但非強制的 type 還有 `docs`（文件）、`style`（純格式，不影響邏輯）、`refactor`（重構）、`perf`（效能）、`test`（測試）、`build`、`ci`、`chore`（雜項）。例如 `feat(lang): add Polish language` 表示「在 lang 這個範圍新增波蘭語功能」。

若這次變更會**破壞既有相容性**（breaking change），可以在 type 後面加一個 `!`，或在 footer 用 `BREAKING CHANGE:` 標註，對應 MAJOR 版號：

```text
feat(api)!: send an email to the customer when a product is shipped

BREAKING CHANGE: 出貨事件的回呼參數格式已變更，舊版整合會失效。
```

這套約定的好處是：訊息本身結構清晰、一眼看懂目的，還能讓工具**自動產生 changelog、自動決定版號要升到哪**。就算你目前的專案沒強制用它，讀懂它也能幫你看懂別人的 repo。

### 日常工作流：從功能分支到送出 PR

假設你已經在官方 repo 的某個 issue 上留言、維護者也把它指派（assign）給你了。以下是實際被貢獻者採用的完整流程。整個過程只有一條「正式」的主分支 `main`，它代表**可上線的正式程式碼**；你所有的工作都在自己的**功能分支（feature branch）**上進行。

**第一步：開一個功能分支。** 不要直接在 `main` 上改東西。用 `git checkout -b your_feature_name` 開一條新分支，在上面做你的變更並 commit。這樣 `main` 永遠保持乾淨，隨時能拿去跟上游同步。

**第二步：同步上游的最新進度。** 當你悶頭做完功能時，別人很可能已經往上游推了新的變更，你手上的 `main` 已經過時了。先把上游最新狀態抓下來：

```bash
git fetch upstream
```

`fetch` 只是「下載」，它把上游的分支與 commit 拉到本機，但**不會動到你正在用的分支**，所以很安全。

**第三步：把上游變更併進本機的 `main`。** 先切回 `main`，再把剛抓下來的 `upstream/main` 併進去：

```bash
git checkout main
git merge upstream/main
```

現在你本機的 `main` 就跟上游同步了。

> **小提醒：為什麼拆成 fetch + merge？**
> `git fetch upstream` 後接 `git merge upstream/main`，效果**完全等同於** `git pull upstream main`。這裡故意拆成兩步，是為了讓你清楚看見「下載」與「合併」是兩件不同的事——`fetch` 純下載、`merge` 才真的動你的分支。熟練後你當然可以直接用 `pull`。

**第四步（最反直覺的一步）：把 `main` 併進你的功能分支。** 你可能會愣一下：不是應該把功能分支併進 `main` 嗎？怎麼反過來？

答案是「先反過來，但還不是現在」。關鍵理由是：**你的功能分支是「髒」的**——你不知道它跟最新的 `main` 之間有沒有衝突。而 `main` 是比較「資深」的分支，你希望之後併進 `main` 時是一次乾淨、無衝突的合併。所以策略是：**先把資深分支（`main`）併進你這條髒分支，把衝突在自己的地盤上先解決掉。**

```bash
git checkout your_feature_name
git merge main
```

**第五步：解決可能出現的合併衝突。** 如果 `git merge main` 報出衝突，就用你在「Working with Remotes」那一課學到的技巧逐一解決：打開衝突檔案、找到 `<<<<<<<`／`=======`／`>>>>>>>` 標記、決定保留哪一邊、刪掉標記、`git add` 後 `git commit` 完成合併。因為衝突是在你自己的功能分支上解的，就算解錯了也不會弄髒 `main`。

### 送出 Pull Request

功能分支現在乾淨了、也確定能乾淨地併進 `main`，最難的部分已經過去。剩下就是把它送上 GitHub 並開 PR：

**推到你的 fork。** 你不能直接推到 `upstream`（沒權限），所以推到你自己的 `origin`：

```bash
git push origin your_feature_name
```

> **關鍵警告（務必遵守）**
> **如果沒有維護者指派 issue 給你，請在這一步停下。** 不要開「測試用」或「練習用」的 PR。這類 PR 會被當成垃圾訊息（spam），維護者會直接關閉、不予審查。

**開 PR。** 如果你完成的是被指派的 issue，最後一步就是在 GitHub 網頁介面上，發一個 pull request，提議把你 fork 上的功能分支合併進官方 `upstream` repo 的 `main` 分支。維護者審核通過並 merge 後，你的貢獻就正式進入官方專案——恭喜，你成了一名開源軟體（OSS）貢獻者。

要記住一件事：**同步 fork 只更新你「本機」的複本。** 如果你想讓 GitHub 上的 fork（`origin`）也跟著更新，得額外 `git push origin main`。本機和 GitHub 上的 fork 是兩個地方，本機的 merge 不會自動反映到雲端。

## 程式碼範例

下面把整條工作流串成一組可以照著打的指令。註解說明每一步在做什麼。

```bash
# 1. clone 你 fork 出來的複本（origin 會被自動建立，指向你的 fork）
git clone git@github.com:your_user_name/curriculum.git
cd curriculum

# 2. 手動加上 upstream remote，指向官方 repo
git remote add upstream git@github.com:TheOdinProject/curriculum.git

# 檢查兩個 remote 都在（會看到 origin 與 upstream 各兩行）
git remote -v

# 3. 開一條功能分支開始工作
git checkout -b fix-typo-in-readme

# ...改檔案、寫程式...
git add .
git commit -m "fix: 修正 README 中的錯字"

# 4. 功能做完，先同步上游最新進度到本機 main
git fetch upstream
git checkout main
git merge upstream/main

# 5. 把最新的 main 併進「髒」的功能分支，先在自己地盤解衝突
git checkout fix-typo-in-readme
git merge main
# 若有衝突，解完後 git add + git commit

# 6. 把乾淨的功能分支推到你的 fork（origin）
git push origin fix-typo-in-readme

# 7. 到 GitHub 網頁上，對 upstream 的 main 開一個 Pull Request
```

## 常見陷阱

!!! warning "把 `main` 併進功能分支的方向搞反"
    很多人直覺想「先把功能分支併進 `main`」。實際順序相反：**先 `git checkout 功能分支` 再 `git merge main`**，把資深的 `main` 併進你這條髒分支，讓衝突在功能分支上解決。等到功能分支保證能乾淨合併，最後才透過 PR 併回 `main`。方向搞反的話，你會把未解決的衝突直接帶進 `main`。

!!! warning "以為 push 到 fork 就等於送進官方 repo"
    `git push origin your_feature_name` 只是把分支送到**你自己的 fork**，官方 repo 完全不知道這件事。要讓變更進入官方 repo，必須在 GitHub 上**手動開 pull request**，並等維護者審核 merge。沒有 PR，就沒有貢獻。

!!! warning "沒被指派 issue 就亂開 PR"
    如果沒有維護者把 issue 指派給你，**不要開測試或練習用的 PR**。這類 PR 會被視為 spam 直接關閉、不予審查，還可能影響你在專案的信譽。想練手就照著流程做到 `git push origin` 那一步為止，別按下開 PR 的按鈕。

!!! warning "忘了同步就悶頭做完整個功能"
    如果你開分支後好幾天不理上游，等做完才 `git fetch upstream`，很可能撞上一大堆累積的衝突。好習慣是**定期把上游同步進 `main`、再併進功能分支**，讓每次要解的衝突都小而可控。

## 練習

以下把原文的 Assignment 改寫成繁中步驟。情境：你想貢獻 [TOP 的 curriculum repo](https://github.com/TheOdinProject/curriculum/)，並假設你已在某個 [open issue](https://github.com/TheOdinProject/curriculum/issues) 上留言、且維護者已把它指派給你。若你**沒有**被指派 issue，可以照做但**請在「送出 PR」的第 3 步之前停下**，因為你的變更並非正式貢獻。

**初始設定（Initial setup）**

1. 先讀專案的 [貢獻指南 CONTRIBUTING.md](https://github.com/TheOdinProject/curriculum/blob/main/CONTRIBUTING.md)。
2. 在瀏覽器打開 [curriculum repo](https://github.com/TheOdinProject/curriculum/tree/main)，用右上角的「Fork」按鈕把**整個 repo**（不是單一檔案）複製到你自己的 GitHub 帳號。
3. 用 `git clone git@github.com:你的帳號/curriculum.git` 把你的 fork clone 到本機（網址可從 repo 頁面右側的小工具取得）。
4. 因為是 clone 來的，`origin` 這個 remote 已經自動指向你的 fork。接著在 `curriculum` 資料夾內執行下面這行，把官方 repo 設為 `upstream`：

    ```bash
    git remote add upstream git@github.com:TheOdinProject/curriculum.git
    ```

**日常工作流（Ongoing workflow）**

1. 為你要做的功能開一條新的功能分支，並在上面 commit。
2. 功能做完後，用 `git fetch upstream` 抓上游最新變更。
3. 用 `git checkout main` 切回 `main`，再 `git merge upstream/main` 把上游變更併進本機 `main`。
4. 切回功能分支 `git checkout 你的功能分支`，再 `git merge main`，把最新的 `main` 併進功能分支（先在髒分支上解衝突）。
5. 如果出現合併衝突，用你在「Working with Remotes」學到的技巧解決。

**送出 Pull Request（Sending your pull request）**

1. 功能分支現在乾淨且能無衝突併進 `main`，最難的部分結束了。
2. 用 `git push origin 你的功能分支` 把分支推到你的 fork。（沒被指派 issue 的話，**到此為止**，別開 PR。）
3. 若你完成的是被指派的 issue，最後在 GitHub 介面上開 PR，把功能分支合併進官方 `upstream` 的 `main`。

完整的 project 步驟與最新細節，請以 [原文](https://www.theodinproject.com/lessons/javascript-using-git-in-the-real-world) 為準。

**Knowledge check 自我檢核**

- 指向「被 fork 的原始 repo」的 Git remote 通常叫什麼名字？（答：`upstream`。你自己的 fork 則叫 `origin`。）
- 你能把變更直接送進一個你不擁有／沒有寫入權限的 repo 嗎？（答：不能。你只能推到自己的 fork，再透過 pull request 提議合併。）
- 在把 `main` 併進功能分支之前，你應該先做什麼？（答：先 `git fetch upstream`，再 `git checkout main` 並 `git merge upstream/main`，讓本機 `main` 與上游同步。）

## 原文與延伸資源

- 原文：[Using Git in the Real World](https://www.theodinproject.com/lessons/javascript-using-git-in-the-real-world)
- 本課引用：
    - [Conventional Commits 1.0.0 規範](https://www.conventionalcommits.org/en/v1.0.0/)
    - [GitHub Docs：Syncing a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)
    - [TheOdinProject/curriculum 貢獻指南](https://github.com/TheOdinProject/curriculum/blob/main/CONTRIBUTING.md)

---

> 本講義改寫自 The Odin Project《Using Git in the Real World》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
