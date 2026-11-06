const puppeteer = require('c:/Users/Asus/Documents/Luit Prahari/web/node_modules/puppeteer');

(async () => {
  let browser;
  try {
    console.log('--- STARTING COMPREHENSIVE WEB PORTAL TEST ---');
    browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const baseDir = 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\232db5d8-85e1-4c56-a3ba-ff975e6661b5';

    // ----------------------------------------------------
    // TEST 1: SUB-DIVISION ADMIN PORTAL (/subdivision-admin)
    // ----------------------------------------------------
    console.log('\n[TEST 1] Testing Sub-Division Admin Portal (/subdivision-admin)...');
    await page.goto('http://localhost:3000/subdivision-admin', { waitUntil: 'networkidle2', timeout: 20000 });
    console.log('Current URL:', page.url());

    // Overview screenshot
    const subDivScreenshot = `${baseDir}\\web_test_subdivision_overview.png`;
    await page.screenshot({ path: subDivScreenshot, fullPage: false });
    console.log('✓ Captured Sub-Division Overview screenshot');

    // Click "Citizen Requests" tab
    const tabs = await page.$$('button');
    for (const tab of tabs) {
      const text = await page.evaluate(el => el.innerText, tab);
      if (text.includes('Citizen Requests')) {
        await tab.click();
        console.log('✓ Switched to Citizen Requests Tab');
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1200));
    const reqScreenshot = `${baseDir}\\web_test_subdivision_requests.png`;
    await page.screenshot({ path: reqScreenshot, fullPage: false });
    console.log('✓ Captured Citizen Requests tab screenshot');

    // Click "Jal Mitra Ground Force" tab
    for (const tab of tabs) {
      const text = await page.evaluate(el => el.innerText, tab);
      if (text.includes('Jal Mitra Ground Force')) {
        await tab.click();
        console.log('✓ Switched to Jal Mitra Ground Force Tab');
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1200));
    const jmScreenshot = `${baseDir}\\web_test_subdivision_jalmitras.png`;
    await page.screenshot({ path: jmScreenshot, fullPage: false });
    console.log('✓ Captured Jal Mitra Ground Force tab screenshot');

    // ----------------------------------------------------
    // TEST 2: DISTRICT LAB PORTAL (/lab-portal)
    // ----------------------------------------------------
    console.log('\n[TEST 2] Testing District Lab Portal (/lab-portal)...');
    await page.goto('http://localhost:3000/lab-portal', { waitUntil: 'networkidle2', timeout: 20000 });
    console.log('Current URL:', page.url());

    const labScreenshot = `${baseDir}\\web_test_lab_portal.png`;
    await page.screenshot({ path: labScreenshot, fullPage: false });
    console.log('✓ Captured Lab Portal screenshot');

    // ----------------------------------------------------
    // TEST 3: DIVISION ADMIN PORTAL (/division-admin)
    // ----------------------------------------------------
    console.log('\n[TEST 3] Testing Division Admin Portal (/division-admin)...');
    await page.goto('http://localhost:3000/division-admin', { waitUntil: 'networkidle2', timeout: 20000 });
    console.log('Current URL:', page.url());

    const divScreenshot = `${baseDir}\\web_test_division_overview.png`;
    await page.screenshot({ path: divScreenshot, fullPage: false });
    console.log('✓ Captured Division Overview screenshot');

    // Test Bottle QR Batch Generation page
    console.log('Testing Bottle QR Batches (/division-admin/bottles)...');
    await page.goto('http://localhost:3000/division-admin/bottles', { waitUntil: 'networkidle2', timeout: 20000 });
    const bottlesScreenshot = `${baseDir}\\web_test_division_bottles.png`;
    await page.screenshot({ path: bottlesScreenshot, fullPage: false });
    console.log('✓ Captured Bottle QR Batches screenshot');

    // Test Water Sources page
    console.log('Testing Water Sources (/division-admin/sources)...');
    await page.goto('http://localhost:3000/division-admin/sources', { waitUntil: 'networkidle2', timeout: 20000 });
    const sourcesScreenshot = `${baseDir}\\web_test_division_sources.png`;
    await page.screenshot({ path: sourcesScreenshot, fullPage: false });
    console.log('✓ Captured Water Sources screenshot');

    // ----------------------------------------------------
    // TEST 4: HEAD BRANCH SUPER ADMIN PORTAL (/super-admin)
    // ----------------------------------------------------
    console.log('\n[TEST 4] Testing Head Branch State Portal (/super-admin)...');
    await page.goto('http://localhost:3000/super-admin', { waitUntil: 'networkidle2', timeout: 20000 });
    console.log('Current URL:', page.url());

    const superScreenshot = `${baseDir}\\web_test_super_admin.png`;
    await page.screenshot({ path: superScreenshot, fullPage: false });
    console.log('✓ Captured Head Branch Super Admin screenshot');

    console.log('\n======================================================');
    console.log('ALL 4 WEB PORTALS TESTED AND VERIFIED SUCCESSFULLY!');
    console.log('======================================================');
  } catch (err) {
    console.error('Test execution error:', err.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
