import React, { FC, useCallback, useContext, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { BlockHeader, Collections, NFTTokens } from 'components';
import { nftImage } from 'assets';
import { ICollection, INFTItem } from 'SDK/ContractsSDK';
import { AppStateContext, IConnectData } from './AppContextWrapper';

const MyCollections: FC = () => {
  const { state } = useContext(AppStateContext);
  const { connected, contractsSDK }: IConnectData = state;
  const [activeTab, setActiveTab] = useState<string>("Tokens");
  const[collections, setCollections] = useState<ICollection[]>([]);
  const[tokens, setTokens] = useState<INFTItem[]>([]);

  const changeTab = useCallback((tab) => {
    setActiveTab(tab);
  }, [setActiveTab]);

  useEffect(() => {
    const renderCollections = async () => {
      const result = await contractsSDK.getCollections();
      setCollections(result);
    }

    if (activeTab === "Tokens" && connected && contractsSDK) {
      renderCollections();
    }
  }, [connected, contractsSDK]);

  useEffect(() => {
    const renderTokens = async () => {
      const result = await contractsSDK.getNFTs();
      setTokens(result);
    }

    if (activeTab === "Collections" && connected && contractsSDK) {
      renderTokens();
    }
  }, [connected, contractsSDK]);


  return (
    <MyCollectionsWrapper>
      <BlockHeader
        image={nftImage}
        name={"unnamed"}
        creator={"0x2131231234512"}
        joinedDate={"October 2021"}
        showCreator={false}
      />
      <ActiveContent>
        <NFTTokensTab active={activeTab === "Tokens"} onClick={() => changeTab("Tokens")}>
          {"Tokens"}
        </NFTTokensTab>
        <CollectionsTab active={activeTab === "Collections"} onClick={() => changeTab("Collections")}>
          {"Collections"}
        </CollectionsTab>
      </ActiveContent>

      {activeTab === "Tokens" ? <NFTTokens tokens={tokens}/> : <Collections collections={collections}/>}
    </MyCollectionsWrapper>
  )
};

export default MyCollections;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const MyCollectionsWrapper = styled.div`
  display: flex;
  margin: 0 auto;
  width: 100%;
  justify-content: center;
  flex-direction: column;
  animation: ${fadeIn} 0.5s ease-out;
  padding-bottom: 20px;
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

const NFTTokensTab = styled.div<{ active: boolean }>`
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

const CollectionsTab = styled(NFTTokensTab as any)`
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 0 5px;
  height: 40px;
  cursor: pointer;
  text-align: left;
  background-color: ${({ active }) => active && 'rgba(0, 0, 0, 0.1)'};
  border-radius: 10px;
  transition: background-color .3s ease;
`;