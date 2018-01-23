// Init env variables
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const graphqlHTTP = require('express-graphql');
const port = process.env.PORT || 3746;
const schema = require('./schema');

const app = express();

// Allow CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
