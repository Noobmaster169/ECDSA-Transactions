const {keccak256}   = require("ethereum-cryptography/keccak");
const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const {toHex, utf8ToBytes} = require("ethereum-cryptography/utils");

async function hashMessage(msg){
    console.log("Hashing the message:", msg);
    const messageHash = await keccak256(utf8ToBytes(msg));
    return toHex(messageHash).toString();
}

function isValidSignature(signature) {
    return (
        signature &&
        typeof signature === "object" &&
        typeof signature.r === "string" &&
        typeof signature.s === "string" &&
        Number.isInteger(signature.recovery)
    );
}

function parseSignature(signatureString) {
    try {
        const parsedSignature = JSON.parse(signatureString);

        if (isValidSignature(parsedSignature)) {
            // Convert back to BigInt
            parsedSignature.r = BigInt(parsedSignature.r);
            parsedSignature.s = BigInt(parsedSignature.s);

            return parsedSignature;
        } else {
            throw new Error("Invalid signature format");
        }
    } catch (error) {
        throw new Error("Error parsing signature: " + error.message);
    }
}

function verifySignature(signatureString, messageHash,publicKey){
    console.log("Verifying Signature");
    try {
        const parsedSignature = parseSignature(signatureString); //Parse String to Signature
        const isSigned = secp256k1.verify(parsedSignature, messageHash, publicKey); //Verify the transaction
        return isSigned;
    } catch (error) {
        return false;
    }
}

module.exports = {hashMessage, verifySignature};