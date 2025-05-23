import { collection, getDocs } from "firebase/firestore";
import { db_firestore } from "./init.js";
import Fuse from "fuse.js";
import type { IBetarenaUser } from "@betarena/scores-lib/types/firebase/firestore.js";

let users_list: IBetarenaUser & { id: string }[] = [];
let fuse: Fuse<IBetarenaUser & { id: string }> | null = null;
export async function searchUsers(search: string) {
  if (!users_list.length) {
    users_list = await getUsers();
  }
  if (!fuse && users_list.length) {
    fuse = new Fuse(users_list, {
      keys: ["usernameLower"],
      threshold: 0.3,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }
  if (!search) return [];
  const trySearch = (q: string) =>
    fuse?.search<{
      [x: string]: any; item: (typeof users_list)[0]
}>(q).map((r) => ({...r.item, uid: r.item?.id})) || [];

  let results = trySearch(search);

  let query = search;
  while (results.length < 4 && query.length > 1) {
    query = query.slice(0, -1);
    results = trySearch(query);
  }
  return results;
}

export async function getUsers() {
  const usersSnapshot = await getDocs(
    collection(db_firestore, "betarena_users")
  );
  const users_list = usersSnapshot.docs.map((doc) => {
    const data = doc.data();
    return { id: doc.id, ...data } as IBetarenaUser & { id: string };
  });

  return users_list;
}
