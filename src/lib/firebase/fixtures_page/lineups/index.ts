import { db_real } from '$lib/firebase/init';
import { child, get, ref } from 'firebase/database';

/**
 * ==================================
 * [ℹ] LINEUPS FIREBASE METHODS 
 * ==================================
*/

export async function get_livescores_now (
): Promise < unknown > {
  return await get(child(ref(db_real), `livescores_now`))
  .then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      return;
    }
  })
}