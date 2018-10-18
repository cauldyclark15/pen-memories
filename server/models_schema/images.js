const mongoose = require('mongoose')


const imageSchema = mongoose.Schema({
  img: {
    data: Buffer,
    contentType: String
  }
})

const Images = mongoose.model('Images', imageSchema)

module.exports = { Images }