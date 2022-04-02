import React, { FC, useCallback } from 'react'
import { ICollection } from 'SDK/ContractsSDK';
import styled from 'styled-components';
import Collection from './Collection';

interface IProps {
  collections: ICollection[]
}

const Collections: FC<IProps> = ({ collections = [] }) => {
  const renderCollections = useCallback(({ collectionId, image, name, creator, description }) => {
    return (
      <Collection
        key={collectionId}
        id={collectionId}
        image={image}
        smallImage={image}
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
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 30px;
  padding: 30px 40px 20px;

  @media (max-width: 1550px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1150px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 850px) {
    grid-template-columns: repeat(1, 1fr);
    padding: 30px 0 20px;
  }
`;