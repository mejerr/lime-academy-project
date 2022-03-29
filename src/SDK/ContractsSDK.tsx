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

  constructor(signer: ethers.Signer | ethers.providers.Provider | undefined) {
    this.marketplace =  new ethers.Contract(
      '0x0B306BF915C4d645ff596e518fAf3F9669b97016',
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
