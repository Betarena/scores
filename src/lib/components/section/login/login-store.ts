import { writable } from "svelte/store";

export const loginStore = writable({
    email: "",
    isLogin: false,
    password: "",
    name: "",
    currentStep: 5,
    avatar: ""
})