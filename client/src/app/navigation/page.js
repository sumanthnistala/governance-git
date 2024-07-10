"use client";
import Link from "next/link";
import Dropdown from "../dropdown/page.js";
import MemberDropdown from "../member-dropdown/page.js"
import MyContractABI from "../../../public/GovernanceDAO.json";
import { BrowserProvider,ethers } from "ethers";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contract, setContract] = useState(null);
  const [isAccountChanged, setAccountChanged]=useState(true);
  const router = useRouter();
  useEffect(() => {
    const init = async () => {
      const provider = new BrowserProvider(window.ethereum);
      //await provider.send("eth_requestAccounts", []);
      const accounts = await provider.listAccounts();
      window.addEventListener('beforeunload', removeEventListener);
      window.addEventListener('load', addEventListener);
      if (accounts.length > 0) {
        setAccount(accounts[0].address);
      }
      setProvider(provider);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const contractInstance = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        MyContractABI.abi,
        provider
      );
      setContract(contractInstance);
      const admin = await contractInstance.connect(signer).admin.call();

      if(address == admin)
      {
        setIsAdmin(true);
      }
      else setIsAdmin(false);
    };

    init();

  }, [isAccountChanged]);
  const checkIfAccountChanged = async () => {
    try {
      const {ethereum} = window;
      ethereum.on("accountsChanged", (accounts) => {
        console.log("Account changed to:", accounts[0]);
        setCurrentAccount(accounts[0]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  function addEventListener() {
    if(isAccountChanged)
    {
    console.log("coming here");
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    setAccountChanged(false);
    }
  }
  function removeEventListener() {
    console.log("coming here");
    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
  }
  const disconnectWallet = () => {
    console.log("todisconnect");
    removeEventListener();
    setAccount(null);
    // if (window.ethereum) {
    //   handleAccountsChanged();
    // }
    router.push("/", { scroll: false });
  };

  const handleAccountsChanged = (accounts) => {
    console.log("account changed");
    if (accounts.length > 0) {
      console.log("account changed"+accounts[0]);
      setAccount(accounts[0]);
    } else {
      setAccount(null);
    }
  };


  const handleChainChanged = (chainId) => {
    console.log("Chain changed to", chainId);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-lg">Governance</div>
        <div className="space-x-4">
          {isAdmin && <Dropdown /> }
          {!isAdmin && <MemberDropdown />}
          <MemberDropdown></MemberDropdown>
          <button onClick={disconnectWallet} className="bg-white text-black-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded">Disconnect Wallet</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
