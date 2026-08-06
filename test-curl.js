const https = require('https');
https.get('https://raw.githubusercontent.com/actions/starter-workflows/main/pages/static.yml', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(data));
});
