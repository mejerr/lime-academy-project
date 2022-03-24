import React, { FC, useCallback, useContext } from 'react'
import { AppStateContext } from 'App';
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import Button from '../Button';

interface INavButtons {
  title: string,
  isActive: boolean,
  width: string,
  onClick: () => void
}

const NavBar: FC<RouteComponentProps> = ({ history }) => {
  const { pathname } = history.location;
  const { state, onConnect } = useContext(AppStateContext);
  const { connected } = state;

  const onClick = useCallback((pathname) => {
    if (!connected) {
        onConnect({ onSuccess: () => history.push(pathname) });
        return;
     }

     history.push(pathname);
  }, [connected]);

  const NAV_BUTTONS: INavButtons[] =  [
    {
      title: 'Marketplace',
      isActive: pathname === "/marketplace",
      width: "110px",
      onClick: () => onClick("/marketplace")
    },
    {
      title: 'Create',
      isActive: pathname === "/create",
      width: "80px",
      onClick: () => onClick("/create")
    },
    {
      title: 'My Collection',
      isActive: pathname === "/my-collection",
      width: "100px",
      onClick: () => onClick("/my-collection")
    }
  ];

  const renderNavButtons = useCallback(({ title, isActive, width, onClick }, index) => (
    <Button
      key={index}
      title={title}
      isActive={isActive}
      width={width}
      onClick={onClick}
    />
  ), []);

  return (
    <NavBarWrapper>
      {NAV_BUTTONS.map(renderNavButtons)}
    </NavBarWrapper>
  )
}

const NavBarWrapper = styled.div`
  display: flex;

  @media (max-width: 900px) {
    display: none;
  }
`;

export default withRouter(NavBar);
