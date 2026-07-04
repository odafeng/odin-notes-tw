---
title: HashMap 資料結構
source_url: https://www.theodinproject.com/lessons/javascript-hashmap-data-structure
source_file: vendor/curriculum/javascript/computer_science/hash_map_data_structure.md
path: full-stack-javascript
course: JavaScript
order: 33
generated: 2026-07-03
---

# HashMap 資料結構

> 改寫自 The Odin Project：[HashMap Data Structure](https://www.theodinproject.com/lessons/javascript-hashmap-data-structure)
> ｜Full Stack JavaScript › JavaScript › A Bit of Computer Science

## 核心概念

hash table（雜湊表，也叫 hash map / 雜湊映射）是各種程式語言裡最常用的資料結構之一。它跟一般的 array（陣列）很像，差別在於：array 用「連續且無意義的整數索引」來對應每個值，而 hash map 改用「key（鍵）」當索引。這樣組織資料後，我們就能用 key 非常快速地找到對應的值。

其實你很可能早就用過建立在 hash table 之上的結構了：JavaScript 的物件字面值（`{}`）、`Set`、`Map` 全都是。這一課要拆開它們的內部，弄清楚一件事：**我們到底怎麼把一組 key/value 存進去，之後又怎麼把它取回來？**

一句話先概括整個運作：hash map 接收一組 key/value，把 key 丟進 hash function（雜湊函式）算出一個 hash code（雜湊碼），再依這個碼把 key/value 放進某個 bucket（桶）。下面就逐一拆解「hash code」與「bucket」這兩個關鍵詞。

### 什麼是 hash code？

先理解「hash（雜湊）一個值」是什麼意思。hashing 就是**輸入一個值、產生一個對應的輸出**。而 hash function 必須是一個 pure function（純函式）：對同一個輸入，永遠回傳同一個 hash code，中間不能有任何隨機成分。

舉個最簡單的例子，一個把「名字」轉成「名字第一個字母」的 hash function：

```javascript
// 最基本的 hash function：取名字的第一個字母
function hash(name) {
  return name.charAt(0);
}
```

這裡有一個很重要的觀念，也是 hashing 跟 ciphering（加密）最根本的差別：**可逆性**。

Hashing 是**單向**的。用上面的例子，你可以從名字算出 hash code，但你**沒辦法**從 hash code 反推回名字。`"Carlos"` 可以雜湊成 `"C"`，可是拿到 `"C"` 你無從得知原本是什麼，也許是 `"Carla"`、也許是 `"Carrot"`。資訊在雜湊過程中被壓縮、丟失了，這正是它單向的原因。

> hashing 的單向性對資安很有用。系統儲存密碼時，通常不存明文，而是存密碼的 hash。就算資料庫被偷走，攻擊者拿到一堆 hash 也無法逆推回原始密碼。

### 一步步改良 hash function

想像一所學校，把學生檔案依「名字第一個字母」分資料夾存放：

```text
C:
  carlos.txt
  carla.txt
B:
  bryan.txt
  bob.txt
  beatrice.txt
```

新來一位 `"Carlos"`，跑一次 `hash("Carlos") -> "C"`，就知道要放進 `C` 資料夾。方便，但問題馬上浮現：如果很多人的名字都是 C 開頭，`C` 資料夾會爆滿，其他資料夾卻空空的。分佈不均，查找就不快了。

第一次改良：連姓氏的第一個字母一起取。

```javascript
// 改良一：名字首字母 + 姓氏首字母
function hash(name, surname) {
  return name.charAt(0) + surname.charAt(0);
}
```

`"Carlos Smith"` 的 hash code 變成 `"CS"`，把學生分散到更多資料夾。但只要出現常見的首字母組合，還是會不均。而且我們最終需要的是一個**數字**，而不是字母，因為這個數字要拿來當 array 的索引。

第二次改良：把整個名字的每個字元轉成數字再加總。`charCodeAt(i)` 會回傳字串第 `i` 個字元的 Unicode 編碼（例如 `"A"` 是 65）。

```javascript
// 改良二：把字串每個字元的編碼加總成一個數字
function stringToNumber(string) {
  let hashCode = 0;
  for (let i = 0; i < string.length; i++) {
    hashCode += string.charCodeAt(i);
  }
  return hashCode;
}

function hash(name, surname) {
  return stringToNumber(name) + stringToNumber(surname);
}
```

你可能會想：那乾脆把整個名字當 hash code 不是更獨一無二嗎？沒錯，但在 hash map 的脈絡裡，我們需要的是一個**數字**，因為它要當作 bucket 的索引。

### Bucket（桶）

bucket 就是實際存放元素的地方。我們可以把 array 的每一個索引位置想成一個 bucket。要把某個 key 放到哪個 bucket，由 hash function 決定：它回傳的數字就是 array 的索引。

假設要存 key 為 `"Fred"`、value 為 `"Smith"`：

1. 把 `"Fred"` 丟進 hash function，得到 hash code，例如 `385`。
2. 找到索引 `385` 的 bucket。
3. 把這組 key/value 存進那個 bucket。

如果索引 `385` 的 bucket 裡已經有一個 key 也是 `"Fred"` 的項目呢？我們就**比對 key**，確認是同一個 key 後，用新的 value 覆蓋舊的。（`Set` 之所以能保證元素不重複，就是這個道理；`Set` 跟 hash map 很像，差別在於 `Set` 的節點只有 key、沒有 value。）

反過來，用 key 取值的流程：

1. 把 key 雜湊，算出它 bucket 的索引。
2. 若那個 bucket 不是空的，就走進去。
3. 比對節點的 key 是不是我們要找的 key。
4. 是就回傳它的 value；不是就回傳 `null`。

你也許會問：既然已經找到索引了，為什麼還要比對 key？因為**hash code 只是「位置」，不同的 key 有可能算出相同的 hash code**。所以走進 bucket 後，一定要再比對 key 本身，確認拿到的是正確那一筆。做到這裡，一個具備 `has`、`set`、`get` 的 hash map 雛形就成形了。

### 插入順序不被保留

hash map **不保證**迭代時的順序等於插入順序。hash code 轉成索引的過程並非從第一格線性排到最後一格，而是相當跳躍、與插入先後無關。所以當你把所有 key 或 value 取出來迭代時，順序可能跟你當初放進去的完全不同。

例如依序插入 `Mao`、`Zach`、`Xari`，迭代時可能拿到 `["Zach", "Mao", "Xari"]`。

有些語言的實作會刻意維持插入順序，例如 JavaScript 內建的 `Map` 就會（後面會補充）。但接下來的專案，我們要實作的是**無序**的 hash map。如果你的主要需求是「頻繁地照順序迭代」，那 hash map 並不適合，單純用 array 反而更好。

### Collision（碰撞）

接著要面對一個必然的問題：collision。當**兩個不同的 key 算出完全相同的 hash code**，它們就會落進同一個 bucket，這就是碰撞。

例如用前面那個「字元加總」的做法，`"Sara"` 和 `"raSa"` 會算出相同的 hash code，因為字母完全一樣、只是排列不同。要讓「字母的位置」也影響結果，可以改良演算法：

```javascript
// 讓字元「位置」也影響結果，降低碰撞
function stringToNumber(string) {
  let hashCode = 0;

  const primeNumber = 31;
  for (let i = 0; i < string.length; i++) {
    hashCode = primeNumber * hashCode + string.charCodeAt(i);
  }

  return hashCode;
}
```

這樣 `"Sara"` 和 `"raSa"` 就會得到不同的 hash code：每一輪都先把舊的 `hashCode` 乘上一個倍數再加上新字元的編碼，位置不同、結果就不同。

> 注意這裡乘的是一個 prime number（質數）`31`。其實乘任何數都行，但質數更好：乘上質數能降低 hash code 剛好被 bucket 數量整除的機率，進而減少碰撞發生。

不過就算改良了，碰撞仍然**無法完全消除**。因為 bucket 數量是有限的，而可能的 key 是無限的，我們只能盡量減少碰撞、無法根絕它。（這其實有數學上的保證，見文末 pigeonhole principle。）

### 處理碰撞：用 Linked List

目前為止，每個 bucket 只能放一個值，是個一維結構。如果讓每個 bucket 能放**不只一個**值呢？做法是：**每個 bucket 改成一條 Linked List（鏈結串列）**。

插入時，若 bucket 是空的，就把新節點當成 Linked List 的頭（head）；若 bucket 已經有 head，就沿著這條 Linked List 走到尾端，把新節點接上去。這種處理碰撞的方式叫做 chaining（鏈結法）。到這裡你應該能體會：寫出一個「碰撞盡量少」的 hash function 有多重要。實務上你多半不會自己寫 hash function（語言通常內建），但理解它怎麼運作很關鍵。

### hash map 的成長

bucket 的數量該設多少？記憶體有限，不能無限多；但一開始就開很大，若最後只存一兩筆又太浪費。折衷做法是**先開一個小 array**，慣例用大小 `16`。

> 多數語言預設用 `16`，因為它是 2 的次方。這對某些需要位元運算（bit manipulation）來算索引的效能技巧很友善。

問題來了：hash function 可能算出像 `20353924` 這種大數字，遠超過 array 的長度，怎麼塞進只有 16 格的 array？答案是 **modulo（取餘數）運算 `%`**：任何數字對 `16` 取餘數，結果一定落在 `0` 到 `15` 之間，正好對應合法索引。例如 `20353924 % 16` 就會得到一個 0～15 的 bucket 索引。

隨著節點越加越多，碰撞會越來越頻繁。而一旦節點數超過 bucket 數，碰撞就**必然**發生（見文末 pigeonhole principle）。理想情況下，每個 bucket 只有 0 或 1 個節點，所以我們希望在 array 快滿時把它「長大」：**建立一個兩倍大的新 array，把所有既有節點重新雜湊（因為索引依 bucket 數量而定，數量變了就要重算）後搬過去。**

那什麼時候該長大？hash map 需要追蹤兩個欄位：

- **capacity（容量）**：目前 bucket 的總數。
- **load factor（負載因子）**：一開始就設定的門檻係數，用來判斷何時該擴充。各語言常用的 load factor 落在 `0.75` 到 `1` 之間。

`capacity * load factor` 得到一個門檻數字，**當 hash map 內的項目數超過這個數字，就該擴充**。例如 `16` 個 bucket、load factor 為 `0.8`，門檻是 `16 * 0.8 = 12.8`，也就是插入第 `13` 筆時就要長大。門檻設太低會有太多空 bucket、浪費記憶體；設太高則會讓 bucket 塞入太多節點、碰撞變嚴重才擴充。

### 計算複雜度

hash map 的插入、查找、刪除都非常有效率，因為這些操作本質上都是「用 array 索引直接存取」。在**平均情況**下，這三個操作的 complexity（複雜度）都是 `O(1)`：

- Insertion（插入）
- Retrieval（查找）
- Removal（刪除）

前提是 hash function 寫得夠好。**最壞情況**是 `O(n)`，發生在所有資料都雜湊到同一個 bucket 時——此時該 bucket 是一條長長的 Linked List，每次操作都得從頭走到尾，這個 `O(n)` 正是碰撞造成的。

至於 hash map 的擴充（成長），因為要把所有節點重新雜湊搬家，複雜度**恆為** `O(n)`。

### 補充：內建的 Map 與 Set

前面提過，JavaScript 內建的 `Map` 就是建立在 hash table 概念之上的現成結構，但它比一般物件（`{}`）更適合當「字典」用：

- **key 可以是任何型別**：物件、函式、`NaN` 都行；而一般物件的 key 只能是字串或 `Symbol`。
- **維持插入順序**：用 `for...of` 迭代 `Map`，順序等於插入順序（這點跟我們即將手刻的無序版不同）。
- **`size` 屬性**直接可取；一般物件得靠 `Object.keys(obj).length`。
- 常用方法：`set(key, value)`、`get(key)`、`has(key)`、`delete(key)`、`clear()`。

理解你手刻的 hash map 之後，再回頭看 `Map`，就會明白這些方法背後其實就是「雜湊 key、找 bucket、比對 key」這一整套機制。

## 程式碼範例

下面是一個可執行的迷你 hash map，示範 `hash`、`set`、`get`、`has` 的核心邏輯（用陣列當 bucket 處理碰撞，省略了自動擴充，聚焦觀念）：

```javascript
// 迷你 HashMap 示範：hash / set / get / has
class MiniHashMap {
  constructor() {
    this.capacity = 16;             // 初始 bucket 數量
    this.buckets = new Array(this.capacity);
  }

  // 用質數 31 累乘，讓字元位置也影響結果，降低碰撞
  hash(key) {
    let hashCode = 0;
    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = primeNumber * hashCode + key.charCodeAt(i);
    }
    // 取餘數，把大數字壓進 0 ~ capacity-1 的合法索引
    return hashCode % this.capacity;
  }

  set(key, value) {
    const index = this.hash(key);
    if (this.buckets[index] === undefined) {
      this.buckets[index] = []; // 這個 bucket 第一次被用到
    }
    const bucket = this.buckets[index];
    // key 已存在就覆蓋 value（碰撞時才需要逐一比對 key）
    for (const pair of bucket) {
      if (pair[0] === key) {
        pair[1] = value;
        return;
      }
    }
    bucket.push([key, value]); // 新的 key，接到 bucket 尾端
  }

  get(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    if (bucket === undefined) return null;
    for (const pair of bucket) {
      if (pair[0] === key) return pair[1]; // 比對 key 確認是正確那筆
    }
    return null; // bucket 存在但沒有這個 key
  }

  has(key) {
    return this.get(key) !== null;
  }
}

const map = new MiniHashMap();
map.set("Fred", "Smith");
map.set("Carlos", "Garcia");
console.log(map.get("Fred"));    // "Smith"
console.log(map.has("Carlos"));  // true
console.log(map.get("Nobody"));  // null

map.set("Fred", "Jones");        // 同一個 key，覆蓋 value
console.log(map.get("Fred"));    // "Jones"
```

重點：`get` 在找到索引後仍要逐一比對 key，因為不同 key 可能落在同一個 bucket（碰撞）。

## 常見陷阱

!!! warning "hash code 只是位置，不是身分證——一定要再比對 key"
    很多人以為「算出索引就等於找到資料」。錯。不同的 key 可能算出相同 hash code（碰撞），落進同一個 bucket。所以 `get` 走進 bucket 後，**必須逐一比對 key 本身**，才能確認拿到的是正確那一筆，否則會回傳到別人的值。

!!! warning "不要依賴 hash map 的迭代順序"
    自己實作的無序 hash map，迭代出來的順序跟插入順序無關（hash code 轉索引是跳躍的）。若你需要穩定順序，別用它，改用 array；或改用內建、會維持插入順序的 `Map`。

!!! warning "擴充後索引會變，必須重新雜湊"
    擴充時只把節點「原封不動搬到新 array 的相同索引」是錯的。因為索引是 `hashCode % capacity`，`capacity` 變成兩倍後，同一個 key 算出來的 bucket 索引也會變。所有節點都要**重新雜湊**再放進新 array，之後才找得到。

## 練習

1. 先在紙上或註解裡，用自己的話回答文末的 Knowledge check 四個問題，確認觀念都通了。
2. 觀看 CS50 這支影片，用「桶」的比喻再理解一次 hash map：[hash maps using buckets](https://www.youtube.com/watch?v=btT4bCOvqjs)。看的時候把影片內容跟本課的 bucket、collision、chaining 對照。
3. 接著進入 The Odin Project 的 HashMap 專案：實作一個具備 `hash`、`set`、`get`、`has`、`remove`、`length`、`clear`、`keys`、`values`、`entries` 的完整 hash map，並加入 load factor 與自動擴充。詳細步驟請依原文專案頁面進行：[HashMap Data Structure](https://www.theodinproject.com/lessons/javascript-hashmap-data-structure)。

## 原文與延伸資源

- 原文：[HashMap Data Structure](https://www.theodinproject.com/lessons/javascript-hashmap-data-structure)
- 本課引用：
  - [MDN：`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)（內建 Map 與物件的差異、key 型別、插入順序）
  - [MDN：`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
  - [Pigeonhole principle（鴿籠原理）](https://en.wikipedia.org/wiki/Pigeonhole_principle)：數學上保證「節點數超過 bucket 數時碰撞必然發生」
  - [為什麼 Java 的字串 hashCode 用 31 當倍數](https://stackoverflow.com/questions/299304/why-does-javas-hashcode-in-string-use-31-as-a-multiplier/299748)（質數與碰撞）
  - [Hashing 互動教學（samwho.dev）](https://samwho.dev/hashing/)：對 hash function 建立更直覺的理解

---

> 本講義改寫自 The Odin Project《HashMap Data Structure》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
