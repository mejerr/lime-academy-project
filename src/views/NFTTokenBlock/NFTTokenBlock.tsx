import React, { FC, useCallback, useContext, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { UNIT_DATA } from 'helpers/constants';
import Offer from './Offer';
import PurchaseComponent from './PurchaseComponent';
import { AppStateContext, IConnectData } from 'views/AppContextWrapper';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';
import { INFTItem, ItemStatus } from 'SDK/ContractsSDK';
import { Button, ImageBlock, Value } from 'components';
import SaleBlock from 'views/SaleBlock';

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
    history.push(`/collection/${nftToken?.collectionId}`);
  }, [nftToken]);

  const renderOffers = useCallback(({ price, bidder}, index) => {
    return (
      <Offer key={index} price={price} bidder={bidder} />
    );
  }, []);

  const cancelSale = useCallback(async () => {
      if (connected && contractsSDK) {
        await contractsSDK.onCancelSale(nftToken?.itemId);
        // Remove window reload if possible
        window.location.reload();
      }
  }, [connected, contractsSDK, nftToken]);

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
      <ImageWrapper>
        <ImageBlock
          image={nftToken?.image}
          width={'500px'}
        />
      </ImageWrapper>

      {nftToken?.creator === userAddress &&
        <SaleButtonWrapper>
          {nftToken?.status === ItemStatus.ForSale &&
            <Value price={nftToken?.price} />
          }
          <ButtonWrapper>
            <Button
              title={nftToken?.status === ItemStatus.ForSale ? "Cancel sale" : "Sell"}
              width={"100%"}
              height={"50px"}
              onClick={nftToken?.status === ItemStatus.ForSale ? cancelSale : () => setOpenSale(true)}
            />
          </ButtonWrapper>
        </SaleButtonWrapper>
      }

      <DetailsWrapper>
        <CollectionName onClick={goToCollection}>{nftToken?.collectionName}</CollectionName>
        <TokenName>{nftToken?.name}</TokenName>
        <Owner>Owned by <span>{nftToken?.creator}</span>  </Owner>
        {nftToken?.creator !== userAddress &&
          <PurchaseComponent nftToken={nftToken} setOpenSale={setOpenSale}/>
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
  margin: 20px auto;

  @media (max-width: 1000px) {
    flex-direction: column;
    align-items: center;
    max-width: 580px;
  }

  @media (max-width: 600px) {
    width: 430px;
  }

  @media (max-width: 450px) {
    width: 330px;
  }
`;

const ImageWrapper = styled.div`
  max-height: 100%;
  max-width: 100%;
  border: 1px solid rgb(229, 232, 235);
  border-radius: 10px;
  flex-shrink: 0;
  margin: 0 10px 0 20px;
`;

const SaleButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  right: 40px;
  top: 40px;

  @media (max-width: 1000px) {
    position: unset;
    width: 100%;
    padding: 10px 0;
  }
`;

const ButtonWrapper = styled.div`
  width: 150px;
  background-color: #024bb0;
  border-radius: 10px;

  @media (max-width: 1000px) {
    width: 100%;
  }

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

