const express = require('express');
const fs = require('fs');
const tourController = require('./tourController');

// Store the name of the file into a variable
const toursFile = `${__dirname}/../dev-data/data/tours-simple.json`;
// Use a JSON file as a source for our data
const tours = JSON.parse(fs.readFileSync(toursFile));

// Instantiate a new router
const router = express.Router();

// A callback trigger that runs only when a route with :id is detected
router.param('id', (req, res, next, val) => {
  // Need to convert ID param from string to number, since our data object uses numbers as IDs
  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === id);

  // Here, we check if the ID requested is larger than what exists in our data file, assuming IDs are unique and increment sequentially
  const lastIndex = tours.length - 1;
  // if (id > lastIndex) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: `Couldn’t find any tours with the ID of ${id}. There is a total of ${tours.length} tours available. Use an ID between 0 and ${lastIndex} to access them.`,
    });
  }
  next();
});

////////////////////////////////
// ROUTES
////////////////////////////////

// Use the router
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
