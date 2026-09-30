/**
 * Targeting surcharge criteria — pure data + filter helpers.
 * October policy: region targeting is available in the small-business package;
 * time, channel, and audience targeting require a separate general contract.
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
      criteria: '일반계약에서만 설정 가능 · 계약금 별도 문의',
      rate: '별도 문의',
      rateKind: 'inquiry',
    },
    {
      id: 'channel',
      category: 'channel',
      option: '채널 선택형',
      criteria: '일반계약에서만 설정 가능 · 계약금 별도 문의',
      rate: '별도 문의',
      rateKind: 'inquiry',
    },
    {
      id: 'audience',
      category: 'audience',
      option: '오디언스 타겟팅',
      criteria: '일반계약에서만 설정 가능 · 계약금 별도 문의',
      rate: '별도 문의',
      rateKind: 'inquiry',
    },
    {
      id: 'region',
      category: 'region',
      option: '지역 타겟팅',
      criteria: '강남·송파·서초·용산·분당만 할증',
      rate: '30% / 그 외 0%',
      rateKind: 'regional',
    },
  ];

  var REGION_GRADES = [
    {
      grade: '할증 지역',
      rate: '30%',
      areas: '강남, 송파, 서초, 용산, 분당',
    },
    {
      grade: '그 외 지역',
      rate: '0%',
      areas: '위 5개 지역 이외',
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
