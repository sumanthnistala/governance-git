import { BrowserProvider, ethers } from 'ethers';
import MyContractABI from '../../public/GovernanceDAO.json';

export const getContract = (signer) => {
  const contractAddress = '0x0C6aE77935B0b7bE22624EaE4d38DD420a172474';
  const contract = new ethers.Contract(contractAddress, MyContractABI.abi, signer);
  return contract;
};