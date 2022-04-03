import React, { FC, useState, useCallback, Dispatch, SetStateAction } from 'react'
import styled from 'styled-components';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'components';
import { ethereumImage } from 'assets';
import { INFTItem, ItemStatus } from 'SDK/ContractsSDK';

interface IProps extends RouteComponentProps {
  nftToken: INFTItem;
  setOpenSale: Dispatch<SetStateAction<boolean>>;
}

const PurchaseComponent: FC<IProps> = ({ history, nftToken = {}, setOpenSale }) => {
  const [openOffer, setOpenOffer] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const onOpenOffer = useCallback(() => {
    setOpenOffer(!openOffer);
  }, [openOffer]);

  const onSendOffer = useCallback(() => {
    // send real offer
    setOpenOffer(false);
    setInputValue('');
  }, [setInputValue, setOpenOffer]);

  const onBuyItem = useCallback(() => {
    setOpenSale(true);
  }, [setOpenSale]);

  const onInputChange = useCallback((event) => {
    setInputValue(event.target.value);
  }, []);

  return (
    <PurchaseWrapper>
      <Price>{"Current price"}</Price>
      {nftToken?.status === ItemStatus.ForSale ?
        <Value>
          <ValueIcon />
          <Amount>{nftToken?.price}</Amount>
          <DollarsAmount>{"($123,123,123)"}</DollarsAmount>
        </Value> :
        <NoPrice>{"Item not for sale, only offers"}</NoPrice>
      }
      <ButtonsWrapper>
        {openOffer ?
          <InputWrapper>
            <Input onChange={(e) => onInputChange(e)} value={inputValue}/>
            <ValueIcon />
            <ETHText>{"ETH"}</ETHText>
          </InputWrapper> :
          <BuyButtonWrapper>
            <BuyIcon icon={faCartShopping} />
            <Button
              title={'Buy now'}
              width={"270px"}
              height={"65px"}
              onClick={nftToken?.status === ItemStatus.ForSale ? onBuyItem : onOpenOffer}
            />
          </BuyButtonWrapper>
        }

        <SendButtonWrapper>
          <OfferIcon icon={faPaperPlane} />
          <Button
            title={openOffer ? 'Send Offer' : 'Place bid'}
            width={"150px"}
            height={"65px"}
            onClick={openOffer ? onSendOffer : onOpenOffer}
          />
        </SendButtonWrapper>
      </ButtonsWrapper>
    </PurchaseWrapper>
  );
};

export default withRouter(PurchaseComponent);

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

const NoPrice = styled.div`
  font-size: 24px;
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

const SendButtonWrapper = styled.div`
  position: relative;
  font-size: 16px;
  font-weight: 600;
  margin: 0 10px;
  border-radius: 10px;
  border: 1px solid #024bb0;

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

  :hover {
    background-color: rgba(2, 75, 176, 0.9);
  }

  > div {
    color: #fff;
    :hover {
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

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 270px;
  margin: 0 10px;
  border-radius: 10px;
  border: 1px solid #024bb0;
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
