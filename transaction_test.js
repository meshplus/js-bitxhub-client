const { Client, Transaction } = require('../index');
const EC = require("elliptic").ec;


async function test_sendTransaction() {

    let ec = new EC('p256');
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
        let receipt = await cli.GetReceipt(hash);
        console.log('test_sendTransaction ---', receipt)
    }, 2000)
}

async function test_sendTransactionWithReceipt() {

    let ec = new EC('p256');
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

    let ec = new EC('p256');
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