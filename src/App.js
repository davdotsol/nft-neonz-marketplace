import { useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import KryptoNeonz from './abis/KryptoNeonz.json';

import './App.css';
import Web3 from 'web3';

function App() {
  const [hasProvider, setHasProvider] = useState(null);
  const initialState = {
    accounts: [],
    balance: '',
    chainId: '',
  };
  const [wallet, setWallet] = useState(initialState);
  const [isConnecting, setIsConnecting] = useState(false); /* New */
  const [error, setError] = useState(false); /* New */
  const [errorMessage, setErrorMessage] = useState(''); /* New */

  useEffect(() => {
    const refreshAccounts = (accounts) => {
      if (accounts.length > 0) {
        updateWallet(accounts);
      } else {
        // if length 0, user is disconnected
        setWallet(initialState);
      }
    };

    const refreshChain = (chainId) => {
      setWallet((wallet) => ({ ...wallet, chainId }));
    };

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      setHasProvider(Boolean(provider));

      if (provider) {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        refreshAccounts(accounts);
        window.ethereum.on('accountsChanged', refreshAccounts);
        window.ethereum.on('chainChanged', refreshChain);
      }
    };

    getProvider();

    return () => {
      window.ethereum?.removeListener('accountsChanged', refreshAccounts);
      window.ethereum?.removeListener('chainChanged', refreshChain);
    };
  }, []);

  const formatBalance = (rawBalance) => {
    const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
    return balance;
  };

  const formatChainAsNum = (chainIdHex) => {
    const chainIdNum = parseInt(chainIdHex);
    return chainIdNum;
  };

  const updateWallet = async (accounts) => {
    const balance = formatBalance(
      await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      })
    );
    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });
    const networkData = KryptoNeonz.networks[chainId];
    if (networkData) {
      const abi = KryptoNeonz.abi;
      const address = networkData.address;
      const contract = new Web3.eth.Contract(abi, address);
      console.log(contract);
    }
    setWallet({ accounts, balance, chainId });
  };

  useEffect(() => {
    const loadBlockchainData = async () => {
      await window.ethereum
        .request({
          method: 'eth_requestAccounts',
        })
        .then((accounts) => {
          setError(false);
          updateWallet(accounts);
        })
        .catch((err) => {
          setError(true);
          setErrorMessage(err.message);
        });
    };
    setIsConnecting(true);
    if (hasProvider) {
      loadBlockchainData();
    }
    setIsConnecting(false);
  }, [hasProvider]);

  return (
    <div className="App">
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <div className="navbar-brand col-sm-3 col-md-3 mr-0 text-white">
          Krypto Neonz NFTs
        </div>
        {wallet.accounts.length > 0 && (
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">{wallet.accounts[0]}</small>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
}

export default App;
