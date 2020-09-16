const fs = require('fs');
const { TripleDES, Client } = require('../index');

async function test_tripledes() {
    let key = fs.readFileSync('./testdata/key').toString();
    let priv = JSON.parse(key).private_key;

    let decrypted = TripleDES.decrypt(priv, 'bitxhub' + 'abcdefghijklmnopqrstuvwxyz')

    let cli = new Client(decrypted);
    console.log('test_tripledes ---', JSON.parse(key).address === '0x' + cli.address)
}

module.exports = {
    test_tripledes
};