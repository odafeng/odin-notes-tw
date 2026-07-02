---
title: 連結與圖片
source_url: https://www.theodinproject.com/lessons/foundations-links-and-images
source_file: vendor/curriculum/foundations/html_css/html_foundations/links_and_images.md
path: foundations
course: Foundations
order: 18
status: draft
generated: 2026-07-02
---

# 連結與圖片

> 改寫自 The Odin Project：[Links and Images](https://www.theodinproject.com/lessons/foundations-links-and-images)
> ｜Foundations › HTML Foundations

## 學習目標

讀完這課你應該能：

- 用 anchor（錨點）element 建立指向其他網站頁面的連結。
- 用相對路徑建立指向自己網站內其他頁面的連結。
- 清楚說明 absolute link（絕對連結）與 relative link（相對連結）的差別，並在路徑中正確使用 `./` 與 `../`。
- 用 `<img>` element 在頁面上顯示圖片，並理解 `src` 與 `alt` 這兩個必備 attribute（屬性）的用途。
- 說明為什麼要在 `<img>` 上加 `width` 與 `height`，以及開新分頁時 `target` 帶來的安全性考量。
- 認識網頁上四種主要的圖片格式（JPG、GIF、PNG、SVG）分別適合什麼場合。

## 核心概念

### 什麼是連結，為什麼重要

連結（link）是 HTML 最核心的功能之一。正因為頁面之間可以彼此連結，整個網際網路才會像一張「網」（web）一樣互相牽連。這一課我們要學會怎麼做出連結，並且用圖片替網頁增添視覺內容。

### anchor element 與 href attribute

要在 HTML 裡建立連結，使用的是 **anchor element**，寫法是用一組 `<a>` tag（標籤）把想變成連結的文字（或其他 element）包起來：

```html
<a>About The Odin Project</a>
```

不過只有這樣，點下去不會有任何反應。原因是：光憑一個 `<a>` tag，瀏覽器並不知道你想連到哪裡，你必須告訴它目的地。這就要靠 **attribute（屬性）**。

attribute 是「附加在 element 上的額外資訊」，一定寫在 element 的開頭 tag（opening tag）裡。它通常由兩個部分組成：一個「名稱」和一個「值」，中間以 `=` 連接，值用引號包住；但不是每個 attribute 都需要值。

要指定連結目的地，我們加上 **`href`**（hypertext reference，超文本參照）attribute，它的值就是你要連過去的位址：

```html
<a href="https://www.theodinproject.com/about">About The Odin Project</a>
```

小提醒：沒有 `href` 的 anchor 文字，看起來會跟一般文字一樣；一旦加上 `href`，瀏覽器就會自動把它變成藍色並加上底線，表示這是可以點的連結。另外，anchor 不只能連到 HTML 頁面，也能連到影片、PDF、圖片等各種網路資源，只是實務上最常連到的還是其他 HTML 文件。

### 在新分頁開啟連結：target 與 rel

預設情況下，點連結會在「同一個分頁」直接跳走。如果想在新分頁（或新視窗，實際行為看瀏覽器設定）開啟，只要再加一個 **`target`** attribute。`href` 決定「連去哪」，`target` 則決定「在哪裡開」。它的預設值是 `_self`（在目前分頁開啟），改成 `_blank` 就會開新分頁：

```html
<a href="https://www.theodinproject.com/about" target="_blank" rel="noreferrer">About The Odin Project</a>
```

注意上面偷偷多了一個 **`rel`** attribute。它用來描述「目前頁面」與「被連結頁面」之間的關係，可以帶多個值，跟安全性最相關的兩個是：

- `noopener`：防止新分頁存取原本的頁面，避免像 [tabnabbing（反向分頁劫持）](https://owasp.org/www-community/attacks/Reverse_Tabnabbing) 這類釣魚攻擊。現代瀏覽器對所有 `target="_blank"` 的連結都會自動套用這個行為，但為了相容舊瀏覽器，你仍常看到有人手動寫上。
- `noreferrer`：效果同 `noopener`，並且額外阻止把「來源頁面」的部分資訊傳給新頁面（referrer 資訊有時不適合外洩）。

所以只要你用 `target="_blank"` 開新分頁，就應該一併考慮加上 `rel="noopener"` 或 `rel="noreferrer"`，這是使用 `target` 時最重要的安全性習慣。

### 絕對連結與相對連結

我們建立的連結大致分兩種：連到「別人網站」的頁面，以及連到「自己網站」內的其他頁面。

**絕對連結（absolute link）** 指向網際網路上其他網站的頁面，結構是 `scheme://domain/path`。它一定包含 scheme（協定）與 domain（網域）。以 MDN 的說明為例，一個完整 URL 像 `https://developer.mozilla.org/en-US/docs/Learn` 可以拆成：

- **scheme（協定）**：`https://`，決定用什麼協定取得資源，常見的是 `https`（加密）與 `http`。
- **domain（網域／authority）**：`developer.mozilla.org`，也就是伺服器位址。
- **path（路徑）**：`/en-US/docs/Learn`，資源在該伺服器上的位置。

我們先前連到 The Odin Project 的 About 頁 `https://www.theodinproject.com/about` 就是絕對連結，因為它同時含有 scheme 和 domain。

**相對連結（relative link）** 指向「自己網站」內的其他頁面。因為是同一個網站，它不需要寫 domain，瀏覽器會自動假設 domain 跟目前這頁一樣。相對連結只需要寫出「相對於目前頁面」的檔案路徑。

舉例：假設同一個資料夾裡有 `index.html` 和 `about.html`，因為兩者在同一層，`index.html` 裡就能直接用檔名當作 `href`：

```html
<a href="about.html">About</a>
```

但實務上我們通常會把網站整理得更有條理：只把 `index.html` 放在根目錄，其他 HTML 檔各自收進子資料夾。假設把 `about.html` 移進 `pages/` 資料夾，連結就得更新成新的相對位置：

```html
<a href="pages/about.html">About</a>
```

大多數情況這樣就能運作，但偶爾仍會踩到非預期的問題。在前面加上 `./`（代表「從目前這個資料夾開始找」）通常能避免這類狀況，也讓意圖更清楚：

```html
<a href="./pages/about.html">About</a>
```

### 一個好記的比喻

絕對／相對連結不容易一下建立好直覺，用比喻會清楚很多：把 domain（`town.com`）想成一座「城鎮」，網站所在的資料夾（`/museum`）想成一間「博物館」，每個頁面就是博物館裡的一個「房間」（例如 `/museum/movie_room.html`、`/museum/shops/coffee_shop.html`）。

相對連結像 `./shops/coffee_shop.html`，就是「從你現在這個房間走到另一個房間」的指路。絕對連結則是包含協定（`https`）、網域（`town.com`）與完整路徑的「全套地址」：`https://town.com/museum/shops/coffee_shop.html`，不管你人在哪都能照著走到。

### 用 img element 顯示圖片

只能顯示文字的網站會很無趣。要在 HTML 裡放圖片，使用 **`<img>` element**。它跟前面碰過的 element 不太一樣：`<img>` 是 **void element（空元素）**，本身天生沒有內容，所以不需要結尾 tag。

它不是用「開頭＋結尾 tag 包內容」的方式，而是透過 **`src`**（source，來源）attribute 告訴瀏覽器圖片檔在哪。`src` 的運作方式跟 anchor 的 `href` 很像，同樣能用絕對路徑或相對路徑。例如把一張放在 `images/` 資料夾裡、名為 `dog.jpg` 的圖片放進頁面：

```html
<img src="./images/dog.jpg">
```

小叮嚀：使用網路上的圖片時，務必確認它「可自由用於你的用途」。很多圖片是免費的，但你仍應檢視授權條件，並適當標註原作者（例如在 repository 的 README 裡註明作者姓名與來源）。

### 用 ../ 存取上層（父）資料夾

如果想在 `pages/about.html` 裡也放同一張 `dog.jpg`，就有問題了：`about.html` 在 `pages/` 裡，而 `images/` 在它的「上一層」。要往上一層走（進入父資料夾），要在相對路徑裡用兩個點 `../`：

```html
<img src="../images/dog.jpg">
```

拆解這條路徑：先用 `../` 從 `pages/` 回到它的父資料夾（專案根目錄），再進入 `images/`，最後拿到 `dog.jpg`。延續前面的博物館比喻，`../` 就像先走出目前的房間、回到主走廊，才能再走進另一個房間。

### alt attribute：一定要有的替代文字

除了 `src`，每個 `<img>` 都應該再加一個 **`alt`**（alternative text，替代文字）attribute。所以圖片「一定要有的兩個 attribute」就是 `src` 和 `alt`。

`alt` 用來描述圖片內容，作用有兩個：當圖片因故無法載入時，瀏覽器會改顯示這段文字；而對使用螢幕閱讀器（screen reader）的視障使用者來說，它會被朗讀出來，讓對方知道圖片是什麼。這是網頁無障礙（accessibility）的基本要求。

```html
<img src="./images/dog.jpg" alt="一隻棕色的狗坐在草地上">
```

### 用 width 與 height 避免版面跳動

雖然不是硬性規定，但在 `<img>` 上指定 `width`（寬）與 `height`（高）attribute 是個好習慣，即使圖片本來就是正確尺寸、或你打算用 CSS 調整大小也一樣。原因是：瀏覽器在圖片還沒載入完成前，若知道它會佔多大空間，就能先把版面排好，避免圖片載入時整頁「跳動、閃爍」。指定時請填圖片的實際尺寸：

```html
<img src="./images/dog.jpg" alt="一隻棕色的狗" width="640" height="480">
```

### 四種主要的網頁圖片格式

在網頁上用圖片，最常見的有四種格式，選對格式能兼顧品質與檔案大小：

- **JPG（JPEG）**：適合「照片」與含漸層的圖。能處理龐大的色彩數量而不會讓檔案暴增，但「不支援透明」。
- **GIF**：適合「動畫」。透明只有「全透明或全不透明」兩種，沒有半透明；色彩數量有限。
- **PNG**：適合圖示、圖表、logo 等「非照片」內容。支援完整透明（含半透明像素），品質好，但拿來存照片時檔案會比 JPG 大。
- **SVG**：向量格式，可任意放大縮小都不失真，支援透明，特別適合需要響應式（responsive）縮放的場合，例如 logo 和圖示。

## 程式碼範例

下面是一個最小可執行的完整範例，把這一課的重點串起來：一個絕對連結、一個相對連結（開新分頁）、一張帶 `alt` 與尺寸的圖片。把它存成 `index.html` 用瀏覽器開啟即可。

```html
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8">
    <title>Odin 連結與圖片</title>
  </head>

  <body>
    <h1>首頁</h1>

    <!-- 絕對連結：連到別的網站，含 scheme 與 domain -->
    <a href="https://www.theodinproject.com/about">關於 The Odin Project</a>

    <!-- 相對連結：連到自己網站內的頁面，開新分頁並加上安全性 rel -->
    <a href="./pages/about.html" target="_blank" rel="noopener">關於本站</a>

    <!-- 圖片：src 指定來源、alt 描述內容、width/height 預留版面 -->
    <img src="./images/dog.jpg" alt="一隻棕色的狗坐在草地上" width="640" height="480">
  </body>
</html>
```

而在 `pages/about.html` 裡，若要引用同一張圖，因為 `images/` 在上一層，要用 `../`：

```html
<!-- 位於 pages/about.html：先用 ../ 回到父資料夾，再進 images -->
<img src="../images/dog.jpg" alt="一隻棕色的狗" width="640" height="480">
```

## 常見陷阱

!!! warning "用 target=\"_blank\" 開新分頁時，別忘了 rel"
    只寫 `target="_blank"` 而不加 `rel="noopener"` 或 `rel="noreferrer"`，在較舊的瀏覽器上，新開的分頁可能透過 `window.opener` 存取並竄改原始頁面，形成 tabnabbing 釣魚攻擊。現代瀏覽器雖已自動套用 `noopener`，但養成手動加上的習慣仍是最保險的做法。

!!! warning "路徑搞混：./ 與 ../ 是不同層"
    `./` 代表「目前這個資料夾」，`../` 代表「上一層（父）資料夾」。把圖片或頁面移到子資料夾後連結卻沒更新，是最常見的斷連原因。移動檔案後，一定要回頭檢查所有指向它的 `href` 與 `src`。

!!! warning "img 忘了寫 alt"
    `alt` 不是可有可無的裝飾。少了它，圖片載入失敗時使用者只會看到空白，螢幕閱讀器也無法向視障使用者描述內容。每一張 `<img>` 都應同時具備 `src` 與 `alt`。

## 練習

跟著下面步驟，動手做出這一課的成品：

1. 建立一個名為 `odin-links-and-images` 的資料夾，在裡面新增 `index.html`，填入基本 HTML 骨架，並在 `<body>` 放上 `<h1>Homepage</h1>`。
2. 在 `index.html` 加一個指向 `https://www.theodinproject.com/about` 的絕對連結，用瀏覽器打開確認可以點過去。
3. 在同資料夾建立 `about.html`（含基本骨架與 `<h1>About Page</h1>`），並在 `index.html` 用相對連結 `about.html` 連過去，測試是否正常。
4. 新增 `pages/` 資料夾，把 `about.html` 移進去，觀察連結斷掉；接著把 `href` 更新為 `./pages/about.html` 讓它恢復。
5. 建立 `images/` 資料夾，放一張圖片並命名為 `dog.jpg`（記得使用授權允許的圖片並標註來源），在 `index.html` 用 `<img src="./images/dog.jpg">` 顯示它。
6. 替這張圖片補上 `alt` 替代文字，以及 `width` 與 `height`（填實際尺寸）。
7. 在 `pages/about.html` 裡用 `<img src="../images/dog.jpg">` 引用同一張圖，體會 `../` 如何往上一層存取父資料夾。
8. 觀看 Kevin Powell 的三支影片（HTML Links、HTML Images、File Structure），再讀 Interneting is Hard 的 Links and Images 一文，特別留意「四種主要圖片格式」那一段。

## 原文與延伸資源

- 原文：[Links and Images](https://www.theodinproject.com/lessons/foundations-links-and-images)
- 本課引用：
    - [MDN：What is a URL](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL) — URL 的組成（scheme／domain／path）與絕對、相對連結。
    - [Interneting is Hard：Links and Images](https://internetingishard.netlify.app/html-and-css/links-and-images) — 圖片實作與四種主要圖片格式（JPG／GIF／PNG／SVG）。
    - [OWASP：Reverse Tabnabbing](https://owasp.org/www-community/attacks/Reverse_Tabnabbing) — `target="_blank"` 的安全性風險。
    - [MDN：Referer header 的隱私與安全考量](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Referer_header:_privacy_and_security_concerns) — `noreferrer` 相關背景。
    - Kevin Powell 影片（延伸觀看，未於本文抓取）：[HTML Links](https://www.youtube.com/watch?v=tsEQgGjSmkM)、[HTML Images](https://www.youtube.com/watch?v=0xoztJCHpbQ)、[File Structure](https://www.youtube.com/watch?v=ta3Oxx7Yqbo)。

---

> 本講義改寫自 The Odin Project《Links and Images》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
