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

assert(left.indexOf('타겟팅 기능') === -1, 'top badge removed');
assert(left.indexOf('더 많이가 아니라,') !== -1 && left.indexOf('더 정확하게') !== -1, 'current targeting headline');
assert((left.match(/targeting__headline-line/g) || []).length === 2, 'targeting headline fixed to two lines');
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
assert(/data-tab="geo">지역<\/button>/.test(section), 'short geo tab label');
assert(/data-tab="audience">오디언스<\/button>/.test(section), 'short audience tab label');
assert(/data-tab="time">시간<\/button>/.test(section), 'short time tab label');
assert(/data-tab="channel">채널<\/button>/.test(section), 'short channel tab label');
assert(section.indexOf('데이터 조건') === -1, 'old data condition tab removed');
assert(section.indexOf('검증 및 리포트') === -1, 'old report tab removed');
assert(section.indexOf('data-panel="audience"') !== -1, 'audience targeting panel');
assert(section.indexOf('라이프스타일') !== -1, 'audience lifestyle group');
assert(section.indexOf('세대') !== -1, 'audience generation group');
assert(section.indexOf('트렌드') !== -1, 'audience trend group');
assert(section.indexOf('targeting-features--audience') !== -1, 'three audience group cards');
assert(section.indexOf('audience-console') !== -1, 'premium audience console');
assert((section.match(/class="audience-segment audience-segment--/g) || []).length === 3, 'three audience segment tiles');
assert(section.indexOf('targeting-data__bar') === -1, 'old audience progress bars removed');
assert(section.indexOf('data-panel="time"') !== -1, 'time targeting panel');
assert(section.indexOf('data-panel="channel"') !== -1, 'channel targeting panel');
assert(css.indexOf('var(--targeting-geo-height') !== -1, 'targeting visuals inherit first GEO panel height');
assert(/#targeting \.targeting-tabs[\s\S]*grid-template-columns:\s*repeat\(4/.test(css), 'targeting tabs stay in one row');
assert(js.indexOf('syncTargetingVisualHeight') !== -1, 'first GEO panel height is measured');
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
