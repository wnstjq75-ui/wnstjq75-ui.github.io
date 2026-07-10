/**
 * Unit tests against shipped BudgetCalculator (budget-calculator.js).
 * Run: node test-budget-calculator.js
 */
'use strict';

const path = require('path');
const fs = require('fs');
const Calc = require(path.join(__dirname, 'budget-calculator.js'));

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg);
    failed++;
  } else {
    console.log('PASS:', msg);
  }
}

// Defaults / clamps
assert(Calc.DEFAULT_MANWON === 100, 'default 100만');
assert(Calc.MIN_MANWON === 100 && Calc.MAX_MANWON === 500, 'range 100–500');
assert(Calc.STEP_MANWON === 10, 'step 10만');
assert(Calc.clampBudgetManwon(95) === 100, 'clamp min');
assert(Calc.clampBudgetManwon(510) === 500, 'clamp max');
assert(Calc.clampBudgetManwon(205) === 210 || Calc.clampBudgetManwon(205) === 200, 'step round');

// KT 단독: won / 10
const kt100 = Calc.calculateExposures(100, 'kt');
assert(kt100.exposures === 100000, 'KT 100만 → 100,000');
assert(Calc.calculateExposures(300, 'kt').exposures === 300000, 'KT 300만 → 300,000');
assert(Calc.calculateExposures(500, 'kt').exposures === 500000, 'KT 500만 → 500,000');
assert(Calc.calculateExposures(110, 'kt').exposures === 110000, 'KT 110만 step');

// SKT + LGU+: won / 5
assert(Calc.calculateExposures(100, 'sklg').exposures === 200000, 'SK 100만 → 200,000');
assert(Calc.calculateExposures(300, 'sklg').exposures === 600000, 'SK 300만 → 600,000');
assert(Calc.calculateExposures(500, 'sklg').exposures === 1000000, 'SK 500만 → 1,000,000');

// 3사 동시 송출: min 200만, half KT(/10) + half SK(/5)
assert(Calc.minManwonForProduct('all3') === 200, '3사 min 200만');
assert(Calc.clampBudgetManwon(100, 'all3') === 200, '3사 clamps 100→200');
// 200만 = 100만 KT + 100만 SK = 100,000 + 200,000 = 300,000
assert(Calc.calculateExposures(200, 'all3').exposures === 300000, '3사 200만 → 300,000');
// 300만 = 150만 each → 150,000 + 300,000 = 450,000
assert(Calc.calculateExposures(300, 'all3').exposures === 450000, '3사 300만 → 450,000');
// 500만 = 250만 each → 250,000 + 500,000 = 750,000
assert(Calc.calculateExposures(500, 'all3').exposures === 750000, '3사 500만 → 750,000');
assert(Calc.PRODUCTS.all3.label === '3사 통합', '3사 product label is 3사 통합');
assert(Calc.PRODUCTS.all3.unitLabel === '3사 통합', '3사 unit label is 3사 통합');

// Labels
assert(kt100.productLabel === 'KT 단독', 'KT label');
assert(Calc.calculateExposures(100, 'sklg').productLabel.indexOf('SKT') !== -1, 'SK label');
assert(Calc.formatExposures(100000).indexOf('100') !== -1, 'comma format');

// Structure wiring
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
assert(html.indexOf('id="pricing"') !== -1, 'pricing section');
assert(html.indexOf('budget-calculator') !== -1 || html.indexOf('ad-calc') !== -1, 'calculator markup');
assert(html.indexOf('KT') !== -1 && html.indexOf('단독') !== -1, 'KT tab label');
assert(html.indexOf('SKT') !== -1 && html.indexOf('LGU+') !== -1, 'SK tab');
assert(html.indexOf('3사') !== -1 && html.indexOf('동시') !== -1, '3사 tab');
assert(html.indexOf('pricing-tiers') === -1, 'static package tiers removed');
assert(html.indexOf('이 예산으로 상담 문의') === -1, 'CTA budget contact removed');
assert(
  html.indexOf('TV광고 상담 문의') !== -1 || html.indexOf('패키지 상담') !== -1,
  'CTA package contact'
);
assert(html.indexOf('100만원부터') !== -1 || html.indexOf('월 100만원부터') !== -1, '100만 entry msg');
assert(html.indexOf('예상 완전시청 노출') !== -1 || html.indexOf('예상 노출') !== -1, 'disclaimer monthly');
assert(html.indexOf('3개월 단위') !== -1, 'disclaimer 3-month');
assert(Calc.PRODUCTS.sklg.bonus.indexOf('더 넓은 도달') !== -1, 'SK benefit copy');
assert(Calc.PRODUCTS.all3.bonus.indexOf('KT 1개월 보너스') !== -1, '3사 KT bonus');
assert(Calc.PRODUCTS.all3.bonus.indexOf('/') !== -1, '3사 dual benefit');
assert(/src="budget-calculator\.js(\?[^"]*)?"/.test(html), 'loads math module');
assert(js.indexOf('BudgetCalculator.calculateExposures') !== -1, 'script uses real math');

const pricing = html.slice(html.indexOf('id="pricing"'), html.indexOf('id="contact"'));
assert(pricing.indexOf('type="range"') !== -1 || pricing.indexOf('ad-calc__slider') !== -1, 'slider in pricing');
assert(pricing.indexOf('min="100"') !== -1 && pricing.indexOf('max="500"') !== -1, 'slider min max');
assert(pricing.indexOf('step="10"') !== -1, 'slider step 10');
assert(pricing.indexOf('data-calc-product="all3"') !== -1, 'all3 tab in pricing');

// Contract term slider (3-month steps)
assert(Calc.MIN_TERM_MONTHS === 3, 'min term 3');
assert(Calc.STEP_TERM_MONTHS === 3, 'step term 3');
assert(Calc.DEFAULT_TERM_MONTHS === 3, 'default term 3 months');
assert(Calc.clampTermMonths(6) === 6, 'clamp term 6');
assert(Calc.clampTermMonths(5) === 6 || Calc.clampTermMonths(5) === 3, 'step round term');
assert(Calc.clampTermMonths(12) === 12, 'clamp term 12');
assert(Calc.clampTermMonths(36) === 36, 'term up to UI max 36');
const kt3 = Calc.calculateExposures(100, 'kt', 3);
assert(kt3.exposures === 100000, 'KT monthly exposures unchanged');
assert(kt3.termMonths === 3, 'termMonths 3');
assert(kt3.totalExposures === 300000, 'KT 100만 × 3개월 total 300,000');
assert(kt3.totalBudgetManwon === 300, 'KT total budget 300만');
const kt12 = Calc.calculateExposures(100, 'kt', 12);
assert(kt12.totalExposures === 1200000, 'KT 100만 × 12개월 total 1,200,000');
assert(Calc.calculateExposures(200, 'all3', 6).totalExposures === 1800000, '3사 200만 × 6 = 1,800,000');
assert(html.indexOf('id="calcTerm"') !== -1, 'term slider in HTML');
assert(html.indexOf('calcTotalExposures') !== -1, 'total exposures element');
assert(html.indexOf('계약 기간') !== -1, 'contract period label');
assert(html.indexOf('계약 기간 총 예상 노출') !== -1, 'total is primary label');
assert(js.indexOf('calcTerm') !== -1, 'script handles term');
assert(js.indexOf('totalExposures') !== -1, 'script renders total exposures');

// Surcharge panel left of calculator
assert(html.indexOf('id="calcSurcharge"') !== -1, 'calc surcharge panel');
assert(html.indexOf('data-calc-region="S"') !== -1, 'region S grade');
assert(html.indexOf('data-calc-region="A"') !== -1, 'region A grade');
assert(html.indexOf('data-calc-region="B"') !== -1, 'region B grade');
assert(html.indexOf('data-calc-surcharge="time"') !== -1, 'time surcharge toggle');
assert(html.indexOf('data-calc-surcharge="channel"') !== -1, 'channel surcharge toggle');
assert(html.indexOf('data-calc-surcharge="audience"') !== -1, 'audience surcharge toggle');
assert(html.indexOf('강남구') !== -1, 'region names S');
assert(typeof Calc.sumSurchargeRate === 'function', 'sumSurchargeRate');
assert(Calc.sumSurchargeRate({}) === 0, 'no surcharge 0');
assert(Calc.sumSurchargeRate({ region: 'S' }) === 0.4, 'S region 40%');
assert(Calc.sumSurchargeRate({ time: true, channel: true }) === 0.6, 'time+channel 60%');
assert(Calc.applySurchargeRate(100000, 0) === 100000, 'no rate keeps exposures');
assert(Calc.applySurchargeRate(100000, 0.6) === 62500, '100k / 1.6 = 62500');
assert(Calc.formatSurchargePct(0.4) === '40%', 'format 40%');
assert(js.indexOf('sumSurchargeRate') !== -1, 'script applies surcharge');

if (failed) {
  console.error('\n' + failed + ' failed');
  process.exit(1);
}
console.log('\nAll budget calculator checks passed.');
process.exit(0);
