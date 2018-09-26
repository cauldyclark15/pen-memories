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
}).array('inputFile', 10);

var uploadCall = (req, res) => {
  upload(req, res, err => {
    if (req.Error) {
      res.json({ message: req.Error });
      return;
    } else if (err) {
      res.json({ message: 'Error while uploading file' });
      return;
    } else if (!req.files) {
      res.json({ message: 'No file selected' });
      return;
    } else {
      res.json({ message: 'File Uploaded Successfully' });
    }
  });
};

module.exports = {
  uploadCall: uploadCall,
};
