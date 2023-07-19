/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
	return /^[a-zA-Z]{2}$/.test(param);
}
