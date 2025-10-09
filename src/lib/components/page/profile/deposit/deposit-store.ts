import { writable } from "svelte/store"

export const depositStore = writable<{
    amount: number | string
}>({ amount: 0 })