import { writable } from "svelte/store";

interface IInfoMessage
{
  type: "success" | "error" | "loading", text: string, id?: number
}

function messageInfo()
{
  const { subscribe, update } = writable<IInfoMessage[]>([
    // {
    //   type: "success",
    //   text: "Welcome to the game!",
    //   id: 1
    // },
    // {
    //   type: "error",
    //   text: "You have lost the game!",
    //   id: 2
    // },
    // {
    //   type: "loading",
    //   text: "Loading...",
    //   id: 3
    // }
  ]);

  function add(message: IInfoMessage)
  {
    const id = new Date().getTime();
    update((old) => [{ ...message, id }, ...old]);
    setTimeout(() => remove(id), 5000);
    return id
  }

  function remove(id?: number)
  {
    if (!id) return;
    update(old => old.filter(i => i.id !== id));
  }

  return {
    subscribe,
    add,
    remove
  }
}

export const infoMessages = messageInfo();