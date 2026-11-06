const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setCookie({ name: 'demo_user', value: 'lab', domain: 'localhost', path: '/' });
  await page.goto('http://localhost:3000/lab-portal', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\232db5d8-85e1-4c56-a3ba-ff975e6661b5\\web_lab_redesigned_bench.png', fullPage: true });

  // Click Receipt tab
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.innerText, b);
    if (text.includes('Sample Receipt')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\232db5d8-85e1-4c56-a3ba-ff975e6661b5\\web_lab_redesigned_receipt.png', fullPage: true });

  console.log('Lab screenshots captured successfully!');
  await browser.close();
})();

