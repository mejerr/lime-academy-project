// tslint:disable: no-empty
import React, { FC, Suspense, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

import Homepage from './views/Homepage';
import Marketplace from 'views/Marketplace';
import MyCollections from 'views/MyCollections';
import CreateBlock from 'views/Create/CreateBlock';
import TokenBlock from 'views/TokenBlock/TokenBlock';
import CollectionBlock from 'views/CollectionBlock';
import AppContextWrapper, { AppStateContext } from 'AppContextWrapper';
import Header from 'components/Header/Header';

const App: FC = () => {
  const { state } = useContext(AppStateContext);
  const { connected } = state;

  const history = useHistory();

  const routes = () => (
    <Switch>
      <Route
        path='/home'
        component={Homepage}
      />
      <Route
        path='/collection/:id/token/:id'
        component={TokenBlock}
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
  );

  useEffect(() => {
    if (!connected) {
      history.push('/');
    }

    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });

    return () => {
      unlisten();
    }
  }, [connected, history]);

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

const StyledApp = styled.div`
  width: 100%;
`;