// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ > Scores Google Common Logic                                                     │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟦 HELPER
 *  - IMPORTANT
 * @description
 *  📣
 */
export const googleActionsStr:
{
  LP_FO: string;
  LP_FO_1: string;
  FP_SCRB_BET_SITE: string;
  FP_H2H: string;
  FP_PROB: string;
  FP_VOTE: string;
} = {
  LP_FO: 'betting_site_logo_football_fixtures_odds_tournament',
  LP_FO_1: 'tournaments_football_fixtures_odds',
  FP_SCRB_BET_SITE: 'betting_site_logo_football_fixtures_scoreboard_fixtures',
  FP_H2H: 'fixtures_football_fixtures_h2h',
  FP_PROB: 'fixture_football_fixtures_probabilities',
  FP_VOTE: 'football_fixtures_voting'
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟦 HELPER
 *  - IMPORTANT
 * @description
 *  📣 Google Event handler
 * @param { string } action
 *  💠 **[required]** `googleEvent` action to execute.
 * @returns { void }
 */
export function googleEventLog
(
  action: string
): void
{
  const gtagEventObj:
  {
    type: string,
    tag_name?: string,
    event_category?: string,
    event_label?: string,
    value?: string
  }
  = {
    type: 'event',
    value: 'click'
  };

  if (action === 'fixture_football_fixtures_probabilities')
  {
    gtagEventObj.tag_name = 'fixture_football_fixtures_probabilities';
    gtagEventObj.event_category = 'fixture_football_fixtures_probabilities';
    gtagEventObj.event_label = 'click_betting_site_logo';
  }
  else if (action === 'betting_site_logo_football_fixtures_scoreboard_fixtures')
  {
    gtagEventObj.tag_name = 'fixtures_scoreboard_odds';
    gtagEventObj.event_category = 'widget_fixture_scoreboard_info';
    gtagEventObj.event_label = 'click_betting_site_logo';
  }
  else if (action === 'betting_site_logo_football_fixtures_odds_tournament')
  {
    gtagEventObj.tag_name = 'betting_site_logo_football_fixtures_odds_tournament';
    gtagEventObj.event_category = 'widget_fixture_odds_info';
    gtagEventObj.event_label = 'click_betting_site_logo';
  }
  else if (action === 'tournaments_football_fixtures_odds')
  {
    gtagEventObj.tag_name = 'tournaments_football_fixtures_odds';
    gtagEventObj.event_category = 'widget_fixture_odds_info';
    gtagEventObj.event_label = 'click_betting_site_logo';
  }
  else if (action === 'betting_site_logo_widget_league_info')
  {
    gtagEventObj.tag_name = 'betting_site_logo_widget_league_info';
    gtagEventObj.event_category = 'widget_league_info';
    gtagEventObj.event_label = 'click_betting_site_logo';
  }
  else if (action === 'beting_cta_link_widget_league_info')
  {
    gtagEventObj.tag_name = 'beting_cta_link_widget_league_info';
    gtagEventObj.event_category = 'widget_league_info';
    gtagEventObj.event_label = 'beting_cta_link_logo';
  }

  // ╭─────
  // │ NOTE:
  // │ > run target `gtag` event.
  // ╰─────
  window.gtag
  (
    gtagEventObj.type,
    gtagEventObj.tag_name,
    {
      event_category: gtagEventObj.tag_name,
      event_label: gtagEventObj.event_label,
      value: gtagEventObj.value
    }
  );

  return;
}
