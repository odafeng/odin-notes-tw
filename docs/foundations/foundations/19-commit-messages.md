---
title: Commit 訊息
source_url: https://www.theodinproject.com/lessons/foundations-commit-messages
source_file: vendor/curriculum/git/foundations_git/commit_messages.md
path: foundations
course: Foundations
order: 19
status: draft
generated: 2026-07-02
---

# Commit 訊息

> 改寫自 The Odin Project：[Commit Messages](https://www.theodinproject.com/lessons/foundations-commit-messages)
> ｜Foundations › HTML Foundations

## 學習目標

讀完這課你應該能：

- 說出「好的 commit（提交）訊息」為什麼重要，並舉出至少兩個實際好處。
- 寫出一則結構良好的 commit 訊息：由 subject（主旨）與 body（內文）兩部分組成，並用空白行隔開。
- 說出 subject 的字數建議，並知道 GitHub 與業界慣例對長度的看法。
- 用 imperative mood（祈使句／命令語氣）撰寫 subject，避免模糊字眼。
- 判斷「什麼時候該 commit」，建立有意義、可回溯的提交歷史。
- 使用 `git commit`（不加 `-m`）在編輯器中撰寫多行訊息。

## 核心概念

### 為什麼 commit 訊息值得一整課

你即將開始第一個會用到 Git（版本控制系統）的專案，而 commit 訊息是你每次存檔進版本歷史時，寫給「未來的人」看的一句話。這個「未來的人」可能是隊友，也可能是三個月後、早已忘記當初思路的你自己。訊息寫得好不好，差別很大：

- **求職加分**：應徵開發職位時，雇主會翻你 GitHub 上的專案，也會翻你的 commit 歷史。一個新手若能寫出清楚的 commit，會比別人更突出。
- **快速定位問題**：當程式出現 bug 需要修正時，一份清楚的歷史能讓你或同事迅速看出「哪些改動、為什麼改」，而不必逐行猜測。
- **喚回記憶**：離開一個專案一段時間後回來，你多半不記得當初為何那樣寫。好的訊息就是你留給自己的筆記。

一份維護良好的提交歷史，還能讓 `git blame`、`git log`、`git rebase` 這類工具發揮真正的威力：你可以精準查到「某一行是哪一次改的、當時為了解決什麼問題」，不必花大把時間重建脈絡。

### 壞 commit vs. 好 commit

先看一個典型的壞例子：

```text
fix a bug
```

它確實描述了「你做了什麼」，但太籠統。修了哪個 bug？為什麼要修？隊友看了只會一頭霧水。好的 commit 訊息會解釋改動背後的 **why（為什麼）**——它要說清楚：你的改動解決了什麼問題、又是怎麼解決的。

一則有效的 commit 訊息由兩個獨立部分組成：**subject（主旨）** 與 **body（內文）**。

- **Subject（主旨）**：對這次改動的簡短摘要，一句話講完「這是我對程式碼做的改動」。
- **Body（內文）**：清楚而精簡地描述你做了什麼、以及為什麼要做。

把前面那個壞例子改寫一下：

```git
Add missing link and alt text to the company's logo

Screen readers won't read the images to users with disabilities
without this information.
```

好多了！這則訊息之所以好，是因為它同時做到三件事：

1. **Subject 說清楚動作**：「Add missing link and alt text to the company's logo」直接點出程式做了什麼。
2. **Body 解釋原因**：「若少了這些資訊，螢幕報讀器（screen reader）就不會把圖片內容讀給視障使用者聽」——這正是這次改動存在的理由。
3. **用空白行隔開 subject 與 body**：這是強烈建議遵守的慣例，能讓訊息在各種工具裡更好讀。

不同團隊可能有自己的 commit 格式慣例，但萬變不離其宗，背後遵循的原則都和本課一致。

### 一則好 commit 的七條規則

Assignment 指定的那篇文章《How to Write a Git Commit Message》，把重點濃縮成「七條規則」。這七條是業界公認的準則，值得記下來：

1. **用空白行分隔 subject 與 body**。這條對 Git 的運作至關重要：Git 靠第一行後面的空白行來區分「主旨」與「內文」，少了它，`log`、`shortlog`、`rebase` 等工具可能會誤判。
2. **subject 限制在 50 個字元以內**。這是引導性建議，不是硬性上限，目的是逼你把改動濃縮成一句精煉的話。（注意：TOP 課文提到 GitHub 的介面在 50 字元處會提醒你，並在超過 72 字元時把主旨截斷顯示，所以無論如何請把 subject 控制在 72 字元內。）
3. **subject 首字母大寫**。簡單但一致：每則 subject 都以大寫字母開頭。
4. **subject 結尾不加句號**。在字數本就吃緊的一行裡，句號既浪費空間又沒必要。
5. **subject 使用 imperative mood（祈使句／命令語氣）**。像下指令一樣寫，例如「Fix card generator」而非「Fixed card generator」或「Fixes card generator」。一個好用的檢驗法：你的 subject 應該能填進這句話——「If applied, this commit will ___（套用後，這次提交將會______）」。Git 自己產生的 merge、revert 訊息也是用這種語氣。
6. **body 每行折行在 72 個字元**。Git 不會自動幫你折行，手動折在 72 字元能確保即使加上縮排，整體仍在 80 字元的舒適閱讀寬度內。
7. **body 用來解釋 what（做了什麼）與 why（為什麼），而非 how（怎麼做）**。程式碼本身已經說明了「怎麼做」；commit 訊息該補上的是「解決了什麼問題、以及為何這樣解」。

其中最需要牢記的兩點，也正是本課 Knowledge check 會問的：**好歷史帶來的好處**（求職加分、快速定位 bug、喚回記憶、讓 Git 工具更好用），以及 **subject 的字數**（cbea.ms 建議 50 字元，GitHub 慣例上限 72 字元）。

### 什麼時候該 commit

把一次 commit 想像成「當下這一刻程式碼的快照（snapshot）」。這份快照會被保存下來，日後你可以回頭查看，或直接還原（revert）回去。

寫程式時的最佳實務是：**每當程式有一個有意義的改動，就 commit 一次**。這會替你的進度拉出一條清楚的時間線，也證明你的成品不是憑空冒出來的。具體來說，當你把某段功能調到你要的樣子、修好一個錯字、或修掉一個 bug，就是該 commit 的時機。做久了你會慢慢培養出「什麼該提交」的手感。

這帶來一個很實際的好處。你一定會遇到這種情況：好不容易把某個部分弄對了（此時就該 commit），結果過了 30 秒到幾天後它壞了。你完全不知道自己改了什麼，每一行「看起來」都一樣，也不記得動過那行。這時候，只要你先前有 commit，就能翻開提交歷史，還原回「當初正常運作」的那一版，或至少看看那時候的程式碼長什麼樣。這就是「commit early and often（早提交、常提交）」的價值。

### 怎麼寫出含 subject 與 body 的多行訊息

到目前為止你都用 `git commit -m <message>` 提交，這只能寫單行訊息。要寫出「主旨＋內文」的多行訊息，最簡單的方法是直接執行 `git commit`——**不加 `-m` 與訊息參數**。

這麼一來，Git 會打開你設定好的編輯器（若你在 Git Basics 那課把 Visual Studio Code 設為 Git 編輯器，就會跳出一個新分頁）。你可以刪掉裡面以 `#` 開頭的註解，輸入你的多行訊息，接著存檔並關閉分頁，commit 就建立完成了。

## 程式碼範例

```bash
# 單行訊息：只有 subject，適合很小的改動
git commit -m "Fix typo in header navigation"

# 想寫多行（subject + body）時，不要加 -m，直接：
git commit
# → Git 會打開你設定的編輯器，讓你輸入多行訊息
```

在編輯器中，你輸入的內容大致長這樣（`#` 開頭的行是 Git 的提示，會被忽略）：

```text
Add missing link and alt text to the company's logo

Screen readers won't read the images to users with disabilities
without this information.
# 第一行是 subject（祈使句、首字母大寫、結尾不加句號）
# 第二行留白，隔開 subject 與 body
# 之後是 body：解釋「為什麼」要這樣改，每行折在 72 字元內
```

也可以用兩個 `-m` 直接在命令列指定 subject 與 body（第一個是 subject，第二個是 body，Git 會自動用空白行隔開）：

```bash
git commit -m "Add alt text to logo" -m "Screen readers need this to describe the image."
```

對照一組「壞 vs. 好」的 subject：

```text
# 壞：模糊、被動、看不出做了什麼
saved
updated
Fixed the card generator.

# 好：祈使句、具體、首字大寫、無句號
Fix card generator
Add form validation for empty email field
Remove unused CSS from landing page
```

## 常見陷阱

!!! warning "把 subject 寫成「saved」或「updated」"
    這類字眼等於什麼都沒說。任何一次 commit 都是在「儲存」或「更新」，讀者真正想知道的是「更新了什麼、為什麼」。請改用具體、明確的祈使句，例如「Fix card generator」。

!!! warning "用過去式或第三人稱寫 subject"
    慣例是 imperative mood（祈使句），也就是「Fix」「Add」「Remove」，而不是「Fixed」「Added」「Fixes」。檢驗法：subject 要能接在「If applied, this commit will ___」後面唸得通。「If applied, this commit will Fix card generator」通順；「will Fixed」就不對了。

!!! warning "subject 和 body 之間沒有空白行"
    少了那一行空白，Git 會把整段當成同一個主旨，`git log`、`git rebase` 等工具的顯示會亂掉。subject 一行、空一行、再寫 body，是不能省的結構。

!!! warning "subject 過長或結尾加句號"
    盡量把 subject 控制在 50 字元（GitHub 上限 72 字元）。太長會被工具截斷；結尾的句號則在寸土寸金的一行裡純屬浪費，請省略。

## 練習

1. 閱讀 Assignment 指定的文章 [How to Write a Git Commit Message](https://cbea.ms/git-commit)。整篇都值得一看，但核心是標題為「The seven rules of a great commit message（一則好 commit 訊息的七條規則）」的段落——把這七條讀懂、記牢。
2. 確認你已在 Git Basics 那課把 VSCode 設為 Git 的預設編輯器。這樣做的好處是：能輕鬆撰寫多行訊息、即時看到每行的字元長度，還能搭配 [VSCode 拼字檢查擴充套件](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) 幫你抓錯字。
3. 動手練習：在任一練習專案裡做一個小改動，然後執行 `git commit`（不加 `-m`），在編輯器中寫出一則含 subject 與 body 的訊息。刻意套用七條規則——祈使句、首字大寫、結尾無句號、空白行隔開、body 解釋 why。
4. 把幾條要點內化成習慣：使用主動語氣（active voice），例如「Fix card generator」；避免「saved」「updated」這種模糊訊息；並且 **commit early and often（早提交、常提交）**。

## 原文與延伸資源

- 原文：[Commit Messages](https://www.theodinproject.com/lessons/foundations-commit-messages)
- 本課引用：
    - [How to Write a Git Commit Message — cbea.ms](https://cbea.ms/git-commit)（Assignment 與 Knowledge check 的核心參考，「七條規則」出處）
    - [Code Spell Checker — VSCode 擴充套件](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)（撰寫訊息時的拼字檢查工具）

---

> 本講義改寫自 The Odin Project《Commit Messages》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
