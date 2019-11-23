# はじめに

Google製のChrome拡張機能「Personal Blocklist」が動かなくなったので、自分で作った
拡張機能。

https://chrome.google.com/webstore/detail/cbbbhelcpfjhdcncigdlkabmjbgokmpg/publish-delayed?hl=ja

2018年の10月~11月あたりに作成。

# 本家Personal Blocklistとの違い

基本的な機能は本家と同じだが、以下の点が異なる。

## サブドメインを個別にブロックできるようにした

amebloやlivedoorブログなどのサブドメイン型のブログサービスに関しては、ブログ毎にブロックをできるようにした。

サブドメイン毎にブロックできるサービスは、以下の通り。

  "blog.livedoor.jp",
　"plaza.rakuten.co.jp",
　"ameblo.jp",
　"blogs.yahoo.co.jp",
  "blog.goo.ne.jp",
　"d.hatena.ne.jp",
　"lineblog.me",
　"note.mu",
  "qiita.com"
