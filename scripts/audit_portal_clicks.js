const puppeteer = require('puppeteer');
const fs = require('fs');

async function auditWebClicks() {
  console.log('--- STARTING FORENSIC WEB AUDIT ---');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleLogs = [];
  const pageErrors = [];

  page.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      console.log('BROWSER CONSOLE ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    pageErrors.push(err.toString());
    console.log('PAGE ERROR (UNCAUGHT):', err.toString());
  });

  try {
    console.log('\n[1] Navigating to http://localhost:3000/login ...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    console.log('Current URL:', page.url());

    // Click on Division Admin tab and submit login
    console.log('[2] Clicking Division Admin login button...');
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }).catch(() => {});
      console.log('URL after login:', page.url());
    } else {
      console.log('Submit button not found, navigating directly to /division-admin');
      await page.goto('http://localhost:3000/division-admin', { waitUntil: 'networkidle2' });
    }

    console.log('\n[3] Auditing Sidebar Links on /division-admin...');
    // Extract all sidebar links
    const sidebarLinks = await page.evaluate(() => {
      const aside = document.querySelector('aside');
      if (!aside) return [];
      const links = Array.from(aside.querySelectorAll('a[href]'));
      return links.map(l => ({
        text: l.innerText.replace(/\n/g, ' ').trim(),
        href: l.getAttribute('href'),
        rect: l.getBoundingClientRect()
      }));
    });

    console.log(`Found ${sidebarLinks.length} sidebar links:`);
    for (const link of sidebarLinks) {
      console.log(` - "${link.text}" -> ${link.href}`);
    }

    // Now test clicking each sidebar link
    for (let i = 0; i < sidebarLinks.length; i++) {
      const linkInfo = sidebarLinks[i];
      console.log(`\nTesting click on link [${i + 1}/${sidebarLinks.length}]: "${linkInfo.text}" (${linkInfo.href})`);

      const prevUrl = page.url();
      
      // Attempt click via selector
      const clicked = await page.evaluate((targetHref) => {
        const aside = document.querySelector('aside');
        if (!aside) return false;
        const link = aside.querySelector(`a[href="${targetHref}"]`);
        if (!link) return false;
        
        // Check if element is obstructed
        const rect = link.getBoundingClientRect();
        const topEl = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        const isObstructed = topEl !== link && !link.contains(topEl);
        
        link.click();
        return { clicked: true, isObstructed, topElTag: topEl ? topEl.tagName + '.' + topEl.className : 'null' };
      }, linkInfo.href);

      console.log('Click execution:', JSON.stringify(clicked));

      // Wait a short time for navigation or URL change
      await new Promise(r => setTimeout(r, 1500));
      const newUrl = page.url();
      console.log(`Result: Prev URL: ${prevUrl} -> New URL: ${newUrl}`);

      if (prevUrl === newUrl && linkInfo.href !== prevUrl && !linkInfo.href.endsWith(prevUrl)) {
        console.log(`>>> NAVIGATION FAILED! Did not navigate to ${linkInfo.href}`);
      } else {
        console.log(`>>> Navigation succeeded or already on page!`);
      }
    }

  } catch (err) {
    console.error('Fatal audit error:', err);
  } finally {
    await browser.close();
    console.log('\n--- AUDIT COMPLETE ---');
  }
}

auditWebClicks();
