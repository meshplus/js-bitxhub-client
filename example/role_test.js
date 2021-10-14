const { AES, Client, PbType } = require('../index');
const fs = require('fs');
const hexToArrayBuffer = require('hex-to-array-buffer');
const utils = require("web3-utils");

async function test_register() {

    let key = fs.readFileSync('./testdata/key.json').toString();
    console.log(key)
    let priv = JSON.parse(key).cipher.data;
    console.log(priv)

    let decrypted = AES.decrypt(priv, 'bitxhub')
    console.log(decrypted)
    console.log(hexToArrayBuffer(decrypted))
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

    try {
        let cli = new Client(decrypted);
        let receipt = await cli.InvokeView(0, '000000000000000000000000000000000000000d', 'GetRole')
        console.log('test_login ---', receipt)
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    test_register,
    test_login
};