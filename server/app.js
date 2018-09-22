const fs = require('fs');
const path = require('path');
const uuid = require('uuid').v1;

const uploadDir = path.join(__dirname, 'uploads');

const multer = require('multer');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
      console.log('Uploads directory created');
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, uuid() + '_' + file.originalname);
  },
});

var upload = multer({
  storage: storage, //calls multer.diskStorage
  fileFilter: function(req, file, cb) {
    let imageTest = /^image/i.test(file.mimetype);
    if (imageTest !== true) {
      req.Error = 'File is not an image file';
      return cb(null, false);
    }
    cb(null, true);
  },
}).single('inputFile');

var uploadCall = (req, res) => {
  upload(req, res, err => {
    if (req.Error) {
      res.send(req.Error);
      return;
    } else if (err) {
      res.json('Error uploading file');
      return;
    } else if (!req.file) {
      res.json('No file selected');
      return;
    } else {
      res.json({ status: 'ok' });
    }
  });
};

module.exports = {
  uploadCall: uploadCall,
};
