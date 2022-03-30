// tslint:disable: no-empty
import React from 'react';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Web3Provider } from '@ethersproject/providers';
import { getChainData } from '../helpers/utilities';

import ContractsSDK from './ContractsSDK';
import { ethers } from 'ethers';

interface IProps {
  children: any | null,
};

export interface ICollection {
  collectionId: number;
  name: string;
  description: string;
  creator: string;
}

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
  contractsSDK: any | ethers.Contract;
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
  info: null,
  contractsSDK: null
};

export const AppStateContext = React.createContext({
  state: INITIAL_STATE,
  killSession: ({ onSuccess = () => {} }): void => {},
  onConnect: ({ onSuccess = () => {} }): void => {}
});

class WalletConnectSDK extends React.Component<IProps> {
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

  public async componentDidMount() {
    if (this.web3Modal.cachedProvider) {
      await this.onConnect();
      const signer: ethers.Signer = await this.state.library.getSigner();

      this.setState({
        contractsSDK: new ContractsSDK(signer)
      })
    }
  }

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

  public networkChanged = async () => {
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

  public render = () => {
    return (
      <AppStateContext.Provider
        value={{
          state: this.state,
          killSession: ({ onSuccess }) => this.resetApp({ onSuccess }),
          onConnect: ({ onSuccess }) => this.onConnect({ onSuccess })
        }}
      >
        {this.props.children}
      </AppStateContext.Provider>
    );
  };
}

export default WalletConnectSDK;