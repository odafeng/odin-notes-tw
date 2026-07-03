---
title: 打造履歷
source_url: https://www.theodinproject.com/lessons/node-path-getting-hired-building-your-resume
source_file: vendor/curriculum/getting_hired/applying_and_interviewing/project_resume.md
path: full-stack-javascript
course: Getting Hired
order: 10
status: draft
generated: 2026-07-04
---

# 打造履歷

> 改寫自 The Odin Project：[Building Your Resume](https://www.theodinproject.com/lessons/node-path-getting-hired-building-your-resume)
> ｜Full Stack JavaScript › Getting Hired › Applying to and Interviewing for Jobs

## 核心概念

### 履歷的真正目的

履歷（resume）不是你人生的完整檔案，而是一份聚焦的行銷工具（marketing tool）。它唯一的任務，是讓對方對你產生足夠的興趣，願意開啟一段對話，也就是邀你進行面試（interview）。真正的「說服」發生在面試裡，由你親口把做過的事講清楚。所以不要把履歷當成把所有經歷都塞進去的倉庫，而要把它當成一支預告片：只放最能勾起興趣的重點。

換句話說，履歷要回答的問題只有一個：「這個人值不值得我再多看一眼？」它不需要證明你會被錄取，只需要爭取到「下一步」。

### 開發者履歷的特殊之處

工程師的價值，很大一部分是靠專案（project）展現的。你的作品活在 GitHub 上，最好還有部署（deploy）到線上、任何人點開就能操作的版本。這是開發者履歷跟其他職業最不一樣的地方：你可以直接秀出成品，而不是只用文字自我宣稱。

但即使專案再亮眼，也不能忽略過去的工作經歷（work experience）與學歷（education）。這兩者提供的是社會證明（social proof）：代表已經有別人跟你共事過、而且你達到了他們的標準。專案證明「你能做出東西」，經歷與學歷證明「別人願意接受你」，兩者互補，缺一不可。

### 站在招聘經理的角度

想寫好履歷，要先理解讀履歷的人怎麼看。招聘經理（hiring manager）想找的是一位「能力很強、而且能把事情做完（並且盡快帶來價值）」的開發者。

關鍵在於：招聘經理第一眼掃過履歷，往往在 10 秒內就形成初步判斷。他看的是幾個「頭條」項目：你在哪裡受的教育、之前被誰僱用過、有沒有特別搶眼的專案。他會用這些頭條，快速在腦中拼出一個「你是誰」的故事。如果這個高層次的故事夠有趣，他才會願意看第二眼，真正讀你在每份工作裡做了什麼，然後決定要不要約你面試。

所以你的排版與內容順序，要讓最強的訊號在 10 秒內就被看見。把最能代表「能力」與「執行力」的東西放在最顯眼的位置，別讓它埋在第二頁。

### 對新手特別難，但有方法

對正要轉入這個產業的新人來說，這件事特別難，因為你還沒有響亮的工作經歷。這時的策略是：用相關的教育、經歷與專案，去編織一個關於「動力」與「能力」的故事。

具體可以從兩個維度自問：

- 有哪些東西能證明你「能力很強」？例如你的技術實力、拿過的任何肯定或獎項、帶領團隊的經驗。
- 有哪些東西能證明你「能把事情做完」？例如有趣的專案、對開源（open source）專案的貢獻。

把答案挑出最強的幾項，放進履歷。你不需要有名企背景，也能靠專案與貢獻，講出一個「這個人有幹勁、做得出東西」的故事。

### 一頁原則

貫穿以上所有原則的一條鐵律：履歷只能一頁（ONE PAGE）。

招聘經理沒有時間讀兩頁、三頁。一頁的限制會強迫你做取捨，只留下最有說服力的內容，這本身就是一種篩選訓練。與其列滿一切，不如問自己：「這一行有沒有在幫我爭取那場面試？」沒有的話，就刪掉。

## 程式碼範例

本課以觀念為主，不涉及程式碼。若你想把履歷上的專案連結整理成一份清單，方便貼進履歷或個人網站，可以用一段很短的 shell 指令，把本機專案目錄整理成待填的表格骨架：

```bash
# 列出目前資料夾下每個 git 專案的名稱與遠端網址，方便挑選要放進履歷的作品
for dir in */; do
  if [ -d "$dir/.git" ]; then
    name="${dir%/}"
    url=$(git -C "$dir" remote get-url origin 2>/dev/null)
    echo "$name -> ${url:-（尚未設定遠端）}"
  fi
done
```

真正的重點仍然是內容取捨，而不是工具。上面的指令只是幫你把候選作品攤開來看，方便從中選出最能代表你的那兩三個。

## 常見陷阱

!!! warning "把履歷當成人生倉庫"
    履歷不是要記錄你做過的每一件事。塞滿無關經歷只會稀釋重點，讓招聘經理在 10 秒內抓不到你的強項。它是行銷工具，目的是爭取一場對話，所以每一行都要為「讓人想約你面試」服務，其餘一律刪掉。

!!! warning "超過一頁"
    新手很容易想用長度堆出份量，結果履歷變成兩三頁。招聘經理沒空讀，反而顯得你不會抓重點。堅持一頁，用這個限制逼自己做取捨。

!!! warning "只堆專案、忽略經歷與學歷"
    專案能證明你做得出東西，但工作經歷與學歷提供的是「別人願意跟你共事」的社會證明。兩者互補，別因為自豪於作品，就把經歷與學歷寫得草率。

!!! warning "最強的訊號被埋在下面"
    招聘經理先掃頭條、再決定要不要細讀。如果你把最亮眼的專案或經歷放在不顯眼的位置，很可能在那關鍵的 10 秒內就被略過。把最能證明「能力」與「執行力」的內容放到最前面、最顯眼處。

## 練習

這是一堂 project（專案）課，實作步驟請以原文為準，這裡把作業改寫成繁中版流程：

1. 依前面的原則，動手做出一份一頁的開發者履歷。內容聚焦在能展現「能力強」與「能把事情做完」的教育、工作經歷與專案。
2. 需要版型或線上工具時，原文提供了幾個免費資源（見下方「原文與延伸資源」）：可用免費履歷產生器網站、Novorésumé 的免費方案與範本、FlowCV 免費履歷產生器；另有一份 CareerCup 的範例履歷可參考結構（排版本身仍有改進空間，重點看內容取捨）。
3. 完成後，把它當成行銷工具重新檢視一遍：想像自己是招聘經理，只花 10 秒掃過，你能不能立刻看出這個人的強項？如果不能，就調整順序與措辭。
4. 選讀：閱讀 Joel Spolsky 的〈Getting Your Résumé Read〉，從審履歷者的角度理解一份履歷是怎麼被讀（與被略過）的。

各家工具的註冊與操作細節、以及範本的實際套用步驟，請回到原文對應連結操作。

## 原文與延伸資源

- 原文：[Building Your Resume](https://www.theodinproject.com/lessons/node-path-getting-hired-building-your-resume)
- 本課引用：
  - Career Tool Belt 整理的 6 個免費履歷產生器網站（原文以 Wayback Machine 存檔連結提供）
  - [Novorésumé](https://novoresume.com/)：有免費方案與履歷範本
  - [FlowCV](https://flowcv.io/)：另一個完全免費的履歷產生器
  - [CareerCup 範例履歷（Gayle 版）](https://www.gayle.com/resume)：可參考內容結構
  - 選讀：Joel Spolsky，[Getting Your Résumé Read](http://www.joelonsoftware.com/articles/ResumeRead.html)

---

> 本講義改寫自 The Odin Project《Building Your Resume》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
