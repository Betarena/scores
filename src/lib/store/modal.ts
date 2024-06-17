import type { SvelteComponent } from "svelte";
import { writable, type Writable } from "svelte/store";

interface IModalStore
{
  show: boolean;
  modal: boolean;
  component: SvelteComponent | null;
  props?: any
}

export const modalStore: Writable<IModalStore> = writable({ show: false, modal: false, component: null, props: {} });