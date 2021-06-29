const pb = require('./transaction_pb');
const Transaction = require('../transaction/index');
const utils = require('web3-utils');


async function deployContract(contract) {
    const cli = this;

    let td = new pb.TransactionData();
    td.setType(pb.TransactionData.Type.INVOKE);
    td.setVmType(pb.TransactionData.VMType.XVM);
    td.setPayload(contract);

    let tx = new Transaction();
    tx.tx.setFrom("0x" + this.address);
    tx.tx.setTo("0x0000000000000000000000000000000000000000");
    tx.tx.setPayload(td.serializeBinary());
    nonce = await cli.GetPendingNonce();
    tx.tx.setNonce(nonce);
    await tx.sign(cli.privateKey);
    let transaction = tx.tx.toObject();
    delete transaction.transactionHash;

    let receipt = await cli.SendTransactionWithReceipt(transaction);
    if (receipt.ret) {
        let buffer = Buffer.from(receipt.ret, 'base64');
        return utils.toChecksumAddress(utils.bytesToHex(buffer));
    }
    return '';
}

async function invokeContract(vmType, address, method, ...args) {
    const cli = this;

    let ip = new pb.InvokePayload();
    ip.setMethod(method);
    ip.setArgsList(args);

    let payload = ip.serializeBinary();
    let td = new pb.TransactionData();
    td.setType(pb.TransactionData.Type.INVOKE);
    td.setVmType(vmType);
    td.setPayload(payload);

    let tx = new Transaction();
    tx.tx.setFrom("0x" + this.address);
    tx.tx.setTo("0x" + address);
    tx.tx.setPayload(td.serializeBinary());
    nonce = await cli.GetPendingNonce();
    tx.tx.setNonce(nonce);
    await tx.sign(cli.privateKey);
    let transaction = tx.tx.toObject();
    delete transaction.transactionHash;

    let receipt = await cli.SendTransactionWithReceipt(transaction);
    if (receipt.ret) {
        let buffer = Buffer.from(receipt.ret, 'base64');
        return buffer.toString();
    }
    return '';
}

async function invokeView(vmType, address, method, ...args) {
    const cli = this;

    let ip = new pb.InvokePayload();
    ip.setMethod(method);
    ip.setArgsList(args);

    let payload = ip.serializeBinary();
    let td = new pb.TransactionData();
    td.setType(pb.TransactionData.Type.INVOKE);
    td.setVmType(vmType);
    td.setPayload(payload);

    let tx = new Transaction();
    tx.tx.setFrom("0x" + this.address);
    tx.tx.setTo("0x" + address);
    tx.tx.setPayload(td.serializeBinary());
    nonce = await cli.GetPendingNonce();
    tx.tx.setNonce(nonce);
    await tx.sign(cli.privateKey);
    let transaction = tx.tx.toObject();
    delete transaction.transactionHash;

    let receipt = await cli.SendViewWithReceipt(transaction);
    if (receipt.ret) {
        let buffer = Buffer.from(receipt.ret, 'base64');
        return buffer.toString();
    }
    return '';
}

// Decode from base64 and Convert from utf8 to utf-16
function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

// Turns Base64-encoded Ascii Data Back to Binary
function atob(str) {
    return Buffer.from(str, 'base64').toString('binary');
}

function strToHexCharCode(str) {
    if (str === "") return "";
    var hexCharCode = [];
    hexCharCode.push("0x");
    for (var i = 0; i < str.length; i++) { hexCharCode.push((str.charCodeAt(i)).toString(16)); }
    return hexCharCode.join("");
}

module.exports = {
    deployContract,
    invokeContract,
    invokeView,
};