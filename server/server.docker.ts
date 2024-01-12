// DOC: https://github.com/sveltejs/kit/tree/master/packages/adapter-node#custom-server
// DOC: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
// DOC: https://expressjs.com/en/resources/middleware/compression.html
// DOC: https://www.npmjs.com/package/request-ip

import compression from 'compression';
import express from 'express';
import * as sslify from 'express-sslify';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { handler } from '../build/handler.js';

const options =
{
  key: fs.readFileSync('./certs/privkey.pem'),
  cert: fs.readFileSync('./certs/cert.pem'),
};

const app = express();

// DOC: https://www.npmjs.com/package/express-sslify
// DOC: https://stackoverflow.com/questions/51234023/heroku-nodejs-redirect-http-to-http
app.use
(
  sslify.HTTPS
  (
  {
    trustProtoHeader: true
    }
  )
);

// compress all responses
app.use
(
  compression()
);

// let SvelteKit handle everything else,
app.use(handler);

// ~~~~~~~~~~~~~~~~~~~~~~
// APP SPIN-UP [PROD] [V2]
// ~~~~~~~~~~~~~~~~~~~~~~

http
  .createServer
  (
    app
  )
  .listen
  (
    80,
    () =>
    {
      console.log(`[HTTP | Server]: Server is running on port: ${80}`);
    }
  )
;

https
  .createServer
  (
    options,
    app
  )
  .listen
  (
    443,
    () =>
    {
      console.log(`[HTTPS | Server]: Server is running on port: ${443}`);
    }
  )
;