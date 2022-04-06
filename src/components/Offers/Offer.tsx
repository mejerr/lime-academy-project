import React, { FC, Fragment, useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from 'components';
import { ethereumImage } from 'assets';
import { ellipseAddress } from '../../helpers/utilities';
import { getEthPriceNow } from 'get-eth-price';
import { BidStatus } from 'SDK/ContractsSDK';

interface IProps {
  price: number;
  bidder: string;
  status: BidStatus;
  isNftCreator: boolean;
  onAcceptClick: () => void;
  onRejectClick: () => void;
}

const Offer: FC<IProps> = ({ price, bidder, status, isNftCreator, onAcceptClick, onRejectClick }) => {
  const [USDPrice, setUSDPrice] = useState<string>('0');
  const history = useHistory();

  const goToAddress = useCallback(() => {
    history.push(`/my-collection/${bidder}`)
  }, [bidder]);

  useEffect(() => {
    const parseEtherUSD = async () => {
      const result = await getEthPriceNow();
      // tslint:disable-next-line: no-string-literal
      const ethUSD = result[Object.keys(result)[0]]['ETH']['USD'];
      setUSDPrice((price * ethUSD).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    }

    if (price > 0) {
      parseEtherUSD();
    }
  }, [price]);

  return (
    <OfferContainer>
      {status === BidStatus.Idle &&
        <Fragment>
          <PriceETH>
            <ValueIcon />
            <div>{`${price} ETH`}</div>
          </PriceETH>
          <PriceUSD>{`$${USDPrice}`}</PriceUSD>
          <Bidder onClick={goToAddress}>{ellipseAddress(bidder, 5)}</Bidder>
          {isNftCreator &&
            <OfferButtonsWrapper>
            <AcceptButtonWrapper>
              <Button
                title={'Accept'}
                width={"50px"}
                height={"25px"}
                onClick={onAcceptClick}
              />
            </AcceptButtonWrapper>
            <RejectButtonWrapper>
              <Button
                title={'Reject'}
                width={"50px"}
                height={"25px"}
                onClick={onRejectClick}
              />
            </RejectButtonWrapper>
            </OfferButtonsWrapper>
          }
        </Fragment>
      }
    </OfferContainer>
  );
};

export default Offer;

const OfferContainer = styled.div`
  display: flex;
  align-items: center;

  width: 100%;
  padding: 20px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid rgb(229, 232, 235);
  :last-of-type {
    margin-bottom: 0;
    border-bottom: none;
  }
`;

const PriceETH = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600px;
  width: 28%;
  overflow-x: scroll;
  white-space: nowrap;
  padding: 0 5px;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const ValueIcon = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  background: transparent url(${ethereumImage}) center center no-repeat;
  background-size: contain;
`;

const PriceUSD = styled.div`
  font-size: 14px;
  color: rgb(112, 122, 131);
  width: 28%;
  white-space: nowrap;
  padding: 0 5px;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const Bidder = styled.div`
  font-size: 14px;
  color: #2081E2;
  width: 28%;
  white-space: nowrap;
  padding: 0 5px;
  cursor: pointer;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const OfferButtonsWrapper = styled.div`
  width: 17%;
  display: flex;
  justify-content: flex-end;
`;

const AcceptButtonWrapper = styled.div`
  background-color: #006400;
  border-radius: 8px;
  z-index: 2;
  margin: 0 5px;
  > div {
    color: #fff;
  > div { font-size: 12px};
    :hover {
      color: rgba(255, 255, 255, 0.9);
      box-shadow: rgb(4 17 29 / 25%) 0px 0px 15px 0px;
      transition: all 0.2s ease 0s;
    }
  }
`;

const RejectButtonWrapper = styled(AcceptButtonWrapper as any)`
  background-color: #8b0000;
  > div {
    color: #fff;
  }
`;