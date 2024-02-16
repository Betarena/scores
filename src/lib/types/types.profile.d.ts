type IProfileInvestorReferralInviteState =
  | 'FirstInvestmentMade'
  | 'FirstInvestmentNotMade'
;

type IProfileInvestorTgeWidgetState =
  | 'Tge_NoDefinedDate'
  | 'Tge_DateDefined'
  | 'Tge_ClaimAvailable'
  | 'Tge_Claimed'
  | IProfileGeneralNoData
;

type IProfileInvestorRoundWidgetState =
  | 'Round_InviteOnly'
  | 'Round_ToBeAnnounced'
  | 'Round_CountdownWithDefinedDate'
  | 'Round_CountdownToFinish'
  | 'Round_Ended'
;

type IProfileAdminWidgets =
  | 'Rounds'
  | 'InvestmentHistory'
  | 'Tge'
  | 'Vesting'
  | 'Wallets'
  | 'BonusSummary'
  | 'ReferralHistory'
  | 'ReferralInvite'
;

type IProfileInvestorHistoryWidget =
  | 'Standard'
  | IProfileGeneralNoData
;

type IProfileInvestorVestingWidget =
  | 'Standard'
  | IProfileGeneralNoData
;

type IProfileInvestorWalletsWidget =
  | 'Standard'
  | IProfileGeneralNoData
;

type IProfileInvestorBonusSummaryWidget =
  | 'Standard'
  | IProfileGeneralNoData
;

type IProfileInvestorReferralHistoryWidget =
  | 'Standard'
  | IProfileGeneralNoData
;

type IProfileGeneralNoData =
  | 'NoData'
;

/**
 * @description
 *  📣 Scores Platfrom | Profile > Investor Section Interface.
 */
interface IProfileInvestorSection
{
  /**
   * @description
   *  📣 Target general `store` state for `(page) profile > (tab) investor`.
   */
  global: Set<IProfileInvestorGeneralStateSection | IProfileInvestorTgeWidgetState>;
  /**
   * @description
   *  📣 Target `countdown` for `start` of `current active presale`.
   */
  globalActivePresaleStartClock: [number, number, number, number, number] | null;
  /**
   * @description
   *  📣 Target `countdown` for `end` of `current active presale`.
   */
  globalActivePresaleEndClock: [number, number, number, number, number] | null;
  /**
   * @description
   *  📣 Target `countdown` for `end` of `official presale end`.
   */
  globalFinalPresaleEndClock: [number, number, number, number, number] | null;
  /**
   * @description
   *  📣 Target `countdown` for `TGE` of `release`.
   */
  globalTgeReleaseClock: [number, number, number, number, number] | null;
  /**
   * @description
   *  📣 Target global internal user clock.
   */
  globalInternalClock: Date;
  /**
   * @description
   *  📣 Target widget `store` state for `(page) profile > (tab) investor > (widget) referral-invite`.
   */
  referralInviteStateWidget: IProfileInvestorGeneralStateSection;
  /**
   * @description
   *  📣 Target widget `store` state for `(page) profile > (tab) investor > (widget) TGE`.
   */
  tgeStateWidget: IProfileInvestorTgeWidgetState;
  /**
   * @description
   *  📣 Target widget `store` state for `(page) profile > (tab) investor > (widget) round`.
   */
  roundStateWidget: IProfileInvestorRoundWidgetState;
  /**
   * @description
   *  📣 Target widget `store` state for `(page) profile > (tab) investor > (widget) investment history`.
   */
  investHistoryStateWidget: IProfileInvestorHistoryWidget;
  /**
   * @description
   *  📣 Target widget `store` state for `(page) profile > (tab) investor > (widget) vesting`.
   */
  vestingHistoryStateWidget: IProfileInvestorVestingWidget;
  /**
   * @description
   *  📣 Target widget `store` state for `(page) profile > (tab) investor > (widget) wallets`.
   */
  walletsStateWidget: IProfileInvestorWalletsWidget;
  /**
   * @description
   *  📣 Target widget `store` state for `(page) profile > (tab) investor > (widget) bonus summary`.
   */
  bonusSummaryStateWidget: IProfileInvestorBonusSummaryWidget;
  /**
   * @description
   *  📣 Target widget `store` state for `(page) profile > (tab) investor > (widget) referral history`.
   */
  referralHistoryStateWidget: IProfileInvestorReferralHistoryWidget;
  /**
   * @description
   *  📣 Target widgets being overriden by admin.
   */
  adminOverrides: Set < IProfileAdminWidgets >;
}