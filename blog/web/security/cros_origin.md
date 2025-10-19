---
title: 'Cross Origin Resource Sharing (CORS)'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2025-07-25
tags: ["astro", "math"]
---

# 同一オリジンポリシーとセキュリティ
webアプリケーションを作る立場に立つと、作成したサービスの中にSNSへのリンクやYouTubeの動画を埋め込むなど、他のサイトのリソースを利用する場面が多くある。
しかし、立場を変えてみれば、自分の作ったサイトやサービスだって他のサイトから利用されることは十分にある。
単純に自分の作ったサイトが他のサイトからリンクが貼られてる程度であれば問題は無いが、悪意のあるサイトに自分のサイトのリソースを利用されると、セキュリティ上の問題が発生する可能性がある。

例えば、自分が作ったサイトが攻撃者のサイトに埋め込まれ(iframe)、悪意のあるJavaScriptが実行されると、攻撃者は自分のサイトにログインしているユーザの情報を盗むことができる。


## Contents
## 
