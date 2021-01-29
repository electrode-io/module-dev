/* eslint-disable no-console, no-magic-numbers, max-statements */

import { existsSync } from "fs";
import { join } from "path";

/**
 * search for actual app dir by looking for package.json
 *
 * @param dir starting dir
 * @param depth levels so far (to avoid infinite searching)
 * @returns dir if found
 */
function searchAppDir(dir: string, depth = 0): string {
  if (depth > 50) {
    return "";
  }

  const file = join(dir, "package.json");
  if (existsSync(file)) {
    return dir;
  }

  const newDir = join(dir, "..");
  if (newDir !== dir) {
    return searchAppDir(newDir, depth + 1);
  }

  return "";
}

/**
 * Show instructions on bootstrapping a project after npm install if project
 * doesn't have xrun-tasks.js or xrun-tasks.ts files yet.
 */
function installSetup(): void {
  const appDir = searchAppDir(process.env.INIT_CWD || "");

  if (
    appDir &&
    (existsSync(join(appDir, "xrun-tasks.js")) || existsSync(join(appDir, "xrun-tasks.ts")))
  ) {
    return;
  }

  console.error(`Welcome to @xarc/module-dev for developing node.js modules.

To bootstrap your project, run:

    npx xrun --require @xarc/module-dev init [options]

Default features: tap, typescript, typedoc, prettier

Options:

  --eslint        - bootstrap with eslint support
  --mocha         - bootstrap with mocha for running tests
  --tap           - bootstrap with tap for running tests
  --no-jest       - don't bootstrap with jest support
  --no-typescript - don't bootstrap with typescript support
  --no-typedoc    - don't bootstrap with typedoc support
  --no-prettier   - don't bootstrap with prettier support`);
}

installSetup();
