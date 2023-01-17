// [ℹ] https://github.com/sveltejs/kit/tree/master/packages/adapter-node#custom-server
// [ℹ] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
import express from 'express';
import http from 'http';
import https from 'https';

import { handler } from './build/handler.js';
// import sslRedirect from 'heroku-ssl-redirect';
import compression from 'compression'; // https://expressjs.com/en/resources/middleware/compression.html
import * as requestIp from 'request-ip'; // https://www.npmjs.com/package/request-ip

import fs from 'fs';

var options = {
    key: fs.readFileSync('./certs/privkey.pem'),
    cert: fs.readFileSync('./certs/cert.pem'),
  }
;

const app = express();

/**
 *  [ℹ] add a route that lives separately from the SvelteKit app
*/
// app.get('/healthcheck', (req, res) => {
// 	res.end('ok');
// });

/**
 * [ℹ] enable ssl redirect
 * [ℹ] https://www.npmjs.com/package/heroku-ssl-redirect
 * => does not seem to be working
*/
// app.use(sslRedirect());

/**
 * [ℹ] separate from SvelteKit endpoint in attempts to
 * [ℹ] identify clients (IP - address)
*/
app.get('/getClientIP', (req, res) => {

  const ip = req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    null;
  console.log('ip', ip);

  const ip2 = req.ip
  console.log('ip2', ip2);

  const ip3 = requestIp.getClientIp(req); 
  console.log('ip3', ip3);

  let ipAddr = req.headers["x-forwarded-for"];
  if (ipAddr){
    const list = ipAddr.split(",");
    ipAddr = list[list.length-1];
  } else {
    ipAddr = req.connection.remoteAddress;
  }

  console.log('ipAddr', ipAddr);

  res.json(
    {
      "ip": ip.toString().replace(/,/g, '')
    }
  );

  res.end()
})

/**
 * [ℹ] [FORCE] https-redirect
 * [ℹ] https://jaketrent.com/post/https-redirect-node-heroku
 * [ℹ] https://webdva.github.io/how-to-force-express-https-tutorial 
*/
// app.use((req, res, next) => {
//   if (req.header('x-forwarded-proto') !== 'https')
//     res.redirect(`https://${req.header('host')}${req.url}`);
//   else
//     next();
// });

/**
 * [ℹ] https://www.npmjs.com/package/express-sslify
 * [ℹ] https://stackoverflow.com/questions/51234023/heroku-nodejs-redirect-http-to-http
*/
// app.use(sslify.HTTPS({ trustProtoHeader: true }))

// [ℹ] compress all responses
app.use(compression())

/**
 * [ℹ] let SvelteKit handle everything else, 
 * [ℹ] including serving prerendered pages and static assets
*/
app.use(handler);

/**
 * [ℹ] initialize app;
 * [ℹ] https://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-o 
*/
// app.listen(process.env.PORT, () => {
// 	console.log(`listening on port ${process.env.PORT}`);
// });

// ~~~~~~~~~~~~~~~~~~~~~~
// APP SPIN-UP [PROD] [V2]
// ~~~~~~~~~~~~~~~~~~~~~~

http.createServer(app).listen(process.env.PORT, function(){
  console.log(`[HTTP | Server]: Server is running on port: ${process.env.PORT}`);
});

https.createServer(options, app).listen(443, function(){
  console.log(`[HTTPS | Server]: Server is running on port: ${443}`);
});