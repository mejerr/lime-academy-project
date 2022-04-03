import React, { ChangeEvent, Dispatch, FC, SetStateAction, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Search: FC<IProps> = ({ isOpen = false, setIsOpen }) => {
  const [userAddress, setUserAddress] = useState<string>('');
  const history = useHistory();

  const onSearchInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUserAddress(e.target.value.substring(0, 2) === "0x" ? e.target.value.substring(2) : e.target.value);
  }, []);

  const onClick = useCallback(() => {
    history.push(`/my-collection/0x${userAddress}`);
    setIsOpen(false);
  }, [userAddress, setIsOpen]);

  return (
    <SearchWrapper isOpen={isOpen}>
      <SearchInput placeholder={"0x..."} onChange={onSearchInputChange}/>
      <SearchIcon icon={faSearch} onClick={onClick}/>
    </SearchWrapper>
  )
}

export default Search;

const SearchWrapper = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 80px;
  left: 410px;
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid black;
  background: #024bb0;
`;

const SearchInput = styled.input`
  height: 30px;
  padding: 5px;
  border-top: none;
  border-left: none;
  border-right: none;
  background: white;
  border-radius: 8px;

  :focus {
    outline: none;
    border-top: none;
    border-left: none;
    border-right: none;
  }
`;

const SearchIcon = styled(FontAwesomeIcon)`
  width: 20px;
  height: 20px;
  margin-left: 10px;
  color: white;
  cursor: pointer;

  :hover {
    color: rgba(255, 255, 255, 0.6);
  }
`;