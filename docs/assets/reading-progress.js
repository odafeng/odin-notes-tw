/* 讀者閱讀進度：純前端、存在瀏覽器 localStorage，免改任何檔。
   - 每課頁面：H1 下方一顆「標記為已讀」按鈕
   - 課程清單頁：核取方塊可點，點了就記住
   - 首頁課程目錄：已讀的課標示出來，並即時算「你已讀 X／N 課」
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

  // 課頁網址型如 /.../<course>/NN-slug/ ；用絕對路徑當唯一 id
  var LESSON_RE = /\/\d{2}-[^\/]+\/?$/;
  function idFromHref(href) {
    try {
      var p = new URL(href, location.origin).pathname;
      return p.replace(/index\.html$/, "").replace(/\/?$/, "/");
    } catch (e) { return null; }
  }
  function isLessonPath(path) { return LESSON_RE.test(path.replace(/\/$/, "")); }
  function currentId() { return idFromHref(location.href); }

  // 1) 每課頁面：注入「標記為已讀」按鈕
  function enhanceLecture() {
    var path = location.pathname.replace(/\/$/, "");
    if (!isLessonPath(path)) return;
    var article = document.querySelector(".md-content__inner");
    if (!article || article.querySelector(".od-read-toggle")) return;
    var h1 = article.querySelector("h1");
    if (!h1) return;
    var id = currentId();
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
    h1.insertAdjacentElement("afterend", btn);
  }

  // 2) 課程清單頁：讓核取方塊可點、並反映已讀狀態
  function enhanceChecklist() {
    var items = document.querySelectorAll(".md-content__inner .task-list-item");
    items.forEach(function (li) {
      var input = li.querySelector('input[type="checkbox"]');
      var link = li.querySelector('a[href]');
      if (!input || !link) return;
      var id = idFromHref(link.href);
      if (!id || !isLessonPath(id.replace(/\/$/, ""))) return;
      input.disabled = false;
      input.checked = isRead(id);
      li.classList.toggle("od-done", input.checked);
      if (input.dataset.odBound) return;
      input.dataset.odBound = "1";
      input.addEventListener("change", function () {
        setRead(id, input.checked);
        li.classList.toggle("od-done", input.checked);
        updateCounter();
      });
    });
  }

  // 3) 首頁：標示已讀連結 + 即時計數
  function enhanceIndexList() {
    document.querySelectorAll(".md-content__inner a[href]").forEach(function (a) {
      var id = idFromHref(a.href);
      if (id && isLessonPath(id.replace(/\/$/, ""))) {
        a.classList.toggle("od-link-read", isRead(id));
      }
    });
    updateCounter();
  }
  function updateCounter() {
    var el = document.querySelector(".od-read-count");
    if (!el) return;
    var ids = {};
    document.querySelectorAll(".md-content__inner a[href]").forEach(function (a) {
      var id = idFromHref(a.href);
      if (id && isLessonPath(id.replace(/\/$/, ""))) ids[id] = true;
    });
    var keys = Object.keys(ids);
    var read = keys.filter(function (id) { return isRead(id); }).length;
    el.textContent = String(read);
  }

  function run() {
    enhanceLecture();
    enhanceChecklist();
    enhanceIndexList();
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(run);
  } else if (document.readyState !== "loading") {
    run();
  } else {
    document.addEventListener("DOMContentLoaded", run);
  }
})();
