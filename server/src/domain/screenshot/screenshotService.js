import * as puppeteerUtils from './puppeteerUtils.js'

async function getScreenshotPng(page) {
  const buffer = await page.screenshot()
  return { buffer, contentType: 'image/png' }
}

async function getScreenshotPdf(page) {
  const buffer = await page.pdf()
  return { buffer, contentType: 'application/pdf' }
}

export async function getScreenshot(url, format) {
  const browser = await puppeteerUtils.getBrowser()
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  let screenshot
  if (format === 'png') {
    screenshot = await getScreenshotPng(page)
  } else if (format === 'pdf') {
    screenshot = await getScreenshotPdf(page)
  } else {
    throw new Error()
  }
  await page.close()
  return screenshot
}
