import puppeteer from 'puppeteer'

let browser

export async function getBrowser() {
  if (browser) {
    console.log(`Returning existing browser...`)
    return browser
  }
  console.log(`Launching browser...`)
  browser = await puppeteer.launch({ headless: true })
  return browser
}

export async function closeBrowser() {
  if (browser) {
    console.log(`Closing browser...`)
    await browser.close()
  }
}
