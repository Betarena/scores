// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Module  Overview                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Code Format │:│ V.8.0                                                 │
// │ ➤ Status    │:│ 🔒 LOCKED                                                        │
// │ ➤ Author(s) │:│ @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Betarena (Module) ││ Navigation Variables Definitions                            │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

export const
  /**
   * @description
   *  📣 Target `path` for **profile page**.
   */
  routeIdPageProfile = '/(scores)/u/[view]/[lang=lang]',
  /**
   * @description
   *  📣 Target `path` for **competition page**.
   */
  routeIdPageCompetitions = '/(scores)/[[lang=lang]]/[competitions=competitions]',
  /**
   * @description
   *  📣 Target `path` for **authors page**.
   */
  routeIdPageAuthors = '/(authors)/a/[...permalink]',
  /**
   * @description
   *  📣 Target `path` for **authors page**.
   */
  routeIdPageTags = '/(authors)/a/tag/[name]',
  /**
   * @description
   *  📣 Target `path` for **sport page**.
   */
  routeIdPageSport = '/(scores)/[[lang=lang]]/[sport]',
  /**
   * @description
   *  📣 Target `path` for **league page**.
   */
  routeIdPageLeague = '/(scores)/[[lang=lang]]/[sport]/[country]/[league_name]',
  /**
   * @description
   *  📣 Target `path` for **fixture page**.
   */
  routeIdPageFixture = '/(scores)/[[lang=lang]]/[sport]/[fixture=fixture]',
  /**
   * @description
   *  📣 Target `path` for **player page**.
   */
  routeIdPagePlayer = '/(scores)/[[lang=lang]]/[player=player]/[...player_fill]',
  /**
   * @description
   *  📣 Target `path` for **competition (lobby) page**.
   */
  routeIdPageCompetitionLobby = '/(scores)/[[lang=lang]]/[competitions=competitions]',
  /**
   * @description
   *  📣 Target `path` for **competition (target) page**.
   */
  routeIdPageCompetition = '/(scores)/[[lang=lang]]/[competitions=competitions]/[...competition_fill]',

  /**
   * @description
   *  📣 Target `path` for **personalized content  page**.
   */
  routeIdContent = '/(authors)/a/content',

  /**
   * @description
   *  📣 Target `path` for **Author profile**.
   */
  routeIdAuthorProfile = '/(authors)/a/user/[username]',
  /**
   * @description
   *  📣 Target `path` for **Author subscribers**.
   */
  routeIdAuthorSubscribers = '/(authors)/a/user/[username]/[type=subscribers]',

  /**
   * @description
   *  📣 Target `path` for **Sportstack view**.
   */
  routeIdSportstack = '/(authors)/a/sportstack/[name]',

/**
 * @description
 *  📣 Target `path` for **scores page**.
 */
  routeIdScores = '/(scores)/[[lang=lang]]/scores',
 /**
   * @description
   *  📣 Target `path` for **home  page**.
   */
  routeIdHome = '/(scores)/[[lang=lang]]',

  /**
   * @description
   *  📣 Target `path` for **notifications**.
   */
  routeIdNotifications = '/(scores)/[[lang=lang]]/notifications',
  /**
   * @description
   *  📣 Target `path` for **notifications settings**.
   */
  routeIdNotificationsSettings = '/(scores)/[[lang=lang]]/notifications/settings'
  ;
