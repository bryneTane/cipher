var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require("fs")
var path = require("path")
var CryptoJS = require("crypto-js");
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
  extended: true
}));
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + "__" + file.originalname);
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
/* GET method page. */
router.get('/methods', function (req, res, next) {
  if (global.datas.file == undefined) {
    res.redirect("/")
  }
  res.render('methods', {
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


router.post("/passwordsave", (req, res) => {

  console.log("datas")
  global.datas.password = req.body.password
  console.log(global.datas.file.path)
  /*
  var text = fs.readFileSync(global.datas.file.path)
  let base64Image = new Buffer(text, 'binary').toString('base64');
  let imgSrcString = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;
  fs.writeFileSync(global.datas.file.path, imgSrcString);
*/
  fs.readFile(global.datas.file.path, (err, text) => {

    if (err) res.status(500).send(err);

    // console.log(new Buffer(text).toString('base64'))

    //   fs.writeFileSync(global.datas.file.path, new Buffer(text, 'base64'));

    if (global.datas.method == "encrypt") {
      switch (global.datas.algorithm) {
        case "AES":
          text = new Buffer(text).toString('base64');
          var content = CryptoJS.AES.encrypt(text, global.datas.password);
          console.log(content.toString())
          content = new Buffer(content).toString('base64');
          fs.writeFileSync(global.datas.file.path, content);
          break;
        case "DES":
          var content = CryptoJS.DES.encrypt(text, global.datas.password);
          fs.writeFileSync(global.datas.file.path, content);
          break;
        case "Triple DES":
          var content = CryptoJS.TripleDES.encrypt(text, global.datas.password);
          fs.writeFileSync(global.datas.file.path, content);

          break;
        case "Rabbit":
          var content = CryptoJS.Rabbit.encrypt(text, global.datas.password);
          fs.writeFileSync(global.datas.file.path, content);

          break;
        case "RC4":
          var content = CryptoJS.RC4.encrypt(text, global.datas.password);
          fs.writeFileSync(global.datas.file.path, content);

          break;
        case "RC4Drop":
          var content = CryptoJS.RC4Drop.encrypt(text, global.datas.password);
          fs.writeFileSync(global.datas.file.path, content);

          break;
        default:
          break;
      }
    } else {
      switch (global.datas.algorithm) {
        case "AES":
          // text = new Buffer(text).toString('base64')
          text = new Buffer(text, "base64")
          var decrypted = CryptoJS.AES.decrypt(text, global.datas.password);
          console.log("decrypted")
          console.log(decrypted)
          let content = new Buffer(decrypted.toString(CryptoJS.enc.Base64), "base64")

          fs.writeFileSync(global.datas.file.path, content);
          console.log("finish");
          break;
        case "DES":
          var decrypted = CryptoJS.DES.decrypt(text, global.datas.password);
          fs.writeFileSync(global.datas.file.path, decrypted.toString(CryptoJS.enc.Base64));

          break;
        case "Triple DES":
          var decrypted = CryptoJS.TripleDES.decrypt(text, global.datas.password);
          fs.writeFileSync(global.datas.file.path, decrypted.toString(CryptoJS.enc.Base64));

          break;
        case "Rabbit":
          var decrypted = CryptoJS.Rabbit.decrypt(text, global.datas.password);
          fs.writeFileSync(global.datas.file.path, decrypted.toString(CryptoJS.enc.Base64));

          break;
        case "RC4":
          var decrypted = CryptoJS.RC4.decrypt(text, global.datas.password);
          fs.writeFileSync(global.datas.file.path, decrypted.toString(CryptoJS.enc.Base64));

          break;
        case "RC4Drop":
          var decrypted = CryptoJS.RC4Drop.decrypt(text, global.datas.password);
          fs.writeFileSync(global.datas.file.path, decrypted.toString(CryptoJS.enc.Base64));

          break;
        default:
          break;
      }
    }
    res.send('success');
  })
})
router.post("/algorithm", (req, res) => {
  global.datas.algorithm = req.body.algorithm
  global.datas.method = req.body.method
  res.send("success")
})

router.get("/hashfile", (req, res) => {
  if (global.datas.file == undefined) {
    res.redirect("/")
  }
  // console.log(global.datas.file)
  res.download(global.datas.file.path)
})

router.post('/file', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.log(err)
      return res.end("Error uploading file.");
    }
    //console.log(req.file)
    global.datas.file = req.file
    //console.log(global.datas.file)
    res.send("success");
  });
});

module.exports = router;