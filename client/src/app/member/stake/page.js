'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VotingDAO from '../../../contracts/VotingDAO.json';
import Layout from '../../../components/Layout';

const Stake = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(web3Provider);
          const signerInstance = web3Provider.getSigner();
          setSigner(signerInstance);

          const network = await web3Provider.getNetwork();
          const contractInstance = new ethers.Contract(
            VotingDAO.networks[network.chainId].address,
            VotingDAO.abi,
            signerInstance
          );
          setContract(contractInstance);

          const accounts = await web3Provider.listAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          console.error("Error connecting to metamask", error);
        }
      } else {
        alert('MetaMask is not installed. Please install it to use this dApp.');
      }
    };
    init();
  }, []);

  const handleStake = async () => {
    try {
      const tx = await contract.stake({ value: ethers.utils.parseEther(amount) });
      await tx.wait();
      alert('Staked successfully!');
    } catch (error) {
      console.error('Failed to stake', error);
      alert('Failed to stake.');
    }
  };

  return (
    <Layout>
      <h1>Stake</h1>
      <input
        type="number"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleStake}>Stake</button>
    </Layout>
  );
};

export default Stake;
