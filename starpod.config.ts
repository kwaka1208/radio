import { defineStarpodConfig } from 'src/utils/config';

export default defineStarpodConfig({
  // TODO: 番組名・カバー画像・紹介文はご自身の内容に書き換えてください
  title: 'crossradio',
  image: '/images/radio.png',
  blurb: 'ものづくりと学びについて話すラジオ。',
  description:
    'ものづくりと学びについてゆるく話すポッドキャストです。番組の詳しい紹介文はここに書きます。',
  hosts: [
    {
      name: 'Kenichi Wakabayashi',
      bio: '',
      // TODO: src/images/people/ にご自身の写真を置いてファイル名を指定してください
      img: 'me.jpg',
      github: 'https://github.com/kwaka1208',
      twitter: 'https://x.com/waka1208',
      website: 'https://crssrds.jp'
    },
  ],
  platforms: {
    apple:
      '',
    appleIdNumber: '',
    // overcast: 'https://overcast.fm/itunes1552776603',
    // pocketCasts: 'https://pca.st/bezzctzj',
    // spotify: 'https://open.spotify.com/show/19jiuHAqzeKnkleQUpZxDf',
    // youtube: 'https://www.youtube.com/@WhiskeyWebAndWhatnot/'
  },
  rssFeed: 'https://radio.crssrds.jp/rss.xml'
});
