// Init env variables
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const graphqlHTTP = require('express-graphql');
const port = process.env.PORT || 3746;
const schema = require('./schema');
const cors = require('cors');

const app = express();

// Allow CORS
app.use(cors())

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(port, () => {
  console.log('listening on port', port);
});
