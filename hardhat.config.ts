/**
 * @type import('hardhat/config').HardhatUserConfig
 */
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";

// Load dotenv configuration
require("dotenv").config();
 
module.exports = {
  // Etherscan keys
  etherscan: {
    apiKey: {
      rinkeby: process.env.ETHERSCAN_RINKEBY_API_KEY,
      mainnet: process.env.ETHERSCAN_MAINNET_API_KEY,
    }
  },

  // Nodes
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/" + process.env.ALCHEMY_RINKEBY_KEY,
      accounts: [process.env.RINKEBY_PRIVATE_KEY],

      // Use these if network is volatile and want to make sure your txn goes through
      // https://hardhat.org/config/
      // gas, gasPrice, ... are measured in "wei" (without 'g')
      gasPrice: 5000000000, // 5 gwei
    },
    mainnet: {
      url: "https://eth-mainnet.alchemyapi.io/v2/" + process.env.ALCHEMY_MAINNET_KEY,
      accounts: [process.env.MAINNET_PRIVATE_KEY],

      // Use these if network is volatile and want to make sure your txn goes through
      // https://hardhat.org/config/
      // gas, gasPrice, ... are measured in "wei" (without 'g')
      gasPrice: 25000000000,  // 25 gwei
    },
  },

  // Compiler options
  solidity: {
    version: "0.8.1",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
};
