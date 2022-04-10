import React, { FC, useCallback, useContext, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { ICollectionProps } from 'views/Create/RequiredFields';
import { SelectableMenu } from 'components';
import { AppStateContext, IConnectData } from 'AppContextWrapper';

const COLLECTION_PROPS: ICollectionProps[] = [
  { name: "Marketplace", collectionId: 1},
  { name: "Create", collectionId: 2},
  { name: "My Collection", collectionId: 3},
  { name: "Search", collectionId: 4}
];

enum PATHS {
  '/marketplace',
  '/create',
  '/my-collection'
}

interface IProps {
  onSearchClick: (open: boolean) => void;
}

const Menu: FC<IProps> = ({ onSearchClick } ) => {
  const { state, onConnect } = useContext(AppStateContext);
  const { connected }: IConnectData = state;
  const [menuOpen, setMenuOpen] = useState(false);

  const history = useHistory();

  const openMenu = useCallback(() => {
    setMenuOpen(!menuOpen);
    onSearchClick(false);
  }, [menuOpen]);

  const onSearchPathClick = useCallback((pathId: number) => {
    if (pathId === 4) {
      history.push(PATHS[pathId - 2]);
      onSearchClick(true);
    } else {
      history.push(PATHS[pathId - 1]);
    }
    setMenuOpen(false);
  }, [history]);

  const onClick = useCallback((pathId) => {
    if (!connected) {
        onConnect({ onSuccess: () => onSearchPathClick(pathId) });
        return;
     }

     onSearchPathClick(pathId);
  }, [connected, onConnect]);

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
          <SelectableMenu showSelected={false} collectionProps={COLLECTION_PROPS} options={OPTIONS}/>
        </MenuContent>
      }
    </MenuWrapper>
  );
}

export default Menu;

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