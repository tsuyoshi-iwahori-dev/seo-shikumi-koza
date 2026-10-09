/* SEO仕組み講座:公開スケジュールと、公開日による表示の切り替え。
   日付・タイトル・公開可否はこのファイルだけで管理する(各ページはここを参照する)。
   - ready:true かつ 日本時間で date の UNLOCK_HOUR 時を過ぎたステージだけが開放される
   - 公開日前のページは「準備中」画面になる。URLに ?preview を付けると事前に確認できる
   - 公開を止めたいときは、そのステージの ready を false にする(日付を変えれば延期) */
(function () {
  var UNLOCK_HOUR = 7;
  var BASE = "https://tsuyoshi-iwahori-dev.github.io/seo-shikumi-koza/";
  var STAGES = [
    { n: 1,  date: "2026-10-09", ready: true,  title: "全体像:Google検索の3つのステージ", short: "全体像" },
    { n: 2,  date: "2026-10-13", ready: true,  title: "クロール:ページを見つけて取得するしくみ", short: "クロール" },
    { n: 3,  date: "2026-10-14", ready: true,  title: "インデックス①:中身の理解と、登録されない理由", short: "インデックス①" },
    { n: 4,  date: "2026-10-15", ready: true,  title: "インデックス②:重複ページと正規化", short: "インデックス②" },
    { n: 5,  date: "2026-10-16", ready: true,  title: "検索結果の表示:関連性と結果の見え方", short: "検索結果の表示" },
    { n: 6,  date: "2026-10-19", ready: false, title: "言葉を理解するAI", short: "言葉を理解するAI" },
    { n: 7,  date: "2026-10-20", ready: false, title: "リンク分析とPageRank、オリジナルコンテンツ、鮮度", short: "リンクとPageRank" },
    { n: 8,  date: "2026-10-21", ready: false, title: "結果を整えるシステム、スパム検出、廃止されたシステム", short: "結果を整えるシステム" },
    { n: 9,  date: "2026-10-22", ready: false, title: "ユーザー第一のコンテンツと自己評価の質問", short: "ユーザー第一" },
    { n: 10, date: "2026-10-23", ready: false, title: "E-E-A-T・YMYLと品質評価者の役割", short: "E-E-A-T" },
    { n: 11, date: "2026-10-26", ready: false, title: "誰が・どのように・なぜ", short: "誰が・どのように・なぜ" },
    { n: 12, date: "2026-10-27", ready: false, title: "Googleに見つけてもらう・サイトを整理する", short: "見つけてもらう" },
    { n: 13, date: "2026-10-28", ready: false, title: "コンテンツ・リンク・タイトル・画像", short: "コンテンツとリンク" },
    { n: 14, date: "2026-10-29", ready: false, title: "Googleが「重要ではない」と言っていること", short: "重要ではないこと" },
    { n: 15, date: "2026-10-30", ready: false, title: "総まとめ:冒険ルートで振り返る＋総合テスト", short: "総まとめ" }
  ];
  var WD = ["日", "月", "火", "水", "木", "金", "土"];

  function pad(x) { return (x < 10 ? "0" : "") + x; }
  function get(n) { for (var i = 0; i < STAGES.length; i++) if (STAGES[i].n === n) return STAGES[i]; return null; }
  function jstKey() { return new Date(Date.now() + 9 * 36e5).toISOString().slice(0, 13); }
  function isOpen(n) { var s = get(n); return !!s && s.ready && jstKey() >= s.date + "T" + pad(UNLOCK_HOUR); }
  function md(s) { var p = s.date.split("-"); return (+p[1]) + "/" + (+p[2]); }
  function mdw(s) {
    var p = s.date.split("-");
    var w = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])).getUTCDay();
    return md(s) + "(" + WD[w] + ")";
  }
  function file(n) { return "lessons/" + pad(n) + ".html"; }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  var root = document.documentElement;
  var stageN = parseInt(root.getAttribute("data-stage") || "0", 10);
  var preview = /[?&]preview\b/.test(location.search);
  var locked = stageN > 0 && !isOpen(stageN);
  if (locked) root.classList.add(preview ? "koza-preview" : "koza-locked");

  var css =
    ".koza-locked .wrap,.koza-locked .backq{display:none!important}" +
    ".koza-lock{max-width:560px;margin:12vh auto 0;padding-inline:16px;padding-block:0 48px}" +
    ".koza-lock-card{background:var(--surface);color:var(--fg);border:3px solid var(--edge);border-radius:24px;box-shadow:0 6px 0 var(--drop);padding:30px 24px;display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center}" +
    ".koza-lock-ic{width:68px;height:68px;border-radius:50%;background:var(--gold);color:var(--on-gold);border:3px solid var(--edge);display:flex;align-items:center;justify-content:center}" +
    ".koza-lock-ic svg{width:32px;height:32px}" +
    ".koza-lock-card small{font-weight:800;font-size:.8rem;letter-spacing:.08em;color:var(--muted)}" +
    ".koza-lock-card h1{margin:0;font-family:var(--font-display);font-weight:400;font-size:1.45rem;line-height:1.4;text-wrap:balance}" +
    ".koza-lock-card p{margin:0;color:var(--muted);font-size:.92rem}" +
    ".koza-lock-card a{display:inline-flex;font-weight:800;font-size:.9rem;text-decoration:none;color:var(--on-gold);background:var(--gold);border:2px solid var(--edge);border-radius:999px;padding:8px 18px;box-shadow:0 3px 0 var(--drop)}" +
    ".koza-banner{position:sticky;top:env(safe-area-inset-top,0px);z-index:20;background:var(--gold);color:var(--on-gold);font-weight:800;font-size:.85rem;text-align:center;padding:8px 16px;border-bottom:3px solid var(--edge)}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || root).appendChild(st);

  function lockScreen(s) {
    var wrap = el("div", "koza-lock");
    var card = el("div", "koza-lock-card");
    card.setAttribute("role", "status");
    var ic = el("div", "koza-lock-ic");
    ic.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
    card.appendChild(ic);
    card.appendChild(el("small", null, "STAGE " + s.n + " / 15"));
    card.appendChild(el("h1", null, s.ready ? "このステージは " + mdw(s) + " " + UNLOCK_HOUR + ":00 に開放されます" : "このステージは準備中です"));
    card.appendChild(el("p", null, s.ready ? "開放までもう少しお待ちください。公開中のステージは、ワールドマップから進めます。" : "公開予定日は " + mdw(s) + " です。公開中のステージは、ワールドマップから進めます。"));
    var a = el("a", null, "← ワールドマップへ");
    a.href = BASE;
    card.appendChild(a);
    wrap.appendChild(card);
    return wrap;
  }

  function lessonPage() {
    var s = get(stageN);
    if (!s) return;
    var pub = document.querySelectorAll("[data-koza-pub]");
    for (var i = 0; i < pub.length; i++) pub[i].textContent = s.date;
    if (locked && !preview) document.body.insertBefore(lockScreen(s), document.body.firstChild);
    if (locked && preview) document.body.insertBefore(el("div", "koza-banner", "プレビュー表示(公開前)· 公開予定 " + mdw(s) + " " + UNLOCK_HOUR + ":00"), document.body.firstChild);
    var nx = document.querySelectorAll("[data-next]");
    for (var j = 0; j < nx.length; j++) {
      var box = nx[j], t = get(parseInt(box.getAttribute("data-next"), 10));
      if (!t) continue;
      if (isOpen(t.n)) {
        var link = el("a", "next");
        link.href = pad(t.n) + ".html";
        link.appendChild(el("small", null, "NEXT STAGE →"));
        link.appendChild(el("b", null, "STAGE " + t.n + " " + t.short));
        box.parentNode.replaceChild(link, box);
      } else {
        box.innerHTML = "";
        box.appendChild(el("small", null, "NEXT STAGE · " + md(t) + " 公開"));
        box.appendChild(el("b", null, "STAGE " + t.n + " " + t.short));
      }
    }
  }

  function mapPage() {
    var items = document.querySelectorAll("li[data-stage]");
    if (!items.length) return;
    var latest = 0;
    for (var k = 0; k < STAGES.length; k++) if (isOpen(STAGES[k].n)) latest = STAGES[k].n;
    for (var i = 0; i < items.length; i++) {
      var li = items[i], s = get(parseInt(li.getAttribute("data-stage"), 10));
      if (!s) continue;
      var open = isOpen(s.n);
      li.className = open ? "open" : "locked";
      var title = li.querySelector(".title");
      var old = title.querySelector("a,span");
      var node;
      if (open) { node = el("a", null, s.title); node.href = file(s.n); }
      else node = el("span", null, s.title);
      if (old) title.replaceChild(node, old); else title.appendChild(node);
      var d = li.querySelector(".date");
      if (d) d.textContent = md(s) + (open ? (s.n === latest ? " 公開中" : " 公開") : "");
    }
  }

  function run() { if (stageN) lessonPage(); else mapPage(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();

  window.KOZA = { stages: STAGES, get: get, isOpen: isOpen, unlockHour: UNLOCK_HOUR };
})();
