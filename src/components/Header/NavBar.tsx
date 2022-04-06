import React, { FC, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { AppStateContext, IConnectData } from 'AppContextWrapper';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import Button from '../Button';

interface INavButtons {
  title: string,
  isActive: boolean,
  width: string,
  onClick: () => void
}

interface IProps extends RouteComponentProps {
  onSearchClick: (open: boolean) => void;
}

const NavBar: FC<IProps> = ({  onSearchClick }) => {
  const history = useHistory();
  const { pathname } = history.location;
  const { state, onConnect } = useContext(AppStateContext);
  const { connected }: IConnectData = state;

  const onClick = useCallback((pathname) => {
    if (!connected) {
        onConnect({ onSuccess: () => history.push(pathname) });
        return;
     }

     history.push(pathname);
  }, [onConnect, connected]);

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
      isActive: pathname.startsWith("/my-collection"),
      width: "100px",
      onClick: () => onClick("/my-collection")
    },
    {
      title: 'Search',
      isActive: false,
      width: "80px",
      onClick: () => onSearchClick(true)
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

export default withRouter(NavBar);

const NavBarWrapper = styled.div`
  display: flex;

  @media (max-width: 900px) {
    display: none;
  }
`;

