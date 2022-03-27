// tslint:disable: no-empty
import React, { Suspense } from 'react';
import styled, { keyframes } from 'styled-components';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/Header/Header';

import Homepage from './views/Homepage';
import Marketplace from 'views/Marketplace';
import MyCollections from 'views/MyCollections';
import CreateBlock from 'views/Create/CreateBlock';
import NFTTokenBlock from 'views/NFTTokenBlock/NFTTokenBlock';
import CollectionBlock from 'views/CollectionBlock';
import WalletConnectSDK from 'SDK/WalletConnectSDK';

class App extends React.Component<any, any> {
  public routes = () => (
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
          path='/my-collection'
          component={MyCollections}
        />
        <Route path='/' exact component={Homepage} />
        <Redirect to='/' />
      </Switch>
    </StyledContent>
  );

  public render = () => {
    return (
      <WalletConnectSDK>
          <StyledApp>
            <Header />
            <Suspense fallback={<p>...Loading</p>} >{this.routes()}</Suspense>
          </StyledApp>
      </WalletConnectSDK>
    );
  };
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
  padding-bottom: 20px;
`;