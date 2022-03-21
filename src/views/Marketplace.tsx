import React, { FC } from 'react'
import styled from 'styled-components'
import Collections from './Collections/Collections';

const Marketplace: FC = () => {
  return (
    <MarketplaceWrapper>
      <MarketplaceTitle>{"Explore collections"}</MarketplaceTitle>
      <Collections />
    </MarketplaceWrapper>
  )
};

export default Marketplace;

const MarketplaceWrapper = styled.div`
  display: flex;
  margin: 0 auto;
  width: 100%;
  max-width: min(1280px, 100% - 40px);
  justify-content: center;
  flex-direction: column;
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