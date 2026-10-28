// Run with Playwright available in NODE_PATH; see docs/launch-readiness.md.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ reducedMotion: 'reduce', permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  const errors = [];
  const badResponses = [];
  const requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`); });
  page.on('request', request => requests.push(request.url()));
  const origin = process.env.BASUS_TEST_URL || 'http://127.0.0.1:8766';
  const results = [];
  fs.mkdirSync('output/playwright', { recursive: true });
  try {
    for (const width of [1920, 1440, 1280, 1100, 1024, 820, 768, 760, 430, 390, 360, 320]) {
      await page.setViewportSize({ width, height: width < 761 ? 844 : 1000 });
      await page.goto(origin);
      await page.evaluate(() => document.fonts.ready);
      for (const image of await page.locator('img').all()) {
        await image.scrollIntoViewIfNeeded();
        await page.waitForFunction(element => element.complete && element.naturalWidth > 0, await image.elementHandle());
      }
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        brokenImages: [...document.images].filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src),
        fragments: [...document.querySelectorAll('a[href^="#"]')].filter(link => !document.getElementById(link.hash.slice(1))).map(link => link.hash),
        h1s: document.querySelectorAll('h1').length,
        reducedMotion: getComputedStyle(document.documentElement).scrollBehavior,
        year: document.getElementById('year').textContent,
        logoRatio: document.querySelector('.nav-logo img').naturalWidth / document.querySelector('.nav-logo img').naturalHeight,
        products: document.querySelectorAll('article.product').length
      }));
      assert.equal(state.overflow, false, `overflow at ${width}`);
      assert.deepEqual(state.brokenImages, [], `images at ${width}`);
      assert.deepEqual(state.fragments, []);
      assert.equal(state.h1s, 1);
      assert.equal(state.products, 3);
      assert.equal(state.reducedMotion, 'auto');
      assert.equal(await page.locator('.hero-visual').evaluate(figure =>
        figure.getBoundingClientRect().bottom <= document.querySelector('.hero-bottom').getBoundingClientRect().top
      ), true, `hero illustration overlaps the introduction at ${width}px`);
      assert.equal(state.year, String(new Date().getFullYear()));
      if (width <= 1100) {
        await page.locator('#burger').click();
        assert.equal(await page.locator('#burger').getAttribute('aria-expanded'), 'true');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#burger').getAttribute('aria-expanded'), 'false');
        assert.equal(await page.evaluate(() => document.activeElement.id), 'burger');
        await page.locator('#burger').click();
        await page.locator('#nav-mobile a[href="#quality"]').click();
        assert.equal(await page.locator('#nav-mobile').isVisible(), false);
        assert.equal(new URL(page.url()).hash, '#quality');
        await page.locator('#burger').click();
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.waitForFunction(() => document.getElementById('burger').getAttribute('aria-expanded') === 'false');
        assert.equal(await page.locator('#nav-mobile').isVisible(), false);
        assert.equal(await page.locator('#burger').getAttribute('aria-expanded'), 'false');
        await page.setViewportSize({ width, height: width < 761 ? 844 : 1000 });
      }
      await page.goto(origin);
      if ([1440, 820, 390, 360, 320].includes(width)) {
        for (const image of await page.locator('img').all()) {
        await image.scrollIntoViewIfNeeded();
        await page.waitForFunction(element => element.complete && element.naturalWidth > 0, await image.elementHandle());
      }
        await page.locator('#home').scrollIntoViewIfNeeded();
        await page.screenshot({ path: `output/playwright/desktop-${width}.png`, fullPage: true });
        await page.locator('#capabilities').screenshot({ path: `output/playwright/products-${width}.png` });
        await page.locator('#contact').screenshot({ path: `output/playwright/contact-${width}.png` });
      }
      results.push(`${width}px: layout, images, anchors, menu, reduced motion passed`);
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(origin);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.skip-link').evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'main');
    for (const link of await page.locator('[data-product]').all()) {
      await link.click();
      assert.equal(await page.locator('#product').inputValue(), await link.getAttribute('data-product'));
      assert.equal(new URL(page.url()).hash, '#contact');
    }
    for (const details of await page.locator('.technical-details').all()) {
      assert.equal(await details.locator('dl').isVisible(), false);
      await details.locator('summary').focus();
      await page.keyboard.press('Enter');
      assert.equal(await details.locator('dl').isVisible(), true);
      await page.keyboard.press('Enter');
      assert.equal(await details.locator('dl').isVisible(), false);
    }
    const submit = page.locator('#form-submit');
    await submit.click();
    assert.equal(await page.locator('#email-draft').isVisible(), false);
    await page.locator('#name').fill('   ');
    await page.locator('#email').fill('not-an-email');
    await page.locator('#message').fill('   ');
    assert.equal(await page.locator('#contactForm').evaluate(form => form.checkValidity()), false);
    await submit.click();
    assert.equal(await page.locator('#email-draft').isVisible(), false);
    await page.locator('#name').fill('Buyer & Engineer');
    await page.locator('#company').fill('Example + Company');
    await page.locator('#email').fill('buyer@example.com');
    await page.locator('#quantity').fill('  500 units per order  ');
    await page.locator('#destination').fill('  Rotterdam, Netherlands  ');
    const requirement = 'ETP copper, tin finish. Drawing B-12 Rev C. 500 units. Delivery to Rotterdam.\nReview IEC requirements & Incoterms.';
    await page.locator('#message').fill(requirement);
    const countBefore = requests.length;
    await submit.click();
    assert.equal(requests.length, countBefore, 'draft building must not send data');
    assert.equal(await page.locator('#email-draft').isVisible(), true);
    const mail = new URL(await page.locator('#open-email').getAttribute('href'));
    assert.equal(mail.protocol, 'mailto:');
    assert.equal(mail.pathname, 'info@basusinternational.com');
    assert.ok(mail.searchParams.get('body').includes(requirement));
    assert.ok(mail.searchParams.get('body').includes('Estimated quantity: 500 units per order'));
    assert.ok(mail.searchParams.get('body').includes('Delivery destination: Rotterdam, Netherlands'));
    assert.ok(mail.searchParams.get('subject').includes('Example + Company'));
    await page.locator('#copy-enquiry').click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), await page.locator('#draft-text').inputValue());
    await page.screenshot({ path: 'output/playwright/enquiry-draft.png' });
    await page.locator('#message').fill('A'.repeat(4000));
    assert.equal(await page.locator('#email-draft').isVisible(), false, 'changed input invalidates the old draft');
    await submit.click();
    assert.equal(await page.locator('#open-email').isVisible(), false);
    assert.match(await page.locator('#draft-status').textContent(), /too long/);
    await page.locator('#copy-enquiry').click();
    assert.ok((await page.evaluate(() => navigator.clipboard.readText())).includes('A'.repeat(4000)));
    // Denied clipboard permission must preserve a manual-copy path.
    await context.clearPermissions();
    await context.grantPermissions([], { origin });
    await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('Denied')) }, configurable: true }); });
    await page.locator('#copy-enquiry').click();
    assert.match(await page.locator('#draft-status').textContent(), /draft is selected/);
    assert.equal(await page.locator('#draft-text').evaluate(el => el.selectionEnd - el.selectionStart), (await page.locator('#draft-text').inputValue()).length);
    // The new fields are optional; an unknown quantity or route must not block enquiry.
    await page.locator('#quantity').fill('');
    await page.locator('#destination').fill('');
    await page.locator('#message').fill('Please review drawing Rev D.');
    await submit.click();
    assert.match(await page.locator('#draft-text').inputValue(), /Estimated quantity: To discuss/);
    assert.match(await page.locator('#draft-text').inputValue(), /Delivery destination: To discuss/);
    // Navigation remains usable when scripting is disabled.
    const nojs = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
    const nojsPage = await nojs.newPage();
    await nojsPage.goto(origin);
    assert.equal(await nojsPage.locator('.no-js-note').isVisible(), true);
    assert.equal(await nojsPage.locator('#form-submit').isDisabled(), true);
    await nojsPage.locator('.portfolio-index a').first().click();
    assert.equal(new URL(nojsPage.url()).hash, '#copper-busbars');
    await nojsPage.locator('.technical-details summary').first().click();
    assert.equal(await nojsPage.locator('.technical-details dl').first().isVisible(), true);
    await nojs.close();
    const data = await page.locator('script[type="application/ld+json"]').textContent();
    assert.equal(JSON.parse(data)['@type'], 'Organization');
    assert.equal(JSON.parse(data).url, 'https://basusinternational.com/');
    assert.equal(JSON.parse(data).areaServed, undefined);
    assert.deepEqual(errors, []);
    assert.deepEqual(badResponses, []);
    assert.deepEqual(requests.filter(url => !url.startsWith(origin)), [], 'no third-party requests');
    results.push('Product enquiry selection, native validation, whitespace, encoded draft, no data request, clipboard success/denial, long draft, stale draft invalidation, keyboard skip link, no-JS fallback, schema and console checks passed.');
    fs.writeFileSync('output/playwright/test-results.json', JSON.stringify({ checkedAt: new Date().toISOString(), results, errors, badResponses }, null, 2));
    console.log(results.join('\n'));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
