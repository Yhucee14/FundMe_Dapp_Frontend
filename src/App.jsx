import { useState, useEffect } from "react";
import { Contract, connectWallet, getContractBalance } from "./utils/Contract";
import { ethers } from "ethers";
import "../src/index.css";

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
      setMessage("Wallet connected successfully!");
    } catch (err) {
      setMessage("Connection failed: " + err.message);
    }
  };

  const handleFund = async () => {
    try {
      if (!Contract) {
        throw new Error(
          "No wallet connected. Please connect your wallet first."
        );
      }

      if (!fundAmount || isNaN(fundAmount) || parseFloat(fundAmount) <= 0) {
        throw new Error("Minimum is $5 Eth equivalent.");
      }

      const tx = await Contract.fund({ value: ethers.parseEther(fundAmount) });
      await tx.wait();
      setMessage(`Successfully funded ${fundAmount} ETH`);

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
      if (!Contract) {
        throw new Error(
          "No wallet connected. Please connect your wallet first."
        );
      }

      if (contractBalance <= 0) {
        throw new Error("Insufficient funds");
      }

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
    setMessage("Connect your metamask wallet.");
  };

  return (
    <div className=" flex flex-col  bg-gray-900 text-gray-100 p-6">
      <div>
        <div>
          {isConnected ? (
            <div className="flex flex-col md:flex-row justify-between">
              <h1 className="flex justify-center text-2xl ss:text-3xl py-1 font-bold text-teal-400">
                FundMe Dapp
              </h1>
              <div className="py-4 flex flex-col md:flex-row gap-4">
                <p className="text-gray-300 ss:text-lg flex flex-col ss:flex-row justify-center font-semibold py-2">
                  <span className="flex justify-center py-1">Connected Wallet:{" "}</span>
                  <span className="text-indigo-400 text-sm ss:text-lg py-1 px-1 font-bold">{address}</span>
                </p>
                <button
                  className="bg-indigo-500 hover:bg-indigo-800 transition-all duration-500 font-semibold text-gray-100 px-4 py-2 rounded-lg"
                  onClick={handleDisconnectWallet}
                >
                  Disconnect Wallet
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-row justify-between">
              <h1 className="flex justify-center text-xl ss:text-3xl py-1 font-bold text-teal-400">
                FundMe Dapp
              </h1>
              <button
                onClick={handleConnect}
                className="bg-indigo-500 font-semibold hover:bg-indigo-800 transition-all duration-500 text-gray-100 px-3 py-2 rounded-lg"
              >
                Connect Wallet
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="min-h-screen">
        <div className="py-4 flex justify-center flex-col">
          <p className="text-gray-300 flex ss:justify-center ss:text-lg py-4">
            Contract Balance:{" "}
            <span className="px-1 text-indigo-400"> {contractBalance} ETH</span>
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4 py-4">
            <div className="ss:py-3 flex justify-center">
              <input
                type="text"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)} //update fundAmount state on input
                placeholder="Enter Amount to fund (Eth)"
                className="ss:w-[500px] w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="flex flex-row justify-center py-3  gap-4">
              <button
                onClick={handleFund}
                className="bg-teal-500 font-semibold hover:bg-teal-600 transition-all duration-400 text-gray-100 px-3 py-2 rounded-lg"
              >
                Fund Contract
              </button>

              <button
                onClick={handleWithdraw}
                className="bg-red-500 font-semibold hover:bg-red-600 transition-all duration-400 text-gray-100 px-4 py-2 rounded-lg"
              >
                Withdraw Funds
              </button>
            </div>
          </div>
        </div>


        <div>
          {message && (
            <p
              className="mt-2 text-center text-lg font-bold"
              style={{
                color:
                  message.includes("Failed") || message.includes("Insufficient")
                    ? "red"
                    : "text-teal-400",
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
