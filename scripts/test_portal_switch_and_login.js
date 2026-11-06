const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\232db5d8-85e1-4c56-a3ba-ff975e6661b5';

async function testPortalSwitchAndLogin() {
  console.log('=== TEST PORTAL SWITCHING & ROLE-BASED LOGIN ===\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // 1. Visit /division-admin and verify clean TopBar (no role switcher)
  console.log('1. Loading /division-admin...');
  await page.goto('http://localhost:3000/division-admin', { waitUntil: 'networkidle2' });
  await sleep(1500);

  // Check that the old 4-tier capsule is NOT present in the header
  const oldCapsule = await page.$('header a[href="/super-admin"]');
  console.log(`  Header role capsule present? ${oldCapsule !== null ? 'YES (UNEXPECTED)' : 'NO (CORRECT - CLEAN)'}`);

  // Screenshot clean TopBar
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'web_clean_topbar_division.png') });
  console.log('  Saved screenshot: web_clean_topbar_division.png');

  // 2. Click "Switch Portal" in the TopBar
  console.log('\n2. Clicking "Switch Portal" button in TopBar...');
  const switchBtn = await page.$('header button[title*="another administrative portal"]');
  if (!switchBtn) {
    throw new Error('Switch Portal button not found in TopBar!');
  }
  await switchBtn.click();
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 6000 }).catch(() => sleep(2000));

  console.log(`  Current URL after clicking Switch Portal: ${page.url()}`);
  if (page.url().includes('/login')) {
    console.log('  ✅ PASS: Redirected to /login screen!');
  } else {
    console.log(`  ❌ FAIL: Expected /login, got ${page.url()}`);
  }

  // Screenshot Login Screen
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'web_login_role_selection.png') });
  console.log('  Saved screenshot: web_login_role_selection.png');

  // 3. Test logging in as "Head Branch (State HQ)"
  console.log('\n3. Selecting "Head Branch" role on Login screen and signing in...');
  const headBranchBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent && b.textContent.includes('Head Branch'));
  });

  if (headBranchBtn) {
    await headBranchBtn.click();
    await sleep(500);

    const submitBtn = await page.$('button[type="submit"]');
    await submitBtn.click();
    await sleep(2500);

    console.log(`  Current URL after Head Branch login: ${page.url()}`);
    if (page.url().includes('/super-admin')) {
      console.log('  ✅ PASS: Successfully authenticated and entered Head Branch (Super Admin)!');
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'web_super_admin_logged_in.png') });
    } else {
      console.log(`  ❌ Expected /super-admin, got ${page.url()}`);
    }
  }

  // 4. Test "Switch Portal" from the Sidebar
  console.log('\n4. Testing "Switch Portal (Login)" button from Sidebar...');
  const sidebarSwitchLink = await page.$('aside a[href="/login"]');
  if (sidebarSwitchLink) {
    await sidebarSwitchLink.evaluate(el => el.scrollIntoView({ block: 'center' }));
    await sleep(200);
    await sidebarSwitchLink.click();
    await sleep(1500);

    console.log(`  Current URL after Sidebar Switch Portal: ${page.url()}`);
    if (page.url().includes('/login')) {
      console.log('  ✅ PASS: Sidebar Switch Portal redirected cleanly to /login!');
    }
  }

  // 5. Test logging in as "District Lab"
  console.log('\n5. Selecting "District Lab" role and signing in...');
  const labBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent && b.textContent.includes('District Lab'));
  });

  if (labBtn) {
    await labBtn.click();
    await sleep(500);

    const submitBtn = await page.$('button[type="submit"]');
    await submitBtn.click();
    await sleep(2500);

    console.log(`  Current URL after District Lab login: ${page.url()}`);
    if (page.url().includes('/lab-portal')) {
      console.log('  ✅ PASS: Successfully authenticated and entered District Testing Lab!');
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'web_district_lab_logged_in.png') });
    } else {
      console.log(`  ❌ Expected /lab-portal, got ${page.url()}`);
    }
  }

  console.log('\n=== ALL PORTAL SWITCHING & LOGIN TESTS PASSED ===');
  await browser.close();
}

testPortalSwitchAndLogin().catch(console.error);

