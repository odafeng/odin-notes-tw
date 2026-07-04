---
title: 深入 State
source_url: https://www.theodinproject.com/lessons/node-path-react-new-more-on-state
source_file: vendor/curriculum/react/states_and_effects/more_on_state.md
path: full-stack-javascript
course: React
order: 10
status: draft
generated: 2026-07-03
---

# 深入 State

> 改寫自 The Odin Project：[More On State](https://www.theodinproject.com/lessons/node-path-react-new-more-on-state)
> ｜Full Stack JavaScript › React › States And Effects

## 核心概念

前一課你已經知道怎麼用 `useState` 這個 hook 建立 state（狀態），並在事件裡呼叫 setter 觸發 render（渲染）。這一課要把 state 底層真正的行為講清楚，讓你能寫出可預測、不會製造 bug 的 component（元件）。這裡有三個關鍵主題：**如何組織 state**、**state 如何更新**，以及 **controlled component（受控元件）**。

### 一、如何組織 state：不要儲存能被算出來的值

管理與組織 state 是打造應用程式時最關鍵的環節之一。做錯了，它就會變成 bug 與頭痛的來源。一條最實用的通則是：

> 不要把「可以用現有的值、state 或 props（屬性）算出來」的資料放進 state。

舉例來說，若你已經有 `firstName` 和 `lastName` 兩個 state，就**不需要**再存一個 `fullName` 的 state。`fullName` 隨時可以用 `firstName + ' ' + lastName` 算出來。如果你把它也存成 state，就得在每次改名時記得同步更新它，一旦忘記，畫面上的三個值就會彼此矛盾——這就是所謂的「單一真相來源（single source of truth）」被破壞了。多餘的 state 是 bug 的溫床，能推導的就當場推導。

### 二、state 不可以被 mutate（直接修改）

在 React 裡，直接 mutate（變動、就地修改）state 是絕對禁區，因為它會導致無法預測的結果。primitive（原始型別，如 number、string、boolean）本來就是 immutable（不可變）的，你不必擔心；但當你使用 reference type（參考型別），也就是 array（陣列）與 object（物件）時，**永遠不要就地修改它們**。React 官方文件的建議是：把 state 當成 immutable（不可變）來對待。要改 state，一律透過 setter 函式（下面例子裡就是 `setPerson`）。

為什麼？因為 React 判斷「state 有沒有變」是用 [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 去比較「新舊值」。如果你就地改了原本那個 object 的屬性，再把**同一個 object** 傳回 setter，對 React 而言「參考位址沒變」，它會認為 state 根本沒動，於是**不保證會重新 render**。因此正確做法是：**建立一個新的 object**，把舊值複製進去、順便更新要改的欄位，再把這個新 object 交給 setter。這樣參考位址不同，React 才會偵測到變化並重新 render。

處理巢狀（nested）的 object 與 array 時要格外小心，因為你必須連內層一起複製一份新的，state 很快就會變得棘手。使用時務必謹慎。

### 三、state 如何更新：更新是非同步的，state 是一張快照

這是最容易讓初學者困惑、卻也最重要的觀念：**state 更新是非同步（asynchronous）的**。當你呼叫 setter，React 並不會當場改掉那個變數，而是把更新排進**下一次** render 才套用。

換句話說，要記住：**state 變數本身不是「反應式」的，會反應的是 component。** 呼叫 setter 的效果，是「重新 render 整個 component」，而不是「當場偷偷把那個變數的值換掉」。所以在**同一次** render 之中，state 變數的值從頭到尾都是固定的——它就像被拍下的一張**快照（snapshot）**。你在事件處理函式裡呼叫了 setter，緊接著在同一個函式裡 `console.log` 那個 state，印出來的**還是舊值**，因為新值要等到下一次 render 才存在。這就是官方文件所說的「state as a snapshot（state 如同快照）」。

理解這一點後，兩個常見陷阱就有了解釋：

**陷阱 A：連續兩次傳「值」給 setter，並不會累加兩次。** 如果你寫：

```jsx
setPerson({ ...person, age: person.age + 1 });
setPerson({ ...person, age: person.age + 1 });
```

你可能以為 age 會 +2，其實只會 +1。因為這兩行都是根據**這次 render 的快照** `person`（age 假設是 100）去計算，兩次算出來都是 101，第二次只是把第一次的結果「replace（取代）」掉。注意「取代」這個詞：當你傳一個**值**給 setter，React 就是拿這個值去取代目前的 state，而不是在前一次呼叫的基礎上疊加。

**解法：改傳「updater 函式（更新函式）」。** 若你想連續依據「最新的 state」更新多次，就把一個 callback 傳進 setter：

```jsx
setPerson((prevPerson) => ({ ...prevPerson, age: prevPerson.age + 1 }));
setPerson((prevPerson) => ({ ...prevPerson, age: prevPerson.age + 1 }));
```

當你傳的是 callback，React 會保證把「排隊到目前為止最新的 state」當成參數 `prevPerson` 傳進來。於是第一個 callback 收到 100 算出 101，第二個 callback 收到 101 算出 102，age 就真的 +2 了。什麼時候用 updater？當你要「根據前一個 state 推導新 state」，而且偏好一致性勝過簡潔時，就用 updater 函式。

**React 會 batch（批次）處理 state 更新。** 上面例子裡有兩次 setter 呼叫。既然每次 setter 都會觸發 render，那 component 應該 render 兩次吧？不會。React 很聰明，只要可能，它會把多個 state 更新**批次**在一起，這裡最後只 render **一次**。你可以自己塞幾個 `console.log` 到 render 過程中驗證看看。

### 四、controlled component（受控元件）

有些原生 HTML 元素會自己維護內部 state，`input` 就是最好的例子：你在 `input` 裡打字，它每敲一鍵就自己更新自己的 value。但在很多情境下，你會希望**由你來控制** `input` 的值，也就是自己決定它顯示什麼。這就是 controlled component（受控元件）登場的地方。

做法是：不讓 `input` 自己管 state，而是用 `useState` 建立我們自己的 state，把 `input` 的 `value` prop 綁到這個 state 變數上，並在每次 `onChange` 事件裡用使用者敲進來的值更新 state。這麼一來，state 就成了這個輸入框的「單一真相來源」，React 隨時都握有使用者輸入的最新內容。

這個模式在任何需要使用者輸入的地方都極其實用：文字框打字、勾選 checkbox、下拉選單等等。相對地，`input` 也可以「不受控（uncontrolled）」，用別的方法去讀它的值——但那個之後才會學到，現在先養成把 component 受控起來的習慣。

## 程式碼範例

```jsx
import { useState } from "react";

// 範例一：不要 mutate state，永遠建立新的 object
function Person() {
  const [person, setPerson] = useState({ name: "John", age: 100 });

  // 錯誤示範：就地修改原本的 object，React 不保證重新 render
  const handleIncreaseAgeBad = () => {
    person.age = person.age + 1; // mutate（就地修改）
    setPerson(person); // 傳回同一個參考，Object.is 判定沒變
  };

  // 正確示範：用展開運算子複製舊值到新 object，再更新 age
  const handleIncreaseAge = () => {
    const newPerson = { ...person, age: person.age + 1 };
    setPerson(newPerson); // 新參考，React 會重新 render
  };

  return (
    <>
      <h1>{person.name}</h1>
      <h2>{person.age}</h2>
      <button onClick={handleIncreaseAge}>增加年齡</button>
    </>
  );
}
```

```jsx
// 範例二：state 是快照，setter 之後同一次 render 讀到的還是舊值
function SnapshotDemo() {
  const [person, setPerson] = useState({ name: "John", age: 100 });

  const handleIncreaseAge = () => {
    console.log("呼叫 setPerson 之前：", person.age); // 100
    setPerson({ ...person, age: person.age + 1 });
    // 已經呼叫 setPerson，person 更新了嗎？
    console.log("呼叫 setPerson 之後：", person.age); // 仍然是 100
  };

  // 每次 render 都會執行；下一次 render 才會印出 101
  console.log("render 期間：", person.age);

  return (
    <>
      <h2>{person.age}</h2>
      <button onClick={handleIncreaseAge}>增加年齡</button>
    </>
  );
}
```

```jsx
// 範例三：updater 函式，讓連續更新讀到最新 state
function DoubleIncrease() {
  const [person, setPerson] = useState({ name: "John", age: 100 });

  const handleIncreaseTwice = () => {
    // 用 callback，prevPerson 一定是排隊到目前最新的值
    setPerson((prevPerson) => ({ ...prevPerson, age: prevPerson.age + 1 })); // 100 -> 101
    setPerson((prevPerson) => ({ ...prevPerson, age: prevPerson.age + 1 })); // 101 -> 102
  };

  return (
    <>
      <h2>{person.age}</h2>
      <button onClick={handleIncreaseTwice}>年齡 +2</button>
    </>
  );
}
```

```jsx
// 範例四：controlled component（受控元件）
function CustomInput() {
  const [value, setValue] = useState("");

  return (
    <input
      type="text"
      value={value} // value 綁到我們自己的 state
      onChange={(event) => setValue(event.target.value)} // 每次輸入都更新 state
    />
  );
}
```

## 常見陷阱

!!! warning "在 render 過程中直接呼叫 setter 會造成無限迴圈"
    下面這段程式碼會造成無限重新 render。因為 `setCount` 直接寫在 component 主體（render 過程）裡：component 一 render 就呼叫 `setCount`，`setCount` 觸發重新 render，重新 render 又呼叫 `setCount`⋯⋯如此重複不止。React 在某些情況下能偵測到過多的重新 render 並直接丟出錯誤（Too many re-renders）。setter 應該只在**事件處理函式**或 effect 裡呼叫，絕不要直接寫在 render 主體中。

    ```jsx
    function Component() {
      const [count, setCount] = useState(0);

      setCount(count + 1); // 每次 render 都呼叫 -> 無限迴圈

      return <h1>{count}</h1>;
    }
    ```

!!! warning "就地 mutate state 不會觸發 render"
    `person.age = person.age + 1; setPerson(person);` 看起來合理，但因為你傳回的是同一個 object 參考，`Object.is()` 判定新舊相同，React 認為 state 沒變，畫面就不會更新。永遠建立新的 object 或 array。

!!! warning "連續傳「值」更新，只會生效最後一次"
    連兩次 `setPerson({ ...person, age: person.age + 1 })` 只會 +1，不是 +2，因為兩次都根據同一張快照計算。要疊加就改用 updater 函式 `setPerson(prev => ...)`。

## 練習

1. 閱讀 React 官方文件的三篇文章，把本課觀念補齊：
   - [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)（state 如同快照）
   - [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)（如何選擇 state 結構）
   - [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)（在元件間共享 state）

2. 改寫前面用到的 `Person` component：
   - 加上兩個獨立的 input 欄位，分別輸入 first name（名）與 last name（姓）。
   - 讓其中任一個欄位每敲一鍵，都能即時更新 `h1` 裡顯示的全名。
   - 有很多種寫法。動手時請把本課學到的觀念放在心上——尤其是「不要儲存能被算出來的值」：全名應該由 first name 與 last name 推導出來，而不是再開一個獨立 state。並記得把兩個 input 都做成 controlled component。

## 原文與延伸資源

- 原文：[More On State](https://www.theodinproject.com/lessons/node-path-react-new-more-on-state)
- 本課引用：
  - [State as a Snapshot（React 官方文件）](https://react.dev/learn/state-as-a-snapshot)
  - [Choosing the State Structure（React 官方文件）](https://react.dev/learn/choosing-the-state-structure)
  - [Sharing State Between Components（React 官方文件）](https://react.dev/learn/sharing-state-between-components)
  - [Object.is()（MDN）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

---

> 本講義改寫自 The Odin Project《More On State》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
