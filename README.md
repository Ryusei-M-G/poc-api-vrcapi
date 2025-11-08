# VRCAPIを使用するためのAPIサーバー
## 機能
- `/api/verify`
    - VRCログイン時の認証tokenの保存
    ```json
    VRCHAT_USERNAME: "usermailaddress",
    VRCHAT_PASSWORD: "userpassword",
    VRCHAT_CODE: "2FA"
- `/api/getVrcId` 
    - VRCDisplayNameからVRCIDの取得
- `/api/getTrust` 
    - VRCIDからtrustランクの取得
