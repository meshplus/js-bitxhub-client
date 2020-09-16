const fs = require('fs');
const { AES, Client } = require('../index');

function test_aes() {

    let key = fs.readFileSync('./testdata/key.json').toString();
    console.log(key)
    let priv = JSON.parse(key).cipher.data;
    console.log(priv)

    let decrypted = AES.decrypt(priv, 'bitxhub')
    console.log(decrypted)

    let cli = new Client(decrypted);
    console.log(cli)
    console.log('test_aes ---', JSON.parse(key).address === '0x' + cli.address)
}

module.exports = {
    test_aes
};