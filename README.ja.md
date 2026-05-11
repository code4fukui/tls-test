# tls-test

`localhost`でHTTPSをテストするために、自己署名のTLS証明書を生成し、ローカルのDenoサーバーを実行するシンプルなプロジェクトです。

デモアプリケーションは、マイクへのアクセスを要求し、リアルタイムの高速フーリエ変換（FFT）による可視化を表示するオーディオアナライザです。

## 機能

*   OpenSSLを使用して`localhost`と`127.0.0.1`の自己署名証明書を生成します。
*   モダンブラウザとの互換性を確保するために、Subject Alternative Name (SAN) の設定が含まれています。
*   ローカルファイルを配信するためのシンプルなDeno TLSサーバー（`server.js`）を提供します。
*   macOSでカスタム証明書を信頼させるための手順が含まれています。
*   他のローカルドメインやIPアドレスで使用するための設定変更が簡単です。

## 必要条件

*   **OpenSSL**: 証明書ファイルを生成するために必要です。
*   **Deno**: TLSサーバーを実行するために必要です。
*   生成された証明書を信頼させるための手段。以下の手順はmacOS向けです。

## 使い方

### 1. 証明書ファイルの生成

必要な`.key`および`.crt`ファイルを生成する最も簡単な方法は、`Makefile`を使用することです。

```sh
make
```

これにより`server.key`、`server.csr`、`server.crt`が作成されます。

<details>
<summary>または、OpenSSLコマンドを手動で実行します:</summary>

```sh
# 秘密鍵を生成
openssl genrsa 2048 > server.key

# 証明書署名要求（CSR）を作成
openssl req -new -key server.key -subj "/C=JP/ST=Some-State/O=Some-Org/CN=localhost" > server.csr

# SANの設定を使用して自己署名証明書を生成
openssl x509 -days 3650 -req -extfile san.txt -signkey server.key < server.csr > server.crt
```

</details>

### 2. 証明書の信頼（macOS）

macOSでは、ブラウザのセキュリティ警告を回避するために、生成された証明書を手動で信頼させる必要があります。

*   `server.crt`ファイルをダブルクリックして**キーチェーンアクセス**アプリケーションで開きます。
*   `localhost`証明書（おそらく「ログイン」キーチェーンにあります）を見つけます。
*   証明書をダブルクリックして詳細を表示します。
*   **「信頼」**セクションを展開します。
*   「この証明書を使用するとき:」で**「常に信頼」**を選択します。
*   ウィンドウを閉じます。変更を保存するためにパスワードが求められる場合があります。

### 3. TLSサーバーの起動

ファイルの読み取りとネットワークポートの開放を許可してDenoサーバーを実行します。標準のHTTPSポート（443）にバインドするには`sudo`が必要です。

```sh
sudo deno run -A server.js
```

### 4. ブラウザでアクセス

これで、ブラウザからサーバーにアクセスできるようになります。

*   **[https://localhost/](https://localhost/)**: オーディオアナライザのデモを表示します。ページをクリックしてマイクへのアクセスを許可すると、可視化が開始されます。
*   **[https://localhost/api/ipaddress](https://localhost/api/ipaddress)**: クライアントのIPアドレスを返すシンプルなAPIエンドポイントです。

## カスタムドメインまたはIPアドレスの使用

別のドメインやIPアドレス（例: ローカルネットワークデバイスでのテスト用）の証明書を発行するには、証明書を生成する前に`san.txt`ファイルを編集します。

以下の行を：
```
subjectAltName = DNS:localhost, IP:127.0.0.1
```

目的の値に変更します。例：
```
subjectAltName = DNS:my-test-server.local, IP:192.168.1.100
```

その後、再度 `make`（または手動の `openssl` コマンド）を実行し、新しい名前で証明書を再生成します。この新しい証明書も信頼させる必要があります。
