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

app.post('/upload', function cb(req, res) {

  local.uploadCall(req, res, cb = (bufferFile, fileType) => {

    savetoMongoDB(bufferFile, fileType)

  })
});


//=================================================================
//                          MONGODB
//=================================================================

const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true })

//Models
const { Images } = require('./models_schema/images')

savetoMongoDB = (buffer, fileType) => {
  const images = new Images({ img: { data: buffer, contentType: fileType } })

  images.save((err, doc) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(doc)
  })
}
