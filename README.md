# VRCAPIを使用するためのAPIサーバー

## 機能

### `/api/verify`
VRCログイン時の認証tokenの保存

**Method**: `POST`

**Request Body**:
```json
{
    "VRCHAT_USERNAME": "usermailaddress",
    "VRCHAT_PASSWORD": "userpassword",
    "VRCHAT_CODE": "2FA"
}
```

**Response (Success)**:
```json
{
    "message": "Login successful",
    "authToken": "authcookie_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "user": {
        "id": "usr_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "displayName": "YourDisplayName"
    },
    "success": true
}
```

**Response (2FA Required)**:
```json
{
    "message": "Two-Factor Authentication required",
    "requiresTwoFactorAuth": true,
    "success": false
}
```

---

### `/api/getVrcId`
VRCDisplayNameからVRCIDの取得（完全一致検索）

**Method**: `POST`

**Request Body**:
```json
{
    "displayName": "DisplayName"
}
```

**Response (Success)**:
```json
{
    "message": "User found",
    "userId": "usr_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "displayName": "DisplayName"
}
```

**Response (Not Found)**:
```json
{
    "message": "Exact match not found",
    "userId": null,
    "displayName": null
}
```

---

### `/api/getTrust`
VRCIDからtrustランクの取得

**Method**: `POST`

**Request Body**:
```json
{
    "USER_ID": "usr_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

**Response (Success)**:
```json
{
    "trust": "trusted",
    "userId": "usr_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "displayName": "DisplayName"
}
```

**Trust Levels**:
- `trusted` - Veteran/Trusted User
- `known` - Known User
- `user` - User (Intermediate/Basic)
- `newuser` - New User
- `visitor` - Visitor

**Response (Not Found)**:
```json
{
    "trust": null,
    "message": "No trust level found"
}
```

---

## セットアップ

1. 依存関係のインストール
```bash
npm install
```

2. サーバーの起動
```bash
node index.js
```

サーバーは `http://localhost:3000` で起動します。

---

## デバッグ用フロントエンド

`debug`フォルダにReact + TypeScriptで作成されたデバッグ用フロントエンドがあります。

### セットアップ
```bash
cd debug
npm install
npm run dev
```

### 機能
- **Trust Checker** (`/`) - User IDからTrust Levelを取得
- **ID Finder** (`/getname`) - Display NameからUser IDを検索
