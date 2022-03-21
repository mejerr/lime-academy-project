import React, { FC } from 'react'
import styled, { keyframes } from 'styled-components'
import { Block, NFTTokens } from 'components';

const CollectionBlock: FC = () => {
  return (
    <CollectionBlockWrapper>
      <Block />
      <NFTTokens />
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