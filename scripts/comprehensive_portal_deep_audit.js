const puppeteer = require('puppeteer');

async function comprehensiveAudit() {
  console.log('====================================================');
  console.log('   LUIT PRAHARI WEB PORTAL FORENSIC DEEP AUDIT');
  console.log('====================================================\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  const warnings = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({ url: page.url(), text: msg.text() });
      console.log(`  [Console Error @ ${page.url()}]:`, msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push({ url: page.url(), text: err.message });
    console.log(`  [Uncaught Page Error @ ${page.url()}]:`, err.message);
  });

  const pagesToTest = [
    { name: 'Login Page', url: '/login' },
    { name: 'Division Admin Overview', url: '/division-admin' },
    { name: 'Water Sources List', url: '/division-admin/sources' },
    { name: 'PWSS Schemes List', url: '/division-admin/schemes' },
    { name: 'Sampling Tasks Management', url: '/division-admin/tasks' },
    { name: 'QR Testing Lab', url: '/qr-test' },
    { name: 'Bottle QR Batches', url: '/division-admin/bottles' },
    { name: 'Geo-Exceptions Queue', url: '/division-admin/exceptions' },
    { name: 'Samples & Chain of Custody', url: '/division-admin/samples' },
    { name: 'Remediation Alerts', url: '/division-admin/alerts' },
    { name: 'GIS Source Map', url: '/division-admin/gis-map' },
    { name: 'Contaminant Trends', url: '/division-admin/trends' },
    { name: 'Statutory Reports', url: '/division-admin/reports' },
    { name: 'AI & WQI Analytics', url: '/division-admin/ai-insights' },
    { name: 'Jal Mitras Fleet', url: '/division-admin/staff' },
    { name: 'Sub-Division Command (AEE)', url: '/subdivision-admin' },
    { name: 'Super Admin HQ Apex', url: '/super-admin' },
    { name: 'Bulk Data Import (JJM)', url: '/super-admin/import' },
    { name: 'District Testing Lab Portal', url: '/lab-portal' },
  ];

  const auditLog = [];

  for (const p of pagesToTest) {
    const fullUrl = 'http://localhost:3000' + p.url;
    console.log(`\n>>> Testing Page: [${p.name}] (${p.url}) ...`);

    try {
      const response = await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 8000 });
      const status = response ? response.status() : 'NO_RES';
      const actualUrl = page.url();

      console.log(`  HTTP Status: ${status} | Landed on: ${actualUrl}`);

      // Count interactive buttons and links
      const stats = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const links = Array.from(document.querySelectorAll('a'));
        const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
        const deadLinks = links.filter(l => !l.getAttribute('href') || l.getAttribute('href') === '#');
        return {
          buttonCount: buttons.length,
          linkCount: links.length,
          inputCount: inputs.length,
          deadLinkCount: deadLinks.length
        };
      });

      console.log(`  Elements: ${stats.buttonCount} buttons, ${stats.linkCount} links, ${stats.inputCount} inputs (${stats.deadLinkCount} dead links)`);

      auditLog.push({
        ...p,
        status,
        actualUrl,
        ...stats,
        passed: status === 200 && actualUrl.includes(p.url)
      });

    } catch (err) {
      console.log(`  ❌ CRITICAL FAILURE on ${p.url}:`, err.message);
      auditLog.push({
        ...p,
        status: 'TIMEOUT_OR_CRASH',
        actualUrl: page.url(),
        error: err.message,
        passed: false
      });
    }
  }

  console.log('\n====================================================');
  console.log('              AUDIT RESULTS SUMMARY TABLE');
  console.log('====================================================');
  console.table(auditLog);

  console.log(`\nTotal Errors Captured: ${errors.length}`);
  if (errors.length > 0) {
    console.log(JSON.stringify(errors, null, 2));
  }

  await browser.close();
}

comprehensiveAudit();

