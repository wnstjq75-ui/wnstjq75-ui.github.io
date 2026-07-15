/**
 * SEO structure checks for the GitHub Pages landing root.
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

function ok(name, condition) {
  if (condition) {
    console.log('PASS: ' + name);
    passed++;
  } else {
    console.log('FAIL: ' + name);
    failed++;
  }
}

function stripTags(value) {
  return String(value || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

const ROOT = 'https://wnstjq75-ui.github.io/';
const TITLE = 'TV광고 비용·제작·IPTV 송출 | 월 100만원부터 | 오픈엑스';
const DESCRIPTION = '월 100만원부터 시작하는 TV광고. 15초 AI TV CF 제작 지원부터 KT·SK B tv·LG U+tv IPTV 맞춤 송출, 지역·채널 타겟팅, 완전시청 결과 리포트까지 오픈엑스가 제공합니다.';
const H1 = '월 100만원부터 TV광고를 시작하세요';

// Document and head metadata
ok('html lang ko', /<html\s+lang="ko">/i.test(html));
ok('charset UTF-8', /<meta\s+charset="UTF-8">/i.test(html));
ok('viewport', /<meta\s+name="viewport"\s+content="width=device-width, initial-scale=1\.0">/i.test(html));
ok('title', html.includes('<title>' + TITLE + '</title>'));
ok('single title', (html.match(/<title\b/gi) || []).length === 1);
ok('meta description', html.includes('content="' + DESCRIPTION + '"'));
ok('single meta description', (html.match(/<meta\s+name="description"/gi) || []).length === 1);
ok('robots index follow', /<meta\s+name="robots"[^>]*content="[^"]*index, follow/i.test(html));
ok('single robots meta', (html.match(/<meta\s+name="robots"/gi) || []).length === 1);
ok('canonical root', html.includes('<link rel="canonical" href="' + ROOT + '">'));
ok('single canonical', (html.match(/rel="canonical"/gi) || []).length === 1);
ok('og metadata',
  /property="og:type" content="website"/.test(html) &&
  /property="og:locale" content="ko_KR"/.test(html) &&
  /property="og:site_name" content="오픈엑스 TV광고"/.test(html) &&
  /property="og:title" content="TV광고 비용·제작·IPTV 송출 \| 오픈엑스"/.test(html) &&
  /property="og:url" content="https:\/\/wnstjq75-ui\.github\.io\/"/.test(html)
);
ok('og image and alt',
  /property="og:image" content="https:\/\/wnstjq75-ui\.github\.io\/hero-shot\.png"/.test(html) &&
  /property="og:image:alt" content="[^"]+"/.test(html)
);
ok('twitter metadata',
  /name="twitter:card" content="summary_large_image"/.test(html) &&
  /name="twitter:title" content="TV광고 비용·제작·IPTV 송출 \| 오픈엑스"/.test(html) &&
  /name="twitter:description" content="[^"]+"/.test(html) &&
  /name="twitter:image" content="https:\/\/wnstjq75-ui\.github\.io\/hero-shot\.png"/.test(html)
);
ok('theme color', /name="theme-color" content="#050505"/.test(html));
ok('google verification retained', /name="google-site-verification"[\s\S]{0,120}content="eZRSBnOK_BLfkA1SjSxSgXFS0nb8otXtfSj5BHfs-b8"/.test(html));
ok('naver verification fixed', /name="naver-site-verification"[\s\S]{0,120}content="68846efc808a40795122e954e244422b17c717e9"/.test(html));
ok('no nested naver meta', !/content="<meta\s+name="naver-site-verification"/.test(html));

// H1 and hero
const h1s = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi) || [];
ok('exactly one h1', h1s.length === 1);
ok('h1 has TV광고', /TV광고/.test(h1s[0] || ''));
ok('h1 exact copy', stripTags(h1s[0]) === H1);
ok('hero description', /AI CF 무상제작부터 IPTV 맞춤 송출,\s*시청 리포트까지 한 번에/.test(html));

// FAQ visible HTML
const faqQuestions = [
  'TV광고 비용은 얼마부터 시작하나요?',
  '월 100만원으로 TV광고를 몇 회 송출할 수 있나요?',
  'TV광고 영상이 없어도 진행할 수 있나요?',
  '15초 TV광고 제작에는 얼마나 걸리나요?',
  'IPTV 광고는 원하는 지역에만 송출할 수 있나요?',
  'KT, SK브로드밴드, LG유플러스에 모두 송출할 수 있나요?',
  '완전시청 기준이 무엇인가요?',
  '광고 도중 시청자가 이탈하면 비용이 계산되나요?',
  'TV광고 송출 결과를 확인할 수 있나요?',
  'IPTV 타겟팅을 적용하면 비용이 추가되나요?',
  'TV광고 계약 기간은 얼마인가요?',
  '중소기업이나 지역 매장도 TV광고를 진행할 수 있나요?',
];
ok('faq id', /id="faq"/.test(html));
ok('faq title', /id="faqTitle">자주 묻는 질문<\/h2>/.test(html) || /id="faqTitle">TV광고 자주 묻는 질문<\/h2>/.test(html));
faqQuestions.forEach((question) => ok('faq: ' + question, html.includes('<summary class="faq-item__q">' + question + '</summary>')));
ok('12 visible faq items', (html.match(/<details class="faq-item">/g) || []).length === 12);

// Required anchors remain on the single page
['about', 'solution', 'benefits', 'product', 'targeting', 'aicf', 'showcase', 'pricing', 'faq', 'contact'].forEach((id) => {
  ok('section/anchor #' + id, new RegExp('id="' + id + '"').test(html));
});

// JSON-LD
const ldBlocks = [];
const ldRe = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
let match;
while ((match = ldRe.exec(html))) {
  try {
    ldBlocks.push(JSON.parse(match[1]));
    ok('JSON-LD parse ok', true);
  } catch (error) {
    ok('JSON-LD parse ok', false);
  }
}
const org = ldBlocks.find((block) => block['@type'] === 'Organization');
const website = ldBlocks.find((block) => block['@type'] === 'WebSite');
const service = ldBlocks.find((block) => block['@type'] === 'Service');
const faqPage = ldBlocks.find((block) => block['@type'] === 'FAQPage');
ok('Organization present', !!org && org.url === ROOT);
ok('WebSite present', !!website && website.name === '오픈엑스 TV광고' && website.url === ROOT && website.inLanguage === 'ko-KR');
ok('Service present', !!service && service.name === 'TV광고 제작·IPTV 맞춤 송출' && service.url === ROOT);
ok('FAQPage present', !!faqPage && Array.isArray(faqPage.mainEntity) && faqPage.mainEntity.length === 12);
ok('FAQPage questions match visible FAQ', !!faqPage && faqQuestions.every((question, index) => faqPage.mainEntity[index].name === question));
if (faqPage) {
  const visibleAnswers = Array.from(html.matchAll(/<div class="faq-item__a">\s*<p>([\s\S]*?)<\/p>\s*<\/div>/g), (item) => stripTags(item[1]));
  const structuredAnswers = faqPage.mainEntity.map((item) => item.acceptedAnswer.text);
  ok('FAQPage answers match visible FAQ', JSON.stringify(visibleAnswers) === JSON.stringify(structuredAnswers));
}

// robots, sitemap, and 404
ok('robots exact directives', robots.replace(/\r/g, '').trim() === 'User-agent: *\nAllow: /\n\nSitemap: https://wnstjq75-ui.github.io/sitemap.xml');
const sitemapLocs = Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g), (item) => item[1]);
ok('sitemap has one URL', sitemapLocs.length === 1 && sitemapLocs[0] === ROOT);
ok('404 noindex', /<meta name="robots" content="noindex, nofollow">/.test(notFound));
ok('404 home link', notFound.includes(ROOT));
ok('main page not noindex', !/<meta name="robots"[^>]*noindex/.test(html));
ok('hero-shot.png exists', fs.existsSync(path.join(root, 'hero-shot.png')));

console.log('');
console.log(failed === 0 ? 'All SEO checks passed.' : failed + ' SEO check(s) failed.');
console.log('Total: ' + (passed + failed) + ' (' + passed + ' passed, ' + failed + ' failed)');
process.exit(failed > 0 ? 1 : 0);
