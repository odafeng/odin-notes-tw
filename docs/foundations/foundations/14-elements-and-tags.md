---
title: 元素與標籤
source_url: https://www.theodinproject.com/lessons/foundations-elements-and-tags
source_file: vendor/curriculum/foundations/html_css/html_foundations/elements_and_tags.md
path: foundations
course: Foundations
order: 14
generated: 2026-07-02
---

# 元素與標籤

> 改寫自 The Odin Project：[Elements and Tags](https://www.theodinproject.com/lessons/foundations-elements-and-tags)
> ｜Foundations › HTML Foundations

## 核心概念

### HTML 負責網頁的「結構與內容」

HTML 的全名是 HyperText Markup Language（超文字標記語言）。它的工作是定義一個網頁「有什麼內容、這些內容各自是什麼角色」——也就是網頁的結構（structure）與內容（content）。你在網頁上看到的每一個段落、每一個標題、每一份清單、每一張圖片、每一個連結，背後都是由 HTML element（元素）組合出來的。

先把一件事講清楚：HTML 管的是「這是什麼」，不是「它長什麼樣子」。字要多大、顏色是紅是藍、要不要置中，這些是後面 CSS 的工作。這一課我們只專注在最底層、也最重要的觀念——element（元素）與 tag（標籤）到底是什麼。

### 標籤：包住內容的一對記號

在 HTML 裡，網頁上幾乎每一塊內容，都是被一對 tag（標籤）包起來的。標籤就是瀏覽器用來辨認「這一段內容是什麼、從哪裡開始、到哪裡結束」的記號。

標籤分成兩種：

- **Opening tag（開始標籤）**：告訴瀏覽器「一個元素從這裡開始」。它的寫法是把一個關鍵字放進一對角括號（angle brackets）`<>` 裡。例如段落（paragraph）的開始標籤就是 `<p>`。
- **Closing tag（結束標籤）**：告訴瀏覽器「這個元素到這裡結束」。它幾乎和開始標籤一模一樣，唯一的差別是在關鍵字前面多了一個斜線（forward slash）`/`。段落的結束標籤就是 `</p>`。

換句話說，`<p>` 說「段落開始」，`</p>` 說「段落結束」，中間夾住的就是這個段落的內容。

### 元素：標籤加上被包住的內容

把「一對標籤」和「中間的內容」合在一起，就構成一個完整的 element（元素）。這也回答了 knowledge check 的一個經典問題：**一個 HTML 元素由哪三個部分組成？** 答案是「開始標籤、內容、結束標籤」。

以一段最簡單的段落元素為例：

```html
<p>some text content</p>
```

拆開來看：

- `<p>` 是開始標籤（opening tag）。
- `some text content` 是被開始標籤與結束標籤包住的內容（content）。
- `</p>` 是結束標籤（closing tag）。

一個很好用的比喻是：把元素想像成一個「裝內容的容器」。開始標籤和結束標籤就像容器的上蓋與下蓋，它們一起圈出「這個容器裡裝了哪些東西」。瀏覽器讀到這個容器，就知道該怎麼理解、怎麼排版裡面的內容——是要當成一段文字、一個標題，還是清單裡的一項。

### 元素可以互相巢狀（nesting）

內容不一定只是純文字，元素裡面也可以再放別的元素，這叫做 nesting（巢狀）。舉個例子，你想在一段話裡把某個字加粗強調：

```html
<p>My cat is <strong>very</strong> grumpy.</p>
```

這裡 `<strong>` 元素被放在 `<p>` 元素裡面。巢狀有一個鐵則：**內層元素必須完整地包在外層元素之內，標籤不能交叉重疊。** 正確的做法是「先開的後關」，就像上面這樣。錯誤的寫法會像這樣：

```html
<!-- 錯誤示範：標籤交叉重疊了 -->
<p>My cat is <strong>very grumpy.</p></strong>
```

`<p>` 還沒被 `</p>` 關掉之前，`<strong>` 就跨出去了，這種交叉會讓瀏覽器困惑，排版結果可能出乎意料。從一開始就養成「一層一層乾淨包好」的習慣，後面寫比較複雜的頁面時會省下很多麻煩。

### 選對標籤：semantic HTML 的重要性

HTML 內建了[非常大量的預定義標籤](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)，讓你可以做出各式各樣的元素——段落、標題、清單、圖片、連結等等。你可能會想：反正瀏覽器都看得懂，我用哪個標籤有差嗎？

有差，而且差很多。用「正確、符合內容角色」的標籤，這件事有個專有名詞叫 **semantic HTML（語意化 HTML）**。它至少影響兩個實際層面：

- **搜尋引擎排名（SEO）**：搜尋引擎會讀你的標籤來判斷內容的重要性與結構。標題就用標題標籤、段落就用段落標籤，能幫助搜尋引擎正確理解你的頁面。
- **無障礙（accessibility）**：有些使用者仰賴螢幕報讀器（screen reader）等輔助科技來瀏覽網路。這些工具靠標籤的語意來朗讀與導覽頁面。如果你把一個標題硬用段落標籤做出來、只是把字調大，螢幕報讀器就無法把它辨認成標題，使用者的體驗會大打折扣。

一個常見的反例是：不要因為「想讓字變大變粗」就隨便挑一個標題標籤，那是排版需求，該交給 CSS。標籤的選擇應該依「內容是什麼角色」來決定。semantic HTML 是很重要的主題，課程後面會再深入，這裡先建立「標籤有語意、要挑對」的意識就好。

### Void element（空元素）：沒有結束標籤的元素

前面說「幾乎」每個元素都是一對開始與結束標籤，這個「幾乎」是有例外的。有一類元素天生就不裝任何內容，因此它們**沒有結束標籤，只有單獨一個標籤**。這類元素叫做 **void element（空元素）**。

最常見的例子有：

- `<br>`：換行（line break）。
- `<img>`：圖片（image）。
- `<input>`：表單輸入欄位。
- `<hr>`：水平分隔線。
- `<meta>`：頁面的中繼資料（metadata）。

它們被稱為 void（空的），正是因為裡面「空無一物」——沒有任何內容需要被包住。既然沒有內容要包，自然就不需要結束標籤來標示「內容結束」的位置。這也回答了 knowledge check 的第三題：**void element 和一般元素的差別，就在於它只有一個標籤、不包內容、沒有結束標籤。**

依照 HTML 規範，void element 一共有 14 個，除了上面提到的，還包括 `<area>`、`<base>`、`<col>`、`<embed>`、`<link>`、`<source>`、`<track>`、`<wbr>`、`<param>` 等。你不需要背，用到時查即可，重點是理解「這一類元素為什麼不需要結束標籤」。

### Self-closing（自我閉合）斜線寫法的來歷

你在別人的程式碼裡，很可能會看到 void element 被寫成帶斜線的樣子，像 `<br />` 或 `<img />`。這種在標籤結尾加上斜線 `/` 的寫法，就是所謂的 **self-closing tag（自我閉合標籤）**。

要釐清一個常見誤解：在 HTML 裡，這個結尾的斜線其實沒有任何作用。HTML 的解析器（parser）會直接忽略它，`<br>` 和 `<br />` 對瀏覽器來說完全一樣，都能正確顯示。這個斜線寫法是歷史因素留下來的（源自 XHTML 與 XML 那套「每個標籤都要自我閉合」的規則），所以你仍然會經常看到它。

不過要注意：**最新版的 HTML 規範不鼓勵在 void element 上使用這個斜線，甚至視為無效寫法。** 因此對初學者的建議很單純——自己寫的時候用 `<br>`、`<img>` 這種乾淨的單標籤就好；但看到別人寫 `<br />` 也不用緊張，它一樣能正常運作。

## 程式碼範例

下面這個最小可執行範例，把這一課的三個重點放在同一頁：一般元素、巢狀、以及 void element。你可以把它存成 `.html` 檔，用瀏覽器打開來看效果。

```html
<!-- 一般元素：開始標籤 + 內容 + 結束標籤 -->
<p>這是一個段落元素。</p>

<!-- 巢狀：strong 元素被完整包在 p 元素裡面 -->
<p>我的貓<strong>非常</strong>不爽。</p>

<!-- void element：img 沒有結束標籤，也不包任何內容 -->
<img src="cat.jpg" alt="一隻不爽的貓">

<!-- void element：br 讓文字換行，同樣是單獨一個標籤 -->
<p>第一行文字<br>第二行文字</p>
```

重點回顧：`<p>...</p>` 是「開始 + 內容 + 結束」的完整結構；`<strong>` 被乾淨地包在 `<p>` 之內，沒有交叉；而 `<img>` 與 `<br>` 都是 void element，寫一個標籤就結束，不需要 `</img>` 或 `</br>`。

## 常見陷阱

!!! warning "void element 不要硬加結束標籤"
    void element 不能有結束標籤。像 `<input type="text"></input>` 這種寫法在 HTML 裡是無效的，`<img></img>`、`<br></br>` 也一樣。正確做法就是只寫單一標籤：`<input type="text">`、`<img src="...">`、`<br>`。

!!! warning "巢狀時標籤不能交叉重疊"
    內層元素一定要完全包在外層元素裡，遵守「先開的後關」。像 `<p>...<strong>...</p></strong>` 這種 `<strong>` 跨出 `<p>` 之外的交叉寫法，會讓瀏覽器解讀混亂、排版出錯。

!!! warning "斜線緊貼未加引號的屬性值會出事"
    現代 HTML 會忽略 void element 結尾的斜線，但有個陷阱：如果斜線直接黏在「沒有加引號的屬性值」後面，它會被當成屬性值的一部分。例如 `<img src=http://example.com/logo.svg/>` 會讓 `src` 變成結尾多一個 `/` 的錯誤網址。養成「屬性值一律用引號包起來」的習慣就能避開這個坑：`<img src="http://example.com/logo.svg">`。

## 練習

The Odin Project 這一課的 Assignment 是觀看一支入門影片來加深理解：

1. 觀看 Kevin Powell 的影片 [HTML & CSS for Absolute Beginners: What is HTML?](https://www.youtube.com/watch?v=X4sClFRMJ00)，用另一種角度再看一次「HTML 是什麼、element 與 tag 如何運作」。

看完之後，建議你動手做一個小驗證，確認自己真的理解：

1. 建立一個 `.html` 檔，寫一個段落元素，確認你能指出它的開始標籤、內容、結束標籤三個部分。
2. 在段落裡巢狀一個 `<strong>` 元素，用瀏覽器打開，觀察被 `<strong>` 包住的字是否變粗。
3. 加入一個 `<img>` 或 `<br>` void element，親自驗證它們不需要結束標籤也能正常運作。
4. 對照本課的 knowledge check，試著用自己的話回答：HTML tag 是什麼？一個元素的三個部分是什麼？void element 和一般元素差在哪？

## 原文與延伸資源

- 原文：[Elements and Tags](https://www.theodinproject.com/lessons/foundations-elements-and-tags)
- 本課引用：
    - MDN：[Void element（詞彙表）](https://developer.mozilla.org/en-US/docs/Glossary/Void_element)——void element 的定義、完整 14 個清單、以及自我閉合斜線在 HTML 中的行為。
    - MDN：[HTML 元素參考（所有標籤清單）](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)——內建標籤的完整索引，用到時查詢。
    - MDN：[Basic HTML syntax](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax)——元素的解剖、巢狀、void element 的補充說明。
    - 影片（Assignment，未抓取）：Kevin Powell，[HTML & CSS for Absolute Beginners: What is HTML?](https://www.youtube.com/watch?v=X4sClFRMJ00)。

---

> 本講義改寫自 The Odin Project《Elements and Tags》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
