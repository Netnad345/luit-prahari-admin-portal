const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\232db5d8-85e1-4c56-a3ba-ff975e6661b5';

async function testCompleteWebNavigation() {
  console.log('================================================================');
  console.log('   LUIT PRAHARI — COMPREHENSIVE WEB PORTAL ROUTING AUDIT (V2)');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({ type: 'CONSOLE_ERROR', text: msg.text() });
    }
  });

  page.on('pageerror', err => {
    errors.push({ type: 'PAGE_ERROR', text: err.message });
  });

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // --- PART 1: ALL 18 SIDEBAR ROUTES ---
  const sidebarRoutes = [
    { label: 'Head Branch (HQ)', href: '/super-admin' },
    { label: 'Division Executive (EE)', href: '/division-admin' },
    { label: 'Sub-Division (AEE)', href: '/subdivision-admin' },
    { label: 'District Testing Lab', href: '/lab-portal' },
    { label: 'Drinking Water Sources', href: '/division-admin/sources' },
    { label: 'PWSS Schemes', href: '/division-admin/schemes' },
    { label: 'GIS Spatial Map', href: '/division-admin/gis-map' },
    { label: 'Sampling Tasks Queue', href: '/division-admin/tasks' },
    { label: 'Samples & Custody', href: '/division-admin/samples' },
    { label: 'Geo-Exceptions Queue', href: '/division-admin/exceptions' },
    { label: 'Jal Mitra Ground Fleet', href: '/division-admin/staff' },
    { label: 'Bottle QR Batches', href: '/division-admin/bottles' },
    { label: 'QR Testing Lab', href: '/qr-test' },
    { label: 'Remediation Alerts', href: '/division-admin/alerts' },
    { label: 'Contaminant Trends', href: '/division-admin/trends' },
    { label: 'Mathematical Risk & WQI', href: '/division-admin/ai-insights' },
    { label: 'Statutory Reports', href: '/division-admin/reports' },
    { label: 'Bulk Data Ingestion (JJM)', href: '/super-admin/import' },
  ];

  console.log('>>> [PHASE 1] Testing All 18 Sidebar Navigation Links...');
  await page.goto('http://localhost:3000/division-admin', { waitUntil: 'networkidle2' });
  await sleep(1000);

  const sidebarAudit = [];

  for (const item of sidebarRoutes) {
    const selector = `aside a[href="${item.href}"]`;
    const link = await page.$(selector);

    if (!link) {
      console.log(`  ❌ NOT FOUND: ${item.label} (${item.href})`);
      sidebarAudit.push({ ...item, status: 'NOT_FOUND' });
      continue;
    }

    // Scroll into view if needed
    await link.evaluate(el => el.scrollIntoView({ block: 'center' }));
    await sleep(200);

    await link.click();
    
    // Wait for URL pathname to match target route (allowing up to 5s for Next.js dev compilation)
    try {
      await page.waitForFunction(
        (target) => window.location.pathname === target,
        { timeout: 6000 },
        item.href
      );
    } catch {
      // Fallback sleep
      await sleep(1000);
    }

    const newUrl = page.url();
    const passed = newUrl.includes(item.href);
    if (passed) {
      console.log(`  ✅ PASS: "${item.label}" -> ${newUrl}`);
      sidebarAudit.push({ ...item, status: 'PASS', url: newUrl });
    } else {
      console.log(`  ❌ FAIL: "${item.label}" expected ${item.href}, got ${newUrl}`);
      sidebarAudit.push({ ...item, status: 'FAIL', url: newUrl });
    }
  }

  // --- PART 2: TOPBAR JURISDICTION SWITCHER CAPSULE ---
  console.log('\n>>> [PHASE 2] Testing TopBar 4-Tier Jurisdiction Switcher Capsule...');
  const topBarTiers = [
    { label: 'Head Branch (HQ)', href: '/super-admin' },
    { label: 'Division (EE)', href: '/division-admin' },
    { label: 'Sub-Division', href: '/subdivision-admin' },
    { label: 'District Lab', href: '/lab-portal' }
  ];

  const topbarAudit = [];
  for (const tier of topBarTiers) {
    const selector = `header a[href="${tier.href}"]`;
    const btn = await page.$(selector);
    if (!btn) {
      console.log(`  ❌ TOPBAR NOT FOUND: ${tier.label} (${tier.href})`);
      topbarAudit.push({ ...tier, status: 'NOT_FOUND' });
      continue;
    }

    await btn.click();
    try {
      await page.waitForFunction(
        (target) => window.location.pathname === target,
        { timeout: 6000 },
        tier.href
      );
    } catch {
      await sleep(1000);
    }

    const newUrl = page.url();
    const passed = newUrl.includes(tier.href);
    if (passed) {
      console.log(`  ✅ TOPBAR PASS: "${tier.label}" -> ${newUrl}`);
      topbarAudit.push({ ...tier, status: 'PASS', url: newUrl });
    } else {
      console.log(`  ❌ TOPBAR FAIL: "${tier.label}" -> ${newUrl}`);
      topbarAudit.push({ ...tier, status: 'FAIL', url: newUrl });
    }
  }

  // --- PART 3: SUB-DIVISION TAB & QUERY PARAM SYNCHRONIZATION ---
  console.log('\n>>> [PHASE 3] Testing Sub-Division Client Tabs & Query Sync...');
  await page.goto('http://localhost:3000/subdivision-admin', { waitUntil: 'networkidle2' });
  await sleep(1000);

  const subDivisionTabs = [
    { tabName: 'citizen_requests', text: 'Citizen Requests' },
    { tabName: 'jal_mitras', text: 'Jal Mitra Ground Force' },
    { tabName: 'schemes', text: 'PWSS Schemes' },
    { tabName: 'exceptions', text: 'Geo-Exceptions' },
    { tabName: 'overview', text: 'Operations Overview' }
  ];

  const subDivAudit = [];
  for (const tab of subDivisionTabs) {
    const buttons = await page.$$('button');
    let matchedBtn = null;
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes(tab.text)) {
        matchedBtn = b;
        break;
      }
    }

    if (!matchedBtn) {
      console.log(`  ❌ TAB BUTTON NOT FOUND: ${tab.text}`);
      subDivAudit.push({ ...tab, status: 'NOT_FOUND' });
      continue;
    }

    await matchedBtn.click();
    await sleep(500);
    const currentUrl = page.url();
    const expectedQuery = tab.tabName === 'overview' ? '/subdivision-admin' : `tab=${tab.tabName}`;
    const urlMatches = currentUrl.includes(expectedQuery);

    console.log(`  ${urlMatches ? '✅' : '❌'} Sub-Division Tab "${tab.text}": URL = ${currentUrl}`);
    subDivAudit.push({ ...tab, status: urlMatches ? 'PASS' : 'FAIL', url: currentUrl });
  }

  // --- PART 4: LAB PORTAL TAB SYNCHRONIZATION ---
  console.log('\n>>> [PHASE 4] Testing Lab Portal Client Tabs & Query Sync...');
  await page.goto('http://localhost:3000/lab-portal', { waitUntil: 'networkidle2' });
  await sleep(1000);

  const labTabs = [
    { tabName: 'receipt', text: 'Sample Receipt' },
    { tabName: 'approval', text: 'Digital Sign-Off' },
    { tabName: 'entry', text: 'Analytical Bench' }
  ];

  const labAudit = [];
  for (const tab of labTabs) {
    const buttons = await page.$$('button');
    let matchedBtn = null;
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes(tab.text)) {
        matchedBtn = b;
        break;
      }
    }

    if (!matchedBtn) {
      console.log(`  ❌ LAB TAB BUTTON NOT FOUND: ${tab.text}`);
      labAudit.push({ ...tab, status: 'NOT_FOUND' });
      continue;
    }

    await matchedBtn.click();
    await sleep(500);
    const currentUrl = page.url();
    const expectedQuery = tab.tabName === 'entry' ? '/lab-portal' : `tab=${tab.tabName}`;
    const urlMatches = currentUrl.includes(expectedQuery);

    console.log(`  ${urlMatches ? '✅' : '❌'} Lab Tab "${tab.text}": URL = ${currentUrl}`);
    labAudit.push({ ...tab, status: urlMatches ? 'PASS' : 'FAIL', url: currentUrl });
  }

  // --- PART 5: SUPER ADMIN TAB SYNCHRONIZATION ---
  console.log('\n>>> [PHASE 5] Testing Super Admin Client Tabs & Query Sync...');
  await page.goto('http://localhost:3000/super-admin', { waitUntil: 'networkidle2' });
  await sleep(1000);

  const superAdminTabs = [
    { tabName: 'divisions_labs', text: 'Divisions & Labs' },
    { tabName: 'users', text: 'State Users' },
    { tabName: 'params', text: 'IS 10500 Limits' },
    { tabName: 'policy_rules', text: 'Policy & Rules' },
    { tabName: 'audit', text: 'Audit Log Ledger' },
    { tabName: 'overview', text: 'State Overview' }
  ];

  const superAdminAudit = [];
  for (const tab of superAdminTabs) {
    const buttons = await page.$$('button');
    let matchedBtn = null;
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.trim() === tab.text) {
        matchedBtn = b;
        break;
      }
    }

    if (!matchedBtn) {
      console.log(`  ❌ SUPER ADMIN TAB BUTTON NOT FOUND: ${tab.text}`);
      superAdminAudit.push({ ...tab, status: 'NOT_FOUND' });
      continue;
    }

    await matchedBtn.click();
    await sleep(500);
    const currentUrl = page.url();
    const expectedQuery = tab.tabName === 'overview' ? '/super-admin' : `tab=${tab.tabName}`;
    const urlMatches = currentUrl.includes(expectedQuery);

    console.log(`  ${urlMatches ? '✅' : '❌'} Super Admin Tab "${tab.text}": URL = ${currentUrl}`);
    superAdminAudit.push({ ...tab, status: urlMatches ? 'PASS' : 'FAIL', url: currentUrl });
  }

  console.log('\n================================================================');
  console.log('   AUDIT SUMMARY REPORT');
  console.log('================================================================');
  const totalSidebar = sidebarAudit.length;
  const passSidebar = sidebarAudit.filter(s => s.status === 'PASS').length;
  const totalTopBar = topbarAudit.length;
  const passTopBar = topbarAudit.filter(s => s.status === 'PASS').length;
  const totalSubDiv = subDivAudit.length;
  const passSubDiv = subDivAudit.filter(s => s.status === 'PASS').length;
  const totalLab = labAudit.length;
  const passLab = labAudit.filter(s => s.status === 'PASS').length;
  const totalAdmin = superAdminAudit.length;
  const passAdmin = superAdminAudit.filter(s => s.status === 'PASS').length;

  console.log(`Sidebar 18 Links:      ${passSidebar}/${totalSidebar} PASS (${Math.round(passSidebar/totalSidebar*100)}%)`);
  console.log(`TopBar 4 Tiers:        ${passTopBar}/${totalTopBar} PASS (${Math.round(passTopBar/totalTopBar*100)}%)`);
  console.log(`Sub-Division 5 Tabs:   ${passSubDiv}/${totalSubDiv} PASS (${Math.round(passSubDiv/totalSubDiv*100)}%)`);
  console.log(`Lab Portal 3 Tabs:     ${passLab}/${totalLab} PASS (${Math.round(passLab/totalLab*100)}%)`);
  console.log(`Super Admin 6 Tabs:    ${passAdmin}/${totalAdmin} PASS (${Math.round(passAdmin/totalAdmin*100)}%)`);
  console.log(`Uncaught JS Errors:    ${errors.length}`);

  await browser.close();
  console.log('\nAUDIT COMPLETE.');
}

testCompleteWebNavigation().catch(console.error);
