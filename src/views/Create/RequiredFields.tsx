import React, { FC, useState, useCallback, useContext, ChangeEvent, useEffect } from 'react';
import styled from 'styled-components';
import { SelectableMenu } from 'components';
import { CreateStateContext } from './CreateBlock';
import { AppStateContext, IConnectData } from 'views/AppContextWrapper';
import { ICollection } from 'SDK/ContractsSDK';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

export interface IOption {
  width: string;
  height: string;
  onClick: (id: number) => void;
  justifyContent: string;
  arrow?: boolean;
}

export interface ICollectionProps {
  name: string;
  collectionId: number;
}

const RequiredFields: FC = () => {
  const {
    state: { name, description, inputName, inputDescription, fileUrl, activeBlock },
    onNameChange,
    onDescriptionChange,
    onImageChange,
    setSelectedCollectionId
  } = useContext(CreateStateContext);
  const { state } = useContext(AppStateContext);
  const { connected, contractsSDK, userAddress }: IConnectData = state;
  const [collectionProps, setCollectionProps] = useState<ICollectionProps[]>([]);

  const onSelect = useCallback((id) => {
    setSelectedCollectionId(id);
  }, []);

  useEffect(() => {
    const renderCollections = async () => {
      const collections: ICollection[] = await contractsSDK.getUserCollections(userAddress);
      const collectionProps: ICollectionProps[] = collections.map(({ name, collectionId }): ICollectionProps => ({ name, collectionId }));
      setCollectionProps(collectionProps);
    }

    if (connected && contractsSDK) {
      renderCollections();
    }
  }, [connected, contractsSDK]);

  const OPTIONS = {
    width: "100%",
    height: '50px',
    onClick: (id: number) => onSelect(id),
    justifyContent: "flex-start"
  };

  return (
      <RequiredFieldsWrapper>
        <RequiredFieldsTitle>{"Required fields"}</RequiredFieldsTitle>
        <Section>{"Image"}</Section>
        <ImageWrapper>
          <ImageInput
            type="file"
            name="Asset"
            onChange={onImageChange}
          />
          {fileUrl ? <Image src={fileUrl}/> : <EmptyIcon icon={faImage} />}
        </ImageWrapper>

        <SectionWrapper>
          <Section>{"Name"}</Section>
          <NameInput
            placeholder={name}
            value={inputName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onNameChange(e)}
          />
        </SectionWrapper>

        <SectionWrapper>
          <Section>{"Description"}</Section>
          <DescriptionInput
            placeholder={description}
            value={inputDescription}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onDescriptionChange(event)}
          />
        </SectionWrapper>

        {activeBlock === 1 && (
          <SectionWrapper>
            <Section>{"Choose Collection"}</Section>
            <SelectableMenu collectionProps={collectionProps} options={OPTIONS}/>
          </SectionWrapper>
        )}
      </RequiredFieldsWrapper>
  );
};

export default RequiredFields;

const RequiredFieldsWrapper = styled.div`
  min-width: 772px;
  width: 100%;

  @media (max-width: 830px) {
    min-width: 0;
  }
`;

const RequiredFieldsTitle = styled.div`
  font-size: 14px;
  color: rgb(112, 122, 131);
  padding: 20px 20px 0;
  position: relative;

  ::before {
    position: absolute;
    width: 10px;
    height: 10px;
    left: 10px;
    top: 20px;
    content: " *";
    color: rgb(235, 87, 87);
  }
`;

const ImageWrapper = styled.div`
  margin: 20px;
  width: 360px;
  height: 260px;

  border: 3px dashed rgb(204, 204, 204);
  padding: 10px;
  border-radius: 10px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  :hover {
    background-color: rgba(55, 55, 55, 0.1);
    transition: background-color 0.3s ease;
  }

  @media (max-width: 400px) {
    width: 250px;
  }
`;

const Image = styled.img`
  width: 340px;
  height: 240px;
  border-radius: 10px;
  flex-shrink: 0;
`;

const EmptyIcon = styled(FontAwesomeIcon)`
  width: 100px;
  height: 100px;
`;

const ImageInput = styled.input`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
`;

const SectionWrapper = styled.div`
  position: relative;
  color: rgb(53, 56, 64);
  width: 100%;
  height: 100%;
`;

const Section = styled.div`
  font-size: 20px;
  font-weight: bold;
  padding: 20px 20px 10px;
  color: inherit;
  position: relative;

  ::after {
    position: absolute;
    width: 10px;
    height: 10px;
    top: 20px;
    content: "*";
    color: rgb(235, 87, 87);
  }
`;

const NameInput = styled.input`
  font-size: 16px;
  padding: 20px;
  margin: 20px;
  width: calc(100% - 40px);
  border-radius: 10px;
  height: 55px;
  outline: none;
  border: 1px solid rgb(229, 232, 235);

  :focus {
    box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
  }
`;

const DescriptionInput = styled.textarea`
  font-size: 16px;
  padding: 20px;
  margin: 20px;
  width: calc(100% - 40px);
  border-radius: 10px;
  height: 150px;
  outline: none;
  border: 1px solid rgb(229, 232, 235);

  :focus {
    box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
  }
`;