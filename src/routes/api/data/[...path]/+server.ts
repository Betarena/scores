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

// #endregion ➤ 📦 Package

// ╭─────
// │ IMPORTANT |:| Loads environment secrets
// ╰─────
dotenv.config();

export const GET: RequestHandler = async (
  request
): Promise < Response > =>
{
  // ╭──────────────────────────────────────────────────────────────────╮
  // │:| extract url query data.                                        │
  // ╰──────────────────────────────────────────────────────────────────╯

  const
    queryParamPath = request.params.path as
      | 'profile.main'
      | 'author.home'
      | 'translation'
  ;

  // ╭──────────────────────────────────────────────────────────────────╮
  // │:| endpoint handler data.                                         │
  // ╰──────────────────────────────────────────────────────────────────╯

  if (queryParamPath == 'profile.main')
    return await EndpointProfileMain
    (
      request
    );
  else if (queryParamPath == 'author.home')
    return await EndpointAuthorHome
    (
      request
    );
  else if (queryParamPath == 'translation')
    return await EdnpointTranslation
    (
      request
    );
  ;

  return API_DATA_ERROR_RESPONSE();
}

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

  return API_DATA_ERROR_RESPONSE();
}
