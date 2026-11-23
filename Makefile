GITHUB=https://github.com/kwaka1208/radio/

# このプロジェクトは pnpm 管理（pnpm-lock.yaml / packageManager）。
# npm を使うと lockfile を無視し peer 依存でエラーになるため pnpm を使う。
# corepack は Node に同梱されており、pnpm 未インストール環境でも動く。
PNPM=corepack pnpm

.PHONY: github serve build preview install check deploy deploy-audio deploy-audio-force

github:
	open $(GITHUB)

# Astroサーバー起動（開発）
serve:
	$(PNPM) dev

# Astroビルド（静的サイトを dist/ に生成）
build:
	$(PNPM) build

# Astroプレビュー（ビルド後に起動）
preview: build
	$(PNPM) preview

# 依存関係のインストール
install:
	$(PNPM) install

# デプロイ前チェック（Lint + ユニットテスト）
# 型チェック（astro check）は build 側で実行される。
check:
	$(PNPM) lint
	$(PNPM) test:unit run

# ビルド後にサイトを同期
# 事前に check（Lint + ユニットテスト）を実行し、失敗すればデプロイを止める。
# 注意: --delete は「dist に無いリモートのファイルを削除」する。
# 音声はサーバー上の dist/episodes/ で管理し、ビルド成果物に含めない。
# --exclude='episodes/' で削除から必ず保護すること（外すと音声が消える）。
# 音声のアップロードは deploy-audio で別途行う。
deploy: check build
	rsync -avz --delete --exclude='docs/' --exclude='episodes/' ./dist/ pote2@pote2.sakura.ne.jp:/home/pote2/www/crssrds.jp/radio/dist/

# 音声ファイルをサーバーへアップロード
# public/episodes/ の中身をサーバーの dist/episodes/ へ同期する（追加・更新のみ）。
# --delete は付けない: public/episodes/ に無い既存音声を消さないため。
deploy-audio:
	rsync -avz ./public/episodes/ pote2@pote2.sakura.ne.jp:/home/pote2/www/crssrds.jp/radio/dist/episodes/

# 音声ファイルをサーバーへ強制上書きアップロード
# --ignore-times でサイズ・更新時刻が同じでも必ず再転送し上書きする。
# --delete は付けない: public/episodes/ に無い既存音声は消さない。
deploy-audio-force:
	rsync -avz --ignore-times ./public/episodes/ pote2@pote2.sakura.ne.jp:/home/pote2/www/crssrds.jp/radio/dist/episodes/
