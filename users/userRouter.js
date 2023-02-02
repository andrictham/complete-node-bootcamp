const express = require('express');
const userController = require('./userController');

// Instantiate a new router
const router = express.Router();

////////////////////////////////
// ROUTES
////////////////////////////////

// Use the router
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
