// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// [ℹ] DATA obtained from HASURA [!]
export interface Hasura_Complete_GoalScorers_Type {
  scores_best_goalscorers: {
    common_name: string
    goals: number
    image_path: string
    league_id: number
    logo_path: string
    position: string
  }[]
  scores_best_goalscorers_translations: {
    lang: string
    translations: {
      goals: string
      odds: string
      best_goal_scorers: string
      player: string
      show_more_players: string
      show_less_players: string
    }
  }[]
  player_positions_translations_dev: {
    lang: string
    position: {
      "1": string
      "2": string
      "3": string
      "4": string
      "5": string
    }
  }[]
  leagues_filtered_country: {
    lang: string
    leagues: {
        league_id: number
    }[]
  }[]
}


export interface Single_Goalscorer {
  common_name: string
  goals: number
  image_path: string
  league_id: number
  logo_path: string
  position: string
  pos_num: number
}


export interface Single_Goalscorer_Translations {
  lang: string
  positions_translations: {
    "1": string
    "2": string
    "3": string
    "4": string
    "5": string
  }
  widget_translations: {
    goals: string
    odds: string
    best_goal_scorers: string
    player: string
    show_more_players: string
    show_less_players: string
  }
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// [ℹ] generated best goalscorers cache object;
export interface Cache_Single_Geo_GoalScorers_Translation_Response {
  lang: string
  top_geo_goalscorer_players: Single_Goalscorer[]
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// [ℹ] generated best goalscorers cache object;
export interface Cache_Goalscorers_General_Lang_Ready {
  top_geo_goalscorer_players: Single_Goalscorer[]
  translations: Single_Goalscorer_Translations[]
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// [ℹ] generated best goalscoreres cache SEO object
export interface Cache_Single_Lang_GoalScorers_Translation_Response {
  top_geo_goalscorer_players: {
    common_name: string
  }[]
  translations: Single_Goalscorer_Translations
}