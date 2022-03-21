import React, { FC, useCallback, useContext } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Button } from "components";
import { AppStateContext, fadeIn } from 'App';
import { nftImage } from 'assets';

const Homepage: FC<RouteComponentProps> = ({ history }) => {
  const { state, onConnect } = useContext(AppStateContext);
  const { connected } = state;

  const onClick = useCallback((pathname) => {
    if (!connected) {
        onConnect({ onSuccess: () => history.push(pathname) });
        return;
     }

     history.push(pathname);
  }, [connected]);

  return (
    <HomepageWrapper >
      <HomepageContent>
        <LeftPanel>
          <Title>{"Discover, collect, and sell \n extraordinary NFTs"}</Title>
          <Subtitle>{"LimeBlock is the world's first and largest NFT marketplace"}</Subtitle>
          <ButtonsWrapper>
            <MarketplaceButtonWrapper>
              <Button
                title={'Marketplace'}
                width={"100%"}
                height={"50px"}
                onClick={() => onClick("/marketplace")}
              />
            </MarketplaceButtonWrapper>
            <ButtonWrapper>
              <Button
                title={'Create'}
                width={"100%"}
                height={"50px"}
                onClick={() => onClick("/create")}
              />
            </ButtonWrapper>
          </ButtonsWrapper>
        </LeftPanel>

        <RightPanel>
          <ImageWrapper onClick={() => onClick("/marketplace")}>
            <NFTImage />
          </ImageWrapper>
        </RightPanel>
      </HomepageContent>
    </HomepageWrapper>
  )
};

export default withRouter(Homepage);

const HomepageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  animation: ${fadeIn} 0.5s ease-out;
`;

const HomepageContent = styled.div`
  display: flex;
  margin: 0 auto;
  width: 100%;
  max-width: min(1280px, 100% - 40px);
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 50%;
  padding: 70px 20px 0;
`;

const Title = styled.div`
  font-size: 45px;
  max-width: 100%;
`;

const Subtitle = styled.div`
  font-size: 24px;
  margin: 20px 0 40px;
  max-width: 400px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
`;

const ButtonWrapper = styled.div`
  width: 150px;
  height: 50px;
  margin: 0 10px;
  border-radius: 10px;
  border: 1px solid #024bb0;

  > div {
    color: #024bb0;
    margin: 0;
    border-radius: 10px;
    :hover {
      box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
      transition: all 0.2s ease 0s;
      color: #024bb0;
    }
  }
`;

const MarketplaceButtonWrapper = styled(ButtonWrapper as any)`
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

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 50%;
  padding-top: 50px;
`;

const ImageWrapper = styled.div`
  width: 550px;
  height: 550px;
  cursor: pointer;

  @media (max-width: 1300px) {
    max-width: 550px;
    max-height: 440px;
  }

  @media (max-width: 1100px) {
    max-width: 460px;
    max-height: 400px;
    margin-top: 30px;
  }

  @media (max-width: 1000px) {
    max-width: 360px;
    max-height: 370px;
    margin-top: 30px;
  }
`;

const NFTImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-width: 100%;
  max-height: 100%;
  background: transparent url(${nftImage}) center center no-repeat;
  background-size: cover;
  object-fit: cover;
  flex-shrink: 0;
`;
