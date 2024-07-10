"use client";
import React, { useState, useEffect } from "react";
import { BrowserProvider, ethers } from "ethers";
import MyContractABI from "../../../../public/GovernanceDAO.json";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { ListboxWrapper } from "../../wrapper.js";
import Layout from "@/app/Layout/page";
import { useRouter } from 'next/navigation';

const AddMember = () => {
  const router = useRouter();
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [memberAddress, setMemberAddress] = useState("");
  const [enrolledMembers, setEnrolledMembers] = useState([]);
  const [selectedValue, setSelectedValue] = useState();

  useEffect(() => {
    const init = async () => {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      const contractInstance = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        MyContractABI.abi,
        provider
      );
      setContract(contractInstance);
      setSigner(signer);
      setProvider(provider);
      const members = await contractInstance
        .connect(signer)
        .getEnrolledMembers();

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
      setEnrolledMembers(items);
    }
    };

    init();
  }, []);

  const handleSelectionChange = (value) => {
    console.log("value" + value);
    setSelectedValue(value);
  };

  const handleAddMember = async () => {
    try 
    {
      // console.log("memb" + selectedValue);
      alert("Member Selected");
      await contract.connect(signer).addMember(selectedValue);
      alert("Member added successfully!. Transaction completion takes time. Please check for changes after transaction completion.");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to add member.");
    }
  };

  return (
    <Layout>
      <div className="flex justify-center min-h-screen w-full py-2">
        <div className="bg-grey p-6 rounded shadow-md text-black w-2/3 ">
          <h2 className="text-2xl mb-6 text-center">Add Members</h2>
          <div className="flex items-center justify-center">
            <div>
            <span className="text-xs text-red-600">
                    **Only one member can be added at a time.
                  </span>
                  <div></div>
              <label>Select Enrolled Members</label>

             {enrolledMembers.length>0  &&(
              <>
              <ListboxWrapper>
                <Listbox
                  onAction={handleSelectionChange}
                   className="bg-white min-h-80 w-fit border-solid rounded"
                  items={enrolledMembers}
                  aria-label="Dynamic Actions"
                >
                  {(item) => (
                    <ListboxItem key={item.key} textValue={item.label}>
                      {item.label}
                    </ListboxItem>
                  )}
                </Listbox>
              </ListboxWrapper>
                  <div className="flex justify-center">

              <button
                className="w-80 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                onClick={handleAddMember}
              >
                Add Member
              </button>
              </div>
              </>
              )}

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddMember;
