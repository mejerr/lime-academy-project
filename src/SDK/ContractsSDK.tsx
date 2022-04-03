// tslint:disable: no-empty
import { ethers } from 'ethers';

import marketplaceABI from 'NFTMarketPlace.json';
import marketItemABI from 'NFTMarketItem.json';
import axios from 'axios';

export enum ItemStatus {
  "ForSale",
  'Idle'
}

export interface ICollection {
  collectionId: number;
  name: string;
  description: string;
  creator: string;
  image: string;
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
      '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      marketItemABI.abi,
      signer
    );

    this.marketplace =  new ethers.Contract(
      '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      marketplaceABI.abi,
      signer
    );

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
    const listingFee = (await this.marketplace.getListingFee()).toString();
    const parsedPrice = ethers.utils.parseEther(price.toString());

    const transaction = await this.marketplace.createSale(tokenId, parsedPrice, { value: listingFee });
    await transaction.wait();
  }

  public async onCancelSale(tokenId: string) {
    const transaction = await this.marketplace.cancelSale(tokenId);
    transaction.wait();
  }

  public async onBuyMarketItem(tokenId: string) {
    const price = (await this.marketplace.marketItems(tokenId)).price;
    const transaction = await this.marketplace.buyMarketItem(tokenId, { value: price });
    transaction.wait();
  }
}

export default ContractsSDK;
