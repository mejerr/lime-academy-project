import React, { FC, useCallback, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';

const Menu: FC<RouteComponentProps> = ({ history } ) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = useCallback(() => {
    setMenuOpen(!menuOpen);
  }, [menuOpen]);

  return (
    <MenuWrapper onClick={openMenu}>
      <MenuIcon icon={faBars} />
      {menuOpen &&
        <MenuContent>
          <Button
            title={'Marketplace'}
            width={"100%"}
            onClick={() => history.push('/marketplace')}
            justifyContent={"flex-start"}
            arrow={true}
          />
          <Button
            title={'Create'}
            width={"100%"}
            onClick={() => history.push('/create')}
            justifyContent={"flex-start"}
            arrow={true}
          />
          <Button
            title={'My Collection'}
            width={"100%"}
            onClick={() => history.push('/collection')}
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
  cursor: pointer;

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
  position: absolute;
  top: 70px;
  left: 0;
  width: 100%;
  padding: 0 10px;
  background-color: red;
  animation: ${fadeIn} 0.5s forwards;
`;