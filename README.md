"# governance-git" This project creates Governance DAO using Solidity and Next.js
Prerequisites
Make sure you have the following installed on your machine:

Node.js
npm (Node Package Manager)
Wallet like Metamask, WalletConnect

Clone the Repository

git clone https://github.com/sumanthnistala/governance-git.git
cd governance--git

## Compiling and Deploying contracts using Hardhat
cd server
npm install

update network URL and account private key in .env file
specify account and rpc url in networks section in hardhat.config.js
 networks:
  {
  matic:
    {
      url: process.env.POLYGON_MATIC_URL,
      accounts:[process.env.PRIVATE_KEY]
    },
  }

npx hardhat compile
npx hardhat ignition deploy ./ignition/modules/Lock.js --network matic

copy the compiled artifact content from artifacts/build-info and place it into client/public/GovernanceDAO.json file under abi section.
## Setting up client

 Go to client folder in the repository

 cd client
 npm install

 npm run dev

Admin has some specific functions like Add Members, Creating Proposal, Executing Proposal.
Members has specific functions like Voting.

We need to change accounts in the metamask accordingly.
