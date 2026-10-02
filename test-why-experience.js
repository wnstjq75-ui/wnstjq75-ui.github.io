const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Repeated sales sections have been consolidated. Critical budget information stays visible.
const flow = ['hero', 'about', 'pricing', 'aicf', 'award-benefit', 'campaign-guide', 'faq', 'contact'];
for (let i = 1; i < flow.length; i++) {
  assert.ok(html.indexOf(`id="${flow[i - 1]}"`) < html.indexOf(`id="${flow[i]}"`), `reading order: ${flow[i]}`);
}
assert.doesNotMatch(html, /id="benefits"|id="solution"/);
const guidance = [...html.matchAll(/<details class="campaign-detail">([\s\S]*?)<\/details>/g)];
assert.equal(guidance.length, 3);
for (const id of ['targeting', 'product', 'report']) {
  assert.ok(guidance.some(m => m[1].includes(`id="${id}"`)), `${id} remains accessible in native guidance`);
}
assert.equal((html.match(/class="award-benefit__card"/g) || []).length, 7);
assert.equal((html.match(/<details class="faq-item">/g) || []).length, 13);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(ids).size, ids.length, 'no duplicate anchors');
for (const link of html.matchAll(/href="#([^"\s]+)"/g)) {
  assert.ok(ids.includes(link[1]), `internal link resolves: ${link[1]}`);
}
console.log('Compact landing flow and link checks passed.');
