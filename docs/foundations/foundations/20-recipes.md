---
title: 專案：食譜網頁（Recipes）
source_url: https://www.theodinproject.com/lessons/foundations-recipes
source_file: vendor/curriculum/foundations/html_css/html_foundations/project_recipes.md
path: foundations
course: Foundations
order: 20
generated: 2026-07-02
---

# 專案：食譜網頁（Recipes）

> 改寫自 The Odin Project：[Project: Recipes](https://www.theodinproject.com/lessons/foundations-recipes)
> ｜Foundations › HTML Foundations

## 核心概念

這是 HTML Foundations 的第一個綜合專案。前面幾課學到的 element（元素）、boilerplate、文字、清單、連結與圖片，在這一課全部一起用上。目標是做一個很陽春的「食譜網站」：一個首頁列出幾道菜的連結，每道菜有自己的頁面，頁面裡有圖片、描述、食材清單與製作步驟。

這個專案「不談美觀」。它現在會長得很樸素，因為我們還沒學 CSS。重點是把 HTML 的結構練熟；未來學到 CSS 後會再回頭把它美化。換句話說，這一課驗收的是「你能不能用語意正確的標籤把內容組織起來」，而不是排版好不好看。

### 檔案與資料夾結構

多頁面網站的第一個關鍵，是先想清楚檔案要放在哪裡。這個專案的建議結構是：

```text
odin-recipes/
├── index.html          ← 首頁（放在最外層根目錄）
└── recipes/            ← 存放各食譜頁的資料夾
    ├── lasagna.html
    ├── pancakes.html
    └── cookies.html
```

首頁 `index.html` 一定要放在專案的根目錄（top-level directory）。這有兩個原因：一是慣例上瀏覽器與伺服器會把 `index.html` 當成資料夾的預設頁；二是稍後用 GitHub Pages 發佈時，它會自動去根目錄找 `index.html` 當作網站入口。各個食譜頁則集中放進 `recipes/` 子資料夾，讓專案整齊、好維護。

### HTML boilerplate：每個頁面都要有

專案裡的「每一個」`.html` 檔都必須是一份完整的文件，都要有相同的 boilerplate。boilerplate 是 HTML 文件的最小骨架：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8">
    <title>頁面標題</title>
  </head>
  <body>
    <!-- 內容寫在這裡 -->
  </body>
</html>
```

`<!DOCTYPE html>` 告訴瀏覽器用最新的 HTML 標準來解析；`<head>` 放不會直接顯示在畫面上的中繼資料（metadata），例如字元編碼與分頁標題；`<body>` 才是使用者看得到的內容。初學常犯的錯是「只在首頁寫 boilerplate，子頁面只寫 `<h1>`」——這樣子頁面其實不是一份合法的 HTML 文件。記住：每個檔案各自獨立，都要有自己的完整骨架。

### heading 的層級

heading 有 `<h1>` 到 `<h6>` 六級，數字越小越重要。慣例上一個頁面用「一個」`<h1>` 當主標題，其餘小節用 `<h2>`、`<h3>`。在食譜頁裡，菜名適合用 `<h1>`，而「Description（描述）」「Ingredients（食材）」「Steps（步驟）」這些小節標題則用 `<h2>` 這種次級 heading。heading 的重點是「語意層級」，不是「字大字小」——不要為了讓字看起來大就亂挑 heading 等級。

### anchor 元素與相對路徑：把頁面連起來

網站之所以是「網」，靠的就是連結。連結用 anchor 元素 `<a>`，其 `href` attribute 指定要連去的目標：

```html
<a href="recipes/lasagna.html">千層麵</a>
```

這裡最關鍵的觀念是 relative path（相對路徑）——路徑是「相對於目前這個檔案所在的位置」來計算的，而不是相對於你的整台電腦。幾種常見情況：

- 同一層資料夾的檔案：直接寫檔名。例如 `index.html` 連到同層的 `about.html`，寫 `href="about.html"`。
- 往下進入子資料夾：寫「資料夾名／檔名」。首頁在根目錄，要連到 `recipes/` 裡的 `lasagna.html`，就寫 `href="recipes/lasagna.html"`。
- 往上回到上層資料夾：用 `..` 代表「上一層」。食譜頁在 `recipes/` 裡，要連回根目錄的首頁，就寫 `href="../index.html"`。`..` 可以串接，`../../` 就是往上兩層。

因此在這個專案裡會出現一對「來回連結」：首頁用 `recipes/檔名.html` 連進各食譜頁，各食譜頁再用 `../index.html` 連回首頁，讓使用者能方便地來回導覽。

相對路徑相對於「絕對 URL（absolute URL，含完整網域名稱，例如 `https://www.allrecipes.com/`）」的好處是可攜性：整個網站搬到別的網域或別的資料夾，內部連結依然有效，因為它們描述的是檔案彼此的相對位置。至於連結文字（link text），請用有意義的描述——例如直接寫菜名「千層麵」——不要寫「按這裡」，因為對螢幕報讀器（screen reader）使用者與搜尋引擎而言，含糊的連結文字毫無資訊量。

### img 元素：放上成品照片

圖片用 `<img>` 元素插入。它是 void element（空元素／自封閉元素），沒有結束標籤，內容全靠 attribute 提供：

```html
<img src="images/lasagna.jpg" alt="剛出爐、表面焦香的千層麵">
```

- `src`：圖片檔的路徑，一樣可以是相對路徑或絕對 URL。若引用網路上的免費圖片，可直接貼該圖片的完整網址。
- `alt`：替代文字（alternative text）。當圖片載入失敗、或使用者用螢幕報讀器時，瀏覽器會改用這段文字。它是無障礙（accessibility）的關鍵，應「描述圖片內容」，而不是只寫「圖片」兩個字。

### 兩種清單：食材用無序、步驟用有序

清單分兩種，選哪一種取決於「順序有沒有意義」：

- unordered list（無序清單）`<ul>`：項目之間沒有先後關係，預設以項目符號（bullet）呈現。食材清單適合用它——先放麵條還是先放起司並不影響「這是一份食材表」的意義。
- ordered list（有序清單）`<ol>`：項目有明確先後，預設以數字編號呈現。製作步驟適合用它——第 1 步要在第 2 步之前完成。

兩種清單裡的每一個項目都用 `<li>`（list item）包起來。首頁上列出多個食譜連結時，也建議把它們包進一個 `<ul>`，這樣連結會逐項換行，而不是全部擠在同一行。

### 發佈到網路：GitHub Pages

專案做完後，可以透過 GitHub Pages 免費把它發佈到網路，讓別人用瀏覽器就能看到，網址形如 `你的帳號.github.io/你的repo名稱`。做法概略是：確認根目錄有 `index.html`，到 repository 的 Settings → Pages，把發佈的 Branch（分支）從 none 改成 main 並儲存，等幾分鐘讓 GitHub 建置完成即可。注意免費帳號只能從「公開」的 repository 發佈。

## 程式碼範例

以下是一組最小但可直接開啟的範例，示範首頁與一個食譜頁如何互相連結。你可以照這個骨架擴充。

首頁 `index.html`（放在根目錄）：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8">
    <title>Odin Recipes</title>
  </head>
  <body>
    <h1>Odin Recipes</h1>

    <!-- 用無序清單把多個食譜連結逐項排好 -->
    <ul>
      <li><a href="recipes/lasagna.html">千層麵</a></li>
      <li><a href="recipes/pancakes.html">鬆餅</a></li>
      <li><a href="recipes/cookies.html">餅乾</a></li>
    </ul>
  </body>
</html>
```

食譜頁 `recipes/lasagna.html`（放在 `recipes/` 資料夾裡）：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8">
    <title>千層麵食譜</title>
  </head>
  <body>
    <!-- 用 ../ 回到上一層的首頁 -->
    <a href="../index.html">回首頁</a>

    <h1>千層麵</h1>

    <!-- 成品照片：alt 描述畫面內容 -->
    <img src="images/lasagna.jpg" alt="剛出爐、表面焦香的千層麵">

    <h2>Description（描述）</h2>
    <p>經典的義式千層麵，一層麵皮、一層肉醬、一層起司交疊烘烤而成。</p>

    <h2>Ingredients（食材）</h2>
    <!-- 食材沒有先後之分，用無序清單 -->
    <ul>
      <li>千層麵皮</li>
      <li>番茄肉醬</li>
      <li>莫札瑞拉起司</li>
    </ul>

    <h2>Steps（步驟）</h2>
    <!-- 步驟有明確順序，用有序清單 -->
    <ol>
      <li>預熱烤箱至 190°C。</li>
      <li>在烤盤依序鋪上麵皮、肉醬與起司，重複數層。</li>
      <li>送入烤箱烘烤約 40 分鐘至表面金黃。</li>
    </ol>
  </body>
</html>
```

把 `index.html` 用瀏覽器打開，點連結應能進入食譜頁；食譜頁上的「回首頁」連結應能回到 `index.html`。若連結點了沒反應或顯示找不到檔案，先檢查相對路徑與資料夾結構是否吻合。

## 常見陷阱

!!! warning "相對路徑寫錯：漏了 `../` 或多打了資料夾名"
    路徑一律「相對於目前檔案的位置」。首頁在根目錄，連到子資料夾要寫 `recipes/lasagna.html`；但食譜頁「本身已經在 `recipes/` 裡」，頁內若還想連到同資料夾的另一道菜，直接寫 `pancakes.html` 即可，不要再多寫一次 `recipes/`。要回首頁則必須用 `../index.html` 先往上一層。路徑錯誤是這個專案最常見的卡關點。

!!! warning "子頁面忘了寫完整 boilerplate"
    每個 `.html` 檔都是獨立文件，都要有自己的 `<!DOCTYPE html>`、`<html>`、`<head>`、`<body>`。不要以為首頁寫過就好，子頁面只放 `<h1>`——那樣它並不是一份合法的 HTML 文件。

!!! warning "食材與步驟用錯清單類型"
    食材沒有先後，用無序清單 `<ul>`；步驟有先後，用有序清單 `<ol>`。這是這個專案特別要驗收的語意重點，選錯類型即使畫面看起來差不多，語意也是錯的。

!!! warning "`<img>` 少了 alt，或 alt 只寫「圖片」"
    `alt` 是無障礙的關鍵，也是圖片載入失敗時的替代文字。請描述圖片實際內容（例如「剛出爐的千層麵」），不要留空或只寫「圖片」。

## 練習

完整的專案需求以原文為準：[Project: Recipes](https://www.theodinproject.com/lessons/foundations-recipes)。以下是把原文 Assignment 改寫成的繁中步驟。

1. 建立 GitHub repository：在 GitHub 上開一個新的 repo，命名為 `odin-recipes`，用 SSH 把它 clone 到本機你的 `repos` 資料夾裡，`cd` 進專案目錄，並寫一份簡短的 `README.md` 說明這個專案做什麼、練到哪些技能。（建立檔案盡量在本機做，避免直接在 GitHub 網站上建檔造成本機與遠端版本不同步。）

2. 第一輪—初始結構：在 `odin-recipes` 裡建立 `index.html`，填入標準 boilerplate，並在 `<body>` 加一個 `<h1>Odin Recipes</h1>`。

3. 第二輪—食譜頁與互連：在 `odin-recipes` 裡建立 `recipes/` 資料夾，於其中新增一個以菜名命名的 HTML 檔（例如 `lasagna.html`，可到 Allrecipes 等網站找靈感），一樣要有完整 boilerplate，先只放一個以菜名為內容的 `<h1>`。回到 `index.html`，在 `<h1>` 下方加一個連到該食譜頁的連結 `<a href="recipes/lasagna.html">菜名</a>`；並在食譜頁的頂端或底部加一個回首頁的連結 `<a href="../index.html">回首頁</a>`。

4. 第三輪—食譜頁內容：在食譜頁的 `<h1>` 下方，依序加入成品圖片 `<img>`（記得寫 `alt`）、一個「Description」heading 加一兩段 `<p>` 描述、一個「Ingredients」heading 加一個「無序清單」的食材、一個「Steps」heading 加一個「有序清單」的步驟。

5. 第四輪—擴充更多食譜：再做兩個結構相同的食譜頁，並在首頁把所有連結補齊。建議把首頁的連結全部包進一個 `<ul>`，讓它們逐項換行而非擠成一行。

6. 一路上多做幾次 `git add` + `git commit`，有意義的變更就 commit，最後 `git push origin main` 推上 GitHub。完成後可依原文說明開啟 GitHub Pages，把網站發佈到 `你的帳號.github.io/odin-recipes`。

小提醒：先別去看別人的 Student Solutions／Community submissions。那些多半也是學習者的作品、未必是最佳實踐，而且偷看會剝奪你自己解題與查資料的練習機會。做完再回頭比較不同做法即可。

## 原文與延伸資源

- 原文：[Project: Recipes](https://www.theodinproject.com/lessons/foundations-recipes)
- 本課引用：
    - [MDN：Creating hyperlinks（建立超連結、相對與絕對路徑）](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks)
    - [MDN：`<img>` 元素參考（src 與 alt）](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)
    - [Allrecipes（可用來尋找食譜靈感）](https://www.allrecipes.com/)
    - [The Odin Project：Git Basics（設定 repository）](https://www.theodinproject.com/lessons/foundations-git-basics)

---

> 本講義改寫自 The Odin Project《Project: Recipes》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
