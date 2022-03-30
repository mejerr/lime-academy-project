import React, { FC, useContext, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { BlockHeader, NFTTokens } from 'components';
import { nftImage } from 'assets';
import { AppStateContext, IConnectData } from './AppContextWrapper';
import { INFTItem } from 'SDK/ContractsSDK';

const CollectionBlock: FC = () => {
  const { state } = useContext(AppStateContext);
  const { connected, contractsSDK }: IConnectData = state;
  const[tokens, setTokens] = useState<INFTItem[]>([]);

  useEffect(() => {
    const renderTokens = async () => {
      const result = await contractsSDK.getNFTs();
      setTokens(result);
    }

    if (connected && contractsSDK) {
      renderTokens();
    }
  }, [connected, contractsSDK]);


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
      <NFTTokens tokens={tokens} />
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