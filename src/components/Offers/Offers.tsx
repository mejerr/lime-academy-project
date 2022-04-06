

import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { BidStatus, IBid } from 'SDK/ContractsSDK';
import { AppStateContext, IConnectData } from 'AppContextWrapper';
import Offer from './Offer';

interface IProps {
  tokenId: number,
  nftCreator: string
}

const UNIT_DATA = [
  { name: "Unit Price"},
  { name: "USD Unit Price"},
  { name: "From"}
];

const Offers: FC<IProps> = ({ tokenId = 0, nftCreator = '' }) => {
  const { state } = useContext(AppStateContext);
  const { connected, contractsSDK, userAddress }: IConnectData = state;
  const [offers, setOffers] = useState<IBid[]>([]);

  const onAcceptClick = useCallback(async (bidId: number) => {
    if (connected && contractsSDK && tokenId) {
      await contractsSDK.onAcceptBid(tokenId, bidId);
    }
  }, [connected, contractsSDK, tokenId]);

  const onRejectClick = useCallback(async (bidId: number) => {
    if (connected && contractsSDK && tokenId) {
      await contractsSDK.onCancelBid(tokenId, bidId);
    }
  }, [connected, contractsSDK, tokenId]);

  const renderOffers = useCallback(({ bidId, amount, status, bidder}) => {
    return (
      <Offer
        key={bidId}
        price={amount}
        bidder={bidder}
        status={status}
        onAcceptClick={() => onAcceptClick(bidId)}
        onRejectClick={() => onRejectClick(bidId)}
        isNftCreator={nftCreator === userAddress}
      />
    );
  }, [onAcceptClick, onRejectClick]);

  useEffect(() => {
    const renderOffers = async () => {
      const result = await contractsSDK.onGetItemOffers(tokenId);
      const idleBids = result.filter((bid: IBid) => bid.status === BidStatus.Idle);
      setOffers(idleBids);
    }

    if (connected && contractsSDK && tokenId) {
      renderOffers();
    }
  }, [connected, contractsSDK, tokenId]);

  return (
    <OffersWrapper>
      <OffersTitle>{"Offers"}</OffersTitle>
      {!!offers.length &&
        <OffersData>
          {UNIT_DATA.map(({ name }) => <Unit key={name}>{name}</Unit>)}
        </OffersData>
      }
      <OffersContent>
        {offers.length ? offers.map(renderOffers) : <EmptyContent>No offers</EmptyContent>}
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

const EmptyContent = styled.div`
  font-size: 36px;
  text-align: center;
  padding: 40px;
`;