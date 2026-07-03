---
title: CSS Transition 轉場
source_url: https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-transitions
source_file: vendor/curriculum/advanced_html_css/animation/transitions.md
path: full-stack-javascript
course: Advanced HTML and CSS
order: 2
status: draft
generated: 2026-07-03
---

# CSS Transition 轉場

> 改寫自 The Odin Project：[Transitions](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-transitions)
> ｜Full Stack JavaScript › Advanced HTML and CSS › Animation

## 核心概念

### 什麼是 transition（轉場）

CSS transition（轉場）讓元素從「初始狀態」平滑地變化到「結束狀態」，而不是瞬間跳過去。想像一顆背景是白色的按鈕：滑鼠沒碰到時它就靜靜待著，很無聊；當你把游標移上去（hover），背景色在一段時間內從白色平滑地過渡到灰色再到黑色。這個「慢慢變」的過程，就是 CSS transition。

沒有 transition 時，`:hover` 造成的樣式改變是瞬間發生的；加上 transition 後，瀏覽器會在你指定的時間內，把中間的每一格畫面補出來，於是看起來就有了動畫感。

觸發轉場最常見的方式是 pseudo-class（偽類），例如 `:hover`、`:focus`、`:active`。但轉場並不限定於偽類：你也可以用 JavaScript 動態新增或移除 class 來觸發。例如點擊按鈕時替下拉選單加上 `open` 這個 class，就能觸發選單展開的轉場。關鍵在於「元素的某個屬性值改變了」，而這個屬性又剛好被你設定成可以轉場，動畫就會發生。

### 四個 longhand 屬性

`transition` 其實是一個 shorthand（簡寫）屬性，它背後由四個獨立屬性組成。先用 longhand（完整寫法）理解它們各自的職責：

```css
button {
  transition-property: background-color;
  transition-duration: 1s;
  transition-timing-function: ease-out;
  transition-delay: 0.25s;
}
```

- **`transition-property`**：決定「哪個 CSS 屬性」要被轉場。這裡是 `background-color`。
- **`transition-duration`**：轉場「持續多久」。這裡是 1 秒，顏色會在 1 秒內漸變完成。
- **`transition-timing-function`**：轉場過程中「速度如何分配」，也就是加速曲線（easing）。這裡是 `ease-out`，代表一開始快、結尾慢。
- **`transition-delay`**：轉場「延遲多久才開始」。這裡是 0.25 秒，游標停上去四分之一秒後顏色才開始變。

### shorthand 簡寫

實務上更常用 shorthand 一行寫完，順序是「屬性 時長 速度曲線 延遲」：

```css
button {
  background-color: white;
  transition: background-color 1s ease-out 0.25s;
}

button:hover {
  background-color: black;
}
```

要特別注意：**transition 應該寫在「初始狀態」上**（這裡是 `button`，而不是 `button:hover`），這樣進場和離場都會套用同一組轉場設定。shorthand 裡只有 `transition-property` 和 `transition-duration` 是必填，其餘可省略。有一個容易踩到的細節：簡寫中出現的**第一個**時間值會被當成 `duration`，**第二個**時間值才是 `delay`，所以 `transition: opacity 0.25s 1s` 代表「時長 0.25 秒、延遲 1 秒」，順序不能顛倒。

### timing-function 速度曲線

`transition-timing-function` 控制動畫在時間軸上的節奏。常見關鍵字：

- `linear`：全程等速。
- `ease`：預設值，慢起、中間快、慢收。
- `ease-in`：慢起、越來越快。
- `ease-out`：快起、越來越慢（例子中用的就是這個）。
- `ease-in-out`：兩端慢、中間快。
- `cubic-bezier(n, n, n, n)`：用貝茲曲線自訂任意節奏，前述關鍵字其實都是它的預設別名。
- `steps(n)`：分成 n 個離散階段跳著變，適合做逐格動畫或閃爍效果。

### 同時轉場多個屬性

想讓多個屬性一起動，用逗號分隔各自的設定，彼此獨立：

```css
.box {
  transition:
    width 2s,
    background-color 1s ease-in,
    transform 0.5s 0.2s;
}
```

你也可以用特殊值 `all` 讓「所有可轉場的屬性」都套用同一組設定，例如 `transition: all 0.5s ease-out;`。方便歸方便，但不建議濫用：`all` 會連你沒預期的屬性也一起轉場，可能拖慢效能，明確列出要動的屬性通常更好。

### 哪些屬性可以轉場

MDN 的原則是「除非特別註明，多數 CSS 屬性都是可動畫（animatable）的」。可轉場的屬性大多屬於「可內插（interpolated）」型，也就是起點到終點之間存在連續的中間值，例如 `opacity`、`color`、`width`、`transform` 等。

但有些屬性是「離散（discrete）」型，沒有合理的中間值。離散屬性的動畫規則是：在進度到達 50% 之前維持起始值，到達 50% 之後直接切換成結束值，中間沒有漸變。最典型的就是 `display`：從 `none` 到 `block` 之間沒有「一半的 display」，傳統上它根本不會轉場，值會直接在瞬間切換。這也是為什麼「淡入一個原本 `display: none` 的元素」需要特別技巧（見常見陷阱）。另外要避免對 `auto` 做轉場，例如 `width: auto`：瀏覽器算不出可靠的起點或終點，結果會很不可預測。若真的需要展開高度，常見替代做法是改用 `max-height` 從一個固定值轉場，或改用 `transform: scaleY()`。

一個實用的判斷技巧：想知道某個屬性到底能不能轉場、是哪一種型別，去 MDN 該屬性頁面的「Formal definition（正式定義）」表格看「Animation type」欄位即可，上面會標明是 `discrete`、`by computed value` 還是 `not animatable`。

### 監聽轉場事件

有時你需要在「轉場結束後」再做一件事，例如動畫播完才把元素真正移除。瀏覽器提供 `transitionend` 事件，會在轉場正常完成時觸發：

```js
box.addEventListener("transitionend", (event) => {
  // event.propertyName 是剛結束的 CSS 屬性名稱
  console.log(`${event.propertyName} 轉場完成`);
});
```

事件物件（`TransitionEvent`）帶有兩個常用欄位：`propertyName` 是剛結束轉場的屬性名稱，`elapsedTime` 是實際經過的秒數（不含 `transition-delay` 的等待時間）。要留意的是，如果轉場中途被打斷（例如游標又移開了），`transitionend` 就不會如預期地在原本時間點觸發，寫邏輯時別假設它一定會完整跑完。相對地，`transitionrun`（轉場排定）與 `transitionstart`（延遲結束、真正開始變化）則能讓你在轉場開頭做事。

### 效能：stacking context 與 repaint

一般情況下 transition 的效能不太需要操心，但有兩件事值得記在心裡。

第一是 **stacking context（堆疊脈絡）**。它指的是 HTML 元素沿著 z 軸（深度方向）的層疊關係；`z-index` 控制重疊時誰在前誰在後，而某些屬性（例如 `transform`、`opacity`、`filter`）一旦使用，就會**建立新的 stacking context**。看這個例子：

```css
div {
  width: 100px;
  height: 100px;
  transition: transform 2s 1s;
}

div:hover {
  transform: rotate(180deg);
}
```

轉場 `transform` 會建立一個 stacking context。如果頁面上又用各種方式建立了一大堆 stacking context，那麼當瀏覽器要重繪（repaint）這個 `div` 時，不只會重畫它自己，還會連帶重畫**所有疊在它上方、屬於同一堆疊脈絡的元素**。放任不管的話，原本滑順的轉場可能變得卡頓。

第二是**屬性的選擇**。想要最佳效能，動畫盡量只動 `opacity` 和 `transform` 這兩個屬性——它們可以交給 GPU 合成，通常不觸發昂貴的重繪或重排（reflow）。前面第一個範例雖然只改了 `background-color`，看起來很單純，但那其實是相對昂貴的操作。這不代表你永遠不能改別的屬性，而是當動畫變多、變複雜、開始掉幀時，優先把效果改寫成 `opacity` 與 `transform` 通常最有效。

真正重要的是理解這些概念，需要時能拿出來用。畢竟哪天你想讓按鈕在 hover 時變成彩虹，你最好也有辦法把那道彩虹漂亮地轉場出來。

## 程式碼範例

下面是一個可直接貼進 HTML 檔測試的完整範例：按鈕 hover 平滑變色，方塊 hover 同時放大與旋轉。

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8" />
  <style>
    /* 轉場寫在「初始狀態」上，進場離場都會套用 */
    button {
      background-color: white;
      color: black;
      padding: 12px 24px;
      border: 1px solid black;
      /* 屬性 時長 速度曲線 延遲 */
      transition: background-color 1s ease-out 0.25s;
    }

    button:hover {
      background-color: black;
      color: white;
    }

    .box {
      width: 100px;
      height: 100px;
      background-color: tomato;
      /* 效能友善：只動 transform（與 opacity），可交給 GPU 合成 */
      transition: transform 0.4s ease-in-out;
    }

    .box:hover {
      /* 同時放大並旋轉，仍只用到一個 transform 屬性 */
      transform: scale(1.2) rotate(15deg);
    }
  </style>
</head>
<body>
  <button>Hover 我</button>
  <div class="box"></div>
</body>
</html>
```

用 JavaScript 切換 class 也能觸發同一組轉場，不必倚賴 `:hover`：

```css
.panel {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.panel.is-open {
  opacity: 1;
}
```

```js
// 點擊時加上 is-open，opacity 從 0 平滑補到 1
button.addEventListener("click", () => {
  panel.classList.toggle("is-open");
});
```

## 常見陷阱

!!! warning "transition 要寫在初始狀態，不是寫在 :hover"
    把 `transition` 放進 `button:hover` 只會讓「移入」時有動畫，「移出」時卻瞬間彈回。寫在基礎選擇器（`button`）上，進場與離場才會共用同一組轉場設定。

!!! warning "不要對 auto 或 display 做轉場"
    對 `width: auto`、`height: auto` 這類值轉場，瀏覽器算不出可靠的起訖，結果不可預測。`display` 屬於離散屬性，傳統上不會轉場——想淡入一個原本 `display: none` 的元素，正確做法是分開處理：先把元素改成 `display: block`，在下一個影格（例如用極短的 `setTimeout`，或現代寫法搭配 `@starting-style` 與 `transition-behavior: allow-discrete`）再改 `opacity`，否則瀏覽器會把兩次改動合併，看不到淡入。

!!! warning "剛插入 DOM 的元素轉場不會觸發"
    剛用 `appendChild()` 加進頁面、或剛移除 `display: none` 的元素，如果馬上改屬性，轉場通常不會啟動，因為瀏覽器還沒認定「初始狀態」。慣用解法是隔幾毫秒再改：
    ```js
    el.style.display = "block";
    setTimeout(() => { el.style.opacity = "1"; }, 10);
    ```

!!! warning "效能：優先只動 opacity 與 transform"
    動畫盡量限制在 `opacity` 和 `transform`，它們可交給 GPU 合成，通常不觸發昂貴的 repaint／reflow。像 `background-color`、`width`、`box-shadow` 這類改動成本較高；一旦動畫變多或開始掉幀，先檢查是否能改寫成 `transform`／`opacity`，並留意過多 stacking context 造成的連鎖重繪。

## 練習

以下改寫自原文 Assignment，建議一邊讀一邊動手寫程式碼跟著做：

1. 閱讀 MDN 的〈Using CSS transitions〉，特別是「Defining transitions」段落及其連結，親手把文中範例打一遍，熟悉 shorthand 與 longhand 語法。
2. 閱讀 Josh W. Comeau 的〈Stacking Contexts〉，弄懂堆疊脈絡如何形成、如何影響 `z-index`。
3. 安裝並試用「CSS Stacking Context inspector」瀏覽器擴充套件，實際檢視頁面上的 stacking context 階層，排查版面與重繪問題。
4. 研究「CSS Triggers」（可透過 Web Archive 存取），比較 `background-color` 與 `transform` 這類屬性各自觸發瀏覽器渲染管線的哪些階段（layout／paint／composite）。
5. 閱讀 Josh W. Comeau 的〈An Interactive Guide to CSS Transitions〉互動教學，實際拖曳體驗各種 timing-function 的差異。
6. 學習如何用 DevTools「捕捉並除錯 repaint 問題」，觀察哪些轉場造成不必要的重繪。

本課沒有獨立的 project；若原文之後補上專案，請以[原文頁面](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-transitions)為準。

## 原文與延伸資源

- 原文：[Transitions](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-transitions)
- 本課引用：
  - MDN — [Using CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions)
  - MDN — [Animatable CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties)
  - MDN — [transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition)
  - Josh W. Comeau — [Stacking Contexts](https://www.joshwcomeau.com/css/stacking-contexts/)
  - Josh W. Comeau — [An Interactive Guide to CSS Transitions](https://www.joshwcomeau.com/animation/css-transitions/)

---

> 本講義改寫自 The Odin Project《Transitions》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
