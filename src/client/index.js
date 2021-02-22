const { tx, contract } = require('../rpc/index');
const Web3 = require('web3');

class Client {
    constructor(privateKey) {
        var web3 = new Web3(Web3.givenProvider);
        let account = web3.eth.accounts.privateKeyToAccount(privateKey);

        this.privateKey = privateKey;
        this.address = account.address.slice(2);
        console.log(this.address);
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
    GetPendingNonce() {
        return tx.getPendingNonce("0x" + this.address);
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