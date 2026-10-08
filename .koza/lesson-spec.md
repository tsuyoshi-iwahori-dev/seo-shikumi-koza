# SEO仕組み講座 教材仕様書

予約タスク(下書き作成・朝の公開)が教材を作るときに従う仕様です。
講座はゲームの「探検マップ」の世界観で、各回を STAGE、各週を WORLD と呼びます。

## カリキュラムと出典

各回の出典は、作成のたびに必ずWebFetchで読み直し、その内容だけを根拠にする。

### WORLD 1:Google検索のしくみ
1. 全体像:3つのステージ(クロール→インデックス登録→検索結果の表示)。出典: https://developers.google.com/search/docs/fundamentals/how-search-works?hl=ja
2. クロール:URL検出(リンク・サイトマップ)、Googlebotのクロール判断、robots.txt、レンダリングとJavaScript。出典: how-search-works?hl=ja のクロール節 / https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview?hl=ja / https://developers.google.com/search/docs/crawling-indexing/robots/intro?hl=ja / https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics?hl=ja
3. インデックス①:ページ内容の解析(title・alt等)と、インデックスに登録されない理由、noindex。出典: how-search-works?hl=ja のインデックス登録節 / https://developers.google.com/search/docs/crawling-indexing/block-indexing?hl=ja
4. インデックス②:重複と正規化(クラスタリング→代表ページ選択)、rel=canonical、リダイレクト。出典: https://developers.google.com/search/docs/crawling-indexing/canonicalization?hl=ja / https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=ja / https://developers.google.com/search/docs/crawling-indexing/301-redirects?hl=ja
5. 検索結果の表示:関連性の決まり方(所在地・言語・デバイス)、検索機能の出し分け、インデックス済みでも表示されない理由。出典: how-search-works?hl=ja の検索結果への表示節 / https://developers.google.com/search/docs/appearance/visual-elements-gallery?hl=ja

### WORLD 2:ランキングシステム(出典: https://developers.google.com/search/docs/appearance/ranking-systems-guide?hl=ja)
6. 言葉を理解するAI:BERT、RankBrain、ニューラルマッチング、パッセージランキング、MUM(一般ランキングには未使用)。ページ単位とサイト全体のシグナルの関係も冒頭で扱う。
7. リンク分析とPageRank、オリジナルコンテンツシステム、鮮度システム。追加出典: PageRank原論文 http://infolab.stanford.edu/~backrub/google.html
8. 結果を整えるシステム(重複排除、サイト多様性、完全一致ドメイン)、スパム検出(SpamBrain)、削除に基づく降格、廃止されたシステム(Panda・Penguin・Helpful Content・Hummingbird)。追加出典: https://developers.google.com/search/docs/essentials/spam-policies?hl=ja

### WORLD 3:品質の考え方(出典: https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=ja)
9. ユーザー第一のコンテンツ:コンテンツと品質・専門性に関する自己評価の質問、検索エンジン第一のコンテンツを避ける質問。
10. E-E-A-T・YMYL・品質評価者の役割(評価者データはランキングに直接使われない)、メインコンテンツの4属性(労力・独自性・才能やスキル・正確性)。追加出典: 検索品質評価ガイドライン https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf
11. 誰が・どのように・なぜ(Who/How/Why)、虚偽の著者情報、AI・自動化の開示。

### WORLD 4:SEOスターターガイドと総まとめ(出典: https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ja)
12. Googleに見つけてもらう(site:演算子、リンク、サイトマップ、見え方の一致)とサイトの整理(URL、ディレクトリ、重複コンテンツ)。
13. 興味深く有益なサイト(検索キーワードの予測、リンクとアンカーテキスト、nofollow)、タイトルリンクとスニペット、画像・動画。
14. Googleが重要ではないと考えること(メタキーワード、キーワード乱用、ドメイン名のキーワード、TLD、文字数、サブドメインかサブディレクトリか、PageRankは多数のシグナルの一つ、重複コンテンツはペナルティではない、見出しの数や順序、E-E-A-Tはランキング要因ではない)。
15. FINAL STAGE 総まとめ:第1〜14回の内容を冒険ルートに配置して振り返り、全範囲から10問の総合テスト。出典は第1〜14回のすべて。

## 公開日の決め方

平日のみ公開する。祝日は公開しない(2026年:10/12 スポーツの日、11/3 文化の日、11/23 勤労感謝の日)。

## テンプレート

`lessons/01.html` がテンプレート。`<head>` の構成、CSS、クイズのJavaScript(誤答時のガイド機能と「もどる」ボタンを含む)、HTMLの部品(クラス名)、見出しの呼び名をそのまま使い、中身だけ差し替える。デザインは変えない。第2回以降は直前の回も読んで、表現の揃え方を確認する。

## 教材の書き方(lessons/01.html と同じ構成・同じ順番・同じ呼び名)

1. 上部ナビ(.topnav):「← ワールドマップ」(https://tsuyoshi-iwahori-dev.github.io/seo-shikumi-koza/)と「STAGE N / 15」。進捗バーの幅は N÷15 の%(aria-label も合わせる)。
2. ヘッダー(.hero):「WORLD n · 週名」、h1 にその回のテーマ名、chips(所要15分/チェックポイント5問/全問正解でクリアメダル)、「公開日」(公開予定日)と「出典確認日」(作成した日)。その下に凡例(.legend:公式の説明/攻略メモ)。
3. 今日のミッション(.goal):2〜3項目。**各項目は基礎部分(深掘りを開かなくても読める部分)だけで達成できること。**ミッションに必要な内容を深掘りに入れない。
4. 今日の用語ずかん(.glossary の .item):経験の浅いメンバーがつまずきそうな用語を4〜6個(偶数が望ましい)。各定義は出典に基づいて1〜2文、出典番号付き。本文での初出は `<a class="term" href="#g-xxx">` で用語ずかんにリンクする。
5. 冒険ルート(工程地図、.map .route):クロール/インデックス/ランキング/表示の4つのノード(アイコンと役割1行)は第1回と同じ。その回の範囲のノードだけ .stage に .on を付け、下に「今日はどこを通るか」を1〜2文で書く。
6. 本編:トピックごとに「公式の説明」(.block.official)と「攻略メモ」(.block.practice、実務での解釈)を並べる。番号は .topic-head .num。
   - 公式の説明:出典ページに書かれていることだけ。言い換えて書く。出典に書かれていない推測は入れない。
   - 攻略メモ:SEOコンサル実務(canonical設計、内部リンク、Search Consoleの見方、クライアントへの説明など)にどう結びつくか。
   - 深掘り(details.deep):基礎を読み終えた人向けの補足だけ。
7. 今日のおさらい(3行まとめ、.summary):要点を3行。公式の説明に基づく内容。
8. 現場ミッション(.try、「現場ミッション · 5分」):担当サイトなどで5分程度でできる実務課題を1つ、3〜4手順で。
9. チェックポイント(クイズ):4択5問(第15回は10問)。JavaScriptの問題データ(Q配列)と、クリア表示の「STAGE 1 クリア!」の数字だけを差し替える。
   - 各問の s には根拠となる出典番号を入れる。
   - **各問に g(答えが書いてある本文の要素のid)を必ず入れる。**本文側では、答えが書いてある「公式の説明」の段落(p)やリスト(ol/ul)に `id="a-xxx"` を付ける(xxxは内容を表す英単語)。答えの箇所は基礎部分に置き、深掘りの中を指すのは避ける。
   - スター表示・メダル・「もう一度挑戦する」ボタン・「Qnにもどる」ボタンはそのまま残す。
10. 出典一覧(.sources):番号付きリスト `<li id="src-N">`。本文・用語・クイズの出典は `<sup class="ref"><a href="#src-N">N</a></sup>` の番号で示す(毎段落に長いリンクを書かない)。リストの上に出典ページ名と確認日。
11. ページ下のナビ(.pager):左は前のステージへのリンク `<a href="https://tsuyoshi-iwahori-dev.github.io/seo-shikumi-koza/lessons/(N-1).html"><small>← もどる</small><b>STAGE N-1 テーマ短縮名</b></a>`。右は次回予告で、リンクにせず `<div class="next soon"><small>NEXT STAGE · M/D 公開</small><b>STAGE N+1 テーマ短縮名</b></div>`(M/D は次の公開予定日)。最終回の右側は「次の冒険」として、情報検索(IR)の教科書や特許へ進む案内を1〜2行。

- 分量:基礎部分だけで15分で読み切れる量。その回の範囲外の話はしない。ゲーム風の呼び名は見出しとラベルだけに使い、本文は普通の説明文で書く。
- 出典のない主張は書かない。WebFetchで読めなかったページがあれば、凡例の下に「このページは取得できなかったため扱っていません」と明記する。
- `<head>` には必ず `<meta name="robots" content="noindex">` を入れる(全ページnoindexの方針)。OGP(og:title、og:description、og:url、description)はその回の内容に書き換える。og:title は「SEO仕組み講座 第N回|テーマ名」、og:url はその回の lessons/NN.html のURL。
- robots.txt は作らない(クロールを禁止するとnoindexがGoogleに読まれなくなるため)。

## 確認

- クイズのJavaScriptが構文エラーなく動き、全問正解でクリア表示が出ること
- 各問の g のidが本文に存在すること、`href="#..."` のリンク先IDがすべて存在すること
- スマホ幅(390px)で横スクロールが出ないこと
- `<meta name="robots" content="noindex">` が入っていること

## claude.ai(Artifact)での公開

- artifact-design スキルを読み込む。
- GitHub用HTMLから `<!doctype html>`・`<html>`・`<head>`・`<body>` のタグと `<meta>` タグを取り除き、`<title>`・`<link>`・`<style>`・本文・`<script>` だけを残したファイルを作って公開する(リンクはすべて絶対URLなので、そのまま動く)。
- タイトル「SEO仕組み講座 第N回」、icon は "book"、description にはその回のテーマを1文で。

## 公開時にGitHub(main)で行う更新

- `lessons/NN.html` を置く。ヘッダーの「公開日」が実際の公開日と違えば直す。
- 直前の回 `lessons/(N-1).html` のページ下ナビで、右側の次回予告(div.next.soon)を `<a class="next" href="https://tsuyoshi-iwahori-dev.github.io/seo-shikumi-koza/lessons/NN.html"><small>NEXT STAGE →</small><b>STAGE N テーマ短縮名</b></a>` に置き換える。それ以外は変えない。
- `index.html`(ワールドマップ)で今日の回の li を STAGE 1 の行と同じ形にする(class を "locked" から "open" に、タイトルの span を lessons/NN.html へのリンクに、日付を「M/D 公開中」に)。直前の回の日付表示は「M/D 公開」に変える。それ以外(noindexのmetaを含む)とデザインは変えない。
- 1回分のコミットにまとめ(メッセージ例「第N回: テーマ名」)、main ブランチに push する。
