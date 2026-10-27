/* Render this template at 1200 x 630 to images/og-sketch.png after changing it.
   Usage: node sketch-build/social-preview.cjs <output.html>
   The preview reuses the site's artwork, fonts and palette. */
const fs = require('node:fs');
const art = require('./art.cjs');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Oliver T. Williams — sharing image</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@700;800;900&family=Manrope:wght@400;500;600;700&display=swap">
<style>
*{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#f5f3ee;color:#1a2547}
body{position:relative;font-family:Manrope,sans-serif}.copy{position:absolute;left:76px;top:125px;z-index:1}
h1{font:900 100px/.98 'Red Hat Display',sans-serif;letter-spacing:-4px;margin:0 0 29px}
p{font-size:25px;line-height:1.5;margin:0;color:#45506b}.art{position:absolute;width:480px;height:450px;right:26px;top:70px}
.art svg{width:100%;height:100%}.domain{position:absolute;left:76px;bottom:46px;font-size:21px;font-weight:700}
.wave{position:absolute;bottom:0;left:0;width:100%;height:98px}
</style></head><body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><pattern id="ht" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="4.5" cy="4.5" r="1.9" fill="#1a2547"/></pattern></defs></svg>
<div class="copy"><h1>Oliver T.<br>Williams</h1><p>Design, data &amp; AI evaluation</p></div>
<div class="art">${art.anchor.replace('{cls}', '')}</div>
<svg class="wave" viewBox="0 0 1200 98" preserveAspectRatio="none" aria-hidden="true"><path d="M0 32C180-8 330 74 590 39S980 4 1200 40V98H0Z" fill="#e2ebf6"/></svg>
<div class="domain">olivertwilliams.com</div>
</body></html>`;
if (require.main === module) {
  if (!process.argv[2]) throw new Error('Pass the destination HTML path.');
  fs.writeFileSync(process.argv[2], html);
}
module.exports = html;
