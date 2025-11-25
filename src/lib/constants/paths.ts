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
  // ╭─────
  // │ NOTE:
  // │ |: destructure assigment
  // ╰─────
  [
    routeIdPageProfile,
    routeIdPageProfileAuthorCreate,
    routeIdPageProfilePublication,
    routeIdPageProfileArticleCreation,
    routeIdPageProfileEditArticle,
    routeIdPageCompetitions,
    routeIdPageAuthors,
    routeIdPageTags,
    routeIdPageSport,
    routeIdPageLeague,
    routeIdPageFixture,
    routeIdPagePlayer,
    routeIdPageCompetitionLobby,
    routeIdPageCompetition,
    routeIdContent,
    routeIdAuthorProfile,
    routeIdAuthorSubscribers,
    routeIdSportstack,
    routeIdScores,
    routeIdHome,
    routeIdSearch,
    routeIdRegister,
    routeIdLogin,
  ] = [
    '/(scores)/u/[view]/[lang=lang]',
    '/(scores)/u/author/create/[lang=lang]',
    '/(scores)/u/author/publication/[permalink]/[lang=lang]',
    '/(scores)/u/author/article/create/[lang=lang]',
    '/(scores)/u/author/article/edit/[...permalink]/[lang=lang]',
    '/(scores)/[[lang=lang]]/[competitions=competitions]',
    '/(authors)/a/[...permalink]',
    '/(authors)/a/tag/[name]',
    '/(scores)/[[lang=lang]]/[sport]',
    '/(scores)/[[lang=lang]]/[sport]/[country]/[league_name]',
    '/(scores)/[[lang=lang]]/[sport]/[fixture=fixture]',
    '/(scores)/[[lang=lang]]/[player=player]/[...player_fill]',
    '/(scores)/[[lang=lang]]/[competitions=competitions]',
    '/(scores)/[[lang=lang]]/[competitions=competitions]/[...competition_fill]',
    '/(scores)/[[lang=lang]]',
    '/(authors)/a/user/[username]',
    '/(authors)/a/user/[username]/[type=subscribers]',
    '/(authors)/a/sportstack/[name]',
    '/(scores)/[[lang=lang]]/scores',
    '/(scores)/[[lang=lang]]',
    '/(scores)/search',
    '/(scores)/[[lang=lang]]/(auth)/register',
    '/(scores)/[[lang=lang]]/(auth)/login',
  ]
;