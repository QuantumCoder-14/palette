// Run: node tests/test.js
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/\/\/ <<CORE([\s\S]*?)\/\/ CORE>>/);
if (!m) { console.error('CORE block not found'); process.exit(1); }
const api = new Function(m[1] + '; return {parseHex,rgbToHex,rgbToHsl,relativeLuminance,contrastRatio,wcag,ramp};')();
let fails = 0;
const eq = (n, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) {
  fails++; console.log(`FAIL ${n}\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`); } };
const near = (n, got, want, tol = 0.01) => { if (Math.abs(got - want) > tol) {
  fails++; console.log(`FAIL ${n}\n  got  ${got}\n  want ${want}`); } };

eq('hex 6 digits', api.parseHex('#1c4f8f'), {r:28,g:79,b:143});
eq('hex no hash', api.parseHex('1c4f8f'), {r:28,g:79,b:143});
eq('hex 3 digits', api.parseHex('#f00'), {r:255,g:0,b:0});
eq('hex 8 digits drops alpha', api.parseHex('#ff000080'), {r:255,g:0,b:0});
eq('hex invalid', api.parseHex('#ggg'), null);
eq('hex empty', api.parseHex(''), null);
eq('rgb to hex', api.rgbToHex({r:28,g:79,b:143}), '#1c4f8f');
eq('rgb to hex clamps', api.rgbToHex({r:300,g:-5,b:0}), '#ff0000');
eq('red to hsl', api.rgbToHsl({r:255,g:0,b:0}), {h:0,s:100,l:50});
eq('white to hsl', api.rgbToHsl({r:255,g:255,b:255}), {h:0,s:0,l:100});
near('black luminance', api.relativeLuminance({r:0,g:0,b:0}), 0);
near('white luminance', api.relativeLuminance({r:255,g:255,b:255}), 1);
near('black on white', api.contrastRatio({r:0,g:0,b:0},{r:255,g:255,b:255}), 21, 0.01);
near('same colour', api.contrastRatio({r:28,g:79,b:143},{r:28,g:79,b:143}), 1, 0.001);
eq('wcag pass 4.5', api.wcag(4.5).aaNormal, true);
eq('wcag fail 4.49', api.wcag(4.49).aaNormal, false);
eq('wcag aaa 7', api.wcag(7).aaaNormal, true);
eq('wcag large 3', api.wcag(3).aaLarge, true);
eq('ramp length', api.ramp({r:28,g:79,b:143}, 9).length, 9);
eq('ramp ends light', api.ramp({r:28,g:79,b:143}, 9)[0].startsWith('#'), true);
const r = api.ramp({r:128,g:128,b:128}, 5);
eq('ramp is monotonic in brightness', api.relativeLuminance(api.parseHex(r[0])) > api.relativeLuminance(api.parseHex(r[4])), true);

console.log(fails ? `\n${fails} FAILURE(S)` : 'ALL PALETTE TESTS PASSED');
process.exit(fails ? 1 : 0);
