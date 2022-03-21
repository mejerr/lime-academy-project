import React, { FC, useState, ChangeEvent, useCallback } from 'react'
import styled from 'styled-components'
import { emptyImage } from 'assets';
import { SelectableMenu } from 'components';

const TITLES = {
  0: { title: "Marketplace"},
  1: { title: "Create"},
  2: { title: "My Collection"},
};

export interface IOption {
  width: string;
  height: string;
  onClick: (id: number) => void;
  justifyContent: string;
  arrow?: boolean;
}

export interface ITitle {
  title: string;
}

interface IProps {
  name: string;
  description: string;
}

const RequiredFields: FC<IProps> = ({
  name = "",
  description = ""
}) => {
  const [inputName, setInputName] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [selected, setSelected] = useState<number>(0);

  const onSelect = useCallback((id) => {
    setSelected(id);
  }, []);

  const onNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInputName(event.target.value);
  }, [inputName]);

  const onDescriptionChange = useCallback((event) => {
    setInputDescription(event.target.value);
  }, [inputDescription]);

  const collectionTitles: ITitle[] = [];
  for (let i = 0; i < 3; i++) {
    const collectionTitle: string = TITLES[i].title;
    collectionTitles.push({ title: collectionTitle });
  }

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
        <Image image={emptyImage}/>
      </ImageWrapper>

      <SectionWrapper>
        <Section>{"Name"}</Section>
        <NameInput
          placeholder={name}
          value={inputName}
          onChange={(e) => onNameChange(e)}
        />
      </SectionWrapper>

      <SectionWrapper>
        <Section>{"Description"}</Section>
        <DescriptionInput
          placeholder={description}
          value={inputDescription}
          onChange={(e) => onDescriptionChange(e)}
        />
      </SectionWrapper>

      <SectionWrapper>
        <Section>{"Choose Collection"}</Section>
        <SelectableMenu titles={collectionTitles} options={OPTIONS} selected={selected}/>
      </SectionWrapper>
    </RequiredFieldsWrapper>
  );
};

export default RequiredFields;

const RequiredFieldsWrapper = styled.div`
  min-width: 772px;
  width: 100%;
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
  width: 350px;
  height: 250px;
  border: 3px dashed rgb(204, 204, 204);
  padding: 10px;
  border-radius: 10px;
`;

const Image = styled.div<{ image: string }>`
  width: 100%;
  height: 100%;
  border-radius: 10px;

  background: ${({ image}) => image && `transparent url(${image}) center center no-repeat`};
  background-size: cover;
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
  outline: none !important;
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
  outline: none !important;
  border: 1px solid rgb(229, 232, 235);

  :focus {
    box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
  }
`;