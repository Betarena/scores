
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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	gtag: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	ethereum: any;
}