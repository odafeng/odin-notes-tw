---
title: 專案：測試練習
source_url: https://www.theodinproject.com/lessons/node-path-javascript-testing-practice
source_file: vendor/curriculum/javascript/testing_javascript/project_testing_practice.md
path: full-stack-javascript
course: JavaScript
order: 24
generated: 2026-07-03
---

# 專案：測試練習

> 改寫自 The Odin Project：[Project: Testing Practice](https://www.theodinproject.com/lessons/node-path-javascript-testing-practice)
> ｜Full Stack JavaScript › JavaScript › Testing JavaScript

## 核心概念

測試（testing）這件事本身不難，只是對多數人來說很新。要熟練它，唯一的辦法就是花時間實際動手做。這個 project（專案）的目標，就是替五個小函式**先寫測試，再讓測試通過**，藉此把 Jest 的用法練到手感自然。

### 這個專案在練什麼

你會用 Jest 完成五個獨立的小題目。每一題的邏輯都很單純（首字母大寫、字串反轉、四則運算、凱撒密碼、陣列統計），真正的重點不在演算法，而在於：

- 把「需求」翻譯成具體的 test case（測試案例），例如「首字母要大寫」就寫成 `expect(capitalize('hello')).toBe('Hello')`。
- 練習**邊界條件**（edge case）的思考：z 要繞回 a 嗎？大小寫要保留嗎？標點符號要跳過嗎？空陣列會怎樣？好的測試會把這些角落都涵蓋到。
- 體會「先寫測試」帶來的節奏——你會發現，寫測試的過程其實就是在把需求想清楚。

### 建議採用 TDD 節奏

雖然題目寫的是「先寫測試，再讓它通過」，這正是 TDD（Test-Driven Development，測試驅動開發）的精神。對每一題，重複這個紅綠循環（red-green cycle）：

1. **Red**：先寫一個會失敗的測試（因為函式還沒實作）。
2. **Green**：寫剛好足夠的程式碼，讓測試變綠。
3. **Refactor（重構）**：整理程式碼，並確認測試仍然通過。

### 環境設定：Jest 與 ESM

Jest 目前對 ESM（ECMAScript Modules，也就是 `import` / `export` 語法）沒有內建的穩定支援。如果你想在測試檔裡用 `import`，就得先設定 **Babel** 幫忙把 ESM 轉成 CommonJS，Jest 才吃得下去。基本步驟：

1. `npm install --save-dev jest` 安裝 Jest。
2. `npm install --save-dev @babel/core @babel/preset-env` 安裝 Babel。
3. 在專案根目錄新增 `babel.config.js`（見下方範例），讓 Babel 依當前 Node 版本轉譯語法。
4. 在 `package.json` 的 `scripts` 加入 `"test": "jest"`，之後用 `npm test` 執行全部測試。

如果你不想處理這些設定，也可以在 `.test.js` 檔案裡改用 CommonJS 的 `require` / `module.exports`，同樣能跑，只是與現代 `import` 寫法不同而已。需求細節以原文為準。

### 五個函式的重點提示

- **capitalize**：把首字母轉大寫。留意輸入字串本身就以大寫開頭、或是空字串的情況。
- **reverseString**：把字串反轉。常見寫法是 `split('') → reverse() → join('')`。
- **calculator**：一個物件，內含 `add`、`subtract`、`divide`、`multiply` 四個方法，各接受兩個數字並回傳結果。除法要不要處理除以 0，可自行決定並寫進測試。
- **caesarCipher**：凱撒密碼，是這五題裡最需要動腦的一題（見下節）。
- **analyzeArray**：接收一個數字陣列，回傳含 `average`（平均）、`min`（最小）、`max`（最大）、`length`（長度）四個屬性的物件。

### 凱撒密碼（Caesar cipher）的關鍵

凱撒密碼把每個字母往後位移固定的位數。以位移 3 為例，`A → D`、`B → E`……。實作時要處理三個容易漏掉的點：

- **z 繞回 a**：字母表只有 26 個，位移超出尾端要「繞回」開頭，也就是對 26 取 **modulo（模數）**。所以 `caesarCipher('xyz', 3)` 應得到 `'abc'`。
- **保留大小寫**：大寫字母位移後仍是大寫，小寫仍是小寫。`caesarCipher('HeLLo', 3)` 應得到 `'KhOOr'`。大寫的 ASCII 碼是 65–90（A–Z），小寫是 97–122（a–z），兩段要分開處理。
- **非字母原樣保留**：空白、標點、數字都不位移。`caesarCipher('Hello, World!', 3)` 應得到 `'Khoor, Zruog!'`。

實作上常用 `charCodeAt()` 取得字元的碼位，做位移與取模運算後，再用 `String.fromCharCode()` 轉回字元。這一題你可能會想拆成幾個小 helper（輔助函式），但**測試只需要針對公開的 `caesarCipher`**——只要它行為正確，就能反推裡面的 helper 也正確；不必為每個私有函式都寫測試。

## 程式碼範例

以下示範 `capitalize` 與 `caesarCipher` 的實作與對應測試，讓你抓到「函式 + 測試」成對出現的樣子。其餘題目照相同模式即可。

`babel.config.js`（讓 Jest 看得懂 `import`／`export`）：

```javascript
// babel.config.js：依當前 Node 版本轉譯 ESM 語法
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
};
```

`caesarCipher.js`（實作）：

```javascript
// 首字母大寫
export function capitalize(str) {
  if (str.length === 0) return str; // 空字串直接回傳
  return str[0].toUpperCase() + str.slice(1);
}

// 凱撒密碼：位移 shift 位，繞回、保留大小寫、非字母不動
export function caesarCipher(str, shift) {
  const normalized = ((shift % 26) + 26) % 26; // 把位移收斂到 0–25，也支援負數
  return str
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      // 大寫 A–Z：65–90
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + normalized) % 26) + 65);
      }
      // 小寫 a–z：97–122
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + normalized) % 26) + 97);
      }
      return char; // 非字母原樣保留
    })
    .join('');
}
```

`caesarCipher.test.js`（測試）：

```javascript
// 從實作檔匯入要測試的函式
import { capitalize, caesarCipher } from './caesarCipher';

describe('capitalize', () => {
  test('把首字母轉成大寫', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  test('空字串回傳空字串', () => {
    expect(capitalize('')).toBe('');
  });
});

describe('caesarCipher', () => {
  test('基本位移', () => {
    expect(caesarCipher('abc', 3)).toBe('def');
  });

  test('從 z 繞回 a', () => {
    expect(caesarCipher('xyz', 3)).toBe('abc');
  });

  test('保留大小寫', () => {
    expect(caesarCipher('HeLLo', 3)).toBe('KhOOr');
  });

  test('標點與空白原樣保留', () => {
    expect(caesarCipher('Hello, World!', 3)).toBe('Khoor, Zruog!');
  });
});
```

執行 `npm test`，你會看到每個 `test()` 逐一被檢查、全部變綠。

## 常見陷阱

!!! warning "用 import 卻沒設定 Babel，測試直接報錯"
    Jest 沒有內建穩定的 ESM 支援。如果測試檔用了 `import`／`export` 卻沒配置 `babel.config.js` 與 `@babel/preset-env`，執行時會出現類似 `Cannot use import statement outside a module` 的錯誤。先把 Babel 設定好，或改用 `require`／`module.exports`。

!!! warning "凱撒密碼直接對碼位加 shift，忘了取模"
    如果只寫 `String.fromCharCode(code + shift)`，位移超過 `z` 時會跑到非字母的碼位（例如 `{`、`|`），而不是繞回 `a`。務必用 `(index + shift) % 26` 讓它繞回，並且**大寫、小寫要各自以自己的基準（65 或 97）**計算，不能混用。

!!! warning "只測正常輸入，漏掉邊界條件"
    測試的價值在於涵蓋角落情況。凱撒密碼要測 z 繞回、大小寫、標點；`analyzeArray` 可以想想空陣列或含負數的情況；`capitalize` 要測空字串。只驗一個「開心路徑」（happy path）的測試，等於沒把需求想清楚。

!!! warning "為每個 helper 都寫測試"
    測試針對的是**公開介面**。凱撒密碼即使內部拆成好幾個小函式，也只需要測最終的 `caesarCipher`。只要它行為正確，就代表底下的 helper 正確；為每個私有函式都寫測試只是徒增維護負擔。

## 練習

依原文需求，替下列五個函式**先寫測試、再讓測試通過**（建議用上面的 TDD 紅綠循環）。若要用 `import`，記得先設定 Babel（見核心概念的環境設定）。

1. **capitalize**：接收一個字串，回傳首字母大寫的版本。
2. **reverseString**：接收一個字串，回傳反轉後的字串。
3. **calculator**：一個物件，包含 `add`、`subtract`、`divide`、`multiply` 四個基本運算方法，各接受兩個數字並回傳正確結果。
4. **caesarCipher**：接收一個字串與位移量，回傳每個字元「位移」後的結果。務必測試以下情況：
   - z 繞回 a，例如 `caesarCipher('xyz', 3)` 應為 `'abc'`。
   - 保留大小寫，例如 `caesarCipher('HeLLo', 3)` 應為 `'KhOOr'`。
   - 標點、空白等非字母原樣保留，例如 `caesarCipher('Hello, World!', 3)` 應為 `'Khoor, Zruog!'`。
   - 你可以把它拆成幾個小函式，但只需測試最終的 `caesarCipher`。
5. **analyzeArray**：接收一個數字陣列，回傳含 `average`、`min`、`max`、`length` 四個屬性的物件。例如 `analyzeArray([1,8,3,4,2,6])` 應回傳 `{ average: 4, min: 1, max: 8, length: 6 }`。

完整需求與提交方式，請以[原文專案說明](https://www.theodinproject.com/lessons/node-path-javascript-testing-practice)為準。

## 原文與延伸資源

- 原文：[Project: Testing Practice](https://www.theodinproject.com/lessons/node-path-javascript-testing-practice)
- 本課引用：
  - [Caesar Shift Cipher（凱撒密碼原理）](https://crypto.interactive-maths.com/caesar-shift-cipher.html)
  - [MDN：`String.prototype.charCodeAt()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt)
  - [MDN：`String.fromCharCode()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode)

---

> 本講義改寫自 The Odin Project《Project: Testing Practice》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
