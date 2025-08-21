import type { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { writable } from "svelte/store";

export const loginStore = writable({
    email: "",
    isLogin: false,
    password: "",
    name: "",
    currentStep: 8,
    avatar: "",
    phoneNumber: "",
    confirmationResult: null as ConfirmationResult | null,
    recaptchaVerifier: null as RecaptchaVerifier | null,
    translations: {} as Record<string, string>,
    country: "",
    countries: {} as Record<string, string>,
    isExistedUser: false
})
export const loginSportstackStore = writable({
    domain: "",
    currentStep: 1,
    sportstack: {
        id: "",
        permalink: ""
    }
})