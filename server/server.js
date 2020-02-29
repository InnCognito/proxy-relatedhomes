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

app.get('/api/:id', (req, res) => {
  const { id } = req.params;

  axios.all([
    axios.get(`${routes.morehomes.address}/${id}`),
    axios.get(`${routes.reviews.address}/${id}`),
    axios.get(`${routes.listings.address}/${id}`)
  ])
  .then(axios.spread((morehomes, reviews, listings) => {
    let responseString = '[' + JSON.stringify(morehomes.data) + ',' + JSON.stringify(reviews.data) + ',' + JSON.stringify(listings.data) + ']';
    res.status(200).send(responseString);
  }))
  .catch((err) => {
    console.log('Error occured getting subrequests', err);
    res.status(500).send('Error getting subrequests from api services');
  })
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
