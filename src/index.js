process.env.NODE_ENV = "production";
require('dotenv').config();
const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const requestHandler = require('./requestHandler');

// Request Limiting, max 5 requests per windowMs for each IP
const limiter = rateLimit({
  windowMs: 1000,
  max: 5,
});

app.use(limiter);

// CORS
app.use(cors());

// Allow preflighted request
app.options('*', cors());

app.get('/:name', (req, res) => {
  requestHandler.handleRequest(req.params.name, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
