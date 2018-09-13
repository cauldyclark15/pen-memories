const fs = require('fs')
const uploadDir = (__dirname + '/uploads/')

const multer = require('multer')

  var storage = multer.diskStorage({
        destination: function (req, file, cb) {            
              if (!fs.existsSync(uploadDir)){
                fs.mkdirSync(uploadDir);
                console.log('Uploads directory created')
              }
          cb(null, uploadDir)
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname)
        }
  })

  var upload = multer({
      storage: storage,  //calls multer.diskStorage
      fileFilter: function (req, file, cb) {
          let imageTest = (/^image/i).test(file.mimetype)
              if (imageTest !== true) {
                  req.Error = 'File is not an image file' 
                  return cb(null, false)
              }
            cb(null, true)
      }
}).single('inputFile')

var uploadCall = (req, res) => {
        upload (req, res, (err) => {

            if (req.Error) {
            res.send(req.Error)
            return
            }

            else if (err) {
            res.send('Error uploading file')
            return
            }

            else if (!req.file) {
            res.send('No file selected')
            return                 
            }

            else {
            res.send('File uploaded')
            }

        })
}

module.exports = {
    uploadCall: uploadCall
}