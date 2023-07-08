import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import Mint from './pages/Mint';
import Bridge from './pages/Bridge';
import Navbar from './components/Navbar';

const moonbase = {
  id: 1287,
  name: 'Moonbase Alpha',
  network: 'moonbase',
  iconUrl: 'https://moonscan.io/images/svg/brands/mainbrand-1.svg?v=22.11.5.0',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Moonbase Alpha',
    symbol: 'DEV',
  },
  rpcUrls: {
    default: 'https://rpc.testnet.moonbeam.network',
  },
  blockExplorers: {
    default: { name: 'Moonbase', url: 'https://moonbase.moonscan.io' },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [chain.goerli, chain.polygonMumbai, moonbase],
  [
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div className="w-screen h-screen">
          <Router>
            <Navbar/>
            <Routes>
              <Route path='/' exact element={<Mint/>} />
              <Route path='/bridge' exact element={<Bridge/>} />
            </Routes>
          </Router>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
