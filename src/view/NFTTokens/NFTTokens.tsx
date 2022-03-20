import { ethereumImage, nftImage } from 'assets';
import { Button } from 'components';
import React, { FC, useCallback } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const NFTTokens: FC<RouteComponentProps> = ({ history }) => {
  const onClick = useCallback((collectionId, tokenId) => {
    history.push(`/collection/${collectionId}/token/${tokenId}`);
  }, []);

  return (
    <NFTTokenseWrapper>
      {[1, 2, 3,4 ,5 ].map((el, index) => {
        return (
          <NFTToken key={index} onClick={() => onClick(1, 1)}>
            <Image />
            <InfoWrapper>
              <Info>
                <Creator>creator <span>{"MisterPizza"}</span></Creator>
                <Name>{"New generation"}</Name>
              </Info>

              <PriceWrapper>
                <Price>{"Price"}</Price>
                <Value>
                  <ValueIcon />
                  <Amount>{154123.321}</Amount>
                </Value>
              </PriceWrapper>
            </InfoWrapper>

            <Footer>
              <Button
                title={'Buy'}
                width={"100%"}
                height={"15px"}
              />
            </Footer>
          </NFTToken>
        );
      })}
    </NFTTokenseWrapper>
  )
};

export default withRouter(NFTTokens);

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const NFTTokenseWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  padding: 30px 40px 20px;

  @media (max-width: 700px) {
  grid-template-columns: repeat(1, 1fr);
  }
`;

const NFTToken = styled.div`
  width: 100%;

  border: 1px solid rgb(229, 232, 235);
  border-radius: 10px;
  cursor: pointer;

  :hover {
    box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
    transition: all 0.1s ease 0s;
  }
`;

const Image = styled.div`
  height: 280px;
  width: 200px;
  margin: 0 auto;

  background: transparent url(${nftImage}) center center no-repeat;
  background-size: cover;
`;

const InfoWrapper = styled.div`
  display: flex;
  padding: 10px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 10px;
`;

const Creator = styled.div`
  width: 100%;
  font-size: 12px;
  color: rgb(112, 122, 131);
`;

const Name = styled.div`
  width: 100%;
  font-size: 12px;
  margin-bottom: 5px;
  color: rgb(53, 56, 64);
`;

const PriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 80px;
`;

const Price = styled.div`
  font-size: 12px;
  color: rgb(112, 122, 131);
  text-align: right;
  padding: 0 10px;
`;

const Value = styled.div`
  display: flex;
  width: 80px;
  padding: 0 10px;
`;

const ValueIcon = styled.div`
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  background: transparent url(${ethereumImage}) center center no-repeat;
  background-size: contain;
`;

const Amount = styled.div`
  color: rgb(53, 56, 64);
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: right;
`;

const Footer = styled.div`
  display: flex;
  width: 100%;
  height: 42px;
  padding: 12px;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgba(229, 232, 235, 0.392) 0%, rgb(255, 255, 255) 20%);

  > div {
    color: rgb(32, 129, 226);

    :hover {
      color: rgba(32, 129, 226, 0.8);
    }
  }
`;