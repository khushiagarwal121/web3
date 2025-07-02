import { useEffect } from "react";
import Web3 from "web3";
import counterABI from "../abi/CounterABI.json";

function CounterListener({ contractAddress, onCountChange }) {
  useEffect(() => {
    // Setup WebSocket connection
    const web3Ws = new Web3(
      new Web3.providers.WebsocketProvider("ws://localhost:8545")
    );

    const wsContract = new web3Ws.eth.Contract(counterABI.abi, contractAddress);

    // Subscribe to the event
    const subscription = wsContract.events.CounterIncremented()
      .on("data", (event) => {
        console.log("📢 CounterIncremented event:", event);
        const updatedCount = event.returnValues.newCount;
        onCountChange(updatedCount); // update state in parent
      })
      .on("error", (error) => {
        console.error("❌ Event subscription error:", error);
      });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe((error, success) => {
        if (success) {
          console.log("🧹 Unsubscribed from event");
        }
      });
    };
  }, [contractAddress, onCountChange]);

  return null; // this component only runs side-effects, renders nothing
}

export default CounterListener;
