---
title: 表單驗證
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-form-validation
source_file: vendor/curriculum/intermediate_html_css/forms/form_validations.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 15
status: draft
generated: 2026-07-03
---

# 表單驗證

> 改寫自 The Odin Project：[Form Validation](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-form-validation)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Forms

## 核心概念

表單驗證（form validation）就是替 input（輸入欄位）設下規則與限制，決定使用者可以填入什麼樣的資料。當使用者填入違反規則的內容，瀏覽器會攔住送出動作，並跳出訊息告訴他哪裡有問題、該怎麼修正。

為什麼要驗證？兩個理由。第一，保護後端系統，避免收到格式錯誤或不合理的資料（例如空白的 email、負數的數量）。第二，改善使用者體驗，讓填表過程盡量清楚、不容易出錯。這一課聚焦在 HTML 內建的驗證（built-in validation），也就是只靠加幾個 attribute（屬性）就能生效、完全不用寫 JavaScript 的那一類，最後再看怎麼用 CSS 替驗證狀態上色。

### required：必填

登入表單的 email 與密碼、註冊表單的使用者名稱，這些欄位一定要填。只要在該欄位加上 `required` attribute，瀏覽器就會在使用者按下送出、但欄位還空著時攔住表單，並提示「請填寫這個欄位」。

為了符合無障礙（accessibility）準則與良好體驗，我們應該主動標示哪些欄位是必填的。常見做法是在 label（標籤）後面加一個星號（\*），並在表單某處說明「星號代表必填」，讓星號的意義對使用者一目瞭然。

### 文字長度驗證：minlength 與 maxlength

有時我們想限制使用者輸入的字數。現實例子像是 X（前身是 Twitter）早年狀態欄的 140 字上限，或使用者名稱的最短、最長限制。

- `minlength`：給一個整數，代表最少要輸入幾個字元。輸入不足會被攔下。
- `maxlength`：給一個整數，代表最多能輸入幾個字元。瀏覽器會直接擋住多打的字，讓你根本打不進去超過的部分。

這裡有一個容易忽略的重點：**`minlength` 不等於 `required`**。根據 MDN 對 `minlength` 的說明，「限制驗證只在值被使用者變更時才會套用」。所以若一個欄位只有 `minlength`、沒有 `required`，使用者完全不打字（保持空白）時，表單仍然送得出去，因為值沒有被變更、驗證不會被觸發。要「必填且至少 N 個字」，兩個 attribute 都要加。

HTML 允許在同一個表單控制項（form control）上疊加多個驗證，例如同時給 `<textarea>` 加上 `minlength` 與 `maxlength`，就能把輸入長度框在一個上下限之間，控制力更強。

### 數字範圍驗證：min 與 max

就像限制文字長度，很多情況我們要限制數字的範圍，例如訂購表單的商品數量、訂機票時的乘客人數。

- `min`：可接受的最小值。
- `max`：可接受的最大值。

要注意 `min` 與 `max` 只對「數字類」的表單控制項有效，也就是 number、date（日期）、time（時間）等 input type。放在純文字欄位上不會生效。此外還有 `step` attribute，用來規定數值的間隔（預設是 1）；例如 `step="5"` 代表只接受 5 的倍數，落在間隔之外的值會被視為無效。

### pattern：格式樣式驗證

有時光靠長度或範圍還不夠，我們要確保資料符合某種「格式」，例如密碼、信用卡號、郵遞區號的樣式。這時用 `pattern` attribute，值是一段 regular expression（正規表達式，簡稱 regex）。舉例來說，美國郵遞區號的格式是「5 個數字，後面接一個可有可無的破折號與 4 個數字」，可以寫成 `pattern="[0-9]{5}(-[0-9]{4})?"`。

關於 regex，這一課不需要你鑽研它。regex 本身可以很複雜，而且在 HTML attribute、JavaScript 字串、JavaScript regex 字面值裡的寫法細節還不太一樣。實務上，直接搜尋一個現成、可靠的 regex 來用，通常比自己硬湊一個更務實。

`pattern` 有兩個實務重點。第一，格式不符時瀏覽器只會顯示很籠統的「請符合所要求的格式」，對使用者幫助不大，所以最好搭配 `placeholder` attribute 給一個範例值（例如 `placeholder="12345-6789"`），讓使用者一看就知道該怎麼填。第二，`pattern` 只能用在 `<input>` 元素上。

此外，有些 input type 本身就內建了格式檢查，不必自己寫 `pattern`：`type="email"` 會確認輸入是合法的 email 格式，`type="url"` 會確認網址以 http 或 https 開頭。善用這些內建 type，能省下許多手寫 regex 的功夫。

### 用 CSS 替驗證狀態上色

我們可以用 pseudo-class（偽類）依驗證結果替欄位改變外觀。最直覺的是 `:valid`（通過驗證）與 `:invalid`（未通過），但它們有個缺點：**從頁面一載入就立刻生效**。也就是說，使用者還沒碰過的必填欄位會馬上被標成紅色（invalid），體驗很差，像是一進門就被責罵。

更好的選擇是 `:user-valid` 與 `:user-invalid`。它們只在**使用者實際互動過該欄位之後**（或嘗試送出表單時）才會套用。這樣欄位在使用者碰它之前會保持中性的預設樣式，等使用者輸入了不合法的 email 或網址、離開欄位後，邊框才轉成紅色。這種「先中性、互動後才回饋」的行為，正是我們想要的。`:user-valid` / `:user-invalid` 自 2023 年底起已在主流瀏覽器廣泛可用。

其他可搭配的 pseudo-class 還有 `:required`（必填欄位）、`:optional`（非必填欄位）、`:in-range` 與 `:out-of-range`（數值在／不在 min–max 範圍內）。

### 內建驗證的極限，以及為何一定要有伺服器端驗證

內建驗證好加又快，能涵蓋很多情境，但有它的天花板。有些需求它做不到，例如檢查「密碼」與「確認密碼」兩欄是否一致，或檢查某個使用者名稱是否已被註冊。驗證訊息的內容與樣式，我們能自訂的空間也有限。這些情況就得動用 JavaScript 與 CSS 自己做 custom validation（自訂驗證），那會在後面的課程再談。

最關鍵的一點：**client-side validation（客戶端驗證）不是安全機制，只是體驗上的優化**。惡意使用者可以關掉 JavaScript、直接改動 DOM，或攔截並竄改網路請求，繞過所有前端驗證。因此，只要是進入系統的使用者資料，都必須在 server-side（伺服器端）再驗證一次。前端驗證負責體驗，後端驗證負責資料完整性與安全，兩者缺一不可，伺服器端驗證會在課程後段涵蓋。

## 程式碼範例

以下是一個綜合多種內建驗證的可執行範例，直接存成 `.html` 檔用瀏覽器開啟即可測試。

```html
<!-- 綜合內建表單驗證示範 -->
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <title>表單驗證示範</title>
    <style>
      /* 使用者互動過、且值不合法時才顯示紅框 */
      input:user-invalid,
      textarea:user-invalid {
        border: 2px solid red;
      }
      /* 使用者互動過、且值合法時顯示綠框 */
      input:user-valid,
      textarea:user-valid {
        border: 2px solid green;
      }
      label { display: block; margin-top: 1rem; }
    </style>
  </head>
  <body>
    <form>
      <!-- required：必填，星號提示使用者 -->
      <label for="username">使用者名稱 *（3–15 字）</label>
      <input
        id="username"
        name="username"
        type="text"
        required
        minlength="3"
        maxlength="15"
      />

      <!-- type=email：內建 email 格式檢查 -->
      <label for="email">Email *</label>
      <input id="email" name="email" type="email" required />

      <!-- min / max：數字範圍 1–6 -->
      <label for="passengers">乘客人數（1–6）</label>
      <input id="passengers" name="passengers" type="number" min="1" max="6" />

      <!-- pattern：美國郵遞區號格式，placeholder 給範例 -->
      <label for="zip">郵遞區號</label>
      <input
        id="zip"
        name="zip"
        type="text"
        pattern="[0-9]{5}(-[0-9]{4})?"
        placeholder="12345-6789"
      />

      <button type="submit">送出</button>
    </form>
  </body>
</html>
```

試著把使用者名稱留空、或只打兩個字、或在乘客人數填 0 或 7、或把郵遞區號亂打，按下「送出」時瀏覽器就會攔下表單並顯示對應的錯誤提示。

## 常見陷阱

!!! warning "minlength 不會讓欄位變必填"
    只有 `minlength` 而沒有 `required` 時，使用者完全不填（保持空白）表單仍能送出，因為限制驗證只在值被使用者變更後才觸發。若你要的是「必填，而且至少 N 個字」，`required` 與 `minlength` 兩個 attribute 都要加。

!!! warning "min / max 只對數字類欄位有效"
    `min` 與 `max` 只在 number、date、time 等數字類 input 上作用。放在 `type="text"` 這種純文字欄位上不會有任何效果；想限制文字長度要改用 `minlength` / `maxlength`。

!!! warning "別用 :invalid 當預設狀態，改用 :user-invalid"
    `:invalid` 從頁面載入就立即生效，會讓使用者還沒碰過的必填欄位一開始就被標紅，體驗很差。改用 `:user-invalid` / `:user-valid`，讓欄位在使用者實際互動後才顯示驗證回饋。

!!! warning "前端驗證擋不住惡意使用者"
    client-side validation 可以被關閉 JavaScript、竄改 DOM 或攔截網路請求輕易繞過，它只是體驗優化，不是安全防線。任何進入系統的資料都必須在伺服器端再驗證一次。

## 練習

1. 閱讀並跟著操作 [MDN 的 Client-Side Form Validation 指南](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)。先跳過「Validating forms using JavaScript」一節，那部分會在之後的課程涵蓋。
2. 讀一遍 SitePoint 的 [Complete Guide to HTML Forms and Constraint Validation](https://www.sitepoint.com/html-forms-constraint-validation-complete-guide/)。可以跳過「JavaScript and the Constraint Validation API」與「Creating a Custom Form Validator」兩節。
3. 瀏覽這則整理 [表單驗證 UX 該做與不該做](https://threadreaderapp.com/thread/1400388896136040454.html) 的 X 討論串，吸收實務上的設計要點。

自我檢核（Knowledge check）：讀完後試著回答——`required` 驗證的作用是什麼？檢查文字長度可以用哪些驗證？如何驗證數字輸入的最小值與最大值？`pattern` 驗證可以用來做什麼？替合法與不合法欄位上色時，可以用哪些 CSS pseudo-class？

## 原文與延伸資源

- 原文：[Form Validation](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-form-validation)
- 本課引用：
  - [MDN — Client-side form validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
  - [MDN — `:user-invalid`](https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid)
  - [MDN — `minlength` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/minlength)
  - [MDN — `max` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/max)
  - [MDN — Regular Expressions 指南](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
  - [SitePoint — HTML Forms and Constraint Validation Complete Guide](https://www.sitepoint.com/html-forms-constraint-validation-complete-guide/)

---

> 本講義改寫自 The Odin Project《Form Validation》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
