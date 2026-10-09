# SEO仕組み講座 教材仕様書

教材を作るとき(Claudeとのチャットで依頼して作成)と、予約タスク(前日のプレビューDM・朝のチャンネル投稿・週1の更新チェック)が従う仕様です。
講座はゲームの「探検マップ」の世界観で、各回を STAGE、各週を WORLD と呼びます。

## 運用の流れ

- **作成**:Claudeとのチャットで、数回分ずつまとめて作る。`.koza/src/NN.json`(メタ情報・クイズ・出典)と `.koza/src/NN.body.html`(本文)を書き、`python3 .koza/build.py N` で `lessons/NN.html` を生成して main に push する。予約タスクの実行環境からはGitHubに書き込めないため、作成とpushはチャットで行う。
- **公開**:`assets/schedule.js` の日付と `ready` で自動的に切り替わる。公開日の日本時間7:00になると、ページ本文・ワールドマップのリンク・前の回の「NEXT STAGE」リンクが自動で開く。それまでは「準備中」画面。URLに `?preview` を付けると公開前でも確認できる。
- **前日プレビュー(予約タスク・平日15:45)**:翌営業日に公開されるステージのプレビューリンクを本人にDM。
- **チャンネル投稿(予約タスク・平日11:00)**:その日に開放されたステージを `#seo-コンサル_行平` に投稿。
- **保留・延期**:`assets/schedule.js` で該当ステージの `ready` を false にするか日付を変える(チャットで依頼)。下書きDMのスレッドに「待って」と返信すると、朝のチャンネル投稿だけが止まる(ページの開放は止まらない)。
- **選んで調べる(assets/lookup.js)**:本文の言葉を選ぶと小窓が出て、Google AIモード/Claude/Google検索を質問文入力済みの新しいタブで開く。20文字以下は「言葉」、21〜150文字は「文章の意味」として聞く(文章のときはGoogle検索ボタンなし)。テンプレート(lessons/01.html)に入っているので、新しいステージにも自動で入る。

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

## 公開スケジュール

平日の朝に1回ずつ公開する。祝日は公開しない(2026年:10/12 スポーツの日、11/3 文化の日、11/23 勤労感謝の日)。
各STAGEの公開予定日は次の表のとおり。**実際の日付・タイトル・公開可否は `assets/schedule.js` が正**で、この表は参考。日付を変えるときは schedule.js を直す(ページ内の日付表示も schedule.js から自動で入る)。

| STAGE | 公開予定日 | 備考 |
|---|---|---|
| 1 | 2026-10-09(金) | 社内チャンネルへの初回投稿は本人が手動で行う |
| 2 | 2026-10-13(火) | ここからチャンネルへ自動投稿 |
| 3 | 2026-10-14(水) | |
| 4 | 2026-10-15(木) | |
| 5 | 2026-10-16(金) | |
| 6 | 2026-10-19(月) | |
| 7 | 2026-10-20(火) | |
| 8 | 2026-10-21(水) | |
| 9 | 2026-10-22(木) | |
| 10 | 2026-10-23(金) | |
| 11 | 2026-10-26(月) | |
| 12 | 2026-10-27(火) | |
| 13 | 2026-10-28(水) | |
| 14 | 2026-10-29(木) | |
| 15 | 2026-10-30(金) | FINAL STAGE |

教材内の日付(ヘッダーの「公開日」、ページ下の次回予告)は schedule.js から自動で表示されるので、手で書き換えない。

## Slackへの投稿

- 社内チャンネル `#seo-コンサル_行平`(channel_id: C02KJQ78QQH)に、STAGE 2 から朝の公開時に自動投稿する。STAGE 1 は本人が手動で投稿するので、タスクからは投稿しない。
- 下書きの確認連絡と保留の連絡は、本人(Slack user_id: U082Q7DD848)へのDMで行い、チャンネルには投稿しない。
- チャンネル投稿の形式(SEOに詳しくないメンバーも読む前提で、短く):
  1行目「*SEO仕組み講座 STAGE N『テーマ名』* (所要15分)」
  2行目「今日のおさらい:」
  続けて「今日のおさらい」の3行を箇条書き(•)で
  次の行に教材のURL(https://tsuyoshi-iwahori-dev.github.io/seo-shikumi-koza/lessons/NN.html)
  最後の行「チェックポイント(クイズ5問)で全問正解するとクリアです。次回は M/D 公開予定:STAGE N+1『テーマ短縮名』」(最終回は「全15ステージ完走です。おつかれさまでした」に置き換える)

## テンプレート

`lessons/01.html` がテンプレート(build.py がこのファイルの head・CSS・クイズのJavaScriptを使い、ナビ・ヘッダー・冒険ルート・クイズ欄・出典・ページ下ナビを自動で組み立てる)。`<head>` の構成、CSS、クイズのJavaScript(誤答時のガイド機能と「もどる」ボタンを含む)、HTMLの部品(クラス名)、見出しの呼び名をそのまま使い、中身だけ差し替える。デザインは変えない。第2回以降は直前の回も読んで、表現の揃え方を確認する。

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
11. ページ下のナビ(.pager、build.py が自動生成):左は前のステージへのリンク `<a href="https://tsuyoshi-iwahori-dev.github.io/seo-shikumi-koza/lessons/(N-1).html"><small>← もどる</small><b>STAGE N-1 テーマ短縮名</b></a>`。右は次回予告で、リンクにせず `<div class="next soon"><small>NEXT STAGE · M/D 公開</small><b>STAGE N+1 テーマ短縮名</b></div>`(M/D は次の公開予定日)。最終回の右側は「次の冒険」として、情報検索(IR)の教科書や特許へ進む案内を1〜2行。

- 分量:基礎部分だけで15分で読み切れる量。その回の範囲外の話はしない。ゲーム風の呼び名は見出しとラベルだけに使い、本文は普通の説明文で書く。
- 出典のない主張は書かない。WebFetchで読めなかったページがあれば、凡例の下に「このページは取得できなかったため扱っていません」と明記する。
- `<head>` には必ず `<meta name="robots" content="noindex">` を入れる(全ページnoindexの方針)。OGP(og:title、og:description、og:url、description)はその回の内容に書き換える。og:title は「SEO仕組み講座 第N回|テーマ名」、og:url はその回の lessons/NN.html のURL。
- robots.txt は作らない(クロールを禁止するとnoindexがGoogleに読まれなくなるため)。

## 確認

- クイズのJavaScriptが構文エラーなく動き、全問正解でクリア表示が出ること
- 各問の g のidが本文に存在すること、`href="#..."` のリンク先IDがすべて存在すること
- スマホ幅(390px)で横スクロールが出ないこと
- `<meta name="robots" content="noindex">` が入っていること

## 作成時のチェック(build.py が自動で検証する項目)

- 各問の g(答えの箇所のid)が本文に存在し、深掘り(details)の中を指していないこと
- 各問の s(出典番号)が出典一覧の範囲内であること、`href="#..."` のリンク先がすべて存在すること
- `<meta name="robots" content="noindex">` と schedule.js・lookup.js の読み込みが入っていること
- 生成後、ブラウザで公開前/公開後の表示、クイズのクリア、誤答時のガイド、390px幅で横スクロールが出ないことを確認する
