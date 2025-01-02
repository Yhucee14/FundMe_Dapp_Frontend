import { useState, useEffect } from "react";
import { Contract, connectWallet, getContractBalance } from "./utils/Contract";
import { ethers } from "ethers";

const App = () => {
  const [address, setAddress] = useState("");
  const [fundAmount, setFundAmount] = useState(""); //state to hold fund amount input
  const [message, setMessage] = useState(""); // stae to show messages
  const [contractBalance, setContractBalance] = useState("0.0"); // Contract balance
  const [isConnected, setIsConnected] = useState(false); // Track if wallet is connected

  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setAddress(savedAddress);
      setIsConnected(true);
    }

    const savedBalance = localStorage.getItem("contractBalance");
    if (savedBalance) {
      setContractBalance(savedBalance); // Load balance from local storage
    }
  }, []);

  const handleConnect = async () => {
    try {
      const addr = await connectWallet();
      // Calls the `connectWallet` function to connect to the browser wallet.
      // `connectWallet` returns the connected wallet's address, which is stored in `addr`.

      setAddress(addr);
      // Updates the application state with the connected wallet address.
      setMessage(addr);
      setIsConnected(true);
      localStorage.setItem("walletAddress", addr);
      
      const balance = await getContractBalance();
      setContractBalance(balance); // Update balance state
      localStorage.setItem("contractBalance", balance);
    } catch (err) {
      setMessage("Connection failed: " + err.message);
    }
  };

  const handleFund = async () => {
    try {
      if (!fundAmount || isNaN(fundAmount) || parseFloat(fundAmount) <= 0) {
        throw new Error("Insufficient fund amount.");
      }

      const tx = await Contract.fund({ value: ethers.parseEther(fundAmount) });
      await tx.wait();
      setMessage("Funded successfully!");

      const balance = await getContractBalance();
      setContractBalance(balance); // Update balance state
      localStorage.setItem("contractBalance", balance);
    } catch (err) {
      console.error("Error:", err);
      setMessage("Failed to fund contract: " + err.message);
    }
  };

  const handleWithdraw = async () => {
    try {
      const tx = await Contract.withdraw();
      // Calls the `withdraw` function from the smart contract.
      // This function is usually restricted to the owner of the contract.

      await tx.wait();
      // Waits for the transaction to be confirmed on the blockchain.
      // Ensures that the withdrawal process is complete before proceeding.

      setMessage("Withdrawal successful!");

      const balance = await getContractBalance();
      setContractBalance(balance); // Update balance state
      localStorage.setItem("contractBalance", balance);
    } catch (err) {
      console.error("Error during withdrawal:", err);

      setMessage("Failed to withdraw: " + err.message);
    }
  };

  const handleDisconnectWallet = () => {
    localStorage.clear(); // Clear all items from local storage
    setAddress(""); // Clear the wallet address from the state
    setContractBalance("0.0"); // Reset the contract balance
    setIsConnected(false); // Reset the connection status
    setMessage("Local storage cleared.");
  };
  

  return (
    <div>
      <h1>FundMe Dapp</h1>

      <div>
        {isConnected ? (
          <div>
              <p>Connected Wallet: {address}</p>
              <button onClick={handleDisconnectWallet}>Disconnect Wallet</button>
          </div>
        ) : (
          <button onClick={handleConnect}>Connect Wallet</button>
        )}
      </div>

      <div>
        <p>Contract Balance: {contractBalance} eth</p>

        <input
          type="text"
          value={fundAmount}
          onChange={(e) => setFundAmount(e.target.value)} //update fundAmount state on input
          placeholder="Enter Amount to fund (Eth)"
        />

        <button onClick={handleFund}>Fund contract</button>
      </div>

      <div>
        <button onClick={handleWithdraw}>Withdraw</button>
      </div>
    </div>
  );
};

export default App;
