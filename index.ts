import { Browser, BrowserType, devices, chromium, firefox, webkit } from 'playwright'

(async () => {
  const browser = await webkit.launch();
  const page = await browser.newPage();
  await page.goto('http://whatsmyuseragent.org/');
  await page.screenshot({ path: `out/whatsmyuseragent.png` });
  await browser.close();
})();



// async function screenshot(browserType: BrowserType<Browser>) {
//   const iphonex = devices["iPhone 11 Pro Max"]

//   const browser = await browserType.launch();
//   const context = await browser.newContext({
//     ...iphonex,
//     // locale: 'de-DE',
//     // timezoneId: 'Europe/Berlin',
//     geolocation: { longitude: 103.2193726, latitude: 34.0548255 },
//     permissions: ['geolocation']
//   });
//   const page = await context.newPage();
//   await page.goto('https://www.google.com/maps');
//   await page.screenshot({ path: `out/example-${browserType.name()}.png` });
//   await browser.close();
// }

// (async () => {
//   const BROWSER_TYPES = [
//     chromium,
//     // firefox,
//     // webkit
//   ]
//   for (const browserType of BROWSER_TYPES) {
//     console.log(`launch: ${browserType.name()}`);
//     await screenshot(browserType);
//   }
//   console.log('done!');
// })();
