import { db_real } from '$lib/firebase/init';
import { child, get, onValue, ref } from 'firebase/database';

/**
 * @summary
 * [MAIN]
 * @description
 * simple one-off GET query for the target real DB data path retrieval;
 * @param
 * {string} path
 * @returns
 * an unknown object
 */
export async function getTargetRealDbData
(
  path: string
): Promise < unknown >
{
  const connectRef = ref
  (
    db_real
  );

  const snapshot = await get
  (
		child
    (
      connectRef,
      path
    )
	);

  if (snapshot.exists()) return snapshot.val();
  return null;
}

// TEMP
export async function realDbHeartBeat
(
)
{
  const connectedRef = ref
  (
    db_real,
    ".info/connected"
  );
  onValue
  (
    connectedRef,
    (
      snap
    ) =>
    {
      if (snap.val() === true) {
        console.log("connected");
      } else {
        console.log("not connected");
      }
    }
  );
}