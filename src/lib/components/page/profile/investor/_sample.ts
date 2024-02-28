import type { PublicInvestorDataIVesting, PublicTransactionHistoryMain } from '@betarena/scores-lib/types/_AUTO-HASURA-2_.js';

/**
 * @description
 *  📣 Sample data for Investor History Widget Data.
 */
export const investHistorySampleData: PublicTransactionHistoryMain[]
= [
  {
    Gateway: null
    , amount: 1800
    , asset: 'BTA'
    , bic_swift: null
    , bta_price: null
    , date: '2024-01-11T02:17:33.735582+00:00'
    , deposit_wallet_address: null
    , description: 'Vesting Period Claim'
    , extra: { vestingId: 1 }
    , first_name: null
    , iban: null
    , id: 130
    , last_name: null
    , payment_email: null
    , payment_processor_fee: null
    , platform_fee: null
    , quantity: 2500
    // @ts-expect-error
    , referral: null
    , status: 'pending'
    , tier: 'bronze'
    , type: 'investment'
    , uid: 'n65vqAoIH3b7lsU4zroxjHk0SSp2'
    , wallet_address_erc20: null
    , withdraw_wallet_address: null
  }
  , {
    Gateway: null
    , amount: 1800
    , asset: 'BTA'
    , bic_swift: null
    , bta_price: null
    , date: '2024-01-11T02:17:33.735582+00:00'
    , deposit_wallet_address: null
    , description: 'Vesting Period Claim'
    , extra: { vestingId: 1 }
    , first_name: null
    , iban: null
    , id: 130
    , last_name: null
    , payment_email: null
    , payment_processor_fee: null
    , platform_fee: null
    , quantity: 2500
    // @ts-expect-error
    , referral: null
    , status: 'pending'
    , tier: 'bronze'
    , type: 'investment'
    , uid: 'n65vqAoIH3b7lsU4zroxjHk0SSp2'
    , wallet_address_erc20: null
    , withdraw_wallet_address: null
  }
];

/**
 * @description
 *  📣 Sample data for Investor Vesting Widget Data.
 */
export const investVestingSampleData: PublicInvestorDataIVesting[]
= [
  {
    id: 1
    , status: null
    , tokens: 2500
    , claim_date: '30/01/24'
    ,available_date: '01/01/24'
    , distribution_date: '2024-01-11T02:35:09.614Z'
  }
  , {
    id: 2
    , status: 'Distributed'
    , tokens: 2500
    , claim_date: '30/01/24'
    , available_date: '01/01/24'
    , distribution_date: '2024-01-11T02:35:09.614Z'
  }
  , {
    id: 3
    , status: 'Pending'
    , tokens: 2500
    , claim_date: '30/01/24'
    , available_date: '01/01/24'
    , distribution_date: '2024-01-11T02:35:09.614Z'
  }
];

/**
 * @description
 *  📣 Sample data for Investor Wallets Widget Data.
 */
export const investWalletSampleData: string[]
= [
  '0xb794f5ea0ba39494ce839613fffba74279579268'
  , '0xb12134f5ea0ba39494ce839613fffba742795792'
  , '0xb42310ba39494ce839613fffba74279579264234'
  , '0xb42342523423423529613fffba74279579124125'
];

export const investReferralHistorySampleData: PublicInvestorDataIReferralHistory[]
= [
  {
    id: 1
    , date: '12/12/24'
    , bonus_bta: 50
    , bonus_percentage: 20
  }
  , {
    id: 2
    , date: '12/12/24'
    , bonus_bta: 50
    , bonus_percentage: 0
  }
]

