const { Client, PbType } = require('../index');
const EC = require("elliptic").ec;
const fs = require('fs');

async function test_deployXVMContract() {

    let ec = new EC('secp256k1');
    let keyPair = ec.genKeyPair();
    let privateKey = keyPair.getPrivate().toString('hex').toLowerCase();
    let cli = new Client(privateKey);

    let contract = fs.readFileSync('./testdata/example.wasm');
    let address = await cli.DeployContract(contract);
    console.log('test_deployXVMContract ---', address)
}

async function test_invokeXVMContract() {

    let ec = new EC('secp256k1');
    let keyPair = ec.genKeyPair();
    let privateKey = keyPair.getPrivate().toString('hex').toLowerCase();
    let cli = new Client(privateKey);

    let contract = fs.readFileSync('./testdata/example.wasm');
    let address = await cli.DeployContract(contract);

    let receipt = await cli.InvokeContract(1, address, 'a', PbType.pbInt32(1), PbType.pbInt32(2));
    console.log('test_invokeXVMContract ---', receipt === '336')
}

async function test_invokeBVMContract() {

    let ec = new EC('secp256k1');
    let keyPair = ec.genKeyPair();
    let privateKey = keyPair.getPrivate().toString('hex').toLowerCase();
    let cli = new Client(privateKey);

    let receipt = await cli.InvokeContract(0, '000000000000000000000000000000000000000a', 'Appchains');
    console.log('test_invokeBVMContract ---', receipt)
}

module.exports = {
    test_deployXVMContract,
    test_invokeXVMContract,
    test_invokeBVMContract
};