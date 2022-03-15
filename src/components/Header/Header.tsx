import React, { FC, useCallback, useContext } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import limeblockLogo from "../../assets/limeblock-logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignIn } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import Menu from './Menu';
import { AppStateContext } from '../../App';
import { ellipseAddress } from '../../helpers/utilities';

const Header: FC<RouteComponentProps> = ( props ) => {
  const { state, onConnect, killSession } = useContext(AppStateContext);
  const { connected, address } = state;
  const { location, push } = props.history;
  const { pathname } = location;

  const onLogin = useCallback(() => {
    onConnect();
    push('/marketplace');
  }, []);

  return (
    <HeaderWrapper >
      <Logo />
      <Menu />
      <NavBar>
        <Button
          title={'Marketplace'}
          isActive={pathname === "/marketplace"}
          width={"110px"}
          onClick={() => push('/marketplace')}
          alignItems={"center"}
          justifyContent={"center"}
        />
        <Button
          title={'Create'}
          isActive ={pathname === "/create"}
          width={"80px"}
          onClick={() => push('/create')}
          alignItems={"center"}
          justifyContent={"center"}
        />
          <Button
            title={'My Collection'}
            isActive ={pathname === "/collection"}
            width={"100px"}
            onClick={() => push('/collection')}
            alignItems={"center"}
            justifyContent={"center"}
        />
      </NavBar>
      <SiteTitle>{"Limeblock Marketplace"}</SiteTitle>
      {connected ? (
        address && (
          <ActiveAccount>
            <Address connected={connected}>{ellipseAddress(address)}</Address>
            <DisconnectButton onClick={killSession}>
              {'Disconnect'}
            </DisconnectButton>
          </ActiveAccount>
        )
      ) :
        <ButtonWrapper>
          <LoginIcon icon={faSignIn}/>
          <Button
            title={'Login'}
            width={"60px"}
            alignItems={"center"}
            justifyContent={"center"}
            onClick={onLogin}
          />
        </ButtonWrapper>
      }
    </HeaderWrapper>
  )
}

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

const NavBar = styled.div`
  display: flex;

  @media (max-width: 1100px) {
    display: none;
  }
`;

const SiteTitle = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  width: 100px;
  color: black;
  font-size: 40px;
`;

const ButtonWrapper = styled.div`
  background-color: #024bb0;
  display: flex;
  align-items: center;

  > div {
    color: white;
  }
`;

const LoginIcon = styled(FontAwesomeIcon)`
  width: 25px;
  height: 25px;
  color: white;
  margin-left: 10px;
`;

const ActiveAccount = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-right: 10px;
  font-weight: 500;
`

const Address = styled.p<{ connected: boolean }>`
  font-size: 12px;
  font-weight: bold;
  margin: ${({ connected }) => (connected ? '-2px auto 0.7em' : '0')};
`
const DisconnectButton = styled.div`
  font-size: 9px;
  font-family: monospace;
  position: absolute;
  right: 0;
  top: 20px;
  opacity: 0.7;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.5;
  }
`

export default withRouter(Header);
