import React, { FC, useCallback, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import Create from './Create';

const CreateBlock: FC = () => {
  const [activeBlock, setActiveBlock] = useState<number>(1);

  const onBlockClick = useCallback((id) => {
    setActiveBlock(id);
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

      <NewCreationWrapper active={activeBlock}>
        <Create
          header={activeBlock === 2 ? "Create a Collection" : "Create New Item"}
          name={activeBlock === 2 ? "Collection name" :  "Item name"}
          description={activeBlock === 2 ? "Collection description" : "Item description"}
        />
      </NewCreationWrapper>
    </CreateBlockWrapper>
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
