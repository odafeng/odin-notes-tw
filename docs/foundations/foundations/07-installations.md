---
title: 安裝設定
source_url: https://www.theodinproject.com/lessons/foundations-installations
source_file: vendor/curriculum/foundations/installations/installations.md
path: foundations
course: Foundations
order: 7
status: draft
generated: 2026-07-03
---

# 安裝設定

> 改寫自 The Odin Project：[Installations](https://www.theodinproject.com/lessons/foundations-installations)
> ｜Foundations › Prerequisites

## 核心概念

打造任何網站的第一步，是先備妥「對的工具」。對我們來說，這代表要建立一套能撰寫、執行程式碼的 development environment（開發環境）。

很多線上課程用瀏覽器內建的編輯器或「sandbox（沙盒）」讓你直接開始，它只提供當下任務需要的最小工具。這在剛起步時很方便，The Odin Project 早期也會用到。但要為長期學習打好基礎，最好的方式還是在一個「真實」的開發環境裡工作。老實說，安裝套件、編輯器、甚至整個作業系統，過程可能很讓人挫折；但親手把環境架起來，是一項會跟著你整個職涯的實用技能。

**一個關鍵前提：如果你目前已經在用 macOS、Ubuntu 或[官方認可的 Ubuntu 衍生版（flavor）](https://ubuntu.com/desktop/flavours)，而且已安裝 Google Chrome，那你可以直接略過本課。** 否則，就照下面的觀念與練習把環境設定好。

### 支援哪些作業系統

The Odin Project 的所有教學都假設你在 **Unix-based（類 Unix）系統** 上操作。原因是課程後面會用到的許多工具（例如 Ruby on Rails、Node.js）本來就是為類 Unix 平台而寫，在這類系統上更新更頻繁、遇到問題也更容易找到解法。官方明確支援的環境有：

- **macOS**：Mac 本身就是類 Unix 系統，只要再裝幾個程式就能開始。
- **Linux（Ubuntu 與官方衍生版）**：Linux 是自由、open-source（開源）的作業系統，與各種程式語言都能良好搭配。為了讓社群能有效互助，官方**只支援 Ubuntu 與其官方衍生版**，不支援其他發行版（distro），包含 Mint、Pop!_OS 這類「基於 Ubuntu／Debian」的系統也不在支援範圍。
- **Chromebook**：許多 Chromebook 內建 Linux terminal（終端機），也能拿來開發。

### 為什麼不「原生」支援 Windows

如果你用的不是 Apple 電腦，很可能是在用 Windows。**Windows 本身（原生）不在 The Odin Project 的支援範圍內**，因為許多工具都是以類 Unix 環境為前提設計的。這不代表你得放棄 Windows——Linux 可以和 Windows 共用同一顆硬碟。選擇支援的環境有幾個實際好處：官方教學都在這些環境上測試過、社群比較容易幫你除錯、開發工具本來就為 Linux 而建、而且 Linux 佔用的系統資源與硬碟空間通常更少。

若你不是在用 macOS、Ubuntu 或其官方衍生版，就需要從下列四種方式擇一來建立環境：

- **VirtualBox 虛擬機（推薦給新手）**：virtual machine（VM，虛擬機）是在你現有作業系統裡「模擬」出的一台電腦，可在 Windows 裡跑一個完整的 Linux。安裝像裝一般程式一樣直覺，且幾乎零風險——不喜歡隨時可刪掉。因此最推薦給不確定該選哪個的初學者。
- **Dual-boot（雙系統開機）**：在同一台電腦裝兩套作業系統，開機時可選擇進 Linux 或 Windows。好處是 Linux 能用到整台電腦的資源、速度快很多；代價是要調整硬碟分割區（partition），有一定風險，務必照步驟慢慢來、不要混用不同來源的教學。
- **ChromeOS／ChromeOS Flex**：適合 Chromebook 使用者，或想在較舊硬體上安裝 ChromeOS Flex 的人。
- **WSL2（進階）**：WSL2 是一種讓 Linux 直接跑在 Windows 裡的特殊 VM。功能強，但兩套系統的視覺區隔不明顯，新手容易「對錯系統」下指令而搞混，所以標記為進階、不推薦給初學者。注意 WSL2 與 WSL1 不同，官方**只支援 WSL2**。

### 瀏覽器：只支援 Google Chrome

課程統一使用 **Google Chrome**。它內建強大的 developer tools（開發者工具），你會在整個課程中用它來檢視、除錯、測試網頁。其他瀏覽器雖有類似工具，但官方的教學與截圖都以 Chrome 為準，若用別的瀏覽器出現差異，官方無法提供支援。裝完環境後，替你的系統安裝 Chrome 即可。

### 裝完要怎麼確認

驗證環境是否就緒的原則很簡單：**你的作業系統是官方支援的類 Unix 環境（macOS / Ubuntu / 官方衍生版），而且能開啟 Google Chrome。** 若走 VM 或雙系統路線，確認你能開機進入 Ubuntu 桌面並打開 terminal；再從 Ubuntu 裡開啟 Chrome，就代表這一步完成了。

## 程式碼範例

本課以觀念與環境設定為主，沒有需要撰寫的程式碼。以下列出裝好 Ubuntu 後，用來驗證系統與瀏覽器的常見指令（在 terminal 執行）：

```bash
# 確認作業系統版本（應顯示 Ubuntu 與版本號）
lsb_release -a

# 確認系統核心為 Linux（類 Unix）
uname -a

# 確認 Google Chrome 已安裝並可查版本
google-chrome --version
```

## 常見陷阱

!!! warning "不要在 Discord 或社群反覆要求支援原生 Windows"
    官方已明確說明：課程範圍內只支援教材涵蓋的環境，**不支援把原生 Windows 當開發環境**。這不是臨時決定，而是評估後的結論。與其花時間爭論，不如直接選一個支援的方案（VM、雙系統、ChromeOS 或 WSL2）開始。另外要特別注意：只有 **WSL2** 受支援，WSL1 不算；別把兩者搞混。

!!! warning "只支援 Ubuntu 與其官方衍生版，別自行換成其他發行版"
    Mint、Pop!_OS 等「基於 Ubuntu／Debian」的系統看起來很像，但不在支援清單內，遇到問題時社群較難協助。硬體方面也只支援筆電、桌機與受支援的 Chromebook，Raspberry Pi 等裝置不在範圍內。安裝前先確認自己選的是清單上的環境。

## 練習

1. 先判斷你目前的環境：如果已經在用 **macOS**、**Ubuntu** 或[官方 Ubuntu 衍生版](https://ubuntu.com/desktop/flavours)，可直接跳到第 3 步。
2. 若不是，從下列四種安裝指南擇一建立環境。各平台的逐步指令會隨版本更動，請以原文的安裝指南為準：
   - **虛擬機（推薦）**：最簡單、最可靠，Linux 跑在你現有的 Windows 裡。
   - **Ubuntu／Windows 雙系統**：把 Ubuntu 裝成與 Windows 並存的獨立系統，適合資源較有限的機器（不需虛擬化）。
   - **ChromeOS／ChromeOS Flex**：給 Chromebook 使用者。
   - **WSL2（進階）**：在 Windows 內執行 Linux，因系統區隔不明顯較易混淆。
   完整逐步操作請見原文的 [Installations](https://www.theodinproject.com/lessons/foundations-installations) 課程「Assignment」段落中的各作業系統安裝指南。
3. 為你的系統安裝 **Google Chrome**（同樣依原文對應平台的指南操作：Linux 的 VM／雙系統使用者、macOS 使用者、WSL2 使用者各有專屬步驟）。
4. 自我檢核（Knowledge check）：
   - The Odin Project 支援哪些作業系統？
   - The Odin Project 支援哪個瀏覽器？

## 原文與延伸資源

- 原文：[Installations](https://www.theodinproject.com/lessons/foundations-installations)
- 本課引用：
  - [官方認可的 Ubuntu 衍生版清單](https://ubuntu.com/desktop/flavours)
  - [為什麼 The Odin Project 不支援 Windows（官方說明）](https://github.com/TheOdinProject/blog/wiki/Why-We-Do-Not-Support-Windows)
  - [各瀏覽器市佔率（Wikipedia）](https://en.wikipedia.org/wiki/Usage_share_of_web_browsers#Summary_tables)
  - [Google Chrome 常用快捷鍵](https://support.google.com/chrome/answer/157179)

---

> 本講義改寫自 The Odin Project《Installations》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
