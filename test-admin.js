const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
  const rootHtml = await page.$eval('#root', el => el.innerHTML);
  console.log('ROOT HTML LENGTH:', rootHtml.length);
  await browser.close();
})();
