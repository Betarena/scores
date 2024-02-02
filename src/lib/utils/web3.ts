import type { Chain } from '@web3modal/scaffold-utils/dist/types/src/EthersTypesUtil.js';

/**
 * @description
 * - 📣 Object for target `web3` chains.
 * - 📣 Used in conjuction with `Standard Web3 Method` configuration.
 */
export const chainObject: unknown
= {
  polygon_mumbai:
  {
    chainId: '0x13881'
    , chainName: 'Mumbai Testnet'
    , rpcUrls:
    [
      'https://polygon-mumbai.g.alchemy.com/v2/0zWtf5I24NBkM826G-VJFiYkkGoC5atJ'
    ]
    , nativeCurrency:
    {
      name: 'MATIC'
      , symbol: 'MATIC'
      , decimals: 18
    }
    , blockExplorerUrls:
    [
      'https://mumbai.polygonscan.com'
    ]
  }
  , polygon_mainnet:
  {
    chainId: '0x89'
    , chainName: 'Polygon Mainnet'
    , rpcUrls:
    [
      'https://polygon-rpc.com/'
    ]
    , nativeCurrency:
    {
      name: 'MATIC'
      , symbol: 'MATIC'
      , decimals: 18
    }
    , blockExplorerUrls:
    [
      'https://polygonscan.com'
    ]
  }
}

/**
 * @description
 * - 📣 Object for target `web3` chains.
 * - 📣 Used in conjuction with `WalletConnect` configuration.
 */
export const chainObjectWalletConnect: Record < 'ethereum' | 'polygon_mumbai', Chain >
= {
  ethereum:
  {
    chainId: 1
    , name: 'Ethereum'
    , currency: 'ETH'
    , explorerUrl: 'https://etherscan.io'
    , rpcUrl: 'https://cloudflare-eth.com'
  }
  , polygon_mumbai:
  {
    chainId: 80001
    , name: 'Mumbai Testnet'
    , currency: 'MATIC'
    , explorerUrl: 'https://mumbai.polygonscan.com'
    , rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/0zWtf5I24NBkM826G-VJFiYkkGoC5atJ'
  }
};
