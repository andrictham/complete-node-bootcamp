const express = require('express');
const tourController = require('./tourController');

// Instantiate a new router
const router = express.Router();

// A callback trigger that runs only when a route with :id is detected
router.param('id', tourController.checkID);

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
