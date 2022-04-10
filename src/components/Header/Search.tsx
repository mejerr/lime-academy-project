import React, { ChangeEvent, Dispatch, FC, FocusEvent, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface IProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Search: FC<IProps> = ({ setIsOpen }) => {
  const [userAddress, setUserAddress] = useState<string>('');
  const inputNode = useRef<HTMLInputElement>(null);
  const history = useHistory();

  const onSearchInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUserAddress(e.target.value.substring(0, 2) === "0x" ? e.target.value.substring(2) : e.target.value);
  }, []);

  const onClick = useCallback((e) => {
    history.push(`/my-collection/0x${userAddress}`);
    setIsOpen(false);
  }, [userAddress, setIsOpen, history]);

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    const currentTarget = event.currentTarget;
    const id = requestAnimationFrame(() => {
      if (!currentTarget.contains(document.activeElement)) {
        setIsOpen(false);
      }
    });

    return () => cancelAnimationFrame(id);
  }

  useEffect(() => {
    if (inputNode.current) {
      inputNode.current.focus();
    }
  }, []);

  return (
    <SearchWrapper tabIndex={0} onBlur={onBlur}>
      <SearchInput ref={inputNode} placeholder={"0x..."} onChange={onSearchInputChange}/>
      <SearchIcon icon={faSearch} onClick={onClick}/>
    </SearchWrapper>
  )
}

export default Search;

const SearchWrapper = styled.div`
  width: initial !important;
  height: initial !important;
  position: absolute;
  top: 80px;
  left: 410px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid black;
  background: #024bb0;
  z-index: 10px;

  @media (max-width: 900px) {
    left: 90px;
  }

  @media (max-width: 500px) {
    left: 70px;
  }

  @media (max-width: 450px) {
    left: 65px;
  }
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