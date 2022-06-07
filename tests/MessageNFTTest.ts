// Libraries
import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

// Library constants
chai.use(solidity);
const expect = chai.expect;

///////////
// TESTS //
///////////
describe ("MessageNFT Contract Tests", () => {
    // Constants to test against
    const tokenName = 'MessageNFT';
    const tokenSymbol = 'MNFT';
    const resourceTokenURI = 'ipfs://QmeKw5svB7aeRkYs2TuYBaKxCMbLM62GpiHqX5nzuMH88i';

    // Test vars
    let messageNFTContract: ContractFactory;
    let messageNFT: Contract;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let addr3: SignerWithAddress;
    let addrs: SignerWithAddress[];

    // `beforeEach` runs before each test, re-deploying the contract every time.
    beforeEach (async () => {
        // Get several accounts to test
        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

        // Get the ContractFactory
        messageNFTContract = await ethers.getContractFactory("MessageNFT");

        // Deploy it
        messageNFT = await messageNFTContract.deploy();
    });

    describe ("Deployment information", () => {
        /*
        it ("Should set the right owner", async () => {
            expect(await messageNFT.owner()).to.equal(owner.address);
        });
        */
    
        it ("Should have the right name and symbol", async () => {
            expect(await messageNFT.name()).to.equal(tokenName);
            expect(await messageNFT.symbol()).to.equal(tokenSymbol);
        });
    });

    describe ("Minting", () => {
        it ("Should allow anybody to mint an NFT for themselves and change its balance and ownership", async () => {
            await messageNFT.connect(addr1).mint(addr1.address, resourceTokenURI);
            const addr1Balance = await messageNFT.balanceOf(addr1.address);
            const tokenOwner = await messageNFT.ownerOf(1);
            expect(addr1Balance).to.equal(1);
            expect(tokenOwner).to.equal(addr1.address);
        });

        it ("Should allow anybody to mint an NFT for another user and change its balance and ownership", async () => {
            // addr1 is minting for addr2
            await messageNFT.connect(addr1).mint(addr2.address, resourceTokenURI);

            // Get all needed vars
            const addr1Balance = await messageNFT.balanceOf(addr1.address);
            const addr2Balance = await messageNFT.balanceOf(addr2.address);
            const tokenOwner = await messageNFT.ownerOf(1);

            // Checks
            expect(addr1Balance).to.equal(0);
            expect(addr2Balance).to.equal(1);
            expect(tokenOwner).to.equal(addr2.address);
        });

        it ("Should keep track of the minted supply", async () => {
            await messageNFT.connect(addr1).mint(addr1.address, resourceTokenURI);
            await messageNFT.connect(addr2).mint(addr2.address, resourceTokenURI);
            const totalSupply = await messageNFT.totalSupply();
            expect(totalSupply).to.equal(2);
        });
    });

    describe ("Transferring", () => {
        it ("Should allow anybody to transfer his NFT", async () => {
            const tokenId = 2;

            // Minting two NFTs
            await messageNFT.connect(addr1).mint(addr1.address, resourceTokenURI);
            await messageNFT.connect(addr1).mint(addr1.address, resourceTokenURI);

            // Checking ownership of token
            const tokenOwner1 = await messageNFT.ownerOf(tokenId);
            expect(tokenOwner1).to.equal(addr1.address);

            // Transferring token to addr2
            // To call safeTransferFrom, need to specify its signature
            // ( https://stackoverflow.com/questions/68289806/no-safetransferfrom-function-in-ethers-js-contract-instance )
            await messageNFT.connect(addr1)["safeTransferFrom(address,address,uint256)"](addr1.address, addr2.address, tokenId);
            const tokenOwner2 = await messageNFT.ownerOf(tokenId);
            expect(tokenOwner2).to.equal(addr2.address);
        });

        it ("Should FAIL if somebody transfers a non-owned NFT", async () => {
            const tokenId = 2;

            // Minting two NFTs
            await messageNFT.connect(addr1).mint(addr1.address, resourceTokenURI);
            await messageNFT.connect(addr2).mint(addr2.address, resourceTokenURI);

            // Trying to transfer tokenId from addr1 (non owner)
            await expect(
                messageNFT.connect(addr1)["safeTransferFrom(address,address,uint256)"](addr1.address, addr3.address, tokenId)
            ).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
        });
    });

    describe ("Burning", () => {
        it ("Should allow anybody to burn their NFT and change its balance and ownership", async () => {
            const tokenId = 1;

            // Minting a token
            await messageNFT.connect(addr1).mint(addr1.address, resourceTokenURI);

            // Balance and ownership 1
            const addr1Balance1 = await messageNFT.balanceOf(addr1.address);
            const tokenOwner1 = await messageNFT.ownerOf(tokenId);

            // First test
            expect(addr1Balance1).to.equal(1);
            expect(tokenOwner1).to.equal(addr1.address);

            // Burning the token
            await messageNFT.connect(addr1).burn(tokenId);

            // Test nalance
            const addr1Balance2 = await messageNFT.balanceOf(addr1.address);
            expect(addr1Balance2).to.equal(0);

            // Check for non existent token
            await expect(
                messageNFT.ownerOf(tokenId)
            ).to.be.revertedWith("ERC721: owner query for nonexistent token");
        });

        it ("Should FAIL if somebody burnes a non-owned NFT", async () => {
            const tokenId = 2;

            // Minting two NFTs
            await messageNFT.connect(addr1).mint(addr1.address, resourceTokenURI);
            await messageNFT.connect(addr2).mint(addr2.address, resourceTokenURI);

            // Trying to burn tokenId from addr1 (non owner)
            await expect(
                messageNFT.connect(addr1).burn(tokenId)
            ).to.be.revertedWith("ERC721: caller is not owner nor approved");
        });

        it ("Should keep track of the available supply", async () => {
            // Minting
            await messageNFT.connect(addr1).mint(addr1.address, resourceTokenURI);
            await messageNFT.connect(addr2).mint(addr2.address, resourceTokenURI);

            // Check balance 1
            const totalSupply1 = await messageNFT.totalSupply();
            expect(totalSupply1).to.equal(2);

            // Burn
            await messageNFT.connect(addr1).burn(1);

            // Check balance 2
            const totalSupply2 = await messageNFT.totalSupply();
            expect(totalSupply2).to.equal(1);
        });

        it ("Should use the correct token ID after burning the latest token", async () => {
            // Minting
            await messageNFT.connect(addr1).mint(addr1.address, resourceTokenURI);
            await messageNFT.connect(addr2).mint(addr2.address, resourceTokenURI);

            // Burn the latest token (id = 2)
            await messageNFT.connect(addr2).burn(2);

            // Mint a new one
            await messageNFT.connect(addr1).mint(addr1.address, resourceTokenURI);

            // Token ID should be 3
            const tokenOwner = await messageNFT.ownerOf(3);
            expect(tokenOwner).to.equal(addr1.address);

            // And totalSupply should be 2
            const totalSupply = await messageNFT.totalSupply();
            expect(totalSupply).to.equal(2);
        });
    });
});