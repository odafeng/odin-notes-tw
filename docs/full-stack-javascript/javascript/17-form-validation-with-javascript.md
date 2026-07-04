---
title: 用 JavaScript 做表單驗證
source_url: https://www.theodinproject.com/lessons/node-path-javascript-form-validation-with-javascript
source_file: vendor/curriculum/javascript/javascript_in_the_real_world/form_validation_with_javascript.md
path: full-stack-javascript
course: JavaScript
order: 17
generated: 2026-07-03
---

# 用 JavaScript 做表單驗證

> 改寫自 The Odin Project：[Form Validation with JavaScript](https://www.theodinproject.com/lessons/node-path-javascript-form-validation-with-javascript)
> ｜Full Stack JavaScript › JavaScript › JavaScript in the Real World

## 核心概念

表單（form）是大多數網站的核心。註冊、登入、聯絡我們、搜尋、結帳，幾乎每一個重要功能都靠表單收集使用者輸入的資料。既然要收資料，就得確保收到的資料是「乾淨、正確、符合格式」的，這件事就叫做**表單驗證（form validation）**。

### 為什麼一定要驗證表單

驗證的目的有三個層面，缺一不可：

1. **資料正確性（data integrity）**：後端程式需要格式正確的資料才能運作。如果 email 欄位收到的是「abc」而不是「abc@example.com」，後續寄信、比對帳號都會出錯。
2. **安全性（security）**：像密碼強度限制，可以避免使用者用過於脆弱的密碼，也降低帳號被盜的風險。
3. **保護應用程式本身**：不做限制的表單容易被惡意使用者塞入畸形資料，進而攻擊系統。

這裡要記住一個非常重要的觀念：**前端（client-side）驗證不是安全措施**。任何人都可以打開瀏覽器的開發者工具、或直接手工組一個 HTTP request 繞過你在瀏覽器裡寫的所有檢查。因此前端驗證的真正價值是**改善使用者體驗**——在使用者按下送出之前，就即時、友善地告訴他哪裡填錯了，不用等到送去伺服器再退回。真正把關資料合法性的工作，**永遠要在後端（server-side）再做一次**。前端擋掉的只是「不小心填錯」的多數情況，後端擋的才是「故意繞過」的攻擊。

### 前端驗證的兩種類型

在瀏覽器端做驗證，可以分成兩種做法：

- **內建的 HTML 表單驗證（built-in HTML validation）**：只在 HTML 標籤上加屬性，例如 `required`、`type="email"`、`minlength`、`pattern` 等。瀏覽器會自動幫你檢查並跳出預設的錯誤提示。這種方式最快、最省事，但客製化程度低——你很難改掉那個醜醜的預設氣泡文字，也很難精細控制錯誤何時顯示、長什麼樣子。
- **JavaScript 驗證**：用程式碼自己控制檢查邏輯、錯誤訊息與樣式。客製化程度最高，可以做出「跨欄位比對」（例如「密碼」與「確認密碼」要相同）這類 HTML 屬性辦不到的規則。

實務上的建議是：**先用 HTML 屬性打底，再用 JavaScript 加強**。而 JavaScript 加強的核心工具，就是這一課的主角——Constraint Validation API。

### 內建的驗證約束（constraints）

先認識 HTML 提供的驗證約束，因為 JavaScript API 正是建立在這些約束之上。約束分兩類：

**內在約束（intrinsic constraints）**——由 `input` 的 `type` 決定：

- `type="email"`：值必須是合法的 email 格式，否則觸發 `typeMismatch`。
- `type="url"`：值必須是絕對 URL，否則觸發 `typeMismatch`。

**基本約束（basic constraints）**——由屬性決定：

| 屬性 | 意義 | 違反時的旗標 |
|------|------|--------------|
| `required` | 必填 | `valueMissing` |
| `minlength` | 最少字元數 | `tooShort` |
| `maxlength` | 最多字元數 | `tooLong` |
| `min` | 數值/日期下限 | `rangeUnderflow` |
| `max` | 數值/日期上限 | `rangeOverflow` |
| `pattern` | 需符合正規表達式 | `patternMismatch` |
| `step` | 需為步進值的整數倍 | `stepMismatch` |

### Constraint Validation API

Constraint Validation API 讓你能用 JavaScript「讀取」上面這些約束的檢查結果，並「客製」錯誤訊息。它主要由幾個東西組成。

**`validity` 屬性（ValidityState 物件）**：每個表單控制項（`<input>`、`<select>`、`<textarea>` 等）都有一個 `validity` 物件，裡面是一組布林值，對應上表每一種約束是否被違反：

- `valueMissing`：必填卻沒填。
- `typeMismatch`：型別不符（email、url）。
- `patternMismatch`：不符合 `pattern`。
- `tooShort` / `tooLong`：字元數過少 / 過多。
- `rangeUnderflow` / `rangeOverflow`：數值過小 / 過大。
- `stepMismatch`：不符合 `step`。
- `customError`：你用 `setCustomValidity()` 設定了自訂錯誤。
- `valid`：**所有**約束都通過時為 `true`。

**`validationMessage` 屬性**：目前這個控制項的錯誤訊息字串（合法時是空字串），瀏覽器會依系統語言在地化。

**`willValidate` 屬性**：布林值，表示這個控制項在送出時是否會被驗證（例如被 `disabled` 的欄位就不會）。

**三個方法**：

- `checkValidity()`：回傳布林值代表是否通過；**不會**在畫面上顯示提示，但若不通過會對該元素觸發 `invalid` 事件。
- `reportValidity()`：跟 `checkValidity()` 一樣回傳布林值，但**會**用瀏覽器 UI 把錯誤顯示給使用者。
- `setCustomValidity(message)`：設定一段自訂錯誤訊息。只要訊息非空字串，該欄位就被視為不合法（`customError` 為 `true`）；傳入**空字串 `""` 就會清除**這個自訂錯誤，讓欄位重新變合法。

### novalidate：把方向盤完全交給 JavaScript

如果你想完全用 JavaScript 掌控驗證，包括自己畫錯誤訊息、自己決定何時檢查，就在 `<form>` 上加 `novalidate` 屬性。它會關掉瀏覽器「攔截送出並跳出預設氣泡」的行為，但**不會**關掉 `validity` 物件的計算——也就是說，`email.validity.typeMismatch` 這些旗標照樣可用，只是瀏覽器不再自作主張地打斷送出。這正是我們要的：邏輯還在，UI 由我們接手。

### 搭配 CSS 假類別（pseudo-classes）

驗證狀態可以用 CSS 假類別直接上色，不必寫 JavaScript：

- `:valid` / `:invalid`：只要控制項合法 / 不合法就套用——問題是頁面一載入、使用者都還沒動，空的必填欄位就已經是 `:invalid`，馬上一片紅，體驗很差。
- `:user-valid` / `:user-invalid`：只有在**使用者實際互動過之後**才會套用。這正好解決上面「一開場就滿江紅」的問題，是現在做即時驗證上色的首選。

### 何時觸發驗證：事件的選擇

要做「即時（live）驗證」，關鍵是綁對事件：

- `input` 事件：使用者每敲一個字就觸發，適合「邊打邊檢查」。
- `blur` 事件：使用者離開（游標移出）欄位時觸發，適合「填完這格再檢查」，比較不吵。
- `submit` 事件：按下送出時觸發，是最後一道防線；配合 `event.preventDefault()` 可以在有錯時攔下送出。

一個常見組合是：`input` 時清掉已修正的錯誤、`blur` 時做完整檢查、`submit` 時對全部欄位再驗一次並阻止不合法的送出。

## 程式碼範例

以下是一個 email 欄位的即時驗證，示範 `novalidate`、`validity`、`setCustomValidity()` 與 `:user-invalid` 如何合作。

```html
<!-- 加上 novalidate，關掉瀏覽器預設提示，改由 JS 全權處理 -->
<form novalidate>
  <label for="mail">請輸入 email：</label>
  <input type="email" id="mail" name="mail" required minlength="8" />
  <!-- aria-live 讓螢幕閱讀器能即時念出錯誤訊息 -->
  <span class="error" aria-live="polite"></span>
  <button type="submit">送出</button>
</form>
```

```css
/* 只在使用者互動過、且欄位不合法時才變紅，避免一載入就滿江紅 */
input:user-invalid {
  border: 2px solid #cc0000;
}

.error {
  color: #cc0000;
  font-size: 0.85rem;
}
```

```javascript
const form = document.querySelector("form");
const email = document.getElementById("mail");
const emailError = document.querySelector(".error");

// 依據 validity 物件的旗標，決定要顯示哪一句錯誤訊息
function showError() {
  if (email.validity.valueMissing) {
    emailError.textContent = "email 為必填欄位。";
  } else if (email.validity.typeMismatch) {
    emailError.textContent = "請輸入正確的 email 格式。";
  } else if (email.validity.tooShort) {
    emailError.textContent = `email 至少要 ${email.minLength} 個字元，你只輸入了 ${email.value.length} 個。`;
  } else {
    emailError.textContent = "";
  }
}

// 邊打邊檢查：合法就清空訊息，不合法就顯示對應提示
email.addEventListener("input", () => {
  if (email.validity.valid) {
    emailError.textContent = "";
  } else {
    showError();
  }
});

// 送出時再把關一次；有錯就顯示訊息並攔下送出
form.addEventListener("submit", (event) => {
  if (!email.validity.valid) {
    showError();
    event.preventDefault(); // 阻止不合法的送出
  } else {
    event.preventDefault(); // 範例不真的送出，改跳提示
    alert("驗證通過，擊掌！");
  }
});
```

下面這個例子示範**跨欄位、動態的自訂約束**——依國家切換郵遞區號規則，這是純 HTML 屬性做不到的：

```javascript
const country = document.getElementById("country");
const postalCode = document.getElementById("postal-code");

// 每個國家一組：[正規表達式, 錯誤訊息]
const constraints = {
  tw: ["^\\d{3}(\\d{2})?$", "台灣郵遞區號需為 3 碼或 5 碼數字"],
  fr: ["^(F-)?\\d{5}$", "法國郵遞區號需為 5 碼數字"],
};

function checkPostalCode() {
  const rule = constraints[country.value];
  const pattern = new RegExp(rule[0]);

  if (pattern.test(postalCode.value)) {
    postalCode.setCustomValidity(""); // 通過：清除自訂錯誤
  } else {
    postalCode.setCustomValidity(rule[1]); // 不通過：設定自訂錯誤
  }
  postalCode.reportValidity(); // 立即把結果顯示給使用者
}

country.addEventListener("change", checkPostalCode);
postalCode.addEventListener("input", checkPostalCode);
```

## 常見陷阱

!!! warning "以為前端驗證就夠安全了"
    前端驗證只負責體驗，不負責安全。使用者可以用開發者工具刪掉 `required`、直接改 DOM 值，或繞過整個頁面手工送 HTTP request。**任何從瀏覽器來的資料都必須在後端重新驗證一次**，前端擋的是手滑，後端擋的才是攻擊。

!!! warning "忘記用空字串清除 setCustomValidity"
    `setCustomValidity()` 只要收到非空字串，該欄位就永遠被判為不合法（`customError` 為 `true`），即使使用者已經改對了也一樣。每次重新檢查時，**通過的分支一定要呼叫 `setCustomValidity("")`** 把舊錯誤清掉，否則欄位會卡在錯誤狀態送不出去。

!!! warning "用 :invalid 導致一載入就滿江紅"
    `:invalid` 不管使用者有沒有互動過都會生效，於是頁面一打開，所有空的必填欄位立刻變紅，非常嚇人。做即時上色請改用 `:user-invalid` / `:user-valid`，它只在使用者實際碰過欄位後才套用。

!!! warning "忘了加 novalidate，自訂 UI 和瀏覽器預設氣泡打架"
    想完全自己畫錯誤訊息時，若沒在 `<form>` 加 `novalidate`，瀏覽器會照樣跳出它那個預設氣泡，跟你的自訂訊息重複又互相干擾。加上 `novalidate` 後，`validity` 旗標照常可用，只是顯示交給你。另外注意：用程式呼叫 `form.submit()` 會**跳過**驗證與 `submit` 事件，要觸發驗證請讓使用者點擊 `type="submit"` 的按鈕。

## 練習

### 熱身：替 Library 專案加上驗證

回到你先前的「Library（圖書館）」專案，替新增書籍的表單加上驗證。當使用者想送出、但某個欄位是空的，顯示一段自訂錯誤訊息（例如「作者姓名必須填寫！」）。記得沿用先前學過的 git 分支工作流程（開一個新的 feature 分支來做這個功能）。

實作提示：在對應的 `<input>` 上加 `required`，在 `submit` 事件裡用 `input.validity.valueMissing` 判斷是否為空，再用 `setCustomValidity()` 或自己插入的 `<span>` 顯示訊息。

### 進階練習：即時 inline 驗證表單

自己做一個瀏覽器表單，收集這些欄位：Email、Country（國家）、Postal Code（郵遞區號）、Password（密碼）、Password Confirmation（確認密碼）。要求採用**即時 inline 驗證**——邊打邊驗，而不是只在送出時才驗。欄位不合法時要標紅並顯示錯誤訊息引導使用者。

表單不需要真的送出，但若在仍有錯誤或必填未填的情況下按下按鈕，要顯示錯誤訊息。務必在 `<form>` 上加 `novalidate`，把**所有**驗證交給 JavaScript。你仍可使用不同的 `<input>` type，但要用 JavaScript 檢查與回報其合法性。全部通過並「送出」時，給使用者一個擊掌（high five）。

建議步驟（詳細步驟請回原文對照）：

1. 建立一份空白 HTML 文件。
2. 動手前先在白板上想清楚：需要哪些表單元素？每個欄位配什麼驗證器（validator）？需要哪些物件與函式？花幾分鐘規劃，能省下一小時亂寫的時間。
3. 寫出表單元素。
4. 加上 JavaScript：當使用者離開某個欄位（`blur`）時，自動驗證該欄位。
5. 測試所有可能情況（空值、格式錯、兩次密碼不同等）。
6. 別忘了用 CSS 的 `:user-valid` 與 `:user-invalid` 假類別來替驗證狀態上色。

## 原文與延伸資源

- 原文：[Form Validation with JavaScript](https://www.theodinproject.com/lessons/node-path-javascript-form-validation-with-javascript)
- 本課引用：
    - [MDN：Client-side form validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
    - [MDN：Constraint validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation)
    - [MDN：`<form>` 的 novalidate 屬性](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#novalidate)

---

> 本講義改寫自 The Odin Project《Form Validation with JavaScript》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
