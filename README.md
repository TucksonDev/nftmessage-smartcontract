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
- `npx hardhat compile`: To compile the contract
- `npx hardhat test ./tests/MessageNFTTest.ts`: To run the tests
- `npx hardhat run ./scripts/deploy.ts --network [rinkeby|mainnet]`: To run the deploy script

# Dependencies
- Libraries are specified in package.json
- Hardhat is used to compile, test and run scripts: https://hardhat.org/
- Alchemy is used for configuring the ETH node to go through: https://www.alchemy.com/