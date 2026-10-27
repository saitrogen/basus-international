// Firefox and WebKit smoke tests. Install Playwright and its browser builds first.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { firefox, webkit } = require('playwright');
(async () => {
  const results = [];
  const origin = process.env.BASUS_TEST_URL || 'http://127.0.0.1:8766';
  for (const engine of [firefox, webkit]) {
    const browser = await engine.launch({ headless: true });
    try {
      const page = await browser.newPage({ reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      for (const width of [1440, 820, 390, 320]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(origin);
        await page.evaluate(() => document.fonts.ready);
        for (const image of await page.locator('img').all()) {
        await image.scrollIntoViewIfNeeded();
        await page.waitForFunction(element => element.complete && element.naturalWidth > 0, await image.elementHandle());
      }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${engine.name()} ${width}px overflow`);
        assert.equal(await page.evaluate(() => [...document.images].some(image => !image.complete || !image.naturalWidth)), false);
        if (width <= 1100) {
          await page.locator('#burger').click();
          assert.equal(await page.locator('#nav-mobile').isVisible(), true);
          await page.keyboard.press('Escape');
          assert.equal(await page.locator('#nav-mobile').isVisible(), false);
        }
        await page.locator('[data-product]').first().click();
        assert.equal(await page.locator('#product').inputValue(), 'Custom Copper Busbars');
        await page.locator('#form-submit').click();
        assert.equal(await page.locator('#email-draft').isVisible(), false);
        await page.locator('#name').fill('Procurement Review');
        await page.locator('#email').fill('buyer@example.com');
        await page.locator('#message').fill('Drawing Rev A. ETP copper. 250 units. Target delivery and documentation to discuss.');
        await page.locator('#form-submit').click();
        assert.equal(await page.locator('#email-draft').isVisible(), true);
        assert.match(await page.locator('#open-email').getAttribute('href'), /^mailto:info@basusinternational.com\?/);
        await page.screenshot({ path: `output/playwright/${engine.name()}-${width}-draft.png` });
        results.push(`${engine.name()} ${width}px: layout, fonts, images, menu, product selection, validation and email draft passed`);
      }
      assert.deepEqual(errors, []);
    } finally { await browser.close(); }
  }
  fs.writeFileSync('output/playwright/cross-browser-results.json', JSON.stringify(results, null, 2));
  console.log(results.join('\n'));
})().catch(error => { console.error(error); process.exitCode = 1; });
