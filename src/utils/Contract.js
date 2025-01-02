import { ethers } from "ethers";

const CONTRACT_ADDRESS = '0x4b06254515abf88544ba4c04f10775e68fc0e5e0';
const CONTRACT_ABI = [
	{
		"inputs": [],
		"name": "fund",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "NotOwner",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "funder",
				"type": "address"
			}
		],
		"name": "addressToAmountFunded",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountFunded",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "funders",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MINIMUM_USD",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

//connecting to sepolia testnet with alchemy
const Provider = new ethers.JsonRpcProvider(`${import.meta.env.ALCHEMY_URL}`);

//connect private key
const Wallet = new ethers.Wallet(`${import.meta.env.WALLET_PRIVATE_KEY}`);

//export contract object to be used in other components
const Contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, Wallet)

export default Contract;