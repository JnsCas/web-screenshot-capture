const { getBrowser } = require('./puppeteerUtils');

async function handleScreenshot(event, url, format) {
  console.log(`Capturing screenshot for url ${url} and format ${format}...`);

  const response = { buffer: undefined, error: undefined };

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.goto(url);

    if (format === 'pdf') {
      response.buffer = await page.pdf();
    } else {
      response.buffer = await page.screenshot();
    }
    await page.close();
  } catch (e) {
    console.error(e);
    response.error = e.toString();
  }
  return response;
}

module.exports = {
  handleScreenshot,
};
