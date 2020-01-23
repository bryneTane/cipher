var express = require('express');
var router = express.Router();

/* GET methods page. */
router.get('/', function (req, res, next) {
     if (global.datas.file == undefined) {
         res.redirect("/")
     }
    res.render('methods', { title: 'Methods' });
});


module.exports = router;
