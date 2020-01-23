var express = require('express');
var router = express.Router();
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});

var upload = multer({
  storage: storage
}).single('file');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/file', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.log(err)
      return res.end("Error uploading file.");
    }
    console.log(req.file)
    global.file  = req.file
    res.send("success");
  });
});

module.exports = router;
