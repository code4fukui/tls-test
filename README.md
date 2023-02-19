# tls-test

自己署名証明書を作って、localhostにSSL(TLS)でアクセスする

1. make or

```sh
openssl genrsa 2048 > server.key
openssl req -new -key server.key -subj "/C=JP/ST=Some-State/O=Some-Org/CN=localhost" > server.csr
openssl x509 -days 3650 -req -extfile san.txt -signkey server.key < server.csr > server.crt
```

2. server.crt を証明書として登録する

3. (Macの場合) 証明書をダブルクリックし、「信頼」を開き、「この証明書を使用するとき」を「常に信頼」に変更して、閉じる

4. SSL(TLS)サーバーとして起動する

```sh
$ sudo deno run -A server.js
```

5. [https://localhost/](https://localhost/) にブラウザでアクセス！


## IPアドレスで署名する方法

san.txt の localhost と、127.0.0.1 を署名したいIPアドレスに変更して、自己署名証明書を作成
