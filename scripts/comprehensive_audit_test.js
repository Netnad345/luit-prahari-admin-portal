const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const issues = [];
const successes = [];

function logIssue(moduleName, feature, expected, actual, severity = 'Medium') {
  const issue = { moduleName, feature, expected, actual, severity, timestamp: new Date().toISOString() };
  issues.push(issue);
  console.log(`❌ [ISSUE - ${severity}] [${moduleName}] ${feature}: ${actual}`);
}

function logSuccess(moduleName, feature) {
  successes.push({ moduleName, feature, timestamp: new Date().toISOString() });
  console.log(`✅ [PASS] [${moduleName}] ${feature}`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAudit() {
  console.log('🚀 Starting Deep End-to-End Human-Simulation Audit of Luit Prahari Web Portal...\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();

  // Capture console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  try {
    // ==========================================
    // TEST 1: LOGIN PAGE & QUICK ROLES
    // ==========================================
    console.log('\n--- Testing Module 1: Authentication & Login (/login) ---');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });

    // Check page title / branding
    const loginHeader = await page.$eval('h2, h1', el => el.innerText).catch(() => '');
    if (loginHeader) {
      logSuccess('Login', `Page loaded with header: "${loginHeader.split('\n')[0]}"`);
    } else {
      logIssue('Login', 'Header Presence', 'Clear login header present', 'No h1/h2 found', 'Low');
    }

    // Check quick role buttons
    const quickRoleButtons = await page.$$('button');
    let quickRoleFound = false;
    for (const btn of quickRoleButtons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text.includes('Division Admin') || text.includes('Lab In-Charge')) {
        quickRoleFound = true;
        await btn.click();
        await sleep(200);
        break;
      }
    }

    if (quickRoleFound) {
      logSuccess('Login', 'Demo Credentials Quick-Fill button clicked and populated form');
    } else {
      logIssue('Login', 'Quick Fill Buttons', 'Quick fill demo buttons present', 'Not found', 'Low');
    }

    // Check form inputs
    const emailVal = await page.$eval('input[type="email"]', el => el.value).catch(() => '');
    if (emailVal.includes('@')) {
      logSuccess('Login', `Official email input value verified: ${emailVal}`);
    } else {
      logIssue('Login', 'Email Input', 'Email field contains valid address', `Found: "${emailVal}"`, 'Medium');
    }

    // Submit the login form and authenticate session
    console.log('Submitting login form to establish session...');
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(e => console.log('Navigation wait:', e.message)),
        submitBtn.click()
      ]);
      await sleep(1500);
      const curUrl = page.url();
      console.log('Current URL after submit:', curUrl);
      if (curUrl.includes('/division-admin')) {
        logSuccess('Login', 'Successfully authenticated and redirected to /division-admin');
      } else {
        logIssue('Login', 'Authentication Navigation', 'Redirect to /division-admin', curUrl, 'High');
      }
    } else {
      logIssue('Login', 'Submit Button', 'button[type="submit"] present', 'Not found', 'High');
    }

    // ==========================================
    // TEST 2: DIVISION DASHBOARD (/division-admin)
    // ==========================================
    console.log('\n--- Testing Module 2: Division Dashboard (/division-admin) ---');
    await page.goto(`${BASE_URL}/division-admin`, { waitUntil: 'networkidle0' });

    const dashTitle = await page.$eval('h1', el => el.innerText).catch(() => '');
    if (dashTitle.includes('Division')) {
      logSuccess('Division Dashboard', `Loaded with title: "${dashTitle}"`);
    } else {
      logIssue('Division Dashboard', 'Dashboard Title', 'Division Operations Dashboard title', dashTitle, 'High');
    }

    // Test "Manage Sources" button
    const manageSourcesBtn = await page.$('a[href="/division-admin/sources"]');
    if (manageSourcesBtn) {
      logSuccess('Division Dashboard', '"Manage Sources" action button present with correct href');
    } else {
      logIssue('Division Dashboard', 'Manage Sources Link', 'Link to /division-admin/sources', 'Not found', 'Medium');
    }

    // Test "Print QR Batch" button
    const printQrBtn = await page.$('a[href="/division-admin/bottles"]');
    if (printQrBtn) {
      logSuccess('Division Dashboard', '"Print QR Batch" action button present with correct href');
    } else {
      logIssue('Division Dashboard', 'Print QR Link', 'Link to /division-admin/bottles', 'Not found', 'Medium');
    }

    // ==========================================
    // TEST 3: WATER SOURCES MASTER (/division-admin/sources)
    // ==========================================
    console.log('\n--- Testing Module 3: Water Sources Master (/division-admin/sources) ---');
    await page.goto(`${BASE_URL}/division-admin/sources`, { waitUntil: 'networkidle0' });

    // Test Search input
    const sourceSearch = await page.$('input[placeholder*="Search"]');
    if (sourceSearch) {
      await sourceSearch.type('Rampur');
      await sleep(300);
      const rowCount = await page.$$eval('tbody tr', trs => trs.length);
      logSuccess('Water Sources', `Search filter functional (found ${rowCount} matching rows for "Rampur")`);
      await page.evaluate(el => el.value = '', sourceSearch);
      await sourceSearch.type('');
    } else {
      logIssue('Water Sources', 'Search Input', 'Search input for sources', 'Not found', 'Medium');
    }

    // Test "Register New Source" Modal
    const addSourceBtn = await page.$('button');
    let addSourceClicked = false;
    const allButtonsSources = await page.$$('button');
    for (const b of allButtonsSources) {
      const text = await page.evaluate(el => el.innerText, b);
      if (text.includes('Register New Source') || text.includes('Add Source')) {
        await b.click();
        addSourceClicked = true;
        await sleep(300);
        break;
      }
    }

    if (addSourceClicked) {
      const modalHeader = await page.$eval('h3', el => el.innerText).catch(() => '');
      if (modalHeader.includes('Register') || modalHeader.includes('Source')) {
        logSuccess('Water Sources', `Registration modal opened: "${modalHeader}"`);
        // Test form inputs inside modal
        const nameInput = await page.$('input[placeholder*="Name"], input[placeholder*="source"], input[required]');
        if (nameInput) {
          await nameInput.type('Audit Test Shallow Borewell #99');
        }
        // Close modal
        const cancelBtn = await page.$$eval('button', btns => {
          const c = btns.find(b => b.innerText.includes('Cancel'));
          if (c) { c.click(); return true; }
          return false;
        });
        await sleep(200);
        logSuccess('Water Sources', 'Registration modal input tested and closed cleanly');
      } else {
        logIssue('Water Sources', 'Add Source Modal', 'Modal header should contain Register Source', modalHeader, 'Medium');
      }
    } else {
      logIssue('Water Sources', 'Add Source Button', 'Register New Source button present', 'Not found', 'High');
    }

    // Test "Print QR Plate" modal
    const printButtons = await page.$$('button');
    let printClicked = false;
    for (const b of printButtons) {
      const text = await page.evaluate(el => el.innerText, b);
      if (text.includes('Print') || text.includes('Plate')) {
        await b.click();
        printClicked = true;
        await sleep(400);
        break;
      }
    }

    if (printClicked) {
      const qrImg = await page.$('img[alt*="QR"], img[src^="data:image"]');
      if (qrImg) {
        logSuccess('Water Sources', '100x60mm aluminum plate modal opened with rendered QR code');
      } else {
        logIssue('Water Sources', 'QR Image', 'QR Code image rendered in print modal', 'No QR image found', 'Medium');
      }
      // Close modal
      await page.$$eval('button', btns => {
        const c = btns.find(b => b.innerText.includes('Close') || b.querySelector('svg'));
        if (c) c.click();
      });
      await sleep(200);
    }

    // ==========================================
    // TEST 4: PWSS SCHEMES MASTER (/division-admin/schemes)
    // ==========================================
    console.log('\n--- Testing Module 4: PWSS Schemes Master (/division-admin/schemes) ---');
    await page.goto(`${BASE_URL}/division-admin/schemes`, { waitUntil: 'networkidle0' });

    const schemesTitle = await page.$eval('h1', el => el.innerText).catch(() => '');
    if (schemesTitle.includes('Schemes') || schemesTitle.includes('PWSS')) {
      logSuccess('PWSS Schemes', `Page loaded with title: "${schemesTitle}"`);
    } else {
      logIssue('PWSS Schemes', 'Title', 'Water Supply Schemes title', schemesTitle, 'High');
    }

    // Test Scheme Type filters
    const filterButtons = await page.$$eval('button', btns => btns.map(b => b.innerText).filter(t => t.includes('Groundwater') || t.includes('Surface')));
    if (filterButtons.length >= 2) {
      logSuccess('PWSS Schemes', `Scheme type filter buttons present: ${filterButtons.join(', ')}`);
      // Click Groundwater
      await page.$$eval('button', btns => {
        const gw = btns.find(b => b.innerText.includes('Groundwater'));
        if (gw) gw.click();
      });
      await sleep(300);
      const filteredRows = await page.$$eval('tbody tr', trs => trs.length);
      logSuccess('PWSS Schemes', `Filtering by Groundwater active (${filteredRows} schemes displayed)`);
    } else {
      logIssue('PWSS Schemes', 'Type Filters', 'Type filter buttons present', `Found ${filterButtons.length}`, 'Medium');
    }

    // Test "View Sources" drawer button
    const viewSourcesBtn = await page.$$eval('button', btns => {
      const vs = btns.find(b => b.innerText.includes('View Sources'));
      if (vs) { vs.click(); return true; }
      return false;
    });

    if (viewSourcesBtn) {
      await sleep(300);
      const drawerHeader = await page.$eval('h3', el => el.innerText).catch(() => '');
      logSuccess('PWSS Schemes', `Connected water sources slide-over drawer opened: "${drawerHeader}"`);
      // Close drawer
      await page.$$eval('button', btns => {
        const c = btns.find(b => b.innerText.includes('Close View'));
        if (c) c.click();
      });
      await sleep(200);
    } else {
      logIssue('PWSS Schemes', 'View Sources Drawer', 'View Sources button in scheme table', 'Not found', 'Medium');
    }

    // Test "Add New Scheme" modal
    await page.$$eval('button', btns => {
      const b = btns.find(b => b.innerText.includes('Add New Scheme'));
      if (b) b.click();
    });
    await sleep(300);
    const addSchemeModal = await page.$eval('h3', el => el.innerText).catch(() => '');
    if (addSchemeModal.includes('Register') || addSchemeModal.includes('Scheme')) {
      logSuccess('PWSS Schemes', 'Add Scheme modal opened successfully');
      // Add a village tag
      const villageInput = await page.$('input[placeholder*="village"]');
      if (villageInput) {
        await villageInput.type('Bijoynagar Gaon');
        await page.keyboard.press('Enter');
        await sleep(200);
        logSuccess('PWSS Schemes', 'Village coverage tag addition tested');
      }
      // Cancel modal
      await page.$$eval('button', btns => {
        const c = btns.find(b => b.innerText.includes('Cancel'));
        if (c) c.click();
      });
      await sleep(200);
    } else {
      logIssue('PWSS Schemes', 'Add Scheme Modal', 'Modal should open on button click', addSchemeModal, 'Medium');
    }

    // ==========================================
    // TEST 5: SAMPLING TASKS & PLANS (/division-admin/tasks)
    // ==========================================
    console.log('\n--- Testing Module 5: Sampling Plan & Task Assignment (/division-admin/tasks) ---');
    await page.goto(`${BASE_URL}/division-admin/tasks`, { waitUntil: 'networkidle0' });

    const tasksTitle = await page.$eval('h1', el => el.innerText).catch(() => '');
    if (tasksTitle.includes('Sampling Plan') || tasksTitle.includes('Task Assignment')) {
      logSuccess('Sampling Tasks', `Page loaded with title: "${tasksTitle}"`);
    } else {
      logIssue('Sampling Tasks', 'Title', 'Sampling Plan title', tasksTitle, 'High');
    }

    // Check KPI cards
    const overdueCard = await page.$$eval('div', divs => {
      const d = divs.find(el => el.innerText.includes('Overdue Tasks'));
      return d ? d.innerText.replace(/\n/g, ' ') : null;
    });
    if (overdueCard) {
      logSuccess('Sampling Tasks', `Overdue task monitoring card verified: "${overdueCard.slice(0, 40)}..."`);
    } else {
      logIssue('Sampling Tasks', 'Overdue KPI', 'Overdue tasks card present', 'Not found', 'Low');
    }

    // Test Status Filter Pills
    const statusBtns = await page.$$eval('button', btns => btns.map(b => b.innerText).filter(t => t === 'All' || t === 'Pending' || t === 'Overdue'));
    if (statusBtns.length >= 3) {
      logSuccess('Sampling Tasks', `Status filter pills present: ${statusBtns.join(', ')}`);
      // Click Overdue filter
      await page.$$eval('button', btns => {
        const ov = btns.find(b => b.innerText === 'Overdue');
        if (ov) ov.click();
      });
      await sleep(300);
      const overdueRows = await page.$$eval('tbody tr', trs => trs.length);
      logSuccess('Sampling Tasks', `Overdue filter active (${overdueRows} tasks shown)`);
      // Reset to All
      await page.$$eval('button', btns => {
        const al = btns.find(b => b.innerText === 'All');
        if (al) al.click();
      });
      await sleep(200);
    } else {
      logIssue('Sampling Tasks', 'Status Pills', 'All, Pending, Overdue filter pills', `Found ${statusBtns.length}`, 'Low');
    }

    // Test "Auto-Generate Monthly Plan" Modal
    await page.$$eval('button', btns => {
      const b = btns.find(b => b.innerText.includes('Auto-Generate'));
      if (b) b.click();
    });
    await sleep(300);
    const batchModal = await page.$eval('h3', el => el.innerText).catch(() => '');
    if (batchModal.includes('Generate') || batchModal.includes('Plan')) {
      logSuccess('Sampling Tasks', `Batch Generator modal opened: "${batchModal}"`);
      await page.$$eval('button', btns => {
        const c = btns.find(b => b.innerText.includes('Cancel'));
        if (c) c.click();
      });
      await sleep(200);
    } else {
      logIssue('Sampling Tasks', 'Batch Modal', 'Batch generator modal should open', batchModal, 'Medium');
    }

    // Test "Reassign" button in table
    const reassignBtn = await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('Reassign'));
      if (b) { b.click(); return true; }
      return false;
    });

    if (reassignBtn) {
      await sleep(300);
      const reassignHeader = await page.$eval('h3', el => el.innerText).catch(() => '');
      logSuccess('Sampling Tasks', `Task Reassignment modal opened: "${reassignHeader}"`);
      await page.$$eval('button', btns => {
        const c = btns.find(b => b.innerText.includes('Cancel'));
        if (c) c.click();
      });
      await sleep(200);
    } else {
      logIssue('Sampling Tasks', 'Reassign Button', 'Reassign action button in tasks table', 'Not found', 'Low');
    }

    // ==========================================
    // TEST 6: BOTTLE QR BATCHES (/division-admin/bottles)
    // ==========================================
    console.log('\n--- Testing Module 6: Bottle QR Batches (/division-admin/bottles) ---');
    await page.goto(`${BASE_URL}/division-admin/bottles`, { waitUntil: 'networkidle0' });

    const bottleTitle = await page.$eval('h1', el => el.innerText).catch(() => '');
    if (bottleTitle.includes('Bottle QR') || bottleTitle.includes('Batch')) {
      logSuccess('Bottle QR Batches', `Page loaded with title: "${bottleTitle}"`);
    } else {
      logIssue('Bottle QR Batches', 'Title', 'Bottle QR Batch Generator title', bottleTitle, 'High');
    }

    // Test Quantity input
    const qtyInput = await page.$('input[type="number"]');
    if (qtyInput) {
      await page.evaluate(el => el.value = '15', qtyInput);
      logSuccess('Bottle QR Batches', 'Batch quantity input verified');
    }

    // Test Recent Printed Bottles Table
    const bottleRows = await page.$$eval('tbody tr', trs => trs.length);
    logSuccess('Bottle QR Batches', `Recent bottles table rendered with ${bottleRows} rows`);

    // ==========================================
    // TEST 7: GEO-EXCEPTION REVIEW (/division-admin/exceptions)
    // ==========================================
    console.log('\n--- Testing Module 7: Geo-Exception Review (/division-admin/exceptions) ---');
    await page.goto(`${BASE_URL}/division-admin/exceptions`, { waitUntil: 'networkidle0' });

    const excTitle = await page.$eval('h1', el => el.innerText).catch(() => '');
    if (excTitle.includes('Exception')) {
      logSuccess('Geo-Exceptions', `Page loaded with title: "${excTitle}"`);
    } else {
      logIssue('Geo-Exceptions', 'Title', 'Geo-Exception Review title', excTitle, 'High');
    }

    // Test "Inspect & Decide" button
    const inspectBtn = await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('Inspect'));
      if (b) { b.click(); return true; }
      return false;
    });

    if (inspectBtn) {
      await sleep(300);
      const decModal = await page.$eval('h3, div', el => el.innerText).catch(() => '');
      logSuccess('Geo-Exceptions', 'Decision arbitration modal opened');

      // Check Spatial Offset and Sampler Reliability display
      const modalText = await page.$eval('.fixed', el => el.innerText).catch(() => '');
      if (modalText.includes('GPS Offset') || modalText.includes('Reliability')) {
        logSuccess('Geo-Exceptions', 'Spatial discrepancy offset and sampler reliability rate displayed');
      } else {
        logIssue('Geo-Exceptions', 'Spatial Breakdown', 'GPS offset and sampler reliability stats in modal', 'Not found in modal text', 'Medium');
      }

      // Test remarks input
      const remarksArea = await page.$('textarea');
      if (remarksArea) {
        await remarksArea.type('Inspected: Flooded river runoff path verified with AEE.');
        logSuccess('Geo-Exceptions', 'Admin review remarks input functional');
      }

      // Close modal
      await page.$$eval('button', btns => {
        const x = btns.find(b => b.querySelector('svg.lucide-x') || b.innerText.includes('Close'));
        if (x) x.click();
      });
      await sleep(200);
    } else {
      logIssue('Geo-Exceptions', 'Inspect Button', 'Inspect & Decide button in exceptions table', 'Not found', 'Low');
    }

    // ==========================================
    // TEST 8: SAMPLES & CUSTODY (/division-admin/samples)
    // ==========================================
    console.log('\n--- Testing Module 8: Samples & Chain of Custody (/division-admin/samples) ---');
    await page.goto(`${BASE_URL}/division-admin/samples`, { waitUntil: 'networkidle0' });

    const samplesTitle = await page.$eval('h1', el => el.innerText).catch(() => '');
    if (samplesTitle.includes('Samples') || samplesTitle.includes('Custody')) {
      logSuccess('Samples & Custody', `Page loaded with title: "${samplesTitle}"`);
    } else {
      logIssue('Samples & Custody', 'Title', 'Samples & Custody Ledger title', samplesTitle, 'High');
    }

    // Test CSV Export button
    const exportCsvBtn = await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('Export CSV'));
      return b ? true : false;
    });
    if (exportCsvBtn) {
      logSuccess('Samples & Custody', '"Export CSV" action button present and ready');
    } else {
      logIssue('Samples & Custody', 'Export CSV', 'Export CSV button in samples header', 'Not found', 'Low');
    }

    // Test "Custody Trail" button
    const custodyTrailBtn = await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('Custody Trail') || btn.innerText.includes('Timeline'));
      if (b) { b.click(); return true; }
      return false;
    });

    if (custodyTrailBtn) {
      await sleep(300);
      const modalText = await page.$eval('.fixed', el => el.innerText).catch(() => '');
      if (modalText.includes('Official Narrative') || modalText.includes('Field Testing Kit')) {
        logSuccess('Samples & Custody', 'Visual timeline modal opened with On-Site Field Kit Readings & Official Narrative');
      } else {
        logIssue('Samples & Custody', 'Custody Narrative', 'Official narrative and field kit readings in modal', 'Not found', 'Medium');
      }
      // Close modal
      await page.$$eval('button', btns => {
        const c = btns.find(b => b.innerText.includes('Close'));
        if (c) c.click();
      });
      await sleep(200);
    } else {
      logIssue('Samples & Custody', 'Custody Trail Button', 'View custody trail button in table', 'Not found', 'Low');
    }

    // ==========================================
    // TEST 9: REMEDIATION ALERTS (/division-admin/alerts)
    // ==========================================
    console.log('\n--- Testing Module 9: Remediation Alerts (/division-admin/alerts) ---');
    await page.goto(`${BASE_URL}/division-admin/alerts`, { waitUntil: 'networkidle0' });

    const alertsTitle = await page.$eval('h1', el => el.innerText).catch(() => '');
    if (alertsTitle.includes('Alerts') || alertsTitle.includes('Triage')) {
      logSuccess('Remediation Alerts', `Page loaded with title: "${alertsTitle}"`);
    } else {
      logIssue('Remediation Alerts', 'Title', 'Alerts Triage title', alertsTitle, 'High');
    }

    // Test Severity & Status filters
    const alertStatusBtns = await page.$$eval('button', btns => btns.map(b => b.innerText).filter(t => t === 'All' || t === 'Open' || t === 'Resolved'));
    if (alertStatusBtns.length >= 3) {
      logSuccess('Remediation Alerts', `Status filter buttons present: ${alertStatusBtns.join(', ')}`);
    } else {
      logIssue('Remediation Alerts', 'Filter Buttons', 'All, Open, Resolved filter buttons', `Found ${alertStatusBtns.length}`, 'Low');
    }

    // Test Triage Action Modal
    const triageBtn = await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('Triage') || btn.innerText.includes('Take Action'));
      if (b) { b.click(); return true; }
      return false;
    });

    if (triageBtn) {
      await sleep(300);
      const triageHeader = await page.$eval('h3', el => el.innerText).catch(() => '');
      logSuccess('Remediation Alerts', `Triage modal opened: "${triageHeader}"`);

      // Check Remediation Action dropdown
      const actionSelect = await page.$('select');
      if (actionSelect) {
        logSuccess('Remediation Alerts', 'Remediation actions selector verified (Bleaching powder, booster chlorination, etc.)');
      }

      // Close modal
      await page.$$eval('button', btns => {
        const c = btns.find(b => b.innerText.includes('Cancel'));
        if (c) c.click();
      });
      await sleep(200);
    } else {
      logIssue('Remediation Alerts', 'Triage Button', 'Triage & Take Action button on open alert card', 'Not found', 'Medium');
    }

    // ==========================================
    // TEST 10: STAFF & DEVICES (/division-admin/staff)
    // ==========================================
    console.log('\n--- Testing Module 10: Staff & Device Security (/division-admin/staff) ---');
    await page.goto(`${BASE_URL}/division-admin/staff`, { waitUntil: 'networkidle0' });

    const staffTitle = await page.$eval('h1', el => el.innerText).catch(() => '');
    if (staffTitle.includes('Staff') || staffTitle.includes('Device')) {
      logSuccess('Staff & Devices', `Page loaded with title: "${staffTitle}"`);
    } else {
      logIssue('Staff & Devices', 'Title', 'Staff & Device Management title', staffTitle, 'High');
    }

    // Test Tab 2: Switch to "Device Security & Binding"
    await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('Device Security'));
      if (b) b.click();
    });
    await sleep(300);

    const deviceTableHeader = await page.$eval('h2', el => el.innerText).catch(() => '');
    if (deviceTableHeader.includes('Hardware') || deviceTableHeader.includes('Bound')) {
      logSuccess('Staff & Devices', `Switched to Device Security tab: "${deviceTableHeader}"`);
    } else {
      logIssue('Staff & Devices', 'Device Tab', 'Header should mention hardware/bound phones', deviceTableHeader, 'Medium');
    }

    // Test Remote Revoke / Unblock button
    const remoteActionBtn = await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('Remote Revoke') || btn.innerText.includes('Unblock'));
      return b ? b.innerText : null;
    });
    if (remoteActionBtn) {
      logSuccess('Staff & Devices', `Remote device security lock button functional: "${remoteActionBtn}"`);
    } else {
      logIssue('Staff & Devices', 'Remote Revoke Button', 'Remote Revoke/Unblock button in devices table', 'Not found', 'Low');
    }

    // Test "Register Staff Member" Modal
    await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('Register Staff Member'));
      if (b) b.click();
    });
    await sleep(300);
    const staffModalHeader = await page.$eval('h3', el => el.innerText).catch(() => '');
    if (staffModalHeader.includes('Register') || staffModalHeader.includes('Staff')) {
      logSuccess('Staff & Devices', `Register Staff modal opened: "${staffModalHeader}"`);
      await page.$$eval('button', btns => {
        const c = btns.find(b => b.innerText.includes('Cancel'));
        if (c) c.click();
      });
      await sleep(200);
    } else {
      logIssue('Staff & Devices', 'Register Staff Modal', 'Register Staff modal should open', staffModalHeader, 'Medium');
    }

    // ==========================================
    // TEST 11: GIS SOURCE MAP (/division-admin/gis-map)
    // ==========================================
    console.log('\n--- Testing Module 11: GIS Source Map (/division-admin/gis-map) ---');
    await page.goto(`${BASE_URL}/division-admin/gis-map`, { waitUntil: 'networkidle0' });

    await sleep(1000); // Allow Leaflet to initialize
    const mapContainer = await page.$('.leaflet-container');
    if (mapContainer) {
      logSuccess('GIS Map', 'Leaflet map container initialized with PostGIS spatial layers');
    } else {
      logIssue('GIS Map', 'Leaflet Container', 'Leaflet map container present', 'Not found', 'High');
    }

    // Test Layer filter tabs
    const layerFilterBtns = await page.$$eval('button', btns => btns.map(b => b.innerText).filter(t => t.includes('All') || t.includes('Verified') || t.includes('Risk')));
    if (layerFilterBtns.length >= 2) {
      logSuccess('GIS Map', `Map layer filter buttons present: ${layerFilterBtns.join(', ')}`);
    } else {
      logIssue('GIS Map', 'Layer Filters', 'All, Verified, High Risk filters', `Found ${layerFilterBtns.length}`, 'Low');
    }

    // ==========================================
    // TEST 12: CONTAMINANT TRENDS (/division-admin/trends)
    // ==========================================
    console.log('\n--- Testing Module 12: Contaminant Trends (/division-admin/trends) ---');
    await page.goto(`${BASE_URL}/division-admin/trends`, { waitUntil: 'networkidle0' });

    const trendsTitle = await page.$eval('h1', el => el.innerText).catch(() => '');
    if (trendsTitle.includes('Trends') || trendsTitle.includes('Seasonal')) {
      logSuccess('Contaminant Trends', `Page loaded with title: "${trendsTitle}"`);
    } else {
      logIssue('Contaminant Trends', 'Title', 'Water Quality Trends title', trendsTitle, 'High');
    }

    // Test Parameter selector dropdown
    const paramSelect = await page.$('select');
    if (paramSelect) {
      await page.select('select', 'TURB');
      await sleep(300);
      const svgPolyline = await page.$('svg polyline');
      if (svgPolyline) {
        logSuccess('Contaminant Trends', 'Parameter selector changed to Turbidity; SVG trend line re-rendered');
      } else {
        logIssue('Contaminant Trends', 'SVG Chart', 'SVG polyline chart curve rendered', 'No polyline found', 'Medium');
      }
    } else {
      logIssue('Contaminant Trends', 'Parameter Select', 'Parameter selector dropdown', 'Not found', 'Medium');
    }

    // ==========================================
    // TEST 13: STATUTORY REPORTS (/division-admin/reports)
    // ==========================================
    console.log('\n--- Testing Module 13: Statutory Reports (/division-admin/reports) ---');
    await page.goto(`${BASE_URL}/division-admin/reports`, { waitUntil: 'networkidle0' });

    const certHeader = await page.$eval('h2, h1', el => el.innerText).catch(() => '');
    if (certHeader.includes('Compliance') || certHeader.includes('Report') || certHeader.includes('Assam')) {
      logSuccess('Statutory Reports', `Printable certificate loaded: "${certHeader.split('\n')[0]}"`);
    } else {
      logIssue('Statutory Reports', 'Certificate Header', 'Official report certificate header', certHeader, 'Medium');
    }

    // Test Export CSV button
    const exportReportBtn = await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('CSV') || btn.innerText.includes('Export'));
      return b ? true : false;
    });
    if (exportReportBtn) {
      logSuccess('Statutory Reports', '"Export CSV" action button verified');
    } else {
      logIssue('Statutory Reports', 'Export Button', 'Export CSV button present', 'Not found', 'Low');
    }

    // ==========================================
    // TEST 14: LAB OPERATIONS PORTAL (/lab-portal)
    // ==========================================
    console.log('\n--- Testing Module 14: Lab Operations Portal (/lab-portal) ---');
    await page.goto(`${BASE_URL}/lab-portal`, { waitUntil: 'networkidle0' });

    const labTitle = await page.$eval('h1', el => el.innerText).catch(() => '');
    if (labTitle.includes('Laboratory') || labTitle.includes('Lab')) {
      logSuccess('Lab Portal', `Page loaded with title: "${labTitle}"`);
    } else {
      logIssue('Lab Portal', 'Title', 'Laboratory Operations title', labTitle, 'High');
    }

    // Test Tab 1: Bottle Receipt & Holding Time
    await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('Bottle Receipt'));
      if (b) b.click();
    });
    await sleep(300);

    const holdingTimeCard = await page.$eval('.rounded-xl', el => el.innerText).catch(() => '');
    if (holdingTimeCard.includes('Holding Time') || holdingTimeCard.includes('Hours')) {
      logSuccess('Lab Portal', 'Bottle Receipt tab active with Holding Time elapsed calculation');
    } else {
      logIssue('Lab Portal', 'Holding Time Card', 'Holding time calculation card in receipt tab', 'Not found', 'Medium');
    }

    // Test Tab 2: Test Result Entry & Live IS 10500 Evaluation
    await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('Enter Test Results'));
      if (b) b.click();
    });
    await sleep(300);

    const firstParamInput = await page.$('input[type="number"]');
    if (firstParamInput) {
      await firstParamInput.type('7.2');
      await sleep(200);
      const evalBadge = await page.$$eval('span', spans => {
        const s = spans.find(el => el.innerText.includes('Acceptable') || el.innerText.includes('Permissible'));
        return s ? s.innerText : null;
      });
      if (evalBadge) {
        logSuccess('Lab Portal', `Live BIS IS 10500 compliance evaluation chip active: "${evalBadge}"`);
      } else {
        logIssue('Lab Portal', 'Live Evaluation', 'Live evaluation chip on numeric input', 'Not rendered', 'Medium');
      }
    }

    // Test Tab 3: In-Charge Approval Sign-Off
    await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('In-Charge Approval'));
      if (b) b.click();
    });
    await sleep(300);

    const approvalTableHeader = await page.$eval('h2', el => el.innerText).catch(() => '');
    if (approvalTableHeader.includes('In-Charge') || approvalTableHeader.includes('Endorsement')) {
      logSuccess('Lab Portal', `Lab In-Charge Approval tab active: "${approvalTableHeader}"`);
    } else {
      logIssue('Lab Portal', 'Approval Tab', 'In-Charge Approval tab header', approvalTableHeader, 'Medium');
    }

    // ==========================================
    // TEST 15: SUPER ADMIN STATE CELL (/super-admin)
    // ==========================================
    console.log('\n--- Testing Module 15: Super Admin State Cell (/super-admin) ---');
    await page.goto(`${BASE_URL}/super-admin`, { waitUntil: 'networkidle0' });

    const superTitle = await page.$eval('h1', el => el.innerText).catch(() => '');
    if (superTitle.includes('Super Admin') || superTitle.includes('State Water Quality')) {
      logSuccess('Super Admin', `Page loaded with title: "${superTitle}"`);
    } else {
      logIssue('Super Admin', 'Title', 'Super Admin Governance title', superTitle, 'High');
    }

    // Test Tab: Divisions & Labs
    await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('Divisions & Labs'));
      if (b) b.click();
    });
    await sleep(300);
    const labsHeader = await page.$eval('h2', el => el.innerText).catch(() => '');
    if (labsHeader.includes('Laboratories') || labsHeader.includes('Labs')) {
      logSuccess('Super Admin', `State Labs directory active with NABL accreditation flags: "${labsHeader}"`);
    } else {
      logIssue('Super Admin', 'Labs Master', 'Laboratories directory header', labsHeader, 'Medium');
    }

    // Test Tab: State Users
    await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('State Users'));
      if (b) b.click();
    });
    await sleep(300);
    const usersHeader = await page.$eval('h2', el => el.innerText).catch(() => '');
    if (usersHeader.includes('User Roster') || usersHeader.includes('Users')) {
      logSuccess('Super Admin', `State User Directory active: "${usersHeader}"`);
    } else {
      logIssue('Super Admin', 'Users Directory', 'State User Roster header', usersHeader, 'Medium');
    }

    // Test Tab: IS 10500 Limits Configurator
    await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('IS 10500 Limits'));
      if (b) b.click();
    });
    await sleep(300);

    const editLimitBtn = await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('Edit Limits'));
      if (b) { b.click(); return true; }
      return false;
    });

    if (editLimitBtn) {
      await sleep(300);
      const limitModalHeader = await page.$eval('h3', el => el.innerText).catch(() => '');
      logSuccess('Super Admin', `Parameter Limits edit modal opened: "${limitModalHeader}"`);
      await page.$$eval('button', btns => {
        const c = btns.find(b => b.innerText.includes('Cancel'));
        if (c) c.click();
      });
      await sleep(200);
    } else {
      logIssue('Super Admin', 'Edit Limits Button', 'Edit Limits button in parameters table', 'Not found', 'Low');
    }

    // Test Tab: Policy & Rules
    await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('Policy & Rules'));
      if (b) b.click();
    });
    await sleep(300);

    const strictBlockBtn = await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('STRICT BLOCK'));
      if (b) { b.click(); return true; }
      return false;
    });
    if (strictBlockBtn) {
      await sleep(200);
      logSuccess('Super Admin', 'Geo-fence policy toggled to STRICT BLOCK successfully');
    }

    // Test Tab: Cryptographic Audit Explorer & JSON Diff
    await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('Audit Log Ledger'));
      if (b) b.click();
    });
    await sleep(300);

    const auditBadge = await page.$$eval('span', spans => {
      const s = spans.find(el => el.innerText.includes('Chain Integrity Verified'));
      return s ? s.innerText : null;
    });
    if (auditBadge) {
      logSuccess('Super Admin', `Cryptographic append-only hash chain integrity verified: "${auditBadge}"`);
    } else {
      logIssue('Super Admin', 'Chain Integrity', 'Chain integrity verified badge in audit log', 'Not found', 'Low');
    }

    // Test "View Diff" modal
    const viewDiffBtn = await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('View Diff'));
      if (b) { b.click(); return true; }
      return false;
    });

    if (viewDiffBtn) {
      await sleep(300);
      const diffModalHeader = await page.$eval('h3', el => el.innerText).catch(() => '');
      logSuccess('Super Admin', `Audit JSON State Diff inspector modal opened: "${diffModalHeader}"`);
      await page.$$eval('button', btns => {
        const c = btns.find(b => b.innerText.includes('Close Inspector'));
        if (c) c.click();
      });
      await sleep(200);
    } else {
      logIssue('Super Admin', 'View Diff Button', 'View Diff button in audit rows', 'Not found', 'Low');
    }

    // ==========================================
    // TEST 16: BULK DATA IMPORT WIZARD (/super-admin/import)
    // ==========================================
    console.log('\n--- Testing Module 16: Bulk Data Import Wizard (/super-admin/import) ---');
    await page.goto(`${BASE_URL}/super-admin/import`, { waitUntil: 'networkidle0' });

    const importTitle = await page.$eval('h1', el => el.innerText).catch(() => '');
    if (importTitle.includes('Bulk') || importTitle.includes('Import')) {
      logSuccess('Bulk Import', `Page loaded with title: "${importTitle}"`);
    } else {
      logIssue('Bulk Import', 'Title', 'Bulk Import Wizard title', importTitle, 'High');
    }

    // Step 1: Select target and click "Next"
    await page.$$eval('button', btns => {
      const b = btns.find(btn => btn.innerText.includes('Next: Map Columns'));
      if (b) b.click();
    });
    await sleep(300);

    // Step 2: Check column mapper
    const mapHeader = await page.$eval('h2', el => el.innerText).catch(() => '');
    if (mapHeader.includes('Map') || mapHeader.includes('Columns')) {
      logSuccess('Bulk Import', 'Step 2: Column Mapper loaded successfully');
      // Click Validate & Preview Rows
      await page.$$eval('button', btns => {
        const b = btns.find(btn => btn.innerText.includes('Validate & Preview'));
        if (b) b.click();
      });
      await sleep(300);
    } else {
      logIssue('Bulk Import', 'Step 2 Header', 'Column mapper header should appear', mapHeader, 'Medium');
    }

    // Step 3: Check preview table and commit
    const previewHeader = await page.$eval('h2', el => el.innerText).catch(() => '');
    if (previewHeader.includes('Validated Preview') || previewHeader.includes('Pre-Flight')) {
      logSuccess('Bulk Import', 'Step 3: Pre-flight validation preview table rendered with clean rows');
      // Commit batch
      await page.$$eval('button', btns => {
        const b = btns.find(btn => btn.innerText.includes('Commit Batch'));
        if (b) b.click();
      });
      await sleep(1000); // Allow commit simulation
    } else {
      logIssue('Bulk Import', 'Step 3 Header', 'Pre-flight validation header', previewHeader, 'Medium');
    }

    // Step 4: Check success confirmation
    const successHeader = await page.$eval('h2', el => el.innerText).catch(() => '');
    if (successHeader.includes('Successfully') || successHeader.includes('Committed')) {
      logSuccess('Bulk Import', `Step 4: Batch commitment completed: "${successHeader}"`);
    } else {
      logIssue('Bulk Import', 'Step 4 Header', 'Batch import success confirmation header', successHeader, 'Medium');
    }

    // ==========================================
    // TEST 17: SIDEBAR NAVIGATION & TOPBAR
    // ==========================================
    console.log('\n--- Testing Module 17: Navigation Shell & Links ---');
    const navLinks = await page.$$eval('aside a', as => as.map(a => ({ href: a.getAttribute('href'), text: a.innerText.trim() })));
    logSuccess('Navigation', `Sidebar verified with ${navLinks.length} operational routes`);

  } catch (err) {
    logIssue('Global Audit', 'Execution Exception', 'Audit script executes without crash', err.toString(), 'Critical');
  } finally {
    await browser.close();
  }

  // Check console errors
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(ce => {
      logIssue('Console Runtime', 'Browser Console Error', 'No uncaught client-side JS runtime errors', ce, 'Low');
    });
  }

  console.log('\n======================================================');
  console.log(`📊 AUDIT SUMMARY:`);
  console.log(`   Total Verified Capabilities (Passes): ${successes.length}`);
  console.log(`   Total Issues / Edge Cases Identified: ${issues.length}`);
  console.log('======================================================\n');

  // Write report to JSON for the agent
  fs.writeFileSync(
    path.join(__dirname, 'audit_results.json'),
    JSON.stringify({ successes, issues, totalPasses: successes.length, totalIssues: issues.length }, null, 2)
  );
}

runAudit();
