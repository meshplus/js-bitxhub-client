const { tx, contract } = require('../rpc/index');
const EC = require("elliptic").ec;
const sha256 = require('js-sha256');
const keccak256 = require('keccak256')

class Client {
    constructor(privateKey) {
        let ec = new EC('secp256k1');
        let keyPair = ec.keyFromPrivate(privateKey);
        let publicKey = keyPair.getPublic();
        let x = publicKey.getX().toArray();
        let y = publicKey.getY().toArray();
        let pubToHash = x.concat(y);
        let pubHash = keccak256(pubToHash).toString('hex');
        let address = pubHash.slice(-40);

        this.privateKey = privateKey;
        this.publicKey = publicKey.encode('hex');
        this.address = address;
    }

    SendTransaction(transaction) {
        return tx.sendTX(transaction);
    }
    SendTransactionWithReceipt(transaction) {
        return tx.sendTransactionWithReceipt(transaction);
    }
    GetReceipt(hash) {
        return tx.getReceipt(hash);
    }
    GetTransaction(hash) {
        return tx.getTransaction(hash);
    }
    // SyncBlock () {}

    DeployContract(ctx) {
        return contract.deployContract.call(this, ctx);
    }
    InvokeContract(vmType, address, method, ...args) {
        return contract.invokeContract.call(this, vmType, address, method, ...args);
    }
}

module.exports = Client;