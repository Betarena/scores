type IProfileInvestorReferralInviteState =
  | 'FirstInvestmentMade'
  | 'FirstInvestmentNotMade'
;

type IProfileInvestorTgeWidgetState =
  | 'Tge_NoDefinedDate'
  | 'Tge_DateDefined'
  | 'Tge_ClaimAvailable'
  | 'Tge_Claimed'
;

type IProfileInvestorRoundWidgetState =
  | 'Round_InviteOnly'
  | 'Round_ToBeAnnounced'
  | 'Round_CountdownWithDefinedDate'
  | 'Round_CountdownToFinish'
  | 'Round_Ended'
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
}