import { modalStore } from "$lib/store/modal";
import DepositModal from "./DepositModal.svelte";

/**
 * Opens the deposit modal by setting the application modal store.
 *
 * This function updates the global `modalStore` to display the `DepositModal`
 * component with modal behavior enabled.
 *
 * Side effects:
 * - Mutates `modalStore` with `{ component: DepositModal, show: true, modal: true }`.
 *
 * @public
 * @remarks
 * The function performs a synchronous update to the modal store and does not
 * return a value. Use this to programmatically show the deposit modal.
 *
 * @example
 * showDepositModal();
 *
 * @returns void
 */
export function showDepositModal() {
  modalStore.set({
    component: DepositModal,
    show: true,
    modal: true
  })
}