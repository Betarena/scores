// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // 2024-08-29                                                    │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Betarena // Types // Session
// │ :│ Session Typescript Declaration
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/**
 * @description
 * 📝 Data properties that can be updated.
 */
export type IDataProp =
  // ╭─────
  // │ NOTE: |:| 📝 States Handle
  // ╰─────
  | 'mapLinks'
;

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 TYPES
 * @description
 *  📝 Interface for Platform Session / State data `(a.k.a Strictly Ephermal)` data.
 */
export interface IStoreFooter
{
  // ╭────────────────────────────────────────────────────────────────────────╮
  // | 💠 | DATA PROPERTIES                                                   |
  // ╰────────────────────────────────────────────────────────────────────────╯

  /**
   * @description
   * 📝 Target `sveltekit/page` instance.
   */
  mapLinks: Map < string, {
      /**
       * @description
       * 📝 ID.
       */
      id: string;
      /**
       * @description
       * 📝 Label.
       */
      label: string;
      /**
       * @description
       * 📝 URL href.
       */
      href: string;
    }
  >
}