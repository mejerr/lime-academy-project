import React, { FC, useCallback, useState } from 'react'
import styled from 'styled-components'
import { fadeIn } from 'view/Marketplace';
import Button from 'components/Button';
import { IOption, ITitle } from 'view/Create/RequiredFields';

interface IProps {
  options: IOption;
  selected: number;
  titles: ITitle[];
}

const SelectableMenu: FC<IProps> = ({
  options,
  selected = 0,
  titles = []
}) => {
  const { width, height, onClick, justifyContent, arrow = false } = options;
  const [isOpen, setIsOpen] = useState(false);

  const onMenuClick = useCallback(() => {
    if (!titles.length) {
      return;
    }

    setIsOpen(!isOpen);
  }, [isOpen, options]);

  const renderOptions = ({ title }, index: number) => {
    return (
      <Button
        key={index}
        title={title}
        width={width}
        height={height}
        onClick={() => onClick(index)}
        justifyContent={justifyContent}
        arrow={arrow}
      />
    );
  };

  return (
    <SelectableMenuWrapper onClick={onMenuClick}>
      <Title isOpen={isOpen}>{titles[selected] ? titles[selected].title : "No collections added"}</Title>
      <OptionsWrapper isOpen={isOpen}>
        {titles.map(renderOptions)}
      </OptionsWrapper>
    </SelectableMenuWrapper>
  );
};

export default SelectableMenu;

const SelectableMenuWrapper = styled.div`
  position: relative;
  animation: ${fadeIn} 0.5s ease-out;
  width: calc(100% - 40px);
  height: 100%;

  margin: 20px 20px 30px;
  border: 1px solid black;
  border-radius: 10px;
`;

const SelectableOption = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
  width: 100%;
  border-bottom: 1px solid rgb(229, 232, 235);

  :last-of-type {
    border: none;
  }
`;

const Title = styled.div<{ isOpen: boolean }>`
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
  padding: 0 10px;
`;