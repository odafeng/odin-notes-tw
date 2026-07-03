---
title: 專案：HashMap
source_url: https://www.theodinproject.com/lessons/javascript-hashmap
source_file: vendor/curriculum/javascript/computer_science/project_hash_map.md
path: full-stack-javascript
course: JavaScript
order: 34
status: draft
generated: 2026-07-03
---

# 專案：HashMap

> 改寫自 The Odin Project：[Project: HashMap](https://www.theodinproject.com/lessons/javascript-hashmap)
> ｜Full Stack JavaScript › JavaScript › A Bit of Computer Science

## 核心概念

這個專案要你親手實作一個 hash map（雜湊表，也常譯作「哈希表」）。前一課你已經理解 hash map 背後的原理，現在把它寫出來。目標是做出一個 `HashMap` class（類別），對外提供 `set`、`get`、`has`、`remove`、`length`、`clear`、`keys`、`values`、`entries` 這些方法（method），內部則靠一組 bucket（桶）配上 hash function（雜湊函式）來達到接近 O(1) 的存取效率。

### hash map 的三個關鍵零件

一個 hash map 內部通常由三樣東西構成：

- **buckets（桶陣列）**：一個固定長度的陣列，每個位置（index）存放實際的 key-value pair（鍵值對）。這個專案初始長度（capacity，容量）設為 `16`。
- **hash function（雜湊函式）**：把一個 key（本課只處理 string 型別的 key）轉成一個整數 hash code（雜湊碼），再用這個數字決定它該放進哪個 bucket。
- **collision handling（碰撞處理）**：不同的 key 可能算出相同的 bucket 位置，必須有辦法讓它們共存。

### hash function 怎麼寫

前一課給過一個堪用的 hash function，用質數 `31` 逐字元累加：

```javascript
function hash(key) {
  let hashCode = 0;
  const primeNumber = 31;
  for (let i = 0; i < key.length; i++) {
    hashCode = primeNumber * hashCode + key.charCodeAt(i);
  }
  return hashCode;
}
```

這裡有兩個重點：

1. **`charCodeAt(i)`** 會回傳字串第 `i` 個字元的 UTF-16 code unit（碼元），是一個 0 到 65535 之間的整數。例如 `"A".charCodeAt(0)` 是 `65`。用它就能把「字元」變成可以做數學運算的「數字」。
2. **乘上質數再累加**，能讓相近的字串（例如 `"abc"` 與 `"acb"`）產生差異很大的 hash code，降低碰撞機率。

### 整數溢位（overflow）與 modulo 的位置

JavaScript 的數字精度有上限（`Number.MAX_SAFE_INTEGER`）。key 一長，`hashCode` 會愈乘愈大，超過安全整數範圍後計算就會失真，碰撞會暴增。

解法是把 modulo（餘數，`%`）運算搬進迴圈裡，**每一輪都取一次餘數**，讓數字始終被壓在 bucket 範圍內：

```javascript
hash(key) {
  let hashCode = 0;
  const primeNumber = 31;
  for (let i = 0; i < key.length; i++) {
    hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
  }
  return hashCode;
}
```

`%` 運算子回傳「相除後的餘數」，例如 `247 % 16` 是 `7`。無論 hash code 多大，`% capacity` 之後一定落在 `0` 到 `capacity - 1`，剛好是合法的 bucket index。前一課只在迴圈結束後取一次餘數（那樣也能對位），但放進迴圈能同時解決長 key 的溢位問題。

### 存取 bucket 一律用 hash code，不是用 key

新手最容易搞混 key 與 hash code。請記住：**key 只在 hash function 內部有意義**，它是輸入；真正拿去索引 bucket 陣列的，永遠是算出來的 hash code。

### 碰撞（collision）：同一個 bucket 放多個 pair

碰撞指的是**兩個不同的 key 算出同一個 bucket 位置**（例如 `Rama` 和 `Sita` 都被 hash 到 `3`）。注意這跟「更新」不一樣：更新是同一個 key 再被 `set` 一次；碰撞是不同 key 撞進同一格。

最常見的處理方式是 **separate chaining（分離鏈結）**：每個 bucket 不直接放單一 pair，而是放一個容器（一條 linked list，或簡單用一個陣列），把撞在一起的多個 pair 都串在裡面。查找時先用 hash code 找到 bucket，再在該 bucket 內逐一比對 key。

### load factor 與擴容（growth）

如果 pair 塞得愈來愈滿，每個 bucket 的鏈結愈來愈長，效率就會退化。因此要設一個 **load factor（負載因子）**，本專案用 `0.75`。

判斷時機：當 `已儲存的 key 數量 > capacity * loadFactor` 時，就要 **擴容**——把 capacity 加倍（16 → 32），建立新的 bucket 陣列，然後把舊資料**全部重新 hash（rehash）**放進新陣列。

為什麼要重新 hash？因為 hash function 裡有 `% capacity`，capacity 一改，同一個 key 算出來的 bucket 位置就變了，不能直接把舊 bucket 整格搬過去。擴容後 load 會掉回遠低於 load factor，資料也會重新平均分散。

### 不保證插入順序

hash map 取資料時**不保證跟你插入的順序一致**。`keys()`、`values()`、`entries()` 回傳的順序取決於 hash 結果，與插入先後無關，這是正常且預期的行為。

### 一個安全限制：index 越界要報錯

JavaScript 陣列很寬鬆，就算 bucket 長度只有 16，你照樣能寫進 index `500`，這會架空 hash map「限制儲存範圍」的意義。因此每次用 index 存取 bucket 時，都先做界線檢查：

```javascript
if (index < 0 || index >= buckets.length) {
  throw new Error("Trying to access index out of bounds");
}
```

## 程式碼範例

下面是一個最小可執行的 `HashMap` 骨架，用 separate chaining（每個 bucket 是一個陣列）處理碰撞，並包含擴容邏輯。可直接放進 `.js` 檔用 Node.js 執行：

```javascript
class HashMap {
  constructor(loadFactor = 0.75, capacity = 16) {
    this.loadFactor = loadFactor;
    this.capacity = capacity;
    this.size = 0; // 已儲存的 key 數量
    this.buckets = new Array(capacity).fill(null).map(() => []);
  }

  hash(key) {
    let hashCode = 0;
    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      // 每一輪都取餘數，避免長 key 造成整數溢位
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
    }
    return hashCode;
  }

  set(key, value) {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    // 若 key 已存在則更新（不算新增）
    for (const pair of bucket) {
      if (pair[0] === key) {
        pair[1] = value;
        return;
      }
    }

    // 新的 key：加入 bucket，size + 1
    bucket.push([key, value]);
    this.size++;

    // 超過 load factor 就擴容
    if (this.size > this.capacity * this.loadFactor) {
      this.resize();
    }
  }

  resize() {
    const oldBuckets = this.buckets;
    this.capacity *= 2;
    this.size = 0;
    this.buckets = new Array(this.capacity).fill(null).map(() => []);

    // 把舊資料全部重新 hash 放進新陣列
    for (const bucket of oldBuckets) {
      for (const [key, value] of bucket) {
        this.set(key, value);
      }
    }
  }

  get(key) {
    const bucket = this.buckets[this.hash(key)];
    for (const [k, v] of bucket) {
      if (k === key) return v;
    }
    return null;
  }

  has(key) {
    const bucket = this.buckets[this.hash(key)];
    return bucket.some(([k]) => k === key);
  }

  remove(key) {
    const bucket = this.buckets[this.hash(key)];
    const i = bucket.findIndex(([k]) => k === key);
    if (i === -1) return false;
    bucket.splice(i, 1);
    this.size--;
    return true;
  }

  length() {
    return this.size;
  }

  clear() {
    this.capacity = 16;
    this.size = 0;
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
  }

  keys() {
    return this.buckets.flat().map(([k]) => k);
  }

  values() {
    return this.buckets.flat().map(([, v]) => v);
  }

  entries() {
    return this.buckets.flat();
  }
}

// 簡單驗證
const test = new HashMap();
test.set("apple", "red");
test.set("banana", "yellow");
console.log(test.get("apple"));   // red
console.log(test.has("banana"));  // true
console.log(test.length());       // 2
console.log(test.entries());      // [["apple","red"], ["banana","yellow"]]（順序不保證）
```

## 常見陷阱

!!! warning "擴容後忘記 rehash，資料就找不到了"
    因為 hash function 內含 `% capacity`，capacity 一旦加倍，同一個 key 算出的 bucket index 也會改變。若你只是把 buckets 陣列拉長、不重新分配舊資料，之後 `get(key)` 會算到新位置卻撲空。正確做法是建立新陣列後，把每一筆舊 pair 重新 `set` 進去。

!!! warning "把「更新」誤當成「新增」，size 算錯導致提早或延後擴容"
    `set` 時要先在該 bucket 內比對 key：key 已存在只更新 value、`size` 不變；key 不存在才 push 並 `size++`。若每次 `set` 都無腦 `size++`，重複 key 會灌大 size，load factor 判斷就會失準。

!!! warning "用 key 直接索引 bucket"
    bucket 陣列要用 hash code（數字）來索引，不是用 key（字串）。key 只在 `hash()` 內部當輸入用；記混了會寫出 `buckets[key]` 這種錯的存取。

!!! warning "沒做 index 越界檢查"
    JavaScript 允許寫入超出長度的陣列 index，會悄悄架空容量限制。每次以 index 存取 bucket 前，先用 `index < 0 || index >= buckets.length` 檢查並在越界時 `throw`。

## 練習

以下把原文的 Assignment 整理成繁中步驟。**完整需求與細節請以原文為準**：[Project: HashMap](https://www.theodinproject.com/lessons/javascript-hashmap)。

1. 建立一個 `HashMap` class 或 factory function（工廠函式），至少要有 `loadFactor` 與 `capacity` 兩個變數。load factor 用 `0.75`，初始 capacity 用 `16`。
2. 依序實作這些方法：
   - `hash(key)`：把 key 轉成 hash code（記得把 modulo 放進迴圈避免溢位）。
   - `set(key, value)`：key 已存在則更新 value，不存在則新增；達到 load factor 時把 capacity 加倍並重新分配。
   - `get(key)`：回傳對應 value，找不到回傳 `null`。
   - `has(key)`：回傳 `true` / `false`。
   - `remove(key)`：存在則刪除並回傳 `true`，不存在回傳 `false`。
   - `length()`：回傳已儲存的 key 數量。
   - `clear()`：清空所有 entry。
   - `keys()` / `values()` / `entries()`：分別回傳所有 key、所有 value、以及 `[[key, value], ...]` 形式的陣列。
   - 本專案只需處理 string 型別的 key。
3. **測試你的 HashMap**：新建一個 JS 檔，建立實例後用原文提供的 12 筆水果資料（`apple`→`red` 一直到 `lion`→`golden`）灌入，此時 load 應剛好達到 `0.75`。接著：
   - 對幾個已存在的 key 重新 `set`，確認只更新 value，`length()` 與 `capacity` 不變。
   - 再 `set('moon', 'silver')`，讓 load 超過 load factor，觸發擴容、capacity 加倍，load 掉回較低值。
   - 擴容後再測 `get`、`has`、`remove`、`length`、`clear`、`keys`、`values`、`entries`，確認全部仍正常。
4. **Extra Credit（加分）**：再做一個 `HashSet`，行為跟 `HashMap` 相同，但只存 key、不存 value。

## 原文與延伸資源

- 原文：[Project: HashMap](https://www.theodinproject.com/lessons/javascript-hashmap)
- 本課引用：
  - MDN — [String.prototype.charCodeAt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt)
  - MDN — [Remainder (`%`) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder)

---

> 本講義改寫自 The Odin Project《Project: HashMap》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
