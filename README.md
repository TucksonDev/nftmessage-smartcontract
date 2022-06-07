# Smartcontract support to send messages in NFTs
This smartcontract serves as support for a functionality for sending messages in NFTs.

It is a basic NFT contract that allows free minting from any user (excluding gas) and expects a full URL to be specified as a token URI when minting.

This is part of an ongoing project to offer an interface from where to create an image with a message to be later sent to the recipient of the NFT by using this contract.

# Some specifications
- The contract uses the standard openzeppelin ERC721URIStorage contract as its foundation.
- A supply variable is added to keep track of the current supply. The _tokenIds map is not enough by itself, because that is needed to keep track of the current index to use when minting a new NFT.
- Standard minting and burning functions have been added to the contract.
- A series of tests is available that mostly just checks for regular actions in any NFT. These can be used in almost any standard NFT, with the exception of the "burning" tests, and the ones that checks for supply.
- All scripts are written in Typescript. Support libraries for Typescript are already in package.json

# CLI instructions
- `npm install` : To install all dependencies
- `npx hardhat compile` : To compile the contract
- `npx hardhat test ./tests/MessageNFTTest.ts` : To run the tests
- `npx hardhat run ./scripts/deploy.ts --network [rinkeby|mainnet]` : To run the deploy script
- `npx hardhat verify <ContractAddress> --network [rinkeby|mainnet]` : To initiate the verification process for Etherscan

# Gas information
- Deploying the contract costs 1,544,796 gas units
- Minting 1 NFT costs around 130,648 - 181,948 gas units
- Transferring 1 NFT costs around 43,574 - 60,674 gas units
- Burning 1 NFT costs around 48,328 gas units

# Example of deployed contract
- Rinkeby: https://rinkeby.etherscan.io/address/0x4904a5D49DD25e68e89dd9654C757a05bD1790Ff

# Dependencies
- Libraries are specified in package.json
- Hardhat is used to compile, test and run scripts: https://hardhat.org/
- Alchemy is used for configuring the ETH node to go through: https://www.alchemy.com/