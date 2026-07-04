---
title: HTML 樣板（Boilerplate）
source_url: https://www.theodinproject.com/lessons/foundations-html-boilerplate
source_file: vendor/curriculum/foundations/html_css/html_foundations/html_boilerplate.md
path: foundations
course: Foundations
order: 15
generated: 2026-07-02
---

# HTML 樣板（Boilerplate）

> 改寫自 The Odin Project：[HTML Boilerplate](https://www.theodinproject.com/lessons/foundations-html-boilerplate)
> ｜Foundations › HTML Foundations

## 核心概念

所有的 HTML 文件都長得有點像：不管網頁最後要放什麼內容，開頭永遠都是同一套固定骨架。這套骨架就叫做 **boilerplate（樣板）**。「boilerplate」原本指印刷業裡可以重複使用的鉛版，在程式領域則泛指「每次都得先擺好、內容幾乎不變」的起手式。先把這副骨架搭好，我們才有地方開始放真正有用的東西。

### 先建立一個 HTML 檔案

要示範樣板，得先有一個檔案來練習。在電腦上開一個新資料夾，取名為 `html-boilerplate`，然後在裡面建立一個檔案叫 `index.html`。

副檔名 `.html` 很關鍵：它是告訴電腦「這是一份 HTML 文件」的方式，就像 `.pdf`、`.png` 各自代表不同檔案型別一樣。

至於為什麼取名 `index`？因為網站首頁的檔案幾乎都約定俗成叫 `index.html`。當使用者連到你的網站根目錄時，web server（網頁伺服器）預設會去找一個名為 `index.html` 的檔案當作首頁回傳；如果沒有這個檔案，就會出問題。所以「首頁 = `index.html`」是個要記住的慣例。

一份完整的樣板由四個部分由外而內、由上而下組成：DOCTYPE、`<html>`、`<head>`、`<body>`。下面逐一拆解。

### DOCTYPE：告訴瀏覽器用哪個版本

每份 HTML 頁面的第一行都是 doctype declaration（文件類型宣告）。它的作用只有一個：告訴瀏覽器「請用哪個版本的 HTML 規範來解析並渲染這份文件」。

目前最新的版本是 HTML5，它的 doctype 非常簡短：

```html
<!DOCTYPE html>
```

舊版就囉唆多了。例如 HTML4 的宣告長這樣：

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
```

實務上我們幾乎不會再用舊版，所以只要記得永遠寫 `<!DOCTYPE html>` 就好。要注意 `<!DOCTYPE html>` 嚴格說並不是一個 element（元素），它沒有結束標籤、也不包住任何內容，就只是一行宣告；把它放在檔案的第一行即可。

### `<html>`：整份文件的根

宣告完 doctype 之後，接著要放一個 `<html>` element。它是整份文件的 **root element（根元素）**——意思是文件裡其他所有 element 都是它的後代（descendant），全部包在它的開始標籤與結束標籤之間。一份文件裡只能有一個 `<html>`。

這件事在之後學到用 JavaScript 操作 HTML 時會變得很重要，屆時我們會把整份文件想像成一棵樹，而 `<html>` 就是這棵樹的樹根。現在只要記得：每份 HTML 文件都要有 `<html>`，而且它底下依序放 `<head>` 和 `<body>` 兩個子元素。

```html
<!DOCTYPE html>
<html lang="en">
</html>
```

注意到 `<html>` 標籤裡的 `lang` 了嗎？這是一個掛在標籤上的 **attribute（屬性）**，用來提供關於元素的額外資訊（下一課會專門講 attribute）。

`lang` 指定的是這個元素內文字內容所使用的語言。它主要跟 accessibility（無障礙）有關：像螢幕報讀軟體（screen reader）這類輔助技術，會依據 `lang` 的值切換到正確的語言，用對的發音把內容念出來。如果沒有設定有效的 `lang`，報讀軟體只能退而使用作業系統的預設語言，很可能把整頁念錯音。`lang` 的值要用標準的語言標籤，例如英文寫 `en`、繁體中文寫 `zh-TW`。

### `<head>`：放給機器看的 meta 資訊

`<head>` element 專門用來放關於網頁的重要 **meta-information（後設資訊）**，以及讓網頁能在瀏覽器裡正確渲染所需要的東西。這裡的重點是：`<head>` 裡放的是「給機器看」的資料，**不應該**放任何會直接顯示在畫面上的內容。

`<head>` 要放在 `<html>` 裡面，而且是開始標籤 `<html>` 之後的第一個元素。它最基本會包含 `<meta>` 與 `<title>`：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>My First Webpage</title>
  </head>
</html>
```

**`<meta charset="UTF-8">`** 設定的是網頁的字元編碼（character encoding）。這行幾乎每份文件都該放，因為它確保瀏覽器能正確顯示各種語言的特殊符號與文字。少了它，中文、日文、emoji 或各種特殊符號就可能變成亂碼。UTF-8 是能涵蓋幾乎所有語言字元的通用編碼，用它就對了。

**`<title>`** 給網頁一個「人看得懂」的標題，這個標題會顯示在瀏覽器分頁的頁籤上。例如原本課程的分頁就顯示「HTML Boilerplate | The Odin Project」，那就是那份文件的 `<title>`。如果不寫 `<title>`，瀏覽器會退而用檔名當標題，也就是顯示成 `index.html`——對使用者毫無意義，開了一堆分頁時也很難找到你的頁面。

除了這兩個，`<head>` 裡還能放很多其他東西，例如 `<link>`（引入樣式表或 icon）、`<style>`、`<script>` 等；後續課程會陸續介紹。現在只要先掌握 `<meta charset>` 與 `<title>` 這兩個。順帶一提，`<head>` 別跟 `<header>` 搞混：`<head>` 放的是給機器讀的 metadata，`<header>` 則是頁面上給人看的一段內容區塊。

### `<body>`：放給人看的內容

樣板的最後一塊是 `<body>` element。使用者實際會看到的所有東西——文字、圖片、清單、連結等等——全都放在 `<body>` 裡。

`<body>` 一樣放在 `<html>` 裡面，而且永遠排在 `<head>` 之後。加上它，一份完整的樣板就成形了：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>My First Webpage</title>
  </head>

  <body>
  </body>
</html>
```

### 在瀏覽器裡打開 HTML 檔案

樣板寫好後，要怎麼看結果？有幾種方法：

- 把 HTML 檔案從編輯器直接拖曳到瀏覽器的網址列。
- 在瀏覽器按 <kbd>Ctrl + O</kbd>（macOS 是 <kbd>Cmd + O</kbd>），再選到你的 HTML 檔案。
- 在檔案總管/Finder 裡找到檔案並雙擊，會用系統預設瀏覽器打開。
- 用終端機打開：macOS 進到檔案所在目錄後輸入 `open ./index.html`；Ubuntu 輸入 `google-chrome index.html`；WSL 輸入 `explorer.exe index.html`（WSL 要注意只能給檔名，給路徑會改開 Windows 檔案總管）。

本課程之後一律以 Google Chrome 為主要瀏覽器，強烈建議你的所有測試都用 Chrome，以免各家瀏覽器的差異讓步驟變得複雜。

如果現在打開檔案，畫面會是一片空白——因為 `<body>` 裡什麼都還沒放。往 `<body>` 加一個標題再存檔，重新整理就會看到文字出現（`<h1>` 是標題元素，之後會細講）：

```html
<body>
  <h1>Hello World!</h1>
</body>
```

### VSCode 的一鍵樣板

VSCode 內建一個快速產生整份樣板的捷徑。前提是你正在編輯 `.html` 檔案（或已把語言模式設為 HTML）。把 `index.html` 清空，在第一行只打一個驚嘆號 `!`，會跳出候選提示，按 <kbd>Enter</kbd> 選第一個，整份樣板就自動填好了。

你可能會發現它多產生了一行我們還沒提過的：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

這行跟 responsive design（響應式設計，處理不同螢幕尺寸）有關，屬於較後面才會談的進階主題。現在原封不動保留即可，不用理解它。

## 程式碼範例

下面是一份最小、可直接用瀏覽器打開的完整 HTML 樣板。存成 `index.html` 後雙擊開啟，分頁會顯示「我的第一個網頁」，畫面上會出現「Hello World!」。

```html
<!DOCTYPE html>            <!-- 告訴瀏覽器用 HTML5 來解析 -->
<html lang="zh-TW">       <!-- 根元素；lang 指定內容語言為繁體中文 -->
  <head>                  <!-- 放給機器看的 meta 資訊，不會顯示在畫面上 -->
    <meta charset="UTF-8"> <!-- 設定字元編碼，避免中文變亂碼 -->
    <title>我的第一個網頁</title> <!-- 顯示在分頁頁籤上的標題 -->
  </head>

  <body>                  <!-- 放給使用者看的內容 -->
    <h1>Hello World!</h1> <!-- 一個標題，會顯示在頁面上 -->
  </body>
</html>
```

記憶重點：DOCTYPE 在最外層宣告版本 → `<html>` 是根 → 裡面先 `<head>`（給機器）再 `<body>`（給人）。

## 常見陷阱

!!! warning "把顯示內容放進 `<head>`"
    `<head>` 只放 metadata（像 `<meta>`、`<title>`、`<link>`），不放任何會顯示在畫面上的內容。文字、圖片、標題這類東西一律放在 `<body>`。另外別把 `<head>`（機器讀的後設資訊）和 `<header>`（頁面上給人看的區塊）搞混，兩者完全不同。

!!! warning "忘了寫 `<meta charset="UTF-8">`"
    少了字元編碼宣告，中文、特殊符號或 emoji 很可能在某些環境下顯示成亂碼。養成習慣：每份文件的 `<head>` 第一行就放 `<meta charset="UTF-8">`。

!!! warning "首頁檔名沒取成 `index.html`"
    web server 預設會去找 `index.html` 當首頁。把首頁取成別的名字（例如 `home.html`），使用者連到網站根目錄時可能看到錯誤或找不到頁面。

## 練習

<div class="lesson-content__panel" markdown="1">

1. 依本課步驟，親手建立 `html-boilerplate` 資料夾與 `index.html`，從第一行的 `<!DOCTYPE html>` 開始，一路把 `<html>`、`<head>`（含 `<meta charset>` 與 `<title>`）、`<body>` 逐一補完，並在 `<body>` 裡放一個 `<h1>Hello World!</h1>`。存檔後用 Chrome 打開確認畫面有顯示標題、分頁頁籤顯示你的 `<title>`。
2. 觀看並跟著操作 Kevin Powell 的教學影片「Building Your First Web Page」（連結見下方延伸資源），一步步做出你的第一個網頁。
3. 把你寫好的樣板貼進 W3C 的 [HTML validator](https://validator.w3.org/#validate_by_input) 檢查。validator（驗證器）會逐行檢查你的 markup（標記）是否正確，並回報諸如「少了結束標籤」「多餘空格」等語法問題——這是很好的自我學習工具，能幫你發現平常沒察覺的壞習慣。

</div>

## 原文與延伸資源

- 原文：[HTML Boilerplate](https://www.theodinproject.com/lessons/foundations-html-boilerplate)
- 本課引用：
    - [MDN：`<html>` 根元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/html)
    - [MDN：`<head>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/head)
    - [W3C HTML validator（驗證器）](https://validator.w3.org/#validate_by_input)
    - 影片（未在本文抓取，僅列出）：Kevin Powell — [Building Your First Web Page](https://www.youtube.com/watch?v=V8UAEoOvqFg&t=93s)

---

> 本講義改寫自 The Odin Project《HTML Boilerplate》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
