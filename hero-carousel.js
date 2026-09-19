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

  function createSlide(title, youtubeId, duration, desc) {
    var type = title.indexOf('브랜드광고') === 0 ? '브랜드' : title.indexOf('행사광고') === 0 ? '행사' : '제품';
    var defaultDesc =
      type === '브랜드'
        ? '브랜드의 분위기와 강점을 선명하게 담은 스토리텔링 AI CF'
        : type === '행사'
          ? '행사의 분위기와 핵심 메시지를 생생하게 전달하는 AI CF'
          : '제품의 핵심 특징과 사용 가치를 직관적으로 전달하는 AI CF';
    return {
      type: type,
      title: title,
      desc: desc || defaultDesc,
      duration: duration,
      youtubeId: youtubeId,
    };
  }

  // Official @aimagic181 video catalog, newest first (55 videos, checked 2026-09-20).
  var SLIDES = [
    createSlide('제품광고 올리비아 더올리어 S1', '7_jqN3A7QrE', '16초'),
    createSlide('제품광고 리오넥스 (RIONEX)', 'hMqH4CTQttM', '16초'),
    createSlide('브랜드광고 브랜드 어워즈', '2j8uBR435Pg', '31초'),
    createSlide('제품광고 피피랙', 'FejoZJSZgTc', '31초'),
    createSlide('제품광고 에스지데일리멀티팩', '2YgBN89HzxQ', '31초'),
    createSlide('제품광고 리메모피에스 영문버전', 'p-Z87xNajbU', '16초'),
    createSlide('브랜드광고 감성주택', 'vVRYGupRGNE', '16초', '공간과 라이프스타일의 감성을 담은 브랜드 AI CF'),
    createSlide('브랜드광고 더브릿지', 'UVZOkBExinQ', '31초', '브랜드 메시지를 선명하게 담은 스토리텔링 AI CF'),
    createSlide('제품광고 미즈허브 비타민세럼', 'fO7mEll3Leg', '16초', '뷰티 제품의 핵심 효능을 감각적으로 전달하는 AI CF'),
    createSlide('제품광고 덴티스테', 'nIdOks3lYWo', '16초', '제품의 핵심 장점을 직관적으로 각인하는 AI CF'),
    createSlide('제품광고 낚시 릴', 'MfEZEeKwoEw', '18초'),
    createSlide('브랜드광고 부커스', 'wLnrWxpw_KI', '16초'),
    createSlide('브랜드광고 캠핑장', 'gEf2V_nKXiM', '18초'),
    createSlide('브랜드광고 샤브보트R', '8j4rYB8eMmc', '16초', '브랜드 가치와 이미지를 전달하는 스토리텔링 AI CF'),
    createSlide('제품광고 디에스 시카멜라리페어 크림', '0ToCzQUdCDo', '16초', '화장품 제품 특성을 강조한 프리미엄 AI CF'),
    createSlide('제품광고 리메모피에스', 'G2lDktSjURY', '16초', '감성적인 브랜드 이미지를 전달하는 AI CF'),
    createSlide('브랜드광고 병원동행서비스', 'mi_ikAotG3c', '16초', '신뢰감 있는 서비스 브랜딩 AI CF'),
    createSlide('브랜드광고 머니가드', 'HrUkB2OzNoM', '16초', '금융·케어 브랜드 톤의 프리미엄 AI CF'),
    createSlide('브랜드광고 CamCube', 'NZ8BtMKu0XE', '16초', '제품 세계관을 보여주는 브랜드 AI CF'),
    createSlide('제품광고 물티슈 시치미쓱', 's3Pf_cABpjE', '16초', '제품 장점을 직관적으로 각인하는 AI CF'),
    createSlide('제품광고 전기삼륜차', 'KwgesSgkj4c', '16초', '모빌리티 제품 특장점을 강조한 AI CF'),
    createSlide('제품광고 르오브 2in1 UV 전기모기채', 'jexf0BNc7iw', '16초', '기능성 생활가전의 장점을 보여주는 AI CF'),
    createSlide('제품광고 손소독제', 'Y6xW5nBGv3I', '16초'),
    createSlide('제품광고 펫드라이룸', 'O5edBXQ80l8', '16초'),
    createSlide('행사광고 K pop Concert', 'VxEu0ozTJmA', '27초'),
    createSlide('제품광고 생수', 'z1lg8VQPhU8', '16초'),
    createSlide('제품광고 화장품 립스틱', 'LUqMLQrMW1A', '16초'),
    createSlide('제품광고 자동차', 'nUS5m8PRmoE', '21초'),
    createSlide('제품광고 치킨', '9ViPUcaFgRQ', '29초'),
    createSlide('제품광고 화장품 토너', 'TYpQ6hMUpCE', '17초'),
    createSlide('제품광고 눈 건강기능식품', 'NJk8gX6Tskw', '23초'),
    createSlide('브랜드광고 등산 아웃도어 매장', 'OuQa3DKodso', '16초'),
    createSlide('브랜드광고 음식점 중식', '-AEi7raoRCo', '18초'),
    createSlide('브랜드광고 헬스장', 'eEgmQpp-4sI', '31초'),
    createSlide('브랜드광고 안과병원', '1il3xXNnyRw', '15초'),
    createSlide('제품광고 동물용 미스트', '8IY3jQB2NVw', '16초'),
    createSlide('브랜드광고 프랜차이즈 피자', 'LqMtjgKgaEI', '30초'),
    createSlide('제품광고 음료', '8Qfgd0AdR9o', '30초'),
    createSlide('브랜드광고 토리야', '6REG7_HWdCg', '16초', '브랜드 무드를 살린 스토리텔링 AI CF'),
    createSlide('제품광고 도라지 · 배 · 꿀 꿀목', 'XPCIuqyUwZI', '16초', '식품 제품의 핵심 가치를 전달하는 AI CF'),
    createSlide('제품광고 락K-1 코앤면역', 'FR8Q9qalmNM', '16초', '건강기능식품 제품 포인트를 압축한 AI CF'),
    createSlide('브랜드광고 꽃집', 'tgYakr4YcSM', '16초'),
    createSlide('브랜드광고 PC방', 'aO_o_8ejaqY', '18초'),
    createSlide('브랜드광고 봉안당', 'BkGrYHecNYs', '19초'),
    createSlide('브랜드광고 카페2', 'Jp_D-olnhiU', '19초'),
    createSlide('브랜드광고 고깃집', '8pDk4itvGwU', '16초'),
    createSlide('브랜드광고 횟집', 'z1qybRpOhto', '16초'),
    createSlide('브랜드광고 스튜디오', 'QAKCAJExDFI', '15초'),
    createSlide('브랜드광고 양복점', 'O1IiyzPMCkU', '17초'),
    createSlide('브랜드광고 자동세차', 'C70vXikLnxY', '17초'),
    createSlide('전자제품광고 로봇청소기', '3aZhfVY43Zw', '17초'),
    createSlide('제품광고 무알콜 맥주', '3aRZoaRxZOQ', '18초'),
    createSlide('제품광고 에너지드링크', 'Dpo4vktreOM', '17초'),
    createSlide('전자제품광고 헤드셋', 'frWVlY0Jeps', '17초'),
    createSlide('브랜드광고 인테리어', '7pXeLqpXT14', '17초'),
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
    // "제품광고 덴티스테" / "행사광고 K pop Concert" → category + name
    var m = String(title || '').match(/^(\S*광고)\s+(.+)$/);
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
      duration: slide.duration,
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
