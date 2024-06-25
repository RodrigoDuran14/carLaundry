const venom = require('venom-bot');
const fs = require('fs');

const tokenPath = './tokens/session-name';

//if (fs.existsSync(tokenPath)) {
//  fs.rmSync(tokenPath, { recursive: false });
//}

let client;

async function initializeVenom() {
  if (!client) {
    client = await venom.create({
      session: 'session-name',
      multidevice: true,
      folderNameToken: 'tokens',
      headless: false,
      useChrome: true,
      debug: true,
      logQR: true,
      disableSpins: true
    });
  }
  return client;
}

module.exports = {
  initializeVenom,
  getClient: () => client
};