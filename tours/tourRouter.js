const express = require('express');
const tourController = require('./tourController');

// Instantiate a new router
const router = express.Router();

////////////////////////////////
// ROUTES
////////////////////////////////

// Use the router
router
  .route('/')
  .get(tourController.getAllTours)
  // checkBody will be run before createTour
  .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
