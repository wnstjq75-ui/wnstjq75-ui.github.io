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
assert(/api\.web3forms\.com\/submit/.test(form), 'Web3Forms email delivery endpoint');
assert(/name="access_key" value="ad296e91-b04f-49ac-80f4-175036e24fa7"/.test(form), 'Web3Forms access key');
assert(/name="subject" value="\[IPTV 광고 상담\] 홈페이지 신규 문의"/.test(form), 'email subject');
assert(/name="from_name" value="오픈엑스 IPTV 광고 상담"/.test(form), 'email sender name');
assert(!/name="_next"/.test(form), 'no external success redirect');
assert(/name="기업명"/.test(form), 'company field');
assert(/name="담당자명"/.test(form), 'contact name field');
assert(/name="휴대폰 번호"/.test(form), 'phone field');
assert(/name="email"/.test(form), 'email field');
assert(/name="기업 홈페이지"/.test(form), 'website field');
assert(/name="희망 지역"/.test(form), 'region field');
assert(/name="기타 문의사항"/.test(form), 'additional inquiry field');
assert((form.match(/name="희망 타겟팅"/g) || []).length === 3, 'three targeting choices');
assert(/value="오디언스"/.test(form) && /value="채널"/.test(form) && /value="시간"/.test(form), 'audience channel time targeting');
assert(!/희망 매체/.test(form + js), 'media choices removed');
assert((form.match(/name="광고 기간"/g) || []).length === 4, 'advertising period choices');
assert(/type="number" name="월 예산" min="100" step="10"/.test(form), 'monthly budget input');
assert(/개인정보 수집 및 이용 동의/.test(form) && /required/.test(form), 'required privacy consent');
assert(/type="checkbox" name="botcheck"/.test(form), 'Web3Forms spam honeypot');
assert((form.match(/data-inquiry-step=/g) || []).length === 3, 'three guided steps');
assert(/id="inquiryPrev"/.test(form) && /id="inquiryNext"/.test(form), 'previous and next controls');
assert(/role="progressbar"/.test(form) && /aria-valuemax="3"/.test(form) && /id="inquiryProgressFill"/.test(form), 'three-step progress indicator');
assert(/id="inquirySubmit"/.test(form) && /상담 신청 제출하기/.test(form), 'final submit action');
assert(/id="inquirySuccess"/.test(form), 'submission completion screen');
assert(/id="inquiryFallback"/.test(form) && /id="inquiryRetry"/.test(form), 'in-page outage fallback');
assert(/id="inquiryMailFallback"/.test(form) && /mailto:mkt@openxgroup\.co\.kr/.test(form), 'email fallback');
assert(/buildInquiryPayload/.test(js), 'form payload handling');
assert(/payload\['월 예산'\] = `\$\{monthlyBudget\.value\}만원`/.test(js), 'monthly budget email formatting');
assert(/checkedTargeting/.test(js) && /checkedTargeting\.map/.test(js), 'multiple targeting values are joined');
assert(/fetch\(inquiryForm\.action/.test(js) && /application\/json/.test(js), 'in-page AJAX submission');
assert(/retryDelays = \[0, 1200, 2800\]/.test(js) && /AbortController/.test(js), 'automatic retries with timeout');
assert(/showInquiryFallback/.test(js) && /buildInquiryMailto/.test(js), 'failure keeps the user on-page with a mail fallback');
assert(!/FormSubmit|formsubmit\.co/.test(html + js), 'legacy FormSubmit integration removed');
assert(/Web3Forms 서비스를 통해 처리/.test(form), 'privacy notice names the active delivery service');
assert(!/\.disabled = true; \}\);/.test(js), 'form values stay enabled and preserved');
assert(/renderInquiryStep/.test(js) && /validateInquiryStep/.test(js), 'step navigation and validation');
assert(/#inquiryNext\[hidden\][\s\S]*#inquirySubmit\[hidden\][\s\S]*display:\s*none\s*!important/.test(css), 'only the active step action is visible');
assert(/inquirySuccess\.hidden = false/.test(js), 'success feedback');
assert(/@media \(max-width: 620px\)/.test(css) && /\.inquiry-wizard__step/.test(css), 'responsive wizard styles');

if (failed) {
  console.error(`\n${failed} inquiry form checks failed.`);
  process.exit(1);
}

console.log('\nAll inquiry form checks passed.');
