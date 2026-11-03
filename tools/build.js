// Builds the SEO-ready standalone site from the artifact source.
// usage (from repo root): node tools/build.js src/page.html .
// needs Playwright with Chromium installed (npm i -D playwright && npx playwright install chromium)
const fs = require('fs'), path = require('path'), {chromium} = require('playwright');
const [src, out] = process.argv.slice(2);
const BASE = 'https://arnavmv07.github.io/GamerKit/';
const TITLE = 'GamerKit: Every App for Your New Gaming PC in One Place';
const DESC = 'Download Steam, Discord, GPU drivers, MSI Afterburner and 70 more PC gaming apps from their official sites, or install them all at once with one free zip.';
const FAV = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='2' y='2' width='28' height='28' rx='7' fill='%2312141A'/%3E%3Ctext x='16' y='22' font-family='Arial,sans-serif' font-weight='800' font-size='17' fill='%23fff' text-anchor='middle'%3EG%3C/text%3E%3C/svg%3E";
const esc = s => s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
(async () => {
  let body = fs.readFileSync(src, 'utf8').replace(/^<title>[^<]*<\/title>\n/, '').replace('<meta name="claude:viewport-fit-sides" content="cover">\n','');
  const tmp = path.join(out, '.tmp.html');
  const wrap = (head, b) => '<!doctype html>\n<html lang="en">\n<head>\n' + head + '\n</head>\n<body>\n' + b + '\n</body>\n</html>\n';
  fs.writeFileSync(tmp, wrap('<meta charset="utf-8"><style>body{margin:0}</style>', body));
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1200,height:630}});
  await p.route('**/jszip.min.js', r => r.fulfill({body:'', contentType:'text/javascript'}));
  await p.goto('file://' + path.resolve(tmp)); await p.waitForTimeout(2500);
  const pre = await p.evaluate(() => Object.fromEntries(['cats','meta','presets','shelves'].map(id => [id, document.getElementById(id).innerHTML])));
  const items = await p.$$eval('.card', cs => cs.map(c => ({name:c.querySelector('h3').textContent, url:c.querySelector('.dl').href})));
  const faqs = await p.$$eval('.faq details', ds => ds.map(d => ({q:d.querySelector('summary').textContent, a:d.querySelector('p').textContent})));
  await p.evaluate(() => { document.querySelectorAll('.key[data-k]').forEach(k=>k.classList.remove('lit')); scrollTo(0,0); });
  await p.screenshot({path: path.join(out, 'og-image.png')});
  await b.close(); fs.unlinkSync(tmp);
  for (const [id, html] of Object.entries(pre)) {
    const re = new RegExp('(id="'+id+'"[^>]*>)(</(?:nav|div)>)');
    if (!re.test(body)) throw new Error('no container '+id);
    body = body.replace(re, (m, a, z) => a + html + z);
  }
  const ld = [
    {'@context':'https://schema.org','@type':'WebSite',name:'GamerKit',url:BASE,description:DESC},
    {'@context':'https://schema.org','@type':'ItemList',name:'Apps for a new gaming PC',numberOfItems:items.length,
      itemListElement:items.map((t,i)=>({'@type':'ListItem',position:i+1,name:t.name,url:t.url}))},
    {'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))}
  ];
  const head = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
    '<title>'+esc(TITLE)+'</title>',
    '<meta name="description" content="'+esc(DESC)+'">',
    '<meta name="robots" content="index,follow,max-image-preview:large">',
    '<link rel="canonical" href="'+BASE+'">',
    '<meta name="theme-color" content="#EDEFF3" media="(prefers-color-scheme: light)">',
    '<meta name="theme-color" content="#0D0F13" media="(prefers-color-scheme: dark)">',
    '<link rel="icon" href="'+FAV+'">',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="GamerKit">',
    '<meta property="og:title" content="'+esc(TITLE)+'">',
    '<meta property="og:description" content="'+esc(DESC)+'">',
    '<meta property="og:url" content="'+BASE+'">',
    '<meta property="og:image" content="'+BASE+'og-image.png">',
    '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="'+esc(TITLE)+'">',
    '<meta name="twitter:description" content="'+esc(DESC)+'">',
    '<meta name="twitter:image" content="'+BASE+'og-image.png">',
    '<script type="application/ld+json">'+JSON.stringify(ld).replace(/</g,'\\u003c')+'</script>',
    '<style>body{margin:0}[hidden]{display:none!important}img{max-width:100%}</style>'
  ].join('\n');
  fs.writeFileSync(path.join(out,'index.html'), wrap(head, body));
  fs.writeFileSync(path.join(out,'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: '+BASE+'sitemap.xml\n');
  fs.writeFileSync(path.join(out,'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>'+BASE+'</loc><lastmod>'+new Date().toISOString().slice(0,10)+'</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n</urlset>\n');
  console.log('built', items.length, 'tools,', faqs.length, 'faqs');
})();
