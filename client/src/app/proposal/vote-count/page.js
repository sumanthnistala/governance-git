"use client"
import React, { useState, useEffect } from 'react';
import { BrowserProvider, ethers } from 'ethers';
import GovernanceDAO from '../../../public/GovernanceDAO.json'; // ABI file

const ProposalList = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [signer, setSigner]= useState();
  const [id,setId]= useState();

  useEffect(() => {
    const init = async () => {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      setSigner(signer);
      const address = await signer.getAddress();
      const contractInstance = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        MyContractABI.abi,
        provider
      );
      setContract(contractInstance);

      const proposals = await contractInstance.connect(signer).getProposals();
      console.log("proposals" + proposals);
      const proposalCount = await contractInstance.proposalCount.call();
      console.log("proposalCount" + proposalCount);
      const proposalsArray = [];
      for (let i = 0; i < proposalCount; i++) {
        const proposal = await contractInstance.proposals(i);
        console.log("proposal" + proposal.id);
        proposalsArray.push(proposal);
      }
      setProposals(proposalsArray);

    };
    init();
  }, []);

const getProposalVotes =async () =>
{
    const proposal = await contract.getProposal(0);
    console.log(proposal);
}

  return (
    <Layout>
    <div className="flex justify-center min-h-screen w-full py-2">
        <div className="w-88%">
          <h2 className="text-2xl mb-6 text-center">Vote Proposal</h2>
        <div className="h-16">
        <select>
          <option>Select Proposal</option>
          {proposals.map((proposal, index) => (
            <option key={0} value={0}>
              {proposal.description}
            </option>
          ))}
        </select>
        <button className="w-32  mx-3 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={getProposal}>Get Details</button>
        </div>
        </div>
        </div>
 </Layout>
  );
};

export default ProposalList;
