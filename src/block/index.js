const rpc = require('../rpc/rpc');

// Get Block by Hash or Number
async function getBlock(type, value) {
    let optObj = await rpc.setOptions('get', '/v1/block' + `?type=${type}&value=${value}`);
    return await rpc.doRequest(optObj);
}

// Get Blocks List with offset and length
async function getBlocks(offset, length) {
    let optObj = await rpc.setOptions('get', '/v1/blocks' + `?offset=${offset}&length=${length}` );
    return await rpc.doRequest(optObj);
}

// Get Chain Meta
async function getChainMeta() {
    let optObj = await rpc.setOptions('get', '/v1/chain_meta');
    return await rpc.doRequest(optObj);
}

module.exports = {
    getBlock,
    getBlocks,
    getChainMeta
};