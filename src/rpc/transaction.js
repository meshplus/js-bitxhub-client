const rpc = require('./rpc');

// Send Transaction & Get Hash
async function sendTX(transaction) {
    let optObj = await rpc.setOptions('post', '/v1/transaction');
    return await rpc.doRequest(optObj, transaction);
}

async function sendView(transaction) {
    let optObj = await rpc.setOptions('post', '/v1/view');
    return await rpc.doRequest(optObj, transaction);
}

async function getPendingNonce(address) {
    let optObj = await rpc.setOptions('get', '/v1/pendingNonce/' + address)
    let ret = await rpc.doRequest(optObj);
    return Buffer.from(ret.data, 'base64').toString();
}

async function getChainMeta() {
    let optObj = await rpc.setOptions('get', '/v1/chain_meta')
    let ret = await rpc.doRequest(optObj);
    return ret;
}

async function getBlocks(start, end) {
    let optObj = await rpc.setOptions('get', '/v1/blocks?start=' + start + '&end=' + end);
    let ret = await rpc.doRequest(optObj);
    return ret;
}

async function getBlock(type, value) {
    let optObj = await rpc.setOptions('get', '/v1/block?type=' + type + '&value=' + value);
    let ret = await rpc.doRequest(optObj);
    return ret;
}

// Send Transaction & Get Receipt
async function sendTransactionWithReceipt(transaction) {
    let hash = await this.sendTX(transaction);
    console.log(hash);
    let res = await this.getReceipt(hash.tx_hash);
    let start = new Date();
    let former = start;
    while (res.code && (former - start < 1000 * 5)) {
        let now = new Date();
        if (now - former < 300) {
            continue;
        }
        former = now;
        res = await this.getReceipt(hash.tx_hash);
    }

    return res;
}

// Send View & Get Receipt
async function sendViewWithReceipt(transaction) {
    let res = await this.sendView(transaction);

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
    if (res.tx_meta[0]) {
        res.tx_meta[0].block_hash = '0x' + b64DecodeUnicode(res.tx_meta[0].block_hash)
    }
    return res;
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

module.exports = {
    sendTX,
    sendView,
    sendTransactionWithReceipt,
    sendViewWithReceipt,
    getReceipt,
    getPendingNonce,
    getChainMeta,
    getTransaction,
    getBlocks,
    getBlock,
};