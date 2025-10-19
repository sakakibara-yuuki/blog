---
title: 'orm'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2025-10-06
tags: ["astro", "math"]
---

# Introduction
## Contents
## Fix Task
## Section1
TypescriptからDBを操作する際、SQLインジェクションや入力データのvalidationを行いやすくなるため、ORMを使うことが多い。

2025年10月TypeScriptには大きく4つの主流なORMが存在する。

- Prisma
- TypeORM
- Sequelize

これらについて、それぞれどんな特徴があるのかを調査していく。

## Prisma (43.9k stars @2025/10/06 . created at 9 years ago)

ここで挙げたものの中で最もgithub のstarを稼いでおり、最も活発に開発が行われているナウいORMである。
[npm-trends](https://npmtrends.com/prisma-vs-sequelize-vs-typeorm)を見ると2024年中頃から急激に人気が上昇していることがわかる。現在は独走状態である。最新の開発を使うならこれ。

主なアピールポイントは3つ
- Prisma schemaと呼ばれる独自のDSLを用いて、DBのスキーマを定義する。これが読見やすく、DBの管理を容易にしている肝らしい。
- Prisma Clientと呼ばれるquery builder
- Prismaの型チェックと自動補完の機能を損なうこと無く、SQLを直接実行できる。というのもPrisma Clientはコンパイル時にtype-checkされたraw SQL queryを書き込むから。

といってもイマイチよくイメージが掴めない。
そこで[Getting Started](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql)をやってみる。

基本的な手順はtscを使える環境を用意して`prisma`をinstallすると
```bash
npm init -y
npm install prisma typescript tsx @types/node --save-dev
npx tsc --init
```
`prisma` cliを使用できるようになる。
```bash
npx prisma
```
では早速使ってみよう。
```bash
npx prisma init --datasource-provider postgresql --output ../generated/prisma
```
コマンドの意味はcliのhelpを見てみればわかる。が、少しだけ補足しよう。
`npx init`を実行すると`prisma`ディレクトリが作成され、その中に`schema.prisma`が生成される。

before
```bash
~/orm/hello-prisma ❯ tree --gitignore
.
├── package.json
├── package-lock.json
└── tsconfig.json
```
after
```bash
~/orm/hello-prisma ❯ tree --gitignore
.
├── package.json
├── package-lock.json
├── prisma
│   └── schema.prisma
└── tsconfig.json
```
この中を見てみよう。

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
> なお、prismaのLSPは[vim-prisma](https://github.com/prisma/vim-prisma)を使用すると良い。

`generator client`はPrisma Clientを生成するための設定で, Prisma Clientはcliで`output`オプションで指定したディレクトリに生成されることがわかる。とうか`root`からのパスじゃなくて`schema.prisma`からの相対パスなんだね。
内容は見ての通りって感じ.
`URL`の書き方は[connection URL](https://www.prisma.io/docs/orm/reference/connection-urls)を参照。と言っても標準的なフォーマット。

`Prisma Migrate`を使うために`schema.prisma`にモデルを定義していこう。
```
model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String   @db.VarChar(255)
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  user   User    @relation(fields: [userId], references: [id])
  userId Int     @unique
}

model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  posts   Post[]
  profile Profile?
}
```
@idは主キー, @defaultはデフォルト値, @updatedAtは更新時に自動的に現在時刻をセットする, @db.VarChar(255)はDBの型を指定, ?はnullable, @relationはリレーションシップを定義, @uniqueは一意制約を表す。

@relationが少し複雑なので補足しよう。
@relationの`fields`はこのモデルの外部キー, `references`は参照先のモデルの主キーを指定する。
例えば、`Post`モデルの`author`フィールドは`User`モデルとのリレーションを表し、`authorId`フィールドが外部キーで、`User`モデルの`id`フィールドを参照している。

実際に反映してみる。
```bash
npx prisma migrate dev --name init
```
このコマンドについても補足しよう。
- dev: prisma schemの変更を検出し、migrationを作成し、DBに適用する。
- --name: migrationの名前を定める。

```bash
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "postgres", schema "public" at "localhost:5432"

Applying migration `20251006152820_init`

The following migration(s) have been created and applied from new schema changes:

prisma/migrations/
  └─ 20251006152820_init/
    └─ migration.sql

Your database is now in sync with your schema.

Running generate... (Use --skip-generate to skip the generators)

✔ Generated Prisma Client (v6.16.3) to ./generated/prisma in 26ms
```

```bash
~/pro/m/manj_web/orm/hello-prisma ❯ tree --gitignore
.
├── generated
├── package.json
├── package-lock.json
├── prisma
│   ├── migrations
│   │   ├── 20251006152820_init
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
└── tsconfig.json
```
実際に、migrationファイルが`prisma/migrations/202510061528020_init/migration.sql`に作成されている。
また、その名前もinitに鳴っている。`migration.sql`の中身を見てみると...

```sql
-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "bio" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

うまく作成されている。
しれっとindexも作成されている。
また、`generated`も作成され、中身を見てみると
```bash
~/project/manj-project/manj_web/orm/hello-prisma ❯ tree generated
generated
└── prisma
    ├── client.d.ts
    ├── client.js
    ├── default.d.ts
    ├── default.js
    ├── edge.d.ts
    ├── edge.js
    ├── index-browser.js
    ├── index.d.ts
    ├── index.js
    ├── libquery_engine-debian-openssl-3.0.x.so.node
    ├── package.json
    ├── query_engine_bg.js
    ├── query_engine_bg.wasm
    ├── runtime
    │   ├── edge-esm.js
    │   ├── edge.js
    │   ├── index-browser.d.ts
    │   ├── index-browser.js
    │   ├── library.d.ts
    │   ├── library.js
    │   ├── react-native.js
    │   ├── wasm-compiler-edge.js
    │   └── wasm-engine-edge.js
    ├── schema.prisma
    ├── wasm.d.ts
    ├── wasm-edge-light-loader.mjs
    ├── wasm.js
    └── wasm-worker-loader.mjs
```
のようにPrisma Clientが確かに作成されている。
また、dbも
```sql
postgres-# \d
                 List of relations
 Schema |        Name        |   Type   |  Owner
--------+--------------------+----------+----------
 public | Post               | table    | postgres
 public | Post_id_seq        | sequence | postgres
 public | Profile            | table    | postgres
 public | Profile_id_seq     | sequence | postgres
 public | User               | table    | postgres
 public | User_id_seq        | sequence | postgres
 public | _prisma_migrations | table    | postgres
(7 rows)
```
のようにちゃんとテーブルもindexも作成されている。
`migration`コマンドは
1. SQL migrationファイルを生成
2. それをDBに適用 (その過程でおそらく`Prisma Client`も生成している)

を実行するコマンドであることがわかる。

だいたいわかってきたので、今度はいよいよ`Prisma Client`を使ってみよう。
では、`@prisma\client`をimportしよう。
```bash
npm install @prisma/client
npx prisma generate
```
なお、先程`migrate`コマンドを実行した際に`generate`も実行されているのworking directoryの中身は変わらない。
`prism generate`コマンドはPrisma schemaを読んで、Prisma Clientを生成するコマンドである。

ちょっと意味がわからないかもしれない。
`generate`して`generated`ディレクトリが更新されたのになぜわざわざ`@prisma/client`をinstallするのか。

まず、`generate`するとPrisma schemaに合うように`prisma`ディレクトリの中身が更新される。これは、Prisma Schemaを変更したときはいつでもprisma clientをupdateする必要があることを意味する。これを実現するのが`generate`である。
また、Prisma schemaを変更したときは常にdatabase schemaを`migrate`か`db push`を使って更新する必要がある。これによってdatabase schemaとPrisma schemaが同期される。
これらのコマンドの背後では`prisma generate`が実行されている。

そして、`node_modules/@prisma/client`は`prisma`ディレクトリの中身が更新されたときに同時に更新される。
そして、`@prisma/client`をinstallすることで、Prisma Clientをプロジェクト内でimportして使用できるようになる。

では`PrismaClient`をimportして使ってみよう。

```typescript
// index.ts
import { PrismaClient } from './generated/prisma'

const prisma = new PrismaClient()

async function main() { }

main().then(
  async () => {
    await prisma.$disconnect()
  }).catch(
    async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
```
これは雛形である。main関数の中でPrisma Clientを使って、main関数の終了後にDBとの接続を切断している。
`$disconnect`は非同期関数なので、`await`している。


> なお、ここでtypescriptのLSPからいくつかimport文に関する警告がでると思う。
> tsconfig.jsonを変更することで解決できる。
> まずはtsconfig.jsonについて書かれている[公式ドキュメント](https://www.typescriptlang.org/docs/handbook/modules/guides/choosing-compiler-options.html#im-using-a-bundler)を見てほしい。
> 自分は[`tsx`](https://tsx.is/typescript)を使っていたので, bundlerを使っているのと同じように設定した。bundlerを使っている場合は`"type": "module"`を指定する**べきではない**とあることに注意しよう。`package.json`から`"type": "module"`を削除した。
> しかし、警告が消えなかったので、[`tsx`](https://tsx.is/typescript)のドキュメントにあるtsconfig.jsonの設定を参考にした。
> また、processを使うために`"type": ["node"]`も追加した。

また、
```typescript
async function main() {
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
      posts: {
        create: { title: 'Hello World' },
      },
      profile: {
        create: { bio: 'I like turtles' },
      },
    },
  })

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  })
  console.dir(allUsers, { depth: null })
}
```
のように変更を加え、実行してみると、実際にDBにデータが挿入されていることがわかる。
```bash
~/pro/m/manj_w/o/hello-prisma main !2 ?2 ❯ npx tsx index.ts                       10s
[
  {
    id: 1,
    email: 'alice@prisma.io',
    name: 'Alice',
    posts: [
      {
        id: 1,
        createdAt: 2025-10-06T21:06:03.891Z,
        updatedAt: 2025-10-06T21:06:03.891Z,
        title: 'Hello World',
        content: null,
        published: false,
        authorId: 1
      }
    ],
    profile: { id: 1, bio: 'I like turtles', userId: 1 }
  }
]
```
DBを見てみると
```bash
~/hello-prisma main !2 ?2 ❯ docker compose exec db psql -U postgres -d postgres -c "select * from \"User\""
 id |      email      | name
----+-----------------+-------
  1 | alice@prisma.io | Alice
(1 row)

~/hello-prisma main !2 ?2 ❯ docker compose exec db psql -U postgres -d postgres -c "select * from \"Post\""
 id |        createdAt        |        updatedAt        |    title    | content | published | authorId
----+-------------------------+-------------------------+-------------+---------+-----------+----------
  1 | 2025-10-06 21:06:03.891 | 2025-10-06 21:06:03.891 | Hello World |         | f         |        1
(1 row)

~/hello-prisma main !2 ?2 ❯ docker compose exec db psql -U postgres -d postgres -c "select * from \"Profile\""
 id |      bio       | userId
----+----------------+--------
  1 | I like turtles |      1
(1 row)

```

すばらしいことに気づいただろうか！

新しい`User`を作成すると、同時に新しい`Post`と`Profile`も作成されている。
つまりネストされたqueryが反映されていることがわかる。
もともと`User`モデルは`Post.author` <-> `User.posts`で`Post`につながっていて、`Profile.user` <-> `User.profile`で`Profile`ともつながっているのだった。

そしてuserを取得する際に`include`オプションを使うことで、関連する`Post`と`Profile`も同時に取得できている。

> postgresのテーブル名やカラム名に大文字が含まれる場合、ダブルクォートで囲む必要があることに注意しよう。

しかもallUsersは生成された型のPrisma Clientによって型チェックされているのだ。
nvimで`Shitt`+`K`を押すと型情報が見れる。

ところで、Aliceの`Post`はまだpublishされていない。
```typescript
async function main() {
    const post = await prisma.post.update({
      where: { id: 1 },
      data: { published: true },
    })
}
```
```bash
~/pro/m/manj_web/orm/hello-prisma main !2 ?1 ❯ docker compose exec db psql -U postgres -d postgres -c "select * from \"Post\""
 id |        createdAt        |       updatedAt        |    title    | content | published | authorId
----+-------------------------+------------------------+-------------+---------+-----------+----------
  1 | 2025-10-06 21:06:03.891 | 2025-10-07 05:15:20.79 | Hello World |         | t         |        1
(1 row)
```
やったぜ！！

## TypeORM (35.9k stars @2025/10/06 . created at 9 years ago)

## Sequelize (30.2k stars @2025/10/06 . created at 14 years ago)
