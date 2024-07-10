"use client";
import { useState } from "react";
import { BrowserProvider } from "ethers";

export default function Logout() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  const disconnectWallet = () => {
    setAccount(null);
    console.log("Account is null");
    if (window.ethereum) {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User has disconnected their account from MetaMask
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = (chainId) => {
    // Optional: Handle chain changes if necessary
    console.log("Chain changed to", chainId);
  };

  return (
    <div>
      <button onClick={disconnectWallet}>Disconnect Wallet</button>
    </div>
  );
}
