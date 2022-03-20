  // tslint:disable: no-empty
import React, { Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Column from './components/Column';
import Wrapper from './components/Wrapper';
import Header from './components/Header/Header';
import Loader from './components/Loader';
import ConnectButton from './components/ConnectButton';

import { Web3Provider } from '@ethersproject/providers';
import { getChainData } from './helpers/utilities';

import Homepage from './view/Homepage';
import Marketplace from 'view/Marketplace';
import CollectionBlock from 'view/Collections/CollectionBlock';
import MyCollections from 'view/MyCollections';
import NFTToken from 'view/NFTTokens/NFTToken';
import CreateBlock from 'view/Create/CreateBlock';

const SLayout = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  text-align: center;
`;

const SContent = styled(Wrapper)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

const SContainer = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
`;

const SLanding = styled(Column)`
  height: 600px;
`;

// @ts-ignore
const SBalances = styled(SLanding)`
  height: 100%;
  & h3 {
    padding-top: 30px;
  }
`;

interface IAppState {
  fetching: boolean;
  address: string;
  library: any;
  connected: boolean;
  chainId: number;
  pendingRequest: boolean;
  result: any | null;
  electionContract: any | null;
  info: any | null;
}

const INITIAL_STATE: IAppState = {
  fetching: false,
  address: '',
  library: null,
  connected: false,
  chainId: 1,
  pendingRequest: false,
  result: null,
  electionContract: null,
  info: null
};

export const AppStateContext = React.createContext({
  state: INITIAL_STATE,
  killSession: ({ onSuccess = () => {} }): void => {},
  onConnect: ({ onSuccess = () => {} }): void => {}
});

class App extends React.Component<any, any> {
  public web3Modal: Web3Modal;
  public state: IAppState;
  public provider: any;

  constructor(props: any) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };

    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: this.getProviderOptions()
    });
  }

  // public componentDidMount() {
  //   if (this.web3Modal.cachedProvider) {
  //     this.onConnect();
  //   }
  // }

  public onConnect = async ({ onSuccess = () => {} } = {}) => {
    this.provider = await this.web3Modal.connect();

    const library = new Web3Provider(this.provider);

    const network = await library.getNetwork();

    const address = this.provider.selectedAddress ? this.provider.selectedAddress : this.provider.accounts[0];

    await this.setState({
      library,
      chainId: network.chainId,
      address,
      connected: true
    });

    await this.subscribeToProviderEvents(this.provider);

    onSuccess();
  };

  public subscribeToProviderEvents = async (provider:any) => {
    if (!provider.on) {
      return;
    }

    provider.on("accountsChanged", this.changedAccount);
    provider.on("networkChanged", this.networkChanged);
    provider.on("close", this.close);

    await this.web3Modal.off('accountsChanged');
  };

  public async unSubscribe(provider:any) {
    // Workaround for metamask widget > 9.0.3 (provider.off is undefined);
    window.location.reload();
    if (!provider.off) {
      return;
    }

    provider.off("accountsChanged", this.changedAccount);
    provider.off("networkChanged", this.networkChanged);
    provider.off("close", this.close);
  }

  public changedAccount = async (accounts: string[]) => {
    if(!accounts.length) {
      // Metamask Lock fire an empty accounts array
      await this.resetApp();
    } else {
      await this.setState({ address: accounts[0] });
    }
  }

  public networkChanged = async (networkId: number) => {
    const library = new Web3Provider(this.provider);
    const network = await library.getNetwork();
    const chainId = network.chainId;
    await this.setState({ chainId, library });
  }

  public close = async () => {
    this.resetApp();
  }

  public getNetwork = () => getChainData(this.state.chainId).network;

  public getProviderOptions = () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID
        }
      }
    };
    return providerOptions;
  };

  public resetApp = async ({ onSuccess = () => {} } = {}) => {
    await this.web3Modal.clearCachedProvider();
    localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
    localStorage.removeItem("walletconnect");

    onSuccess();

    await this.unSubscribe(this.provider);

    this.setState({ ...INITIAL_STATE });

  };

  public routes = () => (
    <StyledContent>
      <Switch>
        <Route
          path='/home'
          component={Homepage}
        />
        <Route
          path='/collection/:id/token/:id'
          component={NFTToken}
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
      <AppStateContext.Provider
        value={{
          state: this.state,
          killSession: ({ onSuccess }) => this.resetApp({ onSuccess }),
          onConnect: ({ onSuccess }) => this.onConnect({ onSuccess })
        }}
      >
      <StyledApp>
        <Header />
        <Suspense fallback={<p>...Loading</p>} >{this.routes()}</Suspense>
      </StyledApp>
      </AppStateContext.Provider>
    );
      // <SLayout>
      //   <Column maxWidth={1000} spanHeight>
      //     <Header
      //       connected={connected}
      //       address={address}
      //       chainId={chainId}
      //       killSession={this.resetApp}
      //     />
      //     <SContent>
      //       {fetching ? (
      //         <Column center>
      //           <SContainer>
      //             <Loader />
      //           </SContainer>
      //         </Column>
      //       ) : (
      //           <SLanding center>
      //             {!this.state.connected && <ConnectButton onClick={this.onConnect} />}
      //           </SLanding>
      //         )}
      //     </SContent>
      //   </Column>
      // </SLayout>
  };
};

const StyledApp = styled.div`
  width: 100%;
`;

const StyledContent = styled.div`
`;

export default App;
