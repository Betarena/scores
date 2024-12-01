// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ > Scores Translation Logic                                                       │
// ╰──────────────────────────────────────────────────────────────────────────────────╯
import { franc } from 'franc';

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Default `fallback` translations `object` in English, for
 * terms and words on platform (website).
 */
export const translationObject:
{
  featured_match_title: string,
  featured_bet_site: string,
  league_list_title: string,
  leagues_table_title: string,
  seo_block_title: string,
  sign_in:    string;
  odds_type:  string;
  bookmakers: string;
  balance:    string;
  team: string;
  pool_prize: string;
  participants: string;
}
= {
  featured_match_title: 'Featured Match',
  featured_bet_site: 'Featured Betting Site',
  league_list_title: 'League List',
  leagues_table_title: 'Leagues Table',
  seo_block_title: 'Seo Block',
  sign_in: 'Sign In',
  odds_type: 'Odds Type',
  bookmakers: 'Bookmakers',
  balance: 'Balance',
  team: 'Team',
  pool_prize: 'Pool Prize',
  participants: 'participants'
}

const lanuagesMap = {
  "eng": { lang: "en", iso: "en_EN" },
  "spa": { lang: "es", iso: "es_ES" },
  "por": { lang: "br", iso: "pt_BR" },
  "fra": { lang: "fr", iso: "fr_FR" },
  "ita": { lang: "it", iso: "it_IT" },
  "ron": { lang: "ro", iso: "ro_RO" },
  "srp": { lang: "sr", iso: "sr_RS" },
}

export function detectLanguage(text: string): { lang: string, iso: string }
{
  const langCode = franc(text);
  return lanuagesMap[langCode] || lanuagesMap["eng"];
}