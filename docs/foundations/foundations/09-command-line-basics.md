---
title: 命令列基礎
source_url: https://www.theodinproject.com/lessons/foundations-command-line-basics
source_file: vendor/curriculum/foundations/installations/command_line_basics.md
path: foundations
course: Foundations
order: 9
generated: 2026-07-03
---

# 命令列基礎

> 改寫自 The Odin Project：[Command Line Basics](https://www.theodinproject.com/lessons/foundations-command-line-basics)
> ｜Foundations › Prerequisites

## 核心概念

### 什麼是命令列？

電影裡的駭客總是盯著一片黑底綠字的畫面，飛快地敲進一串看不懂的指令。那個有著提示符號（prompt）與閃爍游標的視窗，就是命令列介面（command line interface，簡稱 CLI）。它是一種用「打字」而非「點滑鼠」來操作電腦的方式：你輸入一行指令，按下 Enter，電腦就替你執行。

CLI 之所以重要，是因為它是開發者的「作戰基地」。從這裡你可以啟動其他程式、安裝軟體、操作檔案、與 Git 互動。它有一套自己的語法要學，但因為你會把同樣幾個指令用上幾十次，很快就會把最常用的那幾個記進肌肉記憶裡。這一課的目標，就是讓你能自在地在命令列裡「導航」你的電腦、以及建立、更名、刪除檔案與資料夾（directory，也就是俗稱的 folder）。

要注意「命令列」與「終端機」（terminal）這兩個詞常被混用。嚴格說，terminal 是那個視窗程式（例如 macOS 的 Terminal.app），shell 才是在裡面實際解讀你指令的程式（例如 Bash 或 Zsh），而 command line 泛指這整套以文字下指令的操作方式。初學階段把它們當同義詞理解即可。

### 打開終端機

- **Linux**：打開應用程式選單搜尋「Terminal」，或直接按 <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>T</kbd>。
- **macOS**：到「應用程式 › 工具程式」找「終端機」，或用 Spotlight（按 <kbd>Cmd</kbd> + <kbd>Space</kbd>）搜尋「Terminal」後按 <kbd>Enter</kbd>。

打開後畫面大致空白，只有一行文字，結尾通常是 `$`（Linux 與較舊的 Mac）或 `%`（較新的 Mac）。這個符號叫做提示符號（prompt），代表終端機正在等你輸入指令。試著輸入 `whoami` 再按 Enter，它會回傳你的使用者名稱。

教學文件常把指令寫成 `$ whoami` 的樣子，開頭那個 `$` 只是「這是一行終端機指令」的慣例標記，你實際輸入時**不要**把 `$` 打進去。新款 Mac 的 `%` 與 `$` 意義相同。

### 導航：cd、pwd、ls

檔案系統像一棵樹，資料夾層層包著資料夾。任何時刻你都「站在」某個資料夾裡，這個位置叫做目前工作目錄（current working directory）。三個指令構成導航的核心：

- `pwd`（print working directory）：顯示你現在所在資料夾的完整路徑，例如 `/home/you/Documents`。當你搞不清楚自己在哪裡時，先打它。
- `ls`（list）：列出目前資料夾裡的內容。加上參數能看到更多，例如 `ls -l` 顯示每個項目的詳細資訊（權限、大小、修改時間），`ls -a` 連以 `.` 開頭的隱藏檔也一併列出。
- `cd`（change directory）：切換到另一個資料夾，用法是 `cd 目標路徑`，例如 `cd Documents`。

`cd` 有幾個好用的特例要記牢，它們正是 knowledge check 的重點：

- `cd ..`：`..` 代表「上一層資料夾」（parent directory），所以這會把你往上帶一層。
- `cd`（後面什麼都不接）或 `cd ~`：回到你的家目錄（home directory），也就是登入後預設所在的個人資料夾，`~` 是它的簡寫。
- `cd .`：`.` 代表「目前這個資料夾」，所以這其實原地不動，但 `.` 這個符號在別的地方非常有用（見下方）。

路徑分成兩種：絕對路徑（absolute path）從根目錄 `/` 開始寫起，不管你現在在哪裡都指向同一個地方，例如 `/home/you/Documents`；相對路徑（relative path）則從目前所在位置算起，例如你在家目錄時打 `cd Documents` 就是相對路徑。

### 建立：mkdir 與 touch

- `mkdir 名稱`（make directory）：建立一個新資料夾。例如 `mkdir images` 會在目前位置開一個名為 `images` 的資料夾。
- `touch 檔名`（建立空檔案）：建立一個空的新檔案。例如 `touch index.html` 會生出一個空的 `index.html`。`touch` 原本的用途是更新檔案的時間戳記，但檔案不存在時它會順手建立，所以常被拿來快速造檔。

### 更名與刪除：mv 與 rm、rmdir

- `mv 舊名 新名`（move）：把檔案或資料夾改名。例如 `mv old.txt new.txt` 就是更名。`mv` 同時也是「搬移」指令，`mv file.txt images/` 會把 `file.txt` 移進 `images` 資料夾——更名其實就是「搬到同一層、換個名字」。
- `rm 檔名`（remove）：刪除檔案，例如 `rm test.txt`。
- `rmdir 資料夾名`：刪除一個「空的」資料夾。若資料夾裡還有東西，`rmdir` 會拒絕。要連內容一起刪，用 `rm -r 資料夾名`（`-r` 代表 recursive，遞迴刪除裡面所有東西）。

命令列的刪除是**真的刪除**，不會進垃圾桶，通常也沒有「復原」按鈕，所以下 `rm` 前務必看清楚打的是什麼。

### 用專業的方式操作：幾個省時技巧

程式設計師很懶，懶到會想辦法把重複的事自動化，於是留下許多好用的捷徑：

- **複製貼上**：終端機裡的複製貼上和一般文字框不同。多數 Linux 終端機用 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd> 複製、<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> 貼上；Mac 則照常用 <kbd>Cmd</kbd> + <kbd>C</kbd> 與 <kbd>Cmd</kbd> + <kbd>V</kbd>。
- **Tab 自動補全（tab completion）**：這招會幫你省下大量時間與打錯字的挫折。輸入到一半按 <kbd>Tab</kbd>，若只剩一個可能，終端機會自動補完檔名或資料夾名；若有多個符合，它會把選項全列出來讓你再多打幾個字。像 `~/Documents/Odin-Project/foundations/javascript/calculator/` 這種又長又不能打錯的路徑，靠 Tab 幾乎不用完整敲出來。
- **`.` 開啟整個專案**：裝好文字編輯器後，`.` 這個「目前資料夾」的簡寫超好用。以 VS Code 為例，`cd` 進專案資料夾後打 `code .`（注意那個句點），就會用 VS Code 打開整個專案。這個 `.` 之後在 Git 也常見，例如 `git add .` 代表「把目前資料夾裡所有檔案加入」。

### 從命令列打開 VS Code

- **Linux**：直接打 `code` 開啟編輯器，`code 資料夾名/` 則會打開指定資料夾或檔案。
- **macOS**：需要先設定一次。裝好並啟動 VS Code 後，按 <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> 打開命令面板，輸入 `shell command`，選擇 `Shell Command: Install 'code' command in PATH`，然後重開終端機即可。
- **WSL2**：和 Linux 一樣，直接輸入 `code` 就能開啟。

## 程式碼範例

以下示範把常用指令串起來，做一個最陽春的網站專案骨架，再示範刪除流程：

```bash
# 先確認自己在哪裡
pwd                 # 顯示目前工作目錄的完整路徑

# 回到家目錄，建立並進入專案資料夾
cd ~                # cd 不接參數也會回家目錄
mkdir my-site       # 建立 my-site 資料夾
cd my-site          # 進入它

# 建立網站常見檔案與圖片資料夾
touch index.html    # 空的 HTML 檔
touch style.css     # 空的 CSS 檔
mkdir images        # 放圖片的資料夾
ls                  # 列出內容，確認三者都在

# 更名：把 style.css 改成 main.css
mv style.css main.css

# 用 VS Code 打開整個專案（. 代表目前資料夾）
code .

# 練習刪除
cd ~                # 先離開，站到上一層
rm -r my-site       # -r 連同裡面內容一起遞迴刪除
```

## 常見陷阱

!!! warning "輸入密碼時畫面沒有任何反應"
    執行像 `sudo` 這類需要驗證的指令時，終端機會要你輸入密碼，但你打字時螢幕上**不會顯示任何字元**，游標也不動。這不是當機，而是刻意的安全設計（如同網頁密碼欄以圓點遮蔽）。照常把密碼打完按 Enter 即可。

!!! warning "rm 沒有垃圾桶"
    命令列的 `rm` 與 `rm -r` 是永久刪除，不會進垃圾桶，通常也無法復原。下手前先用 `ls` 或 `pwd` 確認自己在對的位置、刪的是對的東西。尤其 `rm -r` 加上錯誤的路徑可能一次刪掉大量檔案。

!!! warning "終端機的複製貼上鍵不一樣"
    在 Linux 終端機裡直接按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 不是複製，而是「中斷目前執行中的程式」。要複製貼上請用 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd> / <kbd>V</kbd>（Mac 則照常 <kbd>Cmd</kbd> + <kbd>C</kbd> / <kbd>V</kbd>）。

!!! warning "教學裡的 $ 不要打進去"
    文件常把指令寫成 `$ whoami` 或 `% ls`，開頭的 `$` 或 `%` 只是提示符號的標記，代表「這是一行終端機指令」，你實際輸入時只打後面的 `whoami`、`ls`，不要連 `$` 一起打。

!!! warning "rmdir 只能刪空資料夾"
    `rmdir` 遇到「裡面還有東西」的資料夾會拒絕執行並報錯。要刪除非空的資料夾，改用 `rm -r 資料夾名`。

## 練習

> 部分外部資源預設你有一個 Desktop 資料夾。若你的系統裡沒有，先開終端機用 `cd ~` 回到家目錄，輸入 `mkdir Desktop` 建立它，再用 `ls` 確認它出現在清單中。
>
> 另外，多數資源假設你使用 macOS 或 Linux 環境。若你兩者皆無，請先回到 [Installations 課程](https://www.theodinproject.com/lessons/foundations-installations) 完成安裝。

1. 前往 Software Carpentry 基金會設計的 [The Unix Shell](https://swcarpentry.github.io/shell-novice/) 課程。它是一套完整的 CLI 教材，現階段只需完成下列幾課：
   - [Download files](https://swcarpentry.github.io/shell-novice/#download-files)：只跟著這一節取得練習用檔案即可，不需安裝任何軟體。
   - [Introducing the Shell](https://swcarpentry.github.io/shell-novice/01-intro.html)（認識 shell）
   - [Navigating Files and Directories](https://swcarpentry.github.io/shell-novice/02-filedir.html)（導航檔案與資料夾）
   - [Working With Files and Directories](https://swcarpentry.github.io/shell-novice/03-create.html)（操作檔案與資料夾）

   > **WSL2 使用者**：用 `wget https://swcarpentry.github.io/shell-novice/data/shell-lesson-data.zip` 下載檔案，並用 `sudo apt install unzip` 安裝解壓工具後，以 `unzip shell-lesson-data.zip` 解壓。課程要你去 Desktop 的地方，一律改用 `cd ~` 前往家目錄。你的終端機輸出可能與教材截圖略有出入，屬正常。

2. 用剛學到的指令練習建立資料夾與檔案。以一個最基本的網站為例：一個主檔 `index.html`、一個 CSS 樣式表 `style.css`、以及一個放圖片的 `images` 資料夾。想想怎麼用 `mkdir`、`touch`、`cd` 把它們建出來，然後實際做一次。

3. 練習建立與刪除檔案／資料夾，在終端機依序完成下列步驟：
   1. 在家目錄建立一個名為 `test` 的新資料夾。
   2. 進入 `test` 資料夾。
   3. 建立一個名為 `test.txt` 的新檔案。（提示：用 `touch`。）
   4. 用 VS Code 打開這個檔案，做點修改、存檔、關閉。
   5. 退回到 `test` 資料夾外面。
   6. 刪除 `test` 資料夾。

   完成後就大功告成了。從現在起儘量用命令列處理多數任務，這些指令很快就會變成第二天性。

## 原文與延伸資源

- 原文：[Command Line Basics](https://www.theodinproject.com/lessons/foundations-command-line-basics)
- 本課引用：
  - [The Unix Shell — Software Carpentry](https://swcarpentry.github.io/shell-novice/)：本課主要練習教材，涵蓋 shell 導航與檔案操作。
  - [Tab completion（維基百科）](https://en.wikipedia.org/wiki/Command-line_completion)：命令列自動補全的原理說明。
  - [Learn Enough Command Line to Be Dangerous](https://www.softcover.io/read/fc6c09de/unix_commands/basics)：knowledge check 多題連結至此，補充 `cd`、`pwd`、`ls`、`mkdir` 等指令細節。

---

> 本講義改寫自 The Odin Project《Command Line Basics》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
