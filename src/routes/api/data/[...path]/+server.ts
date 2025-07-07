// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // 2025-01-19                                                    │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Betarena // Endpoint // Handler                                                  │
// │ |: (Handler) Data Endpoints                                                      │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📌 NOTE                                                                          │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 1. IMPORTANT :: no logs allowed, including those custom 'debug' logs.            │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package

import dotenv from 'dotenv';

import { main as EndpointAuthorHome } from '$lib/sveltekit/endpoint/author.home.js';
import { main as EdnpointTranslation } from '$lib/sveltekit/endpoint/main.translation.js';
import { main as EndpointProfileMain } from '$lib/sveltekit/endpoint/profile.main.js';
import { API_DATA_ERROR_RESPONSE } from '$lib/utils/debug.js';

import type { RequestHandler } from '@sveltejs/kit';
import { ArticlesSearchEndpoint } from '$lib/sveltekit/endpoint/search.articles.js';
import { TagsSearchEndpoint } from '$lib/sveltekit/endpoint/search.tags.js';
import { AuthorsSearchEndpoint } from '$lib/sveltekit/endpoint/search.authors.js';
import { SuggestionsPostEndpoint, SuggestionsSearchEndpoint } from '$lib/sveltekit/endpoint/search.suggestions.js';
import { GetTranslations } from '$lib/sveltekit/endpoint/translations.js';

// #endregion ➤ 📦 Package

// ╭─────
// │ IMPORTANT |:| Loads environment secrets
// ╰─────
dotenv.config();

const getEndpointsMap = {
  'profile.main': EndpointProfileMain,
  'author.home': EndpointAuthorHome,
  'search.articles': ArticlesSearchEndpoint,
  'search.tags': TagsSearchEndpoint,
  'search.authors': AuthorsSearchEndpoint,
  "search.suggestions": SuggestionsSearchEndpoint,
  'translations': GetTranslations,
  'translation':EdnpointTranslation
}
type EndPointsMapKeys = keyof typeof getEndpointsMap;
export const GET: RequestHandler = async (
  request
): Promise < Response > =>
{
  // ╭──────────────────────────────────────────────────────────────────╮
  // │:| extract url query data.                                        │
  // ╰──────────────────────────────────────────────────────────────────╯

  const
    queryParamPath = request.params.path as EndPointsMapKeys;

  // ╭──────────────────────────────────────────────────────────────────╮
  // │:| endpoint handler data.                                         │
  // ╰──────────────────────────────────────────────────────────────────╯

  if (getEndpointsMap[queryParamPath])
    return await getEndpointsMap[queryParamPath](request) as Response;
  ;

  return API_DATA_ERROR_RESPONSE();
}

const postEndpointsMap = {
  'profile.main': EndpointProfileMain,
  "search.suggestions": SuggestionsPostEndpoint
}
type PostEndPointsMapKeys = keyof typeof postEndpointsMap;

export const POST: RequestHandler = async (
  request
): Promise < Response > =>
{
  // ╭──────────────────────────────────────────────────────────────────╮
  // │:| extract url query data.                                        │
  // ╰──────────────────────────────────────────────────────────────────╯

  const
    queryParamPath = request.params.path as
     PostEndPointsMapKeys
  ;

  // ╭──────────────────────────────────────────────────────────────────╮
  // │:| endpoint handler data.                                         │
  // ╰──────────────────────────────────────────────────────────────────╯

  if (postEndpointsMap[queryParamPath])
  {
    return await postEndpointsMap[queryParamPath](request)
  }

  return API_DATA_ERROR_RESPONSE();
}
