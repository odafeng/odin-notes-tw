---
title: 專案：天氣 App
source_url: https://www.theodinproject.com/lessons/node-path-javascript-weather-app
source_file: vendor/curriculum/javascript/asynchronous_javascript_and_apis/project_weather_app.md
path: full-stack-javascript
course: JavaScript
order: 22
generated: 2026-07-03
---

# 專案：天氣 App

> 改寫自 The Odin Project：[Project: Weather App](https://www.theodinproject.com/lessons/node-path-javascript-weather-app)
> ｜Full Stack JavaScript › JavaScript › Asynchronous JavaScript and APIs

## 核心概念

這個專案把前面學到的 asynchronous（非同步）JavaScript、fetch、promise 與 DOM 操作整合成一個完整作品：一個可以搜尋地點、顯示天氣預報，並能在攝氏（Celsius）與華氏（Fahrenheit）之間切換的網頁。

### 專案目標

- 使用者能輸入一個地點（城市名稱或郵遞區號），送出後看到該地天氣。
- 提供攝氏 / 華氏切換按鈕。
- 依天氣資料改變頁面外觀，例如換背景顏色或顯示對應圖片；進階版可再接 Giphy API 找一張天氣相關的 gif。
- promise 與 async/await 兩種寫法都練習到，讓自己對兩者都熟悉。

### 資料來源：Visual Crossing API

本專案沿用前面課程用過的 Visual Crossing Timeline Weather API。它是一個 REST API：你組出一個 URL、對它發 GET 請求，伺服器回傳一包 JSON。典型的請求 URL 長這樣：

```text
https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{地點}?unitGroup=metric&key={你的APIKEY}&contentType=json
```

- `{地點}`：城市名稱、地址或郵遞區號，記得用 `encodeURIComponent()` 包起來，避免空白與特殊字元破壞 URL。
- `unitGroup=metric`：回傳公制（攝氏、公里）；改成 `us` 則是華氏。
- `key`：你的 API key，去 Visual Crossing 免費註冊即可拿到。
- `contentType=json`：指定回傳 JSON。

回傳的 JSON 很龐大，包含 `resolvedAddress`（實際解析到的地點）、`currentConditions`（目前天氣，內含 `temp`、`conditions`、`humidity` 等），以及 `days` 陣列（每日預報）。

### 三個關鍵技巧

1. **用 fetch + async/await 打 API。** `fetch()` 回傳一個 promise，resolve 成 `Response` 物件，再用 `await response.json()` 解析成 JavaScript 物件。
2. **「加工」原始資料。** API 回傳的欄位又多又雜。寫一個 process 函式，只挑出 App 真正要用的欄位，回傳一個乾淨的小物件。這樣後面顯示層只依賴你自訂的格式，跟 API 的結構解耦（decoupling）。
3. **分層思考。** 「抓資料」「加工資料」「畫到畫面上」是三件不同的事，分成三個函式，之後要換 API 或改版面都只動一處。

### 攝氏 / 華氏切換

不建議切換時再打一次 API。比較省事的做法是：一次拿到某個單位的溫度後，在前端自己換算並重畫。換算公式：

```text
華氏 = 攝氏 × 9 / 5 + 32
攝氏 =（華氏 − 32）× 5 / 9
```

把「原始溫度」與「目前單位」存成狀態，點按鈕時只改單位、重新 render 即可。

### API key 與安全性

有些 API 是要付費或有使用次數限制的，這讓 API key 成為被盜用的目標。別人拿到你的 key，就能用光你的額度，甚至讓你被收費。正規做法是把 key 放在**伺服器端**、用 environment variable（環境變數）保存，永遠不要送到前端。

這裡有一句業界常說的話：「Never trust the client（永遠不要信任前端）」。它一方面指不要相信前端送上來的資料是合法的，另一方面也指你送到前端的任何東西都藏不住秘密——只要進了瀏覽器，使用者就看得到。

因為這個專案是純前端練習，key 會直接寫在前端而被公開。把程式 push 到 GitHub 後，GitHub 很可能寄信警告你「公開提交了 API key」。**對這個練習來說完全沒關係**，因為這支 key 是公開可用、外洩也沒有實質後果的。但這不代表所有 key 都能這樣對待——之後的後端課程會教如何安全處理這類機密。

## 程式碼範例

以下是最小可執行的骨架，示範「抓資料 → 加工 → 顯示」與單位切換。把 `YOUR_API_KEY` 換成你自己的 key 即可跑。

```html
<!-- index.html -->
<form id="search">
  <input id="location" placeholder="輸入城市，例如 Taipei" required />
  <button type="submit">查詢</button>
</form>
<button id="toggle">切換 °C / °F</button>
<div id="result"></div>
<script type="module" src="weather.js"></script>
```

```javascript
// weather.js
const API_KEY = "YOUR_API_KEY";

// 1. 抓資料：組 URL、發 fetch、回傳解析後的 JSON
async function fetchWeather(location) {
  const base =
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";
  const url = `${base}/${encodeURIComponent(location)}?unitGroup=metric&key=${API_KEY}&contentType=json`;

  const response = await fetch(url);
  // fetch 遇到 404 / 500 不會 reject，必須自己檢查 response.ok
  if (!response.ok) {
    throw new Error(`API 回應錯誤：${response.status}`);
  }
  return response.json();
}

// 2. 加工：從龐大的 JSON 只挑出要用的欄位，攝氏一律存起來
function processWeather(data) {
  return {
    place: data.resolvedAddress,
    tempC: data.currentConditions.temp, // metric 拿到的就是攝氏
    conditions: data.currentConditions.conditions,
    humidity: data.currentConditions.humidity,
  };
}

// 前端狀態：目前的天氣資料與顯示單位
let current = null;
let unit = "C";

// 攝氏轉華氏
function toFahrenheit(c) {
  return c * 9 / 5 + 32;
}

// 3. 顯示：把加工後的物件畫到畫面上（依目前單位換算）
function render() {
  const box = document.querySelector("#result");
  if (!current) return;

  const temp =
    unit === "C" ? current.tempC : toFahrenheit(current.tempC);
  box.textContent = `${current.place}：${temp.toFixed(1)}°${unit}，${current.conditions}，濕度 ${current.humidity}%`;
}

// 綁定表單送出
document.querySelector("#search").addEventListener("submit", async (event) => {
  event.preventDefault(); // 阻止表單預設的重新整理
  const location = document.querySelector("#location").value;
  try {
    const raw = await fetchWeather(location);
    current = processWeather(raw);
    render();
  } catch (error) {
    document.querySelector("#result").textContent = `查詢失敗：${error.message}`;
  }
});

// 單位切換：只改狀態、重畫，不重新打 API
document.querySelector("#toggle").addEventListener("click", () => {
  unit = unit === "C" ? "F" : "C";
  render();
});
```

若要顯示天氣圖示，圖片檔可能非常多，逐一 `import` 會很囉嗦。可以改用 **dynamic import（動態匯入）** 依當下天氣「按需」載入對應圖檔：

```javascript
// 依天氣狀況動態載入圖示；import() 回傳 promise
async function loadIcon(conditions) {
  const name = conditions.toLowerCase().includes("rain") ? "rain" : "clear";
  const module = await import(`./icons/${name}.png`);
  return module.default; // 預設匯出即圖片路徑
}
```

`import()` 與靜態 `import` 不同：它是函式形式、回傳 promise、只在被呼叫時才載入模組，很適合這種「先看資料再決定要哪個檔」的情境。Webpack 也看得懂動態 import，能把相關素材一起打包。

## 常見陷阱

!!! warning "fetch 不會因 HTTP 錯誤而 reject"
    只有網路層失敗（斷線、URL 不合法）時 `fetch()` 才會 reject。伺服器回 404 或 500 時，promise 仍然 fulfilled。所以每次都要自己檢查 `if (!response.ok) throw new Error(...)`，否則你會拿著一包錯誤訊息當成正常資料去解析。

!!! warning "response body 只能讀一次"
    `Response` 的內容是串流（stream），`response.json()` 或 `response.text()` 只能讀一次；讀第二次會拿到空的或報錯。真的需要讀兩次就先 `response.clone()`。

!!! warning "切單位時不要重打 API"
    攝氏華氏只是換算問題，重新請求既慢又浪費額度。把原始溫度存成狀態，切換時純前端換算並 re-render 就好。

!!! warning "地點字串要編碼"
    使用者輸入可能含空白或 `#`、`&` 等字元，直接拼進 URL 會壞掉。永遠用 `encodeURIComponent()` 包住地點再組 URL。

## 練習

<div class="lesson-content__panel" markdown="1">

以下把原文 Assignment 改寫成中文步驟；完整需求以[原文專案說明](https://www.theodinproject.com/lessons/node-path-javascript-weather-app)為準。

1. 建一份空白 HTML，正確連結你的 JavaScript 與 CSS 檔。
2. 寫「打 API」的函式：接收一個地點、回傳該地天氣資料。這階段先只 `console.log()` 印出來看看。
3. 寫「加工 JSON」的函式：把 API 回傳的資料處理成一個只含你 App 需要欄位的物件。
4. 做一個表單讓使用者輸入地點、送出後去抓天氣（一樣先 `console.log()`）。
5. 把資訊顯示到網頁上。若想顯示天氣圖示，圖檔可能很多，可參考本課的 [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 做法，Webpack 能辨識動態 import 並打包相關素材。
6. 加上你喜歡的樣式。
7. 選做：加一個 loading（載入中）元件，從表單送出到 API 回傳這段期間顯示。可用 DevTools 模擬慢速網路來測試。
8. push 到 GitHub，分享你的成果。

別忘了核心目標：能搜尋地點、能切換攝氏 / 華氏，並依天氣改變頁面外觀。

</div>

## 原文與延伸資源

- 原文：[Project: Weather App](https://www.theodinproject.com/lessons/node-path-javascript-weather-app)
- 本課引用：
  - MDN：[Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)（fetch 的正確用法與 `response.ok` 陷阱）
  - MDN：[import()（dynamic import）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)（按需載入圖示素材）
  - [Visual Crossing Timeline Weather API](https://www.visualcrossing.com/resources/documentation/weather-api/timeline-weather-api/)（本專案資料來源）

---

> 本講義改寫自 The Odin Project《Project: Weather App》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
