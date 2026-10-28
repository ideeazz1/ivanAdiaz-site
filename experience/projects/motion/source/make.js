// Usage: node make.js <page.html> <out-name> <seconds>
// Writes <out-name>.png (final frame, 2x) and <out-name>.mp4 (30 fps, 2x).
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const [page, out, secs] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 800 }, deviceScaleFactor: 2 });
  const url = 'file://' + process.cwd() + '/' + page;
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  await p.screenshot({ path: out + '.png' });
  if (secs) {
    await p.goto(url + '?anim', { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.evaluate(() => document.getAnimations().forEach(a => a.pause()));
    const dir = 'fr_' + out; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
    for (let i = 0; i < 30 * secs; i++) {
      const t = i * 1000 / 30;
      await p.evaluate(t => { document.getAnimations().forEach(a => a.currentTime = t); window.setT(t / 1000); }, t);
      await p.screenshot({ path: `${dir}/${String(i).padStart(4, '0')}.png` });
    }
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '30', '-i', `${dir}/%04d.png`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'slow', '-movflags', '+faststart', out + '.mp4']);
    fs.rmSync(dir, { recursive: true, force: true });
  }
  await b.close();
})();
