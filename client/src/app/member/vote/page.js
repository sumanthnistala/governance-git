"use client";
import React, { useState, useEffect } from "react";
import { BrowserProvider, ethers } from "ethers";
import MyContractABI from "../../../../public/GovernanceDAO.json";
import Layout from "@/app/Layout/page";

const Vote = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [signer, setSigner] = useState();
  const [provider, setProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedProposal, setSelectedProposal] = useState({
    description: "",
    votingType: 0,
    choices: [],
  });
  const [selectedChoice, setSelectedChoice] = useState("");
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [selectedKey, setSelectedKey] = useState(0);
  const [isDetailsAvailable, setIsDetailsAvailable] = useState(false);
  const [amount, setAmount] = useState();
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

    const proposal = await contract.getProposal(index);
    console.log(proposal);

    const item = {};
    if (proposal.length > 0) {
      let description = "description";
      item[description] = proposal[0];
      let votingType = "votingType";
      item[votingType] = proposal[1] === 0n ? "SingleChoice" : "MultipleChoice";
      let choices = "choices";
      item[choices] = [];
      const choiceIndex = 3;
      for (let i = 0; i < proposal[choiceIndex].length; i++) {
        item[choices][i] = proposal[choiceIndex][i];
      }
    }
    setSelectedProposal(item);
    setIsDetailsAvailable(true);
  };

  const handleVoteSingleChoice = async () => {
    if(selectedChoice === "")
    {
      alert("choice should not be null");
      return;
    }
    if (account == 0 || amount < 0) {
      alert("Amount should not be be zero or negitive");
      return;
    }

    console.log("amount" + ethers.parseEther(amount));
    const balance = await provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);
    if(amount > balanceInEth)
    {
        alert("You staked amount is exceeding your balance.");
        return;
    }
    alert(
      "Wallet will ask for three transaction Cofirmations. Please confirm two transactions 1) Vote and 2) Deposit money into contract 3) Adding Stake for your vote"
    );

    await contract.connect(signer).voteSingleChoice(index, selectedChoice);
    const amountValue = ethers.parseEther(amount);
    await contract.connect(signer).deposit({ value: amountValue });
    await contract.stake(amount);
    alert("Voted Successfully. Please wait for sometime to update");
  };

  const handleVoteMultipleChoice = async () => {
    if(selectedChoices.length <2)
    {
      alert("Minimum two choices should be selected for Multiple Choice");
      return;
    }
    if (account == 0 || amount < 0) {
      console.log()
      alert("Amount should not be be zero or negitive");
      return;
    }
    console.log("amount" + ethers.parseEther(amount));
    const balance = await provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);
    if(amount > balanceInEth)
    {
        alert("You staked amount is exceeding your balance.");
        return;
    }
    alert(
      "Wallet will ask for three transaction Cofirmations. Please confirm two transactions 1) Vote and 2) Deposit money into contract 3) Adding Stake for your vote"
    );
    console.log("amount"+ amount);
    await contract
      .connect(signer)
      .voteMultipleChoice(index, selectedChoices);
    const amountValue = ethers.parseEther(amount);
    await contract.connect(signer).deposit({ value: amountValue });
    await contract.stake(amount);
    alert("Voted Successfully. Please wait for sometime to update");
  };

  const onChangeIndex = async (e) => {
    setSelectedIndex(e.target.value);
  };
  return (
    <Layout>
      <div className="flex justify-center min-h-screen w-full py-2">
        <div className="w-88%">
          <h2 className="text-2xl mb-6 text-center">Vote Proposal</h2>
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
                {selectedProposal.votingType === "SingleChoice" ? (
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
                      <input
                        className="mx-10"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount in MATIC"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center">
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
                      <input
                        className="mx-10"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount in MATIC"
                      />
                    </div>
                  </div>
                )}
                <div className="flex justify-center">
                  <button
                    disabled={isDisabled}
                    className="w-32  m-5 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={
                      selectedProposal.votingType === "SingleChoice"
                        ? handleVoteSingleChoice
                        : handleVoteMultipleChoice
                    }
                  >
                    Vote
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

export default Vote;
