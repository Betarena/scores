import { goto } from '$app/navigation';

/**
 *
 * @param url
 * @returns
 */
export async function gotoSW
(
  url: string,
  replaceState: boolean = false
)
{
  // [🐞]
  console.log(`navigated! to ${url}`);
  await goto
  (
    url,
    {
      replaceState
    }
  );
  return;
}
