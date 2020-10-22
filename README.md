# ZhaGaNa

Step by step guide to use [Playwright][pw].

## Project Setup

Create a as simple as we can project manually:

```sh
mkdir zhagana
cd zhagana
npm init
```

Install [Playwright][pw] and [TypeScript][ts] via npm, which may take some minutes to download browser binaries:

```sh
npm i playwright
npm i -D typescript
```

### TypeScript Configuration

Playwright for JavaScript and TypeScript is generally available. But we still need some configuration for TypeScript. Create a `tsconfig.json` file with the following content:

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "outDir": "build",
    "sourceMap": true
  }
}
```

### VS Code Launcher and Debuger

Click the **RUN** button on the left menu then **create a launch.json**. Select **Node.js** from the drop down if you have other debugger extensions.

![vscode-debuger](resources/vscode-debuger.png)

Make sure you have `"preLaunchTask": "tsc: build - tsconfig.json"` and `"outFiles": ["${workspaceFolder}/build/**/*.js"]` in _launch.json_.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "program": "${workspaceFolder}/index.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/build/**/*.js"]
    }
  ]
}
```

## Coding

We will start by taking a screenshot of the page. This is code [from their documentation](https://playwright.dev/#version=v1.5.1&path=docs%2Fintro.md&q=first-script), but transfer into TypeScript

```ts
import { webkit } from 'playwright'

(async () => {
  const browser = await webkit.launch();
  const page = await browser.newPage();
  await page.goto('http://whatsmyuseragent.org/');
  await page.screenshot({ path: `out/whatsmyuseragent.png` });
  await browser.close();
})();
```

Then you will get the _out/whatsmyuseragent.png_ file like this

![whatsmyuseragent](resources/whatsmyuseragent.jpg)

### 

## Postscript

> //TODO: Zhagana introduction

[pw]: https://playwright.dev
[ts]: https://www.typescriptlang.org