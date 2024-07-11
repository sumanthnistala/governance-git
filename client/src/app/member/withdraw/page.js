'use client';

import React, { useState, useEffect } from 'react';
import { ethers, utils } from 'ethers';
import MyContractABI from "../../../../public/GovernanceDAO.json";
import Layout from "@/app/Layout/page";

const WithdrawStake = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');

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

          const amount = await contractInstance.getMyStake();
          setAmount(amount);
        } catch (error) {
          console.error("Error connecting to metamask", error);
        }
      } else {
        alert('MetaMask is not installed. Please install it to use this dApp.');
      }
    };
    init();
  }, []);

  const handleWithdrawStake = async () => {
    try {
      const tx = await contract.withdrawStake(ethers.parseEther(amount));
      await tx.wait();
      alert('Stake withdrawn successfully!');
    } catch (error) {
      console.error('Failed to withdraw stake', error);
      alert('Failed to withdraw stake.');
    }
  };

  return (
    <Layout>
       <div className="flex flex-col items-center justify-center min-h-80 py-2">
      <div className="bg-white p-6 rounded shadow-md text-black w-full max-w-md">
        <h6 className="text-xl mb-6 text-center">Withdraw Stake</h6>
        <div className="flex flex-col items-center justify-center">
          <label>My balance {}</label>
        <input className="m-3 h-12"
        type="number"
        placeholder="Amount in MATIC"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button className="w-60 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={handleWithdrawStake}>Withdraw Stake</button>
      </div>
      </div>
    </div>
    </Layout>
  );
};

export default WithdrawStake;
