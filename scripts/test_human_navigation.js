const puppeteer = require('puppeteer');

async function testHumanNavigation() {
  console.log('=== REAL HUMAN CLICK & ROUTING AUDIT ===\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('  [Console Error]:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('  [Page Error (Uncaught)]:', err.message);
  });

  const targetRoutes = [
    { label: 'Division Overview', href: '/division-admin' },
    { label: 'Water Sources', href: '/division-admin/sources' },
    { label: 'PWSS Schemes', href: '/division-admin/schemes' },
    { label: 'Sampling Tasks', href: '/division-admin/tasks' },
    { label: 'QR Testing Lab', href: '/qr-test' },
    { label: 'Bottle QR Batches', href: '/division-admin/bottles' },
    { label: 'Exception Queue', href: '/division-admin/exceptions' },
    { label: 'Samples & Custody', href: '/division-admin/samples' },
    { label: 'Remediation Alerts', href: '/division-admin/alerts' },
    { label: 'GIS Source Map', href: '/division-admin/gis-map' },
    { label: 'Contaminant Trends', href: '/division-admin/trends' },
    { label: 'Statutory Reports', href: '/division-admin/reports' },
    { label: 'AI Intelligence', href: '/division-admin/ai-insights' },
    { label: 'Sub-Division Hub (AEE)', href: '/subdivision-admin' },
    { label: 'Jal Mitras & Devices', href: '/division-admin/staff' },
    { label: 'Bulk Data Import', href: '/super-admin/import' },
    { label: 'Lab Portal', href: '/lab-portal' }
  ];

  await page.goto('http://localhost:3000/division-admin', { waitUntil: 'networkidle2' });
  console.log('Initial page loaded:', page.url());

  const auditResults = [];

  for (const route of targetRoutes) {
    console.log(`\nTesting navigation to: "${route.label}" [${route.href}]`);
    
    // Find the link in the sidebar by href
    const linkHandle = await page.$(`aside a[href="${route.href}"]`);
    if (!linkHandle) {
      console.log(`  ❌ FAIL: Link not found in DOM: aside a[href="${route.href}"]`);
      auditResults.push({ ...route, status: 'NOT_FOUND', note: 'Link missing from current sidebar DOM' });
      continue;
    }

    // Check visibility and bounding box
    const isVisible = await linkHandle.isIntersectingViewport();
    const box = await linkHandle.boundingBox();
    console.log(`  DOM element found. Box: ${JSON.stringify(box)}, isIntersectingViewport: ${isVisible}`);

    // If not in viewport, scroll it into view
    if (!isVisible || !box) {
      await linkHandle.evaluate(el => el.scrollIntoView({ block: 'center' }));
      await new Promise(r => setTimeout(r, 300));
    }

    const currentUrlBefore = page.url();

    // Click with real mouse pointer
    try {
      await linkHandle.click();
      await new Promise(r => setTimeout(r, 2000));
      const currentUrlAfter = page.url();
      console.log(`  Clicked! URL before: ${currentUrlBefore} -> URL after: ${currentUrlAfter}`);

      if (currentUrlAfter.includes(route.href)) {
        console.log(`  ✅ PASS: Successfully navigated to ${route.href}`);
        auditResults.push({ ...route, status: 'PASS', url: currentUrlAfter });
      } else {
        console.log(`  ❌ FAIL: Click did not change URL to ${route.href} (Stayed on ${currentUrlAfter})`);
        auditResults.push({ ...route, status: 'FAILED_NO_NAV', url: currentUrlAfter });
      }
    } catch (e) {
      console.log(`  ❌ ERROR during click:`, e.message);
      auditResults.push({ ...route, status: 'CLICK_ERROR', error: e.message });
    }
  }

  console.log('\n=== SUMMARY REPORT ===');
  console.table(auditResults);

  await browser.close();
}

testHumanNavigation();

