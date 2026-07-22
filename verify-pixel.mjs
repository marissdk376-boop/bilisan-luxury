import { chromium } from 'playwright';
import * as fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  const page = await context.newPage();

  const events = [];
  const logs = [];
  const errors = [];

  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', error => {
    errors.push(error.message);
  });

  page.on('request', request => {
    const url = request.url();
    // Log all requests to see where it's hanging
    console.log(`[Network] ${request.method()} ${url}`);
    
    if (url.includes('facebook.com/tr') || url.includes('facebook.com/events')) {
      const parsedUrl = new URL(url);
      
      let payload = {};
      
      // Parse Query Params
      parsedUrl.searchParams.forEach((value, key) => {
        payload[key] = value;
      });

      // Parse POST Data
      const postData = request.postData();
      if (postData) {
        try {
          // Sometimes it's form url encoded
          const postParams = new URLSearchParams(postData);
          postParams.forEach((value, key) => {
            payload[key] = value;
          });
        } catch (e) {
          payload['raw_post_data'] = postData;
        }
      }

      events.push({
        method: request.method(),
        url: url,
        event: payload['ev'],
        event_id: payload['eid'],
        currency: payload['cd[currency]'],
        value: payload['cd[value]'],
        content_ids: payload['cd[content_ids]'],
        content_type: payload['cd[content_type]'],
        user_data_ph: payload['ud[ph]'],
        user_data_fn: payload['ud[fn]'],
        user_data_ln: payload['ud[ln]'],
        test_event_code: payload['test_event_code'],
        all_params: payload
      });
    }
  });

  console.log('Navigating to http://localhost:8080/ ...');
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('--- Submitting Form ---');
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="phone"]', '0550123456');
  await page.locator('select').nth(0).selectOption({ value: 'الجزائر' });
  await page.waitForTimeout(500);
  await page.locator('select').nth(1).selectOption({ value: 'الجزائر الوسطى' });
  await page.fill('input[name="address"]', 'Test Address 123');
  
  await page.click('button[type="submit"]');
  await page.screenshot({ path: 'screenshot.png' });
  
  // also dump HTML
  const html = await page.content();
  fs.writeFileSync('page.html', html);

  // Wait 10 seconds to ensure any async fetches and pixel events fire
  await page.waitForTimeout(10000);

  const fbqExists = await page.evaluate(() => typeof window.fbq !== 'undefined');
  console.log('--- window.fbq exists? ---', fbqExists);

  console.log('--- All Captured Events ---');
  events.forEach(e => {
    console.log(`\nEvent: ${e.event} (${e.method})`);
    console.log(JSON.stringify(e, null, 2));
  });

  console.log('\n--- Console Logs ---');
  logs.forEach(l => console.log(l));

  console.log('\n--- Errors ---');
  errors.forEach(e => console.log(e));

  await browser.close();
})();
