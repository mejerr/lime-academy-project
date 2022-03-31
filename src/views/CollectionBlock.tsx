import React, { FC, useContext, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { BlockHeader, NFTTokens } from 'components';
import { nftImage } from 'assets';
import { AppStateContext, IConnectData } from './AppContextWrapper';
import { ICollection, INFTItem } from 'SDK/ContractsSDK';
import { useParams } from 'react-router-dom';

const CollectionBlock: FC = () => {
  const params: { id: string } = useParams();
  const { state } = useContext(AppStateContext);
  const { connected, contractsSDK }: IConnectData = state;
  const [tokens, setTokens] = useState<INFTItem[]>([]);
  const [collection, setCollection] = useState<ICollection | any>({});

  useEffect(() => {
    const renderCollection = async () => {
      const result: ICollection = await contractsSDK.getCollection(+params.id);
      setCollection(result);
    }

    const renderTokens = async () => {
      const result: INFTItem[] = await contractsSDK.getCollectionNFTs(+params.id);
      setTokens(result);
    }

    if (connected && contractsSDK) {
      renderCollection();
      renderTokens();
    }
  }, [connected, contractsSDK]);

  return (
    <CollectionBlockWrapper>
      <BlockHeader
        image={nftImage}
        name={collection.name}
        creator={collection.creator}
        description={collection.description}
      />
      {tokens.length ? <NFTTokens tokens={tokens} /> : <EmptyContent>{"No collections to show"}</EmptyContent>}
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

const EmptyContent = styled.div`
  font-size: 36px;
  text-align: center;
  padding: 40px;
`;