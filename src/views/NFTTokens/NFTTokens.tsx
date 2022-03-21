import React, { FC, useCallback } from 'react'
import styled from 'styled-components';
import { nftImage } from 'assets';
import Token from './Token';

const TOKENS_DUMMY = [
  {
    collection: 0,
    tokenId: 0,
    name: "New generation",
    creator: "MisterPizza",
    price: 123.3,
    image: nftImage
  }
];

const Tokens: FC = () => {
  const renderTokens = useCallback(({ collectionId, tokenId, creator, name, price, image }) => {
    return (
      <Token
        key={tokenId}
        collectionId={collectionId}
        tokenId={tokenId}
        creator={creator}
        name={name}
        price={price}
        image={image}
      />
    );
  }, []);

  return (
    <TokensWrapper>
      {TOKENS_DUMMY.map(renderTokens)}
    </TokensWrapper>
  )
};

export default Tokens;

const TokensWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  padding: 30px 40px 20px;

  @media (max-width: 700px) {
  grid-template-columns: repeat(1, 1fr);
  }
`;