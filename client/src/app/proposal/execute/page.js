// "use client";

// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import MyContractABI from "../../../../public/GovernanceDAO.json";
// import Layout from "@/app/Layout/page";

// const ExecuteProposal = () => {
//   const [provider, setProvider] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [account, setAccount] = useState("");
//   const [proposals, setProposals] = useState([]);
//   const [proposalId, setProposalId] = useState("");
//   const [selectedProposal, setSelectedProposal] = useState({
//     choices: [],
//     votes: []
//   });
//   const [choices, setChoices]= useState([]);
//   const [selectedChoice, setSelectedChoice] = useState("");
//   const [selectedChoices, setSelectedChoices] = useState([]);
//   const [selectedKey, setSelectedKey] = useState(0);
//   const [isDetailsAvailable, setIsDetailsAvailable] = useState(false);
//   const [amount, setAmount] = useState();
//   const [isDisabled, setIsDisabled] = useState(false);
//   const [index, setSelectedIndex] = useState();
//   useEffect(() => {
//     const init = async () => {
//       if (typeof window.ethereum !== "undefined") {
//         try {
//           const provider = new ethers.BrowserProvider(window.ethereum);
//           await provider.send("eth_requestAccounts", []);

//           const signer = await provider.getSigner();
//           const address = await signer.getAddress();
//           const contractInstance = new ethers.Contract(
//             process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
//             MyContractABI.abi,
//             provider
//           );
//           setContract(contractInstance);

//           const proposalCount = await contractInstance.proposalCount.call();
//           console.log("proposalCount" + proposalCount);
//           const proposalsArray = [];
//           for (let i = 0; i < proposalCount; i++) {
//             const proposal = await contractInstance.proposals(i);
//             console.log("proposal" + proposal.id);
//             proposalsArray.push(proposal);
//           }
//           setProposals(proposalsArray);
//         } catch (error) {
//           console.error("Error connecting to MetaMask", error);
//         }
//       } else {
//         alert("MetaMask is not installed. Please install it to use this dApp.");
//       }
//     };
//     init();
//   }, []);

//   const handleExecuteProposal = async () => {
//     try {
//       const tx = await contract.executeProposal(proposalId);
//       await tx.wait();
//       alert("Proposal executed successfully!");
//     } catch (error) {
//       console.error("Failed to execute proposal", error);
//       alert("Failed to execute proposal.");
//     }
//   };

//   const getVotingDetails = async () => {
//     console.log(index);
//     const proposal = await contract.getProposalVotes(0);
//     console.log(proposal);

//     const item = {};
//     if (proposal.length > 0) {
//       let choices = "Choices";
//       item[choices] = [];
//       let choiceIndex = 0;
//       for (let i = 0; i < proposal[choiceIndex].length; i++) {
//         console.log(proposal[choiceIndex][i]);
//         item[choices][i] = proposal[choiceIndex][i];
//       }
//       let votes = "Votes";
//       item[votes] = [];
//       choiceIndex = 1;
//       for (let i = 0; i < proposal[choiceIndex].length; i++) {
//         console.log(proposal[choiceIndex][i]);
//         item[choices][i] = proposal[choiceIndex][i];
//       }
//     }

//     setSelectedProposal(item);

//     setIsDetailsAvailable(true);
//     console.log("completed");
//   };


//   const onChangeIndex = async (e) => {
//     setSelectedIndex(e.target.value);
//   };
//   return (
//     <Layout>
//       <div className="flex justify-center min-h-screen w-full py-2">
//         <div className="w-88%">
//           <h2 className="text-2xl mb-6 text-center">Execute Proposal</h2>
//           <div className="flex justify-center">
//             <div className="h-16">
//               <select onChange={onChangeIndex}>
//                 <option>Select Proposal</option>
//                 {proposals.map((proposal, index) => (
//                   <option key={proposal.id} value={proposal.id}>
//                     {proposal.description}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 className="w-48  mx-3 bg-blue-500 text-white rounded hover:bg-blue-700"
//                 onClick={getVotingDetails}
//               >
//                 Get Voting Details
//               </button>
//             </div>
//           </div>
//           <div>
//             { selectedProposal != null && isDetailsAvailable &&(
//             <>
//             <table border="1" cellPadding="10">
//               <thead>
//                 {selectedProposal.choices.map((item) => (
//                   <tr
//                     key={item}
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   ></tr>
//                 ))}
//               </thead>
//               {/* <tbody className="bg-white divide-y divide-gray-200">
//                 {selectedProposal.map((row, rowIndex) => (
//                   <tr key={rowIndex}>
//                     {items.choices.map((col) => (
//                       <td key={col} className="px-6 py-4 whitespace-nowrap">
//                         {row[col]}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody> */}
//             </table>
//             </>
// )}
//           </div>
//           <div className="flex justify-center">
//             <button
//               className="w-32  m-3 bg-blue-500 text-white rounded hover:bg-blue-700"
//               onClick={handleExecuteProposal}
//             >
//               Execute
//             </button>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ExecuteProposal;
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
    votes: []
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

      // const proposals = await contractInstance.connect(signer).getProposals();
      // console.log("proposals" + proposals);
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

  const getProposal = async () => {
    console.log(index);
    const proposal = await contract.getProposalVotes(0);
    console.log(proposal);

    const item = {};
    if (proposal.length > 0) {
      let choices = "choices";
      item[choices] = [];
      let votes ="Votes";
      item[votes]=[];
      let choiceIndex = 0;
      for (let i = 0; i < proposal[choiceIndex].length; i++) {
        item[choices][i] = proposal[choiceIndex][i];
      }
      choiceIndex = 1;
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
      "Wallet will ask for two transaction Cofirmations. Please confirm two transactions 1) Vote and 2) Stake"
    );

    await contract.connect(signer).voteSingleChoice(0, selectedChoice);
    const amountValue = ethers.parseEther(amount);
    await contract.connect(signer).deposit({ value: amountValue });
  };

  const handleVoteMultipleChoice = async () => {
    if(selectedChoices.length <2)
    {
      alert("Minimum two choices should be selected for Multiple Choice");
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
      "Wallet will ask for two transaction Cofirmations. Please confirm two transactions 1) Vote and 2) Stake"
    );
    console.log("amount"+ amount);
    await contract
      .connect(signer)
      .voteMultipleChoice(1, selectedChoices);
    const amountValue = ethers.parseEther(amount);
    await contract.connect(signer).deposit({ value: amountValue });
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

export default ExecuteProposal;
