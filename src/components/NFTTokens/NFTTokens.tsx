import React, { FC, useCallback } from 'react'
import { INFTItem } from 'SDK/ContractsSDK';
import styled from 'styled-components';
import Token from './Token';
interface IProps {
  tokens: INFTItem[]
}

const Tokens: FC<IProps> = ({ tokens }) => {
  const renderTokens = useCallback(({ collectionId, itemId, creator, name, price, image, status }) => {
    return (
      <Token
        key={itemId}
        collectionId={collectionId}
        tokenId={itemId}
        creator={creator}
        name={name}
        price={price}
        image={image}
        status={status}
      />
    );
  }, []);

  return (
    <TokensWrapper isContent={!!tokens.length}>
      {tokens.length ? tokens.map(renderTokens) : <EmptyContent>{"No items to show"}</EmptyContent>}
    </TokensWrapper>
  )
};

export default Tokens;

const TokensWrapper = styled.div<{ isContent: boolean }>`
  display: ${({ isContent }) => isContent && 'grid'};
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