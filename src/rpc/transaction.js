const rpc = require('./rpc');

// Send Transaction & Get Hash
async function sendTX(transaction) {
    let optObj = await rpc.setOptions('post', '/v1/transaction');
    return await rpc.doRequest(optObj, transaction);
}

// Send Transaction & Get Receipt
async function sendTransactionWithReceipt(transaction) {
    let hash = await this.sendTX(transaction);
    let res = await this.getReceipt(hash.tx_hash)
    let start = new Date();
    while (res.code && (new Date() - start < 1000 * 5)) {
        res = await this.getReceipt(hash.tx_hash)
    }

    return res;
}

// Get Receipt by Hash
async function getReceipt(hash) {
    let optObj = await rpc.setOptions('get', '/v1/receipt/' + hash);
    return await rpc.doRequest(optObj);
}

// Get Transaction by Hash
async function getTransaction(hash) {
    let optObj = await rpc.setOptions('get', '/v1/transaction/' + hash);
    let res = await rpc.doRequest(optObj);
    if (res.tx_meta) {
        res.tx_meta.block_hash = '0x' + b64DecodeUnicode(res.tx_meta.block_hash)
    }
    return res;
}

// Decode from base64 and Convert from utf8 to utf-16
function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

// Turns Base64-encoded Ascii Data Back to Binary
function atob(str) {
    return Buffer.from(str, 'base64').toString('binary');
}

module.exports = {
    sendTX,
    sendTransactionWithReceipt,
    getReceipt,
    getTransaction,
};