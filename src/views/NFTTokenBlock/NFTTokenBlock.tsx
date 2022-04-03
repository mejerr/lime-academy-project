import React, { FC, useCallback, useContext, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { UNIT_DATA } from 'helpers/constants';
import Offer from './Offer';
import PurchaseComponent from './PurchaseComponent';
import { AppStateContext, IConnectData } from 'views/AppContextWrapper';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';
import { INFTItem } from 'SDK/ContractsSDK';
import SaleBlock from 'views/SaleBlock';
import { Button } from 'components';

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

const NFTTokenBlock: FC<RouteComponentProps> = ({ history }) => {
  const { state } = useContext(AppStateContext);
  const { connected, contractsSDK, userAddress }: IConnectData = state;
  const params: { id: string } = useParams();
  const [nftToken, setNFTToken] = useState<INFTItem | any>();
  const [openSale, setOpenSale] = useState<boolean>(false);

  const goToCollection = useCallback(() => {
    history.push(`/collection/${nftToken.collectionId}`);
  }, [nftToken]);

  const renderOffers = useCallback(({ price, bidder}, index) => {
    return (
      <Offer key={index} price={price} bidder={bidder} />
    );
  }, []);


  useEffect(() => {
    const renderNFTItem = async () => {
      const nftItem: INFTItem = await contractsSDK.getNFTItem(params.id);
      setNFTToken(nftItem);
    }
    if (connected && contractsSDK) {
      renderNFTItem();
    }
  }, [connected, contractsSDK]);

  return (
    <NFTTokenBlockWrapper>
      {nftToken?.creator === userAddress &&
        <ButtonWrapper>
          <Button
            title={'Sell'}
            width={"100%"}
            height={"50px"}
            onClick={() => setOpenSale(true)}
          />
        </ButtonWrapper>
      }

      <ImageWrapper>
        <Image src={nftToken?.image}/>
      </ImageWrapper>

      <DetailsWrapper>
        <CollectionName onClick={goToCollection}>{nftToken?.collectionName}</CollectionName>
        <TokenName>{nftToken?.name}</TokenName>
        <Owner>Owned by <span>{nftToken?.creator}</span>  </Owner>
        {nftToken?.creator !== userAddress &&
          <PurchaseComponent price={nftToken?.price}/>
        }

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
      <SaleBlock setOpenSale={setOpenSale} isOpen={openSale} nftToken={nftToken}/>
    </NFTTokenBlockWrapper>
  )
};

export default withRouter(NFTTokenBlock);

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const NFTTokenBlockWrapper = styled.div`
  position: relative;
  animation: ${fadeIn} 0.5s ease-out;
  display: flex;
  margin: 30px auto;
  padding: 20px;

  @media (max-width: 1000px) {
    flex-direction: column;
    align-items: center;
  }

  @media (max-width: 800px) {
    max-width: 580px;
  }

  @media (max-width: 600px) {
    width: 430px;
  }

  @media (max-width: 450px) {
    width: 330px;
  }
`;

const ButtonWrapper = styled.div`
  position: absolute;
  right: 40px;
  top: 40px;
  width: 150px;
  background-color: #024bb0;
  border-radius: 10px;

  :hover {
    background-color: rgba(2, 75, 176, 0.9);
  }

  & div {
    color: #fff;
    font-size: 16px;
    margin: 0;
    :hover {
      color: #fff;
    }
  }
`;

const ImageWrapper = styled.div`
  width: 500px;
  height: 600px;
  border: 1px solid rgb(229, 232, 235);
  border-radius: 10px;
  margin: 0 10px;
  flex-shrink: 0;

  @media (max-width: 1400px) {
    width: 400px;
  }

  @media (max-width: 1000px) {
    width: 580px;
    height: 500px;
  }

  @media (max-width: 600px) {
    width: 430px;
    height: 500px;
  }

  @media (max-width: 450px) {
    width: 330px;
  }
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
  border-radius: 10px;
`;

const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 20px;
`;

const CollectionName = styled.div`
  font-size: 16px;
  color: rgb(32, 129, 226);
  padding: 20px 0;
  cursor: pointer;
  max-width: 200px;
  word-break: break-all;
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
    word-break: break-all;
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

