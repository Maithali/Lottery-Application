import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import constants from "./constants";

function PickWinner() {
  const [owner, setOwner] = useState("");
  const [contractInstance, setContractInstance] = useState(null);
  const [currentAccount, setCurrentAccount] = useState("");
  const [isOwnerConnected, setIsOwnerConnected] = useState(false);
  const [winner, setWinner] = useState("");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (!window.ethereum) {
        alert("Please install Metamask to use this application");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      try {
        const address = await signer.getAddress();
        setCurrentAccount(address);

        const contract = new ethers.Contract(
          constants.contractAddress,
          constants.contractAbi,
          signer
        );

        setContractInstance(contract);

        const status = await contractInstance.status(); // ✅ use function name

        setStatus(contractStatus);

        const contractWinner = await contract.getWinner();
        setWinner(contractWinner);

        const contractOwner = await contract.getManager();
        setOwner(contractOwner);

        setIsOwnerConnected(
          contractOwner.toLowerCase() === address.toLowerCase()
        );

        window.ethereum.on("accountsChanged", async (accounts) => {
          setCurrentAccount(accounts[0]);
        });
      } catch (err) {
        console.error("Error connecting to contract:", err);
      }
    };

    initialize();
  }, []);

  const pickWinner = async () => {
    try {
      const tx = await contractInstance.pickWinner();
      await tx.wait();
      const updatedWinner = await contractInstance.getWinner();
      setWinner(updatedWinner);
      setStatus(true);
    } catch (err) {
      console.error("Error picking winner:", err);
    }
  };

  return (
    <div className="container">
      <h1>Result Page</h1>
      <div className="button-container">
        {status ? (
          <p>🎉 Lottery Winner is: {winner}</p>
        ) : isOwnerConnected ? (
          <button className="enter-button" onClick={pickWinner}>
            Pick a Winner
          </button>
        ) : (
          <p>⚠️ You are not the owner</p>
        )}
      </div>
    </div>
  );
}

export default PickWinner;
