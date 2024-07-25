
function replacePlaceholders(str, source)
{
  return str.replace(/{(\w+)}/g, (_, key) => source[key] || "");
}
/**
 * @author
 *  @mizobov
 * @summary
 *  🟦 HELPER
 * @description
 *  - 📣 [1] Replace strings
 * @return { Object }
 * returns normalized seo data
 */
function recursiveNormalize(obj, source)
{
  if (typeof obj === 'string')
  {
    return replacePlaceholders(obj, source);
  } else if (Array.isArray(obj))
  {
    return obj.map(item => recursiveNormalize(item, source));
  } else if (obj !== null && typeof obj === 'object')
  {
    const normalizedObject = {};
    for (const key in obj)
    {
      if (Object.prototype.hasOwnProperty.call(obj, key))
      {
        normalizedObject[key] = recursiveNormalize(obj[key], source);
      }
    }
    return normalizedObject;
  }
  return obj; // Return as is for other types (e.g., numbers, booleans, null)
}

/**
 * @summary
 *  🟦 HELPER
 * @description
 *  - 📣 [1] Replace strings in SEO template with source values.
 * -!important: Be careful, the SEO template includes a canonical URL, so you should put the URL into the source.
 * @return { Object }
 * Returns normalized SEO data.
 */
export function normalizeSeo(template, source)
{
  const normalized = recursiveNormalize(template, source);
  return normalized
}