import * as fs from 'fs';
import { Browser, BrowserType, devices, chromium, firefox, webkit } from 'playwright'
import { PNG } from 'pngjs';
import * as pixelmatch from 'pixelmatch';

async function screenshot(browserType: BrowserType<Browser>): Promise<string> {
  // use `browserType` from arguments instead of hardcode
  const browser = await browserType.launch();
  // simulate browser behavior on a mobile device
  const iphone = devices['iPhone X'];
  const context = await browser.newContext({
    ...iphone,
    geolocation: {
      longitude: 103.2199128,
      latitude: 34.0556586,
    },
    permissions: ['geolocation'],
  });
  // open web page
  const page = await context.newPage();
  await page.goto('https://www.google.com/maps');
  // https://www.google.com/maps/@-7.3281874,109.9076899,5z

  // await page.waitForNavigation();
  await page.waitForSelector('.ml-promotion-nonlu-blocking-promo');
  // click STAY ON WEB
  await page.click('button.ml-promotion-action-button.ml-promotion-no-button');
  // wait for more than 300 millisecond for browser to response with the events
  await page.waitForTimeout(400);
  // await page.waitForSelector('.ml-promotion-nonlu-blocking-promo.ml-promotion-off-screen')
  // click `your location` to navi to current location
  await page.click('button.ml-button-my-location-fab');
  // As I can not find any event which means relocat finished,
  // so we need to wait for some seconds for Google Maps to load resources
  await page.waitForTimeout(1000);
  
  // click and fill in search target
  await page.click('div.ml-searchbox-button-textarea');
  await page.waitForSelector('#ml-searchboxinput');
  await page.fill('#ml-searchboxinput', 'Zhagana');

  // take screenshot
  const outputPath = `out/map-${browserType.name()}.png`;
  await page.screenshot({ path: outputPath });
  await browser.close();
  return outputPath;
}

async function diff(fileA: string, fileB: string) {
  // read the 2 different PNG file
  const mapChromium = PNG.sync.read(fs.readFileSync(fileA));
  const mapWebkit = PNG.sync.read(fs.readFileSync(fileB));
  // init the diff image buffer
  const { width, height } = mapChromium;
  const diffImg = new PNG({ width, height });
  // pixel diff
  pixelmatch(
    mapChromium.data,
    mapWebkit.data,
    diffImg.data,
    width,
    height,
    { threshold: 0.1 }
  );
  // print out the diff image
  fs.writeFileSync('out/map-diff.png', PNG.sync.write(diffImg));
}

(async () => {
  // firefox does not support mobile
  const BROWSER_TYPES = [
    chromium,
    // firefox,
    // webkit
  ]
  // make screenshot all together
  await Promise.all(BROWSER_TYPES.map((browserType) => {
    console.log(`launch: ${browserType.name()}`);
    return screenshot(browserType);
  }));

  // diff();
  console.log('done!');
})();
