// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global
{
	namespace App
  {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}

    interface Error
    {
			message: string;
			errorId: string;
		}

    interface Locals
    {
			user: any;
      betarenaUser: any;
      uid?: string
      strLocaleOverride?: string;
		}
  }
}

export { };
