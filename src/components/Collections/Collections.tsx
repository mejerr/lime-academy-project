import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { ICollection } from 'SDK/ContractsSDK';
import Collection from './Collection';

interface IProps {
  collections: ICollection[]
}

const Collections: FC<IProps> = ({ collections = [] }) => {
  const renderCollections = useCallback(({ collectionId, image, name, creator, description }) => (
    <Collection
      key={collectionId}
      id={collectionId}
      image={image}
      smallImage={image}
      name={name}
      creator={creator}
      description={description}
    />
  ), []);

  return (
    <CollectionsWrapper isContent={!!collections.length}>
      {collections.length ? collections.map(renderCollections) : <EmptyContent>{"No collections to show"}</EmptyContent>}
    </CollectionsWrapper>
  )
};

export default Collections;

const CollectionsWrapper = styled.div<{ isContent: boolean }>`
  display: ${({ isContent }) => isContent &&  'grid'};
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

const EmptyContent = styled.div`
  font-size: 36px;
  text-align: center;
  padding: 40px;
`;