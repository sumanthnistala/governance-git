"use client";
import React, { useState, useEffect } from "react";
import { BrowserProvider, ethers } from "ethers";
import Layout from "@/app/Layout/page";
import MyContractABI from "../../../../public/GovernanceDAO.json";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { ListboxWrapper } from "../../wrapper.js";
import { useRouter } from "next/navigation";

const CreateProposal = () => {
  const router = useRouter();
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [description, setDescription] = useState("");
  const [votingType, setVotingType] = useState("SingleChoice");
  const [choices, setChoices] = useState([""]);
  const [active, setActive] = useState(false);
  const [members, setMembers] = useState([]);
  const [signer, setSigner] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    const init = async () => {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const contractInstance = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        MyContractABI.abi,
        provider
      );
      setContract(contractInstance);
      setSigner(signer);
      const members = await contractInstance.connect(signer).getMembers();

      const items = [];
      const memberList = members.toString().split(",");
      console.log("memberList" + memberList);
      if (memberList.length > 0) {
        for (let i = 0; i < memberList.length; i++) {
          let item = {};
          let key = "key";
          item[key] = memberList[i];
          let value = "label";
          item[value] = memberList[i];
          items.push(item);
        }
        console.log(items);
        setMembers(items);
        console.log("enrolledMembers" + members);
      }
    };

    init();
  }, []);

  const onSelectChange = (e) => {
    setVotingType(e.target.value);
  };

  const handleAddChoice = () => {   
    if (votingType === "SingleChoice") {
    if (choices.length < 2) {
      setChoices([...choices, ""]);
    } else alert("Not more thant 2 value are given for Single Choice Type");
  }
  if (votingType === "MultipleChoice") {
    setChoices([...choices, ""]);
  }
  };

  const handleChange = (event) => {
    setDescription(event.target.value);
  };

  const handleChoiceChange = (index, value) => {
    const newChoices = choices.slice();
    newChoices[index] = value;
        setChoices(newChoices);
  };

  const handleSelectionChange = (value) => {
    setSelectedMembers((prevSelectedValues) =>
      prevSelectedValues.includes(value)
        ? prevSelectedValues.filter((v) => v !== value)
        : [...prevSelectedValues, value]
    );
  };

  const handleCreateProposal = async () => {
    alert(selectedMembers);
    if (votingType === "SingleChoice") {
      if (choices.length == 1) {
        alert("Single Choice should have two options (i.e., yes or no)");
        return;
      }
      if (choices.length > 2) {
        alert("Single Choice should not have more than two options");
        return;
      }
    } else if (votingType === "MultipleChoice") {
      if (choices.length == 1 || choices.length == 2) {
        alert(
          "Single Choice should have more than two options (i.e., yes or no)"
        );
        return;
      }
    }

    if (selectedMembers.length == 0) {
      alert("Atleast one member should be selected for adding proposal");
      return;
    }

    // const provider = new BrowserProvider(window.ethereum);
    // await provider.send("eth_requestAccounts", []);
    // const signer = await provider.getSigner();
    // const address = await signer.getAddress();
    // const contract = new ethers.Contract(
    //   process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    //   MyContractABI.abi,
    //   provider
    // );

    try {
      if (votingType === "SingleChoice") {
        await contract
          .connect(signer)
          .createSingleChoiceProposal(description, selectedMembers, choices);
      } else if (votingType === "MultipleChoice") {
        await contract
          .connect(signer)
          .createMultipleChoiceProposal(description, selectedMembers, choices);
      }

      alert(
        "Proposal added successfully!. Transaction completion takes time. Please check for changes after transaction completion."
      );

      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center min-h-screen w-full py-2">
        <div className="w-88%">
          <h2 className="text-2xl mb-6 text-center">Add Proposal to Members</h2>
          <div className="flex w-full h-48 m-3">
            <label className="w-1/3">Proposal Description:</label>
            <textarea
              cols={50}
              value={description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="flex h-50 w-25 h-50 m-3">
            <label className="w-1/3">Choices Type:</label>
            <select
              className="h-8"
              value={votingType}
              onChange={onSelectChange}
            >
              <option value="SingleChoice">Single Choice</option>
              <option value="MultipleChoice">Multiple Choice</option>
            </select>
            <button
              className="w-48 h-8 mx-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={handleAddChoice}
            >
              Add Choice
            </button>
          </div>
          <div className="flex h-50 w-25 h-50 m-3">
            <label className="w-1/3">Choices:</label>
            <div>
              {choices.map((choice, index) => (
                <div className="m-2">
                  <input
                    key={index}
                    type="text"
                    value={choice}
                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                    placeholder={`Choice ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex h-50 w-25 h-50 m-3">
            <label className="w-1/3">Add Members:</label>
            <div>
              {members.length > 0 && (
                <>
                  <span className="text-xs text-red-600">
                    **Select one by one and once. If you select second time it
                    will be deselected.
                  </span>
                  <ListboxWrapper>
                    <Listbox
                      selectionMode="Multiple"
                      onAction={handleSelectionChange}
                      className="bg-white min-h-80 w-fit border-solid rounded"
                      items={members}
                      aria-label="Dynamic Actions"
                    >
                      {(item) => (
                        <ListboxItem key={item.key} textValue={item.label}>
                          {item.label}
                        </ListboxItem>
                      )}
                    </Listbox>
                  </ListboxWrapper>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="w-60 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={handleCreateProposal}
            >
              Add Proposal
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProposal;
