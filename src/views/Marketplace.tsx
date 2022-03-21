import React, { FC } from 'react'
import styled, { keyframes } from 'styled-components'
import { Collections } from 'components';

const Marketplace: FC = () => {
  return (
    <MarketplaceWrapper>
      <MarketplaceTitle>{"Explore collections"}</MarketplaceTitle>
      <Collections />
    </MarketplaceWrapper>
  )
};

export default Marketplace;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const MarketplaceWrapper = styled.div`
  display: flex;
  margin: 0 auto;
  width: 100%;
  max-width: min(1280px, 100% - 40px);
  justify-content: center;
  flex-direction: column;
  padding-bottom: 20px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const MarketplaceTitle = styled.div`
  width: 100%;
  text-align: center;
  color: black;
  font-size: 30px;
  padding: 60px 20px 60px;
  border-bottom: 1px solid grey;
`;