import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x4b06254515abf88544ba4c04f10775e68fc0e5e0";
const CONTRACT_ABI = [
  {
    inputs: [],
    name: "fund",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "NotOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "funder",
        type: "address",
      },
    ],
    name: "addressToAmountFunded",
    outputs: [
      {
        internalType: "uint256",
        name: "amountFunded",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "funders",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINIMUM_USD",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

let Contract; // Will hold the contract instance

const connectWallet = async () => {
  // Check if the `window.ethereum` object is available in the browser.
  if (window.ethereum) {
    // Create an ethers.js provider using `window.ethereum`.
    // `BrowserProvider` enables ethers.js to interact with the browser's wallet.
    // It connects to the blockchain specified by the user's wallet (e.g., Ethereum).
    const provider = new ethers.BrowserProvider(window.ethereum);

    const signer = await provider.getSigner(); // Gets the current wallet's signer(responsible for signing transactions and sending them to the blockchain.)

    // Initialize the contract with the signer
    Contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    console.log("Contract initialized with signer:", signer.address);
    return signer.address;
  } else {
    throw new Error(
      "MetaMask is not installed. Please install it to use this feature."
    );
  }
};

// Function to get the contract balance
const getContractBalance = async () => {
  if (!Contract) {
    throw new Error("Contract is not initialized. Connect wallet first.");
  }
  const provider = new ethers.BrowserProvider(window.ethereum); // Create a provider
  const balance = await provider.getBalance(CONTRACT_ADDRESS); // Fetch contract balance
  return ethers.formatEther(balance); // Return formatted balance
};

export { connectWallet, Contract, getContractBalance };
