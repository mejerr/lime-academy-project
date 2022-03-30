import React, { FC, useCallback } from 'react'
import { INFTItem } from 'SDK/ContractsSDK';
import styled from 'styled-components';
import Token from './Token';
interface IProps {
  tokens: INFTItem[]
}

const Tokens: FC<IProps> = ({ tokens }) => {
  const renderTokens = useCallback(({ collectionId, itemId, creator, name, price, image }) => {
    return (
      <Token
        key={itemId}
        collectionId={collectionId}
        tokenId={itemId}
        creator={creator}
        name={name}
        price={price}
        image={image}
      />
    );
  }, []);

  return (
    <TokensWrapper>
      {tokens.map(renderTokens)}
    </TokensWrapper>
  )
};

export default Tokens;

const TokensWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  padding: 30px 40px 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;