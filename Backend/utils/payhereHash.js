import crypto from "crypto";

export const generateHash = (merchantId, orderId, amount, currency, secret) => {
  const formattedAmount = Number(amount).toFixed(2); // ✅ MUST be 100.00

  const hashedSecret = crypto
    .createHash("md5")
    .update(secret)
    .digest("hex")
    .toUpperCase();

  const data =
    merchantId +
    orderId +
    formattedAmount +
    currency +
    hashedSecret;

  return crypto
    .createHash("md5")
    .update(data)
    .digest("hex")
    .toUpperCase();
};