---
title: Git 基礎
source_url: https://www.theodinproject.com/lessons/foundations-git-basics
source_file: vendor/curriculum/git/foundations_git/git_basics.md
path: foundations
course: Foundations
order: 12
generated: 2026-07-03
---

# Git 基礎

> 改寫自 The Odin Project：[Git Basics](https://www.theodinproject.com/lessons/foundations-git-basics)
> ｜Foundations › Git Basics

## 核心概念

### 什麼是「基本 Git 工作流」

Git 是一套 version control system（版本控制系統），它負責記錄你的專案在每個時間點的狀態，讓你可以隨時回顧、比對、甚至回到過去的版本。GitHub 則是一個把 Git repository（儲存庫）放到雲端的平台，方便你備份程式碼、與他人協作，也讓別人（例如未來的雇主）看見你的作品。

本課要學的，是一組每天都會用到的常見指令，它們合起來稱為 **basic Git workflow（基本 Git 工作流）**。實際寫程式時，你有七、八成的時間都在重複這幾個指令。把它們練熟，你就掌握了 Git 的大半功力。這一課要達成的三件事很單純：在 GitHub 上建立一個 repository、在本機與 GitHub 之間傳送檔案、以及為你的程式碼拍下一張又一張「快照（snapshot）」。

### repository、clone 與 remote

一個 repository（常簡稱 repo）就是「被 Git 追蹤的專案資料夾」。它可以存在你的本機，也可以存在 GitHub 上。當你在 GitHub 建好一個 repo 後，要把它「複製」一份到自己的電腦上工作，這個動作叫 **clone（克隆）**，用 `git clone` 加上該 repo 的網址即可。

clone 之後，本機這份 repo 會記得它是從哪裡來的，這個「來源」就叫 **remote（遠端）**。remote 只是「另一台電腦上的 repo 位址」的代稱。Git 預設、也是慣例，會把你 clone 的那個 remote 命名為 **origin**。所以之後你在指令裡看到 `origin`，指的就是「GitHub 上那份原始 repo」。你可以用 `git remote -v` 查看目前的 remote 有哪些、指向哪個網址，輸出會列出 fetch（抓取）與 push（推送）兩行位址。

要特別提醒：clone 時 GitHub 會提供 HTTPS 與 SSH 兩種網址，本課要用 **SSH**（形如 `git@github.com:USER-NAME/REPO.git`）。若你誤用 HTTPS（形如 `https://github.com/...`），之後 push 時會因為 GitHub 已在 2021 年停用密碼認證而失敗。

### 兩階段存檔：staging area 與 commit

Git 最核心、也最容易讓新手困惑的觀念，是它用**兩個步驟**來保存你的改動。

第一步是把改動放進 **staging area（暫存區）**，指令是 `git add`。你可以把暫存區想成一間「等候室」：你先挑選哪些改動要被記錄，讓它們在等候室裡等著，還沒真正存檔。

第二步才是 **commit（提交）**，指令是 `git commit`。commit 會把暫存區裡的所有改動打包成一張「快照」，正式寫進版本歷史。每一次 commit 都要附上一則訊息（用 `-m` 旗標），簡短描述這次改了什麼。

為什麼要多此一舉、分成兩步？因為這讓你能**精挑細選**：你可能一次改了三個檔案，但只想把其中兩個相關的改動打包成一次 commit，暫存區就給了你這個彈性。

### 用 git status 觀察檔案的三種狀態

`git status` 是你在工作流裡最常敲的指令，它告訴你「現在 repo 處於什麼狀態」。搭配它的輸出，你可以看出檔案正處於哪一種狀態：

- **Untracked files（未追蹤）**：全新的、Git 從沒記錄過的檔案，會以紅色顯示。
- **Changes not staged for commit（已修改但未暫存）**：Git 已經在追蹤、但你剛改動、還沒 `git add` 的檔案，同樣以紅色顯示。
- **Changes to be committed（已暫存、待提交）**：你已經 `git add` 進暫存區、正等著被 commit 的檔案，會以綠色顯示。

當你 commit 完、且沒有任何新改動時，`git status` 會顯示「nothing to commit, working tree clean」，代表工作目錄乾淨、所有東西都存好了。

### 用 git log 回顧歷史，用 git push 上傳

每做一次 commit，就等於在時間軸上留下一個節點。`git log` 會把這條時間軸列出來，顯示每一則 commit 的訊息、作者、以及提交的日期時間。如果 `git log` 讓終端機卡在底部標著 `(END)` 的畫面，按 `q` 就能離開。

本機的 commit 只存在你的電腦上。要把它們同步到 GitHub，就用 **push（推送）**：`git push` 或更明確地 `git push origin main`。這兩者在本課情境下效果相同——因為你只有一個 remote（origin）、也只在一個 branch（分支，即 main）上工作，所以可以省略後面兩個字，直接打 `git push`。push 之後，`git status` 會顯示「Your branch is up to date with 'origin/main'」，代表本機與 GitHub 已經同步。

順帶一提，若 commit 之後 `git status` 出現「Your branch is ahead of 'origin/main' by 1 commit」，別緊張，這只是在說「你本機的快照比 GitHub 上的新，記得找時間 push 上去」。

### main 分支與指令的閱讀方式

`git push origin main` 裡的 `main`，指的是你要推送的 **branch（分支）**。branch 是 Git 用來平行開發的機制，本課只用到預設的 main 分支，更深入的分支操作留待後續課程。GitHub 近期把預設分支從舊名 `master` 改為 `main`，所以請確認你的 Git 版本夠新（2.28 以上，用 `git --version` 查），並把本機預設分支設為 main。

最後一個好用的心法，是 Git 指令的基本語法可以拆成三段來讀：`程式 | 動作 | 目標`。例如 `git add .` 讀作「git（程式）｜add（動作）｜.（目標，代表當前目錄所有東西）」；`git commit -m "訊息"` 讀作「git｜commit -m｜訊息」；而 `git status` 則是「git｜status｜（無目標）」。用這個方式拆解，任何 Git 指令看起來都不再神秘。

## 程式碼範例

下面是一次完整的基本工作流示範，從 clone 到 push：

```bash
# 從 GitHub 把 repo 克隆到本機（務必用 SSH 網址）
git clone git@github.com:USER-NAME/git_test.git

# 進入 repo，查看遠端連線
cd git_test
git remote -v
# origin  git@github.com:USER-NAME/git_test.git (fetch)
# origin  git@github.com:USER-NAME/git_test.git (push)

# 新增一個檔案
touch hello_world.txt

# 查看狀態：hello_world.txt 會出現在 "Untracked files"（紅字）
git status

# 把檔案加入暫存區
git add hello_world.txt

# 再看狀態：檔案變成 "Changes to be committed"（綠字）
git status

# 提交，並附上描述訊息
git commit -m "Add hello_world.txt"

# 查看提交歷史
git log

# 把本機的 commit 推送到 GitHub
git push
```

常用速查表（值得記熟）：

```bash
# 與遠端 repo 相關
git clone git@github.com:USER-NAME/REPOSITORY-NAME.git
git push                 # 等同 git push origin main（本課情境下）

# 與工作流相關
git add .                # 把當前目錄與所有子目錄的改動全部加入暫存區
git commit -m "描述這次快照做了什麼改動的訊息"

# 與狀態／歷史相關
git status
git log
```

如果你不想每次都用 `-m` 旗標寫訊息，可以把 commit 的預設編輯器改成 VS Code，這樣單獨打 `git commit` 時就會開一個 VS Code 分頁讓你寫訊息，而不是卡在 Vim：

```bash
git config --global core.editor "code --wait"
```

設定後打 `git commit`（不加 `-m`），VS Code 會開新分頁，寫好訊息後存檔（Ctrl/Cmd + S）並關掉分頁，Git 就會完成這次提交。

## 常見陷阱

!!! warning "clone 時務必選 SSH，不要選 HTTPS"
    在 GitHub 的綠色「Code」按鈕裡，clone 網址分成 HTTPS 與 SSH 兩種。本課一定要選 **SSH**（形如 `git@github.com:...`）。如果你不小心複製了 HTTPS 網址（形如 `https://github.com/...`），前面幾步可能都正常，但到 `git push` 時會跳出「Support for password authentication was removed on August 13, 2021」的錯誤。此時代表你 clone 錯了，需要依 GitHub 文件把 remote 從 HTTPS 切換成 SSH 才能繼續。

!!! warning "不要直接在 GitHub 網頁上改檔案"
    當你只是想順手修個 README 的錯字時，很容易被 GitHub 網頁介面的「線上編輯」誘惑。但現階段請避免這麼做——直接在網頁改檔會讓你的本機與遠端版本出現分歧，衍生出需要更進階 Git 知識才能處理的問題（後續課程才會教）。目前的正確做法一律是：改本機檔案 → `git add` → `git commit` → `git push`。

!!! warning "atomic commit（原子提交）：一次 commit 只做一件事"
    養成 **atomic commit** 的習慣：讓每一次 commit 只包含「單一功能或單一任務」相關的改動。這麼做有兩個好處：其一，萬一某個改動出問題，你可以乾淨地把那一次 commit 還原，而不會連帶弄丟其他無關的改動；其二，範圍單一的 commit 讓你能寫出更精準、更有用的訊息。把一堆不相干的改動塞進同一次 commit，未來的你（和隊友）會很難追蹤。

## 練習

以下步驟需要你已在前一課建立 GitHub 帳號、並完成 SSH 金鑰設定。開始前，先用 `git --version` 確認版本為 2.28 以上，並執行 `git config --global init.defaultBranch main` 把本機預設分支設為 main。

**一、在 GitHub 建立 repository**

1. 登入 GitHub 首頁，點右上角的「+」按鈕，選「New repository」。（若視窗較窄按鈕被藏起來，改點右上角頭像即可看到。）
2. repository 名稱填 `git_test`，勾選「Add README」選項（會自動幫你建一個 `README.md`），再按底部的「Create repository」。
3. 建好後會跳到該 repo 頁面。點綠色的「Code」按鈕，在「Clone」區塊選 **SSH**，複製底下那行網址。（務必選 SSH。）

**二、clone 到本機**

1. 在本機用命令列先建一個放所有 Odin 專案的資料夾。回到家目錄（`cd ~`，家目錄以 `~` 代表），建立並進入 `repos`：
   ```bash
   mkdir repos
   cd repos/
   ```
2. 用剛剛複製的 SSH 網址把 repo clone 下來：
   ```bash
   git clone git@github.com:USER-NAME/REPOSITORY-NAME.git
   ```
3. 進入資料夾並驗證 remote：
   ```bash
   cd git_test
   git remote -v
   ```
   你應該會看到兩行 `origin ... (fetch)` 與 `origin ... (push)`。

**三、跑一遍工作流**

1. 建立新檔案：`touch hello_world.txt`。
2. `git status`，確認 `hello_world.txt` 出現在紅色的「Untracked files」。
3. `git add hello_world.txt`，再 `git status`，確認檔案變成綠色的「Changes to be committed」。
4. `git commit -m "Add hello_world.txt"`，再 `git status`，應顯示「nothing to commit, working tree clean」。
5. `git log`，你應該看到剛才那則 commit 紀錄。

**四、修改檔案再提交**

1. 用文字編輯器打開 `README.md`（在 repo 內執行 `code .` 可用 VS Code 開整個資料夾；macOS 若提示 `command not found: code`，請回到「Command Line Basics」一課設定）。在 `README.md` 新增一行「Hello Odin!」並存檔。
2. `git status`，`README.md` 會出現在「Changes not staged for commit」。
3. `git add README.md` 後再 `git status`，`README.md` 變綠。
4. 打開 `hello_world.txt` 也加點文字並存檔，然後用 `git add .` 一次把所有改動加入暫存區。
5. `git commit -m "Edit README.md and hello_world.txt"`，再 `git log` 應可看到三則 commit。

**五、push 到 GitHub**

1. `git push`（或更明確的 `git push origin main`）。若跳出密碼認證的錯誤，代表你 clone 時用了 HTTPS，需切換 remote 為 SSH（見上方常見陷阱）。
2. `git status` 應顯示「Your branch is up to date with 'origin/main'」。
3. 回到 GitHub 重新整理 repo 頁面，就能看到剛推上去的 `README.md` 與 `hello_world.txt`。

## 原文與延伸資源

- 原文：[Git Basics](https://www.theodinproject.com/lessons/foundations-git-basics)
- 本課引用：
  - [GitHub 說明：切換 remote 網址（HTTPS → SSH）](https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories#switching-remote-urls-from-https-to-ssh)
  - [GitHub Renaming Repository（master → main 的變更說明）](https://github.com/github/renaming)
  - [Software Carpentry：家目錄的差異說明](https://swcarpentry.github.io/shell-novice/02-filedir.html#home-directory-variation)

---

> 本講義改寫自 The Odin Project《Git Basics》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
