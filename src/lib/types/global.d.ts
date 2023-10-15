
// global.d.ts;
// /// <reference types="@sveltejs/kit" />

// interface Web3_Providers
// 	extends import('ethers').providers
// 		.ExternalProvider {
// 	isCoinbaseWallet: boolean;
// 	isCoinbaseBrowser: boolean;
// }

interface Window
{
  /** @description `window` | `document` global Google Analytics Methods access. */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	gtag: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
  /** @description `window` | `document` global Ethereum (MetaMask) Methods access. */
	ethereum: any;
}