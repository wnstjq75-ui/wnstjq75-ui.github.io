/**
 * Shared AI TV CF video catalog + pure carousel navigation.
 * Used by hero showcase and portfolio carousel.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.HeroCarousel = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SLIDES = [
    {
      type: '제품',
      title: '제품광고 미즈허브 비타민세럼',
      desc: '뷰티 제품의 핵심 효능을 감각적으로 전달하는 AI CF',
      youtubeId: 'fO7mEll3Leg',
    },
    {
      type: '브랜드',
      title: '브랜드광고 더브릿지',
      desc: '브랜드 메시지를 선명하게 담은 스토리텔링 AI CF',
      youtubeId: 'UVZOkBExinQ',
    },
    {
      type: '브랜드',
      title: '브랜드광고 감성주택',
      desc: '공간과 라이프스타일의 감성을 담은 브랜드 AI CF',
      youtubeId: 'vVRYGupRGNE',
    },
    {
      type: '브랜드',
      title: '브랜드광고 병원동행서비스',
      desc: '신뢰감 있는 서비스 브랜딩 AI CF',
      youtubeId: 'mi_ikAotG3c',
    },
    {
      type: '브랜드',
      title: '브랜드광고 리메모피에스',
      desc: '감성적인 브랜드 이미지를 전달하는 AI CF',
      youtubeId: 'G2lDktSjURY',
    },
    {
      type: '브랜드',
      title: '브랜드광고 머니가드',
      desc: '금융·케어 브랜드 톤의 프리미엄 AI CF',
      youtubeId: 'HrUkB2OzNoM',
    },
    {
      type: '브랜드',
      title: '브랜드광고 CamCube',
      desc: '제품 세계관을 보여주는 브랜드 AI CF',
      youtubeId: 'NZ8BtMKu0XE',
    },
    {
      type: '제품',
      title: '제품광고 물티슈 시치미쓱',
      desc: '제품 장점을 직관적으로 각인하는 AI CF',
      youtubeId: 's3Pf_cABpjE',
    },
    {
      type: '제품',
      title: '제품광고 전기삼륜차',
      desc: '모빌리티 제품 특장점을 강조한 AI CF',
      youtubeId: 'KwgesSgkj4c',
    },
    {
      type: '제품',
      title: '제품광고 르오브 2in1 UV 전기모기채',
      desc: '기능성 생활가전의 장점을 보여주는 AI CF',
      youtubeId: 'jexf0BNc7iw',
    },
    {
      type: '브랜드',
      title: '브랜드광고 토리야',
      desc: '브랜드 무드를 살린 스토리텔링 AI CF',
      youtubeId: '6REG7_HWdCg',
    },
    {
      type: '제품',
      title: '제품광고 도라지 · 배 · 꿀 꿀목',
      desc: '식품 제품의 핵심 가치를 전달하는 AI CF',
      youtubeId: 'XPCIuqyUwZI',
    },
    {
      type: '제품',
      title: '제품광고 락K-1 코앤면역',
      desc: '건강기능식품 제품 포인트를 압축한 AI CF',
      youtubeId: 'FR8Q9qalmNM',
    },
    {
      type: '제품',
      title: '제품광고 덴티스테',
      desc: '제품의 핵심 장점을 직관적으로 각인하는 AI CF',
      youtubeId: 'nIdOks3lYWo',
    },
    {
      type: '브랜드',
      title: '브랜드광고 샤브보트R',
      desc: '브랜드 가치와 이미지를 전달하는 스토리텔링 AI CF',
      youtubeId: '8j4rYB8eMmc',
    },
    {
      type: '제품',
      title: '제품광고 디에스 시카멜라리페어 크림',
      desc: '화장품 제품 특성을 강조한 프리미엄 AI CF',
      youtubeId: '0ToCzQUdCDo',
    },
  ];

  function thumbUrl(youtubeId) {
    return 'https://img.youtube.com/vi/' + youtubeId + '/hqdefault.jpg';
  }

  function watchUrl(youtubeId) {
    return 'https://www.youtube.com/watch?v=' + youtubeId;
  }

  function slideCount() {
    return SLIDES.length;
  }

  function normalizeIndex(index) {
    var n = SLIDES.length;
    return ((index % n) + n) % n;
  }

  function nextIndex(index) {
    return (normalizeIndex(index) + 1) % SLIDES.length;
  }

  function prevIndex(index) {
    var n = SLIDES.length;
    return (normalizeIndex(index) - 1 + n) % n;
  }

  function splitTitle(title) {
    // "제품광고 덴티스테" / "브랜드광고 병원동행서비스" → category + brand
    var m = String(title || '').match(/^(제품광고|브랜드광고)\s+(.+)$/);
    if (m) {
      return { category: m[1], brand: m[2] };
    }
    return { category: '', brand: title || '' };
  }

  function getSlide(index) {
    var slide = SLIDES[normalizeIndex(index)];
    var parts = splitTitle(slide.title);
    return {
      type: slide.type,
      title: slide.title,
      category: parts.category,
      brand: parts.brand,
      desc: slide.desc,
      youtubeId: slide.youtubeId,
      thumb: thumbUrl(slide.youtubeId),
      href: watchUrl(slide.youtubeId),
    };
  }

  return {
    SLIDES: SLIDES,
    slideCount: slideCount,
    nextIndex: nextIndex,
    prevIndex: prevIndex,
    getSlide: getSlide,
    thumbUrl: thumbUrl,
    watchUrl: watchUrl,
  };
});
