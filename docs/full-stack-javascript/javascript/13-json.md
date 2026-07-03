---
title: JSON
source_url: https://www.theodinproject.com/lessons/node-path-javascript-json
source_file: vendor/curriculum/javascript/organizing_your_javascript_code/json.md
path: full-stack-javascript
course: JavaScript
order: 13
status: draft
generated: 2026-07-03
---

# JSON

> 改寫自 The Odin Project：[JSON](https://www.theodinproject.com/lessons/node-path-javascript-json)
> ｜Full Stack JavaScript › JavaScript › Organizing Your JavaScript Code

## 核心概念

### JSON 是什麼

JSON 是 **JavaScript Object Notation** 的縮寫，是一種標準化的資料格式（data format），用來把結構化的資料表示成一段**純文字（plain text）**。它的語法大量借用 JavaScript 物件（object）的寫法，因此對已經學過物件的你來說幾乎沒有新東西要背。

為什麼要學它？因為當你的程式需要跟外部世界溝通時——呼叫外部 API、跟後端伺服器交換資料、把使用者設定存進瀏覽器——資料在「傳輸過程」中必須是一段可以在網路上傳送的文字，而不能是活在記憶體裡的 JavaScript 物件。JSON 就是這個場合的通用語言。它幾乎是網路上傳輸資料的**事實標準**，而且不限於 JavaScript：Python、Java、Go、Ruby 等幾乎所有語言都能讀寫 JSON，所以它是跨語言的資料交換格式。

這裡有兩個關鍵術語要分清楚：

- **serialization（序列化）**：把記憶體中的原生物件轉成一段字串，以便儲存或傳輸。
- **deserialization（反序列化）**：把一段字串轉回原生物件，以便程式操作。

一句話總結：**在網路上傳輸的是「字串」，在程式裡操作的是「物件」，JSON 就是連接這兩個世界的橋。**

### JSON 的語法規則

一段 JSON 看起來就像 JavaScript 物件字面值（object literal），但它的規則**更嚴格**。以下是一個典型範例：

```json
{
  "squadName": "Super hero squad",
  "homeTown": "Metro City",
  "formed": 2016,
  "active": true,
  "members": [
    {
      "name": "Molecule Man",
      "age": 29,
      "powers": ["Radiation resistance", "Turning tiny"]
    }
  ]
}
```

**JSON 允許的資料型別**只有六種：

- 字串（string）
- 數字（number）
- 布林值（boolean）：`true` / `false`
- `null`
- 物件（object）：一組 `"key": value`
- 陣列（array）：一串值

**注意這些型別「不被允許」**：`undefined`、`NaN`、`Infinity`、函式（function）、`Date`、`Set`、`Map`。JSON 只表達「純資料」，不表達「行為」，所以任何函式或方法都不能出現在 JSON 裡。

而 JSON 跟 JavaScript 物件最容易踩雷的差異，集中在下面這幾條**硬規則**：

1. **字串一律用雙引號 `"`**，單引號 `'` 不行。這一點連「key（鍵）」也適用——JSON 的每個 key 都必須用雙引號包起來，不能像 JS 物件那樣裸寫 `name:`。
2. **不能有結尾多餘的逗號（trailing comma）**。JS 裡 `{ a: 1, }` 合法，JSON 裡最後那個逗號會直接讓解析失敗。
3. **不能寫註解**。JSON 沒有 `//` 或 `/* */`。
4. **不能有函式或方法**。
5. 數字要用十進位寫法，不能有多餘的引號（`2016` 是數字，`"2016"` 是字串，兩者不同）。

一個放錯的逗號或冒號，就足以讓整段 JSON 失效。這也是為什麼「格式錯誤的 JSON」是實務上非常常見的錯誤來源。

### 兩個你最常用的方法

JavaScript 內建了一個全域的 `JSON` 物件，上面掛著兩個方法，讓你在「字串」與「物件」之間來回轉換：

**`JSON.parse(text)`——反序列化**：吃進一段 JSON 字串，回傳對應的 JavaScript 值（通常是物件或陣列）。拿到後就能用平常的 dot notation（點記法）或 bracket notation（中括號記法）存取。

```javascript
const text = '{"name":"Chris","age":38}';
const obj = JSON.parse(text);
console.log(obj.name); // "Chris"，回來就是一般物件了
```

**`JSON.stringify(value)`——序列化**：吃進一個 JavaScript 值，回傳一段 JSON 字串。

```javascript
const myObj = { name: "Chris", age: 38 };
const str = JSON.stringify(myObj);
console.log(str); // '{"name":"Chris","age":38}'
```

這兩個方法是完美的一對逆操作：`parse` 把文字變資料，`stringify` 把資料變文字。

### stringify 的進階細節

`JSON.stringify` 其實有三個參數：`JSON.stringify(value, replacer, space)`。

- **第二個參數 `replacer`**：可以是一個函式或一個陣列，用來篩選要輸出哪些屬性。傳一個 key 名稱的陣列，就只會保留那些 key。用不到時傳 `null`。
- **第三個參數 `space`**：控制縮排，讓輸出變得好讀（pretty print）。傳數字代表縮排幾個空格，傳字串（例如 `"\t"`）則用該字串當縮排。

```javascript
const data = { a: 1, b: 2 };
console.log(JSON.stringify(data, null, 2));
// {
//   "a": 1,
//   "b": 2
// }
```

序列化時對「非法值」的處理要特別留意：

- `undefined`、函式、`Symbol` 出現在**物件屬性**時，該屬性會被**直接省略**。
- 同樣的值出現在**陣列元素**時，會被轉成 `null`（以保持陣列長度與索引不變）。
- `NaN` 和 `Infinity` 會被轉成 `null`。
- `Date` 物件會被轉成 ISO 格式的字串（因為它有內建的 `toJSON` 方法），所以 `parse` 回來時是字串，不會自動變回 `Date`。

### 存取巢狀資料

實務上 JSON 常常是「物件裡有陣列，陣列裡又有物件」的巢狀結構。`parse` 之後，你就用一般的方式一層層鑽進去：先用 key 或索引拿到內層，再繼續存取。

```javascript
// 假設 superHeroes 是 parse 後的物件
superHeroes.homeTown;              // "Metro City"
superHeroes.members[0].name;       // 第一個成員的名字
superHeroes.members[0].powers[1];  // 第一個成員的第二項能力
```

JSON 的最外層不一定是物件，也可以直接是一個陣列，例如一個 `[ {...}, {...} ]` 的成員清單。這時就先用索引取出某個元素，再存取它的屬性。

### JSON 在真實流程裡長什麼樣

把上面的觀念放進實務，你會反覆遇到同一組流程。當你用 `fetch` 向一個 API 要資料時，伺服器回傳的其實是一段 JSON 文字（HTTP 回應的 body 只能是文字或二進位，不可能是 JavaScript 物件）。你的程式收到後，必須先把它 `parse` 成物件，才能存取欄位：

```javascript
const response = await fetch("https://api.example.com/heroes");
const text = await response.text(); // 拿到的是一段 JSON 字串
const heroes = JSON.parse(text);    // 反序列化成物件才好用
console.log(heroes.members[0].name);
```

因為這個「拿字串再 parse」的組合太常見，`fetch` 的回應物件直接內建了一個 `response.json()` 方法，一步就幫你把 body 讀成文字並 `parse` 好，等同於前兩行的合體：

```javascript
const response = await fetch("https://api.example.com/heroes");
const heroes = await response.json(); // 讀取 body 並自動 parse
```

反過來，當你要把資料**送出**（例如 POST 一筆新資料）或**存起來**（例如寫進瀏覽器的 `localStorage`）時，對方或儲存空間只收字串，你就得先用 `JSON.stringify` 把物件序列化成 JSON 文字再交出去。記住這條主線：**進來的先 `parse`，出去的先 `stringify`。**

### parse 失敗與例外處理

`JSON.parse` 對格式非常挑剔，只要字串不是合法 JSON（多一個逗號、少一個引號、根本是一段 HTML 錯誤頁），它不會回傳 `null`，而是直接**拋出 `SyntaxError`**。處理來自外部、你無法保證格式的資料時，務必用 `try...catch` 包起來，讓程式在解析失敗時能優雅地處理，而不是整個崩潰：

```javascript
function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("不是合法的 JSON：", error.message);
    return null; // 給一個安全的預設值
  }
}
```

`JSON.parse` 也接受第二個參數 `reviver`（一個 `(key, value)` 函式），可以在解析過程中攔截並改寫每個值，常見用途是把 ISO 日期字串轉回 `Date` 物件；初學階段知道有這個能力即可，多數情況用不到。

### 一個常見的小技巧：深拷貝

因為 `stringify` 會把物件攤平成一段獨立的文字，而 `parse` 又會用這段文字重新蓋出一個全新的物件，把兩者串起來就能做出一個和原本毫無關聯的**深拷貝（deep copy）**：

```javascript
const original = { info: { score: 90 } };
const copy = JSON.parse(JSON.stringify(original));
copy.info.score = 100;
console.log(original.info.score); // 仍是 90，兩者互不影響
```

這個寫法很方便，但別忘了前面提過的限制：物件裡如果含有函式、`undefined`、`Date` 或循環參照（circular reference），這招會遺失資料甚至直接拋錯，所以它只適用於「純資料」的物件。理解這一點，也等於複習了 JSON 只承載資料、不承載行為的本質。

## 程式碼範例

```javascript
// 1. 一個 JavaScript 物件（活在記憶體裡，可以直接操作）
const user = {
  name: "小美",
  age: 25,
  hobbies: ["閱讀", "爬山"],
  active: true,
};

// 2. 序列化：物件 -> JSON 字串（準備存檔或送出）
const jsonString = JSON.stringify(user);
console.log(jsonString);
// {"name":"小美","age":25,"hobbies":["閱讀","爬山"],"active":true}
console.log(typeof jsonString); // "string"

// 3. 帶縮排的序列化，方便人類閱讀
console.log(JSON.stringify(user, null, 2));
// {
//   "name": "小美",
//   ...
// }

// 4. 反序列化：JSON 字串 -> JavaScript 物件（拿回來操作）
const parsed = JSON.parse(jsonString);
console.log(parsed.hobbies[0]); // "閱讀"
console.log(typeof parsed);     // "object"

// 5. 實務常見場景：把物件存進瀏覽器 localStorage
//    localStorage 只能存字串，所以存前 stringify、取後 parse
localStorage.setItem("user", JSON.stringify(user));
const restored = JSON.parse(localStorage.getItem("user"));
console.log(restored.name); // "小美"
```

## 常見陷阱

!!! warning "key 與字串必須用雙引號"
    JSON 裡所有的 key 和字串值都**只能用雙引號 `"`**。`{ 'name': 'Chris' }` 或 `{ name: "Chris" }` 在 JavaScript 物件裡合法，但都不是合法的 JSON。手寫 JSON 或除錯時，這是最常見的錯誤。

!!! warning "不要留結尾逗號、不要寫註解"
    `{ "a": 1, }` 最後那個逗號，以及任何 `//` 註解，都會讓 `JSON.parse` 直接拋出 `SyntaxError`。JSON 是資料格式，不是程式碼，沒有註解語法。貼進 [JSON 格式檢查工具](https://jsonformatter.curiousconcept.com/) 可以快速定位這類錯誤。

!!! warning "parse 失敗會拋錯，記得處理"
    當傳給 `JSON.parse` 的字串格式不正確時，它會拋出 `SyntaxError` 而不是回傳 `null`。處理來自外部（例如 API 回應）而不確定是否合法的 JSON 時，應該用 `try...catch` 包起來，避免整個程式崩潰。

!!! warning "Date 不會自動變回來"
    `JSON.stringify(new Date())` 會把日期轉成 ISO 字串。`parse` 回來時它仍然是**字串**，不會自動變回 `Date` 物件。若需要日期物件，得自己再 `new Date(那個字串)`。同理，`undefined`、函式這類值在序列化時會被省略或變成 `null`，不要期待它們原封不動地來回。

## 練習

1. 打開 [MDN 的 JSON 教學](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON)，快速讀過一遍。重點放在 JSON 的語法規則，以及它跟 JavaScript 物件的差異（雙引號、無結尾逗號、無註解、允許的型別）。
2. 讀懂處理 JSON 時最常用的兩個方法：`JSON.parse()`（把 JSON 字串轉成 JavaScript 物件）與 `JSON.stringify()`（把 JavaScript 物件轉成 JSON 字串）。動手在瀏覽器 console 或 Node.js 裡各試幾次，觀察轉換前後的 `typeof`。
3. 造訪 [JSON 格式檢查工具](https://jsonformatter.curiousconcept.com/)，貼上一段 JSON，故意加一個結尾逗號或把雙引號改成單引號，看看它如何指出格式錯誤。這能幫你培養「一眼看出 JSON 哪裡壞掉」的直覺。

小測驗（knowledge check）——讀完應該能回答：

- JSON 是什麼？它的用途是什麼？
- 如何把一段 JSON 字串轉成 JavaScript 物件？（`JSON.parse()`）
- 如何把一個 JavaScript 物件轉成 JSON 字串？（`JSON.stringify()`）

## 原文與延伸資源

- 原文：[JSON](https://www.theodinproject.com/lessons/node-path-javascript-json)
- 本課引用：
  - [MDN：Working with JSON](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON)
  - [MDN：JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
  - [MDN：JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
  - [JSON 格式檢查工具](https://jsonformatter.curiousconcept.com/)

---

> 本講義改寫自 The Odin Project《JSON》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
