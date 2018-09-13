/* eslint-disable no-console */

const isWindows = /^win/.test(process.platform);

const npx = isWindows ? "npx.cmd" : "npx";
const npm = isWindows ? "npm.cmd" : "npm";

const { spawn } = require("child_process");
const start = spawn(npm, ["run", "start"]);
// const serve = spawn(npx, ["vue-cli-service", "serve"]);
const log = console.log;
const errAndExit = err => {
  console.log("err", err);
  process.exit(1);
};

// serve.on("data", log);
// serve.on("error", errAndExit);
// serve.on("close", log);

start.on("data", log);
start.on("error", errAndExit);
start.on("close", log);
