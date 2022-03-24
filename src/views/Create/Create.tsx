import React, { FC } from 'react'
import styled from 'styled-components'
import { Button} from 'components';
import RequiredFields from './RequiredFields';
import { fadeIn } from 'App';

interface IProps {
  header: string;
  image?: string;
  onClick?: () => void;
}

const Create: FC<IProps> = ({
  header,
  onClick
}) => {
  return (
    <CreateWrapper>
      <Header>{header}</Header>
      <RequiredFields />
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