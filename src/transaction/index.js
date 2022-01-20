const EC = require("elliptic").ec;
const sha256 = require('js-sha256');
const pb = require('../rpc/transaction_pb');
const hexToArrayBuffer = require('hex-to-array-buffer');
const Timestamp = require("timestamp-nano");

class Transaction {
    constructor() {
        this.tx = new pb.Transaction();
        var ibtp = new pb.IBTP();
        var hash = new pb.Hash();
        this.tx.setVersion("11");
        // this.tx.setTimestamp(1608332789316000000);
        this.tx.setTimestamp(this.getCurrentTimeStamp());
        this.tx.setNonce("111");
        this.tx.setPayload("");
        this.tx.setSignature("");
        // this.tx.setTransactionHash("0x0000000000000000000000000000000000000000000000000000000000000000");
        // this.tx.setTransactionHash("0xdfff5be6917854f4a25d103ae1717964ceda3dc4f9ad56c54e1bcb83291bb921");
        this.tx.setIbtp(ibtp);
        this.tx.setAmount("111");
        this.tx.setExtra("");
    }

    // Get The Current Time Stamp in Nanoseconds
    getCurrentTimeStamp() {
        return new Date().getTime() + '000000';
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
        if (this.tx.getPayload() !== "") {
            let tx = new pb.ContractTransaction()
            let from = new Uint8Array(hexToArrayBuffer(this.tx.getFrom().slice(2)))
            let to = new Uint8Array(hexToArrayBuffer(this.tx.getTo().slice(2)))
            tx.setFrom(from)
            tx.setTo(to)
            tx.setTimestamp(this.tx.getTimestamp())
            tx.setPayload(this.tx.getPayload())
            // tx.setIbtp(this.tx.getIbtp())
            tx.setNonce(this.tx.getNonce())
            tx.setAmount(this.tx.getAmount())

            return tx.serializeBinary()
        } else {
            let tx = new pb.IBTPTransaction()
            let from = new Uint8Array(hexToArrayBuffer(this.tx.getFrom().slice(2)))
            let to = new Uint8Array(hexToArrayBuffer(this.tx.getTo().slice(2)))
            tx.setFrom(from)
            tx.setTo(to)
            tx.setTimestamp(this.tx.getTimestamp())
            tx.setIbtp(this.tx.getIbtp())
            tx.setNonce(this.tx.getNonce())
            tx.setAmount(this.tx.getAmount())

            return tx.serializeBinary()
        }
    }

    needHashBytes() {
        if (this.tx.getPayload() !== "") {
            let tx = new pb.ContractTransaction()
            tx.setFrom(this.tx.getFrom())
            tx.setTo(this.tx.getTo())
            tx.setTimestamp(this.tx.getTimestamp())
            tx.setPayload(this.tx.getPayload())
            // tx.setIbtp(this.tx.getIbtp())
            tx.setNonce(this.tx.getNonce())
            tx.setAmount(this.tx.getAmount())

            return tx.serializeBinary()
        } else {
            let tx = new pb.IBTPTransaction()
            tx.setFrom(this.tx.getFrom())
            tx.setTo(this.tx.getTo())
            tx.setTimestamp(this.tx.getTimestamp())
            tx.setIbtp(this.tx.getIbtp())
            tx.setNonce(this.tx.getNonce())
            tx.setAmount(this.tx.getAmount())

            return tx.serializeBinary()
        }
    }

    // Transform Transaction to a String
    metaHashString() {
        if (this.tx.getPayload() !== "") {
            let tx = new pb.ContractTransaction()
            let from = new Uint8Array(hexToArrayBuffer(this.tx.getFrom().slice(2)))
            let to = new Uint8Array(hexToArrayBuffer(this.tx.getTo().slice(2)))
            tx.setFrom(from)
            tx.setTo(to)
            tx.setTimestamp(this.tx.getTimestamp())
            tx.setPayload(this.tx.getPayload())
            // tx.setIbtp(this.tx.getIbtp())
            tx.setNonce(this.tx.getNonce())
            tx.setAmount(this.tx.getAmount())
            tx.setTyp(1)

            return Buffer.from(tx.serializeBinary())
        } else {
            let tx = new pb.IBTPTransaction()
            let from = new Uint8Array(hexToArrayBuffer(this.tx.getFrom().slice(2)))
            let to = new Uint8Array(hexToArrayBuffer(this.tx.getTo().slice(2)))
            tx.setFrom(from)
            tx.setTo(to)
            tx.setTimestamp(this.tx.getTimestamp())
            tx.setIbtp(this.tx.getIbtp())
            tx.setNonce(this.tx.getNonce())
            tx.setAmount(this.tx.getAmount())
            tx.setTyp(1)

            return Buffer.from(tx.serializeBinary())
        }
    }

    // Sign the Transaction
    async sign(privateKey) {
        let needHashString = this.needHashString();
        let unHashedString = Buffer.from(needHashString);
        let hashedString = sha256.digest(needHashString);

        let ec = new EC('secp256k1');
        let keyPair = ec.keyFromPrivate(privateKey, 'hex');
        let signature = keyPair.sign(hashedString);
        let typ = [3]
        let r = signature.r.toArray('be', 32);
        let s = signature.s.toArray('be', 32);
        let v = signature.recoveryParam;
        let sig = new Uint8Array(typ.concat(r).concat(s).concat(v));
        this.tx.setSignature(sig);
    }

    // Sign the Transaction
    async byteSign(privateKey) {
        let needHashString = this.needHashBytes();
        let unHashedString = Buffer.from(needHashString);
        let hashedString = sha256.digest(needHashString);

        let ec = new EC('secp256k1');
        let keyPair = ec.keyFromPrivate(privateKey, 'hex');
        let signature = keyPair.sign(hashedString);
        let typ = [3]
        let r = signature.r.toArray('be', 32);
        let s = signature.s.toArray('be', 32);
        let v = signature.recoveryParam;
        let sig = new Uint8Array(typ.concat(r).concat(s).concat(v));
        this.tx.setSignature(sig);
    }
}
const toHexString = (bytes) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");

module.exports = Transaction;