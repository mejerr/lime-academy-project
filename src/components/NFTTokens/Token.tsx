import React, { FC, useCallback, useContext } from 'react'
import styled from 'styled-components';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ethereumImage } from 'assets';
import { Button } from 'components';
import { AppStateContext, IConnectData } from 'views/AppContextWrapper';

interface IProps extends RouteComponentProps {
  collectionId: string;
  tokenId: string;
  creator: string;
  name: string;
  price: number;
  image: string;
}

const Token: FC<IProps> = ({
  history,
  collectionId,
  tokenId,
  creator,
  name,
  price,
  image
}) => {
  const { state } = useContext(AppStateContext);
  const { userAdress }: IConnectData = state;

  const onClick = useCallback(() => {
    history.push(`/collection/${collectionId}/token/${tokenId}`);
  }, [collectionId, tokenId]);

  return (
    <TokenWrapper onClick={onClick}>
      <Image image={image}/>
      <InfoWrapper>
        <Info>
          <Creator>creator <span>{creator}</span></Creator>
          <Name>{name}</Name>
        </Info>

        {price > 0 &&
          <PriceWrapper>
            <Price>{"Price"}</Price>
            <Value>
              <ValueIcon />
              <Amount>{price}</Amount>
            </Value>
          </PriceWrapper>
        }
      </InfoWrapper>
      {userAdress !== creator ?
        price > 0 ?
        <ButtonWrapper>
          <Button
            title={'Buy'}
            width={"100%"}
            height={"15px"}
          />
        </ButtonWrapper> :
        <ButtonWrapper>
          <Button
            title={'Make offer'}
            width={"100%"}
            height={"15px"}
          />
        </ButtonWrapper> : null
        }
    </TokenWrapper>
  );
};

export default withRouter(Token);

const TokenWrapper = styled.div`
  width: 100%;

  border: 1px solid rgb(229, 232, 235);
  border-radius: 10px;
  cursor: pointer;

  :hover {
    box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
    transition: all 0.1s ease 0s;
  }
`;

const Image = styled.div<{ image: string }>`
  height: 280px;
  width: 200px;
  margin: 0 auto;

  background: ${({ image }) => image && `transparent url(${image}) center center no-repeat`};
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

  & span {
    color: #2081E2
  }
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
  justify-content: flex-end;
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

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 42px;
  padding: 12px;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgba(229, 232, 235, 0.392) 0%, rgb(255, 255, 255) 20%);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;

  > div {
    color: rgb(32, 129, 226);
    :hover {
      color: rgba(32, 129, 226, 0.8);
    }
  }
`;