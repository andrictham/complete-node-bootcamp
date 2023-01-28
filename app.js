const fs = require('fs');
const express = require('express');

const app = express();

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

//
// Route handlers
//
const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours
    }
  })
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

//
// Routes
//

app.route("/api/v1/tours")
  .get(getAllTours)
  .post(createTour)

app.route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)

// app.get("/api/v1/tours", getAllTours)
// app.get("/api/v1/tours/:id", getTour)
// app.post("/api/v1/tours", createTour)
// app.patch("/api/v1/tours/:id", updateTour)
// app.delete("/api/v1/tours/:id", deleteTour)


const port = 3000;
app.listen(port, () => {
  console.log('App running on port 3000')
})