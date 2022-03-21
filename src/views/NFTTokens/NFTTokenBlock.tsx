import React, { FC, useCallback } from 'react'
import styled from 'styled-components'
import { nftImage } from 'assets';
import { PurchaseComponent } from 'components';
import { fadeIn } from 'App';
import { UNIT_DATA } from 'helpers/constants';
import Offer from './Offer';

const OFFERS_DUMMIES = [
  {
    price: 213,
    bidder: "maneskin"
  },
  {
    price: 456,
    bidder: "dsadsa"
  },
];

interface IProps {
  collectionName: string,
  tokenName: string,
  owner: string
}

const NFTTokenBlock: FC<IProps> = ({
  collectionName = "Where My Vans Go",
  tokenName = "Where My Vans Go #64",
  owner = "goso221"
}) => {
  const renderOffers = useCallback(({ price, bidder}, index) => {
    return (
      <Offer key={index} price={price} bidder={bidder} />
    );
  }, []);

  return (
    <NFTTokenBlockWrapper>
      <ImageWrapper>
        <Image />
      </ImageWrapper>

      <DetailsWrapper>
        <CollectionName>{collectionName}</CollectionName>
        <TokenName>{tokenName}</TokenName>
        <Owner>Owned by <span>{owner}</span>  </Owner>
        <PurchaseComponent />

        <OffersWrapper>
          <OffersTitle>{"Offers"}</OffersTitle>
          <OffersData>
            {UNIT_DATA.map(({ name }) => <Unit key={name}>{name}</Unit>)}
          </OffersData>
          <OffersContent>
            {OFFERS_DUMMIES.map(renderOffers)}
          </OffersContent>
        </OffersWrapper>

      </DetailsWrapper>
    </NFTTokenBlockWrapper>
  )
};

export default NFTTokenBlock;

const NFTTokenBlockWrapper = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
  display: flex;
  margin: 30px auto;
  padding: 20px;
`;

const ImageWrapper = styled.div`
  width: 500px;
  height: 600px;
  border: 1px solid rgb(229, 232, 235);
  border-radius: 10px;
  margin: 0 10px;
`;

const Image = styled.div`
  height: 100%;
  width: 100%;
  margin: 0 auto;
  border-radius: 10px;

  background: transparent url(${nftImage}) center center no-repeat;
  background-size: cover;
`;

const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 20px;
`;

const CollectionName = styled.div`
  font-size: 16px;
  color: rgb(32, 129, 226);
  padding: 20px 0;
  cursor: pointer;
`;

const TokenName = styled.div`
  font-size: 30px;
  color: #353840;
  padding: 10px 0 20px;
`;

const Owner = styled.div`
  font-size: 14.5px;
  padding: 20px 0;
  color: rgb(112, 122, 131);
  > span {
    color: rgb(32, 129, 226);
    cursor: pointer;
  }
`;

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

