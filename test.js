import dotenv from 'dotenv';
import { VRChat } from 'vrchat';
import readline from 'readline/promises';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const AUTH_FILE = path.join(__dirname, 'vrchat_auth.json');

// 認証トークンをファイルから読み込む
async function loadAuthToken() {
  try {
    const data = await fs.readFile(AUTH_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

// 認証トークンをファイルに保存する
async function saveAuthToken(authToken) {
  const authData = {
    authToken,
    savedAt: new Date().toISOString()
  };
  await fs.writeFile(AUTH_FILE, JSON.stringify(authData, null, 2), 'utf-8');
}

// VRChatインスタンスから認証トークンを抽出
async function extractAuthToken(vrchat) {
  const cookies = await vrchat.getCookies();
  if (!cookies || cookies.length === 0) return null;

  const authCookie = cookies.find(cookie => cookie.name === 'auth');
  return authCookie?.value || null;
}

async function main() {
  const readInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const username = process.env.VRCHAT_USERNAME;
    const password = process.env.VRCHAT_PASSWORD;
    const savedAuth = await loadAuthToken();

    const vrchat = new VRChat({
      application: {
        name: 'poc-vrcapi',
        version: '1.0.0',
        contact: username || 'user@example.com',
      },
      authentication: {
        credentials: {
          username,
          password,
        },
        optimistic: false,
      },
    });

    // 保存されたトークンで認証を試行
    if (savedAuth?.authToken) {
      await vrchat.cache.set('cookies', [{
        name: 'auth',
        value: savedAuth.authToken,
        expires: null,
      }]);

      try {
        await vrchat.getCurrentUser({ throwOnError: true });
        console.log('✓ 認証成功');
        return;
      } catch (error) {
        await fs.unlink(AUTH_FILE).catch(() => {});
        readInterface.close();
        return main();
      }
    }

    // 新規ログイン
    const result = await vrchat.login({
      username,
      password,
      twoFactorCode: () => readInterface.question('2段階認証コード: '),
      throwOnError: false,
    });

    if (result.data?.id) {
      console.log('✓ ログイン成功');
      const authToken = await extractAuthToken(vrchat);
      if (authToken) {
        await saveAuthToken(authToken);
      }
    } else {
      throw result.error || new Error('ログイン失敗');
    }

  } catch (error) {
    console.error('✗ エラー:', error.message);
    process.exit(1);
  } finally {
    readInterface.close();
  }
}

main();
