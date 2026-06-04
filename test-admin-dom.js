const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log('HTTP ERROR:', response.url(), response.status());
    }
  });

  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
  
  await browser.close();
})();
