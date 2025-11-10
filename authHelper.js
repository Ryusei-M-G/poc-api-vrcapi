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
    const data = await fs.readFile(AUTH_FILE, "utf-8");
    const authData = JSON.parse(data);
    return authData.authToken || null;
  } catch (error) {
    console.error("Failed to load auth token:", error.message);
    return null;
  }
}
