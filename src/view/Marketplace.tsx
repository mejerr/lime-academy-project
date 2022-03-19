import React, { FC, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'

import Collection from './Collections/Collection';

const Marketplace: FC = () => {
  const renderCollections = useCallback(() => {
    return <Collection />
  }, []);

  return (
    <MarketplaceWrapper>
      <MarketplaceTitle>{"Explore collections"}</MarketplaceTitle>
      <CollectionsWrapper>
        {[1, 2, 3].map(renderCollections)}
      </CollectionsWrapper>
    </MarketplaceWrapper>
  )
};

export default Marketplace;

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const MarketplaceWrapper = styled.div`
  display: flex;
  margin: 0 auto;
  width: 100%;
  max-width: min(1280px, 100% - 40px);
  justify-content: center;
  flex-direction: column;
  animation: ${fadeIn} 0.5s ease-out;
  padding-bottom: 20px;
`;

const MarketplaceTitle = styled.div`
  width: 100%;
  text-align: center;
  color: black;
  font-size: 30px;
  padding: 60px 20px 60px;
  border-bottom: 1px solid grey;
`;

const CollectionsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 30px;
  padding: 30px 40px 20px;

  @media (max-width: 700px) {
  grid-template-columns: repeat(1, 1fr);
  }
`;