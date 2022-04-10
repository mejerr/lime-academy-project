import React, { FC, useState, useCallback, Dispatch, SetStateAction, useContext } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Button, Value } from 'components';
import { IToken, TokenStatus } from 'SDK/ContractsSDK';
import { ethereumImage } from 'assets';
import { AppStateContext, IConnectData } from 'AppContextWrapper';

interface IProps {
  nftToken: IToken;
  setOpenSale: Dispatch<SetStateAction<boolean>>;
  setUpdateState: Dispatch<SetStateAction<boolean>>;
}

const PurchaseComponent: FC<IProps> = ({ nftToken = {}, setOpenSale, setUpdateState }) => {
  const { state, setIsLoading } = useContext(AppStateContext);
  const { connected, contractsSDK }: IConnectData = state;

  const [openOffer, setOpenOffer] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const onOpenOffer = useCallback(() => {
    setOpenOffer(!openOffer);
  }, [openOffer]);

  const onBuyItem = useCallback(() => {
    setOpenSale(true);
  }, []);

  const onInputChange = useCallback((event) => {
    setInputValue(event.target.value);
  }, []);

  const onSendOffer = useCallback(async () => {
    if (connected && contractsSDK && nftToken?.tokenId && inputValue.length) {
      setIsLoading(true);
      await contractsSDK.onBidOnItem(nftToken?.tokenId, inputValue, setUpdateState);
      setInputValue('');
      setIsLoading(false);
    }

    setOpenOffer(false);
  }, [connected, contractsSDK, inputValue, nftToken]);

  return (
    <PurchaseWrapper>
      <Price>{"Current price"}</Price>
      {nftToken?.status === TokenStatus.ForSale ?
        <Value price={nftToken?.price} /> :
        <NoPrice>{"Item not for sale, only offers"}</NoPrice>
      }
      <ButtonsWrapper>
        {openOffer ?
          <InputWrapper>
            <Input onChange={(e) => onInputChange(e)} value={inputValue}/>
            <ValueIcon />
            <ETHText>{"ETH"}</ETHText>
          </InputWrapper> :
          <BuyButtonWrapper onClick={nftToken?.status === TokenStatus.ForSale ? onBuyItem : onOpenOffer}>
            <BuyIcon icon={faCartShopping} />
            <Button
              title={'Buy now'}
              width={"150px"}
              height={"65px"}
            />
          </BuyButtonWrapper>
        }

        <SendButtonWrapper onClick={openOffer ? onSendOffer : onOpenOffer}>
          <OfferIcon icon={faPaperPlane} />
          <Button
            title={openOffer ? 'Send Offer' : 'Place bid'}
            width={"150px"}
            height={"65px"}
          />
        </SendButtonWrapper>
      </ButtonsWrapper>
    </PurchaseWrapper>
  );
};

export default PurchaseComponent;

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

const NoPrice = styled.div`
  font-size: 24px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  padding: 20px 20px 20px 0;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const SendButtonWrapper = styled.div`
  position: relative;
  font-size: 16px;
  font-weight: 600;
  margin: 0 10px;
  border-radius: 10px;
  border: 1px solid #024bb0;
  cursor: pointer;

  :hover {
      box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
      transition: all 0.2s ease 0s;
  }
  > div {
    color: #024bb0;
    margin: 0;
    border-radius: 10px;
    right: -12px;
    :hover {
      color: #024bb0;
    }
  }
`;

const BuyButtonWrapper = styled(SendButtonWrapper as any)`
  width: 270px;
  background-color: #024bb0;
  cursor: pointer;

  :hover {
    background-color: rgba(2, 75, 176, 0.9);
  }

  > div {
    color: #fff;
    :hover {
      color: #fff;
    }
  }

  @media (max-width: 600px) {
    margin: 0 10px 10px;
    width: calc(100% - 20px);
  }
`;

const BuyIcon = styled(FontAwesomeIcon)`
  position: absolute;
  color: #fff;
  top: 23px;
  left: 13px;
  width: 20px;
  height: 20px;
`;

const OfferIcon = styled(BuyIcon as any)`
  color: #024bb0;
  width: 18px;
  height: 18px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 270px;
  height: 68px;
  margin: 0 10px;
  border-radius: 10px;
  border: 1px solid #024bb0;


  @media (max-width: 600px) {
    margin-bottom: 10px;
    width: calc(100% - 20px);
  }
`;

const ETHText = styled.span`
  padding: 0 10px 0 5px;
  color: rgb(112, 122, 131);
`;

const Input = styled.input`
  border: none;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  font-size: 24px;
  font-weight: 600;
  color: #024bb0;
  text-transform: uppercase;
  padding: 0 10px;

  :focus {
    outline: none !important;
    border: none;
  }
`;

const ValueIcon = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  background: transparent url(${ethereumImage}) center center no-repeat;
  background-size: contain;
`;