import React, { FC } from 'react'
import styled, { keyframes } from 'styled-components'
import { Collections } from 'components';
import { nftImage } from 'assets';

const COLLECTIONS_DUMMY = [
  {
    id: 0,
    image: nftImage,
    smallImage: nftImage,
    name: "New generation",
    creator: "MisterPizza",
    description: "asdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsa"
  },
  {
    id: 1,
    image: nftImage,
    smallImage: nftImage,
    name: "New generation",
    creator: "MisterPizza",
    description: "asdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsa"
  },
  {
    id: 2,
    image: nftImage,
    smallImage: nftImage,
    name: "New generation",
    creator: "MisterPizza",
    description: "asdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsa"
  },  {
    id: 3,
    image: nftImage,
    smallImage: nftImage,
    name: "New generation",
    creator: "MisterPizza",
    description: "asdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsa"
  }
];

const Marketplace: FC = () => {
  return (
    <MarketplaceWrapper>
      <MarketplaceTitle>{"Explore collections"}</MarketplaceTitle>
      <Collections collections={COLLECTIONS_DUMMY}/>
    </MarketplaceWrapper>
  );
};

export default Marketplace;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const MarketplaceWrapper = styled.div`
  display: flex;
  margin: 0 auto;
  width: 100%;
  max-width: min(1280px, 100% - 40px);
  justify-content: center;
  flex-direction: column;
  padding-bottom: 20px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const MarketplaceTitle = styled.div`
  width: 100%;
  text-align: center;
  color: black;
  font-size: 24px;
  padding: 60px 20px 60px;
  border-bottom: 1px solid grey;

  @media (max-width: 670px) {
    font-size: 20px;
    padding: 40px 20px;
  }
`;