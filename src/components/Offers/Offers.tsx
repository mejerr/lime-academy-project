

import React, { FC, useCallback, useContext, useEffect, useState } from 'react'
import { IBid } from 'SDK/ContractsSDK';
import styled from 'styled-components';
import { AppStateContext, IConnectData } from 'views/AppContextWrapper';
import Offer from './Offer';

interface IProps {
  tokenId: number
}

const UNIT_DATA = [
  { name: "Unit Price"},
  { name: "USD Unit Price"},
  { name: "From"}
];

const Offers: FC<IProps> = ({ tokenId = 0 }) => {
  const { state } = useContext(AppStateContext);
  const { connected, contractsSDK }: IConnectData = state;
  const [offers, setOffers] = useState<IBid[]>([]);

  const renderOffers = useCallback(({ bidId, amount, bidder}) => {
    return (
      <Offer key={bidId} price={amount} bidder={bidder} />
    );
  }, []);

  useEffect(() => {
    const renderOffers = async () => {
      const result = await contractsSDK.onGetItemOffers(tokenId);
      setOffers(result);
    }

    if (connected && contractsSDK && tokenId) {
      renderOffers();
    }
  }, [connected, contractsSDK, tokenId]);


  return (
    <OffersWrapper>
      <OffersTitle>{"Offers"}</OffersTitle>
      <OffersData>
        {UNIT_DATA.map(({ name }) => <Unit key={name}>{name}</Unit>)}
      </OffersData>
      <OffersContent>
        {offers.map(renderOffers)}
      </OffersContent>
    </OffersWrapper>
  );
};

export default Offers;

const OffersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid rgb(229, 232, 235);
  border-radius: 10px;
  margin: 20px 0;
`;

const OffersTitle = styled.div`
  width: 100%;
  min-height: 70px;
  color: #04111D;
  font-weight: 600;
  padding: 20px;
`;

const OffersData = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid rgb(229, 232, 235);
  border-top: 1px solid rgb(229, 232, 235);
  padding: 10px 20px;
`;

const Unit = styled.div`
  font-size: 14px;
  width: 28%;
`;

const OffersContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 20px;
`;




