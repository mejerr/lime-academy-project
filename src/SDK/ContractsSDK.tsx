// tslint:disable: no-empty
import { Dispatch, SetStateAction } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import axios from 'axios';

import nftABI from '../artifacts/contracts/NFT.sol/NFT.json';
import marketPlaceABI from '../artifacts/contracts/MarketPlace.sol/MarketPlace.json';

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

export interface IToken extends IFetchedToken {
  image: string;
  creator: string;
  collectionName?: string;
}

class ContractsSDK {
  public marketPlace: ethers.Contract;
  public nft: ethers.Contract;
  public userAddress: string;

  constructor(signer: ethers.Signer, userAddress: string) {
    this.userAddress = userAddress;

    this.nft =  new ethers.Contract(
      process.env.REACT_APP_NFT_ADDRESS || "",
      nftABI.abi,
      signer
    );
    this.marketPlace =  new ethers.Contract(
      process.env.REACT_APP_MARKET_PLACE_ADDRESS || "",
      marketPlaceABI.abi,
      signer
    );
  }

  public async onChangeCreatorName(name: string, setUpdateState: Dispatch<SetStateAction<boolean>>) {
    try {
      const transanction = await this.marketPlace.changeCreatorName(name);
      await transanction.wait();
      setUpdateState(true);
    } catch (e: any) {
      toast.info(e.message)
    }
  }

  public async onChangeCreatorImage(image: string, setUpdateState: Dispatch<SetStateAction<boolean>>) {
    try {
      const transanction = await this.marketPlace.changeCreatorImage(image);
      await transanction.wait();
      setUpdateState(true);
    } catch (e: any) {
      toast.info(e.message)
    }
  }

  public async onGetCreatorInfo(creatorAddress: string) {
    try {
      const { name, image }: ICreator = await this.marketPlace.creatorsInfo(creatorAddress);

      return { name, image };
    } catch (e: any) {
      toast.info(e.message);
      return {};
    }
  }

  public async getCollections() {
    try {
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
    } catch (e: any) {
      toast.info(e.message);
      return [];
    }
  }

  public async getCollection(id: number) {
    try {
      const { collectionId, name, description, creator, image }: ICollection = await this.marketPlace.collections(id);
      return {
        collectionId: Number(collectionId.toString()),
        name,
        description,
        creator,
        image
      }
    } catch (e: any) {
      toast.info(e.message);
      return {};
    }
  }

  public async getUserCollections(userAddress: string) {
    try {
      const collections: ICollection[] = await this.getCollections();
      return collections.filter(({ creator }) => creator === userAddress);
    } catch (e: any) {
      toast.info(e.message);
      return [];
    }
  }

  public async createCollection(
    image: string,
    name: string,
    description: string,
    { onSuccess }
    ) {
    try {
      const collectionCreation = await this.marketPlace.createCollection(image, name, description);
      await collectionCreation.wait();
      onSuccess();
    } catch (e: any) {
      toast.info(e.message);
    }
  }

  public async getNFTs() {
    try {
      const nftItemsLength = Number((await this.marketPlace.getMarketItemsLength()).toString());
      const nftItemsIds: IFetchedToken[] = [];

      for (let i = 1; i <= nftItemsLength; i++) {
        const nftItem: IFetchedToken = this.marketPlace.marketItems(i);
        nftItemsIds.push(nftItem);
      };

      const result = Promise.all(nftItemsIds).then((nftItems) => {
        return Promise.all(nftItems.map(async ({ tokenId, name, description, price, collectionId, status }): Promise<IToken> => {
          const tokenUri = await this.nft.tokenURI(tokenId)
          const meta = await axios.get(tokenUri);
          const parsedPrice = ethers.utils.formatUnits(price.toString(), 'ether');

          return {
            tokenId: Number(tokenId.toString()),
            name,
            description,
            price: +parsedPrice,
            collectionId: Number(collectionId.toString()),
            status,
            creator: await this.nft.ownerOf(tokenId),
            image: meta.data.image
          }
        }))
      });

      return result;
    } catch (e: any) {
      toast.info(e.message);
      return [];
    }
  }

  public async getCollectionNFTs(collectionId: number) {
    try {
      const nfts = await this.getNFTs();
      return nfts.filter(nft => nft.collectionId === collectionId);
    } catch (e: any) {
      toast.info(e.message);
      return [];
    }
  }

  public async getUserNFTs(userAddress: string) {
    try {
      const nfts = await this.getNFTs();
      return nfts.filter(nft => nft.creator === userAddress);
    } catch (e: any) {
      toast.info(e.message);
      return [];
    }
  }

  public async getNFTItem(tokenId: number) {
    try {
      const { name, description, price, collectionId, status }: IToken = await this.marketPlace.marketItems(tokenId);
      const parsedPrice = ethers.utils.formatUnits(price.toString(), 'ether');
      const tokenUri = await this.nft.tokenURI(tokenId)
      const meta = await axios.get(tokenUri);
      const { name: collectionName } = await this.marketPlace.collections(collectionId);

      return {
        tokenId: Number(tokenId.toString()),
        name,
        description,
        price: +parsedPrice,
        collectionId: Number(collectionId.toString()),
        status,
        creator: await this.nft.ownerOf(tokenId),
        image: meta.data.image,
        collectionName
      }
    } catch (e: any) {
      toast.info(e.message);
      return {};
    }
  }

  public async createNFTItem(
    tokenURI: string,
    name: string,
    description: string,
    collectionId: number,
    { onSuccess }
    ) {
    try {
      const tokenCreation = await this.marketPlace.mintToken(tokenURI, name, description, collectionId);
      await tokenCreation.wait();
      onSuccess();
    } catch (e: any) {
      toast.info(e.message);
    }
  }

  public async onCreateSale(
    tokenId: number,
    price: number,
    setUpdateState: Dispatch<SetStateAction<boolean>>,
    setOpenSale: Dispatch<SetStateAction<boolean>>
    ) {
    try {
      const isMarketApproved = await this.nft.getApproved(tokenId) === this.marketPlace.address;
      if (!isMarketApproved) {
        await this.nft.approve(this.marketPlace.address, tokenId);
      }
      const listingFee = (await this.marketPlace.getListingFee()).toString();
      const parsedPrice = ethers.utils.parseEther(price.toString());

      const transaction = await this.marketPlace.createSale(tokenId, parsedPrice, { value: listingFee });
      await transaction.wait();
      setUpdateState(true);
      setOpenSale(false);
    } catch (e: any) {
      toast.info(e.message);
    }
  }

  public async onCancelSale(tokenId: string, setUpdateState: Dispatch<SetStateAction<boolean>>) {
    try {
      await this.nft.approve(zeroAddress, tokenId);

      const transaction = await this.marketPlace.cancelSale(tokenId);
      await transaction.wait();
      setUpdateState(true)
    } catch (e: any) {
      toast.info(e.message);
    }
  }

  public async onBuyMarketItem(
    tokenId: string,
    setUpdateState: Dispatch<SetStateAction<boolean>>,
    setOpenSale: Dispatch<SetStateAction<boolean>>
    ) {
    try {
      const price = (await this.marketPlace.marketItems(tokenId)).price;
      const transaction = await this.marketPlace.buyMarketItem(tokenId, { value: price });
      await transaction.wait();
      setUpdateState(true);
      setOpenSale(false);
    } catch (e: any) {
      toast.info(e.message);
    }
  }

  public async onGetItemOffers(tokenId: string) {
    try {
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
    } catch (e: any) {
      toast.info(e.message);
      return {};
    }
  }

  public async onBidOnItem(
    tokenId: number,
    amount: string,
    setUpdateState: Dispatch<SetStateAction<boolean>>
    ) {
    try {
      const parsedPrice = ethers.utils.parseEther(amount);
      const transaction = await this.marketPlace.bidMarketItem(tokenId, { value: parsedPrice });
      await transaction.wait();
      setUpdateState(true);
    } catch (e: any) {
      toast.info(e.message);
    }
  }

  public async onAcceptBid(
    tokenId: number,
    bidId: number,
    setUpdateState: Dispatch<SetStateAction<boolean>>
    ) {
    try {
      const isMarketApproved = await this.nft.getApproved(tokenId) === this.marketPlace.address;
      if (!isMarketApproved) {
        await this.nft.approve(this.marketPlace.address, tokenId);
      }

      const transaction = await this.marketPlace.acceptBid(tokenId, bidId);
      await transaction.wait();
      setUpdateState(true);
    } catch (e: any) {
      toast.info(e.message);
    }
  }

  public async onCancelBid(
    tokenId: number,
    bidId: number,
    setUpdateState: Dispatch<SetStateAction<boolean>>
    ) {
    try {
      const transaction = await this.marketPlace.rejectBid(tokenId, bidId);
      await transaction.wait();
      setUpdateState(true);
    } catch (e: any) {
      toast.info(e.message);
    }
  }

  public async onGetListingFee() {
    try {
      const listingFee = await this.marketPlace.getCollectedListingFee();
      return ethers.utils.formatUnits(listingFee.toString(), 'ether');
    } catch (e: any) {
      toast.info(e.message);
      return '';
    }
  }

  public async onTransferListingFee(setUpdateState: Dispatch<SetStateAction<boolean>>) {
    try {
      const transaction = await this.marketPlace.transferListingFee();
      await transaction.wait();
      setUpdateState(true);
    } catch (e: any) {
      toast.info(e.message);
    }
  }
}

export default ContractsSDK;
