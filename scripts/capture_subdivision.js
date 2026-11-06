const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setCookie({ name: 'demo_user', value: 'subdivision', domain: 'localhost', path: '/' });
  await page.goto('http://localhost:3000/subdivision-admin', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\232db5d8-85e1-4c56-a3ba-ff975e6661b5\\web_subdivision_redesigned_overview.png', fullPage: true });

  // Click Citizen Requests tab
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.innerText, b);
    if (text.includes('Citizen Requests')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\232db5d8-85e1-4c56-a3ba-ff975e6661b5\\web_subdivision_redesigned_requests.png', fullPage: true });

  // Click Jal Mitra Ground Force tab
  const buttons2 = await page.$$('button');
  for (const b of buttons2) {
    const text = await page.evaluate(el => el.innerText, b);
    if (text.includes('Jal Mitra Ground Force')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\232db5d8-85e1-4c56-a3ba-ff975e6661b5\\web_subdivision_redesigned_jalmitras.png', fullPage: true });

  console.log('All Sub-Division screenshots captured successfully!');
  await browser.close();
})();

