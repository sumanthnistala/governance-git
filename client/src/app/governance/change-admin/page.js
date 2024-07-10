"use client";
import { useState } from "react";
import { BrowserProvider, ethers } from "ethers";
import { useRouter } from "next/navigation";
import { getCookies, setCookie, deleteCookie, getCookie } from "cookies-next";
import MyContractABI from "../../../../public/GovernanceDAO.json";
import Layout from "@/app/Layout/page";


export default function ChangeAdmin() {
  const [account, setAccount] = useState(null);
  const router = useRouter();
  const [signer, setSigner] = useState();
  const [user, setUser]= useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        console.log(signer);
        const address = await signer.getAddress();
        setAccount(address);
        console.log(address);
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
        enrollUser();
        setCookie("accountaddress", address);
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    if (window.ethereum) {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = (chainId) => {
    console.log("Chain changed to", chainId);
  };

  const changeAdmin = async () => {
    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      MyContractABI.abi,
      provider
    );
    console.log("signer" + signer);
    const data = await contract.connect(signer).changeAdmin(address);
    console.log("Admin Changed");
    alert("Admin Changed successfully!. Transaction completion takes time. Please check for changes after transaction completion.");
  };

  return (
    <Layout>
       <div className="flex flex-col items-center justify-center min-h-80 py-2">
      <div className="bg-white p-6 rounded shadow-md text-black w-full max-w-md">
        <h6 className="text-xl mb-6 text-center">Change Admin</h6>
        <div className="flex flex-col items-center justify-center">
        <input className="m-3 h-12 w-80 bg-gray-100 rounded"
        type="text"
        placeholder="Enter User Address"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      <button  className="w-60 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={changeAdmin}>Change Admin</button>
      </div>
      </div>
    </div>
    </Layout>
  );
};
