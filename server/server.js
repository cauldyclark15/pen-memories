const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../client')));

app.listen(3009, () => console.log('Listening at port 3009'));
