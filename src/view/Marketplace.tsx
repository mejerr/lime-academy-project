import React, { FC, useCallback, useContext } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Button } from "components";
import { AppStateContext } from 'App';
import { nftImage } from 'assets';

const Marketplace: FC<RouteComponentProps> = ({ history }) => {
  return (
    <MarketplaceWrapper>
      <MarketplaceTitle>{"Explore collections"}</MarketplaceTitle>
      <CollectionWrapper>
      {[1, 2, 3].map((el, index) => {
        return (
          <Collection key={index}>
            <Image />
            <SmallImageWrapper>

            <SmallImage />
            </SmallImageWrapper>
            <Title>{"New generation"}</Title>
            <Creator>creator <span>{"MisterPizza"}</span></Creator>
            <Description>{"asdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsa"}</Description>
          </Collection>
        );
      })}

      </CollectionWrapper>
    </MarketplaceWrapper>
  )
};

export default withRouter(Marketplace);

const MarketplaceWrapper = styled.div`
  display: flex;
  margin: 0 auto;
  width: 100%;
  max-width: min(1280px, 100% - 40px);
  justify-content: center;
  flex-direction: column;
  padding: 0 20px 30px;
`;

const MarketplaceTitle = styled.div`
  width: 100%;
  text-align: center;
  color: black;
  font-size: 30px;
  padding: 60px 20px 60px;
  border-bottom: 1px solid grey;
`;

const Collection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  border: 1px solid rgb(229, 232, 235);
  border-radius: 10px;
`;

const Title = styled.div`
  width: 100%;
  text-align: center;
  font-size: 16px;
  margin-bottom: 5px;
`;

const Description = styled.div`
  text-align: center;
  margin: 15px 0 15px;
  width: 100%;
  font-size: 16px;
  color: rgb(112, 122, 131);
  max-width: 80%;
  height: 60px;
  word-break: break-all;
  overflow: hidden;
`;

const Image = styled.div`
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 280px;
  width: 100%;

  background: transparent url(${nftImage}) top center no-repeat;
  background-size: cover;
`;

const SmallImageWrapper = styled.div`
  box-shadow: rgb(14 14 14 / 60%) 0px 0px 2px 0px;
  border: 3px solid rgb(251, 253, 255);

  border-radius: 50%;
  width: 40px;
  height: 40px;
  position: relative;
  top: -20px;
`;

const SmallImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;

  background: transparent url(${nftImage}) top center no-repeat;
  background-size: cover;`;


const Creator = styled.div`
  text-align: center;
  width: 100%;
  font-size: 14px;
  color: rgb(112, 122, 131);

  > span {
    color: rgb(32, 129, 226);
  }
`;

const CollectionWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 30px;
  margin-top: 30px;

  @media (max-width: 700px) {
  grid-template-columns: repeat(1, 1fr);
  }
`;