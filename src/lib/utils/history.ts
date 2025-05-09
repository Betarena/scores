import { writable } from "svelte/store";

const history_store = writable(["/"]);
export default history_store;
