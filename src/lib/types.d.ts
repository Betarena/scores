/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
export interface Locals
{
	userid: string;
}

export interface ITab {
  id: string | number;
  name?: string;
  label: string;
  [key: string]: any;
}
