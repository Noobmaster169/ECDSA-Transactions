const { toHex, hexToBytes } = require("ethereum-cryptography/utils");
const express = require("express");
const {hashMessage, verifySignature} = require("./scripts/verify")
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x2eb538050a2709b74c69f0f978552bd6b5126121": 100,
  "0x8926fb46c9bc6578507adc984aace8aab92c881a": 50,
  "0xa771cafb3c016edb7d5e3cd58b2eb0e369869b77": 75,
};

app.get("/balance/:publicKey", (req, res) => {
  const { publicKey } = req.params;
  
  try{
    const address = `0x${toHex(hexToBytes(publicKey).slice(-20))}`;
    const balance = balances[address] || 0;
    res.send({ balance });
  }
  catch(error){
    res.send({ balance: 0 });
  }
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;
  const senderAddress = `0x${toHex(hexToBytes(sender).slice(-20))}`;
 
  async function verify(){ //Verify the Transaction Signature.
    const messageHash  = await hashMessage(`${recipient},${amount}`);
    const verification = await verifySignature(signature, messageHash, sender);
    return verification;
  };
  
  async function sendBalance(){  //Try send the balance to the user.
    if(!await verify()){
      res.status(400).send({message: "Signature is not valid"})
    }else if (balances[senderAddress] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[senderAddress] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[senderAddress]});
    }
  }
  
  setInitialBalance(senderAddress);
  setInitialBalance(recipient);
  sendBalance();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
