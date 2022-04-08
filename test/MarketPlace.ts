import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("MarketPlace contract", () => {
  let nft: Contract;
  let marketPlace: Contract;
  let nftContractAddress: any;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  const LISTING_FEE = '25000000000000000';

  beforeEach('Setup Contracts', async () => {
      const EternalNFT = await ethers.getContractFactory('NFT');
      nft = await EternalNFT.deploy();
      await nft.deployed();
      nftContractAddress = nft.address;

      const NFTMarketplace = await ethers.getContractFactory("MarketPlace");
      marketPlace = await NFTMarketplace.deploy(nftContractAddress);
      await marketPlace.deployed();

    [owner, addr1] = await ethers.getSigners();
  });

  describe('Listing Fee', async () => {
    it('Should be able to get the listing fee', async () => {
      const listingFeeTxn = await marketPlace.connect(owner).getListingFee();
      expect(listingFeeTxn).to.be.equal(LISTING_FEE);
    });

    it('Should be able get the total collected listing fee', async () => {
      const collectionTxn = await marketPlace.connect(owner).createCollection('image1', 'name2', 'description1');
      const collectionTx = await collectionTxn.wait();
      const collectionId = collectionTx.events[0].args.collectionId.toNumber();

      const tokenTxn = await marketPlace.connect(owner).mintToken('tokenURI', 'name', 'description', collectionId);
      const tokenTx = await tokenTxn.wait();
      const tokenId = tokenTx.events[1].args.tokenId.toNumber();

      const listingFee = await marketPlace.connect(owner).getListingFee();

      const saleTxn = await marketPlace.connect(owner).createSale(tokenId, 10, { value: listingFee });
      await saleTxn.wait();

      const collectedListingFeeTxn = await marketPlace.connect(owner).getCollectedListingFee();

      expect(collectedListingFeeTxn).to.be.equal(LISTING_FEE);
    });

    it('Should be able to transfer the collected listing fee', async () => {
      const collectionTxn = await marketPlace.connect(owner).createCollection('image1', 'name2', 'description1');
      const collectionTx = await collectionTxn.wait();
      const collectionId = collectionTx.events[0].args.collectionId.toNumber();

      const tokenTxn = await marketPlace.connect(owner).mintToken('tokenURI', 'name', 'description', collectionId);
      const tokenTx = await tokenTxn.wait();
      const tokenId = tokenTx.events[1].args.tokenId.toNumber();

      const listingFee = await marketPlace.connect(owner).getListingFee();

      const saleTxn = await marketPlace.connect(owner).createSale(tokenId, 10, { value: listingFee });
      await saleTxn.wait();

      const transferListingFeeTxn = await marketPlace.connect(owner).transferListingFee();
      await transferListingFeeTxn.wait();

      const collectedListingFeeTxn = await marketPlace.connect(owner).getCollectedListingFee();

      expect(collectedListingFeeTxn).to.be.equal(0);
    });
  });

  describe('Creator info', async () => {
    it('Should be able to change creator\'s name', async () => {
      const changeNameTxn = await marketPlace.connect(owner).changeCreatorName('new name');
      const changeNameTx = await changeNameTxn.wait();
      const newName = changeNameTx.events[0].args.name;

      expect(newName).to.be.equal('new name');
    });

    it('Should be able to change creator\'s image', async () => {
      const changeImageTxn = await marketPlace.connect(owner).changeCreatorImage('new image');
      const changeImageTx = await changeImageTxn.wait();
      const newImage = changeImageTx.events[0].args.image;

      expect(newImage).to.be.equal('new image');
    });
  });

  describe('Creating collection', async () => {
    it('Should be able to create collection', async () => {
      const txn = await marketPlace.connect(owner).createCollection('image', 'name', 'description');
      const tokenTx = await txn.wait();
      const collectionId = tokenTx.events[0].args.collectionId.toNumber();

      expect(collectionId).to.be.equal(1);
    });

    it('Should be able get collections total length', async () => {
      const txn = await marketPlace.connect(owner).createCollection('image', 'name', 'description');
      await txn.wait();

      const length = await marketPlace.connect(owner).getCollectionLength();

      expect(length).to.be.equal(1);
    });
  });

  describe('Minting NFT', () => {
    it('Should be able to mint a new token', async () => {
      const collectionTxn = await marketPlace.connect(owner).createCollection('image1', 'name2', 'description1');
      const collectionTx = await collectionTxn.wait();
      const collectionId = collectionTx.events[0].args.collectionId.toNumber();

      const tokenTxn = await marketPlace.connect(owner).mintToken('tokenURI', 'name', 'description', collectionId);
      const tokenTx = await tokenTxn.wait();
      const tokenId = tokenTx.events[1].args.tokenId.toNumber();

      expect(tokenId).to.be.equal(1);
    });

    it('Should be able get items total length', async () => {
      const collectionTxn = await marketPlace.connect(owner).createCollection('image1', 'name2', 'description1');
      const collectionTx = await collectionTxn.wait();
      const collectionId = collectionTx.events[0].args.collectionId.toNumber();

      const txn1 = await marketPlace.connect(owner).mintToken('tokenURI', 'name', 'description', collectionId);
      await txn1.wait();

      const length = await marketPlace.connect(owner).getMarketItemsLength();

      expect(length).to.be.equal(1);
    });
  });

  describe('Market Sale', () => {
    it('Should be able to create market sale', async () => {
      const collectionTxn = await marketPlace.connect(owner).createCollection('image1', 'name2', 'description1');
      const collectionTx = await collectionTxn.wait();
      const collectionId = collectionTx.events[0].args.collectionId.toNumber();

      const tokenTxn = await marketPlace.connect(owner).mintToken('tokenURI', 'name', 'description', collectionId);
      const tokenTx = await tokenTxn.wait();
      const tokenId = tokenTx.events[1].args.tokenId.toNumber();

      const listingFee = await marketPlace.connect(owner).getListingFee();

      const saleTxn = await marketPlace.connect(owner).createSale(tokenId, 10, { value: listingFee });
      const saleTx = await saleTxn.wait();
      const tokenPrice = saleTx.events[0].args.price;

      expect(tokenPrice).to.be.equal(10);
    });

    it('Should be able to cancel market sale', async () => {
      const collectionTxn = await marketPlace.connect(owner).createCollection('image1', 'name2', 'description1');
      const collectionTx = await collectionTxn.wait();
      const collectionId = collectionTx.events[0].args.collectionId.toNumber();

      const tokenTxn = await marketPlace.connect(owner).mintToken('tokenURI', 'name', 'description', collectionId);
      const tokenTx = await tokenTxn.wait();
      const tokenId = tokenTx.events[1].args.tokenId.toNumber();

      const listingFee = await marketPlace.connect(owner).getListingFee();

      const saleTxn = await marketPlace.connect(owner).createSale(tokenId, 10, { value: listingFee });
      await saleTxn.wait();

      const cancelSaleTxn = await marketPlace.connect(owner).cancelSale(tokenId);
      await cancelSaleTxn.wait();

      const token = await marketPlace.connect(owner).marketItems(1);

      expect(token.status).to.be.equal(1);
    });

    it('Should be able to buy market item', async () => {
      const collectionTxn = await marketPlace.connect(owner).createCollection('image1', 'name2', 'description1');
      const collectionTx = await collectionTxn.wait();
      const collectionId = collectionTx.events[0].args.collectionId.toNumber();

      const tokenTxn = await marketPlace.connect(owner).mintToken('tokenURI', 'name', 'description', collectionId);
      const tokenTx = await tokenTxn.wait();
      const tokenId = tokenTx.events[1].args.tokenId.toNumber();

      const listingFee = await marketPlace.connect(owner).getListingFee();

      const saleTxn = await marketPlace.connect(owner).createSale(tokenId, 10, { value: listingFee });
      const saleTx = await saleTxn.wait();
      const tokenPrice = saleTx.events[0].args.price;

      const approveTxn = await nft.connect(owner).approve(marketPlace.address, tokenId);
      await approveTxn.wait();

      const buyTxn = await marketPlace.connect(addr1).buyMarketItem(tokenId, { value: tokenPrice });
      await buyTxn.wait();

      const newOwner = await nft.ownerOf(tokenId);

      expect(newOwner).to.be.equal(addr1.address);
    });
  });

  describe('Bid on items', () => {
    it('Should be able to bid on market item', async () => {
      const collectionTxn = await marketPlace.connect(owner).createCollection('image1', 'name2', 'description1');
      const collectionTx = await collectionTxn.wait();
      const collectionId = collectionTx.events[0].args.collectionId.toNumber();

      const tokenTxn = await marketPlace.connect(owner).mintToken('tokenURI', 'name', 'description', collectionId);
      const tokenTx = await tokenTxn.wait();
      const tokenId = tokenTx.events[1].args.tokenId.toNumber();

      const bidTxn = await marketPlace.connect(addr1).bidMarketItem(tokenId, { value: 1000 });
      const bidTx = await bidTxn.wait();
      const bidder = bidTx.events[0].args.bidder;

      expect(bidder).to.be.equal(addr1.address);
    });

    it('Should be able get bids total length', async () => {
      const collectionTxn = await marketPlace.connect(owner).createCollection('image1', 'name2', 'description1');
      const collectionTx = await collectionTxn.wait();
      const collectionId = collectionTx.events[0].args.collectionId.toNumber();

      const tokenTxn = await marketPlace.connect(owner).mintToken('tokenURI', 'name', 'description', collectionId);
      const tokenTx = await tokenTxn.wait();
      const tokenId = tokenTx.events[1].args.tokenId.toNumber();

      const bidTxn = await marketPlace.connect(addr1).bidMarketItem(tokenId, { value: 1000 });
      await bidTxn.wait();

      const length = await marketPlace.connect(owner).getItemBidsLength();

      expect(length).to.be.equal(1);
    });

    it('Should be able to accept bid on market item', async () => {
      const collectionTxn = await marketPlace.connect(owner).createCollection('image1', 'name2', 'description1');
      const collectionTx = await collectionTxn.wait();
      const collectionId = collectionTx.events[0].args.collectionId.toNumber();

      const tokenTxn = await marketPlace.connect(owner).mintToken('tokenURI', 'name', 'description', collectionId);
      const tokenTx = await tokenTxn.wait();
      const tokenId = tokenTx.events[1].args.tokenId.toNumber();

      const bidTxn = await marketPlace.connect(addr1).bidMarketItem(tokenId, { value: 1000 });
      const bidTx = await bidTxn.wait();
      const bidId = bidTx.events[0].args.bidId.toNumber();

      const approveTxn = await nft.connect(owner).approve(marketPlace.address, tokenId);
      await approveTxn.wait();

      const acceptTxn = await marketPlace.connect(owner).acceptBid(tokenId, bidId);
      await acceptTxn.wait();

      const newOwner = await nft.ownerOf(tokenId);

      expect(newOwner).to.be.equal(addr1.address);
    });

    it('Should be able to reject bid on market item', async () => {
      const collectionTxn = await marketPlace.connect(owner).createCollection('image1', 'name2', 'description1');
      const collectionTx = await collectionTxn.wait();
      const collectionId = collectionTx.events[0].args.collectionId.toNumber();

      const tokenTxn = await marketPlace.connect(owner).mintToken('tokenURI', 'name', 'description', collectionId);
      const tokenTx = await tokenTxn.wait();
      const tokenId = tokenTx.events[1].args.tokenId.toNumber();

      const bidTxn = await marketPlace.connect(addr1).bidMarketItem(tokenId, { value: 1000 });
      const bidTx = await bidTxn.wait();
      const bidId = bidTx.events[0].args.bidId.toNumber();

      const rejectTxn = await marketPlace.connect(owner).rejectBid(tokenId, bidId);
      await rejectTxn.wait();

      const lastOwner = await nft.ownerOf(tokenId);

      expect(lastOwner).to.be.equal(owner.address);
    });
  });
});
