const puppeteer = require('puppeteer');

let browser;

async function getBrowser() {
  if (browser) {
    console.log(`Returning existing browser...`);
    return browser;
  }
  console.log(`Launching browser...`);
  browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    executablePath: process.env.CHROME_EXECUTABLE_PATH,
  });
  return browser;
}

async function closeBrowser() {
  if (browser) {
    console.log(`Closing browser...`);
    await browser.close();
  }
}

module.exports = {
  getBrowser,
  closeBrowser,
};
