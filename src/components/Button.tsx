import React, { FC } from 'react';
import styled from 'styled-components';

interface IProps {
  title?: string;
  isActive?: boolean;
  width?: number;
  height?: number;
  onClick: () => void;
}

const Button: FC<IProps> = ({ title, isActive, width = 70, height = 70, onClick }) => {
  return (
    <StyledButton active={isActive} onClick={onClick} width={width} height={height}>
      {title && <Title>{title}</Title>}
    </StyledButton>
  );
};

export default Button;

const Title = styled.div`
  font-size: 16px;
`;

export const StyledButton = styled.div<{ active?: boolean, width: number, height: number }>`
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  margin-left: 5px;
  margin-right: 5px;
  align-items: center;
  display: flex;
  justify-content: center;

  font-family: "Popins, sans-serif";
  font-weight: 600;
  color: ${({ active }) => active ? 'black' : 'rgba(0, 0, 0, 0.6)'};

  border-color: ${({ active }) => active && 'rgb(48, 52, 54)'};
  border-bottom: ${({ active }) => active && '2px solid blue'};
  transition-property: border-bottom;
  transition-duration: 0.3s;

  :hover {
    color: ${({ active }) => active ? 'black' : 'rgba(0, 0, 0, 0.8)'};
    cursor: pointer;
  }
`;
