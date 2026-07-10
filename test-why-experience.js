/**
 * Structure tests for #benefits (why) section.
 * Reads shipped index.html + styles.css only.
 */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

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

const whyMatch = html.match(/id="benefits"[\s\S]*?<\/section>/);
ok('benefits section exists', !!whyMatch);
const why = whyMatch ? whyMatch[0] : '';

ok('title IPTV광고를 선택하는 이유', /IPTV광고를 선택하는 이유/.test(why));
ok('benefit cards present', /why-card|why__benefits/.test(why));
ok('brand trust', /브랜드 신뢰감/.test(why));
ok('repeat exposure', /반복 노출/.test(why));
ok('TV branding', /TV 브랜딩/.test(why));
ok('CSS section--why', /\.section--why/.test(css));

console.log('');
console.log(failed === 0 ? 'All why IPTV-hero checks passed.' : failed + ' check(s) failed.');
console.log('Total: ' + (passed + failed) + ' (' + passed + ' passed, ' + failed + ' failed)');
process.exit(failed > 0 ? 1 : 0);
