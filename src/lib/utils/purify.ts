import { browser } from "$app/environment";
import createDOMPurify from 'dompurify';

let purify;

const config = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  FORBID_TAGS: ["style", "script"],
  RETURN_TRUSTED_TYPE: true,
};

export function getPurify()
{
  if (purify) return purify
  if (browser && !purify)
  {
    purify = createDOMPurify(window);
    purify.setConfig(config);
    return purify;
  }
}

export function sanitize(val: string)
{
  const purify = getPurify();
  return purify.sanitize(val, { SAFE_FOR_TEMPLATES: true })
}
