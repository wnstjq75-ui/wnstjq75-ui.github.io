/**
 * Structure checks for targeting left summary column.
 * Run: node test-targeting-left.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg);
    failed++;
  } else {
    console.log('PASS:', msg);
  }
}

const start = html.indexOf('id="targeting"');
const end = html.indexOf('id="aicf"');
const section = html.slice(start, end);
const leftStart = section.indexOf('targeting__text');
const leftEnd = section.indexOf('targeting__panel');
const left = section.slice(leftStart, leftEnd);

assert(left.indexOf('타겟팅 기능') !== -1, 'badge 타겟팅 기능');
assert(left.indexOf('필요한 곳에만') === -1, 'old abstract headline removed');
assert(left.indexOf('IPTV TV광고를 원하는 고객에게 맞춤 송출합니다') !== -1, 'new concrete headline');
assert(left.indexOf('targeting__points') !== -1, 'points list present');
assert((left.match(/targeting__point-icon/g) || []).length >= 3, 'at least 3 point icons');
assert(left.indexOf('시·군·구') !== -1 || left.indexOf('정밀 송출') !== -1, 'point region');
assert(left.indexOf('채널') !== -1 && left.indexOf('시간') !== -1, 'point channel/time');
assert(left.indexOf('오디언스') !== -1, 'point audience');
assert(left.indexOf('targeting__footer') !== -1, 'footer line');
assert(left.indexOf('효율') !== -1 || left.indexOf('높아집니다') !== -1, 'footer efficiency line');
// not two long abstract desc paragraphs only
assert((left.match(/section__desc/g) || []).length <= 1, 'at most one body desc');
assert(section.indexOf('targeting-tab') !== -1, 'middle tabs remain');
assert(section.indexOf('id="surcharge"') !== -1 || section.indexOf('surcharge') !== -1, 'surcharge remains');
assert(html.indexOf('href="#targeting"') !== -1, 'nav targeting');
assert(js.indexOf('targeting-tab') !== -1 || js.indexOf('targetingTabs') !== -1, 'tabs JS remains');
assert(css.indexOf('targeting__points') !== -1, 'points CSS');

if (failed) {
  console.error('\n' + failed + ' failed');
  process.exit(1);
}
console.log('\nAll targeting-left checks passed.');
process.exit(0);
