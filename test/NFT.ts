import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("NFT contract", () => {
  let nft: Contract;
  let nftContractAddress: any;
  let tokenId: number;

  beforeEach('Setup Contract', async () => {
      const EternalNFT = await ethers.getContractFactory('NFT');
      nft = await EternalNFT.deploy();
      await nft.deployed();
      nftContractAddress = nft.address;
  })

  it('Should have an address', () => {
    expect(nftContractAddress).not.to.be.equal(0x0);
    expect(nftContractAddress).not.to.be.equal('');
    expect(nftContractAddress).not.to.be.equal(null);
    expect(nftContractAddress).not.to.be.equal(undefined);
  });

  it('Should be able to mint NFT', async () => {
    const [owner] = await ethers.getSigners();

    const txn = await nft.mint(owner.address, 1, 'test');
    const tx = await txn.wait();

    const event = tx.events[0];
    const value = event.args[2];
    tokenId = value.toNumber();

    expect(tokenId).to.be.equal(1);
  });
});
