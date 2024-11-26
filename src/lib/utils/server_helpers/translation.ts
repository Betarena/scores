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

/**
 * @description
 *  📣 Identify the language of the given text.
 *  📣 This function can be used only on server side.
 * @param {string} text - The text to identify the language for.
 * @returns {Promise<string>} - A promise that resolves to the language code.
 */
export async function identifyLanguage(text: string): Promise<string>
{
  try
  {
    const [detection] = await translate.detect(text);
    return detection.language;
  } catch (error)
  {
    console.error('Error identifying language:', error);
    throw error;
  }
}
