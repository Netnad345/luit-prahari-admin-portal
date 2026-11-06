const puppeteer = require('puppeteer');

async function testSingleClick() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('requestfailed', req => console.log('REQ FAILED:', req.url(), req.failure().errorText));

  console.log('Navigating to http://localhost:3000/division-admin ...');
  await page.goto('http://localhost:3000/division-admin', { waitUntil: 'networkidle2' });

  console.log('Page loaded. Finding link to /division-admin/sources ...');
  const link = await page.$('aside a[href="/division-admin/sources"]');
  if (!link) {
    console.log('Link not found!');
  } else {
    console.log('Link found! Clicking with page.click()...');
    
    // Listen for navigation or URL change
    const [response] = await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }).catch(e => console.log('Wait for nav timed out:', e.message)),
      link.click()
    ]);
    
    console.log('Current URL after click:', page.url());
  }

  await browser.close();
}

testSingleClick();

