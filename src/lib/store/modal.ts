// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // <date-created>                                                │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)
// │ |: <insert-module-summary-here>
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { log_v3 } from "$lib/utils/debug.js";
import { parseObject } from "$lib/utils/string.2.js";
import { writable } from "svelte/store";

import type { SvelteComponent } from "svelte";

// #endregion ➤ 📦 Package Imports

// #region ➤ ⛩️ TYPES

type ComponentType<Props extends Record<string, any> = Record<string, any>> = new (...args: any) => SvelteComponent<Props>;

interface IModalStore
{
  /**
   * @author
   * @migbash
   * @summary
   *  - 🔹 COMPONENT
   *  - IMPORTANT
   * @description
   *  📣 Modal component.
   */
  component: ComponentType | null;
  /**
   * @author
   * @migbash
   * @summary
   *  - 🔹 FLAG
   *  - IMPORTANT
   * @description
   *  📣 Show modal flag.
   */
  show: boolean;
  /**
   * @author
   * @migbash
   * @summary
   *  - 🔹 FLAG
   *  - IMPORTANT
   * @description
   *  📣 Is modal flag.
   */
  modal: boolean;
  /**
   * @author
   * @migbash
   * @summary
   *  - 🔹 OBJECT
   *  - IMPORTANT
   * @description
   *  📣 Modal props object.
   */
  props?: any,
}

type IDataProp =
  | 'ModalDeposit'
;

// #endregion ➤ ⛩️ TYPES

// #region ➤ 📌 VARIABLES

const
  /**
   * @author
   *  @migbash
   * @summary
   *  - 🔹 STORE OBJECT
   *  - IMPORTANT
   * @description
   *  📣 Modal store object.
   */
  objStore =
    {
      show: false,
      modal: false,
      component: null,
      props: {}
    } as IModalStore
;

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

function createModalStore
(
)
{
  const
    // ╭─────
    // │ NOTE:
    // │ |: destructure assignment
    // ╰─────
    {
      subscribe,
      set,
      update
    } = writable<IModalStore>
      (
        {
          show: false,
          modal: false,
          component: null,
          props: {}
        }
      ),
    /**
     * @author
     *  @migbash
     * @summary
     *  - 🔹 OBJECT METHODS
     *  - IMPORTANT
     * @description
     *  📣 Modal store object methods.
     */
    objMethods =
      {
        /**
         * @author
         *  @migbash
         * @summary
         *  - 🔹 HELPER
         *  - IMPORTANT
         * @description
         *  📣 Update **target** `list` data of target `properties` to update.
         * @param { [IDataProp, any][] } data
         *  💠 **[required]** Target data to update.
         * @return { void }
         */
        updateData: async (
          data: [IDataProp, any][]
        ): Promise < void > =>
        {
          // [🐞]
          log_v3
          (
            {
              strGroupName: '🚏 checkpoint ➤ Store | Modal ➤ updateData(..) // START',
              msgs: [
                `🔹 [var] ➤ data :|: ${parseObject(data)}`,
              ],
              closed: true
            }
          );

          // ╭─────
          // │ NOTE:
          // │ │: loop through data.
          // │ │: update sessionStoreObj.
          // ╰─────
          for (const iterator of data)
          {
            const
              dataTarget = iterator[0],
              dataPoint = iterator[1] as IModalStore
            ;

            objStore.props = dataPoint.props ?? {};
            objStore.show = dataPoint.show ?? false;
            objStore.modal = dataPoint.modal ?? false;

            if (dataTarget == 'ModalDeposit')
              objStore.component = (await import('$lib/components/page/profile/deposit/DepositModal.svelte')).default;
            ;

            set
            (
              objStore
            );

            return;
          }
        }
      }
  ;

  return {
    subscribe,
    set,
    update,
    ...objMethods
  };
}

// #endregion ➤ 🛠️ METHODS

export const modalStore = createModalStore();