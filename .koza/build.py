#!/usr/bin/env python3
"""SEO仕組み講座:lessons/01.html をテンプレートに、.koza/src/NN.json と NN.body.html から lessons/NN.html を作る。

使い方:  python3 .koza/build.py 2 3 4 5
- NN.json : 回のメタ情報・冒険ルート・クイズ・出典
- NN.body.html : 今日のミッション〜現場ミッションまでの本文。<!--ROUTE--> の位置に冒険ルートが入る。
  本文中の [[n]] は出典番号のリンク(<sup class="ref">)に変換される。
"""
import json, re, sys, html, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://tsuyoshi-iwahori-dev.github.io/seo-shikumi-koza/"

NODES = [
    ("STEP 1", "クロール", "ページを見つけて取得する",
     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg>'),
    ("STEP 2", "インデックス", "内容を解析して保存する",
     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M4 7l8-4 8 4-8 4z"/><path d="M4 12l8 4 8-4"/><path d="M4 17l8 4 8-4"/></svg>'),
    ("STEP 3", "ランキング", "関連性と品質で結果を選ぶ",
     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M9 20V10h6v10"/><path d="M3 20v-6h6"/><path d="M15 20v-8h6v8"/></svg>'),
    ("STEP 4", "表示", "検索した人に結果を返す",
     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8"/></svg>'),
]


def load_schedule():
    js = open(os.path.join(ROOT, "assets/schedule.js"), encoding="utf-8").read()
    out = {}
    for m in re.finditer(r'\{ n: (\d+),\s+date: "([\d-]+)",\s+ready: (\w+),\s+title: "([^"]*)", short: "([^"]*)" \}', js):
        out[int(m.group(1))] = {"date": m.group(2), "ready": m.group(3) == "true", "title": m.group(4), "short": m.group(5)}
    return out


def refs(text):
    return re.sub(r"\[\[(\d+)\]\]", r'<sup class="ref"><a href="#src-\1">\1</a></sup>', text)


def route(on, note):
    parts = []
    for i, (step, name, role, svg) in enumerate(NODES, 1):
        cls = "stage on" if i in on else "stage"
        parts.append(f'    <div class="{cls}"><div class="node">{svg}</div><small>{step}</small><b>{name}</b><span>{role}</span></div>')
    return ('<section class="map card" aria-labelledby="map-h">\n  <h2 id="map-h">冒険ルート(工程地図)</h2>\n  <div class="route">\n'
            + "\n".join(parts) + f"\n  </div>\n  <p>{note}</p>\n</section>")


def build(n, sched, tpl):
    nn = f"{n:02d}"
    meta = json.load(open(os.path.join(ROOT, f".koza/src/{nn}.json"), encoding="utf-8"))
    body = open(os.path.join(ROOT, f".koza/src/{nn}.body.html"), encoding="utf-8").read().strip()
    s = sched[n]
    prev, nxt = sched.get(n - 1), sched.get(n + 1)

    body = refs(body).replace("<!--ROUTE-->", route(meta["route_on"], meta["route_note"]))
    srcs = "\n".join(f'    <li id="src-{i}"><a href="{html.escape(u)}">{html.escape(l)}</a></li>' for i, (l, u) in enumerate(meta["sources"], 1))
    pct = f"{n / 15 * 100:.1f}"
    prev_html = (f'<a href="{n - 1:02d}.html"><small>← もどる</small><b>STAGE {n - 1} {html.escape(prev["short"])}</b></a>'
                 if prev else f'<a href="{BASE}"><small>← もどる</small><b>ワールドマップ</b></a>')
    if nxt:
        md = "/".join(str(int(x)) for x in nxt["date"].split("-")[1:])
        next_html = f'<div class="next soon" data-next="{n + 1}"><small>NEXT STAGE · {md} 公開</small><b>STAGE {n + 1} {html.escape(nxt["short"])}</b></div>'
    else:
        next_html = '<div class="next soon"><small>次の冒険</small><b>情報検索(IR)の教科書と特許へ</b></div>'

    wrap = f"""
<nav class="topnav" aria-label="講座内の移動">
  <a class="pill-btn" href="{BASE}">← ワールドマップ</a>
  <div class="progress"><span>STAGE {n} / 15</span><div class="bar" role="img" aria-label="15ステージ中{n}ステージ目"><i style="width:{pct}%"></i></div></div>
</nav>

<header class="hero">
  <span class="world">{meta["world"]}</span>
  <h1>{html.escape(s["title"])}</h1>
  <div class="chips"><span>所要 15分</span><span>チェックポイント {len(meta["quiz"])}問</span><span>全問正解でクリアメダル</span></div>
  <div class="dates">公開日 <span data-koza-pub>{s["date"]}</span> · 出典確認日 {meta["checked"]}</div>
</header>

<div class="legend">
  <span><span class="tag official">公式の説明</span> Googleの公式ページに書かれていることだけ</span>
  <span><span class="tag practice">攻略メモ</span> 実務での解釈(Googleの公式見解ではありません)</span>
  <span>本文の小さな番号は、ページ下の出典へのリンクです。「深掘り」は開いて読む補足です。</span>
</div>

{body}

<section aria-labelledby="quiz-h">
  <div class="quiz-head">
    <h2 id="quiz-h">チェックポイント</h2>
    <div class="stars" id="stars" role="img" aria-label="正解数"></div>
  </div>
  <p class="meta">4択{len(meta["quiz"])}問。全問正解でステージクリアです。</p>
  <div class="quiz" id="quiz"></div>
  <div class="score card pop" id="score" hidden>
    <svg class="medal" viewBox="0 0 96 96" aria-hidden="true">
      <path class="ribbon" stroke-width="3" d="M30 6h14l8 30H38zM52 6h14L58 36H44z"/>
      <circle class="disc" id="medal-disc" cx="48" cy="60" r="30" stroke-width="3"/>
      <path class="mark" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M36 60l8 8 16-16"/>
    </svg>
    <div class="big" id="score-big"></div>
    <div class="meta" id="score-msg"></div>
    <button type="button" class="retry" id="retry">もう一度挑戦する</button>
  </div>
</section>

<section class="sources" aria-labelledby="src-h">
  <h2 id="src-h">出典一覧</h2>
  <p class="meta">{meta["sources_note"]}</p>
  <ol>
{srcs}
  </ol>
</section>

<nav class="pager" aria-label="前後のステージ">
  {prev_html}
  {next_html}
</nav>
"""
    out = tpl
    out = re.sub(r'<html lang="ja" data-stage="\d+">', f'<html lang="ja" data-stage="{n}">', out)
    out = re.sub(r"<title>[^<]*</title>", f"<title>SEO仕組み講座 第{n}回</title>", out)
    desc = html.escape(meta["description"], quote=True)
    out = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + desc, out)
    out = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m.group(1) + desc, out)
    out = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + html.escape(f'SEO仕組み講座 第{n}回|{s["title"]}', quote=True), out)
    out = re.sub(r'(<meta property="og:url" content=")[^"]*', lambda m: m.group(1) + f"{BASE}lessons/{nn}.html", out)
    out = re.sub(r'<div class="wrap">.*?\n</div>\n\n<button type="button" class="backq"',
                 lambda m: '<div class="wrap">\n' + wrap + '\n</div>\n\n<button type="button" class="backq"', out, count=1, flags=re.S)
    qjs = "var Q=" + json.dumps(meta["quiz"], ensure_ascii=False, indent=1) + ";"
    out = re.sub(r"var Q=\[.*?\n  \];", lambda m: qjs, out, count=1, flags=re.S)
    out = out.replace("STAGE 1 クリア!", f"STAGE {n} クリア!")

    # 検証
    ids = set(re.findall(r'id="([^"]+)"', out))
    missing = {h for h in re.findall(r'href="#([^"]+)"', out) if not h.endswith("-")} - ids  # "#src-"+k はクイズJSの組み立て
    for i, q in enumerate(meta["quiz"], 1):
        assert len(q["o"]) == 4 and 0 <= q["a"] < 4, (n, i, "options")
        assert q["g"] in ids, (n, i, "guide id missing", q["g"])
        for k in q["s"]:
            assert 1 <= k <= len(meta["sources"]), (n, i, "source", k)
        if q["g"] in ids:
            ctx = out.split(f'id="{q["g"]}"')[0]
            assert ctx.rfind("<details") <= ctx.rfind("</details>"), (n, i, "guide target is inside 深掘り", q["g"])
    assert not missing, (n, "broken anchors", missing)
    assert 'name="robots" content="noindex"' in out, (n, "noindex")
    assert f'data-stage="{n}"' in out and "../assets/schedule.js" in out, (n, "schedule hook")
    open(os.path.join(ROOT, f"lessons/{nn}.html"), "w", encoding="utf-8").write(out)
    print(f"built lessons/{nn}.html ({len(out)} bytes)")


if __name__ == "__main__":
    sched = load_schedule()
    tpl = open(os.path.join(ROOT, "lessons/01.html"), encoding="utf-8").read()
    for a in sys.argv[1:]:
        build(int(a), sched, tpl)
