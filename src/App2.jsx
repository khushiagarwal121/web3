import { useState } from "react";
import Web3 from "web3";
import counterABI from "./abi/CounterABI.json";
import MovieFetcher from "./components/MovieFetcher";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import User from "./components/User";
const CONTRACT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Navbar />
          <Home />
        </>
      ),
    },
    {
      path: "/login",
      element: (
        <>
          <Navbar />
          <Login />
        </>
      ),
    },
    {
      path: "/user/:username",
      element: (
        <>
          <Navbar />
          <User />
        </>
      ),
    },
  ]);
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
      // User connects wallet using eth_requestAccountsb
      // This asks the user to connect their wallet to your app.
      // pop up to connect wallet
      await window.ethereum.request({ method: "eth_requestAccounts" });
      // Now that the wallet is connected, this line gets an array of wallet addresses.
      // getAccounts - Returns a list of accounts the node controls.
      const accounts = await web3Instance.eth.getAccounts();
      const address = accounts[0];
      setAccount(address);
      setWeb3(web3Instance);

      // 👉 Add this to log the latest block
      const blockNumber = await web3Instance.eth.getBlockNumber();
      // balance in wei
      const balanceWei = await web3Instance.eth.getBalance(address);
      //   balance converted to etehr
      const balanceEth = web3Instance.utils.fromWei(balanceWei, "ether");
      // loads the contract using ABI and address
      // web3Instance.eth.Contract – A Web3.js method to create a contract object that can interact with a deployed smart contract.
      // The web3.eth.Contract object makes it easy to interact with smart contracts on the ethereum blockchain.
      const ctr = new web3Instance.eth.Contract(
        counterABI.abi,
        CONTRACT_ADDRESS
      );
      setContract(ctr);

      const currentCount = await ctr.methods.getCount().call();
      setCount(currentCount);
    } catch (error) {
      console.error("❌ Error connecting wallet:", error);
    }
  }

  async function increment() {
    try {
      // 1. Estimate gas before sending
      const gas = await contract.methods.increment().estimateGas({
        from: account,
      });
      await contract.methods.increment().send({ from: account });
      const newCount = await contract.methods.getCount().call();
      setCount(newCount);
    } catch (error) {
      console.error("❌ Error incrementing count:", error);
    }
  }

  async function manualIncrementTx() {
    try {
      const data = web3.eth.abi.encodeFunctionCall(
        {
          name: "increment",
          type: "function",
          inputs: [],
        },
        []
      );

      const gas = await web3.eth.estimateGas({
        from: account,
        to: CONTRACT_ADDRESS,
        data: data,
      });
      const tx = await web3.eth.sendTransaction({
        from: account,
        to: CONTRACT_ADDRESS,
        gas: gas,
        data: data,
      });
      console.log("manual transaction", tx.transactionHash);

      const newCount = await contract.methods.getCount().call();
      setCount(newCount);
    } catch (error) {
      console.error("manual tx error", error);
    }
  }

  return (
    <div
      style={{
        margin: "20px",
      }}
    >
      <RouterProvider router={router} />
      <div>hello</div>
      {/* <Navbar/> */}

      <button
        onClick={connectWallet}
        style={{
          backgroundColor: "green",
        }}
      >
        Connect Wallet
      </button>
      {account && <p>Connected: {account}</p>}
      {count !== null && (
        <>
          <p>Count: {count}</p>
          <button
            onClick={increment}
            style={{
              backgroundColor: "grey",
            }}
          >
            Increment
          </button>
          <button
            onClick={manualIncrementTx}
            style={{
              marginLeft: "10px",
              backgroundColor: "grey",
            }}
          >
            Manual Increment
          </button>
        </>
      )}
      {/* <CounterListener
        contractAddress={CONTRACT_ADDRESS}
        onCountChange={setCount}
      /> */}
      <MovieFetcher />
    </div>
  );
}

export default App;
