# backend

main ブランチにプッシュで、Heroku への自動デプロイが走ります。

### 手元で動かす場合

firebase のサービスアカウントを作成し、秘密鍵を json でダウンロード後、`cert.json` という名前で `api` のルートに保存します。

それから、

- `$ pip install -r requirements.txt` (多分)
- `$ python main.py`

これで、サーバーが動きます。

データベースは、firestore(開発・本番共通)で動いています。
