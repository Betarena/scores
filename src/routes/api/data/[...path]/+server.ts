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

import { main as EndpointProfileMain } from '$lib/sveltekit/endpoint/profile.main.js';
import { API_DATA_ERROR_RESPONSE } from '$lib/utils/debug.js';

import type { RequestHandler } from '@sveltejs/kit';
import { ArticlesSearchEndpoint } from '$lib/sveltekit/endpoint/search.articles.js';
import { TagsSearchEndpoint } from '$lib/sveltekit/endpoint/search.tags.js';
import { AuthorsSearchEndpoint } from '$lib/sveltekit/endpoint/search.authors.js';
import { SuggestionsPostEndpoint, SuggestionsSearchEndpoint } from '$lib/sveltekit/endpoint/search.suggestions.js';

// #endregion ➤ 📦 Package

// ╭─────
// │ IMPORTANT |:| Loads environment secrets
// ╰─────
dotenv.config();

const getEndpointsMap = {
  'profile.main': EndpointProfileMain,
  'search.articles': ArticlesSearchEndpoint,
  'search.tags': TagsSearchEndpoint,
  'search.authors': AuthorsSearchEndpoint,
  "search.suggestions": SuggestionsSearchEndpoint
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
      | 'profile.main'
  ;

  // ╭──────────────────────────────────────────────────────────────────╮
  // │:| endpoint handler data.                                         │
  // ╰──────────────────────────────────────────────────────────────────╯

  if (queryParamPath == 'profile.main')
    return await EndpointProfileMain
    (
      request
    );
  ;

  if (queryParamPath == 'search.suggestions')
    return await SuggestionsPostEndpoint
    (
      request
    );
  ;


  return API_DATA_ERROR_RESPONSE();
}
