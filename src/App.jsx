import { useState } from "react"
import Contract from "./utils/Contract"
import { ethers } from "ethers";

const App = () => {
const [fundAmount, setFundAmount] = useState(''); //state to hold fund amount input
const [message, setMessage] = useState(''); // stae to show messages

//function to handle funding the contract
const fund = async () => {
  try {
    const tx = await Contract.fund(ethers.utils.parseEther(fundAmount)) //calls the fund method to send ether amount
    await tx.wait(); //wait for the transaction to be mined
    setMessage("Funded Successfully");
  } catch (err) {
    console.error(err);
    setMessage("Failed to fund contract")
  }
}

//function to handle withdrawal of funds
const withdraw = async () => {
  try {
    const tx = await Contract.withdraw(); //call the withdraw method
    await tx.wait();
    setMessage("withdrawal successfull");
  } catch(err) {
    console.error(err);
    setMessage("Failed to withdraw funds");
  }
}

  return (
    <div>App</div>
  )
}

export default App