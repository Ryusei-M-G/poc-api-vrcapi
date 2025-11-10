import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTH_FILE = path.join(__dirname, "vrchat_auth.json");

/**
 * 保存された認証トークンを読み込む
 * @returns {Promise<string|null>} 認証トークン、または null
 */
export async function loadAuthToken() {
  try {
    console.log(`[authHelper] Reading auth file from: ${AUTH_FILE}`);
    const data = await fs.readFile(AUTH_FILE, "utf-8");
    console.log(`[authHelper] File content length: ${data.length} bytes`);
    const authData = JSON.parse(data);
    console.log(`[authHelper] Parsed JSON, authToken exists: ${!!authData.authToken}`);
    if (authData.authToken) {
      console.log(`[authHelper] Token length: ${authData.authToken.length} characters`);
    }
    return authData.authToken || null;
  } catch (error) {
    console.error("[authHelper] Failed to load auth token:", error.message);
    console.error("[authHelper] Error stack:", error.stack);
    return null;
  }
}
