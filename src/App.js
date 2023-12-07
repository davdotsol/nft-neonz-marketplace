import { useEffect, useRef, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import KryptoNeonz from './abis/KryptoNeonz.json';

import './App.css';
import Web3 from 'web3';

function App() {
  const [web3, setWeb3] = useState(null);
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
  const [contract, setContract] = useState(null);
  const [neonz, setNeonz] = useState([1, 2, 3]);
  const neonzInputRef = useRef();

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
        setWeb3(new Web3(provider));
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

    console.log('update wallet', chainId);

    setWallet({ accounts, balance, chainId });
  };

  const createContract = async () => {
    const networkData = KryptoNeonz.networks[formatChainAsNum(wallet.chainId)];

    if (networkData) {
      const abi = KryptoNeonz.abi;
      const address = networkData.address;
      const _contract = new web3.eth.Contract(abi, address);
      setContract(_contract);
      const totalSupply = await _contract.methods.totalSupply().call();
      for (let i = 1; i <= totalSupply; i++) {
        const _neonz = await _contract.methods.neonz(i - 1).call();
        setNeonz((prev) => [...prev, _neonz]);
      }
    } else {
      setError(true);
      setErrorMessage('Smart Contract not deployed');
    }
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
          createContract();
        })
        .catch((err) => {
          setError(true);
          setErrorMessage(err.message);
        });
    };
    setIsConnecting(true);
    if (hasProvider) {
      console.log('loadblockchain data');
      loadBlockchainData();
    }
    setIsConnecting(false);
  }, [hasProvider]);

  const mint = async (_neonz) => {
    contract.methods
      .mint(_neonz)
      .send({ from: wallet.accounts[0] })
      .once('receipt', (receipt) => {
        setNeonz((prev) => [...prev, _neonz]);
      });
  };

  return (
    <div className="App">
      neonzInputRef
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
      <div className="container-fluid mt-4">
        <main className="content mr-auto ml-auto">
          <h1>KryptoNeonz - NFT Marketplace</h1>
          <div className="row">
            <div className="col-lg-12">
              {error && (
                <div className="mt-1" onClick={() => setError(false)}>
                  <strong>Error:</strong> {errorMessage}
                </div>
              )}
              {!error && wallet.accounts.length > 0 && (
                <div className="mt-1">
                  <form
                    onSubmit={async (event) => {
                      event.preventDefault();
                      await mint(neonzInputRef.current.value);
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Add a file location"
                      className="form-control mb-1"
                      ref={neonzInputRef}
                    />
                    <input
                      type="submit"
                      className="btn btn-primary btn-dark m-2"
                      value="MINT"
                    />
                  </form>
                  <hr />
                </div>
              )}
            </div>
          </div>
          <div className="row text-center">
            <div className="col-lg-12 d-flex">
              {neonz.map((_neonz) => {
                return (
                  <div className="card m-2" style={{ width: '18rem' }}>
                    <img
                      className="card-img-top"
                      src={_neonz}
                      alt="Card image cap"
                    />
                    <div className="card-body">
                      <h5 className="card-title">Card title</h5>
                      <p className="card-text">
                        Some quick example text to build on the card title and
                        make up the bulk of the card's content.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
