/**
 * Catalog + nav checks for shared HeroCarousel (hero + portfolio).
 * Run: node test-hero-carousel.js
 */
'use strict';

const path = require('path');
const fs = require('fs');
const HeroCarousel = require(path.join(__dirname, 'hero-carousel.js'));

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg);
    failed++;
  } else {
    console.log('PASS:', msg);
  }
}

const requiredIds = [
  '7_jqN3A7QrE',
  'hMqH4CTQttM',
  '2j8uBR435Pg',
  'FejoZJSZgTc',
  '2YgBN89HzxQ',
  'p-Z87xNajbU',
  'vVRYGupRGNE',
  'UVZOkBExinQ',
  'fO7mEll3Leg',
  'nIdOks3lYWo',
  'MfEZEeKwoEw',
  'wLnrWxpw_KI',
  'gEf2V_nKXiM',
  '8j4rYB8eMmc',
  '0ToCzQUdCDo',
  'G2lDktSjURY',
  'mi_ikAotG3c',
  'HrUkB2OzNoM',
  'NZ8BtMKu0XE',
  's3Pf_cABpjE',
  'KwgesSgkj4c',
  'jexf0BNc7iw',
  'Y6xW5nBGv3I',
  'O5edBXQ80l8',
  'VxEu0ozTJmA',
  'z1lg8VQPhU8',
  'LUqMLQrMW1A',
  'nUS5m8PRmoE',
  '9ViPUcaFgRQ',
  'TYpQ6hMUpCE',
  'NJk8gX6Tskw',
  'OuQa3DKodso',
  '-AEi7raoRCo',
  'eEgmQpp-4sI',
  '1il3xXNnyRw',
  '8IY3jQB2NVw',
  'LqMtjgKgaEI',
  '8Qfgd0AdR9o',
  '6REG7_HWdCg',
  'XPCIuqyUwZI',
  'FR8Q9qalmNM',
  'tgYakr4YcSM',
  'aO_o_8ejaqY',
  'BkGrYHecNYs',
  'Jp_D-olnhiU',
  '8pDk4itvGwU',
  'z1qybRpOhto',
  'QAKCAJExDFI',
  'O1IiyzPMCkU',
  'C70vXikLnxY',
  '3aZhfVY43Zw',
  '3aRZoaRxZOQ',
  'Dpo4vktreOM',
  'frWVlY0Jeps',
  '7pXeLqpXT14',
];

assert(HeroCarousel.slideCount() === 55, 'catalog matches all 55 official channel videos');
const ids = HeroCarousel.SLIDES.map((s) => s.youtubeId);
assert(new Set(ids).size === ids.length, 'catalog has no duplicate video IDs');
requiredIds.forEach((id) => {
  assert(ids.indexOf(id) !== -1, 'catalog includes ' + id);
});
assert(HeroCarousel.SLIDES.every((slide) => slide.desc.indexOf('AI CF') !== -1), 'all hero and showcase descriptions use AI CF');
assert(HeroCarousel.SLIDES.every((slide) => slide.desc.indexOf('AI TV CF') === -1), 'legacy AI TV CF wording removed from descriptions');
assert(HeroCarousel.SLIDES.every((slide) => /^\d+초$/.test(slide.duration)), 'every video has an official duration');

let i = 0;
for (let step = 0; step < HeroCarousel.slideCount(); step++) {
  i = HeroCarousel.nextIndex(i);
}
assert(i === 0, 'next wraps full cycle');

i = 0;
i = HeroCarousel.prevIndex(i);
assert(i === HeroCarousel.slideCount() - 1, 'prev wraps to last');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
const heroHtml = html.slice(html.indexOf('id="hero"'), html.indexOf('id="about"'));
const showcaseHtml = html.slice(html.indexOf('id="aicf"'), html.indexOf('id="report"'));
assert(heroHtml.indexOf('AI TV CF') === -1 && heroHtml.indexOf('제품광고') === -1 && heroHtml.indexOf('브랜드광고') === -1, 'hero visible copy is standardized to AI CF');
assert(showcaseHtml.indexOf('AI TV CF') === -1 && showcaseHtml.indexOf('제품광고') === -1 && showcaseHtml.indexOf('브랜드광고') === -1, 'showcase visible copy is standardized to AI CF');
assert(html.indexOf('portfolio-carousel') !== -1, 'portfolio carousel markup');
assert(html.indexOf('id="portfolioPrev"') !== -1 && html.indexOf('id="portfolioNext"') !== -1, 'portfolio arrows');
assert(html.indexOf('portfolioIndex') === -1, 'page index removed from portfolio');
assert(js.indexOf('buildPortfolioCards') !== -1, 'portfolio built from catalog');
assert(js.indexOf("'AI CF · ' + (s.brand || s.title)") !== -1, 'portfolio titles use AI CF label');
assert(js.indexOf('🎬 AI CF') !== -1, 'portfolio meta uses AI CF label');
assert(html.indexOf('실제 AI CF 제작 사례') !== -1, 'showcase note uses AI CF label');
assert(js.indexOf('normalizePortfolioPos') !== -1, 'infinite loop normalize present');
assert(js.indexOf('HeroCarousel.nextIndex') !== -1, 'hero uses nextIndex');
assert(html.indexOf('id="heroMediaCategory">AI CF</p>') !== -1, 'hero category defaults to AI CF');
assert(js.indexOf("heroMediaCategory.textContent = 'AI CF'") !== -1, 'hero category remains AI CF across slides');
assert(html.indexOf('id="heroPlayerHost"') !== -1, 'hero inline player host');
assert(/<button[^>]*id="heroPlay"/.test(html), 'hero play is an in-page button');
assert(js.indexOf('www.youtube-nocookie.com/embed/') !== -1, 'hero uses privacy-enhanced inline YouTube embed');
assert(js.indexOf("heroPlay.addEventListener('click', playHeroVideo)") !== -1, 'hero play starts inline video');
assert(js.indexOf('stopHeroVideo();') !== -1, 'slide change stops active video');
assert(js.indexOf('escapeHtml(s.duration)') !== -1, 'portfolio renders each official video duration');
assert(/src="hero-carousel\.js(\?[^"]*)?"/.test(html), 'loads hero-carousel.js');

if (failed) {
  console.error('\n' + failed + ' failed');
  process.exit(1);
}
console.log('\nAll catalog/carousel checks passed. Total slides:', HeroCarousel.slideCount());
process.exit(0);
