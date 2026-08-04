/**
 * Unit + structure checks for targeting surcharge panel.
 * Run: node test-targeting-surcharge.js
 */
'use strict';

const path = require('path');
const fs = require('fs');
const S = require(path.join(__dirname, 'targeting-surcharge.js'));

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg);
    failed++;
  } else {
    console.log('PASS:', msg);
  }
}

assert(S.ROWS.length === 4, '4 surcharge rows');
assert(S.filterRows('channel')[0].rate === '40%', 'channel 40%');
assert(S.filterRows('audience')[0].rate === '무상', 'audience free');
assert(S.filterRows('audience')[0].criteria.indexOf('월 400만원 이상') !== -1, 'audience monthly 400만 eligibility');
assert(S.filterRows('region')[0].rate === '등급별 적용', 'region tiered');

const time = S.ROWS.find((r) => r.id === 'time');
assert(time.criteria.indexOf('8시간') !== -1 && time.rate === '20%', 'time criteria/rate');
const ch = S.ROWS.find((r) => r.id === 'channel');
assert(ch.criteria.indexOf('7개') !== -1 && ch.rate === '40%', 'channel criteria/rate');

assert(S.REGION_GRADES.length === 5, '5 region grades');
assert(S.REGION_GRADES[0].grade === 'S급' && S.REGION_GRADES[0].rate === '40%', 'S grade');
assert(S.REGION_GRADES[0].areas.indexOf('강남구') !== -1, 'S areas');
assert(S.REGION_GRADES[1].rate === '30%', 'A 30%');
assert(S.REGION_GRADES[2].rate === '20%', 'B 20%');
assert(S.REGION_GRADES[3].rate === '0%', 'C 0%');
assert(S.REGION_GRADES[4].grade === 'D급' && S.REGION_GRADES[4].rate === '0%', 'D grade');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
const start = html.indexOf('id="targeting"');
const end = html.indexOf('id="aicf"');
const section = html.slice(start, end);

assert(section.indexOf('타겟팅 할증 기준') !== -1, 'title in targeting');
assert(section.indexOf('data-surcharge-filter=') === -1, 'filter buttons removed');
assert(section.indexOf('시간 선택형') !== -1, 'row time');
assert(section.indexOf('채널 선택형') !== -1, 'row channel');
assert(section.indexOf('오디언스 타겟팅') !== -1, 'row audience');
assert(section.indexOf('지역 타겟팅') !== -1, 'row region');
assert(section.indexOf('8시간') !== -1, 'time criteria text');
assert(section.indexOf('7개 이상') !== -1, 'channel criteria text');
assert(section.indexOf('지역 등급 기준') !== -1, 'region grades title');
assert(section.indexOf('S급') !== -1 && section.indexOf('강남구') !== -1, 'S grade content');
assert(section.indexOf('월 400만원 미만은 적용되지 않습니다') !== -1, 'audience eligibility disclaimer');
assert(!/src="targeting-surcharge\.js(\?[^"]*)?"/.test(html), 'filter module not loaded');
assert(js.indexOf('applySurchargeFilter') === -1, 'filter behavior removed');

if (failed) {
  console.error('\n' + failed + ' failed');
  process.exit(1);
}
console.log('\nAll targeting surcharge checks passed.');
process.exit(0);
