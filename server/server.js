// require('newrelic');
const express = require('express');
const proxy = require('http-proxy-middleware');

const PORT = 3000;
const app = express();

const dirPath = `${__dirname}/../public/dist/`;
app.use(express.static(dirPath));

const { routes } = require('../proxyconfig.json');

for (route of routes) {
  app.use(route.route,
      proxy({
          target: route.address,
          pathRewrite: (path, req) => {
              return path.split('/').slice(2).join('/');
          }
      })
  );
}


app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
