import React, { FC } from 'react'
import styled from 'styled-components'
import { fadeIn } from '../Marketplace';
import { Block } from 'components';

const CollectionBlock: FC = () => {

  return (
    <CollectionBlockWrapper>
      <Block />
        {/* <NFTTokens /> */}
    </CollectionBlockWrapper>
  );
};

export default CollectionBlock;

const CollectionBlockWrapper = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
`;