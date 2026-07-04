/* 讀者閱讀進度：純前端、存在瀏覽器 localStorage，免改任何檔。
   - 每課頁面：H1 下方「標記為已讀」按鈕 + 預估閱讀時間
   - 課程清單頁：核取方塊可點 + 本課程進度
   - 首頁課程目錄：即時「你已讀 X／N 課」、各課程分項進度、已讀標示、清除進度
   - 左側導覽：已讀的課標一個勾
   相容 Material 的 instant navigation（用 document$ 訂閱每次換頁）。 */
(function () {
  "use strict";
  var KEY = "odin-read-v1";

  function load() {
    try {
      return new Set(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch (e) {
      return new Set();
    }
  }
  var readSet = load();
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(Array.from(readSet)));
    } catch (e) {}
  }
  function isRead(id) { return readSet.has(id); }
  function setRead(id, on) { on ? readSet.add(id) : readSet.delete(id); save(); }

  var LESSON_RE = /\/\d{2}-[^\/]+\/?$/;
  function idFromHref(href) {
    try {
      var p = new URL(href, location.origin).pathname;
      return p.replace(/index\.html$/, "").replace(/\/?$/, "/");
    } catch (e) { return null; }
  }
  function isLessonPath(path) { return LESSON_RE.test(path.replace(/\/$/, "")); }
  function currentId() { return idFromHref(location.href); }
  function isLessonId(id) { return id && isLessonPath(id.replace(/\/$/, "")); }

  // 收集某容器內的課連結 id（去重）
  function lessonIdsIn(root) {
    var seen = {};
    (root || document).querySelectorAll("a[href]").forEach(function (a) {
      var id = idFromHref(a.href);
      if (isLessonId(id)) seen[id] = true;
    });
    return Object.keys(seen);
  }
  function readCount(ids) {
    return ids.filter(function (id) { return isRead(id); }).length;
  }

  // 1) 每課頁面：「標記為已讀」按鈕 + 預估閱讀時間
  function enhanceLecture() {
    var path = location.pathname.replace(/\/$/, "");
    if (!isLessonPath(path)) return;
    var article = document.querySelector(".md-content__inner");
    if (!article) return;
    var h1 = article.querySelector("h1");
    if (!h1) return;
    if (!article.querySelector(".od-read-toggle")) {
      var id = currentId();
      var wrap = document.createElement("div");
      wrap.className = "od-lecture-tools";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "od-read-toggle";
      function render() {
        var on = isRead(id);
        btn.classList.toggle("is-read", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
        btn.textContent = on ? "✓ 已讀（點一下取消）" : "標記為已讀";
      }
      btn.addEventListener("click", function () {
        setRead(id, !isRead(id));
        render();
      });
      render();
      wrap.appendChild(btn);
      var mins = readingMinutes(article);
      if (mins) {
        var t = document.createElement("span");
        t.className = "od-read-time";
        t.textContent = "約 " + mins + " 分鐘";
        wrap.appendChild(t);
      }
      h1.insertAdjacentElement("afterend", wrap);
    }
  }
  function readingMinutes(article) {
    var text = article.textContent || "";
    var cjk = (text.match(/[㐀-鿿]/g) || []).length;
    var words = (text.replace(/[㐀-鿿]/g, " ").match(/[A-Za-z0-9]+/g) || []).length;
    var mins = Math.round(cjk / 400 + words / 200);
    return Math.max(1, mins);
  }

  // 2) 課程清單頁：核取方塊可點 + 本課程進度
  function enhanceChecklist() {
    var items = document.querySelectorAll(".md-content__inner .task-list-item");
    if (!items.length) return;
    items.forEach(function (li) {
      var input = li.querySelector('input[type="checkbox"]');
      var link = li.querySelector("a[href]");
      if (!input || !link) return;
      var id = idFromHref(link.href);
      if (!isLessonId(id)) return;
      input.disabled = false;
      input.checked = isRead(id);
      input.setAttribute("aria-label", "標記已讀：" + (link.textContent || "").trim());
      li.classList.toggle("od-done", input.checked);
      if (!input.dataset.odBound) {
        input.dataset.odBound = "1";
        input.addEventListener("change", function () {
          setRead(id, input.checked);
          li.classList.toggle("od-done", input.checked);
          updateChecklistProgress();
        });
      }
    });
    updateChecklistProgress();
  }
  function updateChecklistProgress() {
    var article = document.querySelector(".md-content__inner");
    if (!article || !article.querySelector(".task-list-item")) return;
    var ids = lessonIdsIn(article);
    var el = article.querySelector(".od-course-progress-line");
    if (!el) {
      var h1 = article.querySelector("h1");
      if (!h1) return;
      el = document.createElement("p");
      el.className = "od-course-progress-line";
      h1.insertAdjacentElement("afterend", el);
    }
    el.textContent = "本課程 你已讀 " + readCount(ids) + "／" + ids.length + " 課";
  }

  // 3) 首頁：即時計數 + 各課程分項進度 + 已讀標示 + 清除鈕
  function enhanceIndexList() {
    var el = document.querySelector(".od-read-count");
    if (!el) return; // 只在首頁
    document.querySelectorAll(".md-content__inner a[href]").forEach(function (a) {
      var id = idFromHref(a.href);
      if (isLessonId(id)) a.classList.toggle("od-link-read", isRead(id));
    });
    el.textContent = String(readCount(lessonIdsIn(document.querySelector(".md-content__inner"))));
    document.querySelectorAll(".md-content__inner .od-course").forEach(function (d) {
      var span = d.querySelector(".od-course-progress");
      if (!span) return;
      var ids = lessonIdsIn(d);
      span.textContent = "　已讀 " + readCount(ids) + "／" + ids.length;
    });
    injectReset(el);
  }
  function updateCounter() { enhanceIndexList(); }
  function injectReset(counterEl) {
    var host = counterEl.closest("p") || counterEl.parentNode;
    if (!host || host.querySelector(".od-reset")) return;

    function mkBtn(label, onClick) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "od-reset";
      b.textContent = label;
      b.addEventListener("click", onClick);
      host.appendChild(document.createTextNode(" "));
      host.appendChild(b);
      return b;
    }
    // 匯出：下載 JSON 檔（拿到別台裝置匯入即可同步）
    mkBtn("匯出進度", function () {
      var blob = new Blob([JSON.stringify(Array.from(readSet), null, 2)], {
        type: "application/json",
      });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "odin-reading-progress.json";
      a.click();
      URL.revokeObjectURL(a.href);
    });
    // 匯入：選擇先前匯出的 JSON 檔（與現有進度合併）
    var picker = document.createElement("input");
    picker.type = "file";
    picker.accept = "application/json,.json";
    picker.hidden = true;
    picker.addEventListener("change", function () {
      var f = picker.files && picker.files[0];
      if (!f) return;
      f.text().then(function (txt) {
        try {
          var arr = JSON.parse(txt);
          if (!Array.isArray(arr)) throw new Error("format");
          arr.forEach(function (id) {
            if (typeof id === "string" && isLessonId(id)) readSet.add(id);
          });
          save();
          run();
        } catch (e) {
          window.alert("匯入失敗：請選擇由「匯出進度」產生的 JSON 檔。");
        }
        picker.value = "";
      });
    });
    host.appendChild(picker);
    mkBtn("匯入進度", function () { picker.click(); });
    // 清除
    mkBtn("清除進度", function () {
      if (!window.confirm("確定清除所有閱讀進度嗎？此動作無法復原。")) return;
      readSet.clear();
      save();
      run();
    });
  }

  // 4) 左側導覽：已讀的課標一個勾
  function enhanceNav() {
    document.querySelectorAll(".md-nav__link[href]").forEach(function (a) {
      var raw = a.getAttribute("href") || "";
      if (raw.indexOf("#") !== -1) return; // 跳過本頁目錄的錨點連結（它們都指向當前這課）
      var id = idFromHref(a.href);
      if (isLessonId(id)) a.classList.toggle("od-nav-read", isRead(id));
    });
  }

  function run() {
    enhanceLecture();
    enhanceChecklist();
    enhanceIndexList();
    enhanceNav();
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(run);
  } else if (document.readyState !== "loading") {
    run();
  } else {
    document.addEventListener("DOMContentLoaded", run);
  }
})();
