---
title: 設定 Git
source_url: https://www.theodinproject.com/lessons/foundations-setting-up-git
source_file: vendor/curriculum/foundations/installations/setting_up_git.md
path: foundations
course: Foundations
order: 10
generated: 2026-07-03
---

# 設定 Git

> 改寫自 The Odin Project：[Setting up Git](https://www.theodinproject.com/lessons/foundations-setting-up-git)
> ｜Foundations › Prerequisites

## 核心概念

### Git 與 GitHub 不是同一回事

Git 是一套非常流行的 version control system（版本控制系統）。它安裝在你自己的電腦上，負責記錄程式碼「每一次的變更」：誰在什麼時候改了哪一行、為什麼改，都會被留存下來，讓你可以隨時回到過去任何一個版本。你會在整個 TOP 課程中一再用到它，之後也有大量專門講 Git 的課，所以現在還不完全理解也沒關係。

GitHub 則是一個「服務」，讓你透過網頁介面把用 Git 管理的程式碼上傳、託管、管理在雲端。簡單說：Git 是跑在你電腦上的工具，GitHub 是放程式碼的網站。兩者名字很像，但不是同一家公司做的，也不是同一個東西。你可以只用 Git 不碰 GitHub，但把兩者接起來，就能把本機的 commit 推上雲端、與他人協作。

這一課的任務有五件事：了解 Git 是什麼、了解 GitHub 是什麼、安裝並設定 Git、註冊 GitHub 帳號、把 Git 連上你的 GitHub 帳號。

### 要裝什麼、為什麼、怎麼驗證

**安裝 Git。** 安裝步驟依作業系統（Linux、macOS、ChromeOS）而不同，細節請以原文的安裝指南為準（見「練習」段）。裝完後可在終端機輸入 `git --version`，若能印出版本號就代表安裝成功。

**設定身分。** Git 需要知道「你是誰」，才能把本機的每一次 commit 掛到正確的作者名下。在團隊裡，這讓大家看得出每一行程式碼是誰、在何時提交的。因此裝好 Git 後，第一件事就是用 `git config` 設定使用者名稱與 email。

**註冊 GitHub 並保護 email。** 到 GitHub.com 註冊帳號時會要求填一個「真實的」email，它預設會用來標記你的貢獻。如果你在意隱私、不想讓 email 公開，可在登入後的 Email 設定頁勾選「Keep my email addresses private」與「Block command line pushes that expose my email」兩個選項。開啟後，GitHub 會提供一組形如 `12345678+帳號@users.noreply.github.com` 的私密 email，把它記下來，設定 Git 時要用。

**（選用）開啟兩步驟驗證（2FA）。** 2FA 是登入時額外的一層安全防護：除了帳號密碼，還要再提供一組只有你能取得的驗證碼（通常來自 Google Authenticator 這類 TOTP app）。強烈建議開啟，但務必妥善保管復原碼——一旦弄丟 2FA 憑證又遺失復原碼，GitHub 官方基於安全考量將無法幫你救回帳號。

### SSH key：讓推送不必每次輸入密碼

要把程式碼從本機推上 GitHub，需要一種驗證方式。這一課選的是 **SSH**（而不是 HTTPS）。SSH key 是一組「密碼學上安全的識別碼」，可以想成一組非常長的密碼，用來向 GitHub 證明「這台機器就是我」。它是一對金鑰：**私鑰（private key）**留在你電腦上絕不外流，**公鑰（public key，`.pub` 檔）**貼到 GitHub。設定好之後，推送程式碼就不必每次都打帳號密碼。

課程建議使用 **Ed25519** 演算法產生金鑰。產生時可以設一組 passphrase（通關密語）來加密本機的私鑰——若不設，任何能存取你電腦的人都能讀到私鑰、進而改動你所有的儲存庫；設不設由你決定。把公鑰貼到 GitHub 後，再用一行測試指令確認連線是否成功即可。

## 程式碼範例

設定身分與預設分支（引號要保留，換成你自己的資料）：

```bash
git config --global user.name "Your Name"
git config --global user.email yourname@example.com
```

若你在 GitHub 選了隱藏 email，第二行改用私密 email：

```bash
git config --global user.email 12345678+odin@users.noreply.github.com
```

GitHub 已把新 repository 的預設分支從 `master` 改為 `main`，一併設定：

```bash
git config --global init.defaultBranch main
```

驗證設定是否生效（應印出你剛填的名字與 email）：

```bash
git config --get user.name
git config --get user.email
```

檢查是否已有 Ed25519 金鑰；若顯示「No such file or directory」代表還沒有，需自行產生：

```bash
ls ~/.ssh/id_ed25519.pub
ssh-keygen -t ed25519
```

把公鑰內容印到終端機，複製整段（通常以 `ssh-ed25519` 開頭、以 `username@hostname` 結尾）貼到 GitHub：

```bash
cat ~/.ssh/id_ed25519.pub
```

## 常見陷阱

!!! warning "把私鑰貼到 GitHub"
    貼到 GitHub 的必須是**公鑰**，也就是有 `.pub` 副檔名的那個檔（`id_ed25519.pub`）。私鑰（沒有 `.pub` 的 `id_ed25519`）要永遠留在自己電腦上，絕對不要上傳或分享。用 `cat ~/.ssh/id_ed25519.pub` 讀取時，特別注意結尾的 `.pub` 別漏掉。

!!! warning "弄丟 2FA 就可能永久失去帳號"
    開啟 2FA 後，一定要把復原碼（recovery codes）另外備份到安全的地方。若同時弄丟驗證裝置與復原碼，GitHub 官方基於安全政策無法協助復原帳號。

!!! warning "email 設私密卻用了公開 email 設定 Git"
    若你在 GitHub 勾選了隱藏 email，設定 `git config user.email` 時就要用那組 `@users.noreply.github.com` 的私密 email；否則你的真實 email 仍會出現在每一次 commit 裡而被公開。

!!! warning "macOS 的 .DS_Store 混進 commit"
    macOS 用 Finder 瀏覽資料夾時會自動產生隱藏的 `.DS_Store` 檔。若不設定忽略，這些檔會一直冒進你的 commit。macOS 使用者請執行下方練習中的兩行指令，把它加入全域忽略清單。

## 練習

各作業系統的 Git 安裝步驟以原文為準，請依你的系統挑選對應指南：

1. **安裝 Git**：到原文的 [Setting up Git](https://www.theodinproject.com/lessons/foundations-setting-up-git) 課程，依 Linux／macOS／ChromeOS 對應的安裝指南操作。裝完以 `git --version` 驗證。
2. **註冊 GitHub 帳號**：到 [GitHub.com](https://github.com/) 註冊。登入後到 Email 設定頁勾選隱藏 email 的兩個選項，並記下系統給你的私密 email。
3. **（選用）開啟 2FA**：依 GitHub 官方文件設定，建議搭配 Google Authenticator。務必備份復原碼。
4. **設定 Git 身分**：執行上面「程式碼範例」中的 `user.name`、`user.email`、`init.defaultBranch` 三組指令，再用 `git config --get` 驗證。
5. **macOS 使用者額外一步**：執行下列指令，讓 Git 忽略 `.DS_Store`：

   ```bash
   echo .DS_Store >> ~/.gitignore_global
   git config --global core.excludesfile ~/.gitignore_global
   ```

6. **產生 SSH key**：先用 `ls ~/.ssh/id_ed25519.pub` 檢查是否已有金鑰，沒有就用 `ssh-keygen -t ed25519` 產生（存檔位置直接按 Enter，passphrase 選填）。
7. **把公鑰加到 GitHub**：登入 GitHub → 右上角頭像 → Settings → 左側 `SSH and GPG keys` → `New SSH Key`。取一個好認的名稱（如 `linux-ubuntu`），用 `cat ~/.ssh/id_ed25519.pub` 複製整段公鑰貼上，類型維持 `Authentication Key`，按 `Add SSH key`。
8. **測試連線**：依 GitHub 官方「Testing your SSH connection」文件測試。看到 `Hi username! You've successfully authenticated, but GitHub does not provide shell access.` 就代表成功（沒有 shell access 是正常的，不用擔心）。

自我檢核：Git 是什麼？GitHub 是什麼？這一課設定的驗證方式是 SSH 還是 HTTPS？（答案是 SSH。）

## 原文與延伸資源

- 原文：[Setting up Git](https://www.theodinproject.com/lessons/foundations-setting-up-git)
- 本課引用：
  - [Git 官方網站](https://git-scm.com/)
  - [GitHub](https://github.com/)、[GitHub Email 設定頁](https://github.com/settings/emails)
  - [GitHub 2FA 設定文件](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication)
  - [測試 SSH 連線](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection)、[GitHub 的 SSH 指紋](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints)

---

> 本講義改寫自 The Odin Project《Setting up Git》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
