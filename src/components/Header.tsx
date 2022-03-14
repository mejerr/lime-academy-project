import React, { FC } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import limeblockLogo from "../assets/limeblock-logo.png";
import Button from './Button';

const Header: FC<RouteComponentProps> = ({ history} ) => {
  const { location, push } = history;
  const { pathname } = location;
  console.log(pathname);
  return (
    <HeaderWrapper >
      <Logo />
      <Button title={'Marketplace'} isActive={pathname === "/marketplace"} width={110} onClick={() => history.push('/marketplace')} />
      <Button title={'Create'} isActive ={pathname === "/create"} width={80} onClick={() => history.push('/create')} />
      <SiteTitle>{"Limeblock"}</SiteTitle>
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px;
  box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
`;

const Logo = styled.div`
  width: 50px;
  height: 50px;
  margin-right: 10px;
  background: transparent url(${limeblockLogo}) top center no-repeat;
  background-size: contain;
`;

const SiteTitle = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  width: 100px;
  color: black;
  font-size: 25px;
`;

export default withRouter(Header);
