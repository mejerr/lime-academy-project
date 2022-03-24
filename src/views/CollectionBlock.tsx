import React, { FC } from 'react'
import styled, { keyframes } from 'styled-components'
import { BlockHeader, NFTTokens } from 'components';
import { nftImage } from 'assets';

const TOKENS_DUMMY = [
  {
    collectionId: 0,
    tokenId: 0,
    name: "New generation",
    creator: "MisterPizza",
    price: 123.3,
    image: nftImage
  },
  {
    collectionId: 0,
    tokenId: 0,
    name: "New generation",
    creator: "MisterPizza",
    price: 123.3,
    image: nftImage
  },
  {
    collectionId: 0,
    tokenId: 0,
    name: "New generation",
    creator: "MisterPizza",
    price: 123.3,
    image: nftImage
  },
  {
    collectionId: 0,
    tokenId: 0,
    name: "New generation",
    creator: "MisterPizza",
    price: 123.3,
    image: nftImage
  },
  {
    collectionId: 0,
    tokenId: 0,
    name: "New generation",
    creator: "MisterPizza",
    price: 123.3,
    image: nftImage
  }
];

const CollectionBlock: FC = () => {
  return (
    <CollectionBlockWrapper>
      <BlockHeader
        image={nftImage}
        name={"New generation"}
        creator={'pesho232'}
        joinedDate={"October 2021"}
        description={
          `asdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz
          dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz
          dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsa dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz
          dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz
          dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsa dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz
          dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz`
        }
      />
      <NFTTokens tokens={TOKENS_DUMMY} />
    </CollectionBlockWrapper>
  );
};

export default CollectionBlock;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const CollectionBlockWrapper = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
`;