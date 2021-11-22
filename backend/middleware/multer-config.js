const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  "image/gif": "gif",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    
    // Construction d'un nom unique
    const randomInt = Math.floor(Math.random() * 10000) + 1;
    const filename = file.originalname.substring(0,file.originalname.lastIndexOf('.'));
    const extension =file.originalname.substring(file.originalname.lastIndexOf('.'));
    var fullFilename = filename + randomInt + extension;

    fullFilename = fullFilename.split(' ').join('_');

    callback(null,fullFilename);
  }
});

module.exports = multer({storage: storage}).single('image');