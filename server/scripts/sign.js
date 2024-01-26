const {toHex, utf8ToBytes} = require("ethereum-cryptography/utils");
const {keccak256}   = require("ethereum-cryptography/keccak");
const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");

(async () => {
    const args = process.argv.slice(2);
    if(args.length != 3){
        console.log("Required Argument Format: <PRIVATE_KEY> <DESTINATION_ADDRESS> <AMOUNT_TO_SENT>");
        process.exit(1);
    }
    const [privateKey, receiver, amountSent] = args;
    const message    = `${receiver},${amountSent}`;
    
    try{
        const messageHash = toHex(await hashMessage(message)).toString();
        const signature = secp256k1.sign(messageHash, privateKey);
        
        console.log("------------------------------------------------");
        console.log("SIGNING TRANSACTION");
        console.log("Transaction Message:", message);
        console.log();
        console.log("Signature:")
        console.log(JSON.stringify({
                r: signature.r.toString(),
                s: signature.s.toString(),
                recovery: signature.recovery
            }));
        console.log();
        
        const publicKey = secp256k1.getPublicKey(privateKey);
        const address   = `0x${toHex(publicKey.slice(-20))}`;
        const isSigned  = secp256k1.verify(signature, messageHash, publicKey);
        console.log("Your Public Key:", toHex(publicKey));
        console.log("Your Address   :", address);
        console.log("SIGNING COMPLETED");
        console.log("Verification Result:",isSigned);
    }catch(error){
        console.error("Signing Process Failed");
        console.error(error);
    }
    
  })();

async function hashMessage(msg){
    return keccak256(utf8ToBytes(msg));
}


