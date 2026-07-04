---
title: 文字編輯器
source_url: https://www.theodinproject.com/lessons/foundations-text-editors
source_file: vendor/curriculum/foundations/installations/text_editors.md
path: foundations
course: Foundations
order: 8
generated: 2026-07-03
---

# 文字編輯器

> 改寫自 The Odin Project：[Text Editors](https://www.theodinproject.com/lessons/foundations-text-editors)
> ｜Foundations › Prerequisites

## 核心概念

文字編輯器（text editor）大概是每位開發者最常用的工具，不論你寫的是哪一種程式。一個好的編輯器能幫你寫出更好的程式碼：它會即時檢查語法、幫關鍵字上色（syntax highlighting，語法高亮），還能自動排版。本課要釐清「什麼是 code editor（程式碼編輯器）」、「為什麼開發要用它」，以及安裝這門課程指定的編輯器 **Visual Studio Code（VSCode）**。

### 為什麼不能用 Microsoft Word？

像 Microsoft Word、LibreOffice Writer 這類 **rich text editor（富文本編輯器）** 很適合寫報告，但正是那些讓文件變漂亮的功能，使它們不適合寫程式。富文本檔案裡存的不只是「文字本身」，還夾帶了大量額外資訊：字型、顏色、字級、段落樣式，甚至嵌入的圖片與排版資料。

相對地，**plain text editor（純文字編輯器）**，例如 VSCode、Sublime Text，只儲存你打進去的文字，不夾帶任何格式資料。這一點很關鍵：因為檔案裡只有純文字，其他程式（例如 Ruby 的 interpreter（直譯器）、Node.js、瀏覽器）才能原原本本地把檔案讀進去、當成程式碼執行。如果你用 Word 存一份 `.docx`，直譯器看到的會是一堆格式雜訊而不是可執行的程式，自然無法運作。

### code editor 能幫你什麼

你可以把 code editor 想成「為寫網頁與程式而特化的工具」。它高度可客製化，而且內建很多能替你省時間、減少低級錯誤的功能。想像一下：花了兩個小時找不出程式為什麼不動，最後才發現只是少了一個右括號——這種痛苦，好的編輯器可以幫你避免。常見的實用功能包括：

- **syntax highlighting（語法高亮）**：用不同顏色標示關鍵字、字串、變數，讓程式結構一眼可辨。
- **auto-closing（自動補齊）**：打開一個 `(`、`{`、`[` 或引號時，自動補上對應的另一半。
- **linting（程式碼檢查）**：在你還沒執行前，就標出語法錯誤、可疑寫法或風格問題。
- **plugins / extensions（外掛 / 擴充套件）**：依你使用的語言或框架加裝功能，把編輯器變成順手的工作環境。
- **Git integration（Git 整合）**：直接在編輯器裡看到哪些檔案改過、暫存變更、commit，不必一直切到終端機。

### 為什麼選 VSCode

市面上編輯器很多（Sublime Text、Vim、Neovim、JetBrains 系列等），選哪個大多是個人偏好。但這門課程統一假設你使用 **VSCode**，理由有三：它免費、容易上手，而且在 Windows、macOS、Linux 上的操作幾乎一模一樣。VSCode 的擴充套件生態非常完整、Git 整合也很好，更重要的是——它是 Odin 學生與社群志工之間最普及的編輯器，遇到問題時最容易找到人幫忙。

請記住這個現實面的提醒：**如果你之後改用 VSCode 以外的編輯器來跑課程內容，社群將無法為你提供協助。** 初學階段先跟大家用同一套工具，把力氣花在學程式本身，而不是折騰工具鏈。

### 使用虛擬機的人請注意

如果你依前面的課程建立了 **virtual machine（虛擬機，VM）**，那麼 VSCode 必須裝在 **VM 裡面**。你當然也可以順手在主機（例如你的 Windows 主系統）上再裝一份，但務必確認這個關鍵工具在 VM 內是可用的——因為你之後的所有開發都會在 VM 裡進行。

## 程式碼範例

本課以觀念與安裝為主，沒有需要你撰寫的程式碼。這裡只列出安裝後用來「驗證是否成功」的一個小動作：VSCode 內建一個叫 `code` 的命令列指令，安裝好後在 command line（命令列）輸入以下指令，就能直接開啟目前資料夾。

```bash
# 驗證 VSCode 的命令列指令是否可用（會印出版本號）
code --version

# 用 VSCode 開啟目前所在的整個資料夾
code .
```

若 `code --version` 能印出版本編號、`code .` 能開起編輯器視窗，代表安裝與環境設定都正常。（macOS 使用者若指令找不到，需在 VSCode 內用命令面板執行「Shell Command: Install 'code' command in PATH」。）

## 常見陷阱

!!! warning "用 Word 或記事本寫程式"
    富文本編輯器會把格式資訊一起存進檔案，直譯器與瀏覽器讀到的不是純粹的程式碼，會導致無法執行。務必使用純文字的 code editor。Windows 的「記事本」雖是純文字，但缺少語法高亮、linting 等功能，不建議用來寫課程作業。

!!! warning "VSCode 裝在主機、卻在 VM 裡開發"
    使用虛擬機的人，如果只把 VSCode 裝在主機系統，VM 裡就沒有這個工具可用。請確認 VSCode 裝在你實際進行開發的環境（也就是 VM 內）。

!!! warning "為了新鮮感一開始就換別的編輯器"
    Vim、Neovim 等編輯器很強大，但初學就切換會讓你在工具上耗掉大量時間，而且遇到問題時社群難以協助。先用 VSCode 跟完課程，行有餘力再探索其他編輯器。

!!! warning "沒有關掉預設開啟的 Copilot AI 補全"
    VSCode 現在預設開啟 Copilot 的 AI 程式碼補全。學習階段讓 AI 幫你把程式碼補完，會剝奪你自己動手、犯錯、除錯的練習機會。請依下方練習步驟把它關掉。

## 練習

1. 依你的作業系統，照 The Odin Project 對應的 VSCode 安裝指南操作（安裝步驟會隨 OS 與版本而異，請以原文為準）：
   - Linux 安裝指南：<https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/text_editors/linux.md>
   - macOS 安裝指南：<https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/text_editors/macos.md>
   - WSL2 安裝指南：<https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/text_editors/wsl2.md>

   之後若 VSCode 出問題或想深入了解某個功能，查官方文件：<https://code.visualstudio.com/docs>。VSCode 也有許多鍵盤快捷鍵，部分因 OS 而異，需要時再查即可。

2. 熟悉 VSCode 能讓你省時、提升生產力。可觀看官方推薦的《VSCode Tutorial for Beginners》影片（<https://youtu.be/ORrELERGIHs?t=103>），對 VSCode 的各項功能建立整體印象。這一步不需要跟著打程式，重點是觀察 VSCode 在整個開發流程中如何被使用。

3. 關掉 VSCode 預設開啟的 Copilot AI 補全：點右下角那個小機器人圖示，取消勾選「code completions」。想理解 The Odin Project 為何建議關閉此功能，可回顧「Motivation and Mindset」一課中的「A note on AI code generation」段落：<https://www.theodinproject.com/lessons/foundations-motivation-and-mindset#a-note-on-ai-code-generation>。

完成後，用本課「知識檢核」自問：什麼是 code editor？這門課程支援哪一個編輯器？（答案都是 VSCode。）

## 原文與延伸資源

- 原文：[Text Editors](https://www.theodinproject.com/lessons/foundations-text-editors)
- 本課引用：
  - VSCode 官方文件：<https://code.visualstudio.com/docs>
  - VSCode 安裝指南（Linux / macOS / WSL2），見上方練習連結
  - A note on AI code generation（Motivation and Mindset 課）：<https://www.theodinproject.com/lessons/foundations-motivation-and-mindset#a-note-on-ai-code-generation>

---

> 本講義改寫自 The Odin Project《Text Editors》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
