import type { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { writable } from "svelte/store";

export const loginStore = writable({
    email: "",
    isLogin: false,
    password: "",
    name: "",
    currentStep: 3,
    avatar: "",
    phoneNumber: "",
    confirmationResult: null as ConfirmationResult | null,
    recaptchaVerifier: null as RecaptchaVerifier | null
})