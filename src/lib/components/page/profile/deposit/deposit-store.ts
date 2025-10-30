import { writable } from "svelte/store"

export const depositStore = writable<{
    amount: number | string,
    revolut: {
        orderId?: string,
        checkoutUrl?: string
    }
    status?: string,
}>({ amount: 0,  revolut: { }, })