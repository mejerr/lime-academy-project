import React, { FC } from 'react'
import styled from 'styled-components'
import { Block } from 'components';
import { fadeIn } from 'App';
import NFTTokens from 'views/NFTTokens/NFTTokens';

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