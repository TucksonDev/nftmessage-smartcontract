// Libraries
import hre from "hardhat";

// Library constants
const ethers = hre.ethers;

// Other useful constants
const etherscanBaseUrl = (hre.network.name == "rinkeby")?
    "https://rinkeby.etherscan.io" :
    "https://etherscan.io";


//////////
// Main //
//////////
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    // Getting account balance
    const deployerBalance = await deployer.getBalance();
    console.log("Account balance (ETH):", ethers.utils.formatEther(deployerBalance).toString());

    // Deploying contract
    const NFT = await ethers.getContractFactory("MessageNFT");
    const nft = await NFT.deploy();

    // Output information
    console.log("NFT address:", nft.address);
    console.log("Etherscan URL:", etherscanBaseUrl + "/address/" + nft.address);
}
  
main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  