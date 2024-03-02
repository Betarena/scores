import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = ({ parent }) => {return parent()};
