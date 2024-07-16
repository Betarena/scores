/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param)
{
  return ["subscribers", "followers", "following"].includes(param);
}
