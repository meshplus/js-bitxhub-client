
const CryptoJS = require('crypto-js')

function decrypt(privateKey, password) {
    let cipherHex = getCipherFromPrivateKey(privateKey).toString('hex')
    let ivHex = getIvFromPrivateKey(privateKey).toString('hex')

    let decrypted = CryptoJS.AES.decrypt(
        CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Hex.parse(cipherHex) }),
        CryptoJS.SHA256(password),
        { iv: CryptoJS.enc.Hex.parse(ivHex) }
    )
    return decrypted.toString()
}

function getCipherFromPrivateKey(privateKey) {
    return Buffer.from(privateKey, 'hex').slice(16)
}

function getIvFromPrivateKey(privateKey) {
    return Buffer.from(privateKey, 'hex').slice(0, 16)
}

module.exports = {
    decrypt
};