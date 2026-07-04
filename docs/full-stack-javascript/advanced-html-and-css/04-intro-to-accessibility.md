---
title: 網頁可及性簡介（Accessibility）
source_url: https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-introduction-to-web-accessibility
source_file: vendor/curriculum/advanced_html_css/accessibility/introduction_to_web_accessibility.md
path: full-stack-javascript
course: Advanced HTML and CSS
order: 4
generated: 2026-07-03
---

# 網頁可及性簡介（Accessibility）

> 改寫自 The Odin Project：[Introduction to Web Accessibility](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-introduction-to-web-accessibility)
> ｜Full Stack JavaScript › Advanced HTML and CSS › Accessibility

## 核心概念

走到課程的這個階段，你已經學會不少很有價值的觀念，也做出了幾個能寫進履歷的專案，對 HTML 與 CSS 應該也更有掌握了。但有一個主題，很可能還沒被你認真放進開發流程裡，那就是 accessibility（可及性，網頁無障礙）。

這個字很長，在英文圈常被縮寫成 **a11y**：取 accessibility 這個單字，開頭字母 a 與結尾字母 y 之間剛好有 11 個字母，所以寫成 a11y。這種「首字母＋中間字母數＋尾字母」的縮寫方式，在前端還會看到同類的例子，例如 internationalization（國際化）縮寫成 i18n。看到 a11y，你就知道它指的是網頁無障礙。

很遺憾，這是一個許多開發者要嘛不太懂、要嘛在開發時根本沒放在心上的題目。如果你也屬於這兩種人，那你很可能已經養成了一些對 a11y 不友善的習慣。在學會怎麼改掉這些習慣、開始寫出 a11y 友善的程式碼之前，我們得先把「網頁可及性到底是什麼」這件基礎的事情搞清楚。這一課不談具體技巧，只建立正確的觀念地圖；後續的課程會逐一補上 semantic HTML（語意化 HTML）、鍵盤導覽、ARIA、色彩對比等實作細節。

### 什麼是網頁可及性

**網頁可及性（web accessibility）指的是：把網站、工具與技術設計並開發成「有身心障礙或處於情境限制的人，也能盡量沒有障礙地使用」的樣子。**

這句定義裡有兩個關鍵詞，需要拆開來看：一個是「disability（身心障礙）」，一個是「situational limitation（情境限制）」。很多人一聽到 accessibility，第一反應是「那是給盲人用的吧」，但真正的範圍比這個直覺廣得多。

#### 身心障礙有很多種

障礙的類型不只一種，常見的（但不限於）有下列幾類：

- **auditory（聽覺）**：例如聽不到或聽力受損的使用者。影片如果沒有字幕，他們就接收不到聲音裡的資訊。
- **physical / motor（肢體／動作）**：例如手部無法精細操作、無法使用滑鼠、只能靠鍵盤或其他輔具操作的使用者。
- **cognitive（認知）**：例如注意力、記憶、閱讀理解等方面有困難的使用者。過度複雜的介面、閃爍的動畫都可能造成阻礙。
- **visual（視覺）**：例如全盲、弱視、色盲的使用者。全盲者通常透過 screen reader（螢幕報讀器）把畫面「唸」出來。

障礙也分成兩種時間性質。它可以是**永久性（permanent）**的，例如一位完全失明或完全失聰的使用者；也可以是**暫時性（temporary）**的，例如一個手臂骨折、只能單手打字的人。同一個使用者也可能**同時有多重障礙**。此外，隨著年齡增長、身體機能改變的年長者，往往會出現和身心障礙者相似的狀況，例如視力退化、手部不靈活。換句話說，a11y 的受益者遠比你想像得多，而且很可能包括未來的你自己。

#### 情境限制又是另一回事

situational limitation（情境限制）跟身心障礙不太一樣。它指的是使用者在「特定情境」下才會遇到的障礙，例如：

- 在大太陽底下用手機看網頁，螢幕反光讓對比不足的文字幾乎看不清楚。
- 一手抱著小孩或提著東西，只能用另一手單手瀏覽網站。
- 住在網路很慢、或頻寬很貴的地區，載入沉重的頁面既慢又花錢。

這些限制跟身心障礙的差別在於：它們只在特定情況下發生，情況過了就沒事了。但它們同樣重要，因為任何人都可能在某個時刻落入這些情境。一個對比足夠、可以單手操作、載入輕量的網站，不只幫到身心障礙者，也幫到「此刻剛好處於某種限制」的一般使用者。

### 為什麼網頁可及性很重要

先用一個非網頁的例子來建立直覺。想像你在一棟多層樓的建築裡，而這棟樓「沒有電梯」。對某些人來說，這頂多是個小麻煩：「嗯，沒電梯，那我就爬幾層樓梯吧。」但對一位需要輪椅的人來說，要去一樓以上的任何地方，幾乎是不可能的，至少是極度困難的。就算有人願意幫忙把輪椅一階一階抬上去，過程也遠比走樓梯辛苦。這裡的重點是：**一部電梯，會讓這棟建築變得更可及（accessible）。**

現在把這個比喻對應到網頁上：**這棟建築就是你的網站，而電梯就是各種 accessibility 功能與工具的集合**（這是一部相當大的「電梯」）。當你開發一個網站，你是為了「使用者」而開發的，你需要這個網站真的能被他們**使用**。身心障礙者、機能改變中的年長者、比較不熟悉科技的人、以及處於某種情境限制下的人，全都是你的使用者；網站應該讓他們盡可能地一樣好用。

換個角度說，忽視 a11y 就等於在你的網站門口擺了一道沒有電梯的樓梯：你不是刻意要把人擋在外面，但結果就是有一群人被擋在外面了。而這群人的規模，通常遠比開發者以為的大。

還有一個相當實際的理由：**依國家不同，可及性可能是「法律要求」的**。許多國家與地區都有相關法規，要求特定類型的網站（尤其是政府、教育、大型企業或提供公共服務的網站）必須達到一定的無障礙標準。做不到，除了把使用者擋在門外，還可能有法律與商業上的風險。

### 常聽到的相關名詞

在往後的課程裡，你會反覆遇到幾個名詞，先在這裡建立印象即可，細節之後會展開：

- **WCAG（Web Content Accessibility Guidelines，網頁內容可及性指引）**：由 W3C 制定、目前業界最權威的無障礙標準，訂出了可量測的成功準則。
- **WAI（Web Accessibility Initiative，網頁可及性推動計畫）**：W3C 底下專門推動 a11y 的組織，本課的延伸閱讀資源就來自它。
- **screen reader（螢幕報讀器）**：把畫面內容轉成語音或點字輸出的輔助技術，是視障使用者最常用的工具之一。它「讀」的是你的 HTML 結構，因此寫出語意正確的 HTML，就是在直接照顧這群使用者。

這一課先到觀念為止。你只需要記住一句話：**a11y 不是替少數人做的額外裝飾，而是讓網站對所有人都真正「可用」的基本工程。**

## 程式碼範例

這一課以觀念為主，但我們可以用一組最小對照，讓「有沒有 a11y 意識」的差別具體化。下面兩段 HTML 在瀏覽器裡「看起來」幾乎一樣，但對 screen reader 使用者而言，體驗天差地別。

```html
<!-- 不友善：用 <div> 假裝成按鈕，圖片沒有替代文字 -->
<div onclick="submitForm()">送出</div>
<img src="logo.png">

<!-- 友善：用語意正確的 <button>，圖片提供 alt 替代文字 -->
<button type="button" onclick="submitForm()">送出</button>
<img src="logo.png" alt="Odin Notes 網站標誌">
```

差異說明：

- `<button>` 天生就能用鍵盤的 Tab 聚焦、用 Enter 或空白鍵觸發，screen reader 也會唸出「按鈕」這個角色；而 `<div>` 只是一個沒有語意的容器，鍵盤使用者根本無法聚焦到它、觸發它。
- `<img>` 的 `alt` 屬性提供「替代文字（alternative text）」。看不到圖片的使用者，screen reader 會改唸這段 `alt` 文字；沒有 `alt`，報讀器可能只會唸出檔名「logo.png」，甚至完全略過，資訊就這樣遺失了。

這兩個小改動不需要任何額外函式庫，只是「選對標籤、補上該有的屬性」，卻直接決定了一部分使用者能不能用你的網站。這也預告了後續課程的核心精神：a11y 大多時候不是加東西，而是「用對本來就存在的 HTML」。

## 常見陷阱

!!! warning "以為 a11y 只服務盲人"
    最常見的誤解，就是把 accessibility 窄化成「給視障者的功能」。實際上它涵蓋聽覺、肢體、認知、視覺等多種障礙，還包含暫時性障礙（如骨折）與情境限制（如大太陽下看手機、單手操作、網路很慢）。用這種寬廣的視角看，a11y 的受益者其實是「幾乎所有人，在某些時刻」。

!!! warning "把 a11y 留到最後才補"
    很多團隊習慣先把功能做完、上線前才「補一下無障礙」。但可及性牽涉到 HTML 結構、語意標籤、聚焦順序等根本設計，事後補救往往要大改，成本高又容易漏。正確做法是從一開始就把它當成預設要求，而不是收尾階段的加工。

!!! warning "誤以為它只是道德選項"
    a11y 不只是「做好事」而已。依國家不同，它可能是**法律強制**的要求，尤其政府、教育、公共服務類網站。忽視它除了把使用者擋在門外，還可能帶來法律與商業風險。

## 練習

1. 閱讀 W3C 的 [Diverse Abilities and Barriers（多元能力與障礙）](https://www.w3.org/WAI/people-use-web/abilities-barriers/) 這篇文章，理解不同障礙的使用者，實際上會被「不可及的網站」如何影響。閱讀時，試著把每一種障礙對應回你自己做過的專案：如果換成這位使用者，他卡在哪一步？
2. 觀看 W3C 的 [Web Accessibility Perspectives（網頁可及性觀點）系列影片](https://www.w3.org/WAI/perspective-videos/)，看看哪些使用者能從哪些 accessibility 功能受益。每支影片都很短，並附有音訊描述與逐字稿；如果你偏好一次看完，頁面上也有把全部影片彙整成一支的 YouTube 連結。看的時候特別留意：每一個無障礙功能，其實同時也讓「沒有障礙的一般人」用得更順。

看完後，回頭問自己兩個問題，作為本課的自我檢核：什麼是網頁可及性？以及，到底「誰」真正從 accessibility 功能受益？（提示：答案不是「只有身心障礙者」。）

## 原文與延伸資源

- 原文：[Introduction to Web Accessibility](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-introduction-to-web-accessibility)
- 本課引用：
    - [W3C WAI - Diverse Abilities and Barriers](https://www.w3.org/WAI/people-use-web/abilities-barriers/)
    - [W3C WAI - Web Accessibility Perspectives Videos](https://www.w3.org/WAI/perspective-videos/)

---

> 本講義改寫自 The Odin Project《Introduction to Web Accessibility》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
