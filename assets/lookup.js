/* SEO仕組み講座 — 「選んで調べる」ツール
 * 本文の言葉を選択すると、Google AIモード / Claude / Google検索 を
 * 質問文入力済みの新しいタブで開くボタンを表示する。サーバー・費用不要。 */
(function () {
  var MAX_LEN = 150;   /* これより長い選択では出さない */
  var WORD_LEN = 20;   /* これ以下は「言葉」、超えると「文章」として聞く */
  var SKIP = 'button, input, textarea, select, .topnav, .quiz .opts, .koza-lookup, .koza-lookup-tip';

  var css = [
    '.koza-lookup{position:fixed;z-index:60;width:min(320px,calc(100vw - 32px));background:var(--surface,#fff);color:var(--fg,#1E2B24);',
    'border:2px solid var(--edge,#1E2B24);border-radius:14px;box-shadow:4px 4px 0 var(--drop,#1E2B24);padding:12px 12px 10px;font-family:var(--font-body,sans-serif);',
    'opacity:0;transform:translateY(4px);transition:opacity .15s,transform .15s;pointer-events:none}',
    '.koza-lookup.show{opacity:1;transform:none;pointer-events:auto}',
    '.koza-lookup .kl-head{display:flex;align-items:center;gap:8px;margin:0 0 8px}',
    '.koza-lookup .kl-label{font-size:12px;color:var(--muted,#4C5C53);white-space:nowrap}',
    '.koza-lookup .kl-term{flex:1;min-width:0;font-weight:700;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.koza-lookup .kl-x{flex:none;width:32px;height:32px;border:0;border-radius:8px;background:transparent;color:var(--muted,#4C5C53);font-size:20px;line-height:1;cursor:pointer}',
    '.koza-lookup .kl-x:hover{background:var(--idle,#E3E9E0)}',
    '.koza-lookup a{display:flex;align-items:center;gap:10px;min-height:44px;padding:8px 10px;margin-top:6px;border-radius:10px;text-decoration:none;',
    'color:var(--fg,#1E2B24);background:var(--idle,#E3E9E0);font-weight:700;font-size:14px}',
    '.koza-lookup a:hover,.koza-lookup a:focus-visible{outline:2px solid var(--green,#2F8F5B);outline-offset:0}',
    '.koza-lookup a.kl-main{background:var(--green,#2F8F5B);color:var(--on-green,#fff)}',
    '.koza-lookup a .kl-ico{flex:none;width:22px;text-align:center;font-size:16px}',
    '.koza-lookup a .kl-sub{display:block;font-weight:400;font-size:11px;opacity:.85}',
    '.koza-lookup .kl-note{margin:8px 2px 0;font-size:11px;line-height:1.5;color:var(--muted,#4C5C53)}',
    '@media (max-width:640px),(pointer:coarse){.koza-lookup{left:16px!important;right:16px;top:auto!important;bottom:16px;width:auto}}',
    '.koza-lookup-tip{display:flex;align-items:center;gap:10px;margin:16px auto 0;max-width:var(--koza-w,760px);padding:10px 12px;border:2px dashed var(--gold-line,#C9921C);',
    'border-radius:12px;background:var(--gold-soft,#FFF4D6);color:var(--fg,#1E2B24);font-size:13px;line-height:1.6}',
    '.koza-lookup-tip p{margin:0;flex:1}',
    '.koza-lookup-tip button{flex:none;border:0;background:transparent;color:var(--muted,#4C5C53);font-size:18px;width:32px;height:32px;border-radius:8px;cursor:pointer}'
  ].join('');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function q(s) { return encodeURIComponent(s); }

  function contextOf(range, term) {
    var n = range.commonAncestorContainer;
    if (n.nodeType !== 1) n = n.parentNode;
    var block = n.closest('p, li, dd, td, h2, h3, summary') || n;
    var text = (block.textContent || '').replace(/\[\d+\]/g, '').replace(/\s+/g, ' ').trim();
    var parts = text.split(/(?<=。)/);
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].indexOf(term) >= 0) { text = parts[i].trim(); break; }
    }
    return text.length > 140 ? text.slice(0, 140) + '…' : text;
  }

  function links(term, ctx) {
    if (term.length > WORD_LEN) {
      var askLong = 'SEOを勉強中の初心者です。次の文章の意味を、Google検索のしくみの文脈で、身近な例えを使ってやさしく説明してください。\n「' + term + '」' +
        (ctx && ctx.length > term.length + 5 ? '\n前後の文:「' + ctx + '」' : '');
      var aiModeLong = 'SEO初心者向けに次の文章の意味をやさしく説明して:「' + term + '」';
      return [
        { cls: 'kl-main', ico: '✨', label: 'Google AIモードで聞く', sub: 'この文章の意味を解説', href: 'https://www.google.com/search?udm=50&q=' + q(aiModeLong) },
        { ico: '💬', label: 'Claudeに聞く', sub: '前後の文も添えて質問', href: 'https://claude.ai/new?q=' + q(askLong) }
      ];
    }
    var ai = 'SEOを勉強中の初心者です。「' + term + '」とは何ですか?' +
      'Google検索のしくみ(クロール・インデックス・ランキング・表示)の文脈で、身近な例えを1つ使って、やさしく説明してください。' +
      (ctx && ctx !== term ? '\n学習中の文章:「' + ctx + '」' : '');
    var aiShort = 'SEO初心者向けに「' + term + '」とは何かを、Google検索のしくみの文脈でやさしく説明して';
    return [
      { cls: 'kl-main', ico: '✨', label: 'Google AIモードで聞く', sub: 'AIがやさしく解説', href: 'https://www.google.com/search?udm=50&q=' + q(aiShort) },
      { ico: '💬', label: 'Claudeに聞く', sub: '文の流れも添えて質問', href: 'https://claude.ai/new?q=' + q(ai) },
      { ico: '🔍', label: 'Googleで検索', sub: '「' + term + ' とは SEO」', href: 'https://www.google.com/search?q=' + q(term + ' とは SEO') }
    ];
  }

  var box = document.createElement('div');
  box.className = 'koza-lookup';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', '選んだ言葉を調べる');
  box.innerHTML = '<div class="kl-head"><span class="kl-label">しらべる</span><span class="kl-term"></span>' +
    '<button type="button" class="kl-x" aria-label="閉じる">×</button></div><div class="kl-links"></div>' +
    '<p class="kl-note">新しいタブで開きます。AIの回答は誤ることがあるので、大事な点は公式ドキュメントで確かめましょう。</p>';
  document.body.appendChild(box);
  box.addEventListener('mousedown', function (e) { if (!e.target.closest('a')) e.preventDefault(); });
  box.querySelector('.kl-x').addEventListener('click', hide);

  var current = '';
  function hide() { box.classList.remove('show'); current = ''; }

  function show(term, range) {
    current = term;
    box.querySelector('.kl-term').textContent = '「' + term + '」';
    box.querySelector('.kl-label').textContent = term.length > WORD_LEN ? 'この文章を聞く' : 'しらべる';
    var ctx = contextOf(range, term);
    var wrap = box.querySelector('.kl-links');
    wrap.innerHTML = '';
    links(term, ctx).forEach(function (l) {
      var a = document.createElement('a');
      a.href = l.href; a.target = '_blank'; a.rel = 'noopener';
      if (l.cls) a.className = l.cls;
      a.innerHTML = '<span class="kl-ico" aria-hidden="true">' + l.ico + '</span><span><span class="kl-t"></span><span class="kl-sub"></span></span>';
      a.querySelector('.kl-t').textContent = l.label;
      a.querySelector('.kl-sub').textContent = l.sub;
      wrap.appendChild(a);
    });
    place(range);
    box.classList.add('show');
  }

  function place(range) {
    var r = range.getBoundingClientRect();
    var w = box.offsetWidth || 320, h = box.offsetHeight || 220;
    var left = Math.max(16, Math.min(r.left, window.innerWidth - w - 16));
    var top = r.bottom + 10;
    if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 10);
    box.style.left = left + 'px';
    box.style.top = top + 'px';
  }

  var timer;
  function check() {
    var sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) { hide(); return; }
    var term = sel.toString().replace(/\s+/g, ' ').trim();
    if (!term || term.length > MAX_LEN) { hide(); return; }
    var range = sel.getRangeAt(0);
    var node = range.commonAncestorContainer;
    if (node.nodeType !== 1) node = node.parentNode;
    if (node.closest(SKIP)) { hide(); return; }
    if (term === current && box.classList.contains('show')) { place(range); return; }
    show(term, range);
  }
  document.addEventListener('selectionchange', function () { clearTimeout(timer); timer = setTimeout(check, 350); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
  window.addEventListener('scroll', function () { if (box.classList.contains('show') && window.matchMedia('(min-width:641px) and (pointer:fine)').matches) check(); }, { passive: true });

  /* 初回だけの使い方ヒント */
  var KEY = 'koza-lookup-tip-closed';
  var closed = false;
  try { closed = localStorage.getItem(KEY) === '1'; } catch (e) {}
  if (!closed) {
    var anchor = document.querySelector('.goal');
    if (anchor) {
      var tip = document.createElement('div');
      tip.className = 'koza-lookup-tip';
      tip.innerHTML = '<span aria-hidden="true">💡</span><p>わからない言葉は、<b>なぞって選ぶ</b>(スマホは長押し)と、AIやGoogleですぐ調べられます。</p>' +
        '<button type="button" aria-label="ヒントを閉じる">×</button>';
      anchor.parentNode.insertBefore(tip, anchor);
      tip.querySelector('button').addEventListener('click', function () {
        tip.remove();
        try { localStorage.setItem(KEY, '1'); } catch (e) {}
      });
    }
  }
})();
