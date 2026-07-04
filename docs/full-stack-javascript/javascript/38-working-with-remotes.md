---
title: 使用遠端（Remotes）
source_url: https://www.theodinproject.com/lessons/javascript-working-with-remotes
source_file: vendor/curriculum/git/intermediate_git/working_with_remotes.md
path: full-stack-javascript
course: JavaScript
order: 38
generated: 2026-07-03
---

# 使用遠端（Remotes）

> 改寫自 The Odin Project：[Working with Remotes](https://www.theodinproject.com/lessons/javascript-working-with-remotes)
> ｜Full Stack JavaScript › JavaScript › Intermediate Git

## 核心概念

到目前為止，你每次在做 TOP 的專案時，`git push` 或 `git pull` 其實都已經在跟「遠端儲存庫（remote repository）」互動了。這一課要把這層互動講得更深入一點：當你「改寫歷史」的操作需要送上遠端時會發生什麼事、有哪些危險、以及該遵守哪些最佳實務。

### 為什麼一般的 push 會被擋下來

先建立一個心智模型。你的本機（local）有一份 commit 歷史，遠端也有一份。當你和別人協作時，兩邊的歷史會各自往前走。Git 對 `git push` 有一條核心規則：**只有在你的推送是「快轉（fast-forward）」時，Git 才會讓你送出去。**

所謂 fast-forward，是指遠端目前的最新 commit，剛好是你本機歷史裡的一個「祖先（ancestor）」——也就是你的歷史完整包含遠端已有的一切，只是在後面多疊了幾個新 commit。這種情況下遠端指標只要「往前滑」到你的新 commit 即可，不會弄丟任何東西。

但如果在你動手期間，別人已經先 push 了新的 commit 到遠端，那麼遠端的最新 commit 就不再是你本機歷史的祖先了。此時你若硬要 push，Git 會回一個錯誤，通常長這樣：

```text
! [rejected]        main -> main (fetch first)
error: failed to push some refs to ...
hint: Updates were rejected because the remote contains work that you do not have locally.
```

**這個錯誤是好事，不是壞事。** 它是一道安全機制，防止你不小心用自己的歷史覆蓋掉別人剛推上去的 commit（那可能是災難）。你會看到這個錯誤，是因為「你的歷史過時了」。正確的修法很單純：先把遠端的新東西抓回來、合併進本機、再推一次。也就是 `git fetch`（或 `git pull`）之後 `merge`，最後 `git push`。

### `git push --force`：用你的歷史覆蓋遠端

你可能會上網查，然後找到 `git push --force`。這個指令會**無條件地用你本機的歷史覆蓋遠端**，直接繞過上面那道 fast-forward 安全檢查。

它為什麼危險？想像你和同事協作，你本機的歷史比遠端「舊」，因為同事剛推了三個 commit 上去。你沒發現，直接 `git push --force`——遠端指標會被強制拉回到你本機那個較舊的 commit，同事那三個 commit 就從遠端分支上消失了。你等於銷毀了別人的工作成果。

原始教材用一個「自己對自己」的實驗示範這件事的破壞力。假設你先前的專案裡有個「Create fourth file」的 commit，跑以下流程（互動式 rebase 跳出來時，把 `Create fourth file` 那一列刪掉）：

```bash
git push origin main       # 先確保遠端與本機同步
git rebase -i --root       # 互動式 rebase，刪掉「Create fourth file」那一列
git push --force           # 強制把「少了那個 commit」的歷史推上去
git log                    # 看歷史：第四個檔案不見了
```

跑完你會發現本機找不到第四個檔案了，去 GitHub 上看——遠端也沒了。因為 rebase 重寫了本機歷史（那個 commit 被拿掉），而 `--force` 讓遠端照單全收。在只有你一個人的情境下，這只是自食其果；但在協作情境下，被覆蓋掉的可能是別人的 commit。所以務必記住：**`git push --force` 是一個非常危險的指令，跟別人協作時要格外謹慎。**

### 用 `git revert` 取代「reset + 強推」

再看另一個情境。你剛做了一個 commit 並推上去，接著才發現做錯了：

```bash
touch test4.md
git add test4.md && git commit -m "Create fifth file"
git push origin main
git log
```

很自然地，你會想用 `git reset` 把這個 commit 撤掉，然後強推覆蓋遠端。**但先停一下。** 強推是危險指令，每次動念要用它，都應該先問：這裡真的適合嗎？有沒有更安全的替代方案？

在協作情境下，如果你只是想「撤銷剛剛那個 commit」，更安全的做法是 `git revert`。`git reset` 是把歷史往回倒（會改寫歷史，所以需要強推）；`git revert` 則完全相反——它**不刪除任何舊 commit，而是新增一個「反向 commit」**，這個新 commit 的內容剛好抵銷掉你想撤銷的那次改動。因為它是往前疊一個新 commit、而非改寫舊歷史，所以推上去是正常的 fast-forward，**完全不需要強推**：

```bash
git revert HEAD            # 針對目前的 commit（HEAD）產生一個反向 commit
git push origin main       # 正常推送，不必 --force
```

`HEAD` 就是你目前所在的那個 commit。`git revert HEAD` 會把 HEAD 的改動反轉，產生一個新 commit，然後你把它正常推到目前的分支（範例是 `main`，但實務上通常是在 feature branch 上工作）。

### `--force` 什麼時候才該用？`--force-with-lease` 是什麼？

既然這麼危險，為什麼還存在？因為確實有需要重寫「已發布歷史」的場合。最常見的一種是**更新 pull request**：你在自己的 feature branch 上用 rebase 或 amend 整理過 commit 後，遠端那條 branch 的歷史對不上，就得靠強推去更新它。另一種比較少見的場合是——不小心把敏感資訊（密碼、金鑰）推上去了，你需要從歷史裡徹底抹除所有出現的地方。

即使真的要強推，也有一個更安全的版本值得特別提出來：`git push --force-with-lease`。有些公司甚至把它設成預設。它為什麼是「保險絲」？因為它會多做一道檢查：**推送前，先確認遠端分支的目前狀態，是否跟你本機記錄的「遠端追蹤分支（remote-tracking branch）」一致。** 白話說，就是確認「自從你上次 fetch 之後，沒有人偷偷動過遠端」。

- 如果遠端沒被別人更新過 → 允許強推。
- 如果遠端被別人 push 過（跟你以為的狀態不符）→ **拒絕並報錯**，給你一個機會先 `fetch` 把別人的工作抓回來、更新本機，再決定怎麼做。

這正是 `--force` 缺少的那道護欄：純 `--force` 不管遠端變成什麼樣都照蓋，`--force-with-lease` 則會在「你的認知」和「遠端現況」不一致時先攔下來。所以只要有需要強推，**優先用 `--force-with-lease` 而不是 `--force`。**

（補充：更嚴謹的情境下還有 `--force-if-includes`，它進一步確認「背景 fetch 抓下來的遠端更新，你確實已經整併進本機」才放行，避免自動 fetch 更新了追蹤分支後讓 `--force-with-lease` 誤判為安全。一般學習階段先掌握 `--force-with-lease` 即可。）

### 危險操作總整理與最佳實務

回頭看這一整個 Intermediate Git 單元，你會發現一條共同的線索：`commit --amend`、`rebase`、`reset`、`push --force` 這幾個指令，**只要是在跟別人協作時使用，都特別危險**，因為它們都會改寫歷史，可能摧毀同事已經做好的工作。要動手改寫歷史前，先查清楚你用的那個指令的風險，並遵守下列最佳實務：

1. 在團隊專案裡，動手改寫歷史前，先確認這樣做是安全的，而且讓其他人知道你正在改。
2. 理想上，這些指令只用在「只有你一個人在動」的 branch 上。
3. 用 `-f`（force）旗標去強制某件事，這件事本身就應該讓你警覺——你最好有非常充分的理由才用它。
4. 別每提交一個 commit 就推一次；能避免就避免去改動「已發布的歷史」。
5. 針對本單元提過的各個指令：
    1. `git commit --amend`：永遠不要去 amend 已經推到遠端的 commit。
    2. `git rebase`：永遠不要 rebase 別人可能拿去接著工作的儲存庫。
    3. `git reset`：永遠不要 reset 已經推到遠端的 commit。
    4. `git push --force`：只在適當時機使用、務必謹慎，並盡量預設改用 `git push --force-with-lease`。

### 順帶一提：merge conflict（合併衝突）

協作時你遲早會撞到 merge conflict，所以先建立正確認知。Git 大多數時候能自動合併兩條 branch——只要雙方改的是不同檔案、或同一檔案的不同行。**衝突發生在無法自動判斷的情況**：兩個人改了同一檔案的同一行；或一個人改了某檔案、另一個人把它刪了。

在命令列合併遇到衝突時，Git 會回類似 `CONFLICT (content): Merge conflict in styleguide.md` 的訊息，並在檔案裡插入衝突標記：

```text
<<<<<<< HEAD
你這邊（目前分支）的內容
=======
對方那邊（被合併進來的分支）的內容
>>>>>>> feature-branch
```

解法是：手動編輯這個檔案，決定要保留哪一邊（或兩邊都留、或改寫成折衷版本），把 `<<<<<<<`、`=======`、`>>>>>>>` 這三行標記全部刪掉，然後 `git add` 該檔、`git commit` 完成合併。GitHub 網頁介面對「單純的逐行衝突」也提供內建的衝突編輯器，且在所有衝突解決前，「Merge pull request」按鈕會一直是停用狀態。比較複雜、超出逐行競爭的衝突，仍需要回到命令列處理。

## 程式碼範例

下面是一個「本機領先遠端、但想撤銷剛推上去的錯誤 commit」的安全流程，用 revert 取代 reset＋強推：

```bash
# 情境：剛做了一個有問題的 commit 並推上遠端
touch feature.js
git add feature.js
git commit -m "add feature"      # 這個 commit 有問題
git push origin main

# 安全撤銷：不改寫歷史，改用 revert 疊一個反向 commit
git revert HEAD                  # 產生一個抵銷上一個 commit 的新 commit
git push origin main             # 正常 fast-forward 推送，不需要 --force
```

若真的必須強推（例如整理自己 feature branch 的 PR），用帶護欄的版本：

```bash
# 在自己的 feature branch 上整理歷史後需要更新遠端
git rebase -i HEAD~3             # 假設整理最近三個 commit

# 用 --force-with-lease 而非 --force：
# 若遠端在你上次 fetch 後被別人動過，這個指令會直接報錯攔下來
git push --force-with-lease origin my-feature-branch
```

## 常見陷阱

!!! warning "把 `--force` 當成解決「push 被拒」的萬用鑰匙"
    看到 `! [rejected] ... (fetch first)` 就反射性地 `git push --force`，是最危險的習慣。那個錯誤通常代表「遠端有你還沒抓下來的 commit」。正確做法是先 `git fetch`／`git pull` 把別人的工作整併進來，再正常 push。強推會直接抹掉遠端那些你沒看到的 commit。

!!! warning "用 `reset` + 強推去撤銷已發布的 commit"
    `git reset` 會改寫歷史，撤銷已推上遠端的 commit 就得強推，等於在協作分支上製造覆蓋別人工作的風險。要撤銷「已發布」的改動，優先用 `git revert`——它新增反向 commit、不改寫歷史，可以正常推送。

!!! warning "amend / rebase 已經推上遠端的 commit"
    `commit --amend` 和 `rebase` 都會產生「新的、雜湊值不同的」commit 來取代舊的。一旦舊 commit 已經在遠端、別人也可能已經接著它工作，你改寫後再推就會製造分岔與衝突。原則：這兩個指令只在「還沒 push」或「只有你一個人用」的 branch 上使用。

!!! warning "以為 `--force-with-lease` 完全零風險"
    它只保證「遠端沒在你上次 fetch 之後被動過」。如果你的編輯器或某個工具在背景自動幫你 `git fetch` 更新了遠端追蹤分支，`--force-with-lease` 可能誤以為一切同步而放行。要更嚴謹可搭配 `--force-if-includes`。無論如何，強推前先自己確認遠端狀態，別把護欄當免死金牌。

## 練習

以下把原文的 Assignment 改寫成可執行步驟。這兩份資源都值得慢慢讀，能大幅鞏固你對 Git 的理解：

1. 閱讀 GitHub 官方文件〈[About merge conflicts](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/about-merge-conflicts)〉。重點放在文件提到的**兩種解決衝突方式**：在 GitHub 網頁上解、以及在命令列上解。你現在或許還用不到，但把「該去哪裡找解法」記在腦中一角，等你真的撞上 merge conflict 時會非常有價值。
2. 完整讀完〈[Think Like (a) Git](https://think-like-a-git.net/sections/about-this-site.html)〉的所有章節。這份資源寫得很好，能幫你把 Git 底層的心智模型（commit、branch、reachability）建立起來。

延伸：關於協作情境下 reset 與 revert 的差異，原文推薦觀看影片〈[Git Revert vs Git Reset](https://www.youtube.com/watch?v=iIaM7j3tMuk)〉。

### Knowledge check

用自己的話回答，答不出來就回上面對應段落複習：

- **有沒有一種安全的方式，把「改寫過的歷史」強制推到遠端？** 有——用 `git push --force-with-lease`。它會先檢查遠端分支是否在你上次 fetch 後被別人更新過，若有就報錯攔下來，讓你有機會先把別人的工作抓回來，避免覆蓋。
- **改寫歷史的操作有哪些危險？** `commit --amend`、`rebase`、`reset`、`push --force` 都會改寫歷史；在協作時，它們可能摧毀同事已經做好、已經推上遠端的 commit。
- **改寫歷史的最佳實務有哪些？** 團隊裡動手前先確認安全並告知他人；盡量只在自己獨用的 branch 上操作；用 `-f` 前要有充分理由；不要每個 commit 都推、避免改動已發布歷史；amend／reset 不碰已推到遠端的 commit、rebase 不碰別人會接續工作的儲存庫、push --force 謹慎使用並優先用 `--force-with-lease`。

## 原文與延伸資源

- 原文：[Working with Remotes](https://www.theodinproject.com/lessons/javascript-working-with-remotes)
- 本課引用：
    - GitHub Docs — [About merge conflicts](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/about-merge-conflicts)
    - Git 官方文件 — [git push（`--force` 與 `--force-with-lease`）](https://git-scm.com/docs/git-push)
    - [Think Like (a) Git](https://think-like-a-git.net/sections/about-this-site.html)

---

> 本講義改寫自 The Odin Project《Working with Remotes》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
