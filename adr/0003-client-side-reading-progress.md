# 3. 閱讀進度用前端 localStorage（而非 frontmatter status）

日期：2026-07-04

## 狀態

已接受（取代原本的 frontmatter `status: draft|done` + `build_index` 做法）

## 背景

原設計用每課 frontmatter 的 `status` 欄位表示閱讀狀態，`build_index.py` 據此
在首頁畫 ✅/📖。但這代表**讀者要標記「已讀」得去改 Markdown 檔的 YAML、
再跑腳本**——對純讀者是不可行、也不合理的 UX（讀者根本不會、也不該碰原始碼）。

## 決策

閱讀進度改為**純前端、存在瀏覽器 localStorage**（`docs/assets/reading-progress.js`）：
- 每課頁面 H1 下方一顆「標記為已讀」按鈕。
- 課程清單的核取方塊可點、點了就記住。
- 首頁課程目錄即時顯示「你已讀 X／N 課」，已讀連結標示 ✓。
- 進度 key 為該課的絕對路徑，跨頁/跨清單同步。

`build_index.py` 不再依賴 `status`，課目改輸出純連結，狀態一律由前端渲染。

## 後果

- 好處：讀者點一下即記錄、免改任何檔、免登入；靜態站也能有個人化進度。
- 代價／取捨：
  - 進度只存單一瀏覽器，**換裝置/清快取會消失**、不跨裝置同步（可日後加匯出/匯入）。
  - 依賴 JavaScript；關閉 JS 則無進度功能（內容仍可讀）。
  - frontmatter 的 `status` 欄位變成無用殘留（暫保留，不影響建置）。
