import React, { FC, useCallback, useContext } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import Menu from './Menu';
import NavBar from './NavBar';
import Account from './Account';
import limeblockLogo from "../../assets/limeblock-logo.png";

const Header: FC = () => {
  return (
    <HeaderWrapper >
      <Logo />
      <Menu />
      <NavBar />
      <Title>{"Limeblock Marketplace"}</Title>
      <Account />
    </HeaderWrapper>
  )
}

export default Header;

const HeaderWrapper = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 10px 10px;
  box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
`;

const Logo = styled.div`
  width: 50px;
  height: 50px;
  margin-right: 10px;
  background: transparent url(${limeblockLogo}) top center no-repeat;
  background-size: contain;
  flex-shrink: 0;
`;

const Title = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  width: 100px;
  color: black;
  font-size: 40px;
`;