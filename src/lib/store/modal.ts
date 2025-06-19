import type { SvelteComponent } from "svelte";
import { writable, type Writable } from "svelte/store";

type ComponentType<Props extends Record<string, any> = Record<string, any>> = new (...args: any) => SvelteComponent<Props>;

interface IModalStore
{
  show: boolean;
  modal: boolean;
  component: ComponentType | null;
  props?: any,
}

export const modalStore: Writable<IModalStore> = writable({ show: false, modal: false, component: null, props: {} });