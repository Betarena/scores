import { writable } from 'svelte/store';

export const activePopup = writable<HTMLElement | null>(null);