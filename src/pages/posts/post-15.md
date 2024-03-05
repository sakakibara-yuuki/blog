---
layout: ../../layouts/MarkdownPostLayout.astro
title: "linuxの基本コマンド  ~~以外と知らないコマンドたち~~"
author: "sakakibara"
description: "linuxの基本コマンド ~~以外と知らないコマンドたち~~"
image:
    url: "https://do-zan.com/wp-content/uploads/2016/01/3da5b3c3e6b5dd7d078bbc5705b88b9f.png"
    alt: "terminalの画像"
pubDate: 2024-03-04
tags: ["linux", "コマンド"]
---


# linxuの基本コマンド
linuxにはPOSIXに準拠してるコマンドを中心に様々なコマンドがある。
その中でもかなり使用頻度が高いと思われるものが以下だ。  
manを読めば良くない？  
そういう意見もあるだろう。
だが、基礎的の中でも以外と見落としがちなオプションもあると思う。
そういった以外なオプションも併せて紹介していこうと思う。

#### cd    : change directory : ディレクトリを移動する。
世界でもっともタイプされた2文字だと思う。
``` zsh title="zsh" 
cd -
cd [-L|-P] [directory]
```
- `cd -`  
- `cd -L directory`  
- `cd -P directory`  

`cd direcoty`は作業ディレクトリを`directory`に移動する。

| command           | description                                                                                  |
|:------------------|:----------------------------------------------------------------------------------------------|
| `cd -`  | 直前にいたディレクトリに移動する。直前にいたディレクトリはOLDPWDという環境変数に格納される。 |
| `cd -L directory` | direcotyがシンボリックリンクの場合、実態に移動する。                                         |
| `cd -P directory` | direcotyがシンボリックリンクの場合、そのディレクトリへ移動する。                             |

`cd -`を知らない人は以外といるのではないだろうか？
少し違うが、`popd, pushd`というコマンドがある。
これは移動したディレクトリをスタックに貯めるというものである。
昔このコマンドを使おうと考えていた時期があったが、実際、4文字のコマンドを打つ苦痛がやる気を上回り、使うことをやめてしまった。

#### pwd   : print working directory : 作業ディレクトリを表示する。
いまどこ？
``` sh
pwd [option]
```
- `pwd -L`
- `pwd -P`

カレントディレクトリ・作業ディレクトリをprintする。

| command  | description                |
|:---------|:---------------------------|
| `pwd -L` | 環境変数PWDを使用する。    |
| `pwd -P` | シンボリックリンクを除く。 |

PWDはカレントディレクトリのパスが格納された環境変数である。  
ディレクトリA, B, C, Dがあるとする。Cの下にDがあり、そのファイルにシンボリックリンクEが貼られているとする。

``` sh
A
├── B
├── C
│   └── D
└── E -> C/D
```
この場合Eを経由してCへ移動するとする。その場合のPWD(pwd)は
```
A/E
```
となる。
ここで`pwd -P`とすると、
```
A/C/D
```
となる。

#### ls    : list : ファイル・ディレクトリの要素を表示する。
世界でもっともタイプされた2文字だと思う。
``` sh
ls [options] [file]
```
- `ls -a`
- `ls -l`

オプションが多すぎる。lsを読まなければプログラマを名乗るべきではないという考えがある。実は以外と実装するのが難しいコマンドとしても知られている。

| command     | description                                         |
|:------------|:----------------------------------------------------|
| `ls -a`     | all、つまりすべて表示する。隠しファイルも表示する。 |
| `ls -l`     | long,  多くの情報を表示する                         |
| `ls --hide` | パターンマッチしたファイルは表示しない。            |

オプションが多すぎてすべてを追うのは難しい。この２つをよく利用する。とは言っても、オプションを指定しているわけではなく、linuxディストリビューションによっては`la=ls -a`, `ll=ls -l`のようにaliasが指定されてある。なお、`--color`というオプション
もあり、これを指定することで色がつき、テンションが上がる。

#### mkdir : make directory : ディレクトリを作成する。
``` sh
mkdir [option] directory
```

- `mkdir -p directory`
- `mkdir -m directory`

意外と`-p`コマンドを使用する。

| command              | description                                                        |
|:---------------------|:-------------------------------------------------------------------|
| `mkdir -p directory` | 作成したいディレクトリの親のディレクトリが存在しなければ作成する。 |
| `mkdir -m directory` | 作成と同時にfile modeを設定する。                                  |

#### rmdir : remove direcotry : ディレクトリを削除する。
じつはこれに近いコマンドがMS-DOSにも実装されている。
``` sh
rmdir [option] directory
```
- `rmdir -p`

ディレクトリを削除します。空ならね。

| command    | description                                                          |
|:-----------|:---------------------------------------------------------------------|
| `rmdir -p` | 親のディレクトリまで削除します。`rmdir -p a/b` は`rmdir a/b a`と同じ |

実際にはディレクトリの中にファイルが入っているまま削除する場合が多いため、このコマンドはほとんど使用しない。  
本当は中身を削除して、ディレクトリが空であることを確認した上でrmdirで削除したほうが安全なのかもしれない。

#### cat   : concatenate files : ファイルを連結する。  
おや？と思った方も多いだろう。
catコマンドというとファイルの中身を見るコマンドとして知られるからだ。
``` sh
cat [option] [file]
```


#### more  : more display : もっと表示する。
#### less  : opposite more : ちょっと表示する。
#### tail  : dispaly last file : ファイルの尻尾だけ見せる。 
#### touch : update timestamp : タイムスタンプを更新する。
これもおや？とおもった人がいるのではないだろうか？
touchコマンドを新しいファイルを作成するコマンドと思っている人も多いだろう。

###### ここまでやる
#### rm    : remove file or directory : ファイル or ディレクトリを削除する。
#### mv    : move file : ファイルを移動(名前の変更)をする。
#### cp    : copy file or direcotry : ファイルをコピーする。
#### ln    : make link file : リンクを作成する。
#### find  : find file : ファイルを探す。
#### chmod : change mode : mode を変更する。
#### chown : change ownership : ownershipを変更する。
#### ps : show processes : プロセスを見る。
topと同じ
#### kill : kill processes : プロセスを殺す。

### 参考
- [［改訂第3版］Linuxコマンドポケットリファレンス](https://www.amazon.co.jp/%EF%BC%BB%E6%94%B9%E8%A8%82%E7%AC%AC3%E7%89%88%EF%BC%BDLinux%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%83%9D%E3%82%B1%E3%83%83%E3%83%88%E3%83%AA%E3%83%95%E3%82%A1%E3%83%AC%E3%83%B3%E3%82%B9-%E6%B2%93%E5%90%8D-%E4%BA%AE%E5%85%B8/dp/4774174041/ref=pd_bxgy_img_d_sccl_2/357-3659538-7720555?pd_rd_w=89tMa&content-id=amzn1.sym.a6ef8710-f9e8-4ae9-bcba-322dc294eed3&pf_rd_p=a6ef8710-f9e8-4ae9-bcba-322dc294eed3&pf_rd_r=57BBVJE6CARFCW585QWQ&pd_rd_wg=0eC5L&pd_rd_r=fcbf9584-b63d-4c65-9191-c4b49cf52306&pd_rd_i=4774174041&psc=1)
- [POSIX準拠とは本当はどういうことなのか？「POSIXで規定されたものだけを使う」ではありません](https://qiita.com/ko1nksm/items/08228276ce9335592989)
- [POSIX C言語API一覧とコマンド一覧の調べ方](https://qiita.com/ko1nksm/items/18787925a7821e1d5d74)
