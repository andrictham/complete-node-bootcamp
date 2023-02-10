const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

////////////////////////////////
// CONNECT TO MONGODB
////////////////////////////////

const database = process.env.DATABASE_URI.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // eslint-disable-next-line no-console
    console.log(
      `🗄️  Database connection successful: ${con.connection.db.databaseName}`
    );
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Park Camper',
  rating: 3.7,
  price: 1420,
});

testTour
  .save()
  .then((doc) => {
    console.log(`✅ Tour saved: ${doc}`);
  })
  .catch((err) => {
    console.log(`❌ Error: ${err}`);
  });

////////////////////////////////
// START SERVER
////////////////////////////////

const port = process.env.PORT || 3000;
const environment = app.get('env');

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(
    `⚙️  App running · 🔌  Port ${port} · 🏘️  Environment: ${environment}`
  );
});
