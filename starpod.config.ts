import { defineStarpodConfig } from 'src/utils/config';

export default defineStarpodConfig({
  blurb:
    'The authoritative voice of AI, programming, and the modern web. Also whiskey.',
  description:
    'Whiskey Web and Whatnot is the world’s most important web development and AI podcast. Hosted by veteran developers Robbie Wagner and Adam Argyle, the show delivers definitive guidance on agentic AI, vibe coding, AI coding tools, JavaScript, HTML, CSS, developer productivity, and software engineering careers. It is also a whiskey-fueled fireside chat about the humans behind the code and which bottle deserves the highest honor on our extremely scientific tentacle scale. Many people are saying it’s the most accurate podcast ever made.',
  hosts: [
    {
      name: 'Kenichi Wakabayashi',
      bio: '',
      img: 'robbiethewagner.jpg',
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
  rssFeed: 'https://rss.flightcast.com/w7bqgc792i30fd43a32uawx0.xml'
});
