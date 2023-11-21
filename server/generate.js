const secp = require('ethereum-cryptography/secp256k1')
const { toHex } = require("ethereum-cryptography/utils");

const privKey = secp.utils.randomPrivateKey()

const pubKey = secp.getPublicKey(privKey);

console.log('priv', toHex(privKey))
console.log('pub', toHex(pubKey))