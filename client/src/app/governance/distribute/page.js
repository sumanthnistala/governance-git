'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MyContractABI from "../../../../public/GovernanceDAO.json";
import Layout from "@/app/Layout/page";

const DistributeRewards = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [proposalId, setProposalId] = useState('');

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
    
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const contractInstance = new ethers.Contract(
            process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
            MyContractABI.abi,
            provider
          );
          setContract(contractInstance);

          // const accounts = await web3Provider.listAccounts();
          // setAccount(accounts[0]);
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
        }
      } else {
        alert('MetaMask is not installed. Please install it to use this dApp.');
      }
    };
    init();
  }, []);

  const handleDistributeRewards = async () => {
    try {
      const tx = await contract.distributeRewards(proposalId);
      await tx.wait();
      alert('Rewards distributed successfully!');
    } catch (error) {
      console.error('Failed to distribute rewards', error);
      alert('Failed to distribute rewards.');
    }
  };

  return (
    <Layout>
      <h1>Distribute Rewards</h1>
      <input
        type="text"
        placeholder="Proposal ID"
        value={proposalId}
        onChange={(e) => setProposalId(e.target.value)}
      />
      <button onClick={handleDistributeRewards}>Distribute Rewards</button>
    </Layout>
  );
};

export default DistributeRewards;
