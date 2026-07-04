# 2. 用 GitHub Actions 原生 Pages 部署（而非 legacy 分支）

日期：2026-07-02

## 狀態

已接受（取代骨架原本的 `mkdocs gh-deploy` 做法）

## 背景

專案骨架原本的 `deploy.yml` 用 `mkdocs gh-deploy --force`，把建好的網站推到
`gh-pages` 分支，再由 GitHub Pages 的 legacy（branch-based）builder 發佈。
實際部署時，legacy builder 的 deploy 步驟反覆對 Pages API 逾時
（`error_count: 10` → `Timeout reached, aborting!`），且過程不透明、難重跑。

## 決策

改用 **GitHub Actions 原生 Pages 流程**：`build`（`mkdocs build --strict`）→
`actions/upload-pages-artifact` → `actions/deploy-pages`，並用 API 把 Pages
的 build_type 設為 `workflow`。`deploy-pages` 再拉高 `timeout`（15 分）與
`error_count`（25），讓 GitHub Pages 後端偶發的 transient 逾時能自癒。

## 後果

- 好處：build/deploy 攤在自己的 workflow 裡、log 清楚、可乾淨重跑；
  不再依賴 `gh-pages` 分支；deploy 逾時容忍度提高後多能自動成功。
- 代價／取捨：
  - 需要 `pages: write` 與 `id-token: write` 權限。
  - 仍受 GitHub Pages 後端可用性影響；transient 失敗雖會自癒，偶爾仍可能需重跑。
  - 綁定 GitHub Pages；若改用 Cloudflare Pages 等需另寫（deploy.yml 註解有指引）。
