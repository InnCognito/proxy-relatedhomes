// require('newrelic');
const express = require('express');
const proxy = require('http-proxy-middleware');

const PORT = 3000;
const app = express();

const dirPath = `${__dirname}/../public/dist/`;
app.use(express.static(dirPath));

const { routes } = require('../proxyconfig.json');

// TODO: fix this redirect to static to correctly handle URL paramater
app.use('/:id', express.static(dirPath));

for (route of routes) {
  app.use(route.route,
      proxy({
          target: route.address,
            //   No longer required - proxyconfig.json modified
            //   pathRewrite: (path, req) => {
            //     return path.split('/').slice(2).join('/');
            //   }
      })
  );
}


app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
