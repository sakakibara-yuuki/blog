---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Arch linux手術室"
author: "sakakibara"
description: "Arch linux小説です。"
image:
    url: "https://cdn.icon-icons.com/icons2/2699/PNG/512/archlinux_logo_icon_167835.png"
    alt: "Arch linux logo"
pubDate: 2024-03-04
tags: ["astro", "公開学習", "コミュニティ"]
---

# 手術中
心臓が汗をかく。  
部屋は暗いが眼の前のディスプレイがやたら眩しい。  

"練習通りにいってくれ。"

汚い字で書かれたメモを見ながら、慎重にパーティションを切り分ける。  

1つのタイプミスが命取りになる。  
カーソルの点滅に心臓の鼓動が追いつく。  
呼吸を殺し、指先に意識を移し、暗闇の中で輝く文字だけを見つめる。  
Enterに小指をかけた直前、あの日々を思い出した。

### UEFI or BIOS
```bash title='UEFI or BIOS'
cat /sys/firmware/efi/fw_platform_size
```

linuxがどのように起動するか。  
電源を入れると、マザーボードのROMに書き込まれた起動ファームウェアが実行される。  
起動ファームウェアは大きく分けて2つ。  
BIOSとUEIFだ。

端的に言ってしまえばBIOSの方が古くてUEFIの方が新しい。  
なので最近のPCはUEFIを採用している。

自分が使用する起動ファームウェアがどちらを採用しているかによって今後のインストール手順が大きく変わる。

また、linuxのインストールはインストールメディアとインストール先のブロックデバイスが必要になる。

このコマンドを含め、明示されるまでは暗黙のうちにインストールメディアのlinuxのコマンドを入力していることに注意する。

### Can you use your network ?
```bash title='can you use network?'
ip link
ping archlinux.jp
```

このあとの工程でインストールメディアから様々なパッケージをダウンロードする。
そのため、インターネットに接続されていることは必須となる。

`ip link` コマンドはlinuxが認識しているネットワークデバイスを表示するコマンドである。
注意することとして、これにeth0のような表示あったからと言って、それはインターネットに接続している確認にはならない。
あくまで接続されているデバイスを表示するだけなのだ。

`ping archlinux.jp`コマンドはarchlinux.jpへデータを送信し、応答を表示するコマンドだ。
`ping`コマンド

### Block devise
