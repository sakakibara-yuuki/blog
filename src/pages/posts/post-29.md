---
layout: ../../layouts/MarkdownPostLayout.astro
title: "XDGと忍者"
author: "sakakibara"
description: "XDGと忍者"
image:
    url: "https://docs.astro.build/assets/rays.webp"
    alt: "Astroの光線のサムネイル。"
pubDate: 2024-03-06
tags: ["XDG", "xdg-ninja", "規格"]
---


## freedesktop.org : XDG
XDGをご存知だろうか。
現在はfreedesktop.orgという名前で、
UNIX系のデスクトップ環境(GNOME, KDE, Xfce etc...)の開発フレームワーク間の差異を見えなくするために設立された団体である。
freedesktop.orgは以前**X Desktop Group** と名乗っていたたためXDGという省略系がよく見られる。

この団体はLinux Standard Baseなどの国際規格に取り込まれることを目指している。

この団体の策定した規格で特に目にするのは**XDG Base directory**であり、主にディレクトリレイアウトに関する内容が含まれている。具体的な仕様は[以下][#XDGの仕様]にある。  
最近ではXDGを意識したアプリケーションが増えたこともあり、XDGで規定された内容を守ることにより、インストール時などに不要な手間をかけなくて済む。

X serverとか古いよな！最近はやっぱwaylandだよな！

freedesktop.org傘下のプロジェクトにはwaylandも含まれるのでwaylandをご使用のあなたもXDGに則ったほうがメリットが多いだろう。

また、今現在、自分の環境がXDGを遵守しているのかについて、気になる方もいるだろう。
忍者に頼めば良い。
アイエー、ニンジャ ナンデ

デスクトップをインストールしたばかりのあなたには[`xdg-user-dires`](#xdg-user-dires)を渡しておこう

## xdg-ninja


## xdg-user-dires

## XDGの仕様
様々な仕様でファイルやファイルフォーマットは運用されている。
この仕様はファイルが配置されるべき相対的なBase directoryをいくつか定義することで、ファイルが見つかるべき場所を定義している。

XDGはその仕様のうちの一つである。
XDGのBase directoryは以下のコンセプトに従って策定されている。

- user固有のデータファイルが書き込まれるBase directoryはただ一つであり、$XDG_DATA_HOMEで定義される。

- user固有の設定ファイルが書き込まれるBase directoryはただ一つであり、$XDG_CONFIG_HOMEで定義される。

- user固有の状態ファイルが書き込まれるBase directoryはただ一つであり、$XDG_STATE_HOMEで定義される。

- user固有の実行ファイルが書き込まれるBase directoryはただ一つであり、環境変数はここでは規定しない。

- データファイルを検索するための優先順位付けされたBase directoryの集合があり、このディレクトリの集合は$XDG_DATA_DIRSで定義される。

- 設定ファイルを検索するための優先順位付けされたBase directoryの集合があり、このディレクトリの集合は$XDG_CONFIG_DIRSで定義される。

- user固有の(必須ではない)キャッシュファイルが置かれるためのただ一つのBase directoryがあり、このディレクトリは$XDG_CACHE_HOMEで定義される。

- user固有の実行時ファイルとその他のファイルオブジェクトが置かれるためのただ一つのBase directoryがあり、このディレクトリは$XDG_RUNTIME_DIRで定義される。

これらの環境変数に設定されるパスは絶対パスである必要があり、
もしこれら環境変数のいずれかに相対パスが見られた場合、そのパスは無効か無視しなくてはならない。

| environment variables | default            | contents               |
|:----------------------|:-------------------|:-----------------------|
| XDG_DATA_HOME         | $HOME/.local       | user固有のデータ       |
| XDG_CONFIG_HOME       | $HOME/.config      | user固有の設定ファイル |
| XDG_STATE_HOME        | $HOME/.local/state | user固有の状態ファイル |
| -                     | $HOME/.local/bin   | user固有の実行ファイル |

基本的には`XDG_STATE_HOME`にはアプリが再起動するまでに永続化する必要がデータが含まれる。ですが、`XDG_STATE_HOME`にはuserが`XDG_DATA_HOME`に保存するまでもないデータ(userにとってそれほど重要でも移植性もない)が含まれることがあります。  
例えば、
- logs, history, 最近仕様したファイルなどの行動履歴に関するファイル
- view, layout, 開いていたファイル, undo history, などの現在の再起動時に再利用するための現在のアプリケーションの状態に関するファイル

※ `$HOME`が部分的にアーキテクチャ固有になります。

| environment variables | default                       | contents                                             |
|:----------------------|:------------------------------|:-----------------------------------------------------|
| XDG_DATA_DIRS         | /usr/local/share/:/usr/share/ | データファイル                                       |
| XDG_CONFIG_DIRS       | /etc/xdg                      | 設定ファイル                                         |
| XDG_CACHE_HOME        | $HOME/.cache                  | キャッシュファイル                                   |
| XDG_RUNTIME_DIR       | -                             | socket, pipeなどのファイルオブジェクト |

XDG_DATA_DIRS内のディレクトリは":"で区切られます。この順序は重要度を表します。  
XDG_CONFIG_DIRS内のディレクトリは":"で区切られます。この順序は重要度を表します。  
また、基本的には先に示したディレクトリがより優先されます。  
例えば、XDG_DATA_HOMEの方がXDG_DATA_DIRSより優先されます。  

XDG_RUNTIME_DIRはソケット、パイプなどをファイルオブジェクトを格納します。
所有権はユーザーであり、アクセス権もユーザーでなければなりません。

また、ディレクトリはローカルファイルシステム上で作成し、このディレクトリのファイルは定期的にクリーアップされる可能性があります。

