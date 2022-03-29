// tslint:disable: no-empty
import React, { ChangeEvent, FC, useCallback, useContext, useState } from 'react';
import { AppStateContext } from 'SDK/WalletConnectSDK';
import styled, { css, keyframes } from 'styled-components';
import Create from './Create';

interface ICreateState {
  name: string;
  description: string;
  inputName: string;
  inputDescription: string;
}

const INITIAL_STATE: ICreateState = {
  name: '',
  description: '',
  inputName: '',
  inputDescription: '',
};

export const CreateStateContext = React.createContext({
  state: INITIAL_STATE,
  onNameChange: (event: ChangeEvent<HTMLInputElement>): void => {},
  onDescriptionChange: (event: ChangeEvent<HTMLTextAreaElement>): void => {},
});

const CreateBlock: FC = () => {
  const { state: { contractsSDK } } = useContext(AppStateContext);

  const [activeBlock, setActiveBlock] = useState<number>(1);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");

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

  const onBlockClick = useCallback((id) => {
    setActiveBlock(id);
  }, []);

  const onCreateItem = useCallback(() => {
    if (contractsSDK) {
      contractsSDK.createCollection(collectionName, collectionDescription);
    }
  }, [collectionName, collectionDescription, contractsSDK]);

  const onCreateCollection = useCallback(() => {
    if (contractsSDK) {
      contractsSDK.createCollection(collectionName, collectionDescription);
    }
  }, [collectionName, collectionDescription, contractsSDK]);

  return (
    <CreateStateContext.Provider
      value={{
        state: {
          name: activeBlock === 1 ? "Item name" : "Collection name",
          description: activeBlock === 1 ? "Item description" : "Collection description",
          inputName: activeBlock === 1 ? itemName : collectionName,
          inputDescription: activeBlock === 1 ? itemDescription : collectionDescription
        },
        onNameChange: (e: ChangeEvent<HTMLInputElement>) =>
          activeBlock === 1 ? onItemNameChange(e) : onCollectionNameChange(e),
        onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) =>
          activeBlock === 1 ? onItemDescriptionChange(e) : onCollectionDescriptionChange(e),
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

export default CreateBlock;

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
