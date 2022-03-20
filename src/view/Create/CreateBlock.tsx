import React, { FC, useCallback, useState } from 'react'
import styled from 'styled-components'
import { fadeIn } from '../Marketplace';
import NFTTokens from 'view/NFTTokens/NFTTokens';

const CreateBlock: FC = () => {
  const [activeBlock, setActiveBlock] = useState<number>(1);

  const onBlockClick = useCallback((id) => {
    setActiveBlock(id)
  }, []);

  return (
    <CreateBlockWrapper>
      <ActiveCreateBlock>
        <ActiveBlock active={activeBlock === 1} onClick={() => onBlockClick(1)}>
          {"New Item"}
        </ActiveBlock>
        <ActiveBlock active={activeBlock === 2} onClick={() => onBlockClick(2)}>
          {"New Collection"}
        </ActiveBlock>
      </ActiveCreateBlock>

      {/* <CreateItemWrapper></CreateItemWrapper> */}
      {/* <CreateCollectionWrapper></CreateCollectionWrapper> */}
    </CreateBlockWrapper>
  );
};

export default CreateBlock;

const CreateBlockWrapper = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
`;

const ActiveCreateBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90px;
  width: 100%;
`;

const ActiveBlock = styled.div<{ active: boolean }>`
  padding: 20px;
  margin: 0 5px;
  width: 150px;
  text-align: center;
  border: 1px solid rgb(112, 122, 131);
  border-radius: 10px;
  color: rgb(112, 122, 131);
  cursor: pointer;
  background-color: ${({ active }) => active && 'rgba(0, 0, 0, 0.1)'};
  transition: all 0.5s ease-out;

  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;