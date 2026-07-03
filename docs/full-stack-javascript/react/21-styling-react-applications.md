---
title: 為 React 應用上樣式
source_url: https://www.theodinproject.com/lessons/node-path-react-new-styling-react-applications
source_file: vendor/curriculum/react/the_react_ecosystem/styling_react_applications.md
path: full-stack-javascript
course: React
order: 21
status: draft
generated: 2026-07-03
---

# 為 React 應用上樣式

> 改寫自 The Odin Project：[Styling React Applications](https://www.theodinproject.com/lessons/node-path-react-new-styling-react-applications)
> ｜Full Stack JavaScript › React › The React Ecosystem

## 核心概念

### 你已經會的 CSS，在 React 裡都還算數

先講一個讓人安心的前提：你在前面課程學到的所有 CSS 知識，包含選擇器、box model、flexbox、grid、動畫等，在 React 裡完全適用。React 並沒有發明一套新的樣式語言，它只是提供了幾種「把 CSS 掛到 component（元件）上」的不同做法。所以這一課不是要你重學 CSS，而是要你認識：在一個會不斷長大的 React 專案裡，有哪些方式可以把樣式管理得更好。

那麼問題出在哪裡？關鍵字是 **全域作用域（global scope）**。

當你寫一個傳統的 `.css` 檔並在 HTML 或 JavaScript 裡匯入它，裡面所有的 class 名稱都會被丟進同一個全域命名空間。也就是說，只要有兩個地方都用了 `.button` 或 `.card` 這種常見名字，它們就會互相覆蓋、互相污染。專案小的時候你還記得每個 class 用在哪，但當檔案來到數十甚至上百個，這種「命名撞車」會變成惡夢：你改了某頁的 `.title`，另一頁的標題卻莫名其妙跟著變了樣。

本課要介紹的各種工具，核心目的幾乎都是同一件事：**讓樣式的作用範圍變得可控**，讓某個 component 的 CSS 只影響它自己，不會外洩去干擾別人。以下逐一說明四種主流做法。

### 一、純 CSS 與 CSS Modules

**純 CSS（plain CSS）** 是最簡單、也最容易上手的方式：寫一個 `.css` 檔，在 component 檔案頂端 `import './styles.css'`，然後在 JSX 裡用 `className` 指定 class。這種寫法零學習成本，小專案完全夠用。它唯一的問題就是前面說的：class 名稱是全域的，隨著專案變大，撞名風險越來越高。

**CSS Modules** 正是為了解決這個痛點而生。它的寫法幾乎跟純 CSS 一模一樣，差別只在檔名要以 `.module.css` 結尾（例如 `Button.module.css`），並且匯入的方式改成把整個檔案當成一個物件匯入。

CSS Modules 的魔法在於：**它會在打包時，把你寫的每個 class 名稱自動改寫成一個獨一無二的字串**（例如把 `.button` 變成 `Button_button__x7f2a`）。因為每個名字都被加了獨特的雜湊後綴，不同檔案裡即使都叫 `.button`，最後產生出來的實際 class 名也絕不會相同。這就達成了 **局部作用域（locally scoped）** 的效果，你再也不用煩惱命名衝突，可以放心用 `.title`、`.container` 這種直覺又好記的名字。

CSS Modules 通常不需要額外安裝套件，主流的建置工具（如 Vite、Create React App）都內建支援，只要遵守 `.module.css` 的命名慣例即可。這也是本課最推薦、也是接下來練習要用的做法。

### 二、CSS-in-JS

既然 CSS 可以寫在 CSS 檔裡，那為什麼不乾脆直接寫在 JavaScript 裡呢？這就是 **CSS-in-JS** 這個 paradigm（範式）的出發點。

CSS-in-JS 讓你用 JavaScript 完全掌控 CSS，並且用各種功能去擴充它。它最大的優勢是：因為樣式本身就活在 JavaScript 裡，你可以很自然地讓樣式 **根據 state（狀態）或 props（屬性）動態改變**，用寫程式的邏輯去決定要套什麼樣式。同時，它也跟 CSS Modules 一樣提供了模組化、局部作用域的能力，樣式一樣不會外洩。

React 生態系中最知名的 CSS-in-JS 方案之一是 **styled-components**。它的核心概念是：你不再寫「一個帶 class 的 `<button>`」，而是直接建立「一個本身就帶著樣式的 component」。例如你可以定義一個 `StyledButton`，把樣式直接綁在這個 component 上，之後在 JSX 裡就像用一般 component 一樣使用它。樣式與 component 合而為一，這正是 CSS-in-JS 命名的由來。

要留意的是，CSS-in-JS 是社群裡爭議較多的做法。它讓「依 state 上樣式」變得很優雅，但也可能帶來額外的執行期成本（樣式要在 runtime 由 JavaScript 產生與注入），以及較陡的學習曲線。它是一個值得認識的選項，但不見得是每個專案的首選。

### 三、CSS Utility Frameworks（CSS 工具類框架）

**CSS 工具類框架（CSS Utility Frameworks）** 是近年為 React 上樣式的熱門選擇。它的理念跟前兩者很不一樣：它不讓你寫自己的 class，而是提供一大堆 **預先定義好、每個只做一件小事的 class**，讓你直接組合這些 class 來拼出想要的樣式。

其中最主流的是 **Tailwind CSS**。舉例來說，與其自己寫一段 CSS 去設定「內距、圓角、藍底白字」，你會直接在 JSX 的 `className` 裡串上一連串工具類，例如 `px-4 py-2 rounded bg-blue-500 text-white`，每個 class 對應一個明確的樣式規則。你幾乎不用離開 JSX，也不用自己想 class 名字，樣式就直接寫在標記旁邊。

這種做法的好處是開發速度快、風格容易維持一致（因為所有間距、顏色都來自框架預設的一套設計系統）。缺點則是 JSX 裡的 `className` 會變得很長，初看會覺得雜亂，也需要花時間熟記這套工具類的命名規則。

### 四、Component libraries（元件庫）

如果連樣式都嫌麻煩，那有沒有「全部都幫你做好」的選項？有，那就是 **元件庫（component libraries）**。

顧名思義，元件庫提供了一整套現成、可調整、可重複使用的 component，而且 **樣式、行為、以及無障礙（accessibility）都已經替你處理好了**。這些 component 包含但不限於：下拉選單、抽屜（drawer）、日曆、開關（toggle）、分頁（tabs），幾乎你想得到的常見 UI 元件都有。你只要匯入它們、傳入 props，就能直接用在專案裡。

在 React 圈子裡值得一提的元件庫有 **Material UI（MUI）**、**Radix** 和 **Chakra UI**。它們各有風格與取捨：有的提供完整外觀（開箱即用的漂亮樣式），有的則主打「無樣式但完全無障礙」的底層元件，讓你自己疊上樣式。

另外還有一類特別的 **圖示元件庫（icon component libraries）**，例如 **lucide-react**，它讓你把圖示當成 component 直接引入專案，例如 `<Search />` 就會渲染（render）出一個放大鏡圖示，比手動貼 SVG 或載入圖片檔方便許多。

### 該怎麼選？本課的建議

看到這裡你可能會問：這麼多選項，我該用哪個？

!!! note "本課的學習建議"
    在整個課程的學習階段，我們強烈建議你 **避免使用 CSS 框架（如 Tailwind）或元件庫（如 MUI、Chakra）**，改用 **CSS Modules 從零開始親手刻自己的 component 樣式**。（使用圖示元件庫如 lucide-react 則沒問題。）

這個建議的邏輯是：框架和元件庫很方便，但它們會把「怎麼實作樣式」這件事藏起來。在你還在打基礎的階段，親手寫 CSS 能真正鞏固你對 layout、間距、響應式設計的掌握。等你把基本功練扎實了，未來在實務專案要導入 Tailwind 或 MUI，都會學得又快又踏實。工具是用來加速已經會的人，而不是用來替還在學的人跳過學習。

## 程式碼範例

以下用一個最小的 `Button` 範例，示範 CSS Modules 的完整用法。

第一步，建立樣式檔，檔名必須以 `.module.css` 結尾：

```css
/* Button.module.css */
/* 這裡的 class 名稱在打包時會被改寫成獨一無二的字串，不會與其他檔案衝突 */
.button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #4f46e5;
  color: white;
  cursor: pointer;
}

.button:hover {
  background-color: #4338ca;
}
```

第二步，在 component 裡把整個樣式檔當成物件匯入，再用 `styles.button` 取出對應的 class：

```jsx
// Button.jsx
import styles from "./Button.module.css"; // 匯入為一個物件

function Button({ children }) {
  // styles.button 實際上是一個像 "Button_button__x7f2a" 的獨特字串
  return <button className={styles.button}>{children}</button>;
}

export default Button;
```

對照之下，如果是 **純 CSS**，寫法只差在匯入方式與 `className` 是字串：

```jsx
// 純 CSS 版本
import "./Button.css"; // 直接匯入，class 進入全域作用域

function Button({ children }) {
  return <button className="button">{children}</button>; // 全域名稱，可能撞名
}
```

最後，示範 **CSS-in-JS（styled-components）** 的風格，感受一下「樣式與 component 合而為一」：

```jsx
// styled-components 版本（需先 npm install styled-components）
import styled from "styled-components";

// 直接建立一個「自帶樣式」的 button component
const StyledButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #4f46e5;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #4338ca;
  }
`;

function Button({ children }) {
  return <StyledButton>{children}</StyledButton>;
}
```

## 常見陷阱

!!! warning "忘記 `.module.css` 的命名結尾，作用域就失效"
    CSS Modules 靠檔名慣例來啟動。若你把檔案命名為 `Button.css`（少了 `.module`），建置工具會把它當成一般的全域 CSS 處理，class 就 **不會** 被改寫成獨特名稱，局部作用域的保護也就消失了。務必確認檔名是 `xxx.module.css`。

!!! warning "CSS Modules 的 class 要用物件屬性，不是字串"
    純 CSS 是 `className="button"`（字串），CSS Modules 則是 `className={styles.button}`（從匯入的物件取屬性）。若你在 CSS Modules 裡誤寫成字串 `className="button"`，瀏覽器會找不到那個實際被改寫過的 class 名，樣式就套不上去，畫面看起來像完全沒生效。

!!! warning "初學階段別急著上框架與元件庫"
    Tailwind、MUI、Chakra 都很好用，但它們會替你把樣式的實作細節包起來。在還沒把手刻 CSS 的基本功練熟前就依賴它們，容易變成「會用工具、但不懂底層」。先用 CSS Modules 打好地基，之後再導入這些工具會更順。

## 練習

以下把原文的 Assignment 改寫成可執行的閱讀與練習步驟。這一課偏概念，重點在建立「有哪些上樣式的做法、各自解決什麼問題」的全貌，並把 CSS Modules 練熟。

1. 理解 **CSS Modules**：回頭把本課「程式碼範例」的 CSS Modules 版本親手打一次，建立一個 `.module.css` 檔並在 component 裡匯入使用。確認你能說出「為什麼它能避免命名衝突」。
2. 比較 **CSS 與 CSS-in-JS**：思考兩者的取捨。純 CSS／CSS Modules 把樣式放在獨立檔案、寫法貼近傳統 CSS；CSS-in-JS 把樣式寫進 JavaScript，換來「依 state 動態上樣式」的便利，但多了 runtime 成本。試著各寫一句話說明你會在什麼情境選哪一種。
3. 概覽 **styled-components**：把本課的 styled-components 範例讀懂，感受「建立一個自帶樣式的 component」與「寫一個帶 class 的元素」在心智模型上的差異。你不需要精通它，能看懂並理解概念即可。
4. （延伸）若原文附有 project，請依原文連結完成實作練習。

## 原文與延伸資源

- 原文：[Styling React Applications](https://www.theodinproject.com/lessons/node-path-react-new-styling-react-applications)
- 本課引用：
  - CSS Modules（官方說明）：<https://github.com/css-modules/css-modules>
  - styled-components（CSS-in-JS 代表方案）：<https://styled-components.com/>
  - Tailwind CSS（CSS 工具類框架）：<https://tailwindcss.com/>
  - Material UI：<https://mui.com/>｜Radix：<https://www.radix-ui.com/>｜Chakra UI：<https://chakra-ui.com/>
  - lucide-react（圖示元件庫）：<https://lucide.dev/guide/packages/lucide-react>

---

> 本講義改寫自 The Odin Project《Styling React Applications》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
