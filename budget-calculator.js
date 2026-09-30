/**
 * Pure 30-day budget → complete-view exposure calculator.
 * Used by pricing simulator UI and node unit tests.
 *
 * IPTV 3사 통합: 월 100만원당 예상 완전시청 노출 15만 회 (각 5만 회)
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BudgetCalculator = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var PRODUCTS = {
    all3: {
      id: 'all3',
      label: 'IPTV 3사 통합 패키지',
      unitPrice: null,
      unitLabel: '100만원당 월 15만회 · 3사 각 5만회',
      minManwon: 100,
      bonus: 'IPTV 3사 동시 송출로 폭넓은 커버리지 제공',
    },
  };

  var MIN_MANWON = 100;
  var MAX_MANWON = 1000;
  var STEP_MANWON = 100;
  var DEFAULT_MANWON = 100;

  /** Contract: 6-month steps (no business ceiling; UI slider cap for usability) */
  var MIN_TERM_MONTHS = 6;
  var MAX_TERM_MONTHS = 36;
  var STEP_TERM_MONTHS = 6;
  var DEFAULT_TERM_MONTHS = 6;

  function getProduct(productId) {
    return PRODUCTS[productId] || PRODUCTS.all3;
  }

  function clampTermMonths(months) {
    var n = Math.round(Number(months) / STEP_TERM_MONTHS) * STEP_TERM_MONTHS;
    if (isNaN(n)) n = DEFAULT_TERM_MONTHS;
    if (n < MIN_TERM_MONTHS) n = MIN_TERM_MONTHS;
    if (n > MAX_TERM_MONTHS) n = MAX_TERM_MONTHS;
    return n;
  }

  function formatTermMonths(months) {
    return clampTermMonths(months) + '개월';
  }

  function minManwonForProduct(productId) {
    var p = getProduct(productId);
    return p.minManwon || MIN_MANWON;
  }

  function clampBudgetManwon(manwon, productId) {
    var min = productId ? minManwonForProduct(productId) : MIN_MANWON;
    var n = Math.round(Number(manwon) / STEP_MANWON) * STEP_MANWON;
    if (isNaN(n)) n = Math.max(DEFAULT_MANWON, min);
    if (n < min) n = min;
    if (n > MAX_MANWON) n = MAX_MANWON;
    return n;
  }

  function manwonToWon(manwon, productId) {
    return clampBudgetManwon(manwon, productId) * 10000;
  }

  /** IPTV 3사 통합: 월 100만원당 예상 완전시청 15만 회 */
  function exposuresAll3(won) {
    return Math.floor(won * 0.15);
  }

  /**
   * @param {number} budgetManwon - monthly budget in 만원
   * @param {string} productId - 'all3'
   * @param {number} [termMonths] - contract length: 6 | 12 | 18 | 24 | 30 | 36 (default 6)
   */
  function calculateExposures(budgetManwon, productId, termMonths) {
    var product = getProduct(productId);
    var manwon = clampBudgetManwon(budgetManwon, product.id);
    var won = manwon * 10000;
    var exposures;
    var term = clampTermMonths(termMonths);

    exposures = exposuresAll3(won);

    return {
      budgetManwon: manwon,
      budgetWon: won,
      productId: product.id,
      productLabel: product.label,
      unitPrice: product.unitPrice,
      unitLabel: product.unitLabel,
      minManwon: product.minManwon || MIN_MANWON,
      bonus: product.bonus || '',
      exposures: exposures,
      termMonths: term,
      totalExposures: exposures * term,
      totalBudgetManwon: manwon * term,
      totalBudgetWon: won * term,
    };
  }

  function formatExposures(n) {
    return Math.floor(Number(n) || 0).toLocaleString('ko-KR');
  }

  function formatManwon(n, productId) {
    return clampBudgetManwon(n, productId).toLocaleString('ko-KR') + '만원';
  }

  /**
   * Pricing-side surcharge toggles (additive rates).
   * Region: premium five districts or no surcharge.
   * Exposures shrink: floor(base / (1 + totalRate)).
   */
  var SURCHARGE_OPTIONS = {};

  var REGION_GRADES_CALC = [
    {
      id: 'premium',
      grade: '할증 지역',
      rate: 0.3,
      rateLabel: '30%',
      areas: '강남, 송파, 서초, 용산, 분당',
    },
  ];

  function getRegionGrade(id) {
    if (!id) return null;
    for (var i = 0; i < REGION_GRADES_CALC.length; i++) {
      if (REGION_GRADES_CALC[i].id === id) return REGION_GRADES_CALC[i];
    }
    return null;
  }

  /**
   * @param {{ region?: string|null }} selection
   * @returns {number} total rate as fraction
   */
  function isAudienceAvailable(budgetManwon) {
    return false;
  }

  function sumSurchargeRate(selection, budgetManwon) {
    var sel = selection || {};
    var total = 0;
    var region = getRegionGrade(sel.region);
    if (region) total += region.rate;
    return Math.round(total * 1000) / 1000;
  }

  function applySurchargeRate(exposures, rate) {
    var n = Math.floor(Number(exposures) || 0);
    var r = Number(rate) || 0;
    if (r <= 0) return n;
    return Math.floor(n / (1 + r));
  }

  function formatSurchargePct(rate) {
    var r = Number(rate) || 0;
    if (r <= 0) return '0%';
    return Math.round(r * 100) + '%';
  }

  /**
   * Human-readable list of active surcharge labels.
   */
  function describeSurcharge(selection, budgetManwon) {
    var sel = selection || {};
    var parts = [];
    var region = getRegionGrade(sel.region);
    if (region) parts.push('지역 ' + region.rateLabel);
    return parts;
  }

  return {
    PRODUCTS: PRODUCTS,
    MIN_MANWON: MIN_MANWON,
    MAX_MANWON: MAX_MANWON,
    STEP_MANWON: STEP_MANWON,
    DEFAULT_MANWON: DEFAULT_MANWON,
    MIN_TERM_MONTHS: MIN_TERM_MONTHS,
    MAX_TERM_MONTHS: MAX_TERM_MONTHS,
    STEP_TERM_MONTHS: STEP_TERM_MONTHS,
    DEFAULT_TERM_MONTHS: DEFAULT_TERM_MONTHS,
    SURCHARGE_OPTIONS: SURCHARGE_OPTIONS,
    REGION_GRADES_CALC: REGION_GRADES_CALC,
    minManwonForProduct: minManwonForProduct,
    clampBudgetManwon: clampBudgetManwon,
    clampTermMonths: clampTermMonths,
    manwonToWon: manwonToWon,
    getProduct: getProduct,
    exposuresAll3: exposuresAll3,
    calculateExposures: calculateExposures,
    formatExposures: formatExposures,
    formatManwon: formatManwon,
    formatTermMonths: formatTermMonths,
    getRegionGrade: getRegionGrade,
    isAudienceAvailable: isAudienceAvailable,
    sumSurchargeRate: sumSurchargeRate,
    applySurchargeRate: applySurchargeRate,
    formatSurchargePct: formatSurchargePct,
    describeSurcharge: describeSurcharge,
  };
});
