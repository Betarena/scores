import { writable } from "svelte/store";

export const loginStore = writable({
    email: "",
    isLogin: false,
    password: ""
})