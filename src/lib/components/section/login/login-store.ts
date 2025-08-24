import type { AuthorsAuthorsMain, TranslationAuthenticationDataJSONSchema } from "@betarena/scores-lib/types/v8/_HASURA-0";
import type { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { writable } from "svelte/store";

export const loginStore = writable({
    email: "",
    isLogin: false,
    password: "",
    name: "",
    currentStep: 0,
    avatar: "",
    phoneNumber: "",
    confirmationResult: null as ConfirmationResult | null,
    recaptchaVerifier: null as RecaptchaVerifier | null,
    translations: {} as TranslationAuthenticationDataJSONSchema,
    country: "",
    countries: {} as Record<string, string>,
    isExistedUser: false,
    verifiedSteps: [] as string[],
    sportstack: {
       permalink: "",
        data: {
            about: "",
            avatar: ""
       }
    } as Partial<AuthorsAuthorsMain>,
    sportstack_img: ""
})