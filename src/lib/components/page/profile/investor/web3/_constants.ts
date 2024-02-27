import betarenaBankContractABI from './BetarenaBankABI.json';
import usdcContractAddressABITestNet from './UsdcABI-Polygon-Mumbai.json';
import usdtContractAddressABITestNet from './UsdtABI-Polygon-Mumbai.json';
import usdcContractAddressABI from './UsdcABI-Polygon-Mainnet.json';
import usdtContractAddressABI from './UsdtABI-Polygon-Mainnet.json';

interface IWeb3AddressData
{
  /**
   * @description
   *  📣 Target `Betarena Bank` smart contract address.
   * @example
   *  => 'POLYGON (MUMBAI) TESTNET'
   *  ==> '0x5BC335e9c9492B8abb07B49a6dbD8269d7419F1D'
   *  ==> '0x4118AF394ba3Fd6Fa6dA6b5c18399F3072e039a2'
   *  => 'POLYGON (MAINNET)'
   *  ==>
   */
  betarenaBankContractAddress: IWeb3ContractData;
  /**
   * @description
   *  📣 Target `USDT` smart contract data.
   */
  usdtContractAddress: IWeb3ContractData;
  /**
   * @description
   *  📣 Target `USDC` smart contract data.
   */
  usdcContractAddress: IWeb3ContractData;
}
interface IWeb3ContractData
{
  /**
   * @description
   *  📣 Target `Smart Contract ABI`.
   */
  abi: unknown;
  /**
   * @description
   *  📣 Target `Smart Contract Address`.
   */
  address: string;
}

/**
 * @description
 *  📣 Target data concerning `Polygon (Mumbai) Testnet`.
 */
export const polygonMumbaiTestnet: IWeb3AddressData
= {
  betarenaBankContractAddress:
  {
    abi: betarenaBankContractABI
    // 🔗 read-more :|: https://mumbai.polygonscan.com/address/0x8d03D84965a0e10a08E814CF19fe4207a34bFd4c
    , address: '0x8d03D84965a0e10a08E814CF19fe4207a34bFd4c'
  }
  , usdtContractAddress:
  {
    abi: usdtContractAddressABITestNet
    // 🔗 read-more :|: https://mumbai.polygonscan.com/address/0x3813e82e6f7098b9583FC0F33a962D02018B6803
    , address: '0x3813e82e6f7098b9583FC0F33a962D02018B6803'
  }
  , usdcContractAddress:
  {
    abi: usdcContractAddressABITestNet
    // 🔗 read-more :|: https://mumbai.polygonscan.com/address/0x0FA8781a83E46826621b3BC094Ea2A0212e71B23
    , address: '0x0FA8781a83E46826621b3BC094Ea2A0212e71B23'
  }
};

/**
 * @description
 *  📣 Target data concerning `Polygon (Mainnet) Production`.
 */
export const polygonMainnet: IWeb3AddressData
= {
  betarenaBankContractAddress:
  {
    abi: betarenaBankContractABI
    // 🔗 read-more :|: https://polygonscan.com/address/0x4118AF394ba3Fd6Fa6dA6b5c18399F3072e039a2
    , address: '0x4118AF394ba3Fd6Fa6dA6b5c18399F3072e039a2'
  }
  , usdtContractAddress:
  {
    abi: usdtContractAddressABI
    // 🔗 read-more :|: https://polygonscan.com/token/0xc2132d05d31c914a87c6611c10748aeb04b58e8f
    , address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
  }
  , usdcContractAddress:
  {
    abi: usdcContractAddressABI
    // 🔗 read-more :|: https://polygonscan.com/token/0x2791bca1f2de4661ed88a30c99a7a9449aa84174
    , address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
  }
};
