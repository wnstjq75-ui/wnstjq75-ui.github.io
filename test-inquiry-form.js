'use strict';

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

let failed = 0;
function assert(condition, message) {
  if (condition) {
    console.log('PASS:', message);
  } else {
    console.error('FAIL:', message);
    failed += 1;
  }
}

const form = (html.match(/<form[\s\S]*?id="inquiryForm"[\s\S]*?<\/form>/) || [''])[0];

assert(form.length > 0, 'inquiry form exists');
assert(/formsubmit\.co\/ajax\/mkt@openxgroup\.co\.kr/.test(form), 'email delivery endpoint');
assert(/name="기업명"/.test(form), 'company field');
assert(/name="담당자명"/.test(form), 'contact name field');
assert(/name="휴대폰 번호"/.test(form), 'phone field');
assert(/name="email"/.test(form), 'email field');
assert(/name="기업 홈페이지"/.test(form), 'website field');
assert(/name="희망 지역"/.test(form), 'region field');
assert(/name="희망 타겟팅"/.test(form), 'targeting field');
assert((form.match(/name="희망 매체"/g) || []).length === 4, 'media choices');
assert((form.match(/name="광고 기간"/g) || []).length === 4, 'advertising period choices');
assert(/name="월 예산"/.test(form), 'monthly budget choices');
assert(/개인정보 수집 및 이용 동의/.test(form) && /required/.test(form), 'required privacy consent');
assert(/name="_honey"/.test(form), 'spam honeypot');
assert((form.match(/data-inquiry-step=/g) || []).length === 2, 'two guided steps');
assert(/id="inquiryPrev"/.test(form) && /id="inquiryNext"/.test(form), 'previous and next controls');
assert(/role="progressbar"/.test(form) && /id="inquiryProgressFill"/.test(form), 'step progress indicator');
assert(/id="inquirySubmit"/.test(form) && /상담 신청 제출하기/.test(form), 'final submit action');
assert(/id="inquirySuccess"/.test(form), 'submission completion screen');
assert(/new FormData\(inquiryForm\)/.test(js), 'form payload handling');
assert(/fetch\(inquiryForm\.action/.test(js), 'AJAX submission');
assert(/renderInquiryStep/.test(js) && /validateInquiryStep/.test(js), 'step navigation and validation');
assert(/#inquiryNext\[hidden\][\s\S]*#inquirySubmit\[hidden\][\s\S]*display:\s*none\s*!important/.test(css), 'only the active step action is visible');
assert(/inquirySuccess\.hidden = false/.test(js), 'success feedback');
assert(/@media \(max-width: 620px\)/.test(css) && /\.inquiry-wizard__step/.test(css), 'responsive wizard styles');

if (failed) {
  console.error(`\n${failed} inquiry form checks failed.`);
  process.exit(1);
}

console.log('\nAll inquiry form checks passed.');
