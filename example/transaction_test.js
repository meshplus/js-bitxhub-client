const { AES, Client, Transaction } = require('../index');
const EC = require("elliptic").ec;
const fs = require('fs');
const pb = require('../src/rpc/transaction_pb');

async function test_sendTransaction() {

    // let ec = new EC('secp256k1');
    // let keyPair = ec.genKeyPair();
    // let privateKey = keyPair.getPrivate().toString('hex').toLowerCase();
    let key = fs.readFileSync('./testdata/key.json').toString();
    let priv = JSON.parse(key).cipher.data;
    let privateKey = AES.decrypt(priv, 'bitxhub')

    // console.log('file key：', priv)
    // console.log('AES privateKey：', privateKey)
    let cli = new Client(privateKey);

    let tx = new Transaction();
    tx.from = '8AaDD14CB279261839cc166CA39F081a4C36DE42';
    tx.to = 'A9d6EC5EB21f6F36D571ed14D462309AE02438eB';
    tx.timestamp = 1600334079700894000;
    tx.nonce = '5577006791947779410';

    await tx.sign(privateKey);

    // let response = await cli.SendTransaction(tx);
    // hash = response.tx_hash
    // setTimeout(async () => {
    //     let receipt = await cli.GetReceipt(hash);
    //     console.log('test_sendTransaction ---', receipt)
    // }, 2000)
}

async function test_sendTransactionWithReceipt() {

    let ec = new EC('secp256k1');
    let keyPair = ec.genKeyPair();
    let privateKey = keyPair.getPrivate().toString('hex').toLowerCase();

    let cli = new Client(privateKey);

    let tx = new Transaction();
    tx.from = cli.address;
    tx.to = cli.address;

    await tx.sign(privateKey);

    let receipt = await cli.SendTransactionWithReceipt(tx);
    console.log('test_sendTransactionWithReceipt ---', receipt);
}

async function test_getTransaction() {

    let ec = new EC('secp256k1');
    let keyPair = ec.genKeyPair();
    let privateKey = keyPair.getPrivate().toString('hex').toLowerCase();

    let cli = new Client(privateKey);

    let tx = new Transaction();
    tx.from = cli.address;
    tx.to = cli.address;

    await tx.sign(privateKey);

    let response = await cli.SendTransaction(tx);
    hash = response.tx_hash
    setTimeout(async () => {
        let transaction = await cli.GetTransaction(hash);
        console.log('test_getTransaction ---', transaction)
    }, 2000)
}

module.exports = {
    test_sendTransaction,
    test_sendTransactionWithReceipt,
    test_getTransaction
};