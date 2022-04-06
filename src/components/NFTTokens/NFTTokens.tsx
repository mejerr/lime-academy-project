import React, { FC, useCallback } from 'react'
import { IToken } from 'SDK/ContractsSDK';
import styled from 'styled-components';
import Token from './Token';

interface IProps {
  tokens: IToken[]
}

const Tokens: FC<IProps> = ({ tokens }) => {
  const renderTokens = useCallback(({ collectionId, tokenId, creator, name, price, image, status }) => (
      <Token
        key={tokenId}
        collectionId={collectionId}
        tokenId={tokenId}
        creator={creator}
        name={name}
        price={price}
        image={image}
        status={status}
      />
    ), []);

  return (
    <TokensWrapper isNotEmpty={!!tokens.length}>
      {tokens.length ? tokens.map(renderTokens) : <EmptyContent>{"No items to show"}</EmptyContent>}
    </TokensWrapper>
  )
};

export default Tokens;

const TokensWrapper = styled.div<{ isNotEmpty: boolean }>`
  display: ${({ isNotEmpty }) => isNotEmpty && 'grid'};
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 10px;
  padding: 30px 40px 20px;

  @media (max-width: 2100px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (max-width: 1750px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 1450px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 750px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const EmptyContent = styled.div`
  font-size: 36px;
  text-align: center;
  padding: 40px;
`;