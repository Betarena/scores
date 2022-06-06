/**
 * Types for handling all of the PAGE_INFO
 * of the following pages:
 * --------------------------------------
 * ➤ /{lang}/{sport}/{country}/{tournaments}
 * ➤ /{sport}/{country}/{tournaments}
*/

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// [ℹ] DATA obtained from HASURA
export interface Hasura_Complete_Tournaments_Type {

  scores_tournaments_dev: Single_Tournament_Data_Type[]
  // scores_endpoints_translations_dev: {
  //   countries_translation: { 
  //     [key: string]: string 
  //   };
  //   id: number
  //   lang: string
  //   sport: string
  //   sports_translation: { 
  //     [key: string]: string 
  //   };
  //   title: string
  //   type: string
  // }[]

}

export interface Single_Tournament_Data_Type {
  author: string
  country: string
  date: Date
  id: number
  tournament_id: number
  lang: string
  modified_date: Date
  name: string
  sport: string
  status: "published" | "draft"
  // title: string
  type: string
  widgets: Array < string >
}