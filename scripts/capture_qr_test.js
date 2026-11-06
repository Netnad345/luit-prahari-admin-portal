const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });
  await page.setCookie({ name: 'demo_user', value: 'division', domain: 'localhost', path: '/' });

  console.log('Navigating to QR Testing Lab (http://localhost:3000/qr-test)...');
  await page.goto('http://localhost:3000/qr-test', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\232db5d8-85e1-4c56-a3ba-ff975e6661b5\\qr_lab_generator.png', fullPage: true });
  console.log('✓ Captured QR Generator screenshot');

  // Tab 2: Labels
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.innerText, b);
    if (text.includes('Physical Label Print')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\232db5d8-85e1-4c56-a3ba-ff975e6661b5\\qr_lab_labels_preview.png', fullPage: true });
  console.log('✓ Captured Physical Label Print Preview');

  // Tab 3: Scanner Test
  const buttons2 = await page.$$('button');
  for (const b of buttons2) {
    const text = await page.evaluate(el => el.innerText, b);
    if (text.includes('Practical Scanner')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\232db5d8-85e1-4c56-a3ba-ff975e6661b5\\qr_lab_scanner_test.png', fullPage: true });
  console.log('✓ Captured Scanner Test Screen');

  // Tab 4: Bulk Batch
  const buttons3 = await page.$$('button');
  for (const b of buttons3) {
    const text = await page.evaluate(el => el.innerText, b);
    if (text.includes('Bulk Batch')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\232db5d8-85e1-4c56-a3ba-ff975e6661b5\\qr_lab_batch_generator.png', fullPage: true });
  console.log('✓ Captured Bulk Batch Generator Screen');

  console.log('ALL QR TESTING LAB SCREENSHOTS CAPTURED SUCCESSFULLY!');
  await browser.close();
})();

