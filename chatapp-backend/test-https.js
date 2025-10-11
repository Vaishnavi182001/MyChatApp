// test-https.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const https = require('https');
https.get('https://api.cloudinary.com/v1_1/demo/image/upload', res => {
  console.log('statusCode:', res.statusCode);
}).on('error', e => {
  console.error(e);
});