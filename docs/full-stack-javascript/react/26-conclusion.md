---
title: 結語
source_url: https://www.theodinproject.com/lessons/node-path-react-conclusion
source_file: vendor/curriculum/react/conclusion/conclusion_full_stack_javascript.md
path: full-stack-javascript
course: React
order: 26
status: draft
generated: 2026-07-03
---

# 結語

> 改寫自 The Odin Project：[Conclusion](https://www.theodinproject.com/lessons/node-path-react-conclusion)
> ｜Full Stack JavaScript › React › Conclusion

## 核心概念

恭喜你，React 這座山已經被你征服了。走到這一課，代表你已經完整走過了 component（元件）、JSX、props（屬性）、state（狀態）、hook、effect、context、router、狀態管理與測試等一整條學習路線。停下來給自己一點肯定：你現在具備了用 React 打造複雜互動介面的能力，而這在幾個月前對你來說可能還是天書。

不過，學習到這裡並不會停止。The Odin Project 的核心信念是「成長心態（growth mindset）」——技術世界永遠有更多值得探索的東西，而「完成 React 課程」只是你成為全端工程師路上的一個里程碑，不是終點。這一課不教新的 API，而是幫你把視野拉高，看清楚兩件事：**接下來該往哪裡走**，以及**為什麼你需要一個 backend（後端）**。

### 你接下來可以往哪裡走

當你對 React 本身夠熟悉之後，下一個自然的方向是 **React metaframework（元框架）**。所謂 metaframework，指的是建構在 React 之上、再補上一整套「開箱即用」能力的框架，最具代表性的例子是 Next.js 與 React Router（Remix）。它們讓你能真正用上 React 較新的特性，例如 **Server Component（伺服器元件）**——一種在伺服器端執行、不會把元件邏輯與相依套件送到瀏覽器的元件寫法；同時它們對 **routing（路由）** 與 **data fetching（資料取得）** 提供了一流（first-class）的支援，讓你不用再自己拼湊一堆套件。

不過要駕馭 metaframework，你需要先理解「伺服器端到底在做什麼」。這正是為什麼建議你先完成 [Databases 課程](https://www.theodinproject.com/paths/full-stack-javascript/courses/databases) 與 [Node.js 課程](https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs)——它們會替你打好資料庫與伺服器端 JavaScript 的地基，之後再回頭看 Server Component 這類概念就會順很多。

除了往框架走，你也可以開始關注 React 本身的演進：

- **[React RFC GitHub repository](https://github.com/reactjs/rfcs)**：RFC 是「Request for Comments（意見徵求）」的縮寫。React 團隊在正式落地任何新功能前，會先在這個 repository 提案、公開討論，最後決定接受或否決。想知道 React 的未來走向，看 RFC 是最一手的來源。
- **[官方 React 部落格](https://react.dev/blog)**：每當有新版本、新特性或重要觀念釐清，官方都會在這裡發文。訂閱它能讓你跟上最新變化，不會停留在舊寫法。
- **[patterns.dev](https://www.patterns.dev/)**：當你已經「會寫」React 之後，下一步是「寫得好」。這個網站整理了大量設計模式（design pattern）與前端架構觀念，教你怎麼組織元件、拆分責任、避免常見的結構性問題。非常值得加入書籤。

這幾個資源的共通點是：它們都不是要你「再多背一個 API」，而是幫你從「能做出功能」進化到「做出可維護、可擴充的系統」。這是資深工程師與初學者最大的差距之一。

### 為什麼你需要一個 backend

到目前為止，你其實光靠 **client-side JavaScript（用戶端 JavaScript）** 就能做出很多很酷的東西：互動表單、待辦清單、購物車、即時篩選……。但你可能早就注意到一個關鍵缺口——**只要使用者重新整理頁面，你的 app 就「忘光」了一切**。使用者剛剛輸入的偏好設定、剛剛新增的資料，全部歸零。

有一個部分解法叫 **Local Storage（本機儲存）**，它是瀏覽器提供的一個小型鍵值儲存空間，能讓資料在頁面重整後依然存在。Local Storage 很方便，但它有一個本質上的限制：**資料只存在使用者「當下這台裝置的這個瀏覽器」裡**。這代表：

- 同一個使用者換一台電腦、或改用手機來訪問，就完全讀不到之前的資料。
- 你無法做「跨裝置同步」，也無法讓多個使用者共享或協作同一份資料。
- 你更沒辦法做真正的 **user authentication（使用者驗證／登入）**，因為帳號密碼與權限這種東西，本來就不該、也不能只存在使用者的瀏覽器裡。

要突破這些限制，你需要一個**真正的 backend**——一台你自己掌控的伺服器，搭配一個資料庫。有了 backend，資料就集中儲存在伺服器端，任何裝置只要通過身分驗證，都能存取到同一份資料。這時候你才能替 app 加上這些「真正的產品才有」的功能：

- **user authentication**：註冊、登入、權限控管。
- **data persistence（資料持久化）**：資料長久保存在資料庫，不因裝置或瀏覽器而消失。
- 進而衍生出通知、金流、多人協作等更複雜的功能。

換句話說，React 讓你掌握了「使用者看得到、摸得到」的那一半（前端）；而 backend 是拼圖上另一半同樣重要的那塊。這也正是你在接下來的 [Databases 課程](https://www.theodinproject.com/paths/full-stack-javascript/courses/databases) 要學的東西。當前端與後端兩邊都打通，你才算是真正的「Full Stack（全端）」開發者。

你已經走得很遠了，值得為自己感到驕傲。深呼吸，享受這個里程碑，然後繼續往前。

### 別忘了回饋社群

最後一件小事：The Odin Project 之所以能存在、能免費且持續進步，完全仰賴貢獻者無償投入的時間與資源。如果你在 React 課程中發現了錯誤、有改進的點子，或只是想分享你的學習心得，都非常歡迎你回饋。你可以到官方 Discord 討論，或更進一步——直接到 [The Odin Project 的教材 repository](https://github.com/TheOdinProject/curriculum/issues) 開一個 issue。你走過這段路留下的意見，會讓後面的學習者受惠。

## 程式碼範例

下面用一個「主題偏好」的小例子，具體感受 Local Storage 的能力與極限，以及未來換成 backend 後寫法會怎麼變。

先看只靠 Local Storage 的版本——它能在重整後記住主題，但**只限於這台裝置這個瀏覽器**：

```jsx
import { useState, useEffect } from "react";

function ThemeToggle() {
  // 初始值嘗試從 Local Storage 讀取，讀不到就用預設 "light"
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  // 每當 theme 改變，就寫回 Local Storage
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      目前主題：{theme}
    </button>
  );
}

export default ThemeToggle;
```

這段程式碼在同一台裝置上重整頁面，主題會被記住。但換一台電腦或換手機登入，`localStorage.getItem("theme")` 會回傳 `null`，偏好就消失了。

若改成向 **backend** 讀寫，資料就存在伺服器端，任何裝置驗證身分後都拿得到同一份設定（概念示意，`fetch` 的網址代表你未來會建立的 API）：

```jsx
import { useState, useEffect } from "react";

function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  // 從後端 API 取得「這個使用者」的偏好，跨裝置都是同一份
  useEffect(() => {
    fetch("/api/preferences")
      .then((res) => res.json())
      .then((data) => setTheme(data.theme));
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    // 把新偏好存回後端資料庫，達成真正的 data persistence
    fetch("/api/preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: next }),
    });
  }

  return <button onClick={toggle}>目前主題：{theme}</button>;
}

export default ThemeToggle;
```

兩段程式碼的 React 部分幾乎一樣，差別只在「資料存在哪裡」。這正是你完成 React 之後，還需要學 backend 的直觀理由。

## 常見陷阱

!!! warning "把 Local Storage 當成資料庫用"
    Local Storage 只適合存放「這台裝置、非機密、可有可無」的小資料（例如 UI 偏好、暫存草稿）。它**不是資料庫**：不能跨裝置同步、沒有查詢能力、容量有限，而且瀏覽器可被使用者直接清除。絕對不要把帳號密碼、token 或任何敏感資訊放進 Local Storage——那需要真正的 backend 搭配安全機制來處理。

!!! warning "以為「學完 React」就等於「學完前端」"
    完成這門課代表你掌握了 React 的核心，但技術會持續演進：Server Component、metaframework、新的 hook 與模式都在不斷出現。保持成長心態，透過官方部落格與 RFC 追蹤變化，才不會停在某個舊版本的寫法裡。學習沒有真正的「完成」，只有「下一步」。

## 練習

1. 在進入下一個章節之前，先花幾分鐘填寫這份非常簡短的 [React 課程回饋問卷](https://docs.google.com/forms/d/e/1FAIpQLSdj_tNMp0LEz3ZLPqYcF67V11tX_CCJP3CTictPZzZ6XQm2Gw/viewform?usp=sf_link)，分享你對本章節的使用經驗與心得。你的回饋能幫助 The Odin Project 改進這個章節與整體課程，團隊會非常感謝。

2. 花點時間回顧下面兩個問題，檢查自己是否真的吸收了本課重點（若答不出來，回頭重讀對應段落即可，不需要死背）：
   - 完成 React 之後，你接下來可以探索哪些主題？
   - 如何避免你的 app 在頁面重整後「忘記」使用者做過的變更？

## 原文與延伸資源

- 原文：[Conclusion](https://www.theodinproject.com/lessons/node-path-react-conclusion)
- 本課引用：
  - [Databases 課程](https://www.theodinproject.com/paths/full-stack-javascript/courses/databases)
  - [Node.js 課程](https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs)
  - [React RFC GitHub repository](https://github.com/reactjs/rfcs)
  - [官方 React 部落格](https://react.dev/blog)
  - [patterns.dev](https://www.patterns.dev/)
  - [The Odin Project 教材 repository](https://github.com/TheOdinProject/curriculum/issues)

---

> 本講義改寫自 The Odin Project《Conclusion》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
