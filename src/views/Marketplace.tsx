import React, { FC, useContext, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Collections } from 'components';
import { ICollection } from 'SDK/ContractsSDK';
import { AppStateContext, IConnectData } from './AppContextWrapper';

const Marketplace: FC = () => {
  const { state } = useContext(AppStateContext);
  const { connected, contractsSDK }: IConnectData = state;
  const[collections, setCollections] = useState<ICollection[]>([]);

  useEffect(() => {
    const renderCollections = async () => {
      const result = await contractsSDK.getCollections();
      setCollections(result);
    }

    if (connected && contractsSDK) {
      renderCollections();
    }
  }, [connected, contractsSDK]);

  return (
    <MarketplaceWrapper>
      <MarketplaceTitle>{"Explore collections"}</MarketplaceTitle>
      {!collections.length ? <EmptyContent>{"No collections to show"}</EmptyContent>: <Collections collections={collections}/>}
    </MarketplaceWrapper>
  );
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
  font-size: 24px;
  padding: 60px 20px 60px;
  border-bottom: 1px solid grey;

  @media (max-width: 670px) {
    font-size: 20px;
    padding: 40px 20px;
  }
`;

const EmptyContent = styled.div`
  font-size: 36px;
  text-align: center;
  padding: 40px;
  background: rgba(55, 55, 55, 0.04);
  border: 1px solid rgba(55, 55, 55, 0.1);
`;