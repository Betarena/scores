
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
  /** @description `window` | `document` global Intercom Properties access. */
  intercomSettings:
  {
    /** @description client/user api-base */
    api_base: string;
    /** @description intercom `app-id` */
    app_id: string;
    /** @description client/user full name */
    name?: string | undefined;
    /** @description client/user email */
    email?: stirng | undefined;
    /** @description client/user created at date */
    created_at?: string | undefined;
    /** @description client/user `UID` */
    uid?: string;
    /** @description client/user platform language */
    lang?: string;
    /** @description client/user platform language */
    competition_number?: number;
  };
}