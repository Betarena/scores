import { writable, type Writable } from "svelte/store";


interface IBuyOptionsTranslations
{
  "presale": string,
  "competitions": string,
  "info_presale": string,
  "link_presale": string,
  "info_competitions": string,
  "link_competitions": string
}

const buyOptionsTranslations: Writable<IBuyOptionsTranslations> = writable({} as any);
export default buyOptionsTranslations;