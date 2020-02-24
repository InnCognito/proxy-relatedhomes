// require('newrelic');
const express = require('express');
const axios = require('axios');
const PORT = 3000;

const app = express();


const dirPath = `${__dirname}/../public/dist/`;
app.use(express.static(dirPath));

const { routes } = require('../proxyconfig.json');

app.get('/api/:component/:id', (req, res) => {
  const { component, id } = req.params;
  axios.get(`${routes[component].address}/${id}`)
    .then(data => res.status(200).send(data.data))
    .catch(e => {
      console.log(e);
      res.status(500).send('Error');
    });
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
