import React, { FC } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { ethereumImage, nftImage } from 'assets';
import { Button } from 'components';
import { fadeIn } from 'view/Marketplace';

interface IProps {
  collectionName: string,
  tokenName: string,
  owner: string
}

const NFTToken: FC<IProps> = ({
  collectionName = "Where My Vans Go",
  tokenName = "Where My Vans Go #64",
  owner = "goso221"
}) => {
  return (
    <NFTTokenWrapper>
      <ImageWrapper>
        <Image />
      </ImageWrapper>

      <DetailsWrapper>
        <CollectionName>{collectionName}</CollectionName>
        <TokenName>{tokenName}</TokenName>
        <Owner>Owned by <span>{owner}</span>  </Owner>

        <PurchaseWrapper>
          <Price>{"Current price"}</Price>
          <Value>
            <ValueIcon />
            <Amount>{154123.321}</Amount>
            <DollarsAmount>{"($123,123,123)"}</DollarsAmount>
          </Value>

          <ButtonsWrapper>
            <BuyButtonWrapper>
              <BuyIcon icon={faCartShopping} />
              <Button
                title={'Buy now'}
                width={"270px"}
                height={"74px"}
              />
            </BuyButtonWrapper>
            <OfferButtonWrapper>
              <OfferIcon icon={faPaperPlane} />
              <Button
                title={'Send Offer'}
                width={"150px"}
                height={"74px"}
              />
            </OfferButtonWrapper>
          </ButtonsWrapper>
        </PurchaseWrapper>

      </DetailsWrapper>
    </NFTTokenWrapper>
  )
};

export default NFTToken;

const NFTTokenWrapper = styled.div`
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
  margin: 20px;
`;

const CollectionName = styled.div`
  font-size: 16px;
  color: rgb(32, 129, 226);
  padding: 20px;
  cursor: pointer;
`;

const TokenName = styled.div`
  font-size: 30px;
  color: #353840;
  padding: 10px 20px 20px;
`;

const Owner = styled.div`
  font-size: 14.5px;
  padding: 20px 20px;
  color: rgb(112, 122, 131);
  > span {
    color: rgb(32, 129, 226);
    cursor: pointer;
  }
`;

const PurchaseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid rgb(229, 232, 235);
  border-radius: 10px;
  padding: 20px;
`;

const Price = styled.div`
  width: 100%;
  font-size: 14.5px;
  line-height: 1.5;
  color: rgb(112, 122, 131);
`;

const Value = styled.div`
  display: flex;
  width: 100%;
  height: 45px;
  align-items: center;
  margin-bottom: 10px;
`;

const ValueIcon = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  background: transparent url(${ethereumImage}) center center no-repeat;
  background-size: contain;
`;

const Amount = styled.div`
  font-size: 30px;
`;

const DollarsAmount = styled.div`
  font-size: 15px;
  margin: 8px 0 0 4px;
  color: rgb(112, 122, 131);
`;

const ButtonsWrapper = styled.div`
  display: flex;
  padding: 20px 20px 20px 0;
`;

const OfferButtonWrapper = styled.div`
  position: relative;
  right: -25px;
  font-size: 16px;
  font-weight: 600;
  margin: 0 10px;
  border-radius: 10px;
  border: 1px solid #024bb0;

  > div {
    color: #024bb0;
    margin: 0;
    border-radius: 10px;
    right: -12px;
    :hover {
      box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
      transition: all 0.2s ease 0s;
      color: #024bb0;
    }
  }
`;

const BuyButtonWrapper = styled(OfferButtonWrapper as any)`
  background-color: #024bb0;

  :hover {
    background-color: rgba(2, 75, 176, 0.9);
  }

  > div {
    color: white;
    :hover {
      box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
      color: #fff;
    }
  }
`;

const BuyIcon = styled(FontAwesomeIcon)`
  position: absolute;
  color: #fff;
  top: 25px;
  left: 75px;
  width: 22px;
  height: 22px;
`;

const OfferIcon = styled(FontAwesomeIcon)`
  position: absolute;
  color: #024bb0;
  top: 27px;
  left: 13px;
  width: 18px;
  height: 18px;
`;