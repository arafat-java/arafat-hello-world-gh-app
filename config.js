import dotenv from "dotenv";
import fs from "fs";

// This reads your `.env` file and adds the variables from that file to the `process.env` object in Node.js.
dotenv.config();

// This assigns the values of your environment variables to local variables.
export const appId = process.env.APP_ID;
export const webhookSecret = process.env.WEBHOOK_SECRET;
export const privateKeyPath = process.env.PRIVATE_KEY_PATH;

// This reads the contents of your private key file.
export const privateKey = fs.readFileSync(privateKeyPath, "utf8");

// Server configuration
export const port = 3000;
export const host = 'localhost';
export const path = "/api/webhook";
export const localWebhookUrl = `http://${host}:${port}${path}`;

// Log configuration for debugging
console.log("Configuration loaded:");
console.log("APP_ID:", appId);
console.log("WEBHOOK_SECRET:", webhookSecret);
console.log("PRIVATE_KEY_PATH:", privateKeyPath);
