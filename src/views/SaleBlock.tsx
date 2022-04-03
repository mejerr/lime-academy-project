import React, { ChangeEvent, Dispatch, FC, SetStateAction, useCallback, useContext, useState } from 'react'
import styled, { keyframes } from 'styled-components'
// import { AppStateContext, IConnectData } from './AppContextWrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { INFTItem } from 'SDK/ContractsSDK';
import { ellipseAddress } from 'helpers/utilities';
import { Button } from 'components';
import { ethereumImage } from 'assets';
import { AppStateContext, IConnectData } from './AppContextWrapper';

interface IProps {
  nftToken: INFTItem;
  isOpen: boolean;
  setOpenSale: Dispatch<SetStateAction<boolean>>;
}

const SaleBlock: FC<IProps> = ({ isOpen, setOpenSale, nftToken }) => {
  const { state } = useContext(AppStateContext);
  const { connected, contractsSDK }: IConnectData = state;
  const [price, setPrice] = useState<string>('');

  const onPriceInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  }, []);

  const onSellClick = useCallback(async () =>{
    if (connected && contractsSDK) {
      await contractsSDK.onCreateSale(nftToken.itemId, price)
    }
  }, [connected, contractsSDK, price, nftToken]);

  return (
    <SaleWrapper isOpen={isOpen}>
      <SaleContent>
        <ImageWrapper>
          <Image src={nftToken?.image}/>
        </ImageWrapper>

        <DetailsWrapper>
          <TokenName>Name: <div>{nftToken?.name}</div></TokenName>
          <TokenDescription>Description: <div>{nftToken?.description}</div></TokenDescription>
          <Owner>Owned by <span>{ellipseAddress(nftToken?.creator, 10)}</span>  </Owner>

          <PriceLabel>{"Price"}</PriceLabel>
          <AmountWrapper>
            <InputWrapper>
              {!nftToken?.price ? <PriceAmount>123123</PriceAmount>: <Input onChange={onPriceInputChange} placeholder={"Amount"} />}
              <ValueIcon />
              <ETHText>{"ETH"}</ETHText>
            </InputWrapper>
            <ButtonWrapper>
              <Button
                title={!nftToken?.price ? 'Buy' : 'Sell'}
                width={"100%"}
                height={"65px"}
                onClick={onSellClick}
              />
            </ButtonWrapper>
          </AmountWrapper>
        </DetailsWrapper>
        <CloseIcon icon={faClose} onClick={() => setOpenSale(false)}/>
      </SaleContent>
    </SaleWrapper>
  );
};

export default SaleBlock;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const SaleWrapper = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none' };
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  animation: ${fadeIn} 0.5s ease-out;
  background: rgba(0, 0, 0, 0.5);
  z-index: 3;
`;

const SaleContent = styled.div`
  position: relative;
  display: flex;
  width: 50%;
  height: 50%;
  background: #fff;
  z-index: 4;
  padding: 20px;
  border-radius: 10px;

  @media (max-width: 1300px) {
    width: 80%;
    height: 80%;
  }

  @media (max-width: 550px) {
    height: 90%;
    flex-direction: column;
    padding: 40px 20px 20px;
    overflow-y: auto;
  }
`;

const CloseIcon = styled(FontAwesomeIcon)`
  width: 25px;
  height: 25px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const ImageWrapper = styled.div`
  max-width: 50%;
  max-height: 100%;
  border: 1px solid rgb(229, 232, 235);
  border-radius: 10px;
  flex-shrink: 0;

  @media (max-width: 550px) {
    max-width: 100%;
  }
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
  margin: 0 auto;
  border-radius: 10px;
`;

const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 20px;

  @media (max-width: 550px) {
    margin: 0;
  }
`;

const TokenName = styled.div`
  font-size: 26px;
  color: #353840;
  padding: 10px 0 20px;
  word-break: break-all;

  @media (max-width: 1300px) {
    font-size: 18px;
  }

  & div {
    font-size: 24px;
    color: rgb(112, 122, 131);

    @media (max-width: 1300px) {
      font-size: 16px;
    }
  }
`;

const TokenDescription = styled.div`
  font-size: 26px;
  word-break: break-all;
  color: #353840;
  padding: 10px 0 20px;

  @media (max-width: 1300px) {
    font-size: 18px;
  }

  & div {
    font-size: 24px;
    color: rgb(112, 122, 131);

    @media (max-width: 1300px) {
      font-size: 16px;
    }
  }
`;

const Owner = styled.div`
  font-size: 14.5px;
  padding: 20px 0;
  color: rgb(112, 122, 131);
  > span {
    color: rgb(32, 129, 226);
  }
`;

const PriceLabel = styled.div`
  font-size: 18px;
  color: rgb(112, 122, 131);
  margin-bottom: 10px;
`;

const AmountWrapper = styled.div`
  display: flex;
  border-radius: 10px;

  @media (max-width: 1300px) {
    flex-direction: column;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 65px;
  margin: 0 10px;
  border-radius: 10px;
  border: 1px solid #024bb0;

  @media (max-width: 1300px) {
    margin: 0 0 10px;
  }
`;

const PriceAmount = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  font-size: 22px;
  font-weight: 600;
  color: #024bb0;
  padding: 0 10px;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  border: none;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  font-size: 22px;
  font-weight: 600;
  color: #024bb0;
  padding: 0 10px;

  :focus {
    outline: none !important;
    border: none;
  }
`;

const ValueIcon = styled.div`
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  background: transparent url(${ethereumImage}) center center no-repeat;
  background-size: contain;
`;

const ETHText = styled.span`
  padding: 0 5px;
  color: rgb(112, 122, 131);
`;

const ButtonWrapper = styled.div`
  width: 100%;
  background-color: #024bb0;
  border-radius: 10px;

  :hover {
    background-color: rgba(2, 75, 176, 0.9);
  }

  & div {
    color: #fff;
    font-size: 22px;
    :hover {
      color: #fff;
    }
  }
`;