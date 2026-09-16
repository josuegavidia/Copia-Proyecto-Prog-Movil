const fs = require('fs');

async function test() {
  const res = await fetch('https://www.hoopshype.com/nba-2k/players/?team=boston-celtics', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
  if (m) {
    const data = JSON.parse(m[1]);
    console.log('pageProps keys:', Object.keys(data.props?.pageProps || {}));
    fs.writeFileSync('C:/Users/Soporte/Desktop/Proyecto NBA Squad Builder/scripts/hoopshype_sample.json', JSON.stringify(data.props?.pageProps, null, 2));
    console.log('Saved hoopshype_sample.json');
  } else {
    console.log('No __NEXT_DATA__ found');
    fs.writeFileSync('C:/Users/Soporte/Desktop/Proyecto NBA Squad Builder/scripts/hoopshype_raw.html', html);
  }
}

test().catch(console.error);
