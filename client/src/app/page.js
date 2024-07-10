"use client";
import { useState,useEffect } from "react";
import { BrowserProvider, ethers } from "ethers";
import { useRouter } from "next/navigation";
import { getCookies, setCookie, deleteCookie, getCookie } from "cookies-next";
import MyContractABI from "../../public/GovernanceDAO.json";

export default function Login() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider]= useState(null);
  const router = useRouter();
  const [signer, setSigner] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [contract, setContract] = useState(null);
  useEffect(() => {
    const init = async () => {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      setProvider(provider);
      const signer = await provider.getSigner();
      setSigner(signer);
      const address = await signer.getAddress();
      const contractInstance = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        MyContractABI.abi,
        provider
      );
      setContract(contractInstance);
      const admin = await contractInstance.connect(signer).admin.call();
      if (address == admin) {
        setIsAdmin(true);
      } else setIsAdmin(false);
    };

    init();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // const provider = new BrowserProvider(window.ethereum);
        // await provider.send("eth_requestAccounts", []);
        // const signer = await provider.getSigner();
        // console.log(signer);
        // const address = await signer.getAddress();
        //setAccount(address);
        enrollUser();
        //setCookie("accountaddress", address);
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
if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount(null);
      }
  };

  const handleChainChanged = (chainId) => {
    console.log("Chain changed to", chainId);
  };

  const enrollUser = async () => {
    console.log("isAdmin"+isAdmin);
    if (!isAdmin) {
      // const provider = new BrowserProvider(window.ethereum);
      // await provider.send("eth_requestAccounts", []);
      // const signer = await provider.getSigner();
      // const address = await signer.getAddress();
      // const contract = new ethers.Contract(
      //   process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      //   MyContractABI.abi,
      //   provider
      // );
      // console.log("signer" + signer);
      const data = await contract.connect(signer).enrollMember(address);
      console.log("User Enrolled");
      alert(
        "User enrolled successfully!. Transaction completion takes time. Please check for changes after transaction completion."
      );
      router.push("/navigation", { scroll: false });
    } else router.push("/navigation", { scroll: false });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="bg-white p-6 rounded shadow-md text-black w-full max-w-md">
        <h2 className="text-2xl mb-6 text-center">Login</h2>
        {account ? (
          <div className="text-center">
            <p>Connected Account:</p>
            <p className="text-lg font-mono">{account}</p>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
