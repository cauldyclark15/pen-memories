const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const local = require('./app');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../client')));

app.listen(3009, () => console.log('Listening at port 3009'));

app.get('/', (req, res) => {
  res.sendFile(htmlPath + '/index.html');
});

app.post('/upload', (req, res) => {
  local.uploadCall(req, res);
});
