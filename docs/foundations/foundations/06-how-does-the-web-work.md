---
title: 網路如何運作
source_url: https://www.theodinproject.com/lessons/foundations-how-does-the-web-work
source_file: vendor/curriculum/foundations/installations/how_does_the_web_work.md
path: foundations
course: Foundations
order: 6
generated: 2026-07-03
---

# 網路如何運作

> 改寫自 The Odin Project：[How Does the Web Work?](https://www.theodinproject.com/lessons/foundations-how-does-the-web-work)
> ｜Foundations › Prerequisites

## 核心概念

在你開始為 web（網頁）寫程式之前，得先對「web 本身」有比日常使用者更嚴謹的理解。這些概念會幫你建立起整個生態系的全貌，讓你日後能和其他開發者用同樣的語彙討論你正在做的東西。這一課全是觀念，沒有要你安裝或執行任何東西，但它是後面所有課程的地基。

### internet 與 web 不是同一件事

日常口語裡我們常把「網際網路」和「網頁」混為一談，但兩者其實分屬不同層次：

- **internet（網際網路）** 是**底層的基礎建設**，是連接全球數十億台電腦的實體與邏輯網路——電纜、光纖、路由器、無線電波這些硬體與規則的總和。
- **web（全球資訊網）** 只是**跑在 internet 之上的一種服務**。你用瀏覽器開網頁，用的就是 web。

除了 web，還有很多服務同樣跑在 internet 這條「基礎建設」上，例如電子郵件（email）、線上遊戲、視訊通話等。所以正確的說法是：**web 是 internet 的其中一種用途，而不是 internet 的全部。**

### internet 是「網路組成的網路」

要理解 internet，最好從最小的單位開始，一層一層放大。

**兩台電腦相連。** 最單純的網路就是兩台電腦用一條實體線（Ethernet 網路線）或無線方式（Wi-Fi、Bluetooth）連起來，讓彼此可以直接通訊。

**很多台電腦相連。** 問題來了：如果要讓 10 台電腦兩兩互連，需要的線多到不切實際（10 台就要 45 條線）。解法是加入一個 **switch（交換器）**——一台專門負責「把訊息轉給正確對象」的小裝置。有了 switch，每台電腦只要接一條線到 switch 就好，10 台電腦只需要 10 條線。這樣一群互連的電腦就組成一個**區域網路（local network）**。

**很多個網路相連。** 現在你有很多個區域網路，要讓它們彼此溝通，就要靠 **router（路由器）**。router 是一台會「讀取收件位址、把訊息轉往正確網路」的電腦，作用就像郵局分信：看一眼地址，決定往哪個方向送。把一堆網路透過 router 串起來，就形成了「網路組成的網路」——這正是 internet 這個字（inter-network）的由來。

**連到全世界。** 你家的網路要連上這張全球大網，中間還有兩個角色：

- **modem（數據機）** 負責把你網路裡的數位訊號，轉換成能在電話線／光纖／纜線基礎建設上傳輸的訊號。
- **ISP（Internet Service Provider，網際網路服務供應商）** 是像中華電信這樣的公司，它管理著一組互相串連的特殊 router，把你家的區域網路接進全球基礎建設。

一路串上去，就構成了完整的 internet。

### IP 位址與 DNS：電腦怎麼找到彼此

**IP 位址（IP address）** 是每台連上網路的電腦的**唯一識別碼**，就像現實世界的門牌號碼。傳統的 IPv4 位址長得像 `192.0.2.172`——四組數字用點隔開。任何一台電腦要把資料送給另一台，靠的就是對方的 IP 位址。

但要人類去記一長串數字很不友善，於是有了 **domain name（網域名稱）**，也就是像 `google.com`、`theodinproject.com` 這種好記的名字，它其實只是某個 IP 位址的「別名」。

負責把 domain name 翻譯回 IP 位址的系統，叫做 **DNS（Domain Name System，網域名稱系統）**，你可以把它想成「網路世界的通訊錄」。當你在瀏覽器輸入 `mozilla.org`，背後發生的查詢流程大致是：

1. **瀏覽器快取**：瀏覽器先看自己的 DNS 快取（cache）裡有沒有這個網域對應的 IP，有的話直接用。
2. **作業系統快取**：沒有的話，問作業系統（OS）自己的 DNS 快取。
3. **詢問 DNS 伺服器**：還是沒有，就把查詢送到 DNS 伺服器（通常是你 ISP 提供的），它的任務就是把 domain name 對到 IP 位址。
4. **拿到 IP、建立連線**：DNS 伺服器回傳 IP 位址後，瀏覽器就能用這個 IP 去和目標 web server 溝通，把網頁載回來。

這種多層快取的設計是為了加速：常去的網站不必每次都重新查一遍。DNS 資料會在全球各地的伺服器上暫存，並定期自動失效、重新更新，所以你剛註冊或更改一個網域時，變更需要一段時間才會在全世界「生效」（propagate，傳播）。

**domain name 的結構**：網域名稱是**從右往左讀**的。以 `developer.mozilla.org` 為例：

- `.org` 是 **TLD（Top-Level Domain，頂層網域）**，例如 `.com`、`.org`、`.net`，或代表國家／地區的 `.tw`、`.us`、`.fr`。
- `mozilla` 是**次級網域（second-level domain）**，通常就是網站的名字。
- `developer` 是**子網域（subdomain）**，用來區分同一個網站底下的不同區塊。

### client 與 server：web 的一問一答

web 的運作建立在 **client（客戶端）** 與 **server（伺服器）** 這組關係上：

- **client（客戶端）** 是連上網、由使用者操作的裝置——你的筆電、手機——以及上面用來瀏覽網頁的瀏覽器。是它「發出請求」。
- **server（伺服器）** 是一台儲存網頁、網站與應用程式的電腦。是它「回應請求」，把檔案送回來。

當你要看一個網頁時，網頁的程式碼會從 server「複製一份」下載到你的 client，再由瀏覽器把它渲染（render）成你看到的畫面。原始檔案仍留在 server 上，你拿到的是副本。

### 一個網頁被打開時，到底發生了什麼

把上面的角色串起來，讓資料真正跑起來，還需要幾個關鍵零件：

- **網路連線（Internet connection）**：資料往返的「道路」。
- **TCP/IP（Transmission Control Protocol / Internet Protocol，傳輸控制協定／網際網路協定）**：定義資料如何在網路上移動的「交通規則」，就像決定你用汽車還是機車在道路上運送貨物的機制。
- **DNS**：前面說過的「通訊錄」，把網域名稱換成 IP。
- **HTTP（Hypertext Transfer Protocol，超文字傳輸協定）**：client 與 server 之間溝通用的「語言」。

當你在網址列輸入一個 URL 並按下 Enter，大致會經歷這幾步：

1. **DNS 查詢**：瀏覽器問 DNS 伺服器，找出這個網站 server 的真實 IP 位址。
2. **發出 HTTP 請求**：瀏覽器透過 TCP/IP，向該 server 送出一個 HTTP `GET` 請求，意思是「請給我這個網站的一份副本」。
3. **server 回應**：若請求被允許，server 回覆一個 `200 OK`，並開始傳送網站檔案。
4. **傳輸資料**：檔案被切成一小塊一小塊的 **packet（封包）**，沿著網路連線送回你的 client。
5. **組裝與顯示**：瀏覽器把這些封包重新組合成完整的網頁，並顯示給你看。

### packet：為什麼資料要切成小塊送

資料在網路上不是整包一次送，而是拆成許多小小的 **packet（封包）** 分別傳輸。這樣設計有幾個好處：

- **可靠**：若某個封包在途中遺失或損毀，只需重送「那一小塊」，不必整份檔案重來。
- **有效率**：不同封包可以走不同路徑，避免塞在同一條路上。
- **可重組**：封包可能不按順序抵達，但每個封包都帶有標頭資訊，接收端能依此正確重新排好。

每個封包通常包含兩部分：**header（標頭）**，記錄來源與目的地 IP、封包編號、協定資訊；以及 **payload（酬載）**，也就是真正要傳的那塊資料。

### 常見詞彙別搞混：網頁、網站、web server、搜尋引擎、瀏覽器

這幾個詞初學者最容易混用，釐清它們能讓你和其他開發者溝通更精準：

- **web page（網頁）**：一份可以被瀏覽器顯示的**單一文件**，用 HTML 寫成，可包含樣式、腳本、圖片、影音。有它自己唯一的網址（URL）。就像維基百科上的「一篇文章」。
- **website（網站）**：一群由連結串在一起、共用同一個網域名稱的**網頁集合**。就像維基百科整站。
- **web server（網頁伺服器）**：一台**存放並提供**網站檔案的電腦。一台 web server 可以同時代管很多個網站。
- **search engine（搜尋引擎）**：一種幫你**找到**網頁的服務，例如 Google、Bing、DuckDuckGo。它本身也有自己的網站可以造訪。
- **web browser（網頁瀏覽器）**：Chrome、Firefox 這類**軟體**，負責把網頁抓下來並顯示出來。

最常見的混淆是把**瀏覽器**和**搜尋引擎**畫上等號。正確的分工是：瀏覽器是「顯示網頁的工具」，搜尋引擎是「幫你找到網頁的服務」。你是用瀏覽器去造訪 Google 這個搜尋引擎，再用它找到你要的網站。

用圖書館來類比會更清楚：搜尋引擎像館藏索引，網站像各個分類區（科學區、數學區），網頁像區裡的一本本書，web server 像整棟圖書館的建築，URL 則像每本書的索書號。

## 程式碼範例

本課以觀念為主，沒有需要撰寫的程式碼。不過有一個小操作可以幫你把「domain name → IP 位址」這件事變得具體：在你的 command line（命令列）用 `ping` 指令去 ping 一個網域，系統會先做 DNS 查詢，把網域換成 IP 再顯示出來。

```bash
# 對 example.com 送出測試封包，觀察它被解析出的 IP 位址
ping example.com
```

執行後你會看到類似 `PING example.com (93.184.216.34): 56 data bytes` 的輸出，括號裡那組數字就是 DNS 幫你查到的 IP 位址。按 `Ctrl + C` 可以停止。

## 常見陷阱

!!! warning "把「網際網路（internet）」當成「全球資訊網（web）」"
    web 只是跑在 internet 之上的**其中一種服務**。email、線上遊戲、視訊通話同樣使用 internet，但它們不是 web。把兩者分清楚，你才有辦法理解「同一條網路基礎建設可以承載很多種服務」這件事。

!!! warning "把瀏覽器（browser）當成搜尋引擎（search engine）"
    在網址列打字時，很多人以為「Google 就是我上網的地方」。實際上瀏覽器（Chrome、Firefox）是**顯示網頁的軟體**，搜尋引擎（Google）是**幫你找網頁的服務**。你是用前者去造訪後者。

!!! warning "以為 DNS 更新會立刻全球生效"
    DNS 資料在世界各地被快取，並定期才失效更新。所以你剛改好一個網域的設定時，不同地區的使用者可能還會看到舊資料，要等變更**傳播（propagate）**開來，可能需要數分鐘到數十小時。

## 練習

以下把原課程的 Assignment 改寫成繁中步驟。影片類資源請自行到原文點連結觀看（本講義不轉錄 YouTube 影片內容）。

1. 觀看 BBC 的短片，建立「internet 如何運作」的整體印象（原文連結）。
2. 閱讀 Mozilla（MDN）的文章〈How does the Internet work?〉，對照本課「internet 是網路組成的網路」一節加深理解。
3. 觀看〈How the Internet Works in 5 Minutes〉這支五分鐘短片（原文連結）。
4. 閱讀 MDN 關於「網頁、web server、搜尋引擎之間差異」的文章，對照本課最後一節的詞彙釐清。
5. 觀看 Google 說明「什麼是 web browser」的短片，然後到 [whatsmybrowser.org](https://www.whatsmybrowser.org/) 查出你目前使用的瀏覽器與版本。
6. 閱讀 MDN〈How the Web works〉中「clients and servers（客戶端與伺服器）」一節，以及〈What is a domain name〉中「how does a DNS request work（DNS 請求如何運作）」一節；或改看關於 DNS 請求的影片版本（原文連結）。

完成後，試著用自己的話回答這些自我檢核問題，答不出來就回頭看對應段落（不需要背起來，理解即可）：

- 什麼是 web server？什麼是 network（網路）？什麼是 internet？
- 什麼是 IP 位址？什麼是 router？什麼是 ISP？
- 什麼是 packet（封包）？它如何被用來傳輸資料？
- 什麼是 client？什麼是 server？
- 什麼是網頁（web page）？什麼是瀏覽器（web browser）？什麼是搜尋引擎（search engine）？
- 什麼是 DNS 請求？你目前用的是哪個瀏覽器？
- 用你自己的話，描述「在 google.com 上發起一次搜尋」時，從輸入到看到結果之間發生了哪些事。

## 原文與延伸資源

- 原文：[How Does the Web Work?](https://www.theodinproject.com/lessons/foundations-how-does-the-web-work)
- 本課引用：
  - MDN：[How does the Internet work?](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work)
  - MDN：[How the Web works](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works)
  - MDN：[What is a domain name?（含 DNS 請求流程）](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_domain_name)
  - MDN：[What is the difference between webpage, website, web server, and search engine?](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/Pages_sites_servers_and_search_engines)
  - 工具：[whatsmybrowser.org](https://www.whatsmybrowser.org/)

---

> 本講義改寫自 The Odin Project《How Does the Web Work?》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
