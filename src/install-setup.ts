/* eslint-disable no-console, no-magic-numbers, max-statements */

import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

/**
 * search for actual app dir by looking for package.json
 *
 * @param dir starting dir
 * @returns dir if found
 */
function searchAppDir(dir: string): string {
  const file = join(dir, "package.json");
  if (existsSync(file)) {
    return dir;
  }

  const newDir = join(dir, "..");
  if (newDir !== dir) {
    return searchAppDir(newDir);
  }

  return "";
}

/**
 * Setup npm scripts for bootstrapping a module project
 */
function installSetup(): void {
  console.error("@xarc/module-dev post install, env INIT_CWD", process.env.INIT_CWD);
  const appDir = searchAppDir(process.env.INIT_CWD);

  if (!appDir) {
    console.error("@xarc/module-dev post install - unable to find app dir");
    return;
  }

  if (existsSync(join(appDir, "xclap.js")) || existsSync(join(appDir, "xclap.ts"))) {
    console.error("@xarc/module-dev post install - xclap.[js|ts] exist, skipping.");
    return;
  }

  const pkgJsonFile = join(appDir, "package.json");

  const appPkgData = readFileSync(pkgJsonFile).toString();

  const appPkg: any = JSON.parse(appPkgData);
  const scripts = appPkg.scripts || {};
  appPkg.scripts = scripts;

  scripts["xarc-init"] = `clap --require @xarc/module-dev init`;
  scripts["xarc-init-typescript"] = `clap --require @xarc/module-dev init --typescript`;

  const updatePkgData = JSON.stringify(appPkg, null, 2);
  writeFileSync(pkgJsonFile, `${updatePkgData}\n`);
}

installSetup();
