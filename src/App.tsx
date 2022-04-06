// tslint:disable: no-empty
import React, { FC, Suspense, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

import Homepage from './views/Homepage';
import Marketplace from 'views/Marketplace';
import MyCollections from 'views/MyCollections';
import CreateBlock from 'views/Create/CreateBlock';
import NFTTokenBlock from 'views/NFTTokenBlock/NFTTokenBlock';
import CollectionBlock from 'views/CollectionBlock';
import AppContextWrapper from 'AppContextWrapper';
import Header from 'components/Header/Header';


const App: FC = () => {
  const history = useHistory();

  const routes = () => (
    <StyledContent>
      <Switch>
        <Route
          path='/home'
          component={Homepage}
        />
        <Route
          path='/collection/:id/token/:id'
          component={NFTTokenBlock}
        />
        <Route
          path='/collection/:id'
          component={CollectionBlock}
        />
        <Route
          path='/marketplace'
          component={Marketplace}
        />
        <Route
          path='/create'
          component={CreateBlock}
        />
        <Route
          path='/my-collection/:id'
          component={MyCollections}
        />
        <Route
          path='/my-collection'
          exact
          component={MyCollections}
        />
        <Route path='/' exact component={Homepage} />
        <Redirect to='/' />
      </Switch>
    </StyledContent>
  );

  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });

    return () => {
      unlisten();
    }
  }, []);

    return (
      <AppContextWrapper>
        <StyledApp>
          <Header />
          <Suspense fallback={<p>...Loading</p>} >{routes()}</Suspense>
        </StyledApp>
      </AppContextWrapper>
    );
};

export default App;

export const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const StyledApp = styled.div`
  width: 100%;
`;

const StyledContent = styled.div`
`;