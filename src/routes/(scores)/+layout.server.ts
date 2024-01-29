import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async ({ parent }) => {
  var parentLayoutData = await parent();
  return parentLayoutData;
};
