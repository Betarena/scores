import { dev } from '$app/environment'
import { ref, get, child } from 'firebase/database'
import { db_real } from '$lib/firebase/init'

export async function getLivescoresNow(): Promise < unknown > {

  return get(child(ref(db_real), `livescores_now`))
  .then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      return;
    }
  })
}