'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const S = require('./targeting-surcharge.js');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const section = (html.match(/<section\b[^>]*id="targeting"[^>]*>[\s\S]*?<\/section>/) || [''])[0];

assert.equal(S.ROWS.length, 4);
for (const category of ['time', 'channel', 'audience']) {
  const row = S.filterRows(category)[0];
  assert.match(row.criteria, /일반계약에서만 설정 가능/);
  assert.equal(row.rate, '별도 문의');
}
assert.equal(S.filterRows('region')[0].rate, '30% / 그 외 0%');
assert.equal(S.REGION_GRADES.length, 2);
assert.equal(S.REGION_GRADES[0].areas, '강남, 송파, 서초, 용산, 분당');
assert.equal(S.REGION_GRADES[0].rate, '30%');
assert.equal(S.REGION_GRADES[1].rate, '0%');

assert.match(section, /10월 적용 타겟팅 기준/);
assert.match(section, /소상공인 계약은 지역 타겟팅만 설정할 수 있습니다/);
assert.match(section, /일반계약 계약금은 별도 문의/);
assert.doesNotMatch(section, /월 400만원 이상|S급|A급|B급|40%|20%/);

console.log('October IPTV targeting policy checks passed.');
