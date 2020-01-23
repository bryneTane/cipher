var express = require('express');
var router = express.Router();
var multer = require('multer');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
  extended: true
}));
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
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Home'
  });
});
/* GET password page. */
router.get('/password', function (req, res, next) {
  if (global.datas.algorithm == undefined) {
      res.redirect("methods")
  }
    res.render('password', {
    title: 'Password'
  });
});
/* GET download page. */
router.get('/download', function (req, res, next) {
  if (global.datas.password == undefined) {
        res.redirect("password")

  }
  res.render('download', {
    title: 'Download'
  });
});


router.post("/password", (req, res)=>{
    global.datas.password = req.body.password
    res.redirect("download")
})
router.post("/algorithm", (req, res) => {
  global.datas.algorithm = req.body.algorithm
  global.datas.method = req.body.method
  res.send("success")
})

router.get("/hashfile", (req, res) => {
  if(global.datas.file == undefined){
    res.redirect("/")
  }
  console.log(global.datas.file)
  //res.download(global.datas.file)
})

router.post('/file', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.log(err)
      return res.end("Error uploading file.");
    }
    console.log(req.file)
    global.datas.file  = req.file
    res.send("success");
  });
});

module.exports = router;
