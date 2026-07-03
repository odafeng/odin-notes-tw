---
name: odin-lecture
description: 把單一 The Odin Project lesson 消化改寫成繁體中文自足講義並更新網站導航與進度。只要使用者貼上 theodinproject.com 的 lesson URL、說「產講義」「這課做成講義」「下一課」「odin lecture」，或提到把某個 Odin 課程做成筆記/講義，一律使用此 skill，即使他沒有明講「講義」兩字。
---

# odin-lecture

把一課 TOP lesson（課文＋其指定閱讀）改寫成一份自足的繁體中文講義。
一次只處理一課。若使用者一次丟多課，逐課執行；超過一個 section 的量先確認。

## 流程

### 1. 定位原始教材

- 從 lesson URL 取出 slug（例：`.../lessons/foundations-variables-and-operators`
  → `variables-and-operators`）。
- 在 `vendor/curriculum/` 裡找對應檔案：先 `grep -ril "<slug 或課名>"`，
  markdown 檔名通常與 slug 相近。
- 找不到或 `vendor/curriculum/` 不存在時，直接 WebFetch lesson URL 用網頁內容。
- 「下一課」的定義：該 course `index.md` checklist 中第一個未勾的 lesson。

### 2. 蒐集指定閱讀

- 從課文的 Assignment / 課文內文抓外部資源連結。
- WebFetch 其中**最核心的 2–4 個**（優先序：MDN > javascript.info >
  CSS-Tricks > 其他）。影片抓不到內容就記在延伸資源，不硬塞。
- 不要全抓。講義的目標是消化，不是備份網路。

### 3. 寫講義

複製 `templates/lecture.md`，填好 frontmatter，依模板章節寫（本專案不寫「學習目標」段，
正文直接從「核心概念」開始）：

- **核心概念**：把課文＋指定閱讀融成連貫敘述，這是講義主體。自足為原則，
  正文 1500–3000 字為度（project 類的課可短）。
- **程式碼範例**：最小可執行範例，註解繁中。改寫、重組原文範例，不整段照抄。
- **常見陷阱**：從資源與經驗整理 3–5 個，用 `!!! warning` admonition。
- **練習**：TOP assignment 改寫成繁中步驟；project 課保留原文連結
  （project 說明更新頻繁，以原文為準）。
- **原文與延伸資源**：lesson 連結＋本課實際引用的資源清單。

寫作規則：

- 全文繁體中文，**絕對禁止簡體字**。技術名詞保留英文，首次出現附中文。
- 禁止逐句翻譯、禁止大段照抄原文（授權與品質雙重理由，見 CLAUDE.md 原則 5）。
- footer 固定一行：
  `> 本講義改寫自 The Odin Project《Lesson Title》，原文以 CC BY-NC-SA 4.0 授權，本文以相同授權釋出。`

### 4. 寫檔與收尾

1. 存到 `docs/<path>/<course>/NN-slug.md`，`NN` 依 course checklist 順序補零兩位。
2. `mkdocs.yml` 的 `nav:` 對應 course 底下加一行（用講義的繁中標題）。
3. 該 course `index.md` 的 checklist 把這課打勾，連結改指向講義檔。
4. `python scripts/build_index.py`
5. `mkdocs build --strict`，過了才 commit：`feat(<path>): 〈課名〉講義`。

## 品質底線

交出前自問：一個沒讀過原文的人，只看這份講義能不能完成該課的 knowledge check？
不能就回去補「核心概念」。
