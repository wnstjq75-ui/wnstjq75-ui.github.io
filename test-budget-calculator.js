'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Calc = require('./budget-calculator.js');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

assert.equal(Calc.minManwonForProduct('all3'), 100);
assert.equal(Calc.calculateExposures(100, 'all3').exposures, 150000);
assert.equal(Calc.calculateExposures(200, 'all3').exposures, 300000);
assert.equal(Calc.calculateExposures(100, 'all3', 6).totalExposures, 900000);
assert.equal(Calc.calculateExposures(100, 'all3', 12).totalExposures, 1800000);
assert.match(Calc.PRODUCTS.all3.unitLabel, /15만회.*각 5만회/);

assert.equal(Calc.REGION_GRADES_CALC.length, 1);
assert.equal(Calc.REGION_GRADES_CALC[0].areas, '강남, 송파, 서초, 용산, 분당');
assert.equal(Calc.sumSurchargeRate({ region: 'premium' }), 0.3);
assert.equal(Calc.sumSurchargeRate({ region: null }), 0);
assert.equal(Calc.sumSurchargeRate({ time: true, channel: true, audience: true }), 0);
assert.equal(Calc.isAudienceAvailable(1000), false);
assert.equal(Calc.applySurchargeRate(150000, 0.3), 115384);
assert.deepEqual(Calc.describeSurcharge({ region: 'premium' }), ['지역 30%']);

assert.match(html, /data-calc-region="premium"/);
assert.doesNotMatch(html, /data-calc-surcharge=/);
assert.match(html, /id="calcExposures">150,000/);
assert.match(html, /id="calcTotalExposures">900,000/);
assert.match(html, /각 매체를 따로 청약할 수 없습니다/);
assert.match(html, /소상공인 계약에서는 채널·시간·오디언스 타겟팅을 설정할 수 없습니다/);
assert.match(js, /BudgetCalculator\.applySurchargeRate/);
assert.doesNotMatch(js, /audienceSurchargeBtn/);

console.log('October IPTV budget policy checks passed.');
