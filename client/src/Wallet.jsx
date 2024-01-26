import server from "./server";

function Wallet({ publicKey, setPublicKey, balance, setBalance, signature, setSignature }) {
  async function keyChange(evt) {
    const publicKey = evt.target.value;
    setPublicKey(publicKey);
    if (publicKey) {
      const {
        data: { balance },
      } = await server.get(`balance/${publicKey}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }
  async function sigChange(evt){
    const signature = evt.target.value;
    setSignature(signature);
  }
  
  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Public Key
        <input placeholder="Type an address, for example: 0x1" value={publicKey} onChange={keyChange}></input>
      </label>
      <label>
        Signature
        <input placeholder="Enter Signature" value={signature} onChange={sigChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
