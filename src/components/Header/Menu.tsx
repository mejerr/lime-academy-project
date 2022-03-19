import React, { FC, useCallback, useContext, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import { AppStateContext } from 'App';

const Menu: FC<RouteComponentProps> = ({ history } ) => {
  const { state, onConnect } = useContext(AppStateContext);
  const { connected } = state;

  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = useCallback(() => {
    setMenuOpen(!menuOpen);
  }, [menuOpen]);

  const onClick = useCallback((pathname) => {
    if (!connected) {
        onConnect({ onSuccess: () => {
          history.push(pathname);
          setMenuOpen(false);
        } });
        return;
     }

     history.push(pathname);
     setMenuOpen(false);
  }, [connected]);

  return (
    <MenuWrapper>
      <MenuIcon icon={faBars} onClick={openMenu} />
      {menuOpen &&
        <MenuContent>
          <Button
            title={'Marketplace'}
            width={"100%"}
            onClick={() => onClick('/marketplace')}
            justifyContent={"flex-start"}
            arrow={true}
          />
          <Button
            title={'Create'}
            width={"100%"}
            onClick={() => onClick('/create')}
            justifyContent={"flex-start"}
            arrow={true}
          />
          <Button
            title={'My Collection'}
            width={"100%"}
            onClick={() => onClick('/collection')}
            justifyContent={"flex-start"}
            arrow={true}
          />
      </MenuContent>}
    </MenuWrapper>
  )
}

export default withRouter(Menu);

const MenuWrapper = styled.div`
  width: 70px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 900px) {
    display: none;
  }

  @media (max-width: 500px) {
    width: 40px;
  }

  @media (max-width: 400px) {
    width: 20px;
  }
`;

const MenuIcon = styled(FontAwesomeIcon)`
  width: 25px;
  height: 30px;
  cursor: pointer;

  @media (max-width: 400px) {
    width: 20px;
  }
`;

const fadeIn = keyframes`
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
`;

const MenuContent = styled.div`
  height: calc(100vh - 70px);
  position: absolute;
  top: 70px;
  left: 0;
  width: 100%;
  padding: 0 10px;
  background-color: #fff;
  animation: ${fadeIn} 0.5s forwards;
`;