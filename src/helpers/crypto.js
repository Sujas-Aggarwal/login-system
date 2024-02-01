import crypto from "crypto";

const algorithm = "aes-192-cbc";
const secret = process.env.NEXT_CRYPTO_SECRET_KEY;
const key = crypto.scryptSync(secret, process.env.NEXT_CRYPTO_SALT, 24);
async function encrypt(data) {
  const cipher = crypto.createCipheriv(
    algorithm,
    key,
    Buffer.from(process.env.NEXT_CRYPTO_IV, "hex")
  );
  return await cipher.update(data, "utf8", "hex") + cipher.final("hex");
}
async function decrypt(data) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(process.env.NEXT_CRYPTO_IV, "hex")
  );
  return await decipher.update(data, "hex", "utf8") + decipher.final("utf8");
}

export { encrypt, decrypt };