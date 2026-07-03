---
title: 重訪剪刀石頭布（加上介面）
source_url: https://www.theodinproject.com/lessons/foundations-revisiting-rock-paper-scissors
source_file: vendor/curriculum/foundations/javascript_basics/revisiting_rock_paper_scissors.md
path: foundations
course: Foundations
order: 42
status: draft
generated: 2026-07-03
---

# 重訪剪刀石頭布（加上介面）

> 改寫自 The Odin Project：[Revisiting Rock Paper Scissors](https://www.theodinproject.com/lessons/foundations-revisiting-rock-paper-scissors)
> ｜Foundations › JavaScript Basics

## 核心概念

你先前寫過一版純靠 `prompt()` 與 `console.log()` 運作的剪刀石頭布。現在既然學會了操作 DOM（Document Object Model，文件物件模型），是時候回頭替它加上一個真正能點按的 UI（User Interface，使用者介面）：玩家不再打字，而是按按鈕；結果不再印在 console，而是顯示在畫面上。

這一課其實藏了兩個主題。第一個是 Git 的 **branching（分支）**——一種讓你安全地大改程式、又不怕弄壞現有版本的機制。第二個才是把 UI 接上你原本的遊戲邏輯。knowledge check 四題全部問 branch，所以我們先把 branch 講透，再談改介面。

### 為什麼動手改之前要先開分支

想像你手上這版剪刀石頭布已經能跑、已經 commit 進歷史了。現在你要動一場大手術：拆掉「玩五回合」的迴圈、加按鈕、把所有 `console.log` 換成 DOM 操作。改到一半程式一定會處於「壞掉」的中間狀態。如果你就在原本的地方硬改，一旦改砸了、又想回到那個「能跑的版本」，會很麻煩。

branch 就是為此而生。它讓同一個 repository（儲存庫）同時保有多個「平行時空」版本的檔案。你可以把大改動全部關在一條專門的分支裡，主線完全不受影響；改成功了再合併回來，改失敗了整條丟掉也不心疼。

### branch 到底是什麼

先破除一個常見的誤解：branch **不是**你檔案的一份複製。

在 Git 裡，每一次 commit 都是專案在那個時間點的一張 **snapshot（快照）**，而且每個 commit 都記得自己的 parent（上一個 commit）是誰，於是所有 commit 串成一條有方向的鏈。**一條 branch 只是一個「指向某個 commit 的輕量、可移動的指標」**——它本質上就是一個記著某個 commit 代號的小標籤。正因如此，開一條新分支幾乎不佔空間、也幾乎瞬間完成：Git 只是多寫一個指標，不是把整個專案抄一份。

其實你從第一次 commit 起就一直在用分支了，只是沒察覺。當初在設定 Git 那課執行 `git config --global init.defaultBranch main`，就是把「第一次 commit 時自動建立的那條預設分支」命名為 `main`（這是目前的業界慣例）。

還有一個關鍵角色叫 **HEAD**。HEAD 是一個特殊指標，指著「你現在人在哪條分支上」。當你切換分支，HEAD 就跟著移動，你的工作目錄（working directory）也會換成那條分支所對應的快照內容。

用樹來比喻很貼切（branch 這個字本來就是「樹枝」）：所有分支都從「主幹」（`main` 分支）或別的分支上長出來。當你在某條分支上做 commit，那些改動**只存在於那條分支**，其他分支維持在你當初分岔出去時的模樣，一動也不動。

這帶來一個很實用的工作模式：把 `main` 當成「只放已完成、確定能正常運作的功能」的乾淨主線；每要做一個新功能，就開一條專屬的 **feature branch（功能分支）**，在那裡放心地又寫又改又 commit，成熟後再併回 `main`。

### 建立與切換分支

三個最常用的指令：

- `git branch <分支名>`：建立一條新分支（但你人還留在原本的分支上）。
- `git checkout <分支名>`：切換到某條既有分支。
- `git checkout -b <分支名>`：用 `-b` 旗標一次搞定「建立並切換過去」，等於前兩步合併。

想看目前有哪些分支，直接下 `git branch`（不接參數）。清單裡你**現在所在**的那條，前面會有一個星號（\*）標記。想回到主線，就跟切換到任何分支一樣：`git checkout main`。

### 合併分支：merge

在 feature branch 上把功能做好、也 commit 完之後，要把這些 commit 帶回 `main`，靠的是 **merge（合併）**。

重點在方向：你要先切到「要被合併進去的那條分支」（也就是目的地），再執行 merge。所以典型流程是先 `git checkout main`，再 `git merge <來源分支名>`——這會把來源分支上你 commit 過的改動，加進你**目前所在**的分支。

下面這張圖示範一條 `develop` 分支被建立、在上面 commit、最後併回 `main` 的過程。從 `main` 上的 `commit2` 分岔出 `develop`，在 `develop` 上做了 `commit1a`、`commit2a`，最後切回 `main` 執行合併：

```text
main:     commit1 ── commit2 ─────────────── merge to main
                        \                    /
develop:                 commit1a ── commit2a
```

merge 大多數時候會順利完成。但如果**同一個檔案的同幾行**被兩條分支各自改過，Git 就無法自作主張決定該留誰的版本，這叫 **merge conflict（合併衝突）**。遇到衝突時，你得先手動解決（決定最終要保留什麼），才能完成合併——解衝突的細節留待後面的課。

### 刪除用不到的分支

功能併進 `main` 後，那條 feature branch 通常就沒用了。留著只會讓分支清單越堆越亂，之後要找想要的分支反而困難。清理指令有兩種：

- `git branch -d <分支名>`：小寫 `-d` 是「安全刪除」，只有在該分支**已經併進** `main` 時才會成功。
- `git branch -D <分支名>`：大寫 `-D` 是「強制刪除」，不管有沒有合併都直接砍掉（改動會遺失，要確定不要了才用）。

### 分支的另一個用途：分享半成品程式

除了「隔離功能開發」，branch 還有一個很棒的用途：**分享你不想（或還不該）進主線的程式**。

舉個常見情境：你正在做的新功能有個 bug 怎麼都查不出來，程式因此壞掉。你不會想把這段壞掉的程式 commit 進去、留在專案的「永久紀錄」裡。這時可以另外開一條臨時分支，切過去、把壞掉的程式 commit 在那條分支上，再用 `git push origin <臨時分支名>` 推到 GitHub，就能把它分享給可能幫得上忙的人一起看，而完全不弄髒你的 `main` 或正式的 feature branch。

這也帶出一個重點：**新分支預設只存在你本機**。剛用 `git checkout -b` 開好的分支，遠端的 GitHub 上還看不到——你得用 `git push origin <分支名>` 把它推上去，遠端才會多出這條分支。之後在這條分支上推東西，指令也從 `git push origin main` 改成 `git push origin <分支名>`，其餘操作跟在 `main` 上完全一樣。

### 把 UI 接上遊戲：從 prompt 到按鈕

分支開好、切過去之後，才是真正動手改介面。核心的思路轉變是：**輸入從「打字」變成「點按鈕」，輸出從「印到 console」變成「寫進畫面」**。

原本那版遊戲用一個迴圈固定跑五回合、每回合用 `prompt()` 問玩家。有了 UI，這個節奏完全不對了——玩家是「隨時按一下按鈕、就打一回合」，回合由點擊事件驅動，而不是由迴圈驅動。所以第一步就是**移除「剛好玩五回合」的那段迴圈邏輯**，把 `playRound` 從迴圈裡解放出來，改成「每次按鈕被點時呼叫一次」。

接下來替三種出拳各做一個 `<button>`，然後用你剛學的 `addEventListener` 幫每顆按鈕綁上 `"click"` 事件：被點時，就用對應的 `playerSelection`（例如按「石頭」就傳 `"rock"`）去呼叫 `playRound`。`addEventListener` 的用法是 `element.addEventListener(type, listener)`：第一個參數是事件字串（這裡是 `"click"`），第二個是被觸發時要跑的 callback（回呼函式）。

輸出端，先在 HTML 放一個 `<div>` 當「結果顯示區」，再把原本所有的 `console.log` 一律換成 DOM 操作（例如設定某個元素的 `textContent`）。這樣每回合的勝負、以及即時比分，就會直接顯示在網頁上。

最後補上遊戲流程：維護雙方的 **running score（即時比分）**，每回合更新並顯示；一旦有一方先達到 5 分，就宣布贏家、遊戲結束。你多半會需要 **refactor（重構）**——重寫一部分原本的程式才接得上這套新流程。這很正常，重寫舊碼是每個工程師的日常。

### 完成後：把分支併回並清理

UI 都做好、也確認一切滿意後，先用 `git status` 確定 `rps-ui` 分支上的改動全部都已 commit。接著走一遍完整的合併收尾：切回 `main`、把 `rps-ui` 併進來、推上遠端，最後刪掉本機與遠端那條已經不需要的分支。下面的「程式碼範例」與「練習」會把每個指令逐步列出。

## 程式碼範例

```js
// ── 把「玩五回合的迴圈」改成「按鈕驅動」──

// playRound 保持你原本的勝負判斷邏輯，只是不再從迴圈裡呼叫
function playRound(playerSelection, computerSelection) {
  // 統一大小寫，避免 "Rock" 與 "rock" 被當成不同
  const player = playerSelection.toLowerCase();
  // ...你原本判斷輸贏的邏輯，回傳勝負結果...
}

// 選出三顆出拳按鈕
const buttons = document.querySelectorAll(".choice"); // <button class="choice">
const resultDiv = document.querySelector("#result");  // 顯示結果的區塊

let playerScore = 0;
let computerScore = 0;

// 幫每顆按鈕綁上 click 事件
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    // button 的資料屬性帶著這顆按鈕代表的出拳，例如 data-choice="rock"
    const playerSelection = button.dataset.choice;
    const computerSelection = getComputerChoice(); // 你原本的隨機出拳函式

    playRound(playerSelection, computerSelection);

    // 把結果「寫進畫面」，取代原本的 console.log
    resultDiv.textContent = `目前比分：你 ${playerScore} － 電腦 ${computerScore}`;

    // 有人先到 5 分就結束遊戲
    if (playerScore === 5 || computerScore === 5) {
      const winner = playerScore === 5 ? "你贏了！" : "電腦贏了！";
      resultDiv.textContent = winner;
      // 分出勝負後，讓按鈕失效，避免繼續加分
      buttons.forEach((b) => (b.disabled = true));
    }
  });
});
```

```bash
# ── 這一課用到的 Git 分支指令 ──

git checkout -b rps-ui        # 建立 rps-ui 分支並切換過去
git push origin rps-ui        # 把新分支推到遠端 GitHub
git branch                    # 查看分支清單（現所在分支前面有 *）

# ...在 rps-ui 上反覆 add / commit / push origin rps-ui...

git checkout main             # 先切到「要被合併進去」的分支
git merge rps-ui              # 把 rps-ui 的 commit 併進 main
git push origin main          # 把 main 推上遠端

git branch -d rps-ui          # 刪除本機分支（已合併才會成功）
git push origin --delete rps-ui  # 刪除遠端分支
```

## 常見陷阱

!!! warning "merge 的方向搞反"
    合併時要先切到「目的地」分支再 merge。想把 `rps-ui` 併進 `main`，正確順序是先 `git checkout main`，**再** `git merge rps-ui`。如果反過來在 `rps-ui` 上 `git merge main`，你只是把 main 的東西拉進 rps-ui，主線並沒有拿到你的新功能。

!!! warning "以為開了分支遠端就有"
    `git checkout -b rps-ui` 只在你**本機**建立分支，GitHub 上還看不到它。第一次要用 `git push origin rps-ui` 才會把分支推上遠端；之後在這條分支推東西也要用 `git push origin rps-ui`，別再習慣性打 `git push origin main`。

!!! warning "忘了先拆掉五回合迴圈"
    加了按鈕卻沒移除原本「跑五回合」的迴圈，會導致事件驅動和迴圈驅動兩套流程打架。改 UI 的第一步就是把固定五回合的迴圈拿掉，讓每次點擊各打一回合。

!!! warning "-d 刪不掉就改用 -D 之前先想清楚"
    小寫 `-d` 只在分支已併入時才允許刪除，這是保護機制。若因為分支還沒合併而刪不掉，別急著換大寫 `-D` 硬刪——先確認那些 commit 你真的不要了，因為 `-D` 會直接丟失未合併的改動。

## 練習

先熱身，再動手替遊戲加 UI。

1. **練習分支操作**：打開 Peter Cottle 的互動式 Git 分支視覺化工具 Learn Git Branching，只需完成「Introduction Sequence」的第 1 到 3 關，體會 branch 與 merge 怎麼移動指標。
2. **在既有的剪刀石頭布 repo 開新分支**：
   1. 執行 `git checkout -b rps-ui`，建立並切到 `rps-ui` 分支。
   2. 用 `git push origin rps-ui` 把新分支推到遠端，回 GitHub 頁面用分支下拉選單確認多了一條分支。
   3. 用 `git branch` 確認自己人在 `rps-ui`（前面有 \*）；若不在，用 `git checkout rps-ui` 切回去。
3. **把遊戲改成用按鈕玩**：
   1. 先移除「剛好玩五回合」的迴圈邏輯。
   2. 做三顆按鈕（各代表一種出拳），用 `addEventListener` 綁 `"click"`，被點時以正確的 `playerSelection` 呼叫 `playRound`（這步可以先保留 `console.log`）。
   3. 在 HTML 加一個 `<div>` 當結果顯示區，把所有 `console.log` 換成 DOM 操作。
   4. 顯示即時比分，並在任一方先達到 5 分時宣布贏家、結束遊戲。
   5. 需要時大方地重構原本的程式，讓它接得上這套新流程。
4. **確認改動都已提交**：收尾前用 `git status` 確保 `rps-ui` 上所有改動都 commit 了。
5. **把功能併回 main 並清理**：
   1. `git checkout main` 切回主線。
   2. `git merge rps-ui` 把功能併進 `main`，可用 `git log` 看到 feature branch 的 commit 疊在 main 之上。
   3. `git push origin main` 推上遠端，讓 GitHub 的 `main` 也拿到全部改動。
   4. `git branch -d rps-ui` 刪本機分支、`git push origin --delete rps-ui` 刪遠端分支，完成清理。
6. **發佈**：把專案發佈到 GitHub Pages，並在專案課頁加上線上預覽連結。

## 原文與延伸資源

- 原文：[Revisiting Rock Paper Scissors](https://www.theodinproject.com/lessons/foundations-revisiting-rock-paper-scissors)
- 本課引用：
  - [Learn Git Branching](https://learngitbranching.js.org/)（Peter Cottle）——互動式練習 branch 與 merge，作業要求完成 Introduction Sequence 第 1–3 關。
  - [Pro Git：Branches in a Nutshell](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)——branch 是「指向 commit 的輕量指標」與 HEAD 的權威說明。
  - [MDN：EventTarget.addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)——替按鈕綁 `"click"` 事件的用法與 event 物件。

---

> 本講義改寫自 The Odin Project《Revisiting Rock Paper Scissors》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
