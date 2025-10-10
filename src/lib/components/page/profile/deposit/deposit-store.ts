import { writable } from "svelte/store"

export const depositStore = writable<{
    amount: number | string,
    rate: number | null,
    orderId?: string,
}>({ amount: 0, rate: null })