# 1. 用 MkDocs Material 作為講義站平台

日期：2026-07-02

## 狀態

已接受

## 背景

需要把 The Odin Project 的繁中講義（純 Markdown）發佈成一個手機可讀、可搜尋、
好維護的網站。內容作者是單人（Fredric），偏好「Markdown in、網站 out」、
不想維護前端框架或資料庫。候選：MkDocs Material、Docusaurus、VitePress、Hugo。

## 決策

採用 **MkDocs Material**。內容為 `docs/` 下的 Markdown，`mkdocs.yml` 手動維護導覽。
中文搜尋用內建 search plugin + `jieba` 斷詞。視覺識別用一份 `extra.css`
（自訂 navy/amber 配色、系統 CJK 字族），互動用一份 `extra.js`。

## 後果

- 好處：純 Markdown、零前端建置鏈、內建搜尋/深色模式/導覽、繁中支援成熟、
  自訂成本低（一個 css + 一個 js 就能做出識別與功能）。
- 代價／取捨：
  - `nav:` 手動維護，課程一多會很長（198 課的導覽是手寫的）。
  - Python 生態，非 JS；要做互動只能靠原生 JS（無元件框架）。
  - Material 未來 2.0 會有破壞性變更（外掛/主題系統重寫），屆時可能要調整。
  - 站點是靜態的，任何「狀態」（如閱讀進度）只能放前端 localStorage。
