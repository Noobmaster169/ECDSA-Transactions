import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [publicKey, setPublicKey] = useState("");
  const [signature, setSignature] = useState("");

  return (
    <div className="app">
      <Wallet
        publicKey={publicKey}
        setPublicKey={setPublicKey}
        balance={balance}
        setBalance={setBalance}
        signature={signature}
        setSignature={setSignature}
      />
      <Transfer setBalance={setBalance} publicKey={publicKey} signature={signature} setSignature={setSignature} />
    </div>
  );
}

export default App;
