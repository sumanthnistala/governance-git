"use client";
import React, { useState, useEffect } from "react";
import { BrowserProvider, ethers } from "ethers";
import MyContractABI from "../../../../public/GovernanceDAO.json";
import Layout from "@/app/Layout/page";

const ExecuteProposal = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [signer, setSigner] = useState();
  const [provider, setProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedProposal, setSelectedProposal] = useState({
    choices: [],
    votes: [],
  });
  const [selectedChoice, setSelectedChoice] = useState("");
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [selectedKey, setSelectedKey] = useState(0);
  const [isDetailsAvailable, setIsDetailsAvailable] = useState(false);
  const [vote, setVote] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const [index, setSelectedIndex] = useState();

  useEffect(() => {
    const init = async () => {
      const provider = new BrowserProvider(window.ethereum);
      setProvider(provider);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      setSigner(signer);
      const address = await signer.getAddress();
      setAddress(address);
      const contractInstance = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        MyContractABI.abi,
        provider
      );
      setContract(contractInstance);
      const proposalCount = await contractInstance.proposalCount.call();
      console.log("proposalCount" + proposalCount);
      const proposalsArray = [];
      for (let i = 0; i < proposalCount; i++) {
        const proposal = await contractInstance.proposals(i);
        if(!proposal.isExecuted)
          {
            proposalsArray.push(proposal);
          }
      }
      setProposals(proposalsArray);
    };
    init();
  }, []);

  const getProposal = async () => {
    const proposal = await contract.getProposalVotes(index);
    console.log(proposal);

    const item = {};
    if (proposal.length > 0) {
      let choices = "choices";
      item[choices] = [];

      let votes = "votes";
      item[votes] = [];
      for (let i = 0; i < proposal[0].length; i++) {
        item[choices][i] = proposal[0][i];
        item[votes][i] = proposal[1][i];
      }
    }

    console.log(item);
    setSelectedProposal(item);
    setIsDetailsAvailable(true);
  };

  const onExecuteProposal = async () => {
    await contract.connect(signer).executeProposal(index);
    alert(
      "Proposal executed successfully. Transaction completion takes time. Please check for changes after transaction completion."
    );
  };

  const onChangeIndex = async (e) => {
    const selectedIndex = e.target.value;
    setSelectedIndex(e.target.value);
    console.log("selectedIndex" + selectedIndex);
    for (let i = 0; i < selectedProposal.votes.length; i++) {
      alert(selectedProposal.votes[selectedIndex]);
    }
  };

  const onChangeChoice = async (e) => {
    const selectedIndex = e.target.value;
    setSelectedChoice(e.target.value);
    console.log("selectedIndex" + selectedIndex);
    for (let i = 0; i < selectedProposal.votes.length; i++) {
      setVote("No. Of Votes: " + selectedProposal.votes[selectedIndex]);
    }
  };
  return (
    <Layout>
      <div className="flex justify-center min-h-screen w-full py-2">
        <div className="w-88%">
          <h2 className="text-2xl mb-6 text-center">Execute Proposal</h2>
          <div className="h-16">
            <select onChange={onChangeIndex}>
              <option>Select Proposal</option>
              {proposals.map((proposal, index) => (
                <option key={proposal.id} value={proposal.id}>
                  {proposal.description}
                </option>
              ))}
            </select>
            <button
              className="w-32  mx-3 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={getProposal}
            >
              Get Details
            </button>
          </div>
          <div>
            {selectedProposal !== null && isDetailsAvailable && (
              <>
                  <div className="h-16">
                    <select onChange={onChangeChoice}>
                      <option>Select Choice</option>
                      {selectedProposal.choices.map((choice, index) => (
                        <option key={index} value={index}>
                          {choice}
                        </option>
                      ))}
                    </select>
                    <input
                      className="mx-10"
                      type="text"
                      value={vote}
                      readOnly
                    />
                  </div>
                <div className="flex justify-center">
                  <button
                    disabled={isDisabled}
                    className="w-32  m-5 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={onExecuteProposal}
                  >
                    Execute
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExecuteProposal;
