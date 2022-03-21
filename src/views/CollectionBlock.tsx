import React, { FC } from 'react'
import styled from 'styled-components'
import { Block, NFTTokens } from 'components';
import { fadeIn } from 'App';

const CollectionBlock: FC = () => {
  return (
    <CollectionBlockWrapper>
      <Block />
      <NFTTokens />
    </CollectionBlockWrapper>
  );
};

export default CollectionBlock;

const CollectionBlockWrapper = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
`;