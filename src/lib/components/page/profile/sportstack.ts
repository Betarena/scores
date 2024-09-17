import { writable } from "svelte/store";
import userSettings from "$lib/store/user-settings.js";
import { browser } from "$app/environment";

export const sportstack = writable([
  {
    id: 1,
    owner: browser ? userSettings.extract("uid") : "",
    title: "This is a sample of a long sportstack title",
    img: "",
  },
  {
    id: 2,
    owner: browser ? userSettings.extract("uid") : "",
    title: "This is a sample of a long sportstack title",
    img: "",
  },
  {
    id: 3,
    owner: browser ? userSettings.extract("uid") : "",
    title: "This is a sample of a long sportstack title",
    img: "",
  },
])