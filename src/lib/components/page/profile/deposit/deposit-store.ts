import { writable } from "svelte/store"

export const depositStore = writable<{
    amount: number | string,
    rate: number | null,
    revolut: {
        orderId?: string,
        checkoutUrl?: string
    }
    status?: string,
}>({ amount: 0, rate: null, revolut: { }, })