import React, { FC, useState, ChangeEvent, useCallback } from 'react'
import { emptyImage } from 'assets';
import { Button } from 'components';
import styled from 'styled-components'
import { fadeIn } from '../Marketplace';

interface IProps {
  header: string;
  image?: string;
  name: string;
  description: string;
  onClick?: () => void;
}

const Create: FC<IProps> = ({
  header,
  name = "",
  description = "",
  onClick
}) => {
  const [inputName, setInputName] = useState("");
  const [inputDescription, setInputDescription] = useState("");

  const onNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInputName(event.target.value);
  }, [inputName]);

  const onDescriptionChange = useCallback((event) => {
    setInputDescription(event.target.value);
  }, [inputDescription]);

  return (
    <CreateWrapper>
      <Header>{header}</Header>
      <RequiredFieldsWrapper>
        <RequiredFields>{"Required fields"}</RequiredFields>
        <Title>{"Image"}</Title>
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
      </RequiredFieldsWrapper>

      <CreateButtonWrapper>
        <Button
          title={"Create"}
          width={"170px"}
          height={"50px"}
          onClick={onClick}
        />
      </CreateButtonWrapper>
    </CreateWrapper>
  );
};

export default Create;

const CreateWrapper = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
  padding-bottom: 20px;
`;

const Header = styled.div`
  font-size: 40px;
  font-weight: bold;
  padding: 20px 40px 40px 20px;
`;

const RequiredFieldsWrapper = styled.div`
  min-width: 772px;
  width: 100%;
`;

const RequiredFields = styled.div`
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

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  padding: 20px;
  position: relative;

  ::after {
    position: absolute;
    width: 10px;
    height: 10px;
    top: 20px;
    content: "  *";
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

const CreateButtonWrapper = styled.div`
  position: relative;
  width: 170px;
  text-align: center;
  background-color: #024bb0;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  margin: 0 10px;
  border-radius: 10px;
  border: 1px solid #024bb0;
  cursor: pointer;

  :hover {
    box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
    transition: all 0.2s ease 0s;
  }
  > div {
    color: #fff;
    margin: 0;
    border-radius: 10px;
    :hover {
      color: #fff;
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
`;