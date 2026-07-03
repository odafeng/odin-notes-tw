---
title: 專案：註冊表單
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-sign-up-form
source_file: vendor/curriculum/intermediate_html_css/forms/project_sign_up_form.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 16
status: draft
generated: 2026-07-03
---

# 專案：註冊表單

> 改寫自 The Odin Project：[Project: Sign-up Form](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-sign-up-form)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Forms

## 核心概念

這個專案讓你把前幾課學到的 Forms（表單）與 CSS 技巧實際組裝起來，做出一個虛構服務的「註冊表單（sign-up form）」頁面。它不是要你發明全新東西，而是把已知的積木拼成一個看起來專業的成品，並用一張設計稿當作要復刻的目標。

先看整體版面。設計稿是典型的兩欄配置：左側是一條窄的「image sidebar（圖片側欄）」，鋪滿一張全高的背景圖，圖片中央偏上疊著一個 logo 區塊；右側是較寬的主內容區，由上而下分成三段——一段介紹文字、一組表單欄位、一顆「Create Account（建立帳號）」按鈕加登入連結。動手前先花點時間在腦中把這些區塊對應到 HTML 結構，會讓後續切版順很多。

### 要用到的技巧重點

**背景圖與半透明遮罩（overlay）。** 左側側欄用 `background-image` 鋪一張圖，搭配 `background-size: cover` 讓圖片等比例填滿整塊區域（超出的部分會被裁掉），再用 `background-position: center` 把焦點固定在中央、`background-repeat: no-repeat` 避免平鋪。logo 區塊之所以看得清楚，是因為它底下是一個「深色但半透明」的 `div`——用帶 alpha 的顏色（例如 `rgb(0 0 0 / 50%)`）當背景，讓文字在忙碌的照片上仍保有可讀性。這是一個很常見的 overlay 手法。

**外部字型（external font）。** logo 文字用一款外部字型（設計稿用的是 Norse Bold，你可以換成任何喜歡的字體）。做法是把字型檔放進專案，用 `@font-face` 宣告 `font-family`，再套用到 logo 元素上。

**表單結構與語意。** 表單本體是 `<form>`，每個欄位用 `<label>` 搭配 `<input>`，並以 `for` / `id` 對應綁定，讓點擊 label 也能聚焦（focus）到對應輸入框。密碼欄位用 `type="password"`、Email 用 `type="email"`，善用 HTML 內建的欄位型別與 `required` 屬性，瀏覽器就能幫你做基本驗證。

**兩種輸入框視覺狀態。** 這是本專案最能練到「前一課驗證虛擬類別」的地方：

- 預設邊框是很淺的 `#E5E7EB`。
- 「聚焦中」的欄位用 `:focus` 給它藍色邊框與淡淡的 `box-shadow`，讓使用者清楚知道游標在哪一欄。
- 密碼欄位「輸入了不合規的值」時顯示紅色邊框，用 `:user-invalid` 處理。

`:user-invalid` 和 `:invalid` 的差別很關鍵：`:invalid` 一載入頁面、欄位還空著就立刻算「無效」而變紅，體驗很差；`:user-invalid` 只在「使用者已經和欄位互動過（或嘗試送出表單後）」才生效，所以不會在使用者還沒開始打字時就先罵人。這正是它適合做即時驗證回饋的原因。

**關於密碼比對。** 「兩次密碼要一致」這種需要比對「兩個欄位彼此」的驗證，靠純 CSS 做不到，需要 JavaScript，而表單的 JS 驗證是之後的課程才會教。這個專案階段先讓每個欄位「各自」驗證即可（例如每欄是否填了、密碼格式是否符合），不用處理兩欄互相比對。

**RWD 先不管。** 響應式設計（responsive design）也是後面才教，所以這個專案不用煩惱手機版長怎樣，專心把桌機版對著設計稿做出來就好。

## 程式碼範例

以下是把上述技巧濃縮成的最小骨架，示範版面、overlay、`:focus` 與 `:user-invalid` 怎麼兜起來。實際專案請對著設計稿調整尺寸與間距。

```html
<!-- index.html：兩欄版面骨架 -->
<div class="container">
  <!-- 左側：背景圖側欄 -->
  <aside class="sidebar">
    <div class="logo-overlay">
      <img src="odin-lined.png" alt="Odin logo" />
      <h1 class="logo-text">ODIN</h1>
    </div>
  </aside>

  <!-- 右側：主內容 -->
  <main class="content">
    <p class="intro">這是一個虛構服務的註冊頁，趕快加入我們吧！</p>

    <form class="signup">
      <label for="password">密碼</label>
      <!-- pattern 要求至少 8 碼，示範各自欄位的驗證 -->
      <input
        id="password"
        name="password"
        type="password"
        pattern=".{8,}"
        required
      />
      <button type="submit">Create Account</button>
    </form>
  </main>
</div>
```

```css
/* style.css：外部字型宣告 */
@font-face {
  font-family: "Norse Bold";
  src: url("fonts/Norse-Bold.otf") format("opentype");
}

/* 兩欄版面 */
.container {
  display: flex;
  min-height: 100vh;
}

/* 左側背景圖側欄 */
.sidebar {
  flex: 0 0 30%;                 /* 固定佔約三成寬 */
  background-image: url("bg.jpg");
  background-size: cover;        /* 等比填滿、超出裁掉 */
  background-position: center;
  background-repeat: no-repeat;
}

/* logo 底下的深色半透明遮罩，提升文字可讀性 */
.logo-overlay {
  margin-top: 180px;
  background-color: rgb(0 0 0 / 50%);   /* 帶 alpha 的黑 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-family: "Norse Bold", sans-serif;
  color: white;
}

/* 輸入框預設淺邊框 */
.signup input {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
}

/* 聚焦中：藍框 + 淡陰影 */
.signup input:focus {
  border-color: #4a90e2;
  box-shadow: 0 2px 6px rgb(74 144 226 / 40%);
  outline: none;
}

/* 使用者互動後才判定無效：紅框 */
.signup input:user-invalid {
  border-color: #d93025;
}

/* 主按鈕用設計稿指定的綠色 */
.signup button {
  background-color: #596d48;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
}
```

## 常見陷阱

!!! warning "用 `:invalid` 會讓空欄位一載入就變紅"
    `:invalid` 不管使用者有沒有互動，只要值不合規就立刻套用；空的 `required` 欄位一開頁就被視為無效而變紅，很不友善。做即時回饋請用 `:user-invalid`，它只在使用者互動過或嘗試送出後才生效。

!!! warning "想用純 CSS 比對兩次密碼是否一致，做不到"
    CSS 只能驗證「單一欄位自己」的狀態，無法比較「兩個欄位彼此」。確認兩次密碼相同需要 JavaScript（之後的課程才教）。這個階段讓每欄各自驗證即可，別卡在密碼比對上。

!!! warning "背景圖忘了設 `background-size` 與 `no-repeat`"
    只寫 `background-image` 而沒設 `background-size: cover`，圖片會用原始尺寸、通常填不滿也不好看；沒設 `background-repeat: no-repeat` 則會整片平鋪重複。側欄背景圖記得三件套一起給：`cover`、`center`、`no-repeat`。

!!! warning "半透明遮罩用 `opacity` 會把文字也一起變透明"
    如果對 overlay 的 `div` 直接設 `opacity: 0.5`，裡面的 logo 文字也會跟著半透明。正確做法是把半透明只放在「背景顏色的 alpha」上（例如 `background-color: rgb(0 0 0 / 50%)`），文字才會維持不透明、清晰可讀。

## 練習

需求細節以原文專案說明為準，這裡把 Assignment 濃縮成中文步驟：

1. **建立與規劃。** 先建好 git repository（可參考先前的專案）。建立 HTML 與 CSS 檔並放些暫時內容，確認彼此連結正確。下載 [設計稿全解析度圖檔](https://cdn.statically.io/gh/TheOdinProject/curriculum/afdbabfab03fbc34783c6b6f3920aba4a4d3b935/intermediate_html_css/forms/project_sign_up_form/imgs/sign-up-form.png)，先在腦中規劃 HTML 大致要怎麼排版。
2. **蒐集素材。** 找一張要當側欄背景的圖片下載（設計稿用的來自 [unsplash.com](https://unsplash.com/photos/25xggax4bSA)，可換成你自己選的，記得標註作者出處）。挑一款 logo 用的外部字型（設計稿用 [Norse Bold](https://www.joelcarrouche.com/fonts/norse)，也可換別的）。側欄 logo 圖可用這張 [Odin logo](https://cdn.statically.io/gh/TheOdinProject/curriculum/5f37d43908ef92499e95a9b90fc3cc291a95014c/html_css/project-sign-up-form/odin-lined.png)。
3. **切版技巧提醒。** 建議先把整頁的結構骨架搭出來，再一段一段處理各區塊。logo 後面那塊是一個深色半透明背景的 `div`，用來提升文字在背景圖上的可讀性。「Create Account」按鈕的綠色是 `#596D48`。輸入框預設邊框是很淺的 `#E5E7EB`，另有兩種變化：密碼欄位含不合規密碼時用 `:user-invalid` 顯示紅色邊框；被選中的欄位用 `:focus` 顯示藍色邊框與淡 `box-shadow`。
4. **範圍界線。** 不用管手機版（RWD 之後才教）。兩次密碼是否一致的比對需要 JavaScript（之後才教），現階段各欄位各自驗證即可。

完整需求與逐步說明請見原文專案頁面。

## 原文與延伸資源

- 原文：[Project: Sign-up Form](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-sign-up-form)
- 本課引用：
    - [MDN：`:user-invalid`](https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid) — 只在使用者互動後才生效的無效狀態虛擬類別
    - [MDN：使用多重背景與 `background-size`](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_backgrounds_and_borders/Using_multiple_backgrounds) — 背景圖 `cover` / `position` 用法
    - [MDN：`:focus`](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus) — 聚焦狀態虛擬類別
    - [MDN：`@font-face`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) — 載入外部字型

---

> 本講義改寫自 The Odin Project《Project: Sign-up Form》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
