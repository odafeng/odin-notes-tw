---
title: 瀏覽器相容性
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-browser-compatibility
source_file: vendor/curriculum/intermediate_html_css/intermediate_css_concepts/browser_compatibility.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 12
status: draft
generated: 2026-07-03
---

# 瀏覽器相容性

> 改寫自 The Odin Project：[Browser Compatibility](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-browser-compatibility)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Intermediate CSS Concepts

## 核心概念

當你寫出一份網頁時，很容易假設「我在自己電腦上看到的樣子，就是所有人看到的樣子」。但事實並非如此。你的使用者會用五花八門的環境打開這個網頁：桌機上的 Chrome、Microsoft Edge、Firefox、Safari，手機上的 iOS Safari、Android Chrome，甚至還有各種螢幕尺寸、作業系統版本與輔助科技（如螢幕閱讀器）。**Browser compatibility（瀏覽器相容性）** 談的就是：如何讓同一份程式碼，在這些不同環境裡都能正常運作、提供可接受的體驗。

### 一段簡短的瀏覽器歷史

現代網頁瀏覽的起點是 1990 年 12 月釋出的 **WorldWideWeb** 瀏覽器，由當時任職於歐洲核子研究組織（CERN）的 Tim Berners-Lee 撰寫。為了避免和「World Wide Web」這個概念混淆，它後來改名為 **Nexus**。Nexus 是史上第一個瀏覽器，已經能檢視基本的 style sheet、閱讀新聞群組，甚至有拼字檢查功能。

接下來十年，Mosaic 迅速竄紅成為當時最流行的瀏覽器，隨後 Opera、Netscape Navigator 相繼問世，全球資訊網開始爆炸性成長。1995 年 **Internet Explorer（IE）** 登場並一舉稱霸市場，巔峰時期市佔率超過 90%。為了對抗這股壟斷，Netscape 催生了後來維護 Firefox 的 **Mozilla Foundation**；2003 年 Apple 推出 **Safari**，2008 年 Google 推出 **Chrome**。時至今日，瀏覽器之間的競爭依然激烈，但 Chrome（以及其底層的開源專案 **Chromium**）已是市場上最主要的贏家。

> 這回答了一個 knowledge check：**目前使用最廣的瀏覽器是 Chrome**；而**第一個瀏覽器最初的名字是 WorldWideWeb**（後改名 Nexus）。

### 為什麼同一份程式碼會有不同表現？

關鍵在於 **rendering engine（渲染引擎）**，也就是瀏覽器把 HTML、CSS、JavaScript「畫」成畫面的核心程式。不同瀏覽器用不同的引擎：

- **Blink**：Chrome 與所有 Chromium 系瀏覽器（Edge、Brave、Opera 等）使用。
- **WebKit**：Safari 使用（Blink 其實是從 WebKit 分支出來的）。
- **Gecko**：Firefox 使用。

因為引擎不同，同樣的 CSS 屬性可能有些微差異，或某個新功能在 A 引擎已支援、在 B 引擎還沒。由於 Chrome 市佔率極高，絕大多數應用都以「在 Chromium 上跑得順」為第一優先，其他瀏覽器往往是次要考量——這正是相容性問題的根源。好消息是，對 Chromium 系瀏覽器來說，只要在 Chrome 能動，通常在 Edge、Brave 等相關瀏覽器也能動。

在 1990 年代，這個問題嚴重得多。當時沒有統一標準，同一個網站在不同瀏覽器可能長得完全不同，甚至完全不能用。開發者得為「每一個瀏覽器」各寫一套調整，而不是每個團隊都有足夠資源這樣做。

### CSS 新功能是怎麼進到瀏覽器裡的？

制定網頁標準的權威機構是 **W3C（World Wide Web Consortium，全球資訊網協會）**。W3C 負責發展 CSS 的新功能，並和整個 web 社群、以及開發瀏覽器的公司密切協作。當標準演進、開發者開始在專案裡採用新功能時，各家瀏覽器就必須跟上、提供支援；若某家瀏覽器遲遲不支援、導致使用者體驗變差，使用者可能就轉投競爭對手了。也因此，一個新的 CSS 功能通常不會「一夕之間」到處都能用，而是各引擎依自己的節奏逐步實作。

### 什麼時候用新功能才安全？

嘗鮮很興奮，但操之過急有風險。想像一下：你的應用原本在 Firefox 跑得好好的，某次改動用了太新的功能，結果變成 Firefox 完全不能用、只有 Safari 正常——這對使用者是很糟的體驗。

避免這種狀況的核心工具是 **[Can I Use](https://caniuse.com/)**。它彙整了各項 HTML/CSS/JS 功能在「哪些瀏覽器、哪些版本、哪些平台」上的支援度統計。使用原則很簡單：**當一個功能已被大多數主流瀏覽器支援時，再放心採用**，這樣踩到大量使用者受影響的雷的機率就低很多。除了 Can I Use，MDN 的相容性表格（每個屬性頁面底部的 Browser compatibility 區塊）也是同等重要的查詢來源。

值得建立的一個心態是：**你不是你的使用者**。你用的可能是一台效能強悍、瀏覽器永遠最新的開發機，但真實使用者的環境千差萬別。因此測試不該留到最後才做——越晚發現的相容性 bug，修起來成本越高。務實的做法是把測試「融入」開發過程，每完成一個模組就在幾個主流瀏覽器（Chrome、Firefox、Safari、Edge）快速確認一次。

### 三種面對「舊瀏覽器不支援」的策略

當目標瀏覽器清單裡有些不支援你想用的功能時，業界有三條路可走：

1. **讓所有目標瀏覽器都能用**：透過 **polyfill**（用 JavaScript 補上缺少的功能）、函式庫或多套程式碼路徑，把功能「補齊」。
2. **接受 graceful degradation（優雅降級）**：舊瀏覽器得到一個「不一樣但仍可接受」的版本。例如新瀏覽器有圓角陰影、舊瀏覽器只是方框——核心功能不受影響即可。
3. **接受有限支援**：如果團隊與利害關係人同意，就明確放棄某些冷門或過舊的瀏覽器。

實作上有一個關鍵觀念：優先用 **feature detection（功能偵測）** 而不是 **browser detection（瀏覽器偵測）**。與其去猜「這是不是 Safari」，不如直接問「這個瀏覽器支不支援這個功能」。CSS 內建的 `@supports` 語法就是為此而生（見下方範例）；JavaScript 端則常用 `if ('someFeature' in someObject)` 這類判斷。

### 行動裝置瀏覽器：不能忽略的一塊

過去 web 是「桌機優先」，但如今越來越多使用者以手機為主要上網裝置，在世界某些地區行動使用者更是絕大多數。行動裝置主要是智慧型手機與平板，主流作業系統是 Android 與 Apple 的 iOS。開發時有兩個特別要記住的重點：

1. **在 iOS 與 iPadOS 上，Safari（WebKit 引擎）幾乎是唯一「真正」的瀏覽器。** 你確實可以安裝 Chrome 或 Firefox、甚至設為預設，但它們在 iOS 上並不是完整的瀏覽器——它們底層被迫使用 Safari 的 WebKit 引擎，本質上是「換了外殼的 Safari」。這是 Apple 的 App Store 政策所規定：iOS 上禁止使用替代的瀏覽器引擎。對開發者的意義是：**要讓 Apple 使用者能正常使用你的網頁，你必須確保它在 WebKit 上能運作**。此外要注意，行動版與桌機版並非一模一樣——在桌機版 Safari 正常的專案，在手機版 Safari 上仍可能需要額外調整。

2. **螢幕尺寸的多樣性**。實體裝置多到不可能每台都拿來測，所幸瀏覽器提供「模擬裝置」功能。但要牢記一個陷阱：當你在 Chrome 裡模擬一支 iPhone 時，**你模擬的其實只有螢幕尺寸**，並不會重現該作業系統或該引擎的特定行為。換句話說，Chrome 模擬器裡一切正常，不代表真機上也一定正常。

## 程式碼範例

用 CSS 的 `@supports`（又稱 feature query，功能查詢）做 feature detection，是最典型的相容性寫法：先給所有瀏覽器一個「保底」樣式，再對支援新功能的瀏覽器疊加增強版。這正是「優雅降級／漸進增強」的具體實踐。

```css
/* 保底方案：任何瀏覽器都能理解的排版，用 flexbox */
.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-list > .card {
  /* 沒有 grid 時，每張卡片各佔約三分之一寬度 */
  flex: 1 1 30%;
}

/* 只有「支援 CSS Grid」的瀏覽器才會套用這一段，覆蓋掉上面的保底方案 */
@supports (display: grid) {
  .card-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  .card-list > .card {
    flex: none; /* grid 接手排版，取消 flex 設定 */
  }
}
```

也可以偵測「不支援」某功能，只在缺乏支援時提供替代方案：

```css
/* 只有「不支援 gap 用於 flexbox」的舊瀏覽器才進來補救 */
@supports not (gap: 1rem) {
  .card-list > .card {
    margin: 0.5rem; /* 用 margin 模擬間距 */
  }
}
```

JavaScript 端也有對應的 API，可在程式裡動態判斷：

```js
// CSS.supports() 回傳布林值，讓你在 JS 裡做同樣的 feature detection
if (CSS.supports('display', 'grid')) {
  console.log('這個瀏覽器支援 CSS Grid，可放心啟用進階排版');
} else {
  console.log('退回保底排版');
}
```

重點在於：這些寫法問的都是「功能在不在」，而不是「這是不是某個牌子的瀏覽器」。瀏覽器版本會更新、市佔會變動，但功能偵測永遠對應當下的真實能力。

## 常見陷阱

!!! warning "以為手機瀏覽器就是桌機版的縮小版"
    在 iOS／iPadOS 上，你手機裡的 Chrome、Firefox 底層全都是 WebKit（Safari 引擎），並不是它們在桌機上用的 Blink 或 Gecko。所以「桌機 Chrome 沒問題」完全不保證「iPhone 上的 Chrome 沒問題」，因為那其實是 Safari。要支援 Apple 使用者，就得針對 WebKit 測試。

!!! warning "把 Chrome 的裝置模擬器當成真機"
    Chrome DevTools 模擬 iPhone 時，只換了螢幕尺寸，並不會重現 iOS／WebKit 的實際行為。模擬器裡跑得順，上真機仍可能出問題。模擬器適合快速檢查 layout，最終驗證仍需真實裝置（或雲端真機服務如 BrowserStack）。

!!! warning "看到功能很酷就馬上全面採用"
    新 CSS 功能各引擎支援進度不一。動手前先查 [Can I Use](https://caniuse.com/) 或 MDN 的相容性表，確認你的目標瀏覽器都已支援；否則就用 `@supports` 提供保底方案，做到優雅降級，別讓少數使用者直接畫面破版。

!!! warning "用 browser detection 取代 feature detection"
    靠判斷 user agent 字串猜「這是不是某瀏覽器」既脆弱又容易過時。正確做法是直接偵測功能本身（CSS 用 `@supports`、JS 用 `CSS.supports()` 或 `in` 判斷），這樣不論瀏覽器如何改版都準確。

## 練習

**Assignment（可直接完成）**

1. 逛一遍 **[Can I Use](https://caniuse.com/)**：把你到目前為止學過的技術（例如 Flexbox、Grid、`gap`、`:has()` 等）逐一查詢，看看它們是否都已被主流瀏覽器支援。留意「支援度百分比」以及「從哪個版本開始支援」這兩項資訊。
2. 閱讀這篇談 **iOS 上瀏覽器**的文章：[about browsers on iOS（adactio.com）](https://adactio.com/journal/17428)。核心論點是：iOS 上的 Chrome、Firefox 都被迫使用 WebKit，本質上只是「換皮的 Safari」，因此 Apple 在 iOS 上等同只允許單一引擎——作者將此對比 1990 年代微軟綁定 IE 的反壟斷案，指出這對瀏覽器競爭與 web 發展的影響。

**延伸練習（動手驗證觀念）**

- 把上面的 `@supports` 範例貼進一個 HTML 檔，打開 Chrome DevTools，試著在 Rendering 面板停用某些功能，或直接把 `@supports (display: grid)` 改成一個不存在的屬性，觀察 layout 如何退回保底方案，體會「優雅降級」實際長什麼樣子。

## 原文與延伸資源

- 原文：[Browser Compatibility](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-browser-compatibility)
- 本課引用：
  - [Can I Use](https://caniuse.com/) — 查詢各功能在各瀏覽器／版本的支援度
  - [MDN：Introduction to cross-browser testing](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Introduction) — 相容性差異的成因與測試工作流程
  - [MDN：`@supports`（Feature queries）](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports) — CSS 功能偵測語法
  - [Jeremy Keith：Web browsers on iOS（adactio.com）](https://adactio.com/journal/17428) — iOS 只允許 WebKit 引擎的討論
  - [W3C 官方網站](https://www.w3.org/) — 網頁標準的制定機構

---

> 本講義改寫自 The Odin Project《Browser Compatibility》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
