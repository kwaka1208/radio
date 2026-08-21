import { defineStarpodConfig } from 'src/utils/config';

export default defineStarpodConfig({
  // TODO: 番組名・カバー画像・紹介文はご自身の内容に書き換えてください
  title: 'crossradio',
  // サイト表示用（OGP画像・ヘッダーアートワーク・一覧サムネイルのフォールバック）
  image: '/images/radio.png',
  // ポッドキャスト配信用のカバーアート（RSSの itunes:image と channel image）。
  // 未指定なら image を使う。ディレクトリ表示用に大きめの正方形画像を指定する。
  itunesImage: '/images/radio-3000.png',
  // 配信形式: 各回独立なら 'episodic'、連続ものなら 'serial'。
  type: 'episodic',
  blurb: 'ITとかAIとか学びについて徒然なるままに話します',
  description:
    'ITとかAIとか学びとか、若林の関心のあること、話したいことを徒然なるままに話します',
  // 番組の連絡先メール。RSSの itunes:owner / managingEditor に出力される。
  // Amazon Music 等が所有者確認に使用する。※フィードで一般公開される。
  email: 'hello@crssrds.jp',
  // Apple Podcasts のカテゴリ。先頭がプライマリ（必須）。
  // カテゴリ名は Apple の正式名称をそのまま指定する。
  categories: [{ category: 'Technology' }, { category: 'Education' }],
  hosts: [
    {
      name: 'Kenichi Wakabayashi',
      bio: '',
      // TODO: src/images/people/ にご自身の写真を置いてファイル名を指定してください
      img: 'me.png',
      github: 'https://github.com/kwaka1208',
      twitter: 'https://x.com/kwaka1208',
      website: 'https://crssrds.jp'
    },
  ],
  platforms: {
    apple:
      'https://podcasts.apple.com/us/podcast/crossradio/id6797005458',
    appleIdNumber: '6797005458',
    amazon: 'https://podcasters.amazon.com/podcasts/7516ae41-433e-4049-b082-ec701b44f284',
    // overcast: 'https://overcast.fm/itunes1552776603',
    // pocketCasts: 'https://pca.st/bezzctzj',
    spotify: 'https://open.spotify.com/show/033ZEW5vFEKgEGyv6zRwuK',
    youtube: 'https://youtube.com/playlist?list=PLDA-dmT_vLPU&si=x2GCK4QuBtmeYJJC'
  },
  rssFeed: 'https://radio.crssrds.jp/rss.xml'
});
