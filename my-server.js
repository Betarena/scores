// ... ℹ https://github.com/sveltejs/kit/tree/master/packages/adapter-node#custom-server
// ... ℹ https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
import { handler } from './build/handler.js';
import express from 'express';
import sslRedirect from 'heroku-ssl-redirect';
import * as sslify from 'express-sslify';
// ... ℹ 
const app = express();

// ... ℹ add a route that lives separately from the SvelteKit app
// app.get('/healthcheck', (req, res) => {
// 	res.end('ok');
// });

// ... ℹ enable ssl redirect
// ... ℹ https://www.npmjs.com/package/heroku-ssl-redirect
// app.use(sslRedirect());

// ... ℹ https://jaketrent.com/post/https-redirect-node-heroku
// ... ℹ https://webdva.github.io/how-to-force-express-https-tutorial 
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https')
    res.redirect(`https://${req.header('host')}${req.url}`);
  else
    next();
});

// ... ℹ https://www.npmjs.com/package/express-sslify
// ... ℹ https://stackoverflow.com/questions/51234023/heroku-nodejs-redirect-http-to-http
app.use(sslify.HTTPS({ trustProtoHeader: true }))

// ... ℹ let SvelteKit handle everything else, 
// ... ℹ including serving prerendered pages and static assets
app.use(handler);

// ... ℹ initialize app;
// ... ℹ https://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-o 
app.listen(process.env.PORT || 5000, () => {
	console.log('listening on port 5000');
});