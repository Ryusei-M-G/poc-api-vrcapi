import { VRChat } from "vrchat";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTH_FILE = path.join(__dirname, "vrchat_auth.json");

// VRChatインスタンスから認証トークンを抽出
async function extractAuthToken(vrchat) {
  const cookies = await vrchat.getCookies();
  if (!cookies || cookies.length === 0) return null;

  const authCookie = cookies.find((cookie) => cookie.name === "auth");
  return authCookie?.value || null;
}

// 認証トークンをファイルに保存する
async function saveAuthToken(authToken) {
  const authData = {
    authToken,
    savedAt: new Date().toISOString(),
  };
  await fs.writeFile(AUTH_FILE, JSON.stringify(authData, null, 2), "utf-8");
  console.log("Auth token saved to", AUTH_FILE);
}

export const verify = async (req, res) => {
  const { VRCHAT_USERNAME, VRCHAT_PASSWORD, VRCHAT_CODE } = req.body;

  console.log("Received request body:", req.body);
  console.log("Username:", VRCHAT_USERNAME);
  console.log("Password:", VRCHAT_PASSWORD ? "***" : "missing");
  console.log("2FA Code:", VRCHAT_CODE);

  if (!VRCHAT_USERNAME || !VRCHAT_PASSWORD) {
    res
      .status(400)
      .json({ message: "bad request. please send id and password" });
    return;
  }

  try {
    // VRChatクライアントを作成
    const vrchat = new VRChat({
      application: {
        name: "poc-vrcapi",
        version: "1.0.0",
        contact: VRCHAT_USERNAME,
      },
      authentication: {
        credentials: {
          username: VRCHAT_USERNAME,
          password: VRCHAT_PASSWORD,
        },
        optimistic: false,
      },
    });

    // 2FAコードがない場合のハンドラー
    let twoFactorRequired = false;
    let twoFactorCallCount = 0;
    const twoFactorCode = async () => {
      twoFactorCallCount++;
      console.log(`2FA callback called (attempt ${twoFactorCallCount}). VRCHAT_CODE:`, VRCHAT_CODE);

      if (VRCHAT_CODE) {
        console.log("Returning 2FA code:", VRCHAT_CODE);
        // 文字列として返す（数値変換しない）
        return String(VRCHAT_CODE);
      }

      console.log("2FA code not provided, marking as required");
      twoFactorRequired = true;
      throw new Error("2FA_REQUIRED");
    };

    // ログイン試行
    console.log("Attempting login...");
    const result = await vrchat.login({
      username: VRCHAT_USERNAME,
      password: VRCHAT_PASSWORD,
      twoFactorCode: twoFactorCode,
      throwOnError: false,
    });

    console.log("Login result:", {
      hasData: !!result.data,
      hasError: !!result.error,
      userId: result.data?.id,
      errorMessage: result.error?.message,
    });

    // ログイン成功
    if (result.data?.id) {
      const authToken = await extractAuthToken(vrchat);

      return res.status(200).json({
        message: "Login successful",
        authToken: authToken,
        user: {
          id: result.data.id,
          displayName: result.data.displayName,
        },
        success: true,
      });
    }

    // 2FAが必要な場合
    if (twoFactorRequired) {
      return res.status(401).json({
        message: "Two-Factor Authentication required",
        requiresTwoFactorAuth: true,
        success: false,
      });
    }

    // その他のエラー
    throw result.error || new Error("Login failed");
  } catch (error) {
    // 2FA要求エラーの場合
    if (error.message === "2FA_REQUIRED") {
      return res.status(401).json({
        message: "Two-Factor Authentication required",
        requiresTwoFactorAuth: true,
        success: false,
      });
    }

    console.error("Login error:", error);
    return res.status(401).json({
      message: "Authentication failed",
      error: error.message,
      success: false,
    });
  }
};
