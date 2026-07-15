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
assert(Calc.MIN_MANWON === 100 && Calc.MAX_MANWON === 1000, 'range 100–1,000');
assert(Calc.STEP_MANWON === 100, 'step 100만');
assert(Calc.clampBudgetManwon(95) === 100, 'clamp min');
assert(Calc.clampBudgetManwon(1010) === 1000, 'clamp max');
assert(Calc.clampBudgetManwon(240) === 200, 'step round');

// IPTV 3사 통합: 월 100만원당 예상 완전시청 18만 회
const all3At100 = Calc.calculateExposures(100, 'all3');
assert(Calc.minManwonForProduct('all3') === 100, '3사 min 100만');
assert(all3At100.exposures === 180000, '3사 100만 → 180,000');
assert(Calc.calculateExposures(200, 'all3').exposures === 360000, '3사 200만 → 360,000');
assert(Calc.calculateExposures(300, 'all3').exposures === 540000, '3사 300만 → 540,000');
assert(Calc.calculateExposures(500, 'all3').exposures === 900000, '3사 500만 → 900,000');
assert(Calc.calculateExposures(1000, 'all3').exposures === 1800000, '3사 1,000만 → 1,800,000');
assert(Calc.calculateExposures(100, 'legacy').exposures === 180000, 'legacy product falls back to 3사 통합');
assert(Calc.PRODUCTS.all3.label === 'IPTV 3사 통합 패키지', 'full 3사 product label');
assert(Calc.PRODUCTS.all3.unitLabel.indexOf('18만회') !== -1, '3사 unit label is 18만회');

// Labels
assert(all3At100.productLabel === 'IPTV 3사 통합 패키지', '3사 label');
assert(Calc.formatExposures(180000).indexOf('180') !== -1, 'comma format');

// Structure wiring
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
assert(html.indexOf('id="pricing"') !== -1, 'pricing section');
assert(html.indexOf('budget-calculator') !== -1 || html.indexOf('ad-calc') !== -1, 'calculator markup');
assert(html.indexOf('IPTV 3사 통합 패키지') !== -1, '3사 integrated product label');
assert(html.indexOf('KT · SKT · LGU+ 동시 송출') !== -1, 'three-carrier simultaneous delivery subtext');
assert(html.indexOf('pricing-tiers') === -1, 'static package tiers removed');
assert(html.indexOf('이 예산으로 상담 문의') === -1, 'CTA budget contact removed');
assert(
  html.indexOf('TV광고 상담 문의') !== -1 || html.indexOf('패키지 상담') !== -1,
  'CTA package contact'
);
assert(html.indexOf('100만원부터') !== -1 || html.indexOf('월 100만원부터') !== -1, '100만 entry msg');
assert(html.indexOf('예상 완전시청 노출') !== -1 || html.indexOf('예상 노출') !== -1, 'disclaimer monthly');
assert(html.indexOf('6개월 단위') !== -1, 'disclaimer 6-month');
assert(Calc.PRODUCTS.all3.bonus.indexOf('동시 송출') !== -1, '3사 integrated benefit copy');
assert(/src="budget-calculator\.js(\?[^"]*)?"/.test(html), 'loads math module');
assert(js.indexOf('BudgetCalculator.calculateExposures') !== -1, 'script uses real math');

const pricing = html.slice(html.indexOf('id="pricing"'), html.indexOf('id="contact"'));
assert(pricing.indexOf('type="range"') !== -1 || pricing.indexOf('ad-calc__slider') !== -1, 'slider in pricing');
assert(pricing.indexOf('min="100"') !== -1 && pricing.indexOf('max="1000"') !== -1, 'slider min max');
assert(pricing.indexOf('step="100"') !== -1, 'slider step 100');
assert(pricing.indexOf('data-calc-product=') === -1, 'product tab buttons removed');
assert(pricing.indexOf('ad-calc__tabs') === -1, 'product box removed');
assert(/class="ad-calc__product-text">IPTV 3사 통합 패키지<\/strong>/.test(pricing), 'plain-text unified product');
assert(/class="ad-calc__product-subtext">KT · SKT · LGU\+ 동시 송출<\/span>/.test(pricing), 'plain-text carrier subtext');
const budgetTicks = (html.match(/id="calcTicks"[\s\S]*?<\/div>/) || [''])[0];
assert((budgetTicks.match(/<span/g) || []).length === 4, 'four evenly spaced budget tick labels');
assert(budgetTicks.indexOf('--tick-pct:33.333%') !== -1 && budgetTicks.indexOf('400만') !== -1 && budgetTicks.indexOf('1,000만') !== -1, 'budget tick labels use equal real positions');
assert(/#calcTicks\.ad-calc__ticks[\s\S]*?width:\s*calc\(100% - 28px\)/.test(css), 'budget ticks align to the 28px slider thumb');
assert(pricing.indexOf('calcProductLabel') === -1, 'redundant selected-product card removed');
assert(pricing.indexOf('calcUnitLabel') === -1, 'redundant unit-price card removed');

// Contract term slider (6-month steps)
assert(Calc.MIN_TERM_MONTHS === 6, 'min term 6');
assert(Calc.STEP_TERM_MONTHS === 6, 'step term 6');
assert(Calc.DEFAULT_TERM_MONTHS === 6, 'default term 6 months');
assert(Calc.clampTermMonths(6) === 6, 'clamp term 6');
assert(Calc.clampTermMonths(5) === 6, 'step round term');
assert(Calc.clampTermMonths(12) === 12, 'clamp term 12');
assert(Calc.clampTermMonths(36) === 36, 'term up to UI max 36');
const all3At100For6 = Calc.calculateExposures(100, 'all3', 6);
assert(all3At100For6.exposures === 180000, '3사 monthly exposures 180,000');
assert(all3At100For6.termMonths === 6, 'termMonths 6');
assert(all3At100For6.totalExposures === 1080000, '3사 100만 × 6개월 total 1,080,000');
assert(all3At100For6.totalBudgetManwon === 600, '3사 total budget 600만');
const all3At100For12 = Calc.calculateExposures(100, 'all3', 12);
assert(all3At100For12.totalExposures === 2160000, '3사 100만 × 12개월 total 2,160,000');
assert(html.indexOf('id="calcTerm"') !== -1, 'term slider in HTML');
assert(/id="calcTerm"[\s\S]*?min="6"[\s\S]*?step="6"[\s\S]*?value="6"/.test(html), 'term slider starts at 6 in 6-month steps');
const termTicks = (html.match(/id="calcTermTicks"[\s\S]*?<\/div>/) || [''])[0];
assert((termTicks.match(/<span>/g) || []).length === 6, 'six contract-term tick labels');
assert(/#calcTermTicks[\s\S]*?justify-content:\s*space-between\s*!important/.test(css), 'term ticks use slider stop spacing');
assert(/#calcTermTicks > span[\s\S]*?flex:\s*0 0 28px\s*!important/.test(css), 'term tick centers match the 28px slider thumb');
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
assert(Calc.applySurchargeRate(180000, 0) === 180000, 'no rate keeps exposures');
assert(Calc.applySurchargeRate(180000, 0.6) === 112500, '180k / 1.6 = 112500');
assert(Calc.formatSurchargePct(0.4) === '40%', 'format 40%');
assert(js.indexOf('sumSurchargeRate') !== -1, 'script applies surcharge');

if (failed) {
  console.error('\n' + failed + ' failed');
  process.exit(1);
}
console.log('\nAll budget calculator checks passed.');
process.exit(0);
