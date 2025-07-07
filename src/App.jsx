import { useState } from "react";
import { BrowserProvider, Contract, formatEther } from "ethers";
import counterABI from "./abi/CounterABI.json"; // Copy ABI file to frontend
import MovieFetcher from "./components/MovieFetcher";

const CONTRACT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

function App() {
  const [account, setAccount] = useState(null);
  const [count, setCount] = useState(null);
  const [contract, setContract] = useState(null);

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }
      const el = <div>Hello</div>;

      console.log("JSON.stringify(el):", JSON.stringify(el)); // {}

      console.log("Full React Element:", el); // ✅ Shows everything
      // A Provider provides a connection to the blockchain, whch can be used to query its current state, simulate execution and send transactions to update the state.
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      console.log("🟢 Connected Account:", address);
      const balance = await provider.getBalance(
        "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
      ); //(in wei)
      console.log("🟢 Balance:", balance.toString());
      const balance2 = formatEther(balance);
      console.log("🟢 Balance in Ether:", balance2);
      // parseEther
      setAccount(address);
      const network = await provider.getNetwork();
      console.log("🟢 Network:", network);

      const block = await provider.getBlock();
      console.log("🟢 Block:", block);

     const gasPrice = await provider.getFeeData();

      console.log("🟢 Gas Price:", gasPrice);
      //Contract - This is a class from Ethers.js used to interact with deployed smart contracts.
      // The ABI (Application Binary Interface) is like a menu of functions and events the smart contract exposes.
      // It describes what functions exist (e.g., getCount(), increment()).

      // It tells Ethers how to call those functions correctly.

      const ctr = new Contract(CONTRACT_ADDRESS, counterABI.abi, signer);
      console.log("🟢 Contract Instance:", ctr);
      setContract(ctr);

      const currentCount = await ctr.getCount(); // or ctr.count()
      console.log("🟢 Current Count from Contract:", currentCount.toString());
      setCount(currentCount.toString());
    } catch (error) {
      console.error("❌ Error connecting wallet:", error);
    }
  }

  async function increment() {
    // sending a transaction
    const tx = await contract.increment();
    // confirms it was mined
    await tx.wait();// waits for it to be mined ⛏️ and is important
    const newCount = await contract.getCount();
    setCount(newCount.toString());
  }

  return (
    <div>
      <br></br>
      <button
        onClick={connectWallet}
        style={{
          padding: "10px 20px",
          margin: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          backgroundColor: "#f0f0f0",
          cursor: "pointer",
          color: "black",
        }}
      >
        Connect Wallet
      </button>
      {account && <p>Connected: {account}</p>}
      {count !== null && (
        <>
          <p>Count: {count}</p>
          <button onClick={increment}>Increment</button>
        </>
      )}
      <MovieFetcher />
    </div>
  );
}
export default App;

// ***************************************************
