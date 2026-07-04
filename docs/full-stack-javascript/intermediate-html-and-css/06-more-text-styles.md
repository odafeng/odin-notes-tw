---
title: 更多文字樣式
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-more-text-styles
source_file: vendor/curriculum/intermediate_html_css/intermediate_css_concepts/more_text_styles.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 6
generated: 2026-07-03
---

# 更多文字樣式

> 改寫自 The Odin Project：[More Text Styles](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-more-text-styles)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Intermediate CSS Concepts

## 核心概念

在 Foundations 階段，你已經學過用 `font-family` 換字型、用 `font-size`、`color` 等屬性做基本的文字排版。這一課要補上兩塊：一是「怎麼在網頁裡使用非系統內建的字型（web font，網頁字型）」，二是「幾個常用但之前沒提過的文字樣式屬性」。這些屬性單獨看都很簡單，重點在於理解它們的行為與取捨。

### 字型的 fallback（後備）機制

先建立一個關鍵觀念：**你在 CSS 裡指定的字型，不保證使用者的裝置上有安裝**。`font-family` 接受的其實是一串「字型清單」，瀏覽器會由左到右逐一嘗試，用第一個「使用者電腦上有安裝、且能載入」的字型來顯示。這串清單就叫做 font stack（字型堆疊）。

```css
h1 {
  font-family: "Times New Roman", Georgia, serif;
}
```

上面這行的意思是：優先用 Times New Roman；沒有的話退而求其次用 Georgia；再沒有就用系統的通用襯線字型（serif）。清單最後那個像 `serif`、`sans-serif`、`monospace` 的關鍵字叫 generic family（通用字型家族），它保證一定有對應字型，是整串清單的最終保險。

**如果你完全不寫 fallback**，一旦指定的字型不存在，瀏覽器就會退回 HTML 的預設字型（通常是 Times New Roman 這類襯線字型），畫面往往會變得很醜、很不搭。所以「字型清單一定要有合理的 fallback」是這一課從頭到尾都會強調的原則。

### system font stack（系統字型堆疊）

有一種很受歡迎的做法，是刻意不用任何自訂字型，而是直接借用「使用者作業系統本身介面所用的字型」。因為每個系統的 UI 字型都是為了在該系統上好讀而精挑細選的（macOS、Windows、Android 各不相同），借來當網頁內文字型通常會得到乾淨、中性、又符合使用者習慣的效果。CSS-Tricks 整理過一份常見的 system font stack：

```css
body {
  font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
```

這串看起來很誇張的清單，用意就是「一路往下找，直到命中該系統實際安裝的介面字型」。例如在新版 macOS 上會命中 `system-ui`（對應到 San Francisco），在 Windows 上命中 `Segoe UI`，在 Android 上命中 `Roboto`。最後幾個 emoji 字型則負責讓表情符號正常顯示。system font stack 的最大好處是**零下載、零載入延遲**：這些字型本來就在系統裡，網頁不需要額外下載任何字型檔。如果你的設計不特別依賴某個品牌字型，優先考慮 system font stack 幾乎不會錯。

### web font：把非內建字型帶進網頁

有時你就是想用某個系統不會內建的特定字型（品牌指定、設計需求等）。這時就要「把字型檔匯入網頁」，讓它在你的 `font-family` 裡可以被引用到。匯入方式主要有兩種：**用線上字型庫**，或**自行託管（self-host）字型檔**。無論哪一種，匯入之後用法都一樣，就是把字型名字寫進 `font-family` 清單裡。

同樣要記住：**web font 也一定要加 fallback**。你連到的是外部來源，不能保證那個網址永遠不變、那個 API 永遠不掛。萬一字型載入失敗，有合理的 fallback 至少能讓網頁不至於完全崩壞。另外，匯入的字型檔需要「下載」，會帶來效能負擔（下面會談），所以**若設計允許，優先用 font stack；真的需要特定字型時，才用 web font**。

#### 方法一：線上字型庫

最簡單的方法是用線上字型庫。流程是：到字型庫網站挑一個字型，複製它給你的匯入片段貼進你的專案。你會拿到兩種形式之一。一種是放進 HTML `<head>` 的 `<link>` 標籤：

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
  rel="stylesheet"
/>
```

另一種是可以放在 CSS 檔最上方的 `@import`：

```css
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
```

貼好之後，就能在 CSS 裡直接寫 `font-family: "Roboto", sans-serif;`。常見的字型庫包括 [Font Library](https://fontlibrary.org/)、[Font Bunny](https://fonts.bunny.net/)、[Google Fonts](https://fonts.google.com/) 等。

不過使用字型庫有一個容易被忽略的重點：**隱私與法規合規**。字型庫在提供字型時，通常會取得使用者的 IP 位址等資料。實際案例是——德國法院曾判定「網站直接嵌入 Google Fonts API」違反歐盟的 GDPR（一般資料保護規則），因為它在使用者不知情下把 IP 傳給了 Google。如果你的專案需要顧及這類法規，解法是：**把字型從字型庫下載下來，改成自行託管**，這樣使用者的瀏覽器只會連到你自己的伺服器，不會把資料送給第三方。

#### 方法二：self-hosted（自行託管）字型

你也可以把字型檔下載下來放進自己的專案，用 `@font-face` 規則來定義它，之後就能像任何字型一樣使用：

```css
@font-face {
  font-family: my-cool-font;
  src: url(../fonts/the-font-file.woff);
}

h1 {
  font-family: my-cool-font, sans-serif;
}
```

`@font-face` 是一個 at-rule（at 規則）：`font-family` 這裡是「你替這個字型自訂的名字」（之後就用這個名字引用），`src` 則指向字型檔的路徑。定義好之後，`h1` 就能用 `my-cool-font`，後面照樣接上 `sans-serif` 當 fallback。

self-host 通常比依賴第三方字型 API 更可靠（少了一個外部相依），也能避開前面說的隱私問題，但**仍然建議保留 fallback**。

實務上你常會用「一個 `@font-face` 對應一種粗細/樣式」的方式，把常規、粗體、斜體分開宣告，並補上 `format()`、`font-weight`、`font-style`、`font-display` 等描述子（descriptor），讓瀏覽器更精準地挑檔案：

```css
@font-face {
  font-family: "MyCoolFont";
  src:
    url("../fonts/mycoolfont.woff2") format("woff2"),
    url("../fonts/mycoolfont.woff") format("woff");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

`src` 裡可以列出多個檔案，瀏覽器會用它支援的第一個格式。順序上把最新、最有效率的 **WOFF2** 放前面，再放 WOFF 當較舊瀏覽器的後備。字型檔有很多格式（TTF、OTF、WOFF、WOFF2、EOT、SVG 等），但並非每種都被所有瀏覽器支援，選格式時要留意相容性。對現代網頁而言，WOFF2 幾乎是首選：它壓縮率最好、瀏覽器支援也很普及。

#### font-display：字型載入時要顯示什麼

web font 需要下載，下載完成前那段時間，文字該怎麼辦？這正是 `font-display` 在處理的問題。它幾個常用值代表不同取捨：

- `swap`：先用 fallback 字型立刻把文字顯示出來，等 web font 下載好再換上去。優點是文字不會有「隱形空白期」，缺點是換字型的瞬間可能有輕微跳動。這是最常見、對可讀性最友善的選擇。
- `optional`：效能優先。先用 fallback 立刻顯示，如果 web font 沒能很快下載好，就乾脆不換了。好處是幾乎不會造成版面位移（layout shift），適合內文。
- `block`：品牌一致性優先。文字會先「隱形」一小段時間（最多約 3 秒），等 web font 好了才顯示。能避免換字型的跳動，代價是初次看到文字會慢一點。

不設 `font-display` 時，很多瀏覽器的預設行為接近 block，也就是可能出現一段文字看不見的期間（俗稱 FOIT，Flash of Invisible Text）。為了避免使用者盯著空白，內文通常建議用 `swap` 或 `optional`。

#### web font 的效能重點

匯入字型是有成本的，記住幾個能減輕負擔的做法：用 `<link rel="preconnect">` 提早和字型伺服器建立連線（如上面 Google Fonts 範例）、優先使用 WOFF2、對字型做 subset（子集化，只保留你會用到的字元）以縮小檔案、用適當的 `font-display` 避免隱形文字與版面跳動。簡言之：**能用 system font stack 就別下載字型；一定要下載時，就把它載得又快又不擾民**。

### 更多文字樣式屬性

以下這些屬性都很直觀，主要是擴充你的工具箱。

#### font-style

`font-style` 最常見的用途是把字型變成斜體（italic）。這裡有個重要的觀念要釐清：你在 Foundations 學過 HTML 的 `<em>` 標籤，它顯示出來也是斜體——但 `<em>` 不只是「斜體」，它同時代表這段文字**在語意上有強調（emphasis）意味**。

判斷準則是：**如果你只是想要「視覺上」斜體（或粗體、底線、highlight 等），用 CSS 屬性；如果這段文字在意義上需要被強調，用對應的 HTML 元素。** 例如「想讓所有標題都是斜體」純粹是外觀需求，該用 `font-style`：

```css
h1 {
  font-style: italic;
}
```

而「想在句子中間強調某個詞」是語意需求，該用 `<em>`。同一句話強調不同的詞，意思會完全不同，這正是 `<em>` 存在的價值：

```html
<p>I <em>never</em> said he stole your money</p>
<p>I never said <em>he</em> stole your money</p>
<p>I never said he stole <em>your</em> money</p>
```

#### letter-spacing

`letter-spacing`（字母間距）調整一個詞裡字母與字母之間的間隔。它常用來微調自訂字型（覺得某個字型的字距太擠或太鬆時），也能在標題等場合做出美觀的效果。

```css
h1 {
  letter-spacing: 0.1em;
}
```

用它要節制、要小心——不要為了風格而讓內文變得難讀。

#### line-height

`line-height`（行高）調整「換行後」上下兩行文字之間的距離。內文加一點行高，通常能明顯提升可讀性，讓段落不至於擠成一團。

```css
p {
  line-height: 1.5;
}
```

`line-height` 常用「不帶單位的數字」來寫（如 `1.5`），代表「字型大小的 1.5 倍」，這種寫法在繼承時行為最一致，是內文行高的推薦做法。

#### text-transform

`text-transform` 改變文字的大小寫。例如強制讓標題全部大寫，或讓每個單字的字首大寫：

```css
h1 {
  text-transform: uppercase; /* 全部大寫 */
}
```

常見的值有：`uppercase`（全大寫）、`lowercase`（全小寫）、`capitalize`（每個單字字首大寫）、`none`（不改變）。它只影響「顯示」，不會改動 HTML 原始文字內容。

#### text-shadow

`text-shadow` 替選取元素裡的文字加上陰影。它最好用得節制，但在標題或裝飾性文字上能有很好的效果。語法依序是：水平位移、垂直位移、模糊半徑、顏色。

```css
h1 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  /* 向右 2px、向下 2px、模糊 4px、半透明黑色 */
}
```

前兩個值是必填（陰影相對文字的偏移量），模糊半徑與顏色可省略。

#### ellipsis（用 text-overflow 做省略號截斷）

這一項不是單一屬性，而是一個實用小技巧：當文字在容器裡放不下時，用 `text-overflow` 把溢出的部分截斷並顯示成省略號（…）。要注意的坑是——文字預設「印到容器外面」在技術上並不算 `overflow`（溢出），所以只寫 `text-overflow` 沒有用，必須搭配另外兩個屬性才能真正觸發截斷：

```css
.overflowing {
  white-space: nowrap; /* 不換行，逼文字擠在一行 */
  overflow: hidden; /* 隱藏超出容器的部分 */
  text-overflow: ellipsis; /* 把被截掉的地方顯示成省略號 */
}
```

三者缺一不可：`white-space: nowrap` 讓文字不換行、進而超出容器；`overflow: hidden` 才會產生真正的 overflow；最後 `text-overflow: ellipsis` 把截斷處換成「…」。這段語法很難憑記憶背出來，需要時再查即可。

## 程式碼範例

下面是一個小型可執行範例，把這一課的重點串在一起：system font stack 當內文、self-hosted web font 當標題、以及各種文字樣式屬性。把它存成 `.html` 檔用瀏覽器開啟即可（`@font-face` 的字型檔路徑請換成你自己實際有的檔案，沒有字型檔時標題會自動 fallback 到 `sans-serif`）。

```html
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <title>更多文字樣式範例</title>
    <style>
      /* 自行託管的網頁字型：載入失敗時會退回 sans-serif */
      @font-face {
        font-family: "MyHeading";
        src: url("fonts/my-heading.woff2") format("woff2");
        font-display: swap; /* 先用 fallback 顯示，字型好了再換上 */
      }

      /* 內文用 system font stack，零下載、乾淨中性 */
      body {
        font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        line-height: 1.6; /* 行高提升可讀性 */
        max-width: 40ch;
        margin: 2rem auto;
      }

      h1 {
        font-family: "MyHeading", sans-serif; /* web font + fallback */
        font-style: italic; /* 純外觀斜體，用 CSS */
        letter-spacing: 0.05em; /* 標題字距微調 */
        text-transform: uppercase; /* 全部大寫 */
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
      }

      /* 單行溢出時以省略號截斷 */
      .title-in-card {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 200px;
        border: 1px solid #ccc;
        padding: 4px 8px;
      }
    </style>
  </head>
  <body>
    <h1>Text Styles</h1>
    <p>
      這是一段內文示範，行高設為 1.6，讀起來比較不擁擠。想在句中
      <em>強調</em> 某個詞時，用語意標籤 em 而不是 CSS 斜體。
    </p>
    <p class="title-in-card">
      這是一個很長很長的標題會被省略號截斷顯示不完的內容
    </p>
  </body>
</html>
```

## 常見陷阱

!!! warning "只寫 text-overflow: ellipsis 不會生效"
    省略號截斷需要三件事一起做：`white-space: nowrap`（不換行，逼出溢出）、`overflow: hidden`（產生真正的 overflow）、`text-overflow: ellipsis`（把截斷處變成 …）。只寫最後一行完全沒效果，因為文字印到容器外預設不算 overflow。

!!! warning "字型清單忘了 fallback"
    無論是內建字型還是 web font，`font-family` 都應以通用字型家族（`serif`、`sans-serif`、`monospace`）收尾。web font 依賴下載或外部來源，一旦網址失效或 API 掛掉，沒有 fallback 的頁面會退回醜陋的預設字型甚至一片空白。

!!! warning "該用語意標籤時卻用了 CSS"
    想要斜體就用 `font-style: italic`，但若這段文字在意義上需要被「強調」，該用 `<em>`（強調）或 `<strong>`（重要）。反過來，只為了外觀就濫用 `<em>`/`<strong>` 也不對——外觀交給 CSS，語意交給 HTML。

!!! warning "直接嵌入 Google Fonts 可能違反 GDPR"
    直接連到 Google Fonts API 會把使用者 IP 傳給第三方，德國法院已判定此舉違反 GDPR。若需顧及隱私法規，改成把字型下載下來自行託管（self-host），讓瀏覽器只連你自己的伺服器。

!!! warning "為了風格犧牲可讀性"
    `letter-spacing`、`text-shadow`、大量 web font 都要節制使用。字距過大或過小、陰影太重都會讓內文難讀。文字樣式的第一原則永遠是「讓人讀得下去」。

## 練習

1. 讀 MDN 的 [Web fonts 文章](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Web_fonts) 並照著做裡面的練習：親手用 `@font-face` 匯入一個自行託管的字型，體會 `src`、`format()`、`font-family` 之間的關係，也試著改用 Google Fonts 的 `<link>` 方法比較兩者差異。
2. 讀 [Font Best Practices](https://web.dev/articles/font-best-practices)，理解匯入字型的效能考量：`font-display` 各值的差別、`preconnect` 與 `preload` 的作用、為什麼優先用 WOFF2 與 subset，以及如何避免隱形文字（FOIT）和版面位移。
3. 讀 [web.dev Typography](https://web.dev/learn/design/typography)，掌握開發者在排版上該注意的重點（行長、行高、對比、可讀性等）。
4. 動手做：拿任一個練習專案，把內文換成 system font stack、標題換成一個 web font（記得加 fallback 與 `font-display: swap`），再套用 `letter-spacing`、`line-height`、`text-transform`、`text-shadow`，並替某張卡片標題加上省略號截斷。完成後對照本課「常見陷阱」逐項自我檢查。

## 原文與延伸資源

- 原文：[More Text Styles](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-more-text-styles)
- 本課引用：
  - [MDN：Web fonts](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Web_fonts)
  - [web.dev：Font best practices](https://web.dev/articles/font-best-practices)
  - [web.dev：Learn Typography](https://web.dev/learn/design/typography)
  - [CSS-Tricks：System font stack](https://css-tricks.com/snippets/css/system-font-stack/)
  - [MDN：text-transform](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
  - [MDN：text-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow)
  - [MDN：`<em>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/em)
  - [CSS-Tricks：Truncate string with ellipsis](https://css-tricks.com/snippets/css/truncate-string-with-ellipsis/)

---

> 本講義改寫自 The Odin Project《More Text Styles》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
