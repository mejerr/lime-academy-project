import React, { FC, useCallback, useContext, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { AppStateContext } from 'SDK/WalletConnectSDK';
import { ITitle } from 'views/Create/RequiredFields';
import { SelectableMenu } from 'components';

const TITLES: ITitle[] = [
  { title: "Marketplace"},
  { title: "Create"},
  { title: "My Collection"}
];

enum PATHS {
  '/marketplace',
  '/create',
  '/my-collection'
}

const Menu: FC<RouteComponentProps> = ({ history } ) => {
  const { state, onConnect } = useContext(AppStateContext);
  const { connected } = state;

  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = useCallback(() => {
    setMenuOpen(!menuOpen);
  }, [menuOpen]);

  const onClick = useCallback((pathId) => {
    if (!connected) {
        onConnect({ onSuccess: () => {
          history.push(PATHS[pathId]);
          setMenuOpen(false);
        } });
        return;
     }

     history.push(PATHS[pathId]);
     setMenuOpen(false);
  }, [connected]);

  const OPTIONS = {
    width: "100%",
    height: '70px',
    onClick: (pathId: number) => onClick(pathId),
    justifyContent: "flex-start",
    arrow: true
  };

  return (
    <MenuWrapper>
      <MenuIcon icon={faBars} onClick={openMenu} />
      {menuOpen &&
        <MenuContent>
          <SelectableMenu showSelected={false} titles={TITLES} options={OPTIONS}/>
        </MenuContent>
      }
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

const slideFromLeftIn = keyframes`
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
`;

const MenuContent = styled.div`
  height: calc(100vh - 70px);
  position: absolute;
  top: 70px;
  left: 0;
  width: 100%;
  padding: 0 10px;
  background-color: #fff;
  animation: ${slideFromLeftIn} 0.5s forwards;
`;