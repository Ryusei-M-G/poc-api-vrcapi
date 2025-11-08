# VRCAPIを使用するためのAPIサーバー
## 機能
- `/api/verify`
    - VRCログイン時の認証tokenの保存
    `POST`
    ```json
    {
        "VRCHAT_USERNAME": "usermailaddress",
        "VRCHAT_PASSWORD": "userpassword",
        "VRCHAT_CODE": "2FA"
    }
    ```
- `/api/getVrcId` 
    - VRCDisplayNameからVRCIDの取得
- `/api/getTrust` 
    - VRCIDからtrustランクの取得
    `GET`
    ```json
    {
        "USER_ID": "UserId"
    }
    ```
