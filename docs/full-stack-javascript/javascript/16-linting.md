---
title: Linting
source_url: https://www.theodinproject.com/lessons/node-path-javascript-linting
source_file: vendor/curriculum/javascript/javascript_in_the_real_world/linting.md
path: full-stack-javascript
course: JavaScript
order: 16
status: draft
generated: 2026-07-03
---

# Linting

> 改寫自 The Odin Project：[Linting](https://www.theodinproject.com/lessons/node-path-javascript-linting)
> ｜Full Stack JavaScript › JavaScript › JavaScript in the Real World

## 核心概念

在繼續深入程式碼之前，這一課先花點時間改善你的編輯器設定與整體開發效率。學會這些工具後，往後寫程式會輕鬆很多，甚至連縮排（indentation）這種瑣事都能自動幫你處理好。

### 為什麼需要 style guide（風格指南）

程式碼風格（code style）很重要。所謂風格，指的是縮排要用幾個空格、字串要用單引號還是雙引號、要不要加分號、程式的整體結構怎麼安排這類約定。針對這些細節，只要一整個團隊（或整個 codebase，程式庫）維持一致的規則，程式就會更好讀、更好維護。

網路上有好幾份熱門的 JavaScript style guide，它們規範的內容常常互相不同——但沒有哪一份是「對」或「錯」，重點只在於它們都強制某一套一致的做法。三份常見的例子：

1. [Airbnb Style Guide](https://github.com/airbnb/javascript)，是最流行的一份。
2. [Google 的 JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)。
3. [JavaScript Standard Style](https://standardjs.com/rules.html)。

這些指南裡塞滿了關於格式化、組織與撰寫程式的實用建議。問題是規則實在太多，很難全部記在腦子裡——這正是工具要登場的地方。

### linter（程式碼檢查工具）是什麼

**linter** 是一種會拿一組風格與正確性規則來掃描你程式碼的工具，一旦發現不符規則之處就回報給你。「lint」這個字原本指毛衣上惱人的棉絮，引申為程式裡那些不影響執行、卻讓人看了不舒服或暗藏隱患的小毛病。有些問題 linter 甚至能自動修正。

linter 能抓到的問題可以分成幾類，遠不只是「排版醜」而已：

- **可能的 bug（程式錯誤）**：例如宣告了卻從未用到的變數（`no-unused-vars`）、用到根本沒定義的變數（`no-undef`）、在同一個物件裡重複定義同名的 key、把賦值 `=` 誤寫在應該是比較 `===` 的地方。
- **危險寫法**：例如在 `switch` 的 `case` 之間忘了 `break` 而意外貫穿、在 loop（迴圈）裡宣告函式、使用已被視為不安全的 `==` 鬆散比較。
- **一致性與可讀性**：縮排、引號風格、分號、空白，這些不影響邏輯但影響閱讀的細節。

換句話說，linter 是一道自動化的第一關防線，能在程式真正跑起來（甚至送去 code review）之前，就先攔下一批低級錯誤與風格不一致。

JavaScript 世界裡的 linter 不只一種，但目前最主流、幾乎是業界標準的就是 [ESLint](https://eslint.org/)。

ESLint 會被安裝成專案的 **dev dependency（開發相依套件）**，這樣你就能透過命令列對任何檔案執行檢查。它的預設規則集（recommended）已經涵蓋了大多數常見情境，設定合理，開箱即用。往後你會想進一步閱讀[設定 ESLint 的文件](https://eslint.org/docs/latest/use/configure/)，學會如何納入或排除特定資料夾與檔案，以及調整個別規則的嚴格程度。

ESLint 的每條規則可以設成三種等級：`"off"`（關閉）、`"warn"`（警告，不中斷）、`"error"`（錯誤，通常會讓 CI 失敗）。這種細緻的分級讓你能依團隊需求，把某些規則當硬性要求、某些只當提醒。

### formatter（格式化工具）是什麼

**formatter** 很好用，跟 linter 相似但功能略有不同。formatter 會把你的 JavaScript 程式碼**自動重新排版**，讓它符合一組固定規則。它不是去「找出風格錯誤然後回報」，而是直接針對版面（layout）動手——聰明地決定空格、縮排層級、換行位置該怎麼擺。

同樣有好幾種 formatter，其中最熱門的是 [Prettier](https://prettier.io/)，它的特色是「高度固執己見」（opinionated）：除了少數幾個選項，大部分排版決定都不開放你自訂。乍聽之下像缺點，其實是刻意的設計——既然這些瑣碎決定都幫你定好了，你就不用再為縮排幾格、要不要空一行這種事糾結，可以把時間花在真正重要的問題上。

跟 ESLint 一樣，Prettier 也是安裝成專案的 dev dependency。它平常照預設規則跑，但你也可以透過 [Prettier 設定檔](https://prettier.io/docs/configuration)微調少數選項。有一點值得記住：如果你用的是 ESLint 的預設 recommended 規則集，那麼 lint 規則與 format 規則之間**不會打架**，你可以直接裝上 Prettier 就用，不必額外設定 `eslint-config-prettier`。

用 Prettier 讓寫程式更快更省心：你不必再字斟句酌地對齊縮排、也不必擔心漏掉某個分號，這些細節它都會替你搞定。

### linter 與 formatter 的分工

一句話總結兩者差別：**linter 負責「找問題」（含潛在 bug 與風格），formatter 負責「排版面」。** 兩者互補——formatter 把版面弄整齊，linter 抓出邏輯與品質上的疑慮。實務上專案常常兩個都裝，各司其職。

### IDE 擴充套件：方便，但不是「唯一真相」

linter 與 formatter 通常是你安裝在專案裡、透過命令列使用的套件。不過許多主流工具也提供 IDE 擴充套件，ESLint 與 Prettier 都有給 Visual Studio Code 的擴充，能讓檢查與格式化在你的機器上更順手。

舉例來說，裝上 [ESLint 擴充](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)後，它會直接在你開啟的檔案裡用彩色波浪底線標出警告與錯誤，還能告訴你違反了哪一條規則——完全不必到命令列去跑 ESLint。[Prettier 擴充](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)則讓你用一個 IDE 指令或自訂快捷鍵就把整份檔案格式化，同樣不用開終端機。

但有個重點：即使裝了擴充，你**仍然要**把這些套件當作 dependency 裝進專案、並保留設定檔。擴充可以設定 fallback（後備）規則，但只要它偵測到專案裡有對應的套件與設定檔，就會改用專案裡的規則與該版本的套件。這樣一來，**專案本身永遠是「該套用什麼規則」的唯一真相來源（source of truth）**。當你日後跟別人協作、或切換到別的專案時，就不會因為你本機的個人設定，而不小心把不想要的風格改動帶進去。

總之：擴充套件是很棒的便利工具，但不該被當成專案 lint 或 format 設定的權威來源。

> 小提示：還記得 template repository（範本儲存庫）嗎？你可以把 linter 與 formatter 的設定直接放進你的範本裡，往後開新專案就省事多了。

## 程式碼範例

以下示範在一個全新專案裡從零安裝並執行 ESLint。

第一步，在專案資料夾中互動式建立設定（會順便把 ESLint 裝成 dev dependency）：

```bash
# 依照提示回答問題，會自動產生 eslint.config.js
npm init @eslint/config@latest
```

它會產生一份 flat config（扁平設定檔）`eslint.config.js`，最小範例長這樣：

```javascript
// eslint.config.js —— ESLint 的扁平設定檔
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  {
    files: ["**/*.js"],          // 套用到所有 .js 檔
    plugins: { js },
    extends: ["js/recommended"], // 使用官方推薦規則集
    languageOptions: {
      // 宣告執行環境已提供的全域變數，否則 console 會被 no-undef 誤判為未定義
      globals: { console: "readonly" },
    },
    rules: {
      "no-unused-vars": "warn",  // 宣告未使用的變數：警告
      "no-undef": "warn",        // 使用未定義的變數：警告
    },
  },
]);
```

接著寫一段「故意有問題」的程式來測試：

```javascript
// messy.js
const greeting = "hello"   // 宣告後從未使用 → no-unused-vars
console.log(mesage)        // 變數名稱拼錯（應為 message）→ no-undef
```

在命令列對它執行檢查：

```bash
# 檢查單一檔案
npx eslint messy.js
```

ESLint 會回報兩個警告：`greeting` 宣告了卻沒用到、`mesage` 未定義（很可能是把 `message` 打錯了）。這兩個都是實實在在、可能導致 bug 的問題，而不只是排版。

對於「能自動修正」的問題（多半是風格類，例如缺分號、縮排錯誤），加上 `--fix` 就能一次改好：

```bash
# 自動修正可修正的問題
npx eslint messy.js --fix

# 也可以一次檢查並修正整個資料夾
npx eslint src/ --fix
```

最後，用 Prettier 做純排版。先裝成 dev dependency，再對整個專案格式化：

```bash
# 安裝 Prettier（--save-dev 代表裝成開發相依）
npm install --save-dev prettier

# 用 Prettier 就地重新排版所有檔案（. 代表目前資料夾）
npx prettier . --write
```

## 常見陷阱

!!! warning "把 IDE 擴充當成唯一真相來源"
    只在編輯器裝了 ESLint／Prettier 擴充、卻沒把它們裝進專案、也沒放設定檔，是最常見的錯誤。這樣一來，規則綁在「你這台電腦的個人設定」上：換一台機器、或別的協作者打開專案，看到的檢查結果就完全不同，還可能把不一致的風格改動 commit 進去。正確做法是把套件裝成專案的 dev dependency 並提交設定檔，讓專案本身成為 source of truth，擴充只是讀取它、提供即時提示的便利工具。

!!! warning "混淆 linter 與 formatter 的職責"
    formatter（如 Prettier）只管排版，不會抓出「未使用的變數」「拼錯的變數名」這類潛在 bug；linter（如 ESLint）才會。別以為程式碼被 Prettier 排得漂漂亮亮就代表沒問題——排版正確和邏輯正確是兩回事，兩者要分工並用。

!!! warning "以為裝了工具就能取代思考"
    linter 與 formatter 幫你攔下的是低級錯誤與風格不一致，讓你能把心力放在真正重要的問題上；它們不會幫你把演算法寫對、也不保證程式沒有邏輯 bug。把它們當成自動化的第一道防線，而不是萬能保險。

## 練習

依序完成下列 Assignment：

1. 閱讀一篇談 [linter 的價值與運作原理](https://hackernoon.com/how-linting-and-eslint-improve-code-quality-fa83d2469efe) 的文章，重點放在「linting 能預防哪些問題」——例如未使用變數、未定義變數、可疑的比較、以及整體風格不一致所帶來的維護成本。
2. 觀看 Prettier 作者親自錄製的[簡短介紹影片](https://www.youtube.com/watch?v=hkfBvpEfWdA)，理解 Prettier「固執己見、少即是多」的設計哲學。
3. 打開 [Prettier 的線上 playground](https://prettier.io/playground)實際試玩：把你以前寫的一段 JavaScript 貼進去，看看它幫你重新排版後變成什麼樣子，感受 formatter 的效果。

延伸的 project 步驟（例如把 linter／formatter 設定加進你自己的 template repository），請直接參考[原文課程頁面](https://www.theodinproject.com/lessons/node-path-javascript-linting)。

## 原文與延伸資源

- 原文：[Linting](https://www.theodinproject.com/lessons/node-path-javascript-linting)
- 本課引用：
  - [ESLint 官方 Getting Started](https://eslint.org/docs/latest/use/getting-started)（安裝、flat config、`--fix` 用法）
  - [設定 ESLint 文件](https://eslint.org/docs/latest/use/configure/)
  - [Prettier 官方網站](https://prettier.io/) 與 [設定檔文件](https://prettier.io/docs/configuration)
  - Style guides：[Airbnb](https://github.com/airbnb/javascript)、[Google](https://google.github.io/styleguide/jsguide.html)、[JavaScript Standard Style](https://standardjs.com/rules.html)
  - [VS Code ESLint 擴充](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)、[Prettier 擴充](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

---

> 本講義改寫自 The Odin Project《Linting》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
