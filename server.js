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
