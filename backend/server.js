const express = require('express');
const cors = require('cors');
const urlRoutes = require('./routes/urlRoutes');
const logger = require('./middleware/logger');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(logger);
app.use('/', urlRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});