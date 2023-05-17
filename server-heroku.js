// DOC: https://github.com/sveltejs/kit/tree/master/packages/adapter-node#custom-server
// DOC: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import

import express from 'express';
import { handler } from './build/handler.js';
// import sslRedirect from 'heroku-ssl-redirect';
// DOC: https://expressjs.com/en/resources/middleware/compression.html
import compression from 'compression';
import * as sslify from 'express-sslify';
// DOC: https://www.npmjs.com/package/request-ip
// import requestIp from 'request-ip';

const app = express();

// enable ssl redirect
// => ❌ does not seem to be working
// DOC: https://www.npmjs.com/package/heroku-ssl-redirect
// app.use(sslRedirect());

// [TESTING]
// identify clients (IP - address)
/*
  app.get
  (
    '/getClientIP', 
    (
      req, 
      res
    ) => 
    {
      const ip = req?.headers['x-forwarded-for']
        || req?.socket?.remoteAddress 
        || null;
      const ip2 = req?.ip
      const ip3 = requestIp.getClientIp(req); 

      let ipAddr = req.headers["x-forwarded-for"];
      if (ipAddr) {
        const list = ipAddr.split(",");
        console.log('list', list);
        ipAddr = list[list.length-1];
      } else {
        ipAddr = req.connection.remoteAddress;
      }

      console.log('req', req);
      console.log('ip', ip);
      console.log('ip2', ip2);
      console.log('ip3', ip3);
      console.log('ipAddr', ipAddr);

      res.json({
          "ip": ip.toString().replace(/,/g, '')
        }
      );

      res.end()
    }
  )
*/

// Exclusive for HEROKU
// DOC: https://jaketrent.com/post/https-redirect-node-heroku
// DOC: https://webdva.github.io/how-to-force-express-https-tutorial
app.use
(
  (
    req, 
    res, 
    next
  ) => 
  {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`);
    else
      next();
  }
);

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

// initialize app;
// DOC: https://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-o 
app.listen
(
  process.env.PORT || 5000, () => 
  {
    console.log(`listening on port ${process.env.PORT || 5000}`);
  }
);