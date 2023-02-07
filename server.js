const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

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
