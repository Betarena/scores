/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
  return /(\d){3,}/.test(param);
}