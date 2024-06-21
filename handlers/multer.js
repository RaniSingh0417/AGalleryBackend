const multer = require("multer");

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/jpg|jpeg|png|gif$i/)) {
      cb(new Error("File is not supported"), false);
      return;
    }
    cb(null, true); //to allow files of different mimetype like jpg,jpeg,png
  },
});

// configuring multer
