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

import { API_DATA_ERROR_RESPONSE } from '$lib/utils/debug.js';

import { GetWidgetsEndpoint, WidgetsInstallEndpoint } from '$lib/sveltekit/endpoint/widgets';
import type { RequestHandler } from '@sveltejs/kit';

// #endregion ➤ 📦 Package

// ╭─────
// │ IMPORTANT |:| Loads environment secrets
// ╰─────
dotenv.config();

const getEndpointsMap = {
  "graphql": GetWidgetsEndpoint
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
  "install": WidgetsInstallEndpoint
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
