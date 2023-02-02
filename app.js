const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

////////////////////////////////
// 1) MIDDLEWARES
////////////////////////////////

app.use(morgan('dev'));

// Middleware that allows Express to read JSON data from the body of a POST request. Out of the box, Express doesn't provide that to us.
app.use(express.json());

// Our own middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

// Store the name of the file into a variable
const toursFile = `${__dirname}/dev-data/data/tours-simple.json`

// Use a JSON file as a source for our data
const tours = JSON.parse(fs.readFileSync(toursFile))

////////////////////////////////
// 2) ROUTE HANDLERS
////////////////////////////////
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
}

const getTour = (req, res) => {
  // Need to convert ID param from string to number, since our data object uses numbers as IDs
  const id = parseInt(req.params.id)
  console.log(id)
  const tour = tours.find(el => el.id === id)

  // Here, we check if the ID requested is larger than what exists in our data file, assuming IDs are unique and increment sequentially
  const lastIndex = tours.length - 1;
  // if (id > lastIndex) {
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: `Couldn’t find any tours with the ID of ${id}. There is a total of ${tours.length} tours available. Use an ID between 0 and ${lastIndex} to access them.`
    })
  }

  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  })
}

const createTour = (req, res) => {
  // Take the ID of the last item in the array, and increment by 1
  const newId = tours[tours.length - 1].id + 1

  // Merge an object containing just the new ID as a property, and the request body object
  const newTour = Object.assign({ id: newId }, req.body)

  // Push the new tour into the tours object in memory
  tours.push(newTour);

  // Commit the tours object to file,
  // then when it succeeds, in the callback, send a response back to the client with the new tour that was created.
  fs.writeFile(toursFile, JSON.stringify(tours), err => {
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour
      }
    })
  })

}

const updateTour = (req, res) => {
  console.log(req.body)

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: `Couldn’t find any tours with the ID of ${req.params.id}.`
    })
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: `<Updated tour here>`
    }
  })
}

const deleteTour = (req, res) => {
  console.log(req.body)

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: `Couldn’t find any tours with the ID of ${req.params.id}.`
    })
  }

  res.status(204).json({
    status: "success",
    data: null
  })
}

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

////////////////////////////////
// 3) ROUTES
////////////////////////////////

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app
  .route('/api/v1/users')
  .get(getAllUsers)
  .post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

////////////////////////////////
// 4) START SERVER
////////////////////////////////

const port = 3000;
app.listen(port, () => {
  console.log('App running on port 3000')
})