// tslint:disable: no-empty
import { ethers } from 'ethers';

import marketItemABI from '../artifacts/contracts/NFT.sol/NFT.json';
import marketPlaceABI from '../artifacts/contracts/MarketPlace.sol/MarketPlace.json';
import axios from 'axios';

const zeroAddress = '0x0000000000000000000000000000000000000000';

export enum TokenStatus {
  "ForSale",
  "Idle"
}

export enum BidStatus {
  "Accepted",
  "Rejected",
  "Idle"
}

export interface ICreator {
  name: string;
  image: string;
}

export interface ICollection {
  collectionId: number;
  name: string;
  description: string;
  creator: string;
  image: string;
}

export interface IBid {
  bidId: number;
  amount: string;
  status: BidStatus;
  bidder: string;
}

interface IFetchedToken {
  tokenId: number;
  name: string;
  description: string;
  price: number;
  collectionId: number;
  status: TokenStatus;
}

export interface IToken extends IFetchedToken{
  image: string;
  creator: string;
  collectionName?: string;
}

class ContractsSDK {
  public marketPlace: ethers.Contract;
  public marketItem: ethers.Contract;
  public userAddress: string;

  constructor(signer: ethers.Signer, userAddress: string) {
    this.userAddress = userAddress;

    this.marketItem =  new ethers.Contract(
      '0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf',
      marketItemABI.abi,
      signer
    );

    this.marketPlace =  new ethers.Contract(
      '0x9d4454B023096f34B160D6B654540c56A1F81688',
      marketPlaceABI.abi,
      signer
    );
  }

  public async onChangeCreatorName(creatorAddress: string, name: string) {
    const transanction = await this.marketPlace.changeCreatorName(creatorAddress, name);
    transanction.wait();
  }

  public async onChangeCreatorImage(creatorAddress: string, image: string) {
    const transanction = await this.marketPlace.changeCreatorImage(creatorAddress, image);
    transanction.wait();
  }

  public async onGetCreatorInfo(creatorAddress: string) {
    const { name, image }: ICreator = await this.marketPlace.creatorsInfo(creatorAddress);

    return {
      name,
      image
    }
  }

  public async getCollections() {
    const collectionLength = Number((await this.marketPlace.getCollectionLength()).toString());
    const collectionIds: ICollection[] = [];

    for (let i = 1; i <= collectionLength; i++) {
      const collection = this.marketPlace.collections(i);
      collectionIds.push(collection);
    };

    const result = await Promise.all(collectionIds).then(collections => (
      collections.map(({ collectionId, name, description, creator, image }): ICollection => ({
        collectionId: Number(collectionId.toString()),
        name,
        description,
        creator,
        image
      }))
    ));

    return result;
  }

  public async getCollection(id: number) {
    const { collectionId, name, description, creator, image }: ICollection = await this.marketPlace.collections(id);
    return {
      collectionId: Number(collectionId.toString()),
      name,
      description,
      creator,
      image
    }
  }

  public async getUserCollections(userAddress: string) {
    const collections: ICollection[] = await this.getCollections();
    return collections.filter(({ creator }) => creator === userAddress);
  }

  public async createCollection(image: string, name: string, description: string) {
    const collectionCreation = await this.marketPlace.createCollection(image, name, description);
    await collectionCreation.wait();
  }

  public async getNFTs() {
    const nftItemsLength = Number((await this.marketPlace.getMarketItemsLength()).toString());
    const nftItemsIds: IFetchedToken[] = [];

    for (let i = 1; i <= nftItemsLength; i++) {
      const nftItem: IFetchedToken = this.marketPlace.marketItems(i);
      nftItemsIds.push(nftItem);
    };

    const result = Promise.all(nftItemsIds).then((nftItems) => {
      return Promise.all(nftItems.map(async ({ tokenId, name, description, price, collectionId, status }): Promise<IToken> => {
        const tokenUri = await this.marketItem.tokenURI(tokenId)
        const meta = await axios.get(tokenUri);
        const parsedPrice = ethers.utils.formatUnits(price.toString(), 'ether');

        return {
          tokenId: Number(tokenId.toString()),
          name,
          description,
          price: +parsedPrice,
          collectionId: Number(collectionId.toString()),
          status,
          creator: await this.marketItem.ownerOf(tokenId),
          image: meta.data.image
        }
      }))
    });

    return result;
  }

  public async getCollectionNFTs(collectionId: number) {
    const nfts = await this.getNFTs();
    return nfts.filter(nft => nft.collectionId === collectionId);
  }

  public async getUserNFTs(userAddress: string) {
    const nfts = await this.getNFTs();
    return nfts.filter(nft => nft.creator === userAddress);
  }

  public async getNFTItem(tokenId: number) {
    const { name, description, price, collectionId, status }: IToken = await this.marketPlace.marketItems(tokenId);
    const parsedPrice = ethers.utils.formatUnits(price.toString(), 'ether');
    const tokenUri = await this.marketItem.tokenURI(tokenId)
    const meta = await axios.get(tokenUri);
    const { name: collectionName } = await this.marketPlace.collections(collectionId);

    return {
      tokenId: Number(tokenId.toString()),
      name,
      description,
      price: +parsedPrice,
      collectionId: Number(collectionId.toString()),
      status,
      creator: await this.marketItem.ownerOf(tokenId),
      image: meta.data.image,
      collectionName
    }
  }

  public async createNFTItem(tokenURI: string, name: string, description: string, collectionId: number) {
    const tokenId = await this.marketPlace.mintToken(tokenURI, name, description, collectionId);
    await tokenId.wait();
  }

  public async onCreateSale(tokenId: number, price: number) {
    const isMarketApproved = await this.marketItem.getApproved(tokenId) === this.marketPlace.address;
    if (!isMarketApproved) {
      await this.marketItem.approve(this.marketPlace.address, tokenId);
    }

    const listingFee = (await this.marketPlace.getListingFee()).toString();
    const parsedPrice = ethers.utils.parseEther(price.toString());

    const transaction = await this.marketPlace.createSale(tokenId, parsedPrice, { value: listingFee });
    await transaction.wait();
  }

  public async onCancelSale(tokenId: string) {
    await this.marketItem.approve(zeroAddress, tokenId);

    const transaction = await this.marketPlace.cancelSale(tokenId);
    transaction.wait();
  }

  public async onBuyMarketItem(tokenId: string) {
    const price = (await this.marketPlace.marketItems(tokenId)).price;
    const transaction = await this.marketPlace.buyMarketItem(tokenId, { value: price });
    transaction.wait();
  }

  public async onGetItemOffers(tokenId: string) {
    const bidsLength = Number((await this.marketPlace.getItemBidsLength()).toString());
    const bidsIds: IBid[] = [];

    for (let i = 1; i <= bidsLength; i++) {
      const bid = await this.marketPlace.itemBids(tokenId, i);
      bidsIds.push(bid);
    };

    const result = await Promise.all(bidsIds).then(bids => (
      bids.map(({ bidId, amount, status, bidder }): IBid => ({
        bidId: Number(bidId.toString()),
        amount: ethers.utils.formatUnits(amount.toString(), 'ether'),
        status,
        bidder
      }))
    ));

    return result;
  }

  public async onBidOnItem(tokenId: number, amount: string) {
    const parsedPrice = ethers.utils.parseEther(amount);
    const transaction = await this.marketPlace.bidMarketItem(tokenId, { value: parsedPrice });
    transaction.wait();
  }

  public async onAcceptBid(tokenId: number, bidId: number) {
    const isMarketApproved = await this.marketItem.getApproved(tokenId) === this.marketPlace.address;
    if (!isMarketApproved) {
      await this.marketItem.approve(this.marketPlace.address, tokenId);
    }

    const transaction = await this.marketPlace.acceptBid(tokenId, bidId);
    transaction.wait();
  }

  public async onCancelBid(tokenId: number, bidId: number) {
    const transaction = await this.marketPlace.cancelBid(tokenId, bidId);
    transaction.wait();
  }

  public async onGetListingFee() {
    const listingFee = await this.marketPlace.getCollectedListingFee();
    return ethers.utils.formatUnits(listingFee.toString(), 'ether');
  }

  public async onTransferListingFee() {
    const transaction = await this.marketPlace.transferListingFee();
    transaction.wait();
  }
}

export default ContractsSDK;
