const { tx, contract } = require('../rpc/index');
const Accounts = require('web3-eth-accounts');
const Utils = require('web3-utils');

class Client {
    constructor(privateKey) {
        let accounts = new Accounts(null);
        if (privateKey) {
            let account = accounts.privateKeyToAccount(privateKey);

            this.privateKey = privateKey;
            this.address = account.address.slice(2);
        } else {
            let account = accounts.create();

            this.privateKey = account.privateKey.slice(2);
            this.address = account.address.slice(2);
        }
    }

    SetAddress(address) {
        this.address = address;
    }

    SetMetaAddress(address) {
        this.metaAddress = Utils.toChecksumAddress(address);
    }

    Address() {
        return "0x" + this.address;
    }
    SendTransaction(transaction) {
        return tx.sendTX(transaction);
    }
    SendView(transaction) {
        return tx.sendView(transaction);
    }
    SendTransactionWithReceipt(transaction) {
        return tx.sendTransactionWithReceipt(transaction);
    }
    SendViewWithReceipt(transaction) {
        return tx.sendViewWithReceipt(transaction);
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
    GetMetaPendingNonce() {
        return tx.getPendingNonce(this.metaAddress);
    }
    GetChainMeta() {
        return tx.getChainMeta();
    }
    GetBlocks(start, end) {
        return tx.getBlocks(start, end);
    }
    GetBlock(type, value) {
        return tx.getBlock(type, value);
    }
    // SyncBlock () {}

    DeployContract(ctx) {
        return contract.deployContract.call(this, ctx);
    }
    InvokeContract(vmType, address, method, ...args) {
        return contract.invokeContract.call(this, vmType, address, method, ...args);
    }
    InvokeView(vmType, address, method, ...args) {
        return contract.invokeView.call(this, vmType, address, method, ...args);
    }
    GetHashString(vmType, address, method, ...args) {
        return contract.getHashString.call(this, vmType, address, method, ...args);
    }
    DeployMetaContract(tx, signature) {
        return contract.deployMetaContract.call(this, tx, signature);
    }
    InvokeMetaContract(tx, signature) {
        return contract.invokeMetaContract.call(this, tx, signature);
    }
    InvokeMetaView(tx, signature) {
        return contract.invokeMetaView.call(this, tx, signature);
    }
}

module.exports = Client;