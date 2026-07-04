---
title: 使用 API
source_url: https://www.theodinproject.com/lessons/node-path-javascript-working-with-apis
source_file: vendor/curriculum/javascript/asynchronous_javascript_and_apis/working_with_apis.md
path: full-stack-javascript
course: JavaScript
order: 20
generated: 2026-07-03
---

# 使用 API

> 改寫自 The Odin Project：[Working with APIs](https://www.theodinproject.com/lessons/node-path-javascript-working-with-apis)
> ｜Full Stack JavaScript › JavaScript › Asynchronous JavaScript and APIs

## 核心概念

網頁開發最有威力的能力之一，就是從伺服器（server）抓資料下來，然後在自己的網站上創意地呈現它。這些資料可能是部落格文章、使用者資料、遊戲的排行榜，或任何其他東西。有時候伺服器只服務某個特定網站；有時候它是一個開放服務，把資料提供給任何想用的人（例如天氣資料或股價）。不論是哪一種，存取並使用這些資料的方法基本上都一樣。

### 什麼是 API

為外部使用（網站或 app）而建立、用來提供功能與資料的伺服器，通常透過 **API**（Application Programming Interface，應用程式介面）來做這件事。你可以把 API 想成兩個程式之間講好的一份「合約」：你按照對方規定的方式提出請求（request），對方就照規定回你資料（response）。你不需要知道對方伺服器內部怎麼運作，只要照著它的說明文件（documentation）操作即可。

向 API 請求資料有很多種方式，但它們本質上都在做同一件事。大多數情況下，API 是透過 **URL** 來存取的，而查詢這些 URL 的具體細節，會隨你使用的服務不同而改變。以一個天氣 API 為例，要取得某地目前的天氣，你可能會把城市名稱放進 URL 的路徑（path）裡：

```text
https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london
```

每個 API 該怎麼用，通常都記載在該服務的官方文件上。你會用到的那些特定 URL，用來存取 API 裡某個功能或某類資料，稱為 **endpoint**（端點）。學會讀 API 文件、找出正確的 endpoint 與參數，是使用任何 API 的第一步。

### 存取如何被限制：API key

如果你直接把上面那個 URL 貼進瀏覽器，多半會得到類似這樣的錯誤：

```text
No API key or session found. Please verify that your API key parameter is correct.
```

這帶出 API 的另一個重點。多數情況下，你必須先註冊帳號，向該服務申請一把 **API key**（API 金鑰），才能開始向它的 endpoint 抓資料。拿到之後，通常每一次請求都要附上這把 key。以上面的天氣服務為例，它是透過 **query string**（查詢字串，網址中 `?` 後面的 `key=value` 參數）帶入的：

```text
https://weather.visualcrossing.com/.../timeline/london?key=你的_API_KEY
```

API key 是隨機且專屬於你的。服務方因此能把某次請求對應到你身上，藉此追蹤你請求了多少資料、多頻繁。發放 API key 讓服務方能追蹤與防止系統被濫用，也是它們回收營運成本的方式之一。伺服器要花錢，API 也不例外：單一請求或許只值零點幾分錢，但想像你用這個 API 做出一個全世界都在用的 app，每分鐘可能有數千人在抓資料，流量成本會迅速膨脹。因此幾乎所有 API 服務都會提供「免費額度（free tier）＋付費方案」的分層設計。免費額度通常有 **rate limit**（速率限制，例如每天上限 1000 次請求）與功能限制；升級付費後才有更高頻率或更多資料。

### API key 要當作機密

因為 API key 是你存取這些服務與資料的鑰匙，妥善保護它是重要習慣，付費方案尤其如此。網路上有大量 bot 專門爬 GitHub 上被寫死（hardcode）在程式裡的 API key，一旦被撿走，壞人就能盜用你付費的服務與資料。眼尖的你可能已經注意到前面示範的問題：API key 就大剌剌寫在 URL 裡。任何攔截網路流量的人，甚至只是站在你背後看螢幕的人，都可能抄走它。

不過在目前這個學習階段，這個顧慮影響不大：我們用的是 API 的免費存取，做的 app 也多半只有你自己和看你作品集的人會用。你先記住「把 key 放前端有嚴重侷限」這件事即可。真正要保護 API key，必須在伺服器端（server-side）處理，而這裡我們只聚焦前端概念。如果你走的是 Full Stack JavaScript 路線，後端會在課程後段教到。

> 客戶端（client-side）用到的 key 一律要視為公開資訊。這就是為什麼「把 key 推到前端」這件事，只能對免費、不敏感的 key 這麼做。

### 從 API 抓資料：fetch

那麼，要怎麼把資料實際抓進程式碼裡？

幾年前，在程式中存取 API 資料的主要方式是 `XMLHttpRequest`（簡稱 XHR）。它至今在所有瀏覽器都還能用，但語法非常不好寫，光是建立物件、處理各家瀏覽器差異就一團亂。開發者受夠了這種痛苦，於是寫出 [axios](https://github.com/axios/axios)、superagent 等第三方函式庫來簡化它。

不過近年瀏覽器內建了一個發送 HTTP 請求的原生函式，也是我們現在要用的：**`fetch`**。

```javascript
// 第一個參數是 URL（必填），第二個是 options（選填）
fetch('https://url.com/some/url')
  .then(function (response) {
    // 請求成功，這裡拿到 Response 物件
  })
  .catch(function (err) {
    // 發生（網路層級的）錯誤
  });
```

注意到 `.then()` 和 `.catch()` 了嗎？沒錯，`fetch` 回傳的是一個 **promise**。`fetch` 一發出，就立刻回傳一個 promise；等伺服器回應後，這個 promise 就以一個 **`Response`** 物件 resolve（完成）。因為它是 promise，你可以用鏈式（chaining）的 `.then()` 一步步處理，也可以改用 `async`/`await` 寫成看起來像同步的樣子。

### 為什麼要兩層 `.then()`

抓 API 最容易卡住的地方，是「怎麼從伺服器回應裡拿到你真正要的資料」。關鍵在於：`fetch` 第一個 `.then()` 拿到的 `response` **並不是資料本身**，而是一個 `Response` 物件，代表整個 HTTP 回應（狀態碼、標頭、還沒解析的 body）。

要把 body 讀出來並解析成 JavaScript 物件，要呼叫 `response.json()`。但 `response.json()` **本身也回傳一個 promise**（因為讀取 body 是非同步的），所以你需要「第二層 `.then()`」來接它的結果：

```javascript
fetch(url)
  .then(function (response) {
    return response.json(); // 回傳一個 promise
  })
  .then(function (data) {
    console.log(data); // 這裡才是解析好的 JavaScript 物件
  });
```

`Response` 物件除了 `json()`，還提供 `text()`（純文字）、`blob()`（二進位，例如圖片）等方法，依你預期的資料型別選用。要注意 body 是一個「只能讀一次」的串流（stream），對同一個 `response` 呼叫兩次 `json()` 會失敗。

拿到解析好的物件後，通常你要的那筆資料（例如一個圖片 URL）會深藏在物件的好幾層裡。你得一層層往下鑽（drill down），例如 `data.data.images.original.url`，才能取到真正要用的值。看不出結構時，最實用的辦法就是先 `console.log` 出來，在瀏覽器 console 展開物件慢慢找。

### fetch 不會因為 404 而 reject（重要）

一個非常常見的誤解：只要伺服器有回應，即使回的是 `404 Not Found` 或其他非 2XX 狀態碼，對 `fetch` 來說**都算成功的回應**，promise 會正常 resolve，`.catch()` **不會**被觸發。`fetch` 只有在「網路層級」失敗時才 reject，例如網路斷線、DNS 解析失敗、URL 格式無效。

所以想要針對 HTTP 錯誤做處理，你必須自己在 `.then()` 裡檢查 `Response` 物件的屬性：

- `response.ok`：布林值，狀態碼落在 200–299 時為 `true`，否則為 `false`。
- `response.status`：數字狀態碼，例如 `200`、`404`、`500`。

典型做法是：`if (!response.ok) throw new Error(...)`，主動丟出錯誤，讓後面的 `.catch()` 能接到它。（另外，`.catch()` 也可能因為你後續 JavaScript 出錯而執行，例如去存取 `undefined` 的屬性。）

### 為什麼請求會被瀏覽器擋下：CORS

有時候你的 `fetch` 明明 URL 沒錯，卻在 console 看到被擋掉的錯誤，關鍵字是 **CORS**。這牽涉到瀏覽器的 **same-origin policy**（同源政策）這個安全機制。

**origin（來源）** 由三者組成：scheme（協定，如 `https`）、domain（網域）、port（連接埠）。三者完全相同才算同源。同源政策預設會限制你的網頁 JavaScript 去讀取「不同來源」的回應，以免惡意腳本任意竊取其他網站的資料。

**CORS**（Cross-Origin Resource Sharing，跨來源資源共享）是伺服器用來「明確放行」跨來源請求的一套 HTTP 標頭機制。當你的網頁（來源 A）向另一個來源 B 發 `fetch`，瀏覽器會在請求帶上 `Origin` 標頭；伺服器 B 若允許，就在回應加上：

```http
Access-Control-Allow-Origin: https://你的網站
```

或用萬用字元允許任何來源：`Access-Control-Allow-Origin: *`。瀏覽器看到這個標頭，才會把回應交給你的 JavaScript。反之，若對方伺服器沒設定允許你的來源，瀏覽器就會擋下回應，你便看到 CORS 錯誤。

要記住：CORS 是**伺服器端**決定的。如果被擋，通常不是你 `fetch` 寫錯，而是那個 API 沒有對你的來源開放。可行的作法包括：改用有提供 CORS 支援的 API、透過你自己的後端當中介（proxy）去代打這個請求，而不是硬在前端繞過它（同源政策是保護使用者的安全功能，不是 bug）。

## 程式碼範例

下面用 fetch 搭配一個「以搜尋詞回傳一張 GIF」的 API（Giphy 的 translate endpoint），把圖片顯示到網頁上。整份程式先放在單一 HTML 檔即可。把 `你的_API_KEY` 換成你自己申請到的 key。

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <title>Fetch GIF 範例</title>
</head>
<body>
  <img src="#" alt="隨機 GIF">
  <script>
    // 先選到頁面上的 <img>，稍後把它的 src 換成 API 回傳的圖片 URL
    const img = document.querySelector('img');

    fetch('https://api.giphy.com/v1/gifs/translate?api_key=你的_API_KEY&s=cats')
      .then(function (response) {
        // response 是 Response 物件，不是資料本身
        // 先檢查 HTTP 狀態：fetch 不會因為 404 而自動 reject
        if (!response.ok) {
          throw new Error(`HTTP 錯誤，狀態碼：${response.status}`);
        }
        return response.json(); // 解析 body，回傳一個 promise
      })
      .then(function (data) {
        // data 是解析好的 JavaScript 物件；要的圖片 URL 藏在很深的層裡
        img.src = data.data.images.original.url;
      })
      .catch(function (err) {
        // 網路錯誤，或上面我們主動丟出的錯誤，都會在這裡被接到
        console.error('抓取失敗：', err);
      });
  </script>
</body>
</html>
```

用瀏覽器打開這個 HTML 檔，每次重新整理應該就會換一張新圖。若還沒設定圖片 URL 前想確認結構，可以把 `img.src = ...` 那行暫時改成 `console.log(data)`，在 console 展開物件觀察巢狀（nested）層級，再決定怎麼一層層 `data.data.images.original.url` 鑽下去。

同一段邏輯改用 `async`/`await` 會更好讀：

```javascript
async function showRandomGif() {
  try {
    const response = await fetch(
      'https://api.giphy.com/v1/gifs/translate?api_key=你的_API_KEY&s=cats'
    );
    if (!response.ok) {
      throw new Error(`HTTP 錯誤，狀態碼：${response.status}`);
    }
    const data = await response.json();
    document.querySelector('img').src = data.data.images.original.url;
  } catch (err) {
    console.error('抓取失敗：', err);
  }
}

showRandomGif();
```

## 常見陷阱

!!! warning "以為 404 會進 .catch()"
    只要伺服器有回應，即使是 `404`、`500` 等非 2XX 狀態，`fetch` 的 promise 依然會 resolve，`.catch()` 不會被觸發。`fetch` 只在網路層級失敗（斷線、DNS 失敗、URL 無效）時才 reject。要處理 HTTP 錯誤，請自己檢查 `response.ok` 或 `response.status`，並在不 ok 時主動 `throw`。

!!! warning "忘了第二層 .then()，直接印出一堆看不懂的東西"
    第一層 `.then()` 拿到的 `response` 是 `Response` 物件，不是資料。要先 `return response.json()`（它回傳 promise），再用第二層 `.then()` 接解析後的資料。若對同一個 `response` 呼叫兩次 `.json()` 會失敗，因為 body 是「只能讀一次」的串流。

!!! warning "把 API key 寫死推到前端"
    前端程式碼與網址中的 API key 等於公開。免費、不敏感的 key 暫時如此無妨，但付費或敏感的 key 一旦外洩，可能被盜用你的額度與費用。真正的保護要放在伺服器端處理，本課只做前端概念。

!!! warning "遇到 CORS 錯誤以為是自己 fetch 寫錯"
    CORS 由伺服器端決定是否放行。若對方 API 沒對你的來源開放 `Access-Control-Allow-Origin`，瀏覽器會擋下回應，這不是你程式碼的 bug。改用支援 CORS 的 API，或透過自己的後端當 proxy 代打，而不是想辦法在前端繞過同源政策。

## 練習

1. 看看這份 [Public APIs 清單](https://github.com/public-apis/public-apis)，讓想像力奔馳，挑一個你感興趣的服務。
2. 擴充上面的 GIF 小專案：加一顆按鈕，點下去就抓一張新圖片，而**不必**重新整理頁面。（提示：把 `fetch` 邏輯包成一個函式，綁在按鈕的 `click` 事件上。）
3. 加一個搜尋框，讓使用者能搜尋特定的 gif（把輸入值放進 query string 的 `s=` 參數）。同時研究加上 `.catch()` 來處理一些錯誤（例如無效的 URL）。切記：即使 API 回的是 `404 Not Found` 之類的非 2XX 回應，那對 `fetch` 仍是有效回應、不會丟錯，`.catch()` 因此不會執行；但如果你後續的 JavaScript 出錯（例如存取 `undefined` 的屬性），或你自己 `throw`，`.catch()` 就會跑。若想在 API 沒回傳期望結果時做條件處理，需要在 `.then()` 裡自己判斷，可參考 MDN 的 [Response 物件文件](https://developer.mozilla.org/en-US/docs/Web/API/Response) 找有用的屬性（如 `ok`、`status`）。

> 若想比對可運作的成品，原文附有一個從 Giphy 抓圖的示範專案；本課的重點是理解「fetch → 檢查 response → `response.json()` → 鑽進巢狀物件取值」這條流程，成品長相不必一模一樣。

## 原文與延伸資源

- 原文：[Working with APIs](https://www.theodinproject.com/lessons/node-path-javascript-working-with-apis)
- 本課引用：
    - [MDN：Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
    - [MDN：Response 物件](https://developer.mozilla.org/en-US/docs/Web/API/Response)
    - [MDN：Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
    - [Public APIs 清單（GitHub）](https://github.com/public-apis/public-apis)

---

> 本講義改寫自 The Odin Project《Working with APIs》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
