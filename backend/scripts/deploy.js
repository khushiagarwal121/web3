// scripts/deploy.js
// - **`hre`** stands for **Hardhat Runtime Environment**.
// - It gives you access to Hardhat's built-in objects like `ethers`, `network`, `config`, etc.
// - You need this to interact with contracts, networks, and deploy them.
const hre = require("hardhat");

// This is the **main async function** that handles the deployment logic.

async function main() {
  // “Find the compiled artifact named Counter and prepare it for deployment.”
    // - `getContractFactory("Counter")` compiles and loads the **Counter smart contract**.
  const Counter = await hre.ethers.getContractFactory("Counter");
//   - This **deploys the `Counter` smart contract** to the currently selected network (e.g., `localhost`, `goerli`, etc.).
// - Returns a contract **instance** (`counter`) representing the deployed contract.
  const counter = await Counter.deploy(); // deploy the contract

  // Wait for deployment to finish
  await counter.waitForDeployment();
// - Retrieves the **address** where the smart contract was deployed.
// - Useful for printing, saving, or using in frontend code.
  // Get the deployed contract address
  const address = await counter.getAddress();
// - Logs the deployed contract address so you can copy it for testing or frontend use.
  console.log("Counter deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
