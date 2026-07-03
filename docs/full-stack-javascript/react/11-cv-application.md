---
title: 專案：CV 履歷表
source_url: https://www.theodinproject.com/lessons/node-path-react-new-cv-application
source_file: vendor/curriculum/react/states_and_effects/project_cv_application.md
path: full-stack-javascript
course: React
order: 11
status: draft
generated: 2026-07-03
---

# 專案：CV 履歷表

> 改寫自 The Odin Project：[Project: CV Application](https://www.theodinproject.com/lessons/node-path-react-new-cv-application)
> ｜Full Stack JavaScript › React › States And Effects

## 核心概念

這是你的第一個 React 專案。目標是做一個「履歷產生器」：使用者在表單裡輸入自己的資料，按下送出後，畫面把這些輸入變成排版好的履歷（CV）呈現出來；按下編輯，又能回到可修改的表單重新調整。這個專案不需要複雜的架構，卻能把你到目前為止學到的 component（元件）、props（屬性）、state（狀態）全部串起來練一遍。

### 先把畫面拆成 component

React 的思考方式是「由上而下拆積木」。動手寫程式之前，先看著一張履歷的樣子，問自己「這張履歷由哪幾塊組成」。一個合理的拆法是：

- **一般資訊（General Information）**：姓名、Email、電話。
- **學歷（Educational Experience）**：學校名稱、就讀科系／學位、就讀日期。
- **工作經驗（Practical Experience）**：公司名稱、職稱、主要職責、任職起訖日期。

每一塊都是一個獨立的 component，各自管理自己的輸入與顯示。最外層再用一個 `App` 元件把它們組合起來。這種「一塊功能對應一個檔案」的切法，讓每個元件都小到你一眼能讀懂。

### 用 state 記住使用者輸入

在原生 HTML 裡，`<input>` 自己記住使用者打了什麼。但在 React，我們改用一種叫 **controlled component（受控元件）** 的做法：把輸入框目前的值放進 state，並用 `value` 把 state 綁回 input，再用 `onChange` 事件把使用者的每一次鍵入寫回 state。這樣一來，「畫面上顯示的值」永遠等於「state 裡的值」，資料只有一個來源（single source of truth），不會兩邊打架。

送出與編輯的切換，本質上也是一個 state。你可以用一個布林值（例如 `isEditing`）記住「現在該顯示表單，還是顯示排版好的履歷」。按送出把它設成 `false`，按編輯設成 `true`，React 會依這個 state 自動重新 render（渲染）對應的畫面。因為輸入的內容一直存在 state 裡，切回編輯模式時，之前打的字自然還在，`value` 直接帶回輸入框即可。

### props 讓資料往下流

當一塊資料需要被多個元件共用（例如 `App` 想在最後把三個區塊組成完整履歷），就把 state 提升到共同的父層（lifting state up），再透過 props 把資料和「修改資料的函式」往下傳給子元件。記住 props 是單向的、唯讀的：子元件不能直接改父層的 state，只能呼叫父層傳下來的函式去請父層改。這個「資料往下傳、事件往上報」的模式，是整個 React 應用的骨架。

### 收尾：整理專案結構並部署

課程要求你在 `src` 底下建立 `components` 目錄放元件、`styles` 目錄放 CSS 檔（在元件裡 `import` 進來使用）。完成後把成果 push 到 GitHub，並用一個 PaaS（Platform as a Service）平台部署上線。Netlify、Vercel、Cloudflare Pages 三者流程都差不多：把 GitHub repo 匯入，平台會自動偵測到你用的是 Vite，按下部署即可，之後每次 push 都會自動重新部署（deploy on push）。用哪個平台都行，重點是讓專案真的活在網路上。

## 程式碼範例

下面是一個「一般資訊」區塊的最小示範，把 controlled component 與編輯／送出切換兩個核心技巧放在一起。

```jsx
// src/components/GeneralInfo.jsx
import { useState } from "react";

function GeneralInfo() {
  // 三個欄位的值，各自存進 state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // 是否處於編輯模式：true 顯示表單，false 顯示排版結果
  const [isEditing, setIsEditing] = useState(true);

  function handleSubmit(e) {
    e.preventDefault();      // 阻止表單預設的整頁重新載入
    setIsEditing(false);     // 切換到顯示模式
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit}>
        <label>
          姓名：
          <input
            type="text"
            value={name}                              // state 綁回 input
            onChange={(e) => setName(e.target.value)} // 每次鍵入寫回 state
          />
        </label>
        <label>
          Email：
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button type="submit">送出</button>
      </form>
    );
  }

  // 顯示模式：把 state 裡的值排版出來，並提供編輯按鈕
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
      <button onClick={() => setIsEditing(true)}>編輯</button>
    </div>
  );
}

export default GeneralInfo;
```

重點在於：`value` 綁 state、`onChange` 更新 state，這對組合讓輸入框受控；`isEditing` 這個布林 state 決定畫面渲染哪一半。因為值一直存在 state 裡，按下編輯回到表單時，之前輸入的內容會自動出現在 `value`，你可以直接接著改再送出。學歷與工作經驗兩個區塊，用相同的模式再寫一次即可。

## 常見陷阱

!!! warning "忘記 e.preventDefault()，表單一送出整頁就重新載入"
    HTML 表單的 `<button type="submit">` 預設會觸發瀏覽器送出並重整頁面，React 的 state 會整個被清空。務必在 `onSubmit` 處理函式裡呼叫 `e.preventDefault()` 攔下這個預設行為。

!!! warning "input 只給 value 卻不給 onChange，變成唯讀"
    如果你把 `value={name}` 綁上 state 卻沒寫 `onChange`，這個輸入框會鎖死、打不了字，React 還會在 console 警告。受控元件必須 `value` 與 `onChange` 成對出現。

!!! warning "直接修改 state 而不是用 setter"
    像 `name = "新名字"` 或直接改陣列／物件內容都不會觸發重新 render。一定要透過 `useState` 給你的 setter（如 `setName(...)`）來更新，React 才知道畫面該重畫。

!!! warning "看到 console.log 印兩次不是 bug"
    開發模式下 React 的 `<StrictMode>` 會刻意把某些程式（如 render）執行兩次，幫你揪出副作用問題，所以你可能會看到 log 成雙出現。這是預期行為，正式 build 不會這樣，下一課會細談，現在不用理它。

## 練習

專案的完整需求與部署步驟以原文為準（專案說明更新較頻繁），這裡把主要步驟整理成繁中版：

1. 用 Vite 建立一個新的 React 專案。
2. 先在紙上或腦中規劃元件結構，至少切出三塊：一般資訊、學歷、工作經驗。
3. 為每個區塊（或整份 CV）加上「編輯」與「送出」按鈕。送出後把輸入值以 HTML 元素排版顯示；編輯後把輸入框帶著先前的值重新顯示，讓使用者可以修改並再次送出。這一段會大量用到 state 與 props。
4. 在 `src` 底下建立 `components` 目錄放元件、`styles` 目錄放 CSS 檔，並在元件中 `import` 對應樣式。
5. 把成果 push 到 GitHub，並用 Netlify、Vercel 或 Cloudflare Pages 其中一個平台部署上線。

完整的原始要求與各平台部署細節，請見下方原文連結。

## 原文與延伸資源

- 原文：[Project: CV Application](https://www.theodinproject.com/lessons/node-path-react-new-cv-application)
- 本課引用：[React 官方文件：`<StrictMode>`](https://react.dev/reference/react/StrictMode)、[Vite 靜態部署指南](https://vitejs.dev/guide/static-deploy.html)、部署平台 [Netlify](https://www.netlify.com/)／[Vercel](https://vercel.com/)／[Cloudflare Pages](https://pages.cloudflare.com/)

---

> 本講義改寫自 The Odin Project《Project: CV Application》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
