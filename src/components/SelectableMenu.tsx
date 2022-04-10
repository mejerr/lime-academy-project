import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components';
import { Button } from 'components';
import { IOption, ICollectionProps } from 'views/Create/RequiredFields';

interface IProps {
  options: IOption;
  showSelected?: boolean;
  collectionProps: ICollectionProps[];
}

const SelectableMenu: FC<IProps> = ({
  options,
  showSelected = true,
  collectionProps = []
}) => {
  const { width, height, onClick, justifyContent, arrow = false } = options;
  const [activeOption, setActiveOption] = useState<number>(0);
  const selectedTitle = collectionProps[activeOption] ? collectionProps[activeOption].name : "No collections added";
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onMenuClick = useCallback(() => {
    if (!collectionProps.length) {
      return;
    }

    setIsOpen(!isOpen);
  }, [isOpen, options]);

  const onOptionClick = useCallback((optionIndex, collectionId) => {
    setActiveOption(optionIndex);
    onClick(collectionId);
  }, []);

  const renderOptions = ({ name, collectionId }, index: number) => (
    <OptionWrapper key={collectionId}>
      <Button
        title={name}
        width={width}
        height={height}
        onClick={() => onOptionClick(index, collectionId)}
        justifyContent={justifyContent}
        arrow={arrow}
      />
    </OptionWrapper>
  );

  return (
    <SelectableMenuWrapper showSelected={showSelected} onClick={onMenuClick}>
      {showSelected && <SelectedTitle isOpen={isOpen}>{selectedTitle}</SelectedTitle>}
      <OptionsWrapper isOpen={showSelected ? isOpen : true}>
        {collectionProps.map(renderOptions)}
      </OptionsWrapper>
    </SelectableMenuWrapper>
  );
};

export default SelectableMenu;

const SelectableMenuWrapper = styled.div<{ showSelected: boolean }>`
  position: relative;
  width: calc(100% - 40px);
  height: 100%;

  margin: 20px 20px 30px;
  border: ${({ showSelected }) => showSelected ? '1px solid black' : 'none'};
  border-radius: 10px;
  cursor: pointer;
`;

const SelectedTitle = styled.div<{ isOpen: boolean }>`
  font-size: 18px;
  color: rgb(112, 122, 131);
  border-bottom: ${({ isOpen }) => isOpen && '1px solid rgb(229, 232, 235)'};
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  background-color: ${({ isOpen }) => isOpen && 'rgb(229, 232, 235)'};
  padding: 10px;
`;

const OptionsWrapper = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
  width: 100%;
  transition: all 1s ease;
`;

const OptionWrapper = styled.div`
  padding: 0 10px;
  width: 100%;
  height: 100%;

  :hover {
    background: rgba(0, 0, 0, 0.1);
  }
  > div {
    margin: 0;
    :hover {
      color: rgb(112, 122, 131);
    }
  }
`;