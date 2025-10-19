---
title: 'AIで作るOpenAPI'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2025-07-24
tags: ["astro", "math"]
---

# Introduction
## Contents
## OpenAPI
作業手順としては
1. やりたいことをPRD(Product Requirements Document)にまとめる。
2. PRDで戦略的分析した内容を基に、C4を作成する。
3. C4を基にOpenAPIの仕様書の作成を行う。
4. OpenAPIの仕様書を基に、APIの実装を行う。

といった形で進める。
すべての工程でLLMと相談しながら進めることになる。

### PRDの内容
PRD主に記述するのは

- 世界の潮流
- イントロと目的
- 誰のため？
- なぜ作るのか？
- 何を作るのか？
 - 競合とインスピレーション元
- モックアップ
 - ユーザーストーリー
 - ドメインの戦略的分析
 - 成果物
 - 仕様要件
 - 実装要件
 - インストール・使用方法
- 技術メモ
 - 基本機能
 - MVP実装の初期スコープ
 - システムの詳しい仕組み
- 初期ユーザーとコンテンツのシード戦略
 - 初期ユーザー像(ペルソナ)
 - 初期ターゲット像(パーソナ)
 - 戦略案
  - Phase1: 技術寄り・信頼できる小規模な発信源
  - Phase2: タスク管理志向の影響力者層へアプローチ
 - 戦略の補完
- 市場投入戦略(Go to Market)
 - 段階的GTMモデル
  - phase1: コミュニティ・インフルエンサーの巻き込み
  - phase2: プロダクト志向のコンテンツ展開
  - phase3: 小規模なHacker News / Indie Hackers投稿
- ローンチ後のマーケティング戦略
 - コンテンツ例
 - 拡張施策
- 将来のアイデア
- 参考資料

などである。
正直、PRDは一から自分で書くのではなく、まずは小さく初めて少しずつ改善してくことが必須である。当然、LLMを使って穴を埋めることも推奨される。
不完全だと思うのはマーケティングと技術に関することが一つのファイルに混在していることだ。自分がマーケティングに関する事柄に無知であることで情報量が多く感じるのかもしれないが、ごちゃごちゃしている印象は否めない。

### C4の内容
C4は、ソフトウェアシステムの構造を視覚的に表現するためのモデルであり、以下の4つのレベルで構成される。
- Context
- Container
- Component
- Code

Contextレベルでは、システムの外部環境や関係者を示し、システムが外部とどのように相互作用を行うかを示す。
Containerレベルでは、システムを構成する主要なコンテナ（アプリケーションやサービスレベル）を示す。ここでのコンテナは仮想化技術のことではない。
Componentレベルでは、各コンテナ内の主要なコンポーネントを示し、Codeレベルでは、具体的なコードの構造やクラス図などを示す。

細かい実装に関してはLLMに任せることになるので、基本的にCodeレベルの詳細は省略されがちである。
ただし、主要なオブジェクト等のデータ構造に関してはCodeレベルで記述してもいいかもしれない。

今回、私はD2というツールを使用してC4を作成した。
D2はmermaidと競合であり、あまりメジャーではないかもしれないが、mermaidよりもシンプルな記法でより表現豊かな図を作成できる。

### OpenAPIの内容
OpenAPIは、APIの仕様を記述するための標準的なフォーマットであり、APIのエンドポイント、リクエストとレスポンスの形式、認証方法などを定義する。
これもLLMにある程度任せることができるが、APIの設計に関しては自分でよくよく調整・修正する必要がある。

一つの`openapi.yaml`ファイルにすべてのAPIを記述することもできるが、APIの数が増えると管理が難しくなるため、APIごとに分割して管理することが推奨される。
自分の場合は
```
docs/api/
├── components.yaml
├── openapi.yaml
└── paths
    ├── ai.yaml
    ├── files.yaml
    ├── health.yaml
    ├── notifications.yaml
    └── tasks.yaml
```
のように単純に`paths`ディレクトリにAPI毎に分割して管理している。
`openapi.yaml`ファイルには
```
paths:
  # Tasks
  /tasks:
    $ref: './paths/tasks.yaml#/tasks'
  /tasks/{task_id}:
    $ref: './paths/tasks.yaml#/tasks_task_id'
  /tasks/status:
    $ref: './paths/tasks.yaml#/tasks_status'

  # Notifications
  /notifications:
    $ref: './paths/notifications.yaml'
```

のように`$ref`を使用して各APIの定義を参照する形で記述する。
この例では`tasks.yaml`ファイルには
```
tasks:
  get:
    ...

tasks_task_id:
  get:
    ...

tasks_status:
  get:
    ...
```
のように記述し、対して`notifications.yaml`ファイルには
```
get:
  ...

post:
  ...
```
のように記述する。
このように分割することで、APIの管理が容易になり、各APIの仕様を個別に更新することができる。

### OpenAPIからAPIの実装へ
OpenAPIの仕様書を基に、APIの実装を行う。
この際、`fastapi`へ実装を行う場合、`fastapi-codegen`を使用することで、OpenAPIの仕様書から自動的にAPIのコードを生成することができる。
```
fastapi-codegen -i openapi.yaml -o src/api
```
このコマンドを実行したいところだが、実はファイル分割されたOpenAPIの仕様書を直接`fastapi-codegen`に渡すことはできない。単一の`openapi.yaml`ファイルを生成する必要がある。
そこで、`rockly`というツールを使う。
```
redocly bundle docs/api/openapi.yaml -o openapi.bundle.yaml
```
のように`openapi.bundle.yaml`ファイルを生成することができる。
この`openapi.bundle.yaml`ファイルを`fastapi-codegen`に渡すことで、APIのコードを生成することができる。
```
fastapi-codegen -i openapi.bundle.yaml -o src/reminderd/api -m schemas.py -d pydantic_v2.BaseModel -p 3.12 -r -t template/moduler
```
outputは`src/reminderd/api`ディレクトリに生成され、その中の`schemas.py`ファイルにはPydanticのモデルが生成される。
`-d`でPydanticのバージョンを指定することができ、`-p`でPythonのバージョンを指定することができる。

domainで使うモデルも同じように生成する。
```
datamodel-codegen --input openapi.bundle.yaml --output-model-type dataclasses.dataclass --output src/reminderd/domain/models.py
```



### OpenAPIのテスト
OpenAPIの仕様書を基に、APIのテストを行う。


## 参照
- [OpenAPI Description Structure](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#openapi-description-structure)
- [AIパフォーマンスの最適化を学ぶ（2）「SOWを作って」は超便利な指示｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/hachi8833/2025_07_10/151922)
- [Introduction to OpenAPI](https://redocly.com/learn/openapi/learning-openapi)
- [OpenAPI ドキュメントを分割し、管理を楽にする｜NAVITIME_Tech](https://note.com/navitime_tech/n/n6cf3581cef1e)
- [AI - Ready API](https://speakerdeck.com/yokawasa/ai-ready-api-designing-mcp-and-apis-in-the-ai-era)

