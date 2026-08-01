GITHUB=https://github.com/kwaka1208/radio/

# このプロジェクトは pnpm 管理（pnpm-lock.yaml / packageManager）。
# npm を使うと lockfile を無視し peer 依存でエラーになるため pnpm を使う。
# corepack は Node に同梱されており、pnpm 未インストール環境でも動く。
PNPM=corepack pnpm

.PHONY: github serve build preview install release

github:
	open $(GITHUB)

# Astroサーバー起動（開発）
serve:
	$(PNPM) dev

# Astroビルド（静的サイトを dist/ に生成）
# GA を有効にするには PUBLIC_GA_ID=G-XXXXXXXXXX を環境変数で渡す
build:
	$(PNPM) build

# Astroプレビュー（ビルド後に起動）
preview: build
	$(PNPM) preview

# 依存関係のインストール
install:
	$(PNPM) install

# ビルド後にサイトを同期
# 注意: --delete は「dist に無いリモートのファイルを削除」する。
# 音声はサーバー上の dist/episodes/ に置くため、ビルド成果物に含まれない。
# --exclude='episodes/' で削除から必ず保護すること（外すと音声が消える）。
release: build
	rsync -avz --delete --exclude='docs/' --exclude='episodes/' ./dist/ pote2@pote2.sakura.ne.jp:/home/pote2/www/radio/dist/
