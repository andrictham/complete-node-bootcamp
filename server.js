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
      `✅ 🗄️  Database connection successful: ${con.connection.db.databaseName}`
    );
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
