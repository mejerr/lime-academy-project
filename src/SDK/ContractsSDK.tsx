// tslint:disable: no-empty
import { ethers } from 'ethers';

import marketplaceABI from 'NFTMarketPlace.json';
import marketItemABI from 'NFTMarketItem.json';
import axios from 'axios';

const zeroAddress = '0x0000000000000000000000000000000000000000';

export enum ItemStatus {
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

interface IFetchedNFTItem {
  itemId: number;
  name: string;
  description: string;
  price: number;
  collectionId: number;
  createdOn: string;
  status: ItemStatus;
}

export interface INFTItem extends IFetchedNFTItem{
  image: string;
  creator: string;
  collectionName?: string;
}

class ContractsSDK {
  public marketplace: ethers.Contract;
  public marketItem: ethers.Contract;
  public userAddress: string;

  constructor(signer: ethers.Signer, userAddress: string) {
    this.userAddress = userAddress;

    this.marketItem =  new ethers.Contract(
      '0x7a2088a1bFc9d81c55368AE168C2C02570cB814F',
      marketItemABI.abi,
      signer
    );

    this.marketplace =  new ethers.Contract(
      '0x09635F643e140090A9A8Dcd712eD6285858ceBef',
      marketplaceABI.abi,
      signer
    );
  }

  public async onChangeCreatorName(creatorAddress: string, name: string) {
    const transanction = await this.marketplace.changeCreatorName(creatorAddress, name);
    transanction.wait();
  }

  public async onChangeCreatorImage(creatorAddress: string, image: string) {
    const transanction = await this.marketplace.changeCreatorImage(creatorAddress, image);
    transanction.wait();
  }

  public async onGetCreatorInfo(creatorAddress: string) {
    const { name, image }: ICreator = await this.marketplace.creatorsInfo(creatorAddress);

    return {
      name,
      image
    }
  }

  public async getCollections() {
    const collectionLength = Number((await this.marketplace.getCollectionLength()).toString());
    const collectionIds: ICollection[] = [];

    for (let i = 1; i <= collectionLength; i++) {
      const collection = this.marketplace.collections(i);
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
    const { collectionId, name, description, creator, image }: ICollection = await this.marketplace.collections(id);
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
    const collectionCreation = await this.marketplace.createCollection(image, name, description);
    await collectionCreation.wait();
  }

  public async getNFTs() {
    const nftItemsLength = Number((await this.marketplace.getMarketItemsLength()).toString());
    const nftItemsIds: IFetchedNFTItem[] = [];

    for (let i = 1; i <= nftItemsLength; i++) {
      const nftItem: IFetchedNFTItem = this.marketplace.marketItems(i);
      nftItemsIds.push(nftItem);
    };

    const result = Promise.all(nftItemsIds).then((nftItems) => {
      return Promise.all(nftItems.map(async ({ itemId, name, description, price, collectionId, createdOn, status }): Promise<INFTItem> => {
        const tokenUri = await this.marketItem.tokenURI(itemId)
        const meta = await axios.get(tokenUri);
        const parsedPrice = ethers.utils.formatUnits(price.toString(), 'ether');

        return {
          itemId: Number(itemId.toString()),
          name,
          description,
          price: +parsedPrice,
          collectionId: Number(collectionId.toString()),
          createdOn,
          status,
          creator: await this.marketItem.ownerOf(itemId),
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

  public async getNFTItem(itemId: number) {
    const { name, description, price, collectionId, createdOn, status }: INFTItem = await this.marketplace.marketItems(itemId);
    const parsedPrice = ethers.utils.formatUnits(price.toString(), 'ether');
    const tokenUri = await this.marketItem.tokenURI(itemId)
    const meta = await axios.get(tokenUri);
    const { name: collectionName } = await this.marketplace.collections(collectionId);

    return {
      itemId: Number(itemId.toString()),
      name,
      description,
      price: +parsedPrice,
      collectionId: Number(collectionId.toString()),
      createdOn,
      status,
      creator: await this.marketItem.ownerOf(itemId),
      image: meta.data.image,
      collectionName
    }
  }

  public async createNFTItem(tokenURI: string, name: string, description: string, collectionId: number) {
    const tokenId = await this.marketplace.mintToken(tokenURI, name, description, collectionId);
    await tokenId.wait();
  }

  public async onCreateSale(tokenId: number, price: number) {
    const isMarketApproved = await this.marketItem.getApproved(tokenId) === this.marketplace.address;
    if (!isMarketApproved) {
      await this.marketItem.approve(this.marketplace.address, tokenId);
    }

    const listingFee = (await this.marketplace.getListingFee()).toString();
    const parsedPrice = ethers.utils.parseEther(price.toString());

    const transaction = await this.marketplace.createSale(tokenId, parsedPrice, { value: listingFee });
    await transaction.wait();
  }

  public async onCancelSale(tokenId: string) {
    await this.marketItem.approve(zeroAddress, tokenId);

    const transaction = await this.marketplace.cancelSale(tokenId);
    transaction.wait();
  }

  public async onBuyMarketItem(tokenId: string) {
    const price = (await this.marketplace.marketItems(tokenId)).price;
    const transaction = await this.marketplace.buyMarketItem(tokenId, { value: price });
    transaction.wait();
  }

  public async onGetItemOffers(tokenId: string) {
    const bidsLength = Number((await this.marketplace.getItemBidsLength()).toString());
    const bidsIds: IBid[] = [];

    for (let i = 1; i <= bidsLength; i++) {
      const bid = await this.marketplace.itemBids(tokenId, i);
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
    const transaction = await this.marketplace.bidMarketItem(tokenId, { value: parsedPrice });
    transaction.wait();
  }

  public async onAcceptBid(tokenId: number, bidId: number) {
    const isMarketApproved = await this.marketItem.getApproved(tokenId) === this.marketplace.address;
    if (!isMarketApproved) {
      await this.marketItem.approve(this.marketplace.address, tokenId);
    }

    const transaction = await this.marketplace.acceptItemBid(tokenId, bidId);
    transaction.wait();
  }

  public async onCancelBid(tokenId: number, bidId: number) {
    const transaction = await this.marketplace.cancelItemBid(tokenId, bidId);
    transaction.wait();
  }
}

export default ContractsSDK;
