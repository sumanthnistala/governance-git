"use client";

import React, { useState, useEffect } from "react";
import { ethers,BrowserProvider } from "ethers";
import MyContractABI from "../../../../public/GovernanceDAO.json";
import Layout from "@/app/Layout/page";

const DistributeRewards = () => {
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
  const [amount, setAmount] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const [index, setSelectedIndex] = useState();
  const[votingType, setVotingType] = useState();

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
        if(proposal.isExecuted)
        {
          proposalsArray.push(proposal);
        }
      }
      setProposals(proposalsArray);
    };
    init();
  }, []);

  const getProposal = async () => {
    const proposal = await contract.getProposal(index);
    console.log(proposal);
    if (proposal.length > 0) {
      const votingType = proposal[1] === 0n ? "SingleChoice" : "MultipleChoice";
      setVotingType(votingType);
    }

    const proposalVotes = await contract.getProposalVotes(index);
    console.log(proposal);

    const item = {};
    if (proposalVotes.length > 0) {
      let choices = "choices";
      item[choices] = [];

      let votes = "votes";
      item[votes] = [];
      for (let i = 0; i < proposalVotes[0].length; i++) {
        item[choices][i] = proposalVotes[0][i];
        item[votes][i] = proposalVotes[1][i];
      }
    }

    console.log(item);
    setSelectedProposal(item);
    setIsDetailsAvailable(true);
  };

  const handDistributeRewards = async () => {

    let choices=[]
    if(selectedProposal.votingType==="SingleChoice")
    {
    if (selectedChoice === "") {
      alert("choice should not be null");
      return;
    }
    else choices[0] = selectedChoice;
  }
  else if(selectedProposal.votingType==="MultipleChoice")
  {
    if(selectedChoices !== null && selectedChoices.length <2)
    {
      alert("choice should not be null");
      return
    }
    else 
    {
      for (let i=0;i<selectedChoices.length;i++)
      {
        choices[i] = selectedChoices[i];
      }
    }
  }
    await contract.connect(signer).distributeRewards(1, choices);
    alert("Distributed rewards Successfully. Please wait for sometime to update");
  };

  const onChangeIndex = async (e) => {
    setSelectedIndex(e.target.value);
  };
  return (
    <Layout>
      <div className="flex justify-center min-h-screen w-full py-2">
        <div className="w-88%">
          <h2 className="text-2xl mb-6 text-center">Distribute Rewards</h2>
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
              <><label>Select option as winner</label>
                {votingType === "SingleChoice" ? (
                  <>
                    <div className="h-16">
                      <select
                        onChange={(e) => setSelectedChoice(e.target.value)}
                      >
                        <option>Select Choice</option>
                        {selectedProposal.choices.map((choice, index) => (
                          <option key={index} value={index}>
                            {choice}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <div>
                    <div>
                      {selectedProposal.choices.map((choice, index) => (
                        <div key={index} className="mx-2">
                          <input
                            type="checkbox"
                            value={index}
                            onChange={(e) => {
                              const newSelectedChoices = [...selectedChoices];
                              if (e.target.checked) {
                                newSelectedChoices.push(index);
                              } else {
                                newSelectedChoices.splice(
                                  newSelectedChoices.indexOf(index),
                                  1
                                );
                              }
                              setSelectedChoices(newSelectedChoices);
                            }}
                          />
                          {choice}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-center">
                  <button
                    disabled={isDisabled}
                    className="w-48  m-5 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={
                      handDistributeRewards
                    }
                  >
                    Distribute Rewards
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

export default DistributeRewards;
