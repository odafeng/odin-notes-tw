---
title: 自然的響應式
source_url: https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-natural-responsiveness
source_file: vendor/curriculum/advanced_html_css/responsive_design/natural_responsiveness.md
path: full-stack-javascript
course: Advanced HTML and CSS
order: 13
generated: 2026-07-03
---

# 自然的響應式

> 改寫自 The Odin Project：[Natural Responsiveness](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-natural-responsiveness)
> ｜Full Stack JavaScript › Advanced HTML and CSS › Responsive Design

## 核心概念

### 起手觀念：先「不要破壞」原本就有的彈性

做響應式網站的第一步，不是急著寫一堆 media query（媒體查詢）去針對每種螢幕尺寸調整版面，而是先採用那些「天生就有彈性」的做法。後面的課程你會學到怎麼依螢幕尺寸把頁面元素整個重排，但在多數情況下，更好的策略是先靠 Flexbox 與 Grid 這類工具，讓頁面本來就能適應各種螢幕，之後再用少量斷點處理例外。

這裡有一個很多人沒意識到的事實：**純 HTML、完全不寫任何 CSS 的頁面，本身就是響應式的**。你可以想像一個只有標題、段落、清單、圖片的純 HTML 頁面，把瀏覽器視窗縮到手機那麼窄，文字會自動換行、內容會乖乖往下堆疊，一切都正常運作，你甚至能在 Apple Watch 那麼小的螢幕上閱讀它。

當然，現實中不可能每個網站都簡單到只剩純文字。但關鍵心態是：**你用來搭建頁面的大多數 HTML 元素，在你「用 CSS 動它」之前，本來就是響應式的**。是「你」用 CSS 把這份天生的彈性弄壞的，不是它自己壞掉的。如果你帶著這個觀念做專案，並盡力維持這份自然的響應能力，你會發現要讓網站好好地響應，其實不需要額外做「那麼多」事。

換句話說，響應式設計有很大一部分不是「做加法」，而是「別做減法」——別亂加那些會鎖死彈性的 CSS。這一課接下來就是一份清單，列出幾個能幫你「保住」自然響應能力的技巧。

### viewport meta 標籤：所有響應式的前提

先講一個歷史背景。當手機剛開始能上網時，絕大多數網站根本沒為那麼小的螢幕解析度做最佳化。為了讓這些「桌機版」網站在手機上還能看，早期的手機瀏覽器採取了一個折衷手段：**假裝自己是一塊比較大的螢幕（通常約 `980px` 寬），再把整頁縮小顯示**，讓使用者看到一個縮到很小、需要放大才能讀的頁面。

但今天我們幾乎從不想要這種行為。我們希望網站以裝置「實際、未縮放」的螢幕解析度來呈現。所以你必須明確告訴瀏覽器這件事，做法是在幾乎每一個專案的 HTML `<head>` 裡放進這一行：

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

它做的事很單純：`width=device-width` 把網頁的初始寬度設成「你正在觀看的那塊螢幕的實際寬度」，`initial-scale=1` 則要求瀏覽器不要自動放大或縮小。少了這一行，你辛苦寫的響應式 CSS 與 media query 全都會抓錯尺寸，等於白做。

好消息是：如果你平常用 Emmet 產生 HTML 樣板（在編輯器裡打 `!` 再按 `Enter`），這行標籤其實早就自動幫你加好了。

### 頭號敵人：寫死的固定寬高

彈性的頭號敵人，就是在元素上寫死一個固定寬度。只要你在某個東西上放 `width: 600px`，它就「永遠」不可能縮到比 `600px` 更窄，這會直接毀掉它在多數手機螢幕上塞得下的機會。同理，把高度寫死也會出問題：一旦元素裡的內容超出那個高度，內容就會溢位（overflow）跑出框外。

當然，具體怎麼做要看情境，但很多時候有個簡單的修法：把 `width` 換成 `max-width`、把 `height` 換成 `min-height`（視情況 `min-width`、`max-height` 也可能有用）。

- **`max-width`（最大寬度）**：當你設了 `max-width`，元素「不會超過」這個寬度，但螢幕若太小塞不下，它會自動縮小去配合。這樣桌機上維持理想寬度、手機上又不會爆版，兩全其美。這正是把 `width: 600px` 換成 `max-width: 600px` 之後的差別：前者會撐爆小螢幕、逼出橫向捲軸，後者則會乖乖縮小。
- **`min-height`（最小高度）**：當你希望某個區塊「大多數情況下是 `300px` 高」，但內容變多時「寧可長高也不要溢位」，就用 `min-height: 300px` 取代 `height: 300px`。它保證了下限高度，同時保留了往下長的空間。

#### 能不設高度就別設高度

再進一步：在「大多數」情況下，你根本不該去設 height。當然有例外（例如某些 header 頁首或 footer 頁尾），但一般來說，**你應該優先用 margin 與 padding 去撐開內容周圍的空間，而不是用固定高度**。用 margin/padding 的好處是：不管裡面的內容怎麼變多變少，元素都能保持彈性、自動長高或縮短，不會因為內容超出而爆框。

#### 什麼時候固定寬度才適當

固定寬度也不是完全禁用，有些情況它反而是對的。很難訂一條放諸四海皆準的規則，但有個大方向：**寬度數字越小，寫死越沒關係**。舉例來說，頁面上一個 `32px` 的 icon 圖示，你「並不希望」它縮小，所以用 `max-width` 對它毫無意義，直接固定就好。同樣地，一個 `250px` 的側邊欄（sidebar）可能就是需要「永遠」保持 `250px`。跟所有事情一樣，你得衡量情境、挑最合適的做法，而不是無腦一律用 `max-width`。

### 善用 Flexbox 與 Grid

接下來這句話明顯到像在講廢話：Flexbox 當初「就是為了做出有彈性的版面」而被發明的。用 flex 和 grid 不保證你就能得到完美的響應式，但它們是非常有力的工具。相關屬性你在前面的課程都學過了，而其中像是 `flex-wrap`（讓子項目在空間不夠時自動換行），以及 Grid 的 `minmax()`、`auto-fill`／`auto-fit` 這類屬性，都能在幾乎不用額外寫多少程式碼的情況下，做出相當令人驚豔的響應式版面。

例如「一排卡片，螢幕寬就多擺幾張、螢幕窄就自動換行往下堆」這種常見需求，用 Grid 的 `repeat(auto-fill, minmax(200px, 1fr))` 一行就能搞定，完全不需要任何 media query。這正是「自然響應」的精神：讓版面規則本身就懂得伸縮，而不是你去枚舉每一種螢幕尺寸。

### 順帶一提：百分比不是萬靈丹

很多人以為「把 px 換成百分比（%）就等於響應式」，這是個常見誤解。百分比在某些地方很好用，但它並非總是對的選擇——因為百分比永遠是「相對於父元素某個尺寸」去算的，用錯地方反而會製造新的爆版問題（例如給每個子項目都設 `width: 33%` 卻忘了 padding/margin，加起來就超過 100%）。多數時候，Flexbox、Grid、`max-width` 這些工具比手動算百分比更穩、更省事。延伸資源裡有一篇專門談這個陷阱的文章，值得一讀。

## 程式碼範例

viewport meta 標籤（響應式的起手式，放進每一份 HTML 的 `<head>`）：

```html
<!-- width=device-width：把版面寬度設成裝置實際寬度，不用桌機虛擬寬度 -->
<!-- initial-scale=1：初始縮放比例為 1，不自動縮放整頁 -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

用 `max-width` 取代 `width`，讓區塊在小螢幕自動縮小而不爆版：

```css
/* 錯誤示範：固定寬度，螢幕比 600px 窄時會溢位、逼出橫向捲軸 */
.card-bad {
  width: 600px;
}

/* 正確做法：桌機維持 600px，小螢幕則自動縮小去配合 */
.card-good {
  max-width: 600px;
}
```

用 `min-height` 取代 `height`，讓區塊在內容變多時往下長而不溢位：

```css
/* 錯誤示範：內容一多就衝出這個框外 */
.box-bad {
  height: 300px;
}

/* 正確做法：至少 300px 高，內容多了就自己長高 */
.box-good {
  min-height: 300px;
}
```

用 Grid 做出「自動換行」的響應式卡片牆，完全不需要 media query：

```css
.gallery {
  display: grid;
  /* 每欄最小 200px、最大 1fr；空間夠就多排幾欄、不夠就自動換行往下堆 */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

/* 圖片別寫死寬度，讓它跟著容器縮，才不會在手機上被裁掉 */
.gallery img {
  max-width: 100%;
  height: auto;
}
```

## 常見陷阱

!!! warning "忘了放 viewport meta 標籤"
    少了 `<meta name="viewport" content="width=device-width, initial-scale=1">`，手機瀏覽器會用約 `980px` 的虛擬寬度渲染整頁再縮小，你寫的響應式 CSS 與 media query 全部抓錯尺寸。網站在手機上「整頁被縮得很小」時，第一個要檢查的就是這行。

!!! warning "把寬度寫死成固定 px"
    `width: 600px` 會讓元素永遠無法縮到比 600px 更窄，在小螢幕上直接爆版、逼出橫向捲軸。多數情況改用 `max-width`，讓它「上限固定、下限可縮」。

!!! warning "隨手就給元素設固定 height"
    寫死 `height` 之後，內容一變多就會溢位跑出框外。大多數情況根本不需要設高度——改用 margin 與 padding 撐開空間，讓元素跟著內容自然長高。

!!! warning "以為把 px 換成 % 就叫響應式"
    百分比是相對於父元素算的，用錯地方（例如子項目寬度加 padding 超過 100%）照樣爆版。Flexbox、Grid、`max-width` 通常比手動算百分比更可靠。

!!! warning "急著用 media query 解決一切"
    先靠 Flexbox、Grid、`max-width` 這些天生有彈性的工具把版面撐起來，只在「伸縮救不回來」的地方才動用 media query。反過來一開始就狂寫斷點，會讓 CSS 又長又難維護。

## 練習

1. 閱讀 MDN 的〈Using the viewport meta tag〉，補足關於 viewport meta 標籤與螢幕解析度本質的背景細節。原文作業指定連結：<https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag>。
2. 閱讀 Cody Loyd 的〈Using Percentages in CSS〉，了解「用百分比做響應式」這個常見陷阱。閱讀時先不用太在意文中 `@media` 的部分，media query 很快會在後續課程專門講。原文作業指定連結（Web Archive 存檔）：<https://web.archive.org/web/20251116005914/https://codyloyd.com/2021/percentages/>。
3. 動手驗證「純 HTML 本來就是響應式的」：隨手寫一個只有標題、幾段文字、一張圖片、一份清單的 HTML 檔（先別加任何 CSS），用瀏覽器打開，再把視窗寬度拉到手機那麼窄，觀察它是否自動換行、正常堆疊。接著故意在某個元素加上 `width: 600px`，重新縮小視窗，親眼看看它如何爆版、逼出橫向捲軸，再把它改成 `max-width: 600px` 對照差別。

## 原文與延伸資源

- 原文：[Natural Responsiveness](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-natural-responsiveness)
- 本課引用：
    - [MDN：Using the viewport meta tag（viewport meta 標籤用法）](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag)
    - [Cody Loyd：Using Percentages in CSS（CSS 百分比的陷阱，Web Archive 存檔）](https://web.archive.org/web/20251116005914/https://codyloyd.com/2021/percentages/)
    - [MDN：max-width（最大寬度）](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width)
    - [MDN：min-height（最小高度）](https://developer.mozilla.org/en-US/docs/Web/CSS/min-height)

---

> 本講義改寫自 The Odin Project《Natural Responsiveness》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
