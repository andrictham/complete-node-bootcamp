/* eslint-disable no-console */
const fs = require('fs');
const mongoose = require('mongoose');
const { exit } = require('process');

const dotenv = require('dotenv');

const Tour = require('../../tours/tourModel');

dotenv.config({ path: './config.env' });

// Connect to MongoDB
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

// Delete all data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('✅ 🗑️  Existing data successfully deleted');
    exit();
  } catch (error) {
    console.log(error);
    exit();
  }
};

// Import data into database
const importData = async (file) => {
  try {
    await Tour.create(file);
    console.log('✅ 📥  Data successfully imported');
    exit();
  } catch (err) {
    console.log(err);
    exit();
  }
};

const main = async () => {
  console.log(`To use this script, pass in the following flags:
  --import  or  -i [filepath]: Import data from the specified JSON file. If no filepath is provided, the default file (tours-simple.json) will be used.
  --delete  or  -d: Delete all existing data from the database
  `);
  exit();
};

// Respond to option flag passed in the command line
const option = process.argv[2];
const filePath = process.argv[3];

if (option === '--import' || option === '-i') {
  const fileToImport = filePath || `${__dirname}/tours-simple.json`;
  const data = JSON.parse(fs.readFileSync(fileToImport, 'utf-8'));
  importData(data);
} else if (option === '--delete' || option === '-d') {
  deleteData();
} else {
  main();
}
