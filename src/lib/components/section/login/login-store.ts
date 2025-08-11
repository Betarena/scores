import type { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { writable } from "svelte/store";

export const loginStore = writable({
    email: "",
    isLogin: false,
    password: "",
    name: "",
    currentStep: 5,
    avatar: "",
    phoneNumber: "",
    confirmationResult: null as ConfirmationResult | null,
    recaptchaVerifier: null as RecaptchaVerifier | null,
    translations: {} as Record<string, string>,
    country: "",
    countries: {} as Record<string, string>,
})