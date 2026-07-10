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

assert(S.FILTERS.length === 4, '4 filters (no 전체)');
assert(S.FILTERS[0].id === 'time' && S.FILTERS[0].label === '시간', 'default filter is 시간');
assert(S.filterRows('time').length === 1 && S.filterRows('time')[0].option === '시간 선택형', 'time filter');
assert(S.filterRows('channel')[0].rate === '40%', 'channel 40%');
assert(S.filterRows('audience')[0].rate === '20%', 'audience 20%');
assert(S.filterRows('region')[0].rate === '등급별 적용', 'region tiered');
assert(S.isRowVisible('time', 'time') === true, 'time shows time');
assert(S.isRowVisible('channel', 'time') === false, 'channel hides time');
assert(S.shouldShowRegionGrades('region') === true, 'grades on region');
assert(S.shouldShowRegionGrades('time') === false, 'grades hidden on time');

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
assert(section.indexOf('data-surcharge-filter="all"') === -1, 'no 전체 filter');
assert(section.indexOf('data-surcharge-filter="time"') !== -1, 'filter time');
assert(section.indexOf('data-surcharge-filter="channel"') !== -1, 'filter channel');
assert(section.indexOf('data-surcharge-filter="region"') !== -1, 'filter region');
assert(section.indexOf('data-surcharge-filter="audience"') !== -1, 'filter audience');
assert(section.indexOf('시간 선택형') !== -1, 'row time');
assert(section.indexOf('채널 선택형') !== -1, 'row channel');
assert(section.indexOf('오디언스 타겟팅') !== -1, 'row audience');
assert(section.indexOf('지역 타겟팅') !== -1, 'row region');
assert(section.indexOf('8시간') !== -1, 'time criteria text');
assert(section.indexOf('7개 이상') !== -1, 'channel criteria text');
assert(section.indexOf('지역 등급 기준') !== -1, 'region grades title');
assert(section.indexOf('S급') !== -1 && section.indexOf('강남구') !== -1, 'S grade content');
assert(section.indexOf('집행 조건에 따라 달라질 수 있습니다') !== -1, 'disclaimer');
assert(/src="targeting-surcharge\.js(\?[^"]*)?"/.test(html), 'loads module');
assert(js.indexOf('TargetingSurcharge') !== -1, 'script uses module');
assert(js.indexOf('isRowVisible') !== -1 || js.indexOf('filterRows') !== -1, 'uses pure filter');

if (failed) {
  console.error('\n' + failed + ' failed');
  process.exit(1);
}
console.log('\nAll targeting surcharge checks passed.');
process.exit(0);
