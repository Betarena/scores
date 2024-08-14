import type { ComponentType, SvelteComponent } from "svelte";
import { writable, type Writable } from "svelte/store";

interface IModalStore
{
  show: boolean;
  modal: boolean;
  component: ComponentType<SvelteComponent> | null;
  props?: any
}

export const modalStore: Writable<IModalStore> = writable({ show: false, modal: false, component: null, props: {} });