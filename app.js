const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./tours/tourRouter');
const userRouter = require('./users/userRouter');

const app = express();

////////////////////////////////
// MIDDLEWARES
////////////////////////////////

app.use(morgan('dev'));

// Middleware that allows Express to read JSON data from the body of a POST request. Out of the box, Express doesn't provide that to us.
app.use(express.json());

// Our own middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

////////////////////////////////
// ROUTES
////////////////////////////////

// Mount our routers on specific paths
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

module.exports = app;
