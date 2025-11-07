const express = require('express');
const serverless = require('serverless-http');
const apiRouter = require('../api');

const app = express();
app.use('/api', apiRouter);

module.exports.handler = serverless(app);
