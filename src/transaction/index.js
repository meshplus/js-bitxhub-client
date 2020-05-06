const EC = require("elliptic").ec;
const sha256 = require('js-sha256');
const pb = require('../rpc/transaction_pb');

class Transaction {
    constructor () {
        this.version = '',
        this.from = '',
        this.to = '0000000000000000000000000000000000000000',
        this.timestamp = this.getCurrentTimeStamp(),
        // this.transaction_hash = '',
        this.data = {},
        this.nonce = this.getRandNonce(),
        this.signature = ''
        this.extra = ''
    }

    // Get The Current Time Stamp in Nanoseconds
    getCurrentTimeStamp() {
        return new Date().getTime() * 1e6;
    }

    // Get a Pseudo-random
    getRandNonce() {
        let nonce = Math.random() * 1e19;
        while (nonce >= 9223372036854775807) {
            nonce = Math.random() * 1e19;
        }
        return nonce;
    }

    // Marshal TransactionData
    marshalTransactionData(data) {
        if (JSON.stringify(data) === '{}') {
            let td = new pb.TransactionData();
            return Buffer.from(td.serializeBinary().buffer);
        } else {
            return Buffer.from(data.serializeBinary().buffer);
        }
    }

    // Transform Transaction to a String
    needHashString() {
        let data = this.marshalTransactionData(this.data);
        return "from=0x" + this.from
            + "&to=0x" + this.to
            + "&timestamp=" + this.timestamp
            + "&nonce=" + this.nonce
            + "&data=" + data.toString('hex')
    }

    // Sign the Transaction
    async sign(privateKey) {
        let needHashString = this.needHashString();
        let unHashedString = Buffer.from(needHashString);
        let hashedString = sha256(unHashedString);

        let ec = new EC('p256');
        let keyPair = ec.keyFromPrivate(privateKey, 'hex');
        let signature = keyPair.sign(hashedString);
        let r = signature.r.toArray('be', 32);
        let s = signature.s.toArray('be', 32);
        let v = signature.recoveryParam;
        this.signature = r.concat(s).concat(v);
        let keyPub = keyPair.getPublic();
        let h = [0x04];
        let x = keyPub.getX().toArray('be', 32);
        let y = keyPub.getY().toArray('be', 32);
        let publicKey = h.concat(x).concat(y);
        this.signature = this.signature.concat(publicKey);
    }
}

module.exports = Transaction;