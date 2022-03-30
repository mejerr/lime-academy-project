import { nftImage } from 'assets';
import React, { FC, useCallback } from 'react'
import { ICollection } from 'SDK/ContractsSDK';
import styled from 'styled-components';
import Collection from './Collection';

interface IProps {
  collections: ICollection[]
}

const Collections: FC<IProps> = ({ collections = [] }) => {
  const renderCollections = useCallback(({ collectionId, image, smallImage, name, creator, description }) => {
    return (
      <Collection
        key={collectionId}
        id={collectionId}
        image={nftImage}
        smallImage={nftImage}
        name={name}
        creator={creator}
        description={description}
      />);
  }, []);

  return (
    <CollectionsWrapper>
      {collections.map(renderCollections)}
    </CollectionsWrapper>
  )
};

export default Collections;

const CollectionsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 30px;
  padding: 30px 40px 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;