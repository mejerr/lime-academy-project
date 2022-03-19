import React, { FC, useCallback, useContext } from 'react'
import styled, { keyframes } from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Button } from "components";
import { AppStateContext } from 'App';
import { nftImage } from 'assets';
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