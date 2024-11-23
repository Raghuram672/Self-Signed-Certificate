# Setting HTTPS Server with Self-Signed Certificate

This project demonstrates setting up an HTTPS server in Node.js using a self-signed SSL certificate. The guide includes instructions to generate the necessary RSA keys, create a self-signed certificate, configure SAN (Subject Alternative Names) for localhost, and start a secure HTTPS server.

## Overview

This project provides step-by-step instructions to create a self-signed SSL certificate for a Node.js HTTPS server. By using OpenSSL, we can generate a root certificate authority (CA) key, a server key, and a certificate to secure communications over HTTPS. The instructions also include adding a SAN (Subject Alternative Name) for "localhost" to avoid security warnings in browsers.

## Steps to Generate SSL Certificate

### 1. Generate the Root CA Key and Certificate

First, generate a root certificate authority (CA) key and certificate. The CA certificate will be used to sign the server certificate.

```bash
openssl genpkey -algorithm RSA -out rootCA.key -aes256
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 3650 -out rootCA.pem
```
- **When you run the first command, it may ask for a passphrase. Keep it simple and remember it, as you'll need it later.**
  
- **When you run the second command, OpenSSL will prompt you to enter several details for the root certificate. These fields are used to describe the root certificate authority (CA). Here’s what each prompt means, along with suggestions for what to enter:**

- Country Name (2 letter code): Enter your country code (e.g., IN for india).
- State or Province Name (full name): Enter the full name of your state or province (e.g., Karnataka).
- Locality Name (e.g., city): Enter your city (e.g., Bangalore).
- Organization Name (e.g., company): Enter your organization’s name (e.g., Random Access Ram).
- Organizational Unit Name (e.g., section): Enter the department or unit name (e.g., IT Department), or leave blank if none.
- Common Name (e.g., server FQDN or YOUR name): Enter a unique name for the CA (e.g., MyCompany Root CA or localhost).
- Email Address: Optionally, enter an email address, or leave blank if not required.


### 2. Generate the Server Key

Next, generate the server key, which will be used to create a certificate signing request (CSR).

```bash
openssl genpkey -algorithm RSA -out server.key
```

### 3. Create a Configuration File for SAN

We need to create a configuration file (openssl.cnf) to add a Subject Alternative Name (SAN) for the server. This file will include the required configuration for the server’s certificate.

SAN Configuration (openssl.cnf):
```bash
[ req ]
default_bits       = 2048
default_keyfile    = server.key
distinguished_name = req_distinguished_name
req_extensions     = req_ext   # This line references req_ext for SANs

[ req_distinguished_name ]
countryName                 = Country Name (2 letter code)
countryName_default         = US
stateOrProvinceName         = State or Province Name (full name)
localityName                = Locality Name (e.g., city)
organizationalUnitName      = Organizational Unit Name (e.g., section)
commonName                  = Common Name (e.g., server FQDN or YOUR name)

[ req_ext ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = localhost
```

### 4. Generate a Server Certificate Signing Request (CSR)

Now, create a certificate signing request (CSR) for the server, using the openssl.cnf file for configuration.

```bash
openssl req -new -key server.key -out server.csr -config openssl.cnf
```
- **When you run the command to generate the server.csr, OpenSSL will prompt you to enter information related to the server's identity. Here's what each prompt means, along with suggestions for what to enter:**

- Country Name (2 letter code): Enter your country code (e.g., IN for india).
- State or Province Name (full name): Enter the full name of your state or province (e.g., Karnataka).
- Locality Name (e.g., city): Enter your city (e.g., Bangalore).
- Organization Name (e.g., company): Enter your organization’s name (e.g., org).
- Organizational Unit Name (e.g., section): Enter the department or unit name (e.g., IT Department), or leave blank if none.
- Common Name (e.g., server FQDN or YOUR name): Enter a unique name for the CA (e.g., localhost or mydomain.com).
- Email Address: Optionally, enter an email address, or leave blank if not required.

### 5. Sign the Server CSR with the Root CA

Finally, sign the server CSR with the root CA to create a self-signed certificate for the server. This step uses the root CA’s key and certificate.

```bash
openssl x509 -req -in server.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out server.crt -days 365 -sha256 -extensions req_ext -extfile openssl.cnf
```



## Setting Up the HTTPS Server in Node.js

With the server certificate and key ready, create an HTTPS server in Node.js using the following code:

server.js:
```
const https = require('https');
const fs = require('fs');

// Load the certificate and key files
const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
};

// Create an HTTPS server that responds with "Hello, World!"
https.createServer(options, (req, res) => {
    res.writeHead(200);
    res.end('Hello, World!');
}).listen(3000, () => {
    console.log('Server is running on https://localhost:3000');
});
```


## Running the Server

To start the server, run:

```bash
node server.js
```


## Testing the Server with browser

## Installing a Self-Signed Root Certificate in Chrome

If you’re using a self-signed root certificate to secure a local server, you need to add it as a trusted certificate in Chrome to avoid security warnings. This guide walks you through the steps to install a root certificate (e.g., `rootCA.pem`) in Google Chrome on different operating systems.

## Steps to Install the Root Certificate in Chrome

### Step 1: Open Chrome’s Certificate Manager

- **Windows:** 
  - Open Chrome, click on the three-dot menu in the top-right corner.
  - Navigate to **Settings** > **Privacy and Security** > **Security**.
  - Under **Advanced**, select **Manage certificates**.

- **macOS:**
  - Open **Keychain Access** from **Applications** > **Utilities**.
  - Drag and drop your `rootCA.pem` file into the **System** keychain, then double-click on the certificate to edit trust settings.

- **Linux (Ubuntu):**
  - Open Chrome and go to **chrome://settings**.
  - Scroll to **Privacy and Security** > **Security**.
  - Click on **Manage certificates**, then select the appropriate certificate store.

### Step 2: Import the Root Certificate

1. In the **Certificate Manager** window (or **Keychain Access** on macOS), go to the **Trusted Root Certification Authorities** (or **System** keychain on macOS).

2. Click **Import** (or **File** > **Import Items** on macOS), then select your `rootCA.pem` file.

3. Follow the prompts to complete the import. On some systems, you may need to enter your admin password.

### Step 3: Trust the Certificate

- **Windows & Linux:**
  - After importing, locate the certificate in the **Certificate Manager** under **Trusted Root Certification Authorities**.
  - Right-click the certificate, select **Properties**, and set it to be fully trusted.

- **macOS:**
  - Double-click the imported certificate in **Keychain Access**.
  - Expand **Trust**, set **When using this certificate** to **Always Trust**.

### Step 4: Restart Chrome

Once the certificate has been added and trusted, restart Chrome for the changes to take effect. This will allow Chrome to recognize and trust the self-signed root certificate when accessing your local server.

---

After following these steps, your self-signed root certificate should now be trusted by Chrome, and you should be able to access your local server over HTTPS without security warnings.

## Troubleshooting

If Chrome still shows a security warning after these steps:
- Verify that the certificate is added to **Trusted Root Certification Authorities**.
- Ensure the **SAN (Subject Alternative Name)** of the server certificate includes the hostname (e.g., `localhost`).
- Restart your system if Chrome still doesn't recognize the certificate.

---


## Testing the Server with curl

Use curl to verify the server’s certificate and connection. Run the following command, specifying the root CA certificate:

```bash
curl -v --cacert rootCA.pem https://localhost:3000
```
The --cacert option specifies the CA certificate to verify the server’s certificate.
If everything is set up correctly, you should see the server’s response: "Hello, World!"
