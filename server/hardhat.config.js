require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path:__dirname+'/.env'});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks:
  {
    matic:
    {
      url: process.env.POLYGON_MATIC_URL,
      accounts:[process.env.PRIVATE_KEY]
    },
    localhost:
    {
      url: "http://127.0.0.1:7545",
      accounts:["0xf2c17b6c81d47dfd2b41ca99b5bfc217c27a8009ee112dd62e846b7e6d5f8a3f"]
    }
  }
};
