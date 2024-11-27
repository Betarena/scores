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
import { Translate } from '@google-cloud/translate/build/src/v2/index.js';

const translate = new Translate({
  key: import.meta.env.VITE_GOOGLE_API_KEY
});

const isoCodeMap = {
  "pt": "pt_PT",
  "pt-BR": "pt_BR",
  "pt-PT": "pt_PT",
  "en": "en_US",
  "es": "es_ES",
  "fr": "fr_FR",
  "ro": "ro_RO",
  "it": "it_IT",
  "se": "se_SE",
}

/**
 * @description
 *  📣 Identify the language of the given text.
 *  📣 This function can be used only on server side.
 * @param {string} text - The text to identify the language for.
 * @returns {Promise<string>} - A promise that resolves to the language code.
 */
export async function identifyLanguage(text: string): Promise<{ lang: string, isoLang: string }>
{
  try
  {
    const [detection] = await translate.detect(text);
    const detectedLang = detection.language;
    let isoLang = isoCodeMap[detectedLang];
    let lang = detectedLang.split("-")[0];
    if (!isoLang)
    {
      isoLang = "en_US"
      lang = "en";
    };
    return { lang, isoLang };
  } catch (error)
  {
    console.error('Error identifying language:', error);
    throw error;
  }
}
