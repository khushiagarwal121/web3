import { useState } from "react";
import Web3 from "web3";
import counterABI from "./abi/CounterABI.json";
import CounterListener from "./components/CounterListener";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  // stores the Ethereum address of the user's connected wallet (from MetaMask).
  const [account, setAccount] = useState(null); // Stores connected MetaMask address
  const [count, setCount] = useState(null);
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);

  async function connectWallet() {
    try {
      // Checks if window.ethereum exists (MetaMask injects this into the browser).
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }
      // Creates a new Web3 instance using MetaMask as the provider.
      const web3Instance = new Web3(window.ethereum);
      // eth_requestAccounts - Requests that the user provide access to addresses
      // .request(...): a function that sends JSON-RPC requests to MetaMask..
      // User connects wallet using eth_requestAccounts
      // This asks the user to connect their wallet to your app.
      // pop up to connect wallet
      await window.ethereum.request({ method: "eth_requestAccounts" });
      // Now that the wallet is connected, this line gets an array of wallet addresses.
      // getAccounts - Returns a list of accounts the node controls.
      const accounts = await web3Instance.eth.getAccounts();
      console.log("🟢 Accounts:", accounts);
      const address = accounts[0];
      setAccount(address);
      setWeb3(web3Instance);
      // balance in wei
      const balanceWei = await web3Instance.eth.getBalance(address);
      //   balance converted to etehr
      const balanceEth = web3Instance.utils.fromWei(balanceWei, "ether");
      console.log("🟢 Address:", address);
      console.log("🟢 Balance in ETH:", balanceEth);
      // loads the contract using ABI and address
      // web3Instance.eth.Contract – A Web3.js method to create a contract object that can interact with a deployed smart contract.
      // The web3.eth.Contract object makes it easy to interact with smart contracts on the ethereum blockchain.
      const ctr = new web3Instance.eth.Contract(
        counterABI.abi,
        CONTRACT_ADDRESS
      );
      setContract(ctr);

      const currentCount = await ctr.methods.getCount().call();
      console.log("🟢 Current Count:", currentCount);
      setCount(currentCount);
    } catch (error) {
      console.error("❌ Error connecting wallet:", error);
    }
  }

  async function increment() {
    try {
      console.log("🟢 Incrementing count...");
      // 1. Estimate gas before sending
      const gas = await contract.methods.increment().estimateGas({
        from: account,
      });
      console.log("🟡 Estimated Gas:", gas);
      await contract.methods.increment().send({ from: account });
      const newCount = await contract.methods.getCount().call();
      setCount(newCount);
    } catch (error) {
      console.error("❌ Error incrementing count:", error);
    }
  }

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      {account && <p>Connected: {account}</p>}
      {count !== null && (
        <>
          <p>Count: {count}</p>
          <button onClick={increment}>Increment</button>
        </>
      )}
      {/* <CounterListener
        contractAddress={CONTRACT_ADDRESS}
        onCountChange={setCount}
      /> */}
    </div>
  );
}

export default App;
