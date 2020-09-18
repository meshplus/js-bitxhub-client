const { Client, AES, PbType } = require('../index');
const fs = require('fs');

async function test_register() {

    let key = fs.readFileSync('./testdata/key').toString();
    let priv = JSON.parse(key).private_key;
    let decrypted = TripleDES.decrypt(priv, 'bitxhub' + 'abcdefghijklmnopqrstuvwxyz')
    let file = fs.readFileSync('./testdata/validators')

    let cli = new Client(decrypted);
    let receipt = await cli.InvokeContract(0, '000000000000000000000000000000000000000a', 'Register',
    PbType.pbString(file), PbType.pbInt32(1),
    PbType.pbString('Hperchain'), PbType.pbString('Hyper'),
    PbType.pbString('This is a appchain'), PbType.pbString('1.0.0'));
    console.log('test_register ---', receipt)
}

async function test_login() {

    let key = fs.readFileSync('./testdata/key.json').toString();
    let priv = JSON.parse(key).cipher.data;
    let decrypted = AES.decrypt(priv, 'bitxhub')

    let cli = new Client(decrypted);
    let receipt = await cli.InvokeContract(0, '000000000000000000000000000000000000000d', 'GetRole')
    console.log('test_login ---', receipt)
}
 
module.exports = {
    test_register,
    test_login
};