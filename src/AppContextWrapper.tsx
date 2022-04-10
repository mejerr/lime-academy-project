// tslint:disable: no-empty
import React, { FC, ReactChild, ReactChildren, useEffect, useState } from 'react';
import ContractsSDK from 'SDK/ContractsSDK';
import Web3Modal from 'web3modal';

import { ethers } from 'ethers';
import { getChainData } from 'helpers/utilities';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Web3Provider } from '@ethersproject/providers';
import Loader from 'components/Loader';

interface IProps {
  children: ReactChild | ReactChildren;
}

export interface IConnectData {
  userAddress?: string;
  userBalance?: number;
  signer?: any;
  library?: any;
  connected?: boolean;
  chainId?: number;
  network?: any | ethers.providers.Network
  contractsSDK?: any | ethers.Contract;
}

const INITIAL_STATE: IConnectData = {
  userAddress: '',
  userBalance: 0,
  signer: null,
  library: null,
  connected: false,
  chainId: 1,
  network: '',
  contractsSDK: null
};

export const AppStateContext = React.createContext({
  state: INITIAL_STATE,
  killSession: ({ onSuccess = (): void => {} }): void => {},
  onConnect: ({ onSuccess = (): void => {} }): void => {},
  setIsLoading: (loading: boolean) => {},
});

const AppContextWrapper: FC<IProps> = ({ children }) => {
  const [provider, setProvider] = useState<any | ethers.providers.Provider>(null);
  const [web3Modal, setWeb3Modal] = useState<any>({});
  const [state, setState] = useState<IConnectData>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getNetwork = () => getChainData(state.chainId || 0).network;

  const getProviderOptions = () => {
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

  const changedAccount = async (accounts: string[]) => {
    if(!accounts.length) {
      // Metamask Lock fire an empty accounts array
      await resetApp();
    } else {
      setState({ connected: true, userAddress: accounts[0] });
      window.location.reload();
    }
  }

  const networkChanged = async () => {
    if (provider) {
      const library = new Web3Provider(provider);
      const network = await library.getNetwork();
      const chainId = network.chainId;
      setState({ chainId, library });
    }
  }

  const close = async () => {
    resetApp();
  }

  const unSubscribe = async (provider:any) => {
    // Workaround for metamask widget > 9.0.3 (provider.off is undefined);
    window.location.reload();
    if (!provider.off) {
      return;
    }

    provider.off("accountsChanged", changedAccount);
    provider.off("networkChanged", networkChanged);
    provider.off("close", close);
  }


  const resetApp = async ({ onSuccess = () => {} } = {}) => {
    await web3Modal.clearCachedProvider();
    localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
    localStorage.removeItem("walletconnect");

    onSuccess();

    await unSubscribe(provider);

    setState({ ...INITIAL_STATE });
  };


  const subscribeToProviderEvents = async (provider: any) => {
    if (!provider.on) {
      return;
    }

    provider.on("accountsChanged", changedAccount);
    provider.on("chainChanged", networkChanged);
    provider.on("disconnect", close);

    await web3Modal.off('accountsChanged');
  };

  const onConnect = async ({ onSuccess = () => {} } = {}) => {
    const provider = await web3Modal.connect();
    const library = new Web3Provider(provider);
    const signer = library.getSigner();
    const network = await library.getNetwork();
    const userAddress = await signer.getAddress();
    const userBalance = +ethers.utils.formatEther((await signer.getBalance()).toString());
    const chainId = await signer.getChainId();

    setProvider(provider);

    setState({
      signer,
      library,
      chainId,
      network,
      userAddress,
      userBalance,
      connected: true,
      contractsSDK: new ContractsSDK(signer, userAddress)
    });

    await subscribeToProviderEvents(provider);

    onSuccess();
  };

  useEffect(() => {
    const modal = new Web3Modal({
      network: getNetwork(),
      cacheProvider: true,
      providerOptions: getProviderOptions()
    })

    setWeb3Modal(modal);
  }, []);


  useEffect(() => {
    const initConnection = async () => {
      await onConnect();
    }

    if (web3Modal.cachedProvider) {
      initConnection();
    }
  }, [web3Modal]);


  return (
    <AppStateContext.Provider
      value={{
        state,
        killSession: ({ onSuccess }) => resetApp({ onSuccess }),
        onConnect: ({ onSuccess }) => onConnect({ onSuccess }),
        setIsLoading: (loading: boolean) => setIsLoading(loading)
    }}>
      {children}
      <Loader isLoading={isLoading}/>
    </AppStateContext.Provider>
  );
};

export default AppContextWrapper;
