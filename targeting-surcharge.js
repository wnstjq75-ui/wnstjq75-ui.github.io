/**
 * Targeting surcharge criteria — pure data + filter helpers.
 * Categories: all | time | channel | region | audience
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TargetingSurcharge = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FILTERS = [
    { id: 'time', label: '시간' },
    { id: 'channel', label: '채널' },
    { id: 'region', label: '지역' },
    { id: 'audience', label: '오디언스' },
  ];

  var ROWS = [
    {
      id: 'time',
      category: 'time',
      option: '시간 선택형',
      criteria: '연속하는 8시간 이상 선택하여 송출',
      rate: '20%',
      rateKind: 'fixed',
    },
    {
      id: 'channel',
      category: 'channel',
      option: '채널 선택형',
      criteria: '7개 이상의 채널을 선택하여 송출',
      rate: '40%',
      rateKind: 'fixed',
    },
    {
      id: 'audience',
      category: 'audience',
      option: '오디언스 타겟팅',
      criteria: '월 400만원 이상 계약 시 적용 가능',
      rate: '무상',
      rateKind: 'conditional-free',
    },
    {
      id: 'region',
      category: 'region',
      option: '지역 타겟팅',
      criteria: '지역 등급별 차등 적용',
      rate: '등급별 적용',
      rateKind: 'tiered',
    },
  ];

  var REGION_GRADES = [
    {
      grade: 'S급',
      rate: '40%',
      areas: '강남구, 송파구, 서초구',
    },
    {
      grade: 'A급',
      rate: '30%',
      areas: '광진구, 분당구, 일산 서구·동구, 부산 해운대구, 대구 달서구, 화성시, 인천 연수구',
    },
    {
      grade: 'B급',
      rate: '20%',
      areas: '강동구, 노원구, 천안시, 부천시, 광명시, 김포시, 수원 영통·장안·팔달구, 용인시',
    },
    {
      grade: 'C급',
      rate: '0%',
      areas: '시·군·구 기준 A·B등급 제외 지역',
    },
    {
      grade: 'D급',
      rate: '0%',
      areas: '서울특별시·도·광역시 단위만 선택 시',
    },
  ];

  /**
   * @param {string} filterId
   * @param {Array} rows
   * @returns {Array} filtered rows (does not mutate input)
   */
  function filterRows(filterId, rows) {
    var list = rows || ROWS;
    var id = filterId || 'time';
    return list.filter(function (row) {
      return row.category === id;
    });
  }

  function isRowVisible(filterId, rowCategory) {
    var id = filterId || 'time';
    return rowCategory === id;
  }

  function shouldShowRegionGrades(filterId) {
    return (filterId || 'time') === 'region';
  }

  return {
    FILTERS: FILTERS,
    ROWS: ROWS,
    REGION_GRADES: REGION_GRADES,
    filterRows: filterRows,
    isRowVisible: isRowVisible,
    shouldShowRegionGrades: shouldShowRegionGrades,
  };
});
