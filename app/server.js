const express = require('express');

const PORT = process.env.PORT || 8080;
const app = express();

const incs = [];

app.use((req, res, next) => {
  console.log('%O', req);
  next();
});

app.get('/count', (req, res) => {
  res.json({ counter: incs.length });
});

app.get('/info', (req, res) => {
  res.json({ incrementedAt: incs });
});

app.post('/reset', (req, res) => {
  incs.splice(0);
  res.sendStatus(200);
});

app.post('/inc', (req, res) => {
  incs.push(new Date);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log('Server running on port %d', PORT);
});