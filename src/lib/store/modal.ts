import type { SvelteComponent } from "svelte";
import { writable, type Writable } from "svelte/store";

interface IModalStore
{
  show: boolean;
  component: SvelteComponent | null;
}

export const modalSore: Writable<IModalStore> = writable({ show: false, component: null });