# tls-test

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A simple project for generating a self-signed TLS certificate and running a local Deno server to test HTTPS on `localhost`.

The demo application is an audio analyzer that requests microphone access to display a real-time Fast Fourier Transform (FFT) visualization.

## Features

*   Generates a self-signed certificate for `localhost` and `127.0.0.1` using OpenSSL.
*   Includes a Subject Alternative Name (SAN) configuration for modern browser compatibility.
*   Provides a simple Deno TLS server (`server.js`) to serve local files.
*   Includes instructions for trusting the custom certificate on macOS.
*   Easily configurable for use with other local domains or IP addresses.

## Requirements

*   **OpenSSL**: For generating certificate files.
*   **Deno**: To run the TLS server.
*   A method to trust the generated certificate. The instructions below are for macOS.

## Usage

### 1. Generate Certificate Files

The easiest way to generate the required `.key` and `.crt` files is to use the `Makefile`:

```sh
make
```

This will create `server.key`, `server.csr`, and `server.crt`.

<details>
<summary>Or, run the OpenSSL commands manually:</summary>

```sh
# Generate a private key
openssl genrsa 2048 > server.key

# Create a certificate signing request (CSR)
openssl req -new -key server.key -subj "/C=JP/ST=Some-State/O=Some-Org/CN=localhost" > server.csr

# Generate the self-signed certificate using the SAN configuration
openssl x509 -days 3650 -req -extfile san.txt -signkey server.key < server.csr > server.crt
```

</details>

### 2. Trust the Certificate (macOS)

On macOS, you need to manually trust the generated certificate to avoid browser security warnings:

*   Double-click the `server.crt` file to open it in the **Keychain Access** application.
*   Find the `localhost` certificate (it will likely be in your "login" keychain).
*   Double-click the certificate to open its details.
*   Expand the **"Trust"** section.
*   For "When using this certificate:", select **"Always Trust"**.
*   Close the window. You may be prompted for your password to save the changes.

### 3. Start the TLS Server

Run the Deno server with permissions to read files and open a network port. `sudo` is required to bind to the standard HTTPS port (443).

```sh
sudo deno run -A server.js
```

### 4. Access in Browser

You can now access the server in your browser:

*   **[https://localhost/](https://localhost/)**: Displays the audio analyzer demo. Click the page and allow microphone access to start the visualization.
*   **[https://localhost/api/ipaddress](https://localhost/api/ipaddress)**: A simple API endpoint that returns your client IP address.

## Using a Custom Domain or IP Address

To issue a certificate for a different domain or IP address (e.g., for testing on a local network device), edit the `san.txt` file *before* generating the certificate.

Change the line:
```
subjectAltName = DNS:localhost, IP:127.0.0.1
```

to your desired values. For example:
```
subjectAltName = DNS:my-test-server.local, IP:192.168.1.100
```

Then, run `make` (or the manual `openssl` commands) again to regenerate the certificate with the new names. You will also need to trust this new certificate.