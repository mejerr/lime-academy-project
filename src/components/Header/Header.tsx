import React, { FC } from 'react'
import styled from 'styled-components'
import Menu from './Menu';
import NavBar from './NavBar';
import ConnectButton from './ConnectButton';
import { limeblockLogo } from "assets";
import { RouteComponentProps, withRouter } from 'react-router-dom';

const Header: FC<RouteComponentProps> = ({ history }) => {
  const onClick = () => history.push("/home");

  return (
    <HeaderWrapper >
      <Logo onClick={onClick}/>
      <Menu />
      <NavBar />
      <Title onClick={onClick}>{"Limeblock Marketplace"}</Title>
      <ConnectButton />
    </HeaderWrapper>
  )
}

export default withRouter(Header);

const HeaderWrapper = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 10px 10px;
  box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
  position: sticky;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 1;
`;

const Logo = styled.div`
  width: 50px;
  height: 50px;
  margin-right: 10px;
  background: url(${limeblockLogo}) center center no-repeat;
  background-size: contain;
  flex-shrink: 0;
  cursor: pointer;
`;

const Title = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  width: 100px;
  color: black;
  font-size: 40px;
  text-align: center;
  cursor: pointer;

  @media (max-width: 1000px) {
    font-size: 34px;
  }

  @media (max-width: 670px) {
    font-size: 28px;
  }
`;