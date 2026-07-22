import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
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
    if (url.includes('facebook.com/tr') || url.includes('facebook.com/events')) {
      const parsedUrl = new URL(url);
      events.push({
        url: url,
        status: null, // Will update on response
        event: parsedUrl.searchParams.get('ev'),
        method: request.method(),
        postData: request.postData()
      });
    }
  });

  page.on('response', response => {
    const url = response.url();
    if (url.includes('facebook.com/tr')) {
      const event = events.find(e => e.url === url && e.status === null);
      if (event) {
        event.status = response.status();
      }
    }
  });

  console.log('Navigating to https://bilisan-luxury-two.vercel.app/ ...');
  await page.goto('https://bilisan-luxury-two.vercel.app/', { waitUntil: 'networkidle' });

  // Give it a second to fire everything
  await page.waitForTimeout(2000);

  console.log('--- Page Load Events ---');
  events.forEach(e => console.log(JSON.stringify(e)));

  console.log('--- Simulating InitiateCheckout ---');
  // Fill the form
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="phone"]', '0550123456');
  await page.locator('select').nth(0).selectOption({ value: 'الجزائر' });
  // wait for commune to populate
  await page.waitForTimeout(500);
  await page.locator('select').nth(1).selectOption({ value: 'الجزائر الوسطى' });
  await page.fill('input[name="address"]', 'Test Address 123');
  
  // Submit
  await page.click('button[type="submit"]');

  // Wait for InitiateCheckout and Purchase
  await page.waitForTimeout(5000);

  console.log('--- All Captured Events ---');
  events.forEach(e => console.log(JSON.stringify(e)));

  console.log('--- Console Logs ---');
  logs.forEach(l => console.log(l));

  console.log('--- Errors ---');
  errors.forEach(e => console.log(e));

  await browser.close();
})();
