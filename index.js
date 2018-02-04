// Init env variables
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const port = process.env.PORT || 3746;
const schema = require('./schema');
const cors = require('cors');

const app = express();

// Allow CORS
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//
// // parse application/json
app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.post('/contact', (req, res) => {
  const { body } = req;
  axios
    .post(process.env.ZAPIER_URI, body)
    .then(() => res.json({ success: true }))
    .catch(err => {
      console.log('error', err);
      res.json({ success: false, error: true });
    });
});

app.listen(port, () => {
  console.log('listening on port', port);
});
