---
title: 深入認識 Git
source_url: https://www.theodinproject.com/lessons/javascript-a-deeper-look-at-git
source_file: vendor/curriculum/git/intermediate_git/a_deeper_look_at_git.md
path: full-stack-javascript
course: JavaScript
order: 37
status: draft
generated: 2026-07-03
---

# 深入認識 Git

> 改寫自 The Odin Project：[A Deeper Look at Git](https://www.theodinproject.com/lessons/javascript-a-deeper-look-at-git)
> ｜Full Stack JavaScript › JavaScript › Intermediate Git

## 核心概念

到目前為止，你使用 Git 大概都停留在 `git add`、`git commit`、`git push` 這幾個指令。它們就像是超強版的「存檔」按鈕，也讓多人協作變得順暢。Git 的指令其實不多，真正的困難往往在於「看不見 Git 在做什麼」。這一課的目標，就是幫你把 Git 底層發生的事「視覺化」，深入三個主題：改寫歷史（changing history）、指標（pointer）、以及在遠端（remote）情境下改寫歷史的風險。

在專案越來越複雜之後，一套有紀律的 Git 工作流程就不再是加分項，而是必備能力。理解底層之後，你會更有信心去修改自己的提交（commit）歷史。

### 改寫歷史：修正最近一次提交

假設你已經會寫清楚的 commit 訊息、也會用分支（branch）維持良好流程，但人總會出錯：可能太早提交、漏加了某個檔案，或是 commit 訊息打錯字、漏掉關鍵資訊。Git 提供了好幾種改寫「近期」與「久遠」歷史的方法。

最常見的情境是「剛剛那個 commit 忘了加檔案，或訊息打錯」。這時用 `git commit --amend`：

```bash
git add forgotten-file.md
git commit --amend
```

它做了兩件事：先把漏掉的檔案更新進 staging area（暫存區），再用「一個全新的 commit」取代最後那個 commit。如果你在編輯器裡順手改了訊息，新的訊息也會覆蓋掉舊的。

這裡有一個關鍵觀念，也是本課反覆強調的原則：**`--amend` 不是「編輯」最後一個 commit，而是用一個全新的 commit 把它整個替換掉。** 因此只能對「還沒 push 到任何地方」的 commit 使用 `--amend`。一旦別人已經根據原本那個 commit 開始工作，你把它換掉就會摧毀他們工作的基礎。

### 改寫更早的提交：interactive rebase

如果要修改的 commit 在更前面，就要用 `git rebase`。`git rebase -i`（interactive，互動式）能讓 Git 在你指定的每個 commit 後停下來，讓你逐一修改。你要告訴它「要編輯到哪一個 commit 為止」，例如 `git rebase -i HEAD~2` 代表要處理最近的兩個 commit：

```bash
git log
git rebase -i HEAD~2
```

打開互動介面後你會發現一件有趣的事：commit 的排列順序和 `git log` 剛好相反 —— `git log` 是最新的在最上面，而 rebase 介面裡最舊的在最上面。介面裡每一行前面都有一個指令關鍵字，預設是 `pick`。你可以：

- 把 `pick` 改成 `edit`，代表要停下來編輯這個 commit。
- 直接把某一行刪掉，代表移除該 commit。
- 調整某行的位置，代表重新排序 commit。

舉例來說，若第二個 commit 訊息打錯成 `Create send file`（本來想寫 second），把它那一行的 `pick` 改成 `edit`：

```bash
edit eacf39d Create send file
pick 92ad0af Create third file and create fourth file
```

存檔離開後，Git 會停在那個 commit，讓你用 `git commit --amend` 修正訊息，改完再用 `git rebase --continue` 完成整個 rebase：

```bash
git commit --amend
git rebase --continue
```

再跑一次 `git log` 就能看到歷史被改過了。這個工具很強，但誤用同樣危險。原則不變：**如果要在共享 repository 上 rebase，必須有充分理由，而且同事都知情。**

### 壓縮提交：squash

`squash`（壓縮）是把多個 commit 合併成一個，讓歷史更整潔的好方法。在某些團隊這甚至是標準流程。想像一個 feature branch 開發過程中產生了一堆瑣碎 commit，合併回 main 之後，log 會變得又長又雜。這些 commit 在開發當下有意義，但對閱讀整條 main 歷史的人來說是雜訊。

假設要把第二個 commit 壓進第一個（`Create first file`）。先一路 rebase 到最初的 root commit：`git rebase -i --root`。然後把要「被合併進去」的那個 commit 的 `pick` 改成 `squash`：

```bash
pick e30ff48 Create first file
squash 92aa6f3 Create second file
pick 05e5413 Create third file and create fourth file
```

`squash` 的意思是「把這個 commit 併入它上面那一個」。存檔後編輯器會顯示被合併的那幾個 commit 的訊息，你可以把它整理成一句，例如 `Create first and second file`，存檔關閉後就完成。`git log` 會看到前兩個 commit 已經合而為一。

### 拆分提交與 git reset

反過來，如果一個 commit 描述了太多事（例如 `Create third file and create fourth file`），你可能想把它拆成兩個更小的 commit。這要靠互動式 rebase 搭配一個重要指令 `git reset`。

先用 rebase 把那個 commit 標成 `edit`，Git 停下來之後執行：

```bash
git reset HEAD~
git add test3.md && git commit -m 'Create third file'
git add test4.md && git commit -m 'Create fourth file'
```

`git reset HEAD~` 把目前分支「往回移一格」，指向 HEAD 前一個 commit。同時它也把 index（暫存區）重設成那個 commit 的內容，於是原本擠在一起的兩個檔案又回到「未提交」狀態，你就能分別 `add`、分別 `commit`。

### git reset 與三棵樹

要真正理解 `reset`，得先認識 Git 內部的「三棵樹」（three trees），這是理解本課的關鍵：

- **HEAD**：最後一次 commit 的快照，也是下一次 commit 的父節點。
- **Index / staging area（暫存區）**：你「提議的下一個 commit」，`git add` 就是把東西放進這裡。
- **Working directory（工作目錄）**：你實際編輯檔案的沙盒。

`git reset` 會依序做最多三個步驟，並依你給的模式決定「做到哪一步就停」：

- **`--soft`**：只做第一步 —— 移動分支指向的 commit。index 與工作目錄都不動。效果是「撤銷 commit，但改動仍然全部是 staged 狀態，隨時可重新提交」。你可以把 `--soft` 想成「更強大的 `--amend`」：不只改最後一個 commit，還能一次退回好幾個 commit，把它們的改動合併成一個新 commit。
- **`--mixed`（預設）**：做到第二步 —— 移動 commit，並把 index 重設成 HEAD。工作目錄不動。效果是「撤銷 commit，改動被 unstage，但檔案內容還在」。前面拆分 commit 用的 `git reset HEAD~` 就是這個模式。
- **`--hard`**：三步全做 —— 移動 commit、重設 index，**還會覆寫工作目錄**讓它跟 index 一致。這是唯一會「摧毀資料」的模式：所有未提交的改動都會消失。

`--hard` 和 `--amend` 一樣是會覆寫歷史的破壞性指令。這不代表在團隊裡完全不能用，但你必須非常清楚自己為什麼用，而且同事也知道你在做什麼、為什麼這樣做。

### 分支是指標

本課最後一個進階觀念是「指標」。你可能以為一個 branch 是「一群 commit 的集合」，其實不是。**一個 branch 只是一個指向「單一 commit」的指標（pointer）。**

你也許會問：「如果 branch 只是一根手指指著單一 commit，那這個 commit 怎麼知道它前面所有的 commit？」答案很簡單：**每個 commit 本身也是一個指標，指向它前一個 commit。** commit 是一張快照（snapshot）—— 每次你 `git commit`，電腦就把所有被 `git add` 進暫存區的檔案內容拍照存下來，等於複製了整個被追蹤的工作區。而這張快照同時記住「上一張快照是誰」。

回頭看 `git rebase -i HEAD~2` 就懂了：Git 怎麼知道是哪兩個 commit？它從 `HEAD` 出發（`HEAD` 是一個特殊指標，記錄你目前在哪個分支、指向該分支最新的 commit），順著這個 commit 的指標找到前一個 commit，這樣就湊齊了兩個。

一句話總結：**branch 是指向單一 commit 的指標；commit 是一張快照，同時也是指向它前一個 commit 的指標。** 整條歷史就是這樣一環扣一環串起來的。

### 改寫歷史的黃金守則

git-scm 對 rebase 有一條著名的黃金守則（golden rule）：**不要對「已經離開你本機、別人可能已經基於它工作」的 commit 進行 rebase。** rebase 會產生取代舊 commit 的新 commit；已經拉過舊 commit 的同事，他們的歷史就會和你的分岔，之後合併會變得一團亂，共享歷史還會出現重複的 commit。

最佳實務是：**在 push 之前，盡量用 rebase 把本機的 commit 整理乾淨；一旦 push 到共享 repository，就不要再 rebase。** 這樣既能享受乾淨線性的歷史，又不會破壞協作。

## 程式碼範例

以下是一段可以實際照著跑的「Git 練習場」流程。先在 GitHub 建一個新 repo、clone 到本機、`cd` 進去，然後：

```bash
# 一次建立 4 個空檔案（brace expansion 會展開成 test1.md ~ test4.md）
touch test{1..4}.md

# 刻意製造 3 個 commit，其中第二個訊息打錯（send 應為 second），第三個描述太多
git add test1.md && git commit -m 'Create first file'
git add test2.md && git commit -m 'Create send file'
git add test3.md && git commit -m 'Create third file and create fourth file'

# 情境一：忘了加 test4.md，用 --amend 補進最後一個 commit
git add test4.md
git commit --amend                 # 存檔關閉即可，順手也能改訊息

# 情境二：修正更早的錯字訊息
git rebase -i HEAD~2               # 把 'Create send file' 那行 pick 改成 edit
git commit --amend                 # 停在該 commit 時改訊息為 'Create second file'
git rebase --continue             # 完成 rebase

# 情境三：把第 3、4 個檔案拆成兩個獨立 commit
git rebase -i HEAD~1              # 把該行改成 edit，Git 會停在這個 commit
git reset HEAD~                     # --mixed（預設）：退一格並清空暫存區
git add test3.md && git commit -m 'Create third file'
git add test4.md && git commit -m 'Create fourth file'
git rebase --continue

# 隨時用 log 觀察歷史變化
git log --oneline
```

> 說明：`git rebase -i HEAD~2` 的介面裡，commit 由舊到新排列，和 `git log`（新到舊）相反，別看反了。

## 常見陷阱

!!! warning "只 amend 尚未 push 的 commit"
    `git commit --amend` 不是編輯舊 commit，而是「產生一個全新 commit 取代它」。如果那個 commit 已經 push 出去、別人已基於它工作，你一改就摧毀了他們的基礎。同理適用於 `rebase` 與 `reset --hard`：這些都是改寫歷史的破壞性操作，在共享 repository 上動手前，務必有正當理由且同事知情。

!!! warning "git reset --hard 會真的刪掉未提交的改動"
    只有 `--hard` 會覆寫工作目錄，把你尚未 commit 的檔案改動一併清掉，且難以復原。搞不清楚模式時，預設的 `--mixed` 或更安全的 `--soft` 都不會動到工作目錄；真的要用 `--hard` 前，先確認你不需要那些改動。萬一誤刪，`git reflog` 有機會找回遺失的 commit。

!!! warning "rebase 介面的順序與 log 相反"
    `git rebase -i` 裡最舊的 commit 在最上面，`git log` 則是最新的在最上面。把 `pick` 改成 `edit`/`squash`、或調整行的順序時，先看清楚每一行對應的是哪個 commit，別把要改的目標搞錯。另外，教材範例的 hash 與訊息（如 `eacf39d`）是示意用的，直接複製貼上不會有效，要用你自己 repo 裡實際的內容。

!!! warning "設定好 commit 訊息編輯器"
    `git commit --amend` 與 `git rebase -i` 都會開啟文字編輯器。若沒設定好，Git 預設可能開在 CLI 內建編輯器，讓你不知道怎麼存檔離開而卡住。請先依 Git Basics 課程的說明把編輯器設成你慣用的（例如 VS Code），再來做這些操作。

## 練習

1. 不論你在 Revisiting Rock Paper Scissors 之後有沒有常用分支，先回頭複習分支的基本用法：基本上就是用 `git branch <name>` 建立、`git checkout`/`git switch` 切換、在 feature branch 上開發完再合併回 main。搭配 git-scm 的 Basic Branching and Merging 章節能建立扎實的心智模型。
2. 閱讀 git-scm 的 Rebasing 章節，深入理解 rebase 如何把一連串 commit「重播」到另一個基底上、與 merge 的差異（rebase 產生線性歷史、merge 保留平行分支與 merge commit），以及黃金守則的細節。
3. 閱讀 git-scm 的 Reset Demystified 章節，用「三棵樹」的框架徹底搞懂 `git reset` 的 `--soft`／`--mixed`／`--hard`，以及帶檔案路徑時（`git reset <file>`）為何等同「取消 `git add`」。
4. 動手做本課的「Git 練習場」：建一個丟棄用的 repo，把上面「程式碼範例」的三個情境全部跑過一遍，每步都用 `git log --oneline` 觀察歷史怎麼變。

## 原文與延伸資源

- 原文：[A Deeper Look at Git](https://www.theodinproject.com/lessons/javascript-a-deeper-look-at-git)
- 本課引用：
  - [Basic Branching and Merging（git-scm）](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
  - [Rebasing（git-scm）](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)
  - [Reset Demystified（git-scm）](https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified)

---

> 本講義改寫自 The Odin Project《A Deeper Look at Git》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
