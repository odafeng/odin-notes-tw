---
title: 表單基礎
source_url: https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-form-basics
source_file: vendor/curriculum/intermediate_html_css/forms/form_basics.md
path: full-stack-javascript
course: Intermediate HTML and CSS
order: 14
status: draft
generated: 2026-07-03
---

# 表單基礎

> 改寫自 The Odin Project：[Form Basics](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-form-basics)
> ｜Full Stack JavaScript › Intermediate HTML and CSS › Forms

## 核心概念

表單（form）是網站最關鍵的部分之一，它是使用者進入後端（backend）的入口：使用者在表單裡提供資料，你的程式再拿這些資料去做事——登入、註冊、搜尋、下單、付款，幾乎每個有互動的網站都少不了表單。這一課要學的，是用 HTML 把各種輸入元件（form control）組起來，並知道每種資料該用哪一種輸入方式。挑對輸入類型很重要：同一筆資料常常有很多種收集方式，但對使用者最順手的通常只有一種。

### form 元素

`<form>` 是一個容器元素（container element），就像先前學過的 `<div>` 一樣，它把使用者要操作的所有輸入元件包在一起。form 有兩個一定要認識的屬性（attribute）：

- **`action`**：值是一個 URL，告訴表單「資料要送到哪裡處理」。之後學到後端時，就是靠這個屬性把前端表單接到後端系統。現在只要知道它的用途即可。
- **`method`**：告訴瀏覽器要用哪一種 HTTP request method（HTTP 請求方法）來送出表單。你最常用到的是 GET 與 POST 兩種。

GET 用在「要從伺服器取得東西」的時候。例如 Google 搜尋就是用 GET 請求，因為它是去「取得（get）」搜尋結果。POST 則用在「要改變伺服器上的東西」的時候，例如使用者註冊帳號、或在網站上付款。

```html
<form action="example.com/path" method="post">

</form>
```

### 輸入元件（form controls）

要開始收集使用者資料，就得放進「輸入元件」——也就是使用者會直接互動的那些元素：文字框、下拉選單、核取方塊、按鈕等等。以下幾節逐一介紹最常用的幾種。

### input 元素

`<input>` 是所有輸入元件裡最萬用的一個。它接受一個 `type` 屬性，用來告訴瀏覽器「該預期什麼型別的資料」以及「該把這個輸入框畫成什麼樣子」。最基本的是文字輸入（text input）：

```html
<form action="example.com/path" method="post">
  <input type="text">
</form>
```

文字輸入接受任何文字，例如用來收集使用者的名字。

#### label（標籤）

單獨一個 input 其實沒什麼用，因為使用者不知道這格要填什麼。我們用 `<label>` 元素替 input 加上說明文字，文字放在開合標籤之間：

```html
<form action="example.com/path" method="post">
  <label for="first_name">First Name:</label>
  <input type="text" id="first_name">
</form>
```

label 接受一個 `for` 屬性，用來把它和某個特定的 input 綁在一起：被綁的 input 需要一個 `id` 屬性，值要和 label 的 `for` 相同。綁定之後，點 label 就會把游標聚焦（focus）到對應的 input 上，讓使用者直接開始輸入。這也讓表單對使用輔助科技（assistive technology，例如螢幕報讀軟體）的使用者更友善——這是無障礙（accessibility）的重要一環，能做就做。

#### placeholder 屬性

想在輸入框裡先給一段提示，可以加上 `placeholder` 屬性，它的值就是要顯示的提示文字（placeholder text）：

```html
<label for="first_name">First Name:</label>
<input type="text" id="first_name" placeholder="Bob...">
```

用 placeholder 來示範文字該怎麼填、格式該長怎樣。注意它只是「灰字提示」，使用者一開始打字就會消失，不能拿它來取代 label。

#### name 屬性

label 是講給「使用者」聽的，讓人知道這格代表什麼；同樣地，我們也得讓「後端」知道每筆送過去的資料各自代表什麼。這就靠 `name` 屬性：

```html
<label for="first_name">First Name:</label>
<input type="text" id="first_name" name="first_name">
```

`name` 是送出表單後，用來指涉這個輸入框資料的參照——你可以把它想成這個輸入的「變數名稱」。表單資料是以「name/value 成對（name/value pair）」的形式送出的，`name` 是鍵、使用者填的內容是值。**每個輸入元件都應該要有 `name` 屬性，否則送出表單時它會被直接忽略。**

若你把一個含有 first_name、last_name、age 的表單送出，後端收到的資料大致長這樣：

```json
"form": {
    "age": "33",
    "first_name": "John",
    "last_name": "Doe"
  }
```

鍵就是各 input 的 `name`。把某個 `name` 改掉、或整個拿掉再送一次，就能看到送出的資料跟著變——拿掉 `name` 的那格會直接不見。

#### 在 form 之外使用輸入元件

值得一提：HTML 的這些輸入元件，就算放在 `<form>` 之外、就算你沒有後端可以送資料，也照樣能用。例如你可能想用一個 input 收使用者輸入，再用 JavaScript 把它顯示在頁面別處。之後課程做專案時，就會這樣操作輸入元件的資料。

#### type 屬性：更多輸入型別

改變 `type` 的值，input 就變出不同的輸入型別：

- **`email`**：專門收 email 的文字輸入。它在手機上會叫出含 `@` 的鍵盤，並會驗證（validate）使用者是否輸入了格式正確的 email（驗證細節之後會談）。
- **`password`**：專門收密碼的文字輸入。它會把輸入內容遮成星號 `*` 或圓點 `•`，避免旁人偷看。
- **`number`**：只接受數字，其他字元一律忽略。
- **`date`**：收日期用。這個型別很特別，會直接渲染出日曆日期選擇器（date picker），大幅改善選日期的體驗。

```html
<label for="user_email">Email Address:</label>
<input type="email" id="user_email" name="email" placeholder="you@example.com">

<label for="user_password">Password:</label>
<input type="password" id="user_password" name="password">

<label for="amount">Amount:</label>
<input type="number" id="amount" name="amount">

<label for="dob">Date of Birth:</label>
<input type="date" id="dob" name="dob">
```

#### textarea（多行文字）

`<textarea>` 技術上不算 input 元素，但它提供一個可容納多行文字的輸入框，適合留言、評論這類較長內容，還能用滑鼠拖右下角改變大小。它和 input 不同，有結束標籤，所以可以在標籤之間放入初始內容：

```html
<textarea>Some initial content</textarea>
```

textarea 還有兩個別的元件沒有的專屬屬性：`rows` 與 `cols`，分別控制初始的高度（列數）與寬度（欄數）：

```html
<textarea rows="20" cols="60"></textarea>
```

### 選擇類元件（selection elements）

當你想讓使用者從一份預先定義好的清單裡選值，就用選擇類元件。這一組是「讓使用者選預設選項」最常用的三種：select 下拉選單、radio button、checkbox。

#### select 下拉選單

`<select>` 會渲染成一個下拉清單。它的寫法很像無序清單（unordered list）：select 包住多個 `<option>`，每個 option 就是一個可選項目：

```html
<select name="Car">
  <option value="mercedes">Mercedes</option>
  <option value="tesla">Tesla</option>
  <option value="volvo" selected>Volvo</option>
  <option value="bmw">BMW</option>
</select>
```

每個 option 都應該有 `value` 屬性（若省略，就用標籤裡的文字當值），送出表單時送到伺服器的就是這個 `value`。想讓某一項成為預設選取，就給它 `selected` 屬性（上例的 Volvo）。

若選項很多，還能用 `<optgroup>` 把選項分組，它的 `label` 屬性會被瀏覽器當成該組的標題：

```html
<select name="fashion">
  <optgroup label="Clothing">
    <option value="t_shirt">T-Shirts</option>
    <option value="sweater">Sweaters</option>
  </optgroup>
  <optgroup label="Foot Wear">
    <option value="sneakers">Sneakers</option>
    <option value="boots">Boots</option>
  </optgroup>
</select>
```

#### radio button（單選鈕）

下拉選單在選項很多時能省版面；但當選項只有 5 個以內，直接把選項攤在頁面上、讓使用者一眼看完，體驗通常更好。這時就用 radio button。它讓使用者從多個選項中「只能選一個」，用 `type="radio"` 的 input 建立：

```html
<div>
  <input type="radio" id="child" name="ticket_type" value="child">
  <label for="child">Child</label>
</div>
<div>
  <input type="radio" id="adult" name="ticket_type" value="adult" checked>
  <label for="adult">Adult</label>
</div>
<div>
  <input type="radio" id="senior" name="ticket_type" value="senior">
  <label for="senior">Senior</label>
</div>
```

選了其中一個再選另一個，第一個會自動取消——radio button 之所以知道要這樣互斥，是因為它們有**相同的 `name`**。相同 `name` 就是瀏覽器判斷「這幾個屬於同一組選項」的依據。要設定預設選取，給該項加 `checked` 屬性（上例的 Adult）。

#### checkbox（核取方塊）

checkbox 和 radio button 一樣讓使用者從預設選項中挑選，但差別是它**可以同時選多個**。用 `type="checkbox"` 建立：

```html
<div>
  <input type="checkbox" id="sausage" name="topping" value="sausage">
  <label for="sausage">Sausage</label>
</div>
<div>
  <input type="checkbox" id="onions" name="topping" value="onions">
  <label for="onions">Onions</label>
</div>
```

也可以只放一個 checkbox，當作「開/關」的是非切換，例如註冊時勾選是否訂閱電子報。同樣用 `checked` 讓它預設被勾：

```html
<div>
  <input type="checkbox" id="newsletter" name="news_letter" checked>
  <label for="newsletter">Send me the news letter</label>
</div>
```

### button（按鈕）

`<button>` 建立可點擊的按鈕，讓使用者送出表單或觸發其他動作。要顯示的文字放在開合標籤之間：

```html
<button>Click Me</button>
```

button 接受一個 `type` 屬性，告訴瀏覽器這是哪一種按鈕。總共有三種：

- **submit（送出）**：使用者填完表單後，用它把所在的 form 送出。`type` 沒指定、或給了無效值時，預設就是 submit。
- **reset（重設）**：清空使用者在表單裡填的所有資料，把每個輸入還原成初始狀態。
- **button（一般按鈕）**：什麼預設行為都沒有，常搭配 JavaScript 做互動 UI。

```html
<button type="submit">Submit</button>
<button type="reset">Reset</button>
<button type="button">Click to Toggle</button>
```

### 組織表單元素

用對的輸入型別已經能讓表單好用很多；但表單一大、輸入框一多，使用者容易感到不知所措。HTML 提供兩個元素把表單切成視覺上分明、好消化的區塊。

- **`<fieldset>`**：容器元素，把相關的輸入框歸成一個邏輯單位。
- **`<legend>`**：給 fieldset 一個標題／說明，讓使用者看懂這組輸入是做什麼的。legend 應該緊接在 `<fieldset>` 開始標籤之後。

```html
<fieldset>
  <legend>Contact Details</legend>

  <label for="name">Name:</label>
  <input type="text" id="name" name="name">

  <label for="email">Email:</label>
  <input type="email" id="email" name="email">
</fieldset>
```

一個很常見的搭配是用 fieldset 包住一組 radio button，再用 legend 說明「這組選項到底是要問什麼」，這對無障礙也特別有幫助：

```html
<fieldset>
  <legend>What would you like to drink?</legend>
  <div>
    <input type="radio" name="drink" id="coffee" value="coffee">
    <label for="coffee">Coffee</label>
  </div>
  <div>
    <input type="radio" name="drink" id="tea" value="tea">
    <label for="tea">Tea</label>
  </div>
</fieldset>
```

### 樣式化表單的兩大難題

作業會給你深入的表單樣式教材，這裡先講清楚為什麼替 HTML 表單設樣式會這麼棘手，這也正是 knowledge check 會問的「兩個最具挑戰性的面向」：

1. **各瀏覽器有各自的預設樣式**：同一個表單在不同瀏覽器看起來會不一樣。想要一致的外觀，就得覆寫這些預設樣式、全部自己來。
2. **有些元件很難、甚至根本無法設樣式**：文字類元件（text、email、password、textarea）相對好處理，就像一般 HTML 元素，多數 CSS 屬性都能用。但 radio button 與 checkbox 就麻煩得多（有現成指南可參考，`accent-color` 這個較新的 CSS 屬性也讓它們變得比較好上色）。至於日曆／日期選擇器這類，某些部分是根本沒辦法用純 CSS 改的——真要客製，就得用 JavaScript 自己刻，或用現成的 JavaScript 函式庫。

## 程式碼範例

以下是一個把本課大部分元件組起來、可直接放進 HTML 檔開啟的完整表單。送出目標用 [httpbin](https://httpbin.org/)，送出後它會回傳一份 JSON，讓你看到自己送了哪些 name/value 資料：

```html
<!-- 一份整合了多種輸入型別的示範表單 -->
<form action="https://httpbin.org/post" method="post">
  <fieldset>
    <legend>基本資料</legend>

    <label for="first_name">名字：</label>
    <input type="text" id="first_name" name="first_name" placeholder="Bob...">

    <label for="user_email">電子郵件：</label>
    <input type="email" id="user_email" name="email" placeholder="you@example.com">

    <label for="user_password">密碼：</label>
    <input type="password" id="user_password" name="password">

    <label for="dob">生日：</label>
    <input type="date" id="dob" name="dob">
  </fieldset>

  <fieldset>
    <legend>票種（單選）</legend>
    <div>
      <input type="radio" id="adult" name="ticket_type" value="adult" checked>
      <label for="adult">成人</label>
    </div>
    <div>
      <input type="radio" id="child" name="ticket_type" value="child">
      <label for="child">兒童</label>
    </div>
  </fieldset>

  <fieldset>
    <legend>加點（可複選）</legend>
    <div>
      <input type="checkbox" id="onions" name="topping" value="onions">
      <label for="onions">洋蔥</label>
    </div>
    <div>
      <input type="checkbox" id="mushrooms" name="topping" value="mushrooms">
      <label for="mushrooms">蘑菇</label>
    </div>
  </fieldset>

  <label for="comment">留言：</label>
  <textarea id="comment" name="comment" rows="4" cols="40">預設內容</textarea>

  <!-- 送出與重設；type 一定要指定，避免非送出用途的按鈕誤觸送出 -->
  <button type="submit">送出</button>
  <button type="reset">重設</button>
</form>
```

## 常見陷阱

!!! warning "form 內的 button 若不指定 type，會意外送出表單"
    在 `<form>` 裡，`type` 為 submit 的 button（**這也是預設值**）一被點擊就會發出新請求、把資料送回伺服器。所以只要按鈕在表單裡、卻不是拿來送出資料（例如拿來做切換、加一列欄位、開關密碼顯示），就一定要明確寫上 `type="button"`，否則會觸發你不想要的送出行為。

!!! warning "input 沒有 name 就等於不存在"
    表單資料是靠 `name` 當鍵送出的。忘了給某個輸入元件 `name`，它填得再滿，送出時也會被完全忽略，後端根本收不到。每個要送出的輸入都務必有 `name`。

!!! warning "label 的 for 要對到 input 的 id，不是 name"
    label 靠 `for` 對應到 input 的 `id`（兩者值相同才綁得起來），這樣點 label 才會聚焦到 input。別把 `for` 寫成對 `name`。另外，同一頁裡 radio 群組共用同一個 `name` 才會互斥，但各自的 `id` 必須唯一。

!!! warning "placeholder 不能取代 label"
    placeholder 只是灰字提示，一開始打字就消失，且螢幕報讀軟體不一定會唸它。它無法替代 label 的無障礙作用，兩者要並存。

## 練習

先自己把上面的「程式碼範例」貼進一個 `.html` 檔、用瀏覽器打開，填一填按送出，觀察 httpbin 回傳 JSON 裡的 `form` 物件——試著改掉或拿掉某個 `name` 再送一次，看資料怎麼變。接著完成官方作業：

**表單基礎**

1. 閱讀並跟著做 MDN 的 [Forms 入門教學（Introductory Tutorials）](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms#introductory_tutorials)。
2. 閱讀並跟著做 MDN 的 [各種輸入元件（The Different Form Controls）](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms#the_different_form_controls)。

**樣式化表單**

1. 閱讀並跟著做 MDN 的 [表單樣式教學（Form Styling Tutorials）](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms#form_styling_tutorials)。可以略過「Customizable select elements」與「Customizable select listbox」兩篇，它們依賴的 CSS 新特性目前多數瀏覽器尚未支援。
2. 閱讀並跟著做 [internetingishard 的表單指南](https://internetingishard.netlify.app/html-and-css/forms/index.html)（原文 project 步驟，請直接參考該連結操作）。

**自我檢查（knowledge check）**

- form 元素是做什麼的？它應該一定要包含哪兩個屬性？
- 用一句話說明「輸入元件（form controls）」是什麼。
- `name` 屬性的用途是什麼？
- 讓使用者從預設選項中選擇，最常用的三種輸入元件是哪三種？
- HTML 裡的三種按鈕型別是什麼？
- 樣式化表單最具挑戰性的兩個面向是什麼？

## 原文與延伸資源

- 原文：[Form Basics](https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-form-basics)
- 本課引用：
    - [MDN：Your first form](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Your_first_form)
    - [MDN：Styling web forms](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Styling_web_forms)
    - [MDN：HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
    - [MDN：accent-color](https://developer.mozilla.org/en-US/docs/Web/CSS/accent-color)
    - [ModernCSS：Pure CSS Custom Checkbox Style](https://moderncss.dev/pure-css-custom-checkbox-style/)

---

> 本講義改寫自 The Odin Project《Form Basics》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
