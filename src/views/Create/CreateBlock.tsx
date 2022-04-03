// tslint:disable: no-empty
import React, { ChangeEvent, FC, useCallback, useContext, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { AppStateContext, IConnectData } from 'views/AppContextWrapper';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import Create from './Create';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const client = ipfsHttpClient({ url: "https://ipfs.infura.io:5001/api/v0" });

interface ICreateState {
  name: string;
  description: string;
  inputName: string;
  inputDescription: string;
  fileUrl: string;
  selectedCollectionId: number;
  activeBlock: number;
}

const INITIAL_STATE: ICreateState = {
  name: '',
  description: '',
  inputName: '',
  inputDescription: '',
  fileUrl: '',
  selectedCollectionId: 1,
  activeBlock: 1
};

export const CreateStateContext = React.createContext({
  state: INITIAL_STATE,
  onNameChange: (event: ChangeEvent<HTMLInputElement>): void => {},
  onDescriptionChange: (event: ChangeEvent<HTMLTextAreaElement>): void => {},
  onImageChange: (event: ChangeEvent<HTMLInputElement>): void => {},
  setSelectedCollectionId: (id: number) => {}
});

const CreateBlock: FC<RouteComponentProps> = ({ history }) => {
  const { state } = useContext(AppStateContext);
  const { contractsSDK }: IConnectData = state;

  const [collectionFileUrl, setCollectionFileUrl] = useState<string>("");
  const [nftFileUrl, setNFTFileUrl] = useState<string>("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<number>(1);
  const [activeBlock, setActiveBlock] = useState<number>(1);
  const [itemName, setItemName] = useState<string>("");
  const [itemDescription, setItemDescription] = useState<string>("");
  const [collectionName, setCollectionName] = useState<string>("");
  const [collectionDescription, setCollectionDescription] = useState<string>("");

  const onBlockClick = useCallback((id) => {
    setActiveBlock(id);
  }, []);

  const onItemNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setItemName(event.target.value);
  }, [itemName]);

  const onItemDescriptionChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setItemDescription(event.target.value);
  }, [itemDescription]);

  const onCollectionNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setCollectionName(event.target.value);
  }, [collectionName]);

  const onCollectionDescriptionChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setCollectionDescription(event.target.value);
  }, [collectionDescription]);

  const uploadPicture = useCallback(async (e) => {
    const file = e.target.files[0];

    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      activeBlock === 1 ? setNFTFileUrl(url) : setCollectionFileUrl(url);
    } catch (error) {
      console.error('Error uploading file: ', error);
    }
  }, [activeBlock]);

  const uploadToIPFS = useCallback(async () => {
    const data = JSON.stringify({ itemName, itemDescription, image: nftFileUrl });

    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      return url;
    } catch (error) {
      console.error('Error uploading file: ', error);
      return;
    }
  }, [itemName, itemDescription, nftFileUrl]);

  const onCreateItem = useCallback(async () => {
    if (!itemName.length || !itemDescription.length || !nftFileUrl.length || !contractsSDK || !selectedCollectionId) {
      return;
    }

    const tokenURI = await uploadToIPFS();
    await contractsSDK.createNFTItem(tokenURI, itemName, itemDescription, selectedCollectionId);

    history.push(`/collection/${selectedCollectionId}`);
  }, [itemName, itemDescription, nftFileUrl, contractsSDK, selectedCollectionId]);

  const onCreateCollection = useCallback(async () => {
    if (!contractsSDK || !collectionName.length || !collectionDescription.length || !collectionFileUrl.length) {
      return;
    }

    await contractsSDK.createCollection(collectionFileUrl, collectionName, collectionDescription);

    history.push('/marketplace');
  }, [collectionName, collectionDescription, contractsSDK, collectionFileUrl]);

  return (
    <CreateStateContext.Provider
      value={{
        state: {
          name: activeBlock === 1 ? "Item name" : "Collection name",
          description: activeBlock === 1 ? "Item description" : "Collection description",
          inputName: activeBlock === 1 ? itemName : collectionName,
          inputDescription: activeBlock === 1 ? itemDescription : collectionDescription,
          fileUrl: activeBlock === 1 ? nftFileUrl : collectionFileUrl,
          selectedCollectionId,
          activeBlock
        },
        onNameChange: (e: ChangeEvent<HTMLInputElement>) =>
          activeBlock === 1 ? onItemNameChange(e) : onCollectionNameChange(e),
        onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) =>
          activeBlock === 1 ? onItemDescriptionChange(e) : onCollectionDescriptionChange(e),
        onImageChange: uploadPicture,
        setSelectedCollectionId
      }}
    >
      <CreateBlockWrapper>
        <ActiveCreateBlock>
          <ActiveBlock active={activeBlock === 1} onClick={() => onBlockClick(1)}>
            {"New Item"}
          </ActiveBlock>
          <ActiveBlock active={activeBlock === 2} onClick={() => onBlockClick(2)}>
            {"New Collection"}
          </ActiveBlock>
        </ActiveCreateBlock>

        <NewCreationWrapper active={activeBlock}>
          <Create
            header={activeBlock === 1 ? "Create New Item" : "Create a Collection"}
            onClick={activeBlock === 1 ? onCreateItem : onCreateCollection}
          />
        </NewCreationWrapper>
      </CreateBlockWrapper>
    </CreateStateContext.Provider>
  );
};

export default withRouter(CreateBlock);

const CreateBlockWrapper = styled.div`
  max-width: min(1280px, 100% - 40px);;
  margin: 0 auto;
`;

const ActiveCreateBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90px;
  width: 100%;
`;

const ActiveBlock = styled.div<{ active: boolean }>`
  padding: 10px;
  margin: 0 5px;
  width: 150px;
  text-align: center;
  border-radius: 10px;
  color: rgb(112, 122, 131);
  cursor: pointer;
  background-color: ${({ active }) => active && 'rgba(0, 0, 0, 0.1)'};
  transition: all 0.5s ease-out;

  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const slideRight = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0); }
`;

const slideLeft = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(0); }
`;

const NewCreationWrapper = styled.div<{ active: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${({ active }) => css`${active === 1 ? slideRight : slideLeft }`} 0.5s ease-in-out;
`;
