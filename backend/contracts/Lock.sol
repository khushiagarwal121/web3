//This is a simple Solidity smart contract written for the Ethereum blockchain
// contracts/Counter.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// Defines a smart contract named Counter.
contract Counter {
    //Unsigned integer (whole number ≥ 0).
    // readable from outside the contract even by frontend apps
    uint public count = 0;
  event CounterIncremented(uint256 newCount); // 👈 Add this event
// A public function (anyone can call it).
// It increases the count by 1 every time it's called.
// Changes the blockchain state — so it costs gas to call this.
    function increment() public {
        count += 3;
         emit CounterIncremented(count); // 👈 Emit it on increment
    }
// view	Tells Solidity that this function only reads from the blockchain
    function getCount() public view returns (uint) {
        return count;
    }
}
