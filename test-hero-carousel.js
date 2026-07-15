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
  'fO7mEll3Leg',
  'UVZOkBExinQ',
  'vVRYGupRGNE',
  'mi_ikAotG3c',
  'G2lDktSjURY',
  'HrUkB2OzNoM',
  'NZ8BtMKu0XE',
  's3Pf_cABpjE',
  'KwgesSgkj4c',
  'jexf0BNc7iw',
  '6REG7_HWdCg',
  'XPCIuqyUwZI',
  'FR8Q9qalmNM',
];

assert(HeroCarousel.slideCount() >= 10, 'at least 10 slides');
const ids = HeroCarousel.SLIDES.map((s) => s.youtubeId);
requiredIds.forEach((id) => {
  assert(ids.indexOf(id) !== -1, 'catalog includes ' + id);
});

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
assert(html.indexOf('portfolio-carousel') !== -1, 'portfolio carousel markup');
assert(html.indexOf('id="portfolioPrev"') !== -1 && html.indexOf('id="portfolioNext"') !== -1, 'portfolio arrows');
assert(html.indexOf('portfolioIndex') === -1, 'page index removed from portfolio');
assert(js.indexOf('buildPortfolioCards') !== -1, 'portfolio built from catalog');
assert(js.indexOf('normalizePortfolioPos') !== -1, 'infinite loop normalize present');
assert(js.indexOf('HeroCarousel.nextIndex') !== -1, 'hero uses nextIndex');
assert(html.indexOf('id="heroMediaCategory">AI CF</p>') !== -1, 'hero category defaults to AI CF');
assert(js.indexOf("heroMediaCategory.textContent = 'AI CF'") !== -1, 'hero category remains AI CF across slides');
assert(html.indexOf('id="heroPlayerHost"') !== -1, 'hero inline player host');
assert(/<button[^>]*id="heroPlay"/.test(html), 'hero play is an in-page button');
assert(js.indexOf('www.youtube-nocookie.com/embed/') !== -1, 'hero uses privacy-enhanced inline YouTube embed');
assert(js.indexOf("heroPlay.addEventListener('click', playHeroVideo)") !== -1, 'hero play starts inline video');
assert(js.indexOf('stopHeroVideo();') !== -1, 'slide change stops active video');
assert(/src="hero-carousel\.js(\?[^"]*)?"/.test(html), 'loads hero-carousel.js');

if (failed) {
  console.error('\n' + failed + ' failed');
  process.exit(1);
}
console.log('\nAll catalog/carousel checks passed. Total slides:', HeroCarousel.slideCount());
process.exit(0);
