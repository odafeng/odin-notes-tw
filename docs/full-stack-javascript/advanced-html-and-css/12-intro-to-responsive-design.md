---
title: 響應式設計簡介
source_url: https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-introduction-to-responsive-design
source_file: vendor/curriculum/advanced_html_css/responsive_design/introduction_to_responsive_design.md
path: full-stack-javascript
course: Advanced HTML and CSS
order: 12
status: draft
generated: 2026-07-03
---

# 響應式設計簡介

> 改寫自 The Odin Project：[Introduction to Responsive Design](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-introduction-to-responsive-design)
> ｜Full Stack JavaScript › Advanced HTML and CSS › Responsive Design

## 核心概念

### 名詞先講清楚：這裡的 design 不是「設計」

Responsive Design（響應式設計）指的是打造一個會「回應」（respond）瀏覽器尺寸變化的網站，讓同一份頁面在任何裝置上都能正常運作。這個名稱其實有點誤導，關鍵字卡在 design（設計）這個字。

一般講到 design，是指決定什麼東西看起來好看、規劃使用者體驗、拍板專案最終長相這類「美學與體驗」的工作。但接下來這一系列課程的重點不在美學決策，而在你可以拿來「實作」出響應能力的 CSS 技術。之所以還是沿用 Responsive Design 這個詞，純粹是因為它已經被業界普遍採用，講別的反而沒人聽得懂。換句話說，這門課教的是「怎麼把響應能力寫出來」，不是「怎麼把版面設計得漂亮」。

### 為什麼響應式設計是必備能力

自從 2007 年第一支 iPhone 問世，網站能同時在桌機大螢幕與手機小螢幕上正常顯示，就從「加分項」變成了「基本要求」。今天的使用者可能拿著手機、平板、筆電或超寬桌面顯示器來看你的網站，你無法預設任何一種尺寸。

而這種跨尺寸的適應能力通常「不會自動發生」。頁面一旦比「純文字」複雜起來，麻煩就開始了。你早期那個只有 HTML 的食譜（recipe）專案，在手機上大概還算堪用，頂多圖片（image）被裁掉一角；但只要版面稍微複雜一點，不做任何處理的頁面在小螢幕上就會爆版、橫向捲動、內容擠成一團。

所以講到底，**Responsive Web Design 就是一套讓你的網站能在「任何尺寸螢幕」上運作的技術集合**。

### 兩條主要路線：彈性 vs. 換版

達成響應能力主要靠兩種手法，實務上多數專案會同時用到：

1. **讓版面本身有彈性（fluid / flexible）**：不要把寬度、間距寫死成固定像素，而是用百分比（%）、`max-width`、Flexbox、Grid、`fr`、`min()`／`max()`／`clamp()` 這類會跟著容器伸縮的方式。這樣同一套版面就能在相當大的尺寸範圍內自動調整，不需要為每個尺寸都另寫規則。

2. **在特定尺寸「大改版面」**：有時候光靠伸縮不夠，你會希望在螢幕窄到某個程度時，把三欄變一欄、把水平導覽列收成漢堡選單。這靠的是 media query（媒體查詢，後續課程主題），在指定的斷點（breakpoint）套用不同的 CSS。

先有彈性版面打底，再用少量斷點處理「伸縮救不回來」的情況，是最省力也最穩健的組合。

### 該支援哪些螢幕尺寸

- **下限：約 `320px`。** 市面上常見手機很少比這更窄，所以只要你的網站在 `320px` 寬度下還能正常運作，基本上就能應付任何小裝置。把 `320px` 當成可靠的最低目標即可。
- **上限：比較難一刀切。** 現在超寬（ultra-wide）顯示器並不罕見，你得預期網站可能被塞進一個誇張寬的螢幕。常見做法是替「所有內容」設一個 `max-width`，再把它置中（center）於頁面。這樣即使解析度再寬，內容也不會被撐成一條難讀的長線，兩側留白反而讓閱讀更舒服。

### 一個常被忽略但關鍵的前提：viewport meta 標籤

要讓響應式 CSS 在手機上真的生效，HTML 的 `<head>` 幾乎一定要放這行 viewport（可視區域）設定。少了它，手機瀏覽器會假裝自己是一塊約 `980px` 寬的桌機螢幕再縮小整頁，你寫的 media query 全都會抓錯尺寸，等於白做。這行標籤是所有響應式工作的起點。

### 用 DevTools 模擬各種裝置

開發時你不可能手邊擺滿各種手機。Chrome DevTools 的 Device Mode（裝置模式）讓你在桌機瀏覽器裡就能模擬不同螢幕尺寸、切換方向、甚至模擬觸控與較慢的網路，是驗證響應式版面最直接的工具。這是本課唯一的指定作業（見下方「練習」）。

## 程式碼範例

viewport meta 標籤（響應式的起手式，放進每一份 HTML 的 `<head>`）：

```html
<!-- width=device-width：把版面寬度設成裝置實際寬度 -->
<!-- initial-scale=1：初始縮放比例為 1，不自動縮小整頁 -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

彈性版面 ＋ 內容置中，同時處理小螢幕與超寬螢幕：

```css
/* 內容設一個上限寬度，並用左右 auto margin 置中 */
.container {
  max-width: 1200px; /* 超寬螢幕上不會被撐爆 */
  margin: 0 auto; /* 水平置中 */
  padding: 0 16px; /* 兩側留點呼吸空間，小螢幕也不貼邊 */
}

/* 圖片別寫死寬度，讓它跟著容器縮，才不會在手機上被裁掉 */
img {
  max-width: 100%;
  height: auto;
}
```

用 media query 在窄螢幕換版（斷點手法先看個概念，細節在後續課程）：

```css
/* 預設（較寬螢幕）：三欄並排 */
.layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* 螢幕寬度 <= 600px 時，改成單欄堆疊 */
@media (max-width: 600px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
```

## 常見陷阱

!!! warning "忘了放 viewport meta 標籤"
    少了 `<meta name="viewport" ...>`，手機瀏覽器會用約 `980px` 的虛擬寬度渲染整頁再縮小，你的 media query 全部抓錯尺寸、字也小到看不清。響應式沒生效時，第一個要檢查的就是這行。

!!! warning "把寬度寫死成固定 px"
    用 `width: 960px`、`width: 300px` 這種固定值，內容在比它窄的螢幕上就會爆版、產生橫向捲動。改用 `max-width`、百分比、Flexbox/Grid 這類彈性做法，讓版面能自己縮。

!!! warning "只在自己的螢幕上測試"
    在你的大螢幕上好好的，不代表在 `320px` 手機上沒問題。開發過程要主動用 DevTools 的 Device Mode 把寬度拉到小尺寸驗證，別等上線才發現爆版。

!!! warning "把「responsive design」誤會成美學設計"
    這門課的 design 指的是「實作響應能力的技術」，不是配色、字體、視覺風格。搞錯重點會讓你花錯力氣。

!!! warning "只想著手機，忘了超寬螢幕"
    響應式是「兩端」都要顧。沒設 `max-width` 的內容在超寬顯示器上會被拉成又長又難讀的一整行。替全站內容設上限寬度並置中，是省事又有效的解法。

## 練習

1. 閱讀 Chrome DevTools 官方的 **Device Mode（裝置模式）** 指南，學會在桌機瀏覽器裡模擬手機／平板等各種螢幕。原文作業指定的連結為：<https://developer.chrome.com/docs/devtools/device-mode/>。
2. 動手操作一遍，把以下幾件事練熟：
    - 開啟 DevTools（Windows/Linux 按 `F12` 或 `Ctrl+Shift+I`；macOS 按 `Cmd+Option+I`），再點左上角的「切換裝置工具列（Toggle device toolbar）」圖示進入 Device Mode。
    - 在頂端下拉選單切換不同裝置（如 iPhone、Pixel）或選「Responsive」自由拖曳邊框調整寬度。
    - 把寬度拉到約 `320px`，觀察你手邊某個既有頁面在最小尺寸下會不會爆版。
    - 試著切換螢幕方向（直式／橫式），並留意工具列上可調整的縮放與裝置像素比。

## 原文與延伸資源

- 原文：[Introduction to Responsive Design](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-introduction-to-responsive-design)
- 本課引用：
    - [Chrome DevTools：Device Mode（模擬行動裝置顯示）](https://developer.chrome.com/docs/devtools/device-mode/)
    - [MDN：Responsive design（響應式設計總覽）](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
    - [MDN：Viewport meta 標籤](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag)

---

> 本講義改寫自 The Odin Project《Introduction to Responsive Design》，原文以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權，本文以相同授權釋出。
