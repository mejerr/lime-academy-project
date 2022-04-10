import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { BlockHeader, Tokens } from 'components';
import { AppStateContext, IConnectData } from '../AppContextWrapper';
import { ICollection, IToken, TokenStatus } from 'SDK/ContractsSDK';
import { useParams } from 'react-router-dom';

const CollectionBlock: FC = () => {
  const params: { id: string } = useParams();
  const { state, setIsLoading } = useContext(AppStateContext);
  const { connected, contractsSDK }: IConnectData = state;
  const [tokens, setTokens] = useState<IToken[]>([]);
  const [collection, setCollection] = useState<ICollection | any>({});
  const [activeTab, setActiveTab] = useState<string>("All Tokens");

  const changeTab = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  useEffect(() => {
    const renderCollection = async () => {
      setIsLoading(true);
      const result: ICollection = await contractsSDK.getCollection(+params.id);
      setCollection(result);
    }

    const renderTokens = async () => {
      const result: IToken[] = await contractsSDK.getCollectionNFTs(+params.id);
      const filteredTokens: IToken[] = activeTab === "For Sale" ? result.filter(token => token.status === TokenStatus.ForSale) : result;
      setTokens(filteredTokens);
      setIsLoading(false);
    }

    if (connected && contractsSDK) {
      renderCollection();
      renderTokens();
    }
  }, [connected, contractsSDK, activeTab]);

  return (
    <CollectionBlockWrapper>
      <BlockHeader
        image={collection.image}
        name={collection.name}
        creator={collection.creator}
        description={collection.description}
      />
      <ActiveContent>
        <TokensForSaleTab active={activeTab === "All Tokens"} onClick={() => changeTab("All Tokens")}>
          {"All Tokens"}
        </TokensForSaleTab>
        <TokensTab active={activeTab === "For Sale"} onClick={() => changeTab("For Sale")}>
          {"For Sale"}
        </TokensTab>
      </ActiveContent>

      <Tokens tokens={tokens} />
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

const ActiveContent = styled.div`
  display: flex;
  width: calc(100% - 40px);
  height: 60px;
  margin: 0 20px;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid black;
`;

const TokensForSaleTab = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 0 5px;
  height: 40px;
  cursor: pointer;
  text-align: right;
  background-color: ${({ active }) => active && 'rgba(0, 0, 0, 0.1)'};
  border-radius: 10px;
  transition: background-color .3s ease;
`;

const TokensTab = styled(TokensForSaleTab as any)`
  text-align: left;
`;