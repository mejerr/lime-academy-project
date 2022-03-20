import React, { FC } from 'react'
import styled from 'styled-components';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button } from 'components';
import { ethereumImage } from 'assets';

const Offer: FC<RouteComponentProps> = ({ history }) => {
  return (
    <OfferContainer>
      <PriceETH>
        <ValueIcon />
        <div>{"1.67 ETH"}</div>
      </PriceETH>
      <PriceUSD>{"$123.123.123"}</PriceUSD>
      <Bidder>{"manskin"}</Bidder>
      <OfferButtonsWrapper>
        <AcceptButtonWrapper>
          <Button
            title={'Accept'}
            width={"50px"}
            height={"25px"}
          />
        </AcceptButtonWrapper>
        <RejectButtonWrapper>
          <Button
            title={'Reject'}
            width={"50px"}
            height={"25px"}
          />
        </RejectButtonWrapper>
      </OfferButtonsWrapper>
    </OfferContainer>
  );
};

export default withRouter(Offer);

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