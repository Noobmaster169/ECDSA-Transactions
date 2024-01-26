const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes, hexToBytes } = require("ethereum-cryptography/utils");

async function generateKey(){
    const privateKey = await secp.secp256k1.utils.randomPrivateKey();
    const publicKey = secp.secp256k1.getPublicKey(privateKey);
    
    console.log("Generating New Keys:");
    console.log("Private Key:", toHex(privateKey));
    console.log("Public Key :", toHex(publicKey));
    console.log(`Address    : 0x${toHex(publicKey.slice(-20))}`);
    return privateKey;
}

module.exports = generateKey;

if (require.main === module) {
    generateKey();
}