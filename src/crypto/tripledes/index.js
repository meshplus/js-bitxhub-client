
const CryptoJS = require('crypto-js')

function decrypt(privateKey, password) {
	if (password.length < 24) {
        throw "TripleDES decrypt Error：the secret len is less than 24"
    }
    let passwordBuf = Buffer.from(password).slice(0, 24)
    let passwordHex = passwordBuf.toString('hex')
    let cipherHex = getCipherFromPrivateKey(privateKey).toString('hex')
    let ivHex = getIvFromPrivateKey(privateKey).toString('hex')

    let decrypted = CryptoJS.TripleDES.decrypt(
        CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Hex.parse(cipherHex) }),
        CryptoJS.enc.Hex.parse(passwordHex),
        { iv: CryptoJS.enc.Hex.parse(ivHex) }
    )
    return decrypted.toString()
}

function getCipherFromPrivateKey(privateKey) {
    return Buffer.from(privateKey, 'hex').slice(8)
}

function getIvFromPrivateKey(privateKey) {
    return Buffer.from(privateKey, 'hex').slice(0, 8)
}

module.exports = {
    decrypt
};