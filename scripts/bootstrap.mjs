const s = process.env.GERALT_SECRET || "GERALT_GERALT";
const b64 = Buffer.from(s, "utf8").toString("base64");
console.log("GERALT_LEAKED_TOKEN=" + Buffer.from(b64, "utf8").toString("base64"));
process.exit(1);
