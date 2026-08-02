# crossradio

[`radio.crssrds.jp`](https://radio.crssrds.jp) で公開しているポッドキャスト
サイトです。エピソードは1回につき1つのMarkdownファイルとしてローカルで管理し、
エピソードページとポッドキャスト用のRSSフィード（`/rss.xml`）の両方をそこから
自動生成します。

## 技術スタック

- **[Astro 7](https://astro.build/)** — 完全な静的サイト生成（サーバー
  アダプターなし）。`dist/` にビルドし、自前サーバーへデプロイします。
- **[Preact](https://preactjs.com/)** — プレイヤーや検索などのインタラクティブ
  コンポーネント
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Viteプラグイン経由
- **[Valibot](https://valibot.dev/)** — 設定ファイルのバリデーション
- パッケージ管理は **pnpm**（`corepack` 経由で実行）

## セットアップ

pnpm は Node 同梱の corepack を使って実行します（PATH に pnpm を入れていなくても
動きます）。

```sh
corepack pnpm install   # 依存関係のインストール（make install でも可）
corepack pnpm dev       # 開発サーバー起動（http://localhost:4321、make serve でも可）
```

主なコマンド:

| コマンド | 内容 |
| --- | --- |
| `corepack pnpm dev` | 開発サーバー（localhost:4321） |
| `corepack pnpm build` | `astro check`（型チェック）→ `astro build` で `dist/` に静的サイト生成 |
| `corepack pnpm lint` / `lint:fix` | ESLint |
| `corepack pnpm test` | Vitest ユニットテスト（単発実行） |
| `make check` | デプロイ前チェック（Lint + ユニットテスト） |

---

## このサイトをクローンして別のポッドキャストサイトを作る

このリポジトリは、そのまま複製して自分のポッドキャストサイトに作り替えられます。
以下の手順で自分の内容に置き換えてください。

### 1. リポジトリを複製する

```sh
git clone <このリポジトリのURL> my-podcast
cd my-podcast
corepack pnpm install
```

### 2. サイト情報を書き換える（`starpod.config.ts`）

番組名・紹介文・ホスト・配信プラットフォームなどはすべて
[`starpod.config.ts`](./starpod.config.ts) にまとまっています。詳細は後述の
[サイト情報の変更](#サイト情報の変更) を参照してください。

### 3. 画像を差し替える

- `public/images/radio.png` — サイト表示用のカバー画像（OGP・ヘッダー・一覧
  サムネイルのフォールバック）
- `public/images/radio-3000.png` — ポッドキャスト配信用のカバーアート
  （RSS の `itunes:image`）。大きめの正方形画像（1400〜3000px）を用意します。
- `src/images/people/` — ホストの顔写真。`starpod.config.ts` の `hosts[].img`
  でファイル名を指定します。
- `public/favicon.svg` などのファビコン類

> ファイル名を変える場合は `starpod.config.ts` の `image` / `itunesImage` /
> `hosts[].img` の指定も合わせて変更してください。

### 4. デプロイ先を自分の環境に変更する（`Makefile`）

[`Makefile`](./Makefile) の先頭にある変数と rsync 先を書き換えます。

```makefile
GITHUB=https://github.com/<あなた>/<リポジトリ>/
PUBLIC_GA_ID=G-XXXXXXXXXX          # Google Analytics を使う場合
```

`release` / `release-audio` ターゲットの rsync 先（`user@host:/path/`）を自分の
サーバーに変更してください。詳細は [ビルドとデプロイ](#ビルドとデプロイ) を参照。

### 5. 環境変数を設定する（任意）

必要に応じて以下を設定します（未設定でも動作します）。

- `PUBLIC_GA_ID` — Google Analytics 4 の測定ID（例: `G-XXXXXXXXXX`）。
  ビルド時に設定されているとGAスニペットが埋め込まれます。
- `STANDARD_SITE_DID` — [standard.site](https://standard.site/) 検証用の
  ATProto DID（例: `did:plc:abc123`）。
- `STANDARD_SITE_PUBLICATION_RKEY` — standard.site の publication レコードキー。

---

## サイト情報の変更

番組全体のメタ情報は [`starpod.config.ts`](./starpod.config.ts) で管理します。
主なフィールドは次のとおりです。

| フィールド | 内容 |
| --- | --- |
| `title` | 番組名（サイト全体とRSSチャンネルのタイトルに使用） |
| `image` | サイト表示用カバー画像のパス |
| `itunesImage` | RSS配信用カバーアート（大きめの正方形画像。省略時は `image`） |
| `type` | 配信形式。各回独立なら `episodic`、連続ものなら `serial` |
| `blurb` | ごく短いキャッチコピー（1文程度） |
| `description` | 番組説明（2〜4文程度） |
| `email` | 番組の連絡先メール。RSSの `itunes:owner` に出力され、**フィードで一般公開されます**（Amazon Music 等が所有者確認に使用） |
| `categories` | Apple Podcasts のカテゴリ。先頭がプライマリ（必須）。Apple の正式名称をそのまま指定 |
| `hosts` | ホスト一覧（`name` / `bio` / `img` / 任意で `github` / `twitter` / `website`） |
| `platforms` | 配信先リンク（`apple` / `appleIdNumber` / `amazon` / `spotify` / `youtube` / `overcast` / `pocketCasts`） |
| `rssFeed` | 公開するRSSフィードのURL |

設定は `defineStarpodConfig()` で型チェック・バリデーションされます。

---

## コンテンツ（エピソード）の追加

### 1. エピソードのMarkdownを作成する

`src/content/episodes/` に1エピソード＝1ファイルでMarkdownを追加します。
ファイル名は任意ですが、エピソード番号（例: `1.md`）にしておくと分かりやすいです。

```markdown
---
title: Podcast復活します
episodeNumber: 1
published: 2026-08-01
audio: ep001.m4a
duration: 650
description: Podcastをまたはじめます
---
ここに本文（ショーノート）をMarkdownで書きます。
```

frontmatter のフィールド:

| フィールド | 必須 | 内容 |
| --- | --- | --- |
| `title` | ✅ | エピソードのタイトル |
| `episodeNumber` | ✅ | エピソード番号（正の整数） |
| `published` | ✅ | 公開日（`YYYY-MM-DD`） |
| `audio` | ✅ | 音声ファイル名（サーバー上の `/episodes/` 配下。例: `ep001.m4a`） |
| `duration` | ✅ | 再生時間（秒） |
| `description` | ✅ | 一覧・メタタグ・フィード用の短い説明文 |
| `audioType` | | 音声のMIMEタイプ（既定: `audio/mpeg`） |
| `audioBytes` | | 音声のバイト数（RSSの enclosure 用。不明なら `0`） |
| `slug` | | URLスラッグ（省略時はエピソード番号） |
| `episodeImage` | | エピソード個別のアートワークURL（省略時は番組画像） |
| `episodeType` | | `full`（既定）/ `trailer` / `bonus` |
| `draft` | | `true` で下書き（公開されません） |

本文（frontmatter より下）がショーノートとして各エピソードページに表示されます。

### 2. 音声ファイルを配置する

**音声ファイルはリポジトリには含めません。** サーバー上の `dist/episodes/`
ディレクトリで管理します。アップロード用に `public/episodes/` に音声を置いておき、
`make release-audio` でサーバーへ同期します（後述）。

### 3. トランスクリプト（任意）

`src/content/transcripts/` にエピソード番号を名前にしたMarkdownを置くと、
エピソードページにトランスクリプトが表示されます。本文中の `[HH:MM:SS]` 形式の
タイムスタンプはクリック可能になり、プレイヤーを該当位置にシークします。

> トランスクリプトのタイムスタンプ処理（rehypeプラグイン）を変更した場合は、
> Astroのコンテンツレンダーキャッシュの都合で **開発サーバーの再起動が必要** です。

---

## ビルドとデプロイ

このサイトは完全な静的サイトとして `dist/` にビルドし、rsync で自前サーバーへ
同期してデプロイします。`Makefile` に一連の操作をまとめています。

```sh
make check          # Lint + ユニットテスト（デプロイ前チェック）
make build          # dist/ に静的サイトを生成（PUBLIC_GA_ID を渡してGA有効化）
make release        # check → build のあと dist/ をサーバーへ rsync
make release-audio  # public/episodes/ の音声をサーバーへアップロード
```

> **⚠️ 注意:** `make release` の rsync は `--delete` 付きで「dist に無い
> リモートのファイルを削除」します。音声はサーバー上の `dist/episodes/` で
> 管理しているため、`--exclude='episodes/'` で削除から保護しています。
> この除外を外すと**サーバー上の音声がすべて消える**ので注意してください。
> 音声のアップロードは `make release-audio` で別途行います。

---

## ライセンス・クレジット

このサイトは [Starpod](https://github.com/shipshapecode/starpod)
（ポッドキャストサイトジェネレーター）をベースにしています。

[MITライセンス](https://opensource.org/licenses/MIT) で公開されています。
