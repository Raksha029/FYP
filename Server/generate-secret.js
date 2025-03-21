const crypto = require("crypto");

// Generate a secure, random 64-byte hex string
const secret = crypto.randomBytes(64).toString("hex");

console.log("Generated JWT Secret:");
console.log(secret);
console.log("\nCopy this secret and paste it in your .env file as JWT_SECRET");
