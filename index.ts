import * as fs from 'fs';
import { Browser, BrowserType, devices, chromium, firefox, webkit } from 'playwright'
import { PNG } from 'pngjs';
import * as pixelmatch from 'pixelmatch';

async function screenshot(browserType: BrowserType<Browser>) {
  // use `browserType` from arguments instead of hardcode
  const browser = await browserType.launch();
  // simulate browser behavior on a mobile device
  const iphone = devices["iPhone 11 Pro Max"]
  const context = await browser.newContext({
    ...iphone,
    // geolocation: { longitude: 103.2193726, latitude: 34.0548255 },
    // permissions: ['geolocation']
  });
  // open web page
  const page = await context.newPage();
  await page.goto('https://www.google.com/maps');
  await page.waitForNavigation();
  // click STAY ON WEB
  await page.click('button.ml-promotion-action-button');
  // take screenshot
  await page.screenshot({ path: `out/map-${browserType.name()}.png` });
  await browser.close();
}

// async function diff() {
//   const mapChromium = PNG.sync.read(fs.readFileSync('out/map-chromium.png'))
//   const mapWebkit = PNG.sync.read(fs.readFileSync('out/map-webkit.png'))
//   const { width, height } = mapChromium;
//   const diffImg = new PNG({ width, height });
//   pixelmatch(
//     mapChromium.data,
//     mapWebkit.data,
//     diffImg.data,
//     width,
//     height,
//     { threshold: 0.1 }
//   );
//   fs.writeFileSync('out/map-diff.png', PNG.sync.write(diffImg));
// }

(async () => {
  // firefox does not support mobile
  const BROWSER_TYPES = [
    chromium,
    // firefox,
    webkit
  ]
  // make screenshot all together
  await Promise.all(BROWSER_TYPES.map((browserType) => {
    console.log(`launch: ${browserType.name()}`);
    return screenshot(browserType);
  }));

  // diff();
  console.log('done!');
})();
