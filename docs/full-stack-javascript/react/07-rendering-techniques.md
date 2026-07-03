---
title: 渲染技巧
source_url: https://www.theodinproject.com/lessons/node-path-react-new-rendering-techniques
source_file: vendor/curriculum/react/getting_started_with_react/rendering_techniques.md
path: full-stack-javascript
course: React
order: 7
status: draft
generated: 2026-07-03
---

# 渲染技巧

> 改寫自 The Odin Project：[Rendering Techniques](https://www.theodinproject.com/lessons/node-path-react-new-rendering-techniques)
> ｜Full Stack JavaScript › React › Getting Started With React

## 核心概念

到目前為止，你已經認識了 component（元件）、props（屬性）與 JSX。這一課要補上兩個在真實應用裡幾乎天天都會用到的技巧：**如何一次渲染（render）多個元素**，以及 **如何根據條件決定要不要渲染某段畫面**。這兩件事看似瑣碎，卻是把「靜態的畫面」變成「會依資料變化的畫面」的關鍵。

### 為什麼不能把清單寫死

先想像一個情境：我們要做一個列出多種動物的 component。最直覺的寫法，就是把每個 `<li>` 一行一行手寫出來：

```jsx
function App() {
  return (
    <div>
      <h1>Animals: </h1>
      <ul>
        <li>Lion</li>
        <li>Cow</li>
        <li>Snake</li>
        <li>Lizard</li>
      </ul>
    </div>
  );
}
```

這樣寫沒有錯，但問題很明顯：如果不是四筆，而是四十筆、四百筆呢？而且在真實專案裡，資料通常不是寫死在畫面裡，而是來自一個 **陣列（array）**——可能是從後端 API 拿回來的、可能是使用者輸入的。我們不可能、也不應該為了每一筆資料手動增刪一行 JSX。我們需要的是：**給我一份資料，畫面自動長出對應數量的元素**。

### 用 map 把陣列變成元素清單

你在前面的課程已經學過，JSX 裡可以用大括號 `{}` 嵌入 JavaScript 運算式（expression）。既然如此，我們就把「把陣列轉成一堆 `<li>`」這件事直接寫進 JSX 裡。最常用的工具是陣列的 `map()` 方法——它會走過陣列的每一個元素，對每個元素套用你給的函式，然後回傳一個 **新的陣列**：

```jsx
function App() {
  const animals = ["Lion", "Cow", "Snake", "Lizard"];

  return (
    <div>
      <h1>Animals: </h1>
      <ul>
        {animals.map((animal) => {
          return <li key={animal}>{animal}</li>;
        })}
      </ul>
    </div>
  );
}
```

這裡發生的事情是：`animals.map(...)` 把 `["Lion", "Cow", "Snake", "Lizard"]` 這個字串陣列，轉換成一個「`<li>` 元素的陣列」——也就是 `[<li>Lion</li>, <li>Cow</li>, <li>Snake</li>, <li>Lizard</li>]`。而 **JSX 能自動渲染陣列**：當你在大括號裡放進一個元素陣列，React 會依序把裡面每個元素攤開來畫在畫面上。所以最後畫出來的結果，和上面手寫四個 `<li>` 一模一樣，但現在它是由資料驅動的。

因為 JSX 會自動渲染陣列，所以你其實可以先把轉換的結果存進一個變數，再把變數放進 JSX，效果完全相同：

```jsx
function App() {
  const animals = ["Lion", "Cow", "Snake", "Lizard"];
  const animalsList = animals.map((animal) => <li key={animal}>{animal}</li>);

  return (
    <div>
      <h1>Animals: </h1>
      <ul>
        {animalsList}
      </ul>
    </div>
  );
}
```

這兩種寫法沒有優劣之分，只是可讀性的取捨：當 `map` 內部的邏輯比較複雜時，先算好存進變數往往更清爽。

### 那個 key 是什麼

你可能已經注意到，上面每個 `<li>` 都多了一個 `key={animal}` 的屬性。當我們 **動態渲染一份清單** 時，React 要求你替清單裡「最外層」的元素加上一個 `key`。你現在可以先把 `key` 想成「這個元素的身分證 ID」——它讓 React 能分辨清單裡的每一項是誰，之後清單增刪或重新排序時才能正確、有效率地更新畫面。

至於 `key` 背後的原理、為什麼一定要它、以及該挑什麼值當 key，這些會在 **下一課** 專門討論。現在你只需要記得：**動態渲染清單時，記得給最外層元素一個 key。**

### 渲染的不是元素，而是 component 清單

`map` 裡回傳的東西不一定要是原生的 `<li>`，它同樣可以是你自己寫的 component。這在實務上非常常見——把「清單的每一項」抽成獨立 component，程式碼會更好維護：

```jsx
function ListItem(props) {
  return <li>{props.animal}</li>;
}

function List(props) {
  return (
    <ul>
      {props.animals.map((animal) => {
        return <ListItem key={animal} animal={animal} />;
      })}
    </ul>
  );
}

function App() {
  const animals = ["Lion", "Cow", "Snake", "Lizard"];

  return (
    <div>
      <h1>Animals: </h1>
      <List animals={animals} />
    </div>
  );
}
```

這裡我們把 `<ul>` 搬進了一個叫 `List` 的 component。它一樣回傳 `<ul>`，但現在它是獨立的 component，能承擔更多職責。`List` 透過 prop 收下整個 `animals` 陣列，再把每一筆動物名稱當成 prop 傳給 `ListItem`。

要特別強調的是：這裡說的「list（清單）」是很廣義的概念，**絕不限於 `<li>`**。你可以用同樣的手法，在 `<select>` 裡動態渲染多個 `<option>`，或是渲染一堆 `<div>` 來排出一個格狀版面。任何「同一種東西重複很多份」的畫面，都適用這個模式。

### 條件渲染：讓 component 自己做決定

清單能自動長出來之後，下一個需求自然浮現：**我不想全部都畫出來，我想根據條件挑著畫。** 例如「只顯示名稱以字母 L 開頭的動物」。要做這種判斷，就需要某種條件式（conditional expression）。React 沒有發明新的語法來做這件事——你用的還是原本就會的 JavaScript。以下介紹三種最常見的寫法。（為了聚焦，下面的例子把 `ListItem` 拿掉，直接回傳 `<li>`。）

#### 寫法一：三元運算子（ternary operator）

三元運算子 `條件 ? A : B` 依據一個布林值決定要回傳 A 還是 B，很適合用在「二選一」的渲染：

```jsx
function List(props) {
  return (
    <ul>
      {props.animals.map((animal) => {
        return animal.startsWith("L") ? <li key={animal}>{animal}</li> : null;
      })}
    </ul>
  );
}

function App() {
  const animals = ["Lion", "Cow", "Snake", "Lizard"];

  return (
    <div>
      <h1>Animals: </h1>
      <List animals={animals} />
    </div>
  );
}
```

我們用字串的 `startsWith("L")` 方法檢查名稱是否以 L 開頭，它只會回傳 `true` 或 `false`。若是 L 開頭就回傳 `<li>` 把該動物畫出來；否則回傳 `null`。在 React 裡，**回傳 `null` 代表「這裡什麼都不要畫」**，React 會安靜地略過它。所以這份清單最後只會出現 Lion 和 Lizard。

#### 寫法二：邏輯 AND（&&）運算子

如果你的情況是「條件成立就畫、不成立就什麼都不畫」（也就是三元裡的 B 反正是 `null`），那用 `&&` 會更精簡：

```jsx
function List(props) {
  return (
    <ul>
      {props.animals.map((animal) => {
        return animal.startsWith("L") && <li key={animal}>{animal}</li>;
      })}
    </ul>
  );
}

function App() {
  const animals = ["Lion", "Cow", "Snake", "Lizard"];

  return (
    <div>
      <h1>Animals: </h1>
      <List animals={animals} />
    </div>
  );
}
```

這裡利用了 JavaScript `&&` 的短路特性：`A && B` 若 A 為 `true`，整個運算式的值就是「第二個運算元」B（也就是 `<li>` 元素），於是被畫出來；若 A 為 `false`，整個運算式的值就是 `false`，而 **JSX 遇到 `false` 一樣什麼都不畫**。效果和三元寫法相同，但少寫了 `: null`。

#### 寫法三：if / if-else / switch

除了在 JSX 裡塞運算式，你也可以在 component 回傳 JSX **之前**，用一般的 `if`、`if/else`、`switch` 先做判斷再決定回傳什麼。這種寫法特別適合處理「資料還沒到位」的情況。在真實應用裡，清單常常是非同步取得的，我們必須考慮兩種邊界狀況：**資料還沒回來**、以及 **資料回來了但是空的**。你總不希望使用者看到一片空白吧？

```jsx
function List(props) {
  if (!props.animals) {
    return <div>Loading...</div>;
  }

  if (props.animals.length === 0) {
    return <div>There are no animals in the list!</div>;
  }

  return (
    <ul>
      {props.animals.map((animal) => {
        return <li key={animal}>{animal}</li>;
      })}
    </ul>
  );
}

function App() {
  const animals = [];

  return (
    <div>
      <h1>Animals: </h1>
      <List animals={animals} />
    </div>
  );
}
```

這裡的兩個 `if` 像是「守衛（guard）」，只要條件符合就 **立刻 return** 對應的畫面，後面的程式碼根本不會執行。第一個 `if` 檢查 `animals` 這個 prop 是否存在——如果連 prop 都沒傳（例如寫成 `<List />`），代表資料還在載入，就顯示「Loading...」，這正是等待 API 回應時常見的做法。第二個 `if` 檢查陣列長度是否為 0——上面的例子 `animals = []` 就會落在這裡，顯示「清單是空的」。只有兩道守衛都通過，才代表資料齊全，順利往下渲染真正的清單。

當然，同樣的邏輯也可以純靠三元和 `&&` 完成，只是層層巢狀後可讀性會下降：

```jsx
function List(props) {
  return (
    <>
      {!props.animals ? (
        <div>Loading...</div>
      ) : props.animals.length > 0 ? (
        <ul>
          {props.animals.map((animal) => {
            return <li key={animal}>{animal}</li>;
          })}
        </ul>
      ) : (
        <div>There are no animals in the list!</div>
      )}
    </>
  );
}
```

到底該用哪一種？沒有標準答案。單純的二選一用三元、只有一種可能的顯示用 `&&`、多重前置判斷用 `if` 守衛，通常最好讀。**巢狀三元和一串 `&&` 看久了很傷眼，寫的時候務必實際跑跑看，確認每種資料狀態都畫對了。**

## 程式碼範例

下面是一個可直接執行的完整範例，示範「清單渲染 + 條件渲染 + 空清單保護」三者合一。試著改動 `animals` 的內容（清空、增減、或把 prop 拿掉改成 `<List />`），觀察畫面如何隨資料狀態變化：

```jsx
// List 依資料的三種狀態決定要畫什麼
function List(props) {
  // 狀態一：連 animals 這個 prop 都沒有 → 視為載入中
  if (!props.animals) {
    return <div>Loading...</div>;
  }

  // 狀態二：有陣列但長度為 0 → 提示清單為空
  if (props.animals.length === 0) {
    return <div>目前清單裡沒有任何動物！</div>;
  }

  // 狀態三：資料齊全 → 用 map 動態渲染清單
  return (
    <ul>
      {props.animals.map((animal) => {
        // 只顯示以字母 L 開頭的動物；其餘回傳 null（不渲染）
        return animal.startsWith("L") ? <li key={animal}>{animal}</li> : null;
      })}
    </ul>
  );
}

export default function App() {
  const animals = ["Lion", "Cow", "Snake", "Lizard"];

  return (
    <div>
      <h1>Animals: </h1>
      <List animals={animals} />
    </div>
  );
}
```

執行後畫面只會列出 Lion 與 Lizard。把 `animals` 改成 `[]` 會看到「目前清單裡沒有任何動物！」；把 `<List animals={animals} />` 改成 `<List />` 則會看到「Loading...」。

## 常見陷阱

!!! warning "用 && 做條件渲染時，左邊千萬別放數字"

    `&&` 的短路是「回傳左邊運算元本身」，而不是「回傳 true/false」。當左邊是數字 `0` 時，`0 && <A />` 會得到 `0`——而 **JSX 對 `0` 的處理和 `false` 不同：`false`、`null`、`undefined` 都不會被畫出來，但 `0` 會被當成文字實實在在地印在畫面上**。

    最典型的地雷是這種寫法：

    ```jsx
    // 當 animals.length 為 0 時，畫面上會冒出一個「0」！
    {props.animals.length && <ul>...</ul>}
    ```

    解法是把左邊改成明確的布林條件，例如 `props.animals.length > 0 && <ul>...</ul>`，或改用三元運算子。更多說明可參考 React 官方文件 conditional rendering 章節中關於 `&&` 的 Pitfall 段落。

!!! warning "props validation 的黃色波浪底線可以先忽略"

    在 `<ListItem animal={animal} />` 這類自訂 component 的 prop 底下，你可能會看到編輯器畫出波浪底線，提示 `missing in props validation`。這只是預設 ESLint 規則在提醒你「沒有替 prop 宣告型別」，現階段 **完全可以無視**，之後課程會談到 prop 型別檢查。若覺得礙眼，可在 `eslint.config.js` 的 `rules` 裡加入 `"react/prop-types": "off"` 關掉它。

## 練習

1. React 官方文件有一篇很棒的 [Conditional Rendering](https://react.dev/learn/conditional-rendering) 指南。仔細讀過一遍，並把裡面所有的範例都動手做過，加深你對條件渲染的掌握。
2. 同一份文件裡的 [Rendering Lists](https://react.dev/learn/rendering-lists) 也一併讀完、實作一遍，看看清單渲染還能玩出哪些花樣。文章最後關於 keys 的部分可以先略過——下一課就會專門學它。

## 原文與延伸資源

- 原文：[Rendering Techniques](https://www.theodinproject.com/lessons/node-path-react-new-rendering-techniques)
- 本課引用：
  - React 官方文件 — [Conditional Rendering](https://react.dev/learn/conditional-rendering)
  - React 官方文件 — [Rendering Lists](https://react.dev/learn/rendering-lists)
  - MDN — [String.prototype.startsWith()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith)

---

> 本講義改寫自 The Odin Project《Rendering Techniques》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
