const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./tours/tourRouter');
const userRouter = require('./users/userRouter');

const app = express();

////////////////////////////////
// MIDDLEWARES
////////////////////////////////

// Use Morgan for logging
app.use(morgan('dev'));

// Serve static files from the public folder
// All files will be served on the root of the server
// e.g. `__dirname/public/img/favicon.png` will be served on `example.com/img/favicon.png`.
app.use(express.static(`${__dirname}/public`));

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
