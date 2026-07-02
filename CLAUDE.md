# Odin Notes TW — 專案憲法

把 The Odin Project（**Foundations + Full Stack JavaScript path**）逐課消化改寫成
繁體中文自足講義，以 MkDocs Material 發佈成手機可讀的網站。

擁有者：Fredric Huang（git name: `Fredric Huang`, email: `odafeng@hotmail.com`）

## 核心原則（不可違反）

1. **改寫，不翻譯。** TOP 課文大多是導讀＋外部資源連結（MDN、javascript.info、
   CSS-Tricks 等），真正的教材在連結裡。講義必須把「課文＋指定閱讀」消化成
   自足內容：讀者不點任何外部連結也能學會該課。逐句翻譯 = 失敗。
2. **一律繁體中文（zh-TW），禁止簡體字。** 技術名詞保留英文，首次出現時附中文，
   例：closure（閉包）、hoisting（提升）。程式碼註解用繁中。
3. **一次一課，邊讀邊產。** 禁止批量轉換整個 path。Fredric 讀到哪、產到哪。
   如果被要求批量生成超過一個 section，先確認一次。
4. **範圍鎖定 Foundations + Full Stack JavaScript。** 不做 Ruby on Rails path。
5. **授權：CC BY-NC-SA 4.0。** 本專案是 The Odin Project curriculum 的衍生著作。
   每份講義 footer 保留出處與授權標示；若公開發佈，須署名、非商業、
   以相同授權釋出。詳見 `LICENSE.md` 與 `docs/about/license.md`。

## 架構

- 內容：`docs/` 下的 Markdown，目錄鏡射 TOP 的 path → course 結構。
- 檔名：`NN-slug.md`。`NN` 是該 course 內的順序（01、02⋯），slug 沿用
  TOP lesson URL 的 slug。
- 每課 frontmatter 與章節結構依 `templates/lecture.md`，不要自創格式。
- 渲染：MkDocs Material。`mkdocs.yml` 的 `nav:` 手動維護，每產一課就加一行。
- 部署：push `main` → GitHub Actions → GitHub Pages
  （`.github/workflows/deploy.yml`；想私有改 Cloudflare Pages + Access，
  workflow 檔內有註解）。
- 原始教材：`vendor/curriculum/`（gitignored 的 TOP curriculum shallow clone）。
- 進度表：`docs/index.md` 的進度區塊由 `scripts/build_index.py` 自動重寫，
  不要手改標記之間的內容。

## Bootstrap（第一次 session 依序執行）

1. `git init`；確認 git user.name / user.email 如上；建 GitHub repo 並 push。
2. `git clone --depth 1 https://github.com/TheOdinProject/curriculum vendor/curriculum`
3. `python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`
4. `mkdocs serve` 確認網站能跑、繁中介面正常。
5. 用 WebFetch 抓下列頁面，取得**官網順序**的完整課程清單，為每個 course 在
   `docs/foundations/` 與 `docs/full-stack-javascript/` 下建立 course 目錄與
   `index.md`（內含 checklist：每課一行、連回原文、全部未勾）：
   - https://www.theodinproject.com/paths/foundations/courses/foundations
   - https://www.theodinproject.com/paths/full-stack-javascript
   （JS path 頁面列出各 course，再逐一進 course 頁抓 lesson 清單。）
6. 把新建的 course index 加進 `mkdocs.yml` 的 `nav:`。
7. `python scripts/build_index.py` 更新首頁進度表，`mkdocs build --strict` 確認乾淨。
8. Commit + push。提醒 Fredric 去 GitHub repo Settings → Pages 把 Source 指向
   `gh-pages` branch（第一次 Actions 跑完才會出現）。

## 日常工作流

Fredric 貼一個 lesson URL（或說「產〈某課〉的講義」）→ 觸發 `odin-lecture` skill
（`.claude/skills/odin-lecture/SKILL.md`，流程細節在那裡）→ 產出一課講義 →
更新 `nav:`、course checklist、首頁進度 → `mkdocs build --strict` → commit。

Commit 訊息格式：`feat(foundations): 〈課名〉講義` / `feat(js): ...`。

## scripts/ 程式碼慣例

Python 3.12+，type hints，pathlib（不用 os.path），f-strings，dataclasses。
不加非必要的 try/except、logging、輸入驗證。
