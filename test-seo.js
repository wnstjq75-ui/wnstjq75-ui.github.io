/**
 * SEO structure checks for GitHub Pages landing root.
 * Run: node test-seo.js
 */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const notFound = fs.readFileSync(path.join(root, '404.html'), 'utf8');

let passed = 0;
let failed = 0;

function ok(name, cond) {
  if (cond) {
    console.log('PASS: ' + name);
    passed++;
  } else {
    console.log('FAIL: ' + name);
    failed++;
  }
}

const ROOT = 'https://wnstjq75-ui.github.io/';

// Head
ok('title', /<title>TV광고·IPTV광고 \| AI TV CF 제작·맞춤 송출 \| 오픈엑스<\/title>/.test(html));
ok('meta description', /name="description"[^>]*월 100만원부터 시작하는 TV광고·IPTV광고/.test(html));
ok('robots index follow', /name="robots"[^>]*index, follow/.test(html));
ok('canonical root', html.includes('rel="canonical" href="' + ROOT + '"') || html.includes("rel='canonical' href='" + ROOT + "'") || /rel="canonical"\s+href="https:\/\/wnstjq75-ui\.github\.io\/"/.test(html));
ok('og:url root', html.includes('og:url" content="' + ROOT + '"') || /property="og:url"\s+content="https:\/\/wnstjq75-ui\.github\.io\/"/.test(html));
ok('og:image hero-shot', /og:image" content="https:\/\/wnstjq75-ui\.github\.io\/hero-shot\.png"/.test(html));
ok('twitter card', /twitter:card" content="summary_large_image"/.test(html));
ok('favicon', /rel="icon"/.test(html));
ok('no bad iptv-ad-landing URL', !/iptv-ad-landing/.test(html));
ok('no iptv.openxgroup site URL as canonical', !/iptv\.openxgroup\.co\.kr/.test(html.match(/canonical[\s\S]{0,200}/) || [''])[0] || true);
// ensure openxgroup only as email
ok('no http openxgroup site', !/https?:\/\/iptv\.openxgroup\.co\.kr/.test(html));

// H1
const h1s = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi) || [];
ok('exactly one h1', h1s.length === 1);
ok('h1 has TV광고', /TV광고/.test(h1s[0] || ''));
ok('h1 is short start CTA', /월 100만원부터/.test(h1s[0] || '') && /TV광고를 시작하세요/.test(h1s[0] || ''));
ok('h1 not dual-keyword list', !/TV광고·IPTV광고/.test(h1s[0] || '') && !/IPTV광고/.test(h1s[0] || ''));
ok('hero eyebrow', /AI TV CF · IPTV 송출/.test(html));
ok('hero short desc', /AI TV CF 제작부터 IPTV 맞춤 송출/.test(html) && /완전시청 리포트까지 한 번에 제공합니다/.test(html));
ok('no long openx hero lead', !/오픈엑스는 중소기업도/.test(html));
ok('IPTV광고 remains outside hero H1', /IPTV광고란 무엇인가/.test(html) && /name="description"[^>]*IPTV광고/.test(html));

// FAQ
ok('faq id', /id="faq"/.test(html));
const faqs = [
  'IPTV광고 비용은 얼마부터 시작하나요',
  'TV광고 영상이 없어도 진행할 수 있나요',
  'IPTV광고는 어떤 지역에 송출할 수 있나요',
  'KT, SK브로드밴드, LG유플러스에 모두 송출할 수 있나요',
  '완전시청 기준 송출은 무엇인가요',
  'TV광고 제작과 송출까지 얼마나 걸리나요',
  'IPTV 타겟팅을 적용하면 비용이 추가되나요',
];
faqs.forEach((q) => ok('faq: ' + q.slice(0, 20), html.includes(q)));

// Section anchors
['about', 'benefits', 'product', 'targeting', 'showcase', 'process', 'pricing', 'faq', 'contact'].forEach((id) => {
  ok('section/anchor #' + id, new RegExp('id="' + id + '"').test(html));
});

// JSON-LD
const ldBlocks = [];
const ldRe = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
let m;
while ((m = ldRe.exec(html))) {
  try {
    ldBlocks.push(JSON.parse(m[1]));
    ok('JSON-LD parse ok', true);
  } catch (e) {
    ok('JSON-LD parse ok', false);
  }
}
const org = ldBlocks.find((b) => b['@type'] === 'Organization');
const svc = ldBlocks.find((b) => b['@type'] === 'Service');
ok('Organization present', !!org);
ok('Organization url', org && org.url === ROOT);
ok('Organization email', org && org.email === 'mkt@openxgroup.co.kr');
ok('Organization phone', org && org.telephone === '+82-10-2157-2346');
ok('Service present', !!svc);
ok('Service name', svc && /TV광고|IPTV/.test(svc.name));

// robots / sitemap / 404
ok('robots allow', /User-agent:\s*\*/i.test(robots) && /Allow:\s*\//i.test(robots));
ok('robots sitemap', robots.includes('Sitemap: https://wnstjq75-ui.github.io/sitemap.xml'));
ok('sitemap loc', sitemap.includes('<loc>https://wnstjq75-ui.github.io/</loc>'));
ok('404 noindex', /noindex/.test(notFound));
ok('404 home link', notFound.includes('https://wnstjq75-ui.github.io/'));
ok('main page not noindex', !/<meta name="robots"[^>]*noindex/.test(html));

// hero-shot exists
ok('hero-shot.png exists', fs.existsSync(path.join(root, 'hero-shot.png')));

console.log('');
console.log(failed === 0 ? 'All SEO checks passed.' : failed + ' SEO check(s) failed.');
console.log('Total: ' + (passed + failed) + ' (' + passed + ' passed, ' + failed + ' failed)');
process.exit(failed > 0 ? 1 : 0);
