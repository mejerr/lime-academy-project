// tslint:disable: no-empty
import { ethers } from 'ethers';

import marketplaceABI from 'NFTMarketPlace.json';

export interface ICollection {
  collectionId: number;
  name: string;
  description: string;
  creator: string;
}

class ContractsSDK {
  public marketplace: ethers.Contract;

  constructor(signer: ethers.Signer) {
    this.marketplace =  new ethers.Contract(
      '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
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
      collections.map(({ collectionId, name, description, creator }): ICollection => ({
        collectionId: Number(collectionId.toString()),
        name,
        description,
        creator
      }))
    ));

    return result;
  }

  public async createCollection(name: string, description: string) {
    const creation = await this.marketplace.createCollection(name, description);
    await creation.wait();
  }
}

export default ContractsSDK;
