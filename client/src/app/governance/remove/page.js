"use client"
import React, { useState, useEffect } from 'react';
import {ethers} from 'ethers';
// import VotingDAO from '../../../contracts/VotingDAO.json';

const RemoveMember = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [memberAddress, setMemberAddress] = useState('');

  useEffect(() => {
    const init = async () => {
        const provider = new BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const contractInstance = new contract(
        VotingDAO.abi,
        deployedNetwork && deployedNetwork.address,
      );
      setContract(contractInstance);

      const getAllMembers = contract.getMembers();
    };
    init();
  }, []);

  const handleDeleteMember = async () => {
    try {
      await contract.methods.removeMember(memberAddress).send({ from: account });
      alert('Member removed successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to remove member.');
    }
  };

  return (
    <div>
      <h1>Delete Member</h1>
      <input
        type="text"
        placeholder="Member Address"
        value={memberAddress}
        onChange={(e) => setMemberAddress(e.target.value)}
      />
      <button onClick={handleDeleteMember}>Delete Member</button>
    </div>
  );
};

export default RemoveMember;