import * as fs from 'fs';
import { Browser, BrowserType, devices, chromium, firefox, webkit } from 'playwright'
import { PNG } from 'pngjs';
import * as pixelmatch from 'pixelmatch';

async function screenshot(browserType: BrowserType<Browser>): Promise<string> {
  // use `browserType` from arguments instead of hardcode
  const browser = await browserType.launch({
    // headless: false
  });
  // simulate browser behavior on a mobile device
  const iphone = devices['iPhone X']
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

  console.log(browserType.name(), 'pop');
  await page.waitForSelector('.ml-promotion-on-screen');
  // click STAY ON WEB
  await page.click('button.ml-promotion-action-button.ml-promotion-no-button');
  // wait for more than 300 millisecond for browser to response with the events
  // await page.waitForTimeout(400);

  // click `your location` to navi to current location
  console.log(browserType.name(), 'my-location');
  await page.click('button.ml-button-my-location-fab');
  
  // click to trigger input field
  console.log(browserType.name(), 'input');
  await page.click('div.ml-searchbox-button-textarea');
  await page.waitForSelector('#ml-searchboxinput');
  // fill in content
  await page.fill('#ml-searchboxinput', 'Zhagana');
  // press Enter to start searching
  await page.press('#ml-searchboxinput', 'Enter');

  // click Directions
  console.log(browserType.name(), 'directions');
  const directionsSelector = 'button[jsaction="pane.placeActions.directions"]'
  await page.waitForSelector(directionsSelector);
  await page.click(directionsSelector);
  // wait for result
  // As I can not find any event which means direction finished,
  // so we need to wait for some seconds for Google Maps to load resources
  await page.waitForTimeout(2000);

  // take screenshot, output path string as a result.
  console.log(browserType.name(), 'screenshot');
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
    webkit
  ]
  // make screenshot all together
  const maps = await Promise.all(BROWSER_TYPES.map((browserType) => {
    console.log(`launch: ${browserType.name()}`);
    return screenshot(browserType);
  }));

  diff(maps[0], maps[1]);
  console.log('done!');
})();
